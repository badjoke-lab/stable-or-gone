import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const dist = path.resolve(root, 'dist');
const officialOrigin = 'https://www.stableorgone.com';
const legacyOrigin = 'https://sog.badjoke-lab.com';
const registryId = 'stable-or-gone';
const errors = [];
const fail = (message) => errors.push(message);

function readJson(relativePath) {
  const target = path.join(dist, relativePath);
  if (!fs.existsSync(target)) {
    fail(`${relativePath}: missing`);
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(target, 'utf8'));
  } catch (error) {
    fail(`${relativePath}: invalid JSON: ${error.message}`);
    return null;
  }
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function same(left, right) {
  return JSON.stringify(stable(left)) === JSON.stringify(stable(right));
}

function listJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => entry.name)
    .sort();
}

const manifest = readJson('data/manifest.json');
const descriptor = readJson('data/series/registry.json');
const index = readJson('data/series/index.json');

if (!manifest || !descriptor || !index) {
  console.error('SOG Ledger Series Phase 9 adapter validation could not start because required output is missing.');
  process.exit(1);
}

if (manifest.project_id !== registryId) fail(`native manifest project_id mismatch: ${manifest.project_id}`);
if (manifest.canonical_origin !== officialOrigin) fail(`native manifest origin mismatch: ${manifest.canonical_origin}`);
if (manifest.data_safety?.canonical_only !== true) fail('native manifest is not canonical_only');
if (manifest.record_counts?.primary_records !== 119) fail(`native primary record count must remain 119, found ${manifest.record_counts?.primary_records}`);

if (descriptor.series_schema_version !== '1.0.0') fail('Series schema version mismatch');
if (descriptor.object_type !== 'registry_descriptor') fail('descriptor object_type mismatch');
if (descriptor.registry?.id !== registryId) fail('descriptor registry ID mismatch');
if (descriptor.registry?.origin !== officialOrigin) fail('descriptor official origin mismatch');
if (descriptor.canonical_only !== true) fail('descriptor canonical_only mismatch');
if (descriptor.record_counts?.primary_records !== 119 || descriptor.record_counts?.series_records !== 119) fail('descriptor record counts must be 119/119');
if (descriptor.routes?.descriptor !== '/data/series/registry.json') fail('descriptor route mismatch');
if (descriptor.routes?.index !== '/data/series/index.json') fail('index route mismatch');
if (descriptor.routes?.record_template !== '/data/series/records/{slug}.json') fail('record template mismatch');
if (descriptor.routes?.search !== '/stablecoins/') fail('search route mismatch');
if (descriptor.routes?.compare !== '/compare/') fail('compare route mismatch');
if (descriptor.routes?.stats !== '/stats/') fail('stats route mismatch');
if (descriptor.data_safety?.canonical_only !== true) fail('Series data safety canonical_only mismatch');
if (descriptor.data_safety?.includes_unreviewed_candidates !== false) fail('Series candidate boundary mismatch');
if (descriptor.data_safety?.includes_internal_monitoring !== false) fail('Series monitoring boundary mismatch');
if (descriptor.data_safety?.includes_private_notes !== false) fail('Series private-note boundary mismatch');
if (descriptor.data_safety?.ai_generated_canonical_facts !== false) fail('Series AI canonical-fact boundary mismatch');
if (!same(descriptor.verification?.build, manifest.build)) fail('descriptor build provenance must equal native manifest build provenance');

const descriptorText = JSON.stringify(descriptor);
if (descriptorText.includes(legacyOrigin)) fail('legacy migration origin leaked into Series descriptor');

if (index.series_schema_version !== '1.0.0') fail('index Series schema version mismatch');
if (index.object_type !== 'record_index') fail('index object_type mismatch');
if (index.registry_id !== registryId) fail('index registry ID mismatch');
if (index.canonical_only !== true) fail('index canonical_only mismatch');
if (index.record_count !== 119 || index.record_counts?.stablecoins !== 119) fail('index count must be 119');
if (!same(index.verification?.build, manifest.build)) fail('index build provenance must equal native manifest build provenance');
if (!Array.isArray(index.records) || index.records.length !== 119) fail('index records array must contain 119 records');

const stablecoinFiles = listJsonFiles(path.join(dist, 'data', 'stablecoin'));
const seriesFiles = listJsonFiles(path.join(dist, 'data', 'series', 'records'));
if (stablecoinFiles.length !== 119) fail(`native dossier file count must be 119, found ${stablecoinFiles.length}`);
if (seriesFiles.length !== 119) fail(`Series envelope file count must be 119, found ${seriesFiles.length}`);
if (!same(seriesFiles, stablecoinFiles)) fail('Series envelope slugs must exactly match native dossier slugs');

