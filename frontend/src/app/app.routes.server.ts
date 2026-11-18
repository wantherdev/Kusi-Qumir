import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: 'admin', renderMode: RenderMode.Client },
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'tours', renderMode: RenderMode.Client },
  { path: 'tours/:slug', renderMode: RenderMode.Client },
  { path: 'contacto', renderMode: RenderMode.Prerender },
  { path: 'preguntas-frecuentes', renderMode: RenderMode.Prerender },
  { path: 'informacion-institucional', renderMode: RenderMode.Prerender },
  { path: 'privacidad', renderMode: RenderMode.Prerender },
  { path: 'terminos', renderMode: RenderMode.Prerender },
  { path: 'cancelaciones', renderMode: RenderMode.Prerender },
  { path: 'turismo-responsable', renderMode: RenderMode.Prerender },
  { path: 'libro-de-reclamaciones', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Server, status: 404 },
];
