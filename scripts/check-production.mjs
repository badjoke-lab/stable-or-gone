const DEFAULT_BASE_URL = 'https://sog.badjoke-lab.com';
const DEFAULT_ATTEMPTS = 12;
const DEFAULT_DELAY_MS = 15000;

const baseUrl = (process.env.SOG_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, '');
const expectedCommit = process.env.SOG_EXPECTED_COMMIT || process.env.GITHUB_SHA || null;
const attempts = Number(process.env.SOG_SMOKE_ATTEMPTS || DEFAULT_ATTEMPTS);
const delayMs = Number(process.env.SOG_SMOKE_DELAY_MS || DEFAULT_DELAY_MS);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function read(pathname, expectedContentType) {
  const response = await fetch(`${baseUrl}${pathname}`, {
    headers: {
      accept: expectedContentType,
      'user-agent': 'sog-public-layer-smoke/1.0',
    },
  });
  if (!response.ok) throw new Error(`${pathname} returned HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') || '';
  assert(contentType.includes(expectedContentType), `${pathname} returned unexpected content-type: ${contentType || 'missing'}`);
  return response.text();
}

async function checkOnce() {
  const version = JSON.parse(await read('/version.json', 'application/json'));
  const manifest = JSON.parse(await read('/data/manifest.json', 'application/json'));
  const llmsText = await read('/llms.txt', 'text/plain');
  const aiText = await read('/ai.txt', 'text/plain');

  assert(version.schema_version === '1.0.0', 'version schema mismatch');
  assert(version.project_id === 'stable-or-gone', 'version project id mismatch');
  assert(version.registry_family === 'badjoke-lab-ledger-series', 'version registry family mismatch');
  assert(version.registry_type === 'stablecoin_issuer_registry', 'version registry type mismatch');
  assert(version.canonical_origin === 'https://sog.badjoke-lab.com', 'version origin mismatch');
  assert(version.build?.verification_marker === 'sog_machine_readable_layer_v1', 'verification marker mismatch');
  assert(version.build?.commit && typeof version.build.commit === 'string', 'build commit missing');
  assert(version.build?.branch && typeof version.build.branch === 'string', 'build branch missing');
  assert(version.data?.data_schema_version === 'sog_registry_v2', 'data schema mismatch');

  if (expectedCommit) {
    assert(version.build.commit === expectedCommit, `production commit ${version.build.commit} does not match expected ${expectedCommit}`);
  }

  const counts = version.data?.record_counts;
  assert(Number.isInteger(counts?.primary_records) && counts.primary_records > 0, 'stablecoin count invalid');
  assert(Number.isInteger(counts?.events) && counts.events > 0, 'event count invalid');
  assert(Number.isInteger(counts?.evidence) && counts.evidence > 0, 'evidence count invalid');
  assert(Number.isInteger(version.data?.record_count_breakdown?.organizations), 'organization count missing');
  assert(Number.isInteger(version.data?.record_count_breakdown?.relationships), 'relationship count missing');
  assert(Number.isInteger(version.data?.record_count_breakdown?.reserve_reports), 'reserve report count missing');
  assert(version.routes?.stablecoin_detail === '/stablecoin/{slug}/', 'stablecoin route missing');
  assert(version.routes?.organization_detail === '/issuer/{slug}/', 'organization route missing');
  assert(version.routes?.event_detail === '/event/{id}/', 'event route missing');

  assert(manifest.schema_version === version.schema_version, 'manifest schema mismatch');
  assert(manifest.project_id === version.project_id, 'manifest project mismatch');
  assert(manifest.registry_family === version.registry_family, 'manifest family mismatch');
  assert(manifest.registry_type === version.registry_type, 'manifest type mismatch');
  assert(manifest.canonical_origin === version.canonical_origin, 'manifest origin mismatch');
  assert(manifest.data_model?.primary_record === 'stablecoin', 'manifest primary record mismatch');
  assert(JSON.stringify(manifest.record_counts) === JSON.stringify(counts), 'version and manifest counts differ');
  assert(JSON.stringify(manifest.record_count_breakdown) === JSON.stringify(version.data.record_count_breakdown), 'version and manifest breakdown differ');
  assert(manifest.data_safety?.canonical_only === true, 'canonical-only flag missing');
  assert(manifest.data_safety?.includes_unreviewed_candidates === false, 'candidate safety flag invalid');
  assert(manifest.data_safety?.includes_internal_monitoring === false, 'monitoring safety flag invalid');
  assert(manifest.data_safety?.includes_private_notes === false, 'review-material safety flag invalid');
  assert(manifest.public_files?.version === '/version.json', 'manifest version route missing');
  assert(manifest.public_files?.manifest === '/data/manifest.json', 'manifest self route missing');
  assert(manifest.public_files?.llms === '/llms.txt', 'manifest llms route missing');
  assert(manifest.public_files?.ai === '/ai.txt', 'manifest ai route missing');

  assert(llmsText.includes('/data/manifest.json'), 'llms.txt manifest route missing');
  assert(llmsText.includes('/ai.txt'), 'llms.txt AI route missing');
  assert(llmsText.includes('not live market data'), 'llms.txt warning missing');
  assert(aiText.includes('Version endpoint: /version.json'), 'ai.txt version endpoint missing');
  assert(aiText.includes('LLM guide: /llms.txt'), 'ai.txt LLM guide missing');
  assert(aiText.includes('reviewed public registry information only'), 'ai.txt public-data boundary missing');

  return {
    ok: true,
    base_url: baseUrl,
    schema_version: version.schema_version,
    build: version.build,
    record_counts: counts,
    records_last_reviewed_at: version.data.records_last_reviewed_at,
  };
}

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    const result = await checkOnce();
    console.log(JSON.stringify({ ...result, attempt }, null, 2));
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.error(`Production check attempt ${attempt}/${attempts} failed: ${error.message}`);
    if (attempt < attempts) await sleep(delayMs);
  }
}

throw lastError;
