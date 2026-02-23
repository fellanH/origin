# origin — Long-Term Roadmap Research Brief

**Researched:** 2026-02-23
**Scope:** Five strategic topic areas for post-MVP development
**Audience:** Solo developer, macOS-first, Tauri 2 + React 19 + Vite 7

---

## Table of Contents

1. [Runtime Plugin Loading in Tauri](#1-runtime-plugin-loading-in-tauri)
2. [Local-First Sync Options](#2-local-first-sync-options)
3. [Auto-Update and Distribution](#3-auto-update-and-distribution)
4. [Plugin Marketplace Architecture](#4-plugin-marketplace-architecture)
5. [Inter-Plugin Communication](#5-inter-plugin-communication)
6. [Decision Summary](#6-decision-summary)

---

## 1. Runtime Plugin Loading in Tauri

### The Problem

The v1 architecture uses Vite build-time dynamic imports. All plugins are bundled at compile time — adding a plugin requires a full rebuild. This is intentional for v1 but architecturally incompatible with any runtime install story.

### Viable Approaches

#### 1A. Import Map + Custom URI Scheme `plugin://` (RECOMMENDED)

The cleanest approach for a macOS-only solo project.

**How it works:**

1. User installs a plugin (via npm, or a future UI)
2. Plugin is built to a lib bundle (`vite build --mode lib` → `dist/index.js`)
3. Plugin registered in `tauri-plugin-store` (id, name, path, manifest)
4. At app startup, Rust reads the plugin registry and generates an import map:
   ```json
   {
     "imports": {
       "com.origin.clock": "plugin://com.origin.clock/index.js",
       "com.origin.todo": "plugin://com.origin.todo/index.js"
     }
   }
   ```
5. Import map injected into webview HTML via `on_webview_ready` before first load
6. Webview calls `import("com.origin.clock")` — resolved by import map to the `plugin://` scheme
7. Rust URI scheme handler (`register_uri_scheme_protocol`) reads the plugin JS from AppData and returns it

**Security:** No open network port. The `plugin://` scheme is served exclusively by the Tauri Rust process. CSP update required:

```json
"csp": "default-src 'self'; script-src 'self' plugin:; style-src 'self' 'unsafe-inline'"
```

**Status:** `register_uri_scheme_protocol` is a stable Tauri v2 API. The import map approach is a browser-native feature (Chrome 89+, Safari 16.4+ — fully covered on macOS Ventura+). No third-party libraries required.

**Gotcha:** Vite resolves all bare specifiers at build time and does not pass import maps through. This approach bypasses Vite's module graph entirely for runtime-loaded plugins — which is exactly what you want. Build-time plugins (v1) continue to use Vite dynamic import; runtime plugins use the import map.

#### 1B. Embedded Axum HTTP Server

Alternative to the URI scheme. Run an `axum` Tokio task inside the Tauri Rust process that serves installed plugin directories over `http://localhost:{random_port}`.

**Pros:** Works with standard `fetch()` and native `import()`. No CORS issues when port is the same origin as `tauri-plugin-localhost`.

**Cons:** The Tauri docs explicitly warn: "This plugin brings considerable security risks." Any local process on the machine can hit the server. For a solo developer tool this is an acceptable tradeoff, but it is a real risk if the user has other software on their machine.

**Use this over 1A if:** You need `fetch()` calls from plugins to relative plugin assets (images, WASM). The URI scheme handler requires explicit routing for each asset type, whereas localhost serves the whole directory tree.

#### 1C. Module Federation (`@module-federation/vite`)

**Avoid for this project.** Module Federation is designed for web micro-frontends over HTTP. In Tauri's `tauri://localhost` environment it adds CSP and CORS complexity with no benefit over the import map approach. The `@module-federation/vite` package (v1.11.0, actively maintained) is the correct choice if you go this route — do NOT use `@originjs/vite-plugin-federation` (abandoned, last update April 2025).

**Relevant caveat:** `@module-federation/vite` has a known incompatibility with TanStack Router v1.121+ (issue #4516). Not a concern for this project currently.

#### 1D. WASM Sandboxing (Zed Model)

**Powerful but heavyweight.** Zed uses this for its extension system:

- Extensions are written in Rust, compiled to `wasm32-wasip1`
- Wasmtime provides a sandboxed runtime inside the Rust process
- WIT (WebAssembly Interface Types) defines the API boundary
- The `wit_bindgen` crate generates type-safe host/guest bindings

**For origin specifically:** This model works for non-UI logic (parsers, data processors, background services) but cannot render React components. You would need a hybrid approach: WASM for logic + React host component for rendering. This is significantly more complex than the import map approach.

**Risk for a solo developer:** HIGH. Requires authoring WIT interfaces, managing Wasmtime, and building a separate plugin compilation toolchain. The payoff — true process isolation — is real but may be premature for a v2 scope.

**Recommendation:** Evaluate WASM sandboxing for v3+ if the plugin ecosystem grows and untrusted third-party plugins become a concern. For v2, use 1A.

### Sandboxing and Isolation

**What Tauri provides today:**

- **Capabilities system** — permissions are scoped to windows/webviews by label. If you run each plugin in its own `WebviewWindow`, you can give it a capability file that only allows the specific Tauri commands it needs (e.g., only `fs:read` to its own plugin directory). This is the most actionable isolation tool available in Tauri v2 today.
- **Isolation Pattern** — an `<iframe>` that intercepts all IPC calls from the frontend and validates/encrypts them before they reach Tauri Core. This helps against malicious plugin code making unexpected IPC calls, but is not a complete sandbox.

**What Tauri does NOT provide:**

- Plugin-to-plugin process isolation (all plugins in the same webview run in the same JS context)
- Memory isolation between plugins in the same window
- Network isolation per plugin (the `#5755` issue requesting per-webview network sandboxing has been open since 2022 with no resolution)

**Practical architecture for origin v2:**

For trusted first-party or reviewed third-party plugins, the capabilities system is sufficient. For untrusted arbitrary plugins, the only real option is a separate `WebviewWindow` per plugin, each with a scoped capability file. This is architecturally heavier (multiple webviews instead of React components in a shared webview) and complicates the panel layout model.

**Verdict:** Unless origin becomes a public extension marketplace with untrusted submissions, JS-in-the-same-webview with `ErrorBoundary` isolation (current v1 approach) is appropriate. Upgrade to per-webview isolation when — and only if — the trust model demands it.

### Prior Art and References

- Tauri Isolation Pattern: https://v2.tauri.app/concept/inter-process-communication/isolation/
- Tauri Capabilities: https://v2.tauri.app/security/capabilities/
- Tauri custom URI scheme discussion: https://github.com/orgs/tauri-apps/discussions/5597
- Tauri per-webview network sandbox issue (open): https://github.com/tauri-apps/tauri/issues/5755
- Zed WASM extension architecture: https://zed.dev/blog/zed-decoded-extensions
- Import maps (no shim needed in macOS Ventura+): https://www.mercedes-benz.io/blog/2023-01-05-you-might-not-need-module-federation-orchestrate-your-microfrontends-at-runtime-with-import-maps
- `vite-plugin-loading.md` (local, previously researched)

---

## 2. Local-First Sync Options

### Context

The MVP is a single-device app. "Sync" means: workspaces and saved configs available on a second Mac (e.g., personal + work machine). This is a future concern, not v1 or v2. The current persistence layer (`@tauri-store/zustand`, writing JSON to `~/Library/Application Support/`) is not sync-aware.

### Options Ranked for This Use Case

#### 2A. No Sync — iCloud Drive / File Sync (MVP-Viable Workaround)

The simplest path that requires zero code: change the storage path to a location inside `~/Library/Mobile Documents/` (iCloud Drive container). Apple's iCloud sync handles the rest. The user must have iCloud Drive enabled.

**Pros:** Zero implementation cost. Works for single-user across devices.
**Cons:** Not available on non-Apple platforms. Requires user to configure it. Not a product feature — it is a file path change. Conflict resolution is file-level only (last-write-wins).
**Recommendation:** Offer this as a documented config option for v1.5 while you evaluate real sync.

#### 2B. Automerge (RECOMMENDED for v2 sync)

Automerge 3.0 (released August 2025) is a significant improvement over v2:

- Memory reduced from ~700MB to ~1.3MB for large document histories (10x–100x improvement)
- Documents that previously took 17 hours to load now open in 9 seconds
- The in-memory format now matches the on-disk columnar compression format
- Backwards-compatible file format with Automerge 2
- Available as an npm package with WASM bindings — works in a Tauri webview

**For note:** Each `Workspace` is a good unit of an Automerge document. The flat `NodeMap` serializes naturally as an Automerge `Map`. Saved configs are Automerge `List` entries.

**Sync transport:** Automerge Repo handles synchronization. For a solo two-device setup, a simple relay server (a free Fly.io instance or a GitHub Gist used as a sync point) is sufficient. The Automerge sync protocol is delta-based — only changes are transmitted.

**Integration with current architecture:**

- Replace `@tauri-store/zustand` file backend with an Automerge document stored in AppData
- Automerge mutations replace Immer mutations in the Zustand store (or wrap them)
- Sync is an opt-in feature that kicks in when a relay is configured

**Risk:** Moderate. Automerge's JS/WASM bundle adds ~300KB to the app. The API is actively changing (3.0 just released). For a solo developer, the learning curve is real but manageable given the 3.0 improvements to ergonomics.

#### 2C. Yjs

Yjs is the most widely deployed CRDT library in production (Notion, Liveblocks, many others). It is faster than Automerge for text-heavy workloads and has better garbage collection.

**For note:** The data model (panel topology, plugin assignments) is not text-heavy. Yjs's strength is in `YText` collaborative editing. For JSON-shaped workspace state, Automerge's document model maps more naturally.

**Verdict:** Use Automerge unless you add a text-editing plugin that needs real-time collaboration — then add Yjs specifically for that plugin's state.

#### 2D. Loro

An emerging Rust-native CRDT library. Native Rust crate (`loro`) + JS/WASM bindings (`loro-crdt` on npm). Performance benchmarks show it is faster than Automerge and Yjs on JSON document operations.

**Status:** Actively developed, but not as battle-tested as Automerge or Yjs. The API has changed between versions. Not yet recommended for a solo developer who needs stability.
**Revisit:** If it reaches 1.0 and stabilizes, Loro's Rust integration would be ideal for Tauri — you could use it from both the Rust backend and the JS frontend with the same data model.

#### 2E. cr-sqlite

Adds CRDT semantics to SQLite tables. Works on macOS desktop, has JS bindings, and is commercially backed (Turso, Fly.io). Insert performance is 2.5x slower than standard SQLite; read performance is identical.

**For note:** The workspace state is not relational — it is a flat JSON document tree. Fitting it into SQLite schema for CRDT sync adds complexity without a clear advantage over Automerge. More appropriate if the app evolves to include relational data (e.g., a notes database, a task list) where SQLite's query capabilities matter.

**Risk:** Moderate. Event log replication (v2 feature) is still incomplete. The WASM build is available but loading SQLite extensions inside Tauri's webview adds an unusual dependency chain. Skip for a workspace config sync use case.

#### 2F. PowerSync / ElectricSQL

These are Postgres-to-SQLite sync engines designed for teams with a backend server. They are not appropriate for a solo two-device desktop app with no server infrastructure requirement. Skip.

### Recommendation

For a solo macOS app that "might eventually sync":

1. **v1 / v1.5:** Do nothing. Optionally document the iCloud Drive path trick.
2. **v2 sync:** Adopt Automerge 3.0. The 10x memory reduction makes it practical. Use Automerge Repo for the sync layer with a minimal relay server.
3. **Future:** If the app becomes multi-user or adds collaborative features, re-evaluate Yjs (for text) or Loro (for performance).

### References

- Automerge 3.0 release post: https://automerge.org/blog/automerge-3/
- Automerge 3.0 HN discussion: https://news.ycombinator.com/item?id=44777086
- Automerge Repo (batteries-included sync): https://automerge.org/blog/automerge-repo/
- cr-sqlite GitHub: https://github.com/vlcn-io/cr-sqlite
- Loro: https://loro.dev/
- Best CRDT Libraries 2025 (Velt roundup): https://velt.dev/blog/best-crdt-libraries-real-time-data-sync
- "Why Cinapse moved away from CRDTs" (when NOT to use them): https://www.powersync.com/blog/why-cinapse-moved-away-from-crdts-for-sync

---

## 3. Auto-Update and Distribution

### 3A. Tauri v2 Built-In Updater

`tauri-plugin-updater` is the official first-party solution. It is production-ready and well-documented.

**How it works:**

1. Generate a signing keypair: `tauri signer generate`
   - Public key → `tauri.conf.json` `plugins.updater.pubkey`
   - Private key → CI/CD secret (`TAURI_SIGNING_PRIVATE_KEY`)
2. Build with the private key in env — Tauri produces `.tar.gz` + `.sig` signature files alongside the `.dmg`
3. The app calls `check()` at startup, passing `{{current_version}}`, `{{target}}`, `{{arch}}` in the endpoint URL
4. The update server responds with either `204 No Content` (no update) or JSON with version, platform URLs, and signatures
5. The app calls `downloadAndInstall()` with progress callbacks

**Static JSON approach (recommended for solo developer):**

No server needed. Use GitHub Releases as the CDN.

```
tauri.conf.json endpoint:
"https://github.com/<user>/note/releases/latest/download/latest.json"
```

The `latest.json` file uploaded to each GitHub Release:

```json
{
  "version": "v1.2.0",
  "notes": "What changed",
  "pub_date": "2026-03-01T00:00:00Z",
  "platforms": {
    "darwin-aarch64": {
      "url": "https://github.com/fellanH/origin/releases/download/v1.2.0/origin_1.2.0_aarch64.app.tar.gz",
      "signature": "<contents of .sig file>"
    },
    "darwin-x86_64": {
      "url": "https://github.com/fellanH/origin/releases/download/v1.2.0/origin_1.2.0_x86_64.app.tar.gz",
      "signature": "<contents of .sig file>"
    }
  }
}
```

**GitHub Actions automation:** `tauri-apps/tauri-action` generates and uploads this file automatically on tag push. Set `createUpdaterArtifacts: true` in `tauri.conf.json` to have the build system produce the required artifacts.

**tauri.conf.json updater config:**

```json
{
  "plugins": {
    "updater": {
      "pubkey": "YOUR_PUBLIC_KEY",
      "endpoints": [
        "https://github.com/fellanH/origin/releases/latest/download/latest.json"
      ],
      "dialog": true
    }
  }
}
```

**Known issue:** Static JSON format requires all platforms to be present in the manifest — it validates completely before checking version. If you only ship macOS, this is fine. The `[bug] Updater by static-json-file return "Could not fetch a valid release JSON from the remote"` error (plugins-workspace #2610) is typically caused by a malformed `latest.json` or missing signatures.

### 3B. macOS Code Signing and Notarization

**Requirements:**

- Apple Developer Program membership: **$99/year, paid tier required**. Free accounts cannot notarize — users get "app is damaged" warnings on macOS Gatekeeper.
- Certificate type: **Developer ID Application** (not "Apple Distribution" which is for App Store)
- Only the account holder can create Developer ID certificates

**Entitlements — CRITICAL for Tauri:**

Tauri's WebView requires JIT compilation. Without these entitlements, the app will crash after notarization:

```xml
<!-- Entitlements.plist -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>com.apple.security.cs.allow-jit</key>
  <true/>
  <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
  <true/>
</dict>
</plist>
```

Reference `Entitlements.plist` in `tauri.conf.json`:

```json
{
  "bundle": {
    "macOS": {
      "entitlements": "./Entitlements.plist",
      "signingIdentity": "Developer ID Application: Felix Hellstrom (TEAMID)"
    }
  }
}
```

**Process:** Code signing → notarization are separate steps. Tauri handles both when the environment variables are set. Notarization uploads the signed binary to Apple's servers for automated malware scanning. Typical turnaround: 2–5 minutes; can reach 15–20 minutes. Set CI timeout accordingly.

**Authentication options:**

- Apple ID + app-specific password (simpler for solo dev)
- App Store Connect API key (more secure for teams, avoids 2FA friction in CI)

### 3C. GitHub Actions Release Pipeline

Recommended workflow for `fellanH/origin`:

**Trigger:** Push a tag `v*`

**Build matrix:**

- `aarch64-apple-darwin` (Apple Silicon)
- `x86_64-apple-darwin` (Intel, for compatibility / Rosetta users)

**Required GitHub Secrets:**
| Secret | Value |
|---|---|
| `APPLE_CERTIFICATE` | Base64-encoded `.p12` export |
| `APPLE_CERTIFICATE_PASSWORD` | Password for the `.p12` |
| `APPLE_SIGNING_IDENTITY` | `"Developer ID Application: Your Name (TEAMID)"` |
| `APPLE_TEAM_ID` | 10-character Apple Team ID |
| `APPLE_ID` | Apple account email |
| `APPLE_PASSWORD` | App-specific password (not your Apple ID password) |
| `TAURI_SIGNING_PRIVATE_KEY` | Output of `tauri signer generate` |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | Password for the private key |

**Workflow steps:**

1. Certificate import to temporary keychain
2. `tauri-apps/tauri-action` — builds, signs, notarizes, uploads `.dmg` + `.app.tar.gz` + `.sig` to draft GitHub Release
3. Upload `latest.json` to the release assets
4. Publish release (or keep as draft for manual review)

Setting `releaseDraft: true` in `tauri-action` lets you review before making it public.

**Reference workflows:**

- Part 1 (code signing): https://dev.to/tomtomdu73/ship-your-tauri-v2-app-like-a-pro-code-signing-for-macos-and-windows-part-12-3o9n
- Part 2 (GitHub Actions): https://dev.to/tomtomdu73/ship-your-tauri-v2-app-like-a-pro-github-actions-and-release-automation-part-22-2ef7
- Full pipeline + Homebrew: https://dev.to/massi_24/shipping-a-production-macos-app-with-tauri-20-code-signing-notarization-and-homebrew-mc3

### 3D. Distribution Outside the Mac App Store

**DMG:** Standard approach. `tauri build --bundles dmg` produces a signed `.dmg` with a drag-to-Applications installer. This is what gets uploaded to GitHub Releases.

**Homebrew Cask:** The developer-first distribution channel on macOS.

1. Create a GitHub repo named `homebrew-origin` (your personal tap)
2. Add a cask formula:
   ```ruby
   cask "origin" do
     version "1.0.0"
     sha256 arm:   "...",
            intel: "..."
     url "https://github.com/fellanH/origin/releases/download/v#{version}/origin_#{version}_aarch64.dmg",
         verified: "github.com/fellanH/origin/"
     name "origin"
     desc "Dynamic split-panel dashboard"
     homepage "https://github.com/fellanH/origin"
     app "origin.app"
     zap trash: [
       "~/Library/Application Support/com.klarhimmel.origin",
       "~/Library/Preferences/com.klarhimmel.origin.plist",
     ]
   end
   ```
3. Users install via: `brew install --cask fellanH/origin/origin`
4. Update SHA256 hashes in the formula on each release (automate via GitHub Actions)

For inclusion in `homebrew-cask` (the official repo, enabling `brew install --cask origin` without the tap), the app must demonstrate sufficient adoption. Start with a personal tap; submit to Homebrew Core once you have users.

**Certificate expiration:** Developer ID certs are valid for 5 years. Set a calendar reminder before expiry — a lapsed cert will break notarization for any new builds.

---

## 4. Plugin Marketplace Architecture

### What "Marketplace" Means for origin

Three possible scopes, from minimal to full:

| Scope                        | Description                                                                  | Effort    |
| ---------------------------- | ---------------------------------------------------------------------------- | --------- |
| **A: Curated list**          | A README or website listing community plugins with install instructions      | Near-zero |
| **B: In-app discovery**      | Browse and install plugins from within the app, plugins hosted on GitHub/npm | Medium    |
| **C: Full registry + store** | Hosted registry API, submission review, in-app search + one-click install    | High      |

For a solo developer, Scope A or B is appropriate. Scope C is Raycast-scale engineering.

### Raycast's Architecture (Reference)

Raycast manages extensions via a centralized GitHub monorepo (`raycast/extensions`). All public extensions live as subdirectories. Publishing is a PR to that repo — Raycast's CI compiles and bundles the extension, then publishes it to their internal CDN. The `@raycast/api` npm package provides the extension API. Discovery happens through raycast.com/store.

**What makes this work for Raycast but expensive for others:**

- Every extension is compiled and hosted by Raycast themselves (they control quality)
- A dedicated team reviews PRs and manages the store
- The API surface is stable enough that breaking changes are rare

**Key insight:** Raycast's model is a GitHub-based submission pipeline, not a custom registry. The "marketplace" is a GitHub repo + a CDN.

### Minimal Viable Architecture for origin (Scope B)

**Discovery:** A `community` branch or subdirectory in `github.com/fellanH/origin-plugins` (or a separate `origin-community-plugins` org). Each plugin is a directory with a `plugin.json` manifest. A statically-generated JSON index (generated by GitHub Actions on merge) serves as the registry.

**Registry format:**

```json
{
  "plugins": [
    {
      "id": "com.origin.clock",
      "name": "Clock",
      "description": "Shows current time",
      "author": "fellanH",
      "version": "1.0.0",
      "npm": "@origin/clock",
      "github": "https://github.com/fellanH/origin-clock",
      "icon": "🕐"
    }
  ]
}
```

**Install flow:**

1. In-app: User opens plugin browser → fetches registry JSON → displays list
2. User clicks Install
3. Tauri backend: `tauri-plugin-shell` runs `npm install <package>` in the plugins directory
4. Post-install hook (npm `postinstall` script): `vite build --mode lib` — builds the plugin to `dist/index.js`
5. Plugin registered in `tauri-plugin-store`
6. App prompts for restart (or hot-reloads if you implement the import map injection at runtime)

**npm registry approach:** Publish plugins to npm under a `@origin-plugin/` scope or a naming convention like `origin-plugin-*`. This gives you npm's CDN for distribution without a custom server. The in-app registry JSON simply maps plugin IDs to npm package names.

**Security consideration for install-time:** Running `npm install` via `tauri-plugin-shell` executes arbitrary code (npm install scripts). This is the same risk as installing any npm package. For a developer-targeted tool, this is acceptable. For a general consumer app, it is not.

**Known risk: `live-plugin-manager`** — there is an npm package (`live-plugin-manager`) designed for exactly this use case (install and load npm packages at runtime in Node.js). It uses a VM sandbox. However, this is a Node.js solution and does not apply to the Tauri webview context. Do not use it in this project.

### Submission Pipeline for Community Plugins

Modeled on Raycast and VS Code's Open VSX:

1. Plugin author creates a repo with a specific `package.json` structure
2. Author submits a PR to `origin-plugins` adding their `plugin.json` entry
3. CI validates: manifest schema, builds successfully, no obviously malicious code
4. Merged → registry JSON regenerated and deployed to GitHub Pages

This is low-tech but effective. GitHub Actions does the automation; GitHub Pages hosts the registry JSON.

### References

- Raycast extensions monorepo: https://github.com/raycast/extensions
- Raycast `@raycast/api` on npm: https://www.npmjs.com/package/@raycast/api
- VS Code Open VSX Registry (open source alternative registry): https://github.com/coder/code-marketplace
- `live-plugin-manager` (Node.js only, not applicable): https://github.com/davideicardi/live-plugin-manager

---

## 5. Inter-Plugin Communication

### Current State

Plugins are React components receiving a `PluginContext` prop. They share nothing with each other. The only shared state is the `WorkspaceStore` — but plugins do not (and should not) have direct access to it.

### Patterns Ranked by Complexity

#### 5A. Shared Zustand Store Slice (RECOMMENDED for v2)

Add a `pluginBus` slice to the workspace store — a typed message bus backed by Zustand state:

```typescript
// store/pluginBusSlice.ts

interface PluginBusSlice {
  // Keyed by channel name; value is the last message payload
  channels: Record<string, unknown>;
  publish(channel: string, payload: unknown): void;
  subscribe(channel: string): unknown; // called via useWorkspaceStore selector
}
```

**Pattern:**

- Plugin A publishes: `publish("origin:selected-date", { date: "2026-03-01" })`
- Plugin B subscribes: `const date = useWorkspaceStore(s => s.channels["origin:selected-date"])`
- Plugin B re-renders when the value changes (standard Zustand reactivity)

**Pros:** Zero new infrastructure. Works today. Type-safe if you define channel schemas. Persisted automatically via `@tauri-store/zustand` (though you probably want to exclude ephemeral messages via `filterKeys`).

**Cons:** Only suitable for "last known value" semantics (state, not event stream). If Plugin A publishes two messages in quick succession, Plugin B only sees the last one. This is fine for most dashboard use cases (selected date, active item, theme) but not for event streams.

#### 5B. In-Process Event Bus (for event streams)

A simple pub/sub singleton in JavaScript — no Zustand, no Tauri:

```typescript
// lib/eventBus.ts

type Handler<T> = (payload: T) => void;

class EventBus {
  private listeners = new Map<string, Set<Handler<unknown>>>();

  emit<T>(channel: string, payload: T) {
    this.listeners.get(channel)?.forEach((fn) => fn(payload as unknown));
  }

  on<T>(channel: string, handler: Handler<T>) {
    if (!this.listeners.has(channel)) this.listeners.set(channel, new Set());
    this.listeners.get(channel)!.add(handler as Handler<unknown>);
    return () =>
      this.listeners.get(channel)?.delete(handler as Handler<unknown>);
  }
}

export const bus = new EventBus();
```

Expose via `PluginContext`:

```typescript
interface PluginContext {
  panelId: string;
  workspacePath: string;
  theme: "light" | "dark";
  bus: EventBus; // add this in v2
}
```

**Pros:** Event semantics (every emission is received, not just the last). Zero external dependencies. Works across plugins in the same webview.

**Cons:** No persistence. No cross-window support (if you ever add multiple windows). Memory leak risk if `on()` subscriptions are not cleaned up on plugin unmount.

**Use this alongside 5A:** Use the Zustand bus for state (last-value semantics), use the EventBus for events (fire-and-forget notifications like "panel A was resized", "user performed action X").

#### 5C. Tauri Events (`emit` / `listen`)

Tauri's built-in event system provides `emit()` and `listen()` for Rust↔Frontend and Frontend↔Frontend communication.

**Frontend-to-frontend:**

```typescript
import { emit, listen } from "@tauri-apps/api/event";

// Plugin A
await emit("origin://plugin-event", {
  channel: "selected-date",
  payload: "2026-03-01",
});

// Plugin B
const unlisten = await listen("origin://plugin-event", (event) => {
  console.log(event.payload);
});
```

**Pros:** Works across multiple webview windows (if you ever add those). Bidirectional (Rust can also send events to the frontend). Built-in to Tauri — no additional code.

**Cons:** Payloads are JSON strings — no compile-time type safety without wrapping. Documented as "not suitable for sending a large amount of data" (Tauri uses JS eval under the hood). Adds async overhead vs an in-process bus. No capability system scoping — any plugin can listen to any event.

**Use for:** Cross-window scenarios (e.g., a floating plugin window communicating back to the main panel), or Rust→plugin notifications. Not the right tool for in-panel plugin-to-plugin state sharing.

#### 5D. BroadcastChannel (web standard)

`BroadcastChannel` works between windows in the same app. Simpler API than Tauri events for same-origin windows.

**Caveat (macOS specific):** BroadcastChannel requires Safari 15.6+, which means macOS Monterey or later. macOS Ventura (12.0) as a minimum target covers this. Verify against your minimum OS target.

**Not recommended as primary bus** — use the Zustand slice (5A) or EventBus (5B) instead. BroadcastChannel only adds value if you have multiple webview windows.

### Channel Naming Convention

Regardless of which pattern, establish a namespaced channel naming convention before any plugins are published:

```
origin:<domain>/<action>
com.origin.hello:selected-item
com.klarhimmel.origin:workspace-changed
```

Reserve `origin:` for core app events. Plugin authors use their plugin ID as the namespace prefix.

### Summary

For v2, implement both 5A and 5B:

1. **Zustand `pluginBus` slice** for shared state (current selection, active items, user settings that span panels)
2. **In-process EventBus** on `PluginContext` for event streams (notifications, ephemeral actions)
3. **Tauri events** only when cross-window communication becomes necessary

### References

- Tauri event system reference: https://v2.tauri.app/reference/javascript/api/namespaceevent/
- Tauri: Calling the frontend from Rust: https://v2.tauri.app/develop/calling-frontend/
- EventBus pattern in React: https://medium.com/@ilham.abdillah.alhamdi/eventbus-pattern-in-react-a-lightweight-alternative-to-context-and-redux-cc6e8a1dc9ca
- BroadcastChannel MDN: https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel

---

## 6. Decision Summary

### By Priority for a Solo Developer

| Topic                       | Recommended Path                               | Risk   | Complexity | When                             |
| --------------------------- | ---------------------------------------------- | ------ | ---------- | -------------------------------- |
| Runtime plugin loading      | Import map + `plugin://` URI scheme            | Low    | Medium     | v2                               |
| Plugin sandboxing           | Capabilities + ErrorBoundary (current)         | Medium | Low        | v2                               |
| Deeper sandboxing           | Per-webview window + scoped capabilities       | Medium | High       | v3                               |
| WASM sandboxing (Zed model) | Skip until untrusted plugin ecosystem          | High   | Very High  | v4+                              |
| Sync                        | Automerge 3.0 + minimal relay                  | Medium | Medium     | v2                               |
| Auto-updates                | Tauri updater + static JSON on GitHub Releases | Low    | Low        | Before first public release      |
| macOS signing/notarization  | Developer ID + $99 membership + GitHub Actions | Low    | Medium     | Before first public release      |
| Distribution                | GitHub Releases DMG + personal Homebrew tap    | Low    | Low        | v1 public release                |
| Plugin discovery            | Static registry JSON on GitHub Pages           | Low    | Low        | After 3+ community plugins exist |
| Plugin communication        | Zustand slice + in-process EventBus            | Low    | Low        | v2                               |

### Flagged Risks for a Solo Developer

1. **WASM sandboxing (Wasmtime + WIT):** Extremely high implementation cost. Zero prior art in Tauri apps. Deferred indefinitely unless the plugin ecosystem demands it.
2. **cr-sqlite:** CRDT types incomplete, event log replication unfinished, niche use case for this data model. Skip.
3. **@originjs/vite-plugin-federation:** Abandoned. Do not use.
4. **`tauri-plugin-localhost`:** Official but explicitly carries a security warning (any local process can hit the server). Use `plugin://` URI scheme instead.
5. **Module Federation in Tauri:** Adds CSP/CORS complexity for no benefit over import maps. Avoid.
6. **Per-webview window isolation per plugin:** Technically possible but breaks the single-webview React panel model that the entire layout system is built on. Revisit only if trust model demands it.
7. **Automerge (sync):** 3.0 is a major improvement but the API surface is still evolving. Pin a version and test before committing to it as the sync layer.
