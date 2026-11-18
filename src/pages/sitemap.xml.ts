import type { APIRoute } from 'astro';
import { SITE, INDEXABLE } from '../lib/site';

// lastmod is the build date, so every deploy refreshes it.
const buildDate = new Date().toISOString().slice(0, 10);

export const GET: APIRoute = () => {
  const urls = INDEXABLE.map(
    (p) => `  <url><loc>${SITE.url}${p}</loc><lastmod>${buildDate}</lastmod></url>`,
  ).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
