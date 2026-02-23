import type { PluginModule } from "@/types/plugin";
import { getPlugin } from "./registry";

const cache = new Map<string, Promise<PluginModule>>();

export function loadPlugin(id: string): Promise<PluginModule> {
  if (cache.has(id)) return cache.get(id)!;
  const entry = getPlugin(id);
  if (!entry) return Promise.reject(new Error(`Plugin not registered: ${id}`));
  const promise = entry.load();
  cache.set(id, promise);
  return promise;
}
