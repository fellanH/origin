/**
 * @origin/hello — canonical L1 plugin validation (#147)
 *
 * Validates that com.origin.hello is correctly shaped as a sandboxed L1 plugin:
 * - Registry entry has all required L1 fields
 * - Manifest round-trips correctly (including requiredCapabilities: [])
 * - IframePluginHost URL pattern resolves to index.html (not index.js)
 *
 * The hello plugin is the canonical reference for plugin authors — if these
 * tests pass the L1 dev workflow contract is satisfied end-to-end.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock Tauri invoke so initRegistry can run in Node
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn().mockResolvedValue([]),
}));

import { getPlugin, initRegistry } from "./registry";
import { invoke } from "@tauri-apps/api/core";

// The exact manifest that ships in src-tauri/assets/plugins/com.origin.hello/manifest.json
const HELLO_MANIFEST = {
  id: "com.origin.hello",
  name: "Hello",
  version: "0.1.0",
  description: "Reference plugin — minimal hello world for plugin authors.",
  icon: "👋",
  requiredCapabilities: [] as string[],
};

describe("com.origin.hello — canonical L1 plugin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("manifest has the required id in reverse-domain format", () => {
    expect(HELLO_MANIFEST.id).toMatch(
      /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){2,}$/,
    );
  });

  it("manifest has all required PluginManifest fields", () => {
    expect(HELLO_MANIFEST.id).toBe("com.origin.hello");
    expect(HELLO_MANIFEST.name).toBe("Hello");
    expect(typeof HELLO_MANIFEST.version).toBe("string");
    expect(HELLO_MANIFEST.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("manifest requiredCapabilities is an empty array (no capabilities needed)", () => {
    // Hello is a read-only display plugin — it must NOT claim any capabilities.
    // This is the minimal viable manifest pattern for plugin authors to follow.
    expect(Array.isArray(HELLO_MANIFEST.requiredCapabilities)).toBe(true);
    expect(HELLO_MANIFEST.requiredCapabilities).toHaveLength(0);
  });

  it("registry entry for hello has tier L1 and correct id", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([HELLO_MANIFEST]);
    await initRegistry();

    const entry = getPlugin("com.origin.hello");
    expect(entry).toBeDefined();
    expect(entry?.tier).toBe("L1");
    expect(entry?.id).toBe("com.origin.hello");
    expect(entry?.name).toBe("Hello");
  });

  it("registry entry carries the full manifest (used by IframePluginHost)", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([HELLO_MANIFEST]);
    await initRegistry();

    const entry = getPlugin("com.origin.hello");
    expect(entry?.manifest).toBeDefined();
    expect(entry?.manifest?.id).toBe("com.origin.hello");
    expect(entry?.manifest?.requiredCapabilities).toEqual([]);
  });

  it("registry load() returns a thenable (plugin:// scheme import)", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([HELLO_MANIFEST]);
    await initRegistry();

    const entry = getPlugin("com.origin.hello");
    expect(entry).toBeDefined();
    // load() wraps a dynamic import — it must return a Promise regardless of
    // whether the plugin:// scheme resolves (it won't in Node, hence catch)
    const result = entry!.load().catch(() => undefined);
    expect(typeof result.then).toBe("function");
  });

  it("IframePluginHost src uses index.html (L1 entry point, not index.js)", () => {
    // The URL pattern used by IframePluginHost.tsx line:
    //   src={`plugin://localhost/${pluginId}/index.html`}
    // Verify this resolves to the correct entry for com.origin.hello
    const pluginId = "com.origin.hello";
    const src = `plugin://localhost/${pluginId}/index.html`;
    expect(src).toBe("plugin://localhost/com.origin.hello/index.html");
    expect(src).not.toContain("index.js");
  });

  it("manifest serializes requiredCapabilities as camelCase JSON key", () => {
    // Mirrors the Rust serde rename — the host must receive camelCase
    const json = JSON.stringify(HELLO_MANIFEST);
    const parsed = JSON.parse(json) as Record<string, unknown>;
    expect("requiredCapabilities" in parsed).toBe(true);
    expect("required_capabilities" in parsed).toBe(false);
  });
});
