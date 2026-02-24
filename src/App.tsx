import { useEffect, useState, useCallback } from "react";
import { appDataDir } from "@tauri-apps/api/path";
import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import CardLayout from "@/components/CardLayout";
import TabBar from "@/components/TabBar";
import WorkspaceOverlay from "@/components/WorkspaceOverlay";

function App() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setAppDataDir = useWorkspaceStore((s) => s.setAppDataDir);
  const workspace = useWorkspaceStore(selectActiveWorkspace);
  const setFocus = useWorkspaceStore((s) => s.setFocus);

  const [showOverlay, setShowOverlay] = useState(false);

  useKeyboardShortcuts();

  useEffect(() => {
    appDataDir().then(setAppDataDir);
  }, [setAppDataDir]);

  // CMD+Opt+G — toggle workspace overview HUD
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      if (e.metaKey && e.altKey && e.code === "KeyG") {
        e.preventDefault();
        setShowOverlay((prev) => !prev);
        return;
      }
      // Any keypress while overlay is open dismisses it (except modifier-only keys)
      if (showOverlay && !e.metaKey && !e.altKey && !e.ctrlKey) {
        if (e.key === "Escape" || (!e.key.startsWith("F") && e.key !== "Tab")) {
          setShowOverlay(false);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showOverlay]);

  const handleSelectCard = useCallback(
    (cardId: string) => {
      setFocus(cardId);
      setShowOverlay(false);
    },
    [setFocus],
  );

  return (
    <div className="flex h-screen flex-col">
      <TabBar />
      <div className="flex-1 overflow-hidden">
        <CardLayout key={activeWorkspaceId} />
      </div>

      {showOverlay && (
        <WorkspaceOverlay
          nodes={workspace.nodes}
          rootId={workspace.rootId}
          focusedCardId={workspace.focusedCardId}
          onSelectCard={handleSelectCard}
          onClose={() => setShowOverlay(false)}
        />
      )}
    </div>
  );
}

export default App;
