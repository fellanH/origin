import type { PluginModule } from "@/types/plugin";
import pluginsJson from "../../origin.plugins.json";

// Each key must match the "id" field in origin.plugins.json.
// The import() strings must be literals for Vite static analysis.
const IMPORT_MAP: Record<
  string,
  { load: () => Promise<PluginModule>; name: string; icon?: string }
> = {
  "com.origin.hello": {
    load: () => import("@origin/hello") as Promise<PluginModule>,
    name: "Hello",
    icon: "👋",
  },
};

export interface RegistryEntry {
  id: string;
  package: string;
  name: string;
  icon?: string;
  load: () => Promise<PluginModule>;
}

// Build the registry from origin.plugins.json, attaching the correct loader.
export const pluginRegistry: RegistryEntry[] = pluginsJson.plugins
  .filter((p) => p.id in IMPORT_MAP)
  .map((p) => ({ id: p.id, package: p.package, ...IMPORT_MAP[p.id] }));

export function getPlugin(id: string): RegistryEntry | undefined {
  return pluginRegistry.find((p) => p.id === id);
}
