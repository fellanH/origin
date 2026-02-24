import { useState, useEffect, useRef, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { loadPlugin, getCachedPlugin } from "@/plugins/loader";
import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import type {
  PluginComponent,
  PluginContext,
  PluginLifecycleEvent,
} from "@/types/plugin";

// ─── Lightweight per-panel event emitter ────────────────────────────────────

type HandlerSet = Set<() => void>;

function createEmitter() {
  const listeners = new Map<string, HandlerSet>();

  function on(event: string, handler: () => void): () => void {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event)!.add(handler);
    return () => listeners.get(event)?.delete(handler);
  }

  function emit(event: string): void {
    listeners.get(event)?.forEach((h) => h());
  }

  return { on, emit };
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  pluginId: string;
  /** The card ID for this panel — used to derive focus/zoom state. */
  nodeId: string;
  context: Omit<PluginContext, "on">;
}

function PluginHostInner({ pluginId, nodeId, context }: Props) {
  const [Component, setComponent] = useState<PluginComponent | null>(
    () => getCachedPlugin(pluginId)?.default ?? null,
  );
  const [error, setError] = useState<string | null>(null);

  // ── Emitter (stable across renders) ───────────────────────────────────────
  const emitterRef = useRef(createEmitter());
  const emit = emitterRef.current.emit;

  // ── Store subscriptions ───────────────────────────────────────────────────
  const focusedCardId = useWorkspaceStore(
    (s) => selectActiveWorkspace(s).focusedCardId,
  );
  const zoomedCardId = useWorkspaceStore(
    (s) => selectActiveWorkspace(s).zoomedCardId,
  );

  // ── focus / blur ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (focusedCardId === nodeId) {
      emit("focus");
    } else {
      emit("blur");
    }
  }, [focusedCardId, nodeId, emit]);

  // ── zoom / zoom-exit ──────────────────────────────────────────────────────
  const prevZoomedRef = useRef<string | null>(null);
  useEffect(() => {
    const prev = prevZoomedRef.current;
    prevZoomedRef.current = zoomedCardId;

    if (zoomedCardId === nodeId && prev !== nodeId) {
      emit("zoom");
    } else if (prev === nodeId && zoomedCardId !== nodeId) {
      emit("zoom-exit");
    }
  }, [zoomedCardId, nodeId, emit]);

  // ── resize (ResizeObserver on the container element) ──────────────────────
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const observer = new ResizeObserver(() => {
      if (debounceTimer !== null) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => emit("resize"), 100);
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (debounceTimer !== null) clearTimeout(debounceTimer);
    };
  }, [emit]);

  // ── Stable `on` bound to this panel's emitter ────────────────────────────
  const on = useCallback(
    (event: PluginLifecycleEvent, handler: () => void): (() => void) =>
      emitterRef.current.on(event, handler),
    [],
  );

  // ── Plugin loading ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!getCachedPlugin(pluginId)) {
      setComponent(null);
      setError(null);
    }
    loadPlugin(pluginId)
      .then((mod) => {
        if (mod) setComponent(() => mod.default);
        else setError(`Plugin not registered: ${pluginId}`);
      })
      .catch((err) => setError(String(err?.message ?? err)));
  }, [pluginId]);

  const fullContext: PluginContext = { ...context, on };

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm text-destructive">
        Plugin error: {error}
      </div>
    );
  }
  if (!Component) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        Loading…
      </div>
    );
  }
  return (
    <div ref={containerRef} className="h-full w-full">
      <Component context={fullContext} />
    </div>
  );
}

export default function PluginHost({ pluginId, nodeId, context }: Props) {
  return (
    <ErrorBoundary
      resetKeys={[pluginId]}
      fallbackRender={({ error }) => (
        <div className="flex h-full items-center justify-center p-4 text-sm text-destructive">
          Plugin error: {error instanceof Error ? error.message : String(error)}
        </div>
      )}
    >
      <PluginHostInner pluginId={pluginId} nodeId={nodeId} context={context} />
    </ErrorBoundary>
  );
}
