use std::path::{Path, PathBuf};
use tauri::{AppHandle, Manager, Runtime};

/// Validate a plugin ID against a strict allowlist of characters.
///
/// Allowed characters: ASCII alphanumerics, dots, hyphens, underscores.
/// The ID must not be empty and must not contain path separators or traversal
/// sequences (`..`, `/`, `\`).
///
/// Examples of valid IDs:  `com.example.myplugin`, `org.foo-bar.baz_2`
/// Examples of invalid IDs: `../evil`, `com/evil`, `com\evil`, ``, `..`
fn validate_plugin_id(id: &str) -> Result<(), String> {
    if id.is_empty() {
        return Err("Plugin ID must not be empty".to_string());
    }
    // Block traversal and path separator characters explicitly.
    if id.contains("..") || id.contains('/') || id.contains('\\') {
        return Err(format!("Plugin ID contains invalid characters: {id}"));
    }
    // Allow only: a-z A-Z 0-9 . - _
    if !id
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || c == '.' || c == '-' || c == '_')
    {
        return Err(format!(
            "Plugin ID '{id}' contains characters outside [a-zA-Z0-9._-]"
        ));
    }
    Ok(())
}

/// Verify that `dest` is strictly inside `root` after canonicalization.
///
/// `root` must already exist. `dest` is created (as an empty dir) if it does
/// not yet exist so that `canonicalize` can resolve it; the caller is
/// responsible for populating it afterward.
fn assert_dest_within_root(root: &Path, dest: &Path) -> Result<(), String> {
    let canon_root = root
        .canonicalize()
        .map_err(|e| format!("Failed to canonicalize plugins dir: {e}"))?;

    // Ensure `dest` exists so canonicalize works on it.
    std::fs::create_dir_all(dest)
        .map_err(|e| format!("Failed to create destination directory: {e}"))?;

    let canon_dest = dest
        .canonicalize()
        .map_err(|e| format!("Failed to canonicalize destination path: {e}"))?;

    if !canon_dest.starts_with(&canon_root) {
        return Err(format!(
            "Destination path escapes the plugins directory: {}",
            dest.display()
        ));
    }
    Ok(())
}

/// Recursively copy a directory and all its contents.
fn copy_dir_recursive(src: &Path, dest: &Path) -> std::io::Result<()> {
    std::fs::create_dir_all(dest)?;
    for entry in std::fs::read_dir(src)?.flatten() {
        let entry_path = entry.path();
        let Some(name) = entry_path.file_name() else {
            continue;
        };
        let dest_path = dest.join(name);
        if entry_path.is_dir() {
            copy_dir_recursive(&entry_path, &dest_path)?;
        } else {
            std::fs::copy(&entry_path, &dest_path)?;
        }
    }
    Ok(())
}

#[derive(Debug, serde::Deserialize, serde::Serialize, Clone)]
pub struct PluginManifest {
    pub id: String,
    pub name: String,
    pub version: String,
    pub description: Option<String>,
    pub icon: Option<String>,
    /// Capability strings the plugin requires (e.g. `["fs:read", "pty"]`).
    /// Maps to `requiredCapabilities` in manifest.json and the TS `PluginManifest` type.
    /// `None` / absent means no special capabilities are needed.
    #[serde(rename = "requiredCapabilities", skip_serializing_if = "Option::is_none")]
    pub required_capabilities: Option<Vec<String>>,
}

#[cfg(test)]
mod tests {
    use super::PluginManifest;

    /// A manifest without `requiredCapabilities` should deserialize successfully
    /// and leave `required_capabilities` as `None`.
    #[test]
    fn deserializes_manifest_without_required_capabilities() {
        let json = r#"{
            "id": "com.example.plugin",
            "name": "Example Plugin",
            "version": "1.0.0"
        }"#;

