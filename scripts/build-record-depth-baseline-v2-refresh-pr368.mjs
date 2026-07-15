import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildReviewedRecordDepthBaseline } from './growth/build-reviewed-record-depth-baseline-pr353.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const paths = {
  config: 'config/record-depth-baseline-v2-refresh-pr368.json',
  contract: 'config/planning-dimension-semantics-v2.json',
  semanticsAudit: 'docs/migration/planning-dimension-semantics-audit-pr367.json',
  v1Summary: 'docs/migration/record-depth-baseline-pr363-summary.json',
  baseline: 'docs/migration/record-depth-baseline-v2-pr368.json',
  summary: 'docs/migration/record-depth-baseline-v2-pr368-summary.json',
  delta: 'docs/migration/record-depth-baseline-v2-pr368-delta.json',
  queue: 'docs/migration/tier-a-candidate-queue-v2-pr368.json'
};
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const uniq = (values) => [...new Set(values.filter(Boolean))];
const countBy = (rows, key) => rows.reduce((out, row) => {
  const value = typeof key === 'function' ? key(row) : row[key];
  out[value] = (out[value] ?? 0) + 1;
  return out;
}, {});
const orderedCounts = (order, counts) => Object.fromEntries(order.map((key) => [key, counts[key] ?? 0]));

function loadProfiles() {
  const registry = loadRegistryV2Baseline(root);
  const files = registry.data_groups?.profiles ?? [];
  return new Map(files.flatMap((file) => readJson(file)).map((row) => [row.id, row]));
}

function semanticConversion(dimensionId, row, profile) {
  if (dimensionId === 'regulatory_notes' && row.state === 'absent') {
    return { state: 'not_applicable', reason: 'outside_current_regulatory_review_scope' };
  }
  if (dimensionId === 'canonical_market_access' && row.state === 'absent') {
    return { state: 'not_applicable', reason: 'outside_current_market_access_review_scope' };
  }
  if (dimensionId === 'redemption' && profile?.redemption_profile?.status === 'not_applicable') {
    return { state: 'not_applicable', reason: 'explicit_redemption_not_applicable' };
  }
  if (dimensionId === 'reserve_structure' && profile?.reserve_profile?.status === 'not_applicable') {
    return { state: 'not_applicable', reason: 'explicit_reserve_structure_not_applicable' };
  }
  return { state: row.state, reason: null };
}

function observationState(planningState) {
  if (planningState === 'strong') return 'observed_supported';
  if (['usable', 'partial', 'sparse'].includes(planningState)) return 'observed_limited';
  if (planningState === 'absent') return 'unobserved';
  if (planningState === 'not_applicable') return 'not_applicable';
  throw new Error(`Unsupported planning state ${planningState}`);
}

function buildCell(row, semantic, profile, contract) {
  const conversion = semanticConversion(row.dimension_id, row, profile);
  const planningState = conversion.state;
  const stateContract = contract.state_semantics[planningState];
  if (!stateContract) throw new Error(`Missing state semantics for ${planningState}`);
  const applicabilityState = planningState === 'not_applicable' ? 'not_applicable_to_current_scope' : 'applicable';
  const observation = observationState(planningState);
  if (!stateContract.allowed_applicability_states.includes(applicabilityState)) {
    throw new Error(`${row.dimension_id}: ${planningState} rejects applicability ${applicabilityState}`);
  }
  if (!stateContract.allowed_observation_states.includes(observation)) {
    throw new Error(`${row.dimension_id}: ${planningState} rejects observation ${observation}`);
  }
  return {
    dimension_id: row.dimension_id,
    dimension_class: semantic.dimension_class,
    queue_role: semantic.default_queue_role,
    v1_state: row.state,
    state: planningState,
    planning_state: planningState,
    applicability_state: applicabilityState,
    observation_state: observation,
    counts_as_gap: stateContract.counts_as_gap,
    reason_codes: uniq([...(row.reason_codes ?? []), conversion.reason]).sort(),
    metrics: row.metrics ?? {},
    ...(row.freshness_state ? { freshness_state: row.freshness_state } : {})
  };
}

