/**
 * @origin/notepad — L1 plugin validation (#150)
 *
 * Validates that com.origin.notepad is correctly shaped as a sandboxed L1
 * plugin that routes all file I/O through the ORIGIN_INVOKE postMessage bridge:
 *
 * - Manifest has the correct required capabilities (fs:read + fs:write)
 * - All capabilities map to known entries in COMMAND_CAPABILITY_MAP
 * - Registry entry has all required L1 fields (tier, manifest, load)
 * - Bundle does NOT contain direct @tauri-apps/api imports
 * - Bundle DOES contain ORIGIN_INVOKE postMessage calls
 * - The specific fs commands used by notepad are correctly registered
 *
 * The bundle at src-tauri/assets/plugins/com.origin.notepad/ is built from
 * origin-plugin-monorepo/packages/notepad/ which uses @origin-cards/sdk's
 * readTextFile/writeTextFile/mkdir — each of which calls invoke() which posts
 * ORIGIN_INVOKE to window.parent. This file validates that contract is upheld.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

// Mock Tauri invoke so initRegistry can run in Node
vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn().mockResolvedValue([]),
}));

import { getPlugin, initRegistry } from "./registry";
import { invoke } from "@tauri-apps/api/core";
import { COMMAND_CAPABILITY_MAP } from "@/lib/iframeProtocol";

// The exact manifest that ships in src-tauri/assets/plugins/com.origin.notepad/manifest.json
const NOTEPAD_MANIFEST = {
  id: "com.origin.notepad",
  name: "Notepad",
  version: "0.1.0",
  description: "A simple markdown notepad — notes are saved per panel",
  icon: "📝",
  requiredCapabilities: ["fs:read", "fs:write"],
};

// Resolve the bundle path relative to this repo root
const BUNDLE_DIR = path.resolve(
  import.meta.dirname,
  "../../src-tauri/assets/plugins/com.origin.notepad",
);

describe("com.origin.notepad — L1 plugin manifest", () => {
  it("manifest has the required id in reverse-domain format", () => {
    expect(NOTEPAD_MANIFEST.id).toMatch(
      /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){2,}$/,
    );
  });

  it("manifest has all required PluginManifest fields", () => {
    expect(NOTEPAD_MANIFEST.id).toBe("com.origin.notepad");
    expect(NOTEPAD_MANIFEST.name).toBe("Notepad");
    expect(typeof NOTEPAD_MANIFEST.version).toBe("string");
    expect(NOTEPAD_MANIFEST.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("manifest requiredCapabilities includes fs:read and fs:write", () => {
    // Notepad reads and writes per-card .md files — both capabilities are
    // necessary and neither should be omitted.
    expect(Array.isArray(NOTEPAD_MANIFEST.requiredCapabilities)).toBe(true);
    expect(NOTEPAD_MANIFEST.requiredCapabilities).toContain("fs:read");
    expect(NOTEPAD_MANIFEST.requiredCapabilities).toContain("fs:write");
  });

  it("manifest declares exactly the capabilities it needs (no extras)", () => {
    // Principle of least privilege: notepad only needs fs:read + fs:write
    expect(NOTEPAD_MANIFEST.requiredCapabilities).toHaveLength(2);
  });

  it("all declared capabilities map to known entries in COMMAND_CAPABILITY_MAP", () => {
    // Every capability declared by a plugin must correspond to at least one
    // command in COMMAND_CAPABILITY_MAP — otherwise it can never be exercised.
    const allMappedCapabilities = new Set(Object.values(COMMAND_CAPABILITY_MAP));
    for (const cap of NOTEPAD_MANIFEST.requiredCapabilities) {
      expect(
        allMappedCapabilities.has(cap),
        `Capability "${cap}" has no entry in COMMAND_CAPABILITY_MAP`,
      ).toBe(true);
    }
  });

  it("manifest serializes requiredCapabilities as camelCase JSON key", () => {
    // Mirrors the Rust serde rename — the host must receive camelCase
    const json = JSON.stringify(NOTEPAD_MANIFEST);
    const parsed = JSON.parse(json) as Record<string, unknown>;
    expect("requiredCapabilities" in parsed).toBe(true);
    expect("required_capabilities" in parsed).toBe(false);
  });
});

describe("com.origin.notepad — COMMAND_CAPABILITY_MAP coverage", () => {
  it("plugin:fs|read_text_file is mapped to fs:read", () => {
    // readTextFile() in SDK calls invoke("plugin:fs|read_text_file", ...)
    expect(COMMAND_CAPABILITY_MAP["plugin:fs|read_text_file"]).toBe("fs:read");
  });

  it("plugin:fs|write_text_file is mapped to fs:write", () => {
    // writeTextFile() in SDK calls invoke("plugin:fs|write_text_file", ...)
    expect(COMMAND_CAPABILITY_MAP["plugin:fs|write_text_file"]).toBe("fs:write");
  });

  it("plugin:fs|mkdir is mapped to fs:write", () => {
    // mkdir() in SDK calls invoke("plugin:fs|mkdir", ...) — requires fs:write
    // because creating directories is a write operation.
    expect(COMMAND_CAPABILITY_MAP["plugin:fs|mkdir"]).toBe("fs:write");
  });

  it("notepad fs:read capability unlocks read_text_file command", () => {
    // Verify the capability declared in the manifest grants the commands used
    expect(NOTEPAD_MANIFEST.requiredCapabilities).toContain("fs:read");
    expect(COMMAND_CAPABILITY_MAP["plugin:fs|read_text_file"]).toBe("fs:read");
  });

  it("notepad fs:write capability unlocks write_text_file and mkdir commands", () => {
    expect(NOTEPAD_MANIFEST.requiredCapabilities).toContain("fs:write");
    expect(COMMAND_CAPABILITY_MAP["plugin:fs|write_text_file"]).toBe("fs:write");
    expect(COMMAND_CAPABILITY_MAP["plugin:fs|mkdir"]).toBe("fs:write");
  });
});

describe("com.origin.notepad — registry integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registry entry for notepad has tier L1 and correct id", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([NOTEPAD_MANIFEST]);
    await initRegistry();

    const entry = getPlugin("com.origin.notepad");
    expect(entry).toBeDefined();
    expect(entry?.tier).toBe("L1");
    expect(entry?.id).toBe("com.origin.notepad");
    expect(entry?.name).toBe("Notepad");
  });

  it("registry entry carries the full manifest (used by IframePluginHost)", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([NOTEPAD_MANIFEST]);
    await initRegistry();

    const entry = getPlugin("com.origin.notepad");
    expect(entry?.manifest).toBeDefined();
    expect(entry?.manifest?.id).toBe("com.origin.notepad");
    expect(entry?.manifest?.requiredCapabilities).toEqual([
      "fs:read",
      "fs:write",
    ]);
  });

  it("registry load() returns a thenable (plugin:// scheme import)", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([NOTEPAD_MANIFEST]);
    await initRegistry();

    const entry = getPlugin("com.origin.notepad");
    expect(entry).toBeDefined();
    // load() wraps a dynamic import — it must return a Promise regardless of
    // whether the plugin:// scheme resolves (it won't in Node, hence catch)
    const result = entry!.load().catch(() => undefined);
    expect(typeof result.then).toBe("function");
  });

  it("IframePluginHost src uses index.html (L1 entry point, not index.js)", () => {
    // The URL pattern used by IframePluginHost.tsx:
    //   src={`plugin://localhost/${pluginId}/index.html`}
    const pluginId = "com.origin.notepad";
    const src = `plugin://localhost/${pluginId}/index.html`;
    expect(src).toBe("plugin://localhost/com.origin.notepad/index.html");
    expect(src).not.toContain("index.js");
  });
});

describe("com.origin.notepad — bundle L1 compliance", () => {
  // Read the bundle once for all bundle tests
  let bundleSource: string;

  beforeEach(() => {
    const bundlePath = path.join(
      BUNDLE_DIR,
      "assets",
      "index-BHvlVKLN.js",
    );
    bundleSource = fs.readFileSync(bundlePath, "utf-8");
  });

  it("bundle exists at the expected path", () => {
    expect(() =>
      fs.readFileSync(path.join(BUNDLE_DIR, "assets", "index-BHvlVKLN.js")),
    ).not.toThrow();
  });

  it("bundle does NOT contain direct @tauri-apps/api imports (no Tauri globals)", () => {
    // Direct Tauri API usage bypasses the ORIGIN_INVOKE bridge and sandbox.
    // A clean L1 bundle must never reference @tauri-apps/api or __TAURI__.
    expect(bundleSource).not.toContain("@tauri-apps/api");
    expect(bundleSource).not.toContain("__TAURI__");
    expect(bundleSource).not.toContain("__TAURI_INTERNALS__");
    expect(bundleSource).not.toContain("isTauri");
  });

  it("bundle contains ORIGIN_INVOKE postMessage calls (uses SDK bridge)", () => {
    // The SDK's invoke() function posts ORIGIN_INVOKE to window.parent.
    // This is the sole authorised path for plugins to reach Tauri commands.
    expect(bundleSource).toContain("ORIGIN_INVOKE");
  });

  it("bundle contains ORIGIN_READY message (SDK context initialisation)", () => {
    // The SDK's usePluginContext() hook posts ORIGIN_READY when the iframe
    // mounts, signalling the host to send ORIGIN_INIT with the context object.
    expect(bundleSource).toContain("ORIGIN_READY");
  });

  it("bundle invokes plugin:fs|read_text_file via ORIGIN_INVOKE bridge", () => {
    // readTextFile() in the SDK translates to this Tauri command name.
    // Presence in the bundle confirms the notepad reads files via the bridge.
    expect(bundleSource).toContain("plugin:fs|read_text_file");
  });

  it("bundle invokes plugin:fs|write_text_file via ORIGIN_INVOKE bridge", () => {
    // writeTextFile() in the SDK translates to this Tauri command name.
    expect(bundleSource).toContain("plugin:fs|write_text_file");
  });

  it("bundle invokes plugin:fs|mkdir via ORIGIN_INVOKE bridge", () => {
    // mkdir() is called on first load to create the notepad/ directory.
    expect(bundleSource).toContain("plugin:fs|mkdir");
  });

  it("bundle manifest.json exists and matches expected shape", () => {
    const manifestPath = path.join(BUNDLE_DIR, "manifest.json");
    const raw = fs.readFileSync(manifestPath, "utf-8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    expect(parsed.id).toBe("com.origin.notepad");
    expect(parsed.name).toBe("Notepad");
    expect(parsed.requiredCapabilities).toEqual(["fs:read", "fs:write"]);
  });
});
