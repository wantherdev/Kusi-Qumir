export type SupabaseCatalogConfig = {
  url: string;
  publishableKey: string;
};

export type DeploymentConfig = {
  adminAtRoot?: boolean;
  staticCatalogUrl: string | null;
  supabaseCatalog: SupabaseCatalogConfig | null;
};