function buildQueue(assets, config) {
  const gapStates = new Set(config.queue_policy.eligible_gap_states);
  const rows = [];
  for (const asset of assets) {
    const materialGaps = asset.dimension_states
      .filter((row) => row.queue_role === config.queue_policy.material_role && gapStates.has(row.state))
      .map((row) => row.dimension_id)
      .sort();
    if (config.queue_policy.require_at_least_one_material_gap && materialGaps.length === 0) continue;
    const stateByDimension = new Map(asset.dimension_states.map((row) => [row.dimension_id, row.state]));
    const isGap = (id) => gapStates.has(stateByDimension.get(id));
    const flags = {
      ...asset.product_leverage_flags,
      compare_leverage: ['mechanism_classification', 'reserve_structure', 'redemption', 'issuance'].some(isGap),
      evidence_maintenance_leverage: isGap('evidence_depth'),
      access_regulation_leverage: isGap('legal_profile')
    };
    const reasons = [];
    if (flags.historical_importance && materialGaps.length >= config.queue_policy.historical_material_gap_min) {
      reasons.push('historical_importance_with_multiple_material_dossier_gaps');
    }
    if (flags.compare_leverage && flags.evidence_maintenance_leverage) {
      reasons.push('comparison_and_evidence_depth_leverage');
    }
    if (flags.comparison_preset_member && materialGaps.length >= config.queue_policy.comparison_preset_material_gap_min) {
      reasons.push('comparison_preset_member_with_material_dossier_gap');
    }
    if (flags.regional_relevance && materialGaps.length >= config.queue_policy.regional_material_gap_min) {
      reasons.push('regional_relevance_with_multiple_material_dossier_gaps');
    }
    if (reasons.length === 0) continue;
    rows.push({
      asset_id: asset.asset_id,
      asset_slug: asset.asset_slug,
      asset_name: asset.asset_name,
      symbol: asset.symbol,
      reasons: reasons.sort(),
      material_dossier_gaps: materialGaps,
      maintenance_gaps: asset.maintenance_gaps,
      product_leverage_flags: flags
    });
  }
  return rows.sort((left, right) => left.asset_slug.localeCompare(right.asset_slug));
}

