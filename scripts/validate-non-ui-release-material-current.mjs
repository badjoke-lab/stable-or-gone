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

markers(readme, ['/version.json', '/data/manifest.json', '/llms.txt', '/ai.txt', 'canonical_only = true', 'includes_unreviewed_candidates = false', 'includes_internal_monitoring = false', 'includes_private_notes = false'], 'README.md');
markers(historicalRelease, [historical.checkpoint_id, historical.source_commit, historical.canonical_content_sha256, historical.canonical_identity_sha256, historical.release_integrity_baseline_id, historical.reproducible_build_baseline_id, historical.reproducibility_checkpoint.tree_sha256, 'stable assets: 100', 'evidence: 502', 'reproducible: true', '/version.json', '/data/manifest.json', '/llms.txt', '/ai.txt'], 'historical release note');
check(historical.release_integrity_baseline_id === 'sog_release_integrity_pr316_2026_07_06', 'historical release-integrity baseline changed');
check(historical.reproducible_build_baseline_id === reproducible.baseline_id, 'historical reproducibility binding changed');

const c = current.expected_counts ?? current.counts ?? {};
const archiveRecorded = current.evidence_quality?.archive_index_count
  ?? current.counts?.archive_index_count;
const archiveNotRecorded = current.evidence_quality?.archive_not_recorded_count
  ?? current.counts?.archive_not_recorded_count;
const acceptedCurrentStatuses = new Set(['reviewed_growth_checkpoint', 'reviewed_non_growth_maintenance_checkpoint']);
check(acceptedCurrentStatuses.has(current.status), 'current checkpoint status');
check(Number.isInteger(c.assets) && c.assets > 0 && current.asset_count === c.assets, 'current asset count');
check(Number.isInteger(c.organizations) && c.organizations > 0, 'current organization count');
check(Number.isInteger(c.relationships) && c.relationships > 0, 'current relationship count');
check(Number.isInteger(c.events) && c.events > 0, 'current event count');
check(Number.isInteger(c.evidence) && c.evidence > 0, 'current Evidence count');
check(Number.isInteger(c.market_access_records) && c.market_access_records >= 0, 'current Market Access count');
check(Number.isInteger(c.reserve_reports) && c.reserve_reports > 0, 'current reserve-report count');
check(Number.isInteger(c.known_unknowns) && c.known_unknowns > 0, 'current known-unknown count');
check(Number.isInteger(c.regulatory_notes) && c.regulatory_notes >= 0, 'current regulatory-note count');
check(Number.isInteger(c.deployments) && c.deployments > 0, 'current deployment count');
check(Number.isInteger(c.legal_profiles) && c.legal_profiles > 0, 'current legal-profile count');
check(Number.isInteger(c.stable_asset_relationships) && c.stable_asset_relationships >= 0, 'current v3 relationship count');
check(Number.isInteger(c.reserve_components) && c.reserve_components > 0, 'current reserve-component count');
check(Number.isInteger(c.income_profiles) && c.income_profiles > 0, 'current income-profile count');
check(Number.isInteger(archiveRecorded) && archiveRecorded >= 0, 'current archive count');
check(Number.isInteger(archiveNotRecorded) && archiveNotRecorded >= 0, 'current no-archive count');
check(archiveRecorded + archiveNotRecorded === c.evidence, 'current archive partition');

check(releaseBaseline.status === 'current', 'release baseline status');
check(releaseBaseline.expected_v2_counts?.stablecoins === c.assets, 'release stablecoin count');
check(releaseBaseline.expected_v2_counts?.organizations === c.organizations, 'release organization count');
check(releaseBaseline.expected_v2_counts?.relationships === c.relationships, 'release relationship count');
check(releaseBaseline.expected_v2_counts?.events === c.events, 'release event count');
check(releaseBaseline.expected_v2_counts?.evidence === c.evidence, 'release Evidence count');
check(releaseBaseline.expected_v2_counts?.evidence_relations === c.evidence, 'release Evidence Relation count');
check(releaseBaseline.expected_v2_counts?.reserve_reports === c.reserve_reports, 'release reserve-report count');
check(releaseBaseline.expected_v2_counts?.known_unknowns === c.known_unknowns, 'release known-unknown count');
check(releaseBaseline.expected_v2_counts?.deployments === c.deployments, 'release deployment count');
check(releaseBaseline.expected_v3_counts?.legal_profiles === c.legal_profiles, 'release legal-profile count');
check(releaseBaseline.expected_v3_counts?.reserve_components === c.reserve_components, 'release reserve-component count');
check(releaseBaseline.expected_v3_counts?.income_profiles === c.income_profiles, 'release income-profile count');
const releaseArchiveRecorded = releaseBaseline.evidence_quality?.archive_index_count
  ?? releaseBaseline.expected_archive_counts?.recorded
  ?? releaseBaseline.archive_index_count;
