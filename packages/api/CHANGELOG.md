# Changelog — @origin-cards/api

All notable changes to this package are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.7.0] — 2026-02-25

Issue: #146

### Added

- `PluginContext.invoke<T>(command, args?)` — proxy a Tauri command through the
  shell. Implemented in `@origin/sdk` via the `ORIGIN_INVOKE` / `ORIGIN_INVOKE_RESULT`
  / `ORIGIN_INVOKE_ERROR` postMessage protocol. The plugin must declare the
  required capability in `PluginManifest.requiredCapabilities`; the shell rejects
  calls for undeclared capabilities.
- `PluginContext.onEvent(event, args, handler)` — subscribe to a named
  host-push event stream (e.g. `"pty:data"`). Implemented in `@origin/sdk` via
  the `ORIGIN_EVENT_SUBSCRIBE` / `ORIGIN_EVENT` / `ORIGIN_EVENT_UNSUBSCRIBE`
  postMessage protocol. Returns an unsubscribe function.
- `@origin/sdk`: `invoke<T>(command, args?)` — standalone function wrapping the
  ORIGIN_INVOKE protocol. Uses `crypto.randomUUID()` for correlation IDs.
  Cleans up the message listener on resolve/reject.
- `@origin/sdk`: `onEvent(event, args, handler)` — standalone function wrapping
  the ORIGIN_EVENT_SUBSCRIBE protocol. Returns a cleanup function that sends
  ORIGIN_EVENT_UNSUBSCRIBE.
- `@origin/sdk`: `useOriginEvent(event, args, handler)` — React hook wrapping
  `onEvent` with `useEffect` cleanup for React plugin components.

---

## [0.6.0] — 2026-02-24

Issue: #141

### Added

- `OriginChannelMap["origin:workspace/active-path"]` — standard channel for
  broadcasting the active workspace path between plugins. Payload:
  `{ path: string; type: "file" | "directory"; source: string }`.
  FileTree publishes on every file/directory click; Monaco subscribes to
  open files automatically. Any plugin may publish or subscribe.

---

## [0.5.0] — 2026-02-24

Issue: #139

### Breaking Changes

- `PluginContext` now requires `config: Record<string, unknown>` and
  `setConfig: (patch: Record<string, unknown>) => void`. All plugin components
  receive these fields automatically from `PluginHost` / `IframePluginHost`;
  no plugin-side changes are required unless the plugin was constructing a
  `PluginContext` manually (e.g. in tests).

### Added

- `PluginContext.config` — per-instance plugin configuration. Persisted
  alongside the card in the workspace store (`CardLeaf.config`). Survives app
  restarts and workspace save/restore. Typed as `Record<string, unknown>`; cast
  individual keys as needed (`context.config.url as string`).
- `PluginContext.setConfig(patch)` — shallow-merges a patch into the card's
  stored config. Equivalent to `setState` in React: existing keys not in the
  patch are preserved.
- `CardLeaf.config?: Record<string, unknown>` — optional field added to the
  card node type. Persisted via the existing `workspaces` key in the Tauri
  store; no migration needed (defaults to `{}`).
- `setPluginConfig(cardId, patch)` store action — internal action used by
  `PluginHost` / `IframePluginHost` to flush config patches into the store.
- `IframePluginContext.config` — added to the postMessage context struct so L1
  plugins receive initial config in `ORIGIN_INIT`.
- New postMessage message types (in `iframeProtocol.ts`):
  - `ORIGIN_CONFIG_SET` (plugin → host): plugin requests a config patch.
  - `ORIGIN_CONFIG_UPDATE` (host → plugin): host pushes a config update after
    an external change (e.g. the same plugin in a second tab).
- `@origin/sdk`: `usePluginContext()` now returns `IframePluginContextWithConfig`
  (extends `IframePluginContext` with `setConfig`). Handles `ORIGIN_CONFIG_UPDATE`
  to keep the iframe context in sync.
- `@origin/github` migrated to use `context.config` / `context.setConfig`
  instead of `readTextFile`/`writeTextFile` for owner/repo persistence.

---

## [0.4.0] — 2026-02-24

Issues: #108, #109

### Breaking Changes

- `PluginBus.publish`, `PluginBus.subscribe`, and `PluginBus.read` are now
  generic over `keyof OriginChannelMap`. Channel names and payload types are
  compile-time checked; passing an unregistered channel name is a type error.
- The module-level `pluginBus` singleton has been removed. Plugins receive a
  workspace-scoped bus via `PluginContext.bus` (injected by `PluginHost`).
  This prevents workspace A events from firing workspace B subscribers.

### Added

- `OriginChannelMap` interface — open-ended channel registry. Plugins extend it
  via declaration merging in their own `channels.d.ts` with no central registry
  overhead. Ships with one built-in channel: `"com.origin.app:theme-changed"`.
- `createPluginBus()` factory function (internal use). Each `Workspace` creates
  its own bus instance. Plugins receive the bus through `PluginContext` and
  should not call this factory directly.

---

## [0.3.0] — 2026-02-24

Issues: #111, #113

### Breaking Changes

- `CardSplit.childIds` widened from `[CardId, CardId]` tuple to `CardId[]`.
  Consumers that destructured exactly two children must be updated.
- `CardSplit.sizes` widened from `[number, number]` tuple to `number[]` to
  match the n-ary `childIds` array.

### Added

- `PluginManifest.requiredCapabilities?: string[]` — declarative capability
  declaration. In v0.x this is display-only (shown in the plugin install UI).
  Enforcement by the capability broker is planned for the v1.0 marketplace
  launch. Example values: `["fs:read", "fs:write", "dialog:open"]`.

---

## [0.2.0] — 2026-02-24

Issue: #114

### Added

- `@origin/sdk` companion package — provides `usePluginContext()` and
  `useBusChannel()` hooks for L1 (sandboxed iframe) plugins. L1 plugins run in
  a cross-origin iframe; the SDK bridges the postMessage boundary so plugin
  authors use the same `PluginContext` API as L0 plugins.
- `PluginLifecycleEvent` union type — `"focus" | "blur" | "resize" | "zoom" | "zoom-exit"`.
- `PluginContext.on(event, handler)` — subscribe to panel lifecycle events;
  returns an unsubscribe function for use in cleanup effects.

---

## [0.1.0] — 2026-02-23

Initial extraction of the plugin type contract from `src/types/plugin.ts` into
a standalone `@origin-cards/api` workspace package.

### Added

- `PluginManifest` — `id`, `name`, `version`, `description?`, `icon?`
- `PluginContext` — `cardId`, `workspacePath`, `theme`, `bus`
- `PluginBus` — `publish`, `subscribe`, `read` (untyped string channels at this
  version; typed in v0.4.0)
- `PluginComponent` — `React.ComponentType<{ context: PluginContext }>`
- `PluginModule` — `{ default: PluginComponent; manifest: PluginManifest }`
- `useBusChannel` hook — convenience wrapper for `PluginBus.subscribe` that
  handles cleanup and re-renders on channel updates

---

[0.7.0]: https://github.com/fellanH/origin/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/fellanH/origin/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/fellanH/origin/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/fellanH/origin/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/fellanH/origin/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/fellanH/origin/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/fellanH/origin/releases/tag/v0.1.0
