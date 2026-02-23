# @note/template — Plugin Starter

Use this as the starting point for any new `@note/*` plugin.

## Quickstart

1. **Copy** `plugins/template/` to `plugins/your-plugin/`
2. **Update** `package.json` — set `"name"` to `"@note/your-plugin"`
3. **Edit** `src/manifest.ts` — set `id` (reverse-domain, e.g. `"com.yourco.yourplugin"`), `name`, `icon`, and `description`
4. **Build** your component in `src/index.tsx` — default export must accept `{ context: PluginContext }`
5. **Register** the plugin in the app:
   - Add an entry to `note.plugins.json`
   - Add a literal `import()` to the `IMPORT_MAP` in `src/plugins/registry.ts`
   - Run `npm install` to link the workspace package

See `docs/SOP/add-plugin.md` for the full walkthrough.
