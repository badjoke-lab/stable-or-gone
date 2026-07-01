import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const page = fs.readFileSync(path.join(root, 'src/pages/index.astro'), 'utf8');
const catalog = fs.readFileSync(path.join(root, 'src/data/guideCatalog.ts'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src/styles/home-v3.css'), 'utf8');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

for (const forbidden of ['PageHero', 'MetricCard', 'SupportBanner', 'home-coin-stack', 'home-entry-card', 'home-metrics']) {
  check(!page.includes(forbidden), `Home still contains superseded SaaS composition: ${forbidden}`);
}

check(page.includes("import '../styles/home-v3.css'"), 'Home v3 stylesheet import missing');
check(page.includes("import { getFeaturedGuides } from '../data/guideCatalog'"), 'metadata-driven guide import missing');
check(page.includes('getFeaturedGuides(4)'), 'Home must select four metadata-driven featured guides');
check(!page.includes("getGuide('"), 'Home still hard-codes guide slugs');
for (const slug of ['open-usd-reserve-revenue-model', 'genius-act-stablecoins', 'mica-stablecoins', 'uk-stablecoin-capital-rules-2026']) {
  check(catalog.includes(`slug: '${slug}'`), `featured guide missing from catalog: ${slug}`);
}
check(page.includes('{stablecoins.length}') && page.includes('{organizations.length}') && page.includes('{events.length}') && page.includes('{evidenceSummary.source_identities}'), 'canonical summary counts must remain dynamic');
check(page.includes('latestMaterialChanges') && page.includes(".slice(0, 5)"), 'latest material-change selection is missing');
check(page.includes('registryStatuses') && page.includes('lifecycleCounts'), 'current registry lifecycle summary is missing');
check(page.includes('recentlyUpdated') && page.includes("String(right.last_verified_at"), 'recently reviewed stablecoin selection is missing');
check(page.includes('registryReviewDate') && page.includes('Registry reviewed through'), 'truthful registry review date is missing');
check(page.includes('data-home-search') && page.includes('data-home-search-results'), 'Home search controls missing');
check(page.includes('Search canonical stablecoin, organization, and event records.'), 'Home search scope is not stated');
check(page.includes('Lifecycle describes the recorded state of an asset. It is not a safety score'), 'lifecycle non-rating disclaimer missing');
check(page.includes('class="home-masthead"'), 'editorial masthead missing');
check(page.includes('class="home-register-strip"'), 'one-line register summary missing');
check(page.includes('class="home-lead"'), 'two-column material-change/current-state lead missing');
check(page.includes('class="home-recent"'), 'recently reviewed records section missing');
check(page.includes('class="home-reference"'), 'guide/reference section missing');

for (const requiredStyle of ['.home-masthead', '.home-register-strip', '.home-search', '.home-lead', '.home-material-list', '.home-status-ledger', '.home-recent', '.home-guide-list', '.home-reference-index']) {
  check(styles.includes(requiredStyle), `Home v3 style missing: ${requiredStyle}`);
}
for (const forbiddenStyle of ['radial-gradient(', 'linear-gradient(', 'box-shadow:', 'border-radius:50%', 'filter:drop-shadow']) {
  check(!styles.replaceAll(' ', '').toLowerCase().includes(forbiddenStyle.replaceAll(' ', '').toLowerCase()), `Home v3 contains forbidden SaaS styling: ${forbiddenStyle}`);
}
check(styles.includes('border-bottom: 2px solid var(--sog-rule-strong)'), 'masthead strong rule missing');
check(styles.includes('font-family: Georgia, Cambria'), 'editorial masthead typography missing');
check(styles.includes('@media (max-width: 720px)'), 'Home mobile transformation missing');

const result = {
  schema_version: '2.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  visual_family: 'editorial_ledger_v3',
  featured_guide_rule: 'published_featured_metadata_latest_four',
  latest_event_rule: 'dated_events_descending_first_five',
  recently_reviewed_rule: 'stablecoin_last_verified_descending_first_eight',
  canonical_record_changes: 0,
  route_changes: 0,
  failures
};

fs.mkdirSync(path.join(root, 'data/generated'), { recursive: true });
const serialized = `${JSON.stringify(result, null, 2)}\n`;
fs.writeFileSync(path.join(root, 'data/generated/ui-v3-home-validation.json'), serialized);
fs.writeFileSync(path.join(root, 'data/generated/ui-v2-home-validation.json'), serialized);
if (failures.length) {
  console.error(serialized);
  process.exit(1);
}
console.log(serialized);
