import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { buildMonitoringCoverageReport } from './monitoring/audits/current-coverage.mjs';

const root = process.cwd();
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const readRows = (relativePath) => {
  const value = readJson(relativePath);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected array or records array`);
};
const loadGroup = (baseline, group) => (baseline.data_groups?.[group] ?? []).flatMap(readRows);
const unique = (values) => [...new Set(values.filter(Boolean))].sort();
const percent = (n, d) => d ? Number(((n / d) * 100).toFixed(2)) : 0;

const registry = loadRegistryV2Baseline(root);
const stablecoins = loadGroup(registry, 'stablecoins');
const organizations = loadGroup(registry, 'organizations');
const sources = readJson('scripts/monitoring/sources/official-sources.json').filter((row) => row.enabled !== false);
const baselineSet = readJson('scripts/monitoring/baselines/official-source-baselines.json');
const currentCoverage = buildMonitoringCoverageReport(root);
const baselineById = new Map((baselineSet.baselines ?? []).map((row) => [row.source_id, row]));

const sourceAssets = (rows) => unique(rows.flatMap((row) => row.affected_stablecoin_ids ?? []));
const sourceOrganizations = (rows) => unique(rows.flatMap((row) => row.affected_organization_ids ?? []));
const withSignals = (...signals) => sources.filter((row) => (row.signal_types ?? []).some((signal) => signals.includes(signal)));
const withKinds = (predicate) => sources.filter((row) => predicate(String(row.source_kind ?? '')));
const domain = (rows) => ({
  source_count: rows.length,
  stablecoin_count: sourceAssets(rows).length,
  organization_count: sourceOrganizations(rows).length,
  source_ids: rows.map((row) => row.source_id).sort(),
  stablecoin_ids: sourceAssets(rows),
  organization_ids: sourceOrganizations(rows)
});

const regulatoryRows = withKinds((kind) => kind.startsWith('regulator_') && !kind.includes('register'));
const registerRows = withKinds((kind) => kind.includes('register'));
const platformPolicyRows = withKinds((kind) => kind.startsWith('platform_') && (kind.includes('policy') || kind.includes('restriction') || kind.includes('delisting')));
const platformStateRows = withKinds((kind) => kind.startsWith('platform_') && (kind.includes('service') || kind.includes('account') || kind.includes('transition')));
const issuerProtocolRows = sources.filter((row) => {
  const kind = String(row.source_kind ?? '');
  return kind.startsWith('issuer_') || kind.startsWith('protocol_') || kind.startsWith('network_');
});
const reserveRows = withSignals('reserve_update', 'assurance_update', 'backing_attestation_update');
const redemptionRows = withSignals('issuance_redemption_update');
const lifecycleRows = withSignals('lifecycle_update');
const regulatorySignalRows = withSignals('regulatory_update');

const accessFunctionFields = [
  'buy', 'sell', 'spot_trading', 'margin', 'earn', 'deposit', 'withdraw', 'custody',
  'convert', 'auto_conversion', 'direct_mint', 'direct_redemption', 'payment_rail', 'network_support'
];
const accessFunctionCoverage = Object.fromEntries(accessFunctionFields.map((field) => [field, {
  source_count: sources.filter((row) => Array.isArray(row.function_scope) && row.function_scope.includes(field)).length,
  stablecoin_count: sourceAssets(sources.filter((row) => Array.isArray(row.function_scope) && row.function_scope.includes(field))).length
}]));

const marketAccessSchemaRows = sources.filter((row) =>
  row.platform_id || row.platform_legal_entity_id || row.region_scope || row.function_scope || row.market_access_signal_family || row.regulator_register_family
);
const acceptedSourceIds = sources
  .filter((row) => baselineById.get(row.source_id)?.status === 'accepted')
  .map((row) => row.source_id);
const acceptedRows = sources.filter((row) => acceptedSourceIds.includes(row.source_id));

const coveredAssetIds = unique(sources.flatMap((row) => row.affected_stablecoin_ids ?? []));
const canonicalIds = new Set(stablecoins.map((row) => row.id));
const uncoveredAssetIds = stablecoins.map((row) => row.id).filter((id) => !coveredAssetIds.includes(id)).sort();
const extraSourceAssetIds = coveredAssetIds.filter((id) => !canonicalIds.has(id));

const report = {
  schema_version: '1.0',
  audit_id: 'sog_monitoring_coverage_recalculation_100_assets_pr309',
  audit_date: '2026-07-06',
  baseline_id: registry.baseline_id,
  summary: {
    canonical_stablecoin_count: stablecoins.length,
    canonical_organization_count: organizations.length,
    registered_source_count: sources.length,
    registered_asset_reach_count: coveredAssetIds.length,
    registered_asset_reach_percent: percent(coveredAssetIds.length, stablecoins.length),
    uncovered_asset_count: uncoveredAssetIds.length,
    covered_organization_count: currentCoverage.summary.covered_organization_count,
    accepted_source_count: acceptedRows.length,
    accepted_asset_reach_count: sourceAssets(acceptedRows).length,
    pending_initial_acceptance_count: (baselineSet.baselines ?? []).filter((row) => row.status === 'pending_initial_acceptance').length,
    market_access_schema_capable_source_count: marketAccessSchemaRows.length
  },
  coverage_domains: {
    issuer_protocol: domain(issuerProtocolRows),
    reserve_assurance: domain(reserveRows),
    redemption_mint_terms: domain(redemptionRows),
    issuer_lifecycle: domain(lifecycleRows),
    regulatory_action_guidance: domain(regulatoryRows),
    regulatory_signal: domain(regulatorySignalRows),
    platform_policy: domain(platformPolicyRows),
    platform_service_state: domain(platformStateRows),
    regulatory_register: domain(registerRows),
    accepted_baseline: domain(acceptedRows)
  },
  eu_eea_market_access: {
    schema_capable_source_count: marketAccessSchemaRows.length,
    schema_capable_source_ids: marketAccessSchemaRows.map((row) => row.source_id).sort(),
    function_coverage: accessFunctionCoverage,
    any_function_covered: Object.values(accessFunctionCoverage).some((row) => row.source_count > 0)
  },
  gaps: {
    uncovered_asset_ids: uncoveredAssetIds,
    extra_source_asset_ids: extraSourceAssetIds,
    platform_policy_source_gap: platformPolicyRows.length === 0,
    platform_service_state_source_gap: platformStateRows.length === 0,
    regulatory_register_source_gap: registerRows.length === 0,
    market_access_function_gap: !Object.values(accessFunctionCoverage).some((row) => row.source_count > 0),
    accepted_baseline_gap: acceptedRows.length === 0
  },
  interpretation: {
    registered_source_is_not_accepted_baseline: true,
    pending_baseline_is_not_accepted_coverage: true,
    issuer_protocol_reach_is_not_platform_policy_coverage: true,
    regulatory_action_is_not_register_coverage: true,
    generic_product_page_is_not_function_level_access_coverage: true,
    zero_coverage_is_valid_audit_result: true,
    source_count_is_not_completeness_score: true,
    canonical_action: 'none',
    network_access_used: false,
    public_output: false,
    production_publication: false
  }
};

fs.mkdirSync(path.join(root, 'data/generated'), { recursive: true });
fs.writeFileSync(path.join(root, 'data/generated/monitoring-coverage-recalculation-100-assets.json'), `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify({
  audit_id: report.audit_id,
  canonical_assets: report.summary.canonical_stablecoin_count,
  registered_sources: report.summary.registered_source_count,
  registered_asset_reach: report.summary.registered_asset_reach_count,
  uncovered_assets: report.summary.uncovered_asset_count,
  issuer_protocol_assets: report.coverage_domains.issuer_protocol.stablecoin_count,
  reserve_assurance_assets: report.coverage_domains.reserve_assurance.stablecoin_count,
  redemption_mint_assets: report.coverage_domains.redemption_mint_terms.stablecoin_count,
  lifecycle_assets: report.coverage_domains.issuer_lifecycle.stablecoin_count,
  regulatory_action_assets: report.coverage_domains.regulatory_action_guidance.stablecoin_count,
  platform_policy_assets: report.coverage_domains.platform_policy.stablecoin_count,
  regulatory_register_assets: report.coverage_domains.regulatory_register.stablecoin_count,
  market_access_schema_sources: report.summary.market_access_schema_capable_source_count,
  accepted_asset_reach: report.summary.accepted_asset_reach_count
}, null, 2));
