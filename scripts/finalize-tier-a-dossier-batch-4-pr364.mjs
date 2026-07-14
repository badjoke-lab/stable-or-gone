import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(path.join(root, file), `${JSON.stringify(value, null, 2)}\n`);
const readRows = (file) => {
  const value = readJson(file);
  if (!Array.isArray(value)) throw new Error(`${file}: expected array`);
  return value;
};
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

const previousCanonical = readJson('docs/migration/current-canonical-checkpoint.json');
const previousHistoryCheckpoint = readJson('docs/migration/current-stats-history-checkpoint.json');
const v2 = loadRegistryV2Baseline(root);
const group = (name) => (v2.data_groups?.[name] ?? []).flatMap(readRows);
const foundation = readJson('docs/migration/registry-v3-foundation.json');
const incomeManifest = readJson('docs/migration/registry-v3-income-profiles.json');
const marketAccess = readJson('data/market-access-records-v1.json');
const legalProfiles = foundation.data_groups.legal_profiles.flatMap(readRows);
const stableAssetRelationships = foundation.data_groups.stable_asset_relationships.flatMap(readRows);
const reserveComponents = foundation.data_groups.reserve_components.flatMap(readRows);
const incomeProfiles = incomeManifest.data_files.flatMap(readRows);
const evidence = group('evidence');
const archiveRecorded = evidence.filter((row) => typeof row.archived_url === 'string' && row.archived_url.trim() !== '').length;
const archiveNotRecorded = evidence.length - archiveRecorded;

const counts = {
  stablecoins: group('stablecoins').length,
  organizations: group('organizations').length,
  relationships: group('relationships').length,
  classifications: group('classifications').length,
  profiles: group('profiles').length,
  events: group('events').length,
  event_details: group('event_details').length,
  evidence: evidence.length,
  evidence_relations: group('evidence_relations').length,
  reserve_reports: group('reserve_reports').length,
  known_unknowns: group('known_unknowns').length,
  regulatory_notes: group('regulatory_notes').length,
  deployments: group('deployments').length,
  market_access_records: marketAccess.length,
  legal_profiles: legalProfiles.length,
  stable_asset_relationships: stableAssetRelationships.length,
  reserve_components: reserveComponents.length,
  income_profiles: incomeProfiles.length
};

const expected = {
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
  deployments: 174,
  market_access_records: 8,
  legal_profiles: 112,
  stable_asset_relationships: 5,
  reserve_components: 145,
  income_profiles: 112
};
if (!isDeepStrictEqual(counts, expected)) throw new Error(`PR #364 canonical counts mismatch: ${JSON.stringify(counts)}`);
if (archiveRecorded !== 387 || archiveNotRecorded !== 172) throw new Error(`PR #364 archive boundary mismatch: recorded=${archiveRecorded}, not_recorded=${archiveNotRecorded}`);

const canonicalCheckpointId = 'sog_tier_a_dossier_batch_4_canonical_112_checkpoint_pr364_2026_07_14';
const historyCheckpointId = 'sog_tier_a_dossier_batch_4_112_checkpoint_pr364_2026_07_14';
const canonicalCheckpoint = {
  schema_version: '1.0',
  status: 'reviewed_non_growth_checkpoint',
  checkpoint_id: canonicalCheckpointId,
  checkpoint_kind: 'non_growth_normalization_checkpoint',
  recorded_at: '2026-07-14',
  source_commit: 'pr364-tier-a-dossier-batch-4',
  asset_count: 112,
  source_checkpoint_id: previousCanonical.checkpoint_id,
  previous_checkpoint_id: previousCanonical.checkpoint_id,
  dossier_pr: 364,
  expected_counts: {
    assets: counts.stablecoins,
    organizations: counts.organizations,
    relationships: counts.relationships,
    events: counts.events,
    evidence: counts.evidence,
    market_access_records: counts.market_access_records,
    reserve_reports: counts.reserve_reports,
    known_unknowns: counts.known_unknowns,
    regulatory_notes: counts.regulatory_notes,
    deployments: counts.deployments,
    legal_profiles: counts.legal_profiles,
    stable_asset_relationships: counts.stable_asset_relationships,
    reserve_components: counts.reserve_components,
    income_profiles: counts.income_profiles
  },
  evidence_quality: {
    archive_index_count: archiveRecorded,
    archive_not_recorded_count: archiveNotRecorded,
    selected_for_review: 5,
    canonical_change_assets: 2,
    reviewed_no_safe_change_assets: 3,
    new_evidence_records: 2
  },
  dossier_outcome: {
    selected_asset_slugs: ['husd','poundtoken','rlusd','usdg','usds'],
    canonical_change_asset_slugs: ['usdg','usds'],
    reviewed_no_safe_change_asset_slugs: ['husd','poundtoken','rlusd']
  },
  notes: 'Current deterministic canonical checkpoint after PR #364 Tier A Dossier Deepening Batch 4. USDG receives exact joint legal issuer identities, issuer relationships, customer-bounded redemption terms, and a completed legal profile. USDS receives a protocol-asset legal profile without a direct corporate holder claim. HUSD, poundtoken, and RLUSD were reviewed with no safe canonical change. Assets, Market Access, deployments, reserve reports, reserve components, income profiles, and public-surface boundaries remain unchanged.'
};
writeJson('docs/migration/current-canonical-checkpoint.json', canonicalCheckpoint);

