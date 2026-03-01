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
  /**
   * Tauri capabilities declared by the plugin author in the registry.
   * Forwarded verbatim into the saved manifest so the capability broker
   * in IframePluginHost can enforce them without a re-install.
   * @example ["fs:read", "shell:execute"]
   */
  requiredCapabilities?: string[];
  /** Freeform tags for search and filtering. */
  tags?: string[];
  /** Broad category for tab-level grouping. */
  category?: string;
  /** Curated flag — featured plugins appear first in the Discover tab. */
  featured?: boolean;
}

export interface Registry {
  generated: string;
  plugins: RegistryPlugin[];
}
