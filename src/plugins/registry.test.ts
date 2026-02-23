/**
 * Plugin registry — v2 tests
 *
 * Verifies getPluginRegistry() shape and initRegistry() with mocked invoke.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock @tauri-apps/api/core before importing registry
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn().mockResolvedValue([]),
}));

// Mock bundled plugin import
vi.mock("@origin/hello", () => ({
  default: () => null,
  manifest: { id: "com.origin.hello", name: "Hello", version: "0.1.0" },
}));

import { getPluginRegistry, getPlugin, initRegistry } from "./registry";
import { invoke } from "@tauri-apps/api/core";

const REVERSE_DOMAIN_RE = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){2,}$/;

describe("getPluginRegistry", () => {
  it("returns an array", () => {
    const registry = getPluginRegistry();
    expect(Array.isArray(registry)).toBe(true);
  });

  it("has an entry for 'com.origin.hello'", () => {
    const registry = getPluginRegistry();
    expect(registry.some((e) => e.id === "com.origin.hello")).toBe(true);
  });

  it("all ids match reverse-domain format", () => {
    for (const entry of getPluginRegistry()) {
      expect(
        entry.id,
        `id "${entry.id}" does not match reverse-domain format`,
      ).toMatch(REVERSE_DOMAIN_RE);
    }
  });

  it("all entries have a load function returning a Promise", () => {
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

  it("returns the entry for 'com.origin.hello'", () => {
    const entry = getPlugin("com.origin.hello");
    expect(entry).toBeDefined();
    expect(entry?.id).toBe("com.origin.hello");
    expect(entry?.name).toBe("Hello");
  });
});

describe("initRegistry", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("appends v2 plugins from invoke result", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([
      { id: "com.example.myplugin", name: "My Plugin", version: "1.0.0" },
    ]);

    await initRegistry();

    const registry = getPluginRegistry();
    expect(registry.some((e) => e.id === "com.example.myplugin")).toBe(true);
    expect(registry.some((e) => e.id === "com.origin.hello")).toBe(true);
  });

  it("does not duplicate v1 bundled plugins even if returned by invoke", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([
      { id: "com.origin.hello", name: "Hello", version: "0.1.0" },
    ]);

    await initRegistry();

    const helloEntries = getPluginRegistry().filter(
      (e) => e.id === "com.origin.hello",
    );
    expect(helloEntries).toHaveLength(1);
  });

  it("v2 entry load function uses plugin:// scheme", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([
      { id: "com.example.test", name: "Test", version: "1.0.0" },
    ]);

    await initRegistry();

    const entry = getPlugin("com.example.test");
    expect(entry).toBeDefined();
    expect(typeof entry!.load).toBe("function");
  });
});
