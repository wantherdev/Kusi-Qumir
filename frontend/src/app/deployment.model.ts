export type SupabaseCatalogConfig = {
  url: string;
  publishableKey: string;
};

export type DeploymentConfig = {
  staticCatalogUrl: string | null;
  supabaseCatalog: SupabaseCatalogConfig | null;
};
