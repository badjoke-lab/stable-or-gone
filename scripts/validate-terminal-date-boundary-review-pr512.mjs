import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/terminal-date-boundary-review-batch-2.json');
const review = readJson('data/editorial-research/terminal-date-boundary-review-batch-2-pr512-source-review.json');
const queue = readJson('data/quality/terminal-date-unresolved.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const spec = readText('docs/quality/terminal-date-boundary-review-batch-2-spec.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();
const targets = ['sog_st_bac', 'sog_st_dsd'];
const productionCommit = 'd33eda34830905e0fc7301dd55e1efd167f47efa';
const productionHash = 'sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb';

expect(config.authority_pr === 511 && config.implementation_pr === 512, 'authority chain changed');
expect(config.target_count === 2 && config.next_boundary === 'REVIEW_GATE', 'authority limits changed');
expect(JSON.stringify(config.target_stablecoin_ids) === JSON.stringify(targets), 'authorized target set changed');
expect(config.explicitly_deferred?.stablecoin_id === 'sog_st_gyen' && config.explicitly_deferred?.not_before === '2026-11-12', 'GYEN deferment changed');
expect(review.status === 'reviewed_bounded_no_canonical_date_change', 'review status changed');
expect(review.target_count === 2 && review.exact_terminal_day_resolved_count === 0 && review.reviewed_null_preserved_count === 2, 'review outcomes changed');
expect(review.canonical_evidence_added_count === 0 && review.canonical_evidence_relation_added_count === 0, 'Evidence boundary changed');
expect(JSON.stringify(review.dispositions.map((d) => d.stablecoin_id)) === JSON.stringify(targets), 'review target set changed');
for (const disposition of review.dispositions) {
  expect(disposition.decision === 'reviewed_null_preserved', `decision changed: ${disposition.stablecoin_id}`);
  expect(disposition.canonical_terminal_date_before === null && disposition.canonical_terminal_date_after === null, `terminal null changed: ${disposition.stablecoin_id}`);
  expect(disposition.evidence_identity_changes === 0 && disposition.evidence_relation_changes === 0, `Evidence changes found: ${disposition.stablecoin_id}`);
  expect(Array.isArray(disposition.reviewed_primary_sources) && disposition.reviewed_primary_sources.length === 4, `primary-source set changed: ${disposition.stablecoin_id}`);
  expect(Array.isArray(disposition.rejected_shortcuts) && disposition.rejected_shortcuts.length >= 5, `rejected shortcuts missing: ${disposition.stablecoin_id}`);
}
expect(review.deferred_non_target?.stablecoin_id === 'sog_st_gyen' && review.deferred_non_target?.changed === false, 'GYEN changed');
expect(review.constraints?.asset_changes === 0 && review.constraints?.event_changes === 0, 'canonical entity changes found');
expect(review.constraints?.market_access_changes === 0 && review.constraints?.route_family_changes === 0, 'public-surface changes found');
expect(review.constraints?.legacy_redirect_changes === 0 && review.constraints?.automatic_continuation === false, 'exit boundary changed');

expect(queue.expected_total === 6 && queue.records.length === 6, 'terminal queue total changed');
const records = new Map(queue.records.map((record) => [record.stablecoin_id, record]));
for (const id of targets) {
  const record = records.get(id);
  expect(record?.review_outcome === 'reviewed_null_preserved', `queue outcome missing: ${id}`);
  expect(record?.canonical_terminal_date_before === null && record?.canonical_terminal_date_after === null, `queue terminal date changed: ${id}`);
  expect(record?.last_reviewed === '2026-08-02', `queue review date missing: ${id}`);
  expect(Array.isArray(record?.reviewed_primary_sources) && record.reviewed_primary_sources.length === 4, `queue sources missing: ${id}`);
}
expect(records.get('sog_st_bac')?.reason_code === 'official_continuation_without_shutdown_or_contract_end', 'BAC reason changed');
expect(records.get('sog_st_dsd')?.reason_code === 'v2_execution_without_shutdown_or_terminal_effect', 'DSD reason changed');
expect(records.get('sog_st_gyen')?.reason_code === 'redemption_period_still_open', 'GYEN queue changed');
expect(!('review_outcome' in records.get('sog_st_gyen')), 'GYEN was reviewed prematurely');

expect(checkpoint.counts.assets === 117 && checkpoint.counts.organizations === 108 && checkpoint.counts.relationships === 129, 'identity counts changed');
expect(checkpoint.counts.events === 192 && checkpoint.counts.evidence === 579 && checkpoint.counts.evidence_relations === 579, 'event or Evidence counts changed');
expect(checkpoint.counts.deployments === 184 && checkpoint.counts.market_access_records === 8, 'deployment or Market Access counts changed');
expect(checkpoint.counts.detail_routes === 417 && checkpoint.counts.metadata_checked_routes === 417, 'route counts changed');
expect(checkpoint.counts.archive_index_count === 457 && checkpoint.counts.archive_not_recorded_count === 122, 'archive partition changed');
expect(agents.includes('Current production checkpoint: ' + productionCommit), 'AGENTS production checkpoint missing');
expect(agents.includes('PR #512 Terminal Date Boundary Review — Batch 2: implementation under review'), 'AGENTS implementation state missing');
expect(roadmap.includes('Status: PR #512 Terminal Date Boundary Review — Batch 2 under review; exit boundary REVIEW GATE'), 'roadmap status missing');
expect(governance.includes('PR #512 Terminal Date Boundary Review — Batch 2 implementation under review'), 'governance state missing');
expect(spec.includes('exact terminal days resolved: 0') && spec.includes('reviewed null preserved: 2'), 'spec result missing');
expect(active === "import './validate-terminal-date-boundary-review-pr512.mjs';", 'active workstream is not wired to PR #512');
for (const temp of ['.github/workflows/pr512-terminal-date-review-finalize.yml', 'scripts/finalize-terminal-date-boundary-review-batch-2-pr512.py']) expect(!fs.existsSync(path.join(root, temp)), `temporary file remains: ${temp}`);

if (failures.length) {
  console.error('PR #512 terminal-date review validation failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  authority_pr: 511,
  implementation_pr: 512,
  targets,
  exact_terminal_day_resolved: 0,
  reviewed_null_preserved: 2,
  deferred_unchanged: 'sog_st_gyen',
  production_commit: productionCommit,
  production_hash: productionHash,
  canonical_counts_preserved: true,
  legacy_redirect_changes: 0,
  next_boundary: 'REVIEW_GATE'
}, null, 2));
