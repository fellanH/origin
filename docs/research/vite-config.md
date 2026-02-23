# Vite 7 Config — note app (Tauri 2 + npm workspaces)

**Researched:** 2026-02-23
**Target:** Vite 7, Tauri 2.10.2, npm workspaces, dynamic import of `@note/hello`

---

## Complete `vite.config.ts`

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [react()],

  // Resolve workspace packages
  resolve: {
    alias: {
      "@note/hello": path.resolve(__dirname, "plugins/hello/src"),
    },
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

## Sources

- [Tauri + Vite setup guide](https://v2.tauri.app/start/frontend/vite/)
- [Vite `optimizeDeps`](https://vite.dev/config/dep-optimization-options)
- [Vite `resolve.alias`](https://vite.dev/config/shared-options#resolve-alias)
- [npm workspaces docs](https://docs.npmjs.com/cli/v10/using-npm/workspaces)
- [Vite dynamic import code splitting](https://vite.dev/guide/features#dynamic-import)
