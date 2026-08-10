import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
app.disable('x-powered-by');
app.use((_request, response, next) => {
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-Frame-Options', 'DENY');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

const configuredHosts = process.env['NG_ALLOWED_HOSTS']
  ?.split(',')
  .map((host) => host.trim())
  .filter(Boolean);
const angularApp = new AngularNodeAppEngine({
  allowedHosts: ['localhost', '127.0.0.1', ...(configuredHosts ?? [])],
});

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: 0,
    index: 'index.html',
    redirect: true,
    setHeaders: (response, filePath) => {
      if (/[-.][a-z0-9]{8,}\.(?:css|js)$/i.test(filePath)) {
        response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (/\.(?:avif|gif|ico|jpe?g|png|svg|webp|woff2?)$/i.test(filePath)) {
        response.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800');
      } else {
        response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      }
    },
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Kusi Q’umir disponible en http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
