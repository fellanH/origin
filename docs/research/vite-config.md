# Vite 7 Config — note app (Tauri 2 + npm workspaces)

**Researched:** 2026-02-23 (updated 2026-02-23 — deep-dive into dynamic imports, workspace resolution, Vite 7 changes, @tauri-apps/vite-plugin, chunk splitting)
**Target:** Vite 7, Tauri 2.10.2, npm workspaces, dynamic import of `@note/hello`

---

## Complete `vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  // @tailwindcss/vite replaces the PostCSS approach from Tailwind v3.
  // No tailwind.config.ts needed — theme is configured in CSS via @theme.
  plugins: [react(), tailwindcss()],

  // Resolve workspace packages
  resolve: {
    alias: {
      "@note/hello": path.resolve(__dirname, "plugins/hello/src"),
      "@": path.resolve(__dirname, "src"),
    },
    // Prevent two copies of React when a plugin package also lists React as a dep.
    // Two copies → "invalid hook call" error. Belt-and-suspenders over npm hoisting.
    dedupe: ["react", "react-dom"],
  },

  // Pre-bundle dynamically imported workspace packages
  // Without this, first import() in dev triggers a full re-crawl + page reload
  optimizeDeps: {
    include: ["@note/hello"],
  },

  // --- Tauri-specific settings (do not change) ---
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host ? { protocol: "ws", host, port: 1421 } : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  envPrefix: ["VITE_", "TAURI_ENV_*"],
  build: {
    target:
      process.env.TAURI_ENV_PLATFORM === "windows" ? "chrome105" : "safari13",
    minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
  },
});
```

---

## Key Decisions

### No `@tauri-apps/vite-plugin`

The official Tauri Vite plugin (`@tauri-apps/vite-plugin`) is optional for desktop apps. It adds:

- Asset URL rewriting (not needed — we don't use `convertFileSrc`)
- Mobile HMR helpers (not needed — macOS desktop only in v1)
- Some `tauri://` → `http://` remapping helpers

For desktop-only v1 with no special asset handling, the plugin adds no meaningful value. Skip it.

### `resolve.alias` for workspace packages

npm workspaces symlinks `@note/hello` → `plugins/hello/` in `node_modules/@note/hello`. Vite will resolve it correctly without an alias IF the package has a valid `main` or `exports` field in its `package.json`.

The alias is belt-and-suspenders — it bypasses `node_modules` entirely and points directly at the source. This is faster in dev (no symlink hop) and avoids the `package.json#exports` dance. **Use the alias.**

```json
// plugins/hello/package.json
{
  "name": "@note/hello",
  "version": "0.1.0",
  "main": "src/index.tsx",
  "types": "src/index.tsx"
}
```

The alias in `vite.config.ts` makes this the source of truth regardless of `package.json` fields.

### `optimizeDeps.include` — critical for dev

Vite pre-bundles dependencies at dev server start. Without `include: ["@note/hello"]`, the first call to `import("@note/hello")` triggers a **runtime dependency discovery** — Vite re-crawls and re-bundles, causing a full page reload mid-operation.

`include` tells Vite to pre-bundle `@note/hello` at startup so dynamic imports work immediately. This is especially important because the plugin loader calls `import(pluginId)` lazily when a user opens the launcher — any reload would be jarring.

**For production builds:** Dynamic imports are standard Rollup code-splitting. `@note/hello` gets emitted as a separate chunk (e.g., `dist/assets/@note-hello-[hash].js`). No issues — `optimizeDeps` is dev-only.

### Add plugins to `optimizeDeps.include` as you add them

When adding a second plugin (e.g., `@note/clock`):

1. Add its alias to `resolve.alias`
2. Add it to `optimizeDeps.include`

Both are keyed by the package name, not the path.

---

## `tsconfig.json` — Path Aliases

Mirror the Vite alias in TypeScript so the IDE resolves imports correctly:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@note/hello": ["./plugins/hello/src"]
    }
  }
}
```

---

## Port — 1420

Tauri 2's default dev URL is `http://localhost:1420`. This is set in `tauri.conf.json`:

```json
{
  "build": {
    "devUrl": "http://localhost:1420"
  }
}
```

The Vite `server.port: 1420` must match. If you change one, change both.

---

## Dev Workflow

