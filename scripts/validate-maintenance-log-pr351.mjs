import { isDeepStrictEqual } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import { buildMaintenanceLog, serializeMaintenanceLog } from './maintenance/build-maintenance-log-pr351.mjs';
import { buildUpdateFeed } from './updates/build-update-feed-pr350.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/monthly-maintenance-log-v1.json');
const sourceEntries = readJson(config.source_file);
const log = buildMaintenanceLog();
const logRepeat = buildMaintenanceLog();
const baseline = loadRegistryV2Baseline(root);
const updateFeed = buildUpdateFeed();
const stableAssets = (baseline.data_groups?.stablecoins ?? []).flatMap((file) => readJson(file));
const builderSource = readText('scripts/maintenance/build-maintenance-log-pr351.mjs');
const pageSource = readText('src/pages/maintenance/index.astro');
const cssSource = readText('src/styles/maintenance-log.css');
const routeSource = readText('src/pages/data/maintenance-log.json.ts');
const manifestSource = readText('src/lib/data/manifestBase.ts');

const monthPattern = /^\d{4}-\d{2}$/;
const dayPattern = /^\d{4}-\d{2}-\d{2}$/;
const allowedTopKeys = new Set(['month','status','as_of','public_summary','checks','counts','public_surface_releases','next_focus']);
const allowedCheckKeys = new Set(['check_id','result','summary']);
const allowedReleaseKeys = new Set(['id','label','route']);

expect(config.schema_version === '1.0', 'maintenance config schema version mismatch');
expect(config.config_id === 'sog_monthly_maintenance_log_pr351_v1', 'maintenance config ID mismatch');
expect(config.source_file === 'data/monthly-maintenance-log.json', 'maintenance source file mismatch');
expect(config.source_endpoint === '/data/maintenance-log.json', 'maintenance endpoint mismatch');
expect(config.route === '/maintenance/', 'maintenance route mismatch');
expect(config.ordering === 'month_desc', 'maintenance ordering mismatch');
expect(config.entry_policy?.one_entry_per_month === true, 'maintenance log must have one entry per month');
expect(config.entry_policy?.closed_months_immutable === true, 'closed months must be immutable');
expect(config.entry_policy?.current_month_may_be_in_progress === true, 'current month must support in-progress state');
expect(config.entry_policy?.closed_months_append_only === true, 'closed months must be append-only');
expect(config.public_safety?.aggregate_outcomes_only === true, 'maintenance log must expose aggregate outcomes only');
for (const key of ['includes_internal_monitoring_rows','includes_unreviewed_candidates','includes_private_notes','includes_private_source_queues','includes_candidate_urls','includes_secrets']) expect(config.public_safety?.[key] === false, `maintenance public safety boundary must keep ${key}=false`);
expect(config.allowed_statuses?.length === 2 && config.allowed_statuses.includes('in_progress') && config.allowed_statuses.includes('closed'), 'maintenance statuses mismatch');
expect(config.required_check_ids?.length === 6, 'maintenance log must define six required checks');
expect(config.count_fields?.length === 2, 'maintenance log must define two public count fields');
expect(config.semantics?.operational_log_not_subject_history === true, 'maintenance log must not become subject history');
expect(config.semantics?.operational_log_not_publication_feed === true, 'maintenance log must not become publication feed');
expect(config.semantics?.check_result_not_risk_score === true, 'maintenance check result must not become risk score');
expect(config.semantics?.no_live_monitoring_feed === true, 'maintenance log must not become live monitoring feed');
expect(config.semantics?.single_composite_score === false, 'maintenance log must not create score');
expect(config.semantics?.risk_ranking === false, 'maintenance log must not create ranking');
expect(config.next_state === 'public_surface_expansion_sequence_complete', 'PR #351 must close public-surface expansion sequence');

expect(Array.isArray(sourceEntries) && sourceEntries.length >= 1, 'maintenance source must contain at least one month');
const months = sourceEntries.map((entry) => entry.month);
expect(new Set(months).size === months.length, 'maintenance months must be unique');

for (const [index, entry] of sourceEntries.entries()) {
  expect(Object.keys(entry).every((key) => allowedTopKeys.has(key)), `${entry.month ?? index}: unsupported top-level public key`);
  expect(monthPattern.test(entry.month), `${entry.month ?? index}: month must be YYYY-MM`);
  expect(config.allowed_statuses.includes(entry.status), `${entry.month}: unsupported status ${entry.status}`);
  expect(dayPattern.test(entry.as_of), `${entry.month}: as_of must be YYYY-MM-DD`);
  expect(entry.as_of.startsWith(entry.month), `${entry.month}: as_of must belong to month`);
  expect(typeof entry.public_summary === 'string' && entry.public_summary.length > 0, `${entry.month}: public_summary missing`);
  expect(Array.isArray(entry.checks) && entry.checks.length === config.required_check_ids.length, `${entry.month}: required check count mismatch`);
  const checkIds = entry.checks.map((check) => check.check_id);
  expect(new Set(checkIds).size === checkIds.length, `${entry.month}: duplicate check IDs`);
  expect(JSON.stringify([...checkIds].sort()) === JSON.stringify([...config.required_check_ids].sort()), `${entry.month}: required check identity set mismatch`);
  for (const check of entry.checks) {
    expect(Object.keys(check).every((key) => allowedCheckKeys.has(key)), `${entry.month}/${check.check_id}: unsupported check key`);
    expect(config.allowed_check_results.includes(check.result), `${entry.month}/${check.check_id}: unsupported result ${check.result}`);
    expect(typeof check.summary === 'string' && check.summary.length > 0, `${entry.month}/${check.check_id}: summary missing`);
  }
  expect(Object.keys(entry.counts ?? {}).sort().join(',') === [...config.count_fields].sort().join(','), `${entry.month}: public count fields mismatch`);
  for (const field of config.count_fields) expect(Number.isInteger(entry.counts[field]) && entry.counts[field] >= 0, `${entry.month}/${field}: count must be nonnegative integer`);
  expect(Array.isArray(entry.public_surface_releases), `${entry.month}: public_surface_releases must be array`);
  for (const release of entry.public_surface_releases) {
    expect(Object.keys(release).every((key) => allowedReleaseKeys.has(key)), `${entry.month}/${release.id}: unsupported release key`);
    expect(typeof release.id === 'string' && release.id.length > 0, `${entry.month}: release ID missing`);
    expect(typeof release.label === 'string' && release.label.length > 0, `${entry.month}/${release.id}: release label missing`);
    expect(typeof release.route === 'string' && release.route.startsWith('/'), `${entry.month}/${release.id}: release route must be local public path`);
    expect(!release.route.startsWith('//'), `${entry.month}/${release.id}: protocol-relative route forbidden`);
  }
  expect(Array.isArray(entry.next_focus) && entry.next_focus.length > 0, `${entry.month}: next_focus missing`);
  expect(entry.next_focus.every((item) => typeof item === 'string' && item.length > 0), `${entry.month}: next_focus items must be non-empty strings`);
  if (index > 0) expect(sourceEntries[index - 1].month.localeCompare(entry.month) > 0, `${entry.month}: source months must be descending`);
}

