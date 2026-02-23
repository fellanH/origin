> Archived 2026-02-23. GitHub issues are authoritative: https://github.com/fellanH/note/issues

# note — MVP v1 Roadmap

> GitHub issues source of truth. All issues target the `fellanH/note` repo, milestone `MVP v1`.

---

## Labels to Create

| Label           | Color     | Description                     |
| --------------- | --------- | ------------------------------- |
| `foundation`    | `#0075ca` | Scaffold, types, infrastructure |
| `ui`            | `#e4e669` | Visual components               |
| `core`          | `#d73a4a` | Core functionality              |
| `state`         | `#0052cc` | State management                |
| `plugin-system` | `#5319e7` | Plugin infrastructure           |
| `dx`            | `#f9d0c4` | Developer experience            |

**Milestone:** `MVP v1`

---

## Issue Dependency Graph

```
#1 Scaffold
  └─► #2 Types
        └─► #3 Store ──────────────────────────────────┐
              ├─► #5 TabBar                             │
              │     └─► #6 SavedConfigMenu              │
              └─► #7 Panel components ◄── #4 EmptyState │
                    ├─► #8 Launcher ◄─── #9 Registry ◄─┘
                    └─► #10 PluginHost ◄─ #9
                          └─► #11 Keyboard shortcuts
                                └─► #12 Hello plugin
                                      └─► #13 Wire up
```

---

## Issue #1 — Scaffold: Tauri 2 + React 19 + Vite 7 + Tailwind 4 + shadcn/ui

**Labels:** `foundation` | **Size:** M | **No dependencies**

````markdown
## What to build

Bootstrap the project using `npm create tauri@latest` (React + TypeScript template), then configure the full frontend stack.

### Acceptance criteria

