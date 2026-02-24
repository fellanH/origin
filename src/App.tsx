import { useEffect } from "react";
import { appDataDir } from "@tauri-apps/api/path";
import {
  useWorkspaceStore,
} from "@/store/workspaceStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import CardLayout from "@/components/CardLayout";
import TabBar from "@/components/TabBar";

function App() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setAppDataDir = useWorkspaceStore((s) => s.setAppDataDir);

  useKeyboardShortcuts();

  useEffect(() => {
    appDataDir().then(setAppDataDir);
  }, [setAppDataDir]);

  return (
    <div className="flex h-screen flex-col">
      <TabBar />
      <div className="flex-1 overflow-hidden">
        <CardLayout key={activeWorkspaceId} />
      </div>
    </div>
  );
}

export default App;
