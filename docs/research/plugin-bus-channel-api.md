# PluginBus Channel API — Naming Conventions, Standard Channels, and Typed Registry

**Researched:** 2026-02-24
**Status:** Reference Architecture (ADR — blocks inter-plugin communication features)

---

## Overview

The PluginBus is a workspace-scoped pub/sub event bus that enables inter-plugin communication. This document defines the channel naming conventions, standard channels, and the typed registry pattern used to declare new channels without central coordination.

---

## 1. Naming Convention

All channels follow a **reverse-domain** naming scheme with two distinct namespaces:

### Standard Channels: `origin:<domain>/<event>`

Built-in channels defined by the Origin app. Reserved in the `origin:` namespace.

**Format:** `origin:<domain>/<event>`

- **`<domain>`** — functional area (`workspace`, `app`, `editor`, etc.)
- **`<event>`** — specific event name in kebab-case

**Examples:**

- `origin:workspace/active-path` — the user selected a file
- `origin:app/theme-changed` — the app theme switched
- `origin:editor/selection-changed` — text editor selection changed

### Plugin-Owned Channels: `com.plugin.id:channel`

Channels defined by third-party plugins. Use reverse-domain + plugin identifier.

**Format:** `com.<company>.<plugin>:<channel-name>` or `<reverse.domain.plugin>:<channel-name>`

- Must use reverse-domain identifier (app ID convention from PluginManifest)
- Use colon (`:`) to separate ID from channel name
- Channel names are lowercase with hyphens (kebab-case)

**Examples:**

- `com.example.filetree:file-selected`
- `com.notion.sync:page-changed`
- `org.myteam.logger:log-event`

### Why This Split?

- **`origin:` namespace** — reserved by the Origin team; no conflicts possible
- **`com.* and org.*` namespaces** — reverse-domain ensures plugin uniqueness; plugins don't need central registration
- **No runtime enforcement** — v1 is informational; future capability system will enforce (see Capabilities section)

---

## 2. Standard Channels

Standard channels are built-in, guaranteed to exist in every workspace, and documented with full TypeScript payload types.

### `origin:workspace/active-path`

**Fired when:** User selects a file or directory in the file browser or editor.

**Payload:**

```typescript
{
  path: string; // Absolute file path
  type: "file" | "directory";
  source: string; // Plugin ID that initiated the selection (informational)
}
```

**Usage:**

```typescript
// L0 plugin
const onPathSelected = (payload) => {
  console.log(`User selected ${payload.path} (${payload.type})`);
};
context.bus.subscribe("origin:workspace/active-path", onPathSelected);

// L1 plugin (iframe)
const publishPath = useBusChannel("origin:workspace/active-path", (payload) => {
  console.log(`User selected ${payload.path}`);
});
```

---

### `origin:workspace/selection`

**Fired when:** User selects text in an editor or input field.

**Payload:**

```typescript
{
  text: string; // Selected text
  source: string; // Plugin ID or app component that has focus
}
```

**Usage:**

```typescript
context.bus.subscribe("origin:workspace/selection", (payload) => {
  console.log(`Selected: "${payload.text}"`);
});
```

---

### `origin:app/theme-changed`

**Fired when:** App theme switches between light and dark mode (user preference change or system event).

**Payload:**

```typescript
{
  theme: "light" | "dark";
}
```

**Current Implementation Note:** This channel is currently named `com.origin.app:theme-changed` in the codebase (legacy). **Proposal:** Migrate to `origin:app/theme-changed` in v0.2 for consistency with the standard namespace.

**Usage:**

```typescript
// Subscribe to theme changes
context.bus.subscribe("origin:app/theme-changed", (payload) => {
  const isDark = payload.theme === "dark";
  document.body.classList.toggle("dark", isDark);
});
```

---

## 3. Direction Semantics — Pub/Sub Only

The PluginBus is **strictly publish-subscribe (broadcast)**. No request/response patterns.

### What the Bus Does

- **Publish:** One plugin broadcasts a value on a channel; all subscribers receive it.
- **Subscribe:** Plugins listen to a channel and receive all future publishes.
- **Read (cached):** Synchronously access the last published value (useful for initialization).

