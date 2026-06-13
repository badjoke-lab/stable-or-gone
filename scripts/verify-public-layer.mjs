import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const root = process.cwd();
const distDir = path.join(root, 'dist');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function readRecords(relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or records array`);
}

function countValues(values) {
  return values.reduce((counts, rawValue) => {
    const value = rawValue === null || rawValue === undefined || rawValue === '' ? 'unknown' : String(rawValue);
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function applyById(rows, layers) {
  const layerMaps = layers.map((layer) => new Map(layer.map((row) => [row.id, row])));
  return rows.map((row) => layerMaps.reduce((merged, map) => ({ ...merged, ...(map.get(row.id) || {}) }), row));
}

const stablecoinsBase = [
  ...readRecords('data/stablecoins.json'),
  ...readRecords('data/stablecoins-extra.json'),
];
const stablecoins = applyById(stablecoinsBase, [
  readRecords('data/stablecoin-overrides-pr033.json'),
  readRecords('data/stablecoin-overrides-pr034.json'),
  readRecords('data/stablecoin-classification-v2.json'),
  readRecords('data/stablecoin-classification-batch-a.json'),
  readRecords('data/stablecoin-classification-extension-batch-a.json'),
  readRecords('data/stablecoin-profiles-v2.json'),
  readRecords('data/stablecoin-profiles-batch-a.json'),
]);
const organizations = readRecords('data/organizations.json').map((row) => ({
  ...row,
  issuer_type: row.legacy_issuer_type || row.organization_type,
}));
const relationships = readRecords('data/relationships.json');
const eventsBase = [
  ...readRecords('data/events.json'),
  ...readRecords('data/events-pr036.json'),
  ...readRecords('data/events-pr037.json'),
  ...readRecords('data/events-pr038.json'),
  ...readRecords('data/events-batch-a.json'),
];
const events = applyById(eventsBase, [
  readRecords('data/event-details-v2.json'),
  readRecords('data/event-details-batch-a.json'),
]);
const evidence = [
  ...readRecords('data/evidence.json'),
  ...readRecords('data/evidence-extra.json'),
  ...readRecords('data/evidence-pr033.json'),
  ...readRecords('data/evidence-events-pr036.json'),
  ...readRecords('data/evidence-events-pr037.json'),
  ...readRecords('data/evidence-events-pr038.json'),
  ...readRecords('data/evidence-batch-a.json'),
];
const reserveReports = [
  ...readRecords('data/reserve-reports.json'),
  ...readRecords('data/reserve-reports-extra.json'),
  ...readRecords('data/reserve-reports-pr033.json'),
  ...readRecords('data/reserve-reports-pr034.json'),
];
const knownUnknowns = [
  ...readRecords('data/known-unknowns.json'),
  ...readRecords('data/known-unknowns-extra.json'),
  ...readRecords('data/known-unknowns-pr033.json'),
  ...readRecords('data/known-unknowns-pr034.json'),
  ...readRecords('data/known-unknowns-batch-a.json'),
];
const regulatoryNotes = readRecords('data/regulatory-notes.json');
const deployments = [
  ...readRecords('data/deployments.json'),
  ...readRecords('data/deployments-extra.json'),
  ...readRecords('data/deployments-batch-a.json'),
];
const registryUpdates = readRecords('data/registry-updates.json');

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
  status: countValues(stablecoins.map((coin) => coin.status)),
  lifecycle_status: countValues(stablecoins.map((coin) => coin.lifecycle_status)),
  issuance_status: countValues(stablecoins.map((coin) => coin.issuance_status)),
  asset_class: countValues(stablecoins.map((coin) => coin.asset_class)),
  organization_type: countValues(organizations.map((organization) => organization.organization_type || organization.issuer_type)),
  relationship_role: countValues(relationships.map((relationship) => relationship.role)),
  event_type: countValues(events.map((event) => event.event_type)),
  evidence_reliability: countValues(evidence.map((item) => item.reliability)),
  evidence_source_type: countValues(evidence.map((item) => item.source_type)),
  reserve_report_type: countValues(reserveReports.map((report) => report.report_type)),
  known_unknown_severity: countValues(knownUnknowns.map((item) => item.severity)),
  deployment_status: countValues(deployments.map((deployment) => deployment.status)),
  deployment_chain: countValues(deployments.map((deployment) => deployment.chain)),
};
const expectedLastReviewedAt = [
  ...stablecoins.map((coin) => coin.last_verified_at),
  ...organizations.map((organization) => organization.last_verified_at),
].filter(Boolean).sort().at(-1) || null;

for (const relativePath of ['version.json', 'data/manifest.json', 'llms.txt', 'ai.txt']) {
  assert(fs.existsSync(path.join(distDir, relativePath)), `Missing dist/${relativePath}`);
}

const version = JSON.parse(fs.readFileSync(path.join(distDir, 'version.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(distDir, 'data', 'manifest.json'), 'utf8'));
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
assert(version.routes?.stablecoin_detail === '/stablecoin/{slug}/', 'stablecoin route missing');
assert(version.routes?.organization_detail === '/issuer/{slug}/', 'organization route missing');
assert(version.routes?.event_detail === '/event/{id}/', 'event route missing');

if (process.env.GITHUB_SHA) assert(version.build.commit === process.env.GITHUB_SHA, 'build commit does not match GITHUB_SHA');
if (process.env.GITHUB_REF_NAME) assert(version.build.branch === process.env.GITHUB_REF_NAME, 'build branch does not match GITHUB_REF_NAME');

assert(manifest.schema_version === version.schema_version, 'manifest schema mismatch');
assert(manifest.project_id === version.project_id, 'manifest project mismatch');
assert(manifest.registry_family === version.registry_family, 'manifest registry family mismatch');
assert(manifest.registry_type === version.registry_type, 'manifest registry type mismatch');
assert(manifest.canonical_origin === version.canonical_origin, 'manifest origin mismatch');
assert(manifest.data_model?.primary_record === 'stablecoin', 'manifest primary record mismatch');
assert(isDeepStrictEqual(manifest.record_counts, expectedCounts), 'manifest counts do not match canonical data');
assert(isDeepStrictEqual(manifest.record_count_breakdown, expectedBreakdown), 'manifest breakdown does not match canonical data');
assert(isDeepStrictEqual(manifest.record_counts, version.data.record_counts), 'version and manifest counts differ');
assert(isDeepStrictEqual(manifest.record_count_breakdown, version.data.record_count_breakdown), 'version and manifest breakdown differ');
assert(manifest.data_safety?.canonical_only === true, 'canonical-only flag missing');
assert(manifest.data_safety?.includes_unreviewed_candidates === false, 'candidate safety flag invalid');
assert(manifest.data_safety?.includes_internal_monitoring === false, 'monitoring safety flag invalid');
assert(manifest.data_safety?.includes_private_notes === false, 'review-material safety flag invalid');
assert(manifest.public_files?.version === '/version.json', 'manifest version route missing');
assert(manifest.public_files?.manifest === '/data/manifest.json', 'manifest self route missing');
assert(manifest.public_files?.llms === '/llms.txt', 'manifest llms route missing');
assert(manifest.public_files?.ai === '/ai.txt', 'manifest ai route missing');

assert(llmsText.includes('# Stable or Gone'), 'llms.txt title missing');
assert(llmsText.includes('/data/manifest.json'), 'llms.txt manifest route missing');
assert(llmsText.includes('/ai.txt'), 'llms.txt AI route missing');
assert(llmsText.includes('not live market data'), 'llms.txt interpretation warning missing');
assert(aiText.includes('Version endpoint: /version.json'), 'ai.txt version endpoint missing');
assert(aiText.includes('LLM guide: /llms.txt'), 'ai.txt LLM guide missing');
assert(aiText.includes('reviewed public registry information only'), 'ai.txt public-data boundary missing');

console.log(JSON.stringify({
  ok: true,
  schema_version: version.schema_version,
  build: version.build,
  record_counts: version.data.record_counts,
  records_last_reviewed_at: version.data.records_last_reviewed_at,
}, null, 2));