```bash
npm run tauri dev
# Tauri CLI starts Vite on :1420, opens webview pointed at it
# Changes to src/ → HMR (no reload for most changes)
# Changes to src-tauri/**/*.rs → Cargo recompile (watch.ignored prevents double triggers)
```

---

## Extended Research (deep-dive session)

### 1. Vite 7 status and breaking changes

Vite 7 is stable and released. Key changes from Vite 5/6 relevant to this project:

**Node.js requirement raised.** Vite 7 requires Node 20.19+ or 22.12+. Node 18 is dropped (EOL April 2025). The new minimum is needed so Node supports `require(esm)` without a flag — not relevant to this app's runtime, but relevant to CI/tooling.

**Default browser target changed.** The default `build.target` moved from `'modules'` to `'baseline-widely-available'` (Baseline — browsers that have supported features for 30+ months). For this project the target is already explicitly set to `chrome105` or `safari13` (Tauri-specific), so this default change has no effect.

**`rollupOptions` still used in Vite 7.** The migration to `rolldownOptions` is a Vite 8 (Rolldown) change. Vite 7 still uses Rollup and `build.rollupOptions`. If/when the project upgrades to Vite 8, rename `rollupOptions` → `rolldownOptions` and `esbuild` → `oxc`.

**Dynamic import and alias behavior is unchanged from Vite 5/6.** No breaking changes in Vite 7 affect resolve.alias, optimizeDeps, or dynamic import handling.

---

### 2. How `import('@note/hello')` works at runtime — the full picture

The note plugin system uses this pattern in `registry.ts`:

```typescript
// src/plugins/registry.ts
export const pluginRegistry: Record<string, () => Promise<PluginModule>> = {
  "com.note.hello": () => import("@note/hello"),
};
```

This is a **static string literal dynamic import**. Vite's static analysis at build time can see the literal string `'@note/hello'` and knows exactly what to bundle. This is the only pattern that works reliably. Here is why variable-based imports do not work:

**The fundamental constraint: Vite requires analyzable import specifiers.**

Vite (and Rollup underneath it) must statically analyze `import()` calls at build time to know what modules need to be included in the output bundle. A pattern like:

```typescript
// Does NOT work — Vite cannot analyze this
const id = "@note/hello";
import(id); // Error: cannot analyze dynamic import with variable specifier
```

fails with "The above dynamic import cannot be analyzed by Vite." The result in production is a missing module — the chunk is not emitted.

**What works:**

| Pattern                                        | Vite behavior                                    | Works in prod             |
| ---------------------------------------------- | ------------------------------------------------ | ------------------------- |
| `import('@note/hello')`                        | Static literal — Vite bundles the chunk          | Yes                       |
| `import(/* @vite-ignore */ variable)`          | Suppresses error, but chunk not bundled          | No (module missing)       |
| `import.meta.glob('./plugins/*.tsx')`          | Glob — Vite scans filesystem at build time       | Yes (relative paths only) |
| `import.meta.glob('node_modules/@note/*.tsx')` | Not supported — glob must start with `./` or `/` | No                        |

**The registry pattern is the correct v1 approach.** Each plugin is a string literal in the registry map. Vite sees all of them at build time, emits them as separate chunks, and the lazy-loading at runtime works correctly because the chunks are already on disk.

```typescript
// Correct pattern — every import() is a static literal
export const pluginRegistry: Record<string, () => Promise<PluginModule>> = {
  "com.note.hello": () => import("@note/hello"),
  "com.note.clock": () => import("@note/clock"), // add new plugins here
};
```

The loader then calls the factory function:

```typescript
// src/plugins/loader.ts
const cache = new Map<string, PluginModule>();

export async function loadPlugin(
  pluginId: string,
): Promise<PluginModule | null> {
  if (cache.has(pluginId)) return cache.get(pluginId)!;
  const factory = pluginRegistry[pluginId];
  if (!factory) return null;
  const mod = await factory();
  cache.set(pluginId, mod);
  return mod;
}
```

This pattern is fully type-safe, Vite-compatible, and produces clean code splitting.

---

### 3. npm workspaces + Vite — how resolution actually works

npm workspaces creates symlinks: `node_modules/@note/hello` → `plugins/hello/`. Vite's behavior with symlinked workspace packages depends on whether the package is ESM-native:

**If the workspace package is ESM-native (has `"type": "module"` or exports `.js`/`.ts` with ESM syntax):** Vite detects it as "not from node_modules" and treats it as source code. It does not pre-bundle it. No alias needed — it just works.

