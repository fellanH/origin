use std::path::PathBuf;
use tauri::{AppHandle, Manager, Runtime};

#[derive(Debug, serde::Deserialize, serde::Serialize, Clone)]
pub struct PluginManifest {
    pub id: String,
    pub name: String,
    pub version: String,
    pub description: Option<String>,
    pub icon: Option<String>,
}

pub(super) fn plugins_dir<R: Runtime>(app: &AppHandle<R>) -> Option<PathBuf> {
    app.path().app_data_dir().ok().map(|d| d.join("plugins"))
}

#[tauri::command]
pub fn list_installed_plugins(app: AppHandle) -> Vec<PluginManifest> {
    let Some(plugins_dir) = plugins_dir(&app) else {
        return vec![];
    };

    // Create the plugins dir if it doesn't exist yet
    if !plugins_dir.exists() {
        let _ = std::fs::create_dir_all(&plugins_dir);
    }

    let entries = match std::fs::read_dir(&plugins_dir) {
        Ok(entries) => entries,
        Err(_) => return vec![],
    };

    let mut manifests = Vec::new();
    for entry in entries.flatten() {
        let path = entry.path();
        if path.is_dir() {
            let manifest_path = path.join("manifest.json");
            if let Ok(content) = std::fs::read_to_string(&manifest_path) {
                if let Ok(manifest) = serde_json::from_str::<PluginManifest>(&content) {
                    manifests.push(manifest);
                }
            }
        }
    }

    manifests
}

#[tauri::command]
pub fn install_plugin(app: AppHandle, src_path: String) -> Result<PluginManifest, String> {
    let src = PathBuf::from(&src_path);

    // Read and parse manifest.json from the source directory
    let manifest_path = src.join("manifest.json");
    let manifest_str = std::fs::read_to_string(&manifest_path)
        .map_err(|e| format!("Failed to read manifest.json: {e}"))?;
    let manifest: PluginManifest = serde_json::from_str(&manifest_str)
        .map_err(|e| format!("Invalid manifest.json: {e}"))?;

    let Some(plugins_dir) = plugins_dir(&app) else {
        return Err("Failed to resolve app data directory".to_string());
    };

    let dest = plugins_dir.join(&manifest.id);

    // Create destination dir (ok if it already exists — overwrite = update)
    std::fs::create_dir_all(&dest)
        .map_err(|e| format!("Failed to create plugin directory: {e}"))?;

    // Copy all files from src_path/ to destination
    let entries =
        std::fs::read_dir(&src).map_err(|e| format!("Failed to read source directory: {e}"))?;

    for entry in entries.flatten() {
        let entry_path = entry.path();
        if entry_path.is_file() {
            if let Some(filename) = entry_path.file_name() {
                let dest_file = dest.join(filename);
                std::fs::copy(&entry_path, &dest_file)
                    .map_err(|e| format!("Failed to copy {filename:?}: {e}"))?;
            }
        }
    }

    Ok(manifest)
}

#[tauri::command]
pub fn restart_app(app: AppHandle) {
    app.restart();
}

#[tauri::command]
pub async fn seed_bundled_plugins(app: tauri::AppHandle) -> Result<Vec<String>, String> {
    // Resolve the resource dir — this is where Tauri bundles the plugin assets.
    let resource_plugins_dir = app
        .path()
        .resource_dir()
        .map_err(|e| format!("Failed to resolve resource dir: {e}"))?
        .join("plugins");

    // Graceful no-op in dev builds where assets aren't bundled yet.
    if !resource_plugins_dir.exists() {
        return Ok(vec![]);
    }

    let dest_plugins_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to resolve app data dir: {e}"))?
        .join("plugins");

    // Ensure the destination plugins directory exists.
    std::fs::create_dir_all(&dest_plugins_dir)
        .map_err(|e| format!("Failed to create plugins dir: {e}"))?;

    let entries = std::fs::read_dir(&resource_plugins_dir)
        .map_err(|e| format!("Failed to read resource plugins dir: {e}"))?;

    let mut seeded: Vec<String> = Vec::new();

    for entry in entries.flatten() {
        let src_dir = entry.path();
        if !src_dir.is_dir() {
            continue;
        }

        // Read and parse manifest.json from the bundled plugin directory.
        let src_manifest_path = src_dir.join("manifest.json");
        let src_manifest_str = match std::fs::read_to_string(&src_manifest_path) {
            Ok(s) => s,
            Err(_) => continue, // Skip dirs without a manifest.json
        };

        #[derive(serde::Deserialize)]
        struct MinimalManifest {
            id: String,
            version: String,
        }

        let src_manifest: MinimalManifest = match serde_json::from_str(&src_manifest_str) {
            Ok(m) => m,
            Err(_) => continue, // Skip dirs with invalid manifest.json
        };

        let dest_dir = dest_plugins_dir.join(&src_manifest.id);

        // If the plugin is already installed, compare versions and skip if up to date.
        if dest_dir.exists() {
            let dest_manifest_path = dest_dir.join("manifest.json");
            if let Ok(dest_manifest_str) = std::fs::read_to_string(&dest_manifest_path) {
                if let Ok(dest_manifest) =
                    serde_json::from_str::<MinimalManifest>(&dest_manifest_str)
                {
                    // Use semver comparison so that multi-digit components compare
                    // correctly (e.g. "0.10.0" > "0.9.0").  If either version string
                    // is invalid we cannot be sure the installed copy is current, so
                    // we fall through and re-seed rather than silently doing nothing.
                    match (
                        semver::Version::parse(&dest_manifest.version),
                        semver::Version::parse(&src_manifest.version),
                    ) {
                        (Ok(installed), Ok(bundled)) => {
                            if installed >= bundled {
                                continue; // Installed version is same or newer; skip.
                            }
                        }
                        _ => {
                            // One or both version strings is not valid semver.
                            // Log a warning and fall through to re-seed.
                            eprintln!(
                                "[seed_bundled_plugins] WARNING: unparseable version for \
                                 plugin '{}' (installed={:?}, bundled={:?}); re-seeding.",
                                src_manifest.id,
                                dest_manifest.version,
                                src_manifest.version,
                            );
                        }
                    }
                }
            }
        }

        // Copy the entire plugin directory to the destination.
        std::fs::create_dir_all(&dest_dir)
            .map_err(|e| format!("Failed to create dir for {}: {e}", src_manifest.id))?;

        let plugin_entries = std::fs::read_dir(&src_dir)
            .map_err(|e| format!("Failed to read bundled plugin dir {}: {e}", src_manifest.id))?;

        for plugin_entry in plugin_entries.flatten() {
            let entry_path = plugin_entry.path();
            if entry_path.is_file() {
                if let Some(filename) = entry_path.file_name() {
                    let dest_file = dest_dir.join(filename);
                    std::fs::copy(&entry_path, &dest_file).map_err(|e| {
                        format!("Failed to copy {:?} for {}: {e}", filename, src_manifest.id)
                    })?;
                }
            }
        }

        seeded.push(src_manifest.id);
    }

    Ok(seeded)
}

