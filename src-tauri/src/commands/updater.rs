use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use tauri::{AppHandle, Manager, Runtime};

/// Metadata for a rollback backup stored in app data dir.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RollbackMeta {
    pub version: String,
    pub backed_up_at: String,
}

fn rollback_dir<R: Runtime>(app: &AppHandle<R>) -> Result<PathBuf, String> {
    app.path()
        .app_data_dir()
        .map(|d| d.join("rollback"))
        .map_err(|e| format!("Failed to resolve app data dir: {e}"))
}

#[tauri::command]
pub fn create_rollback_snapshot(app: AppHandle) -> Result<(), String> {
    let dir = rollback_dir(&app)?;
    std::fs::create_dir_all(&dir)
        .map_err(|e| format!("Failed to create rollback dir: {e}"))?;

    let version = app
        .config()
        .version
        .clone()
        .unwrap_or_else(|| "unknown".to_string());

    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();

    let meta = RollbackMeta {
        version,
        backed_up_at: format!("{now}"),
    };

    let meta_path = dir.join("meta.json");
    let json = serde_json::to_string_pretty(&meta)
        .map_err(|e| format!("Failed to serialize rollback meta: {e}"))?;
    std::fs::write(&meta_path, json)
        .map_err(|e| format!("Failed to write rollback meta: {e}"))?;

    let store_path = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to resolve app data dir: {e}"))?
        .join("workspace-store.json");

    if store_path.exists() {
        let backup_store_path = dir.join("workspace-store.rollback.json");
        std::fs::copy(&store_path, &backup_store_path)
            .map_err(|e| format!("Failed to backup workspace store for rollback: {e}"))?;
    }

    Ok(())
}

#[tauri::command]
pub fn get_rollback_info(app: AppHandle) -> Result<Option<RollbackMeta>, String> {
    let dir = rollback_dir(&app)?;
    let meta_path = dir.join("meta.json");

    if !meta_path.exists() {
        return Ok(None);
    }

    let content = std::fs::read_to_string(&meta_path)
        .map_err(|e| format!("Failed to read rollback meta: {e}"))?;
    let meta: RollbackMeta = serde_json::from_str(&content)
        .map_err(|e| format!("Failed to parse rollback meta: {e}"))?;

    Ok(Some(meta))
}

#[tauri::command]
pub fn apply_rollback(app: AppHandle) -> Result<String, String> {
    let dir = rollback_dir(&app)?;
    let meta_path = dir.join("meta.json");

    if !meta_path.exists() {
        return Err("No rollback snapshot available".to_string());
    }

    let meta_content = std::fs::read_to_string(&meta_path)
        .map_err(|e| format!("Failed to read rollback meta: {e}"))?;
    let meta: RollbackMeta = serde_json::from_str(&meta_content)
        .map_err(|e| format!("Failed to parse rollback meta: {e}"))?;

    let backup_store = dir.join("workspace-store.rollback.json");
    if backup_store.exists() {
        let store_path = app
            .path()
            .app_data_dir()
            .map_err(|e| format!("Failed to resolve app data dir: {e}"))?
            .join("workspace-store.json");

        std::fs::copy(&backup_store, &store_path)
            .map_err(|e| format!("Failed to restore workspace store: {e}"))?;
    }

    let _ = std::fs::remove_dir_all(&dir);

    Ok(meta.version)
}

#[tauri::command]
pub fn clear_rollback(app: AppHandle) -> Result<(), String> {
    let dir = rollback_dir(&app)?;
    if dir.exists() {
        std::fs::remove_dir_all(&dir)
            .map_err(|e| format!("Failed to clear rollback dir: {e}"))?;
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rollback_meta_serializes_correctly() {
        let meta = RollbackMeta {
            version: "0.2.0".to_string(),
            backed_up_at: "1709337600".to_string(),
        };
        let json = serde_json::to_string(&meta).unwrap();
        assert!(json.contains("\"version\""));
        assert!(json.contains("\"backedUpAt\""));
        assert!(!json.contains("\"backed_up_at\""));
    }

    #[test]
    fn rollback_meta_deserializes_from_camel_case() {
        let json = r#"{"version":"0.2.0","backedUpAt":"1709337600"}"#;
        let meta: RollbackMeta = serde_json::from_str(json).unwrap();
        assert_eq!(meta.version, "0.2.0");
        assert_eq!(meta.backed_up_at, "1709337600");
    }
}
