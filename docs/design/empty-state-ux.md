# Empty State UX — Design Decisions

**Issue:** #25
**Date:** 2026-02-23
**Status:** Closed — implemented in same session

---

## Decision: Unified EmptyState component

`EmptyState` and `Launcher` have been merged into a single `EmptyState` component. It always renders the same content regardless of context:

- App name "note" (`text-sm font-medium`)
- Keyboard hints: `⌘D — split horizontally` / `⌘⇧D — split vertically` (`text-xs text-muted-foreground`)
- Plugin list: icon + name buttons (`text-sm`, hover: `bg-muted`)

The component accepts an optional `panelId` prop:

- **Without `panelId`** (workspace level, `rootId === null`): clicking a plugin calls `addInitialPanel(pluginId)` — creates the panel with the plugin already set in one store transaction.
- **With `panelId`** (panel level, `pluginId === null`): clicking a plugin calls `setPlugin(panelId, pluginId)`.

No conditional rendering of content — both contexts show identical UI.

---

## State transitions

```
rootId=null → EmptyState (no panelId)
               ↓ click plugin
leaf(pluginId="…") → PluginHost   [addInitialPanel(pluginId)]

rootId=null → EmptyState (no panelId)
               ↓ ⌘D / ⌘⇧D
leaf(pluginId=null) → EmptyState (with panelId)
               ↓ click plugin
leaf(pluginId="…") → PluginHost   [setPlugin]

split → [existing plugin panel] + [new leaf → EmptyState (with panelId)]
               ↓ close last panel
rootId=null → EmptyState (no panelId)
```

---

## Rationale

Both states represent the same concept: an empty slot waiting for a plugin. Splitting them into two components created visual inconsistency and duplicate layout code. A single component with identical content is simpler to maintain and coherent for the user — the same UI appears whether the workspace is empty or a panel has no plugin assigned.

---

## Superseded decisions from #25 review

The original review (comment on #25) proposed:

- Q1: Shared visual language — **resolved by full merge**
- Q2: Add ⌘W hint to Launcher — **moot; Launcher no longer exists**
- Q3: No extra content in split empty panels — **still holds**
- Q4: EmptyState copy ("split" wording) — **kept as-is; "split" is descriptive and preferred**

Follow-up issues A (fix copy) and B (⌘W hint) are **closed/dropped** by this decision. Issue C (one-line descriptor below "note") remains valid as future polish.
