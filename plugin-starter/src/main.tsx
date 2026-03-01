import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MyPlugin from "./index";

/**
 * Standalone React entry point.
 *
 * When running `npm run dev`, Vite serves this as a regular React app at
 * http://localhost:5173. Origin's dev mode can load it from there.
 *
 * When running `npm run build`, Vite bundles this into dist/ — the output
 * is what Origin loads via the plugin:// protocol in production.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MyPlugin />
  </StrictMode>,
);
