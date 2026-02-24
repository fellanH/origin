import {
  Group,
  Panel as ResizablePanel,
  Separator,
} from "react-resizable-panels";
import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import { panelRefs } from "@/lib/panelRefs";
import Card from "./Card";

interface Props {
  nodeId: string;
}

function CardTree({ nodeId }: Props) {
  const node = useWorkspaceStore((s) => selectActiveWorkspace(s).nodes[nodeId]);

  if (!node) return null;

  if (node.type === "leaf") {
    return <Card nodeId={nodeId} />;
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
      <ResizablePanel
        defaultSize={node.sizes[0]}
        panelRef={(handle) => {
          if (handle) panelRefs.set(node.childIds[0], handle);
          else panelRefs.delete(node.childIds[0]);
        }}
      >
        <CardTree nodeId={node.childIds[0]} />
      </ResizablePanel>
      <Separator className="w-px bg-border/30 hover:bg-border transition-colors" />
      <ResizablePanel
        defaultSize={node.sizes[1]}
        panelRef={(handle) => {
          if (handle) panelRefs.set(node.childIds[1], handle);
          else panelRefs.delete(node.childIds[1]);
        }}
      >
        <CardTree nodeId={node.childIds[1]} />
      </ResizablePanel>
    </Group>
  );
}

export default CardTree;
