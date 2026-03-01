import { invoke } from "@tauri-apps/api/core";
import type { PluginManifest, PluginModule } from "@/types/plugin";

export interface RegistryEntry {
  id: string;
  name: string;
  icon?: string;
  tier: "L1";
  load: () => Promise<PluginModule>;
  manifest?: PluginManifest;
}

let _registry: RegistryEntry[] = [];

function pluginImportUrl(pluginId: string, bustCache: boolean): string {
  const base = `plugin://localhost/${pluginId}/index.js`;
  return bustCache ? `${base}?v=${Date.now()}` : base;
}

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
          /* @vite-ignore */ pluginImportUrl(p.id, false)
        ) as Promise<PluginModule>,
    }),
  );
}

export async function reloadRegistry(): Promise<void> {
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
          /* @vite-ignore */ pluginImportUrl(p.id, true)
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
