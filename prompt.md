# Note — Project Context

## Product

- **Name:** Note (working title)
- **Type:** Desktop app (Tauri 2)
- **Entity:** Klarhimmel AB
- **Vision:** Developer-focused dynamic dashboard. The app shell provides only panel layout + plugin slots. All functionality is delivered via plugins (first-party or third-party). Perfect UX for panel management — think a programmable, tiling workspace for development tools.

---

## Panel Management UX

The core interface is a resizable/splittable panel grid:

- **CMD+D** — split the active panel horizontally
- **CMD+Shift+D** — split the active panel vertically
- **Drag handles** — resize any panel by dragging borders
- **Close button** — close a panel (merges space back)
- **Empty panel** — shows a plugin launcher UI (search/browse installed plugins, install new ones)
- **Panel state persistence** — layout survives app restarts (stored in SQLite via Tauri plugin)

---

## Plugin API Contract

Plugins are npm packages (or local directories) that export a React component and declare metadata.

### Manifest

Declared in the plugin's `package.json` under the `"note-plugin"` key:

```typescript
interface PluginManifest {
  id: string; // unique reverse-domain ID, e.g. "com.developer.file-tree"
  name: string; // display name shown in launcher
  version: string;
  description: string;
  icon?: string; // emoji or relative image path
  component: string; // entry point relative to package root (default export = React component)
}
```

### Plugin Context

Injected into every plugin component as the `context` prop:

```typescript
interface PluginContext {
  panelId: string; // unique ID of the panel this plugin is mounted in
  workspacePath: string; // current workspace root (set by user or auto-detected from git)
  theme: "light" | "dark";
  fs: TauriFS; // Tauri-safe filesystem API wrappers
  shell: TauriShell; // Tauri-safe shell/process API wrappers
}
```

### Plugin Component Signature

```typescript
type PluginComponent = React.ComponentType<{ context: PluginContext }>;
```

### Installation Flow

1. User clicks "+" in an empty panel launcher → opens plugin search
2. Search queries a local registry (installed plugins) or a remote registry (npm)
3. User selects a plugin → app calls `npm install <plugin-id>` via Tauri shell
4. Plugin is registered in the plugin registry (Zustand + SQLite)
5. Plugin component is dynamically imported into the panel slot

---

## Tech Stack

| Layer       | Choice                                                                              |
| ----------- | ----------------------------------------------------------------------------------- |
| Desktop     | Tauri 2 (Rust backend, `tauri-plugin-shell`, `tauri-plugin-fs`, `tauri-plugin-sql`) |
| Frontend    | React 19 + Vite 7 + TypeScript                                                      |
| Styling     | Tailwind CSS 4 + shadcn/ui                                                          |
| State       | Zustand (panel layout + plugin registry)                                            |
| Persistence | SQLite via `tauri-plugin-sql`                                                       |
| Build       | Vite 7, npm workspaces                                                              |

---

## MVP Scope

### Phase 1 — Shell

- [ ] Tauri 2 app scaffold (Vite + React 19 + Tailwind 4 + TypeScript)
- [ ] Panel manager: split horizontal/vertical, resize, close
- [ ] Keyboard shortcuts: CMD+D (split H), CMD+Shift+D (split V)
- [ ] Panel state persistence (Zustand + SQLite)
- [ ] Empty panel launcher UI (placeholder, no plugins yet)

### Phase 2 — Plugin System

- [ ] Plugin loader: dynamic import with sandboxed `PluginContext`
- [ ] Plugin registry: track installed plugins in SQLite
- [ ] Install flow: in-app search → `npm install` via Tauri shell → register → mount
- [ ] Plugin launcher UI: search installed + browse npm

### Phase 3 — Built-in Plugins

- [ ] `@note/file-tree` — file system tree for workspace root
- [ ] `@note/terminal` — embedded terminal (xterm.js + Tauri shell)
- [ ] `@note/markdown-preview` — render markdown files from the file tree
- [ ] (Stretch) `@note/git-manager` — git status, diff, commit UI
- [ ] (Stretch) `@note/github-issues` — GitHub Issues list + detail view

---

## Project Structure (planned)

```
agency/projects/note/
├── src-tauri/          # Rust backend (Tauri 2)
│   ├── src/
│   ├── Cargo.toml
│   └── tauri.conf.json
├── src/                # React frontend
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── PanelGrid.tsx
│   │   ├── Panel.tsx
│   │   └── PluginLauncher.tsx
│   ├── store/
│   │   ├── panelStore.ts   # Zustand: panel layout
│   │   └── pluginStore.ts  # Zustand: plugin registry
│   ├── plugins/
│   │   └── loader.ts       # Dynamic import + context injection
│   └── types/
│       └── plugin.ts       # PluginManifest, PluginContext, PluginComponent
├── plugins/            # First-party plugins (monorepo packages)
│   ├── file-tree/
│   └── terminal/
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Notes

- This is a Klarhimmel AB product — not client work
- Target audience: developers who want a customizable, keyboard-driven workspace
- Monetization TBD: open core (free shell + free built-in plugins, paid marketplace or Pro plugins)
- Keep the plugin API surface minimal and stable — it's the public contract
