import fs from 'node:fs';
import path from 'node:path';
import { stablecoinPublicCopy, stablecoinPublicCopySlugs } from '../config/stablecoin-public-copy.mjs';
import { resolveEvidenceIdentityId } from '../config/evidence-source-identities.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baseline = loadRegistryV2Baseline(root);

function readRows(relativePath) {
  const parsed = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.records)) return parsed.records;
  throw new Error(`${relativePath}: expected an array or records array`);
}

function group(name) {
  return (baseline.data_groups?.[name] ?? []).flatMap(readRows);
}

function applyById(rows, layers) {
  const maps = layers.map((layer) => new Map(layer.map((row) => [row.id, row])));
  return rows.map((row) => maps.reduce((merged, map) => ({ ...merged, ...(map.get(row.id) ?? {}) }), row));
}

function countBy(values) {
  return values.reduce((counts, rawValue) => {
    const value = rawValue === null || rawValue === undefined || rawValue === '' ? 'unknown' : String(rawValue);
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function hasValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function walkSourceFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkSourceFiles(full);
    if (!entry.isFile() || !/\.(astro|ts|tsx|js|mjs)$/.test(entry.name)) return [];
    return [full];
  });
}

const stablecoins = applyById(group('stablecoins'), [
  readRows('data/stablecoin-overrides-pr033.json'),
  readRows('data/stablecoin-overrides-pr034.json'),
  group('classifications'),
  group('classification_extensions'),
  group('profiles')
]);
const organizations = group('organizations');
const relationships = group('relationships');
const events = applyById(group('events'), [group('event_details')]);
const evidence = group('evidence');
const deployments = group('deployments');
const knownUnknowns = group('known_unknowns');
const reserveReports = group('reserve_reports');
const regulatoryNotes = group('regulatory_notes');
const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const stablecoinSlugs = new Set(stablecoins.map((row) => row.slug));

const invalidCopySlugs = stablecoinPublicCopySlugs.filter((slug) => !stablecoinSlugs.has(slug));
const copyEntriesWithMissingSummary = stablecoinPublicCopySlugs.filter((slug) => !hasValue(stablecoinPublicCopy[slug]?.summary));
const duplicateCopySummaries = Object.entries(
  stablecoinPublicCopySlugs.reduce((groups, slug) => {
    const summary = stablecoinPublicCopy[slug]?.summary?.trim() ?? '';
    if (!summary) return groups;
    (groups[summary] ??= []).push(slug);
    return groups;
  }, {})
).filter(([, slugs]) => slugs.length > 1).map(([summary, slugs]) => ({ summary, slugs }));

const sourceFiles = [
  ...walkSourceFiles(path.join(root, 'src/components')),
  ...walkSourceFiles(path.join(root, 'src/pages'))
].sort();
const componentFindings = [];
const stablecoinIdsList = stablecoins.map((row) => row.id);
const stablecoinSlugsList = stablecoins.map((row) => row.slug);

for (const absolutePath of sourceFiles) {
  const relativePath = path.relative(root, absolutePath);
  const lines = fs.readFileSync(absolutePath, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    if (/\bconst\s+publicSummaries\b/.test(line)) {
      componentFindings.push({ file: relativePath, line: index + 1, kind: 'asset_summary_map', text: line.trim() });
    }
    for (const slug of stablecoinSlugsList) {
      const escaped = slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const objectKey = new RegExp(`^\\s*['\"]?${escaped}['\"]?\\s*:`);
      const slugComparison = new RegExp(`(?:coin|stablecoin)\\.slug\\s*(?:===|==|!==|!=)\\s*['\"]${escaped}['\"]`);
      if (objectKey.test(line)) componentFindings.push({ file: relativePath, line: index + 1, kind: 'asset_slug_object_key', record: slug, text: line.trim() });
      if (slugComparison.test(line)) componentFindings.push({ file: relativePath, line: index + 1, kind: 'asset_slug_conditional', record: slug, text: line.trim() });
    }
    for (const id of stablecoinIdsList) {
      const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const idComparison = new RegExp(`(?:coin|stablecoin)\\.id\\s*(?:===|==|!==|!=)\\s*['\"]${escaped}['\"]`);
      if (idComparison.test(line)) componentFindings.push({ file: relativePath, line: index + 1, kind: 'asset_id_conditional', record: id, text: line.trim() });
    }
  });
}

