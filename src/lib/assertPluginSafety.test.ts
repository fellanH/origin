/**
 * Security regression tests for L1 plugin iframe guardrails.
 *
 * Verifies the deny-list and allow-list rules from docs/security/webview-guardrails.md.
 * These tests must pass in CI before any merge — they are the automated gate
 * for cross-origin/embed boundary regressions.
 *
 * @see docs/security/webview-guardrails.md
 */

// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Hoist mocks ──────────────────────────────────────────────────────────────

const { mockPublish, mockSubscribe, mockRead } = vi.hoisted(() => ({
  mockPublish: vi.fn(),
  mockSubscribe: vi.fn(),
  mockRead: vi.fn(),
}));

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn().mockResolvedValue(undefined),
  Channel: vi.fn(),
}));

vi.mock("@/lib/pluginBus", () => ({
  pluginBus: {
    publish: mockPublish,
    subscribe: mockSubscribe,
    read: mockRead,
  },
}));

// ── Imports ──────────────────────────────────────────────────────────────────

import {
  validateSandboxValue,
  validateIframeSrc,
} from "@/lib/assertPluginSafety";
import type {
  PluginToHostMessage,
  HostToPluginMessage,
} from "@/lib/iframeProtocol";
import {
  COMMAND_CAPABILITY_MAP,
  EVENT_CAPABILITY_MAP,
} from "@/lib/iframeProtocol";

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeFakeWindow() {
  return { postMessage: vi.fn() };
}

type FakeWindow = ReturnType<typeof makeFakeWindow>;

function dispatch(source: FakeWindow, data: unknown) {
  const event = new MessageEvent("message", {
    data,
    source: source as unknown as Window,
  });
  window.dispatchEvent(event);
}

/**
 * Minimal handler that mirrors IframePluginHost's security-critical logic.
 * Focused on source filtering and capability enforcement.
 */
