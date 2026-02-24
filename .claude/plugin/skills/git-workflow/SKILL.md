---
description: Apply the git workflow for the origin project — branch naming, commit convention, PR draft/squash-merge strategy, and issue closing.
---

# Git Workflow SOP — origin

## Branch Naming

| Type           | Pattern             | Example                     |
| -------------- | ------------------- | --------------------------- |
| New feature    | `feat/N-short-desc` | `feat/3-workspace-store`    |
| Bug fix        | `fix/N-short-desc`  | `fix/7-panel-key-collision` |
| Tooling/config | `chore/short-desc`  | `chore/vite-aliases`        |

- `N` = GitHub issue number
- One branch per issue
- Branch from `main`, merge back to `main`

**When NOT to branch:** Tiny doc-only changes can commit directly to `main` with a `docs:` prefix.

## Commit Convention

Commit _format_ is defined in `docs/STANDARDS.md` — refer there, not here.

Additional rules:

- Keep commits small and logical — one concern per commit
- Reference the closing issue in the commit _body_: `Closes #N`
- Scope examples: `feat(store):`, `fix(panel):`, `chore(vite):`, `docs(sop):`

Example commit:

```
feat(store): add splitPanel action

Closes #3
```

## PR Workflow (solo project)

1. Open a **draft PR** when the branch has its first commit — provides a diff view throughout
2. Self-review the diff before marking ready
3. **Squash merge** — keeps `main` history one commit per issue
4. Delete the branch after merge

The PR title becomes the squash commit message — must follow conventional commit format (see `docs/STANDARDS.md`).

## Merge Strategy

**Squash merge only.** One clean commit on `main` per issue.

Never rebase-merge or create merge commits on `main`.

## Closing Issues

`Closes #N` in the squash commit body (or PR description) automatically closes the linked issue when merged to `main`.

## Dependency Order

Respect the issue dependency graph. See `docs/SOP/issue-lifecycle.md` for sprint order and the PoC milestone sequence.
