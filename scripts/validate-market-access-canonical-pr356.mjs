import fs from 'node:fs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const readRows = (file) => {
  const parsed = readJson(file);
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.records)) return parsed.records;
  throw new Error(`${file}: expected array or { records: [] }`);
};
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const config = readJson('config/market-access-pilot-1-pr356.json');
const schema = readJson('schemas/market-access-record-v1.schema.json');
const records = readJson('data/market-access-records-v1.json');
const baseline = loadRegistryV2Baseline(root);
const stablecoins = (baseline.data_groups?.stablecoins ?? []).flatMap(readRows);
const evidence = (baseline.data_groups?.evidence ?? []).flatMap(readRows);
const assetIds = new Set(stablecoins.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));
const allowedTopLevel = new Set(Object.keys(schema.properties ?? {}));
const requiredTopLevel = schema.required ?? [];
const functionEnum = new Set(schema.properties.function.enum);
const accessStateEnum = new Set(schema.properties.access_state.enum);
const datePrecisionEnum = new Set(schema.properties.date_precision.enum);
const networkKindEnum = new Set(schema.properties.network_scope.properties.kind.enum);
const customerKindEnum = new Set(schema.properties.customer_scope.properties.kind.enum);
const conditionTypeEnum = new Set(schema.properties.conditions.items.properties.type.enum);
const legalRouteEnum = new Set(schema.properties.legal_route.properties.status.enum);
const confidenceEnum = new Set(schema.properties.confidence.enum);
const expectedFunctions = new Set(config.functions);
const excludedFunctions = new Set(config.excluded_functions);

expect(Array.isArray(records), 'canonical Market Access entrypoint must be an array');
expect(records.length === 4, `PR #356 must contain exactly four canonical Market Access records, found ${records.length}`);
expect(records.length <= config.maximum_canonical_records, 'canonical Market Access count exceeds pilot maximum');

