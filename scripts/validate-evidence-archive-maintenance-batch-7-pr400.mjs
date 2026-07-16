import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildEvidenceArchiveMaintenanceBatch7Outputs } from './build-evidence-archive-maintenance-batch-7-pr400.mjs';

const root = process.cwd();
const baseRef = process.env.SOG_PR400_BASE_REF ?? 'origin/main';
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);

const config = readJson('config/evidence-archive-maintenance-batch-7-pr400.json');
const decisionsFile = readJson('config/evidence-archive-maintenance-batch-7-pr400-decisions.json');
const sourceQueue = readJson('docs/migration/evidence-archive-maintenance-queue-v6-pr398.json');
const authority = readJson('docs/migration/post-pr398-review-gate-pr399.json');
const reviewQueue = readJson('docs/migration/evidence-archive-maintenance-batch-7-pr400-review-queue.json');
const outcomes = readJson('docs/migration/evidence-archive-maintenance-outcomes-pr400.json');
const handoff = readJson('docs/migration/evidence-archive-maintenance-batch-7-pr400-reviewed-handoff.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const statsCheckpoint = readJson('docs/migration/current-stats-history-checkpoint.json');
const releaseBaseline = readJson('docs/migration/registry-release-integrity-baseline.json');
const result = buildEvidenceArchiveMaintenanceBatch7Outputs();

for (const [file, value] of Object.entries(result.files)) {
  expect(readText(file) === serialize(value), `${file}: generated output is not reproducible`);
}

const selected = config.selected_evidence_ids;
const decisions = decisionsFile.decisions;
const changedIds = decisions.filter((row) => row.outcome !== 'reviewed_no_safe_change').map((row) => row.evidence_id);
const archiveIds = decisions.filter((row) => row.outcome === 'dated_exact_archive_added').map((row) => row.evidence_id);
const replacementIds = decisions.filter((row) => row.outcome === 'reviewed_source_replacement').map((row) => row.evidence_id);
const noSafeIds = decisions.filter((row) => row.outcome === 'reviewed_no_safe_change').map((row) => row.evidence_id);
const expectedArchiveIds = [
  'sog_src_nuon_overview_batch_b',
  'sog_src_paxg_launch_batch_b',
  'sog_src_pyusd_paxos_page',
  'sog_src_pyusd_paypal_official',
  'sog_src_rai_faq_batch_b'
];
const expectedNoSafeIds = [
  'sog_src_paxg_allocation_batch_b',
  'sog_src_paxg_pricing_batch_b',
  'sog_src_paxg_redemption_batch_b',
  'sog_src_paxos_busd_announcement',
  'sog_src_pyusd_paxos_official'
];

expect(config.review_pr === 400, 'config review PR changed');
expect(authority.decisions?.evidence_archive_maintenance_batch_7?.pr === 400, 'PR #399 authority changed');
expect(authority.decisions?.evidence_archive_maintenance_batch_7?.decision === 'approved_bounded_manual_review', 'PR #399 Batch 7 decision changed');
expect(same(sourceQueue.selected_candidates.map((row) => row.evidence_id), selected), 'Queue v6 selected IDs differ from config');
expect(same(authority.decisions.evidence_archive_maintenance_batch_7.selected_evidence_ids, selected), 'authority selected IDs differ from config');
expect(decisions.length === 10 && reviewQueue.rows.length === 10, 'reviewed identity count changed');
expect(new Set(decisions.map((row) => row.evidence_id)).size === 10, 'review decisions are not unique');
expect(same(decisions.map((row) => row.evidence_id), selected), 'review decision order changed');
expect(same(archiveIds, expectedArchiveIds), 'archive-added identities changed');
expect(replacementIds.length === 0, 'source replacement count changed');
expect(same(noSafeIds, expectedNoSafeIds), 'no-safe-change identities changed');
expect(reviewQueue.status === 'reviewed_complete', 'review queue is not complete');
expect(reviewQueue.rows.every((row) => row.review_status === 'reviewed_complete'), 'review queue contains pending rows');
expect(reviewQueue.outcome_counts.dated_exact_archive_added === 5, 'review queue archive count changed');
expect(reviewQueue.outcome_counts.reviewed_source_replacement === 0, 'review queue replacement count changed');
expect(reviewQueue.outcome_counts.reviewed_no_safe_change === 5, 'review queue no-safe count changed');

expect(outcomes.selected_count === 10 && outcomes.changed_count === 5, 'outcome selected/changed count changed');
expect(outcomes.dated_archive_added_count === 5, 'outcome archive count changed');
expect(outcomes.reviewed_source_replacement_count === 0, 'outcome replacement count changed');
expect(outcomes.reviewed_no_safe_change_count === 5, 'outcome no-safe count changed');
expect(outcomes.canonical_evidence_count_after === 559 && outcomes.evidence_relation_count_after === 559, 'canonical Evidence boundary changed');
expect(outcomes.archive_index_count_before === 425 && outcomes.archive_index_count_after === 430, 'archive coverage transition changed');
expect(outcomes.archive_not_recorded_count_before === 134 && outcomes.archive_not_recorded_count_after === 129, 'archive gap transition changed');
expect(same(outcomes.outcomes.map((row) => row.evidence_id), selected), 'outcome identities changed');
expect(same([...outcomes.changed_files].sort(), ['data/evidence-batch-b.json', 'data/evidence-pr033.json', 'data/evidence.json']), 'canonical changed-file boundary changed');

expect(checkpoint.checkpoint_id === 'sog_evidence_archive_maintenance_batch_7_canonical_112_checkpoint_pr400_2026_07_16', 'canonical checkpoint ID changed');
expect(checkpoint.source_checkpoint_id === 'sog_evidence_archive_maintenance_batch_6_canonical_112_checkpoint_pr395_2026_07_16', 'canonical checkpoint ancestry changed');
expect(checkpoint.expected_counts.assets === 112 && checkpoint.expected_counts.evidence === 559, 'canonical counts changed');
expect(checkpoint.evidence_quality.archive_index_count === 430, 'checkpoint archive count changed');
expect(checkpoint.evidence_quality.archive_not_recorded_count === 129, 'checkpoint no-archive count changed');
expect(checkpoint.evidence_quality.selected_for_review === 10 && checkpoint.evidence_quality.canonical_changes === 5, 'checkpoint review boundary changed');
expect(checkpoint.evidence_quality.reviewed_no_safe_change === 5, 'checkpoint no-safe count changed');
expect(same(checkpoint.maintenance_outcome.changed_evidence_ids, changedIds), 'checkpoint changed IDs changed');
expect(same(checkpoint.maintenance_outcome.dated_archive_added_evidence_ids, archiveIds), 'checkpoint archive IDs changed');
expect(same(checkpoint.maintenance_outcome.source_replacement_evidence_ids, replacementIds), 'checkpoint replacement IDs changed');
expect(same(checkpoint.maintenance_outcome.reviewed_no_safe_change_evidence_ids, noSafeIds), 'checkpoint no-safe IDs changed');

expect(statsCheckpoint.checkpoint_id === 'sog_evidence_archive_maintenance_batch_7_112_checkpoint_pr400_2026_07_16', 'stats checkpoint ID changed');
expect(statsCheckpoint.canonical_checkpoint_id === checkpoint.checkpoint_id && statsCheckpoint.maintenance_pr === 400, 'stats checkpoint binding changed');
expect(releaseBaseline.baseline_id === 'sog_release_integrity_pr400_112_assets_2026_07_16', 'release baseline ID changed');
expect(releaseBaseline.expected_v2_counts.evidence === 559 && releaseBaseline.expected_v2_counts.evidence_relations === 559, 'release identity counts changed');
expect(releaseBaseline.evidence_quality.archive_index_count === 430 && releaseBaseline.evidence_quality.archive_not_recorded_count === 129, 'release archive boundary changed');
expect(releaseBaseline.evidence_quality.reviewed_no_safe_change_assets === 5, 'release no-safe count changed');

expect(handoff.status === 'reviewed_complete' && handoff.review_pr === 400, 'handoff status changed');
expect(handoff.canonical_counts.assets === 112, 'handoff asset count changed');
expect(handoff.canonical_counts.evidence === 559 && handoff.canonical_counts.evidence_relations === 559, 'handoff Evidence boundary changed');
expect(handoff.canonical_counts.deployments === 174 && handoff.canonical_counts.market_access_records === 8, 'handoff non-Evidence boundary changed');
expect(handoff.evidence_quality.archive_recorded === 430 && handoff.evidence_quality.archive_not_recorded === 129, 'handoff archive boundary changed');
expect(handoff.evidence_quality.selected === 10 && handoff.evidence_quality.changed === 5, 'handoff review boundary changed');
expect(handoff.evidence_quality.dated_archive_added === 5 && handoff.evidence_quality.reviewed_source_replacement === 0 && handoff.evidence_quality.reviewed_no_safe_change === 5, 'handoff outcome mix changed');
expect(same(handoff.changed_evidence_ids, changedIds), 'handoff changed IDs changed');
expect(handoff.next_work_item?.decision === 'review_gate_required', 'PR #400 must end at review gate');
expect(Object.values(handoff.boundaries).every((value) => value === false), 'handoff boundary changed');

let originMainAvailable = false;
try { git('rev-parse', '--verify', baseRef); originMainAvailable = true; } catch {}
if (originMainAvailable) {
  const decisionsById = new Map(decisions.map((row) => [row.evidence_id, row]));
  const sourceFiles = ['data/evidence-batch-b.json', 'data/evidence-pr033.json', 'data/evidence.json'];
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
      if (decision.outcome === 'reviewed_no_safe_change') {
        expect(same(row, next), `${row.id}: no-safe-change row changed`);
      } else {
        expect(next.url === row.url, `${row.id}: archive decision changed source URL`);
        expect(next.archived_url === decision.archived_url, `${row.id}: accepted archive not applied`);
        expect(same({ ...next, archived_url: row.archived_url ?? null }, { ...row, archived_url: row.archived_url ?? null }), `${row.id}: changed fields outside archived_url`);
      }
    }
  }
  expect(same([...seen].sort(), [...selected].sort()), 'not every selected Evidence identity was found in canonical files');
  for (const file of [
    'docs/migration/evidence-archive-maintenance-queue-v6-pr398.json',
    'docs/migration/evidence-archive-maintenance-queue-v6-pr398-delta.json',
    'docs/migration/post-pr398-review-gate-pr399.json',
    'config/evidence-archive-review-history-v5-pr397.json',
    'docs/migration/evidence-archive-review-history-manifest-v5-pr397.json',
    'docs/migration/evidence-archive-review-history-audit-v5-pr397.json'
  ]) expect(git('hash-object', file) === git('rev-parse', `${baseRef}:${file}`), `${file}: historical reviewed output changed`);
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #400 Evidence and Archive Maintenance Batch 7: active; complete on merge', 'dated_exact_archive_added: 5', 'reviewed_no_safe_change: 5', 'PR #400 must stop at `REVIEW GATE`']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #400 active', 'Archive recorded after reviewed decisions: 430', 'Archive not recorded after reviewed decisions: 129', 'After PR #400, stop at `REVIEW GATE`']],
  ['docs/quality/evidence-archive-maintenance-batch-7-pr400-spec.md', ['five dated exact archive additions', 'five reviewed no-safe-change', 'PR #400 stops at `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-16-pr400-evidence-archive-maintenance-batch-7-activation.md', ['five exact dated archives', 'five reviewed no-safe-change', 'stop at `REVIEW GATE`']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/evidence-archive-maintenance-outcomes-pr400.json',
  'public/data/evidence-archive-maintenance-batch-7-pr400-reviewed-handoff.json',
  'src/pages/evidence-archive-maintenance-batch-7-pr400.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);

if (failures.length) {
  console.error('PR #400 Evidence and Archive Maintenance Batch 7 validation failed:');
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
