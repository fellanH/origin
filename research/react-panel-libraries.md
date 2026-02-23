# React Panel / Tiling Layout Libraries — February 2026

**Researched:** 2026-02-23

---

## TL;DR Recommendation

Use **`react-resizable-panels` v4** for the resize/drag affordance. Keep your Zustand binary tree store for layout topology. Do not replace the binary tree model with a library — no library provides runtime split/close APIs.

---

## Library Comparison

### `react-resizable-panels` (bvaughn) ✅ Recommended

- **Version:** 4.6.5 (2026-02-21 — updated 2 days before this research)
- **Maintained:** Actively. Multiple releases per month.
- **React 19:** Explicit peer dep `"react": "^18.0.0 || ^19.0.0"`
- **shadcn/ui dependency:** `Resizable` component wraps this library

**v4 breaking changes from v2/v3:**

- Flexible sizing units: px, %, rem/em (not just %)
- shadcn/ui `Resizable` broke on v4 upgrade — check shadcn compatibility

**What it provides:**

- Horizontal and vertical `Group` orientations
- Nested `Group` inside `Panel` — this is how recursive splits are done
- Keyboard resize built-in via ARIA `separator` role
- Collapse/expand via panel ref: `collapse()`, `expand()`, `resize()`, `getSize()`
- Layout persistence: `defaultLayout` prop (pass from Zustand)
- `hitAreaMargins` for intersecting handle resize at nested corners

**What it does NOT provide:**

- `splitPanel()` / `addPanel()` / `closePanel()` APIs
- A tree data model
- Any layout topology management

**Verdict:** Handles pixels, drag, and keyboard. You own the tree. Zustand tree store + this library = the correct combination.

---

### `allotment` (johnwalley)

- **Version:** 1.20.5 (2025-12-19)
- **React 19:** Explicit peer dep
- **Origin:** Direct port of VS Code's split view implementation
- **Assessment:** Reasonable, but slower maintenance cadence than `react-resizable-panels`. Same limitation — no runtime split/close API. Use `react-resizable-panels` unless you specifically need the VS Code visual aesthetic without customization.

---

### `react-mosaic` (nomcopter) ⚠️ Stale

- **Version:** 6.1.1 (2024-12-20 — over 14 months ago)
- **Assessment:** Architecturally ideal — uses a binary tree (`MosaicNode<T>`) as its explicit core data model, with programmatic `MosaicRootActions` (`expand()`, `remove()`, `replaceWith()`, `updateTree()`). This is exactly the model in the spec. BUT: functionally abandoned. No releases since Dec 2024, stagnant issues. **Do not use for new projects.**

---

### `golden-layout`

- **Status:** Active, but the maintainers explicitly recommend **FlexLayout for React projects**
- **Assessment:** Full docking layout with tabsets, floating windows, drag-and-drop between panels. Bloomberg terminal level complexity. Wrong abstraction for a binary split tree.

---

### `FlexLayout` (caplin)

- **Version:** 0.8.18 (2026-01-14)
- **React 19:** Explicit peer dep
- **Assessment:** Full docking layout manager with tabsets. JSON-serializable model. Can disable tab strips for pure split behavior. Most complete "VS Code editor layout" library. Worth evaluating **only if** you later add per-panel tab strips.

---

## Standard Pattern (VS Code-like layout in React 19, 2025/2026)

The community consensus is a **hybrid approach**:

1. **Zustand binary tree** — manages topology (split/close/order)
2. **`react-resizable-panels`** — handles drag, resize, keyboard, collapse
3. **Recursive React component** — walks the Zustand tree, renders `Group` for splits and `Panel` for leaves

```tsx
// Recursive component
function PanelBranch({ node }: { node: PanelTreeNode }) {
  if (node.type === "leaf") {
    return <Panel id={node.id}>...</Panel>;
  }
  return (
    <PanelGroup direction={node.direction}>
      <Panel defaultSize={node.sizes[0]}>
        <PanelBranch node={node.children[0]} />
      </Panel>
      <Separator />
      <Panel defaultSize={node.sizes[1]}>
        <PanelBranch node={node.children[1]} />
      </Panel>
    </PanelGroup>
  );
}
```

---

## Performance at 5-10 Levels of Nesting

Not a concern in practice:

- 10 levels × 2 children = ~60-100 DOM nodes. Trivially small for React.
- Re-renders are scoped: when a split resizes, only that `Group`'s state changes.
- **Key practices:** `React.memo` on leaf plugin panels, stable UUID `key` props on tree nodes (never array index), `useShallow` on Zustand selectors that derive objects.
- `react-resizable-panels` uses `ResizeObserver` per `Group`. At 10 levels: ~10-20 observers — well within browser limits.

---

## Sources

- https://github.com/bvaughn/react-resizable-panels
- https://react-resizable-panels.vercel.app/
- https://www.npmjs.com/package/react-resizable-panels
- https://ui.shadcn.com/docs/components/radix/resizable
- https://github.com/johnwalley/allotment
- https://github.com/nomcopter/react-mosaic
- https://golden-layout.github.io/golden-layout/version-2/
- https://github.com/caplin/FlexLayout
- https://blog.logrocket.com/essential-tools-implementing-react-panel-layouts/