```typescript
// Publish
context.bus.publish("com.example.plugin:data-changed", { value: 42 });

// Subscribe
context.bus.subscribe("com.example.plugin:data-changed", (payload) => {
  console.log(payload.value);
});

// Read last value
const lastPayload = context.bus.read("com.example.plugin:data-changed");
if (lastPayload) {
  console.log(lastPayload.value);
}
```

### What the Bus Does NOT Support

- **Request/Response** — No `publishAsync()` or `request()` method
- **Callbacks in the payload** — Cannot pass functions across the plugin boundary
- **Acknowledgments** — Subscribers cannot signal back to the publisher

### Why Pub/Sub Only?

1. **Simplicity** — No state machine needed; events are fire-and-forget.
2. **Decoupling** — Subscribers don't need to exist when a message is published; pub/sub works asynchronously.
3. **Security** — Prevents plugins from stalling the app by waiting for a response (DoS vector).
4. **Workspace isolation** — Each workspace has its own bus; cached values persist per workspace.

### Request/Response Pattern: Use `ORIGIN_INVOKE`

For synchronous or async communication that needs a response, use the `@origin/sdk` or Tauri's `invoke()`:

```typescript
// In a plugin using @origin/sdk (frontend-to-main bridge)
import { invoke } from "@origin/sdk";

const response = await invoke("plugin_method", {
  arg1: "value",
});
```

This is **outside the bus**; it's a direct IPC bridge to the main app or a specific plugin.

---

## 4. L0 vs L1 Access — Identical API Surface

**L0 plugins** (React components bundled at build time) and **L1 plugins** (sandboxed iframes at runtime) use the same PluginBus API, but the implementation differs internally.

### L0 Plugin (React Component)

L0 plugins receive the bus directly via `PluginContext`:

```typescript
// packages/my-plugin/src/index.tsx
import type { PluginComponent } from "@origin/api";

const MyPlugin: PluginComponent = ({ context }) => {
  useEffect(() => {
    // Subscribe directly
    const unsub = context.bus.subscribe(
      "origin:workspace/active-path",
      (payload) => {
        console.log(payload.path);
      }
    );
    return unsub;
  }, [context.bus]);

  return <div>My L0 Plugin</div>;
};

export default MyPlugin;
```

### L1 Plugin (Sandboxed Iframe)

L1 plugins use `useBusChannel` hook which wraps `postMessage` under the hood:

```typescript
// packages/my-iframe-plugin/src/index.tsx (inside iframe)
import { useBusChannel } from "@origin/sdk";

const MyPlugin = () => {
  const publishPath = useBusChannel(
    "origin:workspace/active-path",
    (payload) => {
      console.log(payload.path);
    }
  );

  return <div>My L1 Plugin</div>;
};

export default MyPlugin;
```

### How L1 Works Internally

The `IframePluginHost` component (in the main React tree) relays messages:

1. **L1 plugin calls `useBusChannel(...).subscribe()`** → sends `ORIGIN_BUS_SUBSCRIBE` postMessage
2. **IframePluginHost receives the message** → calls `context.bus.subscribe()` on the main bus
3. **Main bus publishes** → IframePluginHost receives the event → sends `ORIGIN_BUS_EVENT` postMessage back
4. **L1 plugin receives the event** → handler fires

This relay ensures L1 plugins see the same event stream as L0 plugins, without access to the main bus object.

### From the Plugin's Perspective

Both L0 and L1 plugins see the **same TypeScript types** and **same method signatures**. The difference is transparent:

```typescript
// Both L0 and L1 plugins can write identical code:
context.bus.subscribe("origin:workspace/active-path", (payload) => {
  // payload: { path: string; type: "file" | "directory"; source: string }
  console.log(payload.path);
});
```

---

## 5. Channel Discovery — Declarative Intent (v1 Informational)

### Current State (v0.x)

Channels are discovered by reading the codebase and TypeScript declarations. No formal registry.

### Proposal: `channels` Field in PluginManifest (v1.0)

Add optional `channels` field to `PluginManifest` for declarative intent:

```typescript
interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description?: string;
  icon?: string;
  requiredCapabilities?: string[];

  /**
   * Channels this plugin publishes to and subscribes from.
   * Declarative only in v1 — not enforced. Used for plugin browser UI,
   * dependency resolution, and future capability system.
   *
   * @example
   * {
   *   publishes: ["com.example.logger:log-event"],
   *   subscribes: ["origin:workspace/active-path"]
   * }
   */
  channels?: {
    publishes?: string[];
    subscribes?: string[];
  };
}
```

