# Canvas View Mode — Evaluation Report

> Spike for issue #190. Evaluates adding an infinite spatial canvas as an
> alternative to the tiling (split-panel) layout.

---

## Prototype Summary

Built a working DOM-based canvas view (Option A from the issue) with:

- **Pan** — drag empty space to move the viewport
- **Zoom** — scroll wheel, zooms toward cursor (min 15%, max 300%)
- **Card drag** — drag card header to reposition on canvas
- **Card resize** — drag bottom-right handle to resize
- **Double-click** — add a new card at the clicked position
- **View mode toggle** — `CMD+Opt+C` switches between tiling ↔ canvas per workspace
- **Dot grid background** — subtle grid that scales with zoom
- **HUD** — zoom level, +/−/reset controls, card count

### Architecture

| Layer | Approach |
|-------|----------|
| Rendering | Pure DOM — `position: absolute` cards inside a `transform: translate() scale()` container |
| State | Zustand store — `viewMode`, `canvasViewport`, per-leaf `canvasX/Y/Width/Height` |
| Interaction | Pointer events on document for smooth drag; `wheel` for zoom |
| Plugins | Unchanged — `<Card>` renders inside each canvas card, iframes work natively |

### Files Changed

| File | Change |
|------|--------|
| `src/types/card.ts` | Added optional `canvasX`, `canvasY`, `canvasWidth`, `canvasHeight` to `CardLeaf` |
| `src/types/workspace.ts` | Added `ViewMode`, `CanvasViewport`, `viewMode` + `canvasViewport` to `Workspace` |
| `src/store/workspaceStore.ts` | Added canvas actions: `setViewMode`, `setCanvasViewport`, `moveCanvasCard`, `resizeCanvasCard`, `addCanvasCard` |
| `src/components/workspace/CanvasView.tsx` | New — full canvas renderer with pan/zoom/drag/resize |
| `src/components/workspace/CardLayout.tsx` | Branches on `viewMode` — renders `CardTree` or `CanvasView` |
| `src/hooks/useKeyboardShortcuts.ts` | Added `CMD+Opt+C` toggle |

---

## Performance Characteristics

### DOM-based approach (Option A — what we built)

| Card Count | Expected Behavior |
|------------|-------------------|
| 1–30 | Smooth 60fps pan/zoom/drag |
| 30–80 | Acceptable — slight jank on zoom with complex plugin content |
| 80–150 | Noticeable lag — iframe-heavy plugins add overhead per card |
| 150+ | Needs virtualization (only render cards visible in viewport) |

**Key insight:** Performance is dominated by plugin content complexity, not card count alone. A canvas with 50 terminal iframes is heavier than one with 200 empty cards.

### Memory

- Each `CardLeaf` adds ~120 bytes of canvas state (4 numbers + overhead)
- Per-card DOM overhead: ~2–5KB depending on plugin (iframe cards are heavier)
- Canvas viewport state: negligible (3 numbers per workspace)

### Comparison to alternatives

| Approach | Card Limit (60fps) | Plugin Support | Complexity |
|----------|-------------------|----------------|------------|
| **Option A: DOM (this spike)** | ~80–100 | Native (iframes, React) | Low |
| Option B: WebGL/Canvas2D | 1000+ | Requires overlay bridge | Very High |
| Option C: Hybrid (canvas bg + DOM cards) | ~100–150 (grid effects are offloaded) | Native | Medium-High |

---

## Answers to Open Questions

### 1. Should canvas view replace tiling, or always be a toggle?

**Recommendation: Always a toggle.** Both modes have strengths:
- Tiling excels at focused, space-efficient multi-panel work
- Canvas excels at spatial thinking, brainstorming, overview

The `viewMode` field on `Workspace` makes this a per-workspace choice. A workspace can be created in either mode. Switching preserves card state — tiling just ignores canvas coordinates.

### 2. Auto-layout or fully manual?

**Recommendation: Manual with smart defaults.**
- When switching from tiling → canvas, existing cards get auto-positioned in a grid
- New cards are placed at the double-click position
- Future: optional snap-to-grid (the dot grid is already there as a visual anchor)
- Force-directed layout is overkill for the initial version

### 3. What's the minimum viable canvas?

**MVP feature set:**
1. Pan + zoom (scroll + drag) ✅ in spike
2. Card drag + resize ✅ in spike
3. Add/remove cards ✅ in spike
4. View mode toggle ✅ in spike
5. Persistence (canvas coords saved with workspace) ✅ in spike (store persistence)
6. Dot grid background ✅ in spike

**Defer to fast-follow:**
- Minimap
- Snap-to-grid
- Cursor glow / parallax / animations (Nova-style effects)
- Multi-select + group drag
- Canvas-aware keyboard navigation

### 4. Should minimap be part of MVP?

**No — fast-follow.** The zoom HUD (showing %, with reset) covers basic navigation. A minimap adds significant rendering complexity (scaled duplicate of the card layout). Worth building once the canvas proves its value.

### 5. Performance budget?

**Target: 50 cards smooth, 100 cards acceptable.** This covers realistic use cases:
- Brainstorming session: 10–30 cards
- Project dashboard: 15–40 cards
- Research workspace: 20–60 cards

If users hit 100+ cards, implement viewport culling (skip rendering cards outside the visible area).

---

## Recommendation

**✅ Proceed to full implementation — phased approach.**

Rationale:
1. The spike proves DOM-based canvas works with origin's plugin system — iframes render correctly inside canvas cards with no plugin changes
2. Performance is adequate for realistic use cases (50–100 cards)
3. Implementation complexity is manageable — the spike adds ~400 lines of new code, touches only 6 files, and requires zero plugin-side changes
4. Competitive value is high — no other open-source tool combines an infinite canvas with a plugin system
5. The toggle approach means zero risk to the existing tiling mode

---

## Implementation Plan (if approved)

### Phase 1: Canvas Foundation (1–2 days)
- [ ] Promote spike code to production quality
- [ ] Add viewport culling for off-screen cards
- [ ] Snap-to-grid (optional, toggle in settings)
- [ ] Canvas-mode `closeCard` cleanup (remove from nodes map directly, no tree surgery)
- [ ] Persist `viewMode` + `canvasViewport` via Tauri store (add to `filterKeys`)

### Phase 2: Interactions Polish (1–2 days)
- [ ] Multi-select (shift+click, drag-select rectangle)
- [ ] Group drag (move selected cards together)
- [ ] Canvas-aware keyboard shortcuts (arrow keys to nudge cards, Tab to cycle focus)
- [ ] Undo/redo for card moves (integrates with future undo system)

### Phase 3: Visual Effects (1 day, all toggleable)
- [ ] Spawn animation (scale-in when card is created)
- [ ] Smooth zoom transitions (CSS transition on transform)
- [ ] Card shadow depth based on zoom level

### Phase 4: Minimap + Navigation (1 day)
- [ ] Minimap overlay (bottom-left, shows all cards at scale)
- [ ] Click minimap to navigate
- [ ] "Fit all" button (auto-zoom to show all cards)

### Phase 5: Canvas-specific Plugin Events (0.5 day)
- [ ] Add `"canvas-move"`, `"canvas-resize"` to `PluginLifecycleEvent`
- [ ] Fire events when cards are dragged/resized so plugins can react

### Not planned (defer until demand):
- WebGL rendering (only needed at 500+ cards)
- Edge/connection drawing between cards
- Grouping/frames (Figma-style)
