import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createTauriStore } from "@tauri-store/zustand";
import type { CardId, CardLeaf, CardSplit } from "@/types/card";
import type { Workspace, WorkspaceId, SavedConfig } from "@/types/workspace";
import { panelRefs } from "@/lib/panelRefs";

// ─── Types ───────────────────────────────────────────────────────────────────

type WorkspaceState = {
  workspaces: Workspace[];
  activeWorkspaceId: WorkspaceId;
  /** Workspace that was active before the current one; enables CMD+Opt+Tab toggle */
  lastWorkspaceId: WorkspaceId | null;
  savedConfigs: SavedConfig[];
  pendingSaveName: boolean;
  /** Resolved at startup via appDataDir() — never persisted */
  appDataDir: string;
};

type WorkspaceActions = {
  addWorkspace: () => void;
  closeWorkspace: (id: WorkspaceId) => void;
  setActiveWorkspace: (id: WorkspaceId) => void;
  switchToLastWorkspace: () => void;
  renameWorkspace: (id: WorkspaceId, name: string) => void;
  addInitialCard: (pluginId?: string) => void;
  splitCard: (cardId: CardId, direction: "horizontal" | "vertical") => void;
  closeCard: (cardId: CardId) => void;
  setFocus: (cardId: CardId | null) => void;
  moveFocus: (direction: "left" | "right" | "up" | "down") => void;
  resizeSplit: (splitId: CardId, sizes: [number, number]) => void;
  setPlugin: (cardId: CardId, pluginId: string) => void;
  saveConfig: (name: string) => void;
  loadConfig: (configId: string) => void;
  deleteConfig: (configId: string) => void;
  setPendingSaveName: (v: boolean) => void;
  setAppDataDir: (path: string) => void;
  applyLayoutPreset: (preset: "equal" | "main-sidebar") => void;
};

export type WorkspaceStore = WorkspaceState & WorkspaceActions;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function emptyWorkspace(id: WorkspaceId, name: string): Workspace {
  return { id, name, rootId: null, nodes: {}, focusedCardId: null };
}

// ─── Selector ────────────────────────────────────────────────────────────────

export const selectActiveWorkspace = (s: WorkspaceStore): Workspace =>
  s.workspaces.find((w) => w.id === s.activeWorkspaceId)!;

// ─── Store ───────────────────────────────────────────────────────────────────

const INITIAL_ID: WorkspaceId = "default";