        let manifest: PluginManifest = serde_json::from_str(json).unwrap();
        assert_eq!(manifest.id, "com.example.plugin");
        assert_eq!(manifest.name, "Example Plugin");
        assert_eq!(manifest.version, "1.0.0");
        assert!(manifest.required_capabilities.is_none());
    }

    /// A manifest with `requiredCapabilities` must round-trip the array intact.
    #[test]
    fn deserializes_manifest_with_required_capabilities() {
        let json = r#"{
            "id": "com.example.terminal",
            "name": "Terminal",
            "version": "0.3.1",
            "requiredCapabilities": ["pty", "fs:read"]
        }"#;

        let manifest: PluginManifest = serde_json::from_str(json).unwrap();
        let caps = manifest.required_capabilities.expect("should have capabilities");
        assert_eq!(caps, vec!["pty", "fs:read"]);
    }

    /// Serializing a manifest with capabilities must produce `requiredCapabilities`
    /// (camelCase) in the JSON output so the frontend TS type is satisfied.
    #[test]
    fn serializes_required_capabilities_as_camel_case() {
        let manifest = PluginManifest {
            id: "com.example.terminal".to_string(),
            name: "Terminal".to_string(),
            version: "0.3.1".to_string(),
            description: None,
            icon: None,
            required_capabilities: Some(vec!["pty".to_string(), "fs:read".to_string()]),
        };

        let json = serde_json::to_string(&manifest).unwrap();
        // Field must appear under the camelCase key the TypeScript side expects
        assert!(json.contains("\"requiredCapabilities\""), "expected camelCase key in JSON: {json}");
        // snake_case must NOT leak into the output
        assert!(!json.contains("\"required_capabilities\""), "snake_case key must not appear: {json}");
        // Values must be present
        assert!(json.contains("\"pty\""), "expected pty capability: {json}");
        assert!(json.contains("\"fs:read\""), "expected fs:read capability: {json}");
    }

    /// When `required_capabilities` is `None` the key must be omitted entirely
    /// (skip_serializing_if) — avoids sending a JSON null to the frontend.
    #[test]
    fn omits_required_capabilities_key_when_none() {
        let manifest = PluginManifest {
            id: "com.example.notepad".to_string(),
            name: "Notepad".to_string(),
            version: "1.0.0".to_string(),
            description: None,
            icon: None,
            required_capabilities: None,
        };

        let json = serde_json::to_string(&manifest).unwrap();
        assert!(!json.contains("requiredCapabilities"), "key must be absent when None: {json}");
    }

    // ------------------------------------------------------------------
    // validate_plugin_id — security tests
    // ------------------------------------------------------------------

    #[test]
    fn valid_reverse_domain_ids_pass() {
        let valid_ids = [
            "com.example.myplugin",
            "org.foo-bar.baz",
            "io.origin.notepad",
            "com.example.plugin_v2",
            "a",
            "com.UPPER.case",
        ];
        for id in &valid_ids {
            assert!(
                super::validate_plugin_id(id).is_ok(),
                "Expected '{id}' to be valid"
            );
        }
    }

    #[test]
    fn empty_id_is_rejected() {
        assert!(
            super::validate_plugin_id("").is_err(),
            "Empty ID should be invalid"
        );
    }

    #[test]
    fn dotdot_traversal_in_id_is_rejected() {
        let traversal_ids = ["../evil", "com/../evil", "..", "a/../b"];
        for id in &traversal_ids {
            assert!(
                super::validate_plugin_id(id).is_err(),
                "Expected '{id}' to be rejected"
            );
        }
    }

    #[test]
    fn slash_in_id_is_rejected() {
        assert!(
            super::validate_plugin_id("com/evil").is_err(),
            "ID with '/' should be rejected"
        );
    }

    #[test]
    fn backslash_in_id_is_rejected() {
        assert!(
            super::validate_plugin_id("com\\evil").is_err(),
            "ID with '\\\\' should be rejected"
        );
    }

    #[test]
    fn special_characters_in_id_are_rejected() {
        let bad_ids = ["com.example;drop", "com.example$evil"];
        for id in &bad_ids {
            assert!(
                super::validate_plugin_id(id).is_err(),
                "Expected '{id}' to be rejected"
            );
        }
    }

    // ------------------------------------------------------------------
    // assert_dest_within_root — security tests
    // ------------------------------------------------------------------

    #[test]
    fn valid_dest_inside_root_passes() {
        let tmp = tempfile::TempDir::new().unwrap();
        let root = tmp.path().join("plugins");
        std::fs::create_dir_all(&root).unwrap();
        let dest = root.join("com.example.plugin");

        let result = super::assert_dest_within_root(&root, &dest);
        assert!(result.is_ok(), "A valid destination should pass: {result:?}");
    }

    #[test]
    fn dest_outside_root_is_rejected() {
        let tmp = tempfile::TempDir::new().unwrap();
        let root = tmp.path().join("plugins");
        std::fs::create_dir_all(&root).unwrap();
        // Create a sibling directory that is outside the plugins root
        let outside = tmp.path().join("outside");
        std::fs::create_dir_all(&outside).unwrap();

        let result = super::assert_dest_within_root(&root, &outside);
        assert!(result.is_err(), "A path outside the root should be rejected");
    }

    #[test]
    fn traversal_dest_is_rejected() {
        let tmp = tempfile::TempDir::new().unwrap();
        let root = tmp.path().join("plugins");
        std::fs::create_dir_all(&root).unwrap();
        // Construct a traversal path: plugins/../outside_dir
        let traversal = root.join("../outside_dir");
        std::fs::create_dir_all(&traversal).unwrap();

        let result = super::assert_dest_within_root(&root, &traversal);
        assert!(
            result.is_err(),
            "A traversal path that escapes the root should be rejected"
        );
    }
}

