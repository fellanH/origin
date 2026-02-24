# Zustand Research — February 2026

**Researched:** 2026-02-23 (updated with deep verification)

---

## Version: v5.0.11

Released ~January 2026. Breaking changes from v4.

### v5 Breaking Changes (relevant to this project)

| Change                                                        | Impact                                             |
| ------------------------------------------------------------- | -------------------------------------------------- |
| No default export — use `import { create }`                   | Update all store files                             |
| React 18 minimum                                              | Fine — project uses React 19                       |
| Selectors returning new object references risk infinite loops | Use `useShallow` for derived objects               |
| `persist` v4 auto-stored initial state; v5 does not           | Not relevant — project uses `@tauri-store/zustand` |
| `createWithEqualityFn` replaces `create(fn, equalityFn)`      | Update any stores using equality fn signature      |
| `setState({}, true)` full replace is a type error             | Full state shape must be provided                  |

**v5.0.9 TypeScript regression:** Known middleware typing regression. Fixed in v5.0.11. Upgrade immediately if on 5.0.9.

**v5.0.11 fix relevant to Tauri:** `persist` no longer relies on the global `localStorage` object. Correct for non-standard browser environments. Not relevant since this project uses `@tauri-store/zustand`.

---

## `persist` Middleware: Pitfalls for Recursive Tree State

> **Note:** This project uses `@tauri-store/zustand` which replaces standard `persist` middleware. The following documents persist-specific pitfalls for reference only — applicable if you later migrate away from `@tauri-store/zustand`. For the current implementation, see `research/tauri-store-zustand.md`.

### 1. Shallow merge silently corrupts nested state

Default hydration does a shallow merge. For a binary tree (`{ root: { type: 'split', left: {...}, right: {...} } }`), a shallow merge overwrites the entire `root` key, discarding deep defaults.

**Fix: provide a custom `merge` function:**

```ts
persist(storeCreator, {
  name: "origin-workspace-state",
  merge: (persisted, current) => deepMerge(current, persisted),
});
```

### 2. Functions serialize as `{}`

Actions (functions) in Zustand state serialize to empty objects. On hydration they corrupt the store.

**Fix: use `partialize` to exclude all function-valued keys:**

```ts
persist(storeCreator, {
  partialize: (state) => ({
    workspaces: state.workspaces,
    savedConfigs: state.savedConfigs,
    activeWorkspaceId: state.activeWorkspaceId,
    // exclude all action functions
  }),
});
```

### 3. Non-JSON-serializable types

`Map`, `Set`, `Date`, `RegExp` are silently dropped by `JSON.stringify`.

**Fix:** Use `superjson` as custom storage serializer, or normalize all state to plain JSON-compatible types (recommended for this project).

### 4. Recursive TypeScript types

Passing recursive types directly to `persist` acts as an assertion, not annotation. TypeScript may infer incorrectly.

**Fix options:**

- Cast via `as unknown as YourType` after store creation
- Normalize tree to a flat map: `{ [id: string]: PanelLeaf | PanelSplit }` with a separate `rootId: string` — simplifies serialization and traversal

---

## Zustand + localStorage in Tauri: Do Not Use

Multiple documented issues:

- **Origin instability in dev:** `cargo tauri dev` port changes between restarts → different origin → empty store on every restart
- **Dev vs prod origin mismatch:** Dev = `http://localhost:1420`, prod = `tauri://localhost`. Data does not carry over.
- **Linux multi-window desync:** Only one window's localStorage survives app close. Bug `tauri#10981`.
- **5 MB cap:** May be insufficient for large workspace state

### Recommended solution: `@tauri-store/zustand`

npm package that pairs with `tauri-plugin-zustand` Rust crate. Writes to disk via Tauri file system. Bypasses origin/port problem entirely. Handles cross-window synchronization.

**Full setup, correct API, and configuration patterns:** See `research/tauri-store-zustand.md`.

---

## Immer Middleware

`immer` is the standard approach for complex nested mutations. Lets you write:

```ts
set((draft) => {
  draft.root.children[0].pluginId = "my-plugin";
});
```

instead of spread-hell.

### Import path (verified)

```ts
import { immer } from "zustand/middleware/immer";
```

This is unchanged from v4. The path `zustand/middleware/immer` is the correct v5 path.

### Middleware ordering (critical)

```ts
create<Store>()(
  devtools(
    immer((set) => ({ ... })),
    { name: "StoreName" }
  )
)
```

`immer` innermost, `devtools` outermost. The reason: `devtools` mutates `setState` and adds a type parameter on it. If `immer` wrapped `devtools`, it would receive the mutated `setState` and break type inference.

`persist` is not used — `@tauri-store/zustand` handles persistence separately via `createTauriStore`.

---

## Slices Pattern: Single Store, Multiple Slices

**Recommendation:** Single store with slices. Multiple stores only for genuinely independent state.

For `origin`: workspace slice + plugin registry slice → one combined store.

