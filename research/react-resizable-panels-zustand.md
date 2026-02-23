# `react-resizable-panels` v4 + Zustand — Integration Pattern

**Researched:** 2026-02-23
**Package:** `react-resizable-panels` v4.6.5 (published 2026-02-21)
**Scope:** Integrating the panel library with the Zustand binary tree store

---

## Critical: v4 API Changes — SPEC.md Draft Is Out of Date

The SPEC.md `PanelBranch` example uses v3 imports. **These are wrong for v4.6.5:**

| v3 (wrong)               | v4 (correct)                                                             |
| ------------------------ | ------------------------------------------------------------------------ |
| `PanelGroup`             | `Group`                                                                  |
| `PanelResizeHandle`      | `Separator`                                                              |
| `direction="horizontal"` | `orientation="horizontal"`                                               |
| `onLayout={fn}`          | `onLayoutChanged={fn}` (on release) or `onLayoutChange={fn}` (per frame) |

shadcn/ui CLI currently generates v3 code against the v4 package — running `npx shadcn add resizable` will produce TypeScript errors. Patch the generated `resizable.tsx` manually with the v4 names above.

---

## Keying Strategy

**Do NOT add React `key={node.id}` to `Group`.** This would force full DOM remount on every re-render (including every drag frame that writes back to Zustand) — resetting internal size state on every mouse move.

**DO pass `id={node.id}` to `Group`** — this is the library's own ID for its internal storage lookup (only matters if using `autoSaveId`, but good practice for stable identity).

**DO add React `key={activeWorkspaceId}` to the root container in `PanelGrid`.** This forces a full clean remount when switching tabs or loading a saved config, so `defaultSize` values from the new tree are applied fresh.

When `splitPanel` or `closePanel` mutates the Zustand tree, React's natural reconciliation handles remounting correctly — the node type change (leaf → split or split → leaf) causes automatic unmount/remount of the branch without needing explicit keys.

---

## Callbacks: Use `onLayoutChanged`, Not `onLayoutChange`

v4 exposes two callbacks:

- **`onLayoutChange(sizes)`** — fires on every pointer-move frame during drag (60fps). Writing to Zustand here causes React re-renders at 60fps — visible jank.
- **`onLayoutChanged(sizes)`** — fires once when pointer is released. Use this for Zustand writes.

The library handles all DOM resizing internally via direct style mutation. Writing to Zustand only on `onLayoutChanged` gives the correct behavior: store is updated after drag completes.

No debounce needed — `onLayoutChanged` fires at most once per drag.

---

## Sizing: Uncontrolled with `defaultSize`