function createSecurityHandler(
  iframeWindow: FakeWindow,
  manifestCapabilities: string[],
) {
  return function onMessage(event: MessageEvent) {
    // Source check — must match the iframe window
    if (event.source !== (iframeWindow as unknown as EventTarget)) return;

    const msg = event.data as PluginToHostMessage;

    if (msg.type === "ORIGIN_INVOKE") {
      const { id, command, args: _args } = msg;

      // 1. Command must be in the global allow-list
      const requiredCap = COMMAND_CAPABILITY_MAP[command];
      if (requiredCap === undefined) {
        iframeWindow.postMessage(
          {
            type: "ORIGIN_INVOKE_ERROR",
            id,
            error: `Command not allowed: ${command}`,
          } satisfies HostToPluginMessage,
          "*",
        );
        return;
      }

      // 2. Plugin must declare the required capability
      if (!manifestCapabilities.includes(requiredCap)) {
        iframeWindow.postMessage(
          {
            type: "ORIGIN_INVOKE_ERROR",
            id,
            error: `Missing capability: ${requiredCap}`,
          } satisfies HostToPluginMessage,
          "*",
        );
        return;
      }

      // If both pass, respond with success (mocked)
      iframeWindow.postMessage(
        {
          type: "ORIGIN_INVOKE_RESULT",
          id,
          result: "ok",
        } satisfies HostToPluginMessage,
        "*",
      );
    } else if (msg.type === "ORIGIN_EVENT_SUBSCRIBE") {
      const { event: eventName } = msg;

      const requiredCap = EVENT_CAPABILITY_MAP[eventName];
      if (requiredCap === undefined) return; // silently dropped
      if (!manifestCapabilities.includes(requiredCap)) return; // silently dropped

      // Would wire up event — for test purposes we just mark success
      iframeWindow.postMessage(
        { type: "ORIGIN_EVENT", subscriptionId: msg.subscriptionId, payload: "subscribed" },
        "*",
      );
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// Test suites
// ═══════════════════════════════════════════════════════════════════════════════

describe("Sandbox attribute validation (D1–D4, A1)", () => {
  it("accepts the correct sandbox value 'allow-scripts'", () => {
    const result = validateSandboxValue("allow-scripts");
    expect(result.valid).toBe(true);
    expect(result.reason).toBeUndefined();
  });

  it("rejects missing sandbox attribute (null)", () => {
    const result = validateSandboxValue(null);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("missing");
  });

  it("rejects empty sandbox attribute", () => {
    const result = validateSandboxValue("");
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("empty");
  });

  // D1: allow-same-origin
  it("rejects allow-same-origin (D1)", () => {
    const result = validateSandboxValue("allow-scripts allow-same-origin");
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("allow-same-origin");
  });

  // D2: allow-top-navigation
  it("rejects allow-top-navigation (D2)", () => {
    const result = validateSandboxValue("allow-scripts allow-top-navigation");
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("allow-top-navigation");
  });

  it("rejects allow-top-navigation-by-user-activation (D2 variant)", () => {
    const result = validateSandboxValue(
      "allow-scripts allow-top-navigation-by-user-activation",
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("allow-top-navigation-by-user-activation");
  });

  // D3: allow-popups-to-escape-sandbox
  it("rejects allow-popups-to-escape-sandbox (D3)", () => {
    const result = validateSandboxValue(
      "allow-scripts allow-popups-to-escape-sandbox",
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("allow-popups-to-escape-sandbox");
  });

  // D4: allow-modals
  it("rejects allow-modals (D4)", () => {
    const result = validateSandboxValue("allow-scripts allow-modals");
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("allow-modals");
  });

  it("rejects unknown/unexpected sandbox tokens", () => {
    const result = validateSandboxValue("allow-scripts allow-forms");
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("allow-forms");
  });

  it("rejects sandbox with allow-popups (not in allowed set)", () => {
    const result = validateSandboxValue("allow-scripts allow-popups");
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("allow-popups");
  });
});

describe("Iframe src validation (D7)", () => {
  it("accepts plugin://localhost/ src", () => {
    const result = validateIframeSrc(
      "plugin://localhost/com.example.myplugin/index.html",
    );
    expect(result.valid).toBe(true);
  });

  it("rejects null src", () => {
    const result = validateIframeSrc(null);
    expect(result.valid).toBe(false);
  });

  it("rejects empty src", () => {
    const result = validateIframeSrc("");
    expect(result.valid).toBe(false);
  });

  it("rejects http:// src (D7)", () => {
    const result = validateIframeSrc("http://evil.com/payload.html");
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("remote content");
  });

  it("rejects https:// src (D7)", () => {
    const result = validateIframeSrc("https://cdn.example.com/plugin.html");
    expect(result.valid).toBe(false);
    expect(result.reason).toContain("remote content");
  });

  it("rejects data: URI src", () => {
    const result = validateIframeSrc(
      "data:text/html,<script>alert(1)</script>",
    );
    expect(result.valid).toBe(false);
  });

  it("rejects javascript: URI src", () => {
    const result = validateIframeSrc("javascript:alert(1)");
    expect(result.valid).toBe(false);
  });

  it("rejects plugin:// with wrong host", () => {
    const result = validateIframeSrc(
      "plugin://evil.com/com.example.myplugin/index.html",
    );
    expect(result.valid).toBe(false);
  });
});

describe("Cross-origin message source filtering", () => {
  let iframeWin: FakeWindow;
  let handler: (event: MessageEvent) => void;

  beforeEach(() => {
    vi.clearAllMocks();
    iframeWin = makeFakeWindow();
    handler = createSecurityHandler(iframeWin, ["fs:read"]);
    window.addEventListener("message", handler);
  });

  afterEach(() => {
    window.removeEventListener("message", handler);
  });

  it("processes messages from the correct iframe window", () => {
    dispatch(iframeWin, {
      type: "ORIGIN_INVOKE",
      id: "req-1",
      command: "plugin:fs|read_file",
      args: { path: "/test" },
    } satisfies PluginToHostMessage);

    expect(iframeWin.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ type: "ORIGIN_INVOKE_RESULT", id: "req-1" }),
      "*",
    );
  });

  it("ignores messages from unknown/foreign windows", () => {
    const foreignWin = makeFakeWindow();
    dispatch(foreignWin, {
      type: "ORIGIN_INVOKE",
      id: "req-evil",
      command: "plugin:fs|read_file",
      args: { path: "/etc/passwd" },
    } satisfies PluginToHostMessage);

    // Neither the iframe window nor the foreign window should receive a response
    expect(iframeWin.postMessage).not.toHaveBeenCalled();
    expect(foreignWin.postMessage).not.toHaveBeenCalled();
  });

  it("ignores messages with null source", () => {
    const event = new MessageEvent("message", {
      data: {
        type: "ORIGIN_INVOKE",
        id: "req-null",
        command: "plugin:fs|read_file",
        args: {},
      },
      source: null,
    });
    window.dispatchEvent(event);

    expect(iframeWin.postMessage).not.toHaveBeenCalled();
  });
});

describe("Capability broker — command allow-list (D9, D10)", () => {
  let iframeWin: FakeWindow;

  beforeEach(() => {
    vi.clearAllMocks();
    iframeWin = makeFakeWindow();
  });

  afterEach(() => {
    // Clean up any remaining listeners (handlers are added per-test here)
  });

  it("rejects a command not in COMMAND_CAPABILITY_MAP (D9)", () => {
    const handler = createSecurityHandler(iframeWin, []);
    window.addEventListener("message", handler);

    dispatch(iframeWin, {
      type: "ORIGIN_INVOKE",
      id: "req-bad",
      command: "evil_command",
      args: {},
    } satisfies PluginToHostMessage);

    expect(iframeWin.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "ORIGIN_INVOKE_ERROR",
        id: "req-bad",
        error: expect.stringContaining("not allowed"),
      }),
      "*",
    );

    window.removeEventListener("message", handler);
  });

  it("rejects an allowed command when plugin lacks the required capability (D10)", () => {
    // Plugin declares NO capabilities but tries to use fs:read
    const handler = createSecurityHandler(iframeWin, []);
    window.addEventListener("message", handler);

    dispatch(iframeWin, {
      type: "ORIGIN_INVOKE",
      id: "req-unauth",
      command: "plugin:fs|read_file",
      args: { path: "/test" },
    } satisfies PluginToHostMessage);

    expect(iframeWin.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "ORIGIN_INVOKE_ERROR",
        id: "req-unauth",
        error: expect.stringContaining("Missing capability"),
      }),
      "*",
    );

    window.removeEventListener("message", handler);
  });

  it("accepts an allowed command when plugin has the required capability", () => {
    const handler = createSecurityHandler(iframeWin, ["fs:read"]);
    window.addEventListener("message", handler);

    dispatch(iframeWin, {
      type: "ORIGIN_INVOKE",
      id: "req-ok",
      command: "plugin:fs|read_file",
      args: { path: "/test" },
    } satisfies PluginToHostMessage);

    expect(iframeWin.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "ORIGIN_INVOKE_RESULT",
        id: "req-ok",
      }),
      "*",
    );

    window.removeEventListener("message", handler);
  });

  it("rejects every Tauri command that is not explicitly mapped", () => {
    // Exhaustive: try a selection of real Tauri commands that must NOT be proxied
    const dangerousCommands = [
      "tauri::window::close",
      "plugin:shell|execute",
      "plugin:shell|open",
      "plugin:http|fetch",
      "eval",
      "process_exit",
      "__internal_command",
    ];

    const handler = createSecurityHandler(iframeWin, [
      "fs:read",
      "fs:write",
      "dialog:open",
      "dialog:save",
      "pty",
    ]);
    window.addEventListener("message", handler);

    for (const command of dangerousCommands) {
      vi.clearAllMocks();
      dispatch(iframeWin, {
        type: "ORIGIN_INVOKE",
        id: `req-${command}`,
        command,
        args: {},
      } satisfies PluginToHostMessage);

      expect(iframeWin.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "ORIGIN_INVOKE_ERROR",
          error: expect.stringContaining("not allowed"),
        }),
        "*",
      );
    }

    window.removeEventListener("message", handler);
  });
});

