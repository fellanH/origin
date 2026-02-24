use std::path::PathBuf;
use tauri::{http::Request, http::Response, AppHandle, Manager, Runtime, UriSchemeContext};

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
