import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, TitleStrategy, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { SeoTitleStrategy } from './core/seo/seo-title.strategy';
import { SUBMISSIONS_API_URL, SUBMISSIONS_ENABLED } from './core/submissions/submissions.config';
import { TOURS_API_URL } from './features/tours/data-access/tours.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideRouter(
      routes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),
    { provide: TitleStrategy, useClass: SeoTitleStrategy },
    { provide: SUBMISSIONS_API_URL, useValue: '/api/v1/submissions' },
    { provide: SUBMISSIONS_ENABLED, useValue: false },
    { provide: TOURS_API_URL, useValue: '/api/v1/tours' },
    provideClientHydration(withEventReplay()),
  ],
};
