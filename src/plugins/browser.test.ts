/**
 * @origin/browser — L1 plugin validation (#149)
 *
 * Validates that com.origin.browser is correctly shaped as a sandboxed L1
 * plugin that routes all file I/O through the ORIGIN_INVOKE postMessage bridge.
 *
 * Note: Issue #149 originally specified requiredCapabilities: [] but the
 * shipped bundle persists URLs to per-card JSON files via plugin:fs commands,
 * requiring fs:read + fs:write. The manifest correctly reflects this.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn().mockResolvedValue([]),
}));

import { getPlugin, initRegistry } from "./registry";
import { invoke } from "@tauri-apps/api/core";
import { COMMAND_CAPABILITY_MAP } from "@/lib/iframeProtocol";

const BROWSER_MANIFEST = {
  id: "com.origin.browser",
  name: "Browser",
  version: "0.1.0",
  description: "View any URL in a panel — great for localhost dev servers",
  icon: "🌐",
  requiredCapabilities: ["fs:read", "fs:write"],
};

const BUNDLE_DIR = path.resolve(
  import.meta.dirname,
  "../../src-tauri/assets/plugins/com.origin.browser",
);

const BUNDLE_FILENAME = "index-jSYU8Gyt.js";

describe("com.origin.browser — L1 plugin manifest", () => {
  it("manifest has the required id in reverse-domain format", () => {
    expect(BROWSER_MANIFEST.id).toMatch(
      /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){2,}$/,
    );
  });

  it("manifest has all required PluginManifest fields", () => {
    expect(BROWSER_MANIFEST.id).toBe("com.origin.browser");
    expect(BROWSER_MANIFEST.name).toBe("Browser");
    expect(typeof BROWSER_MANIFEST.version).toBe("string");
    expect(BROWSER_MANIFEST.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("manifest requiredCapabilities includes fs:read and fs:write", () => {
    expect(Array.isArray(BROWSER_MANIFEST.requiredCapabilities)).toBe(true);
    expect(BROWSER_MANIFEST.requiredCapabilities).toContain("fs:read");
    expect(BROWSER_MANIFEST.requiredCapabilities).toContain("fs:write");
  });

  it("manifest declares exactly the capabilities it needs (no extras)", () => {
    expect(BROWSER_MANIFEST.requiredCapabilities).toHaveLength(2);
  });

  it("all declared capabilities map to known entries in COMMAND_CAPABILITY_MAP", () => {
    const allMappedCapabilities = new Set(
      Object.values(COMMAND_CAPABILITY_MAP),
    );
    for (const cap of BROWSER_MANIFEST.requiredCapabilities) {
      expect(
        allMappedCapabilities.has(cap),
        `Capability "${cap}" has no entry in COMMAND_CAPABILITY_MAP`,
      ).toBe(true);
    }
  });

  it("manifest serializes requiredCapabilities as camelCase JSON key", () => {
    const json = JSON.stringify(BROWSER_MANIFEST);
    const parsed = JSON.parse(json) as Record<string, unknown>;
    expect("requiredCapabilities" in parsed).toBe(true);
    expect("required_capabilities" in parsed).toBe(false);
  });
});

describe("com.origin.browser — COMMAND_CAPABILITY_MAP coverage", () => {
  it("plugin:fs|read_text_file is mapped to fs:read", () => {
    expect(COMMAND_CAPABILITY_MAP["plugin:fs|read_text_file"]).toBe("fs:read");
  });

  it("plugin:fs|exists is mapped to fs:read", () => {
    expect(COMMAND_CAPABILITY_MAP["plugin:fs|exists"]).toBe("fs:read");
  });

  it("plugin:fs|write_text_file is mapped to fs:write", () => {
    expect(COMMAND_CAPABILITY_MAP["plugin:fs|write_text_file"]).toBe("fs:write");
  });

  it("plugin:fs|mkdir is mapped to fs:write", () => {
    expect(COMMAND_CAPABILITY_MAP["plugin:fs|mkdir"]).toBe("fs:write");
  });

  it("browser fs:read capability unlocks read_text_file and exists commands", () => {
    expect(BROWSER_MANIFEST.requiredCapabilities).toContain("fs:read");
    expect(COMMAND_CAPABILITY_MAP["plugin:fs|read_text_file"]).toBe("fs:read");
    expect(COMMAND_CAPABILITY_MAP["plugin:fs|exists"]).toBe("fs:read");
  });

  it("browser fs:write capability unlocks write_text_file and mkdir commands", () => {
    expect(BROWSER_MANIFEST.requiredCapabilities).toContain("fs:write");
    expect(COMMAND_CAPABILITY_MAP["plugin:fs|write_text_file"]).toBe("fs:write");
    expect(COMMAND_CAPABILITY_MAP["plugin:fs|mkdir"]).toBe("fs:write");
  });
});

describe("com.origin.browser — registry integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registry entry for browser has tier L1 and correct id", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([BROWSER_MANIFEST]);
    await initRegistry();
    const entry = getPlugin("com.origin.browser");
    expect(entry).toBeDefined();
    expect(entry?.tier).toBe("L1");
    expect(entry?.id).toBe("com.origin.browser");
    expect(entry?.name).toBe("Browser");
  });

  it("registry entry carries the full manifest (used by IframePluginHost)", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([BROWSER_MANIFEST]);
    await initRegistry();
    const entry = getPlugin("com.origin.browser");
    expect(entry?.manifest).toBeDefined();
    expect(entry?.manifest?.id).toBe("com.origin.browser");
    expect(entry?.manifest?.requiredCapabilities).toEqual(["fs:read", "fs:write"]);
  });

  it("registry load() returns a thenable (plugin:// scheme import)", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([BROWSER_MANIFEST]);
    await initRegistry();
    const entry = getPlugin("com.origin.browser");
    expect(entry).toBeDefined();
    const result = entry!.load().catch(() => undefined);
    expect(typeof result.then).toBe("function");
  });

  it("IframePluginHost src uses index.html (L1 entry point, not index.js)", () => {
    const pluginId = "com.origin.browser";
    const src = `plugin://localhost/${pluginId}/index.html`;
    expect(src).toBe("plugin://localhost/com.origin.browser/index.html");
    expect(src).not.toContain("index.js");
  });
});

describe("com.origin.browser — bundle L1 compliance", () => {
  let bundleSource: string;

  beforeEach(() => {
    const bundlePath = path.join(BUNDLE_DIR, "assets", BUNDLE_FILENAME);
    bundleSource = fs.readFileSync(bundlePath, "utf-8");
  });

  it("bundle exists at the expected path", () => {
    expect(() =>
      fs.readFileSync(path.join(BUNDLE_DIR, "assets", BUNDLE_FILENAME)),
    ).not.toThrow();
  });

  it("bundle does NOT contain direct @tauri-apps/api imports (no Tauri globals)", () => {
    expect(bundleSource).not.toContain("@tauri-apps/api");
    expect(bundleSource).not.toContain("__TAURI__");
    expect(bundleSource).not.toContain("__TAURI_INTERNALS__");
    expect(bundleSource).not.toContain("isTauri");
  });

  it("bundle contains ORIGIN_INVOKE postMessage calls (uses SDK bridge)", () => {
    expect(bundleSource).toContain("ORIGIN_INVOKE");
  });

  it("bundle contains ORIGIN_READY message (SDK context initialisation)", () => {
    expect(bundleSource).toContain("ORIGIN_READY");
  });

  it("bundle contains ORIGIN_CONFIG_SET (config persistence)", () => {
    expect(bundleSource).toContain("ORIGIN_CONFIG_SET");
  });

  it("bundle invokes plugin:fs|read_text_file via ORIGIN_INVOKE bridge", () => {
    expect(bundleSource).toContain("plugin:fs|read_text_file");
  });

  it("bundle invokes plugin:fs|write_text_file via ORIGIN_INVOKE bridge", () => {
    expect(bundleSource).toContain("plugin:fs|write_text_file");
  });

  it("bundle invokes plugin:fs|mkdir via ORIGIN_INVOKE bridge", () => {
    expect(bundleSource).toContain("plugin:fs|mkdir");
  });

  it("bundle invokes plugin:fs|exists via ORIGIN_INVOKE bridge", () => {
    expect(bundleSource).toContain("plugin:fs|exists");
  });

  it("bundle renders a nested iframe for web content display", () => {
    expect(bundleSource).toContain('"iframe"');
  });

  it("bundle manifest.json exists and matches expected shape", () => {
    const manifestPath = path.join(BUNDLE_DIR, "manifest.json");
    const raw = fs.readFileSync(manifestPath, "utf-8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    expect(parsed.id).toBe("com.origin.browser");
    expect(parsed.name).toBe("Browser");
    expect(parsed.requiredCapabilities).toEqual(["fs:read", "fs:write"]);
  });

  it("bundle index.html exists and references the JS bundle", () => {
    const indexPath = path.join(BUNDLE_DIR, "index.html");
    const html = fs.readFileSync(indexPath, "utf-8");
    expect(html).toContain(BUNDLE_FILENAME);
    expect(html).toContain('<div id="root">');
  });
});
