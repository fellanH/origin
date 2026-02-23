# Tailwind CSS v4 + shadcn/ui + System Dark Mode

**Researched:** 2026-02-23
**Scope:** System-preference-only dark mode (`prefers-color-scheme`) with Tailwind v4, shadcn/ui, and Tauri 2 (WKWebView on macOS)

---

## Key Finding: No Config Needed

In Tailwind v4, `dark:*` utilities use `prefers-color-scheme` **by default**. The `darkMode` option in `tailwind.config.ts` is gone — configuration is CSS-first. Simply importing Tailwind gives you media-based dark mode with no additional setup.

```css
@import "tailwindcss";
/* dark: utilities already respond to prefers-color-scheme */
```

Do **not** add `@custom-variant dark` — that overrides the default (to class-based or data-attribute). Only add it when switching to manual toggle in v2.

---

## `@theme inline` and Dark Mode

`@theme` (including `@theme inline`) must be defined at the **top level** — never inside a media query or selector. This is a hard constraint in v4.

The correct pattern:

1. Define semantic tokens as plain CSS variables on `:root` (light defaults)
2. Override in `@media (prefers-color-scheme: dark) { :root { ... } }` — standard CSS, not inside `@theme`
3. Use `@theme inline` at top level to map those tokens to Tailwind utilities

```css
/* INVALID — do not do this */
@media (prefers-color-scheme: dark) {
  @theme inline {
    --color-background: ...;
  }
}

/* CORRECT */
@media (prefers-color-scheme: dark) {
  :root {
    --background: oklch(0.145 0 0);
  }
}
@theme inline {
  --color-background: var(--background); /* resolves at runtime via CSS var */
}
```

---

## shadcn/ui — System Dark Mode

shadcn/ui defaults to `.dark` class-based dark mode. Swapping to `prefers-color-scheme` is a one-line change: replace `.dark {` with `@media (prefers-color-scheme: dark) { :root {` (and close the extra brace).

No official shadcn/ui pattern for this — community workaround is stable and widely used.

---

## WKWebView (macOS Tauri) — Required Fix

**`color-scheme: light dark` must be declared on `:root`.** Without it, WKWebView ignores `prefers-color-scheme` for media queries and some native UI colors (scrollbars, form controls) will not adapt.

```css
:root {
  color-scheme: light dark; /* REQUIRED for WKWebView */
}
```

**Dynamic updates work correctly** — when the user switches in System Settings, WKWebView updates CSS variables immediately, no JS needed.

**Tauri window `theme` config does NOT affect `prefers-color-scheme` in the webview on macOS** — the OS appearance drives it directly. This is the correct behavior for v1 (system-only).

Known bug: Linux/webkit2gtk has broken `prefers-color-scheme` detection on some GNOME configs ([tauri#9427](https://github.com/tauri-apps/tauri/issues/9427)). macOS is unaffected.

---

## Upgrade Path to Manual Toggle (v2)

When adding a manual toggle, do this two-step:

**Step 1 — Add `@custom-variant` to globals.css:**

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

**Step 2 — Update the dark CSS block to handle both system + manual:**

```css
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    /* :not(.light) prevents media from overriding manual light choice */
    --background: oklch(0.145 0 0);
    /* ... */
  }
}
.dark {
  --background: oklch(0.145 0 0);
  /* ... */
}
```

The v1 CSS variable structure is **already correct** — adding manual toggle requires only these two additions, no restructuring.

---

## Complete `globals.css` for v1

```css
@import "tailwindcss";

/* ─── Semantic tokens — light mode ─────────────────────────────────── */
:root {
  color-scheme: light dark;

  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --radius: 0.625rem;
}

/* ─── Dark mode overrides — system preference ───────────────────────── */
@media (prefers-color-scheme: dark) {
  :root {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    --card: oklch(0.205 0 0);
    --card-foreground: oklch(0.985 0 0);
    --popover: oklch(0.205 0 0);
    --popover-foreground: oklch(0.985 0 0);
    --primary: oklch(0.922 0 0);
    --primary-foreground: oklch(0.205 0 0);
    --secondary: oklch(0.269 0 0);
    --secondary-foreground: oklch(0.985 0 0);
    --muted: oklch(0.269 0 0);
    --muted-foreground: oklch(0.708 0 0);
    --accent: oklch(0.269 0 0);
    --accent-foreground: oklch(0.985 0 0);
    --destructive: oklch(0.704 0.191 22.216);
    --border: oklch(1 0 0 / 10%);
    --input: oklch(1 0 0 / 15%);
    --ring: oklch(0.556 0 0);
  }
}

/* ─── @theme inline — maps tokens to Tailwind utilities ────────────── */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

/* ─── Base styles ───────────────────────────────────────────────────── */
* {
  border-color: var(--border);
}

body {
  background-color: var(--background);
  color: var(--foreground);
}
```

---

## Decision Table

| Question                             | Answer                                                                     |
| ------------------------------------ | -------------------------------------------------------------------------- |
| Tailwind v4 `darkMode` config option | Removed. CSS-first via `@custom-variant dark`                              |
| Default dark mode in v4              | `prefers-color-scheme` — no config needed                                  |
| `@theme inline` inside media query   | Not supported. `@theme` must be top-level                                  |
| shadcn/ui system dark mode           | Replace `.dark {}` with `@media (prefers-color-scheme: dark) { :root {} }` |
| Official shadcn/ui pattern           | None; community workaround is stable                                       |
| Upgrade to manual toggle             | Add `@custom-variant dark` + `.dark {}` block + `:not(.light)` guard       |
| WKWebView / macOS                    | Works; requires `color-scheme: light dark` on `:root`                      |
| Dynamic updates in WKWebView         | Yes — immediate, no JS needed                                              |
| Tauri window `theme` config          | Only affects OS chrome, NOT webview `prefers-color-scheme` on macOS        |

---

## Sources

- [Tailwind CSS Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
- [Tailwind CSS Theme Variables](https://tailwindcss.com/docs/theme)
- [Tailwind Discussion #15083](https://github.com/tailwindlabs/tailwindcss/discussions/15083)
- [shadcn/ui Tailwind v4 Docs](https://ui.shadcn.com/docs/tailwind-v4)
- [shadcn/ui Issue #1125](https://github.com/shadcn-ui/ui/issues/1125)
- [useyourloaf.com — WKWebView Dark Mode](https://useyourloaf.com/blog/supporting-dark-mode-in-wkwebview/)
- [wry Issue #806](https://github.com/tauri-apps/wry/issues/806)
- [Tauri Issue #5802](https://github.com/tauri-apps/tauri/issues/5802)
