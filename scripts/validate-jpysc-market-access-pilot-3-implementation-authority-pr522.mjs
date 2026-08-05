import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const authority = readJson('config/jpysc-market-access-pilot-3-implementation-authority-pr522.json');
const transition = readJson('docs/migration/jpysc-market-access-pilot-3-implementation-authority-pr522.json');
const review = readJson('config/japan-market-access-pilot-3-jpysc-review-pr521.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const marketAccess = readJson('data/market-access-records-v1.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const spec = readText('docs/quality/jpysc-market-access-pilot-3-implementation-authority-pr522-spec.md');
const amendment = readText('docs/roadmap-amendments/2026-08-05-jpysc-market-access-pilot-3-implementation-authority.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const expected = [
  ['sog_ma_jpysc_jp_sbivc_vctrade_buy_sell_20260624','buy_sell','account_internal_only','account_internal_only'],
  ['sog_ma_jpysc_jp_sbivc_vctrade_deposit_20260624','deposit','unavailable','not_applicable'],
  ['sog_ma_jpysc_jp_sbivc_vctrade_withdrawal_20260624','withdrawal','unavailable','not_applicable'],
  ['sog_ma_jpysc_jp_sbivc_vctrade_external_wallet_transfer_20260624','external_wallet_transfer','unavailable','not_applicable']
];

expect(authority.status === 'implementation_authority', 'authority status changed');
expect(authority.authority_pr === 522 && authority.authorized_implementation_pr === 523, 'authorized PR chain changed');
expect(authority.source_review_pr === 521 && authority.source_review_merge_commit === 'c29c63de22bda81572d040b972539a7d4c735bd8', 'source review checkpoint changed');
expect(authority.source_review_production.verified === true && authority.source_review_production.run_id === 30976964428, 'production verification changed');
expect(authority.source_review_production.canonical_hash === 'sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650', 'canonical hash changed');
expect(authority.source_review_production.convergence_attempt === 1, 'production convergence changed');
expect(authority.target.asset_id === 'sog_st_jpysc' && authority.target.canonical_asset_present === true, 'target asset changed');
expect(authority.target.jurisdiction.country_code === 'JP', 'jurisdiction changed');
expect(authority.target.platform.organization_id === 'sog_org_sbi_vc_trade' && authority.target.platform.service === 'VCTRADE', 'platform changed');
expect(authority.target.effective_from === '2026-06-24' && authority.target.observed_at === '2026-08-05', 'dates changed');
expect(JSON.stringify(authority.target.records.map((row) => [row.id,row.function,row.access_state,row.network_scope_kind])) === JSON.stringify(expected), 'exact record matrix changed');

expect(authority.evidence_authority.maximum_new_evidence_identities === 1, 'Evidence identity maximum changed');
expect(authority.evidence_authority.new_evidence[0]?.id === 'sog_src_jpysc_sbivc_current_product_pr523', 'new Evidence id changed');
expect(authority.evidence_authority.new_evidence[0]?.url === 'https://www.sbivc.co.jp/jpysc', 'new Evidence URL changed');
expect(authority.evidence_authority.existing_jfsa_evidence_scope_extension.evidence_id === 'sog_src_jfsa_electronic_payment_instrument_register_pr356', 'JFSA Evidence target changed');
expect(authority.evidence_authority.current_trading_page_role === 'private_review_support_only', 'trading-page boundary changed');

const counts = authority.count_transition;
for (const [key, value] of Object.entries({stable_assets:[119,119],organizations:[109,109],relationships:[131,131],events:[194,194],evidence:[584,585],evidence_relations:[584,585],deployments:[186,186],market_access_records:[8,12],archive_recorded:[462,463],archive_not_recorded:[122,122],detail_routes:[422,422],metadata_checked_routes:[422,422]})) {
  expect(JSON.stringify(counts[key]) === JSON.stringify(value), `${key} transition changed`);
}
expect(authority.implementation_boundary.exact_new_market_access_records === 4, 'record addition boundary changed');
expect(authority.implementation_boundary.exact_new_evidence_identities === 1, 'Evidence addition boundary changed');
expect(authority.implementation_boundary.exact_existing_evidence_scope_extensions === 1, 'Evidence scope-extension boundary changed');
expect(authority.implementation_boundary.new_assets === 0 && authority.implementation_boundary.new_organizations === 0 && authority.implementation_boundary.new_events === 0 && authority.implementation_boundary.new_deployments === 0, 'unrelated canonical additions enabled');
expect(authority.implementation_boundary.new_routes === 0 && authority.implementation_boundary.ui_changes === 0 && authority.implementation_boundary.schema_changes === 0, 'route/UI/schema changes enabled');
expect(authority.implementation_boundary.future_capability_backfill === false && authority.implementation_boundary.lending_as_access_evidence === false, 'future or lending inference enabled');
expect(authority.implementation_boundary.required_exit_after_pr523 === 'REVIEW_GATE', 'required exit changed');

expect(review.decision.disposition === 'eligible_for_later_separate_authority', 'PR #521 eligibility changed');
expect(review.decision.canonical_asset_present === true && review.decision.function_matrix_review_complete === true, 'PR #521 prerequisites changed');
expect(checkpoint.counts.assets === 119 && checkpoint.counts.evidence === 584 && checkpoint.counts.evidence_relations === 584, 'authority-entry canonical counts changed');
expect(checkpoint.counts.market_access_records === 8 && checkpoint.counts.detail_routes === 422 && checkpoint.counts.metadata_checked_routes === 422, 'authority-entry access or route counts changed');
expect(Array.isArray(marketAccess) && marketAccess.length === 8 && marketAccess.every((row) => row.asset_id !== 'sog_st_jpysc'), 'authority-entry Market Access state changed');

expect(transition.authorized_next.pr === 523 && transition.authorized_next.exact_new_market_access_records === 4, 'transition target changed');
expect(transition.authorized_next.evidence_count_after === 585 && transition.authorized_next.market_access_count_after === 12, 'transition after-counts changed');
expect(transition.required_exit_after_pr523 === 'REVIEW_GATE', 'transition exit changed');
expect(agents.includes('Repository authority: PR #522 active JPYSC Market Access implementation authority'), 'AGENTS authority missing');
expect(agents.includes('Authorized implementation: PR #523 only'), 'AGENTS PR boundary missing');
expect(agents.includes('Market Access Records: 8 -> 12'), 'AGENTS count transition missing');
expect(roadmap.includes('Status: PR #522 active JPYSC Market Access implementation authority'), 'roadmap status missing');
expect(roadmap.includes('PR #523 — exactly four JPYSC Market Access records'), 'roadmap implementation target missing');
expect(spec.includes('PR #522 changes authority only.'), 'spec authority-only boundary missing');
expect(amendment.includes('Evidence: 584 -> 585'), 'amendment Evidence transition missing');
expect(active === "import './validate-jpysc-market-access-pilot-3-implementation-authority-pr522.mjs';", 'active workstream wiring changed');

if (failures.length) {
  console.error('PR #522 JPYSC implementation-authority validation failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

console.log(JSON.stringify({ok:true,authority_pr:522,authorized_pr:523,asset_id:'sog_st_jpysc',new_market_access_records:4,new_evidence_identities:1,market_access_transition:[8,12],evidence_transition:[584,585],detail_routes:[422,422],required_exit:'REVIEW_GATE'}, null, 2));
