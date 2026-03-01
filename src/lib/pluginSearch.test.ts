/**
 * Plugin marketplace — search, filter, and sort logic.
 */

import { describe, it, expect } from "vitest";
import { filterPlugins, collectTags, buildInstalledSet } from "./pluginSearch";
import type { RegistryPlugin } from "@/components/card/PluginBrowser/types";

function makePlugin(overrides: Partial<RegistryPlugin> = {}): RegistryPlugin {
  return {
    id: "com.example.test",
    name: "Test Plugin",
    description: "A test plugin.",
    author: "tester",
    version: "1.0.0",
    ...overrides,
  };
}

const PLUGINS: RegistryPlugin[] = [
  makePlugin({
    id: "com.origin.notepad",
    name: "Notepad",
    description: "Simple text editor",
    author: "origin",
    tags: ["editor", "text"],
    featured: true,
  }),
  makePlugin({
    id: "com.origin.terminal",
    name: "Terminal",
    description: "Embedded terminal emulator",
    author: "origin",
    tags: ["terminal", "dev-tools"],
  }),
  makePlugin({
    id: "com.community.markdown",
    name: "Markdown Preview",
    description: "Live markdown renderer",
    author: "community",
    tags: ["editor", "markdown"],
  }),
  makePlugin({
    id: "com.community.clock",
    name: "Clock",
    description: "A simple clock widget",
    author: "community",
    tags: ["utility"],
  }),
];

// ─── filterPlugins ────────────────────────────────────────────────────────────

describe("filterPlugins", () => {
  it("returns all plugins when query is empty and no tag filter", () => {
    const result = filterPlugins(PLUGINS, "", null);
    expect(result).toHaveLength(4);
  });

  it("filters by name (case-insensitive)", () => {
    const result = filterPlugins(PLUGINS, "notepad", null);
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe("com.origin.notepad");
  });

  it("filters by description", () => {
    const result = filterPlugins(PLUGINS, "terminal emulator", null);
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe("com.origin.terminal");
  });

  it("filters by author", () => {
    const result = filterPlugins(PLUGINS, "community", null);
    expect(result).toHaveLength(2);
  });

  it("filters by tag text in search query", () => {
    const result = filterPlugins(PLUGINS, "markdown", null);
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe("com.community.markdown");
  });

  it("filters by tag selector", () => {
    const result = filterPlugins(PLUGINS, "", "editor");
    expect(result).toHaveLength(2);
    const ids = result.map((p) => p.id);
    expect(ids).toContain("com.origin.notepad");
    expect(ids).toContain("com.community.markdown");
  });

  it("combines query and tag filter", () => {
    const result = filterPlugins(PLUGINS, "notepad", "editor");
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe("com.origin.notepad");
  });

  it("returns empty for no matches", () => {
    const result = filterPlugins(PLUGINS, "nonexistent", null);
    expect(result).toHaveLength(0);
  });

  it("sorts featured plugins first", () => {
    const result = filterPlugins(PLUGINS, "", null);
    expect(result[0]!.id).toBe("com.origin.notepad");
    expect(result[0]!.featured).toBe(true);
  });

  it("sorts non-featured alphabetically", () => {
    const result = filterPlugins(PLUGINS, "", null);
    // After featured (Notepad), remaining should be alphabetical:
    // Clock, Markdown Preview, Terminal
    const nonFeatured = result.slice(1);
    expect(nonFeatured[0]!.name).toBe("Clock");
    expect(nonFeatured[1]!.name).toBe("Markdown Preview");
    expect(nonFeatured[2]!.name).toBe("Terminal");
  });

  it("handles whitespace-only query as empty", () => {
    const result = filterPlugins(PLUGINS, "   ", null);
    expect(result).toHaveLength(4);
  });

  it("tag filter is case-insensitive", () => {
    const result = filterPlugins(PLUGINS, "", "EDITOR");
    expect(result).toHaveLength(2);
  });

  it("handles plugins without tags gracefully", () => {
    const noTagPlugins = [makePlugin({ id: "com.example.bare", tags: undefined })];
    const result = filterPlugins(noTagPlugins, "", "editor");
    expect(result).toHaveLength(0);
  });
});

// ─── collectTags ──────────────────────────────────────────────────────────────

describe("collectTags", () => {
  it("collects all unique tags sorted alphabetically", () => {
    const tags = collectTags(PLUGINS);
    expect(tags).toEqual(["dev-tools", "editor", "markdown", "terminal", "text", "utility"]);
  });

  it("deduplicates case-insensitively", () => {
    const plugins = [
      makePlugin({ tags: ["Editor"] }),
      makePlugin({ tags: ["editor"] }),
    ];
    const tags = collectTags(plugins);
    expect(tags).toHaveLength(1);
    // Preserves first-seen casing
    expect(tags[0]).toBe("Editor");
  });

  it("returns empty array when no tags", () => {
    const plugins = [makePlugin({ tags: undefined })];
    expect(collectTags(plugins)).toEqual([]);
  });

  it("returns empty array for empty plugin list", () => {
    expect(collectTags([])).toEqual([]);
  });
});

// ─── buildInstalledSet ────────────────────────────────────────────────────────

describe("buildInstalledSet", () => {
  it("creates a set from installed IDs", () => {
    const set = buildInstalledSet(["com.origin.notepad", "com.origin.terminal"]);
    expect(set.has("com.origin.notepad")).toBe(true);
    expect(set.has("com.origin.terminal")).toBe(true);
    expect(set.has("com.unknown.plugin")).toBe(false);
  });

  it("handles empty list", () => {
    const set = buildInstalledSet([]);
    expect(set.size).toBe(0);
  });
});
