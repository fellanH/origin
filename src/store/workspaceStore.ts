import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { NodeId, PanelLeaf, PanelSplit } from "@/types/panel";
import type { Workspace, WorkspaceId } from "@/types/workspace";

// ─── Types ───────────────────────────────────────────────────────────────────

type WorkspaceState = {
  workspaces: Workspace[];
  activeWorkspaceId: WorkspaceId;
};

type WorkspaceActions = {
  addInitialPanel: () => void;
  splitPanel: (panelId: NodeId, direction: "horizontal" | "vertical") => void;
  closePanel: (panelId: NodeId) => void;
  setFocus: (panelId: NodeId | null) => void;
  resizeSplit: (splitId: NodeId, sizes: [number, number]) => void;
};

export type WorkspaceStore = WorkspaceState & WorkspaceActions;

// ─── Selector ────────────────────────────────────────────────────────────────

export const selectActiveWorkspace = (s: WorkspaceStore): Workspace =>
  s.workspaces.find((w) => w.id === s.activeWorkspaceId)!;

// ─── Store ───────────────────────────────────────────────────────────────────

const INITIAL_ID: WorkspaceId = "default";

export const useWorkspaceStore = create<WorkspaceStore>()(
  devtools(
    immer((set) => ({
      workspaces: [
        {
          id: INITIAL_ID,
          rootId: null,
          nodes: {},
          focusedPanelId: null,
        },
      ],
      activeWorkspaceId: INITIAL_ID,

      addInitialPanel: () =>
        set((draft) => {
          const ws = draft.workspaces.find(
            (w) => w.id === draft.activeWorkspaceId,
          )!;
          if (ws.rootId !== null) return;
          const leafId = crypto.randomUUID();
          ws.nodes[leafId] = {
            type: "leaf",
            id: leafId,
            parentId: null,
            pluginId: null,
          } satisfies PanelLeaf;
          ws.rootId = leafId;
          ws.focusedPanelId = leafId;
        }),

      splitPanel: (panelId, direction) =>
        set((draft) => {
          const ws = draft.workspaces.find(
            (w) => w.id === draft.activeWorkspaceId,
          )!;
          const node = ws.nodes[panelId];
          if (!node || node.type !== "leaf") return;

          const parentId = node.parentId;
          const newLeafId = crypto.randomUUID();
          const newSplitId = crypto.randomUUID();

          ws.nodes[newSplitId] = {
            type: "split",
            id: newSplitId,
            parentId,
            direction,
            sizes: [50, 50],
            childIds: [panelId, newLeafId],
          } satisfies PanelSplit;

          ws.nodes[newLeafId] = {
            type: "leaf",
            id: newLeafId,
            parentId: newSplitId,
            pluginId: null,
          } satisfies PanelLeaf;

          ws.nodes[panelId].parentId = newSplitId;

          if (parentId === null) {
            ws.rootId = newSplitId;
          } else {
            const parent = ws.nodes[parentId];
            if (parent.type === "split") {
              const idx = parent.childIds.indexOf(panelId) as 0 | 1;
              parent.childIds[idx] = newSplitId;
            }
          }

          ws.focusedPanelId = newLeafId;
        }),

      closePanel: (panelId) =>
        set((draft) => {
          const ws = draft.workspaces.find(
            (w) => w.id === draft.activeWorkspaceId,
          )!;
          const node = ws.nodes[panelId];
          if (!node || node.type !== "leaf") return;

          const parentSplitId = node.parentId;

          if (parentSplitId === null) {
            // Last panel — return to empty state
            delete ws.nodes[panelId];
            ws.rootId = null;
            ws.focusedPanelId = null;
            return;
          }

          const parent = ws.nodes[parentSplitId];
          if (!parent || parent.type !== "split") return;

          const siblingId = parent.childIds.find((id) => id !== panelId)!;
          const grandParentId = parent.parentId;

          ws.nodes[siblingId].parentId = grandParentId;

          if (grandParentId === null) {
            ws.rootId = siblingId;
          } else {
            const gp = ws.nodes[grandParentId];
            if (gp.type === "split") {
              const idx = gp.childIds.indexOf(parentSplitId) as 0 | 1;
              gp.childIds[idx] = siblingId;
            }
          }

          delete ws.nodes[panelId];
          delete ws.nodes[parentSplitId];
          ws.focusedPanelId = siblingId;
        }),

      setFocus: (panelId) =>
        set((draft) => {
          const ws = draft.workspaces.find(
            (w) => w.id === draft.activeWorkspaceId,
          )!;
          ws.focusedPanelId = panelId;
        }),

      resizeSplit: (splitId, sizes) =>
        set((draft) => {
          const ws = draft.workspaces.find(
            (w) => w.id === draft.activeWorkspaceId,
          )!;
          const node = ws.nodes[splitId];
          if (node && node.type === "split") {
            node.sizes = sizes;
          }
        }),
    })),
    { name: "WorkspaceStore" },
  ),
);
