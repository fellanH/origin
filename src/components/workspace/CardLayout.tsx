import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import EmptyState from "@/components/card/EmptyState";
import CardTree from "./CardTree";
import CanvasView from "./CanvasView";
import Card from "@/components/card/Card";

function CardLayout() {
  const rootId = useWorkspaceStore((s) => selectActiveWorkspace(s)?.rootId);
  const viewMode = useWorkspaceStore(
    (s) => selectActiveWorkspace(s)?.viewMode ?? "tiling",
  );
  const zoomedNodeId = useWorkspaceStore((s) => s.zoomedNodeId);

  // Canvas mode — always render the canvas view (it handles its own empty state)
  if (viewMode === "canvas") {
    return <CanvasView />;
  }

  // Tiling mode
  if (!rootId) {
    return <EmptyState />;
  }

  return (
    <div className="relative h-full w-full">
      <CardTree nodeId={rootId} />
      {zoomedNodeId !== null && (
        <div className="absolute inset-0 z-50">
          <Card nodeId={zoomedNodeId} />
        </div>
      )}
    </div>
  );
}

export default CardLayout;
