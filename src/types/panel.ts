export type NodeId = string;

export type PanelLeaf = {
  type: "leaf";
  id: NodeId;
  parentId: NodeId | null;
  pluginId: string | null;
};

export type PanelSplit = {
  type: "split";
  id: NodeId;
  parentId: NodeId | null;
  direction: "horizontal" | "vertical";
  sizes: [number, number];
  childIds: [NodeId, NodeId];
};

export type PanelNode = PanelLeaf | PanelSplit;

export type NodeMap = Record<NodeId, PanelNode>;
