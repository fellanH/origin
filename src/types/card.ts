export type CardId = string;

export type CardLeaf = {
  type: "leaf";
  id: CardId;
  parentId: CardId | null;
  pluginId: string | null;
};

export type CardSplit = {
  type: "split";
  id: CardId;
  parentId: CardId | null;
  direction: "horizontal" | "vertical";
  sizes: [number, number];
  childIds: [CardId, CardId];
};

export type CardNode = CardLeaf | CardSplit;

export type CardMap = Record<CardId, CardNode>;
