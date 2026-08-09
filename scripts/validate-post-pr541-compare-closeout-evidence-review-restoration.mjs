import fs from 'node:fs';
import path from 'node:path';
import './validate-evidence-archive-payload-verification-batch-2-review-authority.mjs';
import './validate-evidence-archive-payload-verification-batch-2-candidates.mjs';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const closeout = json('config/post-pr541-compare-closeout-evidence-review-restoration.json');
const checkpoint = json('docs/migration/current-canonical-checkpoint.json');
const authority = json('config/evidence-archive-payload-verification-batch-2-review-authority.json');
const candidates = json('data/editorial-research/evidence-archive-payload-verification-batch-2-candidates-2026-08-09.json');
const amendment = read('docs/roadmap-amendments/2026-08-10-post-pr541-compare-closeout-evidence-review-restoration.md');
const spec = read('docs/quality/post-pr541-compare-closeout-evidence-review-restoration-spec.md');
const agents = read('AGENTS.md');
const governance = read('docs/spec-governance.md');
const roadmap = read('docs/roadmap.md');
const deployment = read('docs/deployment-policy.md');
const active = read('scripts/validate-active-workstream.mjs').trim();

expect(closeout.status === 'compare_complete_evidence_review_restored', 'closeout status changed');
expect(closeout.entry_main_commit === '539a27fd5854a1c2544f4653a2161be36860a002', 'Compare implementation merge commit changed');
expect(closeout.compare_remediation.authority_pr === 540, 'Compare authority PR changed');
expect(closeout.compare_remediation.implementation_pr === 541, 'Compare implementation PR changed');
expect(closeout.compare_remediation.production_run === 31326135906, 'Compare production run changed');
expect(closeout.compare_remediation.production_result === 'success', 'Compare production result is not success');
expect(closeout.compare_remediation.visual_exact_head === 'bf27f4fe79ca19774ed92a4ff82854188c4edbe0', 'Compare visual exact head changed');
expect(closeout.compare_remediation.visual_run === 31325811381, 'Compare visual run changed');
expect(closeout.compare_remediation.visual_result === 'success', 'Compare visual result is not success');
expect(closeout.compare_remediation.visual_audit_ok === true, 'Compare visual audit not accepted');
expect(closeout.compare_remediation.zero_state_audit_ok === true, 'Compare zero-state audit not accepted');

const expected = closeout.canonical_checkpoint;
for (const [checkpointKey, expectedKey] of [
  ['assets', 'assets'],
  ['organizations', 'organizations'],
  ['relationships', 'relationships'],
  ['events', 'events'],
  ['evidence', 'evidence'],
  ['evidence_relations', 'evidence_relations'],
  ['reserve_reports', 'reserve_reports'],
  ['known_unknowns', 'known_unknowns'],
  ['regulatory_notes', 'regulatory_notes'],
  ['deployments', 'deployments'],
  ['legal_profiles', 'legal_profiles'],
  ['reserve_components', 'reserve_components'],
  ['income_profiles', 'income_profiles'],
  ['market_access_records', 'market_access_records'],
  ['archive_index_count', 'archive_recorded'],
  ['archive_not_recorded_count', 'archive_not_recorded'],
  ['detail_routes', 'detail_routes'],
  ['metadata_checked_routes', 'metadata_checked_routes']
]) {
  expect(checkpoint.counts[checkpointKey] === expected[expectedKey], `${checkpointKey} changed during Compare lane`);
}
expect(expected.canonical_hash === 'sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa', 'canonical hash baseline changed');
expect(expected.canonical_file_count === 466, 'canonical file count baseline changed');

expect(closeout.restored_lane.authority_id === authority.authority_id, 'restored Evidence authority id changed');
expect(closeout.restored_lane.name === authority.review_lane.name, 'restored lane name changed');
expect(closeout.restored_lane.stage === 'MANUAL_PAYLOAD_REVIEW', 'Evidence review stage not restored');
expect(closeout.restored_lane.candidate_count === 10, 'restored candidate count changed');
expect(closeout.restored_lane.draft_review_pr === 539, 'restored draft PR changed');
expect(closeout.restored_lane.canonical_archive_additions_authorized === 0, 'restored lane permits canonical archive additions');
expect(closeout.restored_lane.canonical_implementation_authority === 'REVIEW_GATE', 'canonical implementation boundary changed');
expect(candidates.selected_count === 10, 'candidate artifact no longer contains exactly ten candidates');
expect(candidates.next_boundary === 'MANUAL_PAYLOAD_REVIEW', 'candidate artifact boundary changed');
expect(candidates.canonical_change_authorized === false, 'candidate artifact authorizes canonical mutation');

for (const text of [agents, governance, roadmap]) {
  expect(text.includes('Evidence Archive Payload Verification Batch 2'), 'forward governance missing restored Evidence Archive lane');
  expect(text.includes('MANUAL_PAYLOAD_REVIEW'), 'forward governance missing MANUAL_PAYLOAD_REVIEW');
  expect(text.includes('PR #539'), 'forward governance missing PR #539');
  expect(text.includes('PR #541'), 'forward governance missing completed Compare PR #541');
}
expect(deployment.includes('Compare remediation is complete'), 'deployment policy does not close Compare remediation');
expect(deployment.includes('Evidence Archive Payload Verification Batch 2'), 'deployment policy does not restore Evidence Archive lane');
expect(amendment.includes('Production deploy run: 31326135906'), 'closeout amendment missing production run');
expect(amendment.includes('Visual acceptance run: 31325811381'), 'closeout amendment missing visual run');
expect(spec.includes('Any canonical archive promotion after manual review requires a separate reviewed and merged implementation authority'), 'restoration spec weakens implementation boundary');
expect(active === "import './validate-post-pr541-compare-closeout-evidence-review-restoration.mjs';", 'active validator is not wired to restoration closeout');

if (failures.length) {
  console.error('Post-PR #541 Compare closeout / Evidence review restoration validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Post-PR #541 Compare closeout / Evidence review restoration validation passed.');
