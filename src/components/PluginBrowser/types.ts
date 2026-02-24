export interface RegistryPlugin {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  icon?: string;
  github?: string;
  /** npm package name — used by the install command. Falls back to `id` if absent. */
  package?: string;
}

export interface Registry {
  generated: string;
  plugins: RegistryPlugin[];
}
