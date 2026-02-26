import { useEffect, useState, useCallback } from "react";
import { appDataDir } from "@tauri-apps/api/path";
import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";
import CardLayout from "@/components/workspace/CardLayout";
import TabBar from "@/components/workspace/TabBar";
import WorkspaceOverlay from "@/components/workspace/WorkspaceOverlay";
import SettingsPanel from "@/components/settings/SettingsPanel";

function App() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setAppDataDir = useWorkspaceStore((s) => s.setAppDataDir);
  const workspace = useWorkspaceStore(selectActiveWorkspace);
  const setFocus = useWorkspaceStore((s) => s.setFocus);

  const [showOverlay, setShowOverlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Resolved effective theme — single source of truth for shell + plugins.
  const resolvedTheme = useResolvedTheme();

  useKeyboardShortcuts({ onToggleSettings: () => setShowSettings((p) => !p) });

  useEffect(() => {
    appDataDir().then(setAppDataDir);
  }, [setAppDataDir]);

  // Apply theme class to <html> whenever the resolved theme changes.
  // Both .dark and .light are managed so CSS can target either class
  // and override the prefers-color-scheme fallback.
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    // Keep color-scheme in sync so native controls (scrollbars, inputs)
    // render in the correct mode.
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

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
      <TabBar onOpenSettings={() => setShowSettings(true)} />
      <div className="flex-1 overflow-hidden">
        <CardLayout key={activeWorkspaceId} />
      </div>

      {showOverlay && workspace && (
        <WorkspaceOverlay
          nodes={workspace.nodes}
          rootId={workspace.rootId}
          focusedCardId={workspace.focusedCardId}
          onSelectCard={handleSelectCard}
          onClose={() => setShowOverlay(false)}
        />
      )}

      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

export default App;
