import { useRef, useEffect, useMemo } from "react";
import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import EmptyState from "@/components/EmptyState";
import PluginHost from "@/components/PluginHost";
import IframePluginHost from "@/components/IframePluginHost";
import { pluginBus } from "@/lib/pluginBus";
import { getPlugin } from "@/plugins/registry";
import { cn } from "@/lib/utils";
import { useSystemTheme } from "@/hooks/useSystemTheme";
import type { PluginContext } from "@/types/plugin";

interface Props {
  nodeId: string;
}

function Card({ nodeId }: Props) {
  const isFocused = useWorkspaceStore(
    (s) => selectActiveWorkspace(s)?.focusedCardId === nodeId,
  );
  const node = useWorkspaceStore(
    (s) => selectActiveWorkspace(s)?.nodes[nodeId],
  );
  const setFocus = useWorkspaceStore((s) => s.setFocus);
  const closeCard = useWorkspaceStore((s) => s.closeCard);
  const appDataDir = useWorkspaceStore((s) => s.appDataDir);
  const launcherOpenForNodeId = useWorkspaceStore(
    (s) => s.launcherOpenForNodeId,
  );

  const pluginId = node?.type === "leaf" ? node.pluginId : null;
  const tier = pluginId ? (getPlugin(pluginId)?.tier ?? "L0") : null;
  const theme = useSystemTheme();

  const pluginContext = useMemo<Omit<PluginContext, "on">>(
    () => ({
      cardId: nodeId,
      workspacePath: appDataDir,
      theme,
      bus: pluginBus,
    }),
    [nodeId, appDataDir, theme],
  );

  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isFocused) divRef.current?.focus();
  }, [isFocused]);

  return (
    <div
      ref={divRef}
      tabIndex={-1}
      className={cn(
        "group relative h-full w-full cursor-pointer overflow-hidden outline-none",
        isFocused ? "ring-2 ring-inset ring-foreground/30" : "",
      )}
      onClick={() => setFocus(nodeId)}
    >
      {pluginId === null ? (
        <EmptyState
          cardId={nodeId}
          autoOpen={launcherOpenForNodeId === nodeId}
        />
      ) : tier === "L1" ? (
        <IframePluginHost pluginId={pluginId} context={pluginContext} />
      ) : (
        <PluginHost
          pluginId={pluginId}
          nodeId={nodeId}
          context={pluginContext}
        />
      )}

      <button
        className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded text-xs text-muted-foreground/50 opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          closeCard(nodeId);
        }}
        aria-label="Close card"
        tabIndex={-1}
      >
        ×
      </button>
    </div>
  );
}

export default Card;
