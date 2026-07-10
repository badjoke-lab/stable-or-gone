import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRegistryV2Baseline } from '../load-registry-v2-baseline.mjs';
import { buildComparisonReadinessAudit } from '../comparison/build-readiness-audit-pr337.mjs';
import { buildFacetFreshnessAudit } from '../comparison/build-facet-freshness-pr342.mjs';

const root = process.cwd();
const CONFIG_PATH = 'config/record-depth-baseline-v1.json';
const V3_FOUNDATION_PATH = 'docs/migration/registry-v3-foundation.json';
const INCOME_MANIFEST_PATH = 'docs/migration/registry-v3-income-profiles.json';
const MARKET_ACCESS_PATH = 'data/market-access-records-v1.json';

const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const uniq = (values) => [...new Set(values.filter(Boolean))];
const hashJson = (value) => crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
const unresolved = new Set(['unknown', 'not_recorded', 'not_applicable', 'source_review_needed', 'unclear']);
const isUnresolved = (value) => value == null || (typeof value === 'string' && unresolved.has(value));

function rowsByAsset(rows, getIds) {
  const map = new Map();
  for (const row of rows) {
    for (const id of uniq(getIds(row))) {
      if (!map.has(id)) map.set(id, []);
      map.get(id).push(row);
    }
  }
  return map;
}

function readinessState(assetReadiness, dimensionId) {
  return assetReadiness?.dimensions?.find((row) => row.dimension_id === dimensionId)?.state ?? 'integrity_blocked';
}

function freshnessState(assetFreshness, dimensionId) {
  return assetFreshness?.facets?.find((row) => row.dimension_id === dimensionId)?.freshness_state ?? 'undated';
}

function worstReadiness(states) {
  const order = ['ready', 'ready_with_unknowns', 'needs_normalization', 'integrity_blocked'];
  return order[Math.max(...states.map((state) => Math.max(0, order.indexOf(state))))];
}

function result(dimensionId, state, reasonCodes, metrics = {}) {
  return {
    dimension_id: dimensionId,
    state,
    reason_codes: uniq(reasonCodes).sort(),
    metrics
  };
}

function mapReadiness(config, state) {
  return config.readiness_state_map[state] ?? 'sparse';
}

