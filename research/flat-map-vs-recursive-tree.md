# Panel State: Flat Map vs Recursive Tree

**Researched:** 2026-02-23
**Decision:** **Flat map with parentId** — replaces recursive tree in SPEC v1.2

---

## The Problem with Recursive Trees

The two core panel operations — `splitPanel` and `closePanel` — both require **parent traversal**. With a recursive tree you have no path back up from a node:

```typescript
// Recursive tree — you cannot find a node's parent without traversal from root
function findParent(
  root: PanelNode,
  targetId: string,
): { node: PanelSplit; childIndex: 0 | 1 } | null {
  if (root.type !== "split") return null;
  for (let i = 0; i < 2; i++) {
    if (root.children[i].id === targetId)
      return { node: root, childIndex: i as 0 | 1 };
    const found = findParent(root.children[i], targetId);
    if (found) return found;
  }
  return null;
}
```

**`closePanel` is even harder** — you need the parent AND the grandparent (to promote the sibling):

```typescript
// closePanel with recursive tree: O(n) traversal twice, easy to get wrong
function closePanel(root: PanelNode, panelId: string): PanelNode | null {
  // Must find parent, find sibling, then find grandparent...
  // This recursive function is ~40 lines and error-prone
}
```

**Root cause:** Recursive trees encode topology implicitly. Mutations that need parent context require root traversal — O(n), and the implementation is fragile.

---

## Flat Map Solution

Store all nodes in a `Record<string, PanelNode>` with `parentId` on each node. Parent context is O(1) — just `nodes[node.parentId]`.

### Updated Types

```typescript
// src/types/panel.ts

type NodeId = string;

type PanelLeaf = {
  type: "leaf";
  id: NodeId;
  parentId: NodeId | null; // null = root
  pluginId: string | null;
};

type PanelSplit = {
  type: "split";
  id: NodeId;
  parentId: NodeId | null; // null = root
  direction: "horizontal" | "vertical";
  sizes: [number, number]; // percentages, sum = 100
  childIds: [NodeId, NodeId]; // replaces children: [PanelNode, PanelNode]
};

type PanelNode = PanelLeaf | PanelSplit;
type NodeMap = Record<NodeId, PanelNode>;
```

```typescript
// src/types/workspace.ts

interface Workspace {
  id: string;
  name: string;
  rootId: NodeId | null; // null = empty state (replaces root: PanelNode | null)
  nodes: NodeMap; // flat map (new)
  focusedPanelId: NodeId | null;
}

interface SavedConfig {
  id: string;
  name: string;
  snapshot: { rootId: NodeId | null; nodes: NodeMap } | null;
  savedAt: string;
}
```

### Key Operations (immer pseudocode)

**`splitPanel(panelId, direction)`** — O(1):

```typescript
splitPanel(panelId, direction) {
  set(draft => {
    const ws = activeWorkspace(draft);
    const leaf = ws.nodes[panelId] as PanelLeaf;
    const parentId = leaf.parentId;

    const newLeafId = crypto.randomUUID();
    const newSplitId = crypto.randomUUID();

    // Create split node replacing the leaf
    ws.nodes[newSplitId] = {
      type: "split", id: newSplitId, parentId,
      direction, sizes: [50, 50], childIds: [panelId, newLeafId],
    };
    // New empty sibling
    ws.nodes[newLeafId] = {
      type: "leaf", id: newLeafId, parentId: newSplitId, pluginId: null,
    };
    // Update original leaf's parent
    ws.nodes[panelId].parentId = newSplitId;

    // Patch grandparent reference
    if (parentId === null) {
      ws.rootId = newSplitId;
    } else {
      const parent = ws.nodes[parentId] as PanelSplit;
      const idx = parent.childIds.indexOf(panelId) as 0 | 1;
      parent.childIds[idx] = newSplitId;
    }

    ws.focusedPanelId = newLeafId; // focus new sibling
  });
}
```

**`closePanel(panelId)`** — O(1):

