import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);
const check = (condition, message) => { if (!condition) fail(message); };
const readJson = (relativePath) => JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));

function countDetailRoutes(directory) {
  const absolute = path.join(root, 'dist', directory);
  if (!fs.existsSync(absolute)) return 0;
  return fs.readdirSync(absolute, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && fs.existsSync(path.join(absolute, entry.name, 'index.html')))
    .length;
}

const source = readJson('data/generated/build-provenance.json');
const version = readJson('dist/version.json');
const manifest = readJson('dist/data/manifest.json');
const versionBuild = version.build;
const manifestBuild = manifest.build;

check(source.schema_version === '1.0', 'source provenance schema mismatch');
check(source.verification_marker === 'sog_build_provenance_v1', 'source provenance marker mismatch');
check(/^[0-9a-f]{40}$/i.test(source.source_commit), `invalid source commit: ${source.source_commit}`);
check(typeof source.source_branch === 'string' && source.source_branch.length > 0, 'source branch missing');
check(!Number.isNaN(new Date(source.generated_at).valueOf()), 'generated_at is not an ISO timestamp');
check(/^sha256:[0-9a-f]{64}$/i.test(source.canonical_data_hash), 'canonical data hash is invalid');
check(!/^sha256:0{64}$/i.test(source.canonical_data_hash), 'canonical data hash was not generated');
check(Number.isInteger(source.canonical_file_count) && source.canonical_file_count > 0, 'canonical file count is invalid');

check(isDeepStrictEqual(versionBuild, manifestBuild), 'version.json and manifest build provenance differ');
check(versionBuild?.commit === source.source_commit, 'version commit differs from generated provenance');
check(versionBuild?.branch === source.source_branch, 'version branch differs from generated provenance');
check(versionBuild?.generated_at === source.generated_at, 'version generated_at differs from generated provenance');
check(versionBuild?.canonical_data_hash === source.canonical_data_hash, 'version canonical hash differs from generated provenance');
check(versionBuild?.canonical_file_count === source.canonical_file_count, 'version canonical file count differs from generated provenance');
check(isDeepStrictEqual(versionBuild?.canonical_record_counts, source.canonical_record_counts), 'version canonical counts differ from generated provenance');
check(isDeepStrictEqual(versionBuild?.route_counts, source.route_counts), 'version route counts differ from generated provenance');
check(version.data?.generated_at === source.generated_at, 'version data generated_at must use the build timestamp');
check(manifest.generated_at === source.generated_at, 'manifest generated_at must use the build timestamp');

const actualRoutes = {
  stablecoin_detail: countDetailRoutes('stablecoin'),
  organization_detail: countDetailRoutes('issuer'),
  event_detail: countDetailRoutes('event')
};
actualRoutes.total_detail = actualRoutes.stablecoin_detail + actualRoutes.organization_detail + actualRoutes.event_detail;

for (const [key, value] of Object.entries(actualRoutes)) {
  check(source.route_counts?.[key] === value, `generated route count mismatch for ${key}: expected ${source.route_counts?.[key]}, found ${value}`);
}

check(source.canonical_record_counts.stablecoins === version.data?.record_counts?.primary_records, 'canonical stablecoin count differs from public primary count');
check(source.canonical_record_counts.events === version.data?.record_counts?.events, 'canonical event count differs from public event count');
check(source.canonical_record_counts.evidence === version.data?.record_counts?.evidence, 'canonical evidence count differs from public evidence count');
for (const key of ['organizations', 'relationships', 'evidence_relations', 'reserve_reports', 'known_unknowns', 'regulatory_notes', 'deployments']) {
  check(source.canonical_record_counts[key] === version.data?.record_count_breakdown?.[key], `canonical count differs from public breakdown: ${key}`);
}

if (failures.length > 0) {
  console.error('Build provenance verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  source_commit: source.source_commit,
  generated_at: source.generated_at,
  canonical_data_hash: source.canonical_data_hash,
  canonical_file_count: source.canonical_file_count,
  record_counts: source.canonical_record_counts,
  route_counts: actualRoutes
}, null, 2));
