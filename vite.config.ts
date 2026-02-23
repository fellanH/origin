import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      // Plugin workspace packages — activated in issue #12
      "@note/hello": path.resolve(__dirname, "plugins/hello/src"),
      // Internal path alias
      "@": path.resolve(__dirname, "src"),
    },
    // Prevents "invalid hook call" if a plugin package resolves its own React copy
    dedupe: ["react", "react-dom"],
  },

  // Pre-bundle dynamically imported plugins to prevent page reload on first load in dev
  optimizeDeps: {
    include: ["@note/hello"],
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
  },
});
