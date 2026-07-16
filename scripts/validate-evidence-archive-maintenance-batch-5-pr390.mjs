import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildEvidenceArchiveMaintenanceBatch5Outputs } from './build-evidence-archive-maintenance-batch-5-pr390.mjs';

const root = process.cwd();
const baseRef = process.env.SOG_PR390_BASE_REF ?? 'origin/main';
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const config = readJson('config/evidence-archive-maintenance-batch-5-pr390.json');
const decisionsFile = readJson('config/evidence-archive-maintenance-batch-5-pr390-decisions.json');
const sourceQueue = readJson('docs/migration/evidence-archive-maintenance-queue-v4-pr388.json');
const authority = readJson('docs/migration/post-pr388-review-gate-pr389.json');
const reviewQueue = readJson('docs/migration/evidence-archive-maintenance-batch-5-pr390-review-queue.json');
const outcomes = readJson('docs/migration/evidence-archive-maintenance-outcomes-pr390.json');
const handoff = readJson('docs/migration/evidence-archive-maintenance-batch-5-pr390-reviewed-handoff.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const statsCheckpoint = readJson('docs/migration/current-stats-history-checkpoint.json');
const releaseBaseline = readJson('docs/migration/registry-release-integrity-baseline.json');
const result = buildEvidenceArchiveMaintenanceBatch5Outputs();

for (const [file, value] of Object.entries(result.files)) {
  expect(readText(file) === serialize(value), `${file}: generated output is not reproducible`);
}

const selected = config.selected_evidence_ids;
const decisions = decisionsFile.decisions;
const changedIds = decisions.filter((row) => row.outcome !== 'reviewed_no_safe_change').map((row) => row.evidence_id);
const archiveIds = decisions.filter((row) => row.outcome === 'dated_exact_archive_added').map((row) => row.evidence_id);
const replacementIds = decisions.filter((row) => row.outcome === 'reviewed_source_replacement').map((row) => row.evidence_id);
const noSafeIds = decisions.filter((row) => row.outcome === 'reviewed_no_safe_change').map((row) => row.evidence_id);

expect(config.review_pr === 390, 'config review PR changed');
expect(authority.decisions?.evidence_archive_maintenance_batch_5?.pr === 390, 'PR #389 authority changed');
expect(authority.decisions?.evidence_archive_maintenance_batch_5?.decision === 'approved_bounded', 'PR #389 Batch 5 decision changed');
expect(same(sourceQueue.selected_candidates.map((row) => row.evidence_id), selected), 'Queue v4 selected IDs differ from config');
expect(same(authority.decisions.evidence_archive_maintenance_batch_5.selected_evidence_ids, selected), 'authority selected IDs differ from config');
expect(decisions.length === 10 && reviewQueue.rows.length === 10, 'reviewed identity count changed');
expect(new Set(decisions.map((row) => row.evidence_id)).size === 10, 'review decisions are not unique');
expect(same(decisions.map((row) => row.evidence_id), selected), 'review decision order changed');
expect(decisions.every((row) => row.outcome === 'dated_exact_archive_added'), 'Batch 5 decisions must all be dated exact archives');
expect(reviewQueue.status === 'reviewed_complete', 'review queue is not complete');
expect(reviewQueue.rows.every((row) => row.review_status === 'reviewed_complete'), 'review queue contains pending rows');
expect(reviewQueue.outcome_counts.dated_exact_archive_added === 10, 'dated archive count changed');
expect(reviewQueue.outcome_counts.reviewed_source_replacement === 0, 'source replacement count changed');
expect(reviewQueue.outcome_counts.reviewed_no_safe_change === 0, 'no-safe-change count changed');

expect(outcomes.selected_count === 10, 'outcome selected count changed');
expect(outcomes.changed_count === 10, 'outcome changed count changed');
expect(outcomes.dated_archive_added_count === 10, 'outcome archive count changed');
expect(outcomes.reviewed_source_replacement_count === 0, 'outcome replacement count changed');
expect(outcomes.reviewed_no_safe_change_count === 0, 'outcome no-safe count changed');
expect(outcomes.canonical_evidence_count_after === 559, 'canonical Evidence count changed');
expect(outcomes.evidence_relation_count_after === 559, 'Evidence Relation count changed');
expect(outcomes.archive_index_count_before === 406 && outcomes.archive_index_count_after === 416, 'archive coverage transition changed');
expect(outcomes.archive_not_recorded_count_before === 153 && outcomes.archive_not_recorded_count_after === 143, 'archive gap transition changed');
expect(same(outcomes.outcomes.map((row) => row.evidence_id), selected), 'outcome identities changed');
expect(same([...outcomes.changed_files].sort(), ['data/evidence-batch-c.json', 'data/evidence-pr033.json', 'data/evidence.json']), 'canonical changed-file boundary changed');

expect(checkpoint.checkpoint_id === 'sog_evidence_archive_maintenance_batch_5_canonical_112_checkpoint_pr390_2026_07_16', 'canonical checkpoint ID changed');
expect(checkpoint.source_checkpoint_id === 'sog_evidence_archive_maintenance_batch_4_canonical_112_checkpoint_pr385_2026_07_16', 'canonical checkpoint ancestry changed');
expect(checkpoint.expected_counts.assets === 112 && checkpoint.expected_counts.evidence === 559, 'canonical counts changed');
expect(checkpoint.evidence_quality.archive_index_count === 416, 'checkpoint archive count changed');
expect(checkpoint.evidence_quality.archive_not_recorded_count === 143, 'checkpoint no-archive count changed');
expect(checkpoint.evidence_quality.selected_for_review === 10, 'checkpoint selected count changed');
expect(checkpoint.evidence_quality.canonical_changes === 10, 'checkpoint changed count changed');
expect(checkpoint.evidence_quality.reviewed_no_safe_change === 0, 'checkpoint no-safe count changed');
expect(same(checkpoint.maintenance_outcome.changed_evidence_ids, changedIds), 'checkpoint changed IDs changed');
expect(same(checkpoint.maintenance_outcome.dated_archive_added_evidence_ids, archiveIds), 'checkpoint archive IDs changed');
expect(same(checkpoint.maintenance_outcome.source_replacement_evidence_ids, replacementIds), 'checkpoint replacement IDs changed');
expect(same(checkpoint.maintenance_outcome.reviewed_no_safe_change_evidence_ids, noSafeIds), 'checkpoint no-safe IDs changed');

expect(statsCheckpoint.checkpoint_id === 'sog_evidence_archive_maintenance_batch_5_112_checkpoint_pr390_2026_07_16', 'stats checkpoint ID changed');
expect(statsCheckpoint.canonical_checkpoint_id === checkpoint.checkpoint_id, 'stats/canonical checkpoint binding changed');
expect(statsCheckpoint.maintenance_pr === 390, 'stats maintenance PR changed');
expect(releaseBaseline.baseline_id === 'sog_release_integrity_pr390_112_assets_2026_07_16', 'release baseline ID changed');
expect(releaseBaseline.expected_v2_counts.evidence === 559 && releaseBaseline.expected_v2_counts.evidence_relations === 559, 'release identity counts changed');
expect(releaseBaseline.evidence_quality.archive_index_count === 416, 'release archive count changed');
expect(releaseBaseline.evidence_quality.archive_not_recorded_count === 143, 'release no-archive count changed');
expect(releaseBaseline.evidence_quality.reviewed_no_safe_change_assets === 0, 'release no-safe count changed');

expect(handoff.status === 'reviewed_complete' && handoff.review_pr === 390, 'handoff status changed');
expect(handoff.canonical_counts.assets === 112, 'handoff asset count changed');
expect(handoff.canonical_counts.evidence === 559 && handoff.canonical_counts.evidence_relations === 559, 'handoff Evidence boundary changed');
expect(handoff.canonical_counts.deployments === 174 && handoff.canonical_counts.market_access_records === 8, 'handoff non-Evidence boundary changed');
expect(handoff.evidence_quality.archive_recorded === 416 && handoff.evidence_quality.archive_not_recorded === 143, 'handoff archive boundary changed');
expect(handoff.evidence_quality.selected === 10 && handoff.evidence_quality.changed === 10, 'handoff review boundary changed');
expect(handoff.evidence_quality.dated_archive_added === 10, 'handoff archive outcome count changed');
expect(handoff.evidence_quality.reviewed_source_replacement === 0, 'handoff replacement outcome count changed');
expect(handoff.evidence_quality.reviewed_no_safe_change === 0, 'handoff no-safe outcome count changed');
expect(same(handoff.changed_evidence_ids, changedIds), 'handoff changed IDs changed');
expect(handoff.next_work_item?.decision === 'review_gate_required', 'PR #390 must end at review gate');
expect(Object.values(handoff.boundaries).every((value) => value === false), 'handoff boundary changed');

let originMainAvailable = false;
try { git('rev-parse', '--verify', baseRef); originMainAvailable = true; } catch {}
if (originMainAvailable) {
  const decisionsById = new Map(decisions.map((row) => [row.evidence_id, row]));
  const sourceFiles = ['data/evidence-batch-c.json', 'data/evidence-pr033.json', 'data/evidence.json'];
  const seen = new Set();
  for (const file of sourceFiles) {
    const before = JSON.parse(git('show', `${baseRef}:${file}`));
    const after = readJson(file);
    expect(before.length === after.length, `${file}: Evidence array length changed`);
    const afterById = new Map(after.map((row) => [row.id, row]));
    for (const row of before) {
      const next = afterById.get(row.id);
      expect(Boolean(next), `${file}: Evidence identity removed ${row.id}`);
      const decision = decisionsById.get(row.id);
      if (!decision) {
        expect(same(row, next), `${file}: non-selected Evidence row changed ${row.id}`);
        continue;
      }
      seen.add(row.id);
      expect(next.url === row.url, `${row.id}: archive decision changed source URL`);
      expect(next.archived_url === decision.archived_url, `${row.id}: accepted archive not applied`);
      expect(same({ ...next, archived_url: row.archived_url ?? null }, { ...row, archived_url: row.archived_url ?? null }), `${row.id}: archive decision changed fields outside archived_url`);
    }
  }
  expect(same([...seen].sort(), [...selected].sort()), 'not every selected Evidence identity was found in canonical files');

  for (const file of [
    'docs/migration/evidence-archive-maintenance-queue-v4-pr388.json',
    'docs/migration/evidence-archive-maintenance-queue-v4-pr388-delta.json',
    'docs/migration/post-pr388-review-gate-pr389.json',
    'config/evidence-archive-review-history-v3-pr387.json',
    'docs/migration/evidence-archive-review-history-manifest-v3-pr387.json',
    'docs/migration/evidence-archive-review-history-audit-v3-pr387.json'
  ]) {
    expect(git('hash-object', file) === git('rev-parse', `${baseRef}:${file}`), `${file}: historical reviewed output changed`);
  }
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #390 Evidence and Archive Maintenance Batch 5: active; complete on merge', 'dated_exact_archive_added: 10', 'PR #390 must stop at `REVIEW GATE`']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #390 active', 'Archive recorded before PR #390: 406', 'Archive recorded after reviewed decisions: 416', 'After PR #390, stop at `REVIEW GATE`']],
  ['docs/quality/evidence-archive-maintenance-batch-5-pr390-spec.md', ['exact-source capture verification', 'ten dated exact archive additions', 'handoff ends at `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-16-pr390-evidence-archive-maintenance-batch-5-activation.md', ['exactly the ten identities', 'ten exact dated archives', 'stop at `REVIEW GATE`']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/evidence-archive-maintenance-outcomes-pr390.json',
  'public/data/evidence-archive-maintenance-batch-5-pr390-reviewed-handoff.json',
  'src/pages/evidence-archive-maintenance-batch-5-pr390.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);

if (failures.length) {
  console.error('PR #390 Evidence and Archive Maintenance Batch 5 validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  outcome_id: outcomes.outcome_id,
  selected: outcomes.selected_count,
  changed: outcomes.changed_count,
  dated_archives_added: outcomes.dated_archive_added_count,
  source_replacements: outcomes.reviewed_source_replacement_count,
  reviewed_no_safe_change: outcomes.reviewed_no_safe_change_count,
  archive_recorded: outcomes.archive_index_count_after,
  archive_not_recorded: outcomes.archive_not_recorded_count_after,
  evidence: handoff.canonical_counts.evidence,
  evidence_relations: handoff.canonical_counts.evidence_relations,
  next_authority: handoff.next_work_item.decision
}, null, 2));
