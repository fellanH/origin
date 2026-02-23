# Naming Convention: Panels → Cards

## Conceptual Overview

In Origin, a **card** is any slot in the layout tree that can hold a plugin. The workspace is the origin — the fixed outer container — and every slot inside it is a card. Cards can be split to produce two new cards side by side, closed to collapse back into their sibling, focused to receive keyboard input, and filled with any plugin. The word "card" applies strictly to **leaf nodes** (plugin slots). The internal structure that holds two cards together after a split is called a **split** (or a **split node**) — it is a layout mechanism, not a user-visible concept, so it does not need a user-facing rename. This keeps the mental model simple: users interact with cards; the split machinery is an implementation detail.

---

## Rename Table

| Current name                              | New name                                  | Scope                                         | Notes                                                                                                                 |
| ----------------------------------------- | ----------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `PanelNode` (type union)                  | `CardNode`                                | `src/types/card.ts`                           | Union of `CardLeaf \| CardSplit`. File renamed from `panel.ts` to `card.ts`.                                          |
| `PanelLeaf` (type)                        | `CardLeaf`                                | `src/types/card.ts`                           | The user-visible leaf node — this is what a "card" is.                                                                |
| `PanelSplit` (type)                       | `CardSplit`                               | `src/types/card.ts`                           | Internal layout container. Renamed for consistency with `CardNode`, not for user visibility.                          |
| `NodeMap` (type)                          | `CardMap`                                 | `src/types/card.ts`                           | `Record<NodeId, CardNode>`. The name "NodeMap" was always internal jargon; "CardMap" is self-documenting.             |
| `NodeId` (type alias)                     | `CardId`                                  | `src/types/card.ts`                           | Cleaner name; every node in the tree is a card ID.                                                                    |
| `PanelGrid` (component)                   | `CardLayout`                              | `src/components/CardLayout.tsx`               | The root layout component. "Grid" implied a 2D grid; the real structure is a binary split tree. "Layout" is accurate. |
| `PanelBranch` (component)                 | `CardTree`                                | `src/components/CardTree.tsx`                 | Recursive renderer that walks the `CardMap`. "Branch" exposed internals; "Tree" is still accurate but friendlier.     |
| `LeafPanel` (component)                   | `Card`                                    | `src/components/Card.tsx`                     | The leaf component is the card from the user's perspective. This is the primary rename.                               |
| `splitPanel` (store action)               | `splitCard`                               | `workspaceStore.ts`                           | Splits a card into two.                                                                                               |
| `closePanel` (store action)               | `closeCard`                               | `workspaceStore.ts`                           | Closes a card and promotes its sibling.                                                                               |
| `addInitialPanel` (store action)          | `addInitialCard`                          | `workspaceStore.ts`                           | Seeds the first card into an empty workspace.                                                                         |
| `setPlugin` (store action)                | `setPlugin`                               | `workspaceStore.ts`                           | No rename — this is plugin-facing, not panel/card-facing.                                                             |
| `focusedPanelId` (state field)            | `focusedCardId`                           | `workspaceStore.ts`, `src/types/workspace.ts` | Field on `Workspace` and in store actions (`setFocus` parameter).                                                     |
| `panelId` (prop on `PluginContext`)       | `cardId`                                  | `plugins/api/src/plugin.ts`                   | **Breaking change for plugin authors.** See migration note below.                                                     |
| `panelId` (prop on `EmptyState`)          | `cardId`                                  | `src/components/EmptyState.tsx`               | Internal component prop.                                                                                              |
| `panelId` (local variable in `LeafPanel`) | `cardId`                                  | Becomes `Card.tsx`                            | Local usage only.                                                                                                     |
| `// ── Panel actions ──` (comment)        | `// ── Card actions ──`                   | `workspaceStore.ts`                           | Comment banner.                                                                                                       |
| `key={activeWorkspaceId}` on `PanelGrid`  | `key={activeWorkspaceId}` on `CardLayout` | `App.tsx`                                     | The key pattern stays; the component name changes.                                                                    |
| `aria-label="Close panel"`                | `aria-label="Close card"`                 | `Card.tsx`                                    | Accessibility label.                                                                                                  |

### What does NOT change

