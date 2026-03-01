import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Inline Vite plugin: emits dist/manifest.json from src/manifest.ts at build time.
 * Origin reads this file to register the plugin in the launcher.
 */
function originManifest(): import("vite").Plugin {
  return {
    name: "origin-manifest",
    async generateBundle() {
      const mod = await import("./src/manifest");
      this.emitFile({
        type: "asset",
        fileName: "manifest.json",
        source: JSON.stringify(mod.manifest, null, 2),
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), originManifest()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
