/**
 * workspaceStore — Phase 1 (PoC) tests
 *
 * Tests the flat NodeMap panel operations: splitPanel, closePanel, resizeSplit, setFocus.
 * Store shape: { rootId, nodes, focusedPanelId } — plain Zustand, no persistence.
 *
 * Phase 3 extension (multi-workspace + persistence mock) will be added in this file
 * when issue #3 upgrade begins. Add the following mock at the top of this file then:
 *
 *   vi.mock("@tauri-store/zustand", () => ({
 *     createTauriStore: vi.fn().mockReturnValue({
 *       start: vi.fn().mockResolvedValue(undefined),
 *       save: vi.fn().mockResolvedValue(undefined),
 *       saveNow: vi.fn().mockResolvedValue(undefined),
 *     }),
 *   }));
 */

import { describe, it, expect, beforeEach } from "vitest";
import { useWorkspaceStore } from "./workspaceStore";
import type { PanelLeaf, PanelSplit } from "../types/panel";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeLeaf(id: string, parentId: string | null = null): PanelLeaf {
  return { id, type: "leaf", parentId, pluginId: null };
}

function makeSplit(
  id: string,
  childIds: [string, string],
  parentId: string | null = null,
  direction: "horizontal" | "vertical" = "horizontal",
): PanelSplit {
  return { id, type: "split", parentId, childIds, direction, sizes: [50, 50] };
}

function get() {
  return useWorkspaceStore.getState();
}

// ---------------------------------------------------------------------------
// Reset between tests
// ---------------------------------------------------------------------------

beforeEach(() => {
  useWorkspaceStore.setState({ rootId: null, nodes: {}, focusedPanelId: null });
});

// ---------------------------------------------------------------------------
// splitPanel
// ---------------------------------------------------------------------------