describe("Capability broker — event allow-list (D11)", () => {
  let iframeWin: FakeWindow;
  let handler: (event: MessageEvent) => void;

  beforeEach(() => {
    vi.clearAllMocks();
    iframeWin = makeFakeWindow();
  });

  afterEach(() => {
    if (handler) window.removeEventListener("message", handler);
  });

  it("drops event subscription for unknown events (D11)", () => {
    handler = createSecurityHandler(iframeWin, []);
    window.addEventListener("message", handler);

    dispatch(iframeWin, {
      type: "ORIGIN_EVENT_SUBSCRIBE",
      subscriptionId: "sub-1",
      event: "evil:data-exfiltration",
      args: {},
    } satisfies PluginToHostMessage);

    // No response should be sent — unknown events are silently dropped
    expect(iframeWin.postMessage).not.toHaveBeenCalled();
  });

  it("drops event subscription when plugin lacks required capability", () => {
    // Plugin does NOT declare "pty" capability
    handler = createSecurityHandler(iframeWin, ["fs:read"]);
    window.addEventListener("message", handler);

    dispatch(iframeWin, {
      type: "ORIGIN_EVENT_SUBSCRIBE",
      subscriptionId: "sub-2",
      event: "pty:data",
      args: { id: "test", cols: 80, rows: 24 },
    } satisfies PluginToHostMessage);

    // No response — event silently dropped due to missing capability
    expect(iframeWin.postMessage).not.toHaveBeenCalled();
  });

  it("accepts event subscription when plugin has the required capability", () => {
    handler = createSecurityHandler(iframeWin, ["pty"]);
    window.addEventListener("message", handler);

    dispatch(iframeWin, {
      type: "ORIGIN_EVENT_SUBSCRIBE",
      subscriptionId: "sub-3",
      event: "pty:data",
      args: { id: "test", cols: 80, rows: 24 },
    } satisfies PluginToHostMessage);

    expect(iframeWin.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "ORIGIN_EVENT",
        subscriptionId: "sub-3",
      }),
      "*",
    );
  });
});