The library has **no controlled `size` prop** — the author explicitly rejected it ([Issue #58](https://github.com/bvaughn/react-resizable-panels/issues/58)). The design is uncontrolled with imperative override.

- **`defaultSize`** — applied at mount only. Ignored on subsequent renders. Changing this prop after mount has no effect.
- **`groupRef.setLayout([n, m])`** — programmatic override after mount (use for saved config restore if needed, but `key`-based remount is simpler).

**The data flow:**

- Zustand → library: via `defaultSize` at mount time
- Library → Zustand: via `onLayoutChanged` at drag release

Between mount and first `onLayoutChanged`, the store and library may diverge slightly (in-flight drag state). This is expected and harmless — the store catches up on pointer release.

---

## Skip `storage` / `autoSaveId`

Do not use these. The library's own storage would create a second source of truth for sizes that conflicts with Zustand. With `autoSaveId` set, the library's stored layout takes priority over `defaultSize` — Zustand sizes would be silently ignored on remount. `@tauri-store/zustand` is the single persistence layer.

---

## Close Panel (CMD+W) — Pure Tree Mutation, No Ref Needed

When `closePanel(panelId)` removes a node from the Zustand tree, React unmounts the `Group` that contained both panels. The surviving sibling takes 100% of the parent space automatically via flex. No imperative ref call needed.

**Do not** use `panelRef.resize(0)` or `panelRef.collapse()` to "hide" a panel — that keeps it in the DOM. Remove it from the tree entirely.

```typescript
// workspaceStore.ts — closePanel action
closePanel(panelId: string) {
  const ws = activeWorkspace();
  const parent = findParentSplit(ws.root, panelId);
  if (!parent) {
    ws.root = null;           // last panel — return to empty state
    ws.focusedPanelId = null;
    return;
  }
  const survivor = parent.children[0].id === panelId
    ? parent.children[1]
    : parent.children[0];
  replaceNode(ws.root, parent.id, survivor);
  ws.focusedPanelId = findFirstLeaf(survivor).id;
}
```

---

## React 19 Compatibility

No known issues. v4.5.9 replaced `useForceUpdate` with `useSyncExternalStore` — tearing-safe and Strict Mode safe. v4.2.1 fixed a timing issue where newly-registered panels couldn't be immediately targeted by the imperative API (relevant to the split flow).

Strict Mode double-mount (dev only): `Group` initializes twice. `useSyncExternalStore` handles this correctly. You may see `onLayoutChanged` fire once during the second mount with `defaultSize` values — benign, just writes initial sizes back to Zustand.

---

## `Group` Default Styles (v4.3.0+)

`Group` now sets `width: 100%`, `height: 100%`, `overflow: hidden` by default. For full-window tiling this is correct. Ensure all parent containers have explicit heights or the flex tree won't expand — the standard culprit is a `div` with no height on the root.

---

## Recommended `PanelBranch.tsx`

```tsx
import { useRef } from "react";
import {
  Group,
  Panel,
  Separator,
  type PanelGroupImperativeApi,
} from "react-resizable-panels";
import { useWorkspaceStore } from "@/store/workspaceStore";
import type { PanelNode, PanelSplit } from "@/types/panel";

function PanelBranch({ node }: { node: PanelNode }) {
  if (node.type === "leaf") return <LeafPanel node={node} />;
  return <SplitBranch node={node} />;
}

function SplitBranch({ node }: { node: PanelSplit }) {
  const resizeSplit = useWorkspaceStore((s) => s.resizeSplit);
  const groupRef = useRef<PanelGroupImperativeApi>(null);

  return (
    <Group
      id={node.id} // library ID — not React key
      ref={groupRef}
      orientation={node.direction} // v4: "orientation" not "direction"
      onLayoutChanged={(sizes) => {
        // fires once on pointer-release
        resizeSplit(node.id, sizes as [number, number]);
      }}
      style={{ height: "100%", width: "100%" }}
    >
      <Panel id={node.children[0].id} defaultSize={node.sizes[0]} minSize={5}>
        <PanelBranch node={node.children[0]} />
      </Panel>
      <Separator /> {/* v4: Separator not PanelResizeHandle */}
      <Panel id={node.children[1].id} defaultSize={node.sizes[1]} minSize={5}>
        <PanelBranch node={node.children[1]} />
      </Panel>
    </Group>
  );
}
```

## Recommended `PanelGrid.tsx`

```tsx
export function PanelGrid() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const root = useWorkspaceStore(
    (s) => s.workspaces.find((w) => w.id === s.activeWorkspaceId)?.root ?? null,
  );

  if (!root) return <EmptyState />;

  return (
    // key forces clean remount on tab switch or saved config load
    <div key={activeWorkspaceId} style={{ height: "100%", width: "100%" }}>
      <PanelBranch node={root} />
    </div>
  );
}
```

---

## Decision Table

| Decision                   | Choice                                | Reason                                              |
| -------------------------- | ------------------------------------- | --------------------------------------------------- |
| Controlled vs uncontrolled | Uncontrolled (`defaultSize`)          | Library has no `size` prop                          |
| Write-back callback        | `onLayoutChanged`                     | Fires once on release, not per frame                |
| Debounce `onLayoutChanged` | No                                    | Library already throttles it                        |
| `autoSaveId` / `storage`   | Omit                                  | Zustand is the single persistence layer             |
| React `key` on `Group`     | No                                    | Only key the root container on workspace/tab switch |
| Close panel                | Tree mutation only                    | Sibling auto-fills via flex; no ref needed          |
| Saved config load          | `key={activeWorkspaceId}` on root div | Forces remount so `defaultSize` applies fresh       |
| Immer + `sizes` tuple      | Cast to `[number, number]`            | Immer Proxy; TypeScript complains without cast      |

---

## Sources

- [GitHub — bvaughn/react-resizable-panels](https://github.com/bvaughn/react-resizable-panels)
- [CHANGELOG](https://github.com/bvaughn/react-resizable-panels/blob/main/CHANGELOG.md)
- [Issue #58 — controlled size prop rejected](https://github.com/bvaughn/react-resizable-panels/issues/58)
- [Issue #285 — conditional rendering + imperative API](https://github.com/bvaughn/react-resizable-panels/issues/285)
- [shadcn/ui Resizable v4 compat issue #9197](https://github.com/shadcn-ui/ui/issues/9197)