- [ ] `npm create tauri@latest` run with React + TypeScript template
- [ ] Tauri pinned to `2.10.2` in `Cargo.toml`
- [ ] App identifier set to `com.klarhimmel.note` in `tauri.conf.json`
- [ ] Frameless window with native traffic lights:
  ```json
  "windows": [{ "decorations": true, "titleBarStyle": "Overlay" }]
  ```
  (`decorations: true` keeps traffic lights. `titleBarStyle: "Overlay"` — capital O, Tauri is case-sensitive. See corrections.md #1.)
````

- [ ] Tailwind CSS 4 installed (NOT v3 — breaking changes; use `tailwind-v4-shadcn` skill for exact config)
- [ ] shadcn/ui initialised (`npx shadcn@latest init`) targeting Tailwind 4 CSS variables path
- [ ] CSP configured:
  ```json
  "security": { "csp": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'" }
  ```
- [ ] npm workspaces in root `package.json`: `"workspaces": ["plugins/*"]`
- [ ] Root scripts: `"tauri:dev": "tauri dev"`, `"tauri:build": "tauri build"`
- [ ] `tsconfig.json`: `"strict": true`, path alias `"@/*": ["./src/*"]`
- [ ] `App.tsx` renders a visible "note" heading — confirms stack boots
- [ ] `npm run tauri:dev` starts without errors

### Technical notes

- Tailwind v4 uses `@import "tailwindcss"` — do NOT use `@tailwind base/components/utilities` (v3 syntax)
- `decorations: true` + `titleBarStyle: "Overlay"` gives Arc-style frameless window on macOS; traffic lights overlaid at top-left
- Tab bar must have `pl-[80px]` left padding to clear the macOS traffic light cluster (see corrections.md #2)
- Do NOT add `tauri-plugin-global-shortcut` — all shortcuts use webview `keydown` (see #11)
- Target Tauri 2.10.2 only — Tauri 3 is not released

### Files

- `src-tauri/tauri.conf.json`
- `src-tauri/Cargo.toml`
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `src/App.tsx`

````

---

## Issue #2 — Types: PanelNode, Workspace, Plugin contracts

**Labels:** `foundation`, `core` | **Size:** XS | **Blocked by:** #1

```markdown
## What to build

Define all shared TypeScript types. No logic — types only.

### Acceptance criteria

- [ ] `src/types/panel.ts`:
  ```ts
  export type NodeId = string; // crypto.randomUUID() at creation time
  export type PanelLeaf = {
    type: "leaf";
    id: NodeId;
    parentId: NodeId | null; // null = this node is the root
    pluginId: string | null;
  };
  export type PanelSplit = {
    type: "split";
    id: NodeId;
    parentId: NodeId | null; // null = this node is the root
    direction: "horizontal" | "vertical";
    sizes: [number, number]; // percentages, sum = 100
    childIds: [NodeId, NodeId]; // replaces children: [PanelNode, PanelNode]
  };
  export type PanelNode = PanelLeaf | PanelSplit;
  export type NodeMap = Record<NodeId, PanelNode>;
  // All nodes live in Workspace.nodes. Parent context is O(1): nodes[node.parentId].
  ```
  (Flat map — see research/flat-map-vs-recursive-tree.md and corrections.md #5.)
````

- [ ] `src/types/workspace.ts`:
  ```ts
  export interface Workspace {
    id: string;
    name: string;
    rootId: NodeId | null; // null = empty state
    nodes: NodeMap; // flat map: all PanelNodes indexed by id
    focusedPanelId: NodeId | null;
  }
  export interface SavedConfig {
    id: string;
    name: string;
    snapshot: { rootId: NodeId | null; nodes: NodeMap } | null;
    savedAt: string;
  }
  export interface WorkspaceStore {
    workspaces: Workspace[];
    activeWorkspaceId: string;
    workspacePath: string; // resolved at startup via Tauri path plugin
    addWorkspace(): void;
    closeWorkspace(id: string): void;
    setActiveWorkspace(id: string): void;
    renameWorkspace(id: string, name: string): void;
    splitPanel(panelId: NodeId, direction: "horizontal" | "vertical"): void;
    closePanel(panelId: NodeId): void;
    setPlugin(panelId: NodeId, pluginId: string): void;
    resizeSplit(splitId: NodeId, sizes: [number, number]): void;
    setFocus(panelId: NodeId | null): void;
    setWorkspacePath(path: string): void;
    savedConfigs: SavedConfig[];
    saveConfig(name: string): void;
    loadConfig(configId: string): void;
    deleteConfig(configId: string): void;
  }
  ```
- [ ] `src/types/plugin.ts`:
  ```ts
  export interface PluginManifest {
    id: string;
    name: string;
    version: string;
    description: string;
    icon?: string;
  }
  export interface PluginContext {
    panelId: string;
    workspacePath: string;
    theme: "light" | "dark";
  }
  export type PluginComponent = React.ComponentType<{ context: PluginContext }>;
  export interface PluginModule {
    manifest: PluginManifest;
    default: PluginComponent;
  }
  ```
- [ ] `tsc --noEmit` passes with zero errors

### Technical notes

- IDs are generated via `crypto.randomUUID()` in the store, not in types
- Flat map: `parentId` on every node enables O(1) parent lookup in `splitPanel`/`closePanel` — no root traversal needed
- `workspacePath` is in `WorkspaceStore` so PluginHost can inject it into every panel context
- `sizes` always sums to 100 — the store enforces this invariant, not the type system

````

---

## Issue #3 — Store: Zustand v5 workspace store with file-backed persistence

**Labels:** `state`, `core` | **Size:** L | **Blocked by:** #2

```markdown
## What to build

Central Zustand v5 store using `@tauri-store/zustand` for file-backed persistence (NOT localStorage — origin instability in Tauri dev/prod).

### Acceptance criteria

- [ ] `@tauri-store/zustand` (npm) and `tauri-plugin-zustand` (Rust) installed
- [ ] `src-tauri/Cargo.toml`: `tauri-plugin-zustand = "2"`
- [ ] `src-tauri/src/main.rs`: `.plugin(tauri_plugin_zustand::init())`
- [ ] `src/store/workspaceStore.ts` using `createStore` from `@tauri-store/zustand`
- [ ] Slices pattern: `createWorkspaceSlice` + `createPluginSlice` in separate files; middleware only at combined boundary
- [ ] Middleware order (mandatory): `immer` innermost
  ```ts
  createStore("workspace", immer((...args) => ({
    ...createWorkspaceSlice(...args),
    ...createPluginSlice(...args),
  })), { saveOnChange: true })
````

- [ ] Workspace slice implements all `WorkspaceStore` actions:
  - `splitPanel`: replace leaf with `PanelSplit` [50,50]; new empty leaf gets focus
  - `closePanel`: sibling expands; sibling gets focus; if was root → `root = null`
  - `closeWorkspace`: if last tab, reset to one empty workspace — never close app
  - `saveConfig`: deep clone active workspace root into `SavedConfig`
  - `loadConfig`: new workspace tab with cloned snapshot
- [ ] Plugin slice: `pluginRegistry: { [id: string]: PluginModule }`, `registerPlugin`, `getPlugin`
- [ ] Custom merge for hydration (shallow merge corrupts recursive PanelNode trees)
- [ ] `partialize` excludes function-valued keys from persistence
- [ ] Tree traversal helpers (local, unexported): `findNode`, `findParent`, `replaceNode`
- [ ] Initial state: one workspace "Workspace 1", `root: null`
- [ ] Store hydration check exposed so `App.tsx` can gate rendering

### Technical notes

- Zustand v5: named import only — `import { create } from "zustand"`
- `useShallow` required for selectors returning derived objects: `import { useShallow } from "zustand/react/shallow"`
- Use `useWorkspaceStore.getState()` inside event handlers to avoid stale closure issues
- `@tauri-store/zustand` writes to OS app data dir — bypasses origin/port issues entirely

### Files

- `src/store/workspaceStore.ts`
- `src/store/workspaceSlice.ts`
- `src/store/pluginSlice.ts`
- `src-tauri/Cargo.toml`
- `src-tauri/src/main.rs`

````

---

## Issue #4 — EmptyState component

**Labels:** `ui` | **Size:** XS | **Blocked by:** #1

```markdown
## What to build

Fullscreen centered component shown when a workspace has no panels (`root === null`).

### Acceptance criteria

- [ ] `src/components/EmptyState.tsx` — no props
- [ ] Fills container: `h-full w-full flex items-center justify-center`
- [ ] Shows app name "note" + keyboard hints:
````

⌘D Split →
⌘⇧D Split ↓
⌘T New tab

```
- [ ] Uses Unicode `⌘` and `⇧` (not text "Cmd"/"Shift")
- [ ] shadcn/ui CSS vars: `text-muted-foreground` for hints, `text-foreground` for name
- [ ] No borders, shadows, or background — shell disappears
- [ ] Pure presentational — no store reads
```

---

## Issue #5 — TabBar: workspace tabs, rename, add, close

**Labels:** `ui`, `core` | **Size:** M | **Blocked by:** #3

```markdown
## What to build

The window's title bar. Frameless, native macOS traffic lights overlaid at left. Tabs run right of traffic lights. Renders `[Saved ▾]` on the right.

### Layout
```

[●●●]──[ Workspace 1 ×]──[ Workspace 2 ×]──[+]──[Saved ▾]──<drag region>

```

### Acceptance criteria

- [ ] `src/components/TabBar.tsx`
- [ ] `pl-[72px]` left padding to clear macOS traffic lights
- [ ] `data-tauri-drag-region` on spacer divs ONLY (NOT on tab buttons — must be clickable)
- [ ] One tab per workspace: label, active indicator, `×` close button
- [ ] `×` button: `group-hover:opacity-100 opacity-0` (visible only on tab hover)
- [ ] Clicking tab → `setActiveWorkspace(id)`; `×` → `closeWorkspace(id)`
- [ ] `[+]` button → `addWorkspace()`
- [ ] Double-click tab label → inline `<input>` (local `isEditing` + `draftName` useState); Enter/blur → `renameWorkspace(id, name)`
- [ ] `[Saved ▾]` slot renders `<SavedConfigMenu />`
- [ ] `useShallow` for multi-field store selectors
- [ ] Do NOT use shadcn/ui `Tabs` component (that is for content tabs)

### Files

- `src/components/TabBar.tsx`
- `src/App.tsx` — mount TabBar above PanelGrid
```

---

## Issue #6 — SavedConfigMenu: save, list, load, delete configs

**Labels:** `ui`, `core` | **Size:** M | **Blocked by:** #3, #5

```markdown
## What to build

Dropdown menu anchored to `[Saved ▾]` in the tab bar. Save layouts, list, open, delete.

### Acceptance criteria

- [ ] `src/components/SavedConfigMenu.tsx` using shadcn/ui `DropdownMenu`
- [ ] Install: `npx shadcn@latest add dropdown-menu`
- [ ] `[Saved ▾]` trigger (NOT a drag region)
- [ ] "Save current": inline form in dropdown; empty name disabled; calls `saveConfig(name)`
- [ ] Config list: name + `Intl.DateTimeFormat` formatted date; click → `loadConfig(configId)`
- [ ] Hover entry → `×` delete button → `deleteConfig(configId)`
- [ ] Empty state: "No saved configs"
- [ ] Dropdown closes after any action
- [ ] CMD+S handled in #11 — uses `window.prompt` for name (simplest v1 approach)
```

---

## Issue #7 — Panel components: PanelGrid, PanelBranch, Panel

**Labels:** `ui`, `core` | **Size:** L | **Blocked by:** #3, #4

````markdown
## What to build

Recursive panel rendering chain using `react-resizable-panels` for drag/resize. Do NOT implement resize from scratch.

Install: `npm install react-resizable-panels`

### PanelGrid (`src/components/PanelGrid.tsx`)

- Reads active workspace from store
- `root === null` → `<EmptyState />`; else → `<PanelBranch node={root} />`
- `flex-1 h-full`

### PanelBranch (`src/components/PanelBranch.tsx`)

- `leaf` → `<Panel node={node} />`
- `split` →
  ```tsx
  <PanelGroup
    direction={node.direction}
    onLayout={(s) => resizeSplit(node.id, s as [number, number])}
  >
    <Panel defaultSize={node.sizes[0]}>
      <PanelBranch node={node.children[0]} />
    </Panel>
    <PanelResizeHandle className="w-px bg-border/30 hover:bg-border transition-colors" />
    <Panel defaultSize={node.sizes[1]}>
      <PanelBranch node={node.children[1]} />
    </Panel>
  </PanelGroup>
  ```
````

- `key` = `node.id` (stable UUID — never array index)
- Verify installed version: v4 uses `PanelResizeHandle` (not `Separator`)

### Panel (`src/components/Panel.tsx`)

- `React.memo` applied
- Click → `setFocus(node.id)`
- Focused: `ring-1 ring-accent`; unfocused: no ring
- `pluginId !== null` → `<PluginHost />`; else → `<Launcher />`

### Technical notes

- Divider: 1px, low-contrast at rest, hover to reveal — start minimal, iterate after testing
- `onLayout` fires on every drag tick — this is intentional
- PanelGroup + Panel from `react-resizable-panels` is different from Panel.tsx leaf component — don't confuse naming

````

---

## Issue #8 — Launcher: plugin selection UI for empty panels

**Labels:** `ui`, `plugin-system` | **Size:** S | **Blocked by:** #7, #9

```markdown
## What to build

UI shown inside empty panels (`pluginId === null`). Lists registered plugins; clicking one mounts it.

### Acceptance criteria

- [ ] `src/components/Launcher.tsx` — accepts `{ panelId: string }`
- [ ] Reads `Object.values(s.pluginRegistry)` from store
- [ ] Each entry: icon (emoji or placeholder) + name + description
- [ ] Click → `setPlugin(panelId, plugin.id)`
- [ ] Empty state: "No plugins available"
- [ ] Minimal styling — no card borders or heavy backgrounds
````

---

## Issue #9 — Plugin registry and loader

**Labels:** `plugin-system`, `core` | **Size:** M | **Blocked by:** #2, #3

````markdown
## What to build

Static plugin registry + caching loader. V1 is build-time only — all plugins must be present at build time.

### Acceptance criteria

- [ ] `note.plugins.json` at project root:
  ```json
  { "plugins": [{ "id": "com.note.hello", "package": "@note/hello" }] }
  ```
````

- [ ] `src/plugins/registry.ts`: static `Map<string, () => Promise<PluginModule>>`

  ```ts
  export const pluginRegistry = new Map([
    ["com.note.hello", () => import("@note/hello") as Promise<PluginModule>],
  ]);
  ```

  - `getPluginManifests()` helper for startup pre-warming

- [ ] `src/plugins/loader.ts`: in-memory cache, `loadPlugin(id)` with `PluginNotFoundError`
- [ ] `vite.config.ts` alias: `"@note/hello": path.resolve(__dirname, "plugins/hello/src/index.tsx")`
- [ ] On startup: pre-warm manifests → call `registerPlugin` on store → Launcher lists them synchronously

### Technical notes

- V1 limitation: Vite statically analyses `import("@note/hello")` at build time — all plugins must be in the registry at build time. Adding a plugin requires a rebuild.
- `note.plugins.json` is the human-editable source of truth; `registry.ts` must be kept in sync manually in v1.
- V2 runtime loading architecture researched: import maps + embedded axum server — see `research/vite-plugin-loading.md`

````

---

## Issue #10 — PluginHost: load, mount, and isolate plugin components

**Labels:** `plugin-system`, `core` | **Size:** M | **Blocked by:** #9, #7

```markdown
## What to build

Component that loads a plugin module and renders it with PluginContext, wrapped in an Error Boundary.

### Acceptance criteria

- [ ] `src/components/PluginHost.tsx` — accepts `{ pluginId: string; panelId: string }`
- [ ] Loading state: spinner or "Loading…"
- [ ] On success: renders `plugin.default` with PluginContext:
  ```ts
  { panelId, workspacePath: useWorkspaceStore.getState().workspacePath, theme }
````

- [ ] `theme`: reads `window.matchMedia("(prefers-color-scheme: dark)")` with `change` listener
- [ ] On load error: inline error state (plugin ID + error message)
- [ ] Wrapped in `PluginErrorBoundary` (React class component):
  - Catches plugin render errors; shows "[plugin id] error: [message]"
  - Other panels completely unaffected

````

---

## Issue #11 — Keyboard shortcuts: global keydown handler

**Labels:** `core`, `dx` | **Size:** S | **Blocked by:** #3

```markdown
## What to build

`src/hooks/useKeyboardShortcuts.ts` — registers/removes `window` keydown listener. All shortcuts call `event.preventDefault()`.

Do NOT use `tauri-plugin-global-shortcut` — fires when backgrounded, macOS double-fire bug (`tauri#10025`).

### Shortcuts

| Shortcut | Action |
|---|---|
| CMD+D | `splitPanel(focusedPanelId, "horizontal")` |
| CMD+Shift+D | `splitPanel(focusedPanelId, "vertical")` |
| CMD+W | `closePanel(focusedPanelId)` |
| CMD+T | `addWorkspace()` |
| CMD+Shift+W | `closeWorkspace(activeWorkspaceId)` |
| CMD+1–9 | `setActiveWorkspace(workspaces[n-1].id)` (no-op if out of bounds) |
| CMD+S | `window.prompt` for name → `saveConfig(name)` |

### Additional requirements

- [ ] Use `event.metaKey` (CMD), `event.shiftKey`, `event.key`
- [ ] Use `useWorkspaceStore.getState()` inside handler (avoids stale closures)
- [ ] `onCloseRequested` in `App.tsx`:
  ```ts
  getCurrentWindow().onCloseRequested((e) => e.preventDefault())
````

Prevents OS/traffic light from closing the window

### Technical notes

- CMD+W: webview `preventDefault()` intercepts before macOS can close the window
- `onCloseRequested` handles Tauri-level close events (red traffic light, etc.)

````

---

## Issue #12 — Hello plugin: @note/hello reference implementation

**Labels:** `plugin-system`, `dx` | **Size:** S | **Blocked by:** #2, #9

```markdown
## What to build

Minimal plugin in `plugins/hello/`. The component is trivial — the extensive inline documentation is the deliverable. This is the canonical reference for plugin authors.

### Acceptance criteria

- [ ] `plugins/hello/package.json`: `{ "name": "@note/hello", "version": "1.0.0", "main": "src/index.tsx", "private": true }`
- [ ] `plugins/hello/src/manifest.ts`: `PluginManifest` with `id: "com.note.hello"`, `icon: "👋"`
- [ ] `plugins/hello/src/index.tsx`:
  - Re-exports `manifest`
  - Default exports React component displaying `panelId`, `theme`, `workspacePath` from context
  - Extensive inline comments covering:
    - Every `PluginContext` field and its purpose
    - `PluginManifest` fields and where they're displayed (Launcher)
    - `PluginModule` interface (why both `manifest` and `default` must be exported)
    - That plugins are plain React components — no base class or registration needed
- [ ] `plugins/hello/tsconfig.json` extends root tsconfig
- [ ] Satisfies `PluginModule` interface: `{ manifest, default }`
````

---

## Issue #13 — Wire it up: npm workspaces, vite alias, end-to-end verification

**Labels:** `foundation`, `dx` | **Size:** S | **Blocked by:** #1–#12

````markdown
## What to build

Final integration pass. Verify everything works end-to-end against the full SPEC.md checklist.

### Acceptance criteria

#### Integration

- [ ] `npm list @note/hello` confirms workspace resolution
- [ ] Vite alias in `vite.config.ts` confirmed
- [ ] `App.tsx` final composition:
  ```tsx
  function App() {
    useKeyboardShortcuts();
    return (
      <div className="flex flex-col h-screen bg-background text-foreground">
        <TabBar />
        <PanelGrid />
      </div>
    );
  }
  ```
````

- [ ] Startup init: `appDataDir()` from `@tauri-apps/api/path` → `setWorkspacePath()` before render
- [ ] Hydration gate: main UI not rendered until `@tauri-store/zustand` has hydrated

#### End-to-end checklist (all must pass)

**Core shell**

- [ ] `npm run tauri:dev` starts without errors
- [ ] App opens with tab bar + centered empty-state block

**Tabs**

- [ ] `[+]` and CMD+T open a new empty workspace tab
- [ ] Clicking a tab switches panel layout instantly
- [ ] `[×]` and CMD+Shift+W close the active tab
- [ ] Closing the last tab resets to one empty workspace (app does not close)
- [ ] CMD+1 / CMD+2 switch tabs by position
- [ ] Double-click tab label → editable inline
- [ ] Tab state persists across app restarts

**Split panels**

- [ ] CMD+D splits into two horizontal panels
- [ ] CMD+Shift+D splits into two vertical panels
- [ ] Recursive splits work (3+ levels deep)
- [ ] Dragging the divider resizes sibling panels
- [ ] CMD+W closes focused panel; sibling expands
- [ ] Closing the last panel returns tab to empty-state

**Plugins**

- [ ] Empty panel shows Launcher with `@note/hello` listed
- [ ] Clicking `@note/hello` mounts the Hello World component
- [ ] Plugin assignments survive tab switching
- [ ] Crashing plugin shows inline error; other panels unaffected
- [ ] CMD+W does NOT close the window when panels are open

**Saved configs**

- [ ] CMD+S prompts for name and saves
- [ ] Saved config appears in `[Saved ▾]` dropdown
- [ ] Clicking a config opens it in a new tab
- [ ] Plugin assignments restored on load
- [ ] Missing plugin falls back to Launcher
- [ ] Deleting config removes it from dropdown
- [ ] Saved configs persist across app restarts

#### Production build

- [ ] `npm run tauri:build` succeeds
- [ ] Persistence works in the production build (critical — different origin from dev)

Failing items → create follow-up bug issues; do not block closing this issue.

````

---

## Setup Commands

```bash
# Labels
gh label create foundation --color 0075ca --repo fellanH/note --description "Scaffold, types, infrastructure"
gh label create ui --color e4e669 --repo fellanH/note --description "Visual components"
gh label create core --color d73a4a --repo fellanH/note --description "Core functionality"
gh label create state --color 0052cc --repo fellanH/note --description "State management"
gh label create plugin-system --color 5319e7 --repo fellanH/note --description "Plugin infrastructure"
gh label create dx --color f9d0c4 --repo fellanH/note --description "Developer experience"

# Milestone
gh api repos/fellanH/note/milestones -f title="MVP v1" -f state=open

# Issues created sequentially with gh issue create (see individual bodies above)
````
