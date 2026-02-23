import type { PluginContext } from "@origin/api";
export { manifest } from "./manifest";

// PluginContext fields available to your component:
//   context.panelId       — unique ID of the panel this plugin is mounted in
//   context.workspacePath — absolute path to the app data directory (platform-specific)
//                           Use path joining for file I/O, e.g.:
//                           import { join } from "@tauri-apps/api/path";
//                           const file = await join(context.workspacePath, "myplugin/data.json");
//   context.theme         — "light" | "dark"

export default function MyPlugin({ context }: { context: PluginContext }) {
  return (
    <div style={{ padding: 16 }}>
      <p>Hello from My Plugin</p>
      <p style={{ opacity: 0.5, fontSize: 12 }}>Panel: {context.panelId}</p>
    </div>
  );
}
