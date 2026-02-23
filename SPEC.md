# note — MVP Specification

**Version:** 1.1
**Entity:** Klarhimmel AB
**Type:** Tauri 2 desktop app
**Status:** Pre-build spec

> **Note:** This spec supersedes `prompt.md` (the original product brief). Where they conflict, this document is authoritative.

---

## Product Vision

A developer-focused dynamic dashboard. The app shell provides only panel layout + plugin slots. All functionality is delivered via plugins. Perfect UX for panel management — think a programmable, keyboard-driven tiling workspace for development tools.

---

## v1 MVP Scope

### In scope

- Tauri 2 app scaffold (React 19 + Vite 7 + TypeScript + Tailwind 4 + shadcn/ui)
- Tiling panel layout engine (recursive split tree, resize via drag, close panel)
- Keyboard shortcuts: `CMD+D` (split H), `CMD+Shift+D` (split V), `CMD+W` (close panel)
- **Tab bar** — multiple parallel workspaces, each with its own independent panel layout
- Keyboard shortcuts for tabs: `CMD+T` (new tab), `CMD+Shift+W` (close tab), `CMD+1–9` (switch tab)
- **Saved configs** — snapshot any tab's layout to a named config; reopen it any time
- Plugin contract (TypeScript types: PluginManifest, PluginContext)
- Plugin loading via `note.plugins.json` config file (npm workspaces, Vite dynamic import)
- Launcher UI: empty panel shows a list of registered plugins to select
- Full state persistence (Zustand + localStorage for v1)
- A `@note/hello` workspace plugin as proof-of-concept

### Explicitly NOT in v1

- In-app npm install / plugin search
- Plugin hot-reload
- Plugin settings/configuration
- Multi-window (OS-level) support
- Tabs within panels (tab bar is window-level only)
- Themes / appearance customization

---

## UX Behaviour

### Initial State

When the app opens, the user sees a **fullscreen empty window** with a minimal **tab bar** at the top. The first tab is active and shows the empty-state block in the center.

```
┌─[  Workspace 1  ×]──[+]────────────────────[Saved ▾]──────┐
├────────────────────────────────────────────────────────────┤
│                                                            │
│                 ┌───────────────────┐                      │
│                 │    note           │                      │
│                 │                  │                      │
│                 │  CMD+D   Split →  │                      │
│                 │  CMD+⇧D  Split ↓  │                      │
│                 │  CMD+T   New tab  │                      │
│                 └───────────────────┘                      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Tab Bar

The tab bar runs along the top of the window. Each tab is a fully independent **workspace** — it holds its own panel layout tree. Switching tabs instantly swaps the entire panel layout.

```
┌─[  Workspace 1  ×]──[  Workspace 2  ×]──[+]──[Saved ▾]───┐
```

- `[+]` button or `CMD+T` — opens a new empty workspace tab
- `×` on a tab or `CMD+Shift+W` — closes the tab (and its layout)
- `CMD+1` through `CMD+9` — jump to tab by position
- Double-click a tab label — rename the workspace inline
- Closing the last tab does not close the app — it resets to one empty workspace

### Split View (core feature)

Within any tab, `CMD+D` or `CMD+Shift+D` **splits the active panel** into two panels side by side (horizontal) or stacked (vertical). Each resulting panel is its own independent slot.

```
CMD+D on initial panel:

┌──────────────────┬──────────────────┐
│                  │                  │
│   Panel A        │   Panel B        │
│   (active)       │   (empty)        │
│                  │                  │
└──────────────────┴──────────────────┘

CMD+Shift+D on Panel A:

┌──────────┬──────────────────────────┐
│          │                          │
│  Panel A │   Panel B                │
│          │                          │
├──────────┤                          │
│          │                          │
│  Panel C │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

Splits are **recursive** — any panel can be split again, creating arbitrarily deep tiling layouts.

### Resize

Panels are separated by a **drag handle (Divider)**. Dragging the divider redistributes the size between the two sibling panels. Sizes are stored as percentages (sum always = 100).

### Close Panel

`CMD+W` closes the focused panel. Its sibling expands to fill the freed space. Closing the last panel in a tab returns that tab to the empty-state view (root → null).

> **`CMD+W` and macOS:** `CMD+W` is the standard macOS window-close shortcut. Tauri must intercept it before the OS using `tauri-plugin-global-shortcut` — a React keydown handler is not sufficient. When panels are open, `CMD+W` closes the active panel. The window is closed via the native title bar or `CMD+Q`.

### Focus

One panel is always "focused" at a time (tracked in `focusedPanelId` per workspace). Focus determines which panel `CMD+D`, `CMD+Shift+D`, and `CMD+W` operate on.

