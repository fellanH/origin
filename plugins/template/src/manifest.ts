import type { PluginManifest } from "@note/api";

export const manifest: PluginManifest = {
  id: "com.example.myplugin", // Change to a unique reverse-domain ID
  name: "My Plugin", // Display name shown in the Launcher
  version: "0.1.0",
  description: "What this plugin does.",
  icon: "🔌", // Emoji or relative image path
};
