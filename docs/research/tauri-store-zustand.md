# `@tauri-store/zustand` — Setup & Zustand v5 Compatibility

**Researched:** 2026-02-23 (updated with deep source inspection)
**Package:** `@tauri-store/zustand` v1.2.0 (published 2026-02-22)
**Scope:** File-backed Zustand persistence for Tauri 2, replacing localStorage

---

## Package Status

| Field        | Detail                                                              |
| ------------ | ------------------------------------------------------------------- |
| npm version  | `1.2.0`                                                             |
| Published    | 2026-02-22 (actively maintained — 14 releases since March 2025)     |
| Crates.io    | `tauri-plugin-zustand = "1.2.0"` (same version, published same day) |
| Tauri compat | Tauri **2.0+** required                                             |
| Zustand dep  | `zustand: "^5.0.8"` — v5 explicit, hard dependency in package.json  |
| Author       | `ferreira-tb` (Andrew Ferreira) — **not official Tauri**            |
| License      | MIT                                                                 |

**Verdict:** Actively maintained, Zustand v5 native, published yesterday. Correct choice.

The npm package `@tauri-store/zustand` and Rust crate `tauri-plugin-zustand` share the same version (`1.2.0`) and were published on the same day. They are designed to be used together at matching versions.

---

## Exact Setup

### 1. Cargo (`src-tauri/Cargo.toml`)

```toml
[dependencies]
tauri-plugin-zustand = "1"
```

Use the `"1"` semver range, not a pinned version, to pick up patch releases automatically.

### 2. Rust registration (`src-tauri/src/lib.rs`)

```rust
tauri::Builder::default()
    .plugin(
        tauri_plugin_zustand::Builder::new()
            .autosave(std::time::Duration::from_secs(300))
            .build()
    )
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
```

`tauri_plugin_zustand::init()` is also valid (default settings, no autosave). The `Builder::new().autosave(...)` pattern is recommended to ensure a periodic save fallback even when `saveOnChange: false`.

### 3. Tauri capabilities (`src-tauri/capabilities/zustand.json`)

```json
{
  "identifier": "zustand",
  "windows": ["*"],
  "permissions": ["zustand:default", "core:event:default"]
}
```

`core:event:default` is mandatory — the JS package uses `getCurrentWebviewWindow().listen(...)` internally.

### 4. npm

```bash
npm install @tauri-store/zustand
```

`@tauri-store/shared` (the shared utilities package) is installed automatically as a direct dependency.

### 5. Store definition

```typescript
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createTauriStore } from "@tauri-store/zustand";

export const useWorkspaceStore = create<WorkspaceStore>()(
  devtools(
    immer((set) => ({
      workspaces: [],
      activeWorkspaceId: "",
      savedConfigs: [],
      // ...actions
    })),
    { name: "WorkspaceStore" },
  ),
);

export const tauriHandler = createTauriStore(
  "workspace-store",
  useWorkspaceStore,
  {
    // Exclude action functions from disk persistence and cross-window sync.
    // "omit" is the default filterKeysStrategy so it can be omitted,
    // but explicit is clearer.
    filterKeys: ["addWorkspace", "closeWorkspace", "setActiveWorkspace"],
    filterKeysStrategy: "omit",
    // Save to disk on every state change, debounced 500ms.
    saveOnChange: true,
    saveStrategy: "debounce",
    saveInterval: 500, // ms; only used when saveStrategy is "debounce" or "throttle"
    // Optional: exit save is on by default (saveOnExit: true)
    hooks: {
      beforeFrontendSync: (state) => ({
        ...state,
        workspaces: state.workspaces?.map(deserializeWorkspace) ?? [],
      }),
    },
  },
);
```

### 6. Bootstrap (before rendering)

```typescript
// main.tsx — await hydration before mounting React
async function bootstrap() {
  await tauriHandler.start();
  ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
}
bootstrap();
```

---

## `createTauriStore` — Complete Options Reference

Verified from the compiled source of `@tauri-store/shared` v0.10.3 (the base library).

### Backend options (synced to Rust, can be changed at runtime)

| Option         | Type                                                        | Default       | Notes                                                |
| -------------- | ----------------------------------------------------------- | ------------- | ---------------------------------------------------- |
| `saveOnChange` | `boolean`                                                   | `false`       | Triggers disk write on every state change            |
| `saveOnExit`   | `boolean`                                                   | `true`        | Writes to disk on graceful app exit                  |
| `saveStrategy` | `"immediate" \| "debounce" \| "throttle" \| number \| null` | `"immediate"` | If a number is passed it implies `"debounce"`        |
| `saveInterval` | `number` (ms)                                               | `0`           | Only relevant when strategy is `debounce`/`throttle` |