**Focus rules:**

- A panel receives focus on any click inside it
- After `CMD+D` / `CMD+Shift+D`: the **new empty sibling** receives focus
- After `CMD+W` (close): the **surviving sibling** receives focus
- `focusedPanelId` returns to `null` when the last panel in a tab is closed

**Visual treatment:** The focused panel has a 1px ring using the accent color. Unfocused panels have no ring.

### Plugin Loading

Each panel can host a plugin. An empty panel shows the **Launcher** — a list of registered plugins. Clicking a plugin mounts it in that panel slot.

### Saved Configs

Users can snapshot any tab's current panel layout (including which plugins are loaded) and save it as a named config. Saved configs can be reopened at any time — either replacing the current tab or opening in a new tab.

```
Saving:
  CMD+S or click [Save current] in the Saved ▾ menu
  → Prompt for a name (e.g. "Dev setup", "Review mode")
  → Snapshot stored in localStorage

Opening:
  Click [Saved ▾] in the tab bar → dropdown lists saved configs
  → Click a config → opens it in a new tab

Managing:
  Saved ▾ menu → hover a config → delete (×) button appears
```

The snapshot captures the full `PanelNode` tree including `pluginId` assignments. On restore, each panel attempts to load its saved plugin; if the plugin is no longer registered it falls back to the Launcher.

---

## Architecture

### Workspace & Tab State Model

The core state is a list of **workspaces** (tabs). Each workspace owns its own `PanelNode` tree. All panel operations target the currently active workspace.

```typescript
// src/types/workspace.ts

interface Workspace {
  id: string;
  name: string;
  root: PanelNode | null; // null = empty state
  focusedPanelId: string | null;
}

interface SavedConfig {
  id: string;
  name: string;
  snapshot: PanelNode | null; // full tree snapshot
  savedAt: string; // ISO-8601
}

interface WorkspaceStore {
  // Tabs
  workspaces: Workspace[];
  activeWorkspaceId: string;
  addWorkspace(): void;
  closeWorkspace(id: string): void;
  setActiveWorkspace(id: string): void;
  renameWorkspace(id: string, name: string): void;

  // Panel ops (always target active workspace)
  splitPanel(panelId: string, direction: "horizontal" | "vertical"): void;
  closePanel(panelId: string): void;
  setPlugin(panelId: string, pluginId: string): void;
  resizeSplit(splitId: string, sizes: [number, number]): void; // splitId targets PanelSplit.id
  setFocus(panelId: string | null): void;

  // Saved configs
  savedConfigs: SavedConfig[];
  saveConfig(name: string): void; // snapshot active workspace
  loadConfig(configId: string): void; // open in a new tab
  deleteConfig(configId: string): void;
}
```

### Panel Node Types

```typescript
// src/types/panel.ts

type PanelLeaf = {
  type: "leaf";
  id: string;
  pluginId: string | null;
};

type PanelSplit = {
  type: "split";
  id: string; // required — used by resizeSplit and parent traversal
  direction: "horizontal" | "vertical";
  sizes: [number, number]; // percentages, sum = 100
  children: [PanelNode, PanelNode];
};

type PanelNode = PanelLeaf | PanelSplit;

// IDs: both PanelLeaf and PanelSplit generate IDs at creation time via crypto.randomUUID()
```

### Plugin API Contract

```typescript
// src/types/plugin.ts

interface PluginManifest {
  id: string; // e.g., "com.note.hello"
  name: string;
  version: string;
  description: string;
  icon?: string; // emoji or relative image path
}

interface PluginContext {
  panelId: string;
  workspacePath: string; // see workspacePath note below
  theme: "light" | "dark";
}

type PluginComponent = React.ComponentType<{ context: PluginContext }>;

interface PluginModule {
  manifest: PluginManifest;
  default: PluginComponent;
}
```

**`workspacePath`:** In v1, this is resolved once at startup to the directory containing `note.plugins.json` (i.e., the project root), using Tauri's `path` plugin. It is stored in the workspace store and injected into every `PluginContext`. A user-facing directory-picker UI is deferred to v2.

### Plugin Config Format

```json
// note.plugins.json (at project root)
{
  "plugins": [{ "id": "com.note.hello", "package": "@note/hello" }]
}
```

Plugins are npm workspace packages. `@note/hello` resolves to `plugins/hello/` via workspaces. Vite dynamic `import('@note/hello')` works in both dev and prod (bundled at build time).

