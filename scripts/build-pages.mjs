import { spawnSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { launchGate } from './launch-gate.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const base = process.env.PAGES_BASE_PATH || '/';
if (!/^\/(?:[A-Za-z0-9_-]+\/)*$/.test(base)) {
  throw new Error('PAGES_BASE_PATH must be an absolute directory path ending in /.');
}
const output = join(root, '.pages-site');
const result = spawnSync(
  'corepack',
  [
    'pnpm',
    '--dir',
    'frontend',
    'exec',
    'ng',
    'build',
    '--configuration',
    'production,pages',
    '--base-href',
    base,
    '--output-path',
    '../.pages-build',
  ],
  { cwd: root, stdio: 'inherit' },
);
if (result.status !== 0) process.exit(result.status ?? 1);
await rm(output, { recursive: true, force: true });
await cp(join(root, '.pages-build/browser'), output, { recursive: true });
const tours = JSON.parse(
  await readFile(join(root, 'backend/prisma/catalog/tours.json'), 'utf8'),
).filter((tour) => tour.active);
await mkdir(join(output, 'assets/catalog'), { recursive: true });
await writeFile(join(output, 'assets/catalog/tours.json'), JSON.stringify(tours));

// Angular emits a client shell for routes that normally need the API.
// Materialize each catalog URL so direct links and refreshes work on Pages.
const shell = await readFile(join(output, 'index.csr.html'), 'utf8');
for (const path of ['tours', ...tours.map((tour) => `tours/${tour.slug}`)]) {
  const directory = join(output, path);
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, 'index.html'), shell);
}
await writeFile(join(output, '404.html'), shell);
await writeFile(join(output, '.nojekyll'), '');

// Existing SSR assets use root URLs. Scope only those asset URLs to the Pages
// project path in this publication copy; the regular SSR output is untouched.
const rootAssets =
  /(?<![A-Za-z0-9_:/.-])\/(assets\/|favicon\.(?:svg|ico)|apple-touch-icon\.png|app-icon-\d+\.png|site\.webmanifest)/g;
async function scopeAssets(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await scopeAssets(path);
    else if (/\.(?:html|css|js|json|webmanifest)$/.test(entry.name)) {
      const source = await readFile(path, 'utf8');
      let content = source.replace(rootAssets, `${base}$1`);
      if (entry.name.endsWith('.html') && !path.startsWith(join(output, 'lanzamiento') + '/')) {
        content = content.replace(/<head[^>]*>/i, (head) => head + launchGate(base));
      }
      await writeFile(path, content);
    }
  }
}
await scopeAssets(output);
const manifestPath = join(output, 'site.webmanifest');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
manifest.start_url = base;
manifest.scope = base;
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Pages ready: ${output} (${tours.length} tours; base ${base})`);
