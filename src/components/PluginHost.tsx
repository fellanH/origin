import { useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { loadPlugin } from "@/plugins/loader";
import type { PluginComponent, PluginContext } from "@/types/plugin";

interface Props {
  pluginId: string;
  context: PluginContext;
}

function PluginHostInner({ pluginId, context }: Props) {
  const [Component, setComponent] = useState<PluginComponent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setComponent(null);
    setError(null);
    loadPlugin(pluginId)
      .then((mod) => setComponent(() => mod.default))
      .catch((err) => setError(String(err?.message ?? err)));
  }, [pluginId]);

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-sm text-destructive">
        Plugin error: {error}
      </div>
    );
  }
  if (!Component) {
    return (
      <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
        Loading…
      </div>
    );
  }
  return <Component context={context} />;
}

export default function PluginHost({ pluginId, context }: Props) {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <div className="flex h-full items-center justify-center p-4 text-sm text-destructive">
          Plugin error: {error instanceof Error ? error.message : String(error)}
        </div>
      )}
    >
      <PluginHostInner pluginId={pluginId} context={context} />
    </ErrorBoundary>
  );
}