const historyCheckpoint = {
  schema_version: '1.0',
  status: 'reviewed_non_growth_checkpoint',
  checkpoint_id: historyCheckpointId,
  checkpoint_kind: 'non_growth_normalization_checkpoint',
  recorded_at: '2026-07-14',
  registry_version: 'pr364-tier-a-dossier-batch-4',
  asset_count: 112,
  source_checkpoint_id: previousHistoryCheckpoint.checkpoint_id,
  canonical_checkpoint_id: canonicalCheckpointId,
  previous_history_checkpoint_id: previousHistoryCheckpoint.checkpoint_id,
  dossier_pr: 364,
  notes: 'Reviewed forward same-count statistics checkpoint for PR #364 Tier A Dossier Deepening Batch 4. It appends after PR #360, binds the new canonical dossier checkpoint, records 107 organizations, 124 relationships, and 559 Evidence identities, and preserves 112 assets, 174 deployments, eight Market Access records, and all no-ranking and no-new-surface boundaries.'
};
writeJson('docs/migration/current-stats-history-checkpoint.json', historyCheckpoint);

const parity = {
  schema_version: '3.0-parity-baseline',
  status: 'current',
  baseline_id: 'sog_registry_v3_parity_pr364_112_assets_2026_07_14',
  recorded_at: '2026-07-14',
  data_checkpoint_commit: 'pr364-tier-a-dossier-batch-4',
  source_baseline_id: 'sog_registry_v3_parity_pr360_112_assets_2026_07_14',
  canonical_checkpoint_id: canonicalCheckpointId,
  v2_composed_baseline: 'docs/migration/registry-v2-baseline.json',
  v3_foundation: 'docs/migration/registry-v3-foundation.json',
  v3_income_profiles: 'docs/migration/registry-v3-income-profiles.json',
  expected_v2_counts: {
    stablecoins: counts.stablecoins,
    organizations: counts.organizations,
    relationships: counts.relationships,
    classifications: counts.classifications,
    profiles: counts.profiles,
    events: counts.events,
    event_details: counts.event_details,
    evidence: counts.evidence,
    evidence_relations: counts.evidence_relations,
    reserve_reports: counts.reserve_reports,
    known_unknowns: counts.known_unknowns,
    regulatory_notes: counts.regulatory_notes,
    deployments: counts.deployments
  },
  expected_v3_counts: {
    legal_profiles: counts.legal_profiles,
    stable_asset_relationships: counts.stable_asset_relationships,
    reserve_components: counts.reserve_components,
    income_profiles: counts.income_profiles,
    deployment_view: counts.deployments
  },
  expected_v3_coverage: {
    legal_profiles: 112,
    income_profiles: 112,
    reserve_component_assets: 112,
    deployment_view_assets: 112
  },
  machine_readable_contract: {
    schema_version: '1.0.0',
    data_schema_version: 'sog_registry_v2',
    compatibility_mode: 'v2_public_contract_with_additive_v3_summary',
    registry_v3_summary: true,
    summary_locations: ['version.data.registry_v3','manifest.registry_v3'],
    data_safety: {
      canonical_only: true,
      includes_unreviewed_candidates: false,
      includes_internal_monitoring: false,
      includes_private_notes: false
    }
  },
  audit_report: 'docs/audits/registry-v2-v3-machine-readable-parity-100-assets.md',
  validator: 'scripts/validate-registry-v2-v3-machine-readable-parity.mjs',
  notes: 'Current parity baseline binds PR #364 dossier-depth changes. It preserves 112 assets while adding two exact USDG legal issuer organizations, two legal-issuer relationships, and two primary Evidence records. Legal-profile coverage remains one unique profile per asset; no Market Access, deployment, reserve-component, or income-profile count changes occur.'
};
writeJson('docs/migration/registry-v3-parity-baseline.json', parity);

