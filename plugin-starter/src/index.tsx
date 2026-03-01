import { useState } from "react";
import { usePluginContext, useBusChannel } from "@origin-cards/sdk";
import type { IframePluginContextWithConfig } from "@origin-cards/sdk";
import { manifest } from "./manifest";

/**
 * Main plugin component.
 *
 * Origin injects a `PluginContext` via postMessage when the iframe loads.
 * Use `usePluginContext()` (from @origin-cards/sdk) to receive it.
 *
 * This starter shows:
 * - Reading context values (cardId, workspacePath, theme)
 * - Bus channel subscription via useBusChannel()
 * - Theme-aware rendering
 */
function PluginContent({ context }: { context: IframePluginContextWithConfig }) {
  const isDark = context.theme === "dark";

  // Example: subscribe to the workspace active-path bus channel.
  // useBusChannel returns a publish function. The handler fires on each message.
  const [activePath, setActivePath] = useState<string | null>(null);
  useBusChannel("origin:workspace/active-path", (payload) => {
    const data = payload as { path: string };
    setActivePath(data.path);
    console.log("[my-plugin] active path changed:", data.path);
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "1rem",
        gap: "0.75rem",
        fontFamily: "system-ui, sans-serif",
        fontSize: "0.875rem",
        background: isDark ? "#18181b" : "#ffffff",
        color: isDark ? "#f4f4f5" : "#18181b",
      }}
    >
      {/* Plugin header */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
        <span style={{ fontSize: "1.5rem" }}>{manifest.icon}</span>
        <div>
          <h1 style={{ margin: 0, fontWeight: 600, fontSize: "1rem" }}>
            {manifest.name}{" "}
            <span style={{ fontSize: "0.75rem", fontWeight: 400, opacity: 0.5 }}>
              v{manifest.version}
            </span>
          </h1>
          {manifest.description && (
            <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.6 }}>
              {manifest.description}
            </p>
          )}
        </div>
      </div>

      {/* Context values */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <ContextField label="cardId" value={context.cardId} isDark={isDark} />
        <ContextField label="workspacePath" value={context.workspacePath} isDark={isDark} />
        <ContextField label="theme" value={context.theme} isDark={isDark} />
      </div>

      {/* Bus channel demo */}
      {activePath && (
        <div
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem",
            borderRadius: "0.25rem",
            fontSize: "0.75rem",
            background: isDark ? "#27272a" : "#f4f4f5",
          }}
        >
          <strong>Active path:</strong> {activePath}
        </div>
      )}

      {/* Theme indicator */}
      <div
        style={{
          marginTop: "auto",
          padding: "0.5rem",
          borderRadius: "0.25rem",
          textAlign: "center",
          fontSize: "0.75rem",
          background: isDark ? "#27272a" : "#f4f4f5",
          color: isDark ? "#a1a1aa" : "#71717a",
        }}
      >
        {isDark ? "🌙 dark mode" : "☀️ light mode"}
      </div>
    </div>
  );
}

function ContextField({
  label,
  value,
  isDark,
}: {
  label: string;
  value: string;
  isDark: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
      <label style={{ fontSize: "0.75rem", opacity: 0.5 }}>{label}</label>
      <code
        style={{
          padding: "0.25rem 0.375rem",
          borderRadius: "0.25rem",
          fontSize: "0.75rem",
          background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
        }}
      >
        {value}
      </code>
    </div>
  );
}

/**
 * Default export — Origin loads this component via the plugin protocol.
 * The usePluginContext() hook handles the postMessage handshake automatically.
 */
export default function MyPlugin() {
  const context = usePluginContext();
  if (!context) return null;
  return <PluginContent context={context} />;
}

// Re-export manifest so Origin can read metadata without fully loading the plugin.
export { manifest } from "./manifest";
