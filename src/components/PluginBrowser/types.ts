export interface RegistryPlugin {
  id: string;
  name: string;
  description: string;
  author: string;
  version: string;
  icon?: string;
  github?: string;
}

export interface Registry {
  generated: string;
  plugins: RegistryPlugin[];
}
