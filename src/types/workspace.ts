import type { NodeId, NodeMap } from "./panel";

export type WorkspaceId = string;

export interface Workspace {
  id: WorkspaceId;
  name: string;
  rootId: NodeId | null;
  nodes: NodeMap;
  focusedPanelId: NodeId | null;
}

export interface SavedConfig {
  id: string;
  name: string;
  snapshot: { rootId: NodeId | null; nodes: NodeMap } | null;
  savedAt: string; // ISO-8601
}
