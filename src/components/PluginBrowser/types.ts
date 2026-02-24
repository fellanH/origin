export interface RegistryPlugin {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  icon?: string;
  github?: string;
  /** @deprecated npm package name — superseded by bundle_url in v2 install flow */
  package?: string;
  /** URL to the pre-built JS bundle for download-and-install */
  bundle_url?: string;
}

export interface Registry {
  generated: string;
  plugins: RegistryPlugin[];
}
