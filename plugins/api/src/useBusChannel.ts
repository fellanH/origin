import { useSyncExternalStore } from "react";
import type { PluginBus } from "./plugin";

/**
 * Reactively subscribe to a bus channel. Re-renders whenever a new value is
 * published. Returns `undefined` before the first publish.
 *
 * @example
 * const file = useBusChannel<{ path: string }>(context.bus, "com.origin.filetree:file-selected");
 */
export function useBusChannel<T = unknown>(
  bus: PluginBus,
  channel: string,
): T | undefined {
  return useSyncExternalStore(
    (notify) => bus.subscribe(channel, notify),
    () => bus.read(channel) as T | undefined,
  );
}
