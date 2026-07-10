import { isDeepStrictEqual } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { buildChangeTimelineProjection, serializeChangeTimelineProjection } from './timeline/build-change-timeline-pr348.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const contract = readJson('data/quality/change-timeline-contract-v1.json');
const marketAccess = readJson('data/market-access-records-v1.json');
const projection = buildChangeTimelineProjection();
const projectionRepeat = buildChangeTimelineProjection();
const builderSource = readText('scripts/timeline/build-change-timeline-pr348.mjs');
const routeSource = readText('src/pages/data/change-timeline.json.ts');
const manifestSource = readText('src/lib/data/manifestBase.ts');

const validDay = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const filterAxes = ['source_family','date_kind','boundary_kind','change_type','asset_slug','year','jurisdiction'];
const recomputeFilter = (axis) => {
  const counts = new Map();
  for (const item of projection.items) {
    let values = [];
    if (axis === 'source_family') values = [item.source_family];
    if (axis === 'date_kind') values = [item.date_kind];
    if (axis === 'boundary_kind') values = [item.boundary_kind];
    if (axis === 'change_type') values = [item.change_type];
    if (axis === 'asset_slug') values = item.assets.map((asset) => asset.slug).filter(Boolean);
    if (axis === 'year') values = [item.year];
    if (axis === 'jurisdiction') values = item.jurisdiction_tokens;
    for (const value of [...new Set(values)].sort()) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].map(([value, item_count]) => ({ value, item_count })).sort((left, right) => right.item_count - left.item_count || left.value.localeCompare(right.value));
};

expect(contract.schema_version === '1.0', 'timeline contract schema version mismatch');
expect(contract.status === 'canonical_public_projection_contract', 'timeline contract status mismatch');
expect(contract.endpoint === '/data/change-timeline.json', 'timeline endpoint mismatch');
expect(contract.source_families?.length === 6, 'timeline contract must define six source families');
expect(contract.date_kinds?.length === 10, 'timeline contract must define ten date kinds');
expect(contract.boundary_kinds?.length === 3, 'timeline contract must define three boundary kinds');
expect(contract.data_safety?.canonical_only === true, 'timeline must be canonical-only');
expect(contract.data_safety?.includes_unreviewed_candidates === false, 'timeline must exclude candidates');
expect(contract.data_safety?.includes_internal_monitoring === false, 'timeline must exclude monitoring');
expect(contract.data_safety?.includes_editorial_research === false, 'timeline must exclude editorial research');
expect(contract.projection_rules?.date_semantics_preserved === true, 'timeline must preserve date semantics');
expect(contract.projection_rules?.cross_source_deduplication === false, 'timeline must not cross-source deduplicate semantically distinct records');
expect(contract.projection_rules?.single_generic_timestamp === false, 'timeline must not collapse dates into a generic timestamp');
expect(contract.projection_rules?.review_dates_are_change_items === false, 'review dates must not become change items');
expect(contract.projection_rules?.freshness_dates_are_change_items === false, 'freshness dates must not become change items');
expect(contract.projection_rules?.single_composite_score === false, 'timeline must not create composite score');
expect(contract.projection_rules?.risk_ranking === false, 'timeline must not create risk ranking');
expect(contract.next_pr === 349, 'PR #348 next PR must be #349');

expect(projection.schema_version === '1.0', 'timeline projection schema version mismatch');
expect(projection.projection_id === contract.contract_id, 'timeline projection contract ID mismatch');
expect(projection.status === 'public_canonical_projection', 'timeline projection status mismatch');
expect(projection.generated_at === '2026-07-10', 'timeline projection generated_at must be deterministic');
expect(isDeepStrictEqual(projection.data_safety, contract.data_safety), 'timeline data safety mismatch');
expect(isDeepStrictEqual(projection.projection_rules, contract.projection_rules), 'timeline projection rules mismatch');
expect(projection.item_count === projection.items.length, 'timeline item_count mismatch');
expect(projection.item_count > 0, 'timeline must emit at least one item');
expect(serializeChangeTimelineProjection(projection) === serializeChangeTimelineProjection(projectionRepeat), 'timeline projection must be byte-deterministic');

