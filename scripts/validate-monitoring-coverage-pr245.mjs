import fs from 'node:fs';
import path from 'node:path';
import { buildMonitoringCoverageReport, SOURCE_FAMILIES } from './monitoring/audits/build-coverage-report.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const failures = [];
const fail = (message) => failures.push(message);
const root = process.cwd();
const approvedClasses = new Set(['no_registered_source', 'single_family_coverage', 'multi_family_coverage']);
const approvedFamilies = new Set(SOURCE_FAMILIES);

function readRows(relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  return Array.isArray(value) ? value : value.records ?? [];
}

function loadGroup(baseline, group) {
  return (baseline.data_groups?.[group] ?? []).flatMap(readRows);
}

let first;
let second;
try {
  first = buildMonitoringCoverageReport(root);
  second = buildMonitoringCoverageReport(root);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

if (first && second) {
  if (JSON.stringify(first) !== JSON.stringify(second)) fail('coverage report must be byte-deterministic across repeated generation');
  if (first.schema_version !== '1.0') fail('schema_version must be 1.0');
  if (first.report_id !== 'sog_monitoring_coverage_92_assets_24_sources_v1') fail('report_id mismatch');

  const registry = loadRegistryV2Baseline(root);
  const stablecoins = loadGroup(registry, 'stablecoins');
  const organizations = loadGroup(registry, 'organizations');
  const relationships = loadGroup(registry, 'relationships');
  const canonicalStablecoinIds = stablecoins.map((row) => row.id).sort();
  const canonicalOrganizationIds = organizations.map((row) => row.id).sort();
  const relationshipPairs = new Set(relationships.map((row) => `${row.stablecoin_id}|${row.organization_id}`));

  if (stablecoins.length !== 92) fail(`expected 92 canonical stable assets, found ${stablecoins.length}`);
  if (first.stablecoins.length !== 92) fail(`expected 92 asset rows, found ${first.stablecoins.length}`);
  if (first.sources.length !== 24) fail(`expected 24 source rows, found ${first.sources.length}`);
  if (first.summary.registered_source_count !== 24) fail('summary registered source count must be 24');
  if (first.summary.unique_source_url_count !== 23) fail('unique source URL count must be 23');
  if (first.summary.covered_stablecoin_count !== 16) fail(`covered stablecoin count must be 16, found ${first.summary.covered_stablecoin_count}`);
  if (first.summary.uncovered_stablecoin_count !== 76) fail(`uncovered stablecoin count must be 76, found ${first.summary.uncovered_stablecoin_count}`);
  if (first.summary.multi_family_stablecoin_count !== 7) fail(`multi-family asset count must be 7, found ${first.summary.multi_family_stablecoin_count}`);
  if (first.summary.accepted_coverage_stablecoin_count !== 0) fail('accepted monitoring coverage must remain zero');
  if (first.summary.covered_organization_count !== 12) fail(`covered organization count must be 12, found ${first.summary.covered_organization_count}`);

  const expectedSourceFamilies = { reserve_assurance: 9, redemption_terms: 5, issuer_lifecycle: 5, regulatory: 5 };
  const expectedAssetFamilies = { reserve_assurance: 11, redemption_terms: 7, issuer_lifecycle: 5, regulatory: 5 };
  for (const family of SOURCE_FAMILIES) {
    if (first.summary.source_family_counts?.[family] !== expectedSourceFamilies[family]) fail(`${family}: source count mismatch`);
    if (first.summary.stablecoin_family_counts?.[family] !== expectedAssetFamilies[family]) fail(`${family}: asset count mismatch`);
  }

  const reportStablecoinIds = first.stablecoins.map((row) => row.stablecoin_id).sort();
  const reportOrganizationIds = first.organizations.map((row) => row.organization_id).sort();
  if (JSON.stringify(reportStablecoinIds) !== JSON.stringify(canonicalStablecoinIds)) fail('asset rows must exactly match canonical stablecoin IDs');
  if (JSON.stringify(reportOrganizationIds) !== JSON.stringify(canonicalOrganizationIds)) fail('organization rows must exactly match canonical organization IDs');
  if (new Set(reportStablecoinIds).size !== reportStablecoinIds.length) fail('asset rows contain duplicate IDs');
  if (new Set(reportOrganizationIds).size !== reportOrganizationIds.length) fail('organization rows contain duplicate IDs');

  const sourceIds = first.sources.map((row) => row.source_id);
  if (new Set(sourceIds).size !== sourceIds.length) fail('source rows contain duplicate IDs');
  for (const source of first.sources) {
    if (source.canonical_action !== 'none') fail(`${source.source_id}: canonical action must be none`);
    if (source.baseline_status !== 'pending_initial_acceptance') fail(`${source.source_id}: baseline must remain pending`);
    for (const family of source.source_families) if (!approvedFamilies.has(family)) fail(`${source.source_id}: invalid family ${family}`);
    for (const stablecoinId of source.stablecoin_ids) {
      for (const organizationId of source.organization_ids) {
        if (!relationshipPairs.has(`${stablecoinId}|${organizationId}`)) fail(`${source.source_id}: missing exact canonical relationship ${stablecoinId}|${organizationId}`);
      }
    }
  }

  for (const row of first.stablecoins) {
    if (!approvedClasses.has(row.coverage_class)) fail(`${row.stablecoin_id}: invalid coverage class`);
    if (row.canonical_action !== 'none') fail(`${row.stablecoin_id}: canonical action must be none`);
    for (const family of row.source_families) if (!approvedFamilies.has(family)) fail(`${row.stablecoin_id}: invalid family ${family}`);
    if (row.source_family_count !== row.source_families.length) fail(`${row.stablecoin_id}: family count mismatch`);
    if (row.source_count !== row.source_ids.length) fail(`${row.stablecoin_id}: source count mismatch`);
    const expectedClass = row.source_family_count === 0 ? 'no_registered_source' : row.source_family_count === 1 ? 'single_family_coverage' : 'multi_family_coverage';
    if (row.coverage_class !== expectedClass) fail(`${row.stablecoin_id}: coverage class mismatch`);
    if (row.accepted_monitoring_coverage !== false) fail(`${row.stablecoin_id}: accepted coverage must remain false`);
  }

  const uncoveredAssetIds = first.stablecoins.filter((row) => row.source_count === 0).map((row) => row.stablecoin_id);
  const uncoveredOrganizationIds = first.organizations.filter((row) => row.source_count === 0).map((row) => row.organization_id);
  if (JSON.stringify(first.uncovered_stablecoin_ids) !== JSON.stringify(uncoveredAssetIds)) fail('uncovered stablecoin list mismatch');
  if (JSON.stringify(first.uncovered_organization_ids) !== JSON.stringify(uncoveredOrganizationIds)) fail('uncovered organization list mismatch');

  if (first.summary.baseline_status_counts.pending_initial_acceptance !== 24) fail('pending baseline count must be 24');
  if (first.summary.baseline_status_counts.accepted !== 0) fail('accepted baseline count must be zero');
  if (first.summary.baseline_status_counts.missing !== 0) fail('missing baseline count must be zero');
  if (first.canonical_reference_check.stablecoin_ids_resolved !== true) fail('stablecoin reference check must pass');
  if (first.canonical_reference_check.organization_ids_resolved !== true) fail('organization reference check must pass');

  const expectedPolicy = {
    coverage_is_not_quality_score: true,
    registered_source_is_not_accepted_baseline: true,
    pending_source_is_not_active_monitoring_proof: true,
    uncovered_is_not_unmonitorable: true,
    source_count_is_not_completeness: true,
    canonical_action: 'none',
    network_access: false,
    public_output: false,
    production_publication: false
  };
  for (const [key, expected] of Object.entries(expectedPolicy)) if (first.policy?.[key] !== expected) fail(`policy.${key} must be ${expected}`);
}

const ignored = new Set(fs.readFileSync('.gitignore', 'utf8').split(/\r?\n/));
if (!ignored.has('data-staging/monitoring-coverage/')) fail('private coverage output directory must be ignored');

const generator = fs.readFileSync('scripts/monitoring/audits/build-coverage-report.mjs', 'utf8');
for (const forbidden of ['fetch(', 'node:https', 'node:http', 'child_process', 'wrangler', 'CLOUDFLARE_', 'create_pull_request']) {
  if (generator.includes(forbidden)) fail(`coverage generator contains prohibited capability: ${forbidden}`);
}

const spec = fs.readFileSync('docs/quality/monitoring-coverage-report-spec.md', 'utf8');
for (const phrase of [
  'generating a deterministic coverage report',
  'Coverage means only that a registered review-only source targets a canonical record',
  'exactly 92 canonical stable assets are represented once each',
  'exactly 24 registered sources and 24 matching baselines are represented once each',
  'Current accepted coverage remains zero',
  'PR #245 completes the reviewed source-coverage implementation phase',
  'No production deployment required'
]) if (!spec.includes(phrase)) fail(`PR #245 specification missing: ${phrase}`);

if (failures.length) {
  console.error('PR #245 monitoring coverage validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('PR #245 monitoring coverage valid: 16 of 92 assets covered by 24 pending sources across four reporting families.');
