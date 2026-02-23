/**
 * Plugin loader — Phase 4 tests
 *
 * Tests loadPlugin caching, unknown IDs, and factory error handling.
 * Registry is fully mocked — this tests loader.ts logic only.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

vi.mock("./registry", () => ({
  pluginRegistry: {
    "com.note.hello": vi.fn().mockResolvedValue({
      manifest: { id: "com.note.hello", name: "Hello", version: "0.1.0" },
      default: () => null,
    }),
  },
}));

import { loadPlugin, clearPluginCache } from "./loader";
import { pluginRegistry } from "./registry";

beforeEach(() => {
  clearPluginCache();
  vi.clearAllMocks();
});

describe("loadPlugin", () => {
  it("returns the PluginModule for a known plugin id", async () => {
    const result = await loadPlugin("com.note.hello");

    expect(result).not.toBeNull();
    expect(result?.manifest.id).toBe("com.note.hello");
    expect(typeof result?.default).toBe("function");
  });

  it("returns null for an unknown plugin id", async () => {
    const result = await loadPlugin("com.unknown.plugin");

    expect(result).toBeNull();
  });

  it("caches the result — factory called only once on repeated loads", async () => {
    const factory = pluginRegistry["com.note.hello"] as ReturnType<
      typeof vi.fn
    >;

    await loadPlugin("com.note.hello");
    await loadPlugin("com.note.hello");
    await loadPlugin("com.note.hello");

    expect(factory).toHaveBeenCalledTimes(1);
  });

  it("different plugin ids each call their own factory", async () => {
    const result1 = await loadPlugin("com.note.hello");
    const result2 = await loadPlugin("com.unknown.other");

    expect(result1).not.toBeNull();
    expect(result2).toBeNull();
  });

  it("handles a rejected factory (import failure) — returns null", async () => {
    const factory = pluginRegistry["com.note.hello"] as ReturnType<
      typeof vi.fn
    >;
    factory.mockRejectedValueOnce(new Error("Module not found"));

    const result = await loadPlugin("com.note.hello");

    expect(result).toBeNull();
  });
});
