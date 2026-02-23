import { pluginRegistry } from "@/plugins/registry";
import { useWorkspaceStore } from "@/store/workspaceStore";

interface Props {
  panelId?: string;
}

export default function EmptyState({ panelId }: Props) {
  const setPlugin = useWorkspaceStore((s) => s.setPlugin);
  const addInitialPanel = useWorkspaceStore((s) => s.addInitialPanel);

  function handleSelect(pluginId: string) {
    if (panelId) {
      setPlugin(panelId, pluginId);
    } else {
      addInitialPanel(pluginId);
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <p className="text-sm font-medium">note</p>
      <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
        <span>⌘D — split horizontally</span>
        <span>⌘⇧D — split vertically</span>
      </div>
      <div className="flex flex-col gap-1">
        {pluginRegistry.map((entry) => (
          <button
            key={entry.id}
            className="rounded px-3 py-1.5 text-sm text-foreground hover:bg-muted"
            onClick={() => handleSelect(entry.id)}
          >
            {entry.icon && <span className="mr-2">{entry.icon}</span>}
            {entry.name}
          </button>
        ))}
      </div>
    </div>
  );
}
