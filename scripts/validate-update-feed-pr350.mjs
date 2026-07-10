import { isDeepStrictEqual } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { buildUpdateFeed, serializeUpdateFeed } from './updates/build-update-feed-pr350.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/update-feed-v1.json');
const sourceUpdates = readJson('data/registry-updates.json');
const feed = buildUpdateFeed();
const feedRepeat = buildUpdateFeed();
const builderSource = readText('scripts/updates/build-update-feed-pr350.mjs');
const pageSource = readText('src/pages/updates/index.astro');
const scriptSource = readText('src/scripts/update-feed-ui.ts');
const cssSource = readText('src/styles/update-feed.css');
const routeSource = readText('src/pages/data/update-feed.json.ts');
const manifestSource = readText('src/lib/data/manifestBase.ts');

const validDay = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const recomputeFilter = (axis) => {
  const counts = new Map();
  for (const entry of feed.entries) {
    let values = [];
    if (axis === 'category') values = [entry.category];
    if (axis === 'year') values = [entry.year];
    if (axis === 'route_family') values = entry.route_families;
    for (const value of [...new Set(values)].sort()) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()].map(([value, item_count]) => ({ value, item_count })).sort((left, right) => right.item_count - left.item_count || left.value.localeCompare(right.value));
};

expect(config.schema_version === '1.0', 'Update Feed config schema version mismatch');
expect(config.config_id === 'sog_update_feed_pr350_v1', 'Update Feed config ID mismatch');
expect(config.source_file === 'data/registry-updates.json', 'Update Feed source file mismatch');
expect(config.source_endpoint === '/data/update-feed.json', 'Update Feed endpoint mismatch');
expect(config.route === '/updates/', 'Update Feed route mismatch');
expect(config.ordering === 'publication_date_desc_then_update_id', 'Update Feed ordering mismatch');
expect(config.initial_result_limit === 20, 'Update Feed initial result limit must be 20');
expect(config.result_limit_increment === 20, 'Update Feed result increment must be 20');
expect(config.filters?.length === 3, 'Update Feed must expose three UI filters');
expect(JSON.stringify(config.filters.map((row) => row.id)) === JSON.stringify(['category','year','route_family']), 'Update Feed filter identity/order mismatch');
expect(config.semantics?.date_field === 'publication_date', 'Update Feed date semantics must be publication_date');
expect(config.semantics?.publication_change_not_subject_change === true, 'Update Feed must separate publication change from subject change');
expect(config.semantics?.timeline_items_are_feed_items === false, 'Timeline items must not become feed items');
expect(config.semantics?.historical_subject_dates_are_feed_dates === false, 'Historical subject dates must not become feed dates');
expect(config.semantics?.live_monitoring_feed === false, 'Update Feed must not be a live monitoring feed');
expect(config.semantics?.single_composite_score === false, 'Update Feed must not create score');
expect(config.semantics?.risk_ranking === false, 'Update Feed must not create ranking');
expect(config.url_contract?.search_param === 'q', 'Update Feed search param must be q');
expect(config.url_contract?.back_forward_restores_state === true, 'Update Feed must restore state on back/forward');
expect(config.next_pr === 351, 'PR #350 next PR must be #351');

expect(feed.schema_version === '1.0', 'Update Feed projection schema version mismatch');
expect(feed.feed_id === config.config_id, 'Update Feed projection ID mismatch');
expect(feed.status === 'public_registry_publication_feed', 'Update Feed status mismatch');
expect(feed.generated_at === '2026-07-10', 'Update Feed generated_at must be deterministic');
expect(feed.source_file === config.source_file, 'Update Feed source-file binding mismatch');
expect(feed.source_endpoint === config.source_endpoint, 'Update Feed source-endpoint binding mismatch');
expect(isDeepStrictEqual(feed.semantics, config.semantics), 'Update Feed semantics differ from config');
expect(feed.item_count === sourceUpdates.length, 'Update Feed item count must equal registry-updates source length');
expect(feed.entries.length === sourceUpdates.length, 'Update Feed entry array length mismatch');
expect(serializeUpdateFeed(feed) === serializeUpdateFeed(feedRepeat), 'Update Feed must be byte-deterministic');

