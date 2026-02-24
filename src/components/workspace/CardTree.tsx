import { Fragment } from "react";
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
import Card from "@/components/card/Card";

interface Props {
  nodeId: string;
}

function CardTree({ nodeId }: Props) {
  const node = useWorkspaceStore(
    (s) => selectActiveWorkspace(s)?.nodes[nodeId],
  );

  if (!node) return null;

  if (node.type === "leaf") {
    // key={nodeId} ensures React preserves this component instance (and all
    // plugin state inside it) when an adjacent panel splits and the surrounding
    // PanelGroup/ResizablePanel tree is restructured around this leaf.
    return <Card key={nodeId} nodeId={nodeId} />;
  }

  // node.type === "split" — N-ary children
  return (
    <Group
      orientation={node.direction}
      onLayoutChanged={(sizes) => {
        const sizesArr = Object.values(sizes);
        if (sizesArr.length === node.childIds.length) {
          useWorkspaceStore.getState().resizeSplit(nodeId, sizesArr);
        }
      }}
      className="h-full w-full"
    >
      {node.childIds.map((childId, idx) => (
        <Fragment key={childId}>
          {idx > 0 && (
            <Separator className="shrink-0 bg-border hover:bg-foreground/30 active:bg-foreground/50 transition-colors aria-[orientation=vertical]:w-[3px] aria-[orientation=vertical]:h-full aria-[orientation=horizontal]:h-[3px] aria-[orientation=horizontal]:w-full" />
          )}
          <ResizablePanel
            defaultSize={node.sizes[idx] ?? 50}
            className="overflow-hidden"
            panelRef={(handle) => {
              if (handle) panelRefs.set(childId, handle);
              else panelRefs.delete(childId);
            }}
          >
            <CardTree nodeId={childId} />
          </ResizablePanel>
        </Fragment>
      ))}
    </Group>
  );
}

export default CardTree;
