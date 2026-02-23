# SOP: Add a Note Plugin

Use when adding a new first-party plugin package (e.g. `@note/clock`).

All four steps are required. Skipping any one breaks either dev or production.

---

## Steps

### 1. Create the workspace package

```
plugins/
  clock/
    package.json
    src/
      index.tsx      ← default export must satisfy PluginModule
```

`plugins/clock/package.json`:

```json
{
  "name": "@note/clock",
  "version": "0.1.0",
  "private": true,
  "main": "src/index.tsx",
  "types": "src/index.tsx"
}
```

`plugins/clock/src/index.tsx`:

```typescript
import type { PluginModule } from "@/types/plugin";

const ClockPlugin: PluginModule = {
  id: "com.note.clock",
  name: "Clock",
  component: ClockComponent,
};

export default ClockPlugin;
```

### 2. Update `vite.config.ts`

Two places — both required:

```typescript
resolve: {
  alias: {
    "@note/hello": path.resolve(__dirname, "plugins/hello/src"),
    "@note/clock": path.resolve(__dirname, "plugins/clock/src"), // ← add
  },
},
optimizeDeps: {
  include: [
    "@note/hello",
    "@note/clock", // ← add
  ],
},
```

`optimizeDeps.include` prevents a full page reload on the first dynamic import in dev.

### 3. Update `tsconfig.json`

Mirror the Vite alias so the IDE resolves imports:

```json
{
  "compilerOptions": {
    "paths": {
      "@note/hello": ["./plugins/hello/src"],
      "@note/clock": ["./plugins/clock/src"], // ← add
      "@note/clock/*": ["./plugins/clock/src/*"] // ← add
    }
  }
}
```

### 4. Register in `src/plugins/registry.ts`

Use a **static string literal** — Vite must be able to analyze the import specifier at build time:

```typescript
export const pluginRegistry: Record<string, () => Promise<PluginModule>> = {
  "com.note.hello": () => import("@note/hello"),
  "com.note.clock": () => import("@note/clock"), // ← add (literal string only)
};
```

**Do NOT use a variable** as the import specifier — Vite cannot analyze it and the chunk will not be emitted in production:

```typescript
// ❌ — does not work in production
const id = "@note/clock";
import(id);
```

---

## Why each step matters

| Step                          | Missing consequence                             |
| ----------------------------- | ----------------------------------------------- |
| `vite.config.ts` alias        | Module not found in dev                         |
| `vite.config.ts` optimizeDeps | Full page reload on first dynamic load in dev   |
| `tsconfig.json` paths         | IDE type errors, no autocomplete                |
| `registry.ts` static import   | Chunk not emitted → runtime error in production |

---

## Checklist

- [ ] `plugins/<name>/package.json` created with correct `name` field
- [ ] `plugins/<name>/src/index.tsx` exports default satisfying `PluginModule`
- [ ] `vite.config.ts` alias added
- [ ] `vite.config.ts` `optimizeDeps.include` updated
- [ ] `tsconfig.json` paths updated (both bare and `/*` wildcard)
- [ ] `src/plugins/registry.ts` entry added with static literal import
