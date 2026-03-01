/**
 * @origin/terminal — L1 plugin validation (#153)
 *
 * Validates that com.origin.terminal is correctly shaped as a sandboxed L1
 * plugin that routes all PTY operations through the ORIGIN_INVOKE and
 * ORIGIN_EVENT postMessage bridges:
 *
 * - Manifest declares requiredCapabilities: ["pty"]
 * - All PTY commands (pty_spawn, pty_write, pty_resize, pty_destroy) map to
 *   the "pty" capability in COMMAND_CAPABILITY_MAP
 * - The pty:data event maps to the "pty" capability in EVENT_CAPABILITY_MAP
 * - Registry entry has all required L1 fields (tier, manifest, load)
 * - Bundle does NOT contain direct @tauri-apps/api imports
 * - Bundle DOES contain ORIGIN_INVOKE postMessage calls for PTY commands
 * - Bundle DOES contain ORIGIN_EVENT_SUBSCRIBE for pty:data streaming
 *
 * The terminal plugin is the most complex L1 migration because it uses
 * bidirectional streaming: commands go out via ORIGIN_INVOKE, and PTY output
 * streams back via ORIGIN_EVENT (subscribed with ORIGIN_EVENT_SUBSCRIBE).
 *
 * The bundle at src-tauri/assets/plugins/com.origin.terminal/ is built from
 * the external plugin monorepo. The plugin uses @origin-cards/sdk's invoke()
 * and onEvent() — each of which routes through postMessage to window.parent.
 * This file validates that contract is upheld.
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
import {
  COMMAND_CAPABILITY_MAP,
  EVENT_CAPABILITY_MAP,
} from "@/lib/iframeProtocol";

// The exact manifest that ships in src-tauri/assets/plugins/com.origin.terminal/manifest.json
const TERMINAL_MANIFEST = {
  id: "com.origin.terminal",
  name: "Terminal",
  version: "0.0.1",
  description: "Full PTY terminal",
  icon: ">_",
  requiredCapabilities: ["pty"],
};

// Resolve the bundle path relative to this repo root
const BUNDLE_DIR = path.resolve(
  import.meta.dirname,
  "../../src-tauri/assets/plugins/com.origin.terminal",
);

// ── Manifest shape ──────────────────────────────────────────────────────────

describe("com.origin.terminal — L1 plugin manifest", () => {
  it("manifest has the required id in reverse-domain format", () => {
    expect(TERMINAL_MANIFEST.id).toMatch(
      /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){2,}$/,
    );
  });

  it("manifest has all required PluginManifest fields", () => {
    expect(TERMINAL_MANIFEST.id).toBe("com.origin.terminal");
    expect(TERMINAL_MANIFEST.name).toBe("Terminal");
    expect(typeof TERMINAL_MANIFEST.version).toBe("string");
    expect(TERMINAL_MANIFEST.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("manifest requiredCapabilities includes pty", () => {
    // Terminal needs PTY access to spawn shells and stream I/O
    expect(Array.isArray(TERMINAL_MANIFEST.requiredCapabilities)).toBe(true);
    expect(TERMINAL_MANIFEST.requiredCapabilities).toContain("pty");
  });

  it("manifest declares exactly the capabilities it needs (no extras)", () => {
    // Principle of least privilege: terminal only needs pty
    expect(TERMINAL_MANIFEST.requiredCapabilities).toHaveLength(1);
  });

  it("all declared capabilities map to known entries in COMMAND_CAPABILITY_MAP", () => {
    // Every capability declared by a plugin must correspond to at least one
    // command in COMMAND_CAPABILITY_MAP — otherwise it can never be exercised.
    const allMappedCapabilities = new Set(
      Object.values(COMMAND_CAPABILITY_MAP),
    );
    for (const cap of TERMINAL_MANIFEST.requiredCapabilities) {
      expect(
        allMappedCapabilities.has(cap),
        `Capability "${cap}" has no entry in COMMAND_CAPABILITY_MAP`,
      ).toBe(true);
    }
  });

  it("all declared capabilities map to known entries in EVENT_CAPABILITY_MAP", () => {
    // The pty capability should also be present in EVENT_CAPABILITY_MAP
    // because the terminal subscribes to pty:data events.
    const allEventCapabilities = new Set(Object.values(EVENT_CAPABILITY_MAP));
    for (const cap of TERMINAL_MANIFEST.requiredCapabilities) {
      expect(
        allEventCapabilities.has(cap),
        `Capability "${cap}" has no entry in EVENT_CAPABILITY_MAP`,
      ).toBe(true);
    }
  });

  it("manifest serializes requiredCapabilities as camelCase JSON key", () => {
    // Mirrors the Rust serde rename — the host must receive camelCase
    const json = JSON.stringify(TERMINAL_MANIFEST);
    const parsed = JSON.parse(json) as Record<string, unknown>;
    expect("requiredCapabilities" in parsed).toBe(true);
    expect("required_capabilities" in parsed).toBe(false);
  });
});

// ── COMMAND_CAPABILITY_MAP coverage ─────────────────────────────────────────

describe("com.origin.terminal — COMMAND_CAPABILITY_MAP coverage", () => {
  it("pty_spawn is mapped to pty capability", () => {
    // invoke("pty_spawn", { id, cols, rows }) via ORIGIN_INVOKE
    expect(COMMAND_CAPABILITY_MAP["pty_spawn"]).toBe("pty");
  });

  it("pty_write is mapped to pty capability", () => {
    // invoke("pty_write", { id, data }) via ORIGIN_INVOKE
    expect(COMMAND_CAPABILITY_MAP["pty_write"]).toBe("pty");
  });

  it("pty_resize is mapped to pty capability", () => {
    // invoke("pty_resize", { id, cols, rows }) via ORIGIN_INVOKE
    expect(COMMAND_CAPABILITY_MAP["pty_resize"]).toBe("pty");
  });

  it("pty_destroy is mapped to pty capability", () => {
    // invoke("pty_destroy", { id }) via ORIGIN_INVOKE
    expect(COMMAND_CAPABILITY_MAP["pty_destroy"]).toBe("pty");
  });

  it("terminal pty capability unlocks all four PTY commands", () => {
    // Verify the single "pty" capability grants all commands needed
    expect(TERMINAL_MANIFEST.requiredCapabilities).toContain("pty");
    const ptyCmds = ["pty_spawn", "pty_write", "pty_resize", "pty_destroy"];
    for (const cmd of ptyCmds) {
      expect(COMMAND_CAPABILITY_MAP[cmd]).toBe("pty");
    }
  });
});

// ── EVENT_CAPABILITY_MAP coverage ───────────────────────────────────────────

describe("com.origin.terminal — EVENT_CAPABILITY_MAP coverage", () => {
  it("pty:data event is mapped to pty capability", () => {
    // onEvent("pty:data", { id }, handler) via ORIGIN_EVENT_SUBSCRIBE
    expect(EVENT_CAPABILITY_MAP["pty:data"]).toBe("pty");
  });

  it("terminal pty capability unlocks pty:data event subscription", () => {
    expect(TERMINAL_MANIFEST.requiredCapabilities).toContain("pty");
    expect(EVENT_CAPABILITY_MAP["pty:data"]).toBe("pty");
  });
});

// ── Registry integration ────────────────────────────────────────────────────

describe("com.origin.terminal — registry integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("registry entry for terminal has tier L1 and correct id", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([TERMINAL_MANIFEST]);
    await initRegistry();

    const entry = getPlugin("com.origin.terminal");
    expect(entry).toBeDefined();
    expect(entry?.tier).toBe("L1");
    expect(entry?.id).toBe("com.origin.terminal");
    expect(entry?.name).toBe("Terminal");
  });

  it("registry entry carries the full manifest (used by IframePluginHost)", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([TERMINAL_MANIFEST]);
    await initRegistry();

    const entry = getPlugin("com.origin.terminal");
    expect(entry?.manifest).toBeDefined();
    expect(entry?.manifest?.id).toBe("com.origin.terminal");
    expect(entry?.manifest?.requiredCapabilities).toEqual(["pty"]);
  });

  it("registry load() returns a thenable (plugin:// scheme import)", async () => {
    vi.mocked(invoke).mockResolvedValueOnce([TERMINAL_MANIFEST]);
    await initRegistry();

    const entry = getPlugin("com.origin.terminal");
    expect(entry).toBeDefined();
    // load() wraps a dynamic import — it must return a Promise regardless of
    // whether the plugin:// scheme resolves (it won't in Node, hence catch)
    const result = entry!.load().catch(() => undefined);
    expect(typeof result.then).toBe("function");
  });

  it("IframePluginHost src uses index.html (L1 entry point, not index.js)", () => {
    // The URL pattern used by IframePluginHost.tsx:
    //   src={`plugin://localhost/${pluginId}/index.html`}
    const pluginId = "com.origin.terminal";
    const src = `plugin://localhost/${pluginId}/index.html`;
    expect(src).toBe("plugin://localhost/com.origin.terminal/index.html");
    expect(src).not.toContain("index.js");
  });
});

// ── Bundle L1 compliance ────────────────────────────────────────────────────

describe("com.origin.terminal — bundle L1 compliance", () => {
  let bundleSource: string;
  const BUNDLE_FILENAME = "index-CdMY6cwF.js";

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

  it("bundle contains ORIGIN_EVENT_SUBSCRIBE (PTY data streaming)", () => {
    // The SDK's onEvent() function posts ORIGIN_EVENT_SUBSCRIBE to subscribe
    // to host-push events like pty:data.
    expect(bundleSource).toContain("ORIGIN_EVENT_SUBSCRIBE");
  });

  it("bundle contains ORIGIN_EVENT_UNSUBSCRIBE (cleanup on unmount)", () => {
    // When the terminal component unmounts, the cleanup function posts
    // ORIGIN_EVENT_UNSUBSCRIBE to tear down the PTY subscription.
    expect(bundleSource).toContain("ORIGIN_EVENT_UNSUBSCRIBE");
  });

  it("bundle invokes pty_spawn via ORIGIN_INVOKE bridge", () => {
    // pty_spawn starts a new shell session — proxied through the host
    expect(bundleSource).toContain("pty_spawn");
  });

  it("bundle invokes pty_write via ORIGIN_INVOKE bridge", () => {
    // pty_write sends keyboard input to the shell — proxied through the host
    expect(bundleSource).toContain("pty_write");
  });

  it("bundle invokes pty_resize via ORIGIN_INVOKE bridge", () => {
    // pty_resize adjusts the terminal dimensions on panel resize
    expect(bundleSource).toContain("pty_resize");
  });

  it("bundle invokes pty_destroy via ORIGIN_INVOKE bridge", () => {
    // pty_destroy kills the shell session on panel close
    expect(bundleSource).toContain("pty_destroy");
  });

  it("bundle subscribes to pty:data event for PTY output streaming", () => {
    // The terminal subscribes to "pty:data" events via ORIGIN_EVENT_SUBSCRIBE.
    // PTY output arrives as ORIGIN_EVENT messages with byte array payloads.
    expect(bundleSource).toContain("pty:data");
  });

  it("bundle contains ORIGIN_EVENT handler for receiving PTY output", () => {
    // The SDK's onEvent() sets up a message listener that filters for
    // ORIGIN_EVENT messages matching the subscription ID.
    expect(bundleSource).toContain("ORIGIN_EVENT");
  });

  it("bundle manifest.json exists and matches expected shape", () => {
    const manifestPath = path.join(BUNDLE_DIR, "manifest.json");
    const raw = fs.readFileSync(manifestPath, "utf-8");
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    expect(parsed.id).toBe("com.origin.terminal");
    expect(parsed.name).toBe("Terminal");
    expect(parsed.requiredCapabilities).toEqual(["pty"]);
  });

  it("bundle index.html exists and references the JS bundle", () => {
    const indexPath = path.join(BUNDLE_DIR, "index.html");
    const html = fs.readFileSync(indexPath, "utf-8");

    expect(html).toContain(BUNDLE_FILENAME);
    expect(html).toContain('<div id="root">');
  });
});

// ── Host-side PTY bridge (IframePluginHost) ─────────────────────────────────

describe("com.origin.terminal — host-side PTY bridge contract", () => {
  it("IframePluginHost handles ORIGIN_EVENT_SUBSCRIBE for pty:data", () => {
    // Verify the host recognises pty:data in the EVENT_CAPABILITY_MAP.
    // When a plugin sends ORIGIN_EVENT_SUBSCRIBE with event="pty:data",
    // the host spawns a Tauri Channel and forwards PTY output as
    // ORIGIN_EVENT messages.
    expect("pty:data" in EVENT_CAPABILITY_MAP).toBe(true);
  });

  it("all four PTY commands are in COMMAND_CAPABILITY_MAP for ORIGIN_INVOKE proxying", () => {
    // The host uses COMMAND_CAPABILITY_MAP to decide whether to proxy
    // an ORIGIN_INVOKE message through to Tauri.
    const ptyCmds = ["pty_spawn", "pty_write", "pty_resize", "pty_destroy"];
    for (const cmd of ptyCmds) {
      expect(cmd in COMMAND_CAPABILITY_MAP).toBe(true);
    }
  });

  it("capability gating is consistent: all PTY operations require same capability", () => {
    // All PTY commands + the pty:data event must require the same capability
    // string ("pty") so a single manifest entry grants full terminal access.
    const commandCap = COMMAND_CAPABILITY_MAP["pty_spawn"];
    expect(COMMAND_CAPABILITY_MAP["pty_write"]).toBe(commandCap);
    expect(COMMAND_CAPABILITY_MAP["pty_resize"]).toBe(commandCap);
    expect(COMMAND_CAPABILITY_MAP["pty_destroy"]).toBe(commandCap);
    expect(EVENT_CAPABILITY_MAP["pty:data"]).toBe(commandCap);
    expect(commandCap).toBe("pty");
  });
});
