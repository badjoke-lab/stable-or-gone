import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildReviewedRecordDepthBaseline } from './build-reviewed-record-depth-baseline-pr353.mjs';
import { loadStatsInput } from '../stats/load-stats-input.mjs';

const root = process.cwd();
const paths = {
  config: 'config/tier-a-dossier-batch-3-pr357.json',
  outcomes: 'docs/migration/tier-a-batch-3-pr357-review-outcomes.json',
  queue: 'docs/migration/tier-a-candidate-queue-pr353.json',
  summary: 'docs/migration/record-depth-baseline-pr353-summary.json',
  priorHandoff: 'docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json',
  legalBatchE1: 'data/legal-profiles-v3-batch-e1.json',
  legalHusd: 'data/legal-profiles-v3-husd.json',
  profilesBatchD: 'data/stablecoin-profiles-batch-d.json'
};

const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const digestFiles = (files) => {
  const digest = crypto.createHash('sha256');
  for (const file of [...files].sort()) {
    digest.update(file);
    digest.update('\0');
    digest.update(readText(file));
    digest.update('\0');
  }
  return digest.digest('hex');
};
const unique = (values) => [...new Set(values.filter(Boolean))].sort();

function compactLegal(legal) {
  if (!legal) return null;
  return {
    classifications: (legal.classifications ?? []).map((entry) => ({
      classification: entry.classification ?? null,
      jurisdiction: entry.jurisdiction ?? null,
      effective_from: entry.effective_from ?? null,
      effective_to: entry.effective_to ?? null,
      confidence: entry.confidence ?? null,
      evidence_ids: [...(entry.evidence_ids ?? [])]
    })),
    holder_claim_type: legal.holder_claim_type ?? null,
    claim_against_organization_ids: [...(legal.claim_against_organization_ids ?? [])],
    reserve_ownership: legal.reserve_ownership ?? null,
    reserve_segregation: legal.reserve_segregation ?? null,
    bankruptcy_remoteness: legal.bankruptcy_remoteness ?? null,
    licensed_or_regulated_as: [...(legal.licensed_or_regulated_as ?? [])],
    evidence_ids: [...(legal.evidence_ids ?? [])],
    notes: legal.notes ?? null
  };
}

function compactRedemption(profile) {
  const redemption = profile?.redemption_profile;
  if (!redemption) return null;
  return {
    status: redemption.status ?? null,
    settlement_asset: redemption.settlement_asset ?? null,
    eligible_parties: redemption.eligible_parties ?? null,
    retail_access: redemption.retail_access ?? null,
    institutional_access: redemption.institutional_access ?? null,
    minimum_amount_text: redemption.minimum_amount_text ?? null,
    fee_text: redemption.fee_text ?? null,
    settlement_time_text: redemption.settlement_time_text ?? null,
    jurisdiction_restrictions: [...(redemption.jurisdiction_restrictions ?? [])],
    redemption_url: redemption.redemption_url ?? null,
    as_of_date: redemption.as_of_date ?? null,
    confidence: redemption.confidence ?? null,
    evidence_ids: [...(redemption.evidence_ids ?? [])]
  };
}

