# note

Isolated project bucket. You work within this project only.

## Project Context

Read the Architecture Decisions and Critical Gotchas below before writing any code. Consult `docs/SPEC.md` for deep context (UX, full types, verification checklist). Start with `docs/plans/poc.md`.

No code written. GitHub issues created (13 issues, MVP v1 at `fellanH/note`). Next: PoC (#1 scaffold, partial #2 types, partial #3 store, #4 EmptyState, partial #7 panels, partial #11 shortcuts).

## Architecture Decisions

| Decision           | Choice                                              | Do NOT                                                                             | Research                                     |
| ------------------ | --------------------------------------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------- |
| Panel state model  | Flat `NodeMap` + `parentId` (O(1) split/close)      | Recursive tree with `children`                                                     | `research/flat-map-vs-recursive-tree.md`     |
| Persistence        | `@tauri-store/zustand` (file-backed)                | `localStorage`, standard `persist` middleware                                      | `research/tauri-store-zustand.md`            |
| Keyboard shortcuts | Webview `keydown` + `preventDefault()` in `App.tsx` | `tauri-plugin-global-shortcut` (fires when backgrounded, macOS double-fire #10025) | `research/tauri2.md`                         |
| Resize handles     | `react-resizable-panels` v4                         | From-scratch divider                                                               | `research/react-resizable-panels-zustand.md` |
| Frameless window   | `decorations: true` + `titleBarStyle: "Overlay"`    | `decorations: false` (removes traffic lights)                                      | `research/tauri2-frameless-window.md`        |
| Plugin loading v1  | Build-time Vite dynamic import                      | Runtime install                                                                    | `research/vite-plugin-loading.md`            |

## Critical Gotchas

- Tab bar left padding: `pl-[80px]` — NOT 72px
- `@tauri-store/zustand` API: `createTauriStore()` — `createStore` does not exist
- Store hydration: `await tauriHandler.start()` before `ReactDOM.createRoot()`
- `filterKeys` + `filterKeysStrategy: "omit"` replaces `partialize` — do not use `persist` middleware
- Middleware order: `devtools(immer(...store))` — `persist` is not in the chain
- Zustand v5: `import { create } from 'zustand'`, `useShallow` for derived selectors
- `react-resizable-panels` v4 renames: `Group`, `Separator`, `orientation`, `onLayoutChanged`
- `Panel` name collision: alias with `import { Panel as ResizablePanel }` or name local component `LeafPanel.tsx`
- `data-tauri-drag-region`: spacer divs only — NOT on interactive elements or the tab bar container
- `titleBarStyle: "Overlay"` — capital O, Tauri is case-sensitive
- `key={activeWorkspaceId}` on root `PanelGrid` element — forces remount on tab switch
- Do NOT call `window.setTitle()` — resets `trafficLightPosition` (Tauri #13044); use `document.title`
- Do NOT use `unstable` Cargo feature — breaks `trafficLightPosition` (Tauri #14072)
- `onCloseRequested` must `e.preventDefault()` to prevent CMD+W closing the native window
- Dev builds use `.dev.json` file suffix by default — dev/prod state is intentionally separate

## Cross-Domain Tools

### Write tools

| Tool                  | What it does                                                    |
| --------------------- | --------------------------------------------------------------- |
| `send_to_admin`       | Queue a request for the admin agent                             |
| `log_to_memory`       | Log a status update, blocker, or note                           |
| `update_project_task` | Update a task's status in any project (including this one)      |
| `update_queue_item`   | Update a queue item's status (DISPATCHED, COMPLETED, ARCHIVED)  |
| `send_feedback`       | Report bugs, friction, ideas, or validations to the admin queue |

### Read tools

| Tool                | What it does                  |
| ------------------- | ----------------------------- |
| `list_projects`     | List all project bucket names |
| `get_project_tasks` | Read tasks from any project   |

## Completing Work

When a task is finished:

1. `update_project_task` — mark the task as COMPLETE with a summary of what was done
2. `update_queue_item` — if the task originated from a queue item, mark that item as COMPLETED so admin knows the work is done
3. `log_to_memory` — log the completion with type "status" so admin can track progress

This closes the loop: admin dispatches work, project executes, admin is notified of completion.

## Rules

1. Stay focused on this project's work
2. Use crossdomain MCP tools to communicate with admin
3. Report blockers via `log_to_memory`
4. When completing a task, update both the project task AND the originating queue item

## Installed Skills

Project-scoped skills in `.claude/skills/`:

| Skill                            | Purpose                                               |
| -------------------------------- | ----------------------------------------------------- |
| `tauri-v2`                       | Tauri 2 patterns, window config, Rust/JS bridge       |
| `integrating-tauri-js-frontends` | Tauri ↔ Vite/React integration patterns               |
| `configuring-tauri-permissions`  | Tauri 2 CSP, `tauri-plugin-fs`, `tauri-plugin-shell`  |
| `vite`                           | Vite 7 config, dynamic import, workspace bundling     |
| `tailwind-v4-shadcn`             | Tailwind CSS 4 + shadcn/ui (breaking changes from v3) |
| `typescript-react-reviewer`      | TypeScript + React 19 code review patterns            |
| `zustand-state-management`       | Zustand store patterns + `persist` middleware         |
