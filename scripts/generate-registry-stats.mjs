import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getReferenceComparisonCategory } from '../config/reference-targets.mjs';
import { getPublicBackingModelCategory } from '../config/backing-models.mjs';

const root = process.cwd();
const outputPath = 'data/generated/registry-stats.json';

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function readGroup(files = []) {
  return files.flatMap((file) => {
    const rows = readJson(file);
    if (!Array.isArray(rows)) throw new Error(`${file} must contain a JSON array`);
    return rows;
  });
}

function countBy(rows, getter) {
  const counts = new Map();
  for (const row of rows) {
    const raw = getter(row);
    const values = Array.isArray(raw) ? raw : [raw];
    for (const value of values) {
      const key = value === null || value === undefined || value === '' ? 'unknown' : String(value);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

function share(covered, total) {
  return total === 0 ? 0 : Number((covered / total).toFixed(4));
}

function coverage(rows, stablecoinIds) {
  const coveredIds = new Set();
  for (const row of rows) {
    const candidates = [];
    if (typeof row.id === 'string' && stablecoinIds.has(row.id)) candidates.push(row.id);
    if (typeof row.stablecoin_id === 'string') candidates.push(row.stablecoin_id);
    if (Array.isArray(row.stablecoin_ids)) candidates.push(...row.stablecoin_ids);
    if (Array.isArray(row.subject_stablecoin_ids)) candidates.push(...row.subject_stablecoin_ids);
    for (const id of candidates) if (stablecoinIds.has(id)) coveredIds.add(id);
  }
  return {
    covered: coveredIds.size,
    total: stablecoinIds.size,
    share: share(coveredIds.size, stablecoinIds.size)
  };
}

function deterministicGeneratedAt(baseline) {
  if (process.env.SOURCE_DATE_EPOCH) {
    const milliseconds = Number(process.env.SOURCE_DATE_EPOCH) * 1000;
    if (!Number.isFinite(milliseconds)) throw new Error('SOURCE_DATE_EPOCH must be numeric');
    return new Date(milliseconds).toISOString();
  }
  return `${baseline.captured_at}T00:00:00.000Z`;
}

export function buildRegistryStats() {
  const baseline = readJson('docs/migration/registry-v2-baseline.json');
  const foundation = readJson('docs/migration/registry-v3-foundation.json');
  const incomeManifest = readJson('docs/migration/registry-v3-income-profiles.json');

  const groups = Object.fromEntries(
    Object.entries(baseline.data_groups).map(([name, files]) => [name, readGroup(files)])
  );
  const v3Groups = Object.fromEntries(
    Object.entries(foundation.data_groups).map(([name, files]) => [name, readGroup(files)])
  );
  const incomeProfiles = readGroup(incomeManifest.data_files);

  const stablecoins = groups.stablecoins;
  const classificationExtensionById = new Map((groups.classification_extensions ?? []).map((row) => [row.id, row]));
  const classifications = groups.classifications.map((row) => ({ ...row, ...(classificationExtensionById.get(row.id) ?? {}) }));
  const stablecoinIds = new Set(stablecoins.map((row) => row.id));
  const lifecycleCounts = countBy(classifications, (row) => row.lifecycle_status);
  const activeStatuses = new Set(['active', 'restricted']);
  const failedStatuses = new Set(['collapsed']);
  const activeSide = classifications.filter((row) => activeStatuses.has(row.lifecycle_status)).length;
  const strictFailed = classifications.filter((row) => failedStatuses.has(row.lifecycle_status)).length;
  const historicalSide = classifications.length - activeSide;

  const legalProfiles = v3Groups.legal_profiles;
  const reserveComponents = v3Groups.reserve_components;
  const relationshipsV3 = v3Groups.stable_asset_relationships;
  const deployments = groups.deployments;

  const legalUnclassified = legalProfiles.filter((row) =>
    !Array.isArray(row.classifications) ||
    row.classifications.length === 0 ||
    row.classifications.every((item) => item.classification === 'unclassified' || item.classification === 'unknown')
  ).length;
  const incomeAllUnknown = incomeProfiles.filter((row) =>
    [row.availability, row.source, row.accrual, row.rate].every((value) => value === 'unknown')
  ).length;
  const deploymentUnknown = deployments.filter((row) => !row.canonicality || row.canonicality === 'unknown').length;

  const stats = {
    schema_version: '1.0',
    generated_at: deterministicGeneratedAt(baseline),
    baseline_id: baseline.baseline_id,
    registry: {
      stablecoins: stablecoins.length,
      organizations: groups.organizations.length,
      relationships: groups.relationships.length,
      classifications: classifications.length,
      profiles: groups.profiles.length,
      events: groups.events.length,
      event_details: groups.event_details.length,
      evidence: groups.evidence.length,
      reserve_reports: groups.reserve_reports.length,
      known_unknowns: groups.known_unknowns.length,
      regulatory_notes: groups.regulatory_notes.length,
      deployments: deployments.length,
      legal_profiles: legalProfiles.length,
      stable_asset_relationships: relationshipsV3.length,
      reserve_components: reserveComponents.length,
      income_profiles: incomeProfiles.length
    },
    lifecycle: {
      by_status: lifecycleCounts,
      active_side: {
        count: activeSide,
        share: share(activeSide, classifications.length),
        statuses: ['active', 'restricted']
      },
      historical_side: {
        count: historicalSide,
        share: share(historicalSide, classifications.length),
        statuses: Object.keys(lifecycleCounts).filter((status) => !activeStatuses.has(status))
      },
      strict_failed: {
        count: strictFailed,
        share: share(strictFailed, classifications.length),
        statuses: ['collapsed']
      }
    },
    composition: {
      legacy_status_compatibility: countBy(stablecoins, (row) => row.status),
      issuance_statuses: countBy(classifications, (row) => row.issuance_status),
      reference_kinds: countBy(classifications, (row) => row.peg_reference?.kind),
      reference_target_categories: countBy(classifications, (row) => getReferenceComparisonCategory(row.peg_reference?.asset) ?? 'unknown'),
      canonical_reference_assets_compatibility: countBy(classifications, (row) => row.peg_reference?.asset),
      public_model_categories: countBy(stablecoins, (row) => getPublicBackingModelCategory(row.slug) ?? 'unknown'),
      asset_classes: countBy(classifications, (row) => row.asset_class ?? 'stablecoin'),
      backing_types_non_exclusive: countBy(classifications, (row) => row.backing_types ?? ['unknown']),
      stabilization_mechanisms: countBy(classifications, (row) => row.stabilization_mechanism),
      governance_models: countBy(classifications, (row) => row.governance_model),
      legal_classifications_non_exclusive: countBy(legalProfiles, (row) =>
        Array.isArray(row.classifications) && row.classifications.length
          ? row.classifications.map((item) => item.classification)
          : ['unknown']
      ),
      reserve_component_categories: countBy(reserveComponents, (row) => row.asset_category),
      deployment_chains: countBy(deployments, (row) => row.chain ?? row.network),
      income_availability: countBy(incomeProfiles, (row) => row.availability),
      income_sources: countBy(incomeProfiles, (row) => row.source),
      income_accrual: countBy(incomeProfiles, (row) => row.accrual),
      income_rates: countBy(incomeProfiles, (row) => row.rate)
    },
    coverage: {
      classifications: coverage(classifications, stablecoinIds),
      profiles: coverage(groups.profiles, stablecoinIds),
      legal_profiles: coverage(legalProfiles, stablecoinIds),
      reserve_components: coverage(reserveComponents, stablecoinIds),
      income_profiles: coverage(incomeProfiles, stablecoinIds),
      deployments: coverage(deployments, stablecoinIds),
      events: coverage(groups.events, stablecoinIds),
      evidence: coverage(groups.evidence, stablecoinIds),
      reserve_reports: coverage(groups.reserve_reports, stablecoinIds),
      known_unknowns: coverage(groups.known_unknowns, stablecoinIds)
    },
    quality: {
      lifecycle_unknown: {
        count: lifecycleCounts.unknown ?? 0,
        share: share(lifecycleCounts.unknown ?? 0, classifications.length)
      },
      legal_profiles_unclassified: {
        count: legalUnclassified,
        share: share(legalUnclassified, legalProfiles.length)
      },
      income_profiles_all_unknown: {
        count: incomeAllUnknown,
        share: share(incomeAllUnknown, incomeProfiles.length)
      },
      reserve_components_unknown_category: {
        count: reserveComponents.filter((row) => !row.asset_category || row.asset_category === 'unknown').length,
        share: share(
          reserveComponents.filter((row) => !row.asset_category || row.asset_category === 'unknown').length,
          reserveComponents.length
        )
      },
      deployments_unknown_canonicality: {
        count: deploymentUnknown,
        share: share(deploymentUnknown, deployments.length)
      }
    }
  };

  return stats;
}

function serialize(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function runCli() {
  const stats = buildRegistryStats();
  const expected = serialize(stats);
  const absoluteOutput = path.join(root, outputPath);
  const checkOnly = process.argv.includes('--check');

  if (checkOnly) {
    const current = fs.existsSync(absoluteOutput) ? fs.readFileSync(absoluteOutput, 'utf8') : '';
    if (current !== expected) {
      console.error(`${outputPath} is stale or missing.`);
      console.error('Expected generated content:');
      console.error(expected);
      process.exit(1);
    }
    console.log(`Registry stats are current: ${stats.registry.stablecoins} assets.`);
    return;
  }

  fs.mkdirSync(path.dirname(absoluteOutput), { recursive: true });
  fs.writeFileSync(absoluteOutput, expected);
  console.log(`Generated ${outputPath} for ${stats.registry.stablecoins} assets.`);
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) runCli();
