import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildReviewedRecordDepthBaseline } from './build-reviewed-record-depth-baseline-pr353.mjs';

const root = process.cwd();
const paths = {
  config: 'config/tier-a-dossier-batch-2-pr355.json',
  queue: 'docs/migration/tier-a-candidate-queue-pr353.json',
  summary: 'docs/migration/record-depth-baseline-pr353-summary.json',
  priorHandoff: 'docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json',
  profileOverrides: 'data/stablecoin-profiles-pr355-tier-a-batch-2.json',
  legalBase: 'data/legal-profiles-v3.json',
  legalBatchB: 'data/legal-profiles-v3-batch-b.json',
  legalBatchD1: 'data/legal-profiles-v3-batch-d1.json',
  evidence: 'data/evidence-pr355-tier-a-batch-2.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json'
};
const reviewedExistingEvidenceIds = new Set([
  'sog_src_fdusd_site',
  'sog_src_pyusd_paxos_page',
  'sog_src_usdp_paxos_page',
  'sog_src_ust_sec_2023_32'
]);
const unresolvedLegalValues = new Set(['unclassified', 'unknown', 'not_recorded', 'source_review_needed', 'unclear']);

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

function reviewedLegalPlanningState(legal, fallback) {
  if (!legal) return fallback;
  const classifications = legal.classifications ?? [];
  const completeClassifications = classifications.length > 0 && classifications.every((entry) => (
    typeof entry.classification === 'string'
    && !unresolvedLegalValues.has(entry.classification)
    && typeof entry.jurisdiction === 'string'
    && entry.jurisdiction.length > 0
    && ['high', 'medium'].includes(entry.confidence)
    && Array.isArray(entry.evidence_ids)
    && entry.evidence_ids.length > 0
  ));
  const completeCore = [
    legal.holder_claim_type,
    legal.reserve_ownership,
    legal.reserve_segregation,
    legal.bankruptcy_remoteness
  ].every((value) => typeof value === 'string' && !unresolvedLegalValues.has(value));
  const hasEvidence = Array.isArray(legal.evidence_ids) && legal.evidence_ids.length > 0;
  return completeClassifications && completeCore && hasEvidence ? 'usable' : fallback;
}

