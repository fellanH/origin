/**
 * workspaceStore — Phase 1 (PoC) tests
 *
 * Tests the flat CardMap card operations: splitCard, closeCard, resizeSplit, setFocus.
 * Also tests workspace tab operations: addWorkspace, closeWorkspace, setActiveWorkspace,
 * switchToLastWorkspace, renameWorkspace, saveConfig, loadConfig, deleteConfig.
 * Store shape: { workspaces, activeWorkspaceId } — multi-workspace with persistence mock.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { useWorkspaceStore } from "./workspaceStore";
import type { CardLeaf, CardSplit } from "../types/card";
import type { Workspace } from "../types/workspace";

vi.mock("@tauri-store/zustand", () => ({
  createTauriStore: vi.fn().mockReturnValue({
    start: vi.fn().mockResolvedValue(undefined),
    save: vi.fn().mockResolvedValue(undefined),
    saveNow: vi.fn().mockResolvedValue(undefined),
  }),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeLeaf(id: string, parentId: string | null = null): CardLeaf {
  return { id, type: "leaf", parentId, pluginId: null };
}

function makeSplit(
  id: string,
  childIds: [string, string],
  parentId: string | null = null,
  direction: "horizontal" | "vertical" = "horizontal",
): CardSplit {
  return { id, type: "split", parentId, childIds, direction, sizes: [50, 50] };
}

function get() {
  const store = useWorkspaceStore.getState();
  const ws = store.workspaces.find((w) => w.id === store.activeWorkspaceId)!;
  return { ...store, ...ws };
}

function setWorkspace(
  patch: Partial<Pick<Workspace, "rootId" | "nodes" | "focusedCardId">>,
) {
  useWorkspaceStore.setState((state) => ({
    workspaces: state.workspaces.map((w) =>
      w.id === state.activeWorkspaceId ? { ...w, ...patch } : w,
    ),
  }));
}

// ---------------------------------------------------------------------------
// Reset between tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  setWorkspace({ rootId: null, nodes: {}, focusedCardId: null });
});

// ---------------------------------------------------------------------------
// splitCard
// ---------------------------------------------------------------------------

describe("splitCard", () => {
  it("creates a split node and a new leaf sibling from a single root leaf", () => {
    const leaf = makeLeaf("root-leaf");
    setWorkspace({
      rootId: "root-leaf",
      nodes: { "root-leaf": leaf },
      focusedCardId: "root-leaf",
    });

    get().splitCard("root-leaf", "horizontal");

    const { rootId, nodes } = get();
    expect(Object.keys(nodes)).toHaveLength(3);

    const root = nodes[rootId!] as CardSplit;
    expect(root.type).toBe("split");
    expect(root.parentId).toBeNull();
    expect(root.childIds).toHaveLength(2);
    expect(root.sizes).toEqual([50, 50]);

    const [firstId, secondId] = root.childIds;
    expect(nodes[firstId].parentId).toBe(root.id);
    expect(nodes[secondId].parentId).toBe(root.id);
  });

  it("sets focusedCardId to the new sibling leaf after split", () => {
    const leaf = makeLeaf("root-leaf");
    setWorkspace({
      rootId: "root-leaf",
      nodes: { "root-leaf": leaf },
      focusedCardId: "root-leaf",
    });

    get().splitCard("root-leaf", "horizontal");

    const { rootId, nodes, focusedCardId } = get();
    const root = nodes[rootId!] as CardSplit;
    const sibling = root.childIds.find((id) => id !== "root-leaf")!;
    expect(focusedCardId).toBe(sibling);
  });

  it("splits vertically when direction is 'vertical'", () => {
    const leaf = makeLeaf("root-leaf");
    setWorkspace({
      rootId: "root-leaf",
      nodes: { "root-leaf": leaf },
      focusedCardId: "root-leaf",
    });

    get().splitCard("root-leaf", "vertical");

    const { rootId, nodes } = get();
    const root = nodes[rootId!] as CardSplit;
    expect(root.direction).toBe("vertical");
  });

  it("patches grandparent's childIds when splitting a non-root leaf", () => {
    const leafA = makeLeaf("leafA", "root-split");
    const leafB = makeLeaf("leafB", "root-split");
    const rootSplit = makeSplit("root-split", ["leafA", "leafB"]);
    setWorkspace({
      rootId: "root-split",
      nodes: { "root-split": rootSplit, leafA, leafB },
      focusedCardId: "leafA",
    });

    get().splitCard("leafA", "horizontal");

    const { nodes, rootId } = get();
    const root = nodes[rootId!] as CardSplit;
    // root's first childId must now be the new split wrapper (not leafA directly)
    expect(root.childIds[0]).not.toBe("leafA");
    const newSplit = nodes[root.childIds[0]] as CardSplit;
    expect(newSplit.type).toBe("split");
    expect(newSplit.parentId).toBe("root-split");
    expect(newSplit.childIds).toContain("leafA");
    expect(nodes["leafA"].parentId).toBe(newSplit.id);
  });

  it("supports 3 levels of nesting without corrupting parentId chains", () => {
    const leaf = makeLeaf("leaf0");
    setWorkspace({
      rootId: "leaf0",
      nodes: { leaf0: leaf },
      focusedCardId: "leaf0",
    });

    get().splitCard("leaf0", "horizontal");
    const sibling1 = get().focusedCardId!;
    get().splitCard(sibling1, "horizontal");

    const { nodes, rootId } = get();
    for (const [id, node] of Object.entries(nodes)) {
      if (id === rootId) {
        expect(node.parentId).toBeNull();
      } else {
        expect(node.parentId).not.toBeNull();
        expect(nodes[node.parentId!]).toBeDefined();
      }
    }
  });

  it("does nothing when cardId does not exist in nodes", () => {
    setWorkspace({
      rootId: null,
      nodes: {},
      focusedCardId: null,
    });

    expect(() => get().splitCard("nonexistent", "horizontal")).not.toThrow();

    expect(Object.keys(get().nodes)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// closeCard
// ---------------------------------------------------------------------------

describe("closeCard", () => {
  it("resets to empty state when closing the only card", () => {
    const leaf = makeLeaf("root-leaf");
    setWorkspace({
      rootId: "root-leaf",
      nodes: { "root-leaf": leaf },
      focusedCardId: "root-leaf",
    });

    get().closeCard("root-leaf");

    const { rootId, nodes, focusedCardId } = get();
    expect(rootId).toBeNull();
    expect(Object.keys(nodes)).toHaveLength(0);
    expect(focusedCardId).toBeNull();
  });

  it("promotes left sibling to root when closing the right child", () => {
    const leafA = makeLeaf("leafA", "root-split");
    const leafB = makeLeaf("leafB", "root-split");
    const rootSplit = makeSplit("root-split", ["leafA", "leafB"]);
    setWorkspace({
      rootId: "root-split",
      nodes: { "root-split": rootSplit, leafA, leafB },
      focusedCardId: "leafB",
    });

    get().closeCard("leafB");

    const { rootId, nodes } = get();
    expect(rootId).toBe("leafA");
    expect(nodes["leafA"].parentId).toBeNull();
    expect(Object.keys(nodes)).toHaveLength(1);
  });

  it("promotes right sibling to root when closing the left child", () => {
    const leafA = makeLeaf("leafA", "root-split");
    const leafB = makeLeaf("leafB", "root-split");
    const rootSplit = makeSplit("root-split", ["leafA", "leafB"]);
    setWorkspace({
      rootId: "root-split",
      nodes: { "root-split": rootSplit, leafA, leafB },
      focusedCardId: "leafA",
    });

    get().closeCard("leafA");

    const { rootId, nodes } = get();
    expect(rootId).toBe("leafB");
    expect(nodes["leafB"].parentId).toBeNull();
    expect(Object.keys(nodes)).toHaveLength(1);
  });

  it("promotes sibling up one level for a non-root close", () => {
    const leafA = makeLeaf("leafA", "root-split");
    const leafB = makeLeaf("leafB", "nested-split");
    const leafC = makeLeaf("leafC", "nested-split");
    const nestedSplit = makeSplit(
      "nested-split",
      ["leafB", "leafC"],
      "root-split",
    );
    const rootSplit = makeSplit("root-split", ["leafA", "nested-split"]);
    setWorkspace({
      rootId: "root-split",
      nodes: {
        "root-split": rootSplit,
        leafA,
        "nested-split": nestedSplit,
        leafB,
        leafC,
      },
      focusedCardId: "leafB",
    });

    get().closeCard("leafB");

    const { nodes } = get();
    expect(nodes["leafC"]).toBeDefined();
    expect(nodes["leafC"].parentId).toBe("root-split");
    const root = nodes["root-split"] as CardSplit;
    expect(root.childIds).toContain("leafC");
    // nestedSplit and leafB must be deleted
    expect(nodes["nested-split"]).toBeUndefined();
    expect(nodes["leafB"]).toBeUndefined();
    expect(Object.keys(nodes)).toHaveLength(3); // root-split, leafA, leafC
  });

  it("handles closing a card when sibling is itself a split node", () => {
    const leafA = makeLeaf("leafA", "root-split");
    const leafB1 = makeLeaf("leafB1", "splitB");
    const leafB2 = makeLeaf("leafB2", "splitB");
    const splitB = makeSplit("splitB", ["leafB1", "leafB2"], "root-split");
    const rootSplit = makeSplit("root-split", ["leafA", "splitB"]);
    setWorkspace({
      rootId: "root-split",
      nodes: { "root-split": rootSplit, leafA, splitB, leafB1, leafB2 },
      focusedCardId: "leafA",
    });

    get().closeCard("leafA");

    const { rootId, nodes } = get();
    expect(rootId).toBe("splitB");
    const root = nodes["splitB"] as CardSplit;
    expect(root.parentId).toBeNull();
    // splitB's childIds and sizes must be unchanged
    expect(root.childIds).toEqual(["leafB1", "leafB2"]);
    expect(root.sizes).toEqual([50, 50]);
  });

  it("sets focusedCardId to the promoted sibling after close", () => {
    const leafA = makeLeaf("leafA", "root-split");
    const leafB = makeLeaf("leafB", "root-split");
    const rootSplit = makeSplit("root-split", ["leafA", "leafB"]);
    setWorkspace({
      rootId: "root-split",
      nodes: { "root-split": rootSplit, leafA, leafB },
      focusedCardId: "leafA",
    });

    get().closeCard("leafA");

    expect(get().focusedCardId).toBe("leafB");
  });

  it("does nothing when cardId does not exist in nodes", () => {
    const leaf = makeLeaf("root-leaf");
    setWorkspace({
      rootId: "root-leaf",
      nodes: { "root-leaf": leaf },
      focusedCardId: "root-leaf",
    });

    expect(() => get().closeCard("nonexistent")).not.toThrow();

    expect(Object.keys(get().nodes)).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// resizeSplit
// ---------------------------------------------------------------------------

describe("resizeSplit", () => {
  it("updates sizes on the target split node", () => {
    const leafA = makeLeaf("leafA", "root-split");
    const leafB = makeLeaf("leafB", "root-split");
    const rootSplit = makeSplit("root-split", ["leafA", "leafB"]);
    setWorkspace({
      rootId: "root-split",
      nodes: { "root-split": rootSplit, leafA, leafB },
      focusedCardId: "leafA",
    });

    get().resizeSplit("root-split", [30, 70]);

    const split = get().nodes["root-split"] as CardSplit;
    expect(split.sizes).toEqual([30, 70]);
  });

  it("does not affect childIds, direction, or parentId", () => {
    const leafA = makeLeaf("leafA", "root-split");
    const leafB = makeLeaf("leafB", "root-split");
    const rootSplit = makeSplit(
      "root-split",
      ["leafA", "leafB"],
      null,
      "vertical",
    );
    setWorkspace({
      rootId: "root-split",
      nodes: { "root-split": rootSplit, leafA, leafB },
      focusedCardId: "leafA",
    });

    get().resizeSplit("root-split", [40, 60]);

    const split = get().nodes["root-split"] as CardSplit;
    expect(split.childIds).toEqual(["leafA", "leafB"]);
    expect(split.direction).toBe("vertical");
    expect(split.parentId).toBeNull();
    expect(split.sizes).toEqual([40, 60]);
  });

  it("does nothing when splitId does not exist", () => {
    setWorkspace({
      rootId: null,
      nodes: {},
      focusedCardId: null,
    });

    expect(() => get().resizeSplit("nonexistent", [40, 60])).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// setFocus
// ---------------------------------------------------------------------------

describe("setFocus", () => {
  it("sets focusedCardId to the given cardId", () => {
    const leaf = makeLeaf("leaf1");
    setWorkspace({
      rootId: "leaf1",
      nodes: { leaf1: leaf },
      focusedCardId: null,
    });

    get().setFocus("leaf1");

    expect(get().focusedCardId).toBe("leaf1");
  });

  it("accepts null to clear focus", () => {
    const leaf = makeLeaf("leaf1");
    setWorkspace({
      rootId: "leaf1",
      nodes: { leaf1: leaf },
      focusedCardId: "leaf1",
    });

    get().setFocus(null);

    expect(get().focusedCardId).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// CardMap invariants — cross-cutting
// ---------------------------------------------------------------------------

describe("CardMap invariants", () => {
  function reachableIds(
    nodes: ReturnType<typeof get>["nodes"],
    rootId: string | null,
  ): Set<string> {
    if (!rootId) return new Set();
    const visited = new Set<string>();
    const queue = [rootId];
    while (queue.length > 0) {
      const id = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      const node = nodes[id];
      if (node?.type === "split") {
        queue.push(...(node as CardSplit).childIds);
      }
    }
    return visited;
  }

  it("every non-root node's parentId points to an existing node after a series of splits", () => {
    const leaf = makeLeaf("leaf0");
    setWorkspace({
      rootId: "leaf0",
      nodes: { leaf0: leaf },
      focusedCardId: "leaf0",
    });

    get().splitCard("leaf0", "horizontal");
    const sibling1 = get().focusedCardId!;
    get().splitCard(sibling1, "vertical");
    get().splitCard("leaf0", "horizontal");

    const { nodes, rootId } = get();
    for (const [id, node] of Object.entries(nodes)) {
      if (id === rootId) {
        expect(node.parentId).toBeNull();
      } else {
        expect(node.parentId).not.toBeNull();
        expect(nodes[node.parentId!]).toBeDefined();
      }
    }
  });

  it("every non-root node's parentId points to an existing node after split + close sequence", () => {
    const leaf = makeLeaf("leaf0");
    setWorkspace({
      rootId: "leaf0",
      nodes: { leaf0: leaf },
      focusedCardId: "leaf0",
    });

    get().splitCard("leaf0", "horizontal");
    const sibling = get().focusedCardId!;
    get().splitCard("leaf0", "vertical");
    get().closeCard(sibling);

    const { nodes, rootId } = get();
    for (const [id, node] of Object.entries(nodes)) {
      if (id === rootId) {
        expect(node.parentId).toBeNull();
      } else {
        expect(node.parentId).not.toBeNull();
        expect(nodes[node.parentId!]).toBeDefined();
      }
    }
  });

  it("split node's childIds both exist in the map", () => {
    const leaf = makeLeaf("leaf0");
    setWorkspace({
      rootId: "leaf0",
      nodes: { leaf0: leaf },
      focusedCardId: "leaf0",
    });

    get().splitCard("leaf0", "horizontal");
    get().splitCard("leaf0", "vertical");

    const { nodes } = get();
    for (const node of Object.values(nodes)) {
      if (node.type === "split") {
        for (const childId of (node as CardSplit).childIds) {
          expect(nodes[childId]).toBeDefined();
        }
      }
    }
  });

  it("no orphaned nodes remain after close", () => {
    const leaf = makeLeaf("leaf0");
    setWorkspace({
      rootId: "leaf0",
      nodes: { leaf0: leaf },
      focusedCardId: "leaf0",
    });

    get().splitCard("leaf0", "horizontal");
    const sibling = get().focusedCardId!;
    get().splitCard(sibling, "vertical");
    const deepSibling = get().focusedCardId!;
    get().closeCard(deepSibling);

    const { nodes, rootId } = get();
    const reachable = reachableIds(nodes, rootId);
    expect(new Set(Object.keys(nodes))).toEqual(reachable);
  });
});

// ---------------------------------------------------------------------------
// addWorkspace
// ---------------------------------------------------------------------------

describe("addWorkspace", () => {
  beforeEach(() => {
    // Reset to a single clean workspace before each tab-level test
    useWorkspaceStore.setState({
      workspaces: [
        {
          id: "default",
          name: "Workspace 1",
          rootId: null,
          nodes: {},
          focusedCardId: null,
        },
      ],
      activeWorkspaceId: "default",
      lastWorkspaceId: null,
    });
  });

  it("appends a new workspace and makes it active", () => {
    get().addWorkspace();

    const { workspaces, activeWorkspaceId } = useWorkspaceStore.getState();
    expect(workspaces).toHaveLength(2);
    expect(activeWorkspaceId).toBe(workspaces[1].id);
  });

  it("names the new workspace using the next sequential number", () => {
    get().addWorkspace();

    const { workspaces } = useWorkspaceStore.getState();
    expect(workspaces[1].name).toBe("Workspace 2");
  });

  it("increments name based on current length, not a persistent counter", () => {
    // Add two workspaces so length becomes 3
    get().addWorkspace();
    get().addWorkspace();

    const { workspaces } = useWorkspaceStore.getState();
    expect(workspaces[2].name).toBe("Workspace 3");
  });

  it("starts the new workspace with an empty card tree", () => {
    get().addWorkspace();

    const { workspaces } = useWorkspaceStore.getState();
    const newWs = workspaces[1];
    expect(newWs.rootId).toBeNull();
    expect(newWs.nodes).toEqual({});
    expect(newWs.focusedCardId).toBeNull();
  });

  it("assigns a unique id to each new workspace", () => {
    get().addWorkspace();
    get().addWorkspace();

    const { workspaces } = useWorkspaceStore.getState();
    const ids = workspaces.map((w) => w.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ---------------------------------------------------------------------------
// closeWorkspace
// ---------------------------------------------------------------------------

describe("closeWorkspace", () => {
  beforeEach(() => {
    useWorkspaceStore.setState({
      workspaces: [
        {
          id: "default",
          name: "Workspace 1",
          rootId: null,
          nodes: {},
          focusedCardId: null,
        },
      ],
      activeWorkspaceId: "default",
      lastWorkspaceId: null,
    });
  });

  it("edge case: closing the only workspace resets to one fresh empty workspace", () => {
    get().closeWorkspace("default");

    const { workspaces, activeWorkspaceId } = useWorkspaceStore.getState();
    expect(workspaces).toHaveLength(1);
    expect(workspaces[0].name).toBe("Workspace 1");
    expect(workspaces[0].rootId).toBeNull();
    expect(workspaces[0].nodes).toEqual({});
    // The new id must differ from the old one
    expect(workspaces[0].id).not.toBe("default");
    expect(activeWorkspaceId).toBe(workspaces[0].id);
  });

  it("edge case: closing the active tab activates the previous (left) tab", () => {
    // Build: ws1 (default) | ws2 | ws3 — active is ws3 (idx 2)
    useWorkspaceStore.setState({
      workspaces: [
        {
          id: "ws1",
          name: "Workspace 1",
          rootId: null,
          nodes: {},
          focusedCardId: null,
        },
        {
          id: "ws2",
          name: "Workspace 2",
          rootId: null,
          nodes: {},
          focusedCardId: null,
        },
        {
          id: "ws3",
          name: "Workspace 3",
          rootId: null,
          nodes: {},
          focusedCardId: null,
        },
      ],
      activeWorkspaceId: "ws3",
      lastWorkspaceId: null,
    });

    get().closeWorkspace("ws3");

    const { workspaces, activeWorkspaceId } = useWorkspaceStore.getState();
    expect(workspaces).toHaveLength(2);
    // Previous tab (idx 1 after removal, was idx 1 before) should be active
    expect(activeWorkspaceId).toBe("ws2");
  });

  it("edge case: closing the first active tab falls back to the next tab (idx 0)", () => {
    // Build: ws1 | ws2 — active is ws1 (idx 0)
    useWorkspaceStore.setState({
      workspaces: [
        {
          id: "ws1",
          name: "Workspace 1",
          rootId: null,
          nodes: {},
          focusedCardId: null,
        },
        {
          id: "ws2",
          name: "Workspace 2",
          rootId: null,
          nodes: {},
          focusedCardId: null,
        },
      ],
      activeWorkspaceId: "ws1",
      lastWorkspaceId: null,
    });

    get().closeWorkspace("ws1");

    const { workspaces, activeWorkspaceId } = useWorkspaceStore.getState();
    expect(workspaces).toHaveLength(1);
    expect(activeWorkspaceId).toBe("ws2");
  });

  it("closing a non-active workspace does not change activeWorkspaceId", () => {
    useWorkspaceStore.setState({
      workspaces: [
        {
          id: "ws1",
          name: "Workspace 1",
          rootId: null,
          nodes: {},
          focusedCardId: null,
        },
        {
          id: "ws2",
          name: "Workspace 2",
          rootId: null,
          nodes: {},
          focusedCardId: null,
        },
      ],
      activeWorkspaceId: "ws1",
      lastWorkspaceId: null,
    });

    get().closeWorkspace("ws2");

    const { workspaces, activeWorkspaceId } = useWorkspaceStore.getState();
    expect(workspaces).toHaveLength(1);
    expect(activeWorkspaceId).toBe("ws1");
  });

  it("does nothing when the id does not exist", () => {
    get().closeWorkspace("nonexistent");

    const { workspaces, activeWorkspaceId } = useWorkspaceStore.getState();
    expect(workspaces).toHaveLength(1);
    expect(activeWorkspaceId).toBe("default");
  });
});

// ---------------------------------------------------------------------------
// setActiveWorkspace / switchToLastWorkspace
// ---------------------------------------------------------------------------

describe("setActiveWorkspace", () => {
  beforeEach(() => {
    useWorkspaceStore.setState({
      workspaces: [
        {
          id: "ws1",
          name: "Workspace 1",
          rootId: null,
          nodes: {},
          focusedCardId: null,
        },
        {
          id: "ws2",
          name: "Workspace 2",
          rootId: null,
          nodes: {},
          focusedCardId: null,
        },
        {
          id: "ws3",
          name: "Workspace 3",
          rootId: null,
          nodes: {},
          focusedCardId: null,
        },
      ],
      activeWorkspaceId: "ws1",
      lastWorkspaceId: null,
    });
  });

  it("sets activeWorkspaceId to the given id", () => {
    get().setActiveWorkspace("ws2");

    expect(useWorkspaceStore.getState().activeWorkspaceId).toBe("ws2");
  });

  it("stores the previous activeWorkspaceId in lastWorkspaceId", () => {
    get().setActiveWorkspace("ws2");

    expect(useWorkspaceStore.getState().lastWorkspaceId).toBe("ws1");
  });

  it("updates lastWorkspaceId on successive switches", () => {
    get().setActiveWorkspace("ws2");
    get().setActiveWorkspace("ws3");

    const state = useWorkspaceStore.getState();
    expect(state.activeWorkspaceId).toBe("ws3");
    expect(state.lastWorkspaceId).toBe("ws2");
  });
});

describe("switchToLastWorkspace", () => {
  beforeEach(() => {
    useWorkspaceStore.setState({
      workspaces: [
        {
          id: "ws1",
          name: "Workspace 1",
          rootId: null,
          nodes: {},
          focusedCardId: null,
        },
        {
          id: "ws2",
          name: "Workspace 2",
          rootId: null,
          nodes: {},
          focusedCardId: null,
        },
      ],
      activeWorkspaceId: "ws2",
      lastWorkspaceId: "ws1",
    });
  });

  it("swaps activeWorkspaceId and lastWorkspaceId (toggle)", () => {
    get().switchToLastWorkspace();

    const state = useWorkspaceStore.getState();
    expect(state.activeWorkspaceId).toBe("ws1");
    expect(state.lastWorkspaceId).toBe("ws2");
  });

  it("calling it twice returns to the original state", () => {
    get().switchToLastWorkspace();
    get().switchToLastWorkspace();

    const state = useWorkspaceStore.getState();
    expect(state.activeWorkspaceId).toBe("ws2");
    expect(state.lastWorkspaceId).toBe("ws1");
  });

  it("does nothing when lastWorkspaceId is null", () => {
    useWorkspaceStore.setState({ lastWorkspaceId: null });

    get().switchToLastWorkspace();

    expect(useWorkspaceStore.getState().activeWorkspaceId).toBe("ws2");
  });

  it("does nothing when only one workspace exists", () => {
    useWorkspaceStore.setState({
      workspaces: [
        {
          id: "ws1",
          name: "Workspace 1",
          rootId: null,
          nodes: {},
          focusedCardId: null,
        },
      ],
      activeWorkspaceId: "ws1",
      lastWorkspaceId: "ws1",
    });

    get().switchToLastWorkspace();

    expect(useWorkspaceStore.getState().activeWorkspaceId).toBe("ws1");
  });

  it("does nothing when lastWorkspaceId points to a workspace that no longer exists", () => {
    useWorkspaceStore.setState({ lastWorkspaceId: "ghost-id" });

    get().switchToLastWorkspace();

    expect(useWorkspaceStore.getState().activeWorkspaceId).toBe("ws2");
  });
});

// ---------------------------------------------------------------------------
// renameWorkspace
// ---------------------------------------------------------------------------

describe("renameWorkspace", () => {
  beforeEach(() => {
    useWorkspaceStore.setState({
      workspaces: [
        {
          id: "ws1",
          name: "Workspace 1",
          rootId: null,
          nodes: {},
          focusedCardId: null,
        },
      ],
      activeWorkspaceId: "ws1",
      lastWorkspaceId: null,
    });
  });

  it("updates the workspace name", () => {
    get().renameWorkspace("ws1", "My Dashboard");

    const ws = useWorkspaceStore
      .getState()
      .workspaces.find((w) => w.id === "ws1")!;
    expect(ws.name).toBe("My Dashboard");
  });

  it("does nothing when the id does not exist", () => {
    expect(() =>
      get().renameWorkspace("nonexistent", "New Name"),
    ).not.toThrow();

    // The real workspace is unchanged
    const ws = useWorkspaceStore
      .getState()
      .workspaces.find((w) => w.id === "ws1")!;
    expect(ws.name).toBe("Workspace 1");
  });

  it("allows setting an empty string (no guard in current implementation)", () => {
    // The store does not guard empty names — this test documents the actual behavior.
    get().renameWorkspace("ws1", "");

    const ws = useWorkspaceStore
      .getState()
      .workspaces.find((w) => w.id === "ws1")!;
    expect(ws.name).toBe("");
  });

  it("allows whitespace-only names (no guard in current implementation)", () => {
    get().renameWorkspace("ws1", "   ");

    const ws = useWorkspaceStore
      .getState()
      .workspaces.find((w) => w.id === "ws1")!;
    expect(ws.name).toBe("   ");
  });
});

// ---------------------------------------------------------------------------
// saveConfig / loadConfig / deleteConfig
// ---------------------------------------------------------------------------

describe("saveConfig / loadConfig / deleteConfig", () => {
  beforeEach(() => {
    // Start with a workspace that has a simple two-leaf layout
    const leafA = makeLeaf("leafA", "root-split");
    const leafB = makeLeaf("leafB", "root-split");
    const rootSplit = makeSplit("root-split", ["leafA", "leafB"]);
    useWorkspaceStore.setState({
      workspaces: [
        {
          id: "ws1",
          name: "Workspace 1",
          rootId: "root-split",
          nodes: { "root-split": rootSplit, leafA, leafB },
          focusedCardId: "leafA",
        },
      ],
      activeWorkspaceId: "ws1",
      lastWorkspaceId: null,
      savedConfigs: [],
    });
  });

  it("saveConfig appends a new entry to savedConfigs", () => {
    get().saveConfig("My Layout");

    const { savedConfigs } = useWorkspaceStore.getState();
    expect(savedConfigs).toHaveLength(1);
    expect(savedConfigs[0].name).toBe("My Layout");
  });

  it("saveConfig snapshot captures rootId and nodes of the active workspace", () => {
    get().saveConfig("Snapshot Test");

    const { savedConfigs, workspaces, activeWorkspaceId } =
      useWorkspaceStore.getState();
    const ws = workspaces.find((w) => w.id === activeWorkspaceId)!;
    const snap = savedConfigs[0].snapshot!;
    expect(snap.rootId).toBe(ws.rootId);
    expect(snap.nodes).toEqual(ws.nodes);
  });

  it("saveConfig records a non-empty id and ISO savedAt timestamp", () => {
    get().saveConfig("Timestamped");

    const config = useWorkspaceStore.getState().savedConfigs[0];
    expect(config.id).toBeTruthy();
    // Must be a valid ISO-8601 date string
    expect(() => new Date(config.savedAt).toISOString()).not.toThrow();
  });

  it("saveConfig snapshot is a copy — mutating the workspace does not retroactively change the snapshot", () => {
    get().saveConfig("Before Mutation");
    const snapBefore = {
      ...useWorkspaceStore.getState().savedConfigs[0].snapshot!,
    };

    // Remove all cards from the workspace
    setWorkspace({ rootId: null, nodes: {}, focusedCardId: null });

    const snap = useWorkspaceStore.getState().savedConfigs[0].snapshot!;
    expect(snap.rootId).toBe(snapBefore.rootId);
    expect(snap.nodes).toEqual(snapBefore.nodes);
  });

  it("loadConfig creates a new workspace from the saved snapshot and makes it active", () => {
    get().saveConfig("Reload Me");
    const configId = useWorkspaceStore.getState().savedConfigs[0].id;

    get().loadConfig(configId);

    const { workspaces, activeWorkspaceId } = useWorkspaceStore.getState();
    expect(workspaces).toHaveLength(2);
    const loaded = workspaces.find((w) => w.id === activeWorkspaceId)!;
    expect(loaded.name).toBe("Reload Me");
    expect(loaded.rootId).toBe("root-split");
    expect(loaded.nodes).toEqual(
      expect.objectContaining({ "root-split": expect.any(Object) }),
    );
  });

  it("loadConfig does nothing when configId does not exist", () => {
    const before = useWorkspaceStore.getState().workspaces.length;
    get().loadConfig("nonexistent");

    expect(useWorkspaceStore.getState().workspaces).toHaveLength(before);
  });

  it("deleteConfig removes the entry from savedConfigs", () => {
    get().saveConfig("To Delete");
    const configId = useWorkspaceStore.getState().savedConfigs[0].id;

    get().deleteConfig(configId);

    expect(useWorkspaceStore.getState().savedConfigs).toHaveLength(0);
  });

  it("deleteConfig only removes the targeted entry, leaving others intact", () => {
    get().saveConfig("Keep Me");
    get().saveConfig("Delete Me");
    const ids = useWorkspaceStore.getState().savedConfigs.map((c) => c.id);

    get().deleteConfig(ids[1]);

    const { savedConfigs } = useWorkspaceStore.getState();
    expect(savedConfigs).toHaveLength(1);
    expect(savedConfigs[0].id).toBe(ids[0]);
  });

  it("deleteConfig does nothing when configId does not exist", () => {
    get().saveConfig("Existing");
    get().deleteConfig("nonexistent");

    expect(useWorkspaceStore.getState().savedConfigs).toHaveLength(1);
  });
});
