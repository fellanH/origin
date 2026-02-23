# Corrections Log

Documents content that was removed or corrected from the project's specification and research files. Original text is preserved here for reference.

**Date:** 2026-02-23

---

## 1. SPEC.md — `decorations: false` (critical bug)

**File:** `SPEC.md`
**Section:** Tauri Configuration

**Original text:**

```
Use `"decorations": false` with `"titleBarStyle": "overlay"` (macOS) to get a frameless window
with native traffic lights preserved.
```

**Why it was wrong:** `decorations: false` removes all native window chrome including the traffic lights. For `trafficLightPosition` to work, `decorations` must be `true`. `titleBarStyle: "Overlay"` is what causes the webview to fill the full window height with traffic lights overlaid on top. Setting `false` here would produce a completely chromeless window with no traffic lights. Source: `research/tauri2-frameless-window.md`, Tauri issue #13044.

**Corrected to:**

```
Use `"decorations": true` with `"titleBarStyle": "Overlay"` (macOS) to get a frameless window
with native traffic lights preserved.
```

---

## 2. SPEC.md — Traffic light padding `~72px` (incorrect value)

**File:** `SPEC.md`
**Section:** Tauri Configuration

**Original text:**

```
the tab bar must leave enough left padding (~72px) to clear them.
```

**Why it was wrong:** The correct value is 80px, derived from `trafficLightPosition: { x: 14, y: 22 }` as: 14px offset + (3 × 12px buttons) + (2 × 6px gaps) + 18px breathing room = 80px. VS Code and Zed both use 80px. Source: `research/tauri2-frameless-window.md`.

**Corrected to:** `80px`

---

## 3. SPEC.md — Wrong store API: `createStore` does not exist

**File:** `SPEC.md`
**Section:** Persistence — `@tauri-store/zustand`

**Original code:**

```typescript
import { createStore } from "@tauri-store/zustand";

export const useWorkspaceStore = createStore(
  "workspace",
  immer((set, get) => ({
    ...createWorkspaceSlice(set, get),
    ...createPluginSlice(set, get),
  })),
  {
    saveOnChange: true,
    // partialize to exclude functions is handled by @tauri-store/zustand automatically
  },
);
```

**Why it was wrong:** `createStore` is not exported by `@tauri-store/zustand`. The package exports `createTauriStore`. The correct pattern is two separate calls: `create<T>()()` (standard Zustand, with middleware) produces the store hook, then `createTauriStore(id, store, options)` produces the persistence handler. The comment claiming partialize is automatic is also wrong — you must explicitly provide `filterKeys` + `filterKeysStrategy: "omit"`. Source: `research/tauri-store-zustand.md`.

**Corrected to:** Two-call pattern using `create<WorkspaceStore>()()` + `createTauriStore(...)`. See corrected SPEC.md for full example.

---

## 4. SPEC.md — Middleware order listed `persist` (not applicable)

**File:** `SPEC.md`
**Section:** Persistence — Zustand v5 requirements

**Original bullets:**

```
- Apply middleware in this order: `devtools( persist( immer( ...store ) ) )`
- Use `partialize` to exclude action functions from persistence (they serialize to `{}`)
- Provide a custom `merge` function — default shallow merge silently corrupts nested tree state on hydration
```

**Why it was wrong:** This project uses `@tauri-store/zustand` which replaces the standard `persist` middleware entirely. The correct middleware chain is `devtools( immer( ...store ) )`. The equivalents in `@tauri-store/zustand` are: `filterKeys`/`filterKeysStrategy` (replaces `partialize`) and `beforeFrontendSync` hook (replaces custom `merge`). Source: `research/tauri-store-zustand.md`.

---

## 5. SPEC.md — `Separator` component name (incorrect)

**File:** `SPEC.md`
**Section:** Resize Handles — `react-resizable-panels` v4

**Original text:**

```
containing two `Panel` children separated by a `Separator` handle.
```

**Why it was wrong:** The resize handle component in `react-resizable-panels` is `PanelResizeHandle` — it was not renamed in v4. `separator` is the ARIA role the component receives (`role="separator"`), not the React component name. The code example in the same section already used `PanelResizeHandle` correctly; only the prose was wrong. Source: `react-resizable-panels` v4 API.

---