const sourceById = new Map(sourceUpdates.map((row) => [row.id, row]));
const ids = new Set();
for (const [index, entry] of feed.entries.entries()) {
  expect(typeof entry.update_id === 'string' && entry.update_id.length > 0, `entry ${index}: update_id missing`);
  expect(!ids.has(entry.update_id), `duplicate Update Feed ID: ${entry.update_id}`);
  ids.add(entry.update_id);
  expect(validDay(entry.publication_date), `${entry.update_id}: publication_date must be YYYY-MM-DD`);
  expect(entry.year === entry.publication_date.slice(0, 4), `${entry.update_id}: year mismatch`);
  expect(typeof entry.category === 'string' && entry.category.length > 0, `${entry.update_id}: category missing`);
  expect(typeof entry.title === 'string' && entry.title.length > 0, `${entry.update_id}: title missing`);
  expect(typeof entry.summary === 'string' && entry.summary.length > 0, `${entry.update_id}: summary missing`);
  expect(Array.isArray(entry.related_paths), `${entry.update_id}: related_paths must be array`);
  expect(Array.isArray(entry.route_families), `${entry.update_id}: route_families must be array`);
  const source = sourceById.get(entry.update_id);
  expect(Boolean(source), `${entry.update_id}: source update missing`);
  if (source) {
    expect(entry.publication_date === source.date, `${entry.update_id}: publication date differs from source date`);
    expect(entry.category === source.category, `${entry.update_id}: category differs from source`);
    expect(entry.title === source.title, `${entry.update_id}: title differs from source`);
    expect(entry.summary === source.summary, `${entry.update_id}: summary differs from source`);
  }
  if (index > 0) {
    const previous = feed.entries[index - 1];
    const ordered = previous.publication_date.localeCompare(entry.publication_date) > 0
      || (previous.publication_date === entry.publication_date && previous.update_id.localeCompare(entry.update_id) <= 0);
    expect(ordered, `${entry.update_id}: feed ordering must be publication date desc then ID asc`);
  }
}

for (const axis of ['category','year','route_family']) {
  expect(Array.isArray(feed.filters?.[axis]), `Update Feed filter missing ${axis}`);
  expect(isDeepStrictEqual(feed.filters[axis], recomputeFilter(axis)), `Update Feed filter catalog mismatch for ${axis}`);
}
expect(feed.summary.item_count === feed.item_count, 'Update Feed summary item count mismatch');
expect(feed.summary.latest_publication_date === feed.entries[0]?.publication_date, 'latest publication date mismatch');
expect(feed.summary.earliest_publication_date === feed.entries.at(-1)?.publication_date, 'earliest publication date mismatch');
expect(isDeepStrictEqual(feed.summary.category_counts, Object.fromEntries(feed.filters.category.map((row) => [row.value, row.item_count]))), 'category summary mismatch');
expect(isDeepStrictEqual(feed.summary.year_counts, Object.fromEntries(feed.filters.year.map((row) => [row.value, row.item_count]))), 'year summary mismatch');

expect(!builderSource.includes('change-timeline'), 'Update Feed builder must not read Change Timeline projection');
expect(!builderSource.includes('events.json'), 'Update Feed builder must not read historical event source');
expect(!builderSource.includes('monitoring'), 'Update Feed builder must not read monitoring output');
expect(!builderSource.includes('editorial-research'), 'Update Feed builder must not read editorial research');

for (const text of [
  'data-update-feed-page',
  'data-update-feed-search',
  'data-update-feed-filter-id="category"',
  'data-update-feed-filter-id="year"',
  'data-update-feed-filter-id="route_family"',
  'data-update-feed-result-count',
  'data-update-feed-show-more',
  'Two timelines, two different questions',
  'Open Change Timeline',
  '/data/update-feed.json'
]) expect(pageSource.includes(text), `Updates page missing contract text: ${text}`);

for (const text of [
  'restoreStateFromUrl',
  "window.addEventListener('popstate'",
  'matchingItems',
  'visibleLimit = config.initial_result_limit',
  'visibleLimit += config.result_limit_increment',
  'data-route-families'
]) expect(scriptSource.includes(text), `Update Feed script missing behavior: ${text}`);
expect(!scriptSource.includes('.sort('), 'Update Feed UI must not resort feed entries');

for (const text of ['.update-feed-item', '.update-feed-filter-grid', '.update-feed-boundary-grid', '@media (max-width: 719px)', 'min-height: 44px', 'var(--sog-ink-body)']) {
  expect(cssSource.includes(text), `Update Feed CSS missing contract: ${text}`);
}

expect(routeSource.includes('getPublicUpdateFeed'), 'public Update Feed endpoint must use deterministic helper');
expect(routeSource.includes("'content-type': 'application/json; charset=utf-8'"), 'Update Feed endpoint must emit JSON content type');
expect(manifestSource.includes("update_feed: '/data/update-feed.json'"), 'manifest must advertise Update Feed endpoint');
expect(manifestSource.includes("page: '/updates/'"), 'manifest must advertise Update Feed page');
expect(manifestSource.includes('publication_change_not_subject_change: true'), 'manifest must preserve publication-vs-subject boundary');

if (failures.length) {
  console.error('PR #350 Update Feed validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  item_count: feed.item_count,
  latest_publication_date: feed.summary.latest_publication_date,
  earliest_publication_date: feed.summary.earliest_publication_date,
  category_counts: feed.summary.category_counts,
  route_family_count: feed.filters.route_family.length,
  endpoint: config.source_endpoint,
  route: config.route,
  next_pr: config.next_pr
}, null, 2));
