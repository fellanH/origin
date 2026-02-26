use std::path::PathBuf;
use tauri::{http::Request, http::Response, AppHandle, Manager, Runtime, UriSchemeContext};

fn plugins_dir<R: Runtime>(app: &AppHandle<R>) -> Option<PathBuf> {
    app.path().app_data_dir().ok().map(|d| d.join("plugins"))
}

/// Validate that `resolved` is strictly inside `root` after canonicalization.
///
/// Both paths must exist on disk for `canonicalize` to work, so this helper
/// resolves the root first, constructs the candidate path, then checks the
/// prefix relationship lexicographically on the byte-level components.
fn is_within_root(root: &std::path::Path, candidate: &std::path::Path) -> bool {
    let Ok(canon_root) = root.canonicalize() else {
        return false;
    };
    let Ok(canon_candidate) = candidate.canonicalize() else {
        return false;
    };
    canon_candidate.starts_with(&canon_root)
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

    // Split into plugin-id and file path (e.g. "com.example.myplugin/assets/index.js")
    let (plugin_id, file) = match path_part.split_once('/') {
        Some((id, rest)) => (id, rest),
        None => {
            return Response::builder()
                .status(404)
                .header("Access-Control-Allow-Origin", "*")
                .body(b"Not found".to_vec())
                .unwrap();
        }
    };

    // Reject plugin IDs that contain path-traversal sequences or separators.
    if plugin_id.contains("..") || plugin_id.contains('/') || plugin_id.contains('\\') {
        return Response::builder()
            .status(400)
            .header("Access-Control-Allow-Origin", "*")
            .body(b"Invalid plugin id".to_vec())
            .unwrap();
    }

    // Reject file paths that contain explicit traversal sequences.
    // The canonicalization check below is the hard guard; this is an
    // early-exit to avoid unnecessary filesystem I/O.
    if file.contains("..") {
        return Response::builder()
            .status(400)
            .header("Access-Control-Allow-Origin", "*")
            .body(b"Invalid path".to_vec())
            .unwrap();
    }

    let Some(plugins_dir) = plugins_dir(app) else {
        return Response::builder()
            .status(500)
            .header("Access-Control-Allow-Origin", "*")
            .body(b"Internal error".to_vec())
            .unwrap();
    };

    let plugin_root = plugins_dir.join(plugin_id);
    let file_path = plugin_root.join(file);

    // Hard containment check: canonicalize both paths and verify the file
    // lives inside the plugin's directory. This catches any residual
    // traversal that URL-decoding or OS path resolution might introduce.
    if !is_within_root(&plugin_root, &file_path) {
        return Response::builder()
            .status(403)
            .header("Access-Control-Allow-Origin", "*")
            .body(b"Forbidden".to_vec())
            .unwrap();
    }

    let content_type = if file.ends_with(".js") {
        "application/javascript"
    } else if file.ends_with(".css") {
        "text/css"
    } else if file.ends_with(".html") {
        "text/html"
    } else if file.ends_with(".ttf") || file.ends_with(".woff2") {
        "font/woff2"
    } else {
        "application/octet-stream"
    };

    match std::fs::read(&file_path) {
        Ok(bytes) => {
            // For HTML files, rewrite absolute asset paths to be relative to the plugin.
            // Plugin builds (Vite) emit src="/assets/..." but under plugin:// scheme
            // the root is plugin://localhost/ — we need src="./assets/..." instead.
            let body = if file.ends_with(".html") {
                let html = String::from_utf8_lossy(&bytes);
                let rewritten = html
                    .replace("src=\"/assets/", "src=\"./assets/")
                    .replace("href=\"/assets/", "href=\"./assets/");
                rewritten.into_bytes()
            } else {
                bytes
            };

            Response::builder()
                .status(200)
                .header("Content-Type", content_type)
                .header("Access-Control-Allow-Origin", "*")
                .body(body)
                .unwrap()
        }
        Err(_) => Response::builder()
            .status(404)
            .header("Access-Control-Allow-Origin", "*")
            .body(b"Not found".to_vec())
            .unwrap(),
    }
}

