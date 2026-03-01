# origin — Architecture Research Index

**Researched:** 2026-02-23
**Scope:** Validate and improve architecture decisions in SPEC.md v1.2

---

## Files

| File                                                                     | Topic                                                                                         |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| [`ux-interview.md`](ux-interview.md)                                     | UX interview — product goals, aesthetic, window chrome, v1 success criteria                   |
| [`tauri2.md`](tauri2.md)                                                 | Tauri 2 version, keyboard shortcuts, SQLite, localStorage issues, runtime plugin loading      |
| [`tauri2-frameless-window.md`](tauri2-frameless-window.md)               | Frameless window, `titleBarStyle: "Overlay"`, traffic lights, drag region, known bugs         |
| [`vite-plugin-loading.md`](vite-plugin-loading.md)                       | Module Federation, import maps, Tauri-specific plugin loading patterns                        |
| [`react-panel-libraries.md`](react-panel-libraries.md)                   | react-resizable-panels, allotment, react-mosaic, FlexLayout comparison                        |
| [`react-resizable-panels-zustand.md`](react-resizable-panels-zustand.md) | v4 API changes, Zustand sync pattern, keying strategy, `onLayoutChanged`, close panel         |
| [`zustand.md`](zustand.md)                                               | Zustand v5 breaking changes, persist pitfalls, localStorage issues, @tauri-store/zustand      |
| [`tauri-store-zustand.md`](tauri-store-zustand.md)                       | `@tauri-store/zustand` v1.2.0 setup, Zustand v5 compat, filterKeys, beforeFrontendSync        |
| [`tailwind-v4-dark-mode.md`](tailwind-v4-dark-mode.md)                   | Tailwind v4 system dark mode, shadcn/ui, WKWebView `color-scheme`, upgrade path               |
| [`flat-map-vs-recursive-tree.md`](flat-map-vs-recursive-tree.md)         | Decision: flat NodeMap + parentId vs recursive PanelNode tree — updated types + ops           |
| [`capabilities-config.md`](capabilities-config.md)                       | Complete `src-tauri/capabilities/` JSON for all v1 plugins (fs, zustand, core)                |
| [`vite-config.md`](vite-config.md)                                       | Complete `vite.config.ts` — workspace aliases, `optimizeDeps`, Tauri dev server settings      |
| [`roadmap-research.md`](roadmap-research.md)                             | Long-term roadmap: runtime plugin loading, sync, auto-update, marketplace, inter-plugin comms |
| [`../security/webview-guardrails.md`](../security/webview-guardrails.md) | L1 plugin iframe hardening: allow/deny rules, threat model, runtime assertions                |

---

## Key Findings & Spec Impacts

### 1. Replace from-scratch Divider with `react-resizable-panels` v4

**Finding:** `react-resizable-panels` v4.6.5 (updated Feb 21, 2026) is actively maintained, React 19 compatible, and handles drag/resize/keyboard/collapse. It supports arbitrary nesting depth via `Group > Panel > Group`. shadcn/ui's `Resizable` wraps it. Note: v4 renames `PanelGroup` → `Group`, `PanelResizeHandle` → `Separator`, `direction` → `orientation`, `onLayout` → `onLayoutChanged` — shadcn CLI generates v3 code, patch manually.

**Spec impact:** Replace the from-scratch `Divider` component with `react-resizable-panels`. Keep the Zustand binary tree store for topology (split/close). The library has no split/close API — that stays in the store.

**Do not use:** `react-mosaic` (stale since Dec 2024 despite ideal architecture), `golden-layout` (too heavy), `allotment` (slower cadence).

---

### 2. Fix keyboard shortcut approach — global-shortcut not needed

**Finding:** The spec incorrectly recommended `tauri-plugin-global-shortcut` for all shortcuts. This is wrong for in-window shortcuts.

| Use case                              | Correct approach                             |
| ------------------------------------- | -------------------------------------------- |
| Panel operations (CMD+D, CMD+W, etc.) | Webview `keydown` + `event.preventDefault()` |
| App-wide activation when backgrounded | `tauri-plugin-global-shortcut`               |
| Prevent OS from closing native window | `window.onCloseRequested` + Tauri event      |

