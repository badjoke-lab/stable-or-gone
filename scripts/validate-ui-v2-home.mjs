import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const pagePath = 'src/pages/index.astro';
const stylePath = 'src/styles/home-v2.css';
const referencePath = 'docs/ui-redesign/approved-mocks-v2/01-home.webp';
const outputPath = path.join(root, 'data/generated/ui-v2-home-validation.json');
const page = fs.readFileSync(path.join(root, pagePath), 'utf8');
const styles = fs.readFileSync(path.join(root, stylePath), 'utf8');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(fs.existsSync(path.join(root, referencePath)), 'approved Home reference is missing');
for (const component of ['PageHero', 'MetricCard', 'SupportBanner', 'TickerBadge']) {
  check(page.includes(`import ${component}`), `Home must import ${component}`);
  check(page.includes(`<${component}`), `Home must render ${component}`);
}
check(page.includes("import '../styles/home-v2.css'"), 'Home v2 stylesheet is not imported');
check(page.includes('title="Trace stablecoins"') && page.includes('titleAccent="with the evidence."'), 'approved Home hero statement is missing');
check(page.includes('data-home-search') && page.includes('data-home-search-input') && page.includes('data-home-search-results'), 'cross-registry search controls are missing');
check(page.includes('...stablecoins.map') && page.includes('...organizations.map') && page.includes('...events.map'), 'search index must include stablecoins, organizations, and events');
check(page.includes("href: `/stablecoin/${coin.slug}/`") && page.includes("href: `/issuer/${organization.slug}/`") && page.includes("href: `/event/${event.id}/`"), 'search result route families are incomplete');
check(page.includes('value={stablecoins.length}'), 'stablecoin count must remain canonical and dynamic');
check(page.includes('value={organizations.length}'), 'organization count must remain canonical and dynamic');
check(page.includes('value={events.length}'), 'event count must remain canonical and dynamic');
check(page.includes('value={evidenceSummary.source_identities}'), 'source identity count must remain canonical and dynamic');
for (const route of ['/stablecoins/', '/issuers/', '/events/', '/guides/']) check(page.includes(`href="${route}"`), `primary Home destination is missing: ${route}`);
for (const slug of ['genius-act-stablecoins', 'mica-stablecoins', 'uk-stablecoin-capital-rules-2026']) check(page.includes(`getGuide('${slug}')`), `approved guide card is missing: ${slug}`);
check(!page.includes("getGuide('jpyc-vs-jpysc'), theme: 'jp'"), 'JPYC comparison guide must remain in Guides but not occupy the current three-card Home feature set');
const expectedSelection = "['usdt', 'usdc', 'dai', 'ust', 'busd', 'frax', 'tusd', 'fdusd', 'pyusd', 'usdd']";
check(page.includes(expectedSelection), 'selected stablecoin slug rule changed');
check(!page.includes('.slice(0, 10)'), 'selected records must not depend on raw array order');
check(page.includes('data-mobile-table="paired-cards"'), 'selected-record table must declare its paired compact representation');
check(page.includes('class="home-selected__cards"'), 'selected-record mobile cards are missing');
check(page.includes('Selection is defined by slug, not array order.'), 'selection rule is not explained publicly');
check(page.includes('aria-live="polite"'), 'search result announcements are missing');
check(page.includes("event.key === 'Escape'"), 'search Escape behavior is missing');
check(page.includes('escapeHtml'), 'search result HTML escaping is missing');
check(page.includes('<SupportBanner'), 'approved support banner is missing');

for (const marker of ['.home-hero', '.home-search', '.home-metrics', '.home-entry-grid', '.home-guide-grid', '.home-selected__cards', '@media(max-width:820px)', '@media(max-width:560px)']) {
  check(styles.includes(marker), `Home stylesheet marker is missing: ${marker}`);
}
check(styles.includes('.home-selected__table-wrap{display:none}') && styles.includes('.home-selected__cards{display:grid}'), 'mobile selected-record transformation is incomplete');

for (const prohibited of ['market capitalization', 'circulating supply', 'holder count', 'transfer count', 'saved view', 'watchlist', 'recently viewed', 'transparency score', 'safety score']) {
  check(!page.toLowerCase().includes(prohibited), `mock-only Home feature or claim appears: ${prohibited}`);
}
check(!page.includes('fetch('), 'Home must not depend on an external runtime data fetch');

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  approved_reference: referencePath,
  selected_record_rule: 'explicit_slug_order',
  selected_record_count: 10,
  featured_guide_slugs: ['genius-act-stablecoins', 'mica-stablecoins', 'uk-stablecoin-capital-rules-2026'],
  search_record_families: ['stablecoin', 'organization', 'event'],
  canonical_record_changes: 0,
  route_changes: 1,
  failures
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(result, null, 2));