const ids = new Set();
const logicalKeys = new Set();
const functions = new Set();
for (const row of records) {
  const prefix = row?.id ?? '<missing-id>';
  for (const key of requiredTopLevel) expect(Object.hasOwn(row, key), `${prefix}: missing required property ${key}`);
  for (const key of Object.keys(row)) expect(allowedTopLevel.has(key), `${prefix}: unsupported top-level property ${key}`);
  expect(typeof row.id === 'string' && /^sog_ma_[a-z0-9_]+$/.test(row.id), `${prefix}: invalid ID`);
  expect(!ids.has(row.id), `${prefix}: duplicate ID`);
  ids.add(row.id);
  expect(row.schema_version === '1.0', `${prefix}: schema version mismatch`);
  expect(assetIds.has(row.asset_id), `${prefix}: unknown asset ${row.asset_id}`);
  expect(row.asset_id === 'sog_st_usdc', `${prefix}: asset outside Pilot 1`);
  expect(row.jurisdiction?.country_code === 'JP' && row.jurisdiction?.subdivision_code === null, `${prefix}: jurisdiction outside Pilot 1`);
  expect(row.platform?.organization_id === null, `${prefix}: unexpected organization ID`);
  expect(row.platform?.name === 'SBI VC Trade' && row.platform?.service === 'VCTRADE', `${prefix}: platform/service outside Pilot 1`);
  expect(functionEnum.has(row.function), `${prefix}: invalid function ${row.function}`);
  expect(expectedFunctions.has(row.function), `${prefix}: function outside approved Pilot 1 set`);
  expect(!excludedFunctions.has(row.function), `${prefix}: excluded issuer function promoted`);
  expect(!functions.has(row.function), `${prefix}: duplicate function row ${row.function}`);
  functions.add(row.function);
  expect(accessStateEnum.has(row.access_state), `${prefix}: invalid access state ${row.access_state}`);
  expect(datePattern.test(row.effective_from), `${prefix}: invalid effective_from`);
  expect(row.effective_from === config.effective_from, `${prefix}: effective_from outside Pilot 1`);
  expect(row.effective_to === null || datePattern.test(row.effective_to), `${prefix}: invalid effective_to`);
  expect(datePattern.test(row.observed_at) && row.observed_at === config.observed_at, `${prefix}: observed_at outside Pilot 1`);
  expect(datePrecisionEnum.has(row.date_precision), `${prefix}: invalid date precision`);
  expect(networkKindEnum.has(row.network_scope?.kind), `${prefix}: invalid network scope kind`);
  expect(Array.isArray(row.network_scope?.network_ids), `${prefix}: network_ids must be an array`);
  expect(new Set(row.network_scope?.network_ids ?? []).size === (row.network_scope?.network_ids ?? []).length, `${prefix}: duplicate network IDs`);
  expect(customerKindEnum.has(row.customer_scope?.kind), `${prefix}: invalid customer scope kind`);
  expect(Array.isArray(row.conditions), `${prefix}: conditions must be an array`);
  for (const condition of row.conditions ?? []) {
    expect(conditionTypeEnum.has(condition.type), `${prefix}: invalid condition type ${condition.type}`);
    expect(typeof condition.description === 'string' && condition.description.length > 0, `${prefix}: empty condition description`);
    expect(Object.keys(condition).every((key) => ['type', 'description'].includes(key)), `${prefix}: unsupported condition property`);
  }
  expect(legalRouteEnum.has(row.legal_route?.status), `${prefix}: invalid legal route status`);
  expect(Array.isArray(row.evidence_ids) && row.evidence_ids.length >= 1, `${prefix}: canonical Evidence required`);
  expect(new Set(row.evidence_ids ?? []).size === (row.evidence_ids ?? []).length, `${prefix}: duplicate Evidence IDs`);
  for (const evidenceId of row.evidence_ids ?? []) expect(evidenceIds.has(evidenceId), `${prefix}: unknown Evidence ID ${evidenceId}`);
  expect(row.evidence_ids.includes('sog_src_usdc_sbivc_public_launch_pr356'), `${prefix}: SBI function Evidence missing`);
  expect(row.evidence_ids.includes('sog_src_jfsa_electronic_payment_instrument_register_pr356'), `${prefix}: JFSA legal-route Evidence missing`);
  expect(confidenceEnum.has(row.confidence), `${prefix}: invalid confidence`);
  expect(row.review_status === 'reviewed', `${prefix}: review status must be reviewed`);
  expect(Array.isArray(row.supersedes_record_ids), `${prefix}: supersedes_record_ids must be an array`);
  expect(typeof row.notes === 'string' && row.notes.includes('does not assert universal Japan-wide availability'), `${prefix}: provider-scope disclaimer missing`);

  const logicalKey = [
    row.asset_id,
    row.jurisdiction.country_code,
    row.jurisdiction.subdivision_code ?? '',
    row.platform.name,
    row.platform.service,
    row.function,
    row.access_state,
    row.effective_from,
  ].join('|');
  expect(!logicalKeys.has(logicalKey), `${prefix}: duplicate logical record identity`);
  logicalKeys.add(logicalKey);
}

expect(functions.size === expectedFunctions.size && [...expectedFunctions].every((value) => functions.has(value)), 'canonical rows must cover each approved function exactly once');

const buySell = records.find((row) => row.function === 'buy_sell');
expect(buySell?.conditions.some((row) => row.type === 'transaction_limit'), 'buy_sell transaction limit missing');
const deposit = records.find((row) => row.function === 'deposit');
expect(deposit?.network_scope?.kind === 'specific_networks' && deposit.network_scope.network_ids.includes('ethereum'), 'deposit Ethereum scope missing');
const withdrawal = records.find((row) => row.function === 'withdrawal');
expect(withdrawal?.network_scope?.kind === 'specific_networks' && withdrawal.network_scope.network_ids.includes('ethereum'), 'withdrawal Ethereum scope missing');
expect(withdrawal?.conditions.some((row) => row.type === 'withdrawal_limit'), 'withdrawal limit missing');
const externalTransfer = records.find((row) => row.function === 'external_wallet_transfer');
expect(externalTransfer?.access_state === 'restricted_network_scope', 'external wallet transfer must preserve restricted network scope');
expect(externalTransfer?.network_scope?.network_ids.includes('ethereum'), 'external wallet transfer Ethereum scope missing');

if (failures.length) {
  console.error('PR #356 canonical Market Access validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  record_count: records.length,
  functions: [...functions].sort(),
  evidence_ids: [...new Set(records.flatMap((row) => row.evidence_ids))].sort(),
  logical_identity_count: logicalKeys.size,
}, null, 2));
