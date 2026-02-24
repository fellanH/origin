# origin — Coding Standards & SOPs

Authoritative standards for all code in this project. Read before writing any code.
Architecture decisions and Tauri-specific gotchas live in `CLAUDE.md`. This document covers how we write code.

---

## TypeScript

### Strictness

- `strict: true` — no exceptions, no `// @ts-ignore`
- No `any` — use `unknown` and narrow with type guards
- All discriminated unions must be exhaustively handled — use `satisfies` for compile-time checks:
  ```typescript
  type PanelNode = PanelLeaf | PanelSplit;
  // Exhaustive switch — TypeScript errors if a new variant is added without handling it
  function renderNode(node: PanelNode) {
    switch (node.type) {
      case "leaf": return <LeafPanel ... />;
      case "split": return <PanelBranch ... />;
      default: node satisfies never; throw new Error("unhandled PanelNode type");
    }
  }
  ```
- Prefer `type` aliases for data shapes, `interface` for extension-point contracts:
  ```typescript
  type NodeId = string;               // data alias
  type PanelLeaf = { ... };           // data shape
  interface PluginModule { ... }      // extension contract (plugins implement this)
  ```
- Use nominal-style ID types at declaration time — do not pass raw `string` where `NodeId` is expected
- Non-serializable types (`Map`, `Set`, `Date`) are banned from store state — plain JSON only

---

## React

### Components

- Functional components only — no class components
- Explicit function syntax with explicit return type — avoid `React.FC<Props>`:

  ```typescript
  // ✅
  function PanelBranch({ node }: PanelBranchProps): JSX.Element { ... }

  // ❌
  const PanelBranch: React.FC<PanelBranchProps> = ({ node }) => { ... }
  ```

- Props type: `type ComponentNameProps = { ... }` directly above the component
- One component per file — file name matches component name (`PanelBranch.tsx`)

### Hooks

- `useEffect` only for: Tauri event listeners, `document.addEventListener`, cleanup side effects
- Do not use `useEffect` for derived state — use selectors instead
- Extract complex hook logic to `src/hooks/useXxx.ts`
- `useKeyboardShortcuts` reads store state via `useStore.getState()` — NOT via selector — to avoid stale closures in event handlers:
  ```typescript
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const { focusedPanelId, splitPanel } = useWorkspaceStore.getState(); // ✅ always current
      // ...
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []); // empty deps array is correct here
  ```

### Props vs Store

- No prop drilling beyond 2 levels — components read directly from the store
- Components that render a specific node receive its `id: NodeId` as a prop, then read from the store by ID
- No "God components" that receive 10+ props — extract slices or sub-components

---

## Zustand

### Imports (v5)

```typescript
import { create } from "zustand"; // named, not default
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/shallow";
import type { StateCreator, StoreMutatorIdentifier } from "zustand";
```

### Store structure

- Single combined store (`useWorkspaceStore`) — slices for logical separation
- Actions live inside the store, not in components
- Middleware order — fixed, do not change:
  ```typescript
  create<Store>()(
    devtools(
      immer((...args) => ({
        ...createWorkspaceSlice(...args),
        // add slices here
      })),
      { name: "WorkspaceStore" },
    ),
  );
  ```
- `persist` middleware is **not used** — persistence is handled by `@tauri-store/zustand`

### Immer mutations (inside store actions only)

```typescript
splitPanel: (id, direction) =>
  set((draft) => {
    const node = draft.nodes[id]; // mutate the draft directly
    // ...
  }),
```

### Selectors

```typescript
// Primitive — safe without useShallow
const focusedId = useWorkspaceStore((s) => s.focusedPanelId);

// Object/array — MUST use useShallow (v5 re-render safety)
const { rootId, nodes } = useWorkspaceStore(
  useShallow((s) => ({ rootId: s.rootId, nodes: s.nodes })),
);
```

### `@tauri-store/zustand` (post-PoC persistence)

- `createTauriStore()` — NOT `createStore` (does not exist)
- `filterKeys` + `filterKeysStrategy: "omit"` to exclude action functions — do NOT use `partialize`
- `await tauriHandler.start()` before `ReactDOM.createRoot()` in `main.tsx`
- File suffix: `.dev.json` in dev, `.json` in prod — intentionally separate (do not disable)

---

## Tauri IPC

### Commands (Rust)

- All commands return `Result<T, AppError>` — never panic, never use `unwrap()`
- Async commands use owned types — no `&str`, no borrowed references:

  ```rust
  // ✅
  #[tauri::command]
  async fn read_file(path: String) -> Result<String, AppError> { ... }

  // ❌ — compile error in async context
  #[tauri::command]
  async fn read_file(path: &str) -> Result<String, AppError> { ... }
  ```

- Every command must be registered:
  ```rust
  .invoke_handler(tauri::generate_handler![greet, read_file])
  ```
- Shared state uses `Mutex<T>` + `State<'_, Mutex<T>>` — match the type exactly

### Adding a Tauri command

See `docs/SOP/add-tauri-command.md` for the full 4-step procedure.

### Frontend IPC

```typescript
import { invoke } from "@tauri-apps/api/core";     // v2 API — NOT @tauri-apps/api/tauri (v1)
import { listen } from "@tauri-apps/api/event";

const result = await invoke<string>("greet", { name: "World" });

// Always clean up listeners
const unlisten = await listen("task-progress", (e) => { ... });
return () => unlisten();
```

### Window events

