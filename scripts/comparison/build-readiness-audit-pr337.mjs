import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRegistryV2Baseline } from '../load-registry-v2-baseline.mjs';

const root = process.cwd();
const CONTRACT_PATH = 'data/quality/comparison-readiness-contract-v1.json';
const CHECKPOINT_PATH = 'docs/migration/current-canonical-checkpoint.json';
const FOUNDATION_PATH = 'docs/migration/registry-v3-foundation.json';
const INCOME_MANIFEST_PATH = 'docs/migration/registry-v3-income-profiles.json';
const LAUNCH_QUEUE_PATH = 'data/quality/launch-date-unresolved.json';

const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const uniq = (values) => [...new Set(values)];
const byAsset = (rows, getIds) => {
  const map = new Map();
  for (const row of rows) {
    for (const id of uniq(getIds(row).filter(Boolean))) {
      if (!map.has(id)) map.set(id, []);
      map.get(id).push(row);
    }
  }
  return map;
};
const validDay = (value) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const unresolvedValues = new Set(['unknown', 'not_recorded', 'not_applicable', 'source_review_needed', 'unclear']);
const isUnresolved = (value) => value == null || (typeof value === 'string' && unresolvedValues.has(value));
const statePrecedence = ['ready', 'ready_with_unknowns', 'needs_normalization', 'integrity_blocked'];
const worstState = (states) => statePrecedence[Math.max(...states.map((state) => statePrecedence.indexOf(state)))];

