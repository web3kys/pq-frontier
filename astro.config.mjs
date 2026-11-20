// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Post-Quantum Frontier — bilingual (zh/en) static portal.
// SITE_URL: the production origin. Set it to the real .com domain in
// Phase 5 (deployment); every absolute URL on the site (canonical,
// hreflang, sitemap, RSS, Open Graph) derives from it.
const SITE_URL = process.env.SITE_URL ?? 'https://example.com';

export default defineConfig({
  site: SITE_URL,
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'zh',
        locales: { zh: 'zh-CN', en: 'en' },
      },
      filter: (page) => !page.includes('/search/'),
    }),
  ],
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
      wrap: true,
    },
  },
});
