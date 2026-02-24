export { manifest } from "./manifest";

import { useEffect, useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import {
  readDir,
  readTextFile,
  writeTextFile,
  mkdir,
  exists,
} from "@tauri-apps/plugin-fs";
import type { PluginContext } from "@origin/api";
import { manifest } from "./manifest";

interface TreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: TreeNode[]; // undefined = not yet loaded
}

/** Join a parent path with a child name using the OS-appropriate separator. */
function joinPath(base: string, name: string): string {
  const sep = base.includes("\\") ? "\\" : "/";
  const trimmed =
    base.endsWith("/") || base.endsWith("\\") ? base.slice(0, -1) : base;
  return `${trimmed}${sep}${name}`;
}

function fileIcon(node: TreeNode): string {
  if (node.isDirectory) return "📁";
  const ext = node.name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "ts" || ext === "tsx") return "📄";
  if (ext === "json") return "{}";
  if (ext === "md") return "📝";
  return "📄";
}

async function loadChildren(dirPath: string): Promise<TreeNode[]> {
  const entries = await readDir(dirPath);
  const nodes: TreeNode[] = entries.map((entry) => ({
    name: entry.name,
    path: joinPath(dirPath, entry.name),
    isDirectory: entry.isDirectory,
  }));
  // Directories first, then alphabetical within each group
  return nodes.sort((a, b) => {
    if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

function insertChildren(
  nodes: TreeNode[],
  targetPath: string,
  children: TreeNode[],
): TreeNode[] {
  return nodes.map((n) => {
    if (n.path === targetPath) return { ...n, children };
    if (n.children)
      return {
        ...n,
        children: insertChildren(n.children, targetPath, children),
      };
    return n;
  });
}

interface TreeItemProps {
  node: TreeNode;
  depth: number;
  expandedPaths: Set<string>;
  onToggle: (node: TreeNode) => void;
  onFileClick: (node: TreeNode) => void;
}

function TreeItem({ node, depth, expandedPaths, onToggle, onFileClick }: TreeItemProps) {
  const isExpanded = expandedPaths.has(node.path);
  const icon = node.isDirectory ? (isExpanded ? "📂" : "📁") : fileIcon(node);

  function handleClick() {
    if (node.isDirectory) {
      onToggle(node);
    } else {
      onFileClick(node);
    }
  }

  return (
    <div>
      <div
        onClick={handleClick}
        className="flex cursor-pointer items-center gap-1 rounded px-1 py-0.5 text-xs hover:bg-white/10"
        style={{ paddingLeft: `${4 + depth * 14}px` }}
      >
        <span className="shrink-0 select-none">{icon}</span>
        <span className="truncate opacity-90">{node.name}</span>
      </div>
      {node.isDirectory &&
        isExpanded &&
        node.children?.map((child) => (
          <TreeItem
            key={child.path}
            node={child}
            depth={depth + 1}
            expandedPaths={expandedPaths}
            onToggle={onToggle}
            onFileClick={onFileClick}
          />
        ))}
    </div>
  );
}

export default function FileTreePlugin({
  context,
}: {
  context: PluginContext;
}) {
  const [rootPath, setRootPath] = useState<string | null>(null);
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const configDir = joinPath(context.workspacePath, "filetree");
  const configFile = joinPath(configDir, `${context.cardId}.json`);

  // Load saved root path on mount
  useEffect(() => {
    (async () => {
      try {
        if (await exists(configFile)) {
          const raw = await readTextFile(configFile);
          const saved = JSON.parse(raw) as { rootPath?: string };
          if (saved.rootPath) setRootPath(saved.rootPath);
        }
      } catch {
        // No saved config — first launch
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload top-level entries whenever rootPath changes
  useEffect(() => {
    if (!rootPath) return;
    loadChildren(rootPath)
      .then(setTree)
      .catch(() => setTree([]));
    setExpandedPaths(new Set());
  }, [rootPath]);

  async function handleOpenFolder() {
    const result = await open({ directory: true });
    const selected = Array.isArray(result) ? result[0] : result;
    if (!selected) return;

    setRootPath(selected);

    // Persist selection
    try {
      await mkdir(configDir, { recursive: true });
      await writeTextFile(configFile, JSON.stringify({ rootPath: selected }));
    } catch {
      // Persist failure is non-fatal
    }
  }

  async function handleToggle(node: TreeNode) {
    if (expandedPaths.has(node.path)) {
      setExpandedPaths((prev) => {
        const next = new Set(prev);
        next.delete(node.path);
        return next;
      });

      context.bus.publish("origin:workspace/active-path", {
        path: node.path,
        type: "directory",
        source: manifest.id,
      });
      return;
    }

    // Lazy-load children if not already loaded
    if (!node.children) {
      try {
        const children = await loadChildren(node.path);
        setTree((prev) => insertChildren(prev, node.path, children));
      } catch {
        return;
      }
    }

    setExpandedPaths((prev) => new Set([...prev, node.path]));

    context.bus.publish("origin:workspace/active-path", {
      path: node.path,
      type: "directory",
      source: manifest.id,
    });
  }

  function handleFileClick(node: TreeNode) {
    context.bus.publish("origin:workspace/active-path", {
      path: node.path,
      type: "file",
      source: manifest.id,
    });
  }

  const isDark = context.theme === "dark";

  return (
    <div
      className={`flex h-full flex-col font-mono text-sm ${isDark ? "text-zinc-100" : "text-zinc-900"}`}
    >
      {/* Toolbar */}
      <div
        className={`flex shrink-0 items-center gap-2 border-b px-3 py-2 ${isDark ? "border-zinc-700" : "border-zinc-200"}`}
      >
        <span className="truncate text-xs opacity-60">
          {rootPath
            ? rootPath.split(/[\\/]/).pop() || rootPath
            : "No folder open"}
        </span>
        <button
          onClick={handleOpenFolder}
          className="ml-auto shrink-0 rounded px-2 py-0.5 text-xs hover:bg-white/10"
        >
          Open
        </button>
      </div>

      {/* Tree */}
      <div className="min-h-0 flex-1 overflow-y-auto py-1">
        {!rootPath && (
          <p className="px-3 py-8 text-center text-xs opacity-40">
            Open a folder to browse files
          </p>
        )}
        {tree.map((node) => (
          <TreeItem
            key={node.path}
            node={node}
            depth={0}
            expandedPaths={expandedPaths}
            onToggle={handleToggle}
            onFileClick={handleFileClick}
          />
        ))}
      </div>
    </div>
  );
}