const keys = new Set();
const nativeIds = new Set();
for (const row of index.records ?? []) {
  const label = row?.slug || row?.native_record_id || 'unknown-row';
  if (row.native_record_type !== 'stablecoin') fail(`${label}: unexpected native_record_type ${row.native_record_type}`);
  if (keys.has(row.global_record_key)) fail(`${label}: duplicate global key ${row.global_record_key}`);
  keys.add(row.global_record_key);
  if (nativeIds.has(row.native_record_id)) fail(`${label}: duplicate native ID ${row.native_record_id}`);
  nativeIds.add(row.native_record_id);

  const expectedKey = `${registryId}:stablecoin:${row.native_record_id}`;
  if (row.global_record_key !== expectedKey) fail(`${label}: global key mismatch`);
  if (row.machine_url !== `${officialOrigin}/data/series/records/${row.slug}.json`) fail(`${label}: machine URL mismatch`);
  if (row.native_machine_url !== `${officialOrigin}/data/stablecoin/${row.slug}.json`) fail(`${label}: native machine URL mismatch`);
  if (row.human_url !== `${officialOrigin}/stablecoin/${row.slug}/`) fail(`${label}: human URL mismatch`);

  const native = readJson(`data/stablecoin/${row.slug}.json`);
  const envelope = readJson(`data/series/records/${row.slug}.json`);
  if (!native || !envelope) continue;

  if (native.record_type !== 'stablecoin') fail(`${label}: native dossier record_type mismatch`);
  if (native.id !== row.native_record_id || native.slug !== row.slug) fail(`${label}: native dossier identity mismatch`);
  if (native.canonical_only !== true || native.data_safety?.canonical_only !== true) fail(`${label}: native dossier canonical boundary mismatch`);

  if (envelope.object_type !== 'record_envelope') fail(`${label}: envelope object_type mismatch`);
  if (envelope.registry_id !== registryId) fail(`${label}: envelope registry ID mismatch`);
  if (envelope.global_record_key !== expectedKey) fail(`${label}: envelope global key mismatch`);
  if (envelope.record_key?.native_record_type !== 'stablecoin' || envelope.record_key?.native_record_id !== native.id || envelope.record_key?.slug !== native.slug) fail(`${label}: envelope record key mismatch`);
  if (envelope.identity?.name !== native.record?.name) fail(`${label}: native name mismatch`);
  if (envelope.identity?.symbol !== (native.record?.symbol ?? null)) fail(`${label}: native symbol mismatch`);
  if (!same(envelope.identity?.aliases ?? [], native.record?.aliases ?? [])) fail(`${label}: native aliases mismatch`);
  if (envelope.urls?.human !== native.canonical_page_url) fail(`${label}: human URL does not match native dossier`);
  if (envelope.urls?.native_machine !== native.self_url) fail(`${label}: native machine URL does not match dossier`);
  if (envelope.urls?.machine !== `${officialOrigin}/data/series/records/${row.slug}.json`) fail(`${label}: Series machine URL mismatch`);
  if (!same(envelope.current_state?.native?.record, native.record)) fail(`${label}: native stablecoin record was not preserved losslessly`);
  if (!same(envelope.current_state?.native?.related, native.related)) fail(`${label}: native related records were not preserved losslessly`);
  if (!same(envelope.current_state?.native?.record_counts, native.record_counts)) fail(`${label}: native record counts mismatch`);
  if (!same(envelope.events?.records ?? [], native.related?.events ?? [])) fail(`${label}: events mismatch`);
  if (!same(envelope.evidence?.records ?? [], native.related?.evidence ?? [])) fail(`${label}: evidence mismatch`);
  if (!same(envelope.evidence?.relations ?? [], native.related?.evidence_relations ?? [])) fail(`${label}: evidence relations mismatch`);
  if (!Array.isArray(envelope.relationships) || envelope.relationships.length !== 0) fail(`${label}: typed Series relationships must remain empty during Stage 3`);
  if (!same(envelope.verification?.build, native.build)) fail(`${label}: build provenance mismatch`);
  if (envelope.verification?.last_verified_at !== (native.record?.last_verified_at ?? null)) fail(`${label}: last_verified_at mismatch`);
  if (envelope.provenance?.canonical_only !== true) fail(`${label}: provenance canonical_only mismatch`);

  const serialized = JSON.stringify(envelope);
  if (serialized.includes(legacyOrigin)) fail(`${label}: legacy migration origin leaked into Series envelope`);
}

if (keys.size !== 119) fail(`global key uniqueness/count mismatch: ${keys.size}`);
if (nativeIds.size !== 119) fail(`native ID uniqueness/count mismatch: ${nativeIds.size}`);

if (errors.length) {
  console.error(`SOG Ledger Series Phase 9 adapter validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('SOG Ledger Series Phase 9 adapter validation passed: 119 canonical stablecoin envelopes.');
console.log(`Build commit: ${manifest.build?.commit ?? 'unknown'}`);
console.log(`Canonical hash: ${manifest.build?.canonical_data_hash ?? 'unknown'}`);
