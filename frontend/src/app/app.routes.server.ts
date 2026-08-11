import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'tours', renderMode: RenderMode.Client },
  { path: 'tours/:slug', renderMode: RenderMode.Client },
  { path: 'informacion-institucional', renderMode: RenderMode.Prerender },
  { path: 'privacidad', renderMode: RenderMode.Prerender },
  { path: 'terminos', renderMode: RenderMode.Prerender },
  { path: 'turismo-responsable', renderMode: RenderMode.Prerender },
  { path: 'libro-de-reclamaciones', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
