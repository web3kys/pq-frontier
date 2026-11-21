import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Articles live under src/content/articles/<lang>/<section>/<slug>.md(x)
 * - lang:    'zh' | 'en'  (must match the folder the file lives in)
 * - section: one of the six article sections (must match the folder)
 * - translationKey: shared id pairing the zh and en versions of one article;
 *   used for hreflang in Phase 3. An article without a counterpart simply
 *   has no pair — the other-language page must be marked "not yet translated",
 *   never faked.
 * - imageCredit: source + licence note for the hero image (content rules:
 *   every article records where its images come from).
 */
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    lang: z.enum(['zh', 'en']),
    section: z.enum([
      'pqc',
      'quantum',
      'security',
      'migration',
      'research',
      'tutorials',
    ]),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
    imageCredit: z.string().optional(),
    translationKey: z.string().optional(),
    keyPoints: z.array(z.string()).optional(),
    author: z.string().default('PQ Frontier'),
  }),
});

export const collections = { articles };
