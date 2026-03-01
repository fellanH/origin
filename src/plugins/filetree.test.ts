/**
 * @origin/filetree — L1 plugin validation (#151)
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

vi.mock("@tauri-apps/api/core", () => ({ invoke: vi.fn().mockResolvedValue([]) }));

import { getPlugin, initRegistry } from "./registry";
import { invoke } from "@tauri-apps/api/core";
import { COMMAND_CAPABILITY_MAP } from "@/lib/iframeProtocol";

const MANIFEST = {
  id: "com.origin.filetree", name: "File Tree", version: "0.1.0",
  description: "Browse your local filesystem", icon: "📁",
  requiredCapabilities: ["fs:read", "dialog:open"],
};

const BUNDLE_DIR = path.resolve(import.meta.dirname, "../../src-tauri/assets/plugins/com.origin.filetree");

function findBundleJs(): string {
  const files = fs.readdirSync(path.join(BUNDLE_DIR, "assets"));
  const f = files.find((x) => x.endsWith(".js"));
  if (!f) throw new Error("No JS bundle found");
  return path.join(BUNDLE_DIR, "assets", f);
}

describe("com.origin.filetree — manifest", () => {
  it("id is reverse-domain", () => { expect(MANIFEST.id).toMatch(/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){2,}$/); });
  it("has required fields", () => { expect(MANIFEST.name).toBe("File Tree"); expect(MANIFEST.version).toMatch(/^\d+\.\d+\.\d+$/); });
  it("requires fs:read and dialog:open", () => { expect(MANIFEST.requiredCapabilities).toContain("fs:read"); expect(MANIFEST.requiredCapabilities).toContain("dialog:open"); });
  it("does NOT require fs:write", () => { expect(MANIFEST.requiredCapabilities).not.toContain("fs:write"); });
  it("has exactly 2 capabilities", () => { expect(MANIFEST.requiredCapabilities).toHaveLength(2); });
  it("all capabilities in COMMAND_CAPABILITY_MAP", () => { const caps = new Set(Object.values(COMMAND_CAPABILITY_MAP)); for (const c of MANIFEST.requiredCapabilities) expect(caps.has(c)).toBe(true); });
});

describe("com.origin.filetree — capability map", () => {
  it("plugin:fs|read_dir → fs:read", () => { expect(COMMAND_CAPABILITY_MAP["plugin:fs|read_dir"]).toBe("fs:read"); });
  it("plugin:dialog|open → dialog:open", () => { expect(COMMAND_CAPABILITY_MAP["plugin:dialog|open"]).toBe("dialog:open"); });
});

describe("com.origin.filetree — registry", () => {
  beforeEach(() => { vi.clearAllMocks(); });
  it("tier L1, correct id", async () => { vi.mocked(invoke).mockResolvedValueOnce([MANIFEST]); await initRegistry(); const e = getPlugin("com.origin.filetree"); expect(e?.tier).toBe("L1"); expect(e?.id).toBe("com.origin.filetree"); });
  it("carries manifest with capabilities", async () => { vi.mocked(invoke).mockResolvedValueOnce([MANIFEST]); await initRegistry(); expect(getPlugin("com.origin.filetree")?.manifest?.requiredCapabilities).toEqual(["fs:read", "dialog:open"]); });
  it("load() is thenable", async () => { vi.mocked(invoke).mockResolvedValueOnce([MANIFEST]); await initRegistry(); const r = getPlugin("com.origin.filetree")!.load().catch(() => undefined); expect(typeof r.then).toBe("function"); });
});

describe("com.origin.filetree — bundle compliance", () => {
  let src: string;
  beforeEach(() => { src = fs.readFileSync(findBundleJs(), "utf-8"); });
  it("no @tauri-apps/api", () => { expect(src).not.toContain("@tauri-apps/api"); expect(src).not.toContain("__TAURI__"); });
  it("uses ORIGIN_INVOKE", () => { expect(src).toContain("ORIGIN_INVOKE"); });
  it("sends ORIGIN_READY", () => { expect(src).toContain("ORIGIN_READY"); });
  it("uses ORIGIN_CONFIG_SET", () => { expect(src).toContain("ORIGIN_CONFIG_SET"); });
  it("calls plugin:fs|read_dir", () => { expect(src).toContain("plugin:fs|read_dir"); });
  it("calls plugin:dialog|open", () => { expect(src).toContain("plugin:dialog|open"); });
  it("no plugin:fs|write_text_file", () => { expect(src).not.toContain("plugin:fs|write_text_file"); });
  it("no plugin:fs|mkdir", () => { expect(src).not.toContain("plugin:fs|mkdir"); });
  it("no plugin:fs|exists", () => { expect(src).not.toContain("plugin:fs|exists"); });
  it("no plugin:fs|read_text_file", () => { expect(src).not.toContain("plugin:fs|read_text_file"); });
  it("manifest.json matches", () => { const p = JSON.parse(fs.readFileSync(path.join(BUNDLE_DIR, "manifest.json"), "utf-8")) as Record<string, unknown>; expect(p.id).toBe("com.origin.filetree"); expect(p.requiredCapabilities).toEqual(["fs:read", "dialog:open"]); });
});