### Benefits

1. **Plugin browser UI** — Show which channels a plugin uses (transparency)
2. **Dependency tracking** — Determine if required channels exist before loading
3. **Type generation** — Tools can auto-generate TypeScript channel maps
4. **Capability broker** — Future marketplace will enforce channel whitelist

### Not Enforced in v1

- Plugins can publish/subscribe to channels not listed in `channels`
- No runtime validation; purely informational
- Enforcement deferred to v2 or later when marketplace has capability broker

### Example Plugin Manifest

```json
{
  "id": "com.example.filetree",
  "name": "File Tree",
  "version": "1.0.0",
  "description": "Browse workspace files",
  "icon": "🗁",
  "requiredCapabilities": ["fs:read"],
  "channels": {
    "publishes": ["com.example.filetree:file-selected"],
    "subscribes": ["origin:workspace/active-path"]
  }
}
```

---

## 6. Typed Extension — Declaration Merging Pattern

Plugins extend the `OriginChannelMap` interface using TypeScript declaration merging. No central file needed; each plugin defines its own channels in its own `channels.d.ts` file.

### How It Works

The core API defines an open interface:

```typescript
// packages/api/src/plugin.ts
export interface OriginChannelMap {
  "com.origin.app:theme-changed": { theme: "light" | "dark" };
}
```

A third-party plugin extends it in its own package:

```typescript
// packages/my-plugin/src/channels.d.ts
declare module "@origin/api" {
  interface OriginChannelMap {
    "com.example.myplugin:user-selected": {
      userId: string;
      name: string;
    };
    "com.example.myplugin:data-synced": {
      dataSize: number;
      timestamp: number;
    };
  }
}
```

Now all code that imports `@origin/api` sees these types:

```typescript
// packages/api/src/plugin.ts exports this interface
import type { OriginChannelMap, PluginBus } from "@origin/api";

// All channels are now typed:
// - "com.origin.app:theme-changed"
// - "com.example.myplugin:user-selected"
// - "com.example.myplugin:data-synced"

const bus: PluginBus = getContextFromHost();
bus.subscribe("com.example.myplugin:user-selected", (payload) => {
  // payload is typed: { userId: string; name: string }
  console.log(payload.userId, payload.name);
});
```

### Worked Example: Building a Logger Plugin

#### Step 1: Define the Plugin Interface

```typescript
// packages/logger/src/channels.d.ts
declare module "@origin/api" {
  interface OriginChannelMap {
    "com.example.logger:log-event": {
      level: "info" | "warn" | "error";
      message: string;
      timestamp: number;
      source: string; // plugin id or "app"
    };
  }
}
```

#### Step 2: Publish Events

```typescript
// packages/logger/src/LoggerPlugin.tsx
import type { PluginComponent } from "@origin/api";
import "./channels"; // ensure types are loaded

const LoggerPlugin: PluginComponent = ({ context }) => {
  // Publish a log event whenever a workspace file changes
  useEffect(() => {
    const unsub = context.bus.subscribe(
      "origin:workspace/active-path",
      (pathPayload) => {
        context.bus.publish("com.example.logger:log-event", {
          level: "info",
          message: `File selected: ${pathPayload.path}`,
          timestamp: Date.now(),
          source: "com.example.logger",
        });
      }
    );
    return unsub;
  }, [context.bus]);

  return <div>Logger Plugin</div>;
};

export default LoggerPlugin;
```

#### Step 3: Subscribe in Another Plugin

Another plugin can now subscribe to logger events with full type safety:

```typescript
// packages/another-plugin/src/index.tsx
import type { PluginComponent } from "@origin/api";
import "com.example.logger/channels"; // declare module again if types not in package

const AnotherPlugin: PluginComponent = ({ context }) => {
  useEffect(() => {
    const unsub = context.bus.subscribe(
      "com.example.logger:log-event",
      (payload) => {
        // payload is fully typed
        console.log(
          `[${payload.level.toUpperCase()}] ${payload.message} (${payload.source})`
        );
      }
    );
    return unsub;
  }, [context.bus]);

  return <div>Another Plugin</div>;
};

export default AnotherPlugin;
```

#### Step 4: Multiple Declaration Merges

If you have many channels, split them across multiple files:

