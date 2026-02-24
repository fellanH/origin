import { useRef, useEffect } from "react";
import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import EmptyState from "@/components/EmptyState";
import PluginHost from "@/components/PluginHost";
import type { PluginContext } from "@/types/plugin";
import { pluginBus } from "@/lib/pluginBus";
import { cn } from "@/lib/utils";

interface Props {
  nodeId: string;
}

function Card({ nodeId }: Props) {
  const focusedCardId = useWorkspaceStore(
    (s) => selectActiveWorkspace(s).focusedCardId,
  );
  const node = useWorkspaceStore((s) => selectActiveWorkspace(s).nodes[nodeId]);
  const setFocus = useWorkspaceStore((s) => s.setFocus);
  const closeCard = useWorkspaceStore((s) => s.closeCard);
  const appDataDir = useWorkspaceStore((s) => s.appDataDir);

  const isFocused = focusedCardId === nodeId;
  const pluginId = node?.type === "leaf" ? node.pluginId : null;

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
        <EmptyState cardId={nodeId} />
      ) : (
        <PluginHost
          pluginId={pluginId}
          context={
            {
              cardId: nodeId,
              workspacePath: appDataDir,
              theme: window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light",
              bus: pluginBus,
            } satisfies PluginContext
          }
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
