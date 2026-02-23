# note

You are a Claude Code agent working within this project. `README.md` is the human-facing introduction — this file is yours. Read it before writing any code.

## Navigation

| What                                         | Where                  |
| -------------------------------------------- | ---------------------- |
| Full spec, UX, types, verification checklist | `docs/SPEC.md`         |
| Coding standards and conventions             | `docs/STANDARDS.md`    |
| Pre-code checklist (run before every task)   | `docs/SOP/pre-code.md` |
| Architecture research                        | `docs/research/`       |

## Architecture Decisions

| Decision           | Choice                                                                                           | Do NOT                                                                             | Research                                     |
| ------------------ | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | -------------------------------------------- |
| Panel state model  | Flat `NodeMap` + `parentId` (O(1) split/close)                                                   | Recursive tree with `children`                                                     | `research/flat-map-vs-recursive-tree.md`     |
| Persistence        | `@tauri-store/zustand` (file-backed)                                                             | `localStorage`, standard `persist` middleware                                      | `research/tauri-store-zustand.md`            |
| Keyboard shortcuts | Webview `keydown` + `preventDefault()` in `App.tsx`                                              | `tauri-plugin-global-shortcut` (fires when backgrounded, macOS double-fire #10025) | `research/tauri2.md`                         |
| Resize handles     | `react-resizable-panels` v4 — v4 renames: `Group`, `Separator`, `orientation`, `onLayoutChanged` | From-scratch divider                                                               | `research/react-resizable-panels-zustand.md` |
| Frameless window   | `decorations: true` + `titleBarStyle: "Overlay"`                                                 | `decorations: false` (removes traffic lights)                                      | `research/tauri2-frameless-window.md`        |
| Plugin loading v1  | Build-time Vite dynamic import                                                                   | Runtime install                                                                    | `research/vite-plugin-loading.md`            |
| Directory layout   | `src/` for React source, `src-tauri/` for Rust                                                   | Flat root, `packages/app/` monorepo indirection                                    | —                                            |

## Critical Gotchas

- `key={activeWorkspaceId}` on root `PanelGrid` element — forces remount on tab switch
- Do NOT call `window.setTitle()` — resets `trafficLightPosition` (Tauri #13044); use `document.title`
- Traffic light alignment: `trafficLightPosition: {x:14, y:22}` + `h-[38px] items-center`. Derivation: `docs/research/tauri2-frameless-window.md`
- `security.csp` belongs inside `app` in `tauri.conf.json` — NOT at top level (top-level `security` is a Tauri 1 pattern)
- Do NOT use `unstable` Cargo feature — breaks `trafficLightPosition` (Tauri #14072)
- Dev builds use `.dev.json` file suffix by default — dev/prod state is intentionally separate
- `createTauriStore` type gotcha: expects `StoreApi<State>` where `State` requires `[key: string]: unknown` index signature — immer middleware overloads `setState` with a `WritableDraft` type that clashes. Runtime is fine; use `useSpikeStore as any` cast. For real stores, either declare state with `[key: string]: unknown` or cast.

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

## SOPs

See `docs/SOP/index.md` for the full navigation hub. Quick reference:

| SOP                             | When to use                                                     |
| ------------------------------- | --------------------------------------------------------------- |
| `docs/SOP/issue-lifecycle.md`   | Before picking up any issue (definition of ready, sprint order) |
| `docs/SOP/pre-code.md`          | Before writing any component, hook, store slice, or command     |
| `docs/SOP/git-workflow.md`      | Branching, commits, PR workflow, merge strategy                 |
| `docs/SOP/testing.md`           | What to test, Vitest setup, merge gates                         |
| `docs/SOP/add-tauri-command.md` | Adding a new Rust-backed IPC command                            |
| `docs/SOP/add-plugin.md`        | Adding a new `@note/*` plugin package                           |
| `docs/SOP/complete-work.md`     | When finishing a task — closes the loop with admin              |
| `docs/SOP/release.md`           | Versioning, build, distribution, GitHub release                 |

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