function deriveDimensions({
  asset,
  classification,
  profile,
  legal,
  relationships,
  reserveReports,
  reserveComponents,
  deployments,
  events,
  evidence,
  knownUnknowns,
  regulatoryNotes,
  marketAccess,
  readiness,
  freshness,
  config
}) {
  const t = config.thresholds;
  const dimensions = [];

  {
    const states = [
      readinessState(readiness, 'identity_consistency'),
      readinessState(readiness, 'launch_date_semantics'),
      readinessState(readiness, 'verification_date_semantics')
    ];
    const worst = worstReadiness(states);
    if (worst === 'ready') dimensions.push(result('identity', 'strong', ['identity_launch_and_verification_structured']));
    else if (worst === 'ready_with_unknowns') dimensions.push(result('identity', 'usable', ['identity_usable_with_explicit_unknowns']));
    else dimensions.push(result('identity', mapReadiness(config, worst), ['identity_readiness_gap'], { readiness_state: worst }));
  }

  {
    const state = readinessState(readiness, 'lifecycle_semantics');
    if (state === 'ready') {
      const planning = events.length >= 2 ? 'strong' : 'usable';
      dimensions.push(result('lifecycle', planning, [events.length >= 2 ? 'lifecycle_structured_with_history' : 'lifecycle_structured'], { event_count: events.length }));
    } else if (state === 'ready_with_unknowns') dimensions.push(result('lifecycle', 'partial', ['lifecycle_explicitly_unresolved'], { event_count: events.length }));
    else dimensions.push(result('lifecycle', mapReadiness(config, state), ['lifecycle_readiness_gap'], { readiness_state: state, event_count: events.length }));
  }

  {
    const state = readinessState(readiness, 'issuer_asset_boundary');
    if (relationships.length === 0) dimensions.push(result('organization_relationships', 'absent', ['no_canonical_relationship_rows']));
    else if (state === 'integrity_blocked') dimensions.push(result('organization_relationships', 'sparse', ['relationship_integrity_gap'], { relationship_count: relationships.length }));
    else if (state === 'needs_normalization' || state === 'ready_with_unknowns') dimensions.push(result('organization_relationships', 'partial', ['relationship_structure_incomplete'], { relationship_count: relationships.length }));
    else if (relationships.length >= t.relationships_strong_min) dimensions.push(result('organization_relationships', 'strong', ['multiple_structured_relationships'], { relationship_count: relationships.length }));
    else dimensions.push(result('organization_relationships', 'usable', ['structured_relationship_present'], { relationship_count: relationships.length }));
  }

  {
    const states = [
      readinessState(readiness, 'reference_target_and_currency'),
      readinessState(readiness, 'asset_class'),
      readinessState(readiness, 'backing_model_representation'),
      readinessState(readiness, 'stabilization_mechanism_representation')
    ];
    const worst = worstReadiness(states);
    if (states.every((state) => state === 'ready')) dimensions.push(result('mechanism_classification', 'strong', ['classification_and_mechanism_fully_structured']));
    else if (!states.some((state) => ['needs_normalization', 'integrity_blocked'].includes(state))) dimensions.push(result('mechanism_classification', 'usable', ['classification_structured_with_explicit_unknowns']));
    else dimensions.push(result('mechanism_classification', mapReadiness(config, worst), ['classification_or_mechanism_gap'], { readiness_state: worst }));
  }

  {
    const reserveProfile = profile?.reserve_profile;
    const readinessValue = readinessState(readiness, 'reserve_disclosure_comparability');
    if (!reserveProfile) dimensions.push(result('reserve_structure', 'absent', ['no_canonical_reserve_profile']));
    else if (readinessValue === 'integrity_blocked') dimensions.push(result('reserve_structure', 'sparse', ['reserve_integrity_gap'], { reserve_report_count: reserveReports.length, reserve_component_count: reserveComponents.length }));
    else if (readinessValue === 'needs_normalization') dimensions.push(result('reserve_structure', 'partial', ['reserve_normalization_gap'], { reserve_report_count: reserveReports.length, reserve_component_count: reserveComponents.length }));
    else if (reserveReports.length >= t.reserve_reports_strong_min && reserveComponents.length >= t.reserve_components_strong_min && readinessValue === 'ready') {
      dimensions.push(result('reserve_structure', 'strong', ['reserve_profile_reports_and_components_present'], { reserve_report_count: reserveReports.length, reserve_component_count: reserveComponents.length }));
    } else if (reserveReports.length > 0 || reserveComponents.length > 0) {
      dimensions.push(result('reserve_structure', 'usable', ['reserve_profile_with_supporting_structure'], { reserve_report_count: reserveReports.length, reserve_component_count: reserveComponents.length }));
    } else dimensions.push(result('reserve_structure', 'partial', ['reserve_profile_without_supporting_report_or_component_rows']));
  }

  {
    const redemption = profile?.redemption_profile;
    const readinessValue = readinessState(readiness, 'redemption_comparability');
    const freshnessValue = freshnessState(freshness, 'redemption_comparability');
    if (!redemption) dimensions.push(result('redemption', 'absent', ['no_canonical_redemption_profile']));
    else if (readinessValue === 'integrity_blocked') dimensions.push(result('redemption', 'sparse', ['redemption_integrity_gap'], { freshness_state: freshnessValue }));
    else if (readinessValue === 'needs_normalization' || readinessValue === 'ready_with_unknowns') dimensions.push(result('redemption', 'partial', ['redemption_structure_incomplete_or_unknown'], { freshness_state: freshnessValue }));
    else if (['fresh', 'aging'].includes(freshnessValue)) dimensions.push(result('redemption', 'strong', ['redemption_structured_with_supported_freshness'], { freshness_state: freshnessValue }));
    else dimensions.push(result('redemption', 'usable', ['redemption_structured_but_freshness_support_limited'], { freshness_state: freshnessValue }));
  }

  {
    const readinessValue = readinessState(readiness, 'issuance_comparability');
    dimensions.push(result('issuance', mapReadiness(config, readinessValue), [`issuance_readiness_${readinessValue}`]));
  }

  {
    if (deployments.length === 0) dimensions.push(result('deployment', 'absent', ['no_canonical_deployment_rows']));
    else {
      const incomplete = deployments.filter((row) => [row.chain, row.status, row.canonicality, row.verification_status].some(isUnresolved)).length;
      if (incomplete > 0) dimensions.push(result('deployment', 'partial', ['deployment_rows_with_unresolved_fields'], { deployment_count: deployments.length, incomplete_count: incomplete }));
      else if (deployments.length >= t.deployments_strong_min) dimensions.push(result('deployment', 'strong', ['multiple_structured_deployments'], { deployment_count: deployments.length }));
      else dimensions.push(result('deployment', 'usable', ['structured_deployment_present'], { deployment_count: deployments.length }));
    }
  }

  {
    const readinessValue = readinessState(readiness, 'legal_classification_comparability');
    const freshnessValue = freshnessState(freshness, 'legal_classification_comparability');
    if (!legal) dimensions.push(result('legal_profile', 'absent', ['no_canonical_legal_profile']));
    else if (readinessValue === 'integrity_blocked') dimensions.push(result('legal_profile', 'sparse', ['legal_profile_integrity_gap'], { freshness_state: freshnessValue }));
    else if (readinessValue === 'needs_normalization' || readinessValue === 'ready_with_unknowns') dimensions.push(result('legal_profile', 'partial', ['legal_scope_incomplete_or_unknown'], { freshness_state: freshnessValue }));
    else if (['fresh', 'aging'].includes(freshnessValue)) dimensions.push(result('legal_profile', 'strong', ['legal_profile_structured_with_supported_freshness'], { freshness_state: freshnessValue }));
    else dimensions.push(result('legal_profile', 'usable', ['legal_profile_structured_but_freshness_support_limited'], { freshness_state: freshnessValue }));
  }

  {
    if (regulatoryNotes.length === 0) dimensions.push(result('regulatory_notes', 'absent', ['no_canonical_regulatory_note_rows_no_negative_claim']));
    else if (regulatoryNotes.length >= t.regulatory_notes_strong_min) dimensions.push(result('regulatory_notes', 'strong', ['multiple_canonical_regulatory_notes'], { regulatory_note_count: regulatoryNotes.length }));
    else dimensions.push(result('regulatory_notes', 'usable', ['canonical_regulatory_note_present'], { regulatory_note_count: regulatoryNotes.length }));
  }

  {
    if (events.length === 0) dimensions.push(result('events', 'absent', ['no_canonical_event_rows']));
    else if (events.length >= t.events_strong_min) dimensions.push(result('events', 'strong', ['multiple_material_event_rows'], { event_count: events.length }));
    else dimensions.push(result('events', 'usable', ['canonical_event_history_present'], { event_count: events.length }));
  }

  {
    const count = evidence.length;
    if (count === 0) dimensions.push(result('evidence_depth', 'absent', ['no_asset_scoped_evidence_rows']));
    else if (count >= t.evidence_strong_min) dimensions.push(result('evidence_depth', 'strong', ['deep_asset_scoped_evidence_set'], { evidence_count: count }));
    else if (count >= t.evidence_usable_min) dimensions.push(result('evidence_depth', 'usable', ['multi_source_evidence_set'], { evidence_count: count }));
    else if (count >= t.evidence_partial_min) dimensions.push(result('evidence_depth', 'partial', ['limited_evidence_set'], { evidence_count: count }));
    else dimensions.push(result('evidence_depth', 'sparse', ['single_evidence_row'], { evidence_count: count }));
  }

  {
    const count = knownUnknowns.length;
    if (count === 0) dimensions.push(result('known_unknowns', 'absent', ['no_canonical_known_unknown_rows_no_completeness_claim']));
    else if (count >= t.known_unknowns_strong_min) dimensions.push(result('known_unknowns', 'strong', ['multiple_explicit_known_unknown_rows'], { known_unknown_count: count }));
    else dimensions.push(result('known_unknowns', 'usable', ['explicit_known_unknown_management_present'], { known_unknown_count: count }));
  }

  {
    const state = readiness?.overall_state ?? 'integrity_blocked';
    dimensions.push(result('comparison_readiness', mapReadiness(config, state), [`comparison_readiness_${state}`]));
  }

  {
    const excluded = new Set(config.freshness_excluded_dimensions);
    const cells = (freshness?.facets ?? []).filter((row) => !excluded.has(row.dimension_id) && row.freshness_state !== 'not_applicable');
    if (cells.length === 0) dimensions.push(result('facet_freshness_support', 'not_applicable', ['no_applicable_freshness_cells']));
    else {
      const unsupported = cells.filter((row) => config.freshness_unsupported_states.includes(row.freshness_state)).length;
      const stale = cells.filter((row) => row.freshness_state === 'stale').length;
      let planningState = 'sparse';
      if (unsupported === 0) planningState = 'strong';
      else if (unsupported <= t.freshness_support_usable_max_unsupported) planningState = 'usable';
      else if (unsupported <= t.freshness_support_partial_max_unsupported) planningState = 'partial';
      dimensions.push(result('facet_freshness_support', planningState, ['freshness_anchor_support_counted_without_composite_score'], { applicable_cell_count: cells.length, unsupported_anchor_count: unsupported, stale_cell_count: stale }));
    }
  }

  {
    const count = marketAccess.length;
    if (count === 0) dimensions.push(result('canonical_market_access', 'absent', ['no_canonical_market_access_records_no_unavailability_claim']));
    else if (count >= t.market_access_strong_min) dimensions.push(result('canonical_market_access', 'strong', ['multiple_bounded_market_access_records'], { market_access_record_count: count }));
    else if (count >= t.market_access_usable_min) dimensions.push(result('canonical_market_access', 'usable', ['bounded_market_access_records_present'], { market_access_record_count: count }));
    else dimensions.push(result('canonical_market_access', 'partial', ['single_bounded_market_access_record'], { market_access_record_count: count }));
  }

  const expected = new Set(config.dimensions);
  if (dimensions.length !== expected.size || dimensions.some((row) => !expected.has(row.dimension_id))) {
    throw new Error(`Dimension contract mismatch for ${asset.id}`);
  }
  return dimensions;
}

