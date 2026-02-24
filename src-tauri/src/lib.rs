mod commands;
mod protocol;
mod pty;

use tauri::{menu::{MenuBuilder, MenuItemBuilder}, Emitter, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let _ = fix_path_env::fix();

    tauri::Builder::default()
        .manage(pty::PtyManager::new())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(
            tauri_plugin_zustand::Builder::new()
                .autosave(std::time::Duration::from_secs(300))
                .build(),
        )
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .register_uri_scheme_protocol("plugin", protocol::plugin::plugin_protocol_handler)
        .setup(|app| {
            let close_tab = MenuItemBuilder::with_id("close-workspace", "Close Tab")
                .accelerator("CmdOrCtrl+Shift+W")
                .build(app)?;
            let menu = MenuBuilder::new(app).items(&[&close_tab]).build()?;
            app.set_menu(menu)?;
            Ok(())
        })
        .on_menu_event(|app, event| {
            if event.id() == "close-workspace" {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.emit("close-workspace", &());
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::fs::backup_workspace_store,
            commands::fs::recover_workspace_store,
            commands::plugins::list_installed_plugins,
            commands::plugins::install_plugin,
            commands::plugins::restart_app,
            commands::plugins::save_plugin_bundle,
            pty::pty_spawn,
            pty::pty_write,
            pty::pty_resize,
            pty::pty_destroy,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
