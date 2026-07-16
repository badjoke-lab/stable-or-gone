import fs from 'node:fs';

const config = JSON.parse(fs.readFileSync('config/evidence-archive-maintenance-queue-v6-pr398.json', 'utf8'));
const queue = JSON.parse(fs.readFileSync('docs/migration/evidence-archive-maintenance-queue-v6-pr398.json', 'utf8'));
const delta = JSON.parse(fs.readFileSync('docs/migration/evidence-archive-maintenance-queue-v6-pr398-delta.json', 'utf8'));
const expected = config.expected_output;
const selectedIds = queue.selected_candidates.map((row) => row.evidence_id);
const failures = [];
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(same(selectedIds, expected.selected_evidence_ids), 'selected Evidence IDs differ from contract');
expect(same(delta.current_selected_evidence_ids, expected.selected_evidence_ids), 'delta selected Evidence IDs differ from contract');
expect(delta.added_evidence_ids.length === expected.added_vs_queue_v5, 'added count differs from contract');
expect(delta.removed_evidence_ids.length === expected.removed_vs_queue_v5, 'removed count differs from contract');
expect(delta.retained_evidence_ids.length === expected.retained_vs_queue_v5, 'retained count differs from contract');
expect(delta.exclusion_counts.alias_identity === expected.alias_identity_excluded_count, 'alias exclusion count differs from contract');
expect(delta.exclusion_counts.reviewed_suppressed_without_signal === expected.reviewed_suppressed_excluded_count, 'reviewed suppression exclusion count differs from contract');
expect(queue.selected_candidates.every((row) => row.priority_rank === 2 && row.priority_bucket === 'official_issuer_protocol_product'), 'selected priority bucket changed');

if (failures.length) {
  console.error('PR #398 Queue v6 selection validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  selected_evidence_ids: selectedIds,
  added: delta.added_evidence_ids.length,
  removed: delta.removed_evidence_ids.length,
  retained: delta.retained_evidence_ids.length,
  alias_excluded: delta.exclusion_counts.alias_identity,
  reviewed_suppressed_excluded: delta.exclusion_counts.reviewed_suppressed_without_signal
}, null, 2));
