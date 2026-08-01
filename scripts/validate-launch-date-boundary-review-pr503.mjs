import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const targets = ['sog_st_msusd','sog_st_stablesusdx','sog_st_susde','sog_st_usd1','sog_st_usdm','sog_st_usdh'];
const queue = readJson('data/quality/launch-date-unresolved.json');
const review = readJson('data/editorial-research/launch-date-boundary-review-batch-1-pr503-source-review.json');
const currentCheckpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const canonicalRows = [];
const walkJson = (dir) => {
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walkJson(rel);
    else if (entry.isFile() && entry.name.endsWith('.json')) {
      let parsed;
      try { parsed = readJson(rel); } catch { continue; }
      const visit = (value) => {
        if (Array.isArray(value)) return value.forEach(visit);
        if (!value || typeof value !== 'object') return;
        if (typeof value.id === 'string' && Object.hasOwn(value, 'launch_date')) canonicalRows.push(value);
        Object.values(value).forEach(visit);
      };
      visit(parsed);
    }
  }
};
walkJson('data');
const stablecoinById = new Map(canonicalRows.map((row) => [row.id, row]));
const queueById = new Map(queue.records.map((row) => [row.stablecoin_id, row]));

expect(queue.expected_total === 29 && queue.records.length === 29, 'launch queue total must remain 29');
expect(review.status === 'reviewed_bounded_no_canonical_change', 'source review status changed');
expect(review.authority_pr === 502 && review.implementation_pr === 503, 'PR authority mismatch');
expect(review.target_count === 6 && review.exact_day_resolved_count === 0 && review.null_preserved_count === 6, 'target disposition counts changed');
expect(review.canonical_evidence_added_count === 0 && review.canonical_evidence_relation_added_count === 0, 'Evidence changes are prohibited in this result');
expect(review.decision?.all_targets_disposed === true, 'all six targets must be disposed');
expect(review.decision?.next_boundary === 'REVIEW_GATE', 'next boundary must be REVIEW_GATE');
expect(JSON.stringify(review.dispositions.map((row) => row.stablecoin_id)) === JSON.stringify(targets), 'source review target order changed');

for (const id of targets) {
  const stablecoin = stablecoinById.get(id);
  const row = queueById.get(id);
  const disposition = review.dispositions.find((item) => item.stablecoin_id === id);
  expect(Boolean(stablecoin), id + ': canonical stablecoin missing');
  expect(stablecoin?.launch_date === null, id + ': canonical launch_date must remain null');
  expect(Boolean(row), id + ': unresolved queue row missing');
  expect(row?.category === 'C', id + ': queue category must remain C');
  expect(typeof row?.best_known_range === 'string' && row.best_known_range.length > 20, id + ': reviewed range missing');
  expect(typeof row?.reason_code === 'string' && row.reason_code.length > 10, id + ': reason_code missing');
  expect(typeof row?.review_note === 'string' && row.review_note.length > 80, id + ': review_note too weak');
  expect(row?.last_reviewed === '2026-08-01', id + ': last_reviewed must be 2026-08-01');
  expect(Array.isArray(row?.reviewed_sources) && row.reviewed_sources.length >= 3, id + ': at least three reviewed sources required');
  expect(row.reviewed_sources.every((url) => /^https:\/\//.test(url)), id + ': reviewed source URL must use HTTPS');
  expect(disposition?.decision === 'bounded_range_reconfirmed_and_null_preserved', id + ': disposition changed');
  expect(disposition?.canonical_launch_date_before === null && disposition?.canonical_launch_date_after === null, id + ': null preservation missing');
}

const counts = currentCheckpoint.counts;
expect(counts.assets === 117, 'asset count changed');
expect(counts.organizations === 108, 'organization count changed');
expect(counts.relationships === 129, 'relationship count changed');
expect(counts.events === 192, 'event count changed');
expect(counts.evidence === 579 && counts.evidence_relations === 579, 'Evidence counts changed');
expect(counts.deployments === 184, 'deployment count changed');
expect(counts.market_access_records === 8, 'Market Access count changed');
expect(agents.includes('PR #503 Launch Date Boundary Review — Batch 1: implementation under review'), 'AGENTS PR #503 state missing');
expect(agents.includes('All six canonical launch dates remain null'), 'AGENTS result missing');
expect(roadmap.includes('exact day resolved: 0'), 'roadmap result missing');
expect(governance.includes('PR #503 Launch Date Boundary Review — Batch 1'), 'governance PR #503 section missing');
expect(active === "import './validate-launch-date-boundary-review-pr503.mjs';", 'active workstream is not wired to PR #503');

if (failures.length) {
  console.error('PR #503 launch-date boundary review validation failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  review_id: review.review_id,
  targets: targets.length,
  exact_day_resolved: 0,
  null_preserved: 6,
  queue_total: queue.records.length,
  canonical_counts_preserved: true,
  next_boundary: 'REVIEW_GATE'
}, null, 2));
