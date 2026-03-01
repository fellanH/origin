import { useEffect, useRef, useState } from "react";
import { useWorkspaceStore, selectActiveWorkspace } from "@/store/workspaceStore";
import EmptyState from "@/components/card/EmptyState";
import CardTree from "./CardTree";
import CanvasView from "./CanvasView";
import Card from "@/components/card/Card";

/** Duration for the tiling/canvas transition. Uses motion system slow token. */
const TRANSITION_DURATION_MS = 280;

type TransitionPhase = "idle" | "entering-canvas" | "entering-tiling";

function CardLayout() {
  const rootId = useWorkspaceStore((s) => selectActiveWorkspace(s)?.rootId);
  const viewMode = useWorkspaceStore((s) => selectActiveWorkspace(s)?.viewMode ?? "tiling");
  const zoomedNodeId = useWorkspaceStore((s) => s.zoomedNodeId);
  const [phase, setPhase] = useState<TransitionPhase>("idle");
  const prevModeRef = useRef(viewMode);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const prev = prevModeRef.current;
    prevModeRef.current = viewMode;
    if (prev === viewMode) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (viewMode === "canvas" && prev === "tiling") {
      setPhase("entering-canvas");
      timerRef.current = setTimeout(() => setPhase("idle"), TRANSITION_DURATION_MS);
    } else if (viewMode === "tiling" && prev === "canvas") {
      setPhase("entering-tiling");
      timerRef.current = setTimeout(() => setPhase("idle"), TRANSITION_DURATION_MS);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [viewMode]);

  if (viewMode === "canvas") return <CanvasView isTransitioning={phase === "entering-canvas"} />;
  if (!rootId) return <EmptyState />;
  return (
    <div className="relative h-full w-full">
      <CardTree nodeId={rootId} />
      {zoomedNodeId !== null && <div className="absolute inset-0 z-50"><Card nodeId={zoomedNodeId} /></div>}
    </div>
  );
}

export default CardLayout;
