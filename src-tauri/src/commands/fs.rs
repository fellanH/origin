use std::path::PathBuf;
use tauri::{AppHandle, Manager, Runtime};

/// Resolve the path to the workspace store JSON file inside app data dir.
fn store_path<R: Runtime>(app: &AppHandle<R>) -> Result<PathBuf, String> {
    app.path()
        .app_data_dir()
        .map(|d| d.join("workspace-store.json"))
        .map_err(|e| format!("Failed to resolve app data dir: {e}"))
}

/// Copy `workspace-store.json` → `workspace-store.bak.json`.
///
/// Called from the JS bootstrap after `tauriHandler.start()` succeeds so that
/// a known-good file is always preserved before the next write cycle.
#[tauri::command]
pub fn backup_workspace_store(app: AppHandle) -> Result<(), String> {
    let src = store_path(&app)?;
    if !src.exists() {
        // Nothing to back up yet — first launch.
        return Ok(());
    }

    let bak = src.with_extension("bak.json");
    std::fs::copy(&src, &bak).map_err(|e| format!("backup_workspace_store failed: {e}"))?;
    Ok(())
}

/// Validate `workspace-store.json`. If it is missing or contains invalid JSON,
/// attempt to restore from `workspace-store.bak.json`.
///
/// Returns `"ok"`, `"recovered"`, or `"no-backup"` so the caller can log which
/// path was taken.
#[tauri::command]
pub fn recover_workspace_store(app: AppHandle) -> Result<String, String> {
    let src = store_path(&app)?;
    let bak = src.with_extension("bak.json");

    let needs_recovery = if src.exists() {
        // Consider the file corrupt if it cannot be read or is not valid JSON.
        match std::fs::read_to_string(&src) {
            Ok(content) => serde_json::from_str::<serde_json::Value>(&content).is_err(),
            Err(_) => true,
        }
    } else {
        // File does not exist — first launch. Nothing to recover.
        return Ok("ok".to_string());
    };

    if !needs_recovery {
        return Ok("ok".to_string());
    }

    if bak.exists() {
        std::fs::copy(&bak, &src)
            .map_err(|e| format!("recover_workspace_store: copy bak failed: {e}"))?;
        Ok("recovered".to_string())
    } else {
        Ok("no-backup".to_string())
    }
}
