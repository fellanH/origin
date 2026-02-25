import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import type { Plugin } from "vite";
import type { OutputBundle } from "rollup";

const host = process.env.TAURI_DEV_HOST;

// Inject an import map so v2 plugins (loaded via plugin:// scheme) can resolve
// bare 'react' / 'react/jsx-runtime' specifiers to Origin's bundled React.
// Without this, the browser would try to resolve e.g. plugin://localhost/{id}/react → 404.
function originPluginImportMap(): Plugin {
  return {
    name: "origin-plugin-importmap",
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        let imports: Record<string, string>;

        if ((ctx as { bundle?: OutputBundle }).bundle) {
          // Production build: find the dedicated vendor-react chunk by name.
          const bundle = (ctx as { bundle: OutputBundle }).bundle;
          let reactChunkUrl: string | undefined;
          for (const [filename, chunk] of Object.entries(bundle)) {
            if (chunk.type === "chunk" && chunk.name === "vendor-react") {
              reactChunkUrl = `/${filename}`;
              break;
            }
          }
          if (!reactChunkUrl) return [];
          imports = {
            react: reactChunkUrl,
            "react/jsx-runtime": reactChunkUrl,
            "react-dom": reactChunkUrl,
            "react-dom/client": reactChunkUrl,
          };
        } else {
          // Dev mode: Vite pre-bundles deps into .vite/deps/ at predictable paths.
          imports = {
            react: "/node_modules/.vite/deps/react.js",
            "react/jsx-runtime":
              "/node_modules/.vite/deps/react_jsx-runtime.js",
            "react-dom": "/node_modules/.vite/deps/react-dom.js",
            "react-dom/client": "/node_modules/.vite/deps/react-dom_client.js",
          };
        }

        return [
          {
            tag: "script",
            attrs: { type: "importmap" },
            children: JSON.stringify({ imports }),
            injectTo: "head-prepend",
          },
        ];
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), originPluginImportMap()],

  resolve: {
    alias: {
      // Internal path alias
      "@": path.resolve(__dirname, "src"),
    },
    // Prevents "invalid hook call" if a plugin package resolves its own React copy
    dedupe: ["react", "react-dom"],
  },

  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host ? { protocol: "ws", host, port: 1421 } : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  envPrefix: ["VITE_", "TAURI_ENV_*"],
  build: {
    target:
      process.env.TAURI_ENV_PLATFORM === "windows" ? "chrome105" : "safari13",
    minify: !process.env.TAURI_ENV_DEBUG ? "esbuild" : false,
    sourcemap: !!process.env.TAURI_ENV_DEBUG,
    rollupOptions: {
      output: {
        // Isolate React into a dedicated chunk so the import map can point
        // v2 plugins at a single, stable URL to share the host's React instance.
        manualChunks: {
          "vendor-react": ["react", "react/jsx-runtime", "react-dom"],
        },
      },
    },
  },
});
