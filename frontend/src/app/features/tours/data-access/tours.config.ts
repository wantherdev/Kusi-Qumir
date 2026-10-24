import { InjectionToken } from '@angular/core';

import { deploymentConfig } from '../../../deployment.config';

export const TOURS_API_URL = new InjectionToken<string>('TOURS_API_URL');

export const STATIC_CATALOG_URL = new InjectionToken<string | null>('STATIC_CATALOG_URL', {
  providedIn: 'root',
  factory: () => deploymentConfig.staticCatalogUrl,
});
