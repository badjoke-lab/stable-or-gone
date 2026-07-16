import fs from 'node:fs';

const text = (file) => fs.readFileSync(file, 'utf8');
const json = (file) => JSON.parse(text(file));
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };
const markers = (body, list, label) => list.forEach((value) => check(body.includes(value), `${label}: missing ${value}`));

const historical = json('docs/migration/audited-100-asset-canonical-checkpoint.json');
const current = json('docs/migration/current-canonical-checkpoint.json');
const historyCheckpoint = json('docs/migration/current-stats-history-checkpoint.json');
const releaseBaseline = json('docs/migration/registry-release-integrity-baseline.json');
const reproducible = json('docs/migration/reproducible-build-output-baseline.json');
const history = json('data/stats-history.json');
const historicalReviewGate = json('docs/migration/post-pr360-review-gate-pr361.json');
const pr380Handoff = json('docs/migration/evidence-archive-maintenance-batch-3-pr380-reviewed-handoff.json');
const pr380Outcomes = json('docs/migration/evidence-archive-maintenance-outcomes-pr380.json');
const updates = json('data/registry-updates.json');
const readme = text('README.md');
const release = text('docs/releases/100-asset-checkpoint-2026-07-06.md');
const roadmap = text('docs/roadmap.md');
const agents = text('AGENTS.md');
const historyAmendment = text('docs/roadmap-amendments/2026-07-08-pr326-history-activation.md');
const depthAmendment = text('docs/roadmap-amendments/2026-07-10-pr353-record-depth-baseline-activation.md');

markers(readme, [
  'Canonical stable assets: 112',
  'PR #351 Monthly Maintenance Log: complete',
  'PR #352 post-351 authority reset: complete',
  'PR #354 Tier A Dossier Deepening — Batch 1: complete',
  'PR #355 Tier A Dossier Deepening — Batch 2: complete',
  'PR #356 Market Access Pilot 1: complete',
  'PR #357 Tier A Dossier Deepening — Batch 3: complete',
  'PR #358 Record Growth Batch 1: complete',
  'PR #359 Market Access Pilot 2: complete',
  'PR #360 Evidence and Correction Batch: complete',
  'PR #361 Post-PR #360 Review Gate: complete',
  'PR #363 Record Depth and Coverage Baseline Refresh: complete',
  'StraitsX USD (XUSD)',
  'Blast USDB'
], 'README.md');

for (const body of [readme, release]) markers(body, [
  '/version.json',
  '/data/manifest.json',
  '/llms.txt',
  '/ai.txt',
  'canonical_only = true',
  'includes_unreviewed_candidates = false',
  'includes_internal_monitoring = false',
  'includes_private_notes = false'
], body === readme ? 'README.md' : 'historical release note');

markers(release, [
  'stable assets: 100',
  'organizations: 94',
  'relationships: 110',
  'events: 172',
  'evidence: 502',
  'known unknowns: 289',
  'deployments: 140',
  'legal profiles: 100',
  'reserve components: 133',
  'income profiles: 100',
  'detail routes: 366',
  historical.checkpoint_id,
  historical.source_commit,
  `canonical files: ${historical.canonical_file_count}`,
  historical.canonical_content_sha256,
  historical.canonical_identity_sha256,
  historical.release_integrity_baseline_id,
  historical.reproducible_build_baseline_id,
  historical.reproducibility_checkpoint.tree_sha256,
  `output files: ${historical.reproducibility_checkpoint.file_count}`,
  `total bytes: ${historical.reproducibility_checkpoint.total_bytes}`,
  'reproducible: true'
], 'historical release note');

check(historical.release_integrity_baseline_id === 'sog_release_integrity_pr316_2026_07_06', 'historical release-integrity baseline changed');
check(historical.reproducible_build_baseline_id === reproducible.baseline_id, 'historical reproducibility binding changed');

