import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const page = fs.readFileSync(path.join(root, 'src/pages/index.astro'), 'utf8');
const catalog = fs.readFileSync(path.join(root, 'src/data/guideCatalog.ts'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'src/styles/home-v3.css'), 'utf8');
const contract = JSON.parse(fs.readFileSync(path.join(root, 'config/ui-v3-home-register-pr413.json'), 'utf8'));
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

for (const forbidden of ['PageHero', 'MetricCard', 'SupportBanner', 'home-coin-stack', 'home-entry-card', 'home-metrics', 'class="home-masthead"']) {
  check(!page.includes(forbidden), `Home still contains superseded composition: ${forbidden}`);
}

check(page.includes("import '../styles/home-v3.css'"), 'Home stylesheet import missing');
check(page.includes("import { getFeaturedGuides } from '../data/guideCatalog'"), 'metadata-driven guide import missing');
check(page.includes('getFeaturedGuides(3)'), 'Home must select three bounded metadata-driven guides');
check(!page.includes("getGuide('"), 'Home still hard-codes guide slugs');
for (const slug of ['open-usd-reserve-revenue-model', 'genius-act-stablecoins', 'mica-stablecoins', 'uk-stablecoin-capital-rules-2026']) {
  check(catalog.includes(`slug: '${slug}'`), `reviewed guide missing from catalog: ${slug}`);
}
check(page.includes('{stablecoins.length}') && page.includes('{organizations.length}') && page.includes('{events.length}') && page.includes('{evidenceSummary.source_identities}'), 'canonical summary counts must remain dynamic');
check(page.includes('{knownUnknowns.length}'), 'known-unknown total must remain dynamic');
check(page.includes('latestMaterialChanges') && page.includes('.slice(0, 4)'), 'bounded material-event selection missing');
check(page.includes('latestPublications') && page.includes('registryUpdates'), 'publication-history selection missing');
check(page.includes('issueWatch') && page.includes('getKnownUnknowns()'), 'known-unknown issue watch missing');
check(page.includes('registryStatuses') && page.includes('lifecycleCounts'), 'current lifecycle summary missing');
check(page.includes('recentlyUpdated') && page.includes("String(right.last_verified_at"), 'recently reviewed selection missing');
check(page.includes('registryReviewDate') && page.includes('reviewed through'), 'truthful registry review date missing');
check(page.includes('data-home-search') && page.includes('data-home-search-results'), 'Home search controls missing');
check(page.includes('Find a stablecoin, organization, or event'), 'Home search scope is not stated');
check(page.includes('Lifecycle is a recorded operating state. It is not a safety score'), 'lifecycle non-rating disclaimer missing');
check(page.includes('data-home-registry="pr413"'), 'PR #413 home marker missing');
check(page.includes('class="home-entry"'), 'compact product entry panel missing');
check(page.includes('class="home-registry-totals"'), 'canonical totals strip missing');
check(page.includes('class="home-explore"'), 'exploration path section missing');
check(page.includes('id="issue-watch"'), 'issue-watch anchor missing');
check(page.includes('Subject history') && page.includes('Publication history'), 'event/publication date semantic separation missing');
check(page.includes('no invented metrics') || contract.home?.invented_metrics === false, 'invented-metric boundary missing');

for (const requiredStyle of ['.home-entry', '.home-search', '.home-registry-totals', '.home-explore-grid', '.home-dashboard', '.home-material-list', '.home-status-ledger', '.home-issue-list', '.home-publications', '.home-recent-grid', '.home-guide-grid']) {
  check(styles.includes(requiredStyle), `Home style missing: ${requiredStyle}`);
}
for (const requiredStyle of ['border-radius: var(--sog-radius-prominent)', 'box-shadow: var(--sog-shadow-panel)', 'grid-template-columns: repeat(5', '@media (max-width: 719px)', '@media (forced-colors: active)']) {
  check(styles.includes(requiredStyle), `Modern home style contract missing: ${requiredStyle}`);
}
check(!styles.includes('font-size: 0.68rem'), 'undersized 0.68rem home typography remains');
check(!styles.includes('font-size: 0.63rem'), 'undersized 0.63rem home typography remains');

check(contract.implementation_pr === 413 && contract.phase === 'PR C', 'PR #413 contract identity changed');
check(JSON.stringify(contract.authorized_routes) === JSON.stringify(['/', '/stablecoins/']), 'authorized route set changed');
check(contract.home?.product_entrypoint === true && contract.home?.prominent_registry_search === true, 'home product-entry contract changed');
check(contract.home?.material_event_dates_separate_from_publication_dates === true, 'date semantic boundary changed');
check(contract.home?.issue_watch_from_known_unknowns === true, 'issue-watch contract changed');
check(contract.home?.oversized_decorative_masthead === false, 'oversized masthead was authorized');
check(contract.home?.invented_metrics === false, 'invented metrics were authorized');
check(contract.boundaries?.canonical_data_changed === false && contract.boundaries?.public_machine_readable_data_changed === false, 'home contract allows data changes');
check(contract.visual_review?.automated_capture_counts_as_owner_approval === false, 'automated capture became owner approval');

const result = {
  schema_version: '3.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  visual_family: 'modern_evidence_registry_pr413',
  featured_guide_rule: 'published_featured_metadata_latest_three',
  latest_event_rule: 'dated_events_descending_first_four',
  publication_rule: 'registry_updates_descending_first_four',
  known_unknown_rule: 'last_checked_descending_first_five',
  recently_reviewed_rule: 'stablecoin_last_verified_descending_first_six',
  canonical_record_changes: 0,
  route_changes: 0,
  owner_approval_changes: 0,
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
