import { describe, it, expect } from "vitest";
import { computeTiledRects } from "./tiledRects";
import type { CardLeaf, CardSplit, CardMap } from "@/types/card";
function mkL(id: string, p: string | null = null): CardLeaf { return { id, type: "leaf", parentId: p, pluginId: null }; }
function mkS(id: string, c: [string, string], p: string | null = null, d: "horizontal"|"vertical" = "horizontal", s: [number,number] = [50,50]): CardSplit { return { id, type: "split", parentId: p, childIds: c, direction: d, sizes: s }; }
describe("computeTiledRects", () => {
  it("null root", () => { expect(computeTiledRects({}, null, 1000, 800)).toEqual({}); });
  it("single leaf", () => { expect(computeTiledRects({ a: mkL("a") }, "a", 1000, 800)).toEqual({ a: { x:0, y:0, width:1000, height:800 } }); });
  it("H 50/50", () => { const n: CardMap = { s: mkS("s",["a","b"]), a: mkL("a","s"), b: mkL("b","s") }; const r = computeTiledRects(n,"s",1000,800); expect(r["a"]).toEqual({x:0,y:0,width:500,height:800}); expect(r["b"]).toEqual({x:500,y:0,width:500,height:800}); });
  it("V 50/50", () => { const n: CardMap = { s: mkS("s",["a","b"],null,"vertical"), a: mkL("a","s"), b: mkL("b","s") }; const r = computeTiledRects(n,"s",1000,800); expect(r["a"]).toEqual({x:0,y:0,width:1000,height:400}); expect(r["b"]).toEqual({x:0,y:400,width:1000,height:400}); });
  it("70/30", () => { const n: CardMap = { s: mkS("s",["a","b"],null,"horizontal",[70,30]), a: mkL("a","s"), b: mkL("b","s") }; const r = computeTiledRects(n,"s",1000,800); expect(r["a"]!.width).toBe(700); expect(r["b"]!.x).toBe(700); });
  it("nested", () => { const n: CardMap = { r: mkS("r",["ls","c"],null,"horizontal",[60,40]), ls: mkS("ls",["a","b"],"r","vertical"), a: mkL("a","ls"), b: mkL("b","ls"), c: mkL("c","r") }; const x = computeTiledRects(n,"r",1000,800); expect(x["a"]).toEqual({x:0,y:0,width:600,height:400}); expect(x["c"]).toEqual({x:600,y:0,width:400,height:800}); });
  it("no splits in result", () => { const n: CardMap = { s: mkS("s",["a","b"]), a: mkL("a","s"), b: mkL("b","s") }; expect(computeTiledRects(n,"s",1000,800)["s"]).toBeUndefined(); });
});
