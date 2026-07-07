import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadRegistryV2Baseline } from '../../load-registry-v2-baseline.mjs';

export const SOURCE_FAMILIES = [
  'reserve_assurance',
  'redemption_terms',
  'issuer_lifecycle',
  'regulatory'
];

const SIGNAL_TO_FAMILY = {
  reserve_update: 'reserve_assurance',
  assurance_update: 'reserve_assurance',
  backing_attestation_update: 'reserve_assurance',
  issuance_redemption_update: 'redemption_terms',
  lifecycle_update: 'issuer_lifecycle',
  regulatory_update: 'regulatory'
};

function readJson(root, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function readRows(root, relativePath) {
  const value = readJson(root, relativePath);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or records array`);
}

function loadGroup(root, baseline, group) {
  return (baseline.data_groups?.[group] ?? []).flatMap((relativePath) => readRows(root, relativePath));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function percent(numerator, denominator) {
  if (!denominator) return 0;
  return Number(((numerator / denominator) * 100).toFixed(2));
}

function sourceFamilies(source) {
  return unique((source.signal_types ?? []).map((signal) => SIGNAL_TO_FAMILY[signal]));
}

function coverageClass(families) {
  if (families.length === 0) return 'no_registered_source';
  if (families.length === 1) return 'single_family_coverage';
  return 'multi_family_coverage';
}

function baselineCounts(sourceIds, baselineById) {
  const counts = {
    pending_initial_acceptance: 0,
    accepted: 0,
    missing: 0
  };
  for (const sourceId of sourceIds) {
    const baseline = baselineById.get(sourceId);
    if (!baseline) counts.missing += 1;
    else if (baseline.status === 'pending_initial_acceptance') counts.pending_initial_acceptance += 1;
    else counts.accepted += 1;
  }
  return counts;
}

export function buildMonitoringCoverageReport(root = process.cwd()) {
  const registry = loadRegistryV2Baseline(root);
  const stablecoins = loadGroup(root, registry, 'stablecoins');
  const organizations = loadGroup(root, registry, 'organizations');
  const relationships = loadGroup(root, registry, 'relationships');
  const sources = readJson(root, 'scripts/monitoring/sources/official-sources.json').filter((row) => row.enabled !== false);
  const baselineSet = readJson(root, 'scripts/monitoring/baselines/official-source-baselines.json');
  const baselineById = new Map((baselineSet.baselines ?? []).map((row) => [row.source_id, row]));
  const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
  const organizationById = new Map(organizations.map((row) => [row.id, row]));

  const assetRows = stablecoins
    .map((stablecoin) => {
      const assetSources = sources.filter((source) => (source.affected_stablecoin_ids ?? []).includes(stablecoin.id));
      const sourceIds = assetSources.map((source) => source.source_id).sort();
      const families = unique(assetSources.flatMap(sourceFamilies));
      const signalTypes = unique(assetSources.flatMap((source) => source.signal_types ?? []));
      const organizationIds = unique(assetSources.flatMap((source) => source.affected_organization_ids ?? []));
      const baselineStatusCounts = baselineCounts(sourceIds, baselineById);
      return {
        stablecoin_id: stablecoin.id,
        name: stablecoin.name,
        symbol: stablecoin.symbol ?? null,
        status: stablecoin.status,
        source_ids: sourceIds,
        source_count: sourceIds.length,
        source_families: families,
        source_family_count: families.length,
        signal_types: signalTypes,
        organization_ids: organizationIds,
        baseline_status_counts: baselineStatusCounts,
        coverage_class: coverageClass(families),
        accepted_monitoring_coverage: baselineStatusCounts.accepted > 0,
        canonical_action: 'none'
      };
    })
    .sort((a, b) => a.stablecoin_id.localeCompare(b.stablecoin_id));

  const organizationRows = organizations
    .map((organization) => {
      const organizationSources = sources.filter((source) => (source.affected_organization_ids ?? []).includes(organization.id));
      const sourceIds = organizationSources.map((source) => source.source_id).sort();
      const stablecoinIds = unique(organizationSources.flatMap((source) => source.affected_stablecoin_ids ?? []));
      const families = unique(organizationSources.flatMap(sourceFamilies));
      return {
        organization_id: organization.id,
        name: organization.name,
        source_ids: sourceIds,
        source_count: sourceIds.length,
        stablecoin_ids: stablecoinIds,
        stablecoin_count: stablecoinIds.length,
        source_families: families,
        source_family_count: families.length,
        coverage_class: coverageClass(families),
        canonical_action: 'none'
      };
    })
    .sort((a, b) => a.organization_id.localeCompare(b.organization_id));

  const sourceRows = sources
    .map((source) => ({
      source_id: source.source_id,
      source_kind: source.source_kind,
      url: source.url,
      source_families: sourceFamilies(source),
      signal_types: unique(source.signal_types ?? []),
      stablecoin_ids: unique(source.affected_stablecoin_ids ?? []),
      organization_ids: unique(source.affected_organization_ids ?? []),
      baseline_status: baselineById.get(source.source_id)?.status ?? 'missing',
      canonical_action: 'none'
    }))
    .sort((a, b) => a.source_id.localeCompare(b.source_id));

  const coveredAssets = assetRows.filter((row) => row.source_count > 0);
  const multiFamilyAssets = assetRows.filter((row) => row.coverage_class === 'multi_family_coverage');
  const coveredOrganizations = organizationRows.filter((row) => row.source_count > 0);
  const acceptedAssets = assetRows.filter((row) => row.accepted_monitoring_coverage);
  const uniqueUrls = new Set(sourceRows.map((row) => row.url));

  const sourceFamilyCounts = Object.fromEntries(SOURCE_FAMILIES.map((family) => [
    family,
    sourceRows.filter((row) => row.source_families.includes(family)).length
  ]));
  const assetFamilyCounts = Object.fromEntries(SOURCE_FAMILIES.map((family) => [
    family,
    assetRows.filter((row) => row.source_families.includes(family)).length
  ]));

  const baselineStatusCounts = {
    pending_initial_acceptance: sourceRows.filter((row) => row.baseline_status === 'pending_initial_acceptance').length,
    accepted: sourceRows.filter((row) => row.baseline_status !== 'pending_initial_acceptance' && row.baseline_status !== 'missing').length,
    missing: sourceRows.filter((row) => row.baseline_status === 'missing').length
  };

  return {
    schema_version: '1.0',
    report_id: `sog_monitoring_coverage_${stablecoins.length}_assets_${sourceRows.length}_sources_v1`,
    generated_from: 'canonical_registry_v2_and_reviewed_monitoring_configuration',
    summary: {
      canonical_stablecoin_count: stablecoins.length,
      canonical_organization_count: organizations.length,
      canonical_relationship_count: relationships.length,
      registered_source_count: sourceRows.length,
      unique_source_url_count: uniqueUrls.size,
      covered_stablecoin_count: coveredAssets.length,
      uncovered_stablecoin_count: assetRows.length - coveredAssets.length,
      stablecoin_coverage_percent: percent(coveredAssets.length, assetRows.length),
      multi_family_stablecoin_count: multiFamilyAssets.length,
      multi_family_coverage_percent: percent(multiFamilyAssets.length, assetRows.length),
      accepted_coverage_stablecoin_count: acceptedAssets.length,
      covered_organization_count: coveredOrganizations.length,
      uncovered_organization_count: organizationRows.length - coveredOrganizations.length,
      organization_coverage_percent: percent(coveredOrganizations.length, organizationRows.length),
      source_family_counts: sourceFamilyCounts,
      stablecoin_family_counts: assetFamilyCounts,
      baseline_status_counts: baselineStatusCounts
    },
    policy: {
      coverage_is_not_quality_score: true,
      registered_source_is_not_accepted_baseline: true,
      pending_source_is_not_active_monitoring_proof: true,
      uncovered_is_not_unmonitorable: true,
      source_count_is_not_completeness: true,
      canonical_action: 'none',
      network_access: false,
      public_output: false,
      production_publication: false
    },
    uncovered_stablecoin_ids: assetRows.filter((row) => row.source_count === 0).map((row) => row.stablecoin_id),
    uncovered_organization_ids: organizationRows.filter((row) => row.source_count === 0).map((row) => row.organization_id),
    stablecoins: assetRows,
    organizations: organizationRows,
    sources: sourceRows,
    canonical_reference_check: {
      stablecoin_ids_resolved: sourceRows.every((source) => source.stablecoin_ids.every((id) => stablecoinById.has(id))),
      organization_ids_resolved: sourceRows.every((source) => source.organization_ids.every((id) => organizationById.has(id)))
    }
  };
}

function markdown(report) {
  const s = report.summary;
  return [
    '# SOG Monitoring Coverage Report',
    '',
    '> Coverage describes registered review-only source reach. It is not a quality score, accepted baseline, or canonical conclusion.',
    '',
    '## Summary',
    '',
    `- Canonical stable assets: ${s.canonical_stablecoin_count}`,
    `- Registered official sources: ${s.registered_source_count}`,
    `- Unique source URLs: ${s.unique_source_url_count}`,
    `- Assets with at least one registered source: ${s.covered_stablecoin_count} (${s.stablecoin_coverage_percent}%)`,
    `- Assets without a registered source: ${s.uncovered_stablecoin_count}`,
    `- Assets with multiple source families: ${s.multi_family_stablecoin_count} (${s.multi_family_coverage_percent}%)`,
    `- Assets with accepted monitoring coverage: ${s.accepted_coverage_stablecoin_count}`,
    `- Covered organizations: ${s.covered_organization_count} (${s.organization_coverage_percent}%)`,
    `- Pending baselines: ${s.baseline_status_counts.pending_initial_acceptance}`,
    `- Accepted baselines: ${s.baseline_status_counts.accepted}`,
    '',
    '## Source families',
    '',
    ...SOURCE_FAMILIES.map((family) => `- ${family}: ${s.source_family_counts[family]} sources / ${s.stablecoin_family_counts[family]} assets`),
    '',
    '## Covered assets',
    '',
    ...report.stablecoins.filter((row) => row.source_count > 0).map((row) => `- ${row.stablecoin_id} — ${row.name}: ${row.source_count} sources; ${row.source_families.join(', ')}`),
    '',
    '## Uncovered assets',
    '',
    ...report.uncovered_stablecoin_ids.map((id) => `- ${id}`),
    '',
    'Canonical action: none. Network access: false. Public output: false. Production publication: false.',
    ''
  ].join('\n');
}

function main() {
  const root = process.cwd();
  const report = buildMonitoringCoverageReport(root);
  const outputDirectory = path.join(root, 'data-staging/monitoring-coverage');
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, 'monitoring-coverage.json'), `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(path.join(outputDirectory, 'monitoring-coverage.md'), `${markdown(report)}\n`);
  console.log(JSON.stringify(report.summary, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