check(releaseBaseline.status === 'current', 'release baseline status');
check(releaseBaseline.baseline_id === 'sog_release_integrity_pr380_112_assets_2026_07_16', 'release baseline ID');
check(current.checkpoint_id === 'sog_evidence_archive_maintenance_batch_3_canonical_112_checkpoint_pr380_2026_07_16', 'current checkpoint ID');
check(current.asset_count === 112, 'current asset count');
check(current.expected_counts?.organizations === 107, 'current organization count');
check(current.expected_counts?.relationships === 124, 'current relationship count');
check(current.expected_counts?.events === 187, 'current event count');
check(current.expected_counts?.evidence === 559, 'current Evidence count');
check(current.expected_counts?.evidence_relations === 559, 'current Evidence Relation count');
check(current.expected_counts?.deployments === 174, 'current deployment count');
check(current.expected_counts?.market_access_records === 8, 'current Market Access count');
check(current.evidence_quality?.archive_index_count === 399, 'current archive count');
check(current.evidence_quality?.archive_not_recorded_count === 160, 'current no-archive count');

const expectedV2 = {
  stablecoins: 112,
  organizations: 107,
  relationships: 124,
  events: 187,
  evidence: 559,
  reserve_reports: 120,
  known_unknowns: 325,
  regulatory_notes: 9,
  deployments: 174,
  market_access_records: 8,
  legal_profiles: 112,
  reserve_components: 145,
  income_profiles: 112
};
for (const [key, value] of Object.entries(expectedV2)) check(releaseBaseline.expected_v2_counts?.[key] === value, `release baseline ${key} count`);
check(releaseBaseline.evidence_quality?.archive_index_count === 399, 'release archive count');
check(releaseBaseline.evidence_quality?.archive_not_recorded_count === 160, 'release no-archive count');

const first = history.snapshots?.[0];
const latest = history.snapshots?.at(-1);
check(first?.checkpoint_id === historical.checkpoint_id && first?.asset_count === 100, 'historical stats snapshot');
check(latest?.checkpoint_id === historyCheckpoint.checkpoint_id, 'latest history checkpoint');
check(latest?.canonical_checkpoint_id === current.checkpoint_id, 'latest canonical binding');
check(latest?.totals?.assets === 112, 'latest asset total');
check(latest?.totals?.evidence === 559, 'latest Evidence total');
check(latest?.totals?.deployments === 174, 'latest deployment total');
check(latest?.totals?.market_access_records === 8, 'latest Market Access total');
check(latest?.data_quality?.coverage?.archive_evidence?.count === 399, 'latest archive coverage');
check(historyCheckpoint.canonical_checkpoint_id === current.checkpoint_id, 'history/current binding');
check(historyCheckpoint.checkpoint_id === 'sog_evidence_archive_maintenance_batch_3_112_checkpoint_pr380_2026_07_16', 'current history checkpoint ID');

check(historicalReviewGate.status === 'deterministic_internal_review_gate' && historicalReviewGate.public_output === false, 'historical review gate identity');
check(historicalReviewGate.current_counts?.assets === 112 && historicalReviewGate.current_counts?.evidence === 557 && historicalReviewGate.current_counts?.market_access_records === 8, 'historical PR361 counts');
check(JSON.stringify(historicalReviewGate.approved_next_sequence?.map((row) => row.pr)) === JSON.stringify([363, 364, 365]), 'historical approved sequence');
check(historicalReviewGate.decisions?.market_access_pilot_3?.decision === 'not_approved', 'historical Market Access Pilot 3 boundary');
check(historicalReviewGate.decisions?.record_growth_batch_2?.decision === 'not_approved_in_next_sequence', 'historical Record Growth Batch 2 boundary');
check(historicalReviewGate.decisions?.new_public_surface?.decision === 'not_approved', 'historical public surface boundary');

