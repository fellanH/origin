import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import EmptyState from "./EmptyState";
import CardTree from "./CardTree";

function CardLayout() {
  const rootId = useWorkspaceStore((s) => selectActiveWorkspace(s).rootId);

  if (rootId === null) {
    return <EmptyState />;
  }

  return (
    <div className="h-full w-full">
      <CardTree nodeId={rootId} />
    </div>
  );
}

export default CardLayout;
