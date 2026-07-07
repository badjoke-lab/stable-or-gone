import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { buildMonitoringCoverageReport } from './monitoring/audits/current-coverage.mjs';

const root = process.cwd();
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const digestJson = (value) => sha256(Buffer.from(JSON.stringify(value)));
const sorted = (values) => [...values].sort();

const checkpoint = readJson('docs/migration/audited-100-asset-canonical-checkpoint.json');
const sourcesPath = 'scripts/monitoring/sources/official-sources.json';
const baselinesPath = 'scripts/monitoring/baselines/official-source-baselines.json';
const sources = readJson(sourcesPath).filter((row) => row.enabled !== false);
const baselineSet = readJson(baselinesPath);
const report = buildMonitoringCoverageReport(root);

const sourceIds = sorted(sources.map((row) => row.source_id));
const baselineIds = sorted((baselineSet.baselines ?? []).map((row) => row.source_id));

const assetProjection = report.stablecoins
  .map((row) => ({
    stablecoin_id: row.stablecoin_id,
    source_ids: sorted(row.source_ids ?? []),
    source_families: sorted(row.source_families ?? []),
    baseline_status_counts: row.baseline_status_counts,
    coverage_class: row.coverage_class,
    accepted_monitoring_coverage: row.accepted_monitoring_coverage,
  }))
  .sort((a, b) => a.stablecoin_id.localeCompare(b.stablecoin_id));

const organizationProjection = report.organizations
  .map((row) => ({
    organization_id: row.organization_id,
    source_ids: sorted(row.source_ids ?? []),
    source_families: sorted(row.source_families ?? []),
    coverage_class: row.coverage_class,
  }))
  .sort((a, b) => a.organization_id.localeCompare(b.organization_id));

const sourceProjection = report.sources
  .map((row) => ({
    source_id: row.source_id,
    baseline_status: row.baseline_status,
    stablecoin_ids: sorted(row.stablecoin_ids ?? []),
    organization_ids: sorted(row.organization_ids ?? []),
    source_families: sorted(row.source_families ?? []),
    signal_types: sorted(row.signal_types ?? []),
    monitoring_scope: row.monitoring_scope ?? null,
  }))
  .sort((a, b) => a.source_id.localeCompare(b.source_id));

const scopeProjection = report.sources
  .filter((row) => row.monitoring_scope)
  .map((row) => ({ source_id: row.source_id, monitoring_scope: row.monitoring_scope }))
  .sort((a, b) => a.source_id.localeCompare(b.source_id));

const uncoveredAssetIds = sorted(report.uncovered_stablecoin_ids ?? []);

const output = {
  schema_version: '1.1',
  sync_kind: 'monitoring_baseline_sync_observation',
  checkpoint_id: checkpoint.checkpoint_id,
  normalization_version: baselineSet.normalization_version,
  canonical_counts: {
    stablecoins: report.summary.canonical_stablecoin_count,
    organizations: report.summary.canonical_organization_count,
    relationships: report.summary.canonical_relationship_count,
  },
  source_baseline_sync: {
    source_count: sources.length,
    baseline_count: (baselineSet.baselines ?? []).length,
    source_baseline_id_parity: JSON.stringify(sourceIds) === JSON.stringify(baselineIds),
    pending_initial_acceptance: report.summary.baseline_status_counts.pending_initial_acceptance,
    accepted: report.summary.baseline_status_counts.accepted,
    missing: report.summary.baseline_status_counts.missing,
  },
  coverage: {
    registered_asset_reach_count: report.summary.covered_stablecoin_count,
    uncovered_asset_count: report.summary.uncovered_stablecoin_count,
    covered_organization_count: report.summary.covered_organization_count,
    accepted_asset_reach_count: report.summary.accepted_coverage_stablecoin_count,
    multi_family_asset_count: report.summary.multi_family_stablecoin_count,
  },
  scoped_coverage: {
    platform_policy_source_count: report.summary.platform_policy_source_count,
    platform_service_state_source_count: report.summary.platform_service_state_source_count,
    regulatory_register_source_count: report.summary.regulatory_register_source_count,
    market_access_schema_capable_source_count: report.summary.market_access_schema_capable_source_count,
    scoped_platform_count: report.summary.scoped_platform_count,
    scoped_region_count: report.summary.scoped_region_count,
  },
  source_family_counts: report.summary.source_family_counts,
  stablecoin_family_counts: report.summary.stablecoin_family_counts,
  asset_sync_sha256: digestJson(assetProjection),
  organization_sync_sha256: digestJson(organizationProjection),
  source_baseline_sync_sha256: digestJson(sourceProjection),
  monitoring_scope_sha256: digestJson(scopeProjection),
  uncovered_asset_ids_sha256: digestJson(uncoveredAssetIds),
  source_allowlist_sha256: sha256(fs.readFileSync(path.join(root, sourcesPath))),
  baseline_file_sha256: sha256(fs.readFileSync(path.join(root, baselinesPath))),
  policy: {
    human_review_required: baselineSet.policy?.human_review_required,
    monitoring_write_allowed: baselineSet.policy?.monitoring_write_allowed,
    canonical_evidence: baselineSet.policy?.canonical_evidence,
    public_output: baselineSet.policy?.public_output,
    automatic_pull_request: baselineSet.policy?.automatic_pull_request,
    production_publication: baselineSet.policy?.production_publication,
    network_access_used: false,
    canonical_action: 'none',
  },
};

const outputPath = process.env.SOG_MONITORING_SYNC_OUTPUT || 'artifacts/monitoring-baseline-sync-current.json';
fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
fs.writeFileSync(path.join(root, outputPath), `${JSON.stringify(output, null, 2)}\n`);

console.log(JSON.stringify({
  output: outputPath,
  checkpoint_id: output.checkpoint_id,
  canonical_counts: output.canonical_counts,
  source_baseline_sync: output.source_baseline_sync,
  coverage: output.coverage,
  scoped_coverage: output.scoped_coverage,
  asset_sync_sha256: output.asset_sync_sha256,
  source_baseline_sync_sha256: output.source_baseline_sync_sha256,
  monitoring_scope_sha256: output.monitoring_scope_sha256,
}, null, 2));
