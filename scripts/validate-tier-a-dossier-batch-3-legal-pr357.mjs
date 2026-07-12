import fs from 'node:fs';
import { loadStatsInput } from './stats/load-stats-input.mjs';

const input = loadStatsInput(process.cwd());
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const legalById = new Map(input.legal_profiles.map((row) => [row.id, row]));
const evidenceById = new Map(input.evidence.map((row) => [row.id, row]));
const profileById = new Map(input.profiles.map((row) => [row.id, row]));

function requireEvidence(id, assetId, requiredScopes = []) {
  const row = evidenceById.get(id);
  expect(Boolean(row), `${assetId}: missing Evidence ${id}`);
  if (!row) return null;
  const stablecoinIds = new Set([row.stablecoin_id, ...(row.stablecoin_ids ?? [])].filter(Boolean));
  expect(stablecoinIds.has(assetId), `${assetId}: Evidence ${id} does not reference the asset`);
  const scopes = new Set([row.claim_scope, ...(row.claim_scopes ?? [])].filter(Boolean));
  for (const scope of requiredScopes) expect(scopes.has(scope), `${assetId}: Evidence ${id} missing claim scope ${scope}`);
  return row;
}

function legal(id) {
  const row = legalById.get(id);
  expect(Boolean(row), `${id}: legal profile missing`);
  return row;
}

const fei = legal('sog_st_fei');
if (fei) {
  expect(fei.classifications?.length === 1, 'FEI: expected one legal classification');
  const classification = fei.classifications?.[0];
  expect(classification?.classification === 'protocol_asset', 'FEI: classification must be protocol_asset');
  expect(classification?.effective_from === '2021-04-03', 'FEI: legal classification start must match launch');
  expect(classification?.effective_to === '2022-09-22', 'FEI: legal classification end must match reviewed final-redemption package');
  expect(classification?.confidence === 'high', 'FEI: legal classification confidence must be high');
  expect(fei.holder_claim_type === 'protocol_redemption_right', 'FEI: holder claim must be protocol_redemption_right');
  expect(fei.claim_against_organization_ids?.length === 0, 'FEI: final redemption must not be converted into a corporate claim');
  expect(fei.reserve_ownership === 'protocol_controlled', 'FEI: reserve ownership must be protocol_controlled');
  expect(fei.reserve_segregation === 'operationally_separate', 'FEI: reserve segregation must remain operational, not legal');
  expect(fei.bankruptcy_remoteness === 'not_applicable', 'FEI: bankruptcy remoteness must be not_applicable');
  expect(fei.notes?.includes('not a direct corporate claim'), 'FEI: direct-corporate-claim boundary note missing');
  requireEvidence('sog_src_fei_intro_batch_a', 'sog_st_fei', ['fei_initial_design_and_protocol_controlled_value']);
  requireEvidence('sog_src_fei_v2_batch_a', 'sog_st_fei', ['fei_v2_reserve_and_redemption_design']);
  requireEvidence('sog_src_fei_tip121c_execution_2022', 'sog_st_fei', ['final_redemption_context']);
}

const mim = legal('sog_st_mim');
if (mim) {
  expect(mim.classifications?.length === 1, 'MIM: expected one legal classification');
  const classification = mim.classifications?.[0];
  expect(classification?.classification === 'protocol_asset', 'MIM: classification must be protocol_asset');
  expect(classification?.effective_from === '2021-05-05', 'MIM: legal classification start must match reviewed introduction');
  expect(classification?.effective_to === null, 'MIM: legal classification must remain open-ended');
  expect(classification?.confidence === 'high', 'MIM: legal classification confidence must be high');
  expect(mim.holder_claim_type === 'no_direct_claim', 'MIM: holders must not be recorded as having a direct organization claim');
  expect(mim.claim_against_organization_ids?.length === 0, 'MIM: claim-against organization list must remain empty');
  expect(mim.reserve_ownership === 'protocol_controlled', 'MIM: collateral accounting must be protocol_controlled');
  expect(mim.reserve_segregation === 'operationally_separate', 'MIM: segregation must be operational, not legal');
  expect(mim.bankruptcy_remoteness === 'not_applicable', 'MIM: bankruptcy remoteness must be not_applicable');
  expect(mim.notes?.includes('not a legal segregation or safety conclusion'), 'MIM: legal-segregation boundary note missing');
  requireEvidence('sog_src_mim_docs_batch_a', 'sog_st_mim', ['mim_protocol_design_and_collateralized_borrowing']);
  requireEvidence('sog_src_mim_tokenomics_batch_a', 'sog_st_mim', ['mim_peg_contract_and_multichain_context']);
}

