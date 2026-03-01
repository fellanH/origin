import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createTauriStore } from "@tauri-store/zustand";
import type { CardId, CardLeaf, CardSplit } from "@/types/card";
import type {
  Workspace,
  WorkspaceId,
  SavedConfig,
  ViewMode,
  CanvasViewport,
} from "@/types/workspace";
import type { PluginBus } from "@/types/plugin";
import type { UpdateChannel } from "@/types/updater";
import type { AnimationSpeed } from "@/lib/motion";
import { createPluginBus } from "@/lib/pluginBus";
import { panelRefs } from "@/lib/panelRefs";

// ─── Theme ───────────────────────────────────────────────────────────────────

/** User-visible theme preference stored in the workspace store. */
export type ThemePreference = "system" | "light" | "dark";

// ─── Types ───────────────────────────────────────────────────────────────────

type WorkspaceState = {
  /**
   * Schema version for the persisted JSON shape.
   * - undefined / missing: treated as v0 (pre-versioning; no migration required yet)
   * - 1: current shape (added in #112)
   */
  version: 1;
  workspaces: Workspace[];
  activeWorkspaceId: WorkspaceId;
  /** Workspace that was active before the current one; enables CMD+Opt+Tab toggle */
  lastWorkspaceId: WorkspaceId | null;
  savedConfigs: SavedConfig[];
  pendingSaveName: boolean;
  /** Resolved at startup via appDataDir() — never persisted */
  appDataDir: string;
  /**
   * Per-workspace pub/sub bus instances. Keyed by WorkspaceId.
   * NOT persisted — buses are recreated on startup via hydrateBuses().
   * Buses are created in addWorkspace/loadConfig and removed in closeWorkspace.
   */
  buses: Record<WorkspaceId, PluginBus>;
  /**
   * When set, the EmptyState (Launcher) in the matching card will auto-open
   * its plugin picker. Cleared once the launcher has acknowledged it.
   */
  launcherOpenForNodeId: string | null;
  /** When true, CMD+D/⇧D auto-opens the Launcher in the new panel. Default: true */
  splitAutoLaunch: boolean;
  /** Ephemeral zoom overlay — never persisted. null means no zoom active. */
  zoomedNodeId: string | null;
  /**
   * User's theme preference. Resolved to an effective "light" | "dark" by
   * useResolvedTheme — "system" defers to the OS prefers-color-scheme.
   * Persisted so the preference survives restarts.
   */
  themePreference: ThemePreference;
  /** Selected update channel. Persisted so it survives restarts. */
  updateChannel: UpdateChannel;
  animationSpeed: AnimationSpeed;
  /** Developer mode — enables plugin hot-reload via filesystem watcher. */
  devMode: boolean;
  /**
   * Monotonically increasing counter bumped on plugin registry reload.
   * Used as a React key suffix to force iframe remounts after hot-reload.
   * NOT persisted — resets to 0 on app start.
   */
  registryVersion: number;
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
  swapPanel: (direction: "left" | "right" | "up" | "down") => void;
  resizeSplit: (splitId: CardId, sizes: number[]) => void;
  setPlugin: (cardId: CardId, pluginId: string) => void;
  saveConfig: (name: string) => void;
  loadConfig: (configId: string) => void;
  deleteConfig: (configId: string) => void;
  setZoom: (cardId: CardId | null) => void;
  setPendingSaveName: (v: boolean) => void;
  setAppDataDir: (path: string) => void;
  applyLayoutPreset: (preset: "equal" | "main-sidebar") => void;
  clearLauncherForNode: (nodeId: string) => void;
  setSplitAutoLaunch: (v: boolean) => void;
  setZoomedNodeId: (id: string | null) => void;
  /**
   * Shallow-merge a config patch into the leaf node's config.
   * No-op if the node does not exist or is not a leaf.
   */
  setPluginConfig: (cardId: CardId, patch: Record<string, unknown>) => void;
  /**
   * Ensure every loaded workspace has a bus instance.
   * Call once after tauriHandler.start() resolves to reconstruct buses
   * for workspaces that were deserialized from disk (functions are not persisted).
   */
  hydrateBuses: () => void;
  /** Persist the user's theme preference. */
  setThemePreference: (preference: ThemePreference) => void;
  /** Persist the user's update channel preference. */
  setUpdateChannel: (channel: UpdateChannel) => void;
  setAnimationSpeed: (speed: AnimationSpeed) => void;
  /** Toggle developer mode (enables plugin hot-reload). */
  setDevMode: (enabled: boolean) => void;
  /** Bump the registry version counter to force plugin remounts. */
  bumpRegistryVersion: () => void;
  // ── Canvas actions ───────────────────────────────────────────────────────
  /** Toggle between tiling and canvas view mode for the active workspace. */
  setViewMode: (mode: ViewMode) => void;
  /** Update the canvas pan/zoom viewport for the active workspace. */
  setCanvasViewport: (viewport: Partial<CanvasViewport>) => void;
  /** Move a card to a new position on the canvas. */
  moveCanvasCard: (cardId: CardId, x: number, y: number) => void;
  /** Resize a card on the canvas. */
  resizeCanvasCard: (
    cardId: CardId,
    width: number,
    height: number,
  ) => void;
  /** Add a new card at a specific canvas position. */
  addCanvasCard: (x: number, y: number, pluginId?: string) => void;
};

