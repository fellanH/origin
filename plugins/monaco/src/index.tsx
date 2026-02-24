export { manifest } from "./manifest";

import { useCallback, useState } from "react";
import Editor from "@monaco-editor/react";
import { open } from "@tauri-apps/plugin-dialog";
import { readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import type { PluginContext } from "@origin/api";

function getLanguage(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    json: "json",
    md: "markdown",
    rs: "rust",
    css: "css",
    html: "html",
    py: "python",
    sh: "shell",
    toml: "toml",
    yaml: "yaml",
    yml: "yaml",
  };
  return map[ext] ?? "plaintext";
}

function basename(filePath: string): string {
  return filePath.split(/[\\/]/).pop() ?? filePath;
}

export default function MonacoPlugin({ context }: { context: PluginContext }) {
  const [filePath, setFilePath] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [language, setLanguage] = useState<string>("plaintext");
  const [isDirty, setIsDirty] = useState(false);

  const isDark = context.theme === "dark";

  async function handleOpenFile() {
    const result = await open({ multiple: false });
    const selected = Array.isArray(result) ? result[0] : result;
    if (!selected) return;
    try {
      const text = await readTextFile(selected);
      setFilePath(selected);
      setContent(text);
      setLanguage(getLanguage(selected));
      setIsDirty(false);
    } catch {
      // Read error — file may be binary or inaccessible
    }
  }

  async function handleSave() {
    if (!filePath || !isDirty) return;
    try {
      await writeTextFile(filePath, content);
      setIsDirty(false);
    } catch {
      // Write error — file may be read-only
    }
  }

  const handleChange = useCallback((value: string | undefined) => {
    setContent(value ?? "");
    setIsDirty(true);
  }, []);

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div
        className={`flex shrink-0 items-center gap-2 border-b px-3 py-2 text-sm ${isDark ? "border-zinc-700 text-zinc-100" : "border-zinc-200 text-zinc-900"}`}
      >
        <span className="truncate text-xs opacity-60 font-mono">
          {filePath ? basename(filePath) : "No file open"}
          {isDirty && " •"}
        </span>
        <button
          onClick={handleOpenFile}
          className="ml-auto shrink-0 rounded px-2 py-0.5 text-xs hover:bg-white/10"
        >
          Open
        </button>
        <button
          onClick={handleSave}
          disabled={!isDirty || !filePath}
          className="shrink-0 rounded px-2 py-0.5 text-xs hover:bg-white/10 disabled:opacity-30"
        >
          Save
        </button>
      </div>

      {/* Editor */}
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language={language}
          value={content}
          onChange={handleChange}
          theme={isDark ? "vs-dark" : "vs-light"}
          options={{
            minimap: { enabled: false },
            fontSize: 12,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
}
