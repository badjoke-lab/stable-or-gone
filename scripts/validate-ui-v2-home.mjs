import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const page = fs.readFileSync(path.join(root, 'src/pages/index.astro'), 'utf8');
const catalog = fs.readFileSync(path.join(root, 'src/data/guideCatalog.ts'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src/styles/home-v2.css'), 'utf8');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

for (const component of ['PageHero', 'MetricCard', 'SupportBanner', 'TickerBadge']) {
  check(page.includes(`import ${component}`), `missing component import: ${component}`);
  check(page.includes(`<${component}`), `missing component render: ${component}`);
}
check(page.includes("import { getFeaturedGuides } from '../data/guideCatalog'"), 'metadata-driven guide import missing');
check(page.includes('getFeaturedGuides(3)'), 'featured guide selector missing');
check(!page.includes("getGuide('genius-act-stablecoins')"), 'homepage still hard-codes guide slugs');
for (const slug of ['genius-act-stablecoins', 'mica-stablecoins', 'uk-stablecoin-capital-rules-2026']) {
  check(catalog.includes(`slug: '${slug}'`), `featured guide missing from catalog: ${slug}`);
}
check(catalog.includes("slug: 'uk-stablecoin-capital-rules-2026'") && catalog.includes("publishedAt: '2026-06-30'"), 'UK guide publication metadata missing');
check(page.includes('value={stablecoins.length}') && page.includes('value={organizations.length}') && page.includes('value={events.length}'), 'canonical counters must remain dynamic');
check(page.includes('data-home-search') && page.includes('data-home-search-results'), 'home search controls missing');
check(page.includes("['usdt', 'usdc', 'dai', 'ust', 'busd', 'frax', 'tusd', 'fdusd', 'pyusd', 'usdd']"), 'selected stablecoin rule changed');
check(styles.includes('.home-guide-grid') && styles.includes('.home-selected__cards'), 'home responsive styles missing');

const result = {
  schema_version: '1.1',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  featured_guide_rule: 'published_featured_metadata_latest_three',
  failures
};
fs.mkdirSync(path.join(root, 'data/generated'), { recursive: true });
fs.writeFileSync(path.join(root, 'data/generated/ui-v2-home-validation.json'), `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(result, null, 2));
