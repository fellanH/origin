import { useState, useEffect } from "react";
import { useWorkspaceStore } from "@/store/workspaceStore";

/**
 * Returns the effective "light" | "dark" theme by resolving the user's stored
 * ThemePreference against the current OS appearance:
 *
 * - "light"  → always "light"
 * - "dark"   → always "dark"
 * - "system" → follows prefers-color-scheme, updates reactively
 *
 * This is the single source of truth consumed by both the shell (class
 * application on <html>) and plugin context (PluginContext.theme).
 */
export function useResolvedTheme(): "light" | "dark" {
  const themePreference = useWorkspaceStore((s) => s.themePreference);

  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  );

  useEffect(() => {
    if (themePreference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent): void =>
      setSystemTheme(e.matches ? "dark" : "light");
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [themePreference]);

  if (themePreference === "light") return "light";
  if (themePreference === "dark") return "dark";
  return systemTheme;
}
