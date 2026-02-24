import { invoke } from "@tauri-apps/api/core";
import type { PluginManifest, PluginModule } from "@/types/plugin";

// v1 bundled plugins — import() strings must be literals for Vite static analysis.
const BUNDLED: Record<
  string,
  { load: () => Promise<PluginModule>; name: string; icon?: string }
> = {
  "com.origin.notepad": {
    load: () => import("@origin/notepad") as Promise<PluginModule>,
    name: "Notepad",
    icon: "📝",
  },
};

export interface RegistryEntry {
  id: string;
  name: string;
  icon?: string;
  tier: "L0" | "L1";
  load: () => Promise<PluginModule>;
  /**
   * Full manifest for L1 (sandboxed iframe) plugins — used by IframePluginHost
   * to enforce the capability allow-list for ORIGIN_INVOKE and ORIGIN_EVENT_SUBSCRIBE.
   * Absent for L0 plugins (they run in the main React tree and call Tauri directly).
   */
  manifest?: PluginManifest;
}

function buildV1Registry(): RegistryEntry[] {
  return Object.entries(BUNDLED).map(([id, entry]) => ({
    id,
    tier: "L0" as const,
    ...entry,
  }));
}

let _registry: RegistryEntry[] = buildV1Registry();

// Called once at bootstrap, before React mounts.
// Fetches installed v2 plugins from Tauri and appends them to the registry.
export async function initRegistry(): Promise<void> {
  const installed = await invoke<PluginManifest[]>("list_installed_plugins");
  const v2 = installed
    .filter((p) => !(p.id in BUNDLED))
    .map(
      (p): RegistryEntry => ({
        id: p.id,
        name: p.name,
        icon: p.icon,
        tier: "L1",
        manifest: p,
        load: () =>
          import(
            /* @vite-ignore */ `plugin://localhost/${p.id}/index.js`
          ) as Promise<PluginModule>,
      }),
    );
  _registry = [...buildV1Registry(), ...v2];
}

export function getPluginRegistry(): RegistryEntry[] {
  return _registry;
}

export function getPlugin(id: string): RegistryEntry | undefined {
  return _registry.find((p) => p.id === id);
}