### Frontend-only options (JS side, not synced to Rust)

| Option               | Type                                                        | Default       | Notes                                       |
| -------------------- | ----------------------------------------------------------- | ------------- | ------------------------------------------- |
| `autoStart`          | `boolean \| ((id: string) => boolean \| Promise<boolean>)`  | `false`       | Skip manual `start()`                       |
| `filterKeys`         | `string \| string[] \| RegExp \| null`                      | `null`        | Keys to filter                              |
| `filterKeysStrategy` | `"pick" \| "omit" \| ((key: string) => boolean)`            | `"omit"`      | See below                                   |
| `save`               | `boolean`                                                   | `true`        | `false` adds store to save denylist         |
| `sync`               | `boolean`                                                   | `true`        | `false` adds store to sync denylist         |
| `syncStrategy`       | `"immediate" \| "debounce" \| "throttle" \| number \| null` | `"immediate"` | Controls JS→Rust state sync frequency       |
| `syncInterval`       | `number` (ms)                                               | `0`           | Interval for syncStrategy debounce/throttle |
| `hooks`              | `{ beforeBackendSync?, beforeFrontendSync?, error? }`       | `{}`          | Lifecycle hooks                             |

### `filterKeysStrategy` semantics

- `"pick"`: Only the keys listed in `filterKeys` are synced/saved.
- `"omit"` (default): All keys are synced/saved **except** those in `filterKeys`. Use this to exclude action functions.
- `(key: string) => boolean`: Custom predicate. `filterKeys` is ignored when a function is provided.

```typescript
// Exclude all function-valued keys without naming them explicitly
filterKeysStrategy: (key) => typeof useStore.getState()[key as keyof WorkspaceStore] !== "function",
```

Note: Filtering is **shallow** — only top-level keys. This is fine for the standard pattern of top-level action functions.

### `hooks` reference

```typescript
hooks: {
  // Runs before the store sends its state to Rust.
  // Returning null/undefined aborts the sync operation for that cycle.
  beforeBackendSync: (state: S) => Partial<S> | null | undefined,

  // Runs before the store applies state received from Rust.
  // Use this for deserialization / validation of loaded data.
  // Returning null/undefined aborts applying the update.
  beforeFrontendSync: (state: S) => Partial<S> | null | undefined,

  // Custom error handler. Defaults to console.error.
  error: (error: unknown) => void | Promise<void>,
}
```

---

## `start()` Lifecycle — What It Does Exactly

**Source-verified** from the compiled `BaseStore.start()` in `@tauri-store/shared`:

```
start() {
  1. Guards: if already enabled, returns immediately (idempotent)
  2. Sets enabled = true
  3. Calls this.load()        → invokes Rust `plugin:zustand|load` command
                               → Rust loads JSON file from disk and returns state
                               → JS calls store.setState(loadedState, false)
  4. Calls this.setOptions()  → sends saveOnChange/saveOnExit/saveStrategy to Rust
  5. Calls this.listen()      → subscribes to `tauri-store://state-change` events
                               → handles cross-window state patches from Rust
  6. Calls this.listenOptions() → subscribes to `tauri-store://config-change` events
  7. Sets up this.watch()     → subscribes to Zustand store; pushes state to Rust on change
}
```

**Key facts:**

- `await` is required — `load()` is a Tauri IPC call.
- The store starts with JS default values and becomes hydrated when `start()` resolves.
- There is no built-in `hydrated` boolean. Use the bootstrap pattern (await before `createRoot`) or a manual flag.
- `autoStart: true` calls `start()` automatically during `createTauriStore`, but is not awaitable from outside. Prefer explicit `await tauriHandler.start()`.
- Calling `start()` on an already-started store is a no-op (guarded at top).

---

## Zustand v5 Compatibility

Full compatibility. The package has `zustand: "^5.0.8"` as a direct dependency (not a peer dep). `createTauriStore` accepts any `StoreApi<S>`, which is what `create()` returns in v5. The `useShallow` hook is not affected by the Tauri layer — Tauri only touches `setState` and `subscribe` on the raw store API.

**No v4→v5 compatibility concerns** with `@tauri-store/zustand` specifically — the package was written for v5 from the start.

---

## Replacing `partialize` — Use `filterKeys`

```typescript
// persist middleware equivalent:
// partialize: (s) => ({ workspaces: s.workspaces, activeWorkspaceId: s.activeWorkspaceId })

