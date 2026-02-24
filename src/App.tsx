import { useEffect, useState, useCallback } from "react";
import { appDataDir } from "@tauri-apps/api/path";
import {
  useWorkspaceStore,
  selectActiveWorkspace,
} from "@/store/workspaceStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import CardLayout from "@/components/workspace/CardLayout";
import TabBar from "@/components/workspace/TabBar";
import WorkspaceOverlay from "@/components/workspace/WorkspaceOverlay";
import SettingsPanel, {
  type ThemePreference,
} from "@/components/settings/SettingsPanel";

function App() {
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setAppDataDir = useWorkspaceStore((s) => s.setAppDataDir);
  const workspace = useWorkspaceStore(selectActiveWorkspace);
  const setFocus = useWorkspaceStore((s) => s.setFocus);

  const [showOverlay, setShowOverlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<ThemePreference>("system");

  useKeyboardShortcuts({ onToggleSettings: () => setShowSettings((p) => !p) });

  useEffect(() => {
    appDataDir().then(setAppDataDir);
  }, [setAppDataDir]);

  // Apply theme class to <html> whenever the preference changes.
  // "system" removes the manual override so prefers-color-scheme takes effect.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

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

      {showOverlay && (
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
        theme={theme}
        onClose={() => setShowSettings(false)}
        onThemeChange={setTheme}
      />
    </div>
  );
}

export default App;
