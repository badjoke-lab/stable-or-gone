import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/post-pr534-market-access-review-authority.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const deployment = readText('docs/deployment-policy.md');
const readme = readText('README.md');
const amendment = readText('docs/roadmap-amendments/2026-08-09-post-pr534-market-access-review-authority.md');
const spec = readText('docs/quality/market-access-expansion-review-authority-2026-08-09-spec.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const productionCommit = '8ba1ed2b4aff36aaa9545c6f3e3cdd113dbb5ed2';
const canonicalChangeCommit = '77e80dd3e2a62fea53ea0eabe91ef78a2d8ab1da';
const productionHash = 'sha256:f386c1043ca5e83cafbd88e99746d0609aab0154ed48de1970677758a66ed5fa';
const expected = config.entry_production_checkpoint.counts;

expect(config.work_item === 'post_pr534_market_access_review_authority', 'work item changed');
expect(config.status === 'review_authority', 'review authority status changed');
expect(config.entry_repository_commit === productionCommit, 'entry repository commit changed');
expect(config.entry_production_checkpoint.commit === productionCommit, 'production commit changed');
expect(config.entry_production_checkpoint.canonical_hash === productionHash, 'canonical hash changed');
expect(config.entry_production_checkpoint.canonical_file_count === 466, 'canonical file count changed');
expect(config.historical_canonical_change_checkpoint.commit === canonicalChangeCommit, 'historical PR523 checkpoint changed');
expect(config.historical_canonical_change_checkpoint.closeout_pr === 534, 'closeout lineage changed');
expect(config.review_lane.mode === 'review_only', 'review lane is no longer review-only');
expect(config.review_lane.jurisdiction.country_code === 'JP', 'review jurisdiction changed');
expect(config.review_lane.maximum_asset_platform_service_candidates === 3, 'candidate bound changed');
expect(config.review_lane.existing_canonical_assets_only === true, 'existing-canonical-asset prerequisite changed');
expect(config.boundaries.canonical_changes_allowed === false, 'canonical mutation was enabled');
expect(config.boundaries.new_market_access_records_allowed === false, 'Market Access promotion was enabled');
expect(config.boundaries.new_evidence_identities_allowed === false, 'new Evidence identities were enabled');
expect(config.boundaries.public_product_changes_allowed === false, 'public product mutation was enabled');
expect(config.boundaries.automatic_promotion === false, 'automatic promotion was enabled');
expect(config.implementation_boundary.current === 'REVIEW_GATE', 'implementation boundary changed');
expect(config.implementation_boundary.later_canonical_promotion_requires_separate_merged_authority === true, 'separate implementation authority requirement changed');

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
expect(checkpoint.counts.detail_routes === expected.detail_routes, 'detail-route count changed');
expect(checkpoint.counts.metadata_checked_routes === expected.metadata_checked_routes, 'metadata-route count changed');

for (const [name, text] of Object.entries({agents, roadmap, governance, deployment, readme})) {
  expect(text.includes(productionCommit), `${name} missing current production commit`);
  expect(text.includes(canonicalChangeCommit), `${name} missing historical canonical-change commit`);
  expect(text.includes(productionHash), `${name} missing production hash`);
  expect(text.includes('585'), `${name} missing Evidence 585 checkpoint`);
  expect(text.includes('12'), `${name} missing Market Access 12 checkpoint`);
  expect(text.includes('463'), `${name} missing archive 463 checkpoint`);
  expect(text.includes('REVIEW GATE'), `${name} missing REVIEW GATE boundary`);
}

expect(governance.includes('2026-08-09-post-pr534-market-access-review-authority.md'), 'governance does not point to current roadmap amendment');
expect(governance.includes('market-access-expansion-review-authority-2026-08-09-spec.md'), 'governance does not point to current review spec');
expect(roadmap.includes('Japan Market Access Expansion Review Batch 1'), 'roadmap missing review lane');
expect(agents.includes('Japan Market Access Expansion Review Batch 1'), 'AGENTS missing review lane');
expect(readme.includes('review-only'), 'README missing review-only boundary');
expect(amendment.includes('No canonical mutation is authorized'), 'roadmap amendment missing canonical mutation prohibition');
expect(spec.includes('Canonical promotion requires a new separately reviewed and merged authority PR'), 'spec missing separate implementation authority rule');
expect(active === "import './validate-post-pr534-market-access-review-authority.mjs';", 'active validator wiring changed');

if (failures.length) {
  console.error('Post-PR534 Market Access review authority validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Post-PR534 Market Access review authority validation passed.');
