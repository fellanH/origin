import {
  Group,
  Panel as ResizablePanel,
  Separator,
} from "react-resizable-panels";
import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import LeafPanel from "./LeafPanel";

interface Props {
  nodeId: string;
}

function PanelBranch({ nodeId }: Props) {
  const node = useWorkspaceStore((s) => selectActiveWorkspace(s).nodes[nodeId]);

  if (!node) return null;

  if (node.type === "leaf") {
    return <LeafPanel nodeId={nodeId} />;
  }

  // node.type === "split"
  return (
    <Group
      orientation={node.direction}
      onLayoutChanged={(sizes) =>
        useWorkspaceStore
          .getState()
          .resizeSplit(nodeId, sizes as unknown as [number, number])
      }
      className="h-full w-full"
    >
      <ResizablePanel defaultSize={node.sizes[0]}>
        <PanelBranch nodeId={node.childIds[0]} />
      </ResizablePanel>
      <Separator className="w-px bg-border/30 hover:bg-border transition-colors" />
      <ResizablePanel defaultSize={node.sizes[1]}>
        <PanelBranch nodeId={node.childIds[1]} />
      </ResizablePanel>
    </Group>
  );
}

export default PanelBranch;
