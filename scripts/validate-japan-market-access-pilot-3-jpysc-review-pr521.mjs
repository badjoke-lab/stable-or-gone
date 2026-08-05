import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const contract = readJson('config/japan-market-access-pilot-3-jpysc-review-pr521.json');
const authority = readJson('config/japan-market-access-pilot-3-review-authority-pr520.json');
const review = readJson('data/editorial-research/japan-market-access-pilot-3-jpysc-review-pr521.json');
const sourceCoverage = readJson('docs/migration/japan-market-access-pilot-3-jpysc-review-pr521-source-coverage.json');
const duplicateReport = readJson('docs/migration/japan-market-access-pilot-3-jpysc-review-pr521-duplicate-report.json');
const handoff = readJson('docs/migration/japan-market-access-pilot-3-jpysc-review-pr521-handoff.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const marketAccess = readJson('data/market-access-records-v1.json');
const priorResearch = readJson('data/editorial-research/japan-stablecoin-market-access-2026.json');
const batch5 = readJson('data/editorial-research/record-growth-batch-5-candidate-audit-pr515.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const spec = readText('docs/quality/japan-market-access-pilot-3-jpysc-review-pr521-spec.md');
const amendment = readText('docs/roadmap-amendments/2026-08-05-japan-market-access-pilot-3-jpysc-review.md');
const marketAccessSpec = readText('docs/market-access-record-spec.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const expectedFunctions = {
  buy_sell: 'account_internal_only',
  deposit: 'unavailable',
  withdrawal: 'unavailable',
  external_wallet_transfer: 'unavailable'
};

expect(contract.status === 'reviewed_decision', 'review contract status changed');
expect(contract.authority_pr === 520 && contract.review_pr === 521, 'authority chain changed');
expect(contract.authority_merge_commit === '196f8e20cd55c9b229c88127afa236dc5060b3fd', 'authority merge commit changed');
expect(contract.authority_production.verified === true, 'authority production verification missing');
expect(contract.authority_production.run_id === 30975708306, 'authority production run changed');
expect(contract.authority_production.canonical_hash === 'sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650', 'authority canonical hash changed');
expect(contract.authority_production.convergence_attempt === 2, 'authority convergence result changed');

expect(contract.target.source_research_record_id === 'jp_access_jpysc_sbivc_2026_06_24', 'target research row changed');
expect(contract.target.candidate_id === 'sog_cand_pr515_jpysc', 'target candidate changed');
expect(contract.target.proposed_asset_id === 'sog_st_jpysc', 'target asset changed');
expect(contract.target.jurisdiction.country_code === 'JP', 'jurisdiction changed');
expect(contract.target.platform.name === 'SBI VC Trade' && contract.target.platform.service === 'VCTRADE', 'platform scope changed');
expect(contract.target.effective_from === '2026-06-24' && contract.target.observed_at === '2026-08-05', 'review dates changed');

const matrix = Object.fromEntries(contract.reviewed_function_matrix.map((row) => [row.function, row.reviewed_state]));
expect(JSON.stringify(matrix) === JSON.stringify(expectedFunctions), 'reviewed function matrix changed');
expect(contract.reviewed_function_matrix.find((row) => row.function === 'buy_sell')?.network_scope === 'account_internal_only', 'account-internal buy/sell boundary changed');
expect(contract.reviewed_function_matrix.filter((row) => row.function !== 'buy_sell').every((row) => row.current === true), 'current unavailable-state boundary changed');
expect(contract.excluded_service_families.includes('lending'), 'lending exclusion missing');

expect(contract.decision.disposition === 'blocked_canonical_asset_identity_absent', 'review disposition changed');
expect(contract.decision.canonical_asset_present === false, 'canonical asset presence changed');
expect(contract.decision.canonical_market_access_promotion_allowed === false, 'canonical Market Access promotion enabled');
expect(contract.decision.maximum_new_market_access_records === 0, 'Market Access record maximum changed');
expect(contract.decision.new_canonical_asset_allowed === false, 'new canonical asset enabled');
expect(contract.decision.new_canonical_evidence_identity_allowed === false, 'new canonical Evidence identity enabled');
expect(contract.decision.canonical_changes === 0 && contract.decision.public_changes === 0, 'canonical/public change boundary changed');
expect(contract.decision.future_capability_backfill_allowed === false, 'future capability backfill enabled');
expect(contract.decision.country_wide_availability_claim_allowed === false, 'country-wide claim enabled');
expect(contract.decision.replacement_asset_allowed === false, 'replacement asset enabled');
expect(contract.decision.automatic_promotion === false, 'automatic promotion enabled');
expect(contract.decision.ranking === false && contract.decision.score === false && contract.decision.recommendation === false, 'ranking or recommendation enabled');
expect(contract.required_exit === 'REVIEW_GATE', 'required exit changed');
expect(contract.next_planned_lane_implementation_authorized === false, 'next lane implementation pre-authorized');

expect(authority.decision.authorize_next_pr === 521, 'PR #520 next PR changed');
expect(authority.decision.review_only === true, 'PR #520 review-only boundary changed');
expect(authority.decision.maximum_new_market_access_records_in_pr521 === 0, 'PR #520 maximum changed');
expect(authority.decision.new_canonical_asset_allowed_in_pr521 === false, 'PR #520 canonical asset boundary changed');
expect(authority.decision.new_evidence_identity_allowed_in_pr521 === false, 'PR #520 Evidence boundary changed');

expect(review.status === 'reviewed_internal_complete', 'private review status changed');
expect(review.subject.canonical_asset_identity_exists === false, 'private review canonical identity state changed');
expect(review.function_review.buy_sell.state === expectedFunctions.buy_sell, 'private buy/sell state changed');
expect(review.function_review.deposit.state === expectedFunctions.deposit, 'private deposit state changed');
expect(review.function_review.withdrawal.state === expectedFunctions.withdrawal, 'private withdrawal state changed');
expect(review.function_review.external_wallet_transfer.state === expectedFunctions.external_wallet_transfer, 'private transfer state changed');
expect(review.network_review.future_network_context_is_current_capability === false, 'future network context promoted to current');
expect(review.reviewed_disposition === 'blocked_canonical_asset_identity_absent', 'private review disposition changed');
expect(review.promotion_assessment.maximum_new_records === 0, 'private review maximum changed');

expect(sourceCoverage.coverage_result.four_function_review_complete === true, 'source coverage incomplete');
expect(sourceCoverage.coverage_result.canonical_promotion_evidence_complete === false, 'canonical promotion coverage incorrectly complete');
expect(sourceCoverage.coverage_result.primary_blocker === 'canonical_asset_identity_absent', 'source coverage blocker changed');
expect(sourceCoverage.coverage_result.canonical_market_access_records_added === 0, 'source coverage records added');
expect(sourceCoverage.excluded_sources.some((row) => row.reason.includes('lending is outside Market Access Record v1')), 'lending source exclusion missing');

expect(duplicateReport.canonical_asset_search.exact_id_match === false, 'duplicate report canonical id match changed');
expect(duplicateReport.canonical_market_access_search.matching_records === 0, 'duplicate Market Access match changed');
expect(duplicateReport.canonical_market_access_search.total_records_before === 8 && duplicateReport.canonical_market_access_search.total_records_after === 8, 'duplicate report count changed');
expect(duplicateReport.result.canonical_source_identity_changes === 0, 'canonical source identity changed');
expect(duplicateReport.result.canonical_promotion_attempted === false, 'canonical promotion attempted');

expect(handoff.reviewed_result.disposition === 'blocked_canonical_asset_identity_absent', 'handoff disposition changed');
expect(JSON.stringify(handoff.reviewed_result.function_states) === JSON.stringify(expectedFunctions), 'handoff function matrix changed');
expect(handoff.reviewed_result.canonical_market_access_records_added === 0, 'handoff Market Access records changed');
expect(handoff.reviewed_result.canonical_evidence_identities_added === 0, 'handoff Evidence changes changed');
expect(handoff.required_next_boundary === 'REVIEW_GATE', 'handoff boundary changed');
expect(handoff.next_planned_lane_implementation_authorized === false, 'handoff next lane pre-authorized');

expect(checkpoint.counts.assets === 119, 'canonical asset count changed');
expect(checkpoint.counts.organizations === 109 && checkpoint.counts.relationships === 131, 'canonical identity counts changed');
expect(checkpoint.counts.events === 194 && checkpoint.counts.evidence === 584 && checkpoint.counts.evidence_relations === 584, 'canonical event/Evidence counts changed');
expect(checkpoint.counts.deployments === 186 && checkpoint.counts.market_access_records === 8, 'canonical deployment/Market Access counts changed');
expect(checkpoint.counts.detail_routes === 422 && checkpoint.counts.metadata_checked_routes === 422, 'canonical route counts changed');
expect(Array.isArray(marketAccess) && marketAccess.length === 8, 'canonical Market Access count changed');
expect(marketAccess.every((row) => row.asset_id !== 'sog_st_jpysc'), 'canonical JPYSC Market Access row was added');

const stablecoinFiles = fs.readdirSync(path.join(root, 'data')).filter((name) => /^stablecoins.*\.json$/.test(name));
const stablecoinCorpus = stablecoinFiles.map((name) => readText(path.join('data', name))).join('\n');
expect(!stablecoinCorpus.includes('sog_st_jpysc'), 'canonical JPYSC asset identity was added');

const priorRow = priorResearch.records.find((row) => row.record_id === 'jp_access_jpysc_sbivc_2026_06_24');
expect(Boolean(priorRow), 'prior JPYSC research row missing');
expect(priorRow?.functions?.buy_sell === 'available_account_internal', 'prior research buy/sell boundary changed');
expect(priorRow?.functions?.deposit === 'unavailable_at_reviewed_launch_stage', 'prior research deposit boundary changed');
const candidate = batch5.candidates.find((row) => row.candidate_id === 'sog_cand_pr515_jpysc');
expect(candidate?.reviewed_disposition === 'insufficient_current_evidence', 'PR #515 JPYSC disposition changed');

expect(marketAccessSpec.includes('canonical asset identity exists'), 'canonical asset prerequisite changed');
expect(agents.includes('Repository authority: PR #521 active Japan Market Access Pilot 3 JPYSC review'), 'AGENTS authority missing');
expect(agents.includes('Reviewed disposition: blocked_canonical_asset_identity_absent'), 'AGENTS disposition missing');
expect(agents.includes('Canonical Market Access Records added: 0'), 'AGENTS zero-record boundary missing');
expect(roadmap.includes('Status: PR #521 active Japan Market Access Pilot 3 JPYSC review'), 'roadmap status missing');
expect(roadmap.includes('buy_sell: account_internal_only'), 'roadmap function matrix missing');
expect(spec.includes('blocked_canonical_asset_identity_absent'), 'spec disposition missing');
expect(amendment.includes('Repository authority returns to `REVIEW GATE` after PR #521.'), 'amendment exit missing');
expect(active === "import './validate-japan-market-access-pilot-3-jpysc-review-pr521.mjs';", 'active workstream is not wired to PR #521');

for (const file of [
  'config/japan-market-access-pilot-3-jpysc-review-pr521.json',
  'data/editorial-research/japan-market-access-pilot-3-jpysc-review-pr521.json',
  'docs/migration/japan-market-access-pilot-3-jpysc-review-pr521-source-coverage.json',
  'docs/migration/japan-market-access-pilot-3-jpysc-review-pr521-duplicate-report.json',
  'docs/migration/japan-market-access-pilot-3-jpysc-review-pr521-handoff.json',
  'docs/quality/japan-market-access-pilot-3-jpysc-review-pr521-spec.md',
  'docs/roadmap-amendments/2026-08-05-japan-market-access-pilot-3-jpysc-review.md'
]) expect(fs.existsSync(path.join(root, file)), `required PR #521 file missing: ${file}`);

if (failures.length) {
  console.error('PR #521 JPYSC Market Access review validation failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  authority_pr: 520,
  review_pr: 521,
  disposition: 'blocked_canonical_asset_identity_absent',
  function_states: expectedFunctions,
  canonical_market_access_records_added: 0,
  canonical_assets_added: 0,
  canonical_evidence_identities_added: 0,
  required_exit: 'REVIEW_GATE'
}, null, 2));
