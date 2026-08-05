import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const authority = readJson('config/japan-market-access-pilot-3-review-authority-pr520.json');
const transition = readJson('docs/migration/japan-market-access-pilot-3-review-authority-pr520.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const research = readJson('data/editorial-research/japan-stablecoin-market-access-2026.json');
const batch5 = readJson('data/editorial-research/record-growth-batch-5-candidate-audit-pr515.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const marketAccessSpec = readText('docs/market-access-record-spec.md');
const spec = readText('docs/quality/japan-market-access-pilot-3-review-authority-pr520-spec.md');
const amendment = readText('docs/roadmap-amendments/2026-08-05-japan-market-access-pilot-3-review-authority.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const expectedFunctions = ['buy_sell', 'deposit', 'withdrawal', 'external_wallet_transfer'];

expect(authority.status === 'review_authority', 'authority status changed');
expect(JSON.stringify(authority.source_prs) === JSON.stringify([514, 515, 519]), 'source PR chain changed');
expect(authority.production_checkpoint.source_commit === '0648272f4271e68deac0a9603d77392eb7b63a3f', 'production commit changed');
expect(authority.production_checkpoint.public_origin === 'https://www.stableorgone.com', 'public origin changed');
expect(authority.production_checkpoint.canonical_hash === 'sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650', 'canonical hash changed');
expect(authority.production_checkpoint.convergence_attempt === 1, 'convergence result changed');
expect(authority.production_checkpoint.stable_assets === 119, 'stable-asset baseline changed');
expect(authority.production_checkpoint.organizations === 109 && authority.production_checkpoint.relationships === 131, 'identity baseline changed');
expect(authority.production_checkpoint.events === 194, 'event baseline changed');
expect(authority.production_checkpoint.evidence === 584 && authority.production_checkpoint.evidence_relations === 584, 'Evidence baseline changed');
expect(authority.production_checkpoint.deployments === 186, 'deployment baseline changed');
expect(authority.production_checkpoint.market_access_records === 8, 'Market Access baseline changed');
expect(authority.production_checkpoint.detail_routes === 422 && authority.production_checkpoint.metadata_checked_routes === 422, 'route baseline changed');

expect(authority.target.source_research_record_id === 'jp_access_jpysc_sbivc_2026_06_24', 'target research row changed');
expect(authority.target.candidate_id === 'sog_cand_pr515_jpysc', 'target candidate changed');
expect(authority.target.asset_id === 'sog_st_jpysc' && authority.target.asset_symbol === 'JPYSC', 'target asset changed');
expect(authority.target.canonical_asset_present_at_authority_entry === false, 'canonical asset entry state changed');
expect(authority.target.jurisdiction.country_code === 'JP', 'jurisdiction changed');
expect(authority.target.platform.name === 'SBI VC Trade' && authority.target.platform.service === 'VCTRADE', 'platform scope changed');
expect(authority.target.effective_from === '2026-06-24' && authority.target.review_cutoff === '2026-08-05', 'review dates changed');
expect(JSON.stringify(authority.target.functions) === JSON.stringify(expectedFunctions), 'function scope changed');
expect(JSON.stringify(authority.target.excluded_functions) === JSON.stringify(['direct_issuer_mint', 'direct_issuer_redemption']), 'excluded functions changed');
expect(authority.target.excluded_service_families.includes('lending'), 'lending exclusion missing');

expect(authority.decision.authorize_next_pr === 521, 'authorized next PR changed');
expect(authority.decision.review_only === true, 'review-only boundary changed');
expect(authority.decision.canonical_changes_in_pr520 === 0 && authority.decision.public_changes_in_pr520 === 0, 'PR #520 change boundary changed');
expect(authority.decision.market_access_changes_in_pr520 === 0, 'PR #520 Market Access changes enabled');
expect(authority.decision.maximum_new_market_access_records_in_pr521 === 0, 'PR #521 Market Access maximum changed');
expect(authority.decision.new_canonical_asset_allowed_in_pr521 === false, 'new canonical asset enabled');
expect(authority.decision.new_evidence_identity_allowed_in_pr521 === false, 'new Evidence identity enabled');
expect(authority.decision.private_editorial_research_update_allowed_in_pr521 === true, 'private review output disabled');
expect(authority.decision.replacement_asset_allowed === false, 'replacement asset enabled');
expect(authority.decision.automatic_promotion === false, 'automatic promotion enabled');
expect(authority.decision.ranking === false && authority.decision.score === false && authority.decision.recommendation === false, 'ranking or recommendation enabled');
expect(authority.decision.legacy_redirect_changes === 0, 'legacy redirect boundary changed');
expect(authority.decision.later_canonical_promotion_requires_separate_authority_pr === true, 'later authority requirement removed');
expect(authority.decision.required_exit_after_pr521 === 'REVIEW_GATE', 'required exit changed');

expect(authority.known_entry_blocker.code === 'canonical_asset_identity_absent', 'entry blocker changed');
expect(authority.known_entry_blocker.source_contract === 'docs/market-access-record-spec.md', 'entry blocker source changed');
expect(authority.pr521_review_gate.recheck_canonical_asset_prerequisite === true, 'canonical prerequisite recheck missing');
expect(authority.pr521_review_gate.recheck_current_primary_sources === true, 'fresh primary-source review missing');
expect(authority.pr521_review_gate.preserve_future_public_chain_capability_as_future_only === true, 'future capability boundary missing');
expect(authority.pr521_review_gate.exclude_lending_from_market_access_v1 === true, 'lending boundary missing');
expect(authority.pr521_review_gate.no_canonical_or_public_output_change === true, 'canonical/public stop boundary missing');

const researchRow = research.records.find((row) => row.record_id === 'jp_access_jpysc_sbivc_2026_06_24');
expect(Boolean(researchRow), 'JPYSC research row missing');
expect(researchRow?.asset_id === 'sog_st_jpysc', 'research asset id changed');
expect(researchRow?.jurisdiction_code === 'JP', 'research jurisdiction changed');
expect(researchRow?.platform === 'SBI VC Trade' && researchRow?.platform_service === 'VCTRADE', 'research platform changed');
expect(researchRow?.effective_date === '2026-06-24', 'research effective date changed');
expect(researchRow?.functions?.buy_sell === 'available_account_internal', 'research buy/sell boundary changed');
expect(researchRow?.functions?.deposit === 'unavailable_at_reviewed_launch_stage', 'research deposit boundary changed');
expect(researchRow?.functions?.withdrawal === 'unavailable_at_reviewed_launch_stage', 'research withdrawal boundary changed');
expect(researchRow?.functions?.external_wallet_transfer === 'unavailable_at_reviewed_launch_stage', 'research transfer boundary changed');

const batchCandidate = batch5.candidates.find((candidate) => candidate.candidate_id === 'sog_cand_pr515_jpysc');
expect(Boolean(batchCandidate), 'PR #515 JPYSC candidate missing');
expect(batchCandidate?.reviewed_disposition === 'insufficient_current_evidence', 'PR #515 disposition changed');
expect(batchCandidate?.complete_record_feasibility?.complete_record_possible_now === false, 'PR #515 feasibility changed');

expect(checkpoint.counts.assets === 119, 'canonical asset count changed');
expect(checkpoint.counts.organizations === 109 && checkpoint.counts.relationships === 131, 'canonical identity counts changed');
expect(checkpoint.counts.events === 194 && checkpoint.counts.evidence === 584 && checkpoint.counts.evidence_relations === 584, 'canonical event/Evidence counts changed');
expect(checkpoint.counts.deployments === 186 && checkpoint.counts.market_access_records === 8, 'canonical deployment/Market Access counts changed');
expect(checkpoint.counts.detail_routes === 422 && checkpoint.counts.metadata_checked_routes === 422, 'canonical route counts changed');

expect(transition.status === 'reviewed_authority_transition', 'transition status changed');
expect(transition.source_closeout_pr === 519 && transition.source_closeout_merge_commit === '0648272f4271e68deac0a9603d77392eb7b63a3f', 'transition source changed');
expect(transition.source_closeout_production.verified === true && transition.source_closeout_production.run_id === 30969330645, 'production verification changed');
expect(transition.authorized_next.pr === 521 && transition.authorized_next.review_only === true, 'transition next authority changed');
expect(transition.authorized_next.maximum_new_market_access_records === 0, 'transition maximum changed');
expect(transition.authorized_next.new_canonical_asset_allowed === false && transition.authorized_next.new_canonical_evidence_identity_allowed === false, 'transition canonical change enabled');
expect(transition.required_exit_after_pr521 === 'REVIEW_GATE', 'transition exit changed');

expect(marketAccessSpec.includes('canonical asset identity exists'), 'Market Access canonical-asset prerequisite changed');
expect(agents.includes('Repository authority: PR #520 active Japan Market Access Pilot 3 review authority'), 'AGENTS authority missing');
expect(agents.includes('Authorized next review: PR #521 only'), 'AGENTS next PR boundary missing');
expect(agents.includes('Maximum new canonical Market Access Records in PR #521: 0'), 'AGENTS canonical stop boundary missing');
expect(roadmap.includes('Status: PR #520 active Japan Market Access Pilot 3 review authority'), 'roadmap status missing');
expect(roadmap.includes('PR #521 — JPYSC eligibility review only'), 'roadmap next review missing');
expect(spec.includes('PR #520 changes authority only.'), 'spec authority-only boundary missing');
expect(spec.includes('PR #521 is review-only and may add zero canonical Market Access records.'), 'spec review-only boundary missing');
expect(amendment.includes('No replacement asset is allowed.'), 'amendment replacement boundary missing');
expect(active === "import './validate-japan-market-access-pilot-3-review-authority-pr520.mjs';", 'active workstream is not wired to PR #520');

for (const file of [
  'config/japan-market-access-pilot-3-review-authority-pr520.json',
  'docs/quality/japan-market-access-pilot-3-review-authority-pr520-spec.md',
  'docs/migration/japan-market-access-pilot-3-review-authority-pr520.json',
  'docs/roadmap-amendments/2026-08-05-japan-market-access-pilot-3-review-authority.md'
]) expect(fs.existsSync(path.join(root, file)), `required PR #520 file missing: ${file}`);

if (failures.length) {
  console.error('PR #520 Japan Market Access Pilot 3 review-authority validation failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  authority_pr: 520,
  authorized_next_pr: 521,
  target_asset: 'JPYSC',
  target_platform: 'SBI VC Trade / VCTRADE',
  review_functions: expectedFunctions,
  maximum_new_market_access_records_in_pr521: 0,
  canonical_changes_in_pr520: 0,
  public_changes_in_pr520: 0,
  required_exit_after_pr521: 'REVIEW_GATE'
}, null, 2));
