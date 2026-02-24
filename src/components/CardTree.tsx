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
        className="overflow-hidden"
        panelRef={(handle) => {
          if (handle) panelRefs.set(node.childIds[0], handle);
          else panelRefs.delete(node.childIds[0]);
        }}
      >
        <CardTree nodeId={node.childIds[0]} />
      </ResizablePanel>
      <Separator className="shrink-0 bg-border hover:bg-foreground/30 active:bg-foreground/50 transition-colors aria-[orientation=vertical]:w-[3px] aria-[orientation=vertical]:h-full aria-[orientation=horizontal]:h-[3px] aria-[orientation=horizontal]:w-full" />
      <ResizablePanel
        defaultSize={node.sizes[1]}
        className="overflow-hidden"
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