// @tauri-store/zustand equivalent:
createTauriStore("store-id", useStore, {
  filterKeys: ["addWorkspace", "removeWorkspace", "setActiveWorkspace"],
  filterKeysStrategy: "omit",
});
```

---

## `beforeFrontendSync` — Validation on Hydration

There is no `merge` option (unlike Zustand `persist` middleware). Hydration does a `setState(state, false)` (shallow merge). For a **flat `NodeMap`**, this is safe — the entire map is a single top-level key replaced wholesale from JSON, and each node is a plain flat object with no circular references or class instances.

**With the flat NodeMap (the chosen data model), `beforeFrontendSync` is not needed for deserialization.** JSON round-trips `NodeMap` correctly because:

- `PanelLeaf` is `{ type, id, parentId, pluginId }` — all primitives
- `PanelSplit` is `{ type, id, parentId, direction, sizes, childIds }` — all primitives; `childIds` is `[NodeId, NodeId]` (NOT recursive `children`)

If you want runtime validation or sanitization of loaded data (e.g. to handle corrupted state files), use `beforeFrontendSync`:

```typescript
function deserializePanelNode(raw: unknown): PanelNode {
  if (typeof raw !== "object" || raw === null) throw new Error("Invalid node");
  const node = raw as Record<string, unknown>;
  if (node.type === "leaf") {
    return {
      type: "leaf",
      id: node.id as string,
      parentId: (node.parentId as string | null) ?? null,
      pluginId: (node.pluginId as string | null) ?? null,
    };
  }
  if (node.type === "split") {
    return {
      type: "split",
      id: node.id as string,
      parentId: (node.parentId as string | null) ?? null,
      direction: node.direction as "horizontal" | "vertical",
      sizes: node.sizes as [number, number],
      childIds: node.childIds as [NodeId, NodeId], // flat NodeMap — NOT recursive children
    };
  }
  throw new Error(`Unknown node type: ${node.type}`);
}

const hooks = {
  beforeFrontendSync: (state: Partial<WorkspaceStore>) => ({
    ...state,
    workspaces:
      state.workspaces?.map((ws) => ({
        ...ws,
        nodes: ws.nodes
          ? Object.fromEntries(
              Object.entries(ws.nodes).map(([id, node]) => [
                id,
                deserializePanelNode(node),
              ]),
            )
          : {},
      })) ?? [],
  }),
};
```

> **Note:** The `children: [PanelNode, PanelNode]` recursive structure was considered and rejected in favour of `childIds: [NodeId, NodeId]` + a flat `NodeMap`. See `research/flat-map-vs-recursive-tree.md`.

---

## Dev vs Prod File Paths

**Stable across both** — path resolved by Rust `PathResolver` (app data dir), not browser origin. No localhost port instability. No `tauri://localhost` vs `http://localhost:1420` mismatch.

Dev builds get `.dev.json` suffix by default (`workspace-store.dev.json` vs `workspace-store.json`). Dev and prod state are **intentionally separate files**. Disable with:

```rust
tauri_plugin_zustand::Builder::new()
    .enable_debug_stores(false)
    .build()
```

---

## Additional Commands (available at module level)

```typescript
import {
  save,
  saveAll,
  saveNow,
  saveAllNow,
  setAutosave,
  setSaveStrategy,
  setStoreOptions,
  getStorePath,
  getStoreState,
  getStoreIds,
  allowSave,
  denySave,
  allowSync,
  denySync,
} from "@tauri-store/zustand";

// Save specific stores immediately (bypass debounce)
await saveNow("workspace-store");

// Change strategy at runtime
await setSaveStrategy("workspace-store", "debounce", 1000);

// Get where the store file lives
const path = await getStorePath("workspace-store");
```

---

## Fallback: Official `@tauri-apps/plugin-store`

If `@tauri-store/zustand` has issues (third-party maintenance risk), use the official first-party `tauri-plugin-store`. Lower-level KV API — you write serialization, debouncing, and hydration manually. Not recommended unless there is a specific issue with the primary option.

---

## Sources

- [@tauri-store/zustand on npm](https://www.npmjs.com/package/@tauri-store/zustand)
- [ferreira-tb/tauri-store GitHub](https://github.com/ferreira-tb/tauri-store)
- [tauri-plugin-zustand on crates.io](https://crates.io/crates/tauri-plugin-zustand)
- [Getting Started docs](https://tb.dev.br/tauri-store/plugin-zustand/guide/getting-started)
- [SaveStrategy Rust docs](https://docs.rs/tauri-plugin-zustand/latest/tauri_plugin_zustand/enum.SaveStrategy.html)
- Source inspection: `@tauri-store/shared@0.10.3` dist/types/store.d.ts, dist/store.d.ts, dist/index.js
