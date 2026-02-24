/** Typed postMessage protocol for sandboxed L1 plugin iframes. */

export type HostToPluginMessage =
  | { type: "ORIGIN_INIT"; context: IframePluginContext }
  | { type: "ORIGIN_BUS_EVENT"; channel: string; payload: unknown }
  | { type: "ORIGIN_THEME_CHANGE"; theme: "light" | "dark" }
  | { type: "ORIGIN_INVOKE_RESULT"; id: string; result: unknown }
  | { type: "ORIGIN_INVOKE_ERROR"; id: string; error: string }
  /** Sent when the host detects an external config change (e.g. another tab). */
  | { type: "ORIGIN_CONFIG_UPDATE"; config: Record<string, unknown> }
  /** Pushed by the host whenever a subscribed event fires (e.g. pty:data). */
  | { type: "ORIGIN_EVENT"; subscriptionId: string; payload: unknown };

export type PluginToHostMessage =
  | { type: "ORIGIN_READY" }
  | { type: "ORIGIN_BUS_PUBLISH"; channel: string; payload: unknown }
  | { type: "ORIGIN_BUS_SUBSCRIBE"; channel: string }
  | { type: "ORIGIN_BUS_UNSUBSCRIBE"; channel: string }
  | {
      type: "ORIGIN_INVOKE";
      id: string;
      command: string;
      args: Record<string, unknown>;
    }
  /** Sent by the plugin to persist a shallow config patch on the host. */
  | { type: "ORIGIN_CONFIG_SET"; patch: Record<string, unknown> };

export interface IframePluginContext {
  cardId: string;
  workspacePath: string;
  theme: "light" | "dark";
  config: Record<string, unknown>;
}

/**
 * Maps allowed Tauri command names to the required capability string a plugin
 * must declare in its manifest.requiredCapabilities to use that command.
 *
 * Commands not present here are unconditionally denied.
 *
 * For tauri-plugin-* commands use the "plugin:name|command" invoke path, not
 * a custom Rust command. The keys here must match the exact string passed to
 * invoke() on the plugin side.
 */
export const COMMAND_CAPABILITY_MAP: Record<string, string> = {
  // tauri-plugin-fs
  "plugin:fs|read_file": "fs:read",
  "plugin:fs|read_text_file": "fs:read",
  "plugin:fs|read_dir": "fs:read",
  "plugin:fs|write_file": "fs:write",
  "plugin:fs|write_text_file": "fs:write",
  // tauri-plugin-dialog
  "plugin:dialog|open": "dialog:open",
  "plugin:dialog|save": "dialog:save",
  // pty (custom commands — not yet implemented, reserved for v1)
  pty_spawn: "pty",
  pty_write: "pty",
  pty_resize: "pty",
  pty_destroy: "pty",
};
