export { manifest } from "./manifest";

import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import "xterm/css/xterm.css";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import type { PluginContext } from "@origin/api";

export default function TerminalPlugin({
  context,
}: {
  context: PluginContext;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const ptyId = context.cardId; // one PTY per card

  useEffect(() => {
    if (!containerRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      fontFamily: "Menlo, Monaco, 'Courier New', monospace",
      fontSize: 13,
      theme:
        context.theme === "dark"
          ? { background: "#1a1a1a", foreground: "#d4d4d4" }
          : { background: "#ffffff", foreground: "#1a1a1a" },
    });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(containerRef.current);
    fitAddon.fit();
    termRef.current = term;
    fitAddonRef.current = fitAddon;

    // Create PTY session in the Rust backend
    invoke("pty_create", {
      id: ptyId,
      cols: term.cols,
      rows: term.rows,
    });

    // Stream PTY output from Rust events into xterm
    const unlisten = listen<string>(`pty-data-${ptyId}`, (event) => {
      term.write(event.payload);
    });

    // Forward keystrokes to the PTY
    term.onData((data) => {
      invoke("pty_write", { id: ptyId, data });
    });

    // Resize the PTY when the card resizes
    const ro = new ResizeObserver(() => {
      fitAddon.fit();
      invoke("pty_resize", { id: ptyId, cols: term.cols, rows: term.rows });
    });
    ro.observe(containerRef.current);

    return () => {
      unlisten.then((fn) => fn());
      ro.disconnect();
      term.dispose();
      invoke("pty_destroy", { id: ptyId });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} className="h-full w-full overflow-hidden" />;
}
