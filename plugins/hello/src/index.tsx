import type { PluginContext } from "@origin/api";
export { manifest } from "./manifest";

interface Props {
  context: PluginContext;
}

export default function HelloPlugin({ context }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground">
      <span className="text-4xl">👋</span>
      <p className="text-sm font-medium">Hello from @origin/hello</p>
      <p className="text-xs opacity-60">card: {context.cardId}</p>
    </div>
  );
}