const release = {
  schema_version: '1.0',
  status: 'current',
  baseline_id: 'sog_release_integrity_pr364_112_assets_2026_07_14',
  recorded_at: '2026-07-14',
  source_checkpoint_commit: 'pr364-tier-a-dossier-batch-4',
  registry_parity_baseline: 'docs/migration/registry-v3-parity-baseline.json',
  expected_v2_counts: parity.expected_v2_counts,
  expected_v3_counts: parity.expected_v3_counts,
  expected_public_record_counts: { primary_records: 112, events: 187, evidence: 559 },
  expected_public_breakdown_counts: {
    stablecoins: 112,
    organizations: 107,
    relationships: 124,
    evidence_relations: 559,
    reserve_reports: 120,
    known_unknowns: 325,
    regulatory_notes: 9,
    deployments: 174
  },
  expected_route_counts: {
    stablecoin_detail: 112,
    organization_detail: 107,
    event_detail: 187,
    total_detail: 406,
    declared_main_routes: 13
  },
  machine_readable_contract: {
    schema_version: '1.0.0',
    data_schema_version: 'sog_registry_v2',
    compatibility_mode: 'v2_public_contract_with_additive_v3_summary',
    version_record_counts_path: 'data.record_counts',
    version_breakdown_path: 'data.record_count_breakdown',
    manifest_record_counts_path: 'record_counts',
    manifest_breakdown_path: 'record_count_breakdown',
    shared_build_provenance_required: true,
    shared_count_getters_required: true,
    canonical_only: true
  },
  provenance_contract: {
    schema_version: '1.0',
    verification_marker: 'sog_build_provenance_v1',
    machine_readable_verification_marker: 'sog_machine_readable_layer_v1',
    hash_algorithm: 'sha256',
    source_template_mode: 'sentinel_until_build',
    source_template_commit: 'unknown',
    source_template_branch: 'main',
    source_template_generated_at: '1970-01-01T00:00:00.000Z',
    source_template_hash: 'sha256:0000000000000000000000000000000000000000000000000000000000000000',
    source_template_file_count: 0,
    runtime_generation_required: true
  },
  evidence_quality: {
    archive_index_count: archiveRecorded,
    archive_not_recorded_count: archiveNotRecorded,
    selected_for_review: 5,
    canonical_change_assets: 2,
    reviewed_no_safe_change_assets: 3,
    new_evidence_records: 2
  },
  validator: 'scripts/validate-counts-manifest-version-provenance-integrity.mjs',
  audit_report: 'docs/audits/counts-manifest-version-provenance-integrity-100-assets.md'
};
writeJson('docs/migration/registry-release-integrity-baseline.json', release);

const snapshot = generateCurrentHistorySnapshot({ root });
const history = readJson('data/stats-history.json');
const existingIndex = history.snapshots.findIndex((row) => row.checkpoint_id === snapshot.checkpoint_id);
if (existingIndex >= 0) {
  if (!isDeepStrictEqual(history.snapshots[existingIndex], snapshot)) throw new Error('Existing PR #364 statistics snapshot differs from deterministic generation');
} else {
  history.snapshots.push(snapshot);
  writeJson('data/stats-history.json', history);
}

const findings = readJson('docs/migration/tier-a-dossier-batch-4-pr364-findings.json');
const handoff = {
  schema_version: '1.0',
  status: 'reviewed_merged_handoff_pending_merge_commit',
  handoff_id: 'sog_tier_a_batch_4_pr364_reviewed_handoff_2026_07_14',
  review_pr: 364,
  source_merge_commit: 'pending_pr364_merge',
  recorded_at: '2026-07-14',
  canonical_checkpoint_id: canonicalCheckpointId,
  stats_history_checkpoint_id: historyCheckpointId,
  canonical_counts: {
    assets: counts.stablecoins,
    organizations: counts.organizations,
    relationships: counts.relationships,
    events: counts.events,
    evidence: counts.evidence,
    evidence_relations: counts.evidence_relations,
    reserve_reports: counts.reserve_reports,
    known_unknowns: counts.known_unknowns,
    regulatory_notes: counts.regulatory_notes,
    deployments: counts.deployments,
    market_access_records: counts.market_access_records,
    legal_profiles: counts.legal_profiles,
    stable_asset_relationships: counts.stable_asset_relationships,
    reserve_components: counts.reserve_components,
    income_profiles: counts.income_profiles
  },
  selected_asset_slugs: findings.findings.map((row) => row.asset_slug),
  canonical_improvement_asset_slugs: findings.findings.filter((row) => row.decision === 'canonical_change_applied').map((row) => row.asset_slug),
  reviewed_no_safe_change_asset_slugs: findings.findings.filter((row) => row.decision === 'reviewed_no_safe_change').map((row) => row.asset_slug),
  evidence_quality: {
    archive_recorded: archiveRecorded,
    archive_not_recorded: archiveNotRecorded,
    new_evidence_records: 2
  },
  stats_model_sha256: snapshot.stats_model_sha256,
  stats_snapshot_sha256: snapshot.snapshot_sha256,
  new_public_surface: false,
  asset_rank: false,
  single_composite_score: false,
  next_work_item: 'PR #365 Evidence and Archive Maintenance Batch 2',
  notes: 'Reviewed handoff for PR #364. USDG and USDS received source-bounded canonical dossier improvements. HUSD, poundtoken, and RLUSD were reviewed with no safe canonical change. PR #365 remains limited to a maximum ten-Evidence maintenance batch before the next review gate.'
};
writeJson('docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json', handoff);

const finalizerDigest = sha256(JSON.stringify({ counts, snapshot, canonicalCheckpoint, historyCheckpoint, parity, release, handoff }));
console.log(JSON.stringify({
  ok: true,
  counts,
  archive_recorded: archiveRecorded,
  archive_not_recorded: archiveNotRecorded,
  canonical_checkpoint_id: canonicalCheckpointId,
  history_checkpoint_id: historyCheckpointId,
  stats_model_sha256: snapshot.stats_model_sha256,
  stats_snapshot_sha256: snapshot.snapshot_sha256,
  finalizer_digest_sha256: finalizerDigest
}, null, 2));
