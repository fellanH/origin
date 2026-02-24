# Issue Lifecycle SOP — origin

## Definition of Ready

An issue is ready to work on when **all** of the following are true:

- [ ] Has a "Done When" checklist with ≥3 concrete, checkable items
- [ ] All blocker issues are merged (dependency chain respected)
- [ ] No open architectural questions — if unsure, research first and update the issue body
- [ ] Issue body matches `CLAUDE.md` (no stale values — double-check gotchas before coding)

If any of these fail, **do not start**. Update the issue body or resolve blockers first.

## Issue States

| State              | Meaning                                          |
| ------------------ | ------------------------------------------------ |
| `open`, unassigned | Backlog                                          |
| `open`, assigned   | In progress                                      |
| PR open            | In review (self-review for solo project)         |
| `closed`           | Done — triggered by `Closes #N` in squash commit |

**WIP limit:** Max 1 issue actively in progress. Open a 2nd only if the first is genuinely blocked.

## Sprint Rhythm

Work issues in dependency order — respect the graph.

**PoC milestone first** (in order):

1. #14 Spike: `@tauri-store/zustand` persistence round-trip
2. #1 Scaffold: Tauri 2 + React 19 + Vite 7 + Tailwind 4 + shadcn/ui
3. #2 Types: PanelNode, Workspace, Plugin contracts (partial — types needed for store)
4. #3 Store: Zustand v5 workspace store (partial — core slice)
5. #4 EmptyState component
6. #7 Panel components: PanelGrid, PanelBranch, Panel (partial — basic layout)
7. #11 Keyboard shortcuts (partial — split/close/focus)

After PoC: follow "What to Build Next" order in `docs/plans/poc.md`.

**PoC is done when** the "Done When" checklist in `docs/plans/poc.md` is fully checked.

## PoC Milestone

GitHub milestone `PoC` — issues: #1, #2 (partial), #3 (partial), #4, #7 (partial), #11 (partial), #14.

## Issue Creation Standards

For new issues added after the initial 13:

- **Title:** Imperative verb (`Add`, `Fix`, `Implement`, `Spike`) + subject
- **Body:** Overview → Steps → Done When checklist
- **Labels:** At least one from `{foundation, ui, core, state, plugin-system, dx}`
- **Milestone:** `MVP v1` (or the next milestone when v1 is complete)
- **Blockers:** Set as linked issues (GitHub's "is blocked by" relation)
- **Done When:** ≥3 concrete, checkable, observable items

## Checking an Issue Before Starting

1. Read the full issue body
2. Cross-reference any code snippets against `CLAUDE.md` Critical Gotchas
3. Confirm all blocker PRs are merged
4. If architectural questions remain, spike or research before coding (add a spike issue if needed)
