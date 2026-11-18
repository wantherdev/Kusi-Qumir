import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const origin = 'https://kusiqumir.com';
const noindex = /<meta\s+name="robots"\s+content="noindex,\s*nofollow"\s*\/?\s*>/i;

export async function writePagesSeo(output, indexable) {
  const entries = await readdir(join(output, 'tours'), { withFileTypes: true });
  const slugs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  if (!slugs.length || slugs.some((slug) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))) {
    throw new Error('Expected prerendered public tour routes.');
  }

  const routes = ['', 'tours', ...slugs.map((slug) => `tours/${slug}`)];
  const urls = [];
  const titles = new Set();
  const descriptions = new Set();
  for (const route of routes) {
    const file = join(output, route, 'index.html');
    let html = await readFile(file, 'utf8');
    if (!noindex.test(html) || !/<\/head>/i.test(html) || !/<h1\b/i.test(html)) {
      throw new Error(`Missing initial content or evaluation metadata in /${route}.`);
    }
    if (
      (route === 'tours' && !slugs.every((slug) => html.includes(`href="/tours/${slug}"`))) ||
      (route.startsWith('tours/') &&
        (!html.includes('class="breadcrumbs"') || !html.includes('>Itinerario<')))
    ) {
      throw new Error(`Missing prerendered catalog content in /${route}.`);
    }

    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1].trim();
    const description = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1].trim();
    if (!title || !description || titles.has(title) || descriptions.has(description)) {
      throw new Error(`Missing or duplicate search metadata in /${route}.`);
    }
    if (/<link\b[^>]*rel="canonical"/i.test(html)) {
      throw new Error(`Unexpected existing canonical in /${route}.`);
    }
    titles.add(title);
    descriptions.add(description);

    const canonical = `${origin}/${route ? `${route}/` : ''}`;
    html = html
      .replace(
        /(<meta\s+(?:property="og:image"|name="twitter:image")\s+content=")\/(?!\/)/gi,
        `$1${origin}/`,
      )
      .replace(
        /<\/head>/i,
        `<link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}"></head>`,
      );

    if (indexable) html = html.replace(noindex, '<meta name="robots" content="index, follow">');
    await writeFile(file, html);
    urls.push(canonical);
  }

  if (indexable) {
    for (const entry of ['admin/index.html', '404.html', 'index.csr.html']) {
      if (!noindex.test(await readFile(join(output, entry), 'utf8'))) {
        throw new Error(`Expected noindex in /${entry}.`);
      }
    }
    const sitemap = [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...urls.map((url) => `  <url><loc>${url}</loc></url>`),
      '</urlset>',
      '',
    ].join('\n');
    await writeFile(join(output, 'sitemap.xml'), sitemap);
    await writeFile(
      join(output, 'robots.txt'),
      `User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`,
    );
  }
}
