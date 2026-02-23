use tauri::menu::{MenuBuilder, MenuItemBuilder};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(
            tauri_plugin_zustand::Builder::new()
                .autosave(std::time::Duration::from_secs(300))
                .build(),
        )
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
                    let _ = window.emit("close-workspace", ());
                }
            }
        })
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