const latest = sourceEntries[0];
if (latest.status === 'in_progress') {
  expect(latest.counts.canonical_stable_assets === stableAssets.length, `latest in-progress canonical asset count ${latest.counts.canonical_stable_assets} != current ${stableAssets.length}`);
  expect(latest.counts.publication_feed_entries === updateFeed.item_count, `latest in-progress publication feed count ${latest.counts.publication_feed_entries} != current ${updateFeed.item_count}`);
}

expect(log.schema_version === '1.0', 'maintenance projection schema mismatch');
expect(log.log_id === config.config_id, 'maintenance projection ID mismatch');
expect(log.status === 'public_monthly_maintenance_log', 'maintenance projection status mismatch');
expect(log.generated_at === '2026-07-10', 'maintenance generated_at must be deterministic');
expect(log.source_file === config.source_file, 'maintenance source binding mismatch');
expect(log.source_endpoint === config.source_endpoint, 'maintenance endpoint binding mismatch');
expect(log.route === config.route, 'maintenance route binding mismatch');
expect(isDeepStrictEqual(log.entry_policy, config.entry_policy), 'maintenance entry policy mismatch');
expect(isDeepStrictEqual(log.public_safety, config.public_safety), 'maintenance public safety mismatch');
expect(isDeepStrictEqual(log.semantics, config.semantics), 'maintenance semantics mismatch');
expect(log.summary.entry_count === sourceEntries.length, 'maintenance summary entry count mismatch');
expect(log.summary.closed_month_count === sourceEntries.filter((entry) => entry.status === 'closed').length, 'closed month summary mismatch');
expect(log.summary.in_progress_month_count === sourceEntries.filter((entry) => entry.status === 'in_progress').length, 'in-progress month summary mismatch');
expect(log.summary.latest_month === sourceEntries[0].month, 'latest month summary mismatch');
expect(log.summary.latest_as_of === sourceEntries[0].as_of, 'latest as_of summary mismatch');
expect(serializeMaintenanceLog(log) === serializeMaintenanceLog(logRepeat), 'maintenance projection must be byte-deterministic');

expect(!builderSource.includes('monitoring/'), 'maintenance builder must not read monitoring directory');
expect(!builderSource.includes('candidate'), 'maintenance builder must not read candidate data');
expect(!builderSource.includes('editorial-research'), 'maintenance builder must not read editorial research');
expect(!builderSource.includes('private'), 'maintenance builder must not read private sources');

for (const marker of [
  'data-maintenance-log-page',
  'Operational transparency without exposing the research queue',
  'What stays internal',
  'data-maintenance-month',
  'Contract checks',
  'Public counts at checkpoint',
  'Public surfaces in this maintenance sequence',
  'Next focus',
  '/data/maintenance-log.json',
  '/updates/',
  '/timeline/',
  '/methodology/'
]) expect(pageSource.includes(marker), `Maintenance page missing marker: ${marker}`);
for (const marker of ['.maintenance-masthead','.maintenance-boundary-grid','.maintenance-check-grid','.maintenance-entry','@media (max-width:719px)','var(--sog-ink-body)']) expect(cssSource.includes(marker), `Maintenance CSS missing marker: ${marker}`);
expect(routeSource.includes('getPublicMaintenanceLog'), 'maintenance endpoint must use deterministic helper');
expect(routeSource.includes("'content-type': 'application/json; charset=utf-8'"), 'maintenance endpoint must emit JSON');
expect(manifestSource.includes("maintenance_log: '/data/maintenance-log.json'"), 'manifest must advertise maintenance endpoint');
expect(manifestSource.includes("page: '/maintenance/'"), 'manifest must advertise maintenance page');
expect(manifestSource.includes('aggregate_outcomes_only: true'), 'manifest must preserve maintenance public-safety boundary');

if (failures.length) {
  console.error('PR #351 maintenance log validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  month_count: log.summary.entry_count,
  latest_month: log.summary.latest_month,
  latest_status: log.entries[0]?.status ?? null,
  canonical_stable_assets: latest.counts.canonical_stable_assets,
  publication_feed_entries: latest.counts.publication_feed_entries,
  route: config.route,
  endpoint: config.source_endpoint,
  next_state: config.next_state
}, null, 2));
