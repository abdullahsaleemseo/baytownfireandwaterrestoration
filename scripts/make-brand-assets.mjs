// Generates PNG/JPG brand assets in public/ from the SVG logo mark. Run: node scripts/make-brand-assets.mjs
import sharp from 'sharp';
import { readFileSync } from 'node:fs';

const mark = readFileSync('public/favicon.svg');
await sharp(mark, { density: 400 }).resize(48, 48).png().toFile('public/favicon-48.png');
await sharp(mark, { density: 600 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(mark, { density: 900 }).resize(512, 512).png().toFile('public/logo.png');

const inner = readFileSync('public/favicon.svg', 'utf8').replace(/<\/?svg[^>]*>/g, '');
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0D0D0D"/>
  <rect x="0" y="0" width="1200" height="10" fill="#0074D4"/>
  <rect x="80" y="150" width="8" height="330" fill="#0074D4"/>
  <g transform="translate(120 150) scale(2.2)">${inner}</g>
  <text x="120" y="330" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="76" fill="#FFFFFF">BAYTOWN</text>
  <text x="120" y="408" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="52" fill="#4FA8F0">FIRE AND WATER RESTORATION</text>
  <text x="120" y="470" font-family="Arial, Helvetica, sans-serif" font-size="30" fill="#C6CFD8">Local referral line for Baytown, Texas homeowners</text>
</svg>`;
await sharp(Buffer.from(og)).jpeg({ quality: 82 }).toFile('public/og-default.jpg');
console.log('brand assets written');
