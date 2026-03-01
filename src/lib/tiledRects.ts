import type { CardId, CardMap, CardSplit } from "@/types/card";

export interface Rect { x: number; y: number; width: number; height: number; }

export function computeTiledRects(
  nodes: CardMap, rootId: CardId | null, cw: number, ch: number,
): Record<CardId, Rect> {
  const r: Record<CardId, Rect> = {};
  if (!rootId) return r;
  function walk(id: CardId, x: number, y: number, w: number, h: number) {
    const n = nodes[id];
    if (!n) return;
    if (n.type === "leaf") { r[id] = { x, y, width: w, height: h }; return; }
    const s = n as CardSplit;
    const isH = s.direction === "horizontal";
    let off = 0;
    for (let i = 0; i < s.childIds.length; i++) {
      const cid = s.childIds[i]!;
      const pct = (s.sizes[i] ?? 50) / 100;
      if (isH) { const cw2 = w * pct; walk(cid, x + off, y, cw2, h); off += cw2; }
      else { const ch2 = h * pct; walk(cid, x, y + off, w, ch2); off += ch2; }
    }
  }
  walk(rootId, 0, 0, cw, ch);
  return r;
}
