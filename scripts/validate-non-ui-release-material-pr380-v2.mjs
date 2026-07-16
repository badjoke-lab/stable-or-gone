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
const handoff = json('docs/migration/evidence-archive-maintenance-batch-3-pr380-reviewed-handoff.json');
const outcomes = json('docs/migration/evidence-archive-maintenance-outcomes-pr380.json');
const readme = text('README.md');
const historicalRelease = text('docs/releases/100-asset-checkpoint-2026-07-06.md');
const roadmap = text('docs/roadmap.md');
const agents = text('AGENTS.md');

markers(readme, ['Canonical stable assets: 112', 'PR #363 Record Depth and Coverage Baseline Refresh: complete', 'StraitsX USD (XUSD)', 'Blast USDB'], 'README.md');
for (const body of [readme, historicalRelease]) markers(body, ['/version.json', '/data/manifest.json', '/llms.txt', '/ai.txt', 'canonical_only = true', 'includes_unreviewed_candidates = false', 'includes_internal_monitoring = false', 'includes_private_notes = false'], body === readme ? 'README.md' : 'historical release note');
markers(historicalRelease, [historical.checkpoint_id, historical.source_commit, historical.canonical_content_sha256, historical.canonical_identity_sha256, historical.release_integrity_baseline_id, historical.reproducible_build_baseline_id, historical.reproducibility_checkpoint.tree_sha256, 'stable assets: 100', 'evidence: 502', 'reproducible: true'], 'historical release note');
check(historical.release_integrity_baseline_id === 'sog_release_integrity_pr316_2026_07_06', 'historical release-integrity baseline changed');
check(historical.reproducible_build_baseline_id === reproducible.baseline_id, 'historical reproducibility binding changed');

check(current.checkpoint_id === 'sog_evidence_archive_maintenance_batch_3_canonical_112_checkpoint_pr380_2026_07_16', 'current checkpoint ID');
check(current.asset_count === 112, 'current asset count');
const currentCounts = {
  assets: 112,
  organizations: 107,
  relationships: 124,
  events: 187,
  evidence: 559,
  market_access_records: 8,
  reserve_reports: 120,
  known_unknowns: 325,
  regulatory_notes: 9,
  deployments: 174,
  legal_profiles: 112,
  stable_asset_relationships: 5,
  reserve_components: 145,
  income_profiles: 112
};
for (const [key, value] of Object.entries(currentCounts)) check(current.expected_counts?.[key] === value, `current ${key} count`);
check(current.evidence_quality?.archive_index_count === 399, 'current archive count');
check(current.evidence_quality?.archive_not_recorded_count === 160, 'current no-archive count');

check(releaseBaseline.status === 'current', 'release baseline status');
check(releaseBaseline.baseline_id === 'sog_release_integrity_pr380_112_assets_2026_07_16', 'release baseline ID');
const expectedV2 = {
  stablecoins: 112,
  organizations: 107,
  relationships: 124,
  classifications: 112,
  profiles: 112,
  events: 187,
  event_details: 187,
  evidence: 559,
  evidence_relations: 559,
  reserve_reports: 120,
  known_unknowns: 325,
  regulatory_notes: 9,
  deployments: 174
};
for (const [key, value] of Object.entries(expectedV2)) check(releaseBaseline.expected_v2_counts?.[key] === value, `release v2 ${key} count`);
const expectedV3 = { legal_profiles: 112, stable_asset_relationships: 5, reserve_components: 145, income_profiles: 112, deployment_view: 174 };
for (const [key, value] of Object.entries(expectedV3)) check(releaseBaseline.expected_v3_counts?.[key] === value, `release v3 ${key} count`);
check(releaseBaseline.evidence_quality?.archive_index_count === 399, 'release archive count');
check(releaseBaseline.evidence_quality?.archive_not_recorded_count === 160, 'release no-archive count');

const first = history.snapshots?.[0];
const latest = history.snapshots?.at(-1);
check(first?.checkpoint_id === historical.checkpoint_id && first?.asset_count === 100, 'historical stats snapshot');
check(latest?.checkpoint_id === historyCheckpoint.checkpoint_id, 'latest history checkpoint');
check(latest?.canonical_checkpoint_id === current.checkpoint_id, 'latest canonical binding');
check(latest?.totals?.assets === 112 && latest?.totals?.evidence === 559 && latest?.totals?.deployments === 174 && latest?.totals?.market_access_records === 8, 'latest totals');
check(latest?.data_quality?.coverage?.archive_evidence?.count === 399, 'latest archive coverage');
check(historyCheckpoint.checkpoint_id === 'sog_evidence_archive_maintenance_batch_3_112_checkpoint_pr380_2026_07_16', 'current history checkpoint ID');
check(historyCheckpoint.canonical_checkpoint_id === current.checkpoint_id, 'history/current binding');

check(handoff.status === 'reviewed_complete' && handoff.review_pr === 380, 'PR #380 handoff identity');
check(handoff.canonical_counts?.assets === 112 && handoff.canonical_counts?.evidence === 559 && handoff.canonical_counts?.evidence_relations === 559, 'PR #380 canonical boundary');
check(handoff.evidence_quality?.selected === 10 && handoff.evidence_quality?.changed === 10, 'PR #380 selected/changed counts');
check(handoff.evidence_quality?.dated_archive_added === 9 && handoff.evidence_quality?.reviewed_source_replacement === 1 && handoff.evidence_quality?.reviewed_no_safe_change === 0, 'PR #380 outcome distribution');
check(handoff.evidence_quality?.archive_recorded === 399 && handoff.evidence_quality?.archive_not_recorded === 160, 'PR #380 archive boundary');
check(handoff.next_work_item?.decision === 'review_gate_required', 'PR #380 review-gate boundary');
check(outcomes.selected_count === 10 && outcomes.changed_count === 10, 'PR #380 outcome counts');
check(outcomes.archive_index_count_before === 390 && outcomes.archive_index_count_after === 399, 'PR #380 archive transition');
check(outcomes.archive_not_recorded_count_before === 169 && outcomes.archive_not_recorded_count_after === 160, 'PR #380 no-archive transition');

markers(roadmap, ['Canonical stable assets: 112', 'PR #363 Record Depth and Coverage Baseline Refresh: complete', 'PR #364 Tier A Dossier Deepening Batch 4: complete', 'PR #365 Evidence and Archive Maintenance Batch 2: complete', 'PR #380 Evidence and Archive Maintenance Batch 3: reviewed complete; complete on merge', '112 stable assets', '559 Evidence records', '174 deployments', '399 archive indexes are recorded', '160 archive indexes are not recorded', 'Current authority: REVIEW GATE', 'Next work item: none pre-authorized'], 'current roadmap');
markers(agents, ['Archive recorded: 399', 'Archive not recorded: 160', 'PR #380 Evidence and Archive Maintenance Batch 3: reviewed complete; complete on merge', 'Current authority: REVIEW GATE', 'Next work item: none pre-authorized', 'sog_src_eurc_mint_page'], 'AGENTS.md');

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
  current_evidence_relations: 559,
  current_archive_indexes: 399,
  current_archive_not_recorded: 160,
  current_deployments: 174,
  current_market_access_records: 8,
  current_release_integrity_baseline_id: releaseBaseline.baseline_id,
  completed_workstream: 'pr380_evidence_archive_maintenance_batch_3',
  active_workstream: 'review_gate',
  next_workstream: 'none_pre_authorized'
}, null, 2));
