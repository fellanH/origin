import React from "react";
import ReactDOM from "react-dom/client";
import { invoke } from "@tauri-apps/api/core";
import App from "./App";
import { tauriHandler, useWorkspaceStore } from "./store/workspaceStore";
import { initRegistry } from "./plugins/registry";
import "./index.css";

async function bootstrap() {
  // --- Crash safety: recover from backup before loading persisted state ----
  // If workspace-store.json is missing or contains invalid JSON, this command
  // replaces it with the last known-good .bak.json (if one exists).
  const recoveryResult = await invoke<string>("recover_workspace_store").catch(
    (err) => {
      console.warn("[store] recover_workspace_store failed:", err);
      return "ok";
    },
  );
  if (recoveryResult === "recovered") {
    console.info("[store] Restored workspace-store.json from backup.");
  } else if (recoveryResult === "no-backup") {
    console.warn(
      "[store] Workspace store corrupt and no backup available — starting fresh.",
    );
  }

  // Seed bundled plugin assets from the Tauri resource bundle into AppData on
  // first launch (or when a newer version is bundled). Graceful no-op in dev
  // builds where assets/plugins/ is empty or absent.
  await invoke("seed_bundled_plugins").catch((e) => {
    console.warn("[origin] seed_bundled_plugins failed:", e);
  });

  // Load persisted state from (possibly just-recovered) file.
  await Promise.all([tauriHandler.start(), initRegistry()]);

  // Reconstruct per-workspace buses after persisted workspaces are loaded
  // (bus instances contain functions and are not serialized by the Tauri store)
  useWorkspaceStore.getState().hydrateBuses();

  // --- Crash safety: write backup of the freshly-loaded good state ----------
  // This runs async in the background — we don't await it so it doesn't block
  // the initial render.
  invoke<void>("backup_workspace_store").catch((err) => {
    console.warn("[store] backup_workspace_store failed:", err);
  });

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

bootstrap();
