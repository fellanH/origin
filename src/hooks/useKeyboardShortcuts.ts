import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import { panelRefs } from "@/lib/panelRefs";

export function useKeyboardShortcuts(): void {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (!e.metaKey) return;

      // ── CMD+Opt+… shortcuts ──────────────────────────────────────────────
      if (e.altKey) {
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
