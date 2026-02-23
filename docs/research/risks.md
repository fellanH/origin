# origin — Pre-Build Risk Register

Captured before scaffold begins. Review before each implementation phase.

---

## R1 — `@tauri-store/zustand` reliability (HIGH)

**What:** The entire persistence layer depends on a single third-party library (`@tauri-store/zustand` npm + `tauri-plugin-zustand` Rust crate) from `tb.dev.br/tauri-store`. It was chosen over `localStorage` because Tauri's dev (`http://localhost:1420`) and prod (`tauri://localhost`) origins differ, causing localStorage data to silently vanish across builds.

**Why it worries me:** The library is relatively obscure. If the Rust crate lags behind Tauri's release cadence, or if the API diverges from what the spec assumes, persistence breaks with no fallback. This is not a nice-to-have — saved configs, workspace state, and tab layouts all go through this layer.

**Mitigation:** Spike this first, standalone, before building any other feature. Confirm:

- `tauri-plugin-zustand` installs cleanly against the Tauri version in use
- `createStore` API matches the spec's usage (no undocumented breaking changes)
- State round-trips correctly: write → app restart → read
- Nested tree state (a `PanelSplit` with children) survives hydration without corruption

If the spike fails, fall back to a custom Tauri `store` plugin (read/write JSON via `tauri-plugin-fs`) wrapped in a thin Zustand middleware. SQLite (the v2 plan) should be evaluated sooner if `@tauri-store/zustand` is unmaintained.

---

## R2 — Plugin system v1 undermines the extensibility value proposition (MEDIUM)

**What:** The spec describes origin as a platform "designed to be extensible for other developers," but v1 plugins are bundled at build time via Vite's static dynamic import. Adding a plugin requires editing `origin.plugins.json` and rebuilding the app.

**Why it worries me:** A developer who reads "plugin API" and then discovers they can't add a plugin without a full rebuild will disengage. The v1 constraint is reasonable for getting to a working shell — but it conflicts with the framing. The v2 runtime loading architecture (axum server + import maps + `plugin://` URI scheme) is researched and documented but explicitly deferred.

**Mitigation:** Two options:

1. **Reframe v1 clearly** — rename the system to "bundled modules" or "built-in plugins" in all user-facing surfaces and the README. Save "plugin system" language for v2 when runtime install works.
2. **Accelerate v2 loading** — if the extensibility story is load-bearing for personal use, pull forward the `plugin://` URI scheme spike earlier than planned.

Neither is blocking for MVP, but the framing should be resolved before any public-facing copy is written.

---

## R3 — Coordinated complexity on the first scaffold (HIGH)

**What:** The initial working commit must simultaneously integrate:

- Tauri 2 + frameless window + macOS `titleBarStyle: overlay`
- Tailwind CSS v4 (breaking changes from v3)
- shadcn/ui (generates v3 `react-resizable-panels` code that must be manually patched)
- `react-resizable-panels` v4 (renamed API: `Group`, `Separator`, `orientation`, `onLayoutChanged`)
- Zustand v5 (`useShallow` for derived selectors, `immer` middleware, custom `merge` for nested hydration, `partialize` to exclude actions)
- `@tauri-store/zustand` (see R1)

**Why it worries me:** Each layer has known footguns. Getting all of them right at the same time, before any working UI exists to test against, is a high surface area for subtle bugs. A misread of the Zustand v5 hydration `merge` function, for example, produces corruption that is invisible until a restart — hard to trace without knowing where to look.

**Mitigation:** Build in strict layers, validating each before adding the next:

1. Tauri scaffold + frameless window — confirm traffic lights and drag region work
2. Add Tailwind v4 + shadcn/ui — confirm theme renders
3. Add `@tauri-store/zustand` — confirm round-trip persistence (see R1 spike)
4. Add Zustand store with a trivial state shape — confirm hydration is clean
5. Introduce the `PanelNode` tree into the store — test split/close/resize mutations
6. Add `react-resizable-panels` — confirm v4 API, patch shadcn's `resizable.tsx`

Do not compress these steps. The issues created in GitHub (13 issues, milestone MVP v1) roughly follow this order — respect it.

---

## R4 — `Panel` name collision (LOW)

**What:** `react-resizable-panels` v4 exports a component named `Panel`. The project also defines a local component `Panel.tsx` (the leaf panel renderer). Every file that needs both will require an import alias.

**Why it worries me:** It's a small but persistent source of confusion and copy-paste errors across `PanelBranch.tsx` and any future panel-related components.

**Mitigation:** Alias the library import at the point of use:

```tsx
import {
  Group,
  Panel as ResizablePanel,
  Separator,
} from "react-resizable-panels";
import Panel from "./Panel";
```

Or rename the local component to `PanelLeaf.tsx` / `LeafPanel.tsx` to avoid the collision entirely. Decide before writing `PanelBranch.tsx` and document the convention.

---

## Summary

| ID  | Risk                                         | Severity | Blocking?                               |
| --- | -------------------------------------------- | -------- | --------------------------------------- |
| R1  | `@tauri-store/zustand` untested              | High     | Yes — spike before building             |
| R2  | Plugin extensibility framing mismatch        | Medium   | No — but resolve before public copy     |
| R3  | Too many unknown layers combined at scaffold | High     | Mitigated by strict layered build order |
| R4  | `Panel` name collision                       | Low      | No — resolve before writing PanelBranch |