#[tauri::command]
pub fn save_plugin_bundle(
    app: AppHandle,
    id: String,
    manifest_json: String,
    js_source: String,
) -> Result<(), String> {
    let Some(plugins_dir) = plugins_dir(&app) else {
        return Err("Failed to resolve app data directory".to_string());
    };

    let dest = plugins_dir.join(&id);
    std::fs::create_dir_all(&dest)
        .map_err(|e| format!("Failed to create plugin directory: {e}"))?;

    std::fs::write(dest.join("manifest.json"), &manifest_json)
        .map_err(|e| format!("Failed to write manifest.json: {e}"))?;

    std::fs::write(dest.join("index.js"), &js_source)
        .map_err(|e| format!("Failed to write index.js: {e}"))?;

    Ok(())
}

// ---------------------------------------------------------------------------
// Unit tests for semver comparison logic used in seed_bundled_plugins
// ---------------------------------------------------------------------------
#[cfg(test)]
mod tests {
    /// Helper that mirrors the comparison logic in `seed_bundled_plugins`:
    /// returns `true` when the installed version is considered current (i.e.
    /// we should *skip* re-seeding), `false` when we should seed, and `None`
    /// when either string is invalid semver.
    fn should_skip(installed: &str, bundled: &str) -> Option<bool> {
        match (
            semver::Version::parse(installed),
            semver::Version::parse(bundled),
        ) {
            (Ok(inst), Ok(bund)) => Some(inst >= bund),
            _ => None,
        }
    }

    // --- basic ordering ---

    #[test]
    fn same_version_skips() {
        assert_eq!(should_skip("1.0.0", "1.0.0"), Some(true));
    }

    #[test]
    fn older_installed_seeds() {
        assert_eq!(should_skip("0.1.0", "0.2.0"), Some(false));
    }

    #[test]
    fn newer_installed_skips() {
        assert_eq!(should_skip("0.3.0", "0.2.0"), Some(true));
    }

    // --- multi-digit components (the bug this fix addresses) ---

    #[test]
    fn multi_digit_minor_bundled_newer_seeds() {
        // "0.10.0" > "0.9.0" semantically; lexicographic order gives the wrong answer.
        assert_eq!(should_skip("0.9.0", "0.10.0"), Some(false));
    }

    #[test]
    fn multi_digit_minor_installed_newer_skips() {
        assert_eq!(should_skip("0.10.0", "0.9.0"), Some(true));
    }

    #[test]
    fn multi_digit_patch_bundled_newer_seeds() {
        assert_eq!(should_skip("1.0.9", "1.0.10"), Some(false));
    }

    #[test]
    fn multi_digit_patch_installed_newer_skips() {
        assert_eq!(should_skip("1.0.10", "1.0.9"), Some(true));
    }

    #[test]
    fn multi_digit_major_bundled_newer_seeds() {
        assert_eq!(should_skip("9.0.0", "10.0.0"), Some(false));
    }

    // --- invalid version strings fall back to re-seed (None) ---

    #[test]
    fn invalid_installed_version_returns_none() {
        assert_eq!(should_skip("not-semver", "1.0.0"), None);
    }

    #[test]
    fn invalid_bundled_version_returns_none() {
        assert_eq!(should_skip("1.0.0", "bad"), None);
    }

    #[test]
    fn both_invalid_returns_none() {
        assert_eq!(should_skip("???", "!!!"), None);
    }
}
