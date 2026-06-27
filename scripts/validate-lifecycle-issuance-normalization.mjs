import fs from 'node:fs';
import path from 'node:path';
import { publicTaxonomy } from '../config/public-taxonomy.mjs';
import { safeLegacyLifecycleMappings, recordSpecificLifecycleMappings, allowedIssuanceByLifecycle } from '../config/lifecycle-issuance-compatibility.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const readRows = (relativePath) => {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or records array`);
};
const readText = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const countBy = (rows, getter) => Object.fromEntries([...rows.reduce((map, row) => {
  const value = getter(row) ?? 'missing';
  map.set(value, (map.get(value) ?? 0) + 1);
  return map;
}, new Map()).entries()].sort(([left], [right]) => String(left).localeCompare(String(right))));

const baseline = loadRegistryV2Baseline(root);
const stablecoins = baseline.data_groups.stablecoins.flatMap(readRows);
const classifications = baseline.data_groups.classifications.flatMap(readRows);
const classificationById = new Map(classifications.map((row) => [row.id, row]));
const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const lifecycleValues = new Set(publicTaxonomy.axes.lifecycle_status.entries.map((entry) => entry.canonical_value));
const issuanceValues = new Set(publicTaxonomy.axes.issuance_status.entries.map((entry) => entry.canonical_value));
const usedOverrides = new Set();
const records = [];

check(stablecoins.length === 92, `expected 92 stablecoins, found ${stablecoins.length}`);
check(classifications.length === 92, `expected 92 classifications, found ${classifications.length}`);
check(stablecoinIds.size === stablecoins.length, 'stablecoin IDs must be unique');
check(new Set(classifications.map((row) => row.id)).size === classifications.length, 'classification IDs must be unique');

for (const coin of stablecoins) {
  const classification = classificationById.get(coin.id);
  check(Boolean(classification), `${coin.id}: missing classification`);
  if (!classification) continue;
  const legacyStatus = coin.status;
  const lifecycleStatus = classification.lifecycle_status;
  const issuanceStatus = classification.issuance_status;
  check(lifecycleValues.has(lifecycleStatus), `${coin.id}: invalid lifecycle status ${lifecycleStatus}`);
  check(issuanceValues.has(issuanceStatus), `${coin.id}: invalid issuance status ${issuanceStatus}`);
  const override = recordSpecificLifecycleMappings[coin.id];
  if (override) {
    usedOverrides.add(coin.id);
    check(override.legacy_status === legacyStatus, `${coin.id}: legacy status differs from override`);
    check(override.lifecycle_status === lifecycleStatus, `${coin.id}: lifecycle differs from override`);
    check(override.issuance_status === issuanceStatus, `${coin.id}: issuance differs from override`);
    check(typeof override.reason === 'string' && override.reason.length >= 20, `${coin.id}: override reason is missing`);
  } else {
    const expectedLifecycle = safeLegacyLifecycleMappings[legacyStatus];
    check(Boolean(expectedLifecycle), `${coin.id}: legacy status ${legacyStatus} requires explicit mapping`);
    check(expectedLifecycle === lifecycleStatus, `${coin.id}: expected lifecycle ${expectedLifecycle}, found ${lifecycleStatus}`);
  }
  check((allowedIssuanceByLifecycle[lifecycleStatus] ?? []).includes(issuanceStatus), `${coin.id}: issuance ${issuanceStatus} is not allowed for ${lifecycleStatus}`);
  records.push({ id: coin.id, legacy_status: legacyStatus, lifecycle_status: lifecycleStatus, issuance_status: issuanceStatus, mapping_kind: override ? 'record_specific_mapping' : 'safe_legacy_mapping' });
}

for (const id of Object.keys(recordSpecificLifecycleMappings)) {
  check(stablecoinIds.has(id), `${id}: override points to missing stablecoin`);
  check(usedOverrides.has(id), `${id}: override is unused`);
}
const discontinuedIds = stablecoins.filter((row) => row.status === 'discontinued').map((row) => row.id).sort();
check(JSON.stringify(discontinuedIds) === JSON.stringify(Object.keys(recordSpecificLifecycleMappings).sort()), 'every discontinued record must have one explicit mapping');

for (const relativePath of ['src/pages/index.astro', 'src/pages/stablecoins/index.astro', 'src/components/StablecoinDetailView.astro', 'src/pages/issuer/[slug].astro', 'src/lib/machine-readable.ts']) {
  const source = readText(relativePath);
  check(!/\bcoin\.status\b/.test(source), `${relativePath}: public UI reads legacy coin.status`);
  check(!/\bstablecoin\.status\b/.test(source), `${relativePath}: public UI reads legacy stablecoin.status`);
  check(!/lifecycle_status\s*\?\?\s*(?:coin|stablecoin)\.status/.test(source), `${relativePath}: legacy lifecycle fallback is prohibited`);
}

const homeSource = readText('src/pages/index.astro');
check(homeSource.includes('formatLifecycleLabel'), 'home must use taxonomy-backed lifecycle labels');
check(homeSource.includes('<th>Lifecycle</th>'), 'home lifecycle column is missing');
const indexSource = readText('src/pages/stablecoins/index.astro');
check(indexSource.includes("id: 'lifecycle'") && indexSource.includes("data-filter-group={filter.id}"), 'stablecoin lifecycle multi-filter is missing');
check(indexSource.includes("id: 'issuance'") && indexSource.includes("data-filter-group={filter.id}"), 'stablecoin issuance multi-filter is missing');
check(indexSource.includes('<th>Lifecycle</th>') && indexSource.includes('<th>Issuance</th>'), 'stablecoin lifecycle or issuance column is missing');
const detailSource = readText('src/components/StablecoinDetailView.astro');
check(detailSource.includes('formatLifecycleLabel(coin.lifecycle_status)'), 'detail lifecycle label must remain canonical');
check(detailSource.includes('formatIssuanceLabel(coin.issuance_status)'), 'detail issuance label must remain separate');
const machineSource = readText('src/lib/machine-readable.ts');
check(machineSource.includes('lifecycle_status: countValues') && machineSource.includes('issuance_status: countValues'), 'machine-readable lifecycle or issuance breakdown is missing');
const cssSource = readText('src/styles/global.css');
for (const selector of ['.chip.limited', '.chip.impaired', '.chip.discontinued', '.chip.failed']) check(!cssSource.includes(selector), `legacy chip selector remains: ${selector}`);
for (const selector of ['.chip.restricted', '.chip.winding_down', '.chip.terminated', '.chip.collapsed']) check(cssSource.includes(selector), `canonical chip selector is missing: ${selector}`);

const report = {
  schema_version: '1.0',
  checked_at: new Date().toISOString(),
  stablecoins: stablecoins.length,
  classifications: classifications.length,
  safe_mapping_records: records.filter((row) => row.mapping_kind === 'safe_legacy_mapping').length,
  record_specific_mapping_records: records.filter((row) => row.mapping_kind === 'record_specific_mapping').length,
  legacy_status_counts: countBy(records, (row) => row.legacy_status),
  lifecycle_status_counts: countBy(records, (row) => row.lifecycle_status),
  issuance_status_counts: countBy(records, (row) => row.issuance_status),
  lifecycle_issuance_pairs: countBy(records, (row) => `${row.lifecycle_status} -> ${row.issuance_status}`),
  failures
};
const reportPath = path.join(root, 'data/generated/lifecycle-issuance-validation.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
if (failures.length) { console.error('Lifecycle and issuance normalization failed:'); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log(JSON.stringify({ ...report, ok: true }, null, 2));
