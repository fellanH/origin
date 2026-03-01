import { useEffect, useRef } from "react";
import { watch } from "@tauri-apps/plugin-fs";
import { appDataDir } from "@tauri-apps/api/path";

import { useWorkspaceStore } from "@/store/workspaceStore";
import { clearPluginCache } from "@/plugins/loader";
import { reloadRegistry } from "@/plugins/registry";

export function usePluginWatcher(): void {
  const devMode = useWorkspaceStore((s) => s.devMode);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!devMode) return;

    let unwatchFn: (() => void) | null = null;
    let cancelled = false;

    async function startWatcher(): Promise<void> {
      try {
        const dataDir = await appDataDir();
        const pluginsPath = `${dataDir}plugins`;

        unwatchFn = await watch(
          pluginsPath,
          () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            debounceRef.current = setTimeout(() => {
              if (cancelled) return;
              console.info("[hot-reload] Plugin change detected, reloading...");
              clearPluginCache();
              reloadRegistry()
                .then(() => {
                  useWorkspaceStore.getState().bumpRegistryVersion();
                  console.info("[hot-reload] Plugins reloaded.");
                })
                .catch((e: unknown) => {
                  console.error("[hot-reload] Registry reload failed:", e);
                });
            }, 300);
          },
          { recursive: true },
        );
      } catch (e) {
        console.warn("[hot-reload] Failed to start plugin watcher:", e);
      }
    }

    startWatcher();

    return () => {
      cancelled = true;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (unwatchFn) unwatchFn();
    };
  }, [devMode]);
}