| Name                                                                             | Reason                                                                                                                                      |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `workspacePath` on `PluginContext`                                               | Unrelated to panel/card rename — refers to filesystem path.                                                                                 |
| `Workspace`, `WorkspaceId`, `WorkspaceStore`                                     | "Workspace" is the tab concept, not the panel concept. Stays as-is.                                                                         |
| `SavedConfig`, `saveConfig`, `loadConfig`, `deleteConfig`                        | Config system is workspace-level, not card-level.                                                                                           |
| `resizeSplit` (store action)                                                     | Operates on a split node, not a card. The verb "resize" + noun "split" is already precise.                                                  |
| `splitId` (parameter to `resizeSplit`)                                           | Same as above — this is the split node's ID, not a card ID.                                                                                 |
| `PluginManifest`, `PluginComponent`, `PluginModule`, `PluginHost`                | Plugin system naming is correct and unaffected.                                                                                             |
| `pluginId` (all usages)                                                          | Plugin-system identifier, not a panel/card concept.                                                                                         |
| `react-resizable-panels` internal names (`Group`, `ResizablePanel`, `Separator`) | Third-party library. Internal alias `ResizablePanel` in `PanelBranch.tsx` remains as an import alias — renamed file becomes `CardTree.tsx`. |
| `ResizablePanel`, `ResizablePanelGroup`, `ResizableHandle` in `resizable.tsx`    | shadcn/ui generated wrapper — keep as-is; these are UI primitive wrappers, not domain names.                                                |
| `addWorkspace`, `closeWorkspace`, `renameWorkspace`, `setActiveWorkspace`        | Workspace tab actions.                                                                                                                      |
| `pendingSaveName`, `appDataDir`, `setAppDataDir`, `setPendingSaveName`           | Infrastructure state.                                                                                                                       |

---

## Rules

1. **"Card" = leaf node only.** Do not call a split node a card in user-facing copy, comments, or types. A card is the thing that holds a plugin.

2. **"Split" stays "split" internally.** `CardSplit`, `splitCard`, `resizeSplit` are the correct names. Do not call a split node a "deck", "frame", or "group" — those terms imply a user-facing concept that does not exist yet.

3. **File rename follows component rename.** When `LeafPanel.tsx` → `Card.tsx`, the file moves. Same for `PanelGrid.tsx` → `CardLayout.tsx` and `PanelBranch.tsx` → `CardTree.tsx`. The type file `src/types/panel.ts` → `src/types/card.ts`.

4. **Store action naming: verb + Card.** Pattern: `splitCard`, `closeCard`, `addInitialCard`, `focusedCardId`. Parameters that were `panelId` become `cardId`.

5. **`PluginContext.panelId` → `PluginContext.cardId` is a breaking change.** This is the only change that affects plugin authors. All plugins that destructure `context.panelId` must be updated. The `@origin/api` package version must be bumped to reflect this break.

6. **`CLAUDE.md` architecture table.** Update the "Panel state model" row to reference `CardMap` + `parentId`. Update the `key={activeWorkspaceId}` gotcha to reference `CardLayout`. Update the `PanelGrid` critical gotcha entry.

7. **Test files follow the code.** `workspaceStore.test.ts` uses `splitPanel`, `closePanel`, `PanelLeaf`, `PanelSplit`, `focusedPanelId` extensively. All test descriptions and type references must be updated alongside the implementation.

---

## Migration Notes for Plugin Authors

### Breaking change: `PluginContext.panelId` renamed to `PluginContext.cardId`

**Before (current API):**

```ts
// @origin/api — current
export interface PluginContext {
  panelId: string; // <-- this field is being renamed
  workspacePath: string;
  theme: "light" | "dark";
}
```

**After (new API):**

```ts
// @origin/api — post-rename
export interface PluginContext {
  cardId: string; // <-- renamed from panelId
  workspacePath: string;
  theme: "light" | "dark";
}
```

**Impact:** Any plugin component that reads `context.panelId` will need to be updated to `context.cardId`. TypeScript will catch this at compile time if the plugin is built against the updated `@origin/api`.

**Suggested update in plugin code:**

```ts
// Before
export default function MyPlugin({ context }: { context: PluginContext }) {
  const { panelId, workspacePath, theme } = context;
  // ...
}

// After
export default function MyPlugin({ context }: { context: PluginContext }) {
  const { cardId, workspacePath, theme } = context;
  // ...
}
```

**Version bump:** `@origin/api` must move from `0.x` to `0.(x+1)` (or to `1.0.0` if treating the public API as stable). The changelog must call out `panelId → cardId` as a breaking change.

**Affected built-in plugins:**

- `plugins/hello/` — uses `PluginContext` type; must update if it reads `panelId` (currently does not destructure it, but the type import will error at build time).
- `plugins/template/` — same as above.

---

## Implementation Order

Recommended sequence to minimize cascading TypeScript errors during the migration:

1. **Types first** — rename `src/types/panel.ts` → `src/types/card.ts`, update all type names (`PanelLeaf` → `CardLeaf`, etc.), update `src/types/workspace.ts` import.
2. **Plugin API** — update `plugins/api/src/plugin.ts` (`panelId` → `cardId`), bump `@origin/api` version.
3. **Store** — update `workspaceStore.ts` action names, field names, and imports from the renamed type file.
4. **Components** — rename files and update component names: `LeafPanel.tsx` → `Card.tsx`, `PanelBranch.tsx` → `CardTree.tsx`, `PanelGrid.tsx` → `CardLayout.tsx`. Update all imports across `App.tsx`, `EmptyState.tsx`, `PluginHost.tsx`.
5. **Tests** — update `workspaceStore.test.ts` type imports and test descriptions.
6. **Docs and config** — update `CLAUDE.md` architecture table, this document, `SPEC.md`, `STANDARDS.md`, and any remaining prose references.
7. **Built-in plugins** — update `plugins/hello/` and `plugins/template/` to use `cardId`.
