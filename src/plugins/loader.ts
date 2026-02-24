import type { PluginModule } from "@/types/plugin";
import { getPlugin } from "./registry";

const _promiseCache = new Map<string, Promise<PluginModule | null>>();
const _cache = new Map<string, PluginModule>();

export function getCachedPlugin(id: string): PluginModule | undefined {
  return _cache.get(id);
}

export function loadPlugin(id: string): Promise<PluginModule | null> {
  if (_promiseCache.has(id)) return _promiseCache.get(id)!;
  const entry = getPlugin(id);
  if (!entry) return Promise.resolve(null);
  const promise = entry
    .load()
    .then((mod) => {
      _cache.set(id, mod);
      return mod;
    })
    .catch((e: unknown) => {
      console.error(`[origin] Plugin "${id}" failed to load:`, e);
      return null;
    });
  _promiseCache.set(id, promise);
  return promise;
}

export function clearPluginCache(): void {
  _promiseCache.clear();
  _cache.clear();
}
