import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const statsCheckpoint = readJson('docs/migration/current-stats-history-checkpoint.json');
const outcomes = readJson('docs/migration/evidence-archive-payload-verification-batch-1-pr506-outcomes.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();
const productionCommit = '2a6bfac25538388dd7ea6dc12de96c2c2dc2dad0';
const productionHash = 'sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb';

expect(checkpoint.checkpoint_id === 'sog_pr506_evidence_archive_payload_verification_117_2026_08_01', 'canonical checkpoint changed');
expect(checkpoint.counts.assets === 117 && checkpoint.counts.organizations === 108 && checkpoint.counts.relationships === 129, 'identity counts changed');
expect(checkpoint.counts.events === 192 && checkpoint.counts.evidence === 579 && checkpoint.counts.evidence_relations === 579, 'event or Evidence counts changed');
expect(checkpoint.counts.deployments === 184 && checkpoint.counts.market_access_records === 8, 'deployment or Market Access counts changed');
expect(checkpoint.counts.detail_routes === 417 && checkpoint.counts.metadata_checked_routes === 417, 'route counts changed');
expect(checkpoint.counts.archive_index_count === 457 && checkpoint.counts.archive_not_recorded_count === 122, 'archive partition changed');
expect(statsCheckpoint.checkpoint_id === 'sog_stats_pr506_evidence_archive_payload_verification_2026_08_01', 'stats checkpoint changed');
expect(outcomes.changed_count === 7 && outcomes.reviewed_no_safe_change_count === 3, 'PR #506 outcome counts changed');
expect(agents.includes('Current production checkpoint: ' + productionCommit), 'AGENTS production commit missing');
expect(agents.includes('Current production canonical hash: ' + productionHash), 'AGENTS production hash missing');
expect(agents.includes('PR #506 Evidence Archive Payload Verification — Batch 1: complete and production-verified'), 'AGENTS completion missing');
expect(agents.includes('Current repository authority: REVIEW GATE'), 'AGENTS review gate missing');
expect(roadmap.includes('Status: PR #506 complete and production-verified; REVIEW GATE'), 'roadmap status missing');
expect(roadmap.includes('Current production checkpoint: ' + productionCommit), 'roadmap production commit missing');
expect(roadmap.includes('Current production canonical hash: ' + productionHash), 'roadmap production hash missing');
expect(governance.includes('REVIEW GATE — PR #506 complete and production-verified'), 'governance current item missing');
expect(governance.includes('production commit: ' + productionCommit), 'governance production commit missing');
expect(governance.includes('production canonical hash: ' + productionHash), 'governance production hash missing');
expect(governance.includes('No work beyond this checkpoint is pre-authorized.'), 'governance stop boundary missing');
expect(active === "import './validate-post-pr506-authority-sync-pr507.mjs';", 'active workstream is not wired to PR #507');

if (failures.length) {
  console.error('PR #507 post-PR #506 authority synchronization failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, production_commit: productionCommit, production_hash: productionHash, archive_recorded: 457, archive_not_recorded: 122, current_boundary: 'REVIEW_GATE' }, null, 2));