```typescript
closePanel(panelId) {
  set(draft => {
    const ws = activeWorkspace(draft);
    const leaf = ws.nodes[panelId];
    const parentSplitId = leaf.parentId;

    // Closing the only panel → empty state
    if (parentSplitId === null) {
      delete ws.nodes[panelId];
      ws.rootId = null;
      ws.focusedPanelId = null;
      return;
    }

    const parent = ws.nodes[parentSplitId] as PanelSplit;
    const siblingId = parent.childIds.find(id => id !== panelId)!;
    const grandParentId = parent.parentId;

    // Promote sibling — update its parentId
    ws.nodes[siblingId].parentId = grandParentId;

    // Patch grandparent reference
    if (grandParentId === null) {
      ws.rootId = siblingId;
    } else {
      const gp = ws.nodes[grandParentId] as PanelSplit;
      const idx = gp.childIds.indexOf(parentSplitId) as 0 | 1;
      gp.childIds[idx] = siblingId;
    }

    delete ws.nodes[panelId];
    delete ws.nodes[parentSplitId];
    ws.focusedPanelId = siblingId;
  });
}
```

**`resizeSplit(splitId, sizes)`** — O(1):

```typescript
resizeSplit(splitId, sizes) {
  set(draft => {
    const ws = activeWorkspace(draft);
    (ws.nodes[splitId] as PanelSplit).sizes = sizes;
  });
}
```

### React Render

Pass `nodeId` + `nodes` instead of the node itself:

```tsx
// PanelBranch.tsx
function PanelBranch({ nodeId, nodes }: { nodeId: NodeId; nodes: NodeMap }) {
  const node = nodes[nodeId];
  if (node.type === "leaf") return <LeafPanel node={node} />;
  return (
    <PanelGroup
      direction={node.direction}
      onLayout={(sizes) => resizeSplit(node.id, [sizes[0], sizes[1]])}
    >
      <Panel defaultSize={node.sizes[0]}>
        <PanelBranch nodeId={node.childIds[0]} nodes={nodes} />
      </Panel>
      <PanelResizeHandle />
      <Panel defaultSize={node.sizes[1]}>
        <PanelBranch nodeId={node.childIds[1]} nodes={nodes} />
      </Panel>
    </PanelGroup>
  );
}

// PanelGrid.tsx — entry point
function PanelGrid() {
  const { rootId, nodes } = useWorkspaceStore(
    useShallow((s) => ({
      rootId: s.workspaces[s.activeIdx].rootId,
      nodes: s.workspaces[s.activeIdx].nodes,
    })),
  );
  if (!rootId) return <EmptyState />;
  return <PanelBranch nodeId={rootId} nodes={nodes} />;
}
```

---

## Comparison

| Aspect               | Recursive tree                                | Flat map (chosen)                  |
| -------------------- | --------------------------------------------- | ---------------------------------- |
| `splitPanel`         | Complex — recursive findParent needed         | Simple — O(1) parentId lookup      |
| `closePanel`         | Very complex — parent + grandparent traversal | Simple — O(1) at each level        |
| `resizeSplit`        | Works with immer                              | O(1) direct access                 |
| React render         | Naturally recursive                           | nodeId + nodes, equally clean      |
| Zustand persist      | Works; deep hydration needs custom merge      | Flat `Record` — serializes cleanly |
| `beforeFrontendSync` | Needs recursive deserialize                   | Flat map reconstruction is trivial |
| Type complexity      | Simpler (no parentId, childIds)               | Slightly more fields               |
| SavedConfig snapshot | Serialize tree                                | Serialize `{ rootId, nodes }`      |

**Winner: flat map.** The type complexity increase is small; the operational simplicity gain is large. Every store method becomes O(1) and straightforward.

---

## Spec Impact

This decision updates SPEC.md § "Panel Node Types" and § "Workspace & Tab State Model":

- `PanelSplit.children: [PanelNode, PanelNode]` → `PanelSplit.childIds: [NodeId, NodeId]`
- `PanelSplit.parentId: NodeId | null` and `PanelLeaf.parentId: NodeId | null` — new fields
- `Workspace.root: PanelNode | null` → `Workspace.rootId: NodeId | null` + `Workspace.nodes: NodeMap`
- `SavedConfig.snapshot: PanelNode | null` → `SavedConfig.snapshot: { rootId: NodeId | null; nodes: NodeMap } | null`
- `beforeFrontendSync` hook in `@tauri-store/zustand` is simpler — flat map reconstruction vs recursive deserialization

No changes to `PanelLeaf` fields other than `parentId`. No changes to `WorkspaceStore` method signatures. All store actions remain the same names.
