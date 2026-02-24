import type { CardId, CardMap, CardNode } from "@/types/card";
import { getPlugin } from "@/plugins/registry";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  /** Flat node map for the active workspace */
  nodes: CardMap;
  /** Root node id (null = empty workspace) */
  rootId: CardId | null;
  /** Currently focused card id */
  focusedCardId: CardId | null;
  /** Called when the user clicks a leaf panel in the overview */
  onSelectCard: (cardId: CardId) => void;
  /** Called when the overlay should close (backdrop click, keyboard) */
  onClose: () => void;
}

// ─── Mini panel tree ─────────────────────────────────────────────────────────

interface NodeProps {
  nodeId: CardId;
  nodes: CardMap;
  focusedCardId: CardId | null;
  onSelectCard: (cardId: CardId) => void;
}

function MiniNode({ nodeId, nodes, focusedCardId, onSelectCard }: NodeProps) {
  const node: CardNode | undefined = nodes[nodeId];
  if (!node) return null;

  if (node.type === "split") {
    return (
      <div
        className={cn(
          "flex h-full w-full gap-[2px]",
          node.direction === "horizontal" ? "flex-row" : "flex-col",
        )}
      >
        {node.childIds.map((childId, idx) => (
          <div
            key={childId}
            style={{ flex: node.sizes[idx] ?? 1 }}
            className="min-h-0 min-w-0 overflow-hidden"
          >
            <MiniNode
              nodeId={childId}
              nodes={nodes}
              focusedCardId={focusedCardId}
              onSelectCard={onSelectCard}
            />
          </div>
        ))}
      </div>
    );
  }

  // Leaf node
  const isFocused = node.id === focusedCardId;
  const pluginEntry = node.pluginId ? getPlugin(node.pluginId) : undefined;
  const label = pluginEntry?.name ?? (node.pluginId ? node.pluginId : "Empty");

  return (
    <button
      className={cn(
        "pointer-events-auto flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-[3px] border transition-colors",
        isFocused
          ? "border-foreground/60 bg-foreground/10 ring-1 ring-inset ring-foreground/40"
          : "border-border/60 bg-muted/40 hover:bg-muted/70 hover:border-foreground/30",
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelectCard(node.id);
      }}
      title={label}
    >
      <span className="truncate px-1 text-[9px] font-medium leading-none text-muted-foreground">
        {label}
      </span>
    </button>
  );
}

// ─── WorkspaceOverlay ─────────────────────────────────────────────────────────

export default function WorkspaceOverlay({
  nodes,
  rootId,
  focusedCardId,
  onSelectCard,
  onClose,
}: Props) {
  const isEmpty = rootId === null;

  return (
    // Full-screen backdrop — pointer events on the backdrop element dismiss the overlay
    <div
      className="pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
      role="dialog"
      aria-modal="true"
      aria-label="Workspace overview"
    >
      {/* Card — stop click propagation so only backdrop click dismisses */}
      <div
        className="pointer-events-auto flex flex-col gap-3 rounded-xl border border-border/80 bg-background/95 p-4 shadow-2xl animate-in zoom-in-95 fade-in duration-150"
        style={{ width: 440, maxWidth: "calc(100vw - 48px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Workspace overview
          </span>
          <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
            esc
          </kbd>
        </div>

        {/* Panel map */}
        <div
          className="overflow-hidden rounded-md border border-border/60 bg-muted/20"
          style={{ height: 280 }}
        >
          {isEmpty ? (
            <div className="flex h-full items-center justify-center">
              <span className="text-xs text-muted-foreground">
                No panels open
              </span>
            </div>
          ) : (
            <div className="h-full p-2">
              <MiniNode
                nodeId={rootId}
                nodes={nodes}
                focusedCardId={focusedCardId}
                onSelectCard={onSelectCard}
              />
            </div>
          )}
        </div>

        {/* Footer hint */}
        <p className="text-[10px] text-muted-foreground/70">
          Click a panel to focus it — or press any key to dismiss
        </p>
      </div>
    </div>
  );
}
