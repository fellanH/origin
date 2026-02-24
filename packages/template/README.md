# @origin/template — DEPRECATED

> **This package is deprecated.** Use [`origin-plugin-starter`](https://github.com/fellanH/origin-plugin-starter) instead.
>
> `origin-plugin-starter` is the canonical starting point for new plugin authors. It includes a full build setup, TypeScript config, L1 sandbox support via `@origin/sdk`, and live-reload dev tooling.
>
> This in-tree template will be removed in the next major version.

---

## What's here

`packages/template/` is a minimal in-tree **L0 plugin skeleton** kept for reference. L0 plugins are first-party bundled plugins that run inside the main app process (no isolation). External plugin authors should use the starter repo, which produces a standalone L1 (sandboxed iframe) plugin.

|          | `packages/template/`                     | `origin-plugin-starter`                 |
| -------- | ---------------------------------------- | --------------------------------------- |
| Tier     | L0 (bundled, in-tree)                    | L1 (sandboxed iframe)                   |
| Status   | **Deprecated**                           | Active                                  |
| Use when | Adding a first-party plugin to this repo | Building a community/marketplace plugin |

## For first-party (L0) plugins in this repo

See `docs/SOP/add-plugin.md` for the full walkthrough. L0 plugins must be registered in `src/plugins/registry.ts` and bundled at build time.
