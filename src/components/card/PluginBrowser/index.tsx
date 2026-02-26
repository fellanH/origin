import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Registry, RegistryPlugin } from "./types";

const REGISTRY_URL = "https://fellanH.github.io/origin-plugin-registry/registry.json";

type Tab = "discover" | "create";

type FetchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; plugins: RegistryPlugin[] }
  | { status: "error" };

type InstallState = "idle" | "installing" | "success" | "error";

const STEPS = [
  {
    title: "Clone the starter",
    desc: "Fork or clone origin-plugin-starter to get the scaffold, manifest, and bundler config.",
  },
  {
    title: "Build in dev mode",
    desc: "Run npm run dev — your plugin hot-reloads inside Origin while you code.",
  },
  {
    title: "Bundle for release",
    desc: "Run npm run build to produce a single dist/index.js that Origin can load.",
  },
  {
    title: "Install locally",
    desc: 'Open Plugin Browser → Discover, then use "Install from folder" and point it at your dist/.',
  },
];

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function PluginBrowser() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("discover");
  const [fetchState, setFetchState] = useState<FetchState>({ status: "idle" });

  // Fetch registry each time the dialog opens
  useEffect(() => {
    if (!open) return;
    setFetchState({ status: "loading" });
    fetch(REGISTRY_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Registry>;
      })
      .then((data) => setFetchState({ status: "ok", plugins: data.plugins }))
      .catch(() => setFetchState({ status: "error" }));
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        tabIndex={-1}
        className="flex h-full select-none items-center px-2 text-xs opacity-60 hover:opacity-100"
      >
        ＋ Add Plugin
      </DialogTrigger>

      <DialogContent className="flex max-w-2xl flex-col gap-0 overflow-hidden p-0">
        {/* Title row — pr-10 leaves room for the built-in close button */}
        <div className="shrink-0 px-6 pt-5 pr-10">
          <DialogTitle>Plugin Browser</DialogTitle>
        </div>

        {/* Tab nav */}
        <div className="mt-4 flex shrink-0 border-b border-border px-6">
          {(["discover", "create"] as const).map((t) => (
            <button
              key={t}
              className={cn(
                "mr-4 border-b-2 pb-2 text-sm font-medium capitalize transition-colors",
                tab === t
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setTab(t)}
            >
              {t === "discover" ? "Discover" : "Create"}
            </button>
          ))}
        </div>

        {/* Scrollable content area */}
        <div className="h-[420px] overflow-y-auto px-6 py-4">
          {tab === "discover" ? (
            <DiscoverTab fetchState={fetchState} />
          ) : (
            <CreateTab />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Discover tab ─────────────────────────────────────────────────────────────

function DiscoverTab({ fetchState }: { fetchState: FetchState }) {
  const [installStates, setInstallStates] = useState<
    Record<string, InstallState>
  >({});

  async function handleInstall(plugin: RegistryPlugin) {
    if (!plugin.bundle_url) {
      setInstallStates((s) => ({ ...s, [plugin.id]: "error" }));
      return;
    }
    setInstallStates((s) => ({ ...s, [plugin.id]: "installing" }));
    try {
      const res = await fetch(plugin.bundle_url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const jsSource = await res.text();
      const manifestJson = JSON.stringify({
        id: plugin.id,
        name: plugin.name,
        version: plugin.version,
        description: plugin.description ?? "",
        icon: plugin.icon ?? "",
        ...(plugin.requiredCapabilities && plugin.requiredCapabilities.length > 0
          ? { requiredCapabilities: plugin.requiredCapabilities }
          : {}),
      });
      await invoke("save_plugin_bundle", {
        id: plugin.id,
        manifestJson,
        jsSource,
      });
      setInstallStates((s) => ({ ...s, [plugin.id]: "success" }));
    } catch {
      setInstallStates((s) => ({ ...s, [plugin.id]: "error" }));
    }
  }

  if (fetchState.status === "idle" || fetchState.status === "loading") {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[72px] animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
    );
  }

  if (fetchState.status === "error") {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        Could not load registry — check your internet connection.
      </div>
    );
  }

  if (fetchState.plugins.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
        No plugins yet — be the first to publish one.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {fetchState.plugins.map((plugin) => (
        <PluginCard
          key={plugin.id}
          plugin={plugin}
          installState={installStates[plugin.id] ?? "idle"}
          onInstall={handleInstall}
        />
      ))}
    </div>
  );
}

interface PluginCardProps {
  plugin: RegistryPlugin;
  installState: InstallState;
  onInstall: (plugin: RegistryPlugin) => void;
}

function PluginCard({ plugin, installState, onInstall }: PluginCardProps) {
  const isInstalling = installState === "installing";
  const isSuccess = installState === "success";
  const isError = installState === "error";

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted text-xl">
        {plugin.icon ?? "🧩"}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-1.5">
          <span className="text-sm font-medium">{plugin.name}</span>
          <span className="text-xs text-muted-foreground">
            v{plugin.version}
          </span>
          <span className="text-xs text-muted-foreground">
            by {plugin.author}
          </span>
        </div>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
          {plugin.description}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <div className="flex items-center gap-2">
          {plugin.github && (
            <a
              href={plugin.github}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              GitHub
            </a>
          )}
          <button
            onClick={() => onInstall(plugin)}
            disabled={isInstalling || isSuccess}
            className={cn(
              "rounded-md px-3 py-1 text-xs transition-colors",
              isSuccess
                ? "bg-green-600 text-white opacity-80"
                : isError
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90",
              (isInstalling || isSuccess) && "cursor-not-allowed",
            )}
          >
            {isInstalling
              ? "Installing…"
              : isSuccess
                ? "✓ Installed"
                : isError
                  ? "Retry"
                  : "Install"}
          </button>
        </div>
        {isSuccess && (
          <span className="text-xs text-muted-foreground">
            Restart to activate
          </span>
        )}
        {isError && (
          <span className="text-xs text-destructive">Install failed</span>
        )}
      </div>
    </div>
  );
}

// ─── Create tab ───────────────────────────────────────────────────────────────

function CreateTab() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold">Build your own plugin</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Origin plugins are standard React components. Any npm package, any UI
          library — just export a component and a manifest.
        </p>
      </div>

      <ol className="space-y-3">
        {STEPS.map(({ title, desc }, i) => (
          <li key={i} className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
              {i + 1}
            </div>
            <div>
              <div className="text-sm font-medium">{title}</div>
              <div className="text-xs text-muted-foreground">{desc}</div>
            </div>
          </li>
        ))}
      </ol>

      <div className="flex gap-2 pt-1">
        <a
          href="https://github.com/fellanH/origin-plugin-starter"
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-muted"
        >
          Plugin Starter →
        </a>
        <a
          href="https://github.com/fellanH/origin/wiki/plugins"
          target="_blank"
          rel="noreferrer"
          className="rounded-md border border-border px-3 py-1.5 text-xs transition-colors hover:bg-muted"
        >
          Plugin Docs →
        </a>
      </div>
    </div>
  );
}
