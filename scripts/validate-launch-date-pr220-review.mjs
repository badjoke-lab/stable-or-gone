import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const absolute = (relativePath) => path.join(root, relativePath);
const readJson = (relativePath) => JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8'));
const failures = [];
const fail = (message) => failures.push(message);

const reviewPath = 'data/quality/launch-date-pr220-review.json';
if (!fs.existsSync(absolute(reviewPath))) {
  console.error(`PR #220 launch review is missing: ${reviewPath}`);
  process.exit(1);
}

const review = readJson(reviewPath);
const queue = readJson('data/quality/launch-date-unresolved.json');
const baseline = loadRegistryV2Baseline(root);
const stablecoins = (baseline.data_groups?.stablecoins ?? []).flatMap((file) => {
  const rows = readJson(file);
  if (!Array.isArray(rows)) throw new Error(`${file}: expected array`);
  return rows;
});
const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const queueById = new Map((queue.records ?? []).map((row) => [row.stablecoin_id, row]));
const expectedIds = [
  'sog_st_honey',
  'sog_st_husd',
  'sog_st_msusd',
  'sog_st_stablesusdx',
  'sog_st_susde',
  'sog_st_usd1',
  'sog_st_usdm',
  'sog_st_usyc',
  'sog_st_usdh',
  'sog_st_aecoin'
].sort();

if (review.schema_version !== '1.0') fail('schema_version must be 1.0');
if (review.reviewed_at !== '2026-06-28') fail('reviewed_at must be 2026-06-28');
if (review.expected_total !== expectedIds.length) fail(`expected_total must be ${expectedIds.length}`);
if (!Array.isArray(review.records)) fail('records must be an array');

const rows = Array.isArray(review.records) ? review.records : [];
const ids = rows.map((row) => row.stablecoin_id).sort();
if (new Set(ids).size !== ids.length) fail('duplicate stablecoin_id in PR #220 review');
if (JSON.stringify(ids) !== JSON.stringify(expectedIds)) {
  fail(`review target set mismatch: ${ids.join(', ')}`);
}

for (const row of rows) {
  const id = row.stablecoin_id;
  if (row.decision !== 'preserve_null') fail(`${id}: decision must remain preserve_null`);
  if (typeof row.best_known_range !== 'string' || row.best_known_range.length < 15) fail(`${id}: bounded range is missing`);
  if (typeof row.reason_code !== 'string' || row.reason_code.length === 0) fail(`${id}: reason_code is missing`);
  if (typeof row.review_note !== 'string' || row.review_note.length < 40) fail(`${id}: review_note is too short`);
  if (!Array.isArray(row.reviewed_sources) || row.reviewed_sources.length < 2) fail(`${id}: at least two reviewed sources are required`);
  else {
    if (new Set(row.reviewed_sources).size !== row.reviewed_sources.length) fail(`${id}: duplicate reviewed source`);
    for (const url of row.reviewed_sources) {
      if (typeof url !== 'string' || !url.startsWith('https://')) fail(`${id}: reviewed sources must use HTTPS`);
    }
  }

  const queueRow = queueById.get(id);
  if (!queueRow) fail(`${id}: reviewed record is missing from unresolved queue`);
  else if (queueRow.category !== 'C') fail(`${id}: PR #220 target must remain Category C`);

  const canonical = stablecoinById.get(id);
  if (!canonical) fail(`${id}: canonical stablecoin is missing`);
  else if (canonical.launch_date !== null) fail(`${id}: canonical launch_date must remain null`);
}

if (queue.expected_total !== 19) fail(`unresolved queue total must remain 19, found ${queue.expected_total}`);
if (queue.category_counts?.B !== 3 || queue.category_counts?.C !== 16 || queue.category_counts?.D !== 0) {
  fail('unresolved queue distribution must remain B 3 / C 16 / D 0');
}

if (typeof review.source_review !== 'string' || !fs.existsSync(absolute(review.source_review))) {
  fail(`supporting audit is missing: ${review.source_review}`);
} else {
  const audit = fs.readFileSync(absolute(review.source_review), 'utf8');
  for (const phrase of ['Total unresolved: 19', 'Category B: 3', 'Category C: 16', 'Category D: 0']) {
    if (!audit.includes(phrase)) fail(`supporting audit is missing summary: ${phrase}`);
  }
  for (const id of expectedIds) {
    if (!audit.includes(id)) fail(`supporting audit is missing reviewed id: ${id}`);
  }
}

if (failures.length > 0) {
  console.error('PR #220 launch review validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('PR #220 launch review valid: 10 records preserve null with source-backed boundaries; queue remains 19 (B 3 / C 16 / D 0).');