**Known `tauri#10025`:** Global shortcut events fire twice on macOS. If you use global-shortcut for anything, debounce the handler.

**Spec impact:** Revert implementation step 11 to a webview keydown handler. Remove `tauri-plugin-global-shortcut` from Cargo.toml (unless adding a background activation shortcut in a future version).

---

### 3. Replace localStorage with `@tauri-store/zustand`

**Finding:** `localStorage` has multiple documented, unfixed issues in Tauri:

- Dev and prod use different origins → data doesn't carry over
- Dev server port instability makes every restart blank the store
- Linux multi-window desync bug (`tauri#10981`)

**Better solution:** `@tauri-store/zustand` — writes to disk via Tauri file system, bypasses origin issues, supports cross-window sync. Zero extra design required.

**Migration path to SQLite (v2):** Replace `@tauri-store/zustand` with a direct `tauri-plugin-sql` integration. The `PersistStorage<T>` adapter pattern does not apply here — this project does not use standard `persist` middleware.

**Spec impact:** Update "Persistence" section and Implementation Steps to use `@tauri-store/zustand` instead of `localStorage persist`. Update Critical Files to list `tauri-plugin-zustand`.

---

### 4. Zustand v5 changes affect the store design

**Finding:** Zustand v5.0.11 (current) has breaking changes from v4:

- Named imports only (`import { create }`)
- `useShallow` required for selectors returning derived objects (avoids infinite loops)
- `@tauri-store/zustand` replaces `persist` middleware — use `filterKeys`/`filterKeysStrategy: "omit"` instead of `partialize`, and `beforeFrontendSync` hook instead of custom `merge`

**Flat `NodeMap` simplifies hydration:**

- Flat map serializes as a plain JSON object — no recursive deserialization in `beforeFrontendSync` needed
- See `research/flat-map-vs-recursive-tree.md` for `splitPanel`/`closePanel` implementations

**Middleware order:**

```
devtools( immer( ...store ) )
```

**Spec impact:** Spec updated with correct middleware order, `filterKeys` usage, and flat NodeMap types.

---

### 5. Plugin loading: v1 is correct, v2 architecture is now defined

**Finding:** Build-time Vite dynamic imports for v1 is correct. The v2 runtime-loading architecture is now fully researched:

**Recommended v2 approach:** Import maps + embedded axum server

1. Plugin install → `npm install` + `vite build --mode lib` → plugin built to AppData
2. Embedded axum Tokio task serves all plugin dirs on a random port
3. Rust generates import map at startup, injects into webview HTML
4. Webview uses native `import()` resolved by import map — no app rebuild

**Do not use:** `@originjs/vite-plugin-federation` (maintenance limbo), `eval()` injection (CSP violation), ESM CDN (network dependency).

**If using Module Federation:** `@module-federation/vite` v1.11.0 is the correct choice (NOT `vite-plugin-federation`). Production builds do not require `unsafe-eval`.

---

### 6. Tauri 2 versions and Tauri 3

- **Target:** Tauri 2.10.2 (Feb 4, 2026 — latest stable)
- **Tauri 3:** Planned, driven by GTK3→GTK4 migration on Linux. No macOS impact near-term.

---

## Decision Table

| Decision              | Before research                   | After research                                                      |
| --------------------- | --------------------------------- | ------------------------------------------------------------------- |
| Resize handles        | From-scratch `Divider`            | `react-resizable-panels` v4                                         |
| Keyboard shortcuts    | `tauri-plugin-global-shortcut`    | Webview `keydown` + `preventDefault`                                |
| State persistence     | Zustand + localStorage            | `@tauri-store/zustand` (file-backed)                                |
| Zustand version       | Not specified                     | v5.0.11, named imports, `useShallow`, `filterKeys`                  |
| v2 plugin loading     | "requires different architecture" | Import maps + embedded axum + per-plugin lib builds                 |
| Tauri target          | Not specified                     | 2.10.2                                                              |
| Panel state structure | Recursive `PanelNode` tree        | **Flat `NodeMap` + `parentId`** (see flat-map-vs-recursive-tree.md) |
| Capabilities          | Not specified                     | 3 files: default.json, zustand.json, fs.json                        |
| vite.config.ts        | Not specified                     | Workspace alias + `optimizeDeps.include`, port 1420                 |