export function buildComparisonReadinessAudit() {
  const contract = readJson(CONTRACT_PATH);
  const checkpoint = readJson(CHECKPOINT_PATH);
  const baseline = loadRegistryV2Baseline(root);
  const foundation = readJson(FOUNDATION_PATH);
  const incomeManifest = readJson(INCOME_MANIFEST_PATH);
  const launchQueue = readJson(LAUNCH_QUEUE_PATH);

  const sourceFiles = new Set([
    CONTRACT_PATH,
    CHECKPOINT_PATH,
    FOUNDATION_PATH,
    INCOME_MANIFEST_PATH,
    LAUNCH_QUEUE_PATH,
  ]);
  for (const files of Object.values(baseline.data_groups ?? {})) for (const file of files ?? []) sourceFiles.add(file);
  for (const files of Object.values(foundation.data_groups ?? {})) for (const file of files ?? []) sourceFiles.add(file);
  for (const file of incomeManifest.data_files ?? []) sourceFiles.add(file);

  const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap((file) => readJson(file));
  const manifestGroup = (name) => (foundation.data_groups?.[name] ?? []).flatMap((file) => readJson(file));

  const stablecoins = group('stablecoins').sort((a, b) => a.id.localeCompare(b.id));
  const organizations = group('organizations');
  const relationships = group('relationships');
  const classifications = group('classifications');
  const profiles = group('profiles');
  const reserveReports = group('reserve_reports');
  const deployments = group('deployments');
  const events = group('events');
  const eventDetails = group('event_details');
  const evidence = group('evidence');
  const evidenceRelations = group('evidence_relations');
  const knownUnknowns = group('known_unknowns');
  const regulatoryNotes = group('regulatory_notes');
  const legalProfiles = manifestGroup('legal_profiles');
  const reserveComponents = manifestGroup('reserve_components');
  const stableAssetRelationships = manifestGroup('stable_asset_relationships');
  const incomeProfiles = (incomeManifest.data_files ?? []).flatMap((file) => readJson(file));

  const stablecoinIds = new Set(stablecoins.map((row) => row.id));
  const organizationIds = new Set(organizations.map((row) => row.id));
  const evidenceIds = new Set(evidence.map((row) => row.id));
  const reserveReportIds = new Set(reserveReports.map((row) => row.id));

  const classificationById = new Map(classifications.map((row) => [row.id, row]));
  const profileById = new Map(profiles.map((row) => [row.id, row]));
  const legalById = new Map(legalProfiles.map((row) => [row.id, row]));
  const relationshipsByAsset = byAsset(relationships, (row) => [row.stablecoin_id]);
  const reportsByAsset = byAsset(reserveReports, (row) => [row.stablecoin_id]);
  const deploymentsByAsset = byAsset(deployments, (row) => [row.stablecoin_id]);
  const eventsByAsset = byAsset(events, (row) => [row.stablecoin_id, ...(row.subject_stablecoin_ids ?? [])]);
  const evidenceByAsset = byAsset(evidence, (row) => [row.stablecoin_id, ...(row.stablecoin_ids ?? [])]);
  const knownUnknownsByAsset = byAsset(knownUnknowns, (row) => [row.stablecoin_id]);
  const regulatoryByAsset = byAsset(regulatoryNotes, (row) => [row.stablecoin_id, ...(row.stablecoin_ids ?? [])]);
  const reserveComponentsByAsset = byAsset(reserveComponents, (row) => [row.stablecoin_id]);
  const incomeByAsset = byAsset(incomeProfiles, (row) => [row.id, row.stablecoin_id]);
  const launchQueueByAsset = new Map((launchQueue.records ?? []).map((row) => [row.stablecoin_id, row]));

  const duplicateIdCounts = new Map();
  const slugCounts = new Map();
  for (const row of stablecoins) {
    duplicateIdCounts.set(row.id, (duplicateIdCounts.get(row.id) ?? 0) + 1);
    slugCounts.set(row.slug, (slugCounts.get(row.slug) ?? 0) + 1);
  }

  const result = (dimension, state, reasonCodes, detail = {}) => ({
    dimension_id: dimension.id,
    state,
    readiness_scored: dimension.readiness_scored,
    reason_codes: uniq(reasonCodes).sort(),
    ...detail,
  });

  const audits = [];
  const normalizationQueue = [];

  for (const asset of stablecoins) {
    const classification = classificationById.get(asset.id);
    const profile = profileById.get(asset.id);
    const legal = legalById.get(asset.id);
    const rels = relationshipsByAsset.get(asset.id) ?? [];
    const reports = reportsByAsset.get(asset.id) ?? [];
    const assetDeployments = deploymentsByAsset.get(asset.id) ?? [];
    const assetEvents = eventsByAsset.get(asset.id) ?? [];
    const assetEvidence = evidenceByAsset.get(asset.id) ?? [];
    const assetUnknowns = knownUnknownsByAsset.get(asset.id) ?? [];
    const assetRegulatory = regulatoryByAsset.get(asset.id) ?? [];
    const assetComponents = reserveComponentsByAsset.get(asset.id) ?? [];
    const assetIncome = incomeByAsset.get(asset.id) ?? [];
    const launchQueueRow = launchQueueByAsset.get(asset.id);

    const dimensionResults = [];

    for (const dimension of contract.dimensions) {
      let row;
      switch (dimension.id) {
        case 'identity_consistency': {
          const blockers = [];
          if (!asset.id || !asset.slug || !asset.name) blockers.push('missing_canonical_identity_field');
          if ((duplicateIdCounts.get(asset.id) ?? 0) > 1) blockers.push('duplicate_identity');
          if ((slugCounts.get(asset.slug) ?? 0) > 1) blockers.push('duplicate_slug');
          if (blockers.length) row = result(dimension, 'integrity_blocked', blockers);
          else if (isUnresolved(asset.symbol)) row = result(dimension, 'ready_with_unknowns', ['symbol_unresolved']);
          else row = result(dimension, 'ready', ['canonical_identity_structured']);
          break;
        }
        case 'issuer_asset_boundary': {
          const broken = rels.filter((rel) => rel.organization_id && !organizationIds.has(rel.organization_id));
          if (rels.length === 0) row = result(dimension, 'integrity_blocked', ['missing_organization_relationship']);
          else if (broken.length) row = result(dimension, 'integrity_blocked', ['broken_organization_reference']);
          else if (rels.some((rel) => isUnresolved(rel.role) || isUnresolved(rel.status))) row = result(dimension, 'ready_with_unknowns', ['relationship_role_or_state_unresolved'], { relationship_count: rels.length });
          else row = result(dimension, 'ready', ['organization_boundary_structured'], { relationship_count: rels.length });
          break;
        }
        case 'lifecycle_semantics': {
          if (!classification || !classification.lifecycle_status) row = result(dimension, 'integrity_blocked', ['missing_lifecycle_classification']);
          else if (isUnresolved(classification.lifecycle_status)) row = result(dimension, 'ready_with_unknowns', ['lifecycle_explicitly_unresolved']);
          else row = result(dimension, 'ready', ['lifecycle_structured']);
          break;
        }
        case 'reference_target_and_currency': {
          const peg = classification?.peg_reference;
          if (!peg || !peg.kind) row = result(dimension, 'needs_normalization', ['missing_peg_reference_structure']);
          else if (isUnresolved(peg.kind) || (peg.kind === 'fiat' && isUnresolved(peg.asset))) row = result(dimension, 'ready_with_unknowns', ['reference_explicitly_unresolved']);
          else row = result(dimension, 'ready', ['reference_structure_projectable']);
          break;
        }
        case 'asset_class': {
          if (!classification?.asset_class) row = result(dimension, 'needs_normalization', ['missing_asset_class']);
          else if (isUnresolved(classification.asset_class)) row = result(dimension, 'ready_with_unknowns', ['asset_class_explicitly_unresolved']);
          else row = result(dimension, 'ready', ['asset_class_projectable']);
          break;
        }
        case 'backing_model_representation': {
          const backing = classification?.backing_types;
          if (!Array.isArray(backing) || backing.length === 0) row = result(dimension, 'needs_normalization', ['missing_backing_type_array']);
          else if (backing.some((value) => isUnresolved(value))) row = result(dimension, 'ready_with_unknowns', ['backing_explicitly_unresolved'], { reserve_component_count: assetComponents.length });
          else row = result(dimension, 'ready', ['backing_multi_select_projectable'], { reserve_component_count: assetComponents.length });
          break;
        }
        case 'stabilization_mechanism_representation': {
          const mechanism = classification?.stabilization_mechanism;
          if (!mechanism) row = result(dimension, 'needs_normalization', ['missing_stabilization_mechanism']);
          else if (isUnresolved(mechanism)) row = result(dimension, 'ready_with_unknowns', ['stabilization_explicitly_unresolved']);
          else row = result(dimension, 'ready', ['stabilization_projectable']);
          break;
        }
        case 'reserve_disclosure_comparability': {
          const reserve = profile?.reserve_profile;
          if (!reserve) row = result(dimension, 'integrity_blocked', ['missing_reserve_profile']);
          else if (reserve.latest_report_id && !reserveReportIds.has(reserve.latest_report_id)) row = result(dimension, 'integrity_blocked', ['invalid_latest_report_reference']);
          else if (isUnresolved(reserve.disclosure_status)) row = result(dimension, 'ready_with_unknowns', ['reserve_disclosure_explicitly_unresolved'], { reserve_report_count: reports.length });
          else row = result(dimension, 'ready', ['reserve_disclosure_projectable'], { reserve_report_count: reports.length });
          break;
        }
        case 'reserve_report_date_semantics': {
          if (reports.length === 0) row = result(dimension, 'ready_with_unknowns', ['no_reserve_report_row']);
          else {
            const dates = reports.map((report) => report.report_date ?? report.as_of_date ?? null);
            const invalid = dates.filter((value) => value != null && !validDay(value));
            if (invalid.length) row = result(dimension, 'needs_normalization', ['invalid_reserve_report_date']);
            else if (dates.every((value) => value == null)) row = result(dimension, 'ready_with_unknowns', ['reserve_report_day_not_recorded']);
            else row = result(dimension, 'ready', ['reserve_report_date_semantics_projectable']);
          }
          break;
        }
        case 'issuance_comparability': {
          const issuance = classification?.issuance_status;
          if (!issuance) row = result(dimension, 'needs_normalization', ['missing_issuance_status']);
          else if (isUnresolved(issuance)) row = result(dimension, 'ready_with_unknowns', ['issuance_explicitly_unresolved']);
          else row = result(dimension, 'ready', ['issuance_state_projectable']);
          break;
        }
        case 'redemption_comparability': {
          const redemption = profile?.redemption_profile;
          if (!redemption || !redemption.status) row = result(dimension, 'integrity_blocked', ['missing_redemption_profile_or_status']);
          else {
            const compared = [redemption.status, redemption.retail_access, redemption.institutional_access, redemption.minimum_amount_text];
            if (compared.some((value) => isUnresolved(value))) row = result(dimension, 'ready_with_unknowns', ['redemption_fields_explicitly_unresolved']);
            else row = result(dimension, 'ready', ['redemption_structure_projectable']);
          }
          break;
        }
        case 'legal_classification_comparability': {
          if (!legal) row = result(dimension, 'integrity_blocked', ['missing_legal_profile']);
          else {
            const refs = uniq([...(legal.evidence_ids ?? []), ...(legal.classifications ?? []).flatMap((entry) => entry.evidence_ids ?? [])]);
            const brokenRefs = refs.filter((id) => !evidenceIds.has(id));
            if (brokenRefs.length) row = result(dimension, 'integrity_blocked', ['broken_legal_evidence_reference']);
            else if ((legal.classifications ?? []).length === 0 || (legal.classifications ?? []).some((entry) => isUnresolved(entry.jurisdiction) || isUnresolved(entry.classification))) row = result(dimension, 'ready_with_unknowns', ['legal_scope_explicitly_unresolved']);
            else row = result(dimension, 'ready', ['jurisdiction_scoped_legal_classification_projectable']);
          }
          break;
        }
        case 'regulatory_action_scope': {
          const brokenRefs = assetRegulatory.filter((note) => {
            const assetRefs = uniq([note.stablecoin_id, ...(note.stablecoin_ids ?? [])].filter(Boolean));
            const orgRefs = uniq([note.organization_id, ...(note.organization_ids ?? [])].filter(Boolean));
            return assetRefs.some((id) => !stablecoinIds.has(id)) || orgRefs.some((id) => !organizationIds.has(id));
          });
          if (brokenRefs.length) row = result(dimension, 'integrity_blocked', ['broken_regulatory_reference']);
          else if (assetRegulatory.length === 0) row = result(dimension, 'ready_with_unknowns', ['no_canonical_regulatory_note_no_negative_claim']);
          else row = result(dimension, 'ready', ['regulatory_scope_records_projectable'], { regulatory_note_count: assetRegulatory.length });
          break;
        }
        case 'market_access_applicability': {
          row = result(dimension, 'ready_with_unknowns', ['deferred_canonical_schema'], { deferred: true });
          break;
        }
        case 'launch_date_semantics': {
          if (asset.launch_date == null) {
            if (launchQueueRow) row = result(dimension, 'ready_with_unknowns', ['null_launch_date_explicitly_tracked']);
            else row = result(dimension, 'needs_normalization', ['null_launch_date_not_in_unresolved_queue']);
          } else if (!validDay(asset.launch_date)) row = result(dimension, 'integrity_blocked', ['invalid_launch_date']);
          else row = result(dimension, 'ready', ['day_level_launch_date_projectable']);
          break;
        }
        case 'verification_date_semantics': {
          const reviewed = asset.last_verified_at;
          if (reviewed == null) row = result(dimension, 'needs_normalization', ['missing_asset_verification_date']);
          else if (!validDay(reviewed)) row = result(dimension, 'integrity_blocked', ['invalid_asset_verification_date']);
          else row = result(dimension, 'ready', ['verification_date_projectable']);
          break;
        }
        case 'unknown_state_semantics': {
          const criticalValues = [
            asset.status,
            classification?.lifecycle_status,
            classification?.issuance_status,
            classification?.peg_reference?.kind,
            classification?.stabilization_mechanism,
            profile?.reserve_profile?.disclosure_status,
            profile?.redemption_profile?.status,
            legal?.holder_claim_type,
            legal?.reserve_ownership,
            legal?.reserve_segregation,
            legal?.bankruptcy_remoteness,
            ...assetDeployments.flatMap((deployment) => [deployment.chain, deployment.status, deployment.canonicality, deployment.verification_status]),
          ];
          const explicitUnresolved = criticalValues.some((value) => isUnresolved(value)) || asset.launch_date == null || assetUnknowns.length > 0;
          if (asset.launch_date == null && !launchQueueRow) row = result(dimension, 'needs_normalization', ['untracked_null_launch_boundary']);
          else if (explicitUnresolved) row = result(dimension, 'ready_with_unknowns', ['protected_unresolved_state_visible'], { known_unknown_count: assetUnknowns.length });
          else row = result(dimension, 'ready', ['no_hidden_comparison_critical_unknown_detected']);
          break;
        }
        case 'evidence_scope_and_relation_depth': {
          if (assetEvidence.length === 0) row = result(dimension, 'integrity_blocked', ['no_asset_evidence']);
          else {
            const broken = assetEvidence.filter((evidenceRow) => {
              const refs = uniq([evidenceRow.stablecoin_id, ...(evidenceRow.stablecoin_ids ?? [])].filter(Boolean));
              return refs.some((id) => !stablecoinIds.has(id));
            });
            if (broken.length) row = result(dimension, 'integrity_blocked', ['broken_evidence_asset_reference']);
            else if (assetEvidence.length === 1) row = result(dimension, 'ready_with_unknowns', ['single_evidence_row'], { evidence_count: 1 });
            else row = result(dimension, 'ready', ['evidence_scope_projectable'], { evidence_count: assetEvidence.length });
          }
          break;
        }
        case 'known_unknown_visibility': {
          const broken = assetUnknowns.filter((knownUnknown) => !stablecoinIds.has(knownUnknown.stablecoin_id));
          if (broken.length) row = result(dimension, 'integrity_blocked', ['broken_known_unknown_asset_reference']);
          else if (assetUnknowns.length) row = result(dimension, 'ready_with_unknowns', ['canonical_known_unknowns_visible'], { known_unknown_count: assetUnknowns.length, topics: uniq(assetUnknowns.map((item) => item.topic).filter(Boolean)).sort() });
          else row = result(dimension, 'ready', ['no_canonical_known_unknown_rows']);
          break;
        }
        default:
          throw new Error(`Unsupported comparison readiness dimension: ${dimension.id}`);
      }
      dimensionResults.push(row);
    }

    const scoredStates = dimensionResults.filter((row) => row.readiness_scored).map((row) => row.state);
    const overallState = worstState(scoredStates);
    const assetAudit = {
      asset_id: asset.id,
      slug: asset.slug,
      overall_state: overallState,
      dimensions: dimensionResults,
      supporting_inventory: {
        relationships: rels.length,
        reserve_reports: reports.length,
        deployments: assetDeployments.length,
        events: assetEvents.length,
        evidence: assetEvidence.length,
        known_unknowns: assetUnknowns.length,
        regulatory_notes: assetRegulatory.length,
        reserve_components: assetComponents.length,
        income_profiles: assetIncome.length,
        evidence_relation_rows_loaded: evidenceRelations.length,
        event_detail_rows_loaded: eventDetails.length,
        stable_asset_relationship_rows_loaded: stableAssetRelationships.length,
      },
    };
    audits.push(assetAudit);

    for (const dimensionResult of dimensionResults) {
      if (!['needs_normalization', 'integrity_blocked'].includes(dimensionResult.state)) continue;
      normalizationQueue.push({
        asset_id: asset.id,
        dimension_id: dimensionResult.dimension_id,
        state: dimensionResult.state,
        severity: dimensionResult.state === 'integrity_blocked' ? 'critical' : 'medium',
        reason_code: dimensionResult.reason_codes[0] ?? 'unspecified',
      });
    }
  }

  normalizationQueue.sort((a, b) => {
    const stateOrder = { integrity_blocked: 0, needs_normalization: 1 };
    return stateOrder[a.state] - stateOrder[b.state] || a.asset_id.localeCompare(b.asset_id) || a.dimension_id.localeCompare(b.dimension_id);
  });

  const assetSummary = Object.fromEntries(contract.readiness_states.map((state) => [state, audits.filter((row) => row.overall_state === state).length]));
  const dimensionSummary = contract.dimensions.map((dimension) => ({
    dimension_id: dimension.id,
    readiness_scored: dimension.readiness_scored,
    state_counts: Object.fromEntries(contract.readiness_states.map((state) => [state, audits.filter((asset) => asset.dimensions.find((row) => row.dimension_id === dimension.id)?.state === state).length])),
  }));

  const digest = crypto.createHash('sha256');
  for (const file of [...sourceFiles].sort()) {
    digest.update(file);
    digest.update('\0');
    digest.update(readText(file));
    digest.update('\0');
  }

  return {
    schema_version: '1.0',
    audit_id: 'sog_comparison_readiness_audit_pr337_110_assets',
    status: 'internal_reviewed_audit',
    checkpoint_id: checkpoint.checkpoint_id,
    asset_count: stablecoins.length,
    dimension_count: contract.dimensions.length,
    contract_id: contract.contract_id,
    input_digest_sha256: digest.digest('hex'),
    generated_from_canonical_only: true,
    single_composite_score: false,
    asset_state_precedence: ['integrity_blocked', 'needs_normalization', 'ready_with_unknowns', 'ready'],
    summary: {
      asset_states: assetSummary,
      normalization_queue_count: normalizationQueue.length,
      integrity_blocked_dimension_count: normalizationQueue.filter((row) => row.state === 'integrity_blocked').length,
      needs_normalization_dimension_count: normalizationQueue.filter((row) => row.state === 'needs_normalization').length,
      dimension_states: dimensionSummary,
    },
    assets: audits,
    normalization_queue: normalizationQueue,
  };
}

export function serializeAudit(audit) {
  return `${JSON.stringify(audit, null, 2)}\n`;
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const audit = buildComparisonReadinessAudit();
  const serialized = serializeAudit(audit);
  const outputPath = process.argv[2];
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
    fs.writeFileSync(path.join(root, outputPath), serialized);
    console.log(outputPath);
  } else {
    process.stdout.write(serialized);
  }
}