```typescript
// packages/logger/src/channels/logging.d.ts
declare module "@origin/api" {
  interface OriginChannelMap {
    "com.example.logger:log-event": {
      /* ... */
    };
  }
}

// packages/logger/src/channels/aggregation.d.ts
declare module "@origin/api" {
  interface OriginChannelMap {
    "com.example.logger:stats-updated": {
      /* ... */
    };
  }
}

// packages/logger/src/index.ts — import both
import "./channels/logging";
import "./channels/aggregation";
```

### Why Declaration Merging?

1. **No central registry** — Plugins don't need to submit PRs to a core file
2. **Type-safe** — Full TypeScript support; typos caught at compile time
3. **Decoupled** — Plugin A can define channels; Plugin B can use them; neither needs to coordinate
4. **Enforceable** — TypeScript prevents `bus.subscribe("wrong-channel-name", ...)` at build time

---

## 7. Workspace Scoping

Each `PluginBus` is scoped to a single workspace. Events in workspace A never fire subscribers in workspace B.

### Architecture

```typescript
// src/store/workspaceStore.ts
interface WorkspaceState {
  buses: Record<WorkspaceId, PluginBus>;
  workspaces: Workspace[];
  // ...
}

const workspaceStore = create<WorkspaceState>((set) => ({
  buses: {},
  workspaces: [],

  // Create a new workspace
  addWorkspace: (workspace: Workspace) =>
    set((state) => ({
      buses: {
        ...state.buses,
        [workspace.id]: createPluginBus(),
      },
      workspaces: [...state.workspaces, workspace],
    })),
}));
```

### Why Workspace Scoping?

1. **Isolation** — Users can work on separate projects in separate workspaces; events don't cross boundaries
2. **Memory efficiency** — Each bus only tracks subscriptions for that workspace
3. **Simplicity** — No need for "namespace" prefixes on channels (e.g., `workspace-A:plugin:event`)
4. **Plugin safety** — Plugins in workspace A can't eavesdrop on workspace B's events

---

## 8. Caching and Initial State

The bus caches the last published value on each channel. Subscribers can read the cached value synchronously:

```typescript
// Example: theme plugin publishes theme, then app subscribes later
context.bus.publish("origin:app/theme-changed", { theme: "dark" });

// ... later ...

const unsub = context.bus.subscribe("origin:app/theme-changed", (payload) => {
  // This handler fires immediately with the cached value if one exists
  console.log(payload.theme); // prints "dark"
});

// Or read synchronously without subscribing
const currentTheme = context.bus.read("origin:app/theme-changed");
if (currentTheme) {
  console.log(currentTheme.theme); // prints "dark"
}
```

### Implementation

See `src/lib/pluginBus.ts`:

```typescript
export function createPluginBus(): PluginBus {
  const _subscribers = new Map<string, Set<(payload: unknown) => void>>();
  const _lastValues = new Map<string, unknown>();

  return {
    publish(channel, payload) {
      const frozen = Object.freeze({
        ...(payload as object),
      }) as typeof payload;
      _lastValues.set(channel, frozen);
      _subscribers.get(channel)?.forEach((fn) => fn(frozen));
    },

    subscribe(channel, handler) {
      if (!_subscribers.has(channel)) _subscribers.set(channel, new Set());
      _subscribers.get(channel)!.add(handler as (payload: unknown) => void);
      return () =>
        _subscribers
          .get(channel)
          ?.delete(handler as (payload: unknown) => void);
    },

    read<K extends keyof OriginChannelMap>(channel: K) {
      return _lastValues.get(channel) as OriginChannelMap[K] | undefined;
    },
  };
}
```

### Thread Safety & Immutability

- Cached payloads are frozen (`Object.freeze`) to prevent accidental mutations
- No guarantees about subscriber execution order (may be parallelized in the future)
- Do NOT modify payloads; treat them as immutable

---

## 9. L1 Plugin Message Protocol

The `IframePluginHost` and sandboxed L1 plugins communicate via `postMessage`. The protocol is defined in `src/lib/iframeProtocol.ts`.

### Host-to-Plugin Messages

```typescript
type HostToPluginMessage =
  | { type: "ORIGIN_INIT"; context: IframePluginContext }
  | { type: "ORIGIN_BUS_EVENT"; channel: string; payload: unknown }
  | { type: "ORIGIN_THEME_CHANGE"; theme: "light" | "dark" };
```