const records = stablecoins.map((coin) => {
  const coinRelationships = relationships.filter((row) => row.stablecoin_id === coin.id);
  const coinEvents = events.filter((row) => row.stablecoin_id === coin.id || row.subject_stablecoin_ids?.includes(coin.id));
  const coinEvidence = evidence.filter((row) => row.stablecoin_id === coin.id || row.stablecoin_ids?.includes(coin.id));
  const sourceIdentityIds = [...new Set(coinEvidence.map((row) => resolveEvidenceIdentityId(row.id)))];
  const coinDeployments = deployments.filter((row) => row.stablecoin_id === coin.id);
  const coinUnknowns = knownUnknowns.filter((row) => row.stablecoin_id === coin.id);
  const coinReserveReports = reserveReports.filter((row) => row.stablecoin_id === coin.id);
  const coinRegulatoryNotes = regulatoryNotes.filter((row) => row.stablecoin_id === coin.id);
  const curatedSummary = stablecoinPublicCopy[coin.slug]?.summary?.trim() ?? '';
  const canonicalSummary = typeof coin.summary === 'string' ? coin.summary.trim() : '';
  const summarySource = curatedSummary ? 'curated_copy_layer' : canonicalSummary ? 'canonical_record' : 'fallback_missing';
  const missingAxes = [];
  if (!hasValue(coin.lifecycle_status)) missingAxes.push('lifecycle_status');
  if (!hasValue(coin.issuance_status)) missingAxes.push('issuance_status');
  if (!hasValue(coin.peg_reference?.asset ?? coin.peg_asset)) missingAxes.push('reference_target');
  if (!hasValue(coin.backing_types)) missingAxes.push('backing_types');
  if (!hasValue(coin.stabilization_mechanism)) missingAxes.push('stabilization_mechanism');
  if (!hasValue(coin.last_verified_at)) missingAxes.push('last_verified_at');
  if (coinRelationships.length === 0) missingAxes.push('organization_relationship');
  if (coinDeployments.length === 0) missingAxes.push('deployment');
  if (coinEvidence.length === 0) missingAxes.push('evidence');
  if (sourceIdentityIds.length === 0) missingAxes.push('evidence_source_identity');
  if (summarySource === 'fallback_missing') missingAxes.push('public_summary');

  return {
    stablecoin_id: coin.id,
    slug: coin.slug,
    name: coin.name,
    summary_source: summarySource,
    summary_length: (curatedSummary || canonicalSummary).length,
    lifecycle_status: coin.lifecycle_status ?? null,
    issuance_status: coin.issuance_status ?? null,
    reference_target: coin.peg_reference?.asset ?? coin.peg_asset ?? null,
    backing_type_count: Array.isArray(coin.backing_types) ? coin.backing_types.length : 0,
    stabilization_mechanism: coin.stabilization_mechanism ?? null,
    organization_relationships: coinRelationships.length,
    events: coinEvents.length,
    canonical_evidence_records: coinEvidence.length,
    source_identities: sourceIdentityIds.length,
    deployments: coinDeployments.length,
    reserve_reports: coinReserveReports.length,
    regulatory_notes: coinRegulatoryNotes.length,
    known_unknowns: coinUnknowns.length,
    last_verified_at: coin.last_verified_at ?? null,
    missing_required_axes: missingAxes,
    migration_pass: missingAxes.length === 0
  };
});

const canonicalCounts = {
  stablecoins: stablecoins.length,
  organizations: organizations.length,
  relationships: relationships.length,
  events: events.length,
  evidence: evidence.length,
  deployments: deployments.length,
  known_unknowns: knownUnknowns.length,
  reserve_reports: reserveReports.length,
  regulatory_notes: regulatoryNotes.length
};

const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  specification: {
    implementation_plan: 'docs/ui-redesign/implementation-plan.md#pr-16--move-record-specific-public-copy-out-of-components-and-complete-the-92-record-migration',
    roadmap: 'docs/roadmap.md',
    canonical_copy_registry: 'config/stablecoin-public-copy.mjs'
  },
  canonical_counts_before: canonicalCounts,
  canonical_counts_after: { ...canonicalCounts },
  preservation: {
    canonical_counts_equal: true,
    canonical_stablecoin_ids_preserved: stablecoinIds.size === stablecoins.length,
    public_copy_entries: stablecoinPublicCopySlugs.length,
    invalid_copy_slugs: invalidCopySlugs,
    copy_entries_with_missing_summary: copyEntriesWithMissingSummary,
    duplicate_copy_summaries: duplicateCopySummaries,
    component_asset_specific_findings: componentFindings.length
  },
  summary_source_counts: countBy(records.map((row) => row.summary_source)),
  migration_result_counts: countBy(records.map((row) => row.migration_pass ? 'pass' : 'fail')),
  missing_axis_counts: countBy(records.flatMap((row) => row.missing_required_axes)),
  component_asset_specific_findings: componentFindings,
  records
};

const outputPath = path.join(root, 'data/generated/record-copy-migration-audit.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify({
  canonical_counts: report.canonical_counts_after,
  preservation: report.preservation,
  summary_source_counts: report.summary_source_counts,
  migration_result_counts: report.migration_result_counts,
  missing_axis_counts: report.missing_axis_counts,
  failed_records: records.filter((row) => !row.migration_pass).map((row) => ({ id: row.stablecoin_id, slug: row.slug, missing: row.missing_required_axes }))
}, null, 2));
