import { useEffect } from "react";
import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";

export function useKeyboardShortcuts(): void {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (!e.metaKey) return;

      if (e.key.toLowerCase() === "d") {
        e.preventDefault();
        const state = useWorkspaceStore.getState();
        const ws = selectActiveWorkspace(state);
        if (ws.rootId === null) {
          state.addInitialPanel();
          return;
        }
        if (!ws.focusedPanelId) return;
        state.splitPanel(
          ws.focusedPanelId,
          e.shiftKey ? "vertical" : "horizontal",
        );
      } else if (e.key === "w" && !e.shiftKey) {
        e.preventDefault();
        const state = useWorkspaceStore.getState();
        const { focusedPanelId } = selectActiveWorkspace(state);
        if (!focusedPanelId) return;
        state.closePanel(focusedPanelId);
      } else if (e.key === "t") {
        e.preventDefault();
        useWorkspaceStore.getState().addWorkspace();
      } else if (e.key === "W" && e.shiftKey) {
        e.preventDefault();
        const { activeWorkspaceId } = useWorkspaceStore.getState();
        useWorkspaceStore.getState().closeWorkspace(activeWorkspaceId);
      } else if (/^[1-9]$/.test(e.key)) {
        e.preventDefault();
        const { workspaces } = useWorkspaceStore.getState();
        const target = workspaces[Number(e.key) - 1];
        if (target) useWorkspaceStore.getState().setActiveWorkspace(target.id);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
