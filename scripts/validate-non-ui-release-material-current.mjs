import fs from 'node:fs';

const text = (file) => fs.readFileSync(file, 'utf8');
const json = (file) => JSON.parse(text(file));
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };
const markers = (body, list, label) => list.forEach((value) => check(body.includes(String(value)), `${label}: missing ${value}`));

const historical = json('docs/migration/audited-100-asset-canonical-checkpoint.json');
const current = json('docs/migration/current-canonical-checkpoint.json');
const historyCheckpoint = json('docs/migration/current-stats-history-checkpoint.json');
const releaseBaseline = json('docs/migration/registry-release-integrity-baseline.json');
const reproducible = json('docs/migration/reproducible-build-output-baseline.json');
const history = json('data/stats-history.json');
const readme = text('README.md');
const historicalRelease = text('docs/releases/100-asset-checkpoint-2026-07-06.md');
const roadmap = text('docs/roadmap.md');
const agents = text('AGENTS.md');

markers(readme, ['Canonical stable assets: 112', '/version.json', '/data/manifest.json', '/llms.txt', '/ai.txt', 'canonical_only = true', 'includes_unreviewed_candidates = false', 'includes_internal_monitoring = false', 'includes_private_notes = false'], 'README.md');
markers(historicalRelease, [historical.checkpoint_id, historical.source_commit, historical.canonical_content_sha256, historical.canonical_identity_sha256, historical.release_integrity_baseline_id, historical.reproducible_build_baseline_id, historical.reproducibility_checkpoint.tree_sha256, 'stable assets: 100', 'evidence: 502', 'reproducible: true', '/version.json', '/data/manifest.json', '/llms.txt', '/ai.txt'], 'historical release note');
check(historical.release_integrity_baseline_id === 'sog_release_integrity_pr316_2026_07_06', 'historical release-integrity baseline changed');
check(historical.reproducible_build_baseline_id === reproducible.baseline_id, 'historical reproducibility binding changed');

const c = current.expected_counts;
check(current.status === 'reviewed_non_growth_checkpoint', 'current checkpoint status');
check(current.asset_count === 112 && c.assets === 112, 'current asset count');
check(c.organizations === 107, 'current organization count');
check(c.relationships === 124, 'current relationship count');
check(c.events === 187, 'current event count');
check(c.evidence === 559, 'current Evidence count');
check(c.market_access_records === 8, 'current Market Access count');
check(c.reserve_reports === 120, 'current reserve-report count');
check(c.known_unknowns === 325, 'current known-unknown count');
check(c.regulatory_notes === 9, 'current regulatory-note count');
check(c.deployments === 174, 'current deployment count');
check(c.legal_profiles === 112, 'current legal-profile count');
check(c.stable_asset_relationships === 5, 'current v3 relationship count');
check(c.reserve_components === 145, 'current reserve-component count');
check(c.income_profiles === 112, 'current income-profile count');
check(current.evidence_quality?.archive_index_count === 399, 'current archive count');
check(current.evidence_quality?.archive_not_recorded_count === 160, 'current no-archive count');

check(releaseBaseline.status === 'current', 'release baseline status');
check(releaseBaseline.expected_v2_counts?.stablecoins === 112, 'release stablecoin count');
check(releaseBaseline.expected_v2_counts?.evidence === 559, 'release Evidence count');
check(releaseBaseline.expected_v2_counts?.evidence_relations === 559, 'release Evidence Relation count');
check(releaseBaseline.expected_v2_counts?.deployments === 174, 'release deployment count');
check(releaseBaseline.expected_v3_counts?.legal_profiles === 112, 'release legal-profile count');
check(releaseBaseline.expected_v3_counts?.reserve_components === 145, 'release reserve-component count');
check(releaseBaseline.expected_v3_counts?.income_profiles === 112, 'release income-profile count');
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

markers(roadmap, ['Canonical stable assets: 112', 'Evidence: 559', 'Evidence Relations: 559', 'Deployments: 174', 'Market Access Records: 8', 'Archive recorded: 399', 'Archive not recorded: 160'], 'current roadmap');
markers(agents, ['Canonical stable assets: 112', 'Canonical Evidence: 559', 'Evidence Relations: 559', 'Deployments: 174', 'Market Access Records: 8', 'Archive recorded: 399', 'Archive not recorded: 160', 'Current authority:'], 'AGENTS.md');

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
  validation_mode: 'workstream_independent_current_checkpoint'
}, null, 2));
