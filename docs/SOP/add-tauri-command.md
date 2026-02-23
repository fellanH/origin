# SOP: Add a Tauri Command

Use when adding a new Rust-backed IPC command.

---

## Steps

### 1. Define the command in Rust

`src-tauri/src/lib.rs` (or a dedicated `src-tauri/src/commands/my_command.rs` file):

```rust
use crate::error::AppError;

#[tauri::command]
async fn my_command(arg: String) -> Result<String, AppError> {
    Ok(format!("result: {arg}"))
}
```

Rules:

- Return `Result<T, AppError>` — never panic, never `unwrap()`
- Async commands must use **owned types** — no `&str`, no borrowed refs (compile error otherwise)
- Shared state: `State<'_, Mutex<AppState>>` — match the exact type passed to `.manage()`

### 2. Register in the handler macro

`src-tauri/src/lib.rs`:

```rust
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            existing_command,
            my_command,       // ← add here
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

Missing from `generate_handler![]` = silently returns `undefined` on the frontend. Always check this first when a command seems to not work.

### 3. Add capabilities (if the command needs plugin permissions)

For most custom commands, `core:default` in `src-tauri/capabilities/default.json` is sufficient. If the command calls a plugin (fs, dialog, shell, etc.), add that plugin's permission:

```json
// src-tauri/capabilities/default.json
{
  "permissions": [
    "core:default",
    "fs:default" // ← example: only if needed
  ]
}
```

### 4. Call from the frontend

```typescript
import { invoke } from "@tauri-apps/api/core"; // v2 — NOT @tauri-apps/api/tauri

const result = await invoke<string>("my_command", { arg: "hello" });
```

Argument names: **camelCase in JS → snake_case in Rust** (Tauri converts automatically).

---

## Error type boilerplate

If `AppError` doesn't exist yet, add to `src-tauri/src/error.rs`:

```rust
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),
    #[error("{0}")]
    Other(String),
}

// Required: Tauri serializes errors as strings to the frontend
impl serde::Serialize for AppError {
    fn serialize<S>(&self, s: S) -> Result<S::Ok, S::Error>
    where S: serde::ser::Serializer {
        s.serialize_str(self.to_string().as_ref())
    }
}
```

---

## Checklist

- [ ] Command defined with `#[tauri::command]`
- [ ] Command registered in `generate_handler![...]`
- [ ] Returns `Result<T, AppError>` (not bare value)
- [ ] Async params use owned types (`String`, not `&str`)
- [ ] Capabilities updated if plugin permissions needed
- [ ] Frontend uses `@tauri-apps/api/core`, not `/tauri`
