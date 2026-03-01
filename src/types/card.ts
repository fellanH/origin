export type CardId = string;

export type CardLeaf = {
  type: "leaf";
  id: CardId;
  parentId: CardId | null;
  pluginId: string | null;
  /** Per-instance plugin configuration. Shallow-merged by setPluginConfig. */
  config?: Record<string, unknown>;
  /**
   * Canvas-mode position and size. Ignored in tiling mode.
   * When undefined in canvas mode, defaults are assigned by the store.
   */
  canvasX?: number;
  canvasY?: number;
  canvasWidth?: number;
  canvasHeight?: number;
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
