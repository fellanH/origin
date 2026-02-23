# Testing SOP — note

## What to Test

| Area                                                      | Required? | Tool   | Notes                                          |
| --------------------------------------------------------- | --------- | ------ | ---------------------------------------------- |
| Store actions (`splitPanel`, `closePanel`, `resizeSplit`) | **Yes**   | Vitest | Pure functions — easiest to test, highest risk |
| Store selectors                                           | **Yes**   | Vitest | Verify `useShallow` patterns don't over-render |
| Plugin registry/loader                                    | **Yes**   | Vitest | Mock dynamic imports                           |
| React components                                          | No (v1)   | —      | Visual; test manually via PoC checklist        |
| Tauri commands                                            | No (v1)   | —      | Requires `tauri-driver`; defer to post-MVP     |

## What NOT to Test

- Tailwind class names or visual styling
- Tauri window configuration
- shadcn/ui component internals

## Test File Location

Colocated with source — not a separate `__tests__/` folder.

```
src/store/workspaceStore.ts
src/store/workspaceStore.test.ts   ← next to the file it tests
```

## Test Naming

```typescript
describe("workspaceStore", () => {
  describe("splitPanel", () => {
    it("creates two leaf children from a single leaf", () => { ... });
    it("preserves existing siblings when splitting a non-root node", () => { ... });
  });

  describe("closePanel", () => {
    it("promotes sibling to parent position when closing", () => { ... });
    it("handles closing the only panel (resets to empty workspace)", () => { ... });
  });
});
```

Convention: `it("verb + observable outcome")` — describe what the function does, not how.

## Vitest Setup

Add to issue #1 scaffold checklist. When implementing:

**Install:**

```bash
npm install -D vitest @testing-library/react jsdom
```

**`vite.config.ts`** — add `test` block:

```ts
export default defineConfig({
  // ... existing config
  test: {
    environment: "jsdom",
  },
});
```

**`package.json` scripts:**

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

## Phase 3: Multi-Workspace Mock (issue #3 upgrade)

When upgrading the store to multi-workspace + `@tauri-store/zustand`, add this mock at the top of `workspaceStore.test.ts` before the imports:

```ts
vi.mock("@tauri-store/zustand", () => ({
  createTauriStore: vi.fn().mockReturnValue({
    start: vi.fn().mockResolvedValue(undefined),
    save: vi.fn().mockResolvedValue(undefined),
    saveNow: vi.fn().mockResolvedValue(undefined),
  }),
}));
```

The panel operation logic runs inside immer `set(draft => ...)` — bypassing persistence still exercises the real mutation logic.

## Phase 4: Plugin Registry + Loader (issues #9, #12)

Test files exist at `src/plugins/registry.test.ts` and `src/plugins/loader.test.ts`.

**Loader requirement:** Export a `clearPluginCache()` helper from `loader.ts`:

```ts
export function clearPluginCache(): void {
  cache.clear(); // or however the cache is implemented
}
```

Called in `beforeEach` to reset between tests.

## Gate: When Tests Are Required Before Merging

A PR **cannot be marked ready** (draft → ready) without tests passing if the issue touches:

- `workspaceStore.ts` or any store slice (issues #3, #11, future store changes)
- Plugin registry or loader (issues #9, #12)

Test file must exist and `npm test` must pass before moving from draft to ready.

All other issues: manual verification via the PoC checklist is sufficient.
