# Tauri 2 Capabilities Config — origin app

**Researched:** 2026-02-23
**Target:** Tauri 2.10.2
**Scope:** All plugin permissions for the origin app

---

## Overview

Capabilities live in `src-tauri/capabilities/`. Each JSON file is a separate capability group. Tauri merges them at compile time. Split by plugin for clarity — easier to audit and disable individually.

For origin app, three capability files:

1. `default.json` — core window permissions + deny rules
2. `zustand.json` — `tauri-plugin-zustand` (from `@tauri-store/zustand` docs)
3. `fs.json` — `tauri-plugin-fs` for reading `origin.plugins.json` at startup

`tauri-plugin-shell` is **not needed in v1** — no subprocess execution, no `shell:open` calls. Add in v2 if implementing `npm install` for runtime plugin loading.

---

## `src-tauri/capabilities/default.json`

Core window capabilities. Includes the double-click maximize deny (see `research/tauri2-frameless-window.md`).

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Core window and path permissions",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "path:default",
    "core:window:deny-toggle-maximize",
    "core:window:deny-internal-toggle-maximize"
  ]
}
```

| Permission                                  | Why                                                                                          |
| ------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `core:default`                              | Window, webview, app, menu core APIs                                                         |
| `path:default`                              | `resolveResource`, `appDataDir`, `appConfigDir` — used to resolve `workspacePath` at startup |
| `core:window:deny-toggle-maximize`          | Prevent double-click on drag region from maximizing window (issue #12006)                    |
| `core:window:deny-internal-toggle-maximize` | Same — internal counterpart needed alongside deny above                                      |

---

## `src-tauri/capabilities/zustand.json`

From `research/tauri-store-zustand.md` — provided by `@tauri-store/zustand` docs:

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "zustand",
  "description": "tauri-plugin-zustand file-backed store permissions",
  "windows": ["main"],
  "permissions": ["zustand:default", "core:event:default"]
}
```

| Permission           | Why                                                                                     |
| -------------------- | --------------------------------------------------------------------------------------- |
| `zustand:default`    | Grants read/write to the plugin's file-backed store (granted by `tauri-plugin-zustand`) |
| `core:event:default` | The plugin uses Tauri events to push state updates from Rust → JS                       |

---

## `src-tauri/capabilities/fs.json`

`tauri-plugin-fs` is used for **one operation in v1**: reading `origin.plugins.json` at startup to build the plugin registry. Scope to `$RESOURCE` (bundled app files) + `$APPCONFIG` (user config dir, for future plugin config).

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "fs",
  "description": "File system read access for plugin config",
  "windows": ["main"],
  "permissions": [
    {
      "identifier": "fs:allow-read-text-file",
      "allow": [{ "path": "$RESOURCE/**" }]
    },
    {
      "identifier": "fs:allow-read-text-file",
      "allow": [{ "path": "$APPCONFIG/**" }]
    },
    {
      "identifier": "fs:allow-exists",
      "allow": [{ "path": "$RESOURCE/**" }, { "path": "$APPCONFIG/**" }]
    }
  ]
}
```

**Why `$RESOURCE`:** `origin.plugins.json` is bundled with the app as a resource file. The Rust resolver maps it to the app bundle's resources directory.

**Why `$APPCONFIG`:** Future: user-managed plugin list could live in `$APPCONFIG/origin/plugins.json` alongside `tauri-store` state. Not needed v1 but cheap to include now.

> **Note:** `fs:default` grants read access to `$APPDATA`, `$APPLOCALDATA`, `$APPCACHE`, `$APPLOG`, and `$APPCONFIG` but NOT `$RESOURCE`. Since `origin.plugins.json` is a bundled resource, the scoped `$RESOURCE` permission is required explicitly.

---

## Permission Quick Reference

### `tauri-plugin-fs` identifiers

| Identifier                 | What it does                                   |
| -------------------------- | ---------------------------------------------- |
| `fs:default`               | Read access to app directories (not $RESOURCE) |
| `fs:allow-read-text-file`  | Read a file as text (needs path scope)         |
| `fs:allow-read-file`       | Read a file as bytes (needs path scope)        |
| `fs:allow-read-dir`        | List directory contents (needs path scope)     |
| `fs:allow-write-text-file` | Write a text file (needs path scope)           |
| `fs:allow-mkdir`           | Create directories (needs path scope)          |
| `fs:allow-exists`          | Check if path exists (needs path scope)        |
| `fs:allow-stat`            | Get file metadata (needs path scope)           |

Scope paths use Tauri dir vars: `$APP`, `$APPDATA`, `$APPCONFIG`, `$RESOURCE`, `$HOME`, etc. Suffix `/**` for recursive access.

### `tauri-plugin-path` identifiers (all in `path:default`)

`path:allow-resolve`, `path:allow-resolve-directory`, `path:allow-normalize`, `path:allow-join`, `path:allow-dirname`, `path:allow-extname`, `path:allow-basename`, `path:allow-is-absolute`

### `tauri-plugin-shell` identifiers (v2 reference)

| Identifier            | What it does                                      |
| --------------------- | ------------------------------------------------- |
| `shell:allow-open`    | Open URLs in system browser / mailto / tel        |
| `shell:allow-execute` | Execute CLI commands (requires scope per command) |

`shell:allow-execute` requires a scope entry per command with `name`, `cmd`, `args`. See Tauri docs for full format.

---

## Full File Structure Summary

```
src-tauri/capabilities/
├── default.json    # core:default + path:default + window deny rules
├── zustand.json    # zustand:default + core:event:default
└── fs.json         # fs:allow-read-text-file + fs:allow-exists (scoped)
```

All three capability files are picked up automatically by `tauri build` and `tauri dev` — no registration needed. Tauri merges them at compile time.

---

## Sources

- [Tauri Permissions docs](https://v2.tauri.app/security/permissions/)
- [Tauri Using Plugin Permissions](https://v2.tauri.app/learn/security/using-plugin-permissions/)
- [tauri-plugin-fs permissions reference](https://github.com/tauri-apps/plugins-workspace/blob/v2/plugins/fs/permissions/autogenerated/reference.md)
- [tauri-plugin-shell docs](https://v2.tauri.app/plugin/shell/)
- [tauri-plugin-path docs](https://v2.tauri.app/reference/javascript/core/path/)
- [Capability format reference](https://v2.tauri.app/reference/acl/capability/)
- [@tauri-store/zustand capability](https://tb.dev.br/tauri-store/plugin-zustand/guide/getting-started) — `research/tauri-store-zustand.md`
- Double-click deny — `research/tauri2-frameless-window.md` (issue #12006)
