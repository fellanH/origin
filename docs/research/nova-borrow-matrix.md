# Nova Architecture Borrow Matrix

**Created:** 2026-03-01
**Source:** Reverse-engineering observations from Nova 1.11.1 (Electron-based desktop app)
**Purpose:** Actionable adopt / adapt / avoid decisions for Origin's roadmap

---

## How to Read This Document

Each row captures one architectural observation from the Nova audit and maps it
to an Origin decision. The **Verdict** column is one of:

| Verdict   | Meaning                                                                 |
| --------- | ----------------------------------------------------------------------- |
| **Adopt** | Take the idea directly — it maps cleanly to Origin's architecture       |
| **Adapt** | The insight is valuable but needs reworking for Tauri / our constraints  |
| **Avoid** | Anti-pattern or security risk — explicitly do the opposite              |

The **Issue** column links to the implementation issue. `—` means deferred or
not yet scoped.

---

## Borrow Matrix

### Security & Trust Boundary

| # | Observation (Nova) | Verdict | Origin Decision | Rationale | Issue |
|---|---|---|---|---|---|
| S1 | Electron runtime configured with `nodeIntegration: true`, `contextIsolation: false`, `sandbox: false`, `webSecurity: false`, `webviewTag: true` | **Avoid** | Codify explicit deny list for plugin runtime. Tauri's capability system enforces least-privilege by default — never weaken it. | These Electron flags disable every meaningful isolation boundary. A single XSS in any plugin would grant full filesystem and network access. Origin must fail closed: no plugin gets capabilities it did not request. | [#177](https://github.com/fellanH/origin/issues/177) |
| S2 | Response-header rewriting weakens CSP and frame-ancestors in production | **Avoid** | Keep strict CSP in `tauri.conf.json`. Never inject CSP-weakening middleware. | Weakening CSP to allow `unsafe-inline`/`unsafe-eval` or removing `frame-ancestors` opens the door to clickjacking and script injection. Origin's CSP is set once in config and validated in CI. | [#177](https://github.com/fellanH/origin/issues/177) |
| S3 | Provider credential-like material found in renderer-accessible assets | **Avoid** | Add release-time secret scanning for app bundles and plugin artifacts. Block release on detection. | Secrets shipped in client bundles are extractable by any user. Even if they are test values, the pattern trains bad habits. Origin's release pipeline must scan built artifacts, not just source. | [#178](https://github.com/fellanH/origin/issues/178) |
| S4 | No visible plugin sandboxing — all extensions share the same Electron renderer context | **Adapt** | v1: `ErrorBoundary` isolation per plugin (same webview). v2+: evaluate per-webview-window isolation with scoped capabilities when trust model demands it. | Full process isolation per plugin is architecturally heavy and breaks the single-webview panel model. For trusted/first-party plugins, capability scoping + error boundaries are sufficient. Revisit when untrusted third-party plugins ship. | [#177](https://github.com/fellanH/origin/issues/177) |

### Motion & Visual Polish

| # | Observation (Nova) | Verdict | Origin Decision | Rationale | Issue |
|---|---|---|---|---|---|
| M1 | Consistent, polished transition timing across all UI surfaces (panels, tabs, modals) | **Adopt** | Build a shared motion token system — durations, easings, springs defined once and consumed everywhere. | One-off `transition: 200ms ease` scattered across components leads to inconsistent feel. Shared tokens make the entire app feel intentional. | [#179](https://github.com/fellanH/origin/issues/179) |
| M2 | No reduced-motion support observed | **Adapt** | Respect `prefers-reduced-motion` at OS level. Add in-app `Animation speed` setting (`Snappy` / `Standard` / `Off`). | Accessibility is non-negotiable. Nova ignores it; Origin should not. The in-app toggle gives power users control beyond the OS setting. | [#179](https://github.com/fellanH/origin/issues/179) |
| M3 | Smooth spatial transitions between view modes (e.g., list → detail, collapsed → expanded) | **Adapt** | Choreograph tiled ↔ canvas mode transitions. Focused card must not teleport; keyboard focus must survive the toggle. | Nova's transitions feel spatial rather than like hard cuts. Origin's dual layout mode (tiled + freeform canvas per #190) needs the same continuity, but the implementation differs — DOM transform animation vs. Electron's renderer. | [#180](https://github.com/fellanH/origin/issues/180) |

### Update & Distribution

| # | Observation (Nova) | Verdict | Origin Decision | Rationale | Issue |
|---|---|---|---|---|---|
| U1 | Auto-update mechanism with no visible channel selection or rollback | **Adapt** | Staged channels (`stable` / `beta` / `nightly`) with clear risk messaging. Keep one prior version for one-click rollback. | Silent forced updates erode trust. Staged rollout (canary → beta → stable) catches regressions before they hit all users. Rollback without filesystem surgery is table stakes. | [#181](https://github.com/fellanH/origin/issues/181) |
| U2 | Post-update changelog not surfaced in-app | **Adopt** | Show post-update changelog on first launch after update. Include failure recovery guidance. | Users deserve to know what changed. A visible changelog also builds confidence in the update mechanism — especially after a channel switch. | [#181](https://github.com/fellanH/origin/issues/181) |

### Data Safety & Persistence

| # | Observation (Nova) | Verdict | Origin Decision | Rationale | Issue |
|---|---|---|---|---|---|
| D1 | Local export/import and save-before-exit flows are prominent UX features | **Adopt** | Add preflight validation for backup imports (schema, version, required keys). Auto-backup before applying import. Conflict/impact preview before final apply. | Import is a data mutation path — it must be safe. Validating before applying, snapshotting before overwriting, and previewing impact are all low-cost high-trust patterns. | [#182](https://github.com/fellanH/origin/issues/182) |
| D2 | No visible versioned migration for older backup formats | **Adapt** | Add versioned migrations so older backups can be imported into newer app versions without data loss. | Without migrations, backup files become write-only after an update. Origin should tag backups with a schema version and migrate forward automatically. | [#182](https://github.com/fellanH/origin/issues/182) |
| D3 | Save-on-quit occasionally hangs with no timeout or fallback | **Adapt** | Add save-on-quit timeout with fallback. Log telemetry for quit-time hangs so they can be diagnosed. | A hung quit path forces users to force-kill the app, risking data loss — the opposite of what save-on-quit is meant to prevent. A timeout + fallback write makes the failure mode graceful. | [#182](https://github.com/fellanH/origin/issues/182) |

---

## Anti-Pattern Summary

These are patterns observed in Nova that Origin must **never** adopt:

| Anti-Pattern | Why It's Dangerous | Origin Guardrail |
|---|---|---|
| Disabled context isolation / sandbox in Electron | Any XSS escalates to full system access | Tauri capability system — plugins declare required permissions; shell enforces least-privilege |
| CSP weakening via response-header rewriting | Opens clickjacking, script injection | CSP locked in `tauri.conf.json` `app.security.csp`; validated by CI |
| Secrets in renderer-accessible bundles | Extractable by any user with DevTools or a hex editor | Release pipeline secret scanning on source + built artifacts ([#178](https://github.com/fellanH/origin/issues/178)) |
| Shared renderer context with no plugin isolation | One plugin crash or exploit affects all plugins | `ErrorBoundary` per plugin (v1); scoped capabilities per webview (v2+) |
| No reduced-motion support | Accessibility violation; excludes vestibular-sensitive users | `prefers-reduced-motion` respected + in-app animation speed setting |
| Silent forced updates with no rollback | Users lose trust; regressions have no escape hatch | Staged channels + one-click rollback ([#181](https://github.com/fellanH/origin/issues/181)) |

---

## Implementation Status

| Issue | Title | Status |
|---|---|---|
| [#177](https://github.com/fellanH/origin/issues/177) | Security guardrails for plugin runtime/webview boundaries | Open |
| [#178](https://github.com/fellanH/origin/issues/178) | Secret scanning gates for releases and plugin artifacts | Open |
| [#179](https://github.com/fellanH/origin/issues/179) | Shared motion tokens + reduced-motion support | Open |
| [#180](https://github.com/fellanH/origin/issues/180) | Tiled/canvas transition choreography | Open |
| [#181](https://github.com/fellanH/origin/issues/181) | Staged update channels + rollback | Open |
| [#182](https://github.com/fellanH/origin/issues/182) | Backup/import safety improvements | Open |

---

## References

- Nova 1.11.1 audit observations (internal)
- [`research/roadmap-research.md`](roadmap-research.md) — plugin loading, sync, auto-update architecture
- [`research/risks.md`](risks.md) — pre-build risk register
- [`research/native-app-embedding-macos.md`](native-app-embedding-macos.md) — macOS embedding feasibility
- [`research/canvas-view-evaluation.md`](canvas-view-evaluation.md) — canvas view mode evaluation
- [`SPEC.md`](../SPEC.md) — product spec (authoritative)
