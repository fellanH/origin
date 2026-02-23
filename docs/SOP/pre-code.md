# SOP: Pre-Code Checklist

Run through this before writing any new component, hook, store slice, or Tauri command.
Takes 2 minutes. Prevents the most common project-specific bugs.

---

## Every time

- [ ] Reread the relevant **Architecture Decision** row in `CLAUDE.md` for the area you're touching
- [ ] Scan **Critical Gotchas** in `CLAUDE.md` — at least the section that applies

---

## By area

### Panel components

- [ ] `react-resizable-panels` v4 exports: use `Group`, `Separator`, `orientation`, `onLayoutChanged` — not the old v3 names
- [ ] `Panel` name collision — alias the library export: `import { Panel as ResizablePanel }` OR name the local component `LeafPanel`
- [ ] `data-tauri-drag-region` on spacer divs only — never on the tab bar container or any interactive element
- [ ] `key={activeWorkspaceId}` on root `PanelGrid` — forces remount on tab switch (do not remove)

### Window / Tauri config

- [ ] `titleBarStyle: "Overlay"` — capital O, case-sensitive
- [ ] `decorations: true` (not false — false removes traffic lights)
- [ ] Tab bar uses `pl-[80px]` — not 72px
- [ ] Do NOT call `window.setTitle()` — resets `trafficLightPosition` (Tauri #13044); use `document.title`
- [ ] Do NOT use `unstable` Cargo feature — breaks `trafficLightPosition` (Tauri #14072)
- [ ] `onCloseRequested` calls `e.preventDefault()` — prevents CMD+W closing the window

### Store / persistence

- [ ] `@tauri-store/zustand` API: `createTauriStore()` — not `createStore`
- [ ] `await tauriHandler.start()` before `ReactDOM.createRoot()` in `main.tsx`
- [ ] `filterKeys` + `filterKeysStrategy: "omit"` to exclude actions — do NOT use `persist` middleware
- [ ] Middleware order is `devtools(immer(...))` — not reversed
- [ ] Zustand v5: `import { create } from 'zustand'` (named), `useShallow` from `zustand/shallow`
- [ ] Object/array selectors wrapped in `useShallow` — bare selectors for primitives only
- [ ] Event handlers use `useStore.getState()` — not reactive selectors (avoids stale closures)

### Tauri commands

- [ ] Command registered in `generate_handler![...]`
- [ ] Async command params are owned types (no `&str`)
- [ ] Returns `Result<T, AppError>`, not a bare value
- [ ] Capabilities file updated if plugin permissions needed
- [ ] Frontend import: `@tauri-apps/api/core` not `@tauri-apps/api/tauri`

### Adding a plugin

- [ ] See `docs/SOP/add-plugin.md` — all 4 steps required

### CSS / Tailwind

- [ ] Tailwind v4 syntax: `@import "tailwindcss"` in index.css (not `@tailwind` directives)
- [ ] `cn()` for conditional class merging — not template literals
- [ ] No inline `style={{}}` for values that can be Tailwind classes

---

## Reference links

- Architecture decisions + gotchas: `CLAUDE.md`
- Frameless window detail: `docs/research/tauri2-frameless-window.md`
- Persistence API: `docs/research/tauri-store-zustand.md`
- Panel library: `docs/research/react-resizable-panels-zustand.md`
- Coding standards (TypeScript, React, Zustand patterns): `docs/STANDARDS.md`
