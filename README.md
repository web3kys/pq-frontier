# 后量子前沿 · Post-Quantum Frontier (PQ Frontier)

个人独立运营的全球双语（中文 / English）科技知识与研究门户：后量子密码学、量子计算、数字安全与后量子迁移。纯静态网站，无账户、无评论、无后端。

## 技术栈

- [Astro](https://astro.build) 5 + TypeScript（严格模式）
- 内容：Markdown / MDX 内容集合（Content Layer）
- 托管（第五阶段接入）：Cloudflare Pages（GitHub 自动部署）；回退 GitHub Pages / Vercel

## 本地开发

```bash
npm install
npm run dev      # 本地预览 http://localhost:4321
npm run build    # 构建到 dist/
npm run check    # 类型检查
```

## 目录结构

```
src/
  content/
    config.ts                 # 文章集合的字段定义（schema）
    articles/
      zh/{pqc,quantum,security,migration,research,tutorials}/
      en/{pqc,quantum,security,migration,research,tutorials}/
  components/                 # 首页 / 栏目页 / 文章页 / 文章卡片
  layouts/BaseLayout.astro    # 全站框架（导航、页脚、语言切换）
  lib/i18n.ts                 # 栏目与界面文案的双语字典
  pages/
    index.astro               # 根入口（默认跳转中文版）
    zh/  en/                  # 双语页面树（首页、栏目、文章、资源、关于）
  styles/global.css           # 设计系统（深蓝 / 黑 / 科技蓝）
public/
  images/{栏目}/              # 图片按栏目存放，文件名见名知意
  favicon.svg
```

## 写文章

1. 在对应语言与栏目的目录里新建 `文章名.md`，例如
   `src/content/articles/zh/pqc/ml-kem-intro.md`。
2. 文件头（frontmatter）必填：`title`、`description`、`pubDate`、`lang`、`section`；
   可选：`tags`、`featured`、`heroImage`、`imageCredit`（图片来源与授权）、
   `translationKey`（中英文版本配对键，同篇文章两版填同一个值）。
3. 图片放 `public/images/<栏目>/`，在正文用 `/images/<栏目>/<文件>` 引用，
   并在 `imageCredit` 里记录来源与授权。
4. `draft: true` 的文章不会出现在网站上。未经所有者批准不得发布。

## 内容红线

- 不做新闻采编与转载；引用第三方资料必须标明来源、日期与链接。
- 不设用户注册、评论、论坛、投稿等任何互动功能。
- 不涉及虚拟货币、代币与金融投资内容。
- 未翻译的文章不得伪造另一语言版本；缺译时明确标注。

## 阶段进度

- 第一阶段：只读检查与方案规划 ✅
- 第二阶段：网站基础建设（本仓库当前状态）✅
- 第三阶段：功能完善（搜索 / RSS / SEO / Sitemap / 主题切换 / 公式 / 目录）
- 第四阶段：内容建设（示范文章与教程）
- 第五阶段：测试与部署准备（构建与链接检查、Cloudflare Pages 实测与域名绑定）