- **`ORIGIN_INIT`** — Sent after plugin iframe is ready; contains `cardId`, `workspacePath`, `theme`
- **`ORIGIN_BUS_EVENT`** — Forwarded pub/sub events from the main bus
- **`ORIGIN_THEME_CHANGE`** — Theme updates (sent after INIT)

### Plugin-to-Host Messages

```typescript
type PluginToHostMessage =
  | { type: "ORIGIN_READY" }
  | { type: "ORIGIN_BUS_PUBLISH"; channel: string; payload: unknown }
  | { type: "ORIGIN_BUS_SUBSCRIBE"; channel: string }
  | { type: "ORIGIN_BUS_UNSUBSCRIBE"; channel: string };
```

- **`ORIGIN_READY`** — Plugin signals it is initialized and ready to receive messages
- **`ORIGIN_BUS_PUBLISH`** — Plugin publishes a value on a channel
- **`ORIGIN_BUS_SUBSCRIBE`** — Plugin wants to listen to a channel
- **`ORIGIN_BUS_UNSUBSCRIBE`** — Plugin stops listening to a channel

### Message Flow Diagram

```
L1 Plugin Iframe                      Host (React)
        |                                  |
        |--- ORIGIN_READY -------->        |
        |                                  |
        |<--- ORIGIN_INIT --------- (PluginContext)
        |                                  |
        |--- ORIGIN_BUS_SUBSCRIBE -->      |
        |                                  | (subscribes to main bus)
        |                                  |
        |<-- ORIGIN_BUS_EVENT ----- (from main bus)
        |                                  |
        |--- ORIGIN_BUS_PUBLISH -------->  |
        |                            (publishes to main bus)
        |                                  |
        |<-- ORIGIN_BUS_EVENT ----- (echo from main bus)
        |
```

---

## 10. Future Enhancements (v2+)

### Capability Broker

In v2, the marketplace will have a capability broker that enforces which channels a plugin can use:

- Plugin manifest declares `channels.publishes` and `channels.subscribes`
- App compares against a capability allowlist before loading
- Runtime channel access is validated (publish/subscribe calls are checked)
- Non-compliant access attempts are blocked

### Channel Middleware

Potential for middleware/interceptors on the bus:

```typescript
// Hypothetical v2 API
context.bus.use("com.example.logger:*", (event, next) => {
  console.log("Intercepted event:", event);
  next();
});
```

### Request/Response Pattern

If future use cases require request/response, a separate `RequestBus` could be added:

```typescript
// Hypothetical v2 API (NOT in v1)
const response = await context.requestBus.invoke(
  "com.example.plugin:ask-for-data",
  { query: "..." },
);
```

However, this would be a **separate interface** — the existing pub/sub bus remains simple and stateless.

---

## Summary

| Aspect                | Decision                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------- |
| **Naming**            | `origin:<domain>/<event>` for standard, `com.plugin.id:channel` for plugin-owned         |
| **Standard Channels** | `origin:workspace/active-path`, `origin:workspace/selection`, `origin:app/theme-changed` |
| **Direction**         | Pub/sub broadcast only; no request/response                                              |
| **L0 vs L1**          | Same API surface; relayed via postMessage for iframes                                    |
| **Discovery**         | Declaration merging in `channels.d.ts`; optional manifest field for v1                   |
| **Typed Extension**   | Each plugin extends `OriginChannelMap` in its own file                                   |
| **Scoping**           | Per-workspace; events never cross workspace boundaries                                   |
| **Caching**           | Last published value cached; accessible via `read()`                                     |
| **L1 Protocol**       | Defined in `src/lib/iframeProtocol.ts`; four message types                               |
| **Enforcement**       | v1: informational only; v2+: capability broker enforces                                  |

---

## References

- **Core interfaces:** `packages/api/src/plugin.ts` (`PluginBus`, `OriginChannelMap`, `PluginManifest`)
- **Factory implementation:** `src/lib/pluginBus.ts` (`createPluginBus()`)
- **L1 relay:** `src/components/card/IframePluginHost.tsx`
- **L1 hook:** `packages/sdk/src/bus.ts` (`useBusChannel`)
- **Message protocol:** `src/lib/iframeProtocol.ts`
