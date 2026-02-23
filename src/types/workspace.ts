import type { NodeId, NodeMap } from "./panel";

export type WorkspaceId = string;

export interface Workspace {
  id: WorkspaceId;
  rootId: NodeId | null;
  nodes: NodeMap;
  focusedPanelId: NodeId | null;
}
