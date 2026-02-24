# @origin-cards/api

Type contract for Origin plugins — `PluginManifest`, `PluginContext`,
`PluginComponent`, `PluginModule`, `PluginBus`, and `OriginChannelMap`.

Published to npm as `@origin-cards/api`.

---

## Installation

```bash
npm install @origin-cards/api
```

---

## Usage

```typescript
import type { PluginManifest, PluginComponent, PluginModule } from "@origin-cards/api";

export const manifest: PluginManifest = {
  id: "com.example.myplugin",
  name: "My Plugin",
  version: "0.1.0",
  description: "Does something useful",
  icon: "🔧",
  requiredCapabilities: ["fs:read"],
};

const MyPlugin: PluginComponent = ({ context }) => {
  return <div>Hello from {context.cardId}</div>;
};

export default MyPlugin;
```

---

## Versioning Policy

This package follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

| Change type | Version bump                               | Examples                                                                                                                                                                         |
| ----------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **MAJOR**   | Breaking changes to any exported interface | Removing or renaming fields on `PluginManifest`, `PluginContext`, `PluginBus`, `PluginComponent`, or `PluginModule`; changing method signatures in a non-backward-compatible way |
| **MINOR**   | Additive, backward-compatible additions    | New optional fields on `PluginManifest`; new methods on `PluginBus`; new types or hooks exported from the package                                                                |
| **PATCH**   | Non-functional changes                     | Documentation-only updates; JSDoc improvements; bug fixes that do not alter the public API shape                                                                                 |

Because Origin is pre-1.0, breaking changes are permitted in MINOR bumps
within the `0.x` series per semver convention. Each breaking change will be
clearly labelled **BREAKING** in `CHANGELOG.md` and communicated to plugin
authors before merge.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the full version history.