export type WorkspaceStore = WorkspaceState & WorkspaceActions;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Default canvas viewport — centered at origin, 100% zoom. */
const DEFAULT_CANVAS_VIEWPORT: CanvasViewport = {
  offsetX: 0,
  offsetY: 0,
  scale: 1,
};

function emptyWorkspace(id: WorkspaceId, name: string): Workspace {
  return {
    id,
    name,
    rootId: null,
    nodes: {},
    focusedCardId: null,
    zoomedCardId: null,
    viewMode: "tiling",
    canvasViewport: { ...DEFAULT_CANVAS_VIEWPORT },
  };
}

function getActiveWs(
  draft: Pick<WorkspaceState, "workspaces" | "activeWorkspaceId">,
): Workspace | null {
  return draft.workspaces.find((w) => w.id === draft.activeWorkspaceId) ?? null;
}

// ─── Selector ────────────────────────────────────────────────────────────────

export const selectActiveWorkspace = (
  s: WorkspaceStore,
): Workspace | undefined =>
  s.workspaces.find((w) => w.id === s.activeWorkspaceId);

// ─── Store ───────────────────────────────────────────────────────────────────

const INITIAL_ID: WorkspaceId = "default";

export const useWorkspaceStore = create<WorkspaceStore>()(
  devtools(
    immer((set) => ({
      version: 1,
      workspaces: [emptyWorkspace(INITIAL_ID, "Workspace 1")],
      activeWorkspaceId: INITIAL_ID,
      lastWorkspaceId: null,
      savedConfigs: [],
      pendingSaveName: false,
      appDataDir: "",
      launcherOpenForNodeId: null,
      splitAutoLaunch: true,
      zoomedNodeId: null,
      themePreference: "system",
      updateChannel: "stable",
      devMode: false,
      registryVersion: 0,
      animationSpeed: "standard" as AnimationSpeed,
      buses: { [INITIAL_ID]: createPluginBus() },

      // ── Tab actions ──────────────────────────────────────────────────────

      addWorkspace: () =>
        set((draft) => {
          const name = `Workspace ${draft.workspaces.length + 1}`;
          const id = crypto.randomUUID();
          draft.workspaces.push(emptyWorkspace(id, name));
          draft.activeWorkspaceId = id;
          draft.buses[id] = createPluginBus();
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
            delete draft.buses[id];
            draft.buses[newId] = createPluginBus();
            return;
          }

          const wasActive = draft.activeWorkspaceId === id;
          draft.workspaces.splice(idx, 1);
          delete draft.buses[id];

          if (wasActive) {
            // Prefer previous tab; fall back to the tab now at idx (next)
            const nextIdx = Math.max(0, idx - 1);
            const next = draft.workspaces[nextIdx];
            if (next) draft.activeWorkspaceId = next.id;
          }
        }),

      setActiveWorkspace: (id) =>
        set((draft) => {
          draft.lastWorkspaceId = draft.activeWorkspaceId;
          draft.activeWorkspaceId = id;
          draft.zoomedNodeId = null;
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
          draft.zoomedNodeId = null;
        }),

      renameWorkspace: (id, name) =>
        set((draft) => {
          const ws = draft.workspaces.find((w) => w.id === id);
          if (ws) ws.name = name;
        }),

      // ── Card actions ─────────────────────────────────────────────────────

      addInitialCard: (pluginId) =>
        set((draft) => {
          const ws = getActiveWs(draft);
          if (!ws || ws.rootId !== null) return;
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
          const ws = getActiveWs(draft);
          if (!ws) return;
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

          node.parentId = newSplitId;

          if (parentId === null) {
            ws.rootId = newSplitId;
          } else {
            const parent = ws.nodes[parentId];
            if (parent && parent.type === "split") {
              const idx = parent.childIds.indexOf(cardId);
              parent.childIds[idx] = newSplitId;
            }
          }

          ws.focusedCardId = newLeafId;

          if (draft.splitAutoLaunch) {
            draft.launcherOpenForNodeId = newLeafId;
          }
        }),

      closeCard: (cardId) =>
        set((draft) => {
          const ws = getActiveWs(draft);
          if (!ws) return;
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

          const closedIdx = parent.childIds.indexOf(cardId);

          if (parent.childIds.length > 2) {
            // N-ary: just remove this child from the split
            parent.childIds.splice(closedIdx, 1);
            parent.sizes.splice(closedIdx, 1);
            delete ws.nodes[cardId];
            // Focus the adjacent sibling
            const focusIdx = Math.min(closedIdx, parent.childIds.length - 1);
            let newFocus = parent.childIds[focusIdx];
            // Descend to leaf if sibling is a split
            while (newFocus) {
              const n = ws.nodes[newFocus];
              if (!n || n.type === "leaf") break;
              newFocus = n.childIds[0];
            }
            ws.focusedCardId = newFocus ?? null;
            return;
          }

          // Binary: collapse the split, promote the sibling
          const siblingId = parent.childIds.find((id) => id !== cardId)!;
          const grandParentId = parent.parentId;

          const sibling = ws.nodes[siblingId];
          if (sibling) sibling.parentId = grandParentId;

          if (grandParentId === null) {
            ws.rootId = siblingId;
          } else {
            const gp = ws.nodes[grandParentId];
            if (gp && gp.type === "split") {
              const idx = gp.childIds.indexOf(parentSplitId);
              gp.childIds[idx] = siblingId;
            }
          }

          delete ws.nodes[cardId];
          delete ws.nodes[parentSplitId];
          ws.focusedCardId = siblingId;
        }),

      setFocus: (cardId) =>
        set((draft) => {
          const ws = getActiveWs(draft);
          if (!ws) return;
          ws.focusedCardId = cardId;
        }),

      setZoom: (cardId) =>
        set((draft) => {
          const ws = draft.workspaces.find(
            (w) => w.id === draft.activeWorkspaceId,
          )!;
          ws.zoomedCardId = cardId;
        }),

      moveFocus: (direction) =>
        set((draft) => {
          const ws = getActiveWs(draft);
          if (!ws || !ws.focusedCardId) return;

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
              const canMove = wantPrev
                ? childIndex > 0
                : childIndex < parentNode.childIds.length - 1;

              if (canMove) {
                // Navigate into the sibling subtree, landing on first leaf
                const siblingRoot = wantPrev
                  ? parentNode.childIds[childIndex - 1]
                  : parentNode.childIds[childIndex + 1];
                if (!siblingRoot) return;
                let target: CardId = siblingRoot;
                while (true) {
                  const t = nodes[target];
                  if (!t || t.type !== "split") break;
                  target = t.childIds[0] ?? target;
                }
                ws.focusedCardId = target;
                return;
              }
            }

            // Climb to the next ancestor
            currentId = currentNode.parentId;
          }
        }),

      swapPanel: (direction) =>
        set((draft) => {
          const ws = draft.workspaces.find(
            (w) => w.id === draft.activeWorkspaceId,
          )!;
          if (!ws.focusedCardId) return;

          const nodes = ws.nodes;
          const wantPrev = direction === "left" || direction === "up";
          const wantHorizontal = direction === "left" || direction === "right";

          // Walk up the tree to find an ancestor split that handles this direction
          // (same traversal logic as moveFocus)
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
              const canSwap = wantPrev
                ? childIndex > 0
                : childIndex < parentNode.childIds.length - 1;

              if (canSwap) {
                const targetIdx = wantPrev ? childIndex - 1 : childIndex + 1;
                // Swap both childIds and sizes to keep them in sync
                [
                  parentNode.childIds[childIndex],
                  parentNode.childIds[targetIdx],
                ] = [
                  parentNode.childIds[targetIdx]!,
                  parentNode.childIds[childIndex]!,
                ];
                [parentNode.sizes[childIndex], parentNode.sizes[targetIdx]] = [
                  parentNode.sizes[targetIdx]!,
                  parentNode.sizes[childIndex]!,
                ];
                return;
              }
            }

            // Climb to the next ancestor
            currentId = currentNode.parentId;
          }
        }),

      resizeSplit: (splitId, sizes) =>
        set((draft) => {
          const ws = getActiveWs(draft);
          if (!ws) return;
          const node = ws.nodes[splitId];
          if (node && node.type === "split") {
            node.sizes = sizes;
          }
        }),

      setPlugin: (cardId, pluginId) =>
        set((draft) => {
          const ws = getActiveWs(draft);
          if (!ws) return;
          const node = ws.nodes[cardId];
          if (node && node.type === "leaf") node.pluginId = pluginId;
        }),

      saveConfig: (name) =>
        set((draft) => {
          const ws = getActiveWs(draft);
          if (!ws) return;
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
            zoomedCardId: null,
            viewMode: "tiling",
            canvasViewport: { ...DEFAULT_CANVAS_VIEWPORT },
          });
          draft.activeWorkspaceId = newId;
          draft.buses[newId] = createPluginBus();
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
            const firstId = node.childIds[0];
            const secondId = node.childIds[1];
            const firstHandle = firstId ? panelRefs.get(firstId) : undefined;
            const secondHandle = secondId ? panelRefs.get(secondId) : undefined;
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

          const firstId = parentNode.childIds[0];
          const secondId = parentNode.childIds[1];
          const isFocusedFirst = firstId === focusedId;
          const focusedHandle = panelRefs.get(focusedId);
          const siblingId = isFocusedFirst ? secondId : firstId;
          const siblingHandle = siblingId
            ? panelRefs.get(siblingId)
            : undefined;

          if (focusedHandle && siblingHandle) {
            focusedHandle.resize("60");
            siblingHandle.resize("40");
          }
        }
      },

      clearLauncherForNode: (nodeId) =>
        set((draft) => {
          if (draft.launcherOpenForNodeId === nodeId) {
            draft.launcherOpenForNodeId = null;
          }
        }),

      setSplitAutoLaunch: (v) =>
        set((draft) => {
          draft.splitAutoLaunch = v;
        }),

      setZoomedNodeId: (id) =>
        set((draft) => {
          draft.zoomedNodeId = id;
        }),

      setThemePreference: (preference) =>
        set((draft) => {
          draft.themePreference = preference;
        }),

      setUpdateChannel: (channel) =>
        set((draft) => {
          draft.updateChannel = channel;
        }),

      setAnimationSpeed: (speed) =>
        set((draft) => {
          draft.animationSpeed = speed;
        }),

      setDevMode: (enabled) =>
        set((draft) => {
          draft.devMode = enabled;
        }),

      bumpRegistryVersion: () =>
        set((draft) => {
          draft.registryVersion += 1;
        }),

      setPluginConfig: (cardId, patch) =>
        set((draft) => {
          const ws = getActiveWs(draft);
          if (!ws) return;
          const node = ws.nodes[cardId];
          if (!node || node.type !== "leaf") return;
          node.config = { ...node.config, ...patch };
        }),

      hydrateBuses: () =>
        set((draft) => {
          for (const ws of draft.workspaces) {
            if (!draft.buses[ws.id]) {
              draft.buses[ws.id] = createPluginBus();
            }
          }
        }),

      // ── Canvas actions ─────────────────────────────────────────────────────

      setViewMode: (mode) =>
        set((draft) => {
          const ws = getActiveWs(draft);
          if (!ws) return;
          ws.viewMode = mode;
          // When switching to canvas, ensure all leaf nodes have canvas coordinates
          if (mode === "canvas") {
            let col = 0;
            for (const node of Object.values(ws.nodes)) {
              if (node.type !== "leaf") continue;
              if (node.canvasX === undefined) {
                node.canvasX = 40 + col * 440;
                node.canvasY = 40;
                node.canvasWidth = 400;
                node.canvasHeight = 300;
                col++;
              }
            }
          }
        }),

      setCanvasViewport: (viewport) =>
        set((draft) => {
          const ws = getActiveWs(draft);
          if (!ws) return;
          if (viewport.offsetX !== undefined)
            ws.canvasViewport.offsetX = viewport.offsetX;
          if (viewport.offsetY !== undefined)
            ws.canvasViewport.offsetY = viewport.offsetY;
          if (viewport.scale !== undefined)
            ws.canvasViewport.scale = viewport.scale;
        }),

      moveCanvasCard: (cardId, x, y) =>
        set((draft) => {
          const ws = getActiveWs(draft);
          if (!ws) return;
          const node = ws.nodes[cardId];
          if (!node || node.type !== "leaf") return;
          node.canvasX = x;
          node.canvasY = y;
        }),

      resizeCanvasCard: (cardId, width, height) =>
        set((draft) => {
          const ws = getActiveWs(draft);
          if (!ws) return;
          const node = ws.nodes[cardId];
          if (!node || node.type !== "leaf") return;
          node.canvasWidth = Math.max(200, width);
          node.canvasHeight = Math.max(150, height);
        }),

      addCanvasCard: (x, y, pluginId) =>
        set((draft) => {
          const ws = getActiveWs(draft);
          if (!ws) return;
          const leafId = crypto.randomUUID();
          ws.nodes[leafId] = {
            type: "leaf",
            id: leafId,
            parentId: null,
            pluginId: pluginId ?? null,
            canvasX: x,
            canvasY: y,
            canvasWidth: 400,
            canvasHeight: 300,
          } satisfies CardLeaf;
          // In canvas mode, rootId is used as a sentinel — set it if empty
          if (ws.rootId === null) ws.rootId = leafId;
          ws.focusedCardId = leafId;
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
      "version",
      "workspaces",
      "activeWorkspaceId",
      "lastWorkspaceId",
      "savedConfigs",
      "themePreference",
      "updateChannel",
      "splitAutoLaunch",
      "animationSpeed",
      "devMode",
    ],
    filterKeysStrategy: "pick",
    saveOnChange: true,
    saveStrategy: "debounce",
    saveInterval: 500,
  },
);