## 6. `research/zustand.md` — Wrong `@tauri-store/zustand` API

**File:** `research/zustand.md`
**Section:** Zustand + localStorage in Tauri: Do Not Use → Recommended solution

**Original code:**

```typescript
import { createStore } from '@tauri-store/zustand'

export const useStore = createStore(
  'workspace',
  (set) => ({ workspaces: [], ... }),
  { saveOnChange: true }
)
```

**Why it was removed:** Same root issue as SPEC.md correction #3. `createStore` does not exist in the package. This section was removed and replaced with a pointer to `research/tauri-store-zustand.md` which documents the correct API and full setup.

---

## 7. `research/zustand.md` — SQLite migration via `PersistStorage<T>` (inapplicable to this stack)

**File:** `research/zustand.md`
**Section:** Recommended solution → Migration path to SQLite (v2)

**Original content:**

```
**Migration path to SQLite (v2):** Zustand `persist` is storage-agnostic. Implement the
`PersistStorage<T>` interface (`getItem`, `setItem`, `removeItem`) wrapping `tauri-plugin-sql`:

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

Handle async hydration: check `useStore.persist.hasHydrated()` or use `onFinishHydration`
callback before rendering.
```

**Why it was removed:** This migration path assumes the standard Zustand `persist` middleware is active. Since this project uses `@tauri-store/zustand`, the `PersistStorage<T>` adapter pattern is inapplicable — there is no `persist` instance to replace. Migrating to SQLite from `@tauri-store/zustand` would require a different approach (replacing the `createTauriStore` handler). Leaving this in place would direct a future maintainer down the wrong path.

---

## 8. `research/zustand.md` — Alternatives Considered section (superseded)

**File:** `research/zustand.md`
**Section:** Alternatives Considered

**Original content:**

```
| Library            | Verdict                                                                             |
| ------------------ | ----------------------------------------------------------------------------------- |
| **Jotai**          | Worth evaluating if tree nodes update independently and frequently. `atomFamily`    |
|                    | maps naturally to dynamic panel collections. Better fine-grained re-render control.|
|                    | Heavier (3.5KB vs 0.6KB).                                                           |
| **Valtio**         | Proxy-based mutations feel natural for tree edits. TypeScript support weaker for   |
|                    | complex types. Circular references (possible in recursive trees) will crash. Avoid. |
| **TanStack Store** | Maturing but ecosystem too immature (no `persist`/`immer`/`devtools` equivalents   |
|                    | yet). Not ready for production.                                                     |

**Conclusion:** Zustand with slices + immer + `@tauri-store/zustand` is the lowest-complexity,
best-documented path for this project.
```

**Why it was removed:** The decision is made. This section existed to support the selection process. With Zustand selected and confirmed, the comparison table has no implementation value and adds noise. Removed to keep the document focused on actionable patterns.

---

## 9. `research/react-panel-libraries.md` — Incorrect v4 breaking change

**File:** `research/react-panel-libraries.md`
**Section:** react-resizable-panels → v4 breaking changes

**Original line:**

```
- `PanelResizeHandle` renamed to `Separator`
```

**Why it was removed:** This claim is incorrect. `PanelResizeHandle` was not renamed in v4. The component name is unchanged across v2, v3, and v4. `separator` is the ARIA role the component sets internally — it is not the React component name. The code example in this file consequently used `<Separator />`, which was also wrong and corrected to `<PanelResizeHandle />`.

---

## 10. `research/index.md` — Stale spec version reference

**File:** `research/index.md`
**Header**

**Original text:**

```
**Scope:** Validate and improve architecture decisions in SPEC.md v1.1
```

**Why it was wrong:** The spec advanced to v1.2 after the research was incorporated. Minor but reflects stale state.

---

## 11. `research/index.md` — Dead link to non-existent file

**File:** `research/index.md`
**Table row:**

```
| [`react-resizable-panels-zustand.md`](react-resizable-panels-zustand.md) | v4 API changes, Zustand sync
| pattern, keying strategy, `onLayoutChanged`, close panel                  |
```

**Why it was changed:** This file was planned but never written. Its intended content (v4 API, Zustand sync pattern, keying strategy, `onLayout` callback, close panel behaviour) was folded into SPEC.md during the spec refinement process. The live link pointed to a 404. Replaced with a non-linked note indicating where the content lives.
