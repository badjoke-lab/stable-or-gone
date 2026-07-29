import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = {
  page: 'src/pages/stablecoins/index.astro',
  row: 'src/components/StablecoinIndexRow.astro',
  card: 'src/components/StablecoinIndexCard.astro',
  mark: 'src/components/StablecoinMark.astro',
  logoResolver: 'src/utils/stablecoinLogo.ts',
  styles: 'src/styles/stablecoin-index.css',
  client: 'src/scripts/stablecoin-index.ts',
  interactionContract: 'config/index-interaction-contract.mjs',
  implementationContract: 'config/ui-v3-home-register-pr413.json'
};
const source = {};
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
for (const [key, file] of Object.entries(files)) {
  check(fs.existsSync(path.join(root, file)), `missing file: ${file}`);
  if (fs.existsSync(path.join(root, file))) source[key] = fs.readFileSync(path.join(root, file), 'utf8');
}
const contract = JSON.parse(source.implementationContract ?? '{}');

for (const forbidden of ['PageHero', 'MetricCard', 'stablecoin-index-hero__visual', 'stablecoin-index-hero__coin', 'stablecoin-index-metrics', 'class="stablecoin-register-count"']) {
  check(!source.page?.includes(forbidden), `superseded Stablecoins composition remains: ${forbidden}`);
}
for (const component of ['StablecoinIndexRow', 'StablecoinIndexCard', 'StablecoinComparisonSource']) {
  check(source.page?.includes(`import ${component}`), `page import missing: ${component}`);
  check(source.page?.includes(`<${component}`), `page rendering missing: ${component}`);
}
check(source.page?.includes('const PAGE_SIZE = 20'), 'bounded page size must be 20');
check(source.page?.includes('data-page-size={PAGE_SIZE}'), 'page-size data contract missing');
check(source.page?.includes('data-register-version="pr413"'), 'PR #413 register marker missing');
check(source.page?.includes('class="stablecoin-register-header"'), 'register header missing');
check(source.page?.includes('class="stablecoin-register-state"'), 'register state ledger missing');
check(source.page?.includes('Browse mode') && source.page?.includes('Bounded'), 'bounded browse state is not visible');
check(!source.page?.includes('activeRecordCount'), 'removed metric count remains');
for (const id of ['lifecycle', 'issuance', 'asset_class', 'reference', 'backing', 'stabilization']) check(source.page?.includes(`id: '${id}'`), `filter missing: ${id}`);
for (const sort of ['name_asc', 'name_desc', 'lifecycle_then_name', 'launch_oldest', 'launch_newest', 'evidence_most']) check(source.page?.includes(`value="${sort}"`), `sort missing: ${sort}`);
check((source.page?.match(/<details class="stablecoin-index-filter" open>/g) ?? []).length === 1, 'visible-by-default filter template missing');
check(source.page?.includes('data-active-filters') && source.page?.includes('aria-live="polite"'), 'active-filter and result announcements missing');
check(source.page?.includes('data-visible-range'), 'visible range missing');
check(source.page?.includes('data-pagination') && source.page?.includes('data-page-prev') && source.page?.includes('data-page-next'), 'pagination controls incomplete');
check(source.page?.includes('data-mobile-table="scroll-preserve"'), 'desktop table contract changed');
check(source.page?.includes('data-card-body'), 'compact record container missing');
check((source.page?.match(/<th>/g) ?? []).length === 7, 'seven register headers required');
for (const label of ['Stablecoin', 'Symbol', 'Reference', 'Status', 'Primary organization', 'Model', 'Updated / evidence']) check(source.page?.includes(`>${label}<`), `table label missing: ${label}`);
check(source.page?.includes('data-comparison-panel') && source.page?.includes('two to four') && source.page?.includes('not a ranking'), 'comparison disclosure incomplete');
check(source.page?.includes('data-no-results hidden'), 'zero-result state must be hidden initially');
check(source.page?.includes('Desktop uses a structured table') && source.page?.includes('Compact screens use full-field cards'), 'responsive representation explanation missing');
check(source.page?.includes('URL state is preserved'), 'URL-backed state disclosure missing');

check(source.row?.includes('initiallyVisible = true'), 'desktop initial-page contract missing');
check(source.row?.includes('hidden={initiallyVisible ? undefined : true}'), 'desktop rows are not initially bounded');
check(source.row?.includes('import StablecoinMark') && source.row?.includes('<StablecoinMark'), 'desktop stablecoin mark missing');
check(source.row?.includes('Issuance:') && source.row?.includes('open questions'), 'desktop context incomplete');
check((source.row?.match(/<td>/g) ?? []).length === 7, 'desktop rows must have seven cells');
check(source.card?.includes('initiallyVisible = true'), 'compact initial-page contract missing');
check(source.card?.includes('hidden={initiallyVisible ? undefined : true}'), 'compact rows are not initially bounded');
check(source.card?.includes('import StablecoinMark') && source.card?.includes('<StablecoinMark'), 'compact stablecoin mark missing');
for (const field of ['Issuance', 'Reference', 'Backing', 'Asset class', 'Organization', 'Relationships', 'Evidence', 'Known unknowns', 'Events', 'Last reviewed']) check(source.card?.includes(`<dt>${field}</dt>`), `compact field missing: ${field}`);
check(source.card?.includes('data-mobile-representation-for="stablecoin-index"'), 'compact marker missing');

