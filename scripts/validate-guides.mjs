import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const check = (condition, message) => { if (!condition) throw new Error(message); };

const datedGuideSlugs = [
  'genius-act-stablecoins',
  'mica-stablecoins',
  'jpyc-vs-jpysc',
  'uk-stablecoin-capital-rules-2026'
];
const catalog = read('src/data/guideCatalog.ts');
const slugs = catalog.split('\n').map((line) => line.trim()).filter((line) => line.startsWith("slug: '")).map((line) => line.slice(7).split("'")[0]).filter(Boolean);

check(slugs.length > 0, 'No guide slugs found in guideCatalog.ts');
check(new Set(slugs).size === slugs.length, 'Duplicate guide slug found');
check(catalog.includes('export function getPublishedGuides()'), 'Published-guide selector missing');
check(catalog.includes('export function getFeaturedGuides(limit = 3)'), 'Featured-guide selector missing');
check(catalog.includes("slug: 'uk-stablecoin-capital-rules-2026'"), 'UK guide catalog entry missing');
check(catalog.includes("publishedAt: '2026-06-30'"), 'UK guide publication date missing');
check(catalog.includes("regionLabel: 'United Kingdom'"), 'UK guide home metadata missing');

for (const slug of slugs) {
  const pagePath = `src/pages/guides/${slug}/index.astro`;
  check(fs.existsSync(path.join(root, pagePath)), `Missing guide page: ${pagePath}`);
  const page = read(pagePath);
  check(page.includes(`/guides/${slug}/`), `${pagePath}: canonical guide route missing`);
  if (!datedGuideSlugs.includes(slug)) continue;
  check(page.includes(`getGuide('${slug}')`), `${pagePath}: dated-guide catalog lookup mismatch`);
  check(page.includes(`const canonicalPath = '/guides/${slug}/'`), `${pagePath}: dated-guide canonical path mismatch`);
  check(page.includes('<GuideArticleHeader'), `${pagePath}: dated article header missing`);
  check(page.includes('<GuideRevisionHistory'), `${pagePath}: dated revision history missing`);
}

const guideIndex = read('src/pages/guides/index.astro');
check(guideIndex.includes('getPublishedGuides'), 'Guides index must use published-guide metadata');
check(guideIndex.includes('publishedGuides.filter'), 'Guides index category filtering missing');
check(!guideIndex.includes('entries: guides.filter'), 'Guides index must not list drafts directly');

const sitemap = read('src/pages/sitemap-index.xml.ts');
check(sitemap.includes("import { getPublishedGuides } from '../data/guideCatalog';"), 'Sitemap published-guide import missing');
check(sitemap.includes('publishedGuides.map((guide) => `/guides/${guide.slug}/`)'), 'Published guide sitemap routes missing');

const home = read('src/pages/index.astro');
check(home.includes("import { getFeaturedGuides } from '../data/guideCatalog';"), 'Homepage featured-guide metadata import missing');
check(home.includes('getFeaturedGuides(3)'), 'Homepage must select the latest three featured guides automatically');
check(!home.includes("getGuide('genius-act-stablecoins')"), 'Homepage must not hard-code featured guide slugs');

const linkMap = read('src/data/stablecoinGuideLinks.ts');
for (const slug of datedGuideSlugs) check(linkMap.includes(`'${slug}': [`), `Stablecoin guide link map missing: ${slug}`);

const detail = read('src/components/StablecoinDetailView.astro');
check(detail.includes('getRelatedGuidesForStablecoin'), 'Stablecoin detail related-guide lookup missing');
check(detail.includes('<RelatedGuides guides={relatedGuides} />'), 'Stablecoin detail related-guide component missing');
check(detail.includes('subjectOf:'), 'Stablecoin detail guide metadata missing');

const updates = JSON.parse(read('data/registry-updates.json'));
const datedGuidesUpdate = updates.find((entry) => entry.id === 'sog_update_2026_06_25_pr129_pr132_dated_guides');
check(Boolean(datedGuidesUpdate), 'Original dated-guide update entry missing');
for (const slug of ['genius-act-stablecoins', 'mica-stablecoins', 'jpyc-vs-jpysc']) check(datedGuidesUpdate.related_paths.includes(`/guides/${slug}/`), `Original update route missing: ${slug}`);

console.log(JSON.stringify({ ok: true, guides: slugs.length, dated_guides: datedGuideSlugs.length, automatic_featured_guides: true, guide_slugs: slugs }, null, 2));
