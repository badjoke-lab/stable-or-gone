import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRecordDepthBaseline } from './build-record-depth-baseline-pr353.mjs';

const root = process.cwd();
const CONFIG_PATH = 'config/record-depth-baseline-v1.json';
const PRESETS_PATH = 'config/compare-v1-presets.json';

const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));

function refineCandidateQueue(assets, config, presetSlugs) {
  const policy = config.queue_policy;
  const materialDimensions = new Set(policy.material_dossier_gap_dimensions);
  const queue = [];

  for (const asset of assets) {
    const flags = {
      ...asset.product_leverage_flags,
      comparison_preset_member: presetSlugs.has(asset.asset_slug)
    };
    const materialGaps = asset.priority_gaps.filter((dimensionId) => materialDimensions.has(dimensionId));
    const reasons = [];

    if (
      policy.eligible_if_historical_and_gapped
      && flags.historical_importance
      && materialGaps.length >= policy.historical_material_gap_min
    ) reasons.push('historical_importance_with_multiple_material_dossier_gaps');

    if (
      policy.eligible_if_compare_and_evidence_leverage
      && flags.compare_leverage
      && flags.evidence_maintenance_leverage
    ) reasons.push('comparison_and_evidence_maintenance_leverage');

    if (
      policy.eligible_if_comparison_preset_member_and_gapped
      && flags.comparison_preset_member
      && materialGaps.length >= policy.comparison_preset_material_gap_min
    ) reasons.push('comparison_preset_member_with_material_dossier_gap');

    if (
      policy.eligible_if_regional_and_gapped
      && flags.regional_relevance
      && materialGaps.length >= policy.regional_material_gap_min
    ) reasons.push('regional_relevance_with_multiple_material_dossier_gaps');

    if (reasons.length === 0) continue;

    queue.push({
      asset_id: asset.asset_id,
      asset_slug: asset.asset_slug,
      asset_name: asset.asset_name,
      symbol: asset.symbol,
      reasons: reasons.sort(),
      priority_gaps: asset.priority_gaps,
      material_dossier_gaps: materialGaps.sort(),
      product_leverage_flags: flags
    });
  }

  return queue.sort((left, right) => left.asset_slug.localeCompare(right.asset_slug));
}

export function buildReviewedRecordDepthBaseline() {
  const config = readJson(CONFIG_PATH);
  const presets = readJson(PRESETS_PATH);
  const base = buildRecordDepthBaseline();
  const presetSlugs = new Set((presets.presets ?? []).flatMap((preset) => preset.asset_slugs ?? []));
  const assets = base.assets.map((asset) => ({
    ...asset,
    product_leverage_flags: {
      ...asset.product_leverage_flags,
      comparison_preset_member: presetSlugs.has(asset.asset_slug)
    }
  }));
  const tierACandidateQueue = refineCandidateQueue(assets, config, presetSlugs);
  const inputDigest = crypto.createHash('sha256')
    .update(base.input_digest_sha256)
    .update('\0')
    .update(PRESETS_PATH)
    .update('\0')
    .update(readText(PRESETS_PATH))
    .digest('hex');

  return {
    ...base,
    input_digest_sha256: inputDigest,
    source_contracts: {
      ...base.source_contracts,
      comparison_preset_config_id: presets.config_id,
      comparison_preset_source: PRESETS_PATH
    },
    summary: {
      ...base.summary,
      tier_a_candidate_count: tierACandidateQueue.length
    },
    assets,
    tier_a_candidate_queue: tierACandidateQueue,
    queue_order: config.queue_policy.order
  };
}

export function serializeReviewedRecordDepthBaseline(baseline) {
  return `${JSON.stringify(baseline, null, 2)}\n`;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const baseline = buildReviewedRecordDepthBaseline();
  const serialized = serializeReviewedRecordDepthBaseline(baseline);
  const outputPath = process.argv[2];
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
    fs.writeFileSync(path.resolve(outputPath), serialized);
    console.log(outputPath);
  } else {
    process.stdout.write(serialized);
  }
}
