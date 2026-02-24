# @origin/hello

Reference plugin for Origin — demonstrates the complete plugin API surface with comments.

## Purpose

This plugin is the canonical reference implementation for plugin authors. It is structurally identical to the [origin-plugin-starter](https://github.com/klarhimmel/origin-plugin-starter) template, so you can compare them side by side when building your own plugin.

## What it shows

- **Manifest** — `id`, `name`, `version`, `description`, `icon` fields; how to re-export it from the component file
- **PluginContext** — all three injected values: `cardId`, `workspacePath`, `theme`
- **Theme-responsive rendering** — detecting `context.theme` to adapt the UI
- **Commented code** — every section explains what it does and why

## Using it as a reference

Open `src/index.tsx` alongside the [plugin API types](../api/src/plugin.ts). Every export and context field is labelled with a comment explaining its purpose and typical usage.

## Building your own plugin

Use the starter template repo to get a pre-configured Vite + React build that outputs a runtime-loadable plugin:

```
GitHub → origin-plugin-starter → "Use this template"
```

The starter includes:

- `vite.config.ts` — lib build (ESM, React externalized) + dev shell
- `dev/DevShell.tsx` — in-browser preview that simulates Origin's card
- `scripts/install.mjs` — copies `dist/` to Origin's AppData plugins directory
- Vendored `@origin/api` types (no npm publish required)
