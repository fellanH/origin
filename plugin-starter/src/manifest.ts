import type { PluginManifest } from "@origin-cards/api";

/**
 * Plugin manifest — Origin reads this to show your plugin in the launcher
 * and to enforce capability permissions at runtime.
 *
 * Update `id` to a unique reverse-domain identifier for your plugin.
 * Add capabilities to `requiredCapabilities` if your plugin needs Tauri APIs.
 *
 * @see https://github.com/fellanH/origin#plugin-system
 */
export const manifest: PluginManifest = {
  id: "com.example.my-plugin",
  name: "My Plugin",
  version: "0.1.0",
  description: "A custom Origin plugin.",
  icon: "🔌",
  requiredCapabilities: [],
};
