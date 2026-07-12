import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildReviewedRecordDepthBaseline } from './build-reviewed-record-depth-baseline-pr353.mjs';

const root = process.cwd();
const CONFIG_PATH = 'config/tier-a-dossier-batch-1-pr354.json';
const SOURCE_QUEUE_PATH = 'docs/migration/tier-a-candidate-queue-pr353.json';
const SOURCE_SUMMARY_PATH = 'docs/migration/record-depth-baseline-pr353-summary.json';
const PROFILE_OVERRIDE_PATH = 'data/stablecoin-profiles-pr354-tier-a-batch-1.json';
const LEGAL_BASE_PATH = 'data/legal-profiles-v3.json';
const LEGAL_D1_PATH = 'data/legal-profiles-v3-batch-d1.json';
const EVIDENCE_EXTRA_PATH = 'data/evidence-extra.json';
const EVIDENCE_PR354_PATH = 'data/evidence-pr354-tier-a-batch-1.json';

const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const hashInputs = (files) => {
  const digest = crypto.createHash('sha256');
  for (const file of [...files].sort()) {
    digest.update(file);
    digest.update('\0');
    digest.update(readText(file));
    digest.update('\0');
  }
  return digest.digest('hex');
};

export function buildTierABatch1Impact() {
  const config = readJson(CONFIG_PATH);
  const sourceQueue = readJson(SOURCE_QUEUE_PATH);
  const sourceSummary = readJson(SOURCE_SUMMARY_PATH);
  const currentBaseline = buildReviewedRecordDepthBaseline();
  const profileOverrides = readJson(PROFILE_OVERRIDE_PATH);
  const legalProfiles = [...readJson(LEGAL_BASE_PATH), ...readJson(LEGAL_D1_PATH)];
  const evidenceRows = [...readJson(EVIDENCE_EXTRA_PATH), ...readJson(EVIDENCE_PR354_PATH)];

  const queueBySlug = new Map(sourceQueue.candidates.map((row) => [row.asset_slug, row]));
  const currentBySlug = new Map(currentBaseline.assets.map((row) => [row.asset_slug, row]));
  const legalById = new Map(legalProfiles.map((row) => [row.id, row]));
  const overrideById = new Map(profileOverrides.map((row) => [row.id, row]));
  const evidenceIds = new Set(evidenceRows.map((row) => row.id));

  const selectedAssets = config.selected_assets.map((selected) => {
    const sourceQueueRow = queueBySlug.get(selected.asset_slug);
    const current = currentBySlug.get(selected.asset_slug);
    const legal = legalById.get(selected.asset_id);
    const currentLegal = current?.dimension_states?.find((row) => row.dimension_id === 'legal_profile') ?? null;
    const currentRedemption = current?.dimension_states?.find((row) => row.dimension_id === 'redemption') ?? null;
    const override = overrideById.get(selected.asset_id) ?? null;
    const exactEvidenceIds = (legal?.evidence_ids ?? []).filter((id) => id.endsWith('_pr354') || id.startsWith('sog_src_rlusd_'));

    return {
      asset_id: selected.asset_id,
      asset_slug: selected.asset_slug,
      source_queue_reasons: sourceQueueRow?.reasons ?? [],
      historical_material_dossier_gaps: sourceQueueRow?.material_dossier_gaps ?? [],
      target_dimensions: selected.target_dimensions,
      current_planning_states: {
        legal_profile: currentLegal?.state ?? null,
        redemption: currentRedemption?.state ?? null
      },
      legal_profile: legal ? {
        classification_count: legal.classifications?.length ?? 0,
        classifications: (legal.classifications ?? []).map((entry) => ({
          classification: entry.classification,
          jurisdiction: entry.jurisdiction ?? null,
          confidence: entry.confidence ?? null,
          evidence_ids: [...(entry.evidence_ids ?? [])]
        })),
        holder_claim_type: legal.holder_claim_type,
        reserve_ownership: legal.reserve_ownership,
        reserve_segregation: legal.reserve_segregation,
        bankruptcy_remoteness: legal.bankruptcy_remoteness,
        licensed_or_regulated_as: [...(legal.licensed_or_regulated_as ?? [])],
        exact_evidence_ids: exactEvidenceIds,
        exact_evidence_present: exactEvidenceIds.every((id) => evidenceIds.has(id) || id.startsWith('sog_src_rlusd_'))
      } : null,
      redemption_override: override ? {
        status: override.redemption_profile.status,
        settlement_asset: override.redemption_profile.settlement_asset ?? null,
        retail_access: override.redemption_profile.retail_access ?? null,
        institutional_access: override.redemption_profile.institutional_access ?? null,
        as_of_date: override.redemption_profile.as_of_date ?? null,
        confidence: override.redemption_profile.confidence ?? null,
        evidence_ids: [...(override.redemption_profile.evidence_ids ?? [])]
      } : null
    };
  });

  const inputFiles = [
    CONFIG_PATH,
    SOURCE_QUEUE_PATH,
    SOURCE_SUMMARY_PATH,
    PROFILE_OVERRIDE_PATH,
    LEGAL_BASE_PATH,
    LEGAL_D1_PATH,
    EVIDENCE_EXTRA_PATH,
    EVIDENCE_PR354_PATH
  ];

  return {
    schema_version: '1.0',
    report_id: 'sog_tier_a_dossier_batch_1_pr354_impact',
    status: 'deterministic_internal_impact_report',
    public_output: false,
    review_pr: 354,
    source_baseline_id: sourceSummary.baseline_id,
    source_baseline_input_digest_sha256: sourceSummary.input_digest_sha256,
    current_baseline_input_digest_sha256: currentBaseline.input_digest_sha256,
    selected_asset_count: selectedAssets.length,
    selected_asset_slugs: selectedAssets.map((row) => row.asset_slug),
    expected_legal_profile_target_count: 5,
    expected_redemption_override_count: 2,
    current_baseline_summary: currentBaseline.summary,
    selected_assets: selectedAssets,
    constraints: {
      canonical_asset_count_expected: 110,
      canonical_asset_count_actual: currentBaseline.asset_count,
      market_access_record_count_expected: 0,
      new_public_surface_allowed: false,
      asset_rank: false,
      single_composite_score: false
    },
    input_digest_sha256: hashInputs(inputFiles)
  };
}

export function serializeTierABatch1Impact(report) {
  return `${JSON.stringify(report, null, 2)}\n`;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const report = buildTierABatch1Impact();
  const serialized = serializeTierABatch1Impact(report);
  const outputPath = process.argv[2];
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
    fs.writeFileSync(path.resolve(outputPath), serialized);
    console.log(outputPath);
  } else {
    process.stdout.write(serialized);
  }
}
