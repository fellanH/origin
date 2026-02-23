# Tauri 2 Research — February 2026

**Researched:** 2026-02-23

---

## Version

- **Latest stable:** `tauri v2.10.2` (released 2026-02-04)
- **Tauri 3:** Planned but not announced publicly. Driven by GTK3 → GTK4 migration on Linux. No macOS impact near-term. No timeline given.

---

## Keyboard Shortcuts: CMD+W and Global Shortcuts

### The spec was wrong — global-shortcut is not needed for panel close

The spec recommends `tauri-plugin-global-shortcut` for all keyboard shortcuts including CMD+W. Research shows this is incorrect for in-window shortcuts.

| Use case                                              | Correct mechanism                                             |
| ----------------------------------------------------- | ------------------------------------------------------------- |
| Close a panel (in-window action)                      | Webview `keydown` + `event.preventDefault()`                  |
| App-wide activation when window is hidden             | `tauri-plugin-global-shortcut`                                |
| Prevent macOS from closing the native window on CMD+W | `window.onCloseRequested` + `event.preventDefault()` in Tauri |

**Rationale:** `tauri-plugin-global-shortcut` registers OS-level hotkeys — they fire even when the app is backgrounded. For in-window panel management, a standard webview keydown listener is simpler and correct. CMD+W closes the _window_ at the OS level only if the keydown event bubbles to the native layer unchecked; calling `event.preventDefault()` in the webview stops this.

### Known issues with global-shortcut

- **`tauri#12888`:** macOS crash on CMD+W — **fixed** in `tao v0.32.8` (March 2025). Tauri 2.10.x is safe.
- **`tauri#10025`:** Global shortcut events fire **twice** on macOS. Workaround: debounce handler. Still open as of early 2025.
- **`tauri#5464`:** Webview does not receive keyboard events until the user has interacted with the window at least once.

### True preemption (before the OS)

If you need to intercept CMD+W before macOS can act on it at all: `tauri-plugin-key-intercept` uses `CGEventTap` FFI. Requires **Input Monitoring permission** in System Settings and an Apple Developer ID. Overkill for a panel layout app.

---

## tauri-plugin-sql (SQLite)

**Production-ready.** Built on `sqlx`. The official recommended plugin for local structured data.

- Schema migrations via versioned `Migration` structs in Rust
- DB stored in `~/Library/Application Support/<app>/` (macOS)
- Must grant plugin permissions explicitly in capabilities config

**Known caveats:**

- Cannot load a bundled/resource `.db` file directly — copy to `appDataDir` on first launch
- `sqlite:` prefix required; path resolves relative to AppConfig, not project dir
- JS bridge overhead vs raw `sqlx` in Rust (use Rust-side if performance matters)

**Recommendation for note:**

- localStorage → ephemeral UI state only (3-5 MB cap, origin-volatile in Tauri)
- `tauri-plugin-store` → key-value preferences, API keys, per-user settings
- `tauri-plugin-sql` → relational user data (v2+)

---

## localStorage in Tauri: Real Issues

**Do not use localStorage for anything important in a Tauri app.**

- **macOS dev vs prod:** Dev uses `http://localhost:1420`, prod uses `tauri://localhost`. Different origins → different localStorage. Data does not carry over between dev builds and production.
- **Windows:** Tauri 2 changed prod origin from `https://tauri.localhost` to `http://tauri.localhost`. Existing data invisible after upgrade. Fix: set `useHttpsScheme: true`.
- **Linux:** Only one webview window's localStorage persists on app close when multiple windows are open — others discarded. Open bug `tauri#10981`.
- **Dev port instability:** `cargo tauri dev` can start on different ports, making every restart start with empty state.

**Better alternatives:** `tauri-plugin-store` (file-backed key-value, origin-independent) or `@tauri-store/zustand` (pairs Zustand persist with Tauri's file system).

---

## Dynamic Runtime Plugin Loading

**No first-party production-ready solution exists in the Tauri 2 + Vite ecosystem as of Feb 2026.**

Options ranked by viability:

1. **Vite static dynamic imports** — build-time only, all plugins bundled at build. ✅ v1.
2. **Custom Tauri URI scheme** (`plugin://`) — Rust protocol handler reads plugin JS from disk, serves to webview. Most secure. No open port. CSP must allowlist `plugin-name:` in `script-src`.
3. **Embedded Rust HTTP server** (axum/warp in Tokio task) — plugins built to `AppData` dir, served over localhost. Works well with import maps.
4. **`tauri-plugin-localhost`** — official plugin, replaces `tauri://` with `http://localhost:{port}`. Cleanest CSP setup. Security warning: any local process can hit the server.
5. **`eval()` / script injection** — blocked by Tauri's default CSP. Requires `unsafe-eval`. Avoid.

**Best v2 architecture for "npm install + load without full rebuild":**

1. On plugin install → run `npm install && vite build --mode lib` in plugin dir
2. Embedded axum server in Tauri Rust serves plugin dirs
3. At startup, Rust generates import map JSON, injects into webview HTML
4. Webview uses native `import()` against import map — no bundler at runtime

---

## Sources

- https://v2.tauri.app/release/
- https://github.com/tauri-apps/tauri/releases
- https://github.com/tauri-apps/tauri-docs/issues/3143
- https://v2.tauri.app/plugin/global-shortcut/
- https://github.com/tauri-apps/tauri/issues/12888
- https://github.com/tauri-apps/tauri/issues/10025
- https://v2.tauri.app/plugin/sql/
- https://aptabase.com/blog/persistent-state-tauri-apps
- https://github.com/tauri-apps/tauri/issues/10981
- https://v2.tauri.app/plugin/localhost/
- https://v2.tauri.app/plugin/store/
