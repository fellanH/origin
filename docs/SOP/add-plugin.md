# SOP: Add a Note Plugin

## When to use

Adding a new `@note/*` plugin to the app — whether a first-party plugin or a third-party contribution.

## Prerequisites

- `@note/api` (`plugins/api/`) provides the type contract for all plugins. It is already a workspace package and requires no setup steps.
- Types are available at `plugins/api/src/plugin.ts`: `PluginManifest`, `PluginContext`, `PluginComponent`, `PluginModule`.

## Build-time constraint (v1)

Plugin loading v1 uses **build-time Vite dynamic imports**. Every plugin must have a static literal `import()` in `registry.ts` so Vite can emit the chunk at build time. Plugins cannot be installed at runtime without a rebuild.

---

## Steps

### 1. Copy the template package

```
cp -r plugins/template plugins/your-plugin
```

Update `plugins/your-plugin/package.json`:

```json
{
  "name": "@note/your-plugin",
  "version": "0.1.0",
  "private": true,
  "main": "src/index.tsx",
  "types": "src/index.tsx",
  "dependencies": { "@note/api": "*" }
}
```

### 2. Edit `src/manifest.ts`

Set a unique reverse-domain `id`, a human-readable `name`, an `icon` (emoji or relative image path), and a `description`:

```ts
import type { PluginManifest } from "@note/api";

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
import type { PluginContext } from "@note/api";
export { manifest } from "./manifest";

export default function YourPlugin({ context }: { context: PluginContext }) {
  return <div>Hello from {context.panelId}</div>;
}
```

### 4. Register in `note.plugins.json`

Add a manifest entry to the plugin registry JSON file so the Launcher can discover and display the plugin.

### 5. Add a static import to `src/plugins/registry.ts`

Use a **static string literal** — Vite must be able to analyze the import specifier at build time:

```ts
export const IMPORT_MAP: Record<string, () => Promise<PluginModule>> = {
  "com.note.hello": () => import("@note/hello"),
  "com.yourco.yourplugin": () => import("@note/your-plugin"), // ← add (literal only)
};
```

Do NOT use a variable as the import specifier:

```ts
// ❌ does not work in production — Vite cannot analyze it
const id = "@note/your-plugin";
import(id);
```

### 6. Update `vite.config.ts`

Two places — both required:

```ts
resolve: {
  alias: {
    "@note/api": path.resolve(__dirname, "plugins/api/src"),
    "@note/hello": path.resolve(__dirname, "plugins/hello/src"),
    "@note/your-plugin": path.resolve(__dirname, "plugins/your-plugin/src"), // ← add
  },
},
optimizeDeps: {
  include: [
    "@note/hello",
    "@note/your-plugin", // ← add
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
      "@note/api": ["./plugins/api/src"],
      "@note/hello": ["./plugins/hello/src"],
      "@note/your-plugin": ["./plugins/your-plugin/src"],
      "@note/your-plugin/*": ["./plugins/your-plugin/src/*"]
    }
  }
}
```

### 8. Run `npm install`

```
npm install
```

This links the new workspace package so Node and Vite can resolve `@note/your-plugin`.

### 9. Verify in dev

```
npm run tauri:dev
```

Open the Launcher in an empty panel — the plugin should appear. Click it to confirm it mounts without errors.

---

## Why each step matters

| Step                          | Missing consequence                             |
| ----------------------------- | ----------------------------------------------- |
| `note.plugins.json` entry     | Plugin not shown in Launcher UI                 |
| `registry.ts` static import   | Chunk not emitted → runtime error in production |
| `vite.config.ts` alias        | Module not found in dev                         |
| `vite.config.ts` optimizeDeps | Full page reload on first dynamic load in dev   |
| `tsconfig.json` paths         | IDE type errors, no autocomplete                |
| `npm install`                 | Workspace package not linked                    |

---

## Type contract

See `plugins/api/src/plugin.ts` for the authoritative type definitions:

- `PluginManifest` — metadata shown in the Launcher
- `PluginContext` — runtime context injected by `PluginHost` into every plugin component
- `PluginComponent` — React component type (`ComponentType<{ context: PluginContext }>`)
- `PluginModule` — shape of the dynamic `import()` result (`{ default: PluginComponent, manifest: PluginManifest }`)

---

## Checklist

- [ ] `plugins/<name>/package.json` created with correct `name` and `@note/api` dependency
- [ ] `src/manifest.ts` — unique reverse-domain `id`, display `name`, `icon`, `description`
- [ ] `src/index.tsx` — default export satisfies `PluginComponent`; re-exports `manifest`
- [ ] `note.plugins.json` entry added
- [ ] `src/plugins/registry.ts` entry added with **static literal** import specifier
- [ ] `vite.config.ts` alias added
- [ ] `vite.config.ts` `optimizeDeps.include` updated
- [ ] `tsconfig.json` paths updated (both bare and `/*` wildcard)
- [ ] `npm install` run
- [ ] Plugin appears in Launcher and mounts without errors in `npm run tauri:dev`
