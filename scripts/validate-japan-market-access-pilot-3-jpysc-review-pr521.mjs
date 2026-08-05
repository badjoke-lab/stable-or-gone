import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const contract = readJson('config/japan-market-access-pilot-3-jpysc-review-pr521.json');
const authority = readJson('config/japan-market-access-pilot-3-review-authority-pr520.json');
const review = readJson('data/editorial-research/japan-market-access-pilot-3-jpysc-review-pr521.json');
const coverage = readJson('docs/migration/japan-market-access-pilot-3-jpysc-review-pr521-source-coverage.json');
const duplicate = readJson('docs/migration/japan-market-access-pilot-3-jpysc-review-pr521-duplicate-report.json');
const handoff = readJson('docs/migration/japan-market-access-pilot-3-jpysc-review-pr521-handoff.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const marketAccess = readJson('data/market-access-records-v1.json');
const batchN = readJson('data/stablecoins-batch-n.json');
const evidenceN = readJson('data/evidence-batch-n.json');
const deploymentsN = readJson('data/deployments-batch-n.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const spec = readText('docs/quality/japan-market-access-pilot-3-jpysc-review-pr521-spec.md');
const amendment = readText('docs/roadmap-amendments/2026-08-05-japan-market-access-pilot-3-jpysc-review.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const baseline = loadRegistryV2Baseline(root);
const stablecoins = (baseline.data_groups?.stablecoins ?? []).flatMap((relativePath) => readJson(relativePath));
const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const expectedFunctions = {
  buy_sell: 'account_internal_only',
  deposit: 'unavailable',
  withdrawal: 'unavailable',
  external_wallet_transfer: 'unavailable'
};

expect(contract.status === 'reviewed_decision', 'review contract status changed');
expect(contract.authority_pr === 520 && contract.review_pr === 521, 'authority chain changed');
expect(contract.authority_merge_commit === '196f8e20cd55c9b229c88127afa236dc5060b3fd', 'authority merge commit changed');
expect(contract.authority_production.verified === true && contract.authority_production.run_id === 30975708306, 'authority production checkpoint changed');
expect(contract.authority_production.canonical_hash === 'sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650', 'canonical hash changed');
expect(contract.target.asset_id === 'sog_st_jpysc', 'target asset changed');
expect(contract.target.canonical_asset_present === true && contract.target.canonical_asset_source_pr === 128, 'canonical JPYSC context changed');
expect(contract.target.jurisdiction.country_code === 'JP', 'jurisdiction changed');
expect(contract.target.platform.name === 'SBI VC Trade' && contract.target.platform.service === 'VCTRADE', 'platform scope changed');
expect(contract.target.effective_from === '2026-06-24' && contract.target.observed_at === '2026-08-05', 'review dates changed');

const matrix = Object.fromEntries(contract.reviewed_function_matrix.map((row) => [row.function, row.reviewed_state]));
expect(JSON.stringify(matrix) === JSON.stringify(expectedFunctions), 'reviewed function matrix changed');
expect(contract.reviewed_function_matrix.find((row) => row.function === 'buy_sell')?.network_scope === 'account_internal_only', 'buy/sell network scope changed');
expect(contract.excluded_service_families.includes('lending'), 'lending exclusion missing');

expect(contract.decision.disposition === 'eligible_for_later_separate_authority', 'review disposition changed');
expect(contract.decision.canonical_asset_present === true, 'canonical asset presence changed');
expect(contract.decision.function_matrix_review_complete === true, 'function review completeness changed');
expect(contract.decision.canonical_market_access_promotion_allowed_in_pr521 === false, 'PR #521 canonical promotion enabled');
expect(contract.decision.maximum_new_market_access_records === 0, 'PR #521 record maximum changed');
expect(contract.decision.new_canonical_asset_allowed === false && contract.decision.new_canonical_evidence_identity_allowed === false, 'PR #521 canonical additions enabled');
expect(contract.decision.canonical_changes === 0 && contract.decision.public_changes === 0, 'canonical/public boundary changed');
expect(contract.decision.future_capability_backfill_allowed === false, 'future capability backfill enabled');
expect(contract.decision.country_wide_availability_claim_allowed === false, 'country-wide claim enabled');
expect(contract.decision.automatic_promotion === false, 'automatic promotion enabled');
expect(contract.required_exit === 'REVIEW_GATE', 'required exit changed');
expect(contract.next_recommended_authority === 'jpysc_market_access_pilot_3_implementation', 'next recommended authority changed');
expect(contract.next_recommended_authority_implementation_authorized === false, 'implementation pre-authorized');

expect(authority.decision.authorize_next_pr === 521 && authority.decision.review_only === true, 'PR #520 authority changed');
expect(authority.decision.maximum_new_market_access_records_in_pr521 === 0, 'PR #520 maximum changed');

expect(review.subject.asset_id === 'sog_st_jpysc' && review.subject.canonical_asset_identity_exists === true, 'private canonical context changed');
expect(review.subject.canonical_asset_source_pr === 128, 'private canonical source changed');
expect(review.function_review.buy_sell.state === expectedFunctions.buy_sell, 'private buy/sell state changed');
expect(review.function_review.deposit.state === expectedFunctions.deposit, 'private deposit state changed');
expect(review.function_review.withdrawal.state === expectedFunctions.withdrawal, 'private withdrawal state changed');
expect(review.function_review.external_wallet_transfer.state === expectedFunctions.external_wallet_transfer, 'private transfer state changed');
expect(review.network_review.future_network_context_is_current_capability === false, 'future capability promoted');
expect(review.reviewed_disposition === 'eligible_for_later_separate_authority', 'private disposition changed');
expect(review.promotion_assessment.maximum_new_records === 0, 'private record maximum changed');

expect(coverage.canonical_context.asset_identity_present === true, 'coverage canonical context changed');
expect(coverage.coverage_result.canonical_asset_prerequisite_satisfied === true, 'canonical prerequisite not satisfied');
expect(coverage.coverage_result.four_function_review_complete === true, 'four-function review incomplete');
expect(coverage.coverage_result.eligible_for_later_separate_authority === true, 'later authority eligibility missing');
expect(coverage.coverage_result.canonical_implementation_authorized_in_pr521 === false, 'implementation enabled in PR #521');
expect(coverage.coverage_result.canonical_market_access_records_added === 0, 'coverage reports canonical records');

expect(duplicate.canonical_asset_search.exact_id_match === true, 'canonical JPYSC exact match missing');
expect(duplicate.canonical_asset_search.canonical_identity_present === true, 'canonical identity missing in duplicate report');
expect(duplicate.canonical_market_access_search.matching_records === 0, 'duplicate Market Access record found');
expect(duplicate.canonical_market_access_search.total_records_before === 8 && duplicate.canonical_market_access_search.total_records_after === 8, 'Market Access count changed in duplicate report');
expect(duplicate.result.duplicate_canonical_asset_creation_prevented === true, 'duplicate asset prevention missing');
expect(duplicate.result.canonical_promotion_attempted === false, 'canonical promotion attempted');

expect(handoff.reviewed_result.disposition === 'eligible_for_later_separate_authority', 'handoff disposition changed');
expect(JSON.stringify(handoff.reviewed_result.function_states) === JSON.stringify(expectedFunctions), 'handoff matrix changed');
expect(handoff.reviewed_result.canonical_asset_present === true && handoff.reviewed_result.canonical_asset_source_pr === 128, 'handoff canonical context changed');
expect(handoff.reviewed_result.canonical_market_access_records_added === 0, 'handoff records changed');
expect(handoff.required_next_boundary === 'REVIEW_GATE', 'handoff exit changed');
expect(handoff.next_recommended_authority_implementation_authorized === false, 'handoff implementation pre-authorized');

expect(checkpoint.counts.assets === 119, 'canonical asset count changed');
expect(checkpoint.counts.evidence === 584 && checkpoint.counts.evidence_relations === 584, 'Evidence counts changed');
expect(checkpoint.counts.deployments === 186 && checkpoint.counts.market_access_records === 8, 'deployment/Market Access counts changed');
expect(checkpoint.counts.detail_routes === 422 && checkpoint.counts.metadata_checked_routes === 422, 'route counts changed');
expect(stablecoins.length === 119, 'loaded canonical stablecoin count changed');
expect(stablecoinIds.has('sog_st_jpysc'), 'canonical JPYSC identity missing');
expect(batchN.some((row) => row.id === 'sog_st_jpysc' && row.status === 'limited'), 'canonical JPYSC batch record changed');
expect(evidenceN.some((row) => row.id === 'sog_src_jpysc_launch_sbi_vc_2026'), 'canonical JPYSC launch Evidence missing');
expect(evidenceN.some((row) => row.id === 'sog_src_jpysc_announcement_sbi_2026'), 'canonical JPYSC announcement Evidence missing');
expect(deploymentsN.some((row) => row.id === 'sog_dep_jpysc_ethereum_initial_batch_n' && row.status === 'restricted'), 'canonical JPYSC deployment context changed');
expect(Array.isArray(marketAccess) && marketAccess.length === 8, 'canonical Market Access count changed');
expect(marketAccess.every((row) => row.asset_id !== 'sog_st_jpysc'), 'canonical JPYSC Market Access row was added in PR #521');

expect(agents.includes('Reviewed disposition: eligible_for_later_separate_authority'), 'AGENTS disposition missing');
expect(agents.includes('Canonical JPYSC identity: present since PR #128'), 'AGENTS canonical context missing');
expect(roadmap.includes('eligible_for_later_separate_authority'), 'roadmap disposition missing');
expect(roadmap.includes('canonical identity: present since PR #128'), 'roadmap canonical context missing');
expect(spec.includes('PR #128 added `sog_st_jpysc`'), 'spec canonical correction missing');
expect(amendment.includes('corrected reviewed disposition is `eligible_for_later_separate_authority`'), 'amendment correction missing');
expect(active === "import './validate-japan-market-access-pilot-3-jpysc-review-pr521.mjs';", 'active validator wiring changed');

if (failures.length) {
  console.error('PR #521 JPYSC Market Access review validation failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  authority_pr: 520,
  review_pr: 521,
  disposition: 'eligible_for_later_separate_authority',
  function_states: expectedFunctions,
  loaded_canonical_assets: stablecoins.length,
  canonical_market_access_records_added: 0,
  canonical_assets_added: 0,
  canonical_evidence_identities_added: 0,
  next_recommended_authority: 'jpysc_market_access_pilot_3_implementation',
  required_exit: 'REVIEW_GATE'
}, null, 2));
