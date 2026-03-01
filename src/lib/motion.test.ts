import { describe, it, expect, beforeEach } from "vitest";
import { getMotionTokens, getMotionCSSProperties, buildTransition, ANIMATION_SPEED_OPTIONS } from "./motion";
import type { AnimationSpeed, MotionTokens } from "./motion";
describe("getMotionTokens", () => {
  it("returns standard durations", () => { const t = getMotionTokens("standard", false); expect(t.duration.fast).toBe(130); expect(t.isDisabled).toBe(false); });
  it("returns snappy durations", () => { const t = getMotionTokens("snappy", false); expect(t.duration.fast).toBe(70); });
  it("returns zero when off", () => { const t = getMotionTokens("off", false); expect(t.duration.fast).toBe(0); expect(t.isDisabled).toBe(true); });
  it("OS reduced-motion forces off", () => { const t = getMotionTokens("standard", true); expect(t.duration.fast).toBe(0); expect(t.isReduced).toBe(true); });
  it("OS reduced-motion overrides snappy", () => { expect(getMotionTokens("snappy", true).isDisabled).toBe(true); });
  it("always provides easings", () => { (["standard","snappy","off"] as AnimationSpeed[]).forEach(s => expect(getMotionTokens(s,false).easing.default).toContain("cubic-bezier")); });
});
describe("getMotionCSSProperties", () => {
  it("returns 8 props", () => { expect(Object.keys(getMotionCSSProperties(getMotionTokens("standard",false)))).toHaveLength(8); });
  it("0ms when off", () => { expect(getMotionCSSProperties(getMotionTokens("off",false))["--motion-duration-fast"]).toBe("0ms"); });
});
describe("buildTransition", () => {
  let t: MotionTokens; beforeEach(() => { t = getMotionTokens("standard", false); });
  it("single prop", () => { expect(buildTransition(t, "opacity", "fast")).toContain("130ms"); });
  it("multi prop", () => { const r = buildTransition(t, ["a","b"], "normal", "out"); expect(r).toContain("a 200ms"); expect(r).toContain("b 200ms"); });
  it("0ms when off", () => { expect(buildTransition(getMotionTokens("off",false), "x", "fast")).toContain("0ms"); });
});
describe("ANIMATION_SPEED_OPTIONS", () => { it("has 3", () => { expect(ANIMATION_SPEED_OPTIONS).toHaveLength(3); }); });
