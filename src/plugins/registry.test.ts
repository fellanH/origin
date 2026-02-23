/**
 * Plugin registry — Phase 4 tests
 *
 * Verifies the shape and contract of pluginRegistry before and after
 * implementing the registry and hello plugin (issues #9, #12).
 */

import { describe, it, expect } from "vitest";
import { pluginRegistry } from "./registry";

const REVERSE_DOMAIN_RE = /^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){2,}$/;

describe("pluginRegistry", () => {
  it("exports a plain object", () => {
    expect(typeof pluginRegistry).toBe("object");
    expect(Array.isArray(pluginRegistry)).toBe(false);
    expect(pluginRegistry).not.toBeNull();
  });

  it("has an entry for 'com.origin.hello'", () => {
    expect("com.origin.hello" in pluginRegistry).toBe(true);
  });

  it("all keys match reverse-domain format", () => {
    for (const key of Object.keys(pluginRegistry)) {
      expect(key, `key "${key}" does not match reverse-domain format`).toMatch(
        REVERSE_DOMAIN_RE,
      );
    }
  });

  it("all values are factory functions returning Promises", () => {
    for (const [key, factory] of Object.entries(pluginRegistry)) {
      expect(typeof factory, `registry["${key}"] is not a function`).toBe(
        "function",
      );
      const result = factory();
      expect(
        typeof result.then,
        `registry["${key}"]() does not return a thenable`,
      ).toBe("function");
    }
  });

  it("calling com.origin.hello factory returns a thenable", () => {
    const result = pluginRegistry["com.origin.hello"]();
    expect(typeof result.then).toBe("function");
  });
});
