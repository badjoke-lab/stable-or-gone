import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { buildEvidenceArchiveMaintenanceBatch3Outputs } from './build-evidence-archive-maintenance-batch-3-pr380.mjs';

const root = process.cwd();
const baseRef = process.env.SOG_PR380_BASE_REF ?? 'origin/main';
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const readBaseJson = (file) => JSON.parse(git('show', `${baseRef}:${file}`));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const same = (left, right) => isDeepStrictEqual(left, right);

const config = readJson('config/evidence-archive-maintenance-batch-3-pr380.json');
const decisionsFile = readJson('config/evidence-archive-maintenance-batch-3-pr380-decisions.json');
const sourceQueue = readJson('docs/migration/evidence-archive-maintenance-queue-v2-pr378.json');
const reviewQueue = readJson('docs/migration/evidence-archive-maintenance-batch-3-pr380-review-queue.json');
const outcomes = readJson('docs/migration/evidence-archive-maintenance-outcomes-pr380.json');
const handoff = readJson('docs/migration/evidence-archive-maintenance-batch-3-pr380-reviewed-handoff.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const statsCheckpoint = readJson('docs/migration/current-stats-history-checkpoint.json');
const statsHistory = readJson('data/stats-history.json');
const releaseBaseline = readJson('docs/migration/registry-release-integrity-baseline.json');
const generated = buildEvidenceArchiveMaintenanceBatch3Outputs();

expect(config.review_pr === 380, 'config review PR changed');
expect(decisionsFile.review_pr === 380, 'decision review PR changed');
expect(sourceQueue.selected_count === 10, 'source queue selected count changed');
expect(JSON.stringify(config.selected_evidence_ids) === JSON.stringify(sourceQueue.selected_candidates.map((row) => row.evidence_id)), 'selected Evidence scope differs from PR #378 queue');
expect(JSON.stringify(decisionsFile.decisions.map((row) => row.evidence_id)) === JSON.stringify(config.selected_evidence_ids), 'decision identity/order changed');
expect(new Set(config.selected_evidence_ids).size === 10, 'selected Evidence IDs are not unique');

expect(reviewQueue.status === 'reviewed_complete', 'review queue is not reviewed complete');
expect(reviewQueue.selected_count === 10 && reviewQueue.rows.length === 10, 'review queue count changed');
expect(reviewQueue.rows.every((row) => row.review_status === 'reviewed_complete'), 'review queue contains an unreviewed row');
expect(reviewQueue.outcome_counts?.dated_exact_archive_added === 9, 'review queue dated archive count changed');
expect(reviewQueue.outcome_counts?.reviewed_source_replacement === 1, 'review queue source replacement count changed');
expect(reviewQueue.outcome_counts?.reviewed_no_safe_change === 0, 'review queue no-safe count changed');

const probeById = new Map(reviewQueue.rows.map((row) => [row.evidence_id, row]));
for (const decision of decisionsFile.decisions) {
  const probe = probeById.get(decision.evidence_id);
  expect(Boolean(probe), `${decision.evidence_id}: missing reviewed probe row`);
  expect(probe?.proposed_outcome === decision.outcome, `${decision.evidence_id}: reviewed outcome differs from decision`);
  if (decision.outcome === 'dated_exact_archive_added') {
    const captures = [probe?.exact_cdx_probe?.earliest_capture, probe?.exact_cdx_probe?.latest_capture, ...(probe?.exact_cdx_probe?.sampled_captures ?? [])].filter(Boolean);
    const accepted = captures.find((row) => row.timestamp === decision.capture_timestamp && row.digest === decision.capture_digest);
    expect(Boolean(accepted), `${decision.evidence_id}: accepted capture absent from exact CDX probe`);
    expect(accepted?.statuscode === '200', `${decision.evidence_id}: accepted capture status is not 200`);
    expect(accepted?.original === decision.canonical_url, `${decision.evidence_id}: accepted capture is not exact-source`);
    expect(decision.archived_url === `https://web.archive.org/web/${decision.capture_timestamp}/${decision.canonical_url}`, `${decision.evidence_id}: archived URL mismatch`);
    expect(!decision.archived_url.includes('/web/*/'), `${decision.evidence_id}: wildcard archive accepted`);
    expect(probe?.accepted_archived_url === decision.archived_url, `${decision.evidence_id}: reviewed queue archived URL mismatch`);
    expect(probe?.accepted_capture_digest === decision.capture_digest, `${decision.evidence_id}: reviewed queue digest mismatch`);
  }
  if (decision.outcome === 'reviewed_source_replacement') {
    expect(decision.evidence_id === 'sog_src_eurc_mint_page', 'unexpected source replacement identity');
    expect(decision.canonical_url === 'https://www.circle.com/mint', 'Circle Mint previous URL changed');
    expect(decision.replacement_url === 'https://www.circle.com/circle-mint', 'Circle Mint replacement URL changed');
    expect(probe?.live_probe?.ok === true && probe?.live_probe?.redirected === true, 'Circle Mint replacement is not a reviewed successful redirect');
    expect(probe?.live_probe?.final_url === decision.replacement_url, 'Circle Mint redirect target mismatch');
    expect(probe?.exact_cdx_probe?.capture_count === 0, 'Circle Mint old route unexpectedly has an accepted exact capture');
    expect(probe?.accepted_replacement_url === decision.replacement_url, 'reviewed queue replacement mismatch');
  }
}

expect(outcomes.status === 'reviewed_bounded_maintenance', 'outcome status changed');
expect(outcomes.selected_count === 10, 'outcome selected count changed');
expect(outcomes.changed_count === 10, 'outcome changed count changed');
expect(outcomes.dated_archive_added_count === 9, 'outcome archive-add count changed');
expect(outcomes.reviewed_source_replacement_count === 1, 'outcome replacement count changed');
expect(outcomes.reviewed_no_safe_change_count === 0, 'outcome no-safe count changed');
expect(outcomes.canonical_evidence_count_after === 559, 'canonical Evidence count changed');
expect(outcomes.evidence_relation_count_after === 559, 'Evidence Relation count changed');
expect(outcomes.archive_index_count_before === 390 && outcomes.archive_index_count_after === 399, 'archive recorded transition changed');
expect(outcomes.archive_not_recorded_count_before === 169 && outcomes.archive_not_recorded_count_after === 160, 'archive not-recorded transition changed');
expect(JSON.stringify(outcomes.changed_files) === JSON.stringify(['data/evidence-batch-c.json', 'data/evidence-events-pr038.json', 'data/evidence-extra.json', 'data/evidence.json']), 'changed canonical Evidence files changed');

const selectedSet = new Set(config.selected_evidence_ids);
const decisionById = new Map(decisionsFile.decisions.map((row) => [row.evidence_id, row]));
for (const file of outcomes.changed_files) {
  const before = readBaseJson(file);
  const after = readJson(file);
  expect(before.length === after.length, `${file}: Evidence row count changed`);
  const beforeById = new Map(before.map((row) => [row.id, row]));
  const afterById = new Map(after.map((row) => [row.id, row]));
  expect(beforeById.size === afterById.size, `${file}: Evidence identity count changed`);
  for (const [id, beforeRow] of beforeById) {
    const afterRow = afterById.get(id);
    expect(Boolean(afterRow), `${file}: Evidence identity removed ${id}`);
    if (!selectedSet.has(id)) {
      expect(same(afterRow, beforeRow), `${file}: unselected Evidence row changed ${id}`);
      continue;
    }
    const decision = decisionById.get(id);
    const expected = decision.outcome === 'dated_exact_archive_added'
      ? { ...beforeRow, archived_url: decision.archived_url }
      : decision.outcome === 'reviewed_source_replacement'
        ? { ...beforeRow, url: decision.replacement_url }
        : beforeRow;
    expect(same(afterRow, expected), `${file}: selected Evidence row has an unauthorized field change ${id}`);
  }
}

expect(checkpoint.checkpoint_id === 'sog_evidence_archive_maintenance_batch_3_canonical_112_checkpoint_pr380_2026_07_16', 'canonical checkpoint ID changed');
expect(checkpoint.source_checkpoint_id === 'sog_evidence_archive_maintenance_batch_2_canonical_112_checkpoint_pr365_2026_07_14', 'canonical source checkpoint changed');
expect(checkpoint.expected_counts.assets === 112 && checkpoint.expected_counts.evidence === 559, 'canonical checkpoint counts changed');
expect(checkpoint.evidence_quality.archive_index_count === 399, 'checkpoint archive recorded changed');
expect(checkpoint.evidence_quality.archive_not_recorded_count === 160, 'checkpoint archive not-recorded changed');
expect(checkpoint.evidence_quality.canonical_changes === 10, 'checkpoint canonical change count changed');
expect(checkpoint.evidence_quality.reviewed_no_safe_change === 0, 'checkpoint no-safe count changed');

expect(statsCheckpoint.checkpoint_id === 'sog_evidence_archive_maintenance_batch_3_112_checkpoint_pr380_2026_07_16', 'stats checkpoint ID changed');
expect(statsCheckpoint.source_checkpoint_id === 'sog_evidence_archive_maintenance_batch_2_112_checkpoint_pr365_2026_07_14', 'stats source checkpoint changed');
expect(statsCheckpoint.canonical_checkpoint_id === checkpoint.checkpoint_id, 'stats/canonical checkpoint link changed');
const baseHistory = readBaseJson('data/stats-history.json');
expect(statsHistory.snapshots.length === baseHistory.snapshots.length + 1, 'stats history must append exactly one snapshot');
expect(baseHistory.snapshots.every((row, index) => same(row, statsHistory.snapshots[index])), 'historical stats snapshot rewritten or reordered');
const currentSnapshot = statsHistory.snapshots.at(-1);
expect(currentSnapshot?.checkpoint_id === statsCheckpoint.checkpoint_id, 'current stats snapshot ID changed');
expect(currentSnapshot?.asset_count === 112 && currentSnapshot?.totals?.evidence === 559, 'current stats snapshot counts changed');
expect(currentSnapshot?.data_quality?.coverage?.archive?.count === 399 || currentSnapshot?.data_quality?.coverage?.archive_coverage?.count === 399, 'current stats archive coverage count is not 399');

expect(releaseBaseline.baseline_id === 'sog_release_integrity_pr380_112_assets_2026_07_16', 'release baseline ID changed');
expect(releaseBaseline.expected_v2_counts.evidence === 559, 'release baseline Evidence count changed');
expect(releaseBaseline.evidence_quality.archive_index_count === 399, 'release baseline archive recorded changed');
expect(releaseBaseline.evidence_quality.archive_not_recorded_count === 160, 'release baseline archive not-recorded changed');

expect(handoff.status === 'reviewed_complete', 'handoff status changed');
expect(handoff.canonical_counts.assets === 112, 'handoff asset count changed');
expect(handoff.canonical_counts.evidence === 559 && handoff.canonical_counts.evidence_relations === 559, 'handoff Evidence counts changed');
expect(handoff.evidence_quality.archive_recorded === 399 && handoff.evidence_quality.archive_not_recorded === 160, 'handoff archive boundary changed');
expect(handoff.evidence_quality.selected === 10 && handoff.evidence_quality.changed === 10, 'handoff review counts changed');
expect(handoff.evidence_quality.dated_archive_added === 9 && handoff.evidence_quality.reviewed_source_replacement === 1, 'handoff outcome distribution changed');
expect(handoff.next_work_item?.decision === 'review_gate_required', 'PR #380 must end at review gate');
expect(handoff.boundaries?.new_or_removed_evidence_identity === false, 'handoff Evidence identity boundary changed');
expect(handoff.boundaries?.evidence_relation_change === false, 'handoff Evidence Relation boundary changed');
expect(handoff.boundaries?.new_public_surface === false, 'handoff public boundary changed');

for (const [file, value] of Object.entries(generated.files)) {
  expect(same(readJson(file), value), `${file}: committed output is not deterministic`);
}

for (const file of [
  'docs/migration/post-pr378-review-gate-pr379.json',
  'docs/migration/evidence-archive-maintenance-queue-v2-pr378.json',
  'docs/migration/evidence-archive-maintenance-queue-v2-pr378-delta.json',
  'config/evidence-archive-review-history-v1-pr377.json',
  'docs/migration/evidence-archive-review-history-manifest-pr377.json',
  'docs/migration/evidence-archive-review-history-audit-pr377.json'
]) {
  expect(git('hash-object', file) === git('rev-parse', `${baseRef}:${file}`), `${file}: immutable reviewed input changed`);
}

for (const [file, markers] of [
  ['AGENTS.md', ['PR #380 Evidence and Archive Maintenance Batch 3: active; complete on merge', 'REVIEW GATE: mandatory after PR #380', 'sog_src_eurc_mint_page']],
  ['docs/roadmap.md', ['Status: canonical execution schedule — PR #380 active', 'dated_exact_archive_added', 'REVIEW GATE: mandatory after PR #380']],
  ['docs/quality/evidence-archive-maintenance-batch-3-pr380-spec.md', ['exactly the ten PR #378 Evidence identities', 'reviewed_source_replacement', 'final authority is `REVIEW GATE`']],
  ['docs/roadmap-amendments/2026-07-16-pr380-evidence-archive-maintenance-batch-3-activation.md', ['No Evidence identity may be substituted or added', 'reviewed_no_safe_change', 'stop at `REVIEW GATE`']]
]) {
  const value = readText(file);
  for (const marker of markers) expect(value.includes(marker), `${file}: missing authority marker ${marker}`);
}

for (const file of [
  'public/data/evidence-archive-maintenance-batch-3-pr380-review-queue.json',
  'public/data/evidence-archive-maintenance-outcomes-pr380.json',
  'public/data/evidence-archive-maintenance-batch-3-pr380-reviewed-handoff.json',
  'src/pages/evidence-archive-maintenance-batch-3.astro'
]) expect(!fs.existsSync(path.join(root, file)), `${file}: internal output leaked into public surface`);

if (failures.length) {
  console.error('PR #380 Evidence and Archive Maintenance Batch 3 validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  selected: outcomes.selected_count,
  changed: outcomes.changed_count,
  dated_archives_added: outcomes.dated_archive_added_count,
  source_replacements: outcomes.reviewed_source_replacement_count,
  reviewed_no_safe_change: outcomes.reviewed_no_safe_change_count,
  archive_recorded: handoff.evidence_quality.archive_recorded,
  archive_not_recorded: handoff.evidence_quality.archive_not_recorded,
  evidence: handoff.canonical_counts.evidence,
  evidence_relations: handoff.canonical_counts.evidence_relations,
  next_authority: handoff.next_work_item.decision
}, null, 2));
