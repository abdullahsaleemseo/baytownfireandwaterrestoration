// Generates brand images in public/ from the supplied logo and favicon.
// Sources: public/favicon.svg (mark) and src/assets/brand/logo-wordmark-*.png
// (the supplied wordmark SVG rendered with Nunito 900, margins trimmed).
// Run: node scripts/make-brand-assets.mjs
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const mark = readFileSync('public/favicon.svg');
const light = 'src/assets/brand/logo-wordmark-light.png';
const dark = 'src/assets/brand/logo-wordmark-dark.png';

// Favicons
await sharp(mark, { density: 400 }).resize(48, 48).png().toFile('public/favicon-48.png');
await sharp(mark, { density: 800 }).resize(180, 180).flatten({ background: '#ffffff' }).png().toFile('public/apple-touch-icon.png');

// Header and footer logos (3x the displayed height for sharp screens)
await sharp(light).resize({ height: 168 }).webp({ quality: 90 }).toFile('public/logo-header.webp');
await sharp(dark).resize({ height: 168 }).webp({ quality: 90 }).toFile('public/logo-footer.webp');

// Logo for structured data: wordmark on white, 1200px wide
const lm = await sharp(light).resize({ width: 1100 }).png().toBuffer();
const lmMeta = await sharp(lm).metadata();
await sharp({ create: { width: 1200, height: lmMeta.height + 100, channels: 4, background: '#ffffff' } })
  .composite([{ input: lm, left: 50, top: 50 }]).png().toFile('public/logo.png');

// Social share image
const og = await sharp(dark).resize({ width: 820 }).png().toBuffer();
const ogMeta = await sharp(og).metadata();
const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect x="0" y="0" width="1200" height="10" fill="#087DD3"/>
  <text x="600" y="520" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" fill="#C6CFD8">Local referral line for Baytown, Texas homeowners</text>
</svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#0D0D0D' } })
  .composite([{ input: og, left: Math.round((1200 - 820) / 2), top: Math.round(230 - ogMeta.height / 2) + 60 }, { input: text, left: 0, top: 0 }])
  .jpeg({ quality: 84 }).toFile('public/og-default.jpg');

for (const f of ['favicon-48.png', 'apple-touch-icon.png', 'logo-header.webp', 'logo-footer.webp', 'logo.png', 'og-default.jpg']) {
  const m = await sharp('public/' + f).metadata();
  console.log(f, m.width + 'x' + m.height);
}