pub(super) fn plugins_dir<R: Runtime>(app: &AppHandle<R>) -> Option<PathBuf> {
    app.path().app_data_dir().ok().map(|d| d.join("plugins"))
}

/// Returns the directory containing bundled plugin assets.
/// In production: resource_dir/plugins (Tauri bundles src-tauri/assets/).
/// In dev: falls back to src-tauri/assets/plugins/ relative to the manifest dir.
fn bundled_plugins_dir<R: Runtime>(app: &AppHandle<R>) -> Option<PathBuf> {
    // Try resource dir first (production builds).
    // Verify it contains at least one plugin subdir (dir with manifest.json)
    // to avoid false positives from Vite build output in target/debug/plugins/.
    if let Ok(d) = app.path().resource_dir() {
        let resource_path = d.join("plugins");
        if has_plugin_subdirs(&resource_path) {
            return Some(resource_path);
        }
    }
    // Dev fallback: CARGO_MANIFEST_DIR is set at compile time
    let dev_path = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("assets/plugins");
    if has_plugin_subdirs(&dev_path) {
        return Some(dev_path);
    }
    None
}

/// Returns true if the directory contains at least one subdirectory with a manifest.json.
fn has_plugin_subdirs(dir: &std::path::Path) -> bool {
    let Ok(entries) = std::fs::read_dir(dir) else {
        return false;
    };
    entries.flatten().any(|e| e.path().join("manifest.json").is_file())
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
pub fn list_bundled_plugins(app: AppHandle) -> Vec<PluginManifest> {
    let Some(dir) = bundled_plugins_dir(&app) else {
        return vec![];
    };

    let entries = match std::fs::read_dir(&dir) {
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

    // Validate the plugin ID before constructing any paths from it.
    validate_plugin_id(&manifest.id)?;

    let Some(plugins_dir) = plugins_dir(&app) else {
        return Err("Failed to resolve app data directory".to_string());
    };

    // Ensure the plugins directory exists before canonicalization.
    std::fs::create_dir_all(&plugins_dir)
        .map_err(|e| format!("Failed to create plugins directory: {e}"))?;

    let dest = plugins_dir.join(&manifest.id);

    // Hard containment check: confirm the resolved destination is inside the
    // plugins directory even after the OS resolves the full path.
    assert_dest_within_root(&plugins_dir, &dest)?;

    // Recursively copy the plugin directory (including assets/ subdirs)
    copy_dir_recursive(&src, &dest)
        .map_err(|e| format!("Failed to copy plugin directory: {e}"))?;

    Ok(manifest)
}

#[tauri::command]
pub fn restart_app(app: AppHandle) {
    app.restart();
}

#[tauri::command]
pub async fn seed_bundled_plugins(app: tauri::AppHandle) -> Result<Vec<String>, String> {
    let Some(resource_plugins_dir) = bundled_plugins_dir(&app) else {
        return Ok(vec![]);
    };

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

        // Validate the plugin ID before using it to construct paths.
        if validate_plugin_id(&src_manifest.id).is_err() {
            continue; // Skip plugins with invalid IDs
        }

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

        // Containment check before writing.
        if let Err(e) = assert_dest_within_root(&dest_plugins_dir, &dest_dir) {
            // This should never happen for valid IDs, but be defensive.
            eprintln!("Skipping plugin {}: {e}", src_manifest.id);
            continue;
        }

        // Copy the entire plugin directory to the destination.
        copy_dir_recursive(&src_dir, &dest_dir)
            .map_err(|e| format!("Failed to copy plugin {}: {e}", src_manifest.id))?;

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
    // Validate the plugin ID before constructing any filesystem paths.
    validate_plugin_id(&id)?;

    let Some(plugins_dir) = plugins_dir(&app) else {
        return Err("Failed to resolve app data directory".to_string());
    };

    // Ensure the plugins directory exists before canonicalization.
    std::fs::create_dir_all(&plugins_dir)
        .map_err(|e| format!("Failed to create plugins directory: {e}"))?;

    let dest = plugins_dir.join(&id);

    // Hard containment check: confirm the resolved destination is inside the
    // plugins directory even after the OS resolves the full path.
    assert_dest_within_root(&plugins_dir, &dest)?;

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