- `onCloseRequested`: must call `e.preventDefault()` to prevent CMD+W closing the native window

---

## CSS / Tailwind

### Tailwind v4 rules

- `@import "tailwindcss"` in `index.css` — NOT `@tailwind base/components/utilities` (v3 syntax)
- CSS variables via `@theme` block, not `:root` directly
- No v3 `extend` config — v4 uses inline `@theme` customizations
- `hsl()` wrapper NOT needed for CSS variables in v4: use `--color-primary` directly

### Class composition

- `cn()` from `@/lib/utils` for conditional merging:
  ```typescript
  import { cn } from "@/lib/utils";
  <div className={cn("base-classes", isFocused && "ring-1 ring-primary")} />
  ```
- No inline `style={{}}` unless animating values that cannot be expressed as Tailwind classes
- Dark mode: CSS class `.dark` strategy — not `prefers-color-scheme` media queries

### Tauri drag region

- `data-tauri-drag-region` on spacer `<div>` elements only
- NEVER on: the tab bar container, buttons, inputs, any interactive element
- Tab bar left padding is `pl-[80px]` — not 72px (clears macOS traffic lights)

---

## Panel Layout

`react-resizable-panels` v4 renames: `Group` (was `PanelGroup`), `Separator` (was `PanelResizeHandle`), `orientation` (was `direction`), `onLayoutChanged` (was `onLayout`)

---

## Plugin State Preservation

### Root cause — why plugins lose state on adjacent panel split

When `splitCard(cardId, direction)` is called, a new intermediate `split` node is inserted between the old parent and `cardId`. The surrounding `<ResizablePanel>` hierarchy changes shape (a new `<Group>` + `<ResizablePanel>` wraps where a bare `<Card>` previously sat). Without a stable React `key`, React reconciles by tree position and **remounts** the `<Card>` — destroying all plugin component state (open file, URL, terminal session, expanded tree nodes, etc.).

### Fix — stable key on leaf `<Card>` in `CardTree`

`CardTree.tsx` passes `key={nodeId}` on the `<Card>` it renders for leaf nodes. Because `nodeId` is a stable UUID that never changes for the lifetime of that card, React can reuse (not remount) the component instance even when the wrapping panel tree restructures around it.

```tsx
// CardTree.tsx — leaf branch
if (node.type === "leaf") {
  return <Card key={nodeId} nodeId={nodeId} />;
}
```

This is the **preferred** fix and requires no plugin-side changes.

### Fallback — module-level cache (notepad pattern)

If a plugin has state that genuinely cannot be preserved through React identity (e.g. it wraps a non-React imperative library like xterm that must be recreated on DOM remount), use a module-level `Map` keyed by `cardId` to survive remounts:

```tsx
// Module-level — survives component remounts within the same JS module lifetime
const _stateCache = new Map<string, PluginState>();

export default function MyPlugin({ context }: { context: PluginContext }) {
  const [state, setState] = useState<PluginState>(
    () => _stateCache.get(context.cardId) ?? defaultState,
  );
  // Update cache on every change:
  //   _stateCache.set(context.cardId, newState);
}
```

Use this pattern **only** when the stable-key fix in `CardTree` is insufficient (e.g. xterm requires a real DOM node across remounts and cannot be recovered from a cache snapshot). The `notepad` plugin uses this pattern as belt-and-suspenders because it also persists to disk.

---

## File naming

| Type                | Convention          | Example                    |
| ------------------- | ------------------- | -------------------------- |
| React component     | `PascalCase.tsx`    | `PanelBranch.tsx`          |
| Hook                | `useCamelCase.ts`   | `useKeyboardShortcuts.ts`  |
| Store               | `camelCaseStore.ts` | `workspaceStore.ts`        |
| Types               | `camelCase.ts`      | `panel.ts`, `workspace.ts` |
| Utils/lib           | `camelCase.ts`      | `utils.ts`, `registry.ts`  |
| Tauri command files | `snake_case.rs`     | `file_ops.rs`              |

**Panel name collision:** `react-resizable-panels` exports `Panel`. Our component is also `Panel`. Resolution:

- Either: `import { Panel as ResizablePanel } from "react-resizable-panels"`
- Or: Name the local component `LeafPanel.tsx` / `LeafPanel`

---

## Import ordering

Group in this order, separated by blank lines:

```typescript
// 1. Node built-ins
import path from "node:path";

// 2. External packages
import { create } from "zustand";
import { PanelGroup } from "react-resizable-panels";

// 3. Tauri APIs
import { invoke } from "@tauri-apps/api/core";

// 4. Internal aliases (@/...)
import { useWorkspaceStore } from "@/store/workspaceStore";
import { cn } from "@/lib/utils";

// 5. Relative imports
import type { PanelLeaf } from "./types";
```

---

## Git commits

Conventional commit format:

```
type(scope): short description

body (optional, wrap at 72 chars)
```

| Type       | Use for                               |
| ---------- | ------------------------------------- |
| `feat`     | New user-visible feature              |
| `fix`      | Bug fix                               |
| `chore`    | Tooling, deps, config                 |
| `refactor` | Code restructure (no behavior change) |
| `test`     | Test-only changes                     |
| `docs`     | Documentation only                    |

Scope is optional but useful: `feat(store):`, `fix(panel):`, `chore(vite):`

Reference issues in body when applicable: `Closes #7`

---

## Pre-code checklist

See `docs/SOP/pre-code.md` for the full area-by-area checklist.
