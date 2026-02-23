# Note

Dynamic dashboard desktop app with a panel manager and developer plugin API.

Built with Tauri 2, React 19, Vite 7, Tailwind CSS 4, and Zustand.

## Quick Start

```bash
cd agency/projects/note && claude
```

## Development (once app is scaffolded)

```bash
# Install dependencies
npm install

# Run in development mode (Tauri + Vite hot reload)
npm run tauri dev

# Build for production
npm run tauri build
```

## What It Is

Note is a developer-focused tiling window manager as a desktop app. The shell provides only panel layout and plugin slots — all functionality comes from plugins. v1 proves the core: keyboard-driven split panels and a working plugin API. Built as a personal tool first, designed to be extensible for other developers.

## Architecture at a Glance

| Layer        | Choice                              | Notes                                                          |
| ------------ | ----------------------------------- | -------------------------------------------------------------- |
| Desktop      | Tauri 2.10.2                        | Frameless, macOS traffic lights via `titleBarStyle: "Overlay"` |
| Frontend     | React 19 + Vite 7 + TypeScript      |                                                                |
| Styling      | Tailwind CSS 4 + shadcn/ui          | v4 only — breaking changes from v3                             |
| Panel layout | `react-resizable-panels` v4         | v4 renames several APIs                                        |
| State        | Zustand v5 + `@tauri-store/zustand` | File-backed; not localStorage                                  |
| Build        | Vite 7, npm workspaces              | Plugins in `plugins/`                                          |

## Keyboard Shortcuts

| Shortcut    | Action                              |
| ----------- | ----------------------------------- |
| CMD+D       | Split panel horizontally            |
| CMD+Shift+D | Split panel vertically              |
| CMD+W       | Close focused panel                 |
| CMD+T       | New workspace tab                   |
| CMD+Shift+W | Close active workspace tab          |
| CMD+1–9     | Switch to workspace by position     |
| CMD+S       | Save current layout as named config |

## Plugin System

v1 plugins are npm workspace packages in `plugins/`. Loading is build-time only — all plugins must be present at build time via Vite dynamic import. `@note/hello` is the canonical reference implementation. Runtime loading (v2) is documented in `docs/research/vite-plugin-loading.md`.

## Documentation

| Doc                                                | Description                            |
| -------------------------------------------------- | -------------------------------------- |
| [`docs/SPEC.md`](docs/SPEC.md)                     | Full product spec v1.2 — authoritative |
| [`docs/plans/poc.md`](docs/plans/poc.md)           | PoC plan — start here                  |
| [`docs/research/index.md`](docs/research/index.md) | Research index + key findings          |
| [`docs/research/risks.md`](docs/research/risks.md) | Pre-build risk register                |
