import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (value, message) => { if (!value) failures.push(message); };

const review = readJson('data/editorial-research/japan-market-access-expansion-review-b1-2026-08-09.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const marketAccess = readJson('data/market-access-records-v1.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const result = readText('docs/roadmap-amendments/2026-08-09-japan-market-access-expansion-review-b1-result.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

expect(review.status === 'reviewed_internal_complete_no_go', 'review status changed');
expect(review.authority_pr === 535, 'authority PR changed');
expect(review.entry_repository_commit === '58cbd7e621794c33fedbc3e263d7f64e9b8a5099', 'review entry commit changed');
expect(review.candidate_asset_platform_service_matrix.length === 3, 'candidate count must remain exactly 3');
expect(review.review_result.decision === 'no_go', 'review result changed');
expect(review.review_result.promotable_asset_platform_service_pairs === 0, 'promotable pair count changed');
expect(review.review_result.promotable_market_access_records === 0, 'promotable Market Access rows changed');
expect(review.review_result.canonical_market_access_records_before === 12, 'pre-review Market Access count changed');
expect(review.review_result.canonical_market_access_records_after === 12, 'post-review Market Access count changed');
expect(review.review_result.canonical_evidence_before === 585 && review.review_result.canonical_evidence_after === 585, 'Evidence no-change boundary changed');
expect(review.review_result.canonical_evidence_relations_before === 585 && review.review_result.canonical_evidence_relations_after === 585, 'Evidence Relation no-change boundary changed');
expect(review.canonical_boundary.canonical_changes_allowed === false, 'canonical mutation enabled');
expect(review.canonical_boundary.public_changes_allowed === false, 'public mutation enabled');
expect(review.canonical_boundary.automatic_promotion === false, 'automatic promotion enabled');
expect(review.official_register_review.registered_electronic_payment_instrument_service_providers === 1, 'official provider count review changed');
expect(JSON.stringify(review.official_register_review.handled_electronic_payment_instruments) === JSON.stringify(['USDC','RLUSD','JPYSC']), 'official handled-instrument review changed');
expect(review.service_intermediary_regime_review.scope_warning.includes('must not be restated as proof that zero intermediaries are registered'), 'intermediary scope warning missing');

const expectedSymbols = ['RLUSD','USDC','JPYSC'];
expect(JSON.stringify(review.candidate_asset_platform_service_matrix.map((x) => x.asset_symbol)) === JSON.stringify(expectedSymbols), 'candidate symbol set/order changed');
for (const candidate of review.candidate_asset_platform_service_matrix) {
  expect(candidate.service === 'BITPOINT', `${candidate.asset_symbol} candidate service changed`);
  expect(candidate.reviewed_disposition === 'no_go', `${candidate.asset_symbol} disposition changed`);
  for (const fn of ['buy_sell','deposit','withdrawal','external_wallet_transfer']) {
    expect(candidate.function_review[fn]?.state === 'not_promotable', `${candidate.asset_symbol} ${fn} became promotable`);
  }
}

expect(marketAccess.length === 12, `canonical Market Access count changed: ${marketAccess.length}`);
expect(checkpoint.counts.evidence === 585, 'canonical Evidence count changed');
expect(checkpoint.counts.evidence_relations === 585, 'canonical Evidence Relation count changed');
expect(checkpoint.counts.market_access_records === 12, 'checkpoint Market Access count changed');
expect(checkpoint.counts.archive_index_count === 463, 'archive recorded count changed');
expect(checkpoint.counts.detail_routes === 422, 'detail route count changed');
expect(checkpoint.counts.metadata_checked_routes === 422, 'metadata route count changed');

for (const text of [agents, roadmap, result]) {
  expect(text.includes('REVIEW GATE'), 'REVIEW GATE boundary missing');
  expect(text.includes('12'), 'Market Access 12 boundary missing');
  expect(text.includes('585'), 'Evidence 585 boundary missing');
}
expect(agents.includes('Japan Market Access Expansion Review Batch 1 — complete no-go'), 'AGENTS does not record completed no-go');
expect(roadmap.includes('promotable Market Access Records: 0'), 'roadmap does not record zero promotable records');
expect(result.includes('No canonical Market Access'), 'result document missing canonical preservation statement');
expect(active === "import './validate-japan-market-access-expansion-review-b1.mjs';", 'active validator wiring changed');

if (failures.length) {
  console.error('Japan Market Access Expansion Review Batch 1 validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Japan Market Access Expansion Review Batch 1 validation passed.');
