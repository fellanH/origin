function EmptyState() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <p className="text-sm font-medium">note</p>
      <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground">
        <span>⌘D — split horizontally</span>
        <span>⌘⇧D — split vertically</span>
      </div>
    </div>
  );
}

export default EmptyState;