describe("splitPanel", () => {
  it("creates a split node and a new leaf sibling from a single root leaf", () => {
    const leaf = makeLeaf("root-leaf");
    useWorkspaceStore.setState({
      rootId: "root-leaf",
      nodes: { "root-leaf": leaf },
      focusedPanelId: "root-leaf",
    });

    get().splitPanel("root-leaf", "horizontal");

    const { rootId, nodes } = get();
    expect(Object.keys(nodes)).toHaveLength(3);

    const root = nodes[rootId!] as PanelSplit;
    expect(root.type).toBe("split");
    expect(root.parentId).toBeNull();
    expect(root.childIds).toHaveLength(2);
    expect(root.sizes).toEqual([50, 50]);

    const [firstId, secondId] = root.childIds;
    expect(nodes[firstId].parentId).toBe(root.id);
    expect(nodes[secondId].parentId).toBe(root.id);
  });

  it("sets focusedPanelId to the new sibling leaf after split", () => {
    const leaf = makeLeaf("root-leaf");
    useWorkspaceStore.setState({
      rootId: "root-leaf",
      nodes: { "root-leaf": leaf },
      focusedPanelId: "root-leaf",
    });

    get().splitPanel("root-leaf", "horizontal");

    const { rootId, nodes, focusedPanelId } = get();
    const root = nodes[rootId!] as PanelSplit;
    const sibling = root.childIds.find((id) => id !== "root-leaf")!;
    expect(focusedPanelId).toBe(sibling);
  });

  it("splits vertically when direction is 'vertical'", () => {
    const leaf = makeLeaf("root-leaf");
    useWorkspaceStore.setState({
      rootId: "root-leaf",
      nodes: { "root-leaf": leaf },
      focusedPanelId: "root-leaf",
    });

    get().splitPanel("root-leaf", "vertical");

    const { rootId, nodes } = get();
    const root = nodes[rootId!] as PanelSplit;
    expect(root.direction).toBe("vertical");
  });

  it("patches grandparent's childIds when splitting a non-root leaf", () => {
    const leafA = makeLeaf("leafA", "root-split");
    const leafB = makeLeaf("leafB", "root-split");
    const rootSplit = makeSplit("root-split", ["leafA", "leafB"]);
    useWorkspaceStore.setState({
      rootId: "root-split",
      nodes: { "root-split": rootSplit, leafA, leafB },
      focusedPanelId: "leafA",
    });

    get().splitPanel("leafA", "horizontal");

    const { nodes, rootId } = get();
    const root = nodes[rootId!] as PanelSplit;
    // root's first childId must now be the new split wrapper (not leafA directly)
    expect(root.childIds[0]).not.toBe("leafA");
    const newSplit = nodes[root.childIds[0]] as PanelSplit;
    expect(newSplit.type).toBe("split");
    expect(newSplit.parentId).toBe("root-split");
    expect(newSplit.childIds).toContain("leafA");
    expect(nodes["leafA"].parentId).toBe(newSplit.id);
  });

  it("supports 3 levels of nesting without corrupting parentId chains", () => {
    const leaf = makeLeaf("leaf0");
    useWorkspaceStore.setState({
      rootId: "leaf0",
      nodes: { leaf0: leaf },
      focusedPanelId: "leaf0",
    });

    get().splitPanel("leaf0", "horizontal");
    const sibling1 = get().focusedPanelId!;
    get().splitPanel(sibling1, "horizontal");

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

  it("does nothing when panelId does not exist in nodes", () => {
    useWorkspaceStore.setState({
      rootId: null,
      nodes: {},
      focusedPanelId: null,
    });

    expect(() => get().splitPanel("nonexistent", "horizontal")).not.toThrow();

    expect(Object.keys(get().nodes)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// closePanel
// ---------------------------------------------------------------------------

describe("closePanel", () => {
  it("resets to empty state when closing the only panel", () => {
    const leaf = makeLeaf("root-leaf");
    useWorkspaceStore.setState({
      rootId: "root-leaf",
      nodes: { "root-leaf": leaf },
      focusedPanelId: "root-leaf",
    });

    get().closePanel("root-leaf");

    const { rootId, nodes, focusedPanelId } = get();
    expect(rootId).toBeNull();
    expect(Object.keys(nodes)).toHaveLength(0);
    expect(focusedPanelId).toBeNull();
  });

  it("promotes left sibling to root when closing the right child", () => {
    const leafA = makeLeaf("leafA", "root-split");
    const leafB = makeLeaf("leafB", "root-split");
    const rootSplit = makeSplit("root-split", ["leafA", "leafB"]);
    useWorkspaceStore.setState({
      rootId: "root-split",
      nodes: { "root-split": rootSplit, leafA, leafB },
      focusedPanelId: "leafB",
    });

    get().closePanel("leafB");

    const { rootId, nodes } = get();
    expect(rootId).toBe("leafA");
    expect(nodes["leafA"].parentId).toBeNull();
    expect(Object.keys(nodes)).toHaveLength(1);
  });

  it("promotes right sibling to root when closing the left child", () => {
    const leafA = makeLeaf("leafA", "root-split");
    const leafB = makeLeaf("leafB", "root-split");
    const rootSplit = makeSplit("root-split", ["leafA", "leafB"]);
    useWorkspaceStore.setState({
      rootId: "root-split",
      nodes: { "root-split": rootSplit, leafA, leafB },
      focusedPanelId: "leafA",
    });

    get().closePanel("leafA");

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
    useWorkspaceStore.setState({
      rootId: "root-split",
      nodes: {
        "root-split": rootSplit,
        leafA,
        "nested-split": nestedSplit,
        leafB,
        leafC,
      },
      focusedPanelId: "leafB",
    });

    get().closePanel("leafB");

    const { nodes } = get();
    expect(nodes["leafC"]).toBeDefined();
    expect(nodes["leafC"].parentId).toBe("root-split");
    const root = nodes["root-split"] as PanelSplit;
    expect(root.childIds).toContain("leafC");
    // nestedSplit and leafB must be deleted
    expect(nodes["nested-split"]).toBeUndefined();
    expect(nodes["leafB"]).toBeUndefined();
    expect(Object.keys(nodes)).toHaveLength(3); // root-split, leafA, leafC
  });

  it("handles closing a panel when sibling is itself a split node", () => {
    const leafA = makeLeaf("leafA", "root-split");
    const leafB1 = makeLeaf("leafB1", "splitB");
    const leafB2 = makeLeaf("leafB2", "splitB");
    const splitB = makeSplit("splitB", ["leafB1", "leafB2"], "root-split");
    const rootSplit = makeSplit("root-split", ["leafA", "splitB"]);
    useWorkspaceStore.setState({
      rootId: "root-split",
      nodes: { "root-split": rootSplit, leafA, splitB, leafB1, leafB2 },
      focusedPanelId: "leafA",
    });

    get().closePanel("leafA");

    const { rootId, nodes } = get();
    expect(rootId).toBe("splitB");
    const root = nodes["splitB"] as PanelSplit;
    expect(root.parentId).toBeNull();
    // splitB's childIds and sizes must be unchanged
    expect(root.childIds).toEqual(["leafB1", "leafB2"]);
    expect(root.sizes).toEqual([50, 50]);
  });

  it("sets focusedPanelId to the promoted sibling after close", () => {
    const leafA = makeLeaf("leafA", "root-split");
    const leafB = makeLeaf("leafB", "root-split");
    const rootSplit = makeSplit("root-split", ["leafA", "leafB"]);
    useWorkspaceStore.setState({
      rootId: "root-split",
      nodes: { "root-split": rootSplit, leafA, leafB },
      focusedPanelId: "leafA",
    });

    get().closePanel("leafA");

    expect(get().focusedPanelId).toBe("leafB");
  });

  it("does nothing when panelId does not exist in nodes", () => {
    const leaf = makeLeaf("root-leaf");
    useWorkspaceStore.setState({
      rootId: "root-leaf",
      nodes: { "root-leaf": leaf },
      focusedPanelId: "root-leaf",
    });

    expect(() => get().closePanel("nonexistent")).not.toThrow();

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
    useWorkspaceStore.setState({
      rootId: "root-split",
      nodes: { "root-split": rootSplit, leafA, leafB },
      focusedPanelId: "leafA",
    });

    get().resizeSplit("root-split", [30, 70]);

    const split = get().nodes["root-split"] as PanelSplit;
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
    useWorkspaceStore.setState({
      rootId: "root-split",
      nodes: { "root-split": rootSplit, leafA, leafB },
      focusedPanelId: "leafA",
    });

    get().resizeSplit("root-split", [40, 60]);

    const split = get().nodes["root-split"] as PanelSplit;
    expect(split.childIds).toEqual(["leafA", "leafB"]);
    expect(split.direction).toBe("vertical");
    expect(split.parentId).toBeNull();
    expect(split.sizes).toEqual([40, 60]);
  });

  it("does nothing when splitId does not exist", () => {
    useWorkspaceStore.setState({
      rootId: null,
      nodes: {},
      focusedPanelId: null,
    });

    expect(() => get().resizeSplit("nonexistent", [40, 60])).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// setFocus
// ---------------------------------------------------------------------------

describe("setFocus", () => {
  it("sets focusedPanelId to the given panelId", () => {
    const leaf = makeLeaf("leaf1");
    useWorkspaceStore.setState({
      rootId: "leaf1",
      nodes: { leaf1: leaf },
      focusedPanelId: null,
    });

    get().setFocus("leaf1");

    expect(get().focusedPanelId).toBe("leaf1");
  });

  it("accepts null to clear focus", () => {
    const leaf = makeLeaf("leaf1");
    useWorkspaceStore.setState({
      rootId: "leaf1",
      nodes: { leaf1: leaf },
      focusedPanelId: "leaf1",
    });

    get().setFocus(null);

    expect(get().focusedPanelId).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// NodeMap invariants — cross-cutting
// ---------------------------------------------------------------------------

describe("NodeMap invariants", () => {
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
        queue.push(...(node as PanelSplit).childIds);
      }
    }
    return visited;
  }

  it("every non-root node's parentId points to an existing node after a series of splits", () => {
    const leaf = makeLeaf("leaf0");
    useWorkspaceStore.setState({
      rootId: "leaf0",
      nodes: { leaf0: leaf },
      focusedPanelId: "leaf0",
    });

    get().splitPanel("leaf0", "horizontal");
    const sibling1 = get().focusedPanelId!;
    get().splitPanel(sibling1, "vertical");
    get().splitPanel("leaf0", "horizontal");

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
    useWorkspaceStore.setState({
      rootId: "leaf0",
      nodes: { leaf0: leaf },
      focusedPanelId: "leaf0",
    });

    get().splitPanel("leaf0", "horizontal");
    const sibling = get().focusedPanelId!;
    get().splitPanel("leaf0", "vertical");
    get().closePanel(sibling);

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
    useWorkspaceStore.setState({
      rootId: "leaf0",
      nodes: { leaf0: leaf },
      focusedPanelId: "leaf0",
    });

    get().splitPanel("leaf0", "horizontal");
    get().splitPanel("leaf0", "vertical");

    const { nodes } = get();
    for (const node of Object.values(nodes)) {
      if (node.type === "split") {
        for (const childId of (node as PanelSplit).childIds) {
          expect(nodes[childId]).toBeDefined();
        }
      }
    }
  });

  it("no orphaned nodes remain after close", () => {
    const leaf = makeLeaf("leaf0");
    useWorkspaceStore.setState({
      rootId: "leaf0",
      nodes: { leaf0: leaf },
      focusedPanelId: "leaf0",
    });

    get().splitPanel("leaf0", "horizontal");
    const sibling = get().focusedPanelId!;
    get().splitPanel(sibling, "vertical");
    const deepSibling = get().focusedPanelId!;
    get().closePanel(deepSibling);

    const { nodes, rootId } = get();
    const reachable = reachableIds(nodes, rootId);
    expect(new Set(Object.keys(nodes))).toEqual(reachable);
  });
});