**If the workspace package is missing `exports` / has no clear ESM entry:** Resolution may fail or fall back to CommonJS, triggering optimizeDeps issues.

**The `resolve.alias` approach (recommended for this project):** Rather than relying on npm's symlink + Vite's ESM detection, the alias hardwires `@note/hello` → `plugins/hello/src`. This bypasses all of the above. It is faster in dev (no symlink traversal), works regardless of the package.json fields, and makes the mapping explicit and auditable.

**Why `optimizeDeps.include` is still needed with the alias:** Even with the alias pointing to `plugins/hello/src`, Vite's dev server pre-bundler does not automatically discover modules that are only reached via dynamic import (`import('@note/hello')`). Without `include: ["@note/hello"]`, the first time the user opens the Launcher and a plugin is loaded dynamically, Vite triggers a runtime dependency discovery pass — which causes a **full page reload**. The `include` entry prevents this by telling Vite to pre-bundle it at startup.

**One important nuance:** The `optimizeDeps.include` key must match the import specifier as written in source code. If source code uses `import('@note/hello')` and the alias is `'@note/hello'`, the include key must also be `'@note/hello'`. They are string-matched.

---

### 4. `resolve.dedupe` — when it is needed

`resolve.dedupe` forces all resolved instances of a module to use the same copy from the project root. It is relevant when:

- A workspace package (`plugins/hello`) imports React
- The app also imports React
- Without dedupe, there could be two copies of React (one in `plugins/hello/node_modules/`, one in root `node_modules/`)

Two copies of React causes the "invalid hook call" error (hooks check object identity). For this project, since plugins are under `plugins/` in the workspace root and React is a root-level dependency, npm workspace hoisting should handle this automatically. However, adding `resolve.dedupe: ['react', 'react-dom']` is a safe precaution that costs nothing.

Updated `vite.config.ts`:

```typescript
resolve: {
  alias: {
    "@note/hello": path.resolve(__dirname, "plugins/hello/src"),
    "@": path.resolve(__dirname, "src"),
  },
  dedupe: ["react", "react-dom"],
},
```

---

### 5. Production build — chunk output for plugins

In production builds, Vite (via Rollup) handles `import('@note/hello')` as a code-split dynamic import. The plugin source is emitted as a separate chunk file. Example output:

```
dist/
├── assets/
│   ├── index-[hash].js        # main app bundle
│   ├── @note_hello-[hash].js  # @note/hello chunk
│   └── ...
└── index.html
```

The chunk is fetched lazily when first loaded — no issue with this for Tauri since all files are bundled into the app binary and served via `tauri://localhost`.

**Controlling chunk names (optional):** If predictable chunk filenames are needed (e.g., for debugging):

```typescript
build: {
  rollupOptions: {
    output: {
      chunkFileNames: (chunkInfo) => {
        if (chunkInfo.name.startsWith("@note_")) {
          return "assets/plugins/[name]-[hash].js";
        }
        return "assets/[name]-[hash].js";
      },
    },
  },
},
```

This is optional for v1. The hash-named defaults are fine.

---

### 6. `@tauri-apps/vite-plugin` — assessment

The official Tauri Vite plugin is `@tauri-apps/vite-plugin`. The community plugin `vite-plugin-tauri` (by amrbashir) is a different, unofficial package.

**`@tauri-apps/vite-plugin` provides:**

- Asset URL rewriting for `convertFileSrc`
- Mobile HMR host/port injection (uses `TAURI_DEV_HOST`)
- Some `tauri://` ↔ `http://` remapping for asset URLs

**Vite 7 compatibility:** No documented breaking incompatibility. The Cloudflare Vite plugin added Vite 7 support in July 2025 as a data point that the ecosystem has broadly caught up. The Tauri docs (as of the vite.mdx) do not mandate the plugin for desktop targets.

**Decision for this project (unchanged from prior research):** Skip `@tauri-apps/vite-plugin` for v1. The project is desktop-only (macOS), does not use `convertFileSrc`, and does not need mobile HMR helpers. The Tauri-specific settings (port, strictPort, envPrefix, build.target) are straightforward to set manually and are already in the config above. Using the manual config keeps the dependency surface smaller and the config more readable.

If the project ever adds iOS/Android targets or needs `convertFileSrc` for serving local files via asset URLs, add the plugin then.

