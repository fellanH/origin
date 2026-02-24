import { useRef, useEffect, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { PluginContext, OriginChannelMap } from "@/types/plugin";
import type {
  PluginToHostMessage,
  HostToPluginMessage,
} from "@/lib/iframeProtocol";

interface Props {
  pluginId: string;
  context: Omit<PluginContext, "on">;
}

function IframePluginHostInner({ pluginId, context }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Track whether ORIGIN_READY has been received so theme updates can be forwarded
  const readyRef = useRef(false);
  // Map of channel → unsubscribe fn for channels the plugin has subscribed to
  const channelUnsubs = useRef(new Map<string, () => void>());

  const postToPlugin = useCallback((msg: HostToPluginMessage) => {
    // sandboxed iframes without allow-same-origin have a null origin — must use "*"
    iframeRef.current?.contentWindow?.postMessage(msg, "*");
  }, []);

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
          },
        });
      } else if (msg.type === "ORIGIN_BUS_PUBLISH") {
        // Cast dynamic iframe channel to typed key — safe because the bus
        // implementation accepts any string; this is the iframe trust boundary.
        context.bus.publish(
          msg.channel as keyof OriginChannelMap,
          msg.payload as OriginChannelMap[keyof OriginChannelMap],
        );
      } else if (msg.type === "ORIGIN_BUS_SUBSCRIBE") {
        // Avoid double-subscribe if plugin re-subscribes
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
      }
    }

    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      // Clean up all bus subscriptions
      channelUnsubs.current.forEach((unsub) => unsub());
      channelUnsubs.current.clear();
      readyRef.current = false;
    };
  }, [
    pluginId,
    context.cardId,
    context.workspacePath,
    context.bus,
    postToPlugin,
  ]);

  // Forward theme changes after READY
  useEffect(() => {
    if (!readyRef.current) return;
    postToPlugin({ type: "ORIGIN_THEME_CHANGE", theme: context.theme });
  }, [context.theme, postToPlugin]);

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

export default function IframePluginHost({ pluginId, context }: Props) {
  return (
    <ErrorBoundary
      resetKeys={[pluginId]}
      fallbackRender={({ error }) => (
        <div className="flex h-full items-center justify-center p-4 text-sm text-destructive">
          Plugin error: {error instanceof Error ? error.message : String(error)}
        </div>
      )}
    >
      <IframePluginHostInner pluginId={pluginId} context={context} />
    </ErrorBoundary>
  );
}
