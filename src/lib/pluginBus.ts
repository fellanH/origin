/** Shared pub/sub bus for inter-plugin communication. */

import type { PluginBus } from "@origin/api";

const _subscribers = new Map<string, Set<(payload: unknown) => void>>();
const _lastValues = new Map<string, unknown>();

export const pluginBus: PluginBus = {
  publish(channel, payload) {
    const frozen = Object.freeze({ ...(payload as object) }) as typeof payload;
    _lastValues.set(channel, frozen);
    _subscribers.get(channel)?.forEach((fn) => fn(frozen));
  },

  subscribe(channel, handler) {
    if (!_subscribers.has(channel)) _subscribers.set(channel, new Set());
    _subscribers.get(channel)!.add(handler);
    return () => _subscribers.get(channel)?.delete(handler);
  },

  read(channel) {
    return _lastValues.get(channel);
  },
};
