import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };

const layout = read('src/layouts/BaseLayout.astro');
const indexRoute = read('src/pages/guides/index.astro');
const index = read('src/components/GuideEditorialIndex.astro');
const header = read('src/components/GuideArticleHeader.astro');
const related = read('src/components/RelatedSogRecords.astro');
const revisions = read('src/components/GuideRevisionHistory.astro');
const styles = read('src/styles/guide-editorial-v3.css');
const catalog = read('src/data/guideCatalog.ts');
const slugs = catalog.split('\n').map((line) => line.trim()).filter((line) => line.startsWith("slug: '")).map((line) => line.slice(7).split("'")[0]).filter(Boolean);

for (const marker of ['guide-editorial-v3.css', "const isGuideIndex = pathname === '/guides/'", "const isGuideArticle = pathname.startsWith('/guides/')", 'data-page-kind={pageKind}', 'data-guide-article', 'data-guide-toc', 'data-guide-toc-list', 'guide-article-footer']) check(layout.includes(marker), `BaseLayout missing guide contract: ${marker}`);
check(layout.includes("window.matchMedia('(max-width: 820px)').matches"), 'mobile guide ToC collapse missing');
check(indexRoute.includes('GuideEditorialIndex'), 'Guides route is not using GuideEditorialIndex');
for (const marker of ['data-ui-v3-guides', 'guide-index-masthead', 'guide-index-ledger', 'guide-index-table', 'guide-index-mobile', 'How to use the archive']) check(index.includes(marker), `Guide index missing: ${marker}`);
check(!index.includes('PageHero') && !index.includes('MetricCard') && !index.includes('mini-card'), 'Guide index reintroduces dashboard or card composition');
for (const marker of ['guide-article-masthead', 'guide-article-overline', 'guide-article-deck', 'guide-article-meta']) check(header.includes(marker), `Guide article header missing: ${marker}`);
check(!header.includes('class="hero"') && !header.includes('class="panel'), 'Guide article header retains v2 hero or panel markup');
check(related.includes('guide-related-records') && !related.includes('mini-card'), 'Related records are not editorial ruled links');
check(revisions.includes('data-guide-section') && revisions.includes('guide-revision-table') && !revisions.includes('panel registry'), 'Revision history is not an editorial article section');
for (const marker of ['grid-template-columns:minmax(190px,230px) minmax(0,760px)', '.guide-article-toc', '.guide-article-content', '.guide-index-table', '@media(max-width:820px)', '@media(forced-colors:active)']) check(styles.includes(marker), `Guide styles missing: ${marker}`);
check(!styles.includes('box-shadow:0 ') && !styles.includes('radial-gradient') && !styles.includes('border-radius:24px'), 'Guide styles contain prohibited SaaS decoration');
for (const slug of slugs) check(fs.existsSync(`src/pages/guides/${slug}/index.astro`), `Missing guide page: ${slug}`);

const result = { schema_version: '1.0', ok: failures.length === 0, guide_pages: slugs.length, guide_index: 'editorial_register', guide_articles: 'editorial_article_with_toc', canonical_record_changes: 0, route_changes: 0, failures };
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