---

### 7. `vite-plugin-dynamic-import` — not needed, not recommended

`vite-plugin-dynamic-import` (latest: 1.6.0, last published ~1 year ago) enhances Vite's dynamic import handling for cases where the import path is constructed from a variable or partial string. It is **not needed for this project** because the registry pattern uses static string literals.

The plugin also has limited maintenance activity and known limitations with node_modules imports. Do not add it.

---

### 8. TypeScript path aliases — complete setup

TypeScript's `paths` compiler option is a compile-time-only construct. It tells the TypeScript language server how to resolve imports for IDE support and type-checking. It does NOT affect the runtime or the Vite build — that is handled by `resolve.alias`. Both must be kept in sync.

**`tsconfig.json` — complete paths section:**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@note/hello": ["./plugins/hello/src"],
      "@note/hello/*": ["./plugins/hello/src/*"]
    }
  }
}
```

**`vite.config.ts` — matching aliases:**

```typescript
resolve: {
  alias: {
    "@note/hello": path.resolve(__dirname, "plugins/hello/src"),
    "@": path.resolve(__dirname, "src"),
  },
},
```

**Adding a new plugin (`@note/clock`):** Add one entry to each:

In `vite.config.ts`:

```typescript
"@note/clock": path.resolve(__dirname, "plugins/clock/src"),
```

In `tsconfig.json`:

```json
"@note/clock": ["./plugins/clock/src"],
"@note/clock/*": ["./plugins/clock/src/*"]
```

And add to `registry.ts`:

```typescript
"com.note.clock": () => import("@note/clock"),
```

And to `vite.config.ts` `optimizeDeps.include`:

```typescript
include: ["@note/hello", "@note/clock"],
```

**Note:** `vite-tsconfig-paths` is a plugin that reads `tsconfig.json` paths and creates Vite aliases automatically, removing the need to maintain both. It is a valid alternative. For this project with a small number of plugins, manual synchronization is simpler and more explicit.

---

### 9. Tauri + npm workspaces — known issues and patterns

**Workspace root vs. app root:** `npm create tauri@latest` creates a project in a single directory. To use workspaces, the `package.json` at the project root must declare `"workspaces": ["plugins/*"]`. The `src-tauri/` directory must NOT be listed as a workspace — it is a Rust project, not a JS package.

**Lock file location:** npm generates a single `package-lock.json` at the workspace root. Tauri CLI must be run from the workspace root (where `package-lock.json` lives), not from a sub-package.

**`frontendDist` path in `tauri.conf.json`:** The path is relative to `src-tauri/`. For the standard layout where `src-tauri/` is a sibling of `dist/`:

```json
{
  "build": {
    "frontendDist": "../dist",
    "devUrl": "http://localhost:1420",
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build"
  }
}
```

**`server.watch.ignored` is important:** Without it, the Tauri file watcher (Rust source files) and Vite's HMR watcher overlap. Vite watching `src-tauri/**` can dramatically slow dev startup. Keep `ignored: ["**/src-tauri/**"]` in the config.

**Plugin packages do not need their own `tauri.conf.json` or `src-tauri/`.** They are pure JS/TS packages that Vite bundles into the main app. The Tauri layer only touches the root `src-tauri/`.

---

## Sources

- [Tauri + Vite setup guide](https://v2.tauri.app/start/frontend/vite/)
- [Vite `optimizeDeps`](https://vite.dev/config/dep-optimization-options)
- [Vite `resolve.alias`](https://vite.dev/config/shared-options#resolve-alias)
- [npm workspaces docs](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [Vite dynamic import code splitting](https://vite.dev/guide/features#dynamic-import)
- [Vite 7 release announcement](https://vite.dev/blog/announcing-vite7)
- [Vite dep pre-bundling](https://vite.dev/guide/dep-pre-bundling)
- [Vite GitHub issue #14102 — dynamic import of node_modules with variable](https://github.com/vitejs/vite/issues/14102)
- [Vite GitHub issue #15677 — import.meta.glob for node_modules](https://github.com/vitejs/vite/issues/15677)
- [Vite GitHub issue #10460 — dynamic import fails with aliases](https://github.com/vitejs/vite/issues/10460)
- [vite-plugin-dynamic-import npm](https://www.npmjs.com/package/vite-plugin-dynamic-import)
