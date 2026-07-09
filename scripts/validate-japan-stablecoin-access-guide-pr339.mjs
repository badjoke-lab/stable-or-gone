import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const check = (condition, message) => {
  if (!condition) throw new Error(message);
};

const pagePath = 'src/pages/guides/japan-stablecoin-access-usdc-rlusd-jpysc/index.astro';
const researchPath = 'data/editorial-research/japan-stablecoin-market-access-2026.json';
const amendmentPath = 'docs/roadmap-amendments/2026-07-10-pr339-japan-market-access-guide-insertion.md';

const page = read(pagePath);
const catalog = read('src/data/guideCatalog.ts');
const links = read('src/data/stablecoinGuideLinks.ts');
const architecture = read('config/site-architecture.mjs');
const updates = JSON.parse(read('data/registry-updates.json'));
const publicCopy = read('src/data/updatePublicCopy.ts');
const research = JSON.parse(read(researchPath));
const amendment = read(amendmentPath);

for (const marker of [
  "slug: 'japan-stablecoin-access-usdc-rlusd-jpysc'",
  "publishedAt: '2026-07-10'",
  "informationCurrentThrough: '2026-07-10'",
  "regionLabel: 'Japan'"
]) check(catalog.includes(marker), `guide catalog missing marker: ${marker}`);

for (const marker of [
  'RLUSD’s Japan Launch Is Only Part of the Story',
  'Stablecoin × Jurisdiction × Platform × Function × Access status × Effective date',
  'USDC was the first practical reference point',
  'RLUSD added more than another dollar ticker',
  'JPYSC took a different route on the same day',
  'Absence from that handled-asset list does not, by itself, prove',
  'not yet canonical Market Access Records',
  '“JFSA approval” and register inclusion are not interchangeable claims.'
]) check(page.includes(marker), `guide page missing marker: ${marker}`);

for (const url of [
  'https://www.fsa.go.jp/menkyo/menkyoj/denshikessaisyudan.pdf',
  'https://www.fsa.go.jp/news/r7/sonota/20260519/01.pdf',
  'https://www.fsa.go.jp/singi/singi_kinyu/tosin/20250122/1.pdf',
  'https://www.sbivc.co.jp/newsview/2mjic5dcvjtv',
  'https://www.sbivc.co.jp/newsview/bsqs09vn_yzv',
  'https://www.sbivc.co.jp/newsview/fx4zmjwbl',
  'https://ripple.com/ripple-press/ripple-and-sbi-group-partner-to-launch-ripple-usd-in-japan/'
]) check(page.includes(url), `guide page missing source URL: ${url}`);

check(research.schema_version === '0.1', 'research schema version must be 0.1');
check(research.status === 'reviewed_research_checkpoint', 'research checkpoint must be reviewed');
check(research.information_current_through === '2026-07-10', 'research information date mismatch');
check(research.canonical_boundary?.canonical_market_access_schema_available === false, 'canonical market-access schema must remain unavailable in PR #339 research checkpoint');
check(research.canonical_boundary?.canonical_action === 'none', 'research checkpoint canonical action must be none');
check(research.canonical_boundary?.included_in_public_canonical_counts === false, 'research checkpoint must remain outside canonical public counts');
check(research.records?.length === 3, 'research checkpoint must contain exactly three access rows');

const byAsset = new Map(research.records.map((row) => [row.asset_id, row]));
for (const id of ['sog_st_usdc', 'sog_st_rlusd', 'sog_st_jpysc']) {
  check(byAsset.has(id), `missing reviewed access row for ${id}`);
}

const usdc = byAsset.get('sog_st_usdc');
const rlusd = byAsset.get('sog_st_rlusd');
const jpysc = byAsset.get('sog_st_jpysc');

check(usdc.observed_access_state === 'available_with_platform_limits', 'USDC access state mismatch');
check(usdc.functions?.withdrawal === 'available', 'USDC withdrawal state mismatch');
check(usdc.network_scope === 'ethereum_only_on_platform_at_reviewed_launch_stage', 'USDC network scope mismatch');

check(rlusd.observed_access_state === 'available_with_platform_limits', 'RLUSD access state mismatch');
check(rlusd.functions?.withdrawal === 'available', 'RLUSD withdrawal state mismatch');
check(rlusd.network_scope === 'ethereum_only_on_platform_at_reviewed_launch_stage', 'RLUSD network scope mismatch');
check(rlusd.legal_route_description.includes('Category 4'), 'RLUSD Category 4 source characterization missing');

check(jpysc.observed_access_state === 'account_internal_limited', 'JPYSC access state mismatch');
check(jpysc.functions?.external_wallet_transfer === 'unavailable_at_reviewed_launch_stage', 'JPYSC external transfer boundary mismatch');
check(jpysc.network_scope === 'account_internal_only_at_reviewed_launch_stage', 'JPYSC account-internal scope mismatch');
check(jpysc.legal_route_description.includes('Category 3'), 'JPYSC Category 3 source characterization missing');

for (const row of research.records) {
  check(row.jurisdiction_code === 'JP', `${row.record_id}: jurisdiction must be JP`);
  check(row.platform === 'SBI VC Trade', `${row.record_id}: platform mismatch`);
  check(row.confidence === 'high', `${row.record_id}: reviewed row confidence must be high`);
  check(Array.isArray(row.source_urls) && row.source_urls.length >= 4, `${row.record_id}: insufficient source depth`);
}

const route = '/guides/japan-stablecoin-access-usdc-rlusd-jpysc/';
check(architecture.includes(route), 'site architecture route missing');
check(links.includes("'japan-stablecoin-access-usdc-rlusd-jpysc': ['usdc', 'rlusd', 'jpysc']"), 'stablecoin guide coverage missing');

const update = updates.find((entry) => entry.id === 'sog_update_2026_07_10_japan_stablecoin_access_guide');
check(Boolean(update), 'registry update entry missing');
check(update.related_paths.includes(route), 'registry update route missing');
check(publicCopy.includes('sog_update_2026_07_10_japan_stablecoin_access_guide'), 'public update copy missing');

for (const marker of [
  'PR #339  Japan stablecoin access guide and reviewed research checkpoint insertion',
  'PR #340  canonical Market Access Record schema and governance',
  'PR #341  facet-freshness derivation contract and validators',
  'PR #342  deterministic comparison projection generator and machine-readable output',
  'PR #349  SOG Registry Update feed/page',
  'PR #351+ natural-language filter translation only after separate approval'
]) check(amendment.includes(marker), `roadmap insertion amendment missing marker: ${marker}`);

console.log(JSON.stringify({
  ok: true,
  publication_route: route,
  reviewed_access_rows: research.records.length,
  canonical_market_access_records_created: false,
  canonical_action: research.canonical_boundary.canonical_action,
  next_market_access_schema_pr: 340
}, null, 2));