export const useWorkspaceStore = create<WorkspaceStore>()(
  devtools(
    immer((set) => ({
      workspaces: [emptyWorkspace(INITIAL_ID, "Workspace 1")],
      activeWorkspaceId: INITIAL_ID,
      lastWorkspaceId: null,
      savedConfigs: [],
      pendingSaveName: false,
      appDataDir: "",

      // ── Tab actions ──────────────────────────────────────────────────────

      addWorkspace: () =>
        set((draft) => {
          const name = `Workspace ${draft.workspaces.length + 1}`;
          const id = crypto.randomUUID();
          draft.workspaces.push(emptyWorkspace(id, name));
          draft.activeWorkspaceId = id;
        }),

      closeWorkspace: (id) =>
        set((draft) => {
          const idx = draft.workspaces.findIndex((w) => w.id === id);
          if (idx === -1) return;

          if (draft.workspaces.length === 1) {
            // Last workspace — reset to one empty workspace
            const newId = crypto.randomUUID();
            draft.workspaces = [emptyWorkspace(newId, "Workspace 1")];
            draft.activeWorkspaceId = newId;
            return;
          }

          const wasActive = draft.activeWorkspaceId === id;
          draft.workspaces.splice(idx, 1);

          if (wasActive) {
            // Prefer previous tab; fall back to the tab now at idx (next)
            const nextIdx = Math.max(0, idx - 1);
            draft.activeWorkspaceId = draft.workspaces[nextIdx].id;
          }
        }),

      setActiveWorkspace: (id) =>
        set((draft) => {
          draft.lastWorkspaceId = draft.activeWorkspaceId;
          draft.activeWorkspaceId = id;
        }),

      switchToLastWorkspace: () =>
        set((draft) => {
          if (draft.workspaces.length <= 1) return;
          if (!draft.lastWorkspaceId) return;
          const target = draft.workspaces.find(
            (w) => w.id === draft.lastWorkspaceId,
          );
          if (!target) return;
          const prev = draft.lastWorkspaceId;
          draft.lastWorkspaceId = draft.activeWorkspaceId;
          draft.activeWorkspaceId = prev;
        }),

      renameWorkspace: (id, name) =>
        set((draft) => {
          const ws = draft.workspaces.find((w) => w.id === id);
          if (ws) ws.name = name;
        }),

      // ── Card actions ─────────────────────────────────────────────────────

      addInitialCard: (pluginId) =>
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
            pluginId: pluginId ?? null,
          } satisfies CardLeaf;
          ws.rootId = leafId;
          ws.focusedCardId = leafId;
        }),

      splitCard: (cardId, direction) =>
        set((draft) => {
          const ws = draft.workspaces.find(
            (w) => w.id === draft.activeWorkspaceId,
          )!;
          const node = ws.nodes[cardId];
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
            childIds: [cardId, newLeafId],
          } satisfies CardSplit;

          ws.nodes[newLeafId] = {
            type: "leaf",
            id: newLeafId,
            parentId: newSplitId,
            pluginId: null,
          } satisfies CardLeaf;

          ws.nodes[cardId].parentId = newSplitId;

          if (parentId === null) {
            ws.rootId = newSplitId;
          } else {
            const parent = ws.nodes[parentId];
            if (parent.type === "split") {
              const idx = parent.childIds.indexOf(cardId) as 0 | 1;
              parent.childIds[idx] = newSplitId;
            }
          }

          ws.focusedCardId = newLeafId;
        }),

      closeCard: (cardId) =>
        set((draft) => {
          const ws = draft.workspaces.find(
            (w) => w.id === draft.activeWorkspaceId,
          )!;
          const node = ws.nodes[cardId];
          if (!node || node.type !== "leaf") return;

          const parentSplitId = node.parentId;

          if (parentSplitId === null) {
            // Last card — return to empty state
            delete ws.nodes[cardId];
            ws.rootId = null;
            ws.focusedCardId = null;
            return;
          }

          const parent = ws.nodes[parentSplitId];
          if (!parent || parent.type !== "split") return;

          const siblingId = parent.childIds.find((id) => id !== cardId)!;
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

          delete ws.nodes[cardId];
          delete ws.nodes[parentSplitId];
          ws.focusedCardId = siblingId;
        }),

      setFocus: (cardId) =>
        set((draft) => {
          const ws = draft.workspaces.find(
            (w) => w.id === draft.activeWorkspaceId,
          )!;
          ws.focusedCardId = cardId;
        }),

      moveFocus: (direction) =>
        set((draft) => {
          const ws = draft.workspaces.find(
            (w) => w.id === draft.activeWorkspaceId,
          )!;
          if (!ws.focusedCardId) return;

          const nodes = ws.nodes;
          const wantPrev = direction === "left" || direction === "up";
          const wantHorizontal = direction === "left" || direction === "right";

          // Walk up the tree to find an ancestor split that handles this direction
          let currentId = ws.focusedCardId;
          while (true) {
            const currentNode = nodes[currentId];
            if (!currentNode || currentNode.parentId === null) return;

            const parentNode = nodes[currentNode.parentId];
            if (!parentNode || parentNode.type !== "split") return;

            const orientationMatches = wantHorizontal
              ? parentNode.direction === "horizontal"
              : parentNode.direction === "vertical";

            if (orientationMatches) {
              const childIndex = parentNode.childIds.indexOf(currentId);
              const canMove = wantPrev ? childIndex === 1 : childIndex === 0;

              if (canMove) {
                // Navigate into the sibling subtree, landing on first leaf
                const siblingRoot = wantPrev
                  ? parentNode.childIds[0]
                  : parentNode.childIds[1];
                let target = siblingRoot;
                while (true) {
                  const t = nodes[target];
                  if (!t || t.type !== "split") break;
                  target = t.childIds[0];
                }
                ws.focusedCardId = target;
                return;
              }
            }

            // Climb to the next ancestor
            currentId = currentNode.parentId;
          }
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

      setPlugin: (cardId, pluginId) =>
        set((draft) => {
          const ws = draft.workspaces.find(
            (w) => w.id === draft.activeWorkspaceId,
          )!;
          const node = ws.nodes[cardId];
          if (node && node.type === "leaf") node.pluginId = pluginId;
        }),

      saveConfig: (name) =>
        set((draft) => {
          const ws = draft.workspaces.find(
            (w) => w.id === draft.activeWorkspaceId,
          )!;
          draft.savedConfigs.push({
            id: crypto.randomUUID(),
            name,
            snapshot: { rootId: ws.rootId, nodes: { ...ws.nodes } },
            savedAt: new Date().toISOString(),
          });
        }),

      loadConfig: (configId) =>
        set((draft) => {
          const config = draft.savedConfigs.find((c) => c.id === configId);
          if (!config?.snapshot) return;
          const newId = crypto.randomUUID();
          draft.workspaces.push({
            id: newId,
            name: config.name,
            rootId: config.snapshot.rootId,
            nodes: { ...config.snapshot.nodes },
            focusedCardId: null,
          });
          draft.activeWorkspaceId = newId;
        }),

      deleteConfig: (configId) =>
        set((draft) => {
          draft.savedConfigs = draft.savedConfigs.filter(
            (c) => c.id !== configId,
          );
        }),

      setPendingSaveName: (v) =>
        set((draft) => {
          draft.pendingSaveName = v;
        }),

      setAppDataDir: (path) =>
        set((draft) => {
          draft.appDataDir = path;
        }),

      applyLayoutPreset: (preset) => {
        const state = useWorkspaceStore.getState();
        const ws = state.workspaces.find(
          (w) => w.id === state.activeWorkspaceId,
        );
        if (!ws) return;

        if (preset === "equal") {
          // For every split node, resize its two children equally (50/50).
          // This covers all PanelGroups in the current workspace.
          for (const node of Object.values(ws.nodes)) {
            if (node.type !== "split") continue;
            const [firstId, secondId] = node.childIds;
            const firstHandle = panelRefs.get(firstId);
            const secondHandle = panelRefs.get(secondId);
            if (firstHandle && secondHandle) {
              firstHandle.resize("50");
              secondHandle.resize("50");
            }
          }
        } else {
          // main-sidebar: focused panel gets 60%, its sibling gets 40%.
          // Only the immediate parent PanelGroup of the focused leaf is resized.
          const focusedId = ws.focusedCardId;
          if (!focusedId) return;
          const focusedNode = ws.nodes[focusedId];
          if (!focusedNode || focusedNode.type !== "leaf") return;
          const parentId = focusedNode.parentId;
          if (!parentId) return; // single panel — nothing to resize
          const parentNode = ws.nodes[parentId];
          if (!parentNode || parentNode.type !== "split") return;

          const [firstId, secondId] = parentNode.childIds;
          const isFocusedFirst = firstId === focusedId;
          const focusedHandle = panelRefs.get(focusedId);
          const siblingId = isFocusedFirst ? secondId : firstId;
          const siblingHandle = panelRefs.get(siblingId);

          if (focusedHandle && siblingHandle) {
            focusedHandle.resize("60");
            siblingHandle.resize("40");
          }
        }
      },
    })),
    { name: "WorkspaceStore" },
  ),
);

// ─── Tauri persistence ───────────────────────────────────────────────────────

export const tauriHandler = createTauriStore(
  "workspace-store",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useWorkspaceStore as any,
  {
    filterKeys: [
      "addWorkspace",
      "closeWorkspace",
      "setActiveWorkspace",
      "switchToLastWorkspace",
      "renameWorkspace",
      "addInitialCard",
      "splitCard",
      "closeCard",
      "setFocus",
      "moveFocus",
      "resizeSplit",
      "setPlugin",
      "saveConfig",
      "loadConfig",
      "deleteConfig",
      "setPendingSaveName",
      "pendingSaveName",
      "setAppDataDir",
      "appDataDir",
    ],
    filterKeysStrategy: "omit",
    saveOnChange: true,
    saveStrategy: "debounce",
    saveInterval: 500,
  },
);
