# Corrections Log

Documents content that was removed or corrected from the project's specification and research files. Original text preserved here for reference.

**Date:** 2026-02-23

---

## 1. SPEC.md — `decorations: false` (critical bug)

**File:** `SPEC.md`
**Section:** Tauri Configuration

**Original text:**

```
Use `"decorations": false` with `"titleBarStyle": "overlay"` (macOS) to get a frameless window
with native traffic lights preserved.
```

**Why it was wrong:** `decorations: false` removes all native window chrome including the traffic lights. For `trafficLightPosition` to work, `decorations` must be `true`. `titleBarStyle: "Overlay"` (capital O — Tauri is case-sensitive) is what causes the webview to fill the full window height with traffic lights overlaid on top. With `decorations: false` you get a completely chromeless window, no traffic lights. Source: `research/tauri2-frameless-window.md`, Tauri issue #13044.

**Corrected to:**

```
Use `"decorations": true` with `"titleBarStyle": "Overlay"` (macOS)
```

---

## 2. SPEC.md — Traffic light padding `~72px` (incorrect value)

**File:** `SPEC.md`
**Section:** Tauri Configuration

**Original text:**

```
the tab bar must leave enough left padding (~72px) to clear them.
```

**Why it was wrong:** The correct value is 80px, calculated from `trafficLightPosition: { x: 14, y: 22 }` as: 14px offset + (3 × 12px buttons) + (2 × 6px gaps) + 18px breathing room = 80px. VS Code and Zed both use 80px. Source: `research/tauri2-frameless-window.md`.

**Corrected to:** `80px`

---

## 3. SPEC.md — Wrong store API: `createStore` does not exist

**File:** `SPEC.md`
**Section:** Persistence — `@tauri-store/zustand`

**Original code:**

```typescript
import { createStore } from "@tauri-store/zustand";

export const useWorkspaceStore = createStore(
  "workspace",
  immer((set, get) => ({
    ...createWorkspaceSlice(set, get),
    ...createPluginSlice(set, get),
  })),
  {
    saveOnChange: true,
    // partialize to exclude functions is handled by @tauri-store/zustand automatically
  },
);
```

**Why it was wrong:** `createStore` is not exported by `@tauri-store/zustand`. The package exports `createTauriStore`. The correct pattern requires two calls: `create<T>()()` (standard Zustand, with middleware) produces the store hook; `createTauriStore(id, store, options)` produces the persistence handler called separately. The comment claiming partialize is handled automatically is also incorrect — you must explicitly provide `filterKeys` + `filterKeysStrategy: "omit"`. Source: `research/tauri-store-zustand.md`.

---

## 4. SPEC.md — Middleware order listed `persist` (not used in this project)

**File:** `SPEC.md`
**Section:** Persistence — Zustand v5 requirements

**Original bullets:**

```
- Apply middleware in this order: `devtools( persist( immer( ...store ) ) )`
- Use `partialize` to exclude action functions from persistence (they serialize to `{}`)
- Provide a custom `merge` function — default shallow merge silently corrupts nested tree state on hydration
```

**Why it was wrong:** This project uses `@tauri-store/zustand` which replaces standard `persist` middleware entirely. The correct middleware chain is `devtools( immer( ...store ) )`. Equivalents in `@tauri-store/zustand`: `filterKeys`/`filterKeysStrategy` replaces `partialize`; `beforeFrontendSync` hook replaces custom `merge`. Source: `research/tauri-store-zustand.md`.

---

## 5. SPEC.md — Panel Node Types: recursive tree, no `parentId`

**File:** `SPEC.md`
**Section:** Panel Node Types

**Original types:**

```typescript
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

**Why it was wrong:** `splitPanel` and `closePanel` both require parent context. With a recursive tree you must traverse from root to find a node's parent — O(n) with fragile implementation. The researched decision (see `research/flat-map-vs-recursive-tree.md`) was to store all nodes in a flat `NodeMap` with `parentId` on each node. This makes every store operation O(1). `children: [PanelNode, PanelNode]` becomes `childIds: [NodeId, NodeId]`.

---

## 6. SPEC.md — Workspace type uses recursive `root: PanelNode | null`

**File:** `SPEC.md`
**Section:** Workspace & Tab State Model

**Original types:**

```typescript
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
```

**Why it was wrong:** Per the flat-map decision (`research/flat-map-vs-recursive-tree.md`), `Workspace` no longer holds the root node directly. It holds `rootId: NodeId | null` and `nodes: NodeMap`. `SavedConfig.snapshot` similarly changes from a `PanelNode` to `{ rootId: NodeId | null; nodes: NodeMap }`.

---

## 7. SPEC.md — `PanelBranch` code uses recursive `node.children`

**File:** `SPEC.md`
**Section:** Resize Handles — `react-resizable-panels` v4

**Original code:**

```tsx
function PanelBranch({ node }: { node: PanelTreeNode }) {
  if (node.type === "leaf") return <LeafPanel node={node} />;
  return (
    <Group ...>
      <Panel id={node.children[0].id} defaultSize={node.sizes[0]} minSize={5}>
        <PanelBranch node={node.children[0]} />
      </Panel>
      <Separator />
      <Panel id={node.children[1].id} defaultSize={node.sizes[1]} minSize={5}>
        <PanelBranch node={node.children[1]} />
      </Panel>
    </Group>
  );
}
```

**Why it was wrong:** Flat-map decision means `PanelSplit` no longer has a `children` property. It has `childIds: [NodeId, NodeId]`. The component signature must also change from passing a node object (which would require carrying the full recursive tree) to passing `nodeId + nodes` (the flat map pattern).

---

## 8. `research/zustand.md` — Wrong `@tauri-store/zustand` API

**File:** `research/zustand.md`
**Section:** Recommended solution: `@tauri-store/zustand`

**Original code:**

```typescript
import { createStore } from '@tauri-store/zustand'

