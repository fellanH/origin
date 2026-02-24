import type React from "react";

/** Pub/sub bus injected into every plugin via PluginContext. */
export interface PluginBus {
  /** Broadcast a value on a channel. Cached as the last value. */
  publish(channel: string, payload: unknown): void;
  /** Subscribe to a channel. Returns an unsubscribe function. */
  subscribe(channel: string, handler: (payload: unknown) => void): () => void;
  /** Synchronously read the last published value on a channel. */
  read(channel: string): unknown;
}

/** Metadata declared by every plugin. Shown in the Launcher UI. */
export interface PluginManifest {
  /** Reverse-domain unique identifier, e.g. "com.example.myplugin" */
  id: string;
  /** Human-readable name shown in the Launcher */
  name: string;
  version: string;
  description?: string;
  /** Emoji or relative image path shown in the Launcher grid */
  icon?: string;
}

/** Panel lifecycle event names emitted by PluginHost. */
export type PluginLifecycleEvent =
  | "focus"
  | "blur"
  | "resize"
  | "zoom"
  | "zoom-exit";

/** Runtime context injected by PluginHost into every plugin component */
export interface PluginContext {
  /** Unique ID of the card this instance is mounted in */
  cardId: string;
  /** Absolute path to the workspace root directory (for file I/O) */
  workspacePath: string;
  /** Current app theme */
  theme: "light" | "dark";
  /** Inter-plugin communication bus */
  bus: PluginBus;
  /**
   * Subscribe to a panel lifecycle event.
   * Returns an unsubscribe function — call it in your plugin's cleanup.
   *
   * @example
   * useEffect(() => context.on('focus', () => console.log('focused')), []);
   */
  on(event: PluginLifecycleEvent, handler: () => void): () => void;
}

export type PluginComponent = React.ComponentType<{ context: PluginContext }>;

export interface PluginModule {
  default: PluginComponent;
  manifest: PluginManifest;
}
