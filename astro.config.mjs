import { defineConfig } from 'astro/config';
import site from './src/config/site.json' with { type: 'json' };

export default defineConfig({
  site: site.url,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
  compressHTML: true,
});
