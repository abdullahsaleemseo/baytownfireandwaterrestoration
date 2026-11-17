import type { APIRoute } from 'astro';
import { SITE } from '../lib/site';

// While "noindex" is true in site.json, pages carry a noindex tag. Crawling stays
// allowed so search engines can read that tag; the sitemap is only advertised at launch.
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nAllow: /\nDisallow: /api/\n` + (SITE.noindex ? '' : `\nSitemap: ${SITE.url}/sitemap.xml\n`),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
