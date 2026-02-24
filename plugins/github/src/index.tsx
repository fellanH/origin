export { manifest } from "./manifest";

import { useState, useEffect, useCallback, useRef } from "react";
import type { PluginContext } from "@origin/api";
import { readTextFile, writeTextFile, mkdir } from "@tauri-apps/plugin-fs";
import { join } from "@tauri-apps/api/path";
import { openUrl } from "@tauri-apps/plugin-opener";

interface PR {
  number: number;
  title: string;
  user: { login: string; avatar_url: string };
  html_url: string;
  draft: boolean;
  created_at: string;
  labels: { name: string; color: string }[];
}

interface Config {
  owner: string;
  repo: string;
}

function relativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function GitHubPlugin({ context }: { context: PluginContext }) {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [configured, setConfigured] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prs, setPrs] = useState<PR[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<number | null>(null);
  const configFileRef = useRef<string | null>(null);
  const isDark = context.theme === "dark";

  const fetchPRs = useCallback(async (o: string, r: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.github.com/repos/${o}/${r}/pulls?state=open&per_page=20`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: PR[] = (await res.json()) as PR[];
      setPrs(data);
      setLastFetched(Date.now());
    } catch {
      setError("Could not load PRs — check repo name");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load saved config on mount; fetch immediately if config exists
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const dir = await join(context.workspacePath, "github");
      await mkdir(dir, { recursive: true });
      const file = await join(dir, `${context.cardId}.json`);
      configFileRef.current = file;
      try {
        const text = await readTextFile(file);
        const config = JSON.parse(text) as Config;
        if (!cancelled) {
          setOwner(config.owner);
          setRepo(config.repo);
          setConfigured(true);
          await fetchPRs(config.owner, config.repo);
        }
      } catch {
        // No config yet — show setup screen
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [context.workspacePath, context.cardId, fetchPRs]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!configured || showSettings) return;
    const id = setInterval(() => fetchPRs(owner, repo), 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [configured, showSettings, owner, repo, fetchPRs]);

  const handleConnect = useCallback(async () => {
    const o = owner.trim();
    const r = repo.trim();
    if (!o || !r) return;
    if (!configFileRef.current) return;
    await writeTextFile(
      configFileRef.current,
      JSON.stringify({ owner: o, repo: r }),
    );
    setOwner(o);
    setRepo(r);
    setConfigured(true);
    setShowSettings(false);
    await fetchPRs(o, r);
  }, [owner, repo, fetchPRs]);

  const minutesAgo =
    lastFetched !== null
      ? Math.floor((Date.now() - lastFetched) / 60000)
      : null;

  const inputClass = `rounded border px-3 py-2 text-sm outline-none focus:ring-1 ${
    isDark
      ? "border-zinc-600 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500 focus:ring-zinc-400"
      : "border-zinc-300 bg-white text-zinc-900 placeholder:text-zinc-400 focus:ring-zinc-400"
  }`;

  // Setup / settings screen
  if (!configured || showSettings) {
    return (
      <div
        className={`flex h-full flex-col items-center justify-center gap-4 p-6 ${
          isDark ? "text-zinc-100" : "text-zinc-900"
        }`}
      >
        <div className="text-3xl">🐙</div>
        <h2 className="text-sm font-semibold">Connect a repository</h2>
        <div className="flex w-full max-w-xs flex-col gap-2">
          <input
            className={inputClass}
            placeholder="Owner"
            value={owner}
            onChange={(e) => setOwner(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
          />
          <input
            className={inputClass}
            placeholder="Repository"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
          />
          <button
            className={`rounded py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
              isDark
                ? "bg-zinc-700 text-zinc-100 hover:bg-zinc-600"
                : "bg-zinc-900 text-white hover:bg-zinc-700"
            }`}
            onClick={handleConnect}
            disabled={loading}
          >
            {loading ? "Connecting…" : "Connect"}
          </button>
          {error && <p className="text-xs text-red-400">{error}</p>}
          {configured && (
            <button
              className="text-xs opacity-50 hover:opacity-100"
              onClick={() => setShowSettings(false)}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  // PR list view
  return (
    <div
      className={`flex h-full flex-col ${isDark ? "text-zinc-100" : "text-zinc-900"}`}
    >
      {/* Header */}
      <div
        className={`flex items-center gap-2 border-b px-3 py-2 ${
          isDark ? "border-zinc-700" : "border-zinc-200"
        }`}
      >
        <span className="flex-1 truncate text-sm font-medium">
          {owner}/{repo}
        </span>
        <button
          className="text-sm opacity-50 hover:opacity-100"
          onClick={() => fetchPRs(owner, repo)}
          title="Refresh"
        >
          ↻
        </button>
        <button
          className="text-sm opacity-50 hover:opacity-100"
          onClick={() => setShowSettings(true)}
          title="Settings"
        >
          ⚙
        </button>
      </div>

      {/* Last fetched */}
      {minutesAgo !== null && (
        <div className="px-3 py-1 text-xs opacity-40">
          Updated {minutesAgo === 0 ? "just now" : `${minutesAgo}m ago`}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="flex h-full items-center justify-center text-sm opacity-50">
            Loading…
          </div>
        )}
        {!loading && error && (
          <div className="px-3 py-4 text-sm text-red-400">{error}</div>
        )}
        {!loading && !error && prs.length === 0 && (
          <div className="flex h-full items-center justify-center text-sm opacity-50">
            No open pull requests 🎉
          </div>
        )}
        {!loading &&
          !error &&
          prs.map((pr) => (
            <button
              key={pr.number}
              className={`w-full border-b px-3 py-2.5 text-left transition-colors ${
                isDark
                  ? "border-zinc-700/50 hover:bg-zinc-800"
                  : "border-zinc-100 hover:bg-zinc-50"
              }`}
              onClick={() => openUrl(pr.html_url)}
            >
              <div className="flex items-start gap-2">
                <span className="mt-0.5 text-xs leading-5">
                  {pr.draft ? "⚫" : "🟢"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="shrink-0 text-xs opacity-40">
                      #{pr.number}
                    </span>
                    <span className="truncate text-sm leading-5">
                      {pr.title}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-1">
                    <img
                      src={pr.user.avatar_url}
                      alt={pr.user.login}
                      className="h-4 w-4 rounded-full"
                    />
                    <span className="text-xs opacity-50">{pr.user.login}</span>
                    <span className="text-xs opacity-30">·</span>
                    <span className="text-xs opacity-50">
                      {relativeTime(pr.created_at)}
                    </span>
                    {pr.labels.map((label) => (
                      <span
                        key={label.name}
                        className="rounded-full px-1.5 py-px text-xs"
                        style={{
                          backgroundColor: `#${label.color}33`,
                          color: `#${label.color}`,
                        }}
                      >
                        {label.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
      </div>
    </div>
  );
}
