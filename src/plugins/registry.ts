import { invoke } from "@tauri-apps/api/core";
import type { PluginManifest, PluginModule } from "@/types/plugin";

export interface RegistryEntry {
  id: string;
  name: string;
  icon?: string;
  tier: "L1";
  load: () => Promise<PluginModule>;
  /**
   * Full manifest for L1 (sandboxed iframe) plugins — used by IframePluginHost
   * to enforce the capability allow-list for ORIGIN_INVOKE and ORIGIN_EVENT_SUBSCRIBE.
   */
  manifest?: PluginManifest;
}

let _registry: RegistryEntry[] = [];

// Called once at bootstrap, before React mounts.
// Fetches all installed plugins from Tauri and populates the registry.
export async function initRegistry(): Promise<void> {
  const installed = await invoke<PluginManifest[]>("list_installed_plugins");
  _registry = installed.map(
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
}

export function getPluginRegistry(): RegistryEntry[] {
  return _registry;
}

export function getPlugin(id: string): RegistryEntry | undefined {
  return _registry.find((p) => p.id === id);
}
