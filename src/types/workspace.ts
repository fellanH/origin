import type { CardId, CardMap } from "./card";

export type WorkspaceId = string;

/** Layout mode for a workspace — tiling (split-panel) or canvas (free-form). */
export type ViewMode = "tiling" | "canvas";

export interface CanvasViewport {
  /** Pan offset in canvas-space pixels. */
  offsetX: number;
  offsetY: number;
  /** Zoom scale factor. 1 = 100%. */
  scale: number;
}

export interface Workspace {
  id: WorkspaceId;
  name: string;
  rootId: CardId | null;
  nodes: CardMap;
  focusedCardId: CardId | null;
  /** Card currently expanded to fill the workspace; null when no card is zoomed. */
  zoomedCardId: CardId | null;
  /** Layout mode. Defaults to "tiling" for backward compatibility. */
  viewMode: ViewMode;
  /** Pan/zoom state for canvas mode. Ignored in tiling mode. */
  canvasViewport: CanvasViewport;
}

export interface SavedConfig {
  id: string;
  name: string;
  snapshot: { rootId: CardId | null; nodes: CardMap } | null;
  savedAt: string; // ISO-8601
}