**Rule:** Apply middleware (`immer`, `devtools`) only at the combined store boundary — not inside individual slice files.

### TypeScript pattern — verified via Zustand maintainer-endorsed approach

The key type helper is `ImmerStateCreator`, which tells TypeScript that slice `set` calls operate on an Immer draft:

```ts
import { create, StateCreator } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { StoreMutatorIdentifier } from "zustand";

// -----------------------------------------------
// Type helper: tells TypeScript this slice uses immer
// -----------------------------------------------
type ImmerStateCreator<
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
> = StateCreator<T, [...Mps, ["zustand/immer", never]], Mcs, T>;

// -----------------------------------------------
// Slice types
// -----------------------------------------------
type WorkspaceSlice = {
  workspaces: Workspace[];
  activeWorkspaceId: string;
  addWorkspace: (name: string) => void;
};

type PluginSlice = {
  plugins: Record<string, PluginModule>;
  registerPlugin: (id: string, mod: PluginModule) => void;
};

type AppStore = WorkspaceSlice & PluginSlice;

// -----------------------------------------------
// Slice creators — each typed with ImmerStateCreator
// -----------------------------------------------
const createWorkspaceSlice: ImmerStateCreator<
  AppStore,
  [],
  [],
  WorkspaceSlice
> = (set) => ({
  workspaces: [],
  activeWorkspaceId: "",
  addWorkspace: (name) =>
    set((draft) => {
      draft.workspaces.push({ id: crypto.randomUUID(), name });
    }),
});

const createPluginSlice: ImmerStateCreator<AppStore, [], [], PluginSlice> = (
  set,
) => ({
  plugins: {},
  registerPlugin: (id, mod) =>
    set((draft) => {
      draft.plugins[id] = mod;
    }),
});

// -----------------------------------------------
// Combined store — middleware applied here only
// -----------------------------------------------
export const useStore = create<AppStore>()(
  devtools(
    immer((...args) => ({
      ...createWorkspaceSlice(...args),
      ...createPluginSlice(...args),
    })),
    { name: "AppStore" },
  ),
);
```

If you do not need immer in slice-level TypeScript (simpler case), the slice type is just:

```ts
type WorkspaceSlice = { ... };
const createWorkspaceSlice: StateCreator<AppStore, [], [], WorkspaceSlice> = (set) => ({ ... });
```

Then apply `immer` at the store boundary and slices use the mutating `set` pattern through type inference.

---

## Re-render Safety: `useShallow`

v5 change: selectors returning new object references will cause infinite loops.

### Import path (verified)

Both of these work in v5:

```ts
import { useShallow } from "zustand/shallow"; // v5 migration guide canonical
import { useShallow } from "zustand/react/shallow"; // also valid
```

**Use `zustand/shallow`** — this is the path shown in the official v5 migration guide and is the preferred form going forward.

### Usage pattern

```ts
import { useShallow } from "zustand/shallow";

// ❌ Creates a new object on every render → infinite loop in v5
const workspace = useStore((s) => ({ layout: s.layout, name: s.name }));

// ✅ Use useShallow — returns stable reference when values haven't changed
const workspace = useStore(
  useShallow((s) => ({ layout: s.layout, name: s.name })),
);

// ✅ Also works for array selectors
const [layout, name] = useStore(useShallow((s) => [s.layout, s.name]));
```

---

## `zustand-x` — Alternative Utility Library

`zustand-x` v6.2.1 (latest as of Feb 2026) is a wrapper that simplifies store creation with inline middleware config:

```ts
import { createZustandStore } from "zustand-x";

const store = createZustandStore("BearStore")({
  state: { count: 0 },
  devtools: true,
  immer: true, // uses "mutative" internally, not immer
});
```

**Assessment for this project:** Not recommended. It uses `mutative` (not `immer`) internally. The API diverges from standard Zustand patterns, which adds cognitive overhead when reading official docs. The standard `create()(devtools(immer(...)))` pattern is well-understood and has better TypeScript support via official types.

---

## Sources

- https://pmnd.rs/blog/announcing-zustand-v5
- https://zustand.docs.pmnd.rs/migrations/migrating-to-v5
- https://zustand.docs.pmnd.rs/integrations/persisting-store-data
- https://zustand.docs.pmnd.rs/integrations/immer-middleware
- https://zustand.docs.pmnd.rs/guides/slices-pattern
- https://zustand.docs.pmnd.rs/hooks/use-shallow
- https://github.com/pmndrs/zustand/discussions/2070 (maintainer-endorsed ImmerStateCreator pattern)
- https://github.com/pmndrs/zustand/discussions/3056 (slice + immer + type inference)
- https://www.npmjs.com/package/@tauri-store/zustand
- https://tb.dev.br/tauri-store/plugin-zustand/guide/getting-started
- https://github.com/tauri-apps/tauri/issues/10981
- https://aptabase.com/blog/persistent-state-tauri-apps
