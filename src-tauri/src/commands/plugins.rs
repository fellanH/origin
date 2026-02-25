use std::path::{Path, PathBuf};
use tauri::{AppHandle, Manager, Runtime};

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

    let Some(plugins_dir) = plugins_dir(&app) else {
        return Err("Failed to resolve app data directory".to_string());
    };

    let dest = plugins_dir.join(&manifest.id);

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

        let dest_dir = dest_plugins_dir.join(&src_manifest.id);

        // If the plugin is already installed, compare versions and skip if up to date.
        if dest_dir.exists() {
            let dest_manifest_path = dest_dir.join("manifest.json");
            if let Ok(dest_manifest_str) = std::fs::read_to_string(&dest_manifest_path) {
                if let Ok(dest_manifest) =
                    serde_json::from_str::<MinimalManifest>(&dest_manifest_str)
                {
                    // Simple lexicographic semver compare — acceptable for single-digit
                    // minor/patch versions (e.g. "0.1.0" < "0.2.0").
                    if dest_manifest.version >= src_manifest.version {
                        continue; // Installed version is same or newer; skip.
                    }
                }
            }
        }

        // Copy the entire plugin directory to the destination.
        std::fs::create_dir_all(&dest_dir)
            .map_err(|e| format!("Failed to create dir for {}: {e}", src_manifest.id))?;

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
