import { useEffect, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import { panelRefs } from "@/lib/panelRefs";

// ─── Types ────────────────────────────────────────────────────────────────────

type KeyboardShortcutsOptions = {
  /** Called when CMD+, is pressed — toggle settings panel */
  onToggleSettings: () => void;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useKeyboardShortcuts({
  onToggleSettings,
}: KeyboardShortcutsOptions): void {
  // Stable ref so the event listener closure always calls the latest callback
  // without needing to re-register the listener on every render.
  const onToggleSettingsRef = useRef(onToggleSettings);
  useEffect(() => {
    onToggleSettingsRef.current = onToggleSettings;
  });

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (!e.metaKey) return;

      // CMD+, — toggle settings panel (no altKey / shiftKey required)
      if (e.key === "," && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        onToggleSettingsRef.current();
        return;
      }

      // ── CMD+Opt+… shortcuts ──────────────────────────────────────────────
      if (e.altKey) {
        // ── CMD+Shift+Opt+… : swap focused panel in a direction ────────────
        if (e.shiftKey) {
          if (e.code === "KeyH" || e.code === "ArrowLeft") {
            e.preventDefault();
            useWorkspaceStore.getState().swapPanel("left");
          } else if (e.code === "KeyL" || e.code === "ArrowRight") {
            e.preventDefault();
            useWorkspaceStore.getState().swapPanel("right");
          } else if (e.code === "KeyK" || e.code === "ArrowUp") {
            e.preventDefault();
            useWorkspaceStore.getState().swapPanel("up");
          } else if (e.code === "KeyJ" || e.code === "ArrowDown") {
            e.preventDefault();
            useWorkspaceStore.getState().swapPanel("down");
          }
          return;
        }

        if (e.code === "Tab") {
          // CMD+Opt+Tab: toggle last workspace
          e.preventDefault();
          useWorkspaceStore.getState().switchToLastWorkspace();
        } else if (e.code === "KeyH" || e.code === "ArrowLeft") {
          e.preventDefault();
          useWorkspaceStore.getState().moveFocus("left");
        } else if (e.code === "KeyL" || e.code === "ArrowRight") {
          e.preventDefault();
          useWorkspaceStore.getState().moveFocus("right");
        } else if (e.code === "KeyK" || e.code === "ArrowUp") {
          e.preventDefault();
          useWorkspaceStore.getState().moveFocus("up");
        } else if (e.code === "KeyJ" || e.code === "ArrowDown") {
          e.preventDefault();
          useWorkspaceStore.getState().moveFocus("down");
        } else if (e.code === "Equal") {
          // CMD+Opt+= : grow focused panel by 5%
          e.preventDefault();
          const focusedId = selectActiveWorkspace(
            useWorkspaceStore.getState(),
          )?.focusedCardId;
          if (focusedId) {
            const handle = panelRefs.get(focusedId);
            if (handle) {
              const pct = handle.getSize().asPercentage;
              handle.resize(Math.min(pct + 5, 95));
            }
          }
        } else if (e.code === "Minus") {
          // CMD+Opt+- : shrink focused panel by 5%
          e.preventDefault();
          const focusedId = selectActiveWorkspace(
            useWorkspaceStore.getState(),
          )?.focusedCardId;
          if (focusedId) {
            const handle = panelRefs.get(focusedId);
            if (handle) {
              const pct = handle.getSize().asPercentage;
              handle.resize(Math.max(pct - 5, 5));
            }
          }
        } else if (e.code === "Digit0") {
          // CMD+Opt+0 : equalize all panels
          e.preventDefault();
          useWorkspaceStore.getState().applyLayoutPreset("equal");
        } else if (e.code === "KeyM") {
          // CMD+Opt+M : main + sidebar (focused 60%, sibling 40%)
          e.preventDefault();
          useWorkspaceStore.getState().applyLayoutPreset("main-sidebar");
        } else if (e.code === "KeyF") {
          // CMD+Opt+F : toggle zoom on focused panel
          e.preventDefault();
          const state = useWorkspaceStore.getState();
          const focusedCardId = selectActiveWorkspace(state)?.focusedCardId;
          if (!focusedCardId) return;
          const current = state.zoomedNodeId;
          state.setZoomedNodeId(
            current === focusedCardId ? null : focusedCardId,
          );
        }
        return;
      }

      if (e.key.toLowerCase() === "d") {
        e.preventDefault();
        const state = useWorkspaceStore.getState();
        const ws = selectActiveWorkspace(state);
        if (!ws || ws.rootId === null) {
          state.addInitialCard();
          return;
        }
        if (!ws.focusedCardId) return;
        state.splitCard(
          ws.focusedCardId,
          e.shiftKey ? "vertical" : "horizontal",
        );
      } else if (e.key === "w" && !e.shiftKey) {
        e.preventDefault();
        const state = useWorkspaceStore.getState();
        // If a zoom overlay is active, dismiss it first instead of closing the panel
        if (state.zoomedNodeId !== null) {
          state.setZoomedNodeId(null);
          return;
        }
        const focusedCardId = selectActiveWorkspace(state)?.focusedCardId;
        if (!focusedCardId) return;
        state.closeCard(focusedCardId);
      } else if (e.key === "t") {
        e.preventDefault();
        useWorkspaceStore.getState().addWorkspace();
      } else if (/^[1-9]$/.test(e.key)) {
        e.preventDefault();
        const { workspaces } = useWorkspaceStore.getState();
        const target = workspaces[Number(e.key) - 1];
        if (target) useWorkspaceStore.getState().setActiveWorkspace(target.id);
      } else if (e.key === "s") {
        e.preventDefault();
        useWorkspaceStore.getState().setPendingSaveName(true);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    let cancelled = false;
    let unlisten: (() => void) | undefined;

    listen("close-workspace", () => {
      const state = useWorkspaceStore.getState();
      state.closeWorkspace(state.activeWorkspaceId);
    }).then((fn) => {
      if (!cancelled) {
        unlisten = fn;
      } else {
        // Component already unmounted — clean up the listener immediately
        fn();
      }
    });

    return () => {
      cancelled = true;
      window.removeEventListener("keydown", handleKeyDown);
      unlisten?.();
    };
  }, []);
}
