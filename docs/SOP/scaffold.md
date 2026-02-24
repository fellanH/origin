# SOP: Scaffold

**Covers:** Issue #1. Zero → working Tauri 2 + React 19 + Vite 7 + Tailwind v4 + shadcn/ui + npm workspaces.
**Scope boundary:** Issue #1 only. Stops before Zustand store, panel components, and plugins.
**Time:** ~30 minutes.

---

## Layer order

Follows R3 mitigation (`docs/research/risks.md`) — validate each layer before adding the next. Do not compress steps.

1. Create project → `tauri dev` starts
2. Configure frameless window → traffic lights and drag region work
3. Add Tailwind v4 → utility classes render
4. Add shadcn/ui + patch resizable → component renders
5. Finalize `vite.config.ts` + `tsconfig.json`
6. Set up npm workspaces
7. Add window-state plugin → window position persists
8. Install remaining core packages

---

## Prerequisites

| Tool          | Minimum          | Check                    |
| ------------- | ---------------- | ------------------------ |
| Node          | 20.19+ or 22.12+ | `node --version`         |
| Rust (stable) | latest stable    | `rustc --version`        |
| Xcode CLT     | current          | `xcode-select --version` |

---

## Phase 1: Create the project

```bash
npm create tauri@latest
```

When prompted:

```
Project name      → origin
Package manager   → npm
Frontend language → TypeScript / JavaScript → TypeScript
Frontend framework → React
Variant           → React + TypeScript
```

```bash
cd origin
```

**Do not run `npm run tauri dev` yet.** The generated configs are stock — replace them before first run.

Expected directory structure:

```
origin/
├── src-tauri/
│   ├── src/main.rs
│   ├── src/lib.rs
│   ├── Cargo.toml
│   ├── capabilities/default.json
│   └── tauri.conf.json
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   └── ...
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## Phase 2: Configure the frameless window

Replace `src-tauri/tauri.conf.json` entirely:

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "origin",
  "version": "0.0.1",
  "identifier": "com.klarhimmel.origin",
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devUrl": "http://localhost:1420",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "label": "main",
        "title": "origin",
        "width": 1200,
        "height": 800,
        "minWidth": 600,
        "minHeight": 400,
        "decorations": true,
        "titleBarStyle": "Overlay",
        "hiddenTitle": true,
        "trafficLightPosition": { "x": 14, "y": 22 },
        "acceptFirstMouse": true,
        "shadow": true,
        "visible": true
      }
    ]
  },
  "security": {
    "csp": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'"
  }
}
```

> `visible: true` here. Changed to `false` in Phase 7 after window-state is installed. Setting `visible: false` without the window-state plugin will cause the window to never appear.

**Critical fields — these are the most common mistakes:**

| Field           | Value                     | Why                                                                         |
| --------------- | ------------------------- | --------------------------------------------------------------------------- |
| `decorations`   | `true`                    | `false` removes traffic lights entirely                                     |
| `titleBarStyle` | `"Overlay"`               | Capital O — Tauri is case-sensitive. `"overlay"` fails silently             |
| `identifier`    | `"com.klarhimmel.origin"` | Anchors the app data directory path. Do not change after first prod release |

Replace `src-tauri/capabilities/default.json`:

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "default",
  "description": "Core window and path permissions",
  "windows": ["main"],
  "permissions": [
    "core:default",
    "path:default",
    "core:window:deny-toggle-maximize",
    "core:window:deny-internal-toggle-maximize"
  ]
}
```

> `zustand.json` and `fs.json` capability files are added in issue #3 when `@tauri-store/zustand` is installed.

Update `index.html` title:

```html
<title>origin</title>
```

**Checkpoint:**

```bash
npm run tauri dev
```

- [ ] App opens without terminal errors
- [ ] Window is frameless — no native macOS title bar
- [ ] macOS traffic lights (●●●) visible at top-left, approximately 14px from edge
- [ ] Window is draggable from the top area

If traffic lights are missing: `decorations` must be `true`.
If traffic lights are at wrong position: confirm `titleBarStyle: "Overlay"` (capital O) is set exactly.

---

## Phase 3: Add Tailwind v4

```bash
npm install -D @tailwindcss/vite
```

Remove any generated Tailwind v3 artifacts if present:

```bash
rm -f tailwind.config.ts tailwind.config.js postcss.config.js postcss.config.mjs
```

If the generated `vite.config.ts` imports `@tauri-apps/vite-plugin`, remove it:

```bash
npm uninstall @tauri-apps/vite-plugin
```

Update `vite.config.ts` — minimal version for this phase (finalized in Phase 5):

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: { ignored: ["**/src-tauri/**"] },
  },
});
```

