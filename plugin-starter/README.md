# Origin Plugin Starter

A standalone template for building [Origin](https://github.com/fellanH/origin) plugins. Clone this, edit `src/index.tsx`, and run it inside Origin.

Every Origin plugin is a sandboxed iframe (L1) — a standalone Vite + React app that communicates with the shell via postMessage. This template gives you the full setup out of the box.

---

## 1. Prerequisites

- **Node.js 20+** and **npm**
- **Origin** app installed ([github.com/fellanH/origin](https://github.com/fellanH/origin))

## 2. Getting Started

```bash
# Clone this template
git clone https://github.com/fellanH/origin-plugin-starter.git my-plugin
cd my-plugin

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The dev server runs at `http://localhost:5173`. You can open it in a browser to see your plugin render standalone — but the full `PluginContext` (cardId, theme, bus, etc.) is only available when loaded inside Origin.

## 3. Dev Workflow

Origin supports loading plugins from a local dev server for live development.

### Step 1 — Start your plugin dev server

```bash
npm run dev
# → http://localhost:5173
```

### Step 2 — Register in Origin dev mode

In Origin, open the Plugin Browser and add a **dev plugin** by URL:

1. Open a panel → click **Add Plugin +**
2. Enter your dev server URL: `http://localhost:5173`
3. Your plugin appears in the panel with hot-reload

Every time you save a file, Vite hot-reloads the iframe — you see changes instantly without restarting Origin.

### Step 3 — Edit and iterate

- Edit `src/index.tsx` — your main plugin component
- Edit `src/manifest.ts` — plugin metadata (name, icon, capabilities)
- Edit `origin.plugin.json` — must stay in sync with `src/manifest.ts`

## 4. Plugin Contract

Every plugin receives a `PluginContext` at mount time via the `usePluginContext()` hook from `@origin-cards/sdk`.

### PluginContext

| Field           | Type                           | Description                                      |
| --------------- | ------------------------------ | ------------------------------------------------ |
| `cardId`        | `string`                       | Unique ID of the panel card this plugin mounts in |
| `workspacePath` | `string`                       | Absolute path to the workspace root directory     |
| `theme`         | `"light" \| "dark"`            | Current app theme — updates reactively            |
| `config`        | `Record<string, unknown>`      | Per-instance persisted config                     |
| `setConfig`     | `(patch) => void`              | Shallow-merge a patch into config                 |

### PluginManifest

Declared in `src/manifest.ts` and mirrored in `origin.plugin.json`:

```typescript
import type { PluginManifest } from "@origin-cards/api";

export const manifest: PluginManifest = {
  id: "com.example.my-plugin",    // Reverse-domain unique ID
  name: "My Plugin",              // Shown in the launcher
  version: "0.1.0",
  description: "A custom plugin.",
  icon: "🔌",                     // Emoji or image path
  requiredCapabilities: [],        // Tauri APIs this plugin needs
};
```

### requiredCapabilities

Declare any Tauri APIs your plugin uses. The shell enforces these — calls to undeclared capabilities are rejected.

| Capability      | Grants access to                                |
| --------------- | ----------------------------------------------- |
| `fs:read`       | `readTextFile`, `readDir`, `exists`              |
| `fs:write`      | `writeTextFile`, `mkdir`                         |
| `dialog:open`   | Open file picker dialog                          |
| `dialog:save`   | Save file dialog                                 |
| `pty`           | Terminal spawn, write, resize, destroy           |

Example — a plugin that reads files:

```json
{
  "id": "com.example.file-reader",
  "name": "File Reader",
  "version": "0.1.0",
  "icon": "📄",
  "requiredCapabilities": ["fs:read"]
}
```

## 5. Using the Bus

The bus is a pub/sub system for inter-plugin communication. Use `useBusChannel()` from `@origin-cards/sdk` to subscribe:

```tsx
import { useBusChannel } from "@origin-cards/sdk";

function MyPlugin() {
  // Subscribe — handler fires whenever a value is published on this channel
  const publish = useBusChannel("origin:workspace/active-path", (payload) => {
    console.log("File selected:", payload.path);
  });

  // Publish — send a value to all subscribers
  function handleClick() {
    publish({ path: "/some/file.txt", type: "file", source: "com.example.my-plugin" });
  }

  return <button onClick={handleClick}>Select file</button>;
}
```

### Built-in channels

| Channel                          | Payload                                       | Description                |
| -------------------------------- | --------------------------------------------- | -------------------------- |
| `com.origin.app:theme-changed`   | `{ theme: "light" \| "dark" }`                | System theme switched      |
| `origin:workspace/active-path`   | `{ path: string, type: string, source: string }` | Active file/dir changed |

Plugins can define custom channels via TypeScript declaration merging:

```typescript
// src/channels.d.ts
declare module "@origin-cards/api" {
  interface OriginChannelMap {
    "com.example.my-plugin:data-updated": { items: string[] };
  }
}
```

## 6. Calling Tauri APIs

Plugins run in a sandboxed iframe and cannot call Tauri directly. Instead, use `invoke()` from `@origin-cards/sdk` — it proxies the call through Origin's host:

```tsx
import { invoke } from "@origin-cards/sdk";
// Or use the convenience wrappers:
import { readTextFile, writeTextFile, readDir, exists, mkdir, openDialog } from "@origin-cards/sdk";

// Raw invoke — requires "fs:read" in requiredCapabilities
const content = await invoke<string>("plugin:fs|read_text_file", {
  path: "/Users/me/notes.txt",
});

// Convenience wrapper — same capability requirement
const content2 = await readTextFile("/Users/me/notes.txt");

// File picker dialog — requires "dialog:open"
const selected = await openDialog({
  title: "Pick a file",
  filters: [{ name: "Text", extensions: ["txt", "md"] }],
});
```

**Important:** You must declare the required capability in both your `origin.plugin.json` and `src/manifest.ts`:

```json
{
  "requiredCapabilities": ["fs:read", "dialog:open"]
}
```

If a capability is not declared, the shell rejects the call with an error.

## 7. Building for Install

```bash
# Typecheck + build
npm run build
```

This produces a `dist/` directory containing:

```
dist/
├── index.html       # Entry point
├── manifest.json    # Auto-generated from src/manifest.ts
└── assets/
    └── index-*.js   # Bundled plugin code
```

### Installing in Origin

Copy the `dist/` folder to Origin's plugin directory:

```bash
# macOS
cp -r dist/ ~/Library/Application\ Support/com.origin.app/plugins/com.example.my-plugin/
```

The directory name must match your plugin's `id` from the manifest. Restart Origin to load the plugin.

## 8. Publishing

Community plugin registry support is coming soon. When available, you will be able to publish your plugin so other Origin users can discover and install it directly from the app.

In the meantime, you can distribute your plugin by:

1. Sharing the built `dist/` directory
2. Publishing to a Git repository with build instructions
3. Creating a release with the `dist/` folder attached

Watch the [Origin releases](https://github.com/fellanH/origin/releases) for marketplace announcements.

---

## Project Structure

```
origin-plugin-starter/
├── src/
│   ├── index.tsx          # Plugin component — uses usePluginContext()
│   ├── main.tsx           # Standalone React entry point
│   └── manifest.ts        # Plugin metadata (id, name, capabilities)
├── public/
│   └── index.html         # HTML template (dev server fallback)
├── index.html             # Vite entry HTML
├── origin.plugin.json     # Manifest mirror (must match src/manifest.ts)
├── vite.config.ts         # Builds to dist/; dev server on localhost:5173
├── tsconfig.json          # TypeScript strict mode
├── package.json           # Dependencies: @origin-cards/sdk, @origin-cards/api
└── README.md              # This file
```

## API Reference

### `@origin-cards/sdk` exports

| Export              | Type     | Description                                |
| ------------------- | -------- | ------------------------------------------ |
| `usePluginContext()` | Hook     | Returns `PluginContext` or `null`           |
| `useBusChannel()`   | Hook     | Subscribe to a typed bus channel            |
| `invoke()`          | Function | Proxy a Tauri command through the shell     |
| `readTextFile()`    | Function | Read a file (requires `fs:read`)            |
| `writeTextFile()`   | Function | Write a file (requires `fs:write`)          |
| `readDir()`         | Function | List directory contents (requires `fs:read`)|
| `mkdir()`           | Function | Create directory (requires `fs:write`)      |
| `exists()`          | Function | Check if path exists (requires `fs:read`)   |
| `openDialog()`      | Function | Open file picker (requires `dialog:open`)   |
| `onEvent()`         | Function | Subscribe to host-push event stream         |
| `useOriginEvent()`  | Hook     | React hook for host-push events             |

### `@origin-cards/api` exports

Types only — `PluginManifest`, `PluginContext`, `PluginBus`, `OriginChannelMap`, etc.

## License

MIT
