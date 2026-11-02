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
  it('preserves the prerendered public landing and /admin in regular builds', async () => {
    const { routes, serverRoutes } = await loadRoutes(false);
    expect(routes.find((route) => route.path === '')?.title).toContain('Cusco auténtico');
    expect(serverRoutes.find((route) => route.path === '')?.renderMode).toBe(RenderMode.Prerender);
    expect(routes.find((route) => route.path === 'admin')?.loadComponent).toBeDefined();
  });
});
