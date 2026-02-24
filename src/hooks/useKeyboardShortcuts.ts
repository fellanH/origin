import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";

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
        }
        return;
      }

      if (e.key.toLowerCase() === "d") {
        e.preventDefault();
        const state = useWorkspaceStore.getState();
        const ws = selectActiveWorkspace(state);
        if (ws.rootId === null) {
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
        const { focusedCardId } = selectActiveWorkspace(state);
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

    let unlistenMenu: (() => void) | undefined;
    listen("close-workspace", () => {
      const state = useWorkspaceStore.getState();
      state.closeWorkspace(state.activeWorkspaceId);
    }).then((fn) => {
      unlistenMenu = fn;
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      unlistenMenu?.();
    };
  }, []);
}
