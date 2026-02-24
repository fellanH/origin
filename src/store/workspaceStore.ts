import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createTauriStore } from "@tauri-store/zustand";
import type { CardId, CardLeaf, CardSplit } from "@/types/card";
import type { Workspace, WorkspaceId, SavedConfig } from "@/types/workspace";

// ─── Types ───────────────────────────────────────────────────────────────────

type WorkspaceState = {
  workspaces: Workspace[];
  activeWorkspaceId: WorkspaceId;
  savedConfigs: SavedConfig[];
  pendingSaveName: boolean;
  /** Resolved at startup via appDataDir() — never persisted */
  appDataDir: string;
};

type WorkspaceActions = {
  addWorkspace: () => void;
  closeWorkspace: (id: WorkspaceId) => void;
  setActiveWorkspace: (id: WorkspaceId) => void;
  renameWorkspace: (id: WorkspaceId, name: string) => void;
  addInitialCard: (pluginId?: string) => void;
  splitCard: (cardId: CardId, direction: "horizontal" | "vertical") => void;
  closeCard: (cardId: CardId) => void;
  setFocus: (cardId: CardId | null) => void;
  resizeSplit: (splitId: CardId, sizes: [number, number]) => void;
  setPlugin: (cardId: CardId, pluginId: string) => void;
  saveConfig: (name: string) => void;
  loadConfig: (configId: string) => void;
  deleteConfig: (configId: string) => void;
  setPendingSaveName: (v: boolean) => void;
  setAppDataDir: (path: string) => void;
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
          draft.activeWorkspaceId = id;
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
      "renameWorkspace",
      "addInitialCard",
      "splitCard",
      "closeCard",
      "setFocus",
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
