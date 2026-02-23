import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import EmptyState from "./EmptyState";
import PanelBranch from "./PanelBranch";

function PanelGrid() {
  const rootId = useWorkspaceStore((s) => selectActiveWorkspace(s).rootId);

  if (rootId === null) {
    return <EmptyState />;
  }

  return (
    <div className="h-full w-full">
      <PanelBranch nodeId={rootId} />
    </div>
  );
}

export default PanelGrid;
