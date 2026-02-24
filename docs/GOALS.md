# Goals

Origin is free. It will always be free. There is no paid tier, no Pro plan,
no plugin marketplace cut. This is a commitment, not a policy.

## Why

The value of Origin is its plugin ecosystem — the community of developers
who build tools on top of it. Charging for that would undermine the reason
it exists. A thriving plugin library benefits everyone.

## Long-Term Goals

**1. The best plugin shell on the desktop**
The core app — panel layout, keyboard shortcuts, workspace persistence —
should feel indistinguishable from a native tool. Fast, minimal, opinionated
where it matters. Plugins do the work; the shell stays out of the way.

**2. A plugin ecosystem that covers the tools developers actually use**
GitHub, Linear, terminal output, system stats, timers, notes, build status,
database viewers. If a developer checks something more than twice a day, it
should be an Origin plugin. The goal is 50+ quality community plugins.

**3. Exceptional plugin author DX**
Writing a plugin should feel like writing a React component — because it is.
`@origin/api` provides the contract. `packages/template` provides the scaffold.
The SOP gets you from zero to running in under 10 minutes. If that's not
true, it's a bug.

**4. Full platform support**
Origin targets macOS, Windows, and Linux. Tauri 2 supports all three.
Platform-specific UI (window chrome, traffic lights) is handled per-platform.
No user should be excluded because of their OS.

**5. Transparent, community-governed roadmap**
Architectural decisions are documented in `docs/research/`. The roadmap lives
here in public. Significant changes go through issues and discussion before
implementation. Plugin authors won't wake up to a breaking API change without
warning and a migration path.

**6. MIT licensed, forever**
The core, the plugin API (`@origin/api`), the template, and all first-party
plugins are MIT. No contributor license agreement required. You own what you
build.

## Non-Goals

- No SaaS, no cloud sync as a paid feature
- No closed-source components
- No "premium plugins" or marketplace revenue
- No feature bloat — if it belongs in a plugin, it's a plugin

## Roadmap

| Phase | Focus                                                                        |
| ----- | ---------------------------------------------------------------------------- |
| v1    | Shell + plugin API — keyboard-driven split panels, build-time plugin loading |
| v1.5  | Distribution — signed app, platform installers, auto-update                  |
| v2    | Runtime plugin install — no rebuild required to add a plugin                 |
| v2.5  | Community registry — in-app plugin browser, GitHub monorepo for submissions  |
| v3    | Sync — local-first workspace sync across devices                             |
