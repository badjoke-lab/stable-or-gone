import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { generateCurrentHistorySnapshot } from './stats/build-history-snapshot.mjs';

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const write = (file, value) => {
  const absolute = path.join(root, file);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, `${JSON.stringify(value, null, 2)}\n`);
};
const copyToArtifact = (file) => {
  const source = path.join(root, file);
  const target = path.join(root, 'artifacts/pr517-generated-state', file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
};

export function buildPr517GeneratedState() {
  const canonicalCheckpoint = {
    schema_version: '1.0',
    status: 'reviewed_growth_checkpoint',
    checkpoint_id: 'sog_pr517_record_growth_batch_5_bison_eub_usb_119_2026_08_03',
    checkpoint_kind: 'record_growth_checkpoint',
    recorded_at: '2026-08-03',
    captured_at: '2026-08-03',
    source_commit: 'pr517-record-growth-batch-5-bison-eub-usb',
    asset_count: 119,
    source_checkpoint_id: 'sog_pr506_evidence_archive_payload_verification_117_2026_08_01',
    previous_checkpoint_id: 'sog_pr506_evidence_archive_payload_verification_117_2026_08_01',
    growth_pr: 517,
    authority_pr: 516,
    candidate_audit_pr: 515,
    selected_candidate_ids: ['sog_cand_pr515_bison_eub', 'sog_cand_pr515_bison_usb'],
    promoted_stablecoin_ids: ['sog_st_bison_eub', 'sog_st_bison_usb'],
    expected_counts: {
      assets: 119,
      organizations: 109,
      relationships: 131,
      events: 194,
      evidence: 584,
      market_access_records: 8,
      reserve_reports: 127,
      known_unknowns: 352,
      regulatory_notes: 9,
      deployments: 186,
      legal_profiles: 119,
      stable_asset_relationships: 5,
      reserve_components: 153,
      income_profiles: 119
    },
    counts: {
      assets: 119,
      organizations: 109,
      relationships: 131,
      events: 194,
      evidence: 584,
      evidence_relations: 584,
      reserve_reports: 127,
      known_unknowns: 352,
      regulatory_notes: 9,
      deployments: 186,
      market_access_records: 8,
      legal_profiles: 119,
      stable_asset_relationships: 5,
      reserve_components: 153,
      income_profiles: 119,
      archive_index_count: 462,
      archive_not_recorded_count: 122,
      detail_routes: 422,
      metadata_checked_routes: 422
    },
    growth_outcome: {
      new_assets: 2,
      new_organizations: 1,
      new_relationships: 2,
      new_events: 2,
      new_evidence: 5,
      new_deployments: 2,
      replacement_candidates: 0,
      market_access_changes: 0,
      legacy_redirect_changes: 0
    },
    record_boundary: {
      eub_exact_solana_mint: null,
      usb_exact_solana_mint: null,
      token_specific_reserve_attestations: 0,
      institutional_allowlist_restrictions_recorded: 2,
      unsupported_values_preserved_as_known_unknowns: true,
      next_boundary: 'REVIEW_GATE'
    },
    release_integrity_baseline_id: 'sog_release_integrity_pr517_119_assets_2026_08_03',
    reproducible_build_baseline_id: 'sog_reproducible_build_pr317_2026_07_06',
    notes: 'Current deterministic canonical checkpoint after PR #517 complete-record promotion of Bison Bank EUB and USB. Both assets are restricted institutional electronic-money tokens. Exact Solana mint identities and token-specific reserve assurance remain unknown. Market Access, UI route families, and the legacy redirect are unchanged.'
  };
  write('docs/migration/current-canonical-checkpoint.json', canonicalCheckpoint);

  const reviewCheckpoint = {
    schema_version: '1.0',
    status: 'reviewed_growth_checkpoint',
    checkpoint_id: 'sog_pr517_record_growth_batch_5_bison_eub_usb_review_2026_08_03',
    checkpoint_kind: 'record_growth_review_checkpoint',
    recorded_at: '2026-08-03',
    source_pr: 517,
    authority_pr: 516,
    source_audit_pr: 515,
    source_work_item: 'record_growth_batch_5_bison_eub_usb_complete_records',
    source_review: 'data/editorial-research/record-growth-batch-5-bison-eub-usb-pr517-source-review.json',
    source_canonical_checkpoint_id: canonicalCheckpoint.checkpoint_id,
    source_growth_checkpoint_id: canonicalCheckpoint.checkpoint_id,
    stats_checkpoint_id: 'sog_stats_pr517_record_growth_batch_5_bison_eub_usb_2026_08_03',
    canonical_counts_unchanged: false,
    counts: {
      assets: 119,
      organizations: 109,
      events: 194,
      evidence: 584,
      reserve_reports: 127,
      known_unknowns: 352,
      deployments: 186,
      detail_routes: 422
    },
    reviewed_stablecoin_ids: ['sog_st_bison_eub', 'sog_st_bison_usb'],
    reviewed_known_unknown_ids: [
      'sog_ku_bison_eub_solana_mint_pr517',
      'sog_ku_bison_eub_first_issuance_pr517',
      'sog_ku_bison_eub_reserves_pr517',
      'sog_ku_bison_eub_access_fees_pr517',
      'sog_ku_bison_eub_controls_pr517',
      'sog_ku_bison_usb_solana_mint_pr517',
      'sog_ku_bison_usb_first_issuance_pr517',
      'sog_ku_bison_usb_reserves_pr517',
      'sog_ku_bison_usb_access_fees_pr517',
      'sog_ku_bison_usb_controls_pr517'
    ],
    new_canonical_records: 2,
    deleted_known_unknowns: 0,
    forced_resolutions: 0,
    exit_boundary: 'REVIEW_GATE'
  };
  write('docs/migration/current-review-checkpoint.json', reviewCheckpoint);

  const statsCheckpoint = {
    schema_version: '1.0',
    status: 'reviewed_growth_checkpoint',
    checkpoint_id: 'sog_stats_pr517_record_growth_batch_5_bison_eub_usb_2026_08_03',
    checkpoint_kind: 'controlled_growth_checkpoint',
    recorded_at: '2026-08-03',
    registry_version: 'pr517-record-growth-batch-5-bison-eub-usb',
    asset_count: 119,
    source_checkpoint_id: 'sog_stats_pr506_evidence_archive_payload_verification_2026_08_01',
    canonical_checkpoint_id: canonicalCheckpoint.checkpoint_id,
    previous_history_checkpoint_id: 'sog_stats_pr506_evidence_archive_payload_verification_2026_08_01',
    growth_pr: 517,
    source_pr: 515,
    authority_pr: 516,
    source_commit: 'pr517-record-growth-batch-5-bison-eub-usb',
    captured_at: '2026-08-03',
    expected_totals: {
      assets: 119,
      organizations: 109,
      relationships: 131,
      events: 194,
      evidence: 584,
      deployments: 186,
      market_access_records: 8,
      detail_routes: 422
    },
    notes: 'Reviewed controlled-growth checkpoint for PR #517. It adds complete records for restricted institutional EUB and USB while preserving unresolved exact mint, reserve assurance, and access details.'
  };
  write('docs/migration/current-stats-history-checkpoint.json', statsCheckpoint);

  const freshness = read('data/quality/facet-freshness-contract-v1.json');
  freshness.as_of_date = '2026-08-03';
  freshness.review_checkpoint_id = reviewCheckpoint.checkpoint_id;
  freshness.output_contract.asset_count = 119;
  freshness.output_contract.dimension_count = 19;
  freshness.output_contract.cell_count = 2261;
  freshness.output_contract.next_pr = 518;
  write('data/quality/facet-freshness-contract-v1.json', freshness);

  const history = read('data/stats-history.json');
  history.snapshots = history.snapshots.filter((row) => row.checkpoint_id !== statsCheckpoint.checkpoint_id);
  const snapshot = generateCurrentHistorySnapshot({ root });
  history.snapshots.push(snapshot);
  write('data/stats-history.json', history);

  for (const file of [
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-review-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'data/quality/facet-freshness-contract-v1.json',
    'data/stats-history.json'
  ]) copyToArtifact(file);

  return { canonicalCheckpoint, reviewCheckpoint, statsCheckpoint, snapshot };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = buildPr517GeneratedState();
  console.log(JSON.stringify({
    ok: true,
    checkpoint_id: result.canonicalCheckpoint.checkpoint_id,
    stats_checkpoint_id: result.statsCheckpoint.checkpoint_id,
    snapshot_sha256: result.snapshot.snapshot_sha256,
    assets: result.snapshot.totals.assets,
    evidence: result.snapshot.totals.evidence,
    detail_routes: 422
  }, null, 2));
}
