import { useState, useEffect } from "react";
import type {
  IframePluginContext,
  HostToPluginMessage,
} from "@/lib/iframeProtocol";

/**
 * Returns the plugin context injected by the host via postMessage.
 * Returns null until the ORIGIN_INIT message is received.
 * Automatically posts ORIGIN_READY on mount.
 */
export function usePluginContext(): IframePluginContext | null {
  const [context, setContext] = useState<IframePluginContext | null>(null);

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const msg = event.data as HostToPluginMessage;
      if (msg.type === "ORIGIN_INIT") {
        setContext(msg.context);
      } else if (msg.type === "ORIGIN_THEME_CHANGE") {
        setContext((prev) => (prev ? { ...prev, theme: msg.theme } : prev));
      }
    }

    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "ORIGIN_READY" }, "*");

    return () => window.removeEventListener("message", onMessage);
  }, []);

  return context;
}