export function buildRecordDepthBaselineV2Outputs() {
  const configText = readText(paths.config);
  const contractText = readText(paths.contract);
  const config = JSON.parse(configText);
  const contract = JSON.parse(contractText);
  const semanticsAudit = readJson(paths.semanticsAudit);
  const v1Summary = readJson(paths.v1Summary);
  const current = buildReviewedRecordDepthBaseline();
  const profiles = loadProfiles();
  const semanticById = new Map(contract.dimensions.map((row) => [row.dimension_id, row]));
  const gapStates = new Set(config.queue_policy.eligible_gap_states);

  const assets = current.assets.map((asset) => {
    const profile = profiles.get(asset.asset_id);
    const dimensionStates = asset.dimension_states.map((row) => {
      const semantic = semanticById.get(row.dimension_id);
      if (!semantic) throw new Error(`Missing v2 semantics for ${row.dimension_id}`);
      return buildCell(row, semantic, profile, contract);
    });
    const priorityGaps = dimensionStates
      .filter((row) => row.queue_role === 'material_dossier' && gapStates.has(row.state))
      .map((row) => row.dimension_id)
      .sort();
    const maintenanceGaps = dimensionStates
      .filter((row) => row.queue_role === 'maintenance_only' && gapStates.has(row.state))
      .map((row) => row.dimension_id)
      .sort();
    const scopedStates = dimensionStates
      .filter((row) => row.queue_role === 'scoped_non_dossier')
      .map((row) => ({ dimension_id: row.dimension_id, state: row.state, observation_state: row.observation_state }));
    return {
      asset_id: asset.asset_id,
      asset_slug: asset.asset_slug,
      asset_name: asset.asset_name,
      symbol: asset.symbol,
      dimension_states: dimensionStates,
      priority_gaps: priorityGaps,
      maintenance_gaps: maintenanceGaps,
      scoped_observational_states: scopedStates,
      product_leverage_flags: asset.product_leverage_flags,
      input_digest: asset.input_digest
    };
  });

  const queue = buildQueue(assets, config);
  const allCells = assets.flatMap((asset) => asset.dimension_states.map((row) => ({ asset_id: asset.asset_id, asset_slug: asset.asset_slug, ...row })));
  const planningCounts = orderedCounts(contract.planning_states, countBy(allCells, 'state'));
  const applicabilityCounts = orderedCounts(contract.applicability_states, countBy(allCells, 'applicability_state'));
  const observationCounts = orderedCounts(contract.observation_states, countBy(allCells, 'observation_state'));
  const dimensionStates = contract.dimensions.map((semantic) => {
    const cells = allCells.filter((row) => row.dimension_id === semantic.dimension_id);
    return {
      dimension_id: semantic.dimension_id,
      dimension_class: semantic.dimension_class,
      queue_role: semantic.default_queue_role,
      planning_state_counts: orderedCounts(contract.planning_states, countBy(cells, 'state')),
      applicability_state_counts: orderedCounts(contract.applicability_states, countBy(cells, 'applicability_state')),
      observation_state_counts: orderedCounts(contract.observation_states, countBy(cells, 'observation_state'))
    };
  });
  const conversions = allCells
    .filter((row) => row.v1_state !== row.state)
    .map((row) => ({
      asset_id: row.asset_id,
      asset_slug: row.asset_slug,
      dimension_id: row.dimension_id,
      before: row.v1_state,
      after: row.state,
      applicability_state: row.applicability_state,
      observation_state: row.observation_state,
      reason_codes: row.reason_codes
    }))
    .sort((left, right) => `${left.dimension_id}:${left.asset_slug}`.localeCompare(`${right.dimension_id}:${right.asset_slug}`));

  const inputDigest = sha256([
    current.input_digest_sha256,
    semanticsAudit.approved_contract.contract_sha256,
    sha256(configText),
    sha256(contractText)
  ].join('\0'));
  const summaryCore = {
    planning_state_counts: planningCounts,
    applicability_state_counts: applicabilityCounts,
    observation_state_counts: observationCounts,
    dimension_states: dimensionStates,
    changed_from_v1_cell_count: conversions.length,
    material_dossier_gap_cell_count: allCells.filter((row) => row.queue_role === 'material_dossier' && gapStates.has(row.state)).length,
    maintenance_gap_cell_count: allCells.filter((row) => row.queue_role === 'maintenance_only' && gapStates.has(row.state)).length,
    candidate_count: queue.length
  };
  const generationDigest = sha256(JSON.stringify({ inputDigest, summaryCore, queue }));
  const sourceContracts = {
    v1_baseline_id: v1Summary.baseline_id,
    v1_input_digest_sha256: v1Summary.input_digest_sha256,
    semantics_contract_id: contract.contract_id,
    semantics_contract_sha256: semanticsAudit.approved_contract.contract_sha256,
    semantics_audit_id: semanticsAudit.audit_id,
    canonical_builder_input_digest_sha256: current.input_digest_sha256
  };

  const baseline = {
    schema_version: '2.0',
    baseline_id: 'sog_record_depth_baseline_v2_pr368',
    status: 'reviewed_internal_planning_baseline',
    public_output: false,
    asset_rank: false,
    single_composite_score: false,
    review_pr: 368,
    reviewed_at: config.reviewed_at,
    asset_count: assets.length,
    dimension_count: contract.dimensions.length,
    cell_count: assets.length * contract.dimensions.length,
    planning_states: contract.planning_states,
    applicability_states: contract.applicability_states,
    observation_states: contract.observation_states,
    dimension_order: contract.dimensions.map((row) => row.dimension_id),
    input_digest_sha256: inputDigest,
    generation_digest_sha256: generationDigest,
    source_contracts: sourceContracts,
    summary: summaryCore,
    assets,
    queue_order: config.queue_policy.order
  };
  const summary = {
    schema_version: '2.0',
    baseline_id: baseline.baseline_id,
    status: 'reviewed_internal_planning_checkpoint',
    public_output: false,
    asset_rank: false,
    single_composite_score: false,
    review_pr: 368,
    reviewed_at: config.reviewed_at,
    asset_count: baseline.asset_count,
    dimension_count: baseline.dimension_count,
    cell_count: baseline.cell_count,
    planning_states: baseline.planning_states,
    applicability_states: baseline.applicability_states,
    observation_states: baseline.observation_states,
    dimension_order: baseline.dimension_order,
    input_digest_sha256: inputDigest,
    generation_digest_sha256: generationDigest,
    source_contracts: sourceContracts,
    summary: summaryCore,
    queue_order: config.queue_policy.order,
    next_work_item: config.next_work_item
  };
  const delta = {
    schema_version: '1.0',
    delta_id: 'sog_record_depth_baseline_v2_delta_pr368',
    review_pr: 368,
    historical_v1_baseline_id: v1Summary.baseline_id,
    current_v2_baseline_id: baseline.baseline_id,
    historical_checkpoint_rewritten: false,
    asset_count: { before: v1Summary.asset_count, after: baseline.asset_count },
    cell_count: { before: v1Summary.cell_count, after: baseline.cell_count },
    planning_state_counts: { before: v1Summary.summary.state_counts, after: planningCounts },
    applicability_state_counts: applicabilityCounts,
    observation_state_counts: observationCounts,
    changed_cell_count: conversions.length,
    changed_cells: conversions,
    dimension_deltas: dimensionStates.map((row) => ({
      dimension_id: row.dimension_id,
      before: v1Summary.summary.dimension_states.find((item) => item.dimension_id === row.dimension_id)?.state_counts ?? {},
      after: row.planning_state_counts
    })),
    candidate_queue: {
      before_count: v1Summary.summary.tier_a_candidate_count,
      after_count: queue.length
    },
    generation_digest_sha256: generationDigest
  };
  const queueOutput = {
    schema_version: '2.0',
    queue_id: 'sog_tier_a_candidate_queue_v2_pr368',
    status: 'reviewed_internal_non_ranking_queue',
    public_output: false,
    asset_rank: false,
    single_composite_score: false,
    review_pr: 368,
    source_baseline_id: baseline.baseline_id,
    source_semantics_contract_id: contract.contract_id,
    candidate_count: queue.length,
    queue_order: config.queue_policy.order,
    selection_boundary: {
      canonical_promotion_authorized: false,
      manual_review_required: true,
      maximum_assets_in_pr369: config.queue_policy.maximum_assets_in_pr369,
      existing_assets_only: true,
      market_access_change_allowed: false,
      public_surface_allowed: false
    },
    candidates: queue,
    generation_digest_sha256: generationDigest,
    next_work_item: config.next_work_item
  };
  return { baseline, summary, delta, queue: queueOutput };
}

