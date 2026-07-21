import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };

const layout = read('src/layouts/BaseLayout.astro');
const indexRoute = read('src/pages/guides/index.astro');
const index = read('src/components/GuideEditorialIndex.astro');
const header = read('src/components/GuideArticleHeader.astro');
const contents = read('src/components/LongformContentsR6.astro');
const related = read('src/components/RelatedSogRecords.astro');
const revisions = read('src/components/GuideRevisionHistory.astro');
const legacyStyles = read('src/styles/guide-editorial-v3.css');
const r6Styles = read('src/styles/ui-remediation-r6.css');
const catalog = read('src/data/guideCatalog.ts');
const slugs = catalog.split('\n').map((line) => line.trim()).filter((line) => line.startsWith("slug: '")).map((line) => line.slice(7).split("'")[0]).filter(Boolean);

for (const marker of ['guide-editorial-v3.css', "const isGuideIndex = pathname === '/guides/'", "const isGuideArticle = pathname.startsWith('/guides/')", 'data-page-kind={pageKind}', 'data-guide-article', 'data-guide-toc', 'data-guide-toc-list', 'guide-article-footer']) check(layout.includes(marker), `BaseLayout missing guide contract: ${marker}`);
check(layout.includes("window.matchMedia('(max-width: 820px)').matches"), 'legacy mobile guide ToC collapse foundation missing');
check(indexRoute.includes('GuideEditorialIndex'), 'Guides route is not using GuideEditorialIndex');
for (const marker of ['data-ui-v3-guides', 'data-secondary-version="r6-guides"', 'guide-index-masthead', 'guide-index-ledger', 'data-r6-guide-register', 'How to use the archive']) check(index.includes(marker), `R6 Guide index missing: ${marker}`);
check(index.includes('<th>Guide</th><th>Region or scope</th><th>Current through</th><th>Category</th>'), 'R6 Guide index four-column contract changed');
check(!index.includes('guide-index-mobile'), 'R6 Guide index reintroduced a duplicate mobile dataset');
check(!index.includes('PageHero') && !index.includes('MetricCard') && !index.includes('mini-card'), 'Guide index reintroduces dashboard or card composition');
for (const marker of ['data-secondary-version="r6-guide-article"', 'guide-article-masthead', 'guide-article-overline', 'guide-article-deck', 'guide-article-meta', '<LongformContentsR6']) check(header.includes(marker), `R6 Guide article header missing: ${marker}`);
check(!header.includes('class="hero"') && !header.includes('class="panel'), 'Guide article header retains v2 hero or panel markup');
for (const marker of ['data-r6-contents', 'data-r6-current-section', "window.matchMedia('(min-width: 761px)')", 'IntersectionObserver', "!heading.closest('[data-r6-reference]')"]) check(contents.includes(marker), `R6 contents navigation missing: ${marker}`);
check(related.includes('guide-related-records') && !related.includes('mini-card'), 'Related records are not editorial ruled links');
check(revisions.includes('data-guide-section') && revisions.includes('guide-revision-table') && !revisions.includes('panel registry'), 'Revision history is not an editorial article section');
for (const marker of ['grid-template-columns:minmax(190px,230px) minmax(0,760px)', '.guide-article-toc', '.guide-article-content', '.guide-index-table', '@media(max-width:820px)', '@media(forced-colors:active)']) check(legacyStyles.includes(marker), `Guide foundation styles missing: ${marker}`);
for (const marker of ['.guide-index-page-r6', '.guide-index-mobile { display: none !important; }', '.longform-contents-r6', 'width: min(760px, 100%)', '@media (max-width: 760px)']) check(r6Styles.includes(marker), `R6 Guide styles missing: ${marker}`);
check(!legacyStyles.includes('box-shadow:0 ') && !legacyStyles.includes('radial-gradient') && !legacyStyles.includes('border-radius:24px'), 'Guide styles contain prohibited SaaS decoration');
for (const slug of slugs) {
  const path = `src/pages/guides/${slug}/index.astro`;
  check(fs.existsSync(path), `Missing guide page: ${slug}`);
  if (!fs.existsSync(path)) continue;
  const page = read(path);
  check(page.includes(`getGuide('${slug}')`), `${slug}: catalog metadata lookup missing`);
  check(page.includes('<GuideArticleHeader'), `${slug}: Editorial Article masthead missing`);
  check(page.includes('<GuideRevisionHistory'), `${slug}: revision-history contract missing`);
  check(!page.includes('<section class="hero">'), `${slug}: legacy guide hero remains`);
}

const result = { schema_version: '1.2', ok: failures.length === 0, gate: 'V3-F-R6', guide_pages: slugs.length, guide_index: 'single_responsive_four_column_register', guide_articles: 'editorial_article_with_r6_contents_and_metadata', canonical_record_changes: 0, route_changes: 0, failures };
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
