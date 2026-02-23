# Empty State UX — Design Decisions

**Issue:** #25
**Date:** 2026-02-23
**Status:** Decided — follow-up issues pending

---

## Current UX Description

### EmptyState (`rootId === null`)

Rendered by `PanelGrid` when no panels exist. Full-window centered layout:

- App name "note" (small, `text-sm font-medium`)
- Two keyboard hints: `⌘D — split horizontally` / `⌘⇧D — split vertically` (`text-xs text-muted-foreground`)

### Launcher (leaf panel, `pluginId === null`)

Rendered inside `LeafPanel` whenever a panel has no plugin assigned. Same centered layout:

- Label "Select a plugin" (`text-xs text-muted-foreground`)
- Plugin buttons (icon + name, `text-sm`, hover: `bg-muted`)

`LeafPanel` wraps every `Launcher` with a hover-visible `×` close button (top-right, `opacity-0 group-hover:opacity-100`) and a focus ring (`ring-primary/40`) when the panel is active.

### State transitions

```
rootId=null → EmptyState
               ↓ ⌘D / ⌘⇧D (addInitialPanel)
leaf(pluginId=null) → Launcher
               ↓ click plugin
leaf(pluginId="…") → PluginHost
               ↓ ⌘D / ⌘⇧D (splitPanel)
split → [existing plugin panel] + [new leaf → Launcher]
               ↓ close last panel (closePanel)
rootId=null → EmptyState (clean return)
```

---

## Decisions

### Q1: Should EmptyState and Launcher share visual language?

**Decision: Yes — the current structure is correct and should be preserved intentionally.**

Both components use `flex flex-col items-center justify-center gap-3`. This is the right design: EmptyState and Launcher represent the same concept ("empty slot") at different hierarchy levels — workspace scope vs panel scope. The centered layout and `text-muted-foreground` hint treatment form a coherent system.

No structural change needed. The visual language is already shared. It just needs to be applied consistently rather than coincidentally (this is a documentation decision, not a code change).

---

### Q2: Should Launcher show keyboard shortcuts or just the plugin list?

**Decision: Add one shortcut hint — `⌘W — close` — below the plugin list.**

Reasoning:

- The Launcher appears after an intentional or accidental split. The most useful keyboard action beyond picking a plugin is "undo" — close this panel.
- The close `×` button in `LeafPanel` is hover-only and not keyboard-discoverable.
- `⌘W` is the close-panel shortcut. Showing it subtly at the bottom of the Launcher (same `text-xs text-muted-foreground` as the EmptyState hints) makes it discoverable without cluttering the plugin list.
- No split hints needed in Launcher — the user already knows CMD+D exists.
- This applies equally when the Launcher fills the full window (first panel) and when it's in a small split slot.

**Becomes follow-up issue.**

---

### Q3: Should an empty LeafPanel in a split show anything beyond just the plugin list?

**Decision: No — plugin list + ⌘W hint (per Q2) is sufficient.**

In a split context, the panel's boundaries (resize separator, focus ring) already communicate that this is a discrete, closeable slot. Adding orientation labels, placeholder text about the split direction, or "drop zone" decoration would add visual noise without actionable information. The plugin list is the primary call to action; everything else is a distraction.

The hover close button in `LeafPanel` handles mouse users. The `⌘W` hint (Q2) handles keyboard users. That's the complete surface.

---

### Q4: Does the EmptyState → Launcher → Plugin flow feel coherent?

**Decision: Mostly coherent, with one concrete gap in the EmptyState copy.**

**Gap identified:** EmptyState shows `⌘D — split horizontally` / `⌘⇧D — split vertically`. These hint labels are wrong for the empty state. From `rootId === null`, those shortcuts call `addInitialPanel` — there is nothing to split. The word "split" implies two panels will be created, but actually one panel is created (with Launcher shown). The correct framing is "open panel" or just "⌘D — open".

**Other flow observations:**

- EmptyState → Launcher is a natural continuation. Both are centered empty-slot UIs; the transition feels intentional.
- Launcher → PluginHost is clean. One click, panel fills.
- Split → new Launcher is logical. The new slot immediately shows the plugin picker.
- Close last panel → EmptyState is clean. `rootId → null` is handled correctly; the return feels calm, not abrupt.

**Becomes follow-up issue (EmptyState copy).**

---

## Follow-up Issues

These should be opened as separate GitHub issues. Do NOT implement them as part of #25.

| #   | Title                                                                           | Labels     | Priority                 |
| --- | ------------------------------------------------------------------------------- | ---------- | ------------------------ |
| A   | Fix EmptyState keyboard hint copy ("split" → "open")                            | `ui`, `dx` | High — misleading today  |
| B   | Add ⌘W close hint to Launcher                                                   | `ui`       | Medium — discoverability |
| C   | EmptyState value proposition — consider adding one-line descriptor below "note" | `ui`       | Low — polish             |

### Issue A spec

**Title:** `fix: EmptyState keyboard hints — "split" → "open panel"`
Change `⌘D — split horizontally` to `⌘D — open panel` (and remove the vertical variant, since `addInitialPanel` creates a single panel regardless of direction). OR: if the intent is that CMD+D and CMD+Shift+D create horizontal/vertical panels from the start, verify the keyboard handler and update the store to match. Either fix the copy or fix the behavior to match the copy.

### Issue B spec

**Title:** `feat: Launcher — add ⌘W close hint`
Add `⌘W — close` hint below the plugin list in `Launcher.tsx`, styled as `text-xs text-muted-foreground`, same as EmptyState hints. Always show it (not conditional on split state) — it's correct even for the first single panel.

### Issue C spec

**Title:** `polish: EmptyState — add brief app descriptor`
Below "note", add a one-line descriptor (e.g. "your modular workspace") in `text-xs text-muted-foreground`. Communicates value to first-time users. Low priority.
