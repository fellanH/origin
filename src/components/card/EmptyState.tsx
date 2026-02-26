import { useEffect, useRef } from "react";
import { getPluginRegistry } from "@/plugins/registry";
import { useWorkspaceStore } from "@/store/workspaceStore";

interface Props {
  cardId?: string;
  /**
   * When true the launcher was just created via a split; focus the first
   * plugin button so the user can immediately press Enter or arrow-navigate.
   */
  autoOpen?: boolean;
  /** Called when the user clicks "Add Plugin +" — opens the PluginBrowser modal. */
  onOpenPluginBrowser?: () => void;
}

export default function EmptyState({ cardId, autoOpen, onOpenPluginBrowser }: Props) {
  const setPlugin = useWorkspaceStore((s) => s.setPlugin);
  const addInitialCard = useWorkspaceStore((s) => s.addInitialCard);
  const clearLauncherForNode = useWorkspaceStore((s) => s.clearLauncherForNode);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (autoOpen) {
      firstButtonRef.current?.focus();
      // Clear the trigger so a remount doesn't re-focus
      if (cardId) clearLauncherForNode(cardId);
    }
  }, [autoOpen, cardId, clearLauncherForNode]);

  function handleSelect(pluginId: string) {
    if (cardId) {
      setPlugin(cardId, pluginId);
    } else {
      addInitialCard(pluginId);
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <p className="text-sm font-medium">origin</p>
      <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
        <span>⌘D — split horizontally</span>
        <span>⌘⇧D — split vertically</span>
      </div>
      <div className="flex flex-col gap-1">
        {getPluginRegistry().map((entry, i) => (
          <button
            key={entry.id}
            ref={i === 0 ? firstButtonRef : undefined}
            className="rounded px-3 py-1.5 text-sm text-foreground hover:bg-muted"
            onClick={() => handleSelect(entry.id)}
          >
            {entry.icon && <span className="mr-2">{entry.icon}</span>}
            {entry.name}
          </button>
        ))}
      </div>
      <div className="flex flex-col items-center gap-1">
        <button
          className="text-xs text-muted-foreground hover:text-foreground"
          onClick={onOpenPluginBrowser}
        >
          Add plugin +
        </button>
      </div>
    </div>
  );
}
