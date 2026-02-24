export { manifest } from "./manifest";

import { useEffect, useRef, useState, useCallback } from "react";
import type { PluginContext } from "@origin/api";
import { readTextFile, writeTextFile, mkdir } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";

export default function NotepadPlugin({ context }: { context: PluginContext }) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const fileRef = useRef<string | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDark = context.theme === "dark";

  const save = useCallback(async (content: string) => {
    if (!fileRef.current) return;
    setStatus("saving");
    await writeTextFile(fileRef.current, content);
    setStatus("saved");
    if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => setStatus("idle"), 2000);
  }, []);

  // Load note file on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const dir = await join(context.workspacePath, "notepad");
      await mkdir(dir, { recursive: true });
      const file = await join(dir, `${context.cardId}.md`);
      fileRef.current = file;
      try {
        const content = await readTextFile(file);
        if (!cancelled) setText(content);
      } catch {
        // File doesn't exist yet — start with empty note
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [context.workspacePath, context.cardId]);

  // Flush pending save on unmount
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setText(value);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => save(value), 800);
    },
    [save],
  );

  return (
    <div className="relative h-full">
      <textarea
        className={`h-full w-full resize-none bg-transparent p-3 font-mono text-sm outline-none placeholder:opacity-30 ${
          isDark ? "text-zinc-100" : "text-zinc-900"
        }`}
        value={text}
        onChange={handleChange}
        placeholder="Start typing…"
        spellCheck={false}
      />
      {status !== "idle" && (
        <span
          className={`pointer-events-none absolute bottom-2 right-2 text-xs transition-opacity ${
            isDark ? "text-zinc-400" : "text-zinc-500"
          }`}
        >
          {status === "saving" ? "Saving…" : "Saved"}
        </span>
      )}
    </div>
  );
}
