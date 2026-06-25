import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const check = (condition, message) => {
  if (!condition) throw new Error(message);
};

const datedGuideSlugs = ['genius-act-stablecoins', 'mica-stablecoins', 'jpyc-vs-jpysc'];
const catalog = read('src/data/guideCatalog.ts');
const slugs = [];
for (const line of catalog.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed.startsWith("slug: '")) continue;
  const slug = trimmed.slice(7).split("'")[0];
  if (slug) slugs.push(slug);
}

check(slugs.length > 0, 'No guide slugs found in guideCatalog.ts');
check(new Set(slugs).size === slugs.length, 'Duplicate guide slug found');

for (const slug of slugs) {
  const pagePath = `src/pages/guides/${slug}/index.astro`;
  check(fs.existsSync(path.join(root, pagePath)), `Missing guide page: ${pagePath}`);
  const page = read(pagePath);
  check(page.includes(`/guides/${slug}/`), `${pagePath}: canonical guide route missing`);

  if (datedGuideSlugs.includes(slug)) {
    check(page.includes(`getGuide('${slug}')`), `${pagePath}: dated-guide catalog lookup mismatch`);
    check(page.includes(`const canonicalPath = '/guides/${slug}/'`), `${pagePath}: dated-guide canonical path mismatch`);
    check(page.includes('<GuideArticleHeader'), `${pagePath}: dated article header missing`);
    check(page.includes('<GuideRevisionHistory'), `${pagePath}: dated revision history missing`);
  }
}

const sitemap = read('src/pages/sitemap-index.xml.ts');
check(sitemap.includes("import { guides } from '../data/guideCatalog';"), 'Sitemap guide catalog import missing');
check(sitemap.includes('guides.map((guide) => `/guides/${guide.slug}/`)'), 'Dynamic guide sitemap routes missing');

const home = read('src/pages/index.astro');
for (const slug of datedGuideSlugs) {
  check(home.includes(`getGuide('${slug}')`), `Homepage featured guide missing: ${slug}`);
}

const linkMap = read('src/data/stablecoinGuideLinks.ts');
for (const slug of datedGuideSlugs) {
  check(linkMap.includes(`'${slug}': [`), `Stablecoin guide link map missing: ${slug}`);
}

const detail = read('src/components/StablecoinDetailView.astro');
check(detail.includes('getRelatedGuidesForStablecoin'), 'Stablecoin detail related-guide lookup missing');
check(detail.includes('<RelatedGuides guides={relatedGuides} />'), 'Stablecoin detail related-guide component missing');
check(detail.includes('subjectOf:'), 'Stablecoin detail guide metadata missing');

const updates = JSON.parse(read('data/registry-updates.json'));
const update = updates.find((entry) => entry.id === 'sog_update_2026_06_25_pr129_pr132_dated_guides');
check(Boolean(update), 'Dated guide update entry missing');
for (const slug of datedGuideSlugs) {
  check(update.related_paths.includes(`/guides/${slug}/`), `Update route missing: ${slug}`);
}

console.log(JSON.stringify({
  ok: true,
  guides: slugs.length,
  dated_guides: datedGuideSlugs.length,
  guide_slugs: slugs
}, null, 2));
