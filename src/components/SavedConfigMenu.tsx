import { useEffect, useRef, useState } from "react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { cn } from "@/lib/utils";

export default function SavedConfigMenu() {
  const savedConfigs = useWorkspaceStore((s) => s.savedConfigs);
  const saveConfig = useWorkspaceStore((s) => s.saveConfig);
  const loadConfig = useWorkspaceStore((s) => s.loadConfig);
  const deleteConfig = useWorkspaceStore((s) => s.deleteConfig);

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleMouseDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  function handleSaveCurrent() {
    const name = window.prompt("Name this config:");
    if (name?.trim()) {
      saveConfig(name.trim());
    }
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative flex items-center">
      <button
        tabIndex={-1}
        className="flex h-full select-none items-center px-2 text-xs opacity-60 hover:opacity-100"
        onClick={() => setOpen((v) => !v)}
      >
        Saved ▾
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 min-w-[180px] rounded border bg-popover shadow-md">
          <button
            className="w-full px-3 py-1.5 text-left text-xs hover:bg-muted/60"
            onClick={handleSaveCurrent}
          >
            Save current
          </button>

          {savedConfigs.length > 0 && <hr className="border-border" />}

          {savedConfigs.length === 0 ? (
            <p className="px-3 py-1.5 text-xs text-muted-foreground">
              No saved configs
            </p>
          ) : (
            savedConfigs.map((c) => (
              <div
                key={c.id}
                className={cn(
                  "group flex cursor-pointer items-center justify-between px-3 py-1.5 text-xs hover:bg-muted/60",
                )}
                onClick={() => {
                  loadConfig(c.id);
                  setOpen(false);
                }}
              >
                <div className="min-w-0 flex-1 truncate">
                  <span>{c.name}</span>
                  <span className="ml-1.5 text-muted-foreground">
                    {new Date(c.savedAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  tabIndex={-1}
                  className="ml-2 hidden opacity-50 hover:opacity-100 group-hover:flex"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteConfig(c.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
