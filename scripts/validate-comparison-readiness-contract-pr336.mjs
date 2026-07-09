import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const contract = read('data/quality/comparison-readiness-contract-v1.json');
const checkpoint = read('docs/migration/current-canonical-checkpoint.json');
const baseline = loadRegistryV2Baseline(root);
const stablecoinFiles = baseline.data_groups?.stablecoins ?? [];
const stablecoins = stablecoinFiles.flatMap(read);

const expectedDimensionIds = [
  'identity_consistency',
  'issuer_asset_boundary',
  'lifecycle_semantics',
  'reference_target_and_currency',
  'asset_class',
  'backing_model_representation',
  'stabilization_mechanism_representation',
  'reserve_disclosure_comparability',
  'reserve_report_date_semantics',
  'issuance_comparability',
  'redemption_comparability',
  'legal_classification_comparability',
  'regulatory_action_scope',
  'market_access_applicability',
  'launch_date_semantics',
  'verification_date_semantics',
  'unknown_state_semantics',
  'evidence_scope_and_relation_depth',
  'known_unknown_visibility'
];

const expectedReadinessStates = [
  'ready',
  'ready_with_unknowns',
  'needs_normalization',
  'integrity_blocked'
];

const expectedProtectedStates = [
  'null',
  'unknown',
  'not_recorded',
  'not_applicable',
  'source_review_needed'
];

const forbiddenSourceFragments = [
  'candidate',
  'monitoring',
  'news_discovery',
  'editorial',
  'article_draft',
  'private',
  'live_price',
  'market_cap',
  'apy',
  'risk_feed'
];

expect(contract.schema_version === '1.0', 'contract schema_version must be 1.0');
expect(contract.contract_id === 'sog_comparison_readiness_contract_pr336_v1', 'contract_id mismatch');
expect(contract.status === 'canonical_internal_audit_contract', 'contract status mismatch');
expect(contract.checkpoint_id === checkpoint.checkpoint_id, 'contract checkpoint must equal current canonical checkpoint');
expect(checkpoint.checkpoint_id === 'sog_controlled_growth_110_checkpoint_pr335_2026_07_09', 'PR #336 requires the reviewed 110-asset checkpoint');
expect(checkpoint.asset_count === 110, `checkpoint asset_count must be 110, found ${checkpoint.asset_count}`);
expect(contract.asset_denominator === 110, `contract denominator must be 110, found ${contract.asset_denominator}`);
expect(stablecoins.length === 110, `canonical stablecoin count must be 110, found ${stablecoins.length}`);

expect(JSON.stringify(contract.readiness_states) === JSON.stringify(expectedReadinessStates), 'readiness states must match the four-state contract exactly');
expect(JSON.stringify(contract.protected_unresolved_states) === JSON.stringify(expectedProtectedStates), 'protected unresolved states mismatch');

const dimensions = contract.dimensions ?? [];
expect(dimensions.length === 19, `exactly 19 dimensions required, found ${dimensions.length}`);
const dimensionIds = dimensions.map((row) => row.id);
expect(new Set(dimensionIds).size === dimensionIds.length, 'dimension IDs must be unique');
expect(JSON.stringify(dimensionIds) === JSON.stringify(expectedDimensionIds), 'dimension IDs or order mismatch');

const sourceAllowlist = new Set(contract.canonical_source_allowlist ?? []);
expect(sourceAllowlist.size > 0, 'canonical source allowlist must not be empty');
for (const dimension of dimensions) {
  expect(typeof dimension.id === 'string' && dimension.id.length > 0, 'dimension missing id');
  expect((contract.applicability_modes ?? []).includes(dimension.applicability), `${dimension.id}: invalid applicability mode ${dimension.applicability}`);
  expect(typeof dimension.readiness_scored === 'boolean', `${dimension.id}: readiness_scored must be boolean`);
  expect(Array.isArray(dimension.source_families) && dimension.source_families.length > 0, `${dimension.id}: source_families must be non-empty`);
  for (const source of dimension.source_families ?? []) {
    expect(sourceAllowlist.has(source), `${dimension.id}: source ${source} is not in canonical allowlist`);
    for (const fragment of forbiddenSourceFragments) {
      expect(!source.includes(fragment), `${dimension.id}: forbidden source family fragment ${fragment} found in ${source}`);
    }
  }
  expect(typeof dimension.unknown_policy === 'string' && dimension.unknown_policy.length > 0, `${dimension.id}: unknown_policy is required`);
  expect(Array.isArray(dimension.integrity_blockers), `${dimension.id}: integrity_blockers must be an array`);
}

for (const excluded of contract.excluded_source_families ?? []) {
  expect(!sourceAllowlist.has(excluded), `excluded source family ${excluded} must not be canonical allowlisted`);
}

const marketAccess = dimensions.find((row) => row.id === 'market_access_applicability');
expect(marketAccess?.applicability === 'future_canonical_schema', 'market access must remain future_canonical_schema in PR #336');
expect(marketAccess?.readiness_scored === false, 'market access must not be readiness-scored before canonical schema exists');
expect(JSON.stringify(marketAccess?.comparison_fields ?? []) === '[]', 'market access comparison fields must remain empty before canonical schema exists');
expect(marketAccess?.unknown_policy === 'emit_deferred_canonical_schema_only', 'market access deferred-state policy mismatch');

const auditOutput = contract.audit_output_contract ?? {};
expect(auditOutput.next_pr === 337, 'next readiness audit must be PR #337');
expect(auditOutput.asset_count === 110, 'PR #337 audit denominator must be 110');
expect(auditOutput.per_asset_dimension_states_required === true, 'per-asset dimension states must be required');
expect(auditOutput.single_composite_score_forbidden === true, 'single composite readiness score must be forbidden');
expect(auditOutput.normalization_queue_required === true, 'normalization queue must be required');

const normalization = contract.normalization_boundary ?? {};
expect(normalization.target_pr === 338, 'normalization target must be PR #338');
for (const forbidden of [
  'invent_missing_facts',
  'rewrite_lifecycle_history_for_display',
  'collapse_issuer_and_asset_identity',
  'convert_historical_source_presence_to_current_availability',
  'convert_missing_regulatory_or_access_records_to_negative_claims',
  'promote_monitoring_or_editorial_research_without_canonical_review'
]) {
  expect((normalization.forbidden ?? []).includes(forbidden), `normalization forbidden rule missing: ${forbidden}`);
}

for (const nonGoal of [
  'live_price',
  'market_cap',
  'apy',
  'safety_score',
  'risk_score',
  'ranking',
  'recommendation'
]) {
  expect((contract.non_goals ?? []).includes(nonGoal), `non-goal missing: ${nonGoal}`);
}

if (failures.length) {
  console.error('PR #336 Comparison Readiness contract validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  contract_id: contract.contract_id,
  checkpoint_id: contract.checkpoint_id,
  asset_denominator: contract.asset_denominator,
  dimensions: dimensions.length,
  readiness_states: contract.readiness_states,
  protected_unresolved_states: contract.protected_unresolved_states,
  market_access: {
    applicability: marketAccess.applicability,
    readiness_scored: marketAccess.readiness_scored
  },
  next_pr: auditOutput.next_pr,
  normalization_pr: normalization.target_pr
}, null, 2));
