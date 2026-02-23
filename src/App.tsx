import { useWorkspaceStore } from "@/store/workspaceStore";
import PanelGrid from "@/components/PanelGrid";

function App() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);

  return (
    <div className="flex h-screen flex-col">
      <div
        data-tauri-drag-region
        className="flex h-12 shrink-0 items-center pl-[80px] pr-4"
      >
        <span className="select-none text-sm font-medium">note</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <PanelGrid key={activeWorkspaceId} />
      </div>
    </div>
  );
}

export default App;
