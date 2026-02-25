import type { PluginBus, OriginChannelMap } from "@/types/plugin";

/**
 * Create a new isolated PluginBus instance.
 * Each workspace gets its own bus so events in workspace A
 * never fire subscribers in workspace B.
 */
export function createPluginBus(): PluginBus {
  const _subscribers = new Map<string, Set<(payload: unknown) => void>>();
  const _lastValues = new Map<string, unknown>();

  return {
    publish(channel, payload) {
      const frozen = Object.freeze({
        ...(payload as object),
      }) as typeof payload;
      _lastValues.set(channel, frozen);
      _subscribers.get(channel)?.forEach((fn) => fn(frozen));
    },

    subscribe(channel, handler) {
      if (!_subscribers.has(channel)) _subscribers.set(channel, new Set());
      _subscribers.get(channel)!.add(handler as (payload: unknown) => void);
      return () =>
        _subscribers
          .get(channel)
          ?.delete(handler as (payload: unknown) => void);
    },

    read<K extends keyof OriginChannelMap>(channel: K) {
      return _lastValues.get(channel) as OriginChannelMap[K] | undefined;
    },
  };
}
