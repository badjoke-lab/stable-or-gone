import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readRows = (file) => {
  const parsed = readJson(file);
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed?.records)) return parsed.records;
  throw new Error(`${file}: expected array or { records: [] }`);
};
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const normalizeScope = (value) => String(value ?? '').toLowerCase();

const config = readJson('config/market-access-pilot-2-pr359.json');
const schema = readJson('schemas/market-access-record-v1.schema.json');
const records = readJson('data/market-access-records-v1.json');
const research = readJson('data/editorial-research/japan-stablecoin-market-access-2026.json');
const handoff = readJson('docs/migration/record-growth-batch-1-pr358-reviewed-handoff.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const baseline = loadRegistryV2Baseline(root);
const stablecoins = (baseline.data_groups?.stablecoins ?? []).flatMap(readRows);
const evidence = (baseline.data_groups?.evidence ?? []).flatMap(readRows);
const evidenceRelations = (baseline.data_groups?.evidence_relations ?? []).flatMap(readRows);
const organizations = (baseline.data_groups?.organizations ?? []).flatMap(readRows);
const assetIds = new Set(stablecoins.map((row) => row.id));
const evidenceById = new Map(evidence.map((row) => [row.id, row]));
const organizationIds = new Set(organizations.map((row) => row.id));
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

const priorIds = new Set([
  'sog_ma_usdc_jp_sbivc_vctrade_buy_sell_20250326',
  'sog_ma_usdc_jp_sbivc_vctrade_deposit_20250326',
  'sog_ma_usdc_jp_sbivc_vctrade_withdrawal_20250326',
  'sog_ma_usdc_jp_sbivc_vctrade_external_wallet_transfer_20250326'
]);
const expectedNewIds = new Set([
  'sog_ma_rlusd_jp_sbivc_vctrade_buy_sell_20260624',
  'sog_ma_rlusd_jp_sbivc_vctrade_deposit_20260624',
  'sog_ma_rlusd_jp_sbivc_vctrade_withdrawal_20260624',
  'sog_ma_rlusd_jp_sbivc_vctrade_external_wallet_transfer_20260624'
]);

expect(config.schema_version === '1.0', 'Pilot 2 config schema mismatch');
expect(config.pilot_id === 'sog_market_access_pilot_2_pr359', 'Pilot 2 config ID mismatch');
expect(config.review_pr === 359, 'Pilot 2 review PR mismatch');
expect(config.expected_market_access_records_before === 4, 'Pilot 2 starting Market Access count must be four');
expect(config.expected_market_access_records_after === 8, 'Pilot 2 ending Market Access count must be eight');
expect(config.maximum_new_canonical_records === 4, 'Pilot 2 maximum new canonical rows must be four');
expect(config.assets?.length === 1 && config.assets[0].asset_id === 'sog_st_rlusd', 'Pilot 2 asset scope must be RLUSD only');
expect(config.platforms?.length === 1 && config.platforms[0].name === 'SBI VC Trade' && config.platforms[0].service === 'VCTRADE', 'Pilot 2 platform scope mismatch');
expect(config.jurisdictions?.length === 1 && config.jurisdictions[0].country_code === 'JP', 'Pilot 2 jurisdiction scope mismatch');
expect(config.effective_from === '2026-06-24', 'Pilot 2 effective date mismatch');
expect(config.observed_at === '2026-07-13', 'Pilot 2 observed date mismatch');
expect(config.canonical_promotion?.automatic === false, 'Pilot 2 automatic promotion must remain disabled');
expect(config.canonical_promotion?.manual_review_required === true, 'Pilot 2 manual review must remain required');
for (const boundary of ['new_canonical_assets_allowed','new_evidence_identities_allowed','new_public_surface_allowed','comparison_readiness_change_allowed','facet_freshness_semantics_change_allowed','monitoring_promotion_allowed','editorial_research_direct_promotion_allowed','universal_japan_availability_claim_allowed','issuer_mint_or_redemption_claim_allowed','asset_rank','single_composite_score']) {
  expect(config.boundaries?.[boundary] === false, `Pilot 2 boundary must remain false: ${boundary}`);
}

expect(handoff.status === 'reviewed_merged_handoff', 'PR #358 handoff status mismatch');
expect(handoff.source_merge_commit === '47868d6a13f8f85f62034f81a7c31d528bc3a1ba', 'PR #358 merge commit mismatch');
expect(handoff.canonical_counts?.assets === 112, 'PR #358 handoff asset count mismatch');
expect(handoff.canonical_counts?.evidence === 557, 'PR #358 handoff Evidence count mismatch');
expect(handoff.canonical_counts?.market_access_records === 4, 'PR #358 handoff Market Access count mismatch');
expect(handoff.next_work_item === 'PR #359 Market Access Pilot 2', 'PR #358 handoff next work item mismatch');

const researchRow = research.records?.find((row) => row.record_id === 'jp_access_rlusd_sbivc_2026_06_24');
expect(Boolean(researchRow), 'RLUSD source research row missing');
expect(research.canonical_boundary?.included_in_public_canonical_counts === false, 'editorial research must remain noncanonical');
expect(researchRow?.asset_id === 'sog_st_rlusd', 'RLUSD research asset mismatch');
expect(researchRow?.jurisdiction_code === 'JP', 'RLUSD research jurisdiction mismatch');
expect(researchRow?.platform === 'SBI VC Trade' && researchRow?.platform_service === 'VCTRADE', 'RLUSD research platform mismatch');

expect(Array.isArray(records), 'canonical Market Access entrypoint must be an array');
expect(records.length === 8, `PR #359 must contain exactly eight canonical Market Access records, found ${records.length}`);
expect(stablecoins.length === 112, `PR #359 must preserve 112 canonical assets, found ${stablecoins.length}`);
expect(evidence.length === 557, `PR #359 must preserve 557 canonical Evidence identities, found ${evidence.length}`);
expect(evidenceRelations.length === 557, `PR #359 must preserve 557 Evidence Relations, found ${evidenceRelations.length}`);
expect(checkpoint.asset_count === 112, `current checkpoint must preserve 112 assets, found ${checkpoint.asset_count}`);
expect(checkpoint.expected_counts?.market_access_records === 8, `current checkpoint must bind eight Market Access records, found ${checkpoint.expected_counts?.market_access_records}`);

const allIds = new Set(records.map((row) => row.id));
for (const id of priorIds) expect(allIds.has(id), `Pilot 1 record missing or changed: ${id}`);
for (const id of expectedNewIds) expect(allIds.has(id), `Pilot 2 record missing: ${id}`);
expect(records.filter((row) => row.asset_id === 'sog_st_usdc').length === 4, 'Pilot 1 USDC rows must remain exactly four');
expect(records.filter((row) => row.asset_id === 'sog_st_rlusd').length === 4, 'Pilot 2 RLUSD rows must be exactly four');
expect(records.every((row) => ['sog_st_usdc','sog_st_rlusd'].includes(row.asset_id)), 'unrelated asset entered Market Access records');
expect(records.every((row) => row.asset_id !== 'sog_st_jpysc'), 'JPYSC must remain outside Pilot 2');

const ids = new Set();
const logicalKeys = new Set();
const rlusdFunctions = new Set();
for (const row of records) {
  const prefix = row?.id ?? '<missing-id>';
  for (const key of requiredTopLevel) expect(Object.hasOwn(row, key), `${prefix}: missing required property ${key}`);
  for (const key of Object.keys(row)) expect(allowedTopLevel.has(key), `${prefix}: unsupported top-level property ${key}`);
  expect(typeof row.id === 'string' && /^sog_ma_[a-z0-9_]+$/.test(row.id), `${prefix}: invalid ID`);
  expect(!ids.has(row.id), `${prefix}: duplicate ID`);
  ids.add(row.id);
  expect(row.schema_version === '1.0', `${prefix}: schema version mismatch`);
  expect(assetIds.has(row.asset_id), `${prefix}: unknown asset ${row.asset_id}`);
  expect(row.jurisdiction?.country_code === 'JP' && row.jurisdiction?.subdivision_code === null, `${prefix}: jurisdiction outside bounded scope`);
  expect(row.platform?.name === 'SBI VC Trade' && row.platform?.service === 'VCTRADE', `${prefix}: platform/service outside bounded scope`);
  if (row.platform?.organization_id) expect(organizationIds.has(row.platform.organization_id), `${prefix}: unknown platform organization ${row.platform.organization_id}`);
  expect(functionEnum.has(row.function), `${prefix}: invalid function ${row.function}`);
  expect(accessStateEnum.has(row.access_state), `${prefix}: invalid access state ${row.access_state}`);
  expect(datePattern.test(row.effective_from), `${prefix}: invalid effective_from`);
  expect(row.effective_to === null || datePattern.test(row.effective_to), `${prefix}: invalid effective_to`);
  expect(datePattern.test(row.observed_at), `${prefix}: invalid observed_at`);
  expect(datePrecisionEnum.has(row.date_precision), `${prefix}: invalid date precision`);
  expect(networkKindEnum.has(row.network_scope?.kind), `${prefix}: invalid network scope kind`);
  expect(Array.isArray(row.network_scope?.network_ids), `${prefix}: network_ids must be an array`);
  expect(new Set(row.network_scope?.network_ids ?? []).size === (row.network_scope?.network_ids ?? []).length, `${prefix}: duplicate network IDs`);
  expect(customerKindEnum.has(row.customer_scope?.kind), `${prefix}: invalid customer scope kind`);
  expect(Array.isArray(row.conditions), `${prefix}: conditions must be an array`);
  for (const condition of row.conditions ?? []) {
    expect(conditionTypeEnum.has(condition.type), `${prefix}: invalid condition type ${condition.type}`);
    expect(typeof condition.description === 'string' && condition.description.length > 0, `${prefix}: empty condition description`);
  }
  expect(legalRouteEnum.has(row.legal_route?.status), `${prefix}: invalid legal route status`);
  expect(Array.isArray(row.evidence_ids) && row.evidence_ids.length >= 1, `${prefix}: canonical Evidence required`);
  expect(new Set(row.evidence_ids ?? []).size === (row.evidence_ids ?? []).length, `${prefix}: duplicate Evidence IDs`);
  for (const evidenceId of row.evidence_ids ?? []) expect(evidenceById.has(evidenceId), `${prefix}: unknown Evidence ID ${evidenceId}`);
  expect(confidenceEnum.has(row.confidence), `${prefix}: invalid confidence`);
  expect(row.review_status === 'reviewed', `${prefix}: review status must be reviewed`);
  expect(Array.isArray(row.supersedes_record_ids), `${prefix}: supersedes_record_ids must be an array`);

  const logicalKey = [
    row.asset_id,
    row.jurisdiction.country_code,
    row.jurisdiction.subdivision_code ?? '',
    row.platform.name,
    row.platform.service,
    row.function,
    row.effective_from
  ].join('|');
  expect(!logicalKeys.has(logicalKey), `${prefix}: duplicate logical Market Access identity`);
  logicalKeys.add(logicalKey);

  if (row.asset_id === 'sog_st_rlusd') {
    expect(expectedNewIds.has(row.id), `${prefix}: unexpected RLUSD record ID`);
    expect(expectedFunctions.has(row.function), `${prefix}: function outside Pilot 2`);
    expect(!excludedFunctions.has(row.function), `${prefix}: excluded issuer function promoted`);
    expect(!rlusdFunctions.has(row.function), `${prefix}: duplicate RLUSD function row`);
    rlusdFunctions.add(row.function);
    expect(row.effective_from === config.effective_from, `${prefix}: RLUSD effective date mismatch`);
    expect(row.observed_at === config.observed_at, `${prefix}: RLUSD observed date mismatch`);
    expect(row.platform.organization_id === 'sog_org_sbi_vc_trade', `${prefix}: SBI VC Trade organization ID required`);
    expect(row.network_scope.kind === 'specific_networks', `${prefix}: RLUSD network scope must be specific`);
    expect(JSON.stringify(row.network_scope.network_ids) === JSON.stringify(['ethereum']), `${prefix}: RLUSD network scope must be Ethereum only`);
    expect(row.evidence_ids.includes('sog_src_rlusd_japan_launch_sbi_vc_2026'), `${prefix}: SBI RLUSD launch Evidence missing`);
    expect(row.evidence_ids.includes('sog_src_jfsa_electronic_payment_instrument_register_pr356'), `${prefix}: JFSA register Evidence missing`);
    expect(typeof row.notes === 'string' && row.notes.includes('Provider-scoped Japan observation'), `${prefix}: provider-scope disclaimer missing`);
  }
}

expect(rlusdFunctions.size === expectedFunctions.size && [...expectedFunctions].every((value) => rlusdFunctions.has(value)), 'RLUSD rows must cover each approved function exactly once');
const rlusdRows = records.filter((row) => row.asset_id === 'sog_st_rlusd');
const buySell = rlusdRows.find((row) => row.function === 'buy_sell');
expect(buySell?.conditions.some((row) => row.type === 'transaction_limit'), 'RLUSD buy/sell transaction limit missing');
const deposit = rlusdRows.find((row) => row.function === 'deposit');
expect(deposit?.conditions.some((row) => row.type === 'network_support'), 'RLUSD deposit network restriction missing');
const withdrawal = rlusdRows.find((row) => row.function === 'withdrawal');
expect(withdrawal?.conditions.some((row) => row.type === 'withdrawal_limit'), 'RLUSD withdrawal limit missing');
const external = rlusdRows.find((row) => row.function === 'external_wallet_transfer');
expect(external?.access_state === 'restricted_network_scope', 'RLUSD external wallet transfer must remain network-restricted');
expect(!JSON.stringify(rlusdRows).toLowerCase().includes('xrpl support'), 'RLUSD records must not claim VCTRADE XRPL support');

const rlusdEvidence = evidenceById.get('sog_src_rlusd_japan_launch_sbi_vc_2026');
const rlusdScopes = normalizeScope([rlusdEvidence?.claim_scope, ...(rlusdEvidence?.claim_scopes ?? [])].join(' '));
for (const signal of ['buy_sell','deposit','withdrawal','external_wallet_transfer','ethereum_only']) {
  expect(rlusdScopes.includes(signal), `RLUSD canonical Evidence scope missing ${signal}`);
}
const fsaEvidence = evidenceById.get('sog_src_jfsa_electronic_payment_instrument_register_pr356');
expect((fsaEvidence?.stablecoin_ids ?? []).includes('sog_st_rlusd'), 'JFSA register Evidence must target RLUSD');
expect(normalizeScope([fsaEvidence?.claim_scope, ...(fsaEvidence?.claim_scopes ?? [])].join(' ')).includes('rlusd'), 'JFSA register Evidence scope must include RLUSD');

if (failures.length) {
  console.error('PR #359 Market Access Pilot 2 validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  pilot_id: config.pilot_id,
  canonical_assets: stablecoins.length,
  canonical_evidence: evidence.length,
  market_access_records: records.length,
  prior_record_count: priorIds.size,
  promoted_rlusd_record_count: expectedNewIds.size,
  functions: [...rlusdFunctions].sort(),
  reused_evidence_ids: ['sog_src_rlusd_japan_launch_sbi_vc_2026','sog_src_jfsa_electronic_payment_instrument_register_pr356'],
  next_pr: config.next_pr
}, null, 2));