> **v1 limitation — build-time only:** Plugin loading uses Vite's static dynamic import. All plugins must be present in `note.plugins.json` at build time; Vite bundles them into the app. Adding a new plugin requires a rebuild. Runtime plugin install (as described in `prompt.md` Phase 2) is architecturally incompatible with this model — it will require a different loading strategy (e.g., Module Federation, a localhost chunk server, or a sandboxed WebView). This is an intentional v1 constraint, not a gap to paper over.

---

## Project Structure

```
note/
├── src-tauri/
│   ├── src/main.rs
│   ├── Cargo.toml
│   └── tauri.conf.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── types/
│   │   ├── panel.ts            # PanelNode types
│   │   ├── workspace.ts        # Workspace, SavedConfig, WorkspaceStore types
│   │   └── plugin.ts           # PluginManifest, PluginContext, PluginModule
│   ├── store/
│   │   └── workspaceStore.ts   # Zustand store (tabs + panel ops + saved configs) + persist
│   ├── plugins/
│   │   ├── registry.ts         # Load note.plugins.json → build plugin registry map
│   │   └── loader.ts           # Dynamic import → cache → return PluginModule
│   └── components/
│       ├── TabBar.tsx          # Tab strip + [+] button + [Saved ▾] menu
│       ├── SavedConfigMenu.tsx # Dropdown: list/open/delete saved configs + save current
│       ├── PanelGrid.tsx       # Root: renders active workspace's PanelNode tree OR EmptyState
│       ├── PanelBranch.tsx     # Recursive: leaf → Panel, split → two PanelBranches + Divider
│       ├── Panel.tsx           # A leaf panel: if pluginId → PluginHost, else → Launcher
│       ├── PluginHost.tsx      # Loads + mounts a plugin component with PluginContext; wrapped in ErrorBoundary
│       ├── Divider.tsx         # Drag-to-resize handle (see Divider Drag Model below)
│       ├── Launcher.tsx        # Lists registered plugins; onClick → setPlugin
│       └── EmptyState.tsx      # Centered empty-state block: name + keyboard hints
├── plugins/
│   └── hello/
│       ├── package.json        # { "name": "@note/hello", "main": "src/index.tsx" }
│       └── src/
│           ├── manifest.ts     # PluginManifest export
│           └── index.tsx       # default export: React component
├── note.plugins.json
├── package.json                # workspaces: ["plugins/*"]
├── vite.config.ts
├── tsconfig.json
└── tailwind.config.ts
```

### Divider Drag Model

`Divider` handles resize by tracking pointer position between `mousedown` and `mouseup`. Event listeners must be registered on `document` (not the divider element) so drag continues if the cursor leaves the divider bounds:

```
mousedown on Divider  →  register mousemove + mouseup on document
mousemove             →  compute delta → call resizeSplit(splitId, newSizes)
mouseup (anywhere)    →  unregister mousemove + mouseup
```

`Divider` receives `splitId` as a prop (the `PanelSplit.id` of its parent) so it can call `resizeSplit` directly.

### Error Boundaries

`PluginHost` must be wrapped in a React Error Boundary. A plugin that throws during import or render must not propagate errors up the `PanelBranch` tree. On error, the panel shows an inline error state (plugin name + error message) — the rest of the layout remains functional.

### Persistence Notes

Zustand `persist` middleware serializes the full workspace store (all tabs, all panel trees, all saved configs) to localStorage under the key `"note-workspace-state"`. The discriminated union (`type: "leaf" | "split"`) deserializes cleanly with JSON.

> **Dev vs. prod localStorage:** Tauri uses different origins in dev (`http://localhost:1420`) vs prod (`tauri://localhost`). The persist key is stable, but the dev build will not share state with the production app. This is expected behavior — do not treat it as a bug.

### Tauri Configuration

**`tauri.conf.json`:**

- Set `"identifier"` to a stable reverse-domain ID (e.g., `"com.klarhimmel.note"`) — this anchors the app's data directory path.
- Register all keyboard shortcuts via `tauri-plugin-global-shortcut`. Without this, macOS intercepts `CMD+W` as a window-close event before the webview fires.

**CSP:** Since plugins are bundled at build time (no runtime remote fetching), a restrictive policy is appropriate:

```json
"security": {
  "csp": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
}
```

Do not use `unsafe-eval`. Adjust if first-party plugins load remote assets.

---

## Tech Stack

| Layer    | Choice                                                       |
| -------- | ------------------------------------------------------------ |
| Desktop  | Tauri 2                                                      |
| Frontend | React 19 + Vite 7 + TypeScript                               |
| Styling  | Tailwind CSS 4 + shadcn/ui                                   |
| State    | Zustand + localStorage persist (v1; upgrade to SQLite in v2) |
| Build    | Vite 7, npm workspaces                                       |

---

## Keyboard Shortcuts