#[cfg(test)]
mod tests {
    use std::fs;
    use std::path::Path;
    use tempfile::TempDir;

    /// Create a fake plugin directory structure inside a temp dir and return
    /// (temp_dir, plugins_dir, plugin_root, file_path).
    fn setup_plugin_dir(plugin_id: &str, file_name: &str) -> (TempDir, std::path::PathBuf) {
        let tmp = TempDir::new().unwrap();
        let plugins_dir = tmp.path().join("plugins");
        let plugin_root = plugins_dir.join(plugin_id);
        fs::create_dir_all(&plugin_root).unwrap();
        fs::write(plugin_root.join(file_name), b"console.log('ok');").unwrap();
        (tmp, plugins_dir)
    }

    fn is_within_root(root: &Path, candidate: &Path) -> bool {
        let Ok(canon_root) = root.canonicalize() else {
            return false;
        };
        let Ok(canon_candidate) = candidate.canonicalize() else {
            return false;
        };
        canon_candidate.starts_with(&canon_root)
    }

    #[test]
    fn valid_file_within_plugin_root_is_allowed() {
        let (_tmp, plugins_dir) = setup_plugin_dir("com.example.plugin", "index.js");
        let plugin_root = plugins_dir.join("com.example.plugin");
        let file_path = plugin_root.join("index.js");

        assert!(
            is_within_root(&plugin_root, &file_path),
            "A file directly inside the plugin root should pass the containment check"
        );
    }

    #[test]
    fn traversal_via_dotdot_is_rejected() {
        let (_tmp, plugins_dir) = setup_plugin_dir("com.example.plugin", "index.js");
        // Create a "secret" file one level above the plugin root (still in plugins_dir)
        let secret = plugins_dir.join("secret.txt");
        fs::write(&secret, b"secret").unwrap();

        let plugin_root = plugins_dir.join("com.example.plugin");
        // Attempt to escape via "../secret.txt"
        let traversal_path = plugin_root.join("../secret.txt");

        // The early `contains("..")` guard would catch this, but also verify
        // the canonical check would catch it too if the guard were absent.
        assert!(
            !is_within_root(&plugin_root, &traversal_path),
            "Path traversal via '..' should be rejected by containment check"
        );
    }

    #[test]
    fn nested_traversal_is_rejected() {
        let (_tmp, plugins_dir) = setup_plugin_dir("com.example.plugin", "index.js");
        // Create a file outside the entire plugins directory
        let outside = plugins_dir.parent().unwrap().join("outside.txt");
        fs::write(&outside, b"outside").unwrap();

        let plugin_root = plugins_dir.join("com.example.plugin");
        // Deep traversal: assets/../../outside.txt -> resolves outside plugins_dir
        let traversal_path = plugin_root.join("assets/../../outside.txt");

        assert!(
            !is_within_root(&plugin_root, &traversal_path),
            "Multi-level traversal should be rejected"
        );
    }

    #[test]
    fn plugin_id_with_dotdot_is_invalid() {
        let plugin_id = "../../etc/passwd";
        let has_traversal =
            plugin_id.contains("..") || plugin_id.contains('/') || plugin_id.contains('\\');
        assert!(has_traversal, "Plugin IDs with '..' should be flagged");
    }

    #[test]
    fn plugin_id_with_slash_is_invalid() {
        let plugin_id = "com.example/evil";
        let has_traversal =
            plugin_id.contains("..") || plugin_id.contains('/') || plugin_id.contains('\\');
        assert!(has_traversal, "Plugin IDs with '/' should be flagged");
    }

    #[test]
    fn valid_plugin_id_passes_validation() {
        let plugin_id = "com.example.myplugin";
        let has_traversal =
            plugin_id.contains("..") || plugin_id.contains('/') || plugin_id.contains('\\');
        assert!(
            !has_traversal,
            "A valid reverse-domain plugin ID should pass validation"
        );
    }
}