export function buildTierABatch3Impact() {
  const config = readJson(paths.config);
  const outcomes = readJson(paths.outcomes);
  const queue = readJson(paths.queue);
  const summary = readJson(paths.summary);
  const handoff = readJson(paths.priorHandoff);
  const checkpoint = readJson(paths.checkpoint);
  const baseline = buildReviewedRecordDepthBaseline();
  const input = loadStatsInput(root);
  const baselineBySlug = new Map(baseline.assets.map((row) => [row.asset_slug, row]));
  const queueBySlug = new Map(queue.candidates.map((row) => [row.asset_slug, row]));
  const outcomeBySlug = new Map(outcomes.outcomes.map((row) => [row.asset_slug, row]));
  const legalById = new Map(input.legal_profiles.map((row) => [row.id, row]));
  const profileById = new Map(input.profiles.map((row) => [row.id, row]));
  const evidenceById = new Map(input.evidence.map((row) => [row.id, row]));

  const selectedAssets = config.selected_assets.map((selected) => {
    const current = baselineBySlug.get(selected.asset_slug);
    const sourceQueue = queueBySlug.get(selected.asset_slug);
    const outcome = outcomeBySlug.get(selected.asset_slug);
    const stateByDimension = new Map((current?.dimension_states ?? []).map((row) => [row.dimension_id, row]));
    const reviewedEvidenceIds = [...(outcome?.reviewed_evidence_ids ?? [])];
    const missingEvidenceIds = reviewedEvidenceIds.filter((id) => !evidenceById.has(id));
    const changedRecordFamilies = [];
    if (outcome?.changed_dimensions?.includes('legal_profile')) changedRecordFamilies.push('legal_profiles');
    if (outcome?.changed_dimensions?.includes('redemption')) changedRecordFamilies.push('stablecoin_profiles');

    return {
      asset_id: selected.asset_id,
      asset_slug: selected.asset_slug,
      source_queue_reasons: [...(sourceQueue?.reasons ?? [])],
      historical_material_dossier_gaps: [...(sourceQueue?.material_dossier_gaps ?? [])],
      target_dimensions: [...selected.target_dimensions],
      review_status: outcome?.review_status ?? null,
      changed_dimensions: [...(outcome?.changed_dimensions ?? [])],
      remaining_unresolved_dimensions: [...(outcome?.remaining_unresolved_dimensions ?? [])],
      reason_codes: [...(outcome?.reason_codes ?? [])],
      changed_record_families: unique(changedRecordFamilies),
      current_target_states: Object.fromEntries(selected.target_dimensions.map((dimension) => [dimension, stateByDimension.get(dimension)?.state ?? null])),
      current_target_reason_codes: Object.fromEntries(selected.target_dimensions.map((dimension) => [dimension, [...(stateByDimension.get(dimension)?.reason_codes ?? [])]])),
      legal_profile: compactLegal(legalById.get(selected.asset_id)),
      redemption_profile: compactRedemption(profileById.get(selected.asset_id)),
      reviewed_evidence_ids: reviewedEvidenceIds,
      missing_reviewed_evidence_ids: missingEvidenceIds,
      reviewed_evidence_present: missingEvidenceIds.length === 0,
      notes: outcome?.notes ?? null
    };
  });

  return {
    schema_version: '1.0',
    report_id: 'sog_tier_a_dossier_batch_3_pr357_impact',
    status: 'deterministic_internal_impact_report',
    public_output: false,
    review_pr: 357,
    source_baseline_id: summary.baseline_id,
    source_baseline_input_digest_sha256: summary.input_digest_sha256,
    source_queue_id: queue.baseline_id,
    prior_work_item_handoff_id: handoff.handoff_id,
    prior_work_item_merge_commit: handoff.source_merge_commit,
    current_canonical_checkpoint_id: checkpoint.checkpoint_id,
    current_baseline_input_digest_sha256: baseline.input_digest_sha256,
    selected_asset_count: selectedAssets.length,
    selected_asset_slugs: selectedAssets.map((row) => row.asset_slug),
    current_baseline_summary: baseline.summary,
    selected_assets: selectedAssets,
    aggregate_outcome: {
      reviewed_asset_count: selectedAssets.length,
      canonical_improvement_asset_count: selectedAssets.filter((row) => row.changed_dimensions.length > 0).length,
      reviewed_no_change_asset_count: selectedAssets.filter((row) => row.changed_dimensions.length === 0).length,
      changed_legal_profile_count: selectedAssets.filter((row) => row.changed_dimensions.includes('legal_profile')).length,
      changed_redemption_profile_count: selectedAssets.filter((row) => row.changed_dimensions.includes('redemption')).length,
      new_evidence_record_count: 0,
      new_event_record_count: 0,
      new_organization_record_count: 0,
      new_relationship_record_count: 0
    },
    constraints: {
      canonical_asset_count_expected: 110,
      canonical_asset_count_actual: baseline.asset_count,
      canonical_evidence_count_expected: 551,
      canonical_evidence_count_actual: checkpoint.expected_counts.evidence,
      market_access_record_count_expected: 4,
      market_access_record_count_actual: input.market_access_records.length,
      new_canonical_assets_allowed: false,
      new_public_surface_allowed: false,
      asset_rank: false,
      single_composite_score: false
    },
    input_digest_sha256: digestFiles(Object.values(paths))
  };
}

export const serializeTierABatch3Impact = (report) => `${JSON.stringify(report, null, 2)}\n`;

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const outputPath = process.argv[2];
  const serialized = serializeTierABatch3Impact(buildTierABatch3Impact());
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
    fs.writeFileSync(path.resolve(outputPath), serialized);
    console.log(outputPath);
  } else {
    process.stdout.write(serialized);
  }
}