check(pr380Handoff.status === 'reviewed_complete' && pr380Handoff.review_pr === 380, 'PR #380 handoff identity');
check(pr380Handoff.evidence_quality?.selected === 10 && pr380Handoff.evidence_quality?.changed === 10, 'PR #380 reviewed counts');
check(pr380Handoff.evidence_quality?.dated_archive_added === 9, 'PR #380 archive additions');
check(pr380Handoff.evidence_quality?.reviewed_source_replacement === 1, 'PR #380 source replacements');
check(pr380Handoff.evidence_quality?.reviewed_no_safe_change === 0, 'PR #380 no-safe count');
check(pr380Handoff.evidence_quality?.archive_recorded === 399 && pr380Handoff.evidence_quality?.archive_not_recorded === 160, 'PR #380 archive boundary');
check(pr380Handoff.canonical_counts?.evidence === 559 && pr380Handoff.canonical_counts?.evidence_relations === 559, 'PR #380 Evidence identity/relation boundary');
check(pr380Handoff.next_work_item?.decision === 'review_gate_required', 'PR #380 review-gate boundary');
check(pr380Outcomes.selected_count === 10 && pr380Outcomes.changed_count === 10, 'PR #380 outcome counts');
check(pr380Outcomes.archive_index_count_after === 399 && pr380Outcomes.archive_not_recorded_count_after === 160, 'PR #380 outcome archive transition');

const update = updates.filter((row) => row.id === 'sog_update_2026_07_06_audited_100_asset_checkpoint');
check(update.length === 1 && update[0].date === '2026-07-06' && update[0].category === 'data', 'historical update row');
['/stablecoins/', '/issuers/', '/events/', '/methodology/', '/updates/', '/data/manifest.json', '/version.json'].forEach((route) => check(update[0]?.related_paths?.includes(route), `historical update route ${route}`));
markers(historyAmendment, ['PR #325 deterministic statistics generator and validator: complete', 'PR #326 immutable checkpoint history: active', 'PR #327 /stats/ foundation: next'], 'historical PR326 amendment');
markers(depthAmendment, ['PR #353 Record Depth & Coverage Baseline: active', 'PR #354 Tier A Dossier Deepening — Batch 1: next', 'Queue order must be deterministic and non-ranking.'], 'historical PR353 amendment');

markers(roadmap, [
  'Canonical stable assets: 112',
  'PR #363 Record Depth and Coverage Baseline Refresh: complete',
  'PR #364 Tier A Dossier Deepening Batch 4: complete',
  'PR #365 Evidence and Archive Maintenance Batch 2: complete',
  'PR #380 Evidence and Archive Maintenance Batch 3: reviewed complete; complete on merge',
  '112 stable assets',
  '559 Evidence records',
  '174 deployments',
  '399 archive indexes are recorded',
  '160 archive indexes are not recorded',
  'Current authority: REVIEW GATE',
  'Next work item: none pre-authorized'
], 'current roadmap');
markers(agents, [
  'Archive recorded: 399',
  'Archive not recorded: 160',
  'PR #380 Evidence and Archive Maintenance Batch 3: reviewed complete; complete on merge',
  'Current authority: REVIEW GATE',
  'Next work item: none pre-authorized'
], 'AGENTS.md');

if (failures.length) {
  console.error('Non-UI release material validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  historical_checkpoint_id: historical.checkpoint_id,
  current_checkpoint_id: current.checkpoint_id,
  current_history_checkpoint_id: historyCheckpoint.checkpoint_id,
  current_stable_assets: 112,
  current_evidence: 559,
  current_archive_indexes: 399,
  current_archive_not_recorded: 160,
  current_deployments: 174,
  current_market_access_records: 8,
  current_release_integrity_baseline_id: releaseBaseline.baseline_id,
  completed_workstream: 'pr380_evidence_archive_maintenance_batch_3',
  active_workstream: 'review_gate',
  next_workstream: 'none_pre_authorized'
}, null, 2));