const releaseArchiveNotRecorded = releaseBaseline.evidence_quality?.archive_not_recorded_count
  ?? releaseBaseline.expected_archive_counts?.not_recorded
  ?? releaseBaseline.archive_not_recorded_count;
check(releaseArchiveRecorded === archiveRecorded, 'release archive count');
check(releaseArchiveNotRecorded === archiveNotRecorded, 'release no-archive count');

const first = history.snapshots?.[0];
const latest = history.snapshots?.at(-1);
check(first?.checkpoint_id === historical.checkpoint_id && first?.asset_count === 100, 'historical stats snapshot');
check(latest?.checkpoint_id === historyCheckpoint.checkpoint_id, 'latest history checkpoint');
check(latest?.canonical_checkpoint_id === current.checkpoint_id, 'latest canonical binding');
check(latest?.totals?.assets === c.assets, 'latest asset total');
check(latest?.totals?.events === c.events, 'latest event total');
check(latest?.totals?.evidence === c.evidence, 'latest Evidence total');
check(latest?.totals?.deployments === c.deployments, 'latest deployment total');
check(latest?.totals?.market_access_records === c.market_access_records, 'latest Market Access total');
check(latest?.data_quality?.coverage?.archive_evidence?.count === archiveRecorded, 'latest archive coverage');
check(historyCheckpoint.canonical_checkpoint_id === current.checkpoint_id, 'history/current binding');

markers(roadmap, [`Canonical stable assets: ${c.assets}`, `Organizations: ${c.organizations}`, `Relationships: ${c.relationships}`, `Events: ${c.events}`, `Evidence: ${c.evidence}`, `Evidence Relations: ${c.evidence}`, `Deployments: ${c.deployments}`, `Market Access Records: ${c.market_access_records}`, `Archive recorded: ${archiveRecorded}`, `Archive not recorded: ${archiveNotRecorded}`], 'current roadmap');
markers(agents, [`Canonical stable assets: ${c.assets}`, `Organizations: ${c.organizations}`, `Relationships: ${c.relationships}`, `Events: ${c.events}`, `Canonical Evidence: ${c.evidence}`, `Evidence Relations: ${c.evidence}`, `Deployments: ${c.deployments}`, `Market Access Records: ${c.market_access_records}`, `Archive recorded: ${archiveRecorded}`, `Archive not recorded: ${archiveNotRecorded}`, '## Current authority', 'Official public origin: https://www.stableorgone.com', 'docs/ui-v3-remediation-authority.md', 'PR #493', 'PR #500', 'PR #517'], 'AGENTS.md');

if (failures.length) {
  console.error('Non-UI release material validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  historical_checkpoint_id: historical.checkpoint_id,
  current_checkpoint_id: current.checkpoint_id,
  current_checkpoint_status: current.status,
  current_history_checkpoint_id: historyCheckpoint.checkpoint_id,
  current_stable_assets: c.assets,
  current_evidence: c.evidence,
  current_evidence_relations: c.evidence,
  current_archive_indexes: archiveRecorded,
  current_archive_not_recorded: archiveNotRecorded,
  current_deployments: c.deployments,
  current_market_access_records: c.market_access_records,
  current_release_integrity_baseline_id: releaseBaseline.baseline_id,
  authority_acceptance_points: [493, 500, 517],
  validation_mode: 'workstream_independent_current_checkpoint'
}, null, 2));
