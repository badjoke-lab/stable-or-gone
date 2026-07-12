import { buildAccessRegulationIndex } from './access-regulation/build-access-regulation-index-pr346.mjs';

const index = buildAccessRegulationIndex();
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(index.status === 'public_canonical_index', 'Access & Regulation index status mismatch');
expect(index.asset_count === 110, `Access & Regulation asset count changed: ${index.asset_count}`);
expect(index.summary?.assets_with_market_access_records === 1, `Expected one asset with Market Access records, found ${index.summary?.assets_with_market_access_records}`);
expect(index.summary?.market_access_record_count === 4, `Expected four Market Access records, found ${index.summary?.market_access_record_count}`);
expect(index.single_composite_score === false, 'Composite score boundary changed');
expect(index.risk_ranking === false, 'Risk ranking boundary changed');

const usdc = index.rows.find((row) => row.asset_id === 'sog_st_usdc');
expect(Boolean(usdc), 'USDC row missing from Access & Regulation index');
expect(usdc?.market_access?.record_state === 'canonical_records_present', 'USDC Market Access record state mismatch');
expect(usdc?.market_access?.record_count === 4, `USDC Market Access count mismatch: ${usdc?.market_access?.record_count}`);

const records = usdc?.market_access?.records ?? [];
const functions = records.map((row) => row.function).sort();
const expectedFunctions = ['buy_sell', 'deposit', 'external_wallet_transfer', 'withdrawal'].sort();
expect(JSON.stringify(functions) === JSON.stringify(expectedFunctions), `USDC Market Access function set mismatch: ${functions.join(', ')}`);
expect(records.every((row) => row.jurisdiction?.country_code === 'JP'), 'USDC Market Access projection leaked another jurisdiction');
expect(records.every((row) => row.platform?.name === 'SBI VC Trade' && row.platform?.service === 'VCTRADE'), 'USDC Market Access projection platform/service mismatch');
expect(records.every((row) => row.effective_from === '2025-03-26'), 'USDC Market Access projection effective date mismatch');
expect(records.every((row) => row.observed_at === '2026-07-10'), 'USDC Market Access projection observed date mismatch');
expect(records.every((row) => Array.isArray(row.conditions) && row.conditions.length >= 1), 'USDC Market Access projection conditions missing');

const otherAssets = index.rows.filter((row) => row.asset_id !== 'sog_st_usdc' && row.market_access?.record_count > 0);
expect(otherAssets.length === 0, `Unexpected Market Access records on other assets: ${otherAssets.map((row) => row.asset_id).join(', ')}`);

const filterByAxis = new Map((index.filters ?? []).map((row) => [row.axis, row.values ?? []]));
const jurisdictionFilter = filterByAxis.get('market_access_jurisdiction') ?? [];
const functionFilter = filterByAxis.get('market_access_function') ?? [];
const platformFilter = filterByAxis.get('market_access_platform') ?? [];
expect(jurisdictionFilter.some((row) => row.value === 'JP' && row.asset_count === 1), 'JP Market Access filter token missing');
expect(expectedFunctions.every((value) => functionFilter.some((row) => row.value === value && row.asset_count === 1)), 'Function filter tokens incomplete');
expect(platformFilter.some((row) => row.value === 'SBI VC Trade' && row.asset_count === 1), 'SBI VC Trade filter token missing');

if (failures.length) {
  console.error('PR #356 Access & Regulation projection validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  asset_count: index.asset_count,
  assets_with_market_access_records: index.summary.assets_with_market_access_records,
  market_access_record_count: index.summary.market_access_record_count,
  usdc_functions: functions,
  jurisdiction_filter: jurisdictionFilter,
  platform_filter: platformFilter,
}, null, 2));
