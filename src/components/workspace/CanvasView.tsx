/**
 * CanvasView — spike/prototype for issue #190
 *
 * DOM-based infinite canvas: cards are `position: absolute` divs inside a
 * CSS-transformed pan/zoom container. Plugins (iframes, React components)
 * render natively — no <canvas> element or WebGL required.
 *
 * Interactions:
 *   - Scroll to zoom (wheel)
 *   - Drag empty space to pan
 *   - Drag card header to move
 *   - Drag card bottom-right corner to resize
 *   - Double-click empty space to add a card
 */

import { useCallback, useRef, useEffect, useState } from "react";
import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import { useShallow } from "zustand/shallow";
import Card from "@/components/card/Card";
import { cn } from "@/lib/utils";
import type { CardId, CardLeaf } from "@/types/card";

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_SCALE = 0.15;
const MAX_SCALE = 3;
const ZOOM_SENSITIVITY = 0.002;
const GRID_SIZE = 40;

// ─── CanvasCard ───────────────────────────────────────────────────────────────

interface CanvasCardProps {
  nodeId: CardId;
  leaf: CardLeaf;
  onDragStart: (cardId: CardId, e: React.PointerEvent) => void;
  onResizeStart: (cardId: CardId, e: React.PointerEvent) => void;
}

function CanvasCard({
  nodeId,
  leaf,
  onDragStart,
  onResizeStart,
}: CanvasCardProps) {
  const isFocused = useWorkspaceStore(
    (s) => selectActiveWorkspace(s)?.focusedCardId === nodeId,
  );
  const setFocus = useWorkspaceStore((s) => s.setFocus);
  const closeCard = useWorkspaceStore((s) => s.closeCard);

  const x = leaf.canvasX ?? 0;
  const y = leaf.canvasY ?? 0;
  const w = leaf.canvasWidth ?? 400;
  const h = leaf.canvasHeight ?? 300;

  return (
    <div
      className={cn(
        "absolute flex flex-col overflow-hidden rounded-lg border bg-background shadow-lg transition-shadow",
        isFocused
          ? "border-foreground/40 shadow-xl ring-2 ring-foreground/20"
          : "border-border hover:shadow-xl",
      )}
      style={{
        left: x,
        top: y,
        width: w,
        height: h,
      }}
      onClick={(e) => {
        e.stopPropagation();
        setFocus(nodeId);
      }}
    >
      {/* Drag handle header */}
      <div
        className="flex h-7 shrink-0 cursor-grab items-center justify-between border-b border-border/60 bg-muted/50 px-2 active:cursor-grabbing"
        onPointerDown={(e) => {
          e.stopPropagation();
          setFocus(nodeId);
          onDragStart(nodeId, e);
        }}
      >
        <span className="truncate text-[10px] font-medium text-muted-foreground">
          {leaf.pluginId ?? "Empty"}
        </span>
        <button
          className="flex h-4 w-4 items-center justify-center rounded text-[10px] text-muted-foreground/60 hover:bg-muted hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            closeCard(nodeId);
          }}
          aria-label="Close card"
        >
          ×
        </button>
      </div>

      {/* Plugin content area */}
      <div className="relative flex-1 overflow-hidden">
        <Card nodeId={nodeId} />
      </div>

      {/* Resize handle (bottom-right corner) */}
      <div
        className="absolute bottom-0 right-0 h-4 w-4 cursor-nwse-resize"
        onPointerDown={(e) => {
          e.stopPropagation();
          onResizeStart(nodeId, e);
        }}
      >
        <svg
          className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 text-muted-foreground/40"
          viewBox="0 0 10 10"
          fill="currentColor"
        >
          <circle cx="8" cy="8" r="1.5" />
          <circle cx="4" cy="8" r="1.5" />
          <circle cx="8" cy="4" r="1.5" />
        </svg>
      </div>
    </div>
  );
}

// ─── CanvasGrid ───────────────────────────────────────────────────────────────

function CanvasGrid({
  offsetX,
  offsetY,
  scale,
}: {
  offsetX: number;
  offsetY: number;
  scale: number;
}) {
  const gridSize = GRID_SIZE * scale;
  // Only render grid when it would be visible (not too zoomed out)
  if (gridSize < 8) return null;

  const ox = (offsetX % gridSize + gridSize) % gridSize;
  const oy = (offsetY % gridSize + gridSize) % gridSize;

  return (
    <svg className="pointer-events-none absolute inset-0 h-full w-full">
      <defs>
        <pattern
          id="canvas-grid"
          x={ox}
          y={oy}
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={gridSize / 2}
            cy={gridSize / 2}
            r={0.8}
            className="fill-foreground/10"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#canvas-grid)" />
    </svg>
  );
}

