import type { APIRoute } from 'astro';
import { SITE } from '../lib/site';

// Pages carry a noindex tag while "noindex" is true in site.json. Crawling stays
// allowed so search engines can read that tag, and the sitemap is listed.
export const GET: APIRoute = () =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
