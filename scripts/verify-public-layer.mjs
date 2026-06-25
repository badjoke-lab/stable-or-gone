import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/registry-v2-baseline.json'), 'utf8'));
const read = (file) => {
  const value = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${file}: expected an array or records array`);
};
const group = (name) => (baseline.data_groups?.[name] || []).flatMap(read);
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const countValues = (values) => values.reduce((counts, raw) => {
  const value = raw === null || raw === undefined || raw === '' ? 'unknown' : String(raw);
  counts[value] = (counts[value] || 0) + 1;
  return counts;
}, {});
const applyById = (rows, layers) => {
  const maps = layers.map((layer) => new Map(layer.map((row) => [row.id, row])));
  return rows.map((row) => maps.reduce((merged, map) => ({ ...merged, ...(map.get(row.id) || {}) }), row));
};

const stablecoins = applyById(group('stablecoins'), [
  read('data/stablecoin-overrides-pr033.json'),
  read('data/stablecoin-overrides-pr034.json'),
  group('classifications'),
  group('classification_extensions'),
  group('profiles'),
]);
const organizations = group('organizations').map((row) => ({
  ...row,
  issuer_type: row.legacy_issuer_type || row.organization_type,
}));
const relationships = group('relationships');
const events = applyById(group('events'), [group('event_details')]);
const evidence = group('evidence');
const reserveReports = group('reserve_reports');
const knownUnknowns = group('known_unknowns');
const regulatoryNotes = group('regulatory_notes');
const deployments = group('deployments');
const registryUpdates = read('data/registry-updates.json');

const expectedCounts = {
  primary_records: stablecoins.length,
  events: events.length,
  evidence: evidence.length,
};
const expectedBreakdown = {
  stablecoins: stablecoins.length,
  organizations: organizations.length,
  relationships: relationships.length,
  evidence_relations: evidence.length,
  reserve_reports: reserveReports.length,
  known_unknowns: knownUnknowns.length,
  regulatory_notes: regulatoryNotes.length,
  deployments: deployments.length,
  registry_updates: registryUpdates.length,
  status: countValues(stablecoins.map((row) => row.status)),
  lifecycle_status: countValues(stablecoins.map((row) => row.lifecycle_status)),
  issuance_status: countValues(stablecoins.map((row) => row.issuance_status)),
  asset_class: countValues(stablecoins.map((row) => row.asset_class)),
  organization_type: countValues(organizations.map((row) => row.organization_type || row.issuer_type)),
  relationship_role: countValues(relationships.map((row) => row.role)),
  event_type: countValues(events.map((row) => row.event_type)),
  evidence_reliability: countValues(evidence.map((row) => row.reliability)),
  evidence_source_type: countValues(evidence.map((row) => row.source_type)),
  reserve_report_type: countValues(reserveReports.map((row) => row.report_type)),
  known_unknown_severity: countValues(knownUnknowns.map((row) => row.severity)),
  deployment_status: countValues(deployments.map((row) => row.status)),
  deployment_chain: countValues(deployments.map((row) => row.chain)),
};
const expectedLastReviewedAt = [
  ...stablecoins.map((row) => row.last_verified_at),
  ...organizations.map((row) => row.last_verified_at),
].filter(Boolean).sort().at(-1) || null;

for (const file of ['version.json', 'data/manifest.json', 'llms.txt', 'ai.txt']) {
  assert(fs.existsSync(path.join(distDir, file)), `Missing dist/${file}`);
}
const version = JSON.parse(fs.readFileSync(path.join(distDir, 'version.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(distDir, 'data/manifest.json'), 'utf8'));
const llmsText = fs.readFileSync(path.join(distDir, 'llms.txt'), 'utf8');
const aiText = fs.readFileSync(path.join(distDir, 'ai.txt'), 'utf8');

assert(version.schema_version === '1.0.0', 'version schema mismatch');
assert(version.project_id === 'stable-or-gone', 'version project id mismatch');
assert(version.registry_family === 'badjoke-lab-ledger-series', 'version registry family mismatch');
assert(version.registry_type === 'stablecoin_issuer_registry', 'version registry type mismatch');
assert(version.canonical_origin === 'https://sog.badjoke-lab.com', 'version canonical origin mismatch');
assert(version.build?.verification_marker === 'sog_machine_readable_layer_v1', 'verification marker mismatch');
assert(version.data?.data_schema_version === 'sog_registry_v2', 'data schema mismatch');
assert(isDeepStrictEqual(version.data?.record_counts, expectedCounts), 'version record counts do not match canonical data');
assert(isDeepStrictEqual(version.data?.record_count_breakdown, expectedBreakdown), 'version breakdown does not match canonical data');
assert(version.data?.records_last_reviewed_at === expectedLastReviewedAt, 'records_last_reviewed_at mismatch');

const expectedBuildCommit = process.env.SOG_BUILD_COMMIT || process.env.GITHUB_SHA;
const expectedBuildBranch = process.env.SOG_BUILD_BRANCH || process.env.GITHUB_REF_NAME;
if (expectedBuildCommit) assert(version.build.commit === expectedBuildCommit, `build commit ${version.build.commit} does not match expected ${expectedBuildCommit}`);
if (expectedBuildBranch) assert(version.build.branch === expectedBuildBranch, `build branch ${version.build.branch} does not match expected ${expectedBuildBranch}`);

assert(manifest.schema_version === version.schema_version, 'manifest schema mismatch');
assert(manifest.project_id === version.project_id, 'manifest project mismatch');
assert(manifest.registry_family === version.registry_family, 'manifest registry family mismatch');
assert(manifest.registry_type === version.registry_type, 'manifest type mismatch');
assert(manifest.canonical_origin === version.canonical_origin, 'manifest origin mismatch');
assert(isDeepStrictEqual(manifest.record_counts, expectedCounts), 'manifest counts do not match canonical data');
assert(isDeepStrictEqual(manifest.record_count_breakdown, expectedBreakdown), 'manifest breakdown does not match canonical data');
assert(manifest.data_safety?.canonical_only === true, 'canonical-only flag missing');
assert(manifest.data_safety?.includes_unreviewed_candidates === false, 'candidate safety flag invalid');
assert(manifest.data_safety?.includes_internal_monitoring === false, 'monitoring safety flag invalid');
assert(manifest.data_safety?.includes_private_notes === false, 'private-note safety flag invalid');
assert(llmsText.includes('/data/manifest.json') && llmsText.includes('/ai.txt'), 'llms.txt endpoint references missing');
assert(aiText.includes('Version endpoint: /version.json') && aiText.includes('LLM guide: /llms.txt'), 'ai.txt endpoint references missing');

console.log(JSON.stringify({ ok: true, record_counts: expectedCounts, record_count_breakdown: expectedBreakdown }, null, 2));
