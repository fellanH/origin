/**
 * Plugin registry — L1-only tests
 *
 * Verifies getPluginRegistry() shape and initRegistry() with mocked invoke.
 * All plugins are L1 (sandboxed iframes) — there is no L0 bundled tier.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock @tauri-apps/api/core before importing registry
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn().mockResolvedValue([]),
}));

import { getPluginRegistry, getPlugin, initRegistry } from "./registry";
import { invoke } from "@tauri-apps/api/core";

const REVERSE_DOMAIN_RE = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){2,}$/;

describe("getPluginRegistry", () => {
  it("returns an empty array before initRegistry is called", () => {
    const registry = getPluginRegistry();
    expect(Array.isArray(registry)).toBe(true);
  });

  it("all ids match reverse-domain format after initRegistry", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([
      { id: "com.origin.notepad", name: "Notepad", version: "0.1.0" },
    ]);
    await initRegistry();
    for (const entry of getPluginRegistry()) {
      expect(
        entry.id,
        `id "${entry.id}" does not match reverse-domain format`,
      ).toMatch(REVERSE_DOMAIN_RE);
    }
  });

  it("all entries have a load function returning a Promise", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([
      { id: "com.origin.notepad", name: "Notepad", version: "0.1.0" },
    ]);
    await initRegistry();
    for (const entry of getPluginRegistry()) {
      expect(
        typeof entry.load,
        `entry "${entry.id}" load is not a function`,
      ).toBe("function");
      const result = entry.load();
      expect(typeof result.then).toBe("function");
    }
  });
});

describe("getPlugin", () => {
  it("returns undefined for an unknown id", () => {
    expect(getPlugin("com.unknown.plugin")).toBeUndefined();
  });
});

describe("initRegistry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("populates registry from invoke result", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([
      { id: "com.example.myplugin", name: "My Plugin", version: "1.0.0" },
    ]);

    await initRegistry();

    const registry = getPluginRegistry();
    expect(registry.some((e) => e.id === "com.example.myplugin")).toBe(true);
  });

  it("replaces registry on each call", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([
      { id: "com.origin.notepad", name: "Notepad", version: "0.1.0" },
    ]);

    await initRegistry();

    expect(getPluginRegistry().some((e) => e.id === "com.origin.notepad")).toBe(
      true,
    );
  });

  it("all entries have tier 'L1'", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([
      {
        id: "com.example.community",
        name: "Community Plugin",
        version: "1.0.0",
      },
    ]);

    await initRegistry();

    const entry = getPlugin("com.example.community");
    expect(entry?.tier).toBe("L1");
  });

  it("entry load function uses plugin:// scheme", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([
      { id: "com.example.test", name: "Test", version: "1.0.0" },
    ]);

    await initRegistry();

    const entry = getPlugin("com.example.test");
    expect(entry).toBeDefined();
    expect(typeof entry!.load).toBe("function");
  });
});
