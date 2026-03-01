import { describe, it, expect } from "vitest";
import { channelEndpoint, CHANNEL_INFO } from "@/types/updater";
import type { UpdateChannel, UpdateStatus } from "@/types/updater";

describe("UpdateChannel type", () => {
  it("accepts valid channels", () => {
    const channels: UpdateChannel[] = ["stable", "beta", "nightly"];
    expect(channels).toHaveLength(3);
  });
});

describe("CHANNEL_INFO", () => {
  it("has metadata for all three channels", () => {
    expect(CHANNEL_INFO).toHaveLength(3);
    const ids = CHANNEL_INFO.map((c) => c.channel);
    expect(ids).toContain("stable");
    expect(ids).toContain("beta");
    expect(ids).toContain("nightly");
  });

  it("stable channel has low risk", () => {
    const stable = CHANNEL_INFO.find((c) => c.channel === "stable");
    expect(stable?.riskLevel).toBe("low");
  });

  it("beta channel has medium risk", () => {
    const beta = CHANNEL_INFO.find((c) => c.channel === "beta");
    expect(beta?.riskLevel).toBe("medium");
  });

  it("nightly channel has high risk", () => {
    const nightly = CHANNEL_INFO.find((c) => c.channel === "nightly");
    expect(nightly?.riskLevel).toBe("high");
  });

  it("every channel has non-empty label and description", () => {
    for (const info of CHANNEL_INFO) {
      expect(info.label.length).toBeGreaterThan(0);
      expect(info.description.length).toBeGreaterThan(0);
    }
  });
});

describe("channelEndpoint", () => {
  it("returns latest.json URL for stable channel", () => {
    const url = channelEndpoint("stable");
    expect(url).toBe(
      "https://github.com/fellanH/origin/releases/latest/download/latest.json",
    );
  });

  it("returns beta tag URL for beta channel", () => {
    const url = channelEndpoint("beta");
    expect(url).toContain("/releases/download/beta/latest.json");
  });

  it("returns nightly tag URL for nightly channel", () => {
    const url = channelEndpoint("nightly");
    expect(url).toContain("/releases/download/nightly/latest.json");
  });

  it("all channels return valid HTTPS URLs", () => {
    const channels: UpdateChannel[] = ["stable", "beta", "nightly"];
    for (const ch of channels) {
      const url = channelEndpoint(ch);
      expect(url).toMatch(/^https:\/\//);
      expect(url).toContain("latest.json");
    }
  });
});

describe("UpdateStatus exhaustiveness", () => {
  it("covers all expected states", () => {
    const allStatuses: UpdateStatus[] = [
      "idle",
      "checking",
      "available",
      "downloading",
      "ready",
      "installing",
      "up-to-date",
      "error",
    ];
    expect(allStatuses).toHaveLength(8);
  });
});
