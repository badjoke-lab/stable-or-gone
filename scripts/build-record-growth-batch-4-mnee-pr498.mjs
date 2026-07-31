import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const root = process.cwd();
const sourceCommit = process.env.PR498_SOURCE_COMMIT || 'pr498-record-growth-batch-4-mnee';
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const write = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`);
const digest = (value) => `sha256:${crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex')}`;
const loadFiles = (files) => files.flatMap((file) => {
  const value = read(file);
  return Array.isArray(value) ? value : value.records;
});

const baseline = loadRegistryV2Baseline(root);
const groups = Object.fromEntries(Object.entries(baseline.data_groups).map(([name, files]) => [name, loadFiles(files)]));
const foundation = read('docs/migration/registry-v3-foundation.json');
const incomeManifest = read('docs/migration/registry-v3-income-profiles.json');
const legalProfiles = loadFiles(foundation.data_groups.legal_profiles);
const stableAssetRelationships = loadFiles(foundation.data_groups.stable_asset_relationships);
const reserveComponents = loadFiles(foundation.data_groups.reserve_components);
const incomeProfiles = loadFiles(incomeManifest.data_files);
const marketAccess = read('data/market-access-records-v1.json');
const archiveRecorded = groups.evidence.filter((row) => typeof row.archived_url === 'string' && row.archived_url.trim().length > 0).length;

const expected = {
  stablecoins: 117,
  organizations: 108,
  relationships: 129,
  classifications: 117,
  profiles: 117,
  events: 192,
  event_details: 192,
  evidence: 579,
  evidence_relations: 579,
  reserve_reports: 125,
  known_unknowns: 342,
  regulatory_notes: 9,
  deployments: 184,
  legal_profiles: 117,
  stable_asset_relationships: 5,
  reserve_components: 151,
  income_profiles: 117,
  market_access_records: 8,
  archive_recorded: 450,
  archive_not_recorded: 129,
  detail_routes: 417
};
const actual = {
  stablecoins: groups.stablecoins.length,
  organizations: groups.organizations.length,
  relationships: groups.relationships.length,
  classifications: groups.classifications.length,
  profiles: groups.profiles.length,
  events: groups.events.length,
  event_details: groups.event_details.length,
  evidence: groups.evidence.length,
  evidence_relations: groups.evidence.length,
  reserve_reports: groups.reserve_reports.length,
  known_unknowns: groups.known_unknowns.length,
  regulatory_notes: groups.regulatory_notes.length,
  deployments: groups.deployments.length,
  legal_profiles: legalProfiles.length,
  stable_asset_relationships: stableAssetRelationships.length,
  reserve_components: reserveComponents.length,
  income_profiles: incomeProfiles.length,
  market_access_records: marketAccess.length,
  archive_recorded: archiveRecorded,
  archive_not_recorded: groups.evidence.length - archiveRecorded,
  detail_routes: groups.stablecoins.length + groups.organizations.length + groups.events.length
};
for (const [key, value] of Object.entries(expected)) {
  if (actual[key] !== value) throw new Error(`PR #498 builder count mismatch for ${key}: ${actual[key]} != ${value}`);
}

const previousCanonicalCheckpointId = 'sog_record_growth_batch_3_canonical_116_checkpoint_pr467_2026_07_25';
const previousStatsCheckpointId = 'sog_record_growth_batch_3_116_checkpoint_pr467_2026_07_25';
const checkpointId = 'sog_pr498_record_growth_batch_4_mnee_117_2026_07_31';
const statsCheckpointId = 'sog_stats_pr498_record_growth_batch_4_mnee_2026_07_31';
const expectedV2 = {
  stablecoins: 117, organizations: 108, relationships: 129, classifications: 117, profiles: 117,
  events: 192, event_details: 192, evidence: 579, evidence_relations: 579,
  reserve_reports: 125, known_unknowns: 342, regulatory_notes: 9, deployments: 184
};
const expectedV3 = {
  legal_profiles: 117, stable_asset_relationships: 5, reserve_components: 151,
  income_profiles: 117, deployment_view: 184
};

write('docs/migration/current-canonical-checkpoint.json', {
  schema_version: '1.0',
  status: 'reviewed_growth_checkpoint',
  checkpoint_id: checkpointId,
  checkpoint_kind: 'controlled_growth_checkpoint',
  recorded_at: '2026-07-31',
  captured_at: '2026-07-31',
  source_commit: sourceCommit,
  asset_count: 117,
  source_checkpoint_id: previousCanonicalCheckpointId,
  previous_checkpoint_id: previousCanonicalCheckpointId,
  growth_pr: 498,
  source_pr: 498,
  expected_counts: {
    assets: 117, organizations: 108, relationships: 129, events: 192, evidence: 579,
    market_access_records: 8, reserve_reports: 125, known_unknowns: 342, regulatory_notes: 9,
    deployments: 184, legal_profiles: 117, stable_asset_relationships: 5,
    reserve_components: 151, income_profiles: 117
  },
  counts: {
    assets: 117, organizations: 108, relationships: 129, events: 192, evidence: 579,
    market_access_records: 8, reserve_reports: 125, known_unknowns: 342, regulatory_notes: 9,
    deployments: 184, legal_profiles: 117, stable_asset_relationships: 5, reserve_components: 151,
    income_profiles: 117, evidence_relations: 579, classifications: 117, profiles: 117,
    event_details: 192, archive_index_count: 450, archive_not_recorded_count: 129
  },
  evidence_quality: {
    archive_index_count: 450,
    archive_not_recorded_count: 129,
    evidence_relations: 579,
    archive_partition_complete: true
  },
  audit: {
    source_pr: 498,
    source_authority_pr: 497,
    source_candidate_audit_pr: 496,
    source_pr_head: 'agent/record-growth-batch-4-mnee',
    completed_at: '2026-07-31',
    selected_context: 'mnee_complete_record',
    selected_assets: ['sog_st_mnee'],
    added_assets: 1,
    added_organizations: 1,
    added_relationships: 1,
    added_events: 1,
    added_evidence: 8,
    added_deployments: 2,
    added_known_unknowns: 5,
    market_access_change: 0,
    public_surface_change: 0,
    automatic_promotion: false,
    replacement_candidate_used: false,
    ylds_promoted: false,
    review_gate_after_pr498: true
  },
  notes: 'Reviewed controlled-growth checkpoint after PR #498. MNEE was added as the sole PR #497-authorized complete record with one issuer, one launch event, eight Evidence records, two source-linked deployment identifiers, and explicit known unknowns.',
  scope: {
    description: 'Reviewed promotion of MNEE as the sole Record Growth Batch 4 asset authorized by PR #497.',
    promoted_assets: ['MNEE'],
    canonical_assets_added: 1,
    canonical_organizations_added: 1,
    canonical_events_added: 1,
    canonical_evidence_added: 8,
    canonical_deployments_added: 2,
    canonical_known_unknowns_added: 5,
    ylds_promoted: false,
    replacement_candidate_used: false,
    complete_record_only: true,
    review_gate_after_pr498: true
  },
  source_queue: 'data/candidate-promotions-batch-30.json',
  source_queue_digest: digest(read('data/candidate-promotions-batch-30.json')),
  public_origin: 'https://www.stableorgone.com',
  canonical_only: true,
  includes_unreviewed_candidates: false,
  includes_internal_monitoring: false,
  includes_private_notes: false
});

const parity = read('docs/migration/registry-v3-parity-baseline.json');
write('docs/migration/registry-v3-parity-baseline.json', {
  ...parity,
  status: 'current',
  baseline_id: 'sog_registry_v3_parity_pr498_117_assets_2026_07_31',
  recorded_at: '2026-07-31',
  data_checkpoint_commit: sourceCommit,
  source_baseline_id: 'sog_registry_v3_parity_pr467_116_assets_2026_07_25',
  canonical_checkpoint_id: checkpointId,
  expected_v2_counts: expectedV2,
  expected_v3_counts: expectedV3,
  expected_v3_coverage: {
    legal_profiles: 117,
    income_profiles: 117,
    reserve_component_assets: 117,
    deployment_view_assets: 117
  },
  notes: 'Current parity baseline binds PR #498 controlled growth from 116 to 117 assets. MNEE receives complete v2/v3 record layers while Market Access and public product semantics remain unchanged.'
});

const release = read('docs/migration/registry-release-integrity-baseline.json');
write('docs/migration/registry-release-integrity-baseline.json', {
  ...release,
  status: 'current',
  baseline_id: 'sog_release_integrity_pr498_2026_07_31',
  recorded_at: '2026-07-31',
  source_checkpoint_commit: sourceCommit,
  source_pr: 498,
  source_commit: sourceCommit,
  captured_at: '2026-07-31',
  expected_v2_counts: expectedV2,
  expected_v3_counts: {
    legal_profiles: 117,
    stable_asset_relationships: 5,
    reserve_components: 151,
    income_profiles: 117
  },
  expected_public_record_counts: { primary_records: 117, events: 192, evidence: 579 },
  expected_public_breakdown_counts: {
    stablecoins: 117, organizations: 108, relationships: 129, evidence_relations: 579,
    reserve_reports: 125, known_unknowns: 342, regulatory_notes: 9, deployments: 184
  },
  expected_route_counts: {
    stablecoin_detail: 117, organization_detail: 108, event_detail: 192, total_detail: 417,
    declared_main_routes: release.expected_route_counts.declared_main_routes
  },
  expected_market_access_records: 8,
  expected_detail_routes: 417,
  evidence_quality: {
    archive_index_count: 450,
    archive_not_recorded_count: 129,
    archive_partition_complete: true
  }
});

const migrationAudit = read('docs/migration/registry-v3-migration-audit.json');
migrationAudit.minimum_counts = {
  ...migrationAudit.minimum_counts,
  legal_profiles: 117,
  stable_asset_relationships: 5,
  reserve_components: 151,
  deployments: 184,
  income_profiles: 117
};
migrationAudit.coverage = { ...migrationAudit.coverage, protected_stablecoins: 117 };
write('docs/migration/registry-v3-migration-audit.json', migrationAudit);

const deploymentView = read('docs/migration/registry-v3-view-67.json');
deploymentView.minimum_count = 184;
write('docs/migration/registry-v3-view-67.json', deploymentView);

const candidateMaster = read('docs/growth/candidate-master-70.json');
if (!candidateMaster.candidate_files.includes('data/candidate-stable-assets-growth-117.json')) {
  candidateMaster.candidate_files.push('data/candidate-stable-assets-growth-117.json');
}
candidateMaster.status = 'batch_030_complete';
candidateMaster.protected_minimums = { total_candidates: 117, promoted_candidates: 117, pending_candidates: 0 };
candidateMaster.planned_batches.batch_030 = { minimum_candidates: 1, theme: 'MNEE regulated reserve-backed multichain USD stablecoin' };
write('docs/growth/candidate-master-70.json', candidateMaster);

const provenance = read('data/generated/build-provenance.json');
provenance.source_commit = 'unknown';
provenance.source_branch = 'main';
provenance.generated_at = '1970-01-01T00:00:00.000Z';
provenance.canonical_data_hash = 'sha256:0000000000000000000000000000000000000000000000000000000000000000';
provenance.canonical_file_count = 0;
provenance.canonical_record_counts = {
  ...expectedV2,
  legal_profiles: 117,
  stable_asset_relationships: 5,
  reserve_components: 151,
  income_profiles: 117
};
provenance.route_counts = {
  stablecoin_detail: 117,
  organization_detail: 108,
  event_detail: 192,
  total_detail: 417,
  declared_main_routes: 13
};
write('data/generated/build-provenance.json', provenance);

write('docs/migration/current-stats-history-checkpoint.json', {
  schema_version: '1.0',
  status: 'reviewed_growth_checkpoint',
  checkpoint_id: statsCheckpointId,
  checkpoint_kind: 'controlled_growth_checkpoint',
  recorded_at: '2026-07-31',
  registry_version: 'pr498-record-growth-batch-4-mnee',
  asset_count: 117,
  source_checkpoint_id: previousStatsCheckpointId,
  canonical_checkpoint_id: checkpointId,
  previous_history_checkpoint_id: previousStatsCheckpointId,
  growth_pr: 498,
  source_pr: 498,
  source_commit: sourceCommit,
  captured_at: '2026-07-31',
  expected_totals: {
    assets: 117, organizations: 108, relationships: 129, events: 192, evidence: 579,
    deployments: 184, market_access_records: 8, detail_routes: 417
  },
  notes: 'Current immutable stats checkpoint after the reviewed MNEE Record Growth Batch 4 implementation.'
});
const snapshot = generateCurrentHistorySnapshot({ root });
const history = read('data/stats-history.json');
const existingIndex = history.snapshots.findIndex((row) => row.checkpoint_id === snapshot.checkpoint_id);
if (existingIndex >= 0) history.snapshots[existingIndex] = snapshot;
else history.snapshots.push(snapshot);
write('data/stats-history.json', history);

write('docs/migration/record-growth-batch-4-mnee-pr498-handoff.json', {
  schema_version: '1.0',
  handoff_id: 'sog_record_growth_batch_4_mnee_pr498_handoff_2026_07_31',
  status: 'reviewed_complete',
  recorded_at: '2026-07-31',
  source_pr: 498,
  authority_pr: 497,
  candidate_audit_pr: 496,
  promoted_assets: [{ candidate_id: 'sog_cand_000117', source_candidate_id: 'sog_cand_pr496_mnee', stablecoin_id: 'sog_st_mnee', symbol: 'MNEE', issuer_id: 'sog_issuer_mnee_limited' }],
  canonical_counts: {
    stable_assets: 117, organizations: 108, relationships: 129, events: 192, evidence: 579,
    evidence_relations: 579, reserve_reports: 125, known_unknowns: 342, deployments: 184,
    legal_profiles: 117, stable_asset_relationships: 5, reserve_components: 151, income_profiles: 117,
    market_access_records: 8, archive_recorded: 450, archive_not_recorded: 129, detail_routes: 417
  },
  deployment_identities: {
    one_sat_ordinals: {
      deployment_id: 'sog_dep_mnee_1sat_pr498',
      token_id: 'ae59f3b898ec61acbdb6cc7a245fabeded0c094bf046f35206a3aec60ef88127_0',
      overlay_status: 'identifier_recorded_unverified'
    },
    ethereum: {
      deployment_id: 'sog_dep_mnee_ethereum_pr498',
      contract: '0x8ccedbae4916b79da7f3f612efb2eb93a2bfd6cf',
      overlay_status: 'identifier_recorded_unverified'
    }
  },
  preserved_unknowns: [
    'sog_ku_mnee_latest_attestation_pr498', 'sog_ku_mnee_reserve_custodian_pr498',
    'sog_ku_mnee_ethereum_launch_pr498', 'sog_ku_mnee_controls_pr498', 'sog_ku_mnee_access_pr498'
  ],
  preserved_boundaries: {
    second_asset_added: false, ylds_promoted: false, replacement_candidate_used: false,
    market_access_change: false, public_route_family_change: false, ui_change: false,
    automatic_promotion: false, ranking: false, score: false, recommendation: false
  },
  production_expected: {
    official_origin: 'https://www.stableorgone.com', stablecoins: 117, organizations: 108,
    events: 192, total_detail_routes: 417, metadata_checked_routes: 417
  },
  next_work_item: 'REVIEW_GATE'
});

console.log(JSON.stringify({
  ok: true,
  source_commit: sourceCommit,
  expected,
  actual,
  checkpoint_id: checkpointId,
  stats_checkpoint_id: statsCheckpointId,
  stats_snapshot_sha256: snapshot.snapshot_sha256,
  next_work_item: 'REVIEW_GATE'
}, null, 2));