const itemIds = new Set();
for (const [index, item] of projection.items.entries()) {
  expect(typeof item.item_id === 'string' && item.item_id.startsWith('sog_tl_'), `timeline item ${index}: invalid item_id`);
  expect(!itemIds.has(item.item_id), `duplicate timeline item_id: ${item.item_id}`);
  itemIds.add(item.item_id);
  expect(validDay(item.date), `${item.item_id}: date must be YYYY-MM-DD`);
  expect(item.year === item.date.slice(0, 4), `${item.item_id}: year mismatch`);
  expect(contract.source_families.includes(item.source_family), `${item.item_id}: unsupported source family ${item.source_family}`);
  expect(contract.date_kinds.includes(item.date_kind), `${item.item_id}: unsupported date kind ${item.date_kind}`);
  expect(contract.boundary_kinds.includes(item.boundary_kind), `${item.item_id}: unsupported boundary kind ${item.boundary_kind}`);
  expect(typeof item.date_semantics === 'string' && item.date_semantics.length > 0, `${item.item_id}: date semantics missing`);
  expect(!contract.excluded_date_semantics.includes(item.date_kind), `${item.item_id}: excluded date kind entered timeline`);
  expect(typeof item.source_record_id === 'string' && item.source_record_id.length > 0, `${item.item_id}: source record ID missing`);
  expect(typeof item.change_type === 'string' && item.change_type.length > 0, `${item.item_id}: change_type missing`);
  expect(Array.isArray(item.asset_ids), `${item.item_id}: asset_ids must be array`);
  expect(Array.isArray(item.organization_ids), `${item.item_id}: organization_ids must be array`);
  expect(Array.isArray(item.jurisdiction_tokens), `${item.item_id}: jurisdiction_tokens must be array`);
  expect(item.assets.length === item.asset_ids.length, `${item.item_id}: asset references must align with asset_ids`);
  expect(item.organizations.length === item.organization_ids.length, `${item.item_id}: organization references must align with organization_ids`);
  if (index > 0) {
    const previous = projection.items[index - 1];
    expect(previous.date.localeCompare(item.date) >= 0, `${item.item_id}: timeline date order must be descending`);
  }
}

for (const axis of filterAxes) {
  expect(Array.isArray(projection.filters?.[axis]), `timeline filter missing ${axis}`);
  expect(isDeepStrictEqual(projection.filters[axis], recomputeFilter(axis)), `timeline filter count mismatch for ${axis}`);
}

const recomputedSourceCounts = Object.fromEntries(projection.filters.source_family.map((row) => [row.value, row.item_count]));
const recomputedDateKindCounts = Object.fromEntries(projection.filters.date_kind.map((row) => [row.value, row.item_count]));
expect(projection.summary.item_count === projection.item_count, 'timeline summary item count mismatch');
expect(isDeepStrictEqual(projection.summary.source_family_counts, recomputedSourceCounts), 'timeline source-family summary mismatch');
expect(isDeepStrictEqual(projection.summary.date_kind_counts, recomputedDateKindCounts), 'timeline date-kind summary mismatch');
expect(projection.summary.latest_date === projection.items[0]?.date, 'timeline latest_date mismatch');
expect(projection.summary.earliest_date === projection.items.at(-1)?.date, 'timeline earliest_date mismatch');
expect(projection.summary.asset_count_with_items === new Set(projection.items.flatMap((item) => item.asset_ids)).size, 'timeline asset coverage summary mismatch');
expect(projection.summary.organization_count_with_items === new Set(projection.items.flatMap((item) => item.organization_ids)).size, 'timeline organization coverage summary mismatch');

for (const excluded of contract.excluded_date_semantics) {
  expect(!projection.items.some((item) => item.date_kind === excluded), `excluded date semantic emitted as item: ${excluded}`);
}
expect(!projection.items.some((item) => item.date_kind === 'market_access_observed_at'), 'Market Access observed_at must not be a change item');
expect(!projection.items.some((item) => item.date_kind === 'last_verified_at'), 'last_verified_at must not be a change item');
expect(!projection.items.some((item) => item.date_kind === 'freshness_anchor_date'), 'freshness anchor must not be a change item');

expect(Array.isArray(marketAccess) && marketAccess.length === 0, 'PR #348 assumes canonical Market Access remains empty');
expect(!projection.items.some((item) => item.source_family === 'market_access_record'), 'empty canonical Market Access must emit zero timeline items');

expect(!builderSource.includes('editorial-research'), 'timeline builder must not read editorial research');
expect(!builderSource.includes('monitoring'), 'timeline builder must not read monitoring output');
expect(!builderSource.includes('last_verified_at'), 'timeline builder must not use last_verified_at as change item');
expect(!builderSource.includes('freshness_state'), 'timeline builder must not use freshness state as change item');
expect(!builderSource.includes('freshness_anchor'), 'timeline builder must not use freshness anchor as change item');

expect(routeSource.includes('getPublicChangeTimelineProjection'), 'public timeline route must use deterministic timeline helper');
expect(routeSource.includes("'content-type': 'application/json; charset=utf-8'"), 'public timeline route must emit JSON content type');
expect(manifestSource.includes("change_timeline: '/data/change-timeline.json'"), 'manifest must advertise timeline endpoint');
expect(manifestSource.includes('date_semantics_preserved: true'), 'manifest must declare date-semantics preservation');
expect(manifestSource.includes('review_dates_excluded: true'), 'manifest must declare review-date exclusion');
expect(manifestSource.includes('freshness_dates_excluded: true'), 'manifest must declare freshness-date exclusion');

if (failures.length) {
  console.error('PR #348 change timeline validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  item_count: projection.item_count,
  asset_count_with_items: projection.summary.asset_count_with_items,
  organization_count_with_items: projection.summary.organization_count_with_items,
  earliest_date: projection.summary.earliest_date,
  latest_date: projection.summary.latest_date,
  source_family_counts: projection.summary.source_family_counts,
  date_kind_counts: projection.summary.date_kind_counts,
  endpoint: contract.endpoint,
  next_pr: contract.next_pr
}, null, 2));
