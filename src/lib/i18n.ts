export type Lang = 'zh' | 'en';

export const LANGS: Lang[] = ['zh', 'en'];

export interface SectionMeta {
  slug: string;
  zh: string;
  en: string;
  zhDesc: string;
  enDesc: string;
}

/** The six article sections, in navigation order. */
export const SECTIONS: SectionMeta[] = [
  {
    slug: 'pqc',
    zh: '后量子密码学',
    en: 'Post-Quantum Cryptography',
    zhDesc: 'PQC 基础、NIST 标准、ML-KEM / ML-DSA / SLH-DSA 与算法比较。',
    enDesc: 'PQC foundations, the NIST standards, ML-KEM / ML-DSA / SLH-DSA and algorithm comparisons.',
  },
  {
    slug: 'quantum',
    zh: '量子计算',
    en: 'Quantum Computing',
    zhDesc: '量子计算原理、量子芯片、量子纠错与量子算法的技术路线。',
    enDesc: 'Quantum computing principles, quantum chips, error correction and algorithms.',
  },
  {
    slug: 'security',
    zh: '数字安全',
    en: 'Digital Security',
    zhDesc: '数据加密、数字签名、身份认证与密钥管理。',
    enDesc: 'Data encryption, digital signatures, identity authentication and key management.',
  },
  {
    slug: 'migration',
    zh: '后量子迁移',
    en: 'Post-Quantum Migration',
    zhDesc: '企业密码系统升级、迁移路线、安全评估与实施指南。',
    enDesc: 'Enterprise cryptographic upgrades, migration roadmaps, assessments and implementation guides.',
  },
  {
    slug: 'research',
    zh: '深度研究',
    en: 'Research',
    zhDesc: '原创研究、学术论文解读、技术对比与专题报告。',
    enDesc: 'Original research, paper reviews, technical comparisons and in-depth reports.',
  },
  {
    slug: 'tutorials',
    zh: '技术教程',
    en: 'Tutorials',
    zhDesc: '密码学入门、PQC 实践、开源工具与编程示例。',
    enDesc: 'Cryptography primers, hands-on PQC practice, open-source tools and code examples.',
  },
];

export const sectionBySlug = (slug: string): SectionMeta =>
  SECTIONS.find((s) => s.slug === slug) ?? SECTIONS[0];

export const ui = {
  zh: {
    siteName: '后量子前沿',
    siteNameEn: 'Post-Quantum Frontier',
    tagline: '为量子时代重写安全规则',
    heroLead:
      '一个专注于后量子密码学、量子计算与数字安全的个人研究门户：读标准、拆算法、谈迁移——只发原创研究与技术教程。',
    navHome: '首页',
    navResources: '研究资源',
    navAbout: '关于本站',
    navSearch: '搜索',
    tocTitle: '本文目录',
    searchTitle: '站内搜索',
    searchLead: '搜索本站全部文章与页面。',
    areasTitle: '核心研究领域',
    manifestoKicker: '本站宗旨',
    manifesto: '读标准，拆算法，谈迁移——把后量子时代的安全，一篇一篇讲清楚。',
    manifestoSub: '不追新闻，不卖焦虑。只做一件事：把 NIST 标准、学术论文与开源实现，变成工程师能直接用的知识。',
    scrollHint: '向下滚动',
    areasLead: '六个长期积累的方向，从算法与标准出发，最终落到可执行的迁移方案。',
    featuredTitle: '精选文章',
    latestTitle: '最新文章',
    emptyFeatured: '首批精选文章正在准备中。',
    emptyLatest: '本站刚刚起步，第一批原创文章即将发布。',
    emptySection: '本栏目尚无文章，内容建设中。',
    readMore: '阅读全文',
    resourcesTitle: '研究资源',
    resourcesLead: '官方标准、学术论文与开源工具的长期索引。引用均标明原始来源与发布日期。',
    aboutTitle: '关于本站',
    footerNote: '个人独立运营的科技知识与研究门户 · 内容为原创研究与技术教程',
    footerRights: '保留所有权利',
    langSwitch: 'EN',
    langSwitchLabel: 'Switch to English',
    publishedOn: '发布于',
    updatedOn: '更新于',
    tagsLabel: '标签',
    backToSection: '返回栏目',
    minutesRead: '分钟阅读',
  },
  en: {
    siteName: 'Post-Quantum Frontier',
    siteNameEn: '后量子前沿',
    tagline: 'Rewriting the rules of security for the quantum era',
    heroLead:
      'A personal research portal on post-quantum cryptography, quantum computing and digital security: reading the standards, dissecting the algorithms, planning the migration — original research and tutorials only.',
    navHome: 'Home',
    navResources: 'Resources',
    navAbout: 'About',
    navSearch: 'Search',
    tocTitle: 'Contents',
    searchTitle: 'Site Search',
    searchLead: 'Search all articles and pages on this site.',
    areasTitle: 'Core Research Areas',
    manifestoKicker: 'Manifesto',
    manifesto: 'Read the standards. Dissect the algorithms. Plan the migration — post-quantum security, explained one piece at a time.',
    manifestoSub: 'No news chasing, no hype. One job only: turn NIST standards, papers and open-source implementations into knowledge engineers can actually use.',
    scrollHint: 'Scroll',
    areasLead: 'Six long-term directions, from algorithms and standards to migration plans that can actually be executed.',
    featuredTitle: 'Featured',
    latestTitle: 'Latest Articles',
    emptyFeatured: 'The first featured articles are in preparation.',
    emptyLatest: 'This portal has just launched; the first original articles are on their way.',
    emptySection: 'No articles in this section yet — content is being built.',
    readMore: 'Read more',
    resourcesTitle: 'Research Resources',
    resourcesLead: 'A long-term index of official standards, academic papers and open-source tools. Every reference names its original source and date.',
    aboutTitle: 'About',
    footerNote: 'An independently run portal for technology knowledge and research · Original research and tutorials only',
    footerRights: 'All rights reserved',
    langSwitch: '中文',
    langSwitchLabel: '切换到中文',
    publishedOn: 'Published',
    updatedOn: 'Updated',
    tagsLabel: 'Tags',
    backToSection: 'Back to section',
    minutesRead: 'min read',
  },
} as const;

export type UiStrings = (typeof ui)['zh'];

/** Path of the same page in the other language (structure is mirrored). */
export function counterpartPath(pathname: string, target: Lang): string {
  const other: Lang = target === 'zh' ? 'en' : 'zh';
  if (pathname === `/${other}` || pathname.startsWith(`/${other}/`)) {
    return pathname.replace(`/${other}`, `/${target}`);
  }
  return `/${target}/`;
}
