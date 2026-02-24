import { useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { loadPlugin, getCachedPlugin } from "@/plugins/loader";
import type { PluginComponent, PluginContext } from "@/types/plugin";

interface Props {
  pluginId: string;
  context: PluginContext;
}

function PluginHostInner({ pluginId, context }: Props) {
  const [Component, setComponent] = useState<PluginComponent | null>(
    () => getCachedPlugin(pluginId)?.default ?? null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If already cached, component is already set — skip the flash
    if (!getCachedPlugin(pluginId)) {
      setComponent(null);
      setError(null);
    }
    loadPlugin(pluginId)
      .then((mod) => {
        if (mod) setComponent(() => mod.default);
        else setError(`Plugin not registered: ${pluginId}`);
      })
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
      resetKeys={[pluginId]}
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
