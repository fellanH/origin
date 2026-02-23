# Zustand Research — February 2026

**Researched:** 2026-02-23

---

## Version: v5.0.11

Released ~January 2026. Breaking changes from v4.

### v5 Breaking Changes (relevant to this project)

| Change                                                        | Impact                                        |
| ------------------------------------------------------------- | --------------------------------------------- |
| No default export — use `import { create }`                   | Update all store files                        |
| React 18 minimum                                              | Fine — project uses React 19                  |
| Selectors returning new object references risk infinite loops | Use `useShallow` for derived objects          |
| `persist` v4 auto-stored initial state; v5 does not           | May need explicit post-hydration init         |
| `createWithEqualityFn` replaces `create(fn, equalityFn)`      | Update any stores using equality fn signature |
| `setState({}, true)` full replace is a type error             | Full state shape must be provided             |

**v5.0.9 TypeScript regression:** Known middleware typing regression. Fixed in v5.0.11. Upgrade immediately if on 5.0.9.

**v5.0.11 fix relevant to Tauri:** `persist` no longer relies on the global `localStorage` object. Correct for non-standard browser environments.

---

## `persist` Middleware: Pitfalls for Recursive Tree State

### 1. Shallow merge silently corrupts nested state

Default hydration does a shallow merge. For a binary tree (`{ root: { type: 'split', left: {...}, right: {...} } }`), a shallow merge overwrites the entire `root` key, discarding deep defaults.

**Fix: provide a custom `merge` function:**

```ts
persist(storeCreator, {
  name: "note-workspace-state",
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

```ts
import { createStore } from '@tauri-store/zustand'

export const useStore = createStore(
  'workspace',
  (set) => ({ workspaces: [], ... }),
  { saveOnChange: true }
)
```

**Migration path to SQLite (v2):** Zustand `persist` is storage-agnostic. Implement the `PersistStorage<T>` interface (`getItem`, `setItem`, `removeItem`) wrapping `tauri-plugin-sql`:

```ts
const sqliteStorage: PersistStorage<AppState> = {
  getItem: async (name) => {
    const rows = await db.select("SELECT value FROM kv WHERE key = $1", [name]);
    return rows[0]?.value ?? null;
  },
  setItem: async (name, value) => {
    await db.execute(
      "INSERT INTO kv (key, value) VALUES ($1, $2) ON CONFLICT(key) DO UPDATE SET value = $2",
      [name, value],
    );
  },
  removeItem: async (name) => {
    await db.execute("DELETE FROM kv WHERE key = $1", [name]);
  },
};
```

Handle async hydration: check `useStore.persist.hasHydrated()` or use `onFinishHydration` callback before rendering.

---

## Immer Middleware: Still Recommended

Yes — `immer` is the standard approach for complex nested mutations. Lets you write:

```ts
set((draft) => {
  draft.root.children[0].pluginId = "my-plugin";
});
```

instead of spread-hell.

**Middleware ordering (critical):**

```ts
create()(
  devtools(
    persist(
      immer((set) => ({ ... })),
      persistOptions
    ),
    devtoolsOptions
  )
)
```

`immer` innermost, `persist` wraps it, `devtools` outermost.

---

## Slices Pattern: Single Store, Multiple Slices

**Recommendation:** Single store with slices. Multiple stores only for genuinely independent state.

For `note`: workspace slice + plugin registry slice → one combined store.

**Rule:** Apply middleware (`persist`, `immer`, `devtools`) only at the combined store boundary — not inside individual slice files.

```ts
// workspaceSlice.ts
export const createWorkspaceSlice = (set, get) => ({
  workspaces: [],
  addWorkspace: () => set((s) => { s.workspaces.push({ ... }) }),
})

// pluginSlice.ts
export const createPluginSlice = (set, get) => ({
  plugins: {},
  registerPlugin: (id, mod) => set((s) => { s.plugins[id] = mod }),
})

// store.ts — middleware applied here only
export const useStore = create()(
  devtools(persist(immer((...args) => ({
    ...createWorkspaceSlice(...args),
    ...createPluginSlice(...args),
  })), persistOptions))
)
```

---

## Re-render Safety: `useShallow`

v5 change: selectors returning new object references will cause infinite loops.

```ts
// ❌ Creates a new object on every render → infinite loop in v5
const workspace = useStore((s) => ({ layout: s.layout, name: s.name }));

// ✅ Use useShallow
import { useShallow } from "zustand/react/shallow";
const workspace = useStore(
  useShallow((s) => ({ layout: s.layout, name: s.name })),
);
```

---

## Alternatives Considered

| Library            | Verdict                                                                                                                                                                                        |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Jotai**          | Worth evaluating if tree nodes update independently and frequently. `atomFamily` maps naturally to dynamic panel collections. Better fine-grained re-render control. Heavier (3.5KB vs 0.6KB). |
| **Valtio**         | Proxy-based mutations feel natural for tree edits. TypeScript support weaker for complex types. Circular references (possible in recursive trees) will crash. Avoid.                           |
| **TanStack Store** | Maturing but ecosystem too immature (no `persist`/`immer`/`devtools` equivalents yet). Not ready for production.                                                                               |

**Conclusion:** Zustand with slices + immer + `@tauri-store/zustand` is the lowest-complexity, best-documented path for this project.

---

## Sources

- https://pmnd.rs/blog/announcing-zustand-v5
- https://zustand.docs.pmnd.rs/migrations/migrating-to-v5
- https://zustand.docs.pmnd.rs/integrations/persisting-store-data
- https://zustand.docs.pmnd.rs/middlewares/immer
- https://zustand.docs.pmnd.rs/guides/slices-pattern
- https://www.npmjs.com/package/@tauri-store/zustand
- https://tb.dev.br/tauri-store/plugin-zustand/guide/getting-started
- https://github.com/tauri-apps/tauri/issues/10981
- https://aptabase.com/blog/persistent-state-tauri-apps
- https://jotai.org
