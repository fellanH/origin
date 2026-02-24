export type CardId = string;

export type CardLeaf = {
  type: "leaf";
  id: CardId;
  parentId: CardId | null;
  pluginId: string | null;
  /** Per-instance plugin configuration. Shallow-merged by setPluginConfig. */
  config?: Record<string, unknown>;
};

export type CardSplit = {
  type: "split";
  id: CardId;
  parentId: CardId | null;
  direction: "horizontal" | "vertical";
  sizes: number[];
  childIds: CardId[];
};

export type CardNode = CardLeaf | CardSplit;

export type CardMap = Record<CardId, CardNode>;
