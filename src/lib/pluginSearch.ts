import type { RegistryPlugin } from "@/components/card/PluginBrowser/types";

/**
 * Filter and sort registry plugins for the marketplace Discover tab.
 *
 * - Text search matches against name, description, author, and tags (case-insensitive).
 * - Tag filter narrows to plugins that include the selected tag.
 * - Results are sorted: featured first, then alphabetically by name.
 */
export function filterPlugins(
  plugins: RegistryPlugin[],
  query: string,
  tag: string | null,
): RegistryPlugin[] {
  const q = query.trim().toLowerCase();

  const filtered = plugins.filter((p) => {
    // Tag filter
    if (tag && !p.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      return false;
    }

    // Text search — match if query is empty or found in searchable fields
    if (q.length === 0) return true;

    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      (p.tags?.some((t) => t.toLowerCase().includes(q)) ?? false)
    );
  });

  return sortPlugins(filtered);
}

/**
 * Sort plugins: featured first, then alphabetically by name.
 */
function sortPlugins(plugins: RegistryPlugin[]): RegistryPlugin[] {
  return [...plugins].sort((a, b) => {
    // Featured plugins come first
    const aFeat = a.featured ? 1 : 0;
    const bFeat = b.featured ? 1 : 0;
    if (aFeat !== bFeat) return bFeat - aFeat;

    // Then alphabetical by name
    return a.name.localeCompare(b.name);
  });
}

/**
 * Collect all unique tags from a list of plugins (case-preserved, deduplicated
 * case-insensitively). Returns sorted alphabetically.
 */
export function collectTags(plugins: RegistryPlugin[]): string[] {
  const seen = new Map<string, string>(); // lowercase → first-seen casing
  for (const p of plugins) {
    for (const t of p.tags ?? []) {
      const key = t.toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, t);
      }
    }
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}

/**
 * Build a set of installed plugin IDs for O(1) lookup.
 */
export function buildInstalledSet(
  installedIds: string[],
): Set<string> {
  return new Set(installedIds);
}