| Shortcut          | Action                           |
| ----------------- | -------------------------------- |
| `CMD+D`           | Split active panel horizontally  |
| `CMD+Shift+D`     | Split active panel vertically    |
| `CMD+W`           | Close active panel               |
| `CMD+T`           | Open new workspace tab           |
| `CMD+Shift+W`     | Close active workspace tab       |
| `CMD+1` – `CMD+9` | Switch to tab by position        |
| `CMD+S`           | Save current workspace as config |

---

## Implementation Steps

1. **Scaffold** — `npm create tauri@latest` → React + TypeScript template, configure Tailwind 4 + shadcn/ui
2. **Types** — `src/types/panel.ts` + `src/types/workspace.ts` + `src/types/plugin.ts`
3. **Workspace store** — `workspaceStore.ts` (Zustand + persist): workspaces array, active tab, panel ops, saved configs
4. **EmptyState** — fullscreen centered block with keyboard hints
5. **Tab bar** — `TabBar.tsx`: tab list, active indicator, rename, `[+]`, `[×]`
6. **Saved config menu** — `SavedConfigMenu.tsx`: dropdown, save prompt, list, open, delete
7. **Panel components** — `PanelGrid` → `PanelNode` → `Panel` + `Divider` (recursive renderer)
8. **Launcher** — reads plugin registry, lists plugins, calls `setPlugin`
9. **Plugin registry + loader** — reads `note.plugins.json`, dynamic import cache
10. **PluginHost** — loads module, injects `PluginContext`, renders component
11. **Keyboard shortcuts** — global keydown handler in `App.tsx`
12. **Hello plugin** — `plugins/hello/` minimal React component with manifest
13. **Wire it up** — npm workspaces, verify `@note/hello` resolves, end-to-end test

---

## Critical Files

| File                                 | Purpose                                                       |
| ------------------------------------ | ------------------------------------------------------------- |
| `package.json`                       | Root — workspaces, scripts (`tauri dev`, `tauri build`)       |
| `src-tauri/tauri.conf.json`          | Tauri config — app name, window, CSP                          |
| `src-tauri/Cargo.toml`               | Rust deps (tauri 2, tauri-plugin-shell, tauri-plugin-fs)      |
| `src/store/workspaceStore.ts`        | All state — workspaces, panel ops, saved configs              |
| `src/plugins/registry.ts`            | Maps plugin IDs → dynamic import factories                    |
| `src/components/TabBar.tsx`          | Tab strip — workspace switching + new/close tab               |
| `src/components/SavedConfigMenu.tsx` | Save/load/delete named layout configs                         |
| `src/components/PanelGrid.tsx`       | Root component — starts the render tree                       |
| `src/components/EmptyState.tsx`      | Initial fullscreen view                                       |
| `plugins/hello/src/index.tsx`        | PoC plugin — verifies the plugin system works                 |
| `note.plugins.json`                  | Plugin config — single source of truth for registered plugins |

---

## Verification Checklist

### Core shell

- [ ] `npm run tauri dev` starts without errors
- [ ] App opens fullscreen showing tab bar + centered empty-state block

### Tabs

- [ ] `[+]` button and `CMD+T` open a new empty workspace tab
- [ ] Clicking a tab switches the panel layout instantly
- [ ] `[×]` and `CMD+Shift+W` close the active tab
- [ ] Closing the last tab resets to one empty workspace (app does not close)
- [ ] `CMD+1` / `CMD+2` switch between tabs by position
- [ ] Double-clicking a tab label makes it editable inline
- [ ] Tab state (all workspaces) persists across app restarts

### Split panels

- [ ] `CMD+D` splits the active panel into two horizontal panels
- [ ] `CMD+Shift+D` splits the active panel into two vertical panels
- [ ] Panels can be split recursively (3+ levels deep)
- [ ] Dragging the Divider resizes sibling panels proportionally
- [ ] `CMD+W` closes the focused panel; sibling expands to fill
- [ ] Closing the last panel in a tab returns that tab to empty-state

### Plugins

- [ ] Empty panel shows Launcher with `@note/hello` listed
- [ ] Clicking `@note/hello` mounts the Hello World component
- [ ] Plugin assignments survive tab switching

### Saved configs

- [ ] `CMD+S` / "Save current" in the Saved menu prompts for a name
- [ ] Saved config appears in the `[Saved ▾]` dropdown
- [ ] Clicking a saved config opens its layout in a new tab
- [ ] Plugin assignments are restored when a config is loaded
- [ ] A plugin missing from the registry falls back to the Launcher
- [ ] Deleting a saved config removes it from the dropdown
- [ ] Saved configs persist across app restarts
