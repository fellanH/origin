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
  const setFocus = useWorkspaceStore((s) => s.setFocus);

  const isFocused = focusedPanelId === nodeId;

  return (
    <div
      className={`h-full w-full cursor-pointer p-4 text-sm text-muted-foreground${isFocused ? " ring-1 ring-inset ring-primary/40" : ""}`}
      onClick={() => setFocus(nodeId)}
    >
      Panel: {nodeId}
    </div>
  );
}

export default LeafPanel;
