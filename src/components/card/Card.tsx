import { useRef, useEffect, useMemo, useCallback } from "react";
import { invoke as tauriInvoke } from "@tauri-apps/api/core";
import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import { useShallow } from "zustand/shallow";
import EmptyState from "./EmptyState";
import IframePluginHost from "./IframePluginHost";
import { getPlugin } from "@/plugins/registry";
import { cn } from "@/lib/utils";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";
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
  const bus = useWorkspaceStore((s) => s.buses[s.activeWorkspaceId])!;
  const setPluginConfig = useWorkspaceStore((s) => s.setPluginConfig);

  // Read per-instance config from the node. useShallow avoids re-renders when
  // the config object reference changes but its contents are identical.
  const pluginConfig = useWorkspaceStore(
    useShallow((s) => {
      const n = selectActiveWorkspace(s)?.nodes[nodeId];
      return n?.type === "leaf" ? (n.config ?? {}) : {};
    }),
  );

  const pluginId = node?.type === "leaf" ? node.pluginId : null;
  const pluginEntry = pluginId ? (getPlugin(pluginId) ?? null) : null;
  const theme = useResolvedTheme();

  // Stable setConfig callback — avoids unnecessary re-renders of the plugin
  const setConfig = useCallback(
    (patch: Record<string, unknown>) => {
      setPluginConfig(nodeId, patch);
    },
    [nodeId, setPluginConfig],
  );

  // invoke / onEvent: L1 plugins use the postMessage bridge in IframePluginHost —
  // these stubs satisfy PluginContext until the type is narrowed in a future pass.
  const invoke = useCallback(
    <T = unknown,>(
      command: string,
      args?: Record<string, unknown>,
    ): Promise<T> => tauriInvoke<T>(command, args),
    [],
  );

  const onEvent = useCallback(
    (
      _event: string,
      _args: Record<string, unknown>,
      _handler: (payload: unknown) => void,
    ): (() => void) =>
      () => {},
    [],
  );

  const pluginContext = useMemo<Omit<PluginContext, "on">>(
    () => ({
      cardId: nodeId,
      workspacePath: appDataDir,
      theme,
      bus,
      config: pluginConfig,
      setConfig,
      invoke,
      onEvent,
    }),
    [nodeId, appDataDir, theme, bus, pluginConfig, setConfig, invoke, onEvent],
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
      ) : (
        <IframePluginHost
          pluginId={pluginId}
          context={pluginContext}
          manifest={pluginEntry?.manifest}
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
