import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { tauriHandler, useWorkspaceStore } from "./store/workspaceStore";
import { initRegistry } from "./plugins/registry";
import "./index.css";

async function bootstrap() {
  await Promise.all([tauriHandler.start(), initRegistry()]);
  // Reconstruct per-workspace buses after persisted workspaces are loaded
  // (bus instances contain functions and are not serialized by the Tauri store)
  useWorkspaceStore.getState().hydrateBuses();
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

bootstrap();
