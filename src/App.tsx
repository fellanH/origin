import { useEffect } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import PanelGrid from "@/components/PanelGrid";
import TabBar from "@/components/TabBar";

function App() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);

  useKeyboardShortcuts();

  useEffect(() => {
    const win = getCurrentWindow();
    let unlisten: (() => void) | undefined;
    win
      .onCloseRequested((e) => {
        const state = useWorkspaceStore.getState();
        const ws = selectActiveWorkspace(state);
        if (ws.rootId !== null) {
          e.preventDefault(); // panels open — block close
        }
        // rootId is null → allow close → traffic lights work
      })
      .then((fn) => {
        unlisten = fn;
      });
    return () => unlisten?.();
  }, []);

  return (
    <div className="flex h-screen flex-col">
      <TabBar />
      <div className="flex-1 overflow-hidden">
        <PanelGrid key={activeWorkspaceId} />
      </div>
    </div>
  );
}

export default App;
