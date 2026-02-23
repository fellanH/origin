import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { tauriHandler } from "./store/workspaceStore";
import { initRegistry } from "./plugins/registry";
import "./index.css";

async function bootstrap() {
  await Promise.all([tauriHandler.start(), initRegistry()]);
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

bootstrap();
