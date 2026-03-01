import type React from "react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useUpdater } from "@/hooks/useUpdater";
import { CHANNEL_INFO } from "@/types/updater";
import type { UpdateChannel, UpdateStatus } from "@/types/updater";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const RISK_COLORS: Record<string, string> = {
  low: "bg-green-500/15 text-green-700 dark:text-green-400",
  medium: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
  high: "bg-red-500/15 text-red-700 dark:text-red-400",
};

type RiskBadgeProps = { level: string };

function RiskBadge({ level }: RiskBadgeProps): React.JSX.Element {
  return (
    <span
      className={cn(
        "inline-block rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
        RISK_COLORS[level] ?? "bg-muted text-muted-foreground",
      )}
    >
      {level}
    </span>
  );
}

type ChannelSelectorProps = {
  value: UpdateChannel;
  onChange: (channel: UpdateChannel) => void;
};

function ChannelSelector({
  value,
  onChange,
}: ChannelSelectorProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      {CHANNEL_INFO.map((info) => (
        <button
          key={info.channel}
          onClick={() => onChange(info.channel)}
          className={cn(
            "flex items-start gap-3 rounded-md border px-3 py-2.5 text-left transition-colors",
            value === info.channel
              ? "border-foreground/30 bg-foreground/5"
              : "border-border hover:border-foreground/20 hover:bg-foreground/[0.02]",
          )}
        >
          <div
            className={cn(
              "mt-0.5 h-3 w-3 shrink-0 rounded-full border-2 transition-colors",
              value === info.channel
                ? "border-foreground bg-foreground"
                : "border-muted-foreground/40 bg-transparent",
            )}
          />
          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{info.label}</span>
              <RiskBadge level={info.riskLevel} />
            </div>
            <span className="text-[11px] leading-snug text-muted-foreground">
              {info.description}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

function statusLabel(status: UpdateStatus): string {
  switch (status) {
    case "idle":
      return "";
    case "checking":
      return "Checking for updates\u2026";
    case "available":
      return "Update available";
    case "downloading":
      return "Downloading\u2026";
    case "ready":
      return "Update ready \u2014 restart to apply";
    case "installing":
      return "Installing\u2026";
    case "up-to-date":
      return "You\u2019re on the latest version";
    case "error":
      return "Update check failed";
    default:
      status satisfies never;
      return "";
  }
}

type ProgressBarProps = { value: number };

function ProgressBar({ value }: ProgressBarProps): React.JSX.Element {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full bg-foreground transition-all duration-300"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}

type ChangelogProps = { body: string };

function Changelog({ body }: ChangelogProps): React.JSX.Element {
  if (!body.trim()) return <></>;
  return (
    <div className="mt-2 rounded-md border border-border bg-muted/50 p-3">
      <h4 className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        What&apos;s new
      </h4>
      <div className="max-h-[120px] overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-foreground/80">
        {body}
      </div>
    </div>
  );
}

export default function UpdateSettings(): React.JSX.Element {
  const updateChannel = useWorkspaceStore((s) => s.updateChannel);
  const setUpdateChannel = useWorkspaceStore((s) => s.setUpdateChannel);

  const {
    status,
    updateInfo,
    progress,
    error,
    rollbackInfo,
    checkForUpdates,
    downloadAndInstall,
    rollback,
    clearRollback,
  } = useUpdater();

  const isBusy =
    status === "checking" ||
    status === "downloading" ||
    status === "installing";

  return (
    <div className="flex flex-col gap-4">
      <ChannelSelector
        value={updateChannel}
        onChange={(ch) => setUpdateChannel(ch)}
      />

      <div className="flex items-center gap-2">
        {status !== "available" && status !== "ready" && (
          <Button
            variant="outline"
            size="sm"
            onClick={checkForUpdates}
            disabled={isBusy}
          >
            {status === "checking" ? "Checking\u2026" : "Check for Updates"}
          </Button>
        )}
        {status === "available" && (
          <Button size="sm" onClick={downloadAndInstall}>
            Download &amp; Install
          </Button>
        )}
        {status === "ready" && (
          <Button
            size="sm"
            onClick={async () => {
              const { invoke } = await import("@tauri-apps/api/core");
              await invoke("restart_app");
            }}
          >
            Restart Now
          </Button>
        )}
      </div>

      {status === "downloading" && progress >= 0 && (
        <ProgressBar value={progress} />
      )}

      {statusLabel(status) && (
        <p
          className={cn(
            "text-xs",
            status === "error"
              ? "text-red-500"
              : status === "up-to-date"
                ? "text-green-600 dark:text-green-400"
                : "text-muted-foreground",
          )}
        >
          {statusLabel(status)}
          {status === "available" && updateInfo && (
            <span className="ml-1 font-medium">v{updateInfo.version}</span>
          )}
        </p>
      )}

      {status === "error" && error && (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
          {error}
          <br />
          <span className="mt-1 block text-[11px] text-red-500 dark:text-red-400">
            The app is still running normally. Try again later, or switch to the
            Stable channel.
          </span>
        </p>
      )}

      {updateInfo?.body && <Changelog body={updateInfo.body} />}

      {rollbackInfo && (
        <div className="mt-1 rounded-md border border-border bg-muted/30 p-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-medium">
              Rollback available &rarr; v{rollbackInfo.version}
            </span>
            <span className="text-[11px] text-muted-foreground">
              Restore the previous version and its workspace state.
            </span>
          </div>
          <div className="mt-2 flex gap-2">
            <Button variant="outline" size="sm" onClick={rollback}>
              Rollback
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearRollback}
              className="text-muted-foreground"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
