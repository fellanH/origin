# SOP Index — origin

Navigation hub: which SOP to use at each workflow stage.

## Workflow Stages

| Stage                                    | SOP                                                |
| ---------------------------------------- | -------------------------------------------------- |
| Before picking up an issue               | `issue-lifecycle.md` (definition of ready)         |
| Before writing code                      | `pre-code.md`                                      |
| During development — branching & commits | `git-workflow.md`                                  |
| During development — writing tests       | `testing.md`                                       |
| Finishing an issue                       | `complete-work.md`, `git-workflow.md` (PR section) |
| Adding a plugin                          | `add-plugin.md`                                    |
| Adding a Tauri command                   | `add-tauri-command.md`                             |
| Shipping a release                       | `release.md`                                       |

## Quick Reference

```
Pick up issue → issue-lifecycle.md
    ↓
Before coding → pre-code.md
    ↓
Branch & code → git-workflow.md
    ↓
Write tests   → testing.md (required for store/plugin changes)
    ↓
Finish issue  → complete-work.md + git-workflow.md (PR)
    ↓
Release       → release.md
```

## File Map

| File                   | What it covers                                           |
| ---------------------- | -------------------------------------------------------- |
| `index.md`             | This file — navigation                                   |
| `issue-lifecycle.md`   | Definition of ready, states, sprint rhythm               |
| `pre-code.md`          | Checklist before writing any component, hook, or command |
| `git-workflow.md`      | Branches, commits, PR workflow, merge strategy           |
| `testing.md`           | What to test, Vitest setup, test naming, gate rules      |
| `complete-work.md`     | Task completion + MCP loop                               |
| `add-plugin.md`        | 4-step plugin workflow                                   |
| `add-tauri-command.md` | 4-step Tauri command workflow                            |
| `release.md`           | Versioning, build, distribution, GitHub release          |

## Security

| File                                                                       | What it covers                                                          |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| [`../security/webview-guardrails.md`](../security/webview-guardrails.md)   | L1 plugin iframe hardening: allow/deny rules, threat model, assertions  |
