import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const review = readJson('data/editorial-research/terminal-date-boundary-review-batch-1-pr509-source-review.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();
const productionCommit = '96ae5edd42e9a9e8a652bb27acc2d6a6eb02dfd6';
const productionHash = 'sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb';

expect(review.status === 'reviewed_bounded_no_canonical_date_change', 'PR #509 review status changed');
expect(review.target_count === 3 && review.exact_terminal_day_resolved_count === 0 && review.reviewed_null_preserved_count === 3, 'PR #509 reviewed outcomes changed');
expect(review.canonical_evidence_added_count === 0 && review.canonical_evidence_relation_added_count === 0, 'PR #509 Evidence boundary changed');
expect(checkpoint.counts.assets === 117 && checkpoint.counts.organizations === 108 && checkpoint.counts.relationships === 129, 'identity counts changed');
expect(checkpoint.counts.events === 192 && checkpoint.counts.evidence === 579 && checkpoint.counts.evidence_relations === 579, 'event or Evidence counts changed');
expect(checkpoint.counts.deployments === 184 && checkpoint.counts.market_access_records === 8, 'deployment or Market Access counts changed');
expect(checkpoint.counts.detail_routes === 417 && checkpoint.counts.metadata_checked_routes === 417, 'route counts changed');
expect(checkpoint.counts.archive_index_count === 457 && checkpoint.counts.archive_not_recorded_count === 122, 'archive partition changed');
expect(agents.includes('Current production checkpoint: ' + productionCommit), 'AGENTS production commit missing');
expect(agents.includes('Current production canonical hash: ' + productionHash), 'AGENTS production hash missing');
expect(agents.includes('PR #509 Terminal Date Boundary Review — Batch 1: complete and production-verified'), 'AGENTS completion missing');
expect(agents.includes('Current repository authority: REVIEW GATE'), 'AGENTS review gate missing');
expect(roadmap.includes('Status: PR #509 complete and production-verified; REVIEW GATE'), 'roadmap status missing');
expect(roadmap.includes('Current production checkpoint: ' + productionCommit), 'roadmap production commit missing');
expect(roadmap.includes('Current production canonical hash: ' + productionHash), 'roadmap production hash missing');
expect(governance.includes('REVIEW GATE — PR #509 complete and production-verified'), 'governance current item missing');
expect(governance.includes('production commit: ' + productionCommit), 'governance production commit missing');
expect(governance.includes('production canonical hash: ' + productionHash), 'governance production hash missing');
expect(governance.includes('No work beyond this checkpoint is pre-authorized.'), 'governance stop boundary missing');
expect(active === "import './validate-post-pr509-authority-sync-pr510.mjs';", 'active workstream is not wired to PR #510');
for (const temp of [
  '.github/workflows/pr510-authority-sync-finalize.yml',
  'scripts/finalize-post-pr509-authority-sync.py'
]) expect(!fs.existsSync(path.join(root, temp)), `temporary file remains: ${temp}`);

if (failures.length) {
  console.error('PR #510 post-PR #509 authority synchronization failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  production_commit: productionCommit,
  production_hash: productionHash,
  exact_terminal_day_resolved: 0,
  reviewed_null_preserved: 3,
  canonical_counts_preserved: true,
  legacy_redirect_changes: 0,
  current_boundary: 'REVIEW_GATE'
}, null, 2));