function deriveLeverage({ asset, classification, events, dimensions }) {
  const stateByDimension = new Map(dimensions.map((row) => [row.dimension_id, row.state]));
  const gaps = dimensions.filter((row) => ['partial', 'sparse', 'absent'].includes(row.state)).map((row) => row.dimension_id).sort();
  const compareLeverage = ['mechanism_classification', 'reserve_structure', 'redemption', 'issuance', 'comparison_readiness']
    .some((dimension) => ['partial', 'sparse', 'absent'].includes(stateByDimension.get(dimension)));
  const historicalImportance = classification?.lifecycle_status !== 'active' || events.length >= 2;
  const timelineLeverage = events.length > 0 || historicalImportance;
  const accessRegulationLeverage = ['legal_profile', 'regulatory_notes', 'canonical_market_access']
    .some((dimension) => ['partial', 'sparse', 'absent'].includes(stateByDimension.get(dimension)));
  const evidenceMaintenanceLeverage = ['evidence_depth', 'facet_freshness_support']
    .some((dimension) => ['partial', 'sparse', 'absent'].includes(stateByDimension.get(dimension)));
  const pegAsset = classification?.peg_reference?.asset ?? null;
  const regionalRelevance = typeof pegAsset === 'string' && pegAsset !== 'USD';

  return {
    flags: {
      compare_leverage: compareLeverage,
      timeline_leverage: timelineLeverage,
      access_regulation_leverage: accessRegulationLeverage,
      evidence_maintenance_leverage: evidenceMaintenanceLeverage,
      historical_importance: historicalImportance,
      regional_relevance: regionalRelevance
    },
    priority_gaps: gaps
  };
}

