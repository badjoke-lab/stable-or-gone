import fs from 'node:fs';

const read = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const write = (path, value) => fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);

const canonicalCheckpointId = 'sog_record_growth_batch_3_canonical_116_checkpoint_pr467_2026_07_25';
const statsCheckpointId = 'sog_record_growth_batch_3_116_checkpoint_pr467_2026_07_25';
const previousCanonicalCheckpointId = 'sog_record_growth_batch_2_canonical_114_checkpoint_pr429_2026_07_18';
const previousStatsCheckpointId = 'sog_record_growth_batch_2_114_checkpoint_pr429_2026_07_18';
const expectedV2 = {
  stablecoins: 116,
  organizations: 107,
  relationships: 128,
  classifications: 116,
  profiles: 116,
  events: 191,
  event_details: 191,
  evidence: 571,
  evidence_relations: 571,
  reserve_reports: 124,
  known_unknowns: 337,
  regulatory_notes: 9,
  deployments: 182
};
const expectedV3 = {
  legal_profiles: 116,
  stable_asset_relationships: 5,
  reserve_components: 149,
  income_profiles: 116,
  deployment_view: 182
};
const expectedCounts = {
  assets: expectedV2.stablecoins,
  organizations: expectedV2.organizations,
  relationships: expectedV2.relationships,
  events: expectedV2.events,
  evidence: expectedV2.evidence,
  market_access_records: 8,
  reserve_reports: expectedV2.reserve_reports,
  known_unknowns: expectedV2.known_unknowns,
  regulatory_notes: expectedV2.regulatory_notes,
  deployments: expectedV2.deployments,
  legal_profiles: expectedV3.legal_profiles,
  stable_asset_relationships: expectedV3.stable_asset_relationships,
  reserve_components: expectedV3.reserve_components,
  income_profiles: expectedV3.income_profiles
};

write('docs/migration/current-canonical-checkpoint.json', {
  schema_version: '1.0',
  status: 'reviewed_growth_checkpoint',
  checkpoint_id: canonicalCheckpointId,
  checkpoint_kind: 'controlled_growth_checkpoint',
  recorded_at: '2026-07-25',
  source_commit: 'pr467-record-growth-batch-3',
  asset_count: expectedCounts.assets,
  source_checkpoint_id: previousCanonicalCheckpointId,
  previous_checkpoint_id: previousCanonicalCheckpointId,
  growth_pr: 467,
  expected_counts: expectedCounts,
  counts: {
    ...expectedCounts,
    evidence_relations: expectedV2.evidence_relations,
    classifications: expectedV2.classifications,
    profiles: expectedV2.profiles,
    event_details: expectedV2.event_details,
    archive_index_count: 442,
    archive_not_recorded_count: 129
  },
  evidence_quality: {
    archive_index_count: 442,
    archive_not_recorded_count: 129,
    selected_for_review: 6,
    canonical_changes: 2,
    reviewed_no_safe_change: 0,
    new_evidence_records: 6
  },
  audit: {
    source_pr: 467,
    source_authority_pr: 466,
    source_candidate_audit_pr: 427,
    source_pr_head: 'pr467-record-growth-batch-3',
    completed_at: '2026-07-25',
    selected_context: 'quantoz_regulated_non_eur_expansion',
    selected_assets: ['sog_st_plnq', 'sog_st_gbpq'],
    added_assets: 2,
    added_evidence: 6,
    added_deployments: 2,
    market_access_change: 0,
    public_surface_change: 0,
    automatic_promotion: false,
    review_gate_after_pr467: true
  },
  notes: 'Reviewed controlled-growth checkpoint after PR #467. PLNQ and GBPQ were added as complete records under the existing Quantoz issuer, with only verified Ethereum deployments and explicit unknowns.'
});

write('docs/migration/current-stats-history-checkpoint.json', {
  schema_version: '1.0',
  status: 'reviewed_growth_checkpoint',
  checkpoint_id: statsCheckpointId,
  checkpoint_kind: 'controlled_growth_checkpoint',
  recorded_at: '2026-07-25',
  registry_version: 'pr467-record-growth-batch-3',
  asset_count: 116,
  source_checkpoint_id: previousStatsCheckpointId,
  canonical_checkpoint_id: canonicalCheckpointId,
  previous_history_checkpoint_id: previousStatsCheckpointId,
  growth_pr: 467,
  notes: 'Reviewed controlled-growth checkpoint for PR #467. It adds exactly PLNQ and GBPQ, advances canonical assets from 114 to 116, preserves eight Market Access Records, and stops at REVIEW GATE.'
});

{
  const previous = read('docs/migration/registry-v3-parity-baseline.json');
  write('docs/migration/registry-v3-parity-baseline.json', {
    ...previous,
    baseline_id: 'sog_registry_v3_parity_pr467_116_assets_2026_07_25',
    recorded_at: '2026-07-25',
    data_checkpoint_commit: 'pr467-record-growth-batch-3',
    source_baseline_id: previous.baseline_id,
    canonical_checkpoint_id: canonicalCheckpointId,
    expected_v2_counts: expectedV2,
    expected_v3_counts: expectedV3,
    expected_v3_coverage: {
      legal_profiles: 116,
      income_profiles: 116,
      reserve_component_assets: 116,
      deployment_view_assets: 116
    },
    notes: 'Current parity baseline binds PR #467 controlled growth from 114 to 116 assets. PLNQ and GBPQ receive complete v2/v3 records while Market Access and public-surface semantics remain unchanged.'
  });
}

