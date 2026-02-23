# Vite Runtime Plugin Loading Research — February 2026

**Researched:** 2026-02-23

---

## The Core Problem

The spec's v1 uses Vite static dynamic imports (build-time bundled). v2 needs runtime loading — install an npm plugin and load it without rebuilding the app. These two models are **architecturally incompatible**.

---

## Library Landscape

### `@module-federation/vite` (recommended if using MF)

- **Version:** 1.11.0 (2026-01-30) — 11 releases in January 2026 alone
- **Maintained by:** Module Federation team (official, same org as Webpack MF)
- **Architecture:** Native Federation using `remoteEntry.json` manifests (not `.js`)
- **Runtime:** `@module-federation/runtime` handles dynamic remote loading
- **NOT interoperable with Webpack Module Federation** — different manifest format

**Caveats:**

- Designed for web micro-frontends over HTTP. Tauri's `tauri://localhost` custom protocol adds CSP and CORS complexity
- No documented production cases in Tauri apps
- TanStack Router v1.121+ has known breakage (issue #4516)
- `moduleParseTimeout` defaults to 10s — can be slow on startup

### `@originjs/vite-plugin-federation` (avoid for new projects)

- **Version:** 1.4.1 (2025-04-12) — no activity since
- **Status:** Maintenance limbo. Community asking if abandoned (issue #597)
- Only relevant if you need Webpack ↔ Vite interop. Use `@module-federation/vite` otherwise.

---

## Alternatives to Module Federation

### Import Maps (strong candidate for Tauri)

Native browser feature. An import map defines `"my-plugin" → "http://localhost:9001/index.js"`. Call `import("my-plugin")` and the browser resolves to the URL.

- No shim needed for modern targets (Chrome 89+, Safari 16.4+)
- Fully dynamic: regenerate the import map at runtime when plugins are installed
- **Vite problem:** Vite resolves all bare specifiers at build time and does not pass import maps through. Use `vite-plugin-import-maps` to inject maps into built HTML, but you lose Vite's module graph for those imports.
- **Best fit for Tauri:** Generate import map in Rust at app startup from installed plugin metadata → inject into webview HTML before load

### ESM CDN (esm.sh, jspm)

Not suitable for a local-first desktop app. Network dependency is a hard constraint. Only viable if self-hosting an `esm.sh` instance locally. Skip.

---

## Tauri-Specific Patterns

### `tauri-plugin-localhost` (official)

Replaces `tauri://` custom protocol with `http://localhost:{port}`. Enables standard `fetch()` and `import()` calls to sibling paths with no CSP complications.

**Security warning (from Tauri docs):** "This plugin brings considerable security risks." Any local process can reach the server. Use only if you understand the tradeoff.

```rust
let port = portpicker::pick_unused_port().unwrap();
tauri::Builder::default()
    .plugin(tauri_plugin_localhost::Builder::new(port).build())
```

### Custom URI Scheme (`register_uri_scheme_protocol`)

Register `plugin://` in Rust. The handler reads plugin JS from the install directory and serves it to the webview. No open network port.

```rust
.register_uri_scheme_protocol("plugin", |app, request| {
    // read plugin file from AppData, return ResponseBuilder
})
```

CSP must allowlist `plugin:` in `script-src`:

```json
"csp": "script-src 'self' plugin:"
```

This is the **most secure** pattern. Recommended for v2 plugin loading.

### Embedded axum HTTP Server (best UX balance)

Spawn an `axum` server in a Tokio task inside the Tauri Rust process. Plugins installed to `AppData` are served from this server. The webview fetches plugin chunks from `http://localhost:{random_port}`.

- Avoids separate sidecar binary
- Compatible with native `import()` and import maps
- `portpicker` crate finds an unused port

---

## Recommended v2 Plugin Architecture

```
1. User installs plugin
   → npm install <plugin> (via tauri-plugin-shell)
   → plugin post-install hook: vite build --mode lib → dist/index.js
   → Plugin registered in tauri-plugin-store (id, path, manifest)

2. App starts
   → Rust reads plugin registry
   → Generates import map: { "plugin-id": "http://localhost:PORT/plugins/plugin-id/index.js" }
   → Injects import map into webview HTML before first load
   → Axum server serves all installed plugin dirs

3. Panel needs a plugin
   → import("plugin-id")  // resolved by import map
   → Module loaded from axum server at runtime, no app rebuild
```

This avoids Module Federation complexity while being fully runtime-dynamic.

---

## CSP Considerations for Module Federation

- **Production builds:** `@module-federation/vite` does NOT require `unsafe-eval` — uses dynamic `import()`, not `eval()`.
- **Dev mode:** Webpack devtool configuration, not MF itself, is the `unsafe-eval` source. Fix: use `devtool: 'source-map'` in dev config.
- **Remote URLs in CSP:** Must allowlist remote chunk origins in `script-src` and `connect-src`.
- **Nonce injection conflict:** Tauri injects CSP nonces at compile time. Dynamically loaded remote scripts don't get nonces. Workaround: hash-based allowlisting or use `tauri-plugin-localhost` to run on a standard origin.

---

## Sources

- https://github.com/module-federation/vite
- https://www.npmjs.com/package/@module-federation/vite
- https://module-federation.io/guide/basic/vite
- https://github.com/originjs/vite-plugin-federation/issues/597
- https://v2.tauri.app/plugin/localhost/
- https://www.mercedes-benz.io/blog/2023-01-05-you-might-not-need-module-federation-orchestrate-your-microfrontends-at-runtime-with-import-maps
- https://module-federation.io/guide/basic/runtime.html
- https://github.com/module-federation/core/issues/2631
- https://v2.tauri.app/security/csp/
