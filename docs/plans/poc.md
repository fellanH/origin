# note — Proof of Concept: Core Shell

**Goal:** Validate the app's core value proposition before building anything else.
**Scope:** Issues #1, partial #2, partial #3, #4, partial #7, partial #11 — nothing else.

---

## What This PoC Proves

1. Tauri 2 frameless window with macOS traffic lights looks and feels right
2. `react-resizable-panels` v4 integrates cleanly with a Zustand panel tree
3. CMD+D / CMD+Shift+D / CMD+W feel right as keyboard operations
4. The EmptyState → split → close cycle is satisfying to use

The spec's v1 success criteria are: _"panel splitting and keyboard shortcuts work reliably"_ and _"the UX and visual styling feel right"_. This PoC directly answers both.

---

## What's In

| What                                                            | Source issue | Notes                                                  |
| --------------------------------------------------------------- | ------------ | ------------------------------------------------------ |
| Scaffold (Tauri 2 + React 19 + Vite 7 + Tailwind 4 + shadcn/ui) | #1 full      | Must get frameless + traffic lights right              |
| Types: `panel.ts` + minimal `workspace.ts`                      | #2 partial   | Skip `plugin.ts` entirely                              |
| Workspace store — panel ops only, **no persistence**            | #3 partial   | Plain Zustand in-memory; skip `@tauri-store`           |
| EmptyState                                                      | #4 full      |                                                        |
| PanelGrid + PanelBranch + Panel                                 | #7 full      | Panel shows a placeholder div when empty (no Launcher) |
| Keyboard shortcuts: CMD+D, CMD+Shift+D, CMD+W only              | #11 partial  | No CMD+T, CMD+S, CMD+Shift+W yet                       |

---

## What's Out

Everything else. Explicitly:

- **No tabs** — single hardcoded workspace, no TabBar, no SavedConfigMenu
- **No plugin system** — no registry, loader, PluginHost, Launcher, or hello plugin
- **No persistence** — no `@tauri-store/zustand`, no Rust plugin
- **No saved configs**

The PoC code is **not throwaway** — it becomes the foundation for issues #1–#4 and #7. The missing pieces get layered on top.

---

## Store: What to Include

The workspace store for the PoC only needs:

```typescript
interface PoCStore {
  // One implicit workspace (no tabs yet)
  root: PanelNode | null;
  focusedPanelId: string | null;

  // Panel ops
  splitPanel(panelId: string, direction: "horizontal" | "vertical"): void;
  closePanel(panelId: string): void;
  setFocus(panelId: string | null): void;
  resizeSplit(splitId: string, sizes: [number, number]): void;
}
```

Tree traversal helpers needed: `findNode`, `findParent`, `replaceNode` — keep these unexported local functions.

**On the flat map vs recursive tree decision:** Use the recursive `PanelNode` tree (as per SPEC.md). The persistence concern (shallow merge corrupting nested trees) doesn't apply without `@tauri-store`. When persistence is added in issue #3, use the custom `merge` function documented in SPEC.md — no need to change the tree shape.

---

## The Frameless Window — Get This Right First

`src-tauri/tauri.conf.json` critical shape for Tauri 2.10:

```json
{
  "identifier": "com.klarhimmel.note",
  "app": {
    "windows": [
      {
        "title": "note",
        "width": 1200,
        "height": 800,
        "decorations": false,
        "titleBarStyle": "overlay"
      }
    ]
  },
  "security": {
    "csp": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
  }
}
```

- Tab bar needs `pl-[72px]` to clear macOS traffic lights
- Empty space in tab bar (or a spacer div) needs `data-tauri-drag-region`
- `onCloseRequested` in `App.tsx` must call `e.preventDefault()` — prevents CMD+W from closing the window

For the PoC, the "tab bar" is just a simple `<div>` with drag region and the app name — no actual tabs yet.

---

## Panel Components

`react-resizable-panels` v4 note: the roadmap uses `PanelGroup`/`PanelResizeHandle` names — verify actual v4 exports at install time (the spec doc noted the library uses `Group`/`Separator`; check `node_modules` after install).

The divider starts minimal: `w-px bg-border/30 hover:bg-border` — iterate after testing.

`Panel.tsx` for the PoC: if `pluginId !== null`, render a placeholder `<div className="p-4 text-muted-foreground text-sm">Panel: {panelId}</div>`. No Launcher, no plugin host.

---

## Keyboard Shortcuts (PoC subset)

Hook: `src/hooks/useKeyboardShortcuts.ts`

| Shortcut    | Action                                     |
| ----------- | ------------------------------------------ |
| CMD+D       | `splitPanel(focusedPanelId, "horizontal")` |
| CMD+Shift+D | `splitPanel(focusedPanelId, "vertical")`   |
| CMD+W       | `closePanel(focusedPanelId)`               |

All use `event.metaKey` + `event.preventDefault()`. Use `useWorkspaceStore.getState()` inside the handler, not a selector, to avoid stale closures.

Defer CMD+T, CMD+Shift+W, CMD+1–9, CMD+S — those require tabs/plugins.

---

## Files to Create

```
src-tauri/tauri.conf.json          # frameless window, identifier, CSP
src-tauri/Cargo.toml               # tauri 2.10.2, NO tauri-plugin-zustand yet
src-tauri/src/main.rs              # minimal
package.json                       # workspaces: ["plugins/*"], scripts
vite.config.ts                     # @tailwindcss/vite plugin, path alias @/*
tsconfig.json                      # strict: true, paths
src/types/panel.ts                 # PanelLeaf, PanelSplit, PanelNode
src/types/workspace.ts             # PoC-scoped: just root + focusedPanelId
src/store/workspaceStore.ts        # plain Zustand (no @tauri-store)
src/hooks/useKeyboardShortcuts.ts  # CMD+D/Shift+D/W only
src/components/EmptyState.tsx
src/components/PanelGrid.tsx
src/components/PanelBranch.tsx
src/components/Panel.tsx
src/App.tsx                        # drag region header + PanelGrid
src/main.tsx                       # React entry
src/index.css                      # Tailwind 4 @import
```

---

## Done When

- [ ] `npm run tauri:dev` starts without errors
- [ ] App opens: frameless, traffic lights visible, drag region works
- [ ] Empty state centered with keyboard hints
- [ ] CMD+D splits into two horizontal panels
- [ ] CMD+Shift+D splits into two vertical panels
- [ ] Panels can be split recursively (3+ levels)
- [ ] Dragging the handle resizes sibling panels
- [ ] CMD+W closes the focused panel; sibling expands
- [ ] Closing the last panel returns to EmptyState
- [ ] CMD+W does NOT close the window
- [ ] Focused panel has a subtle focus ring; unfocused panels have none
- [ ] Clicking a panel gives it focus

---

## What to Build Next (after PoC)

Once the PoC passes its checklist, implement the remaining issues in order:

1. **#3 upgrade** — Add `@tauri-store/zustand` persistence (expand the minimal PoC store)
2. **#5 TabBar** — Multiple workspaces
3. **#9 + #12** — Plugin registry + hello plugin
4. **#8 Launcher** — Plugin selection UI
5. **#10 PluginHost** — Load + mount plugins with error boundary
6. **#6 SavedConfigMenu** — Save/load layout configs
7. **#11 upgrade** — Add CMD+T, CMD+Shift+W, CMD+1–9, CMD+S
8. **#13 Wire up** — End-to-end verification pass
