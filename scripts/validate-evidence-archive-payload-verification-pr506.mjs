import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const authority = readJson('config/evidence-archive-payload-verification-batch-1.json');
const decisions = readJson('config/evidence-archive-payload-verification-batch-1-pr506-decisions.json');
const review = readJson('data/editorial-research/evidence-archive-payload-verification-batch-1-pr506-source-review.json');
const outcomes = readJson('docs/migration/evidence-archive-payload-verification-batch-1-pr506-outcomes.json');
const handoff = readJson('docs/migration/evidence-archive-payload-verification-batch-1-pr506-handoff.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const reviewCheckpoint = readJson('docs/migration/current-review-checkpoint.json');
const statsCheckpoint = readJson('docs/migration/current-stats-history-checkpoint.json');
const release = readJson('docs/migration/registry-release-integrity-baseline.json');
const history = readJson('data/stats-history.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const evidenceRows = [];
for (const name of fs.readdirSync(path.join(root, 'data')).filter((name) => /^evidence.*\.json$/.test(name)).sort()) {
  const value = readJson(path.join('data', name));
  if (Array.isArray(value)) evidenceRows.push(...value);
}
const byId = new Map(evidenceRows.map((row) => [row.id, row]));
const accepted = decisions.decisions.filter((row) => row.outcome === 'dated_exact_archive_added');
const noSafe = decisions.decisions.filter((row) => row.outcome === 'reviewed_no_safe_change');
const archived = evidenceRows.filter((row) => String(row.archived_url ?? '').trim()).length;
const missing = evidenceRows.length - archived;
const currentSnapshot = history.snapshots?.find((row) => row.checkpoint_id === statsCheckpoint.checkpoint_id);

expect(authority.authority_pr === 505 && authority.implementation_pr === 506, 'authority PR sequence changed');
expect(decisions.status === 'reviewed_complete' && decisions.target_count === 10, 'decision status or target count changed');
expect(JSON.stringify(decisions.decisions.map((row) => row.evidence_id)) === JSON.stringify(authority.target_evidence_ids), 'decision target set changed');
expect(accepted.length === 7 && noSafe.length === 3, 'review outcome counts changed');
expect(evidenceRows.length === 579, `Evidence count is ${evidenceRows.length}, expected 579`);
expect(archived === 457 && missing === 122, `archive partition is ${archived}/${missing}, expected 457/122`);
for (const decision of decisions.decisions) {
  const row = byId.get(decision.evidence_id);
  expect(Boolean(row), `${decision.evidence_id}: canonical Evidence row missing`);
  if (!row) continue;
  expect(row.url === decision.canonical_url, `${decision.evidence_id}: source URL changed`);
  if (decision.outcome === 'dated_exact_archive_added') {
    expect(row.archived_url === decision.archived_url, `${decision.evidence_id}: accepted archive missing`);
    expect(decision.fetch_status === 200 && decision.payload_bytes > 0, `${decision.evidence_id}: payload acceptance incomplete`);
    expect(/^https:\/\/web\.archive\.org\/web\/\d{14}\//.test(decision.archived_url), `${decision.evidence_id}: archive URL is not timestamped`);
  } else {
    expect(!String(row.archived_url ?? '').trim(), `${decision.evidence_id}: no-safe-change target gained archive`);
  }
}
expect(review.review_id === 'sog_evidence_archive_payload_verification_batch_1_pr506_source_review_2026_08_01', 'source review ID changed');
expect(review.dated_exact_archive_added_count === 7 && review.reviewed_no_safe_change_count === 3, 'source review counts changed');
expect(outcomes.changed_count === 7 && outcomes.archive_index_count_after === 457 && outcomes.archive_not_recorded_count_after === 122, 'outcome partition changed');
expect(handoff.status === 'reviewed_complete_pending_merge_and_production', 'handoff status changed');
expect(handoff.evidence_quality.archive_recorded === 457 && handoff.evidence_quality.archive_not_recorded === 122, 'handoff partition changed');
expect(checkpoint.checkpoint_id === 'sog_pr506_evidence_archive_payload_verification_117_2026_08_01', 'canonical checkpoint ID changed');
expect(checkpoint.status === 'reviewed_non_growth_maintenance_checkpoint', 'canonical checkpoint status changed');
expect(checkpoint.checkpoint_kind === 'non_growth_maintenance_checkpoint', 'canonical checkpoint kind changed');
expect(checkpoint.counts.assets === 117 && checkpoint.counts.organizations === 108 && checkpoint.counts.relationships === 129, 'identity counts changed');
expect(checkpoint.counts.events === 192 && checkpoint.counts.evidence === 579 && checkpoint.counts.evidence_relations === 579, 'event or Evidence counts changed');
expect(checkpoint.counts.deployments === 184 && checkpoint.counts.market_access_records === 8, 'deployment or Market Access counts changed');
expect(checkpoint.counts.archive_index_count === 457 && checkpoint.counts.archive_not_recorded_count === 122, 'checkpoint count partition changed');
expect(checkpoint.evidence_quality.archive_index_count === 457 && checkpoint.evidence_quality.archive_not_recorded_count === 122, 'checkpoint quality partition changed');
expect(reviewCheckpoint.source_canonical_checkpoint_id === checkpoint.checkpoint_id, 'review checkpoint canonical lineage changed');
expect(reviewCheckpoint.canonical_counts_unchanged === true, 'review checkpoint no longer preserves canonical counts');
expect(statsCheckpoint.checkpoint_id === 'sog_stats_pr506_evidence_archive_payload_verification_2026_08_01', 'stats checkpoint ID changed');
expect(statsCheckpoint.status === 'reviewed_non_growth_maintenance_checkpoint', 'stats checkpoint status changed');
expect(statsCheckpoint.checkpoint_kind === 'non_growth_maintenance_checkpoint', 'stats checkpoint kind changed');
expect(statsCheckpoint.canonical_checkpoint_id === checkpoint.checkpoint_id, 'stats checkpoint canonical lineage changed');
expect(Boolean(currentSnapshot), 'immutable statistics snapshot missing');
if (currentSnapshot) {
  expect(currentSnapshot.checkpoint_kind === 'non_growth_maintenance_checkpoint', 'immutable snapshot checkpoint kind changed');
  expect(currentSnapshot.source_checkpoint_id === statsCheckpoint.source_checkpoint_id, 'immutable snapshot source lineage changed');
  expect(/^[a-f0-9]{64}$/.test(currentSnapshot.snapshot_sha256 ?? ''), 'immutable snapshot digest invalid');
}
expect(release.baseline_id === 'sog_release_integrity_pr506_117_assets_2026_08_01', 'release baseline ID changed');
expect(release.evidence_quality.archive_index_count === 457 && release.evidence_quality.archive_not_recorded_count === 122, 'release partition changed');
expect(agents.includes('Archive recorded: 457') && agents.includes('Archive not recorded: 122'), 'AGENTS current archive counts missing');
expect(agents.includes('PR #506 Evidence Archive Payload Verification — Batch 1: implementation under review'), 'AGENTS workstream missing');
expect(roadmap.includes('Status: PR #506 Evidence Archive Payload Verification — Batch 1 under review; exit boundary REVIEW GATE'), 'roadmap status missing');
expect(governance.includes('PR #506 Evidence Archive Payload Verification — Batch 1 implementation under review'), 'governance current item missing');
expect(active === "import './validate-evidence-archive-payload-verification-pr506.mjs';", 'active workstream is not wired to PR #506');
for (const temp of [
  '.github/workflows/pr506-wayback-payload-probe.yml',
  '.github/workflows/pr506-stats-history-repair.yml',
  'scripts/probe-evidence-archive-payloads-pr506.py',
  'scripts/retry-pr506-wayback-gaps.py',
  'scripts/finalize-pr506-evidence-archive-payload.mjs'
]) expect(!fs.existsSync(path.join(root, temp)), `temporary file remains: ${temp}`);

if (failures.length) {
  console.error('PR #506 Evidence Archive Payload Verification failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  authority_pr: 505,
  implementation_pr: 506,
  target_count: 10,
  dated_exact_archive_added: 7,
  reviewed_no_safe_change: 3,
  evidence: 579,
  evidence_relations: 579,
  archive_recorded: 457,
  archive_not_recorded: 122,
  canonical_checkpoint_kind: checkpoint.checkpoint_kind,
  stats_checkpoint_kind: statsCheckpoint.checkpoint_kind,
  stats_snapshot_sha256: currentSnapshot?.snapshot_sha256,
  next_boundary: 'REVIEW_GATE'
}, null, 2));
