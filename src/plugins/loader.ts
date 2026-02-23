import type { PluginModule } from "@/types/plugin";
import { getPlugin } from "./registry";

const cache = new Map<string, Promise<PluginModule | null>>();

export function loadPlugin(id: string): Promise<PluginModule | null> {
  if (cache.has(id)) return cache.get(id)!;
  const entry = getPlugin(id);
  if (!entry) return Promise.resolve(null);
  const promise = entry.load().catch((e: unknown) => {
    console.error(`[origin] Plugin "${id}" failed to load:`, e);
    return null;
  });
  cache.set(id, promise);
  return promise;
}

export function clearPluginCache(): void {
  cache.clear();
}
