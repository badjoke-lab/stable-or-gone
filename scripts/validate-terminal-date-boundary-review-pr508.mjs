import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const expectedTargets = ["sog_st_fei","sog_st_nearusn","sog_st_esd"];

const config = readJson('config/terminal-date-boundary-review-batch-1.json');
const queue = readJson('data/quality/terminal-date-unresolved.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

expect(config.status === 'approved_bounded_review', 'authority status changed');
expect(config.authority_pr === 508 && config.implementation_pr === 509, 'PR sequence changed');
expect(config.target_count === 3, 'target count changed');
expect(JSON.stringify(config.target_stablecoin_ids) === JSON.stringify(expectedTargets), 'target set changed');
expect(JSON.stringify(config.allowed_outcomes) === JSON.stringify(['exact_terminal_day_resolved','reviewed_null_preserved']), 'allowed outcomes changed');
expect(config.next_boundary === 'REVIEW_GATE', 'next boundary changed');
expect(queue.expected_total === 6 && queue.records.length === 6, 'source terminal queue total changed');
const byId = new Map(queue.records.map((row) => [row.stablecoin_id, row]));
for (const id of expectedTargets) {
  expect(byId.has(id), id + ': missing from source queue');
  expect(byId.get(id)?.canonical_status === (id === 'sog_st_esd' ? 'failed' : 'discontinued'), id + ': canonical status changed');
}
expect(byId.get('sog_st_gyen')?.reason_code === 'redemption_period_still_open', 'GYEN future boundary changed');
expect(checkpoint.counts.assets === 117 && checkpoint.counts.organizations === 108 && checkpoint.counts.relationships === 129, 'identity counts changed');
expect(checkpoint.counts.events === 192 && checkpoint.counts.evidence === 579 && checkpoint.counts.evidence_relations === 579, 'event or Evidence counts changed');
expect(checkpoint.counts.deployments === 184 && checkpoint.counts.market_access_records === 8, 'deployment or Market Access counts changed');
expect(checkpoint.counts.detail_routes === 417 && checkpoint.counts.metadata_checked_routes === 417, 'route counts changed');
expect(checkpoint.counts.archive_index_count === 457 && checkpoint.counts.archive_not_recorded_count === 122, 'archive partition changed');
expect(agents.includes('PR #508 Terminal Date Boundary Review — Batch 1 authorization: active'), 'AGENTS PR #508 authority missing');
expect(agents.includes('PR #509 Terminal Date Boundary Review — Batch 1: reserved implementation'), 'AGENTS PR #509 reservation missing');
expect(roadmap.includes('Status: PR #508 Terminal Date Boundary Review — Batch 1 authorized; PR #509 reserved'), 'roadmap status missing');
expect(governance.includes('PR #508 Terminal Date Boundary Review — Batch 1 authorization; PR #509 implementation reserved'), 'governance current item missing');
expect(governance.includes('No work beyond PR #509 is pre-authorized.'), 'governance stop boundary missing');
expect(active === "import './validate-terminal-date-boundary-review-pr508.mjs';", 'active workstream is not wired to PR #508');

if (failures.length) {
  console.error('PR #508 Terminal Date Boundary Review authority failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, authority_pr: 508, implementation_pr: 509, targets: expectedTargets, source_queue_total: 6, next_boundary: 'REVIEW_GATE' }, null, 2));