export function buildTierABatch2Impact() {
  const config = readJson(paths.config);
  const queue = readJson(paths.queue);
  const summary = readJson(paths.summary);
  const priorHandoff = readJson(paths.priorHandoff);
  const profileOverrides = readJson(paths.profileOverrides);
  const legalProfiles = [
    ...readJson(paths.legalBase),
    ...readJson(paths.legalBatchB),
    ...readJson(paths.legalBatchD1)
  ];
  const evidence = readJson(paths.evidence);
  const checkpoint = readJson(paths.checkpoint);
  const currentBaseline = buildReviewedRecordDepthBaseline({ profileOverrideFiles: [paths.profileOverrides] });

  const queueBySlug = new Map(queue.candidates.map((row) => [row.asset_slug, row]));
  const currentBySlug = new Map(currentBaseline.assets.map((row) => [row.asset_slug, row]));
  const legalById = new Map(legalProfiles.map((row) => [row.id, row]));
  const overrideById = new Map(profileOverrides.map((row) => [row.id, row]));
  const newEvidenceIds = new Set(evidence.map((row) => row.id));

  const selectedAssets = config.selected_assets.map((selected) => {
    const queueRow = queueBySlug.get(selected.asset_slug);
    const current = currentBySlug.get(selected.asset_slug);
    const legal = legalById.get(selected.asset_id);
    const override = overrideById.get(selected.asset_id) ?? null;
    const dimension = (id) => current?.dimension_states?.find((row) => row.dimension_id === id)?.state ?? null;
    const exactEvidenceIds = [...new Set([
      ...(legal?.evidence_ids ?? []),
      ...(legal?.classifications ?? []).flatMap((entry) => entry.evidence_ids ?? []),
      ...(override?.redemption_profile?.evidence_ids ?? [])
    ].filter((id) => id.endsWith('_pr355') || reviewedExistingEvidenceIds.has(id)))].sort();

    return {
      asset_id: selected.asset_id,
      asset_slug: selected.asset_slug,
      source_queue_reasons: queueRow?.reasons ?? [],
      historical_material_dossier_gaps: queueRow?.material_dossier_gaps ?? [],
      target_dimensions: selected.target_dimensions,
      current_planning_states: {
        legal_profile: reviewedLegalPlanningState(legal, dimension('legal_profile')),
        redemption: dimension('redemption')
      },
      legal_profile: legal ? {
        classifications: (legal.classifications ?? []).map((entry) => ({
          classification: entry.classification,
          jurisdiction: entry.jurisdiction ?? null,
          confidence: entry.confidence ?? null,
          evidence_ids: [...(entry.evidence_ids ?? [])]
        })),
        holder_claim_type: legal.holder_claim_type,
        claim_against_organization_ids: [...(legal.claim_against_organization_ids ?? [])],
        reserve_ownership: legal.reserve_ownership,
        reserve_segregation: legal.reserve_segregation,
        bankruptcy_remoteness: legal.bankruptcy_remoteness,
        licensed_or_regulated_as: [...(legal.licensed_or_regulated_as ?? [])],
        evidence_ids: [...(legal.evidence_ids ?? [])]
      } : null,
      redemption_override: override ? {
        status: override.redemption_profile.status,
        settlement_asset: override.redemption_profile.settlement_asset,
        eligible_parties: override.redemption_profile.eligible_parties,
        retail_access: override.redemption_profile.retail_access ?? null,
        institutional_access: override.redemption_profile.institutional_access ?? null,
        minimum_amount_text: override.redemption_profile.minimum_amount_text ?? null,
        fee_text: override.redemption_profile.fee_text ?? null,
        settlement_time_text: override.redemption_profile.settlement_time_text ?? null,
        jurisdiction_restrictions: [...(override.redemption_profile.jurisdiction_restrictions ?? [])],
        as_of_date: override.redemption_profile.as_of_date,
        confidence: override.redemption_profile.confidence,
        evidence_ids: [...(override.redemption_profile.evidence_ids ?? [])]
      } : null,
      exact_pr355_evidence_ids: exactEvidenceIds,
      exact_pr355_evidence_present: exactEvidenceIds.length > 0 && exactEvidenceIds.every((id) => newEvidenceIds.has(id) || reviewedExistingEvidenceIds.has(id))
    };
  });

  return {
    schema_version: '1.0',
    report_id: 'sog_tier_a_dossier_batch_2_pr355_impact',
    status: 'deterministic_internal_impact_report',
    public_output: false,
    review_pr: 355,
    source_baseline_id: summary.baseline_id,
    source_baseline_input_digest_sha256: summary.input_digest_sha256,
    prior_batch_handoff_id: priorHandoff.handoff_id,
    prior_batch_merge_commit: priorHandoff.source_merge_commit,
    current_canonical_checkpoint_id: checkpoint.checkpoint_id,
    current_baseline_input_digest_sha256: currentBaseline.input_digest_sha256,
    selected_asset_count: selectedAssets.length,
    selected_asset_slugs: selectedAssets.map((row) => row.asset_slug),
    authorized_redemption_asset_slugs: [...config.authorized_redemption_asset_slugs],
    current_baseline_summary: currentBaseline.summary,
    selected_assets: selectedAssets,
    constraints: {
      canonical_asset_count_expected: 110,
      canonical_asset_count_actual: currentBaseline.asset_count,
      canonical_evidence_count_expected: 549,
      canonical_evidence_count_actual: checkpoint.expected_counts.evidence,
      market_access_record_count_expected: 0,
      completed_pr354_assets_unchanged: true,
      new_public_surface_allowed: false,
      asset_rank: false,
      single_composite_score: false
    },
    input_digest_sha256: digestFiles(Object.values(paths))
  };
}

export const serializeTierABatch2Impact = (report) => `${JSON.stringify(report, null, 2)}\n`;

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const serialized = serializeTierABatch2Impact(buildTierABatch2Impact());
  const outputPath = process.argv[2];
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
    fs.writeFileSync(path.resolve(outputPath), serialized);
    console.log(outputPath);
  } else {
    process.stdout.write(serialized);
  }
}
