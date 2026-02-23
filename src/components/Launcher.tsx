import { pluginRegistry } from "@/plugins/registry";
import { useWorkspaceStore } from "@/store/workspaceStore";

interface Props {
  panelId: string;
}

export default function Launcher({ panelId }: Props) {
  const setPlugin = useWorkspaceStore((s) => s.setPlugin);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3">
      <p className="text-xs text-muted-foreground">Select a plugin</p>
      <div className="flex flex-col gap-1">
        {pluginRegistry.map((entry) => (
          <button
            key={entry.id}
            className="rounded px-3 py-1.5 text-sm text-foreground hover:bg-muted"
            onClick={() => setPlugin(panelId, entry.id)}
          >
            {entry.id}
          </button>
        ))}
      </div>
    </div>
  );
}
