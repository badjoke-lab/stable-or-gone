import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/post-pr518-production-closeout.json');
const closeout = readJson('docs/migration/post-pr518-production-closeout.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const review = readJson('docs/migration/current-review-checkpoint.json');
const stats = readJson('docs/migration/current-stats-history-checkpoint.json');
const statsHistory = readJson('data/stats-history.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const readme = readText('README.md');
const architecture = readText('config/site-architecture.mjs');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const expected = config.expected_counts;

expect(config.work_item === 'post_pr518_production_closeout', 'closeout work item changed');
expect(config.exit_boundary === 'REVIEW_GATE' && config.later_lane_authorized === false, 'review-gate boundary changed');
expect(config.canonical_changes_allowed === false && config.public_changes_allowed === false, 'closeout mutation boundary changed');
expect(closeout.status === 'production_verified_closeout', 'closeout status changed');
expect(closeout.production_commit === config.production_commit, 'production commit mismatch');
expect(closeout.production.canonical_hash === config.production_canonical_hash, 'production hash mismatch');
expect(closeout.production.convergence_attempt === 1, 'production convergence changed');

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

expect(review.source_pr === 517 && review.exit_boundary === 'REVIEW_GATE', 'PR517 review checkpoint changed');
expect(stats.growth_pr === 517 && stats.asset_count === 119, 'PR517 statistics checkpoint changed');
const historySnapshot = statsHistory.snapshots.find((row) => row.checkpoint_id === stats.checkpoint_id);
expect(Boolean(historySnapshot), 'PR517 statistics checkpoint missing from immutable history');
expect(historySnapshot?.asset_count === 119, 'PR517 immutable history asset count changed');
expect(historySnapshot?.snapshot_sha256 === '4a1dee137d20b91a78c1485f01e5805ab2c924ba1dc6ae74e0b8d04012465918', 'PR517 immutable history digest changed');

for (const link of config.required_footer_links) {
  expect(architecture.includes(`href: '${link}'`), `missing footer link: ${link}`);
}
expect((architecture.match(/Historical Exchange Index/g) || []).length === 1, 'HEI footer link duplication');
expect((architecture.match(/Crypto Yield Archive/g) || []).length === 1, 'CYA footer link duplication');
expect((architecture.match(/Bridge Incident Registry/g) || []).length === 1, 'BIR footer link duplication');

for (const text of [agents, roadmap, readme]) {
  expect(text.includes('e51f7440c7761d0a70cb36807a8ca452aa2622da'), 'production commit missing from authority documents');
  expect(text.includes('sha256:57749955faa96d2bd836bac83ef41a0c5dc13f2342763dc4d975c588cd50c650'), 'production hash missing from authority documents');
  expect(text.includes('REVIEW GATE'), 'review gate missing from authority documents');
}
expect(agents.includes('Canonical stable assets: 119'), 'AGENTS count missing');
expect(roadmap.includes('Status: PR #517 and PR #518 complete and production-verified; REVIEW GATE'), 'roadmap status missing');
expect(readme.includes('Canonical stable assets: 119'), 'README count missing');
expect(active === "import './validate-post-pr518-production-closeout.mjs';", 'active validator wiring changed');

if (failures.length) {
  console.error('Post-PR518 production closeout validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Post-PR518 production closeout validation passed.');
