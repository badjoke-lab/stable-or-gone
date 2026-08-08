import fs from 'node:fs';
import path from 'node:path';

// Revalidated against current main after the production-domain migration completion.
const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const authority = readJson('config/jpysc-market-access-pilot-3-implementation-authority-pr522.json');
const marketAccess = readJson('data/market-access-records-v1.json');
const evidence = readJson('data/evidence-pr523-jpysc-market-access.json');
const pilotOneEvidence = readJson('data/evidence-pr356-market-access-pilot-1.json');
const evidenceLoader = readText('src/lib/data/post351Evidence.ts');

const expected = new Map([
  ['sog_ma_jpysc_jp_sbivc_vctrade_buy_sell_20260624',['buy_sell','account_internal_only','account_internal_only']],
  ['sog_ma_jpysc_jp_sbivc_vctrade_deposit_20260624',['deposit','unavailable','not_applicable']],
  ['sog_ma_jpysc_jp_sbivc_vctrade_withdrawal_20260624',['withdrawal','unavailable','not_applicable']],
  ['sog_ma_jpysc_jp_sbivc_vctrade_external_wallet_transfer_20260624',['external_wallet_transfer','unavailable','not_applicable']]
]);

expect(authority.authority_pr === 522 && authority.authorized_implementation_pr === 523, 'authority chain changed');
expect(Array.isArray(marketAccess) && marketAccess.length === 12, 'Market Access total must be 12');
const rows = marketAccess.filter((row) => row.asset_id === 'sog_st_jpysc');
expect(rows.length === 4, 'exactly four JPYSC Market Access records required');
for (const row of rows) {
  const wanted = expected.get(row.id);
  expect(Boolean(wanted), `unexpected JPYSC record ${row.id}`);
  if (!wanted) continue;
  expect(row.function === wanted[0], `${row.id} function changed`);
  expect(row.access_state === wanted[1], `${row.id} access state changed`);
  expect(row.network_scope?.kind === wanted[2], `${row.id} network scope changed`);
  expect(row.effective_from === '2026-06-24' && row.observed_at === '2026-08-05', `${row.id} dates changed`);
  expect(row.jurisdiction?.country_code === 'JP', `${row.id} jurisdiction changed`);
  expect(row.platform?.organization_id === 'sog_org_sbi_vc_trade' && row.platform?.service === 'VCTRADE', `${row.id} platform changed`);
  expect(row.confidence === 'high' && row.review_status === 'reviewed', `${row.id} review state changed`);
  expect(row.evidence_ids?.includes('sog_src_jpysc_sbivc_current_product_pr523'), `${row.id} missing current-product Evidence`);
  expect(row.evidence_ids?.includes('sog_src_jfsa_electronic_payment_instrument_register_pr356'), `${row.id} missing JFSA Evidence`);
}
expect([...expected.keys()].every((id) => rows.some((row) => row.id === id)), 'authorized JPYSC record set incomplete');
expect(marketAccess.filter((row) => row.asset_id === 'sog_st_usdc').length === 4, 'USDC Pilot 1 records changed');
expect(marketAccess.filter((row) => row.asset_id === 'sog_st_rlusd').length === 4, 'RLUSD Pilot 2 records changed');

expect(Array.isArray(evidence) && evidence.length === 1, 'exactly one new Evidence identity required');
expect(evidence[0]?.id === 'sog_src_jpysc_sbivc_current_product_pr523', 'new Evidence identity changed');
expect(evidence[0]?.url === 'https://www.sbivc.co.jp/jpysc', 'new Evidence URL changed');
expect(evidence[0]?.stablecoin_id === 'sog_st_jpysc', 'new Evidence asset changed');
expect(evidence[0]?.source_type === 'official_product_page', 'new Evidence type changed');
expect(evidence[0]?.archived_url === 'https://web.archive.org/web/*/https://www.sbivc.co.jp/jpysc', 'archive target changed');

const jfsa = pilotOneEvidence.find((row) => row.id === 'sog_src_jfsa_electronic_payment_instrument_register_pr356');
expect(Boolean(jfsa), 'JFSA Evidence missing');
expect(jfsa?.stablecoin_ids?.includes('sog_st_usdc'), 'JFSA USDC scope lost');
expect(jfsa?.stablecoin_ids?.includes('sog_st_rlusd'), 'JFSA RLUSD scope lost');
expect(jfsa?.stablecoin_ids?.includes('sog_st_jpysc'), 'JFSA JPYSC scope missing');
expect(jfsa?.claim_scopes?.includes('JPYSC listed among electronic payment instruments handled by SBI VC Trade'), 'JFSA JPYSC claim scope missing');
expect(evidenceLoader.includes("evidence-pr523-jpysc-market-access.json"), 'new Evidence file not loaded');
expect(!JSON.stringify(marketAccess).includes('https://www.sbivc.co.jp/services/crypto/jpysc'), 'private trading page leaked into canonical records');
expect(!rows.some((row) => row.network_scope?.network_ids?.length), 'current JPYSC records must not assert transfer networks');

if (failures.length) {
  console.error('PR #523 JPYSC Market Access implementation validation failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

console.log(JSON.stringify({ok:true,implementation_pr:523,asset_id:'sog_st_jpysc',market_access_records:12,new_records:4,new_evidence:1,required_exit:'REVIEW_GATE'}, null, 2));