export function writeRecordDepthBaselineV2Outputs(outputs = buildRecordDepthBaselineV2Outputs()) {
  for (const [key, file] of [['baseline', paths.baseline], ['summary', paths.summary], ['delta', paths.delta], ['queue', paths.queue]]) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), serialize(outputs[key]));
  }
  return Object.values(paths).filter((file) => file.startsWith('docs/migration/record-depth-baseline-v2') || file.includes('tier-a-candidate-queue-v2'));
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const outputs = buildRecordDepthBaselineV2Outputs();
  if (process.argv.includes('--check')) {
    for (const [key, file] of [['baseline', paths.baseline], ['summary', paths.summary], ['delta', paths.delta], ['queue', paths.queue]]) {
      if (!fs.existsSync(path.join(root, file)) || readText(file) !== serialize(outputs[key])) {
        console.error(`${file} is not reproducible`);
        process.exit(1);
      }
    }
  } else writeRecordDepthBaselineV2Outputs(outputs);
  console.log(JSON.stringify({
    ok: true,
    baseline_id: outputs.baseline.baseline_id,
    assets: outputs.baseline.asset_count,
    dimensions: outputs.baseline.dimension_count,
    cells: outputs.baseline.cell_count,
    planning_state_counts: outputs.summary.summary.planning_state_counts,
    applicability_state_counts: outputs.summary.summary.applicability_state_counts,
    observation_state_counts: outputs.summary.summary.observation_state_counts,
    changed_cells: outputs.delta.changed_cell_count,
    candidates: outputs.queue.candidate_count,
    next_work_item: outputs.queue.next_work_item
  }, null, 2));
}
