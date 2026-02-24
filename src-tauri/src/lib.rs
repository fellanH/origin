mod plugin_manager;
mod pty;

use tauri::{menu::{MenuBuilder, MenuItemBuilder}, Emitter, Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(
            tauri_plugin_zustand::Builder::new()
                .autosave(std::time::Duration::from_secs(300))
                .build(),
        )
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .manage(pty::PtyStore::default())
        .register_uri_scheme_protocol("plugin", plugin_manager::plugin_protocol_handler)
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
            plugin_manager::list_installed_plugins,
            plugin_manager::install_plugin,
            plugin_manager::restart_app,
            pty::pty_create,
            pty::pty_write,
            pty::pty_resize,
            pty::pty_destroy,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
