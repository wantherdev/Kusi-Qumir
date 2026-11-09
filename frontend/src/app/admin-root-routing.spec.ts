import { describe, expect, it } from 'vitest';
import { RenderMode } from '@angular/ssr';
import { createRoutes } from './app.routes';
import { createPagesRoutes } from './app.routes.pages';

function loadRoutes(adminAtRoot: boolean) {
  return { routes: createRoutes(adminAtRoot), serverRoutes: createPagesRoutes(adminAtRoot) };
}
describe('administrative deployment routing', () => {
  it('opens the dashboard at the root with client rendering in admin mode', async () => {
    const { routes, serverRoutes } = await loadRoutes(true);
    const root = routes.find((route) => route.path === '');
    expect(root?.title).toBe('Administración de tours | Kusi Q’umir');
    expect(root?.pathMatch).toBe('full');
    expect(root?.redirectTo).toBeUndefined();
    expect(serverRoutes.find((route) => route.path === '')?.renderMode).toBe(RenderMode.Client);
    expect(routes.find((route) => route.path === 'admin')?.redirectTo).toBe('');
    expect(routes.find((route) => route.path === 'tours')?.loadComponent).toBeDefined();
  });
  it('prerenders the public catalog only when the SEO build is selected', () => {
    const catalog = (admin: boolean, seo: boolean) =>
      createPagesRoutes(admin, seo).find((route) => route.path === 'tours/:slug');

    expect(catalog(false, false)).toBeUndefined();
    expect(catalog(true, true)).toBeUndefined();
    expect(catalog(false, true)?.renderMode).toBe(RenderMode.Prerender);
  });

  it('preserves the prerendered public landing and /admin in regular builds', async () => {
    const { routes, serverRoutes } = await loadRoutes(false);
    expect(routes.find((route) => route.path === '')?.title).toContain('Tours en Cusco');
    expect(serverRoutes.find((route) => route.path === '')?.renderMode).toBe(RenderMode.Prerender);
    expect(routes.find((route) => route.path === 'admin')?.loadComponent).toBeDefined();
  });
});
