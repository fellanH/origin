import { useRef, useEffect, useMemo } from "react";
import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import EmptyState from "./EmptyState";
import PluginHost from "./PluginHost";
import IframePluginHost from "./IframePluginHost";
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
  // Per-workspace bus: isolates events between workspace tabs
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const bus = useWorkspaceStore((s) => s.buses[s.activeWorkspaceId])!;

  const pluginId = node?.type === "leaf" ? node.pluginId : null;
  const tier = pluginId ? (getPlugin(pluginId)?.tier ?? "L0") : null;
  const theme = useSystemTheme();

  const pluginContext = useMemo<Omit<PluginContext, "on">>(
    () => ({
      cardId: nodeId,
      workspacePath: appDataDir,
      theme,
      bus,
    }),
    [nodeId, appDataDir, theme, bus],
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