// ─── CanvasView ───────────────────────────────────────────────────────────────

export default function CanvasView() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Read canvas viewport state
  const viewport = useWorkspaceStore(
    useShallow((s) => {
      const ws = selectActiveWorkspace(s);
      return ws?.canvasViewport ?? { offsetX: 0, offsetY: 0, scale: 1 };
    }),
  );

  // Read all leaf nodes for the active workspace
  const leafNodes = useWorkspaceStore(
    useShallow((s) => {
      const ws = selectActiveWorkspace(s);
      if (!ws) return [];
      return Object.values(ws.nodes).filter(
        (n): n is CardLeaf => n.type === "leaf",
      );
    }),
  );

  const setCanvasViewport = useWorkspaceStore((s) => s.setCanvasViewport);
  const moveCanvasCard = useWorkspaceStore((s) => s.moveCanvasCard);
  const resizeCanvasCard = useWorkspaceStore((s) => s.resizeCanvasCard);
  const addCanvasCard = useWorkspaceStore((s) => s.addCanvasCard);
  const setFocus = useWorkspaceStore((s) => s.setFocus);

  // ── Drag state (not in store — ephemeral interaction state) ──────────────

  const [isPanning, setIsPanning] = useState(false);
  const dragRef = useRef<{
    type: "pan" | "move" | "resize";
    cardId?: CardId;
    startX: number;
    startY: number;
    startOffsetX: number;
    startOffsetY: number;
    startCardX: number;
    startCardY: number;
    startCardW: number;
    startCardH: number;
  } | null>(null);

  // ── Wheel → zoom ────────────────────────────────────────────────────────

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      const { offsetX, offsetY, scale } = useWorkspaceStore.getState()
        .workspaces.find(
          (w) => w.id === useWorkspaceStore.getState().activeWorkspaceId,
        )?.canvasViewport ?? { offsetX: 0, offsetY: 0, scale: 1 };

      const rect = container!.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const delta = -e.deltaY * ZOOM_SENSITIVITY;
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale + delta * scale));

      // Zoom toward cursor: adjust offset so the point under the cursor stays fixed
      const scaleRatio = newScale / scale;
      const newOffsetX = mouseX - (mouseX - offsetX) * scaleRatio;
      const newOffsetY = mouseY - (mouseY - offsetY) * scaleRatio;

      setCanvasViewport({
        offsetX: newOffsetX,
        offsetY: newOffsetY,
        scale: newScale,
      });
    }

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [setCanvasViewport]);

  // ── Pointer move/up (document-level for smooth dragging) ─────────────────

  useEffect(() => {
    function handlePointerMove(e: PointerEvent) {
      const drag = dragRef.current;
      if (!drag) return;

      const dx = e.clientX - drag.startX;
      const dy = e.clientY - drag.startY;

      if (drag.type === "pan") {
        setCanvasViewport({
          offsetX: drag.startOffsetX + dx,
          offsetY: drag.startOffsetY + dy,
        });
      } else if (drag.type === "move" && drag.cardId) {
        const { scale } = useWorkspaceStore.getState()
          .workspaces.find(
            (w) => w.id === useWorkspaceStore.getState().activeWorkspaceId,
          )?.canvasViewport ?? { scale: 1 };
        moveCanvasCard(
          drag.cardId,
          drag.startCardX + dx / scale,
          drag.startCardY + dy / scale,
        );
      } else if (drag.type === "resize" && drag.cardId) {
        const { scale } = useWorkspaceStore.getState()
          .workspaces.find(
            (w) => w.id === useWorkspaceStore.getState().activeWorkspaceId,
          )?.canvasViewport ?? { scale: 1 };
        resizeCanvasCard(
          drag.cardId,
          drag.startCardW + dx / scale,
          drag.startCardH + dy / scale,
        );
      }
    }

    function handlePointerUp() {
      dragRef.current = null;
      setIsPanning(false);
    }

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [setCanvasViewport, moveCanvasCard, resizeCanvasCard]);

  // ── Pan start (pointer down on empty space) ──────────────────────────────

  const handleContainerPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Only left button on the container itself (not a card)
      if (e.button !== 0) return;
      if (e.target !== e.currentTarget && !(e.target as HTMLElement).closest("[data-canvas-bg]")) return;

      setIsPanning(true);
      dragRef.current = {
        type: "pan",
        startX: e.clientX,
        startY: e.clientY,
        startOffsetX: viewport.offsetX,
        startOffsetY: viewport.offsetY,
        startCardX: 0,
        startCardY: 0,
        startCardW: 0,
        startCardH: 0,
      };
      // Deselect cards when panning starts
      setFocus(null);
    },
    [viewport.offsetX, viewport.offsetY, setFocus],
  );

  // ── Card drag start ──────────────────────────────────────────────────────

  const handleCardDragStart = useCallback(
    (cardId: CardId, e: React.PointerEvent) => {
      const state = useWorkspaceStore.getState();
      const ws = state.workspaces.find(
        (w) => w.id === state.activeWorkspaceId,
      );
      const node = ws?.nodes[cardId];
      if (!node || node.type !== "leaf") return;

      dragRef.current = {
        type: "move",
        cardId,
        startX: e.clientX,
        startY: e.clientY,
        startOffsetX: 0,
        startOffsetY: 0,
        startCardX: node.canvasX ?? 0,
        startCardY: node.canvasY ?? 0,
        startCardW: 0,
        startCardH: 0,
      };
    },
    [],
  );

  // ── Card resize start ────────────────────────────────────────────────────

  const handleCardResizeStart = useCallback(
    (cardId: CardId, e: React.PointerEvent) => {
      const state = useWorkspaceStore.getState();
      const ws = state.workspaces.find(
        (w) => w.id === state.activeWorkspaceId,
      );
      const node = ws?.nodes[cardId];
      if (!node || node.type !== "leaf") return;

      dragRef.current = {
        type: "resize",
        cardId,
        startX: e.clientX,
        startY: e.clientY,
        startOffsetX: 0,
        startOffsetY: 0,
        startCardX: 0,
        startCardY: 0,
        startCardW: node.canvasWidth ?? 400,
        startCardH: node.canvasHeight ?? 300,
      };
    },
    [],
  );

  // ── Double-click to add card ─────────────────────────────────────────────

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== e.currentTarget && !(e.target as HTMLElement).closest("[data-canvas-bg]")) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const { offsetX, offsetY, scale } = useWorkspaceStore.getState()
        .workspaces.find(
          (w) => w.id === useWorkspaceStore.getState().activeWorkspaceId,
        )?.canvasViewport ?? { offsetX: 0, offsetY: 0, scale: 1 };

      // Convert screen coords to canvas coords
      const canvasX = (e.clientX - rect.left - offsetX) / scale;
      const canvasY = (e.clientY - rect.top - offsetY) / scale;

      addCanvasCard(canvasX, canvasY);
    },
    [addCanvasCard],
  );

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full overflow-hidden bg-background",
        isPanning ? "cursor-grabbing" : "cursor-default",
      )}
      onPointerDown={handleContainerPointerDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* Background grid */}
      <div data-canvas-bg>
        <CanvasGrid
          offsetX={viewport.offsetX}
          offsetY={viewport.offsetY}
          scale={viewport.scale}
        />
      </div>

      {/* Transform container — positions all cards in canvas space */}
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{
          transform: `translate(${viewport.offsetX}px, ${viewport.offsetY}px) scale(${viewport.scale})`,
          willChange: "transform",
        }}
      >
        {leafNodes.map((leaf) => (
          <CanvasCard
            key={leaf.id}
            nodeId={leaf.id}
            leaf={leaf}
            onDragStart={handleCardDragStart}
            onResizeStart={handleCardResizeStart}
          />
        ))}
      </div>

      {/* HUD — zoom indicator + controls */}
      <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-md border border-border/60 bg-background/90 px-2.5 py-1.5 text-[10px] text-muted-foreground shadow-sm backdrop-blur-sm">
        <button
          className="hover:text-foreground"
          onClick={() => {
            const { scale } = viewport;
            setCanvasViewport({ scale: Math.max(MIN_SCALE, scale - 0.15) });
          }}
          aria-label="Zoom out"
        >
          −
        </button>
        <span className="min-w-[3ch] text-center font-mono">
          {Math.round(viewport.scale * 100)}%
        </span>
        <button
          className="hover:text-foreground"
          onClick={() => {
            const { scale } = viewport;
            setCanvasViewport({ scale: Math.min(MAX_SCALE, scale + 0.15) });
          }}
          aria-label="Zoom in"
        >
          +
        </button>
        <span className="mx-1 h-3 w-px bg-border" />
        <button
          className="hover:text-foreground"
          onClick={() =>
            setCanvasViewport({ offsetX: 0, offsetY: 0, scale: 1 })
          }
          aria-label="Reset view"
        >
          ⌂
        </button>
        <span className="mx-1 h-3 w-px bg-border" />
        <span>
          {leafNodes.length} card{leafNodes.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Empty state hint */}
      {leafNodes.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-muted-foreground/50">
            Double-click to add a card
          </p>
        </div>
      )}
    </div>
  );
}
