import { useRef, useEffect, useCallback } from "react";
import { invoke, Channel } from "@tauri-apps/api/core";
import { ErrorBoundary } from "react-error-boundary";
import type {
  PluginContext,
  OriginChannelMap,
  PluginManifest,
} from "@/types/plugin";
import type {
  PluginToHostMessage,
  HostToPluginMessage,
} from "@/lib/iframeProtocol";
import {
  COMMAND_CAPABILITY_MAP,
  EVENT_CAPABILITY_MAP,
} from "@/lib/iframeProtocol";
import { assertIframeSafety } from "@/lib/assertPluginSafety";

interface Props {
  pluginId: string;
  context: Omit<PluginContext, "on">;
  manifest?: PluginManifest;
}

function IframePluginHostInner({ pluginId, context, manifest }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Track whether ORIGIN_READY has been received so theme/config updates can be forwarded
  const readyRef = useRef(false);
  // Map of channel → unsubscribe fn for channels the plugin has subscribed to
  const channelUnsubs = useRef(new Map<string, () => void>());
  // Map of subscriptionId → cleanup fn for active event subscriptions
  const eventUnsubs = useRef(new Map<string, () => void>());
  // Keep manifest in a ref so the onMessage closure always sees the latest value
  const manifestRef = useRef(manifest);
  manifestRef.current = manifest;

  const postToPlugin = useCallback((msg: HostToPluginMessage) => {
    // sandboxed iframes without allow-same-origin have a null origin — must use "*"
    iframeRef.current?.contentWindow?.postMessage(msg, "*");
  }, []);

  // Webview hardening: assert iframe safety at mount time (see docs/security/webview-guardrails.md)
  useEffect(() => {
    if (iframeRef.current) {
      const safe = assertIframeSafety(iframeRef.current);
      if (!safe) {
        // In production, clear the src to prevent the plugin from loading
        iframeRef.current.removeAttribute("src");
      }
    }
  }, [pluginId]);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      // Security: ignore messages from other sources
      if (event.source !== iframeRef.current?.contentWindow) return;

      const msg = event.data as PluginToHostMessage;

      if (msg.type === "ORIGIN_READY") {
        readyRef.current = true;
        postToPlugin({
          type: "ORIGIN_INIT",
          context: {
            cardId: context.cardId,
            workspacePath: context.workspacePath,
            theme: context.theme,
            config: context.config,
          },
        });
      } else if (msg.type === "ORIGIN_BUS_PUBLISH") {
        context.bus.publish(
          msg.channel as keyof OriginChannelMap,
          msg.payload as OriginChannelMap[keyof OriginChannelMap],
        );
      } else if (msg.type === "ORIGIN_BUS_SUBSCRIBE") {
        if (channelUnsubs.current.has(msg.channel)) return;
        const unsub = context.bus.subscribe(
          msg.channel as keyof OriginChannelMap,
          (payload) => {
            postToPlugin({
              type: "ORIGIN_BUS_EVENT",
              channel: msg.channel,
              payload,
            });
          },
        );
        channelUnsubs.current.set(msg.channel, unsub);
      } else if (msg.type === "ORIGIN_BUS_UNSUBSCRIBE") {
        const unsub = channelUnsubs.current.get(msg.channel);
        if (unsub) {
          unsub();
          channelUnsubs.current.delete(msg.channel);
        }
      } else if (msg.type === "ORIGIN_INVOKE") {
        const { id, command, args } = msg;

        // 1. Command must be in the allow-list
        const requiredCap = COMMAND_CAPABILITY_MAP[command];
        if (requiredCap === undefined) {
          postToPlugin({
            type: "ORIGIN_INVOKE_ERROR",
            id,
            error: `Command not allowed: ${command}`,
          });
          return;
        }

        // 2. Plugin manifest must declare the required capability
        const declared = manifestRef.current?.requiredCapabilities ?? [];
        if (!declared.includes(requiredCap)) {
          postToPlugin({
            type: "ORIGIN_INVOKE_ERROR",
            id,
            error: `Missing capability: ${requiredCap}`,
          });
          return;
        }

        // 3. Proxy the call through Tauri — failures must not crash the host
        invoke(command, args)
          .then((result) => {
            postToPlugin({ type: "ORIGIN_INVOKE_RESULT", id, result });
          })
          .catch((err: unknown) => {
            const error = err instanceof Error ? err.message : String(err);
            postToPlugin({ type: "ORIGIN_INVOKE_ERROR", id, error });
          });
      } else if (msg.type === "ORIGIN_CONFIG_SET") {
        // Plugin requests a config patch — delegate to store via context
        context.setConfig(msg.patch);
      } else if (msg.type === "ORIGIN_EVENT_SUBSCRIBE") {
        const { subscriptionId, event, args } = msg;

        // Avoid double-subscribe for the same subscriptionId
        if (eventUnsubs.current.has(subscriptionId)) return;

        // 1. Event must be in the allow-list
        const requiredCap = EVENT_CAPABILITY_MAP[event];
        if (requiredCap === undefined) {
          // No response type defined for subscribe errors — silently drop
          return;
        }

        // 2. Plugin manifest must declare the required capability
        const declared = manifestRef.current?.requiredCapabilities ?? [];
        if (!declared.includes(requiredCap)) {
          return;
        }

        // 3. Wire up the event source
        if (event === "pty:data") {
          const { id, cols, rows } = (args ?? {}) as {
            id?: string;
            cols?: number;
            rows?: number;
          };
          if (id === undefined || cols === undefined || rows === undefined) {
            return;
          }

          // Tauri Channel<Vec<u8>> — serialized as number[] on the JS side
          const channel = new Channel<number[]>();
          channel.onmessage = (data) => {
            postToPlugin({
              type: "ORIGIN_EVENT",
              subscriptionId,
              payload: { data },
            });
          };

          invoke("pty_spawn", { id, cols, rows, onData: channel }).catch(() => {
            // PTY spawn failure — remove subscription so a retry is possible
            eventUnsubs.current.delete(subscriptionId);
          });

          eventUnsubs.current.set(subscriptionId, () => {
            invoke("pty_destroy", { id }).catch(() => {});
          });
        }
      } else if (msg.type === "ORIGIN_EVENT_UNSUBSCRIBE") {
        const cleanup = eventUnsubs.current.get(msg.subscriptionId);
        if (cleanup) {
          cleanup();
          eventUnsubs.current.delete(msg.subscriptionId);
        }
      }
    }

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      channelUnsubs.current.forEach((unsub) => unsub());
      channelUnsubs.current.clear();
      // Clean up all event subscriptions (e.g. destroy open PTY sessions)
      eventUnsubs.current.forEach((cleanup) => cleanup());
      eventUnsubs.current.clear();
      readyRef.current = false;
    };
  }, [
    pluginId,
    context.cardId,
    context.workspacePath,
    context.bus,
    context.setConfig,
    postToPlugin,
  ]);

  // Forward theme changes after READY
  useEffect(() => {
    if (!readyRef.current) return;
    postToPlugin({ type: "ORIGIN_THEME_CHANGE", theme: context.theme });
  }, [context.theme, postToPlugin]);

  // Forward config changes from the store to the iframe after READY
  useEffect(() => {
    if (!readyRef.current) return;
    postToPlugin({ type: "ORIGIN_CONFIG_UPDATE", config: context.config });
  }, [context.config, postToPlugin]);

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts"
      src={`plugin://localhost/${pluginId}/index.html`}
      className="h-full w-full border-none"
      title={pluginId}
    />
  );
}

export default function IframePluginHost({
  pluginId,
  context,
  manifest,
}: Props) {
  return (
    <ErrorBoundary
      resetKeys={[pluginId]}
      fallbackRender={({ error }) => (
        <div className="flex h-full items-center justify-center p-4 text-sm text-destructive">
          Plugin error: {error instanceof Error ? error.message : String(error)}
        </div>
      )}
    >
      <IframePluginHostInner
        pluginId={pluginId}
        context={context}
        manifest={manifest}
      />
    </ErrorBoundary>
  );
}