check(source.mark?.includes("resolveStablecoinLogo") && source.mark?.includes('<img') && source.mark?.includes('<TickerBadge'), 'local-logo with ticker fallback contract missing');
check(!source.mark?.includes('http://') && !source.mark?.includes('https://'), 'stablecoin mark must not fetch remote images');
for (const slug of ['aeur', 'dai', 'gusd', 'pax', 'paxg', 'tusd', 'usdc', 'usdt']) {
  check(source.logoResolver?.includes(`${slug}: '/stablecoin-logos/${slug}.svg'`), `local stablecoin logo mapping missing: ${slug}`);
  check(fs.existsSync(path.join(root, `public/stablecoin-logos/${slug}.svg`)), `local stablecoin logo asset missing: ${slug}`);
}

for (const marker of ['.stablecoin-register-header', '.stablecoin-index-controls', '.stablecoin-index-toolbar', '.stablecoin-index-filter-grid', '.stablecoin-index-summary', '.stablecoin-index-table', '.stablecoin-index-cards', '.stablecoin-index-pagination', '.stablecoin-index-comparison', '.comparison-grid', '@media (max-width: 719px)']) check(source.styles?.includes(marker), `style marker missing: ${marker}`);
check(source.styles?.includes('.stablecoin-index-table {\n    display: none;') && source.styles?.includes('.stablecoin-index-cards {\n    padding: 0.8rem;\n    display: grid;'), 'mobile table-to-card transformation incomplete');
check(source.styles?.includes('font-size: 0.875rem') && source.styles?.includes('min-height: 44px'), '14px/44px accessibility foundation missing');
check(source.styles?.includes('border-radius: var(--sog-radius-prominent)') && source.styles?.includes('box-shadow: var(--sog-shadow-panel)'), 'modern register depth and hierarchy missing');
check(!source.styles?.includes('font-size: 0.6rem'), 'prohibited 0.6rem table headings remain');
check(!source.styles?.includes('font-size: 0.64rem'), 'prohibited 0.64rem metadata remains');

for (const marker of ['URLSearchParams', 'replaceState', 'pushState', 'popstate', 'selectedComparisons.size >= 4', "const groups = ['lifecycle', 'issuance', 'asset_class', 'reference', 'backing', 'stabilization']", "params.get('page')", "params.set('page'", 'pageSize', 'currentPage', 'visibleSlugs', 'data-page-status']) check(source.client?.includes(marker), `interaction marker missing: ${marker}`);
check(source.client?.includes('noResults.hidden = matchCount !== 0'), 'false empty-state prevention missing');
check(source.client?.includes('resetPageAndRefresh'), 'page reset on state change missing');
check(source.interactionContract?.includes('page_size: 20') && source.interactionContract?.includes("query_param: 'page'"), 'pagination contract missing');

check(contract.implementation_pr === 413 && contract.phase === 'PR C', 'PR #413 implementation contract changed');
check(contract.register?.page_size === 20, 'PR #413 page size changed');
check(contract.register?.authorized_initial_render_max === 50, 'authorized initial maximum changed');
check(contract.register?.bounded_rendering_required_above === 100, 'bounded rendering threshold changed');
check(contract.register?.visible_filter_groups === true && contract.register?.active_filter_chips === true, 'filter visibility contract changed');
check(contract.register?.compare_selection_min === 2 && contract.register?.compare_selection_max === 4, 'comparison range changed');
check(contract.register?.desktop_table === true && contract.register?.compact_cards === true, 'responsive representation contract changed');
check(contract.visual_review?.skipped_audit_result === 'hard_failure', 'visual audit can be skipped');
check(contract.visual_review?.automated_capture_counts_as_owner_approval === false, 'capture became owner approval');

const combined = `${source.page ?? ''}\n${source.row ?? ''}\n${source.card ?? ''}`.toLocaleLowerCase();
for (const prohibited of ['market capitalization', 'circulating supply', 'holder count', 'transfer count', 'saved view', 'watchlist', 'recently viewed', 'safety score', 'transparency score']) check(!combined.includes(prohibited), `unsupported feature appears: ${prohibited}`);
check(!combined.includes('fetch('), 'register must not depend on external runtime fetch');

const result = {
  schema_version: '3.1',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  visual_family: 'modern_evidence_registry_pr413',
  canonical_record_changes: 0,
  route_changes: 0,
  owner_approval_changes: 0,
  filter_groups: 6,
  sort_modes: 6,
  table_headers: 7,
  page_size: 20,
  initial_render_authorized_max: 50,
  bounded_rendering_threshold: 100,
  local_logo_assets: 8,
  failures
};
const outputV3 = path.join(root, 'data/generated/ui-v3-stablecoin-index-validation.json');
const outputLegacy = path.join(root, 'data/generated/ui-v2-stablecoin-index-validation.json');
fs.mkdirSync(path.dirname(outputV3), { recursive: true });
const serialized = `${JSON.stringify(result, null, 2)}\n`;
fs.writeFileSync(outputV3, serialized);
fs.writeFileSync(outputLegacy, serialized);
if (failures.length) {
  console.error(serialized);
  process.exit(1);
}
console.log(serialized);
