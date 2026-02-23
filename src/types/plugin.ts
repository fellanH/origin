import type React from "react";

export interface PluginManifest {
  id: string; // e.g. "com.note.hello"
  name: string;
  version: string;
  description: string;
  icon?: string; // emoji or relative image path
}

export interface PluginContext {
  panelId: string;
  workspacePath: string;
  theme: "light" | "dark";
}

export type PluginComponent = React.ComponentType<{ context: PluginContext }>;

export interface PluginModule {
  manifest: PluginManifest;
  default: PluginComponent;
}