Replace `src/index.css` entirely:

```css
@import "tailwindcss";

@theme inline {
  --font-sans:
    ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", sans-serif;
  --font-mono:
    ui-monospace, "SF Mono", "Cascadia Code", "JetBrains Mono", monospace;
}

@layer base {
  body {
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }
}
```

> shadcn init (Phase 4) appends its own `@layer base` block with CSS variable definitions to this file.

**Checkpoint:** Add `className="bg-blue-500 text-white p-4"` to any element in `App.tsx`, confirm blue background renders, then remove the test class.

---

## Phase 4: Add shadcn/ui

```bash
npx shadcn@latest init
```

When prompted:

```
Style:          New York
Base color:     Neutral
CSS variables:  yes
```

> If prompted for a Tailwind config file path, leave it blank — Tailwind v4 has no config file.
> For dark mode questions: select `system` or `prefers-color-scheme`. See `docs/research/tailwind-v4-dark-mode.md` for the correct WKWebView-compatible dark mode setup.

This generates:

- `components.json`
- `src/lib/utils.ts` — contains the `cn()` helper

Add the resizable component:

```bash
npx shadcn@latest add resizable
```

**Immediately patch `src/components/ui/resizable.tsx` for react-resizable-panels v4.**

The CLI generates v3 code that will break at runtime. Apply these replacements throughout the file:

| v3 (generated — incorrect)                       | v4 (correct)                           |
| ------------------------------------------------ | -------------------------------------- |
| `ResizablePrimitive.PanelGroup`                  | `ResizablePrimitive.Group`             |
| `ResizablePrimitive.PanelResizeHandle`           | `ResizablePrimitive.Separator`         |
| `data-[panel-group-direction=vertical]:flex-col` | `aria-[orientation=vertical]:flex-col` |
| any `data-[panel-group-direction=...]`           | `aria-[orientation=...]`               |

Verify react-resizable-panels v4 is installed (shadcn adds it as a dep, but confirm the version):

```bash
npm list react-resizable-panels
```

Expected: `react-resizable-panels@4.x.x`. If v3 was installed:

```bash
npm install react-resizable-panels@latest
```

**Checkpoint:** Import and render `Button` from `@/components/ui/button` in `App.tsx`. Confirm it renders with correct shadcn styling (border, hover states, theme colors). Remove the test import.

---

## Phase 5: Finalize `vite.config.ts`

Replace with the canonical config (source: `docs/research/vite-config.md`):

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      // Plugin workspace packages — activated in issue #12
      "@origin/hello": path.resolve(__dirname, "plugins/hello/src"),
      // Internal path alias
      "@": path.resolve(__dirname, "src"),
    },
    // Prevents "invalid hook call" if a plugin package resolves its own React copy
    dedupe: ["react", "react-dom"],
  },

  // Pre-bundle dynamically imported plugins to prevent page reload on first load in dev
  optimizeDeps: {
    include: ["@origin/hello"],
  },

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

Notes:

- `@origin/hello` alias is included now even though `plugins/hello/src` doesn't exist yet — the alias is a no-op until the directory is created in Phase 6.
- No `@tauri-apps/vite-plugin` — desktop-only v1 doesn't need it. See `docs/research/vite-config.md` for the full rationale.

---

## Phase 6: Configure `tsconfig.json`