{
  const previous = read('docs/migration/registry-release-integrity-baseline.json');
  write('docs/migration/registry-release-integrity-baseline.json', {
    ...previous,
    baseline_id: 'sog_release_integrity_pr467_116_assets_2026_07_25',
    recorded_at: '2026-07-25',
    source_checkpoint_commit: 'pr467-record-growth-batch-3',
    expected_v2_counts: expectedV2,
    expected_v3_counts: expectedV3,
    expected_public_record_counts: {
      primary_records: 116,
      events: 191,
      evidence: 571
    },
    expected_public_breakdown_counts: {
      stablecoins: 116,
      organizations: 107,
      relationships: 128,
      evidence_relations: 571,
      reserve_reports: 124,
      known_unknowns: 337,
      regulatory_notes: 9,
      deployments: 182
    },
    expected_route_counts: {
      stablecoin_detail: 116,
      organization_detail: 107,
      event_detail: 191,
      total_detail: 414,
      declared_main_routes: previous.expected_route_counts.declared_main_routes
    },
    evidence_quality: {
      archive_index_count: 442,
      archive_not_recorded_count: 129,
      selected_for_review: 6,
      canonical_change_assets: 2,
      reviewed_no_safe_change_assets: 0,
      new_evidence_records: 6
    }
  });
}

{
  const deploymentView = read('docs/migration/registry-v3-view-67.json');
  deploymentView.minimum_count = expectedV3.deployment_view;
  write('docs/migration/registry-v3-view-67.json', deploymentView);
}

{
  const migrationAudit = read('docs/migration/registry-v3-migration-audit.json');
  migrationAudit.minimum_counts = {
    ...migrationAudit.minimum_counts,
    legal_profiles: expectedV3.legal_profiles,
    stable_asset_relationships: expectedV3.stable_asset_relationships,
    reserve_components: expectedV3.reserve_components,
    deployments: expectedV3.deployment_view,
    income_profiles: expectedV3.income_profiles
  };
  migrationAudit.coverage = {
    ...migrationAudit.coverage,
    protected_stablecoins: expectedV2.stablecoins
  };
  write('docs/migration/registry-v3-migration-audit.json', migrationAudit);
}

{
  const provenance = read('data/generated/build-provenance.json');
  provenance.source_commit = 'unknown';
  provenance.source_branch = 'main';
  provenance.generated_at = '1970-01-01T00:00:00.000Z';
  provenance.canonical_data_hash = 'sha256:0000000000000000000000000000000000000000000000000000000000000000';
  provenance.canonical_file_count = 0;
  provenance.canonical_record_counts = {
    ...expectedV2,
    legal_profiles: expectedV3.legal_profiles,
    stable_asset_relationships: expectedV3.stable_asset_relationships,
    reserve_components: expectedV3.reserve_components,
    income_profiles: expectedV3.income_profiles
  };
  provenance.route_counts = {
    stablecoin_detail: 116,
    organization_detail: 107,
    event_detail: 191,
    total_detail: 414,
    declared_main_routes: 13
  };
  write('data/generated/build-provenance.json', provenance);
}

write('docs/migration/record-growth-batch-3-pr467-handoff.json', {
  schema_version: '1.0',
  handoff_id: 'sog_record_growth_batch_3_pr467_handoff_2026_07_25',
  status: 'reviewed_complete',
  recorded_at: '2026-07-25',
  source_pr: 467,
  authority_pr: 466,
  candidate_audit_pr: 427,
  selected_context_id: 'quantoz_regulated_non_eur_expansion',
  promoted_assets: [
    { candidate_id: 'sog_cand_pr427_plnq', stablecoin_id: 'sog_st_plnq', symbol: 'PLNQ' },
    { candidate_id: 'sog_cand_pr427_gbpq', stablecoin_id: 'sog_st_gbpq', symbol: 'GBPQ' }
  ],
  canonical_counts: {
    assets: 116,
    organizations: 107,
    relationships: 128,
    events: 191,
    evidence: 571,
    evidence_relations: 571,
    reserve_reports: 124,
    known_unknowns: 337,
    deployments: 182,
    legal_profiles: 116,
    stable_asset_relationships: 5,
    reserve_components: 149,
    income_profiles: 116,
    market_access_records: 8,
    archive_recorded: 442,
    archive_not_recorded: 129
  },
  verified_deployments: {
    PLNQ: [{ network: 'ethereum', contract: '0x00B81d7B21955837890d9346e4978b6b43762b3A' }],
    GBPQ: [{ network: 'ethereum', contract: '0xb92e69fd39bf33ee1f81e56b0b7933bdc49df46e' }]
  },
  preserved_boundaries: {
    third_asset_added: false,
    quantoz_organization_reused: true,
    future_network_announcement_promoted: false,
    market_access_change: false,
    public_surface_change: false,
    ui_change: false,
    automatic_promotion: false,
    ranking: false,
    score: false,
    recommendation: false
  },
  next_work_item: 'REVIEW_GATE'
});

const { generateCurrentHistorySnapshot } = await import('./stats/build-history-snapshot.mjs');
const snapshot = generateCurrentHistorySnapshot({ root: process.cwd() });
const history = read('data/stats-history.json');
const index = history.snapshots.findIndex((row) => row.checkpoint_id === snapshot.checkpoint_id);
if (index >= 0) history.snapshots[index] = snapshot;
else history.snapshots.push(snapshot);
write('data/stats-history.json', history);

console.log(JSON.stringify({
  ok: true,
  canonical_checkpoint_id: canonicalCheckpointId,
  stats_checkpoint_id: statsCheckpointId,
  counts: expectedV2,
  v3_counts: expectedV3,
  history_snapshot_sha256: snapshot.snapshot_sha256
}, null, 2));
