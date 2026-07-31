import { isDeepStrictEqual } from 'node:util';
import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';

const baseUrl = (process.env.SOG_BASE_URL || PUBLIC_ORIGIN).replace(/\/$/, '');
const expectedCommit = process.env.SOG_EXPECTED_COMMIT || process.env.GITHUB_SHA || null;
const attempts = Number(process.env.SOG_SMOKE_ATTEMPTS || 5);
const delayMs = Number(process.env.SOG_SMOKE_DELAY_MS || 10000);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function readJson(pathname, attempt) {
  const separator = pathname.includes('?') ? '&' : '?';
  const cacheBust = encodeURIComponent(`${expectedCommit || 'unknown'}-${attempt}-${Date.now()}`);
  const response = await fetch(`${baseUrl}${pathname}${separator}sog_build=${cacheBust}`, {
    headers: {
      accept: 'application/json',
      'user-agent': 'sog-production-provenance/1.2',
      'cache-control': 'no-store'
    }
  });
  if (!response.ok) throw new Error(`${pathname} returned HTTP ${response.status}`);
  return response.json();
}

async function checkOnce(attempt) {
  const [version, manifest] = await Promise.all([
    readJson('/version.json', attempt),
    readJson('/data/manifest.json', attempt)
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

  return {
    ok: true,
    base_url: baseUrl,
    source_commit: build.commit,
    source_branch: build.branch,
    generated_at: build.generated_at,
    canonical_data_hash: build.canonical_data_hash,
    canonical_file_count: build.canonical_file_count,
    canonical_record_counts: counts,
    route_counts: routes,
    attempt
  };
}

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    console.log(JSON.stringify(await checkOnce(attempt), null, 2));
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.error(`Production provenance attempt ${attempt}/${attempts} failed: ${error.message}`);
    if (attempt < attempts) await sleep(delayMs);
  }
}

throw lastError;
