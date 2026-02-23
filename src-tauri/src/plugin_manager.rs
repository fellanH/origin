use std::path::PathBuf;
use tauri::{http::Request, http::Response, AppHandle, Manager, Runtime, UriSchemeContext};

#[derive(Debug, serde::Deserialize, serde::Serialize, Clone)]
pub struct PluginManifest {
    pub id: String,
    pub name: String,
    pub version: String,
    pub description: Option<String>,
    pub icon: Option<String>,
}

fn plugins_dir<R: Runtime>(app: &AppHandle<R>) -> Option<PathBuf> {
    app.path().app_data_dir().ok().map(|d| d.join("plugins"))
}

pub fn plugin_protocol_handler<R: Runtime>(
    ctx: UriSchemeContext<'_, R>,
    request: Request<Vec<u8>>,
) -> Response<Vec<u8>> {
    let app = ctx.app_handle();
    let uri = request.uri().to_string();

    // Strip "plugin://localhost/" prefix
    let path_part = match uri.strip_prefix("plugin://localhost/") {
        Some(p) => p,
        None => {
            return Response::builder()
                .status(400)
                .header("Access-Control-Allow-Origin", "*")
                .body(b"Bad request".to_vec())
                .unwrap();
        }
    };

    // Split into plugin-id and file path (e.g. "com.example.myplugin/index.js")
    let (plugin_id, file) = match path_part.splitn(2, '/').collect::<Vec<_>>().as_slice() {
        [id, file] => (*id, *file),
        _ => {
            return Response::builder()
                .status(404)
                .header("Access-Control-Allow-Origin", "*")
                .body(b"Not found".to_vec())
                .unwrap();
        }
    };

    let Some(plugins_dir) = plugins_dir(app) else {
        return Response::builder()
            .status(500)
            .header("Access-Control-Allow-Origin", "*")
            .body(b"Internal error".to_vec())
            .unwrap();
    };

    let file_path = plugins_dir.join(plugin_id).join(file);

    match std::fs::read(&file_path) {
        Ok(bytes) => {
            let content_type = if file.ends_with(".js") {
                "application/javascript"
            } else if file.ends_with(".css") {
                "text/css"
            } else {
                "application/octet-stream"
            };

            Response::builder()
                .status(200)
                .header("Content-Type", content_type)
                .header("Access-Control-Allow-Origin", "*")
                .body(bytes)
                .unwrap()
        }
        Err(_) => Response::builder()
            .status(404)
            .header("Access-Control-Allow-Origin", "*")
            .body(b"Not found".to_vec())
            .unwrap(),
    }
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
