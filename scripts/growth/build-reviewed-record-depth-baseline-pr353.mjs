import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRecordDepthBaseline } from './build-record-depth-baseline-pr353.mjs';

const root = process.cwd();
const CONFIG_PATH = 'config/record-depth-baseline-v1.json';
const PRESETS_PATH = 'config/compare-v1-presets.json';
const FRESHNESS_CONTRACT_PATH = 'data/quality/facet-freshness-contract-v1.json';
const PLANNING_STATES = ['strong', 'usable', 'partial', 'sparse', 'absent', 'not_applicable'];
const unresolved = new Set(['unknown', 'not_recorded', 'not_applicable', 'source_review_needed', 'unclear']);

const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const isUnresolved = (value) => value == null || (typeof value === 'string' && unresolved.has(value));

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

function redemptionPlanningRow(redemption, asOfDate) {
  if (!redemption) return null;
  const compared = [redemption.status, redemption.retail_access, redemption.institutional_access, redemption.minimum_amount_text];
  if (compared.some(isUnresolved)) {
    return {
      dimension_id: 'redemption',
      state: 'partial',
      reason_codes: ['redemption_structure_incomplete_or_unknown'],
      freshness_state: redemption.as_of_date ? 'undated' : 'undated'
    };
  }

  let freshnessState = 'undated';
  if (typeof redemption.as_of_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(redemption.as_of_date)) {
    const ageDays = Math.floor((Date.parse(`${asOfDate}T00:00:00Z`) - Date.parse(`${redemption.as_of_date}T00:00:00Z`)) / 86400000);
    if (ageDays < 0) throw new Error(`Profile override date ${redemption.as_of_date} is after Record Depth as-of date ${asOfDate}`);
    freshnessState = ageDays <= 90 ? 'fresh' : ageDays <= 180 ? 'aging' : 'stale';
  }

  if (['fresh', 'aging'].includes(freshnessState)) {
    return {
      dimension_id: 'redemption',
      state: 'strong',
      reason_codes: ['redemption_structured_with_supported_freshness'],
      freshness_state: freshnessState
    };
  }
  return {
    dimension_id: 'redemption',
    state: 'usable',
    reason_codes: ['redemption_structured_but_freshness_support_limited'],
    freshness_state: freshnessState
  };
}

function applyProfileOverrides(base, profileOverrideFiles) {
  if (!profileOverrideFiles.length) return base;
  const freshnessContract = readJson(FRESHNESS_CONTRACT_PATH);
  const overrides = profileOverrideFiles.flatMap((file) => readJson(file));
  const overrideById = new Map(overrides.map((row) => [row.id, row]));

  const assets = base.assets.map((asset) => {
    const override = overrideById.get(asset.asset_id);
    if (!override) return asset;
    const patchedRedemption = redemptionPlanningRow(override.redemption_profile, freshnessContract.as_of_date);
    const dimensionStates = asset.dimension_states.map((row) => row.dimension_id === 'redemption' && patchedRedemption ? patchedRedemption : row);
    const stateByDimension = new Map(dimensionStates.map((row) => [row.dimension_id, row.state]));
    const priorityGaps = dimensionStates.filter((row) => ['partial', 'sparse', 'absent'].includes(row.state)).map((row) => row.dimension_id).sort();
    const flags = {
      ...asset.product_leverage_flags,
      compare_leverage: ['mechanism_classification', 'reserve_structure', 'redemption', 'issuance', 'comparison_readiness']
        .some((dimension) => ['partial', 'sparse', 'absent'].includes(stateByDimension.get(dimension))),
      access_regulation_leverage: ['legal_profile', 'regulatory_notes', 'canonical_market_access']
        .some((dimension) => ['partial', 'sparse', 'absent'].includes(stateByDimension.get(dimension))),
      evidence_maintenance_leverage: ['evidence_depth', 'facet_freshness_support']
        .some((dimension) => ['partial', 'sparse', 'absent'].includes(stateByDimension.get(dimension)))
    };
    return {
      ...asset,
      dimension_states: dimensionStates,
      priority_gaps: priorityGaps,
      product_leverage_flags: flags
    };
  });

  const stateCounts = Object.fromEntries(PLANNING_STATES.map((state) => [state, assets.flatMap((asset) => asset.dimension_states).filter((row) => row.state === state).length]));
  const dimensionStates = base.dimension_order.map((dimensionId) => ({
    dimension_id: dimensionId,
    state_counts: Object.fromEntries(PLANNING_STATES.map((state) => [state, assets.filter((asset) => asset.dimension_states.find((row) => row.dimension_id === dimensionId)?.state === state).length]))
  }));

  const digest = crypto.createHash('sha256').update(base.input_digest_sha256);
  for (const file of [...profileOverrideFiles].sort()) {
    digest.update('\0');
    digest.update(file);
    digest.update('\0');
    digest.update(readText(file));
  }
  digest.update('\0');
  digest.update(FRESHNESS_CONTRACT_PATH);
  digest.update('\0');
  digest.update(readText(FRESHNESS_CONTRACT_PATH));

  return {
    ...base,
    input_digest_sha256: digest.digest('hex'),
    source_contracts: {
      ...base.source_contracts,
      reviewed_profile_override_files: [...profileOverrideFiles].sort(),
      profile_override_freshness_as_of_date: freshnessContract.as_of_date
    },
    summary: {
      ...base.summary,
      state_counts: stateCounts,
      dimension_states: dimensionStates
    },
    assets
  };
}

export function buildReviewedRecordDepthBaseline(options = {}) {
  const config = readJson(CONFIG_PATH);
  const presets = readJson(PRESETS_PATH);
  const profileOverrideFiles = options.profileOverrideFiles ?? [];
  const base = applyProfileOverrides(buildRecordDepthBaseline(), profileOverrideFiles);
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
