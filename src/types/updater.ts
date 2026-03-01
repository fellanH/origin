/** Available update channels for staged rollout. */
export type UpdateChannel = "stable" | "beta" | "nightly";

/** Risk metadata shown in the channel selector UI. */
export type ChannelInfo = {
  channel: UpdateChannel;
  label: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
};

/** All known channels with their user-facing metadata. */
export const CHANNEL_INFO: readonly ChannelInfo[] = [
  {
    channel: "stable",
    label: "Stable",
    description: "Thoroughly tested releases. Recommended for daily use.",
    riskLevel: "low",
  },
  {
    channel: "beta",
    label: "Beta",
    description:
      "Preview releases with new features. May contain minor bugs.",
    riskLevel: "medium",
  },
  {
    channel: "nightly",
    label: "Nightly",
    description:
      "Bleeding-edge builds from main. Expect rough edges and breaking changes.",
    riskLevel: "high",
  },
] as const;

/** Per-channel GitHub release endpoint pattern. */
export function channelEndpoint(channel: UpdateChannel): string {
  switch (channel) {
    case "stable":
      return "https://github.com/fellanH/origin/releases/latest/download/latest.json";
    case "beta":
      return "https://github.com/fellanH/origin/releases/download/beta/latest.json";
    case "nightly":
      return "https://github.com/fellanH/origin/releases/download/nightly/latest.json";
    default:
      channel satisfies never;
      throw new Error(`Unknown update channel: ${String(channel)}`);
  }
}

/** Lifecycle state of an update operation. */
export type UpdateStatus =
  | "idle"
  | "checking"
  | "available"
  | "downloading"
  | "ready"
  | "installing"
  | "up-to-date"
  | "error";

/** Metadata about an available update. */
export type UpdateInfo = {
  version: string;
  currentVersion: string;
  date: string;
  body: string;
};

/** Rollback target info returned from the Rust backend. */
export type RollbackInfo = {
  version: string;
  backedUpAt: string;
};
