import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { getPluginRegistry } from "@/plugins/registry";
import { useWorkspaceStore } from "@/store/workspaceStore";
import type { PluginManifest } from "@/types/plugin";

interface Props {
  cardId?: string;
}

type InstallStatus =
  | { type: "success"; name: string }
  | { type: "error"; message: string };

export default function EmptyState({ cardId }: Props) {
  const setPlugin = useWorkspaceStore((s) => s.setPlugin);
  const addInitialCard = useWorkspaceStore((s) => s.addInitialCard);
  const [installing, setInstalling] = useState(false);
  const [installStatus, setInstallStatus] = useState<InstallStatus | null>(
    null,
  );

  function handleSelect(pluginId: string) {
    setInstallStatus(null);
    if (cardId) {
      setPlugin(cardId, pluginId);
    } else {
      addInitialCard(pluginId);
    }
  }

  async function handleAddPlugin() {
    const dir = await open({ directory: true, title: "Select plugin folder" });
    if (!dir) return; // user cancelled
    setInstalling(true);
    try {
      const manifest = await invoke<PluginManifest>("install_plugin", {
        srcPath: dir,
      });
      setInstallStatus({ type: "success", name: manifest.name });
    } catch (e) {
      setInstallStatus({ type: "error", message: String(e) });
    } finally {
      setInstalling(false);
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <p className="text-sm font-medium">origin</p>
      <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
        <span>⌘D — split horizontally</span>
        <span>⌘⇧D — split vertically</span>
      </div>
      <div className="flex flex-col gap-1">
        {getPluginRegistry().map((entry) => (
          <button
            key={entry.id}
            className="rounded px-3 py-1.5 text-sm text-foreground hover:bg-muted"
            onClick={() => handleSelect(entry.id)}
          >
            {entry.icon && <span className="mr-2">{entry.icon}</span>}
            {entry.name}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center gap-1">
        <button
          className="text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
          onClick={handleAddPlugin}
          disabled={installing}
        >
          {installing ? "Installing…" : "Add plugin +"}
        </button>
        {installStatus?.type === "success" && (
          <p className="text-xs text-muted-foreground">
            &lsquo;{installStatus.name}&rsquo; installed —{" "}
            <button
              className="underline hover:text-foreground"
              onClick={() => invoke("restart_app")}
            >
              Restart now
            </button>{" "}
            to activate
          </p>
        )}
        {installStatus?.type === "error" && (
          <p className="text-xs text-destructive">{installStatus.message}</p>
        )}
      </div>
    </div>
  );
}