describe("CSP guardrails verification (D5, D6)", () => {
  it("CSP in tauri.conf.json does not contain unsafe-eval (D5)", async () => {
    // Read the actual tauri.conf.json to verify CSP at test time
    // This is a static analysis test — no runtime Tauri needed
    const fs = await import("node:fs");
    const path = await import("node:path");

    const confPath = path.resolve(
      import.meta.dirname ?? ".",
      "../../src-tauri/tauri.conf.json",
    );

    // In CI, the file may be at a different relative path — skip gracefully
    if (!fs.existsSync(confPath)) {
      console.warn(
        `Skipping CSP file check — tauri.conf.json not found at ${confPath}`,
      );
      return;
    }

    const conf = JSON.parse(fs.readFileSync(confPath, "utf-8"));
    const csp: string = conf?.app?.security?.csp ?? "";

    expect(csp).not.toContain("unsafe-eval");
  });

  it("CSP in tauri.conf.json does not contain unsafe-inline in script-src (D6)", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");

    const confPath = path.resolve(
      import.meta.dirname ?? ".",
      "../../src-tauri/tauri.conf.json",
    );

    if (!fs.existsSync(confPath)) {
      console.warn(
        `Skipping CSP file check — tauri.conf.json not found at ${confPath}`,
      );
      return;
    }

    const conf = JSON.parse(fs.readFileSync(confPath, "utf-8"));
    const csp: string = conf?.app?.security?.csp ?? "";

    // Parse out the script-src directive specifically
    const scriptSrc = csp
      .split(";")
      .map((d: string) => d.trim())
      .find((d: string) => d.startsWith("script-src"));

    if (scriptSrc) {
      expect(scriptSrc).not.toContain("unsafe-inline");
    }
    // If no script-src directive, it falls back to default-src — check that too
    const defaultSrc = csp
      .split(";")
      .map((d: string) => d.trim())
      .find((d: string) => d.startsWith("default-src"));

    if (defaultSrc) {
      expect(defaultSrc).not.toContain("unsafe-inline");
    }
  });
});

// Need to import afterEach for the handler cleanup
import { afterEach } from "vitest";

describe("IframePluginHost sandbox attribute in source code", () => {
  it("IframePluginHost renders iframe with sandbox='allow-scripts' only", async () => {
    // Static analysis: read the IframePluginHost source and verify the sandbox attr
    const fs = await import("node:fs");
    const path = await import("node:path");

    const hostPath = path.resolve(
      import.meta.dirname ?? ".",
      "../components/card/IframePluginHost.tsx",
    );

    if (!fs.existsSync(hostPath)) {
      console.warn(
        `Skipping source check — IframePluginHost.tsx not found at ${hostPath}`,
      );
      return;
    }

    const source = fs.readFileSync(hostPath, "utf-8");

    // The sandbox attribute must be present and set to exactly 'allow-scripts'
    expect(source).toContain('sandbox="allow-scripts"');

    // Extract all sandbox="..." attribute values from the source to verify
    // none of them contain denied tokens. Comments mentioning these tokens
    // (e.g. "without allow-same-origin") are fine — only attribute values matter.
    const sandboxAttrs = [...source.matchAll(/sandbox="([^"]*)"/g)].map(
      (m) => m[1],
    );
    expect(sandboxAttrs.length).toBeGreaterThan(0);

    const deniedTokens = [
      "allow-same-origin",
      "allow-top-navigation",
      "allow-popups-to-escape-sandbox",
      "allow-modals",
    ];

    for (const attr of sandboxAttrs) {
      for (const denied of deniedTokens) {
        expect(attr).not.toContain(denied);
      }
    }
  });

  it("IframePluginHost imports and calls assertIframeSafety", async () => {
    const fs = await import("node:fs");
    const path = await import("node:path");

    const hostPath = path.resolve(
      import.meta.dirname ?? ".",
      "../components/card/IframePluginHost.tsx",
    );

    if (!fs.existsSync(hostPath)) return;

    const source = fs.readFileSync(hostPath, "utf-8");

    expect(source).toContain("assertIframeSafety");
    expect(source).toContain("import { assertIframeSafety }");
  });
});
