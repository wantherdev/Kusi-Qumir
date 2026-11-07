import { InjectionToken } from '@angular/core';

import { SupabaseCatalogConfig } from '../../../deployment.model';
import { deploymentConfig } from '../../../deployment.config';

export const TOURS_API_URL = new InjectionToken<string>('TOURS_API_URL');

export const STATIC_CATALOG_URL = new InjectionToken<string | null>('STATIC_CATALOG_URL', {
  providedIn: 'root',
  factory: () => deploymentConfig.staticCatalogUrl,
});

export const SUPABASE_CATALOG = new InjectionToken<SupabaseCatalogConfig | null>('SUPABASE_CATALOG', {
  providedIn: 'root',
  factory: () => deploymentConfig.supabaseCatalog,
});
