import { isDeepStrictEqual } from 'node:util';

const baseUrl = (process.env.SOG_BASE_URL || 'https://sog.badjoke-lab.com').replace(/\/$/, '');
const expectedCommit = process.env.SOG_EXPECTED_COMMIT || process.env.GITHUB_SHA || null;
const cacheBust = encodeURIComponent(expectedCommit || String(Date.now()));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readJson(pathname) {
  const separator = pathname.includes('?') ? '&' : '?';
  const response = await fetch(`${baseUrl}${pathname}${separator}sog_build=${cacheBust}`, {
    headers: {
      accept: 'application/json',
      'user-agent': 'sog-production-provenance/1.1',
      'cache-control': 'no-store'
    }
  });
  if (!response.ok) throw new Error(`${pathname} returned HTTP ${response.status}`);
  return response.json();
}

const [version, manifest] = await Promise.all([
  readJson('/version.json'),
  readJson('/data/manifest.json')
]);

const build = version.build;
assert(build && typeof build === 'object', 'version build provenance missing');
assert(isDeepStrictEqual(build, manifest.build), 'version and manifest build provenance differ');
assert(build.provenance_schema_version === '1.0', 'provenance schema mismatch');
assert(build.provenance_verification_marker === 'sog_build_provenance_v1', 'provenance verification marker mismatch');
assert(/^[0-9a-f]{40}$/i.test(build.commit), `invalid production source commit: ${build.commit}`);
assert(typeof build.branch === 'string' && build.branch.length > 0, 'production source branch missing');
assert(!Number.isNaN(new Date(build.generated_at).valueOf()), 'production build timestamp invalid');
assert(/^sha256:[0-9a-f]{64}$/i.test(build.canonical_data_hash), 'production canonical data hash invalid');
assert(Number.isInteger(build.canonical_file_count) && build.canonical_file_count > 0, 'production canonical file count invalid');
assert(version.data?.generated_at === build.generated_at, 'version data timestamp differs from build provenance');
assert(manifest.generated_at === build.generated_at, 'manifest timestamp differs from build provenance');

if (expectedCommit) {
  assert(build.commit === expectedCommit, `production commit ${build.commit} does not match expected ${expectedCommit}`);
}

const counts = build.canonical_record_counts;
const routes = build.route_counts;
assert(counts.stablecoins === version.data?.record_counts?.primary_records, 'provenance stablecoin count mismatch');
assert(counts.events === version.data?.record_counts?.events, 'provenance event count mismatch');
assert(counts.evidence === version.data?.record_counts?.evidence, 'provenance evidence count mismatch');
assert(routes.stablecoin_detail === counts.stablecoins, 'provenance stablecoin route count mismatch');
assert(routes.organization_detail === counts.organizations, 'provenance organization route count mismatch');
assert(routes.event_detail === counts.events, 'provenance event route count mismatch');
assert(routes.total_detail === routes.stablecoin_detail + routes.organization_detail + routes.event_detail, 'provenance total route count mismatch');

console.log(JSON.stringify({
  ok: true,
  base_url: baseUrl,
  source_commit: build.commit,
  source_branch: build.branch,
  generated_at: build.generated_at,
  canonical_data_hash: build.canonical_data_hash,
  canonical_file_count: build.canonical_file_count,
  canonical_record_counts: counts,
  route_counts: routes
}, null, 2));
