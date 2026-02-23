/**
 * Plugin loader — v2 tests
 *
 * Tests loadPlugin caching, unknown IDs, and factory error handling.
 * Registry is fully mocked — this tests loader.ts logic only.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

const mockHelloEntry = {
  id: "com.origin.hello",
  name: "Hello",
  load: vi.fn().mockResolvedValue({
    manifest: { id: "com.origin.hello", name: "Hello", version: "0.1.0" },
    default: () => null,
  }),
};

vi.mock("./registry", () => ({
  getPlugin: (id: string) => {
    if (id === "com.origin.hello") return mockHelloEntry;
    return undefined;
  },
}));

import { loadPlugin, clearPluginCache } from "./loader";

beforeEach(() => {
  clearPluginCache();
  vi.clearAllMocks();
  // Reset the mock to resolve (in case a test changed it)
  mockHelloEntry.load.mockResolvedValue({
    manifest: { id: "com.origin.hello", name: "Hello", version: "0.1.0" },
    default: () => null,
  });
});

describe("loadPlugin", () => {
  it("returns the PluginModule for a known plugin id", async () => {
    const result = await loadPlugin("com.origin.hello");

    expect(result).not.toBeNull();
    expect(result?.manifest.id).toBe("com.origin.hello");
    expect(typeof result?.default).toBe("function");
  });

  it("returns null for an unknown plugin id", async () => {
    const result = await loadPlugin("com.unknown.plugin");

    expect(result).toBeNull();
  });

  it("caches the result — factory called only once on repeated loads", async () => {
    await loadPlugin("com.origin.hello");
    await loadPlugin("com.origin.hello");
    await loadPlugin("com.origin.hello");

    expect(mockHelloEntry.load).toHaveBeenCalledTimes(1);
  });

  it("different plugin ids each call their own factory", async () => {
    const result1 = await loadPlugin("com.origin.hello");
    const result2 = await loadPlugin("com.unknown.other");

    expect(result1).not.toBeNull();
    expect(result2).toBeNull();
  });

  it("handles a rejected factory (import failure) — returns null", async () => {
    mockHelloEntry.load.mockRejectedValueOnce(new Error("Module not found"));

    const result = await loadPlugin("com.origin.hello");

    expect(result).toBeNull();
  });
});