The generated tsconfig should have `strict: true` — verify it. Replace `compilerOptions` with:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@origin/hello": ["./plugins/hello/src"],
      "@origin/hello/*": ["./plugins/hello/src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

If `tsconfig.node.json` is missing, create it:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

**Checkpoint:** `npx tsc --noEmit` passes. Resolve all type errors before continuing.

---

## Phase 7: Set up npm workspaces

Update `package.json` — add `workspaces` and ensure `scripts` includes Tauri commands:

```json
{
  "name": "origin",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "workspaces": ["plugins/*"],
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "tauri": "tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build",
    "claude": "claude --plugin-dir .claude/plugin --dangerously-skip-permissions"
  }
}
```

Create the `@origin/hello` workspace stub (full implementation is issue #12):

```bash
mkdir -p plugins/hello/src
```

`plugins/hello/package.json`:

```json
{
  "name": "@origin/hello",
  "version": "0.1.0",
  "private": true,
  "main": "src/index.tsx",
  "types": "src/index.tsx"
}
```

`plugins/hello/src/index.tsx` (placeholder):

```typescript
// Placeholder — implemented in issue #12
export default null;
```

Create `origin.plugins.json` at the project root (sibling of `package.json`):

```json
{
  "plugins": [{ "id": "com.origin.hello", "package": "@origin/hello" }]
}
```

Register the workspace symlink:

```bash
npm install
```

**Checkpoint:** `ls -la node_modules/@origin/hello` should show a symlink to `../../plugins/hello`.

---

## Phase 8: Add window-state plugin

```bash
npm run tauri add window-state
```

This installs `@tauri-apps/plugin-window-state` (npm) and `tauri-plugin-window-state` (Cargo). Verify both were added to `package.json` and `Cargo.toml`.

Register in `src-tauri/src/lib.rs`:

```rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

Now set `visible` to `false` in `tauri.conf.json` — the window-state plugin calls `show()` after restoring the saved position, preventing a flash:

```json
"visible": false
```

**Checkpoint:** Restart dev server, drag window to a non-default position, quit, reopen. Window should reopen at the last position without flashing to the default first.

---

## Phase 9: Install core packages

```bash
npm install zustand immer
npm install react-error-boundary
```

Verify final versions:

```bash
npm list zustand react-resizable-panels react-error-boundary immer
```

Expected:

- `zustand@5.x.x`
- `react-resizable-panels@4.x.x`
- `react-error-boundary@6.x.x`
- `immer@10.x.x`

---

## Final Verification Checklist

- [ ] `npm run tauri dev` starts without errors
- [ ] `npm run tauri:build` completes without errors (run once to confirm)
- [ ] Frameless window opens — no native macOS title bar
- [ ] macOS traffic lights (●●●) visible at `x:14, y:22` position
- [ ] Window is draggable from the top area
- [ ] Double-clicking the drag area does **not** maximize the window (`deny-toggle-maximize` working)
- [ ] Tailwind utility classes render correctly
- [ ] shadcn `Button` renders with correct theme styling
- [ ] `src/components/ui/resizable.tsx` uses v4 names (`Group`, `Separator`, `aria-[orientation=...]`)
- [ ] `npx tsc --noEmit` passes
- [ ] `node_modules/@origin/hello` symlink resolves
- [ ] Window position persists across restarts
- [ ] `origin.plugins.json` exists at project root

---

## Common Mistakes

| Mistake                                            | Symptom                               | Fix                                             |
| -------------------------------------------------- | ------------------------------------- | ----------------------------------------------- |
| `titleBarStyle: "overlay"` (lowercase o)           | Full native title bar shows           | Use `"Overlay"` — capital O                     |
| `decorations: false`                               | Traffic lights disappear              | Use `true`                                      |
| Tailwind v3 PostCSS left in place                  | Styles conflict or double-apply       | Delete `tailwind.config.ts`, `postcss.config.*` |
| `resizable.tsx` not patched after `shadcn add`     | Console errors, broken resize handles | Apply v4 patch immediately — see Phase 4 table  |
| `visible: false` before window-state is registered | Window never appears                  | Add plugin before setting `visible: false`      |
| `@tauri-apps/vite-plugin` left in vite.config.ts   | Port conflicts, HMR issues            | Remove it — not needed for desktop-only v1      |

---

## What's Next

Scaffold complete. Follow `docs/plans/poc.md` for the PoC build:

1. **Issue #2** — Types: `src/types/panel.ts` + `src/types/workspace.ts`
2. **Issue #3 (partial)** — PoC store: plain Zustand in-memory, no `@tauri-store` yet
3. **Issue #4** — `EmptyState` component
4. **Issues #7 + #11** — `PanelGrid` / `PanelBranch` / `Panel` + `useKeyboardShortcuts`

`@tauri-store/zustand` (full persistence layer) and `capabilities/zustand.json` + `capabilities/fs.json` are added in the issue #3 upgrade after the PoC passes its checklist. Before building on top of it, spike `@tauri-store/zustand` first — see `docs/research/risks.md` R1 for spike criteria and fallback plan.