function deriveQueueMembership(assetRow, config) {
  const flags = assetRow.product_leverage_flags;
  const gapCount = assetRow.priority_gaps.length;
  const reasons = [];
  if (gapCount < config.queue_policy.minimum_priority_gap_count) return { eligible: false, reasons };
  if (config.queue_policy.eligible_if_historical_and_gapped && flags.historical_importance) reasons.push('historically_important_with_multiple_depth_gaps');
  if (config.queue_policy.eligible_if_compare_and_evidence_leverage && flags.compare_leverage && flags.evidence_maintenance_leverage) reasons.push('comparison_and_evidence_maintenance_leverage');
  if (config.queue_policy.eligible_if_access_regulation_and_gapped && flags.access_regulation_leverage) reasons.push('access_regulation_leverage_with_depth_gaps');
  if (config.queue_policy.eligible_if_regional_and_gapped && flags.regional_relevance) reasons.push('regional_relevance_with_depth_gaps');
  return { eligible: reasons.length > 0, reasons: reasons.sort() };
}

export function buildRecordDepthBaseline() {
  const config = readJson(CONFIG_PATH);
  const baseline = loadRegistryV2Baseline(root);
  const v3Foundation = readJson(V3_FOUNDATION_PATH);
  const incomeManifest = readJson(INCOME_MANIFEST_PATH);
  const marketAccessRecords = readJson(MARKET_ACCESS_PATH);
  const readinessAudit = buildComparisonReadinessAudit();
  const freshnessAudit = buildFacetFreshnessAudit();

  const sourceFiles = new Set([CONFIG_PATH, V3_FOUNDATION_PATH, INCOME_MANIFEST_PATH, MARKET_ACCESS_PATH]);
  for (const files of Object.values(baseline.data_groups ?? {})) for (const file of files ?? []) sourceFiles.add(file);
  for (const files of Object.values(v3Foundation.data_groups ?? {})) for (const file of files ?? []) sourceFiles.add(file);
  for (const file of incomeManifest.data_files ?? []) sourceFiles.add(file);

  const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap((file) => readJson(file));
  const v3Group = (name) => (v3Foundation.data_groups?.[name] ?? []).flatMap((file) => readJson(file));

  const stablecoins = group('stablecoins').sort((a, b) => a.slug.localeCompare(b.slug));
  const classifications = group('classifications');
  const profiles = group('profiles');
  const relationships = group('relationships');
  const reserveReports = group('reserve_reports');
  const deployments = group('deployments');
  const events = group('events');
  const evidence = group('evidence');
  const knownUnknowns = group('known_unknowns');
  const regulatoryNotes = group('regulatory_notes');
  const legalProfiles = v3Group('legal_profiles');
  const reserveComponents = v3Group('reserve_components');

  const classificationById = new Map(classifications.map((row) => [row.id, row]));
  const profileById = new Map(profiles.map((row) => [row.id, row]));
  const legalById = new Map(legalProfiles.map((row) => [row.id, row]));
  const readinessById = new Map(readinessAudit.assets.map((row) => [row.asset_id, row]));
  const freshnessById = new Map(freshnessAudit.assets.map((row) => [row.asset_id, row]));
  const relationshipsByAsset = rowsByAsset(relationships, (row) => [row.stablecoin_id]);
  const reportsByAsset = rowsByAsset(reserveReports, (row) => [row.stablecoin_id]);
  const componentsByAsset = rowsByAsset(reserveComponents, (row) => [row.stablecoin_id]);
  const deploymentsByAsset = rowsByAsset(deployments, (row) => [row.stablecoin_id]);
  const eventsByAsset = rowsByAsset(events, (row) => [row.stablecoin_id, ...(row.subject_stablecoin_ids ?? [])]);
  const evidenceByAsset = rowsByAsset(evidence, (row) => [row.stablecoin_id, ...(row.stablecoin_ids ?? [])]);
  const unknownsByAsset = rowsByAsset(knownUnknowns, (row) => [row.stablecoin_id]);
  const regulatoryByAsset = rowsByAsset(regulatoryNotes, (row) => [row.stablecoin_id, ...(row.stablecoin_ids ?? [])]);
  const accessByAsset = rowsByAsset(marketAccessRecords, (row) => [row.asset_id]);

  const assets = stablecoins.map((asset) => {
    const classification = classificationById.get(asset.id);
    const inventory = {
      relationships: relationshipsByAsset.get(asset.id) ?? [],
      reserve_reports: reportsByAsset.get(asset.id) ?? [],
      reserve_components: componentsByAsset.get(asset.id) ?? [],
      deployments: deploymentsByAsset.get(asset.id) ?? [],
      events: eventsByAsset.get(asset.id) ?? [],
      evidence: evidenceByAsset.get(asset.id) ?? [],
      known_unknowns: unknownsByAsset.get(asset.id) ?? [],
      regulatory_notes: regulatoryByAsset.get(asset.id) ?? [],
      market_access: accessByAsset.get(asset.id) ?? []
    };
    const dimensions = deriveDimensions({
      asset,
      classification,
      profile: profileById.get(asset.id),
      legal: legalById.get(asset.id),
      relationships: inventory.relationships,
      reserveReports: inventory.reserve_reports,
      reserveComponents: inventory.reserve_components,
      deployments: inventory.deployments,
      events: inventory.events,
      evidence: inventory.evidence,
      knownUnknowns: inventory.known_unknowns,
      regulatoryNotes: inventory.regulatory_notes,
      marketAccess: inventory.market_access,
      readiness: readinessById.get(asset.id),
      freshness: freshnessById.get(asset.id),
      config
    });
    const leverage = deriveLeverage({ asset, classification, events: inventory.events, dimensions });
    const assetInput = {
      asset_id: asset.id,
      source_record_ids: Object.fromEntries(Object.entries(inventory).map(([key, rows]) => [key, rows.map((row) => row.id).filter(Boolean).sort()])),
      readiness: readinessById.get(asset.id),
      freshness: freshnessById.get(asset.id)
    };
    return {
      asset_id: asset.id,
      asset_slug: asset.slug,
      asset_name: asset.name,
      symbol: asset.symbol ?? null,
      dimension_states: dimensions,
      priority_gaps: leverage.priority_gaps,
      product_leverage_flags: leverage.flags,
      input_digest: hashJson(assetInput)
    };
  });

  const queue = [];
  for (const asset of assets) {
    const membership = deriveQueueMembership(asset, config);
    if (!membership.eligible) continue;
    queue.push({
      asset_id: asset.asset_id,
      asset_slug: asset.asset_slug,
      asset_name: asset.asset_name,
      symbol: asset.symbol,
      reasons: membership.reasons,
      priority_gaps: asset.priority_gaps,
      product_leverage_flags: asset.product_leverage_flags
    });
  }
  queue.sort((a, b) => a.asset_slug.localeCompare(b.asset_slug));

  const summaryByDimension = config.dimensions.map((dimensionId) => ({
    dimension_id: dimensionId,
    state_counts: Object.fromEntries(config.planning_states.map((state) => [state, assets.filter((asset) => asset.dimension_states.find((row) => row.dimension_id === dimensionId)?.state === state).length]))
  }));
  const allStates = assets.flatMap((asset) => asset.dimension_states);
  const overallStateCounts = Object.fromEntries(config.planning_states.map((state) => [state, allStates.filter((row) => row.state === state).length]));

  const digest = crypto.createHash('sha256');
  for (const file of [...sourceFiles].sort()) {
    digest.update(file);
    digest.update('\0');
    digest.update(readText(file));
    digest.update('\0');
  }
  digest.update(readinessAudit.input_digest_sha256);
  digest.update('\0');
  digest.update(freshnessAudit.input_digest_sha256);

  return {
    schema_version: '1.0',
    baseline_id: config.config_id,
    status: 'internal_reviewed_planning_baseline',
    public_output: config.public_output,
    single_composite_score: config.single_composite_score,
    asset_rank: config.asset_rank,
    asset_count: assets.length,
    dimension_count: config.dimensions.length,
    cell_count: assets.length * config.dimensions.length,
    planning_states: config.planning_states,
    dimension_order: config.dimensions,
    input_digest_sha256: digest.digest('hex'),
    source_contracts: {
      comparison_readiness_audit_id: readinessAudit.audit_id,
      comparison_readiness_input_digest_sha256: readinessAudit.input_digest_sha256,
      facet_freshness_audit_id: freshnessAudit.audit_id,
      facet_freshness_input_digest_sha256: freshnessAudit.input_digest_sha256,
      market_access_source: MARKET_ACCESS_PATH
    },
    summary: {
      state_counts: overallStateCounts,
      dimension_states: summaryByDimension,
      tier_a_candidate_count: queue.length
    },
    assets,
    tier_a_candidate_queue: queue,
    queue_order: config.queue_policy.order
  };
}

export function serializeRecordDepthBaseline(baseline) {
  return `${JSON.stringify(baseline, null, 2)}\n`;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const baseline = buildRecordDepthBaseline();
  const serialized = serializeRecordDepthBaseline(baseline);
  const outputPath = process.argv[2];
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
    fs.writeFileSync(path.resolve(outputPath), serialized);
    console.log(outputPath);
  } else {
    process.stdout.write(serialized);
  }
}
