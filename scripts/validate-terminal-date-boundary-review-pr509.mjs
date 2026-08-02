import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const targets = ['sog_st_fei', 'sog_st_nearusn', 'sog_st_esd'];

const authority = readJson('config/terminal-date-boundary-review-batch-1.json');
const review = readJson('data/editorial-research/terminal-date-boundary-review-batch-1-pr509-source-review.json');
const queue = readJson('data/quality/terminal-date-unresolved.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const spec = readText('docs/quality/terminal-date-boundary-review-batch-1-spec.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

expect(authority.authority_pr === 508 && authority.implementation_pr === 509, 'authority PR sequence changed');
expect(JSON.stringify(authority.target_stablecoin_ids) === JSON.stringify(targets), 'authority target set changed');
expect(review.status === 'reviewed_bounded_no_canonical_date_change', 'review status changed');
expect(review.target_count === 3, 'review target count changed');
expect(review.exact_terminal_day_resolved_count === 0, 'unsupported exact terminal day introduced');
expect(review.reviewed_null_preserved_count === 3, 'null-preserved count changed');
expect(review.canonical_evidence_added_count === 0 && review.canonical_evidence_relation_added_count === 0, 'Evidence identity or Relation changed');
expect(JSON.stringify(review.dispositions.map((row) => row.stablecoin_id)) === JSON.stringify(targets), 'review target order or identity changed');
for (const row of review.dispositions) {
  expect(row.decision === 'reviewed_null_preserved', `${row.stablecoin_id}: decision changed`);
  expect(row.canonical_terminal_date_before === null && row.canonical_terminal_date_after === null, `${row.stablecoin_id}: terminal date was coerced`);
  expect(Array.isArray(row.reviewed_primary_sources) && row.reviewed_primary_sources.length >= 3, `${row.stablecoin_id}: primary-source review incomplete`);
  expect(Array.isArray(row.rejected_shortcuts) && row.rejected_shortcuts.length >= 4, `${row.stablecoin_id}: rejected-shortcut record incomplete`);
  expect(row.evidence_identity_changes === 0 && row.evidence_relation_changes === 0, `${row.stablecoin_id}: Evidence boundary changed`);
}
expect(queue.expected_total === 6 && queue.records.length === 6, 'terminal queue total changed');
const byId = new Map(queue.records.map((row) => [row.stablecoin_id, row]));
for (const id of targets) {
  const row = byId.get(id);
  expect(Boolean(row), `${id}: missing from terminal queue`);
  if (!row) continue;
  expect(row.last_reviewed === '2026-08-02', `${id}: review date missing`);
  expect(row.review_outcome === 'reviewed_null_preserved', `${id}: queue outcome changed`);
  expect(row.canonical_terminal_date_before === null && row.canonical_terminal_date_after === null, `${id}: queue date was coerced`);
  expect(Array.isArray(row.reviewed_primary_sources) && row.reviewed_primary_sources.length >= 3, `${id}: queue source list incomplete`);
}
expect(byId.get('sog_st_gyen')?.reason_code === 'redemption_period_still_open', 'non-target GYEN boundary changed');
expect(checkpoint.counts.assets === 117 && checkpoint.counts.organizations === 108 && checkpoint.counts.relationships === 129, 'identity counts changed');
expect(checkpoint.counts.events === 192 && checkpoint.counts.evidence === 579 && checkpoint.counts.evidence_relations === 579, 'event or Evidence counts changed');
expect(checkpoint.counts.deployments === 184 && checkpoint.counts.market_access_records === 8, 'deployment or Market Access counts changed');
expect(checkpoint.counts.detail_routes === 417 && checkpoint.counts.metadata_checked_routes === 417, 'route counts changed');
expect(checkpoint.counts.archive_index_count === 457 && checkpoint.counts.archive_not_recorded_count === 122, 'archive partition changed');
expect(agents.includes('PR #509 Terminal Date Boundary Review — Batch 1: implementation under review'), 'AGENTS implementation status missing');
expect(agents.includes('exact terminal days resolved: 0'), 'AGENTS reviewed result missing');
expect(roadmap.includes('Status: PR #509 Terminal Date Boundary Review — Batch 1 under review; exit boundary REVIEW GATE'), 'roadmap status missing');
expect(governance.includes('PR #509 Terminal Date Boundary Review — Batch 1 implementation under review'), 'governance current item missing');
expect(spec.includes('Status: implementation reviewed; pending merge and production verification'), 'work-item spec status missing');
expect(active === "import './validate-terminal-date-boundary-review-pr509.mjs';", 'active workstream is not wired to PR #509');
for (const temp of [
  '.github/workflows/pr509-terminal-date-review-finalize.yml',
  'scripts/extract-pr509-terminal-review-source.py'
]) expect(!fs.existsSync(path.join(root, temp)), `temporary file remains: ${temp}`);

if (failures.length) {
  console.error('PR #509 Terminal Date Boundary Review failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  authority_pr: 508,
  implementation_pr: 509,
  targets,
  exact_terminal_day_resolved: 0,
  reviewed_null_preserved: 3,
  evidence_identity_changes: 0,
  canonical_counts_preserved: true,
  legacy_redirect_changes: 0,
  next_boundary: 'REVIEW_GATE'
}, null, 2));
