# `@tauri-store/zustand` — Setup & Zustand v5 Compatibility

**Researched:** 2026-02-23
**Package:** `@tauri-store/zustand` v1.2.0 (published 2026-02-22)
**Scope:** File-backed Zustand persistence for Tauri 2, replacing localStorage

---

## Package Status

| Field        | Detail                                                          |
| ------------ | --------------------------------------------------------------- |
| npm version  | `1.2.0`                                                         |
| Published    | 2026-02-22 (actively maintained — 14 releases since March 2025) |
| Crates.io    | `tauri-plugin-zustand = "1.2.0"`                                |
| Tauri compat | Tauri **2.0+** required                                         |
| Zustand dep  | `zustand: "^5.0.8"` — v5 explicit, hard dependency              |
| Author       | `ferreira-tb` (Andrew Ferreira) — **not official Tauri**        |
| License      | MIT                                                             |

**Verdict:** Actively maintained, Zustand v5 native, published yesterday. Correct choice.

---

## Exact Setup

### 1. Cargo (`src-tauri/Cargo.toml`)

```toml
[dependencies]
tauri-plugin-zustand = "1"
```

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

### 3. Tauri capabilities (`src-tauri/capabilities/zustand.json`)

```json
{
  "identifier": "zustand",
  "windows": ["*"],
  "permissions": ["zustand:default", "core:event:default"]
}
```

### 4. npm

```bash
npm install @tauri-store/zustand
```

### 5. Store definition

```typescript
import { create } from "zustand";
import { createTauriStore } from "@tauri-store/zustand";

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],
  activeWorkspaceId: "",
  savedConfigs: [],
  // ...actions
}));

export const tauriHandler = createTauriStore(
  "workspace-store",
  useWorkspaceStore,
  {
    filterKeys: [
      "addWorkspace",
      "closeWorkspace",
      "setActiveWorkspace" /* all action keys */,
    ],
    filterKeysStrategy: "omit",
    saveOnChange: true,
    saveStrategy: "debounce",
    saveInterval: 500,
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
  ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
}
bootstrap();
```

---

## Zustand v5 Compatibility

Full compatibility. The package uses Zustand v5 named imports (`import { create } from 'zustand'`) natively. `createTauriStore` accepts any `StoreApi<S>` (what `create()` returns in v5). The `useShallow` hook is unaffected — Tauri layer only touches `setState` and `subscribe`.

---

## Replacing `partialize` — Use `filterKeys`

```typescript
createTauriStore("store-id", useStore, {
  filterKeys: ["actionOne", "actionTwo"],
  filterKeysStrategy: "omit", // omit these from sync and disk
});
```

Also accepts a callback:

```typescript
filterKeysStrategy: (key) => typeof useStore.getState()[key] !== 'function',
```

Note: **shallow only** — top-level keys only. This matches the standard Zustand pattern of top-level action functions.

---

## Custom Merge for Nested Trees — Use `beforeFrontendSync`

There is no `merge` option (unlike Zustand persist middleware). However, hydration uses `setState(state, false)` (shallow merge), which is safe for your use case: the entire `PanelNode` tree is a single top-level key, so it is replaced wholesale.

For validation/reconstruction of discriminated unions, use `beforeFrontendSync`:

```typescript
function deserializePanelNode(raw: unknown): PanelNode {
  if (typeof raw !== "object" || raw === null) return DEFAULT_PANEL_TREE;
  const node = raw as Record<string, unknown>;
  if (node.type === "leaf") {
    return {
      type: "leaf",
      id: node.id as string,
      pluginId: (node.pluginId as string) ?? null,
    };
  }
  if (node.type === "split") {
    return {
      type: "split",
      id: node.id as string,
      direction: node.direction as "horizontal" | "vertical",
      sizes: node.sizes as [number, number],
      children: (node.children as unknown[]).map(deserializePanelNode) as [
        PanelNode,
        PanelNode,
      ],
    };
  }
  return DEFAULT_PANEL_TREE;
}

const hooks = {
  beforeFrontendSync: (state: Partial<WorkspaceStore>) => ({
    ...state,
    workspaces:
      state.workspaces?.map((ws) => ({
        ...ws,
        root: ws.root ? deserializePanelNode(ws.root) : null,
      })) ?? [],
  }),
  beforeBackendSync: (state: WorkspaceStore) => {
    const {
      addWorkspace,
      closeWorkspace,
      /* ...all actions */ ...persistable
    } = state;
    return persistable;
  },
};
```

---

## Async Hydration

Store starts with JS default values and is functional immediately. Hydration completes when `await tauriHandler.start()` resolves. **No built-in hydrated flag** — use the bootstrap pattern above to await before mounting, or manage a `hydrated` boolean manually if needed post-mount.

`autoStart: true` fires automatically but is not awaitable from outside — prefer explicit `await tauriHandler.start()` for sequencing.

---

## Dev vs Prod File Paths

**Stable across both** — path resolved by Rust `PathResolver` (app data dir), not browser origin. No localhost port instability. No `tauri://localhost` vs `http://localhost:1420` mismatch.

Dev builds get `.dev.json` suffix by default (`panel-store.dev.json` vs `panel-store.json`) — dev and prod state are separate files, intentionally. Disable with:

```rust
tauri_plugin_zustand::Builder::new()
    .enable_debug_stores(false)
    .build()
```

---

## Fallback: Official `@tauri-apps/plugin-store`

If `@tauri-store/zustand` has issues (third-party maintenance risk), use the official first-party `tauri-plugin-store`. Lower-level KV API — you write serialization, debouncing, and hydration manually. Not recommended unless there's a specific issue with the primary option.

---

## Sources

- [@tauri-store/zustand on npm](https://www.npmjs.com/package/@tauri-store/zustand)
- [ferreira-tb/tauri-store GitHub](https://github.com/ferreira-tb/tauri-store)
- [tauri-plugin-zustand on crates.io](https://crates.io/crates/tauri-plugin-zustand)
- [Getting Started docs](https://tb.dev.br/tauri-store/plugin-zustand/guide/getting-started)
- [Lifecycle hooks docs](https://tb.dev.br/tauri-store/plugin-zustand/guide/lifecycle-hooks)
