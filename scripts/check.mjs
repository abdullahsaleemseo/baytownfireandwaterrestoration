#!/usr/bin/env node
/**
 * Pre-launch checks. Run after `npm run build`:
 *   node scripts/check.mjs                 all offline checks
 *   node scripts/check.mjs --external      also request every external link
 *   node scripts/check.mjs --placeholders-only
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const site = JSON.parse(readFileSync(join(ROOT, 'src/config/site.json'), 'utf8'));
const args = process.argv.slice(2);
let failures = 0;
const fail = (m) => { failures++; console.log('  FAIL  ' + m); };
const ok = (m) => console.log('  ok    ' + m);
const head = (m) => console.log('\n== ' + m);

// ---------------------------------------------------------------- placeholders
head('Placeholders still to fill (src/config/site.json)');
const placeholders = Object.entries(site).filter(([, v]) => typeof v === 'string' && /\{\{.+\}\}/.test(v));
if (placeholders.length) placeholders.forEach(([k, v]) => console.log(`  TODO  ${k} = ${v}`));
else ok('none left');
if (!site.social.length) console.log('  note  social = [] (no profiles linked; add real ones only)');
if (args.includes('--placeholders-only')) process.exit(0);

if (!existsSync(DIST)) { console.error('dist/ not found. Run `npm run build` first.'); process.exit(1); }

const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk(DIST);
const pages = files.filter((f) => f.endsWith('.html')).map((f) => {
  const html = readFileSync(f, 'utf8');
  const rel = '/' + relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g, '/');
  return { file: f, url: rel === '/404.html' ? '/404.html' : rel, html };
});
const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();
const mainOf = (h) => (h.match(/<main[\s\S]*<\/main>/) || [''])[0];
const is404 = (p) => p.url === '/404.html';

// ---------------------------------------------------------------- meta
head(`Meta, headings, indexing (${pages.length} pages)`);
const titles = new Map(), descs = new Map();
for (const p of pages) {
  const title = (p.html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = (p.html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const t = title.replace(/&amp;/g, '&'), d = desc.replace(/&amp;/g, '&');
  const h1s = (p.html.match(/<h1[\s>]/g) || []).length;
  const canon = (p.html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(p.html);
  const words = strip(mainOf(p.html)).split(' ').length;
  const probs = [];
  if (!t || t.length > 60) probs.push(`title ${t.length} chars`);
  if (!is404(p) && (!d || d.length > 155)) probs.push(`description ${d.length} chars`);
  if (h1s !== 1) probs.push(`${h1s} h1`);
  if (is404(p)) { if (!noindex) probs.push('404 should be noindex'); }
  else {
    if (noindex) probs.push('noindex present');
    if (canon !== site.url + p.url) probs.push(`canonical ${canon}`);
    if (titles.has(t)) probs.push(`duplicate title with ${titles.get(t)}`); titles.set(t, p.url);
    if (descs.has(d)) probs.push(`duplicate description with ${descs.get(d)}`); descs.set(d, p.url);
    if (!/property="og:title"/.test(p.html) || !/name="twitter:card"/.test(p.html)) probs.push('missing OG/Twitter tags');
  }
  if (/—/.test(p.html)) probs.push('contains an em dash');
  const imgs = p.html.match(/<img\b[^>]*>/g) || [];
  for (const i of imgs) {
    if (!/\balt="[^"]{8,}"/.test(i)) probs.push('image without descriptive alt: ' + i.slice(0, 70));
    if (!/\bwidth="\d+"/.test(i) || !/\bheight="\d+"/.test(i)) probs.push('image without width/height');
  }
  const line = `${p.url.padEnd(46)} title ${String(t.length).padStart(2)}  desc ${String(d.length).padStart(3)}  words ${String(words).padStart(4)}`;
  probs.length ? fail(line + '  -> ' + probs.join('; ')) : ok(line);
}

// ---------------------------------------------------------------- banned phrases
head('Banned phrases and unverifiable claims');
const banned = [/in today's fast-paced/i, /look no further/i, /\bunlock\b/i, /\belevate\b/i, /\bseamless/i, /navigate the complexit/i, /trusted partner/i,
  /\b24\/7\b/, /open now/i, /\b\d+[- ]minute (response|arrival)/i, /\bour technicians/i, /our crews? (arrive|will)/i, /years? in business/i, /\bBBB\b/, /preferred vendor/i,
  /we work with all insurance/i, /no out-of-pocket/i, /satisfaction guaranteed/i, /\b5[- ]star\b/i];
let bannedHits = 0;
for (const p of pages) for (const re of banned) { const m = strip(p.html).match(re); if (m) { bannedHits++; fail(`${p.url}: "${m[0]}"`); } }
if (!bannedHits) ok('none found');

// ---------------------------------------------------------------- links
head('Internal links');
const linked = new Set(['/']);
let broken = 0;
const external = new Map();
for (const p of pages) {
  const hrefs = [...p.html.replace(/<script[\s\S]*?<\/script>/g, ' ').matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map((m) => m[1].replace(/&amp;/g, '&'));
  for (const h of hrefs) {
    if (/^(tel:|mailto:)/.test(h)) continue;
    if (/^https?:\/\//.test(h)) { if (!external.has(h)) external.set(h, p.url); continue; }
    const [path, hash] = h.split('#');
    if (!path) { if (hash && !new RegExp(`id="${hash}"`).test(p.html)) { broken++; fail(`${p.url}: missing anchor #${hash}`); } continue; }
    if (!path.endsWith('/')) { broken++; fail(`${p.url}: link without trailing slash ${h}`); continue; }
    const target = pages.find((x) => x.url === path);
    if (!target) { broken++; fail(`${p.url}: broken link ${h}`); continue; }
    if (hash && !new RegExp(`id="${hash}"`).test(target.html)) { broken++; fail(`${p.url}: missing anchor ${h}`); }
    if (!is404(p)) linked.add(path);
  }
  for (const m of p.html.matchAll(/\b(?:src|href)="(\/[^"#?]+\.[a-z0-9]+)"/g)) {
    if (!existsSync(join(DIST, m[1]))) { broken++; fail(`${p.url}: missing asset ${m[1]}`); }
  }
}
if (!broken) ok('no broken internal links or assets');
const orphans = pages.filter((p) => !is404(p) && !linked.has(p.url));
orphans.length ? orphans.forEach((o) => fail('orphan page ' + o.url)) : ok('no orphan pages');

head('Header and footer link counts');
{
  const h = pages.find((p) => p.url === '/').html;
  const nav = (h.match(/<header[\s\S]*?<\/header>/) || [''])[0];
  const foot = (h.match(/<footer[\s\S]*?<\/footer>/) || [''])[0];
  const n = (nav.match(/<a\b/g) || []).length, f = (foot.match(/<a\b/g) || []).length;
  n < 13 ? ok(`header: ${n} links (${(nav.match(/<nav[\s\S]*?<\/nav>/) || [''])[0].match(/<a\b/g).length} in the menu)`) : fail(`header has ${n} links`);
  f <= 20 ? ok(`footer: ${f} links`) : fail(`footer has ${f} links`);
}

// ---------------------------------------------------------------- sitemap / robots
head('Sitemap and robots.txt');
{
  const sm = existsSync(join(DIST, 'sitemap.xml')) ? readFileSync(join(DIST, 'sitemap.xml'), 'utf8') : '';
  const locs = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace(site.url, ''));
  const indexable = pages.filter((p) => !is404(p)).map((p) => p.url);
  const missing = indexable.filter((u) => !locs.includes(u)), extra = locs.filter((u) => !indexable.includes(u));
  missing.length || extra.length ? fail(`sitemap mismatch. missing: ${missing} extra: ${extra}`) : ok(`sitemap.xml lists all ${locs.length} indexable pages`);
  const rb = existsSync(join(DIST, 'robots.txt')) ? readFileSync(join(DIST, 'robots.txt'), 'utf8') : '';
  /Sitemap: https:\/\//.test(rb) && !/Disallow: \/\s*$/m.test(rb) ? ok('robots.txt allows crawling and points to the sitemap') : fail('robots.txt problem');
}

// ---------------------------------------------------------------- schema
head('Schema (JSON-LD)');
const SERVICE_PAGES = ['/water-damage-restoration-baytown-tx/', '/fire-smoke-damage-restoration-baytown-tx/', '/burst-pipe-water-damage-baytown/', '/flood-storm-water-cleanup-baytown/', '/mold-after-water-damage-baytown/'];
let schemaProblems = 0;
for (const p of pages.filter((x) => !is404(x))) {
  const probs = [];
  const blocks = [...p.html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (blocks.length !== 1) probs.push(`${blocks.length} JSON-LD blocks`);
  let graph = [];
  try { const j = JSON.parse(blocks[0]); if (j['@context'] !== 'https://schema.org') probs.push('bad @context'); graph = j['@graph'] || []; } catch (e) { probs.push('invalid JSON: ' + e.message); }
  const raw = blocks[0] || '';
  for (const bad of ['LocalBusiness', 'HomeAndConstructionBusiness', 'aggregateRating', '"review"', 'openingHours', 'PostalAddress', 'streetAddress']) if (raw.includes(bad)) probs.push('forbidden: ' + bad);
  const byType = (t) => graph.filter((n) => n['@type'] === t);
  const org = byType('Organization')[0], web = byType('WebSite')[0];
  if (!org) probs.push('no Organization'); else for (const k of ['name', 'url', 'logo', 'telephone', 'email', 'areaServed']) if (!org[k]) probs.push('Organization.' + k);
  if (org && 'sameAs' in org && !site.social.length) probs.push('sameAs without real profiles');
  if (!web || !web.url || !web.name) probs.push('WebSite incomplete');
  const bc = byType('BreadcrumbList')[0];
  if (p.url !== '/') {
    if (!bc) probs.push('no BreadcrumbList');
    else bc.itemListElement.forEach((it, i) => { if (it['@type'] !== 'ListItem' || it.position !== i + 1 || !it.name || !/^https:\/\//.test(it.item)) probs.push('bad breadcrumb item ' + i); });
    if (bc && bc.itemListElement.at(-1).item !== site.url + p.url) probs.push('breadcrumb does not end on this page');
  }
  const svc = byType('Service')[0];
  if (SERVICE_PAGES.includes(p.url)) {
    if (!svc) probs.push('no Service'); else { for (const k of ['name', 'serviceType', 'areaServed', 'provider']) if (!svc[k]) probs.push('Service.' + k); if (svc.provider?.['@id'] !== org?.['@id']) probs.push('Service.provider is not the Organization'); }
  } else if (svc) probs.push('unexpected Service');
  const faq = byType('FAQPage')[0];
  const visibleQs = [...p.html.matchAll(/<summary><h3>([\s\S]*?)<\/h3><\/summary>/g)].map((m) => strip(m[1]));
  if (faq) {
    const text = strip(mainOf(p.html));
    for (const q of faq.mainEntity) {
      if (q['@type'] !== 'Question' || !q.name || q.acceptedAnswer?.['@type'] !== 'Answer' || !q.acceptedAnswer.text) probs.push('bad Question');
      if (!visibleQs.includes(q.name.replace(/\s+/g, ' '))) probs.push('FAQ question not visible: ' + q.name.slice(0, 40));
      if (!text.includes(q.acceptedAnswer.text.slice(0, 60))) probs.push('FAQ answer not visible: ' + q.name.slice(0, 40));
    }
    if (faq.mainEntity.length !== visibleQs.length) probs.push(`FAQ count ${faq.mainEntity.length} vs ${visibleQs.length} visible`);
  } else if (visibleQs.length) probs.push('visible FAQ without FAQPage');
  const types = graph.map((n) => n['@type']).join(', ');
  if (probs.length) { schemaProblems++; fail(`${p.url}: ${probs.join('; ')}`); } else ok(`${p.url.padEnd(46)} ${types}`);
}

// ---------------------------------------------------------------- phones
head('Phone numbers');
{
  const FIRE_PAGES = ['/fire-smoke-damage-restoration-baytown-tx/'];
  let probs = 0;
  const wTel = 'tel:' + site.phoneWaterTel, fTel = 'tel:' + site.phoneFireTel;
  for (const p of pages) {
    const tels = [...p.html.matchAll(/<a\b[^>]*href="(tel:[^"]*)"[^>]*>/g)].map((m) => ({ href: m[1], offer: (m[0].match(/data-offer="(\w+)"/) || [])[1], loc: (m[0].match(/data-call-location="([\w-]+)"/) || [])[1] }));
    for (const t of tels) {
      if (t.href !== wTel && t.href !== fTel) { probs++; fail(`${p.url}: unknown tel link ${t.href}`); }
      if (!t.offer) { probs++; fail(`${p.url}: tel link without data-offer (${t.loc})`); }
      if ((t.offer === 'fire') !== (t.href === fTel) && wTel !== fTel) { probs++; fail(`${p.url}: offer/number mismatch at ${t.loc}`); }
    }
    const chrome = tels.filter((t) => ['header', 'footer', 'mobile-bar', 'cta-band', 'sidebar'].includes(t.loc));
    const want = FIRE_PAGES.includes(p.url) ? 'fire' : 'water';
    const wrong = chrome.filter((t) => t.offer !== want && !['/how-it-works/'].includes(p.url));
    if (wrong.length) { probs++; fail(`${p.url}: expected ${want} number in ${wrong.map((w) => w.loc)}`); }
    if (p.url === '/' && !tels.some((t) => t.offer === 'fire' && t.loc === 'home-fire')) { probs++; fail('home fire section is missing the fire number'); }
    if (p.url === '/contact/' && !(tels.some((t) => t.offer === 'fire') && tels.some((t) => t.offer === 'water'))) { probs++; fail('contact page must show both numbers'); }
    // hard-coded numbers anywhere in visible text
    const hard = strip(p.html).match(/(?:\+?1[\s.-]?)?\(?\b[2-9]\d{2}\)?[\s.-]\d{3}[\s.-]\d{4}\b/g) || [];
    const allowed = [site.phoneWater, site.phoneFire];
    for (const hnum of hard) if (!allowed.some((a) => a.includes(hnum) || hnum.includes(a))) { probs++; fail(`${p.url}: hard-coded phone number "${hnum}"`); }
  }
  const src = walk(join(ROOT, 'src')).filter((f) => !f.endsWith('site.json') && !/\.(jpg|jpeg|png|webp)$/.test(f));
  for (const f of src) {
    const s = readFileSync(f, 'utf8');
    if (/tel:(?!\$\{)/.test(s.replace(/href\^="tel:"/g, '')) && !f.endsWith('lib/site.ts')) { probs++; fail(`hard-coded tel: in ${relative(ROOT, f)}`); }
    const m = s.match(/\(?\b[2-9]\d{2}\)?[\s.-]\d{3}[\s.-]\d{4}\b/);
    if (m) { probs++; fail(`hard-coded phone number in ${relative(ROOT, f)}: ${m[0]}`); }
  }
  if (!probs) ok('all tel: links come from site.json; water default, fire on fire page, home fire section and contact page');
}

// ---------------------------------------------------------------- duplicates
head('Duplicate content between pages');
{
  const SHARED = [/connects Baytown homeowners with independent/];
  const seen = new Map();
  let dups = 0;
  for (const p of pages.filter((x) => !is404(x))) {
    const main = mainOf(p.html).replace(/<aside[\s\S]*?<\/aside>/g, ' ');
    const blocks = [...main.matchAll(/<(p|li|td|h2|h3)\b[^>]*>([\s\S]*?)<\/\1>/g)].map((m) => strip(m[2])).filter((t) => t.length >= 90 && !SHARED.some((r) => r.test(t)));
    for (const b of new Set(blocks)) {
      if (seen.has(b) && seen.get(b) !== p.url) { dups++; fail(`same text on ${seen.get(b)} and ${p.url}: "${b.slice(0, 80)}..."`); }
      else seen.set(b, p.url);
    }
  }
  // 12-word shingle overlap between page bodies
  const sh = (t) => { const w = t.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').filter(Boolean); const s = new Set(); for (let i = 0; i + 12 <= w.length; i++) s.add(w.slice(i, i + 12).join(' ')); return s; };
  const bodies = pages.filter((x) => !is404(x)).map((p) => ({ url: p.url, s: sh(strip(mainOf(p.html).replace(/<aside[\s\S]*?<\/aside>/g, ' ').replace(/<section class="cta-band[\s\S]*?<\/section>/g, ' '))) }));
  let worst = { v: 0 };
  for (let i = 0; i < bodies.length; i++) for (let j = i + 1; j < bodies.length; j++) {
    let c = 0; for (const x of bodies[i].s) if (bodies[j].s.has(x)) c++;
    const v = c / Math.max(1, Math.min(bodies[i].s.size, bodies[j].s.size));
    if (v > worst.v) worst = { v, a: bodies[i].url, b: bodies[j].url };
    if (v > 0.08) { dups++; fail(`${(v * 100).toFixed(1)}% shared 12-word sequences: ${bodies[i].url} and ${bodies[j].url}`); }
  }
  if (!dups) ok(`no repeated paragraphs; highest 12-word overlap between two pages is ${(worst.v * 100).toFixed(1)}% (${worst.a} vs ${worst.b})`);
}

// ---------------------------------------------------------------- external links
if (args.includes('--external')) {
  head(`External links (${external.size})`);
  for (const [url, from] of external) {
    try {
      const r = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'link-check/1.0' }, signal: AbortSignal.timeout(30000) });
      r.ok ? ok(`${r.status} ${url}`) : fail(`${r.status} ${url} (linked from ${from})`);
    } catch (e) { fail(`ERR ${url} (${e.cause?.code || e.message}) linked from ${from}`); }
  }
} else {
  head(`External links: ${external.size} found. Re-run with --external to request each one.`);
}

console.log(`\n${failures ? failures + ' check(s) FAILED' : 'All checks passed'}`);
process.exit(failures ? 1 : 0);
