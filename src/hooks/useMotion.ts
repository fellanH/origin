import { useMemo } from "react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { getMotionTokens } from "@/lib/motion";
import type { MotionTokens } from "@/lib/motion";
export function useMotion(): MotionTokens {
  const animationSpeed = useWorkspaceStore((s) => s.animationSpeed);
  const prefersReducedMotion = useReducedMotion();
  return useMemo(() => getMotionTokens(animationSpeed, prefersReducedMotion), [animationSpeed, prefersReducedMotion]);
}
