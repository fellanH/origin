use portable_pty::{native_pty_system, CommandBuilder, PtySize};
use std::collections::HashMap;
use std::io::{Read, Write};
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, State};

/// Holds the master handle (for resize) and the pre-taken write end (for input).
/// Keeping both is necessary because `take_writer()` can only be called once.
pub struct PtySession {
    master: Box<dyn portable_pty::MasterPty + Send>,
    writer: Box<dyn Write + Send>,
}

pub type PtyStore = Mutex<HashMap<String, PtySession>>;

#[tauri::command]
pub async fn pty_create(
    id: String,
    cols: u16,
    rows: u16,
    app: AppHandle,
    store: State<'_, PtyStore>,
) -> Result<(), String> {
    let pty_system = native_pty_system();
    let pair = pty_system
        .openpty(PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|e| e.to_string())?;

    let shell = std::env::var("SHELL").unwrap_or_else(|_| "/bin/zsh".to_string());
    let mut cmd = CommandBuilder::new(&shell);
    cmd.env("TERM", "xterm-256color");

    // spawn_command consumes the slave; child keeps the slave fd alive
    let _child = pair.slave.spawn_command(cmd).map_err(|e| e.to_string())?;
    let master = pair.master;

    // Take writer and clone reader before moving master into the store
    let writer = master.take_writer().map_err(|e| e.to_string())?;
    let mut reader = master.try_clone_reader().map_err(|e| e.to_string())?;

    // Stream PTY output to the frontend as Tauri events
    let app_clone = app.clone();
    let id_clone = id.clone();
    std::thread::spawn(move || {
        let mut buf = [0u8; 1024];
        loop {
            match reader.read(&mut buf) {
                Ok(0) | Err(_) => break,
                Ok(n) => {
                    let data = String::from_utf8_lossy(&buf[..n]).to_string();
                    let _ = app_clone.emit(&format!("pty-data-{}", id_clone), data);
                }
            }
        }
        let _ = app_clone.emit(&format!("pty-exit-{}", id_clone), ());
    });

    store
        .lock()
        .unwrap()
        .insert(id, PtySession { master, writer });
    Ok(())
}

#[tauri::command]
pub async fn pty_write(
    id: String,
    data: String,
    store: State<'_, PtyStore>,
) -> Result<(), String> {
    let mut store = store.lock().unwrap();
    if let Some(session) = store.get_mut(&id) {
        session
            .writer
            .write_all(data.as_bytes())
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn pty_resize(
    id: String,
    cols: u16,
    rows: u16,
    store: State<'_, PtyStore>,
) -> Result<(), String> {
    let store = store.lock().unwrap();
    if let Some(session) = store.get(&id) {
        session
            .master
            .resize(PtySize {
                rows,
                cols,
                pixel_width: 0,
                pixel_height: 0,
            })
            .map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn pty_destroy(
    id: String,
    store: State<'_, PtyStore>,
) -> Result<(), String> {
    store.lock().unwrap().remove(&id);
    Ok(())
}
