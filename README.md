# Origin

A keyboard-driven split-panel desktop workspace where every panel runs a plugin.

Built with Tauri 2, React 19, Vite 7, Tailwind CSS 4, and Zustand.

## What it is

Origin is a local-first desktop app that gives you a tiling panel layout you can fill with whatever tools you build. The shell handles layout, persistence, and keyboard navigation — all functionality comes from plugins. It is free, open source (MIT), and will always be.

Key properties:

- **Plugin-first** — every panel runs a plugin; the shell provides only the frame
- **Local-first** — state is file-backed via `@tauri-store/zustand`, never localStorage
- **Keyboard-driven** — split, close, and navigate panels without touching the mouse
- **Developer-friendly** — typed plugin API (`PluginManifest`, `PluginContext`) and a starter template

## Prerequisites

- [Rust toolchain](https://rustup.rs/) (required by Tauri)
- Node.js 20+
- macOS (primary target; Tauri 2 desktop)

### macOS version requirements

| Feature                              | Minimum macOS        | Reason                                                     |
| ------------------------------------ | -------------------- | ---------------------------------------------------------- |
| Core app (v1 bundled plugins)        | macOS 10.15 Catalina | Tauri 2 minimum                                            |
| Marketplace / community plugins (v2) | macOS 13.0 Ventura   | Import maps require WebKit 616.1 / Safari 16.4+ (Ventura+) |

Users on macOS Monterey 12.x can run the app and all bundled plugins (notepad, terminal, file tree, etc.), but v2 community plugins loaded from the marketplace will silently fail to resolve — import maps are not supported in Safari < 16.4.

## Getting started

```bash
# Install dependencies
npm install

# Run in development mode (Tauri + Vite hot reload)
npm run tauri dev

# Build for production
npm run tauri build
```

## Project layout

```
src/          React 19 frontend (components, store, plugins, types)
src-tauri/    Rust/Tauri backend (commands, capabilities, config)
packages/     @origin/* plugin packages (npm workspaces)
  api/        @origin/api — plugin type contract (PluginManifest, PluginContext)
  hello/      @origin/hello — reference plugin implementation
  template/   @origin/template — scaffold for new plugin authors (deprecated)
docs/         Spec, research, SOPs, standards
```

## Keyboard shortcuts

| Shortcut    | Action                              |
| ----------- | ----------------------------------- |
| CMD+D       | Split panel horizontally            |
| CMD+Shift+D | Split panel vertically              |
| CMD+W       | Close focused panel                 |
| CMD+T       | New workspace tab                   |
| CMD+Shift+W | Close active workspace tab          |
| CMD+1–9     | Switch to workspace by position     |
| CMD+S       | Save current layout as named config |

## Plugin system

Plugins are npm workspace packages under `packages/`. Each plugin:

- Depends on `@origin/api` for type contracts (`PluginManifest`, `PluginContext`)
- Exports a `manifest` and a default React component
- Is registered in `origin.plugins.json` and `src/plugins/registry.ts`

`@origin/hello` is the canonical reference implementation included in this repo.

To build your own plugin, start from the [origin-plugin-starter](https://github.com/fellanH/origin-plugin-starter) template repository.

## Architecture

| Layer        | Choice                              | Notes                                                          |
| ------------ | ----------------------------------- | -------------------------------------------------------------- |
| Desktop      | Tauri 2.10.2                        | Frameless, macOS traffic lights via `titleBarStyle: "Overlay"` |
| Frontend     | React 19 + Vite 7 + TypeScript      |                                                                |
| Styling      | Tailwind CSS 4 + shadcn/ui          | v4 only — breaking changes from v3                             |
| Panel layout | `react-resizable-panels` v4         | v4 renames several APIs                                        |
| State        | Zustand v5 + `@tauri-store/zustand` | File-backed; not localStorage                                  |
| Build        | Vite 7, npm workspaces              | Plugins in `packages/`                                         |

## Documentation

| Doc                                                | Description                                        |
| -------------------------------------------------- | -------------------------------------------------- |
| [`docs/SPEC.md`](docs/SPEC.md)                     | Full product spec — authoritative                  |
| [`docs/STANDARDS.md`](docs/STANDARDS.md)           | Coding standards — TypeScript, React, Zustand, CSS |
| [`docs/SOP/add-plugin.md`](docs/SOP/add-plugin.md) | Adding a new plugin — step-by-step                 |
| [`docs/research/index.md`](docs/research/index.md) | Research index + key findings                      |

## License

MIT
