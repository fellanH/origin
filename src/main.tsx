import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { tauriHandler } from "./store/workspaceStore";
import "./index.css";

async function bootstrap() {
  await tauriHandler.start();
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

bootstrap();
