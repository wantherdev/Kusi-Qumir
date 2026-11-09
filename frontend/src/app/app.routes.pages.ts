import { inject } from '@angular/core';
import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { firstValueFrom, timeout } from 'rxjs';
import { deploymentConfig } from './deployment.config';
import { ToursApiService } from './features/tours/data-access/tours-api.service';

// The SEO build renders the current public catalog without a Node server at runtime.
export function createPagesRoutes(adminAtRoot = false, prerenderTours = false): ServerRoute[] {
  const tourRoutes: ServerRoute[] =
    !adminAtRoot && prerenderTours
      ? [
          { path: 'tours', renderMode: RenderMode.Prerender },
          {
            path: 'tours/:slug',
            renderMode: RenderMode.Prerender,
            fallback: PrerenderFallback.Client,
            async getPrerenderParams() {
              const catalog = inject(ToursApiService);
              const tours = await firstValueFrom(catalog.findAll().pipe(timeout(20_000)));
              if (tours.length === 0) throw new Error('The public catalog is empty.');
              return tours.map(({ slug }) => {
                if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
                  throw new Error('The public catalog contains an invalid tour slug.');
                }
                return { slug };
              });
            },
          },
        ]
      : [];
  return [
    ...[
      '',
      'informacion-institucional',
      'privacidad',
      'terminos',
      'cancelaciones',
      'turismo-responsable',
      'libro-de-reclamaciones',
    ].map((path): ServerRoute =>
      path === '' && adminAtRoot
        ? { path, renderMode: RenderMode.Client }
        : { path, renderMode: RenderMode.Prerender },
    ),
    ...tourRoutes,
    { path: '**', renderMode: RenderMode.Client },
  ];
}

const runtime = globalThis as typeof globalThis & {
  process?: { env: Record<string, string | undefined> };
};

export const serverRoutes: ServerRoute[] = createPagesRoutes(
  deploymentConfig.adminAtRoot === true,
  runtime.process?.env['KQ_PRERENDER_TOURS'] === '1',
);