export const useStore = createStore(
  'workspace',
  (set) => ({ workspaces: [], ... }),
  { saveOnChange: true }
)
```

**Why it was removed:** Same root issue as correction #3. `createStore` doesn't exist in the package. Section replaced with a pointer to `research/tauri-store-zustand.md` which has the correct API and full setup guide.

---

## 9. `research/zustand.md` — SQLite migration via `PersistStorage<T>` (inapplicable)

**File:** `research/zustand.md`
**Section:** Recommended solution → Migration path to SQLite (v2)

**Original content:**

```
**Migration path to SQLite (v2):** Zustand `persist` is storage-agnostic. Implement the
`PersistStorage<T>` interface (`getItem`, `setItem`, `removeItem`) wrapping `tauri-plugin-sql`:

const sqliteStorage: PersistStorage<AppState> = {
  getItem: async (name) => { ... },
  setItem: async (name, value) => { ... },
  removeItem: async (name) => { ... },
};

Handle async hydration: check `useStore.persist.hasHydrated()` or use `onFinishHydration`
callback before rendering.
```

**Why it was removed:** This path assumes standard Zustand `persist` middleware is active. The project uses `@tauri-store/zustand` — there is no `persist` instance to replace with a `PersistStorage<T>` adapter. Leaving this in place would send a future maintainer down the wrong implementation path.

---

## 10. `research/zustand.md` — Alternatives Considered section (superseded)

**File:** `research/zustand.md`
**Section:** Alternatives Considered

**Original content:**

```
| Library            | Verdict                                                  |
| Jotai              | atomFamily maps naturally to dynamic panel collections... |
| Valtio             | Circular references will crash. Avoid.                   |
| TanStack Store     | No persist/immer/devtools equivalents yet.               |

Conclusion: Zustand with slices + immer + @tauri-store/zustand is the right path.
```

**Why it was removed:** Decision is made. This section existed to support the selection process and has no implementation value going forward. Removed to keep the document focused on actionable patterns.

---

## 11. `research/react-panel-libraries.md` — Incorrect deletion of `PanelResizeHandle` rename

**File:** `research/react-panel-libraries.md`
**Section:** v4 breaking changes

**What happened:** During initial triage, the line "`PanelResizeHandle` renamed to `Separator`" was incorrectly removed from the v4 breaking changes list. This was a mistake — the rename is confirmed correct by `research/react-resizable-panels-zustand.md` which has a v3→v4 comparison table explicitly listing this change. The line was restored.

**The correct v4 breaking changes are:**

- `PanelGroup` → `Group`
- `PanelResizeHandle` → `Separator`
- `direction=` → `orientation=`
- `onLayout=` → `onLayoutChanged=` (or `onLayoutChange=` per-frame)

---

## 12. `research/index.md` — Stale spec version reference

**File:** `research/index.md`
**Header line:** `**Scope:** Validate and improve architecture decisions in SPEC.md v1.1`

**Corrected to:** v1.2

---

## 13. `research/index.md` — Key Finding #3: inapplicable SQLite migration path

**File:** `research/index.md`
**Section:** Key Finding #3

**Original text:**

```
Migration path to SQLite (v2): Zustand `persist` accepts any `PersistStorage<T>` adapter.
Implement one wrapping `tauri-plugin-sql` with a `kv` table.
```

**Why it was wrong:** Same issue as zustand.md correction #9 above. This migration path only works with standard Zustand `persist`. Since the project uses `@tauri-store/zustand`, there is no `persist` adapter slot.

---

## 14. `research/index.md` — Key Finding #4: `persist` / `partialize` / `merge` references

**File:** `research/index.md`
**Section:** Key Finding #4

**Original text:**

```
- `persist` middleware: must use `partialize` to exclude action functions, and a custom `merge`
  for nested state
- Default shallow merge on hydration silently corrupts nested trees — must provide custom `merge`
- Use `partialize` to exclude all functions from persistence
- Middleware order (required): devtools( persist( immer( ...store ) ) )
```

**Why it was wrong:** All `persist`-specific guidance. With `@tauri-store/zustand`: `partialize` → `filterKeys`/`filterKeysStrategy: "omit"`; custom `merge` → `beforeFrontendSync` hook; middleware order is `devtools( immer( ...store ) )`.
