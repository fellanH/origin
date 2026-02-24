# SOP: Add an Origin Plugin

## When to use

Adding a new `@origin/*` plugin to the app — whether a first-party plugin or a third-party contribution.

## Prerequisites

- `@origin/api` (`packages/api/`) provides the type contract for all plugins. It is already a workspace package and requires no setup steps.
- Types are available at `packages/api/src/plugin.ts`: `PluginManifest`, `PluginContext`, `PluginComponent`, `PluginModule`.

## Plugin tiers

There are two plugin execution tiers:

| Tier   | Who                     | Loading                                                  | Isolation                    | Lifecycle events                         |
| ------ | ----------------------- | -------------------------------------------------------- | ---------------------------- | ---------------------------------------- |
| **L0** | First-party (this repo) | Build-time Vite dynamic import (static literal required) | None — runs in main app tree | Full (`focus`, `blur`, `resize`, `zoom`) |
| **L1** | Community / marketplace | Runtime via `plugin://` URI scheme into sandboxed iframe | Null-origin iframe           | None (iframe boundary)                   |

This SOP covers **L0 plugins**. L1 plugin authors use `@origin/sdk` (`usePluginContext`, `useBusChannel`) instead of `PluginContext` directly — they do not need to touch the core repo.

> **Building a community or marketplace plugin?** Use [`origin-plugin-starter`](https://github.com/fellanH/origin-plugin-starter) — a standalone repo with full L1 build setup, TypeScript config, and live-reload dev tooling. `packages/template/` in this repo is deprecated and covers L0 only.

---

## Steps

### 1. Copy the template package

```
cp -r packages/template packages/your-plugin
```

Update `packages/your-plugin/package.json`:

```json
{
  "name": "@origin/your-plugin",
  "version": "0.1.0",
  "private": true,
  "main": "src/index.tsx",
  "types": "src/index.tsx",
  "dependencies": { "@origin/api": "*" }
}
```

### 2. Edit `src/manifest.ts`

Set a unique reverse-domain `id`, a human-readable `name`, an `icon` (emoji or relative image path), and a `description`:

```ts
import type { PluginManifest } from "@origin/api";

export const manifest: PluginManifest = {
  id: "com.yourco.yourplugin",
  name: "Your Plugin",
  version: "0.1.0",
  description: "What this plugin does.",
  icon: "🔌",
};
```

### 3. Build your component in `src/index.tsx`

Default export must be a React component accepting `{ context: PluginContext }`. Re-export `manifest` as a named export so `PluginHost` can read it:

```tsx
import type { PluginContext } from "@origin/api";
export { manifest } from "./manifest";

export default function YourPlugin({ context }: { context: PluginContext }) {
  return <div>Hello from {context.panelId}</div>;
}
```

### 4. Register in `origin.plugins.json`

Add a manifest entry to the plugin registry JSON file so the Launcher can discover and display the plugin.

### 5. Add a static import to `src/plugins/registry.ts`

Use a **static string literal** — Vite must be able to analyze the import specifier at build time:

```ts
export const IMPORT_MAP: Record<string, () => Promise<PluginModule>> = {
  "com.origin.hello": () => import("@origin/hello"),
  "com.yourco.yourplugin": () => import("@origin/your-plugin"), // ← add (literal only)
};
```

Do NOT use a variable as the import specifier:

```ts
// ❌ does not work in production — Vite cannot analyze it
const id = "@origin/your-plugin";
import(id);
```

### 6. Update `vite.config.ts`

Two places — both required:

```ts
resolve: {
  alias: {
    "@origin/api": path.resolve(__dirname, "packages/api/src"),
    "@origin/hello": path.resolve(__dirname, "packages/hello/src"),
    "@origin/your-plugin": path.resolve(__dirname, "packages/your-plugin/src"), // ← add
  },
},
optimizeDeps: {
  include: [
    "@origin/hello",
    "@origin/your-plugin", // ← add
  ],
},
```

`optimizeDeps.include` prevents a full page reload on the first dynamic import in dev.

### 7. Update `tsconfig.json` paths

Mirror the Vite alias so the IDE resolves imports correctly:

```json
{
  "compilerOptions": {
    "paths": {
      "@origin/api": ["./packages/api/src"],
      "@origin/hello": ["./packages/hello/src"],
      "@origin/your-plugin": ["./packages/your-plugin/src"],
      "@origin/your-plugin/*": ["./packages/your-plugin/src/*"]
    }
  }
}
```

### 8. Run `npm install`

```
npm install
```

This links the new workspace package so Node and Vite can resolve `@origin/your-plugin`.

### 9. Verify in dev

```
npm run tauri:dev
```

Open the Launcher in an empty panel — the plugin should appear. Click it to confirm it mounts without errors.

---

## Why each step matters

| Step                          | Missing consequence                             |
| ----------------------------- | ----------------------------------------------- |
| `origin.plugins.json` entry   | Plugin not shown in Launcher UI                 |
| `registry.ts` static import   | Chunk not emitted → runtime error in production |
| `vite.config.ts` alias        | Module not found in dev                         |
| `vite.config.ts` optimizeDeps | Full page reload on first dynamic load in dev   |
| `tsconfig.json` paths         | IDE type errors, no autocomplete                |
| `npm install`                 | Workspace package not linked                    |

---

## Type contract

See `packages/api/src/plugin.ts` for the authoritative type definitions:

- `PluginManifest` — metadata shown in the Launcher
- `PluginContext` — runtime context injected by `PluginHost` into every plugin component
- `PluginComponent` — React component type (`ComponentType<{ context: PluginContext }>`)
- `PluginModule` — shape of the dynamic `import()` result (`{ default: PluginComponent, manifest: PluginManifest }`)

---

## Checklist

- [ ] `packages/<name>/package.json` created with correct `name` and `@origin/api` dependency
- [ ] `src/manifest.ts` — unique reverse-domain `id`, display `name`, `icon`, `description`
- [ ] `src/index.tsx` — default export satisfies `PluginComponent`; re-exports `manifest`
- [ ] `origin.plugins.json` entry added
- [ ] `src/plugins/registry.ts` entry added with **static literal** import specifier
- [ ] `vite.config.ts` alias added
- [ ] `vite.config.ts` `optimizeDeps.include` updated
- [ ] `tsconfig.json` paths updated (both bare and `/*` wildcard)
- [ ] `npm install` run
- [ ] Plugin appears in Launcher and mounts without errors in `npm run tauri:dev`
