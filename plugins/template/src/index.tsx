import type { PluginContext } from "@note/api";
export { manifest } from "./manifest";

// PluginContext fields available to your component:
//   context.panelId       — unique ID of the panel this plugin is mounted in
//   context.workspacePath — root directory for reading/writing files
//   context.theme         — "light" | "dark"

export default function MyPlugin({ context }: { context: PluginContext }) {
  return (
    <div style={{ padding: 16 }}>
      <p>Hello from My Plugin</p>
      <p style={{ opacity: 0.5, fontSize: 12 }}>Panel: {context.panelId}</p>
    </div>
  );
}
