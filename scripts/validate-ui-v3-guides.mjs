import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const catalog = read('src/data/guideCatalog.ts');
const slugs = catalog.split('\n').map((line) => line.trim()).filter((line) => line.startsWith("slug: '")).map((line) => line.slice(7).split("'")[0]);
const index = read('src/pages/guides/index.astro');
const header = read('src/components/GuideArticleHeader.astro');
const revisions = read('src/components/GuideRevisionHistory.astro');
const related = read('src/components/RelatedSogRecords.astro');
const indexCss = read('src/styles/guide-index.css');
const articleCss = read('src/styles/guide-article.css');
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };

check(index.includes('data-ui-v3-guides-index'), 'Guides index marker missing');
check(index.includes('guide-index-feature'), 'Featured guide surface missing');
check(index.includes('guide-index-list'), 'Ruled guide list missing');
check(!index.includes('class="hero"') && !index.includes('mini-card'), 'Guides index still uses v2 hero or card composition');
check(header.includes('data-ui-v3-guide-article'), 'Editorial Article marker missing');
check(header.includes('data-guide-toc') && header.includes('On this page'), 'Guide contents navigation missing');
check(header.includes("import '../styles/guide-article.css'"), 'Guide article stylesheet is not loaded');
check(revisions.includes('guide-revision-history'), 'Editorial revision history marker missing');
check(related.includes('guide-related-records') && related.includes('guide-related-list'), 'Editorial related-record list missing');
check(indexCss.includes('var(--shell-line-subtle)') && articleCss.includes('var(--shell-line-subtle)'), 'Editorial rule system missing');
check(!indexCss.includes('radial-gradient') && !articleCss.includes('radial-gradient'), 'Guide styles contain prohibited glow decoration');

for (const slug of slugs) {
  const path = `src/pages/guides/${slug}/index.astro`;
  check(fs.existsSync(path), `Missing guide page: ${path}`);
  if (!fs.existsSync(path)) continue;
  const page = read(path);
  check(page.includes('<GuideArticleHeader'), `${path}: Editorial Article header missing`);
  check(page.includes(`getGuide('${slug}')`), `${path}: guide catalog lookup missing`);
  check(!page.includes('<section class="hero">') && !page.includes('hero-main'), `${path}: v2 hero remains`);
  check(page.includes(`/guides/${slug}/`), `${path}: canonical route missing`);
}

const result = { schema_version: '1.0', generated_at: new Date().toISOString(), ok: failures.length === 0, guide_pages: slugs.length, failures };
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
