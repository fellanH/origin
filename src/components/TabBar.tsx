import { useState } from "react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { cn } from "@/lib/utils";
import SavedConfigMenu from "@/components/SavedConfigMenu";
import PluginBrowser from "@/components/PluginBrowser";

export default function TabBar() {
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const addWorkspace = useWorkspaceStore((s) => s.addWorkspace);
  const closeWorkspace = useWorkspaceStore((s) => s.closeWorkspace);
  const setActiveWorkspace = useWorkspaceStore((s) => s.setActiveWorkspace);
  const renameWorkspace = useWorkspaceStore((s) => s.renameWorkspace);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  function startRename(id: string, name: string) {
    setEditingId(id);
    setEditValue(name);
  }

  function commitRename() {
    if (editingId) {
      const trimmed = editValue.trim();
      if (trimmed) renameWorkspace(editingId, trimmed);
    }
    setEditingId(null);
  }

  function cancelRename() {
    setEditingId(null);
  }

  return (
    <div className="flex h-[38px] shrink-0 items-center pl-[80px]" data-tauri-drag-region>
      {workspaces.map((ws) => {
        const isActive = ws.id === activeWorkspaceId;
        const isEditing = editingId === ws.id;

        return (
          <div
            key={ws.id}
            className={cn(
              "flex h-full cursor-pointer select-none items-center gap-1 px-3 text-sm",
              isActive
                ? "border-b-2 border-foreground/80 bg-muted/60"
                : "hover:bg-muted/40",
            )}
            onClick={() => setActiveWorkspace(ws.id)}
          >
            {isEditing ? (
              <input
                autoFocus
                className="w-24 bg-transparent text-sm outline-none"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitRename}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    commitRename();
                  } else if (e.key === "Escape") {
                    e.preventDefault();
                    cancelRename();
                  }
                }}
              />
            ) : (
              <span onDoubleClick={() => startRename(ws.id, ws.name)}>
                {ws.name}
              </span>
            )}
            <button
              tabIndex={-1}
              className="ml-1 flex items-center justify-center opacity-50 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                closeWorkspace(ws.id);
              }}
            >
              ×
            </button>
          </div>
        );
      })}

      <button
        tabIndex={-1}
        className="flex h-full select-none items-center px-2 text-sm opacity-60 hover:opacity-100"
        onClick={addWorkspace}
      >
        +
      </button>

      <SavedConfigMenu />
      <PluginBrowser />
      <div className="flex-1 self-stretch" data-tauri-drag-region />
    </div>
  );
}
