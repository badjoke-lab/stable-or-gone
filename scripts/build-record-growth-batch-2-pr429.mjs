import fs from 'node:fs';

const read = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const write = (path, value) => fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);

const canonicalCheckpointId = 'sog_record_growth_batch_2_canonical_114_checkpoint_pr429_2026_07_18';
const statsCheckpointId = 'sog_record_growth_batch_2_114_checkpoint_pr429_2026_07_18';
const previousStatsCheckpointId = 'sog_evidence_archive_maintenance_batch_7_112_checkpoint_pr400_2026_07_16';
const expectedV2 = {
  stablecoins: 114,
  organizations: 107,
  relationships: 126,
  classifications: 114,
  profiles: 114,
  events: 189,
  event_details: 189,
  evidence: 565,
  evidence_relations: 565,
  reserve_reports: 122,
  known_unknowns: 331,
  regulatory_notes: 9,
  deployments: 180
};
const expectedV3 = {
  legal_profiles: 114,
  stable_asset_relationships: 5,
  reserve_components: 147,
  income_profiles: 114,
  deployment_view: 180
};

write('docs/migration/current-canonical-checkpoint.json', {
  schema_version: '1.0',
  status: 'reviewed_growth_checkpoint',
  checkpoint_id: canonicalCheckpointId,
  checkpoint_kind: 'controlled_growth_checkpoint',
  recorded_at: '2026-07-18',
  source_commit: 'pr429-record-growth-batch-2',
  counts: {
    assets: 114,
    organizations: 107,
    relationships: 126,
    events: 189,
    evidence: 565,
    evidence_relations: 565,
    reserve_reports: 122,
    known_unknowns: 331,
    regulatory_notes: 9,
    deployments: 180,
    legal_profiles: 114,
    stable_asset_relationships: 5,
    reserve_components: 147,
    income_profiles: 114,
    market_access_records: 8,
    archive_index_count: 436,
    archive_not_recorded_count: 129
  },
  audit: {
    source_pr: 429,
    source_authority_pr: 428,
    source_candidate_audit_pr: 427,
    source_pr_head: 'pr429-record-growth-batch-2',
    completed_at: '2026-07-18',
    selected_context: 'allunity_regulated_non_eur_expansion',
    selected_assets: ['sog_st_chfau', 'sog_st_sekau'],
    added_assets: 2,
    added_evidence: 6,
    added_deployments: 6,
    market_access_change: 0,
    public_surface_change: 0,
    automatic_promotion: false,
    review_gate_after_pr429: true
  }
});

write('docs/migration/current-stats-history-checkpoint.json', {
  schema_version: '1.0',
  status: 'reviewed_growth_checkpoint',
  checkpoint_id: statsCheckpointId,
  checkpoint_kind: 'controlled_growth_checkpoint',
  recorded_at: '2026-07-18',
  registry_version: 'pr429-record-growth-batch-2',
  asset_count: 114,
  source_checkpoint_id: previousStatsCheckpointId,
  canonical_checkpoint_id: canonicalCheckpointId,
  previous_history_checkpoint_id: previousStatsCheckpointId,
  growth_pr: 429,
  notes: 'Reviewed controlled-growth checkpoint for PR #429. It adds the exact CHFAU and SEKAU records, advances canonical assets from 112 to 114, preserves eight Market Access Records, and stops at a mandatory review gate.'
});

{
  const previous = read('docs/migration/registry-v3-parity-baseline.json');
  write('docs/migration/registry-v3-parity-baseline.json', {
    ...previous,
    baseline_id: 'sog_registry_v3_parity_pr429_114_assets_2026_07_18',
    recorded_at: '2026-07-18',
    data_checkpoint_commit: 'pr429-record-growth-batch-2',
    source_baseline_id: previous.baseline_id,
    canonical_checkpoint_id: canonicalCheckpointId,
    expected_v2_counts: expectedV2,
    expected_v3_counts: expectedV3,
    expected_v3_coverage: {
      legal_profiles: 114,
      income_profiles: 114,
      reserve_component_assets: 114,
      deployment_view_assets: 114
    },
    notes: 'Current parity baseline binds PR #429 controlled growth from 112 to 114 assets. CHFAU and SEKAU receive complete v2/v3 records while Market Access and public-surface semantics remain unchanged.'
  });
}

{
  const previous = read('docs/migration/registry-release-integrity-baseline.json');
  write('docs/migration/registry-release-integrity-baseline.json', {
    ...previous,
    baseline_id: 'sog_release_integrity_pr429_114_assets_2026_07_18',
    recorded_at: '2026-07-18',
    source_checkpoint_commit: 'pr429-record-growth-batch-2',
    expected_v2_counts: expectedV2,
    expected_v3_counts: expectedV3,
    expected_public_record_counts: {
      primary_records: 114,
      events: 189,
      evidence: 565
    },
    expected_public_breakdown_counts: {
      stablecoins: 114,
      organizations: 107,
      relationships: 126,
      evidence_relations: 565,
      reserve_reports: 122,
      known_unknowns: 331,
      regulatory_notes: 9,
      deployments: 180
    },
    expected_route_counts: {
      stablecoin_detail: 114,
      organization_detail: 107,
      event_detail: 189,
      total_detail: 410,
      declared_main_routes: previous.expected_route_counts.declared_main_routes
    },
    evidence_quality: {
      archive_index_count: 436,
      archive_not_recorded_count: 129,
      selected_for_review: 6,
      canonical_change_assets: 2,
      reviewed_no_safe_change_assets: 0,
      new_evidence_records: 6
    }
  });
}

write('docs/migration/record-growth-batch-2-pr429-handoff.json', {
  schema_version: '1.0',
  handoff_id: 'sog_record_growth_batch_2_pr429_handoff_2026_07_18',
  status: 'reviewed_complete',
  recorded_at: '2026-07-18',
  source_pr: 429,
  authority_pr: 428,
  candidate_audit_pr: 427,
  selected_context_id: 'allunity_regulated_non_eur_expansion',
  promoted_assets: [
    { candidate_id: 'sog_cand_pr427_chfau', stablecoin_id: 'sog_st_chfau', symbol: 'CHFAU' },
    { candidate_id: 'sog_cand_pr427_sekau', stablecoin_id: 'sog_st_sekau', symbol: 'SEKAU' }
  ],
  canonical_counts: {
    assets: 114,
    organizations: 107,
    relationships: 126,
    events: 189,
    evidence: 565,
    evidence_relations: 565,
    reserve_reports: 122,
    known_unknowns: 331,
    deployments: 180,
    legal_profiles: 114,
    stable_asset_relationships: 5,
    reserve_components: 147,
    income_profiles: 114,
    market_access_records: 8,
    archive_recorded: 436,
    archive_not_recorded: 129
  },
  verified_deployments: {
    CHFAU: ['ethereum', 'tempo'],
    SEKAU: ['ethereum', 'polygon', 'base', 'solana']
  },
  preserved_boundaries: {
    third_asset_added: false,
    allunity_organization_reused: true,
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
