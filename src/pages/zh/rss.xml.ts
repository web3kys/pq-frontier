import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { ui } from '../../lib/i18n';

export async function GET(context: APIContext) {
  const articles = (await getCollection(
    'articles',
    ({ data }) => data.lang === 'zh' && !data.draft,
  )).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return rss({
    title: `${ui.zh.siteName} · ${ui.zh.siteNameEn}`,
    description: ui.zh.heroLead,
    site: context.site ?? 'https://example.com',
    items: articles.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.pubDate,
      link: `/zh/${e.data.section}/${e.id.split('/').pop()}/`,
      categories: e.data.tags,
    })),
    customData: '<language>zh-CN</language>',
  });
}
