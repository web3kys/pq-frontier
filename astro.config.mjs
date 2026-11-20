// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Post-Quantum Frontier — bilingual (zh/en) static portal.
// `site` is intentionally unset until the production .com domain is bound
// (Phase 5); canonical/hreflang/sitemap wiring lands in Phase 3.
export default defineConfig({
  integrations: [mdx()],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      wrap: true,
    },
  },
});
