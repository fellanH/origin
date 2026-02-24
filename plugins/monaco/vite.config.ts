import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import manifestJson from "./src/manifest.json";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-manifest",
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "manifest.json",
          source: JSON.stringify(manifestJson, null, 2),
        });
      },
    },
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.tsx"),
      formats: ["es"],
      fileName: "index",
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@tauri-apps/api",
        "@tauri-apps/api/core",
        "@monaco-editor/react",
      ],
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@origin/api": resolve(__dirname, "../api/src"),
    },
  },
});
