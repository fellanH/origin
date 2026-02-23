import type { PluginModule } from "@/types/plugin";
import pluginsJson from "../../note.plugins.json";

// Each key must match the "id" field in note.plugins.json.
// The import() strings must be literals for Vite static analysis.
const IMPORT_MAP: Record<string, () => Promise<PluginModule>> = {
  "com.note.hello": () => import("@note/hello") as Promise<PluginModule>,
};

export interface RegistryEntry {
  id: string;
  package: string;
  load: () => Promise<PluginModule>;
}

// Build the registry from note.plugins.json, attaching the correct loader.
export const pluginRegistry: RegistryEntry[] = pluginsJson.plugins
  .filter((p) => p.id in IMPORT_MAP)
  .map((p) => ({ ...p, load: IMPORT_MAP[p.id] }));

export function getPlugin(id: string): RegistryEntry | undefined {
  return pluginRegistry.find((p) => p.id === id);
}
