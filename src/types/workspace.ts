import type { CardId, CardMap } from "./card";

export type WorkspaceId = string;

export interface Workspace {
  id: WorkspaceId;
  name: string;
  rootId: CardId | null;
  nodes: CardMap;
  focusedCardId: CardId | null;
  /** Card currently expanded to fill the workspace; null when no card is zoomed. */
  zoomedCardId: CardId | null;
}

export interface SavedConfig {
  id: string;
  name: string;
  snapshot: { rootId: CardId | null; nodes: CardMap } | null;
  savedAt: string; // ISO-8601
}
