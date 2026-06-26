import fs from 'node:fs';
import path from 'node:path';
import { publicTaxonomy } from '../config/public-taxonomy.mjs';
import {
  safeLegacyLifecycleMappings,
  recordSpecificLifecycleMappings,
  allowedIssuanceByLifecycle
} from '../config/lifecycle-issuance-compatibility.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

function readRows(relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or { records: [] }`);
}

function readText(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function countBy(rows, getter) {
  const counts = new Map();
  for (const row of rows) {
    const value = getter(row) ?? 'missing';
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => String(a).localeCompare(String(b))));
}

const baseline = loadRegistryV2Baseline(root);
const stablecoins = baseline.data_groups.stablecoins.flatMap(readRows);
const classifications = baseline.data_groups.classifications.flatMap(readRows);
const classificationById = new Map(classifications.map((row) => [row.id, row]));
const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const lifecycleValues = new Set(publicTaxonomy.axes.lifecycle_status.entries.map((entry) => entry.canonical_value));
const issuanceValues = new Set(publicTaxonomy.axes.issuance_status.entries.map((entry) => entry.canonical_value));
const usedRecordOverrides = new Set();
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
  check(typeof legacyStatus === 'string' && legacyStatus.length > 0, `${coin.id}: legacy status missing`);
  check(lifecycleValues.has(lifecycleStatus), `${coin.id}: invalid lifecycle status ${lifecycleStatus}`);
  check(issuanceValues.has(issuanceStatus), `${coin.id}: invalid issuance status ${issuanceStatus}`);

  const override = recordSpecificLifecycleMappings[coin.id];
  let mappingKind = 'safe_legacy_mapping';
  if (override) {
    usedRecordOverrides.add(coin.id);
    mappingKind = 'record_specific_mapping';
    check(override.legacy_status === legacyStatus, `${coin.id}: legacy status differs from reviewed override`);
    check(override.lifecycle_status === lifecycleStatus, `${coin.id}: lifecycle differs from reviewed override`);
    check(override.issuance_status === issuanceStatus, `${coin.id}: issuance differs from reviewed override`);
    check(typeof override.reason === 'string' && override.reason.length >= 20, `${coin.id}: reviewed override reason is missing`);
  } else {
    const expectedLifecycle = safeLegacyLifecycleMappings[legacyStatus];
    check(Boolean(expectedLifecycle), `${coin.id}: legacy status ${legacyStatus} requires an explicit record mapping`);
    check(expectedLifecycle === lifecycleStatus, `${coin.id}: ${legacyStatus} must map to ${expectedLifecycle}, found ${lifecycleStatus}`);
  }

  const allowedIssuance = allowedIssuanceByLifecycle[lifecycleStatus] ?? [];
  check(allowedIssuance.includes(issuanceStatus), `${coin.id}: issuance ${issuanceStatus} is not allowed for lifecycle ${lifecycleStatus}`);

  records.push({
    id: coin.id,
    slug: coin.slug,
    legacy_status: legacyStatus,
    lifecycle_status: lifecycleStatus,
    issuance_status: issuanceStatus,
    mapping_kind: mappingKind,
    mapping_reason: override?.reason ?? null
  });
}

for (const id of Object.keys(recordSpecificLifecycleMappings)) {
  check(stablecoinIds.has(id), `${id}: record-specific mapping points to a missing stablecoin`);
  check(usedRecordOverrides.has(id), `${id}: record-specific mapping is unused`);
}

const discontinuedIds = stablecoins.filter((row) => row.status === 'discontinued').map((row) => row.id).sort();
const overrideIds = Object.keys(recordSpecificLifecycleMappings).sort();
check(JSON.stringify(discontinuedIds) === JSON.stringify(overrideIds), 'every discontinued legacy record must have exactly one explicit record mapping');

const publicFiles = [
  'src/pages/index.astro',
  'src/pages/stablecoins/index.astro',
  'src/components/StablecoinDetailView.astro',
  'src/pages/issuer/[slug].astro',
  'src/lib/machine-readable.ts'
];
for (const relativePath of publicFiles) {
  const source = readText(relativePath);
  check(!/\bcoin\.status\b/.test(source), `${relativePath}: public UI still reads coin.status`);
  check(!/\bstablecoin\.status\b/.test(source), `${relativePath}: public UI still reads stablecoin.status`);
  check(!/lifecycle_status\s*\?\?\s*(?:coin|stablecoin)\.status/.test(source), `${relativePath}: lifecycle fallback to legacy status is prohibited`);
}

const homeSource = readText('src/pages/index.astro');
check(homeSource.includes('formatLifecycleLabel'), 'home page must use the taxonomy-backed lifecycle label');
check(homeSource.includes('<th>Lifecycle</th>'), 'home selected-record table must label lifecycle explicitly');

const indexSource = readText('src/pages/stablecoins/index.astro');
check(indexSource.includes('data-filter-lifecycle'), 'stablecoin index lifecycle filter is missing');
check(indexSource.includes('data-filter-issuance'), 'stablecoin index issuance filter is missing');
check(indexSource.includes('<th>Lifecycle</th>'), 'stablecoin index lifecycle column is missing');
check(indexSource.includes('<th>Issuance</th>'), 'stablecoin index issuance column is missing');

const detailSource = readText('src/components/StablecoinDetailView.astro');
check(detailSource.includes('formatLifecycleLabel(coin.lifecycle_status)'), 'detail page lifecycle label must use canonical lifecycle');
check(detailSource.includes('formatIssuanceLabel(coin.issuance_status)'), 'detail page issuance label must remain separate');

const machineSource = readText('src/lib/machine-readable.ts');
check(!machineSource.includes('status: countValues(stablecoins.map((coin) => coin.status))'), 'machine-readable breakdown must not publish legacy status as the primary status axis');
check(machineSource.includes('lifecycle_status: countValues'), 'machine-readable lifecycle breakdown is missing');
check(machineSource.includes('issuance_status: countValues'), 'machine-readable issuance breakdown is missing');

const statsSource = readText('scripts/generate-registry-stats.mjs');
check(!statsSource.includes('entity_statuses:'), 'registry stats must not present legacy entity status as a normal composition axis');
check(statsSource.includes('legacy_status_compatibility:'), 'registry stats must retain legacy status only as compatibility diagnostics');

const cssSource = readText('src/styles/global.css');
for (const selector of ['.chip.limited', '.chip.impaired', '.chip.discontinued', '.chip.failed']) {
  check(!cssSource.includes(selector), `legacy chip selector remains public: ${selector}`);
}
for (const selector of ['.chip.restricted', '.chip.winding_down', '.chip.terminated', '.chip.collapsed']) {
  check(cssSource.includes(selector), `canonical lifecycle chip selector is missing: ${selector}`);
}

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
  records,
  failures
};

const reportPath = path.join(root, 'data/generated/lifecycle-issuance-validation.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length > 0) {
  console.error('Lifecycle and issuance normalization failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({ ...report, ok: true, records: undefined }, null, 2));
