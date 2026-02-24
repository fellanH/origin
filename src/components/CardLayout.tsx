import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import EmptyState from "./EmptyState";
import CardTree from "./CardTree";
import Card from "./Card";

function CardLayout() {
  const rootId = useWorkspaceStore((s) => selectActiveWorkspace(s)?.rootId);
  const zoomedNodeId = useWorkspaceStore((s) => s.zoomedNodeId);

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
