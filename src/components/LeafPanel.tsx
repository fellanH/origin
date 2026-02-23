import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";

interface Props {
  nodeId: string;
}

function LeafPanel({ nodeId }: Props) {
  const focusedPanelId = useWorkspaceStore(
    (s) => selectActiveWorkspace(s).focusedPanelId,
  );
  const node = useWorkspaceStore((s) => selectActiveWorkspace(s).nodes[nodeId]);
  const setFocus = useWorkspaceStore((s) => s.setFocus);
  const closePanel = useWorkspaceStore((s) => s.closePanel);

  const isFocused = focusedPanelId === nodeId;
  const pluginId = node?.type === "leaf" ? node.pluginId : null;

  return (
    <div
      className={`group relative h-full w-full cursor-pointer${isFocused ? " ring-1 ring-inset ring-primary/40" : ""}`}
      onClick={() => setFocus(nodeId)}
    >
      {pluginId === null ? (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-2xl font-light text-muted-foreground/40 select-none">
            +
          </span>
        </div>
      ) : (
        <div className="p-4 text-sm text-muted-foreground">{pluginId}</div>
      )}

      <button
        className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded text-xs text-muted-foreground/50 opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          closePanel(nodeId);
        }}
        aria-label="Close panel"
        tabIndex={-1}
      >
        ×
      </button>
    </div>
  );
}

export default LeafPanel;
