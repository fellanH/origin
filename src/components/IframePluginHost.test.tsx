/**
 * IframePluginHost — unit tests
 *
 * Tests the postMessage protocol logic. Uses a virtual iframe + manual
 * MessageEvent dispatch rather than rendering the React component.
 */

// @vitest-environment jsdom

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Hoist mock fns so they're available inside vi.mock factories ──────────────
const { mockPublish, mockSubscribe } = vi.hoisted(() => ({
  mockPublish: vi.fn(),
  mockSubscribe: vi.fn(),
}));

vi.mock("@tauri-apps/api/core", () => ({
  invoke: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/lib/pluginBus", () => ({
  pluginBus: {
    publish: mockPublish,
    subscribe: mockSubscribe,
    read: vi.fn(),
  },
}));

// ── Imports ───────────────────────────────────────────────────────────────────

import type {
  PluginToHostMessage,
  IframePluginContext,
} from "@/lib/iframeProtocol";
import { pluginBus } from "@/lib/pluginBus";

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeFakeWindow() {
  return { postMessage: vi.fn() };
}

type FakeWindow = ReturnType<typeof makeFakeWindow>;

function dispatch(source: FakeWindow, data: unknown) {
  const event = new MessageEvent("message", {
    data,
    source: source as unknown as Window,
  });
  window.dispatchEvent(event);
}

/**
 * Mirrors the onMessage handler in IframePluginHost.
 * Lets us test the protocol logic in isolation without mounting React.
 */
function createHandler(
  iframeWindow: FakeWindow,
  context: IframePluginContext,
  readyRef: { current: boolean },
  channelUnsubs: Map<string, () => void>,
) {
  return function onMessage(event: MessageEvent) {
    if (event.source !== (iframeWindow as unknown as EventTarget)) return;

    const msg = event.data as PluginToHostMessage;

    if (msg.type === "ORIGIN_READY") {
      readyRef.current = true;
      iframeWindow.postMessage({ type: "ORIGIN_INIT", context }, "*");
    } else if (msg.type === "ORIGIN_BUS_PUBLISH") {
      pluginBus.publish(msg.channel, msg.payload);
    } else if (msg.type === "ORIGIN_BUS_SUBSCRIBE") {
      if (channelUnsubs.has(msg.channel)) return;
      const unsub = pluginBus.subscribe(msg.channel, (payload) => {
        iframeWindow.postMessage(
          { type: "ORIGIN_BUS_EVENT", channel: msg.channel, payload },
          "*",
        );
      });
      channelUnsubs.set(msg.channel, unsub);
    } else if (msg.type === "ORIGIN_BUS_UNSUBSCRIBE") {
      const unsub = channelUnsubs.get(msg.channel);
      if (unsub) {
        unsub();
        channelUnsubs.delete(msg.channel);
      }
    }
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("IframePluginHost message protocol", () => {
  let iframeWin: FakeWindow;
  let readyRef: { current: boolean };
  let channelUnsubs: Map<string, () => void>;
  let context: IframePluginContext;
  let handler: (event: MessageEvent) => void;

  beforeEach(() => {
    vi.clearAllMocks();
    iframeWin = makeFakeWindow();
    readyRef = { current: false };
    channelUnsubs = new Map();
    context = { cardId: "card-1", workspacePath: "/data", theme: "dark" };
    handler = createHandler(iframeWin, context, readyRef, channelUnsubs);
    window.addEventListener("message", handler);
  });

  it("ORIGIN_READY → posts ORIGIN_INIT with correct context", () => {
    dispatch(iframeWin, { type: "ORIGIN_READY" });

    expect(readyRef.current).toBe(true);
    expect(iframeWin.postMessage).toHaveBeenCalledWith(
      { type: "ORIGIN_INIT", context },
      "*",
    );
  });

  it("ORIGIN_BUS_PUBLISH → calls pluginBus.publish", () => {
    dispatch(iframeWin, {
      type: "ORIGIN_BUS_PUBLISH",
      channel: "test-channel",
      payload: { value: 42 },
    });

    expect(mockPublish).toHaveBeenCalledWith("test-channel", { value: 42 });
  });

  it("ORIGIN_BUS_SUBSCRIBE → subscribes via pluginBus and relays events to iframe", () => {
    const relayFn = vi.fn();
    mockSubscribe.mockImplementationOnce(
      (_ch: string, cb: (p: unknown) => void) => {
        relayFn.mockImplementation(cb);
        return vi.fn();
      },
    );

    dispatch(iframeWin, {
      type: "ORIGIN_BUS_SUBSCRIBE",
      channel: "my-channel",
    });

    expect(mockSubscribe).toHaveBeenCalledWith(
      "my-channel",
      expect.any(Function),
    );

    relayFn({ data: "hello" });

    expect(iframeWin.postMessage).toHaveBeenCalledWith(
      {
        type: "ORIGIN_BUS_EVENT",
        channel: "my-channel",
        payload: { data: "hello" },
      },
      "*",
    );
  });

  it("ORIGIN_BUS_UNSUBSCRIBE → calls stored unsub fn", () => {
    const unsub = vi.fn();
    mockSubscribe.mockReturnValueOnce(unsub);

    dispatch(iframeWin, { type: "ORIGIN_BUS_SUBSCRIBE", channel: "ch" });
    dispatch(iframeWin, { type: "ORIGIN_BUS_UNSUBSCRIBE", channel: "ch" });

    expect(unsub).toHaveBeenCalledOnce();
    expect(channelUnsubs.has("ch")).toBe(false);
  });

  it("messages from unknown sources are ignored", () => {
    const foreignWin = makeFakeWindow();
    dispatch(foreignWin, { type: "ORIGIN_READY" });

    expect(iframeWin.postMessage).not.toHaveBeenCalled();
    expect(readyRef.current).toBe(false);
  });

  it("does not double-subscribe the same channel", () => {
    mockSubscribe.mockReturnValue(vi.fn());

    dispatch(iframeWin, { type: "ORIGIN_BUS_SUBSCRIBE", channel: "dup" });
    dispatch(iframeWin, { type: "ORIGIN_BUS_SUBSCRIBE", channel: "dup" });

    expect(mockSubscribe).toHaveBeenCalledOnce();
  });
});
