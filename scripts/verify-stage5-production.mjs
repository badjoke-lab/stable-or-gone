import { createHash } from 'node:crypto';
import fs from 'node:fs';

const authority = JSON.parse(fs.readFileSync('config/ledger-series-phase9-stage5-relationship-authority.json', 'utf8'));
const origin = (process.env.SOG_PRODUCTION_ORIGIN ?? 'https://www.stableorgone.com').replace(/\/$/, '');
const attempts = Math.max(1, Number(process.env.SOG_STAGE5_PRODUCTION_ATTEMPTS ?? 20));
const delayMs = Math.max(0, Number(process.env.SOG_STAGE5_PRODUCTION_DELAY_MS ?? 15000));
const timeoutMs = Math.max(1000, Number(process.env.SOG_STAGE5_PRODUCTION_TIMEOUT_MS ?? 30000));
const historicalStage5CanonicalHash = 'sha256:4e7570b6fab88a8178a01ae280a36d98787573b376440b891491f25469458798';
const currentReviewedCanonicalHash = 'sha256:bba93c1e3f0ea1b050cd395455327b70fb7c1920d37b18c300949bb49df53965';
const expectedTuple = ['predecessor_of', 'stable-or-gone:stablecoin:sog_st_sai', 'stable-or-gone:stablecoin:sog_st_dai'];
const endpointKey = (endpoint) => `${endpoint?.registry_id}:${endpoint?.native_record_type}:${endpoint?.native_record_id}`;
const relationshipId = (type, source, target) => `series_rel_${createHash('sha256').update(`${type}\n${source}\n${target}`, 'utf8').digest('hex')}`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchJson(route) {
  const response = await fetch(`${origin}${route}`, {
    headers: { accept: 'application/json', 'cache-control': 'no-cache', 'user-agent': 'SOG-stage5-production-verifier/1.0' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`${route}: HTTP ${response.status}`);
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) throw new Error(`${route}: expected application/json, received ${contentType || 'missing'}`);
  return response.json();
}

async function verifyOnce() {
  const errors = [];
  const fail = (message) => errors.push(message);
  if (authority.authority_id !== 'sog_ledger_series_phase9_stage5_relationship_2026_08_21') fail('unexpected Stage 5 authority');
  if (authority.canonical_boundary?.canonical_hash !== historicalStage5CanonicalHash) fail('historical Stage 5 authority canonical hash mismatch');
  if (!Array.isArray(authority.finite_allowlist) || authority.finite_allowlist.length !== 1) fail('authority allowlist must contain exactly one tuple');
  if (JSON.stringify(authority.finite_allowlist[0]) !== JSON.stringify(expectedTuple)) fail('authority allowlist tuple mismatch');

  const [manifest, descriptor, index, relationships] = await Promise.all([
    fetchJson('/data/manifest.json'),
    fetchJson('/data/series/registry.json'),
    fetchJson('/data/series/index.json'),
    fetchJson('/data/series/relationships.json'),
  ]);

  if (manifest?.project_id !== 'stable-or-gone') fail('manifest project id mismatch');
  if (manifest?.record_counts?.primary_records !== 119) fail(`manifest primary record count must be 119, found ${manifest?.record_counts?.primary_records}`);
  if (manifest?.build?.canonical_data_hash !== currentReviewedCanonicalHash) fail(`current production canonical hash mismatch: ${manifest?.build?.canonical_data_hash}`);
  if (manifest?.data_safety?.canonical_only !== true) fail('manifest canonical_only boundary mismatch');

  if (descriptor?.registry?.id !== 'stable-or-gone') fail('descriptor registry id mismatch');
  if (descriptor?.record_counts?.primary_records !== 119 || descriptor?.record_counts?.series_records !== 119) fail('descriptor record counts must remain 119/119');
  if (descriptor?.record_counts?.relationships !== 1) fail(`descriptor relationship count must be 1, found ${descriptor?.record_counts?.relationships}`);
  if (descriptor?.routes?.relationships !== '/data/series/relationships.json') fail('descriptor relationship route mismatch');
  if (descriptor?.capabilities?.relationships !== 'adapter') fail('descriptor relationship capability mismatch');

  const rows = Array.isArray(index?.records) ? index.records : [];
  if (index?.record_count !== 119 || rows.length !== 119) fail(`Series index count must be 119, found ${index?.record_count}/${rows.length}`);
  const rowsByKey = new Map(rows.map((row) => [row.global_record_key, row]));
  if (rowsByKey.size !== 119) fail('Series index global keys are not unique');

  if (!Array.isArray(relationships) || relationships.length !== 1) {
    fail(`relationship transport must contain exactly one record, found ${Array.isArray(relationships) ? relationships.length : 'non-array'}`);
  } else {
    const relationship = relationships[0];
    const source = endpointKey(relationship.source);
    const target = endpointKey(relationship.target);
    if (relationship.series_schema_version !== '1.0.0' || relationship.object_type !== 'relationship_record') fail('relationship object contract mismatch');
    if (relationship.relation_type !== expectedTuple[0] || source !== expectedTuple[1] || target !== expectedTuple[2]) fail('live relationship tuple is not the reviewed SAI predecessor_of DAI tuple');
    if (relationship.direction !== 'directed') fail('relationship direction mismatch');
    if (relationship.provenance?.basis !== 'native_reviewed_relationship') fail('relationship provenance basis mismatch');
    if (!Array.isArray(relationship.provenance?.native_evidence_refs)) fail('native_evidence_refs must be an array');
    if (!rowsByKey.has(source) || !rowsByKey.has(target)) fail('relationship endpoint missing from Series index');
    if (source === target) fail('relationship self-loop');
    if (relationship.id !== relationshipId(relationship.relation_type, source, target)) fail('deterministic relationship id mismatch');

    for (const key of [source, target]) {
      const row = rowsByKey.get(key);
      if (!row) continue;
      const envelope = await fetchJson(new URL(row.machine_url).pathname);
      if (envelope.global_record_key !== key) fail(`${key}: envelope key mismatch`);
      if (!Array.isArray(envelope.relationships) || envelope.relationships.length !== 0) fail(`${key}: record-envelope relationships must remain empty`);
    }
  }
  if (errors.length) throw new Error(errors.join('; '));
}

let lastError;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
  try {
    await verifyOnce();
    console.log(`SOG Stage 5 production verification passed on attempt ${attempt}: historical Stage 5 authority preserved, current reviewed canonical hash matched, 119 Series records, 1 reviewed SAI predecessor_of DAI relationship.`);
    process.exit(0);
  } catch (error) {
    lastError = error;
  }
  if (attempt < attempts) await sleep(delayMs);
}
console.error(`SOG Stage 5 production verification failed: ${lastError?.message ?? 'unknown error'}`);
process.exit(1);
