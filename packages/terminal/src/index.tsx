// The manifest is re-exported so Origin can read metadata without fully loading the plugin.
export { manifest } from "./manifest";

import { useEffect, useRef } from "react";
import type { PluginContext } from "@origin/api";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebglAddon } from "@xterm/addon-webgl";
import { ClipboardAddon } from "@xterm/addon-clipboard";
import { invoke, Channel } from "@tauri-apps/api/core";
import "@xterm/xterm/css/xterm.css";

export default function TerminalPlugin({
  context,
}: {
  context: PluginContext;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const term = new Terminal({
      fontFamily: "monospace",
      fontSize: 13,
      theme: { background: "#1e1e1e" },
      cursorBlink: true,
    });

    const fitAddon = new FitAddon();
    const clipboardAddon = new ClipboardAddon();
    term.loadAddon(fitAddon);
    term.loadAddon(clipboardAddon);

    const webglAddon = new WebglAddon();
    webglAddon.onContextLoss(() => webglAddon.dispose());
    term.loadAddon(webglAddon);

    term.open(container);
    fitAddon.fit();

    const { cols, rows } = term;

    const channel = new Channel<number[]>();
    channel.onmessage = (data) => term.write(new Uint8Array(data));

    term.onData((data) => {
      invoke("pty_write", {
        id: context.cardId,
        data: Array.from(new TextEncoder().encode(data)),
      }).catch(console.error);
    });

    invoke("pty_spawn", {
      id: context.cardId,
      cols,
      rows,
      onData: channel,
    }).catch(console.error);

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const ro = new ResizeObserver(() => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        fitAddon.fit();
        invoke("pty_resize", {
          id: context.cardId,
          cols: term.cols,
          rows: term.rows,
        }).catch(console.error);
      }, 50);
    });
    ro.observe(container);

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      ro.disconnect();
      term.dispose();
      invoke("pty_destroy", { id: context.cardId }).catch(console.error);
    };
  }, [context.cardId]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", background: "#1e1e1e" }}
    />
  );
}
