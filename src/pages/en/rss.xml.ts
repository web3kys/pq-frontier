import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { ui } from '../../lib/i18n';

export async function GET(context: APIContext) {
  const articles = (await getCollection(
    'articles',
    ({ data }) => data.lang === 'en' && !data.draft,
  )).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${ui.en.siteName} · ${ui.en.siteNameEn}`,
    description: ui.en.heroLead,
    site: context.site ?? 'https://example.com',
    items: articles.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.pubDate,
      link: `/en/${e.data.section}/${e.id.split('/').pop()}/`,
      categories: e.data.tags,
    })),
    customData: '<language>en</language>',
  });
}