const husd = legal('sog_st_husd');
if (husd) {
  expect(husd.classifications?.length === 1, 'HUSD: expected one legal classification');
  const classification = husd.classifications?.[0];
  expect(classification?.classification === 'fiat_backed_stablecoin', 'HUSD: classification must be fiat_backed_stablecoin');
  expect(classification?.confidence === 'medium', 'HUSD: historical legal classification confidence must remain medium');
  expect(husd.holder_claim_type === 'direct_claim_on_issuer', 'HUSD: historical holder claim must be direct_claim_on_issuer');
  expect(JSON.stringify(husd.claim_against_organization_ids) === JSON.stringify(['sog_issuer_stable_universal']), 'HUSD: claim must reference Stable Universal only');
  expect(husd.reserve_ownership === 'issuer_owned_for_holders', 'HUSD: historical reserve ownership mismatch');
  expect(husd.reserve_segregation === 'operationally_separate', 'HUSD: reserve-account separation must remain operational');
  expect(husd.bankruptcy_remoteness === 'not_established', 'HUSD: bankruptcy remoteness must not be inferred');
  expect(husd.notes?.includes('does not establish current reserve custody'), 'HUSD: current-state boundary note missing');
  requireEvidence('sog_src_husd_background_batch_d', 'sog_st_husd', ['historical_entity_and_issuer', 'redemption_claim']);
  requireEvidence('sog_src_husd_legal_attestation_status_2026', 'sog_st_husd', ['reserve_account_language', 'source_no_longer_public']);
}

const husdProfile = profileById.get('sog_st_husd');
expect(Boolean(husdProfile), 'HUSD: stablecoin profile missing');
if (husdProfile) {
  const redemption = husdProfile.redemption_profile;
  expect(redemption?.status === 'unknown', 'HUSD: current redemption status must remain unknown');
  expect(redemption?.retail_access === 'unknown_or_unavailable', 'HUSD: retail redemption access must remain unresolved');
  expect(redemption?.institutional_access === 'unknown_or_unavailable', 'HUSD: institutional redemption access must remain unresolved');
  expect(redemption?.minimum_amount_text === 'Unknown.', 'HUSD: minimum amount must remain explicitly unknown');
  expect(redemption?.redemption_url === null, 'HUSD: no current redemption URL may be invented');
  expect(redemption?.confidence === 'medium', 'HUSD: historical redemption context confidence must be medium');
  expect(redemption?.evidence_ids?.includes('sog_src_husd_background_batch_d'), 'HUSD: historical issuer Evidence missing from redemption profile');
  expect(redemption?.evidence_ids?.includes('sog_src_husd_legal_attestation_status_2026'), 'HUSD: reserve-account analysis missing from redemption profile');
}

const marketAccess = JSON.parse(fs.readFileSync('data/market-access-records-v1.json', 'utf8'));
expect(marketAccess.length === 4, `PR #357 must preserve four Market Access Records, found ${marketAccess.length}`);

if (failures.length) {
  console.error('PR #357 Tier A legal-profile validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  legal_profiles_deepened: ['sog_st_fei', 'sog_st_husd', 'sog_st_mim'],
  fei_holder_claim_type: fei?.holder_claim_type,
  husd_holder_claim_type: husd?.holder_claim_type,
  husd_current_redemption_status: husdProfile?.redemption_profile?.status,
  mim_holder_claim_type: mim?.holder_claim_type,
  market_access_record_count: marketAccess.length
}, null, 2));
