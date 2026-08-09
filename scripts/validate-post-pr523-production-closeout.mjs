import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/post-pr523-production-closeout.json');
const closeout = readJson('docs/migration/post-pr523-production-closeout.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const review = readJson('docs/migration/current-review-checkpoint.json');
const stats = readJson('docs/migration/current-stats-history-checkpoint.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const readme = readText('README.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const expected = config.expected_counts;
const productionCommit = '77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da';
const productionHash = 'sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa';

expect(config.work_item === 'post_pr523_production_closeout', 'closeout work item changed');
expect(config.market_access_pr === 523 && config.market_access_authority_pr === 522 && config.source_review_pr === 521, 'PR523 authority lineage changed');
expect(config.exit_boundary === 'REVIEW_GATE' && config.later_lane_authorized === false, 'review-gate boundary changed');
expect(config.canonical_changes_allowed === false && config.public_changes_allowed === false, 'closeout mutation boundary changed');
expect(config.production_commit === productionCommit && config.merge_commit === productionCommit, 'production commit changed');
expect(config.production_canonical_hash === productionHash, 'production canonical hash changed');
expect(config.production_canonical_file_count === 466, 'production canonical file count changed');
expect(config.convergence_attempt === 2, 'production parity convergence changed');
expect(config.provenance_convergence_attempt === 3, 'production provenance convergence changed');

expect(closeout.status === 'production_verified_closeout', 'closeout status changed');
expect(closeout.production_commit === productionCommit, 'closeout production commit mismatch');
expect(closeout.production.canonical_hash === productionHash, 'closeout production hash mismatch');
expect(closeout.production.canonical_file_count === 466, 'closeout canonical file count mismatch');
expect(closeout.production.convergence_attempt === 2, 'closeout parity convergence changed');
expect(closeout.production.provenance_convergence_attempt === 3, 'closeout provenance convergence changed');
expect(closeout.repository_authority === 'REVIEW_GATE' && closeout.later_lane_authorized === false, 'closeout repository authority changed');
expect(closeout.pr523_result.asset === 'sog_st_jpysc', 'PR523 asset changed');
expect(closeout.pr523_result.buy_sell === 'account_internal_only', 'PR523 buy/sell state changed');
expect(closeout.pr523_result.deposit === 'unavailable', 'PR523 deposit state changed');
expect(closeout.pr523_result.withdrawal === 'unavailable', 'PR523 withdrawal state changed');
expect(closeout.pr523_result.external_wallet_transfer === 'unavailable', 'PR523 external-wallet state changed');

expect(checkpoint.counts.assets === expected.assets, 'asset count changed');
expect(checkpoint.counts.organizations === expected.organizations, 'organization count changed');
expect(checkpoint.counts.relationships === expected.relationships, 'relationship count changed');
expect(checkpoint.counts.events === expected.events, 'event count changed');
expect(checkpoint.counts.evidence === expected.evidence, 'Evidence count changed');
expect(checkpoint.counts.evidence_relations === expected.evidence_relations, 'Evidence Relation count changed');
expect(checkpoint.counts.deployments === expected.deployments, 'deployment count changed');
expect(checkpoint.counts.market_access_records === expected.market_access_records, 'Market Access count changed');
expect(checkpoint.counts.archive_index_count === expected.archive_recorded, 'archive-recorded count changed');
expect(checkpoint.counts.archive_not_recorded_count === expected.archive_not_recorded, 'archive-not-recorded count changed');
expect(checkpoint.counts.detail_routes === expected.detail_routes, 'detail route count changed');
expect(checkpoint.counts.metadata_checked_routes === expected.metadata_checked_routes, 'metadata route count changed');

expect(review.source_pr === 523 && review.authority_pr === 522 && review.exit_boundary === 'REVIEW_GATE', 'PR523 review checkpoint changed');
expect(stats.market_access_pr === 523 && stats.authority_pr === 522 && stats.asset_count === 119, 'PR523 statistics checkpoint changed');

for (const text of [agents, roadmap, readme]) {
  expect(text.includes(productionCommit), 'production commit missing from authority documents');
  expect(text.includes(productionHash), 'production hash missing from authority documents');
  expect(text.includes('REVIEW GATE'), 'review gate missing from authority documents');
  expect(text.includes('119'), 'asset count missing from authority documents');
  expect(text.includes('585'), 'Evidence count missing from authority documents');
  expect(text.includes('12'), 'Market Access count missing from authority documents');
  expect(text.includes('463'), 'archive-recorded count missing from authority documents');
}

expect(agents.includes('Repository state: PR #523 merged and production-verified; REVIEW GATE'), 'AGENTS authority status missing');
expect(roadmap.includes('Status: PR #523 merged and production-verified; REVIEW GATE'), 'roadmap authority status missing');
expect(readme.includes('Current authority: REVIEW GATE'), 'README authority status missing');
expect(active === "import './validate-post-pr523-production-closeout.mjs';", 'active validator wiring changed');

if (failures.length) {
  console.error('Post-PR523 production closeout validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Post-PR523 production closeout validation passed.');
