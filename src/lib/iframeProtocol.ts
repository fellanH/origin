/** Typed postMessage protocol for sandboxed L1 plugin iframes. */

export type HostToPluginMessage =
  | { type: "ORIGIN_INIT"; context: IframePluginContext }
  | { type: "ORIGIN_BUS_EVENT"; channel: string; payload: unknown }
  | { type: "ORIGIN_THEME_CHANGE"; theme: "light" | "dark" };

export type PluginToHostMessage =
  | { type: "ORIGIN_READY" }
  | { type: "ORIGIN_BUS_PUBLISH"; channel: string; payload: unknown }
  | { type: "ORIGIN_BUS_SUBSCRIBE"; channel: string }
  | { type: "ORIGIN_BUS_UNSUBSCRIBE"; channel: string };

export interface IframePluginContext {
  cardId: string;
  workspacePath: string;
  theme: "light" | "dark";
}
