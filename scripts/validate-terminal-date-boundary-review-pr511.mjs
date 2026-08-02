import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/terminal-date-boundary-review-batch-2.json');
const queue = readJson('data/quality/terminal-date-unresolved.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const spec = readText('docs/quality/terminal-date-boundary-review-batch-2-spec.md');
const amendment = readText('docs/roadmap-amendments/2026-08-02-terminal-date-boundary-review-batch-2.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();
const targetIds = ['sog_st_bac', 'sog_st_dsd'];
const productionCommit = '8344504f41df8debd2da90b1b60a61da6fba9a58';
const productionHash = 'sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb';

expect(config.status === 'approved_bounded_review', 'authority status is not approved_bounded_review');
expect(config.authority_pr === 511 && config.implementation_pr === 512, 'PR authority chain changed');
expect(config.target_count === 2, 'target_count changed');
expect(JSON.stringify(config.target_stablecoin_ids) === JSON.stringify(targetIds), 'target set or order changed');
expect(config.explicitly_deferred?.stablecoin_id === 'sog_st_gyen', 'GYEN deferment missing');
expect(config.explicitly_deferred?.not_before === '2026-11-12', 'GYEN not-before boundary changed');
expect(config.authority_checkpoint?.production_commit === productionCommit, 'production commit checkpoint changed');
expect(config.authority_checkpoint?.canonical_hash === productionHash, 'production hash checkpoint changed');
expect(config.authority_checkpoint?.convergence_attempt === 2, 'convergence attempt changed');

expect(queue.expected_total === 6, 'terminal queue total changed');
const records = new Map(queue.records.map((record) => [record.stablecoin_id, record]));
for (const id of targetIds) expect(records.has(id), `queue target missing: ${id}`);
expect(records.get('sog_st_bac')?.reason_code === 'shutdown_source_absent', 'BAC queue reason changed');
expect(records.get('sog_st_dsd')?.reason_code === 'development_activity_without_terminal_effect', 'DSD queue reason changed');
expect(records.get('sog_st_gyen')?.reason_code === 'redemption_period_still_open', 'GYEN deferment reason changed');
expect(String(records.get('sog_st_gyen')?.review_note || '').includes('2026-11-11'), 'GYEN redemption deadline missing');

const counts = config.canonical_counts_must_remain;
expect(counts.assets === 117 && counts.organizations === 108 && counts.relationships === 129, 'identity count contract changed');
expect(counts.events === 192 && counts.evidence === 579 && counts.evidence_relations === 579, 'event or Evidence count contract changed');
expect(counts.deployments === 184 && counts.market_access_records === 8, 'deployment or Market Access count contract changed');
expect(counts.detail_routes === 417 && counts.metadata_checked_routes === 417, 'route count contract changed');
expect(counts.archive_recorded === 457 && counts.archive_not_recorded === 122, 'archive partition contract changed');

expect(checkpoint.counts.assets === 117 && checkpoint.counts.organizations === 108 && checkpoint.counts.relationships === 129, 'canonical identity counts changed');
expect(checkpoint.counts.events === 192 && checkpoint.counts.evidence === 579 && checkpoint.counts.evidence_relations === 579, 'canonical event or Evidence counts changed');
expect(checkpoint.counts.deployments === 184 && checkpoint.counts.market_access_records === 8, 'canonical deployment or Market Access counts changed');
expect(checkpoint.counts.detail_routes === 417 && checkpoint.counts.metadata_checked_routes === 417, 'canonical route counts changed');
expect(checkpoint.counts.archive_index_count === 457 && checkpoint.counts.archive_not_recorded_count === 122, 'canonical archive partition changed');

expect(agents.includes('PR #511 Terminal Date Boundary Review — Batch 2 authorization: active'), 'AGENTS authority state missing');
expect(agents.includes('PR #512 Terminal Date Boundary Review — Batch 2: reserved implementation'), 'AGENTS implementation reservation missing');
expect(agents.includes('Current production checkpoint: ' + productionCommit), 'AGENTS production commit missing');
expect(agents.includes('sog_st_bac') && agents.includes('sog_st_dsd'), 'AGENTS target set missing');
expect(roadmap.includes('Status: PR #511 Terminal Date Boundary Review — Batch 2 authorized; PR #512 reserved'), 'roadmap status missing');
expect(roadmap.includes('Deferred non-target: GYEN until after its 2026-11-11 initial redemption deadline'), 'roadmap GYEN deferment missing');
expect(governance.includes('PR #511 Terminal Date Boundary Review — Batch 2 authority active'), 'governance authority state missing');
expect(governance.includes('Only PR #512 is authorized by this decision.'), 'governance implementation boundary missing');
expect(spec.includes('No replacement or third target is allowed.'), 'spec target lock missing');
expect(amendment.includes('GYEN remains inside an officially open initial redemption period through 2026-11-11.'), 'amendment GYEN boundary missing');
expect(active === "import './validate-terminal-date-boundary-review-pr511.mjs';", 'active workstream is not wired to PR #511');

for (const temp of [
  '.github/workflows/pr511-terminal-date-authority-finalize.yml',
  'scripts/finalize-terminal-date-boundary-review-batch-2-authority.py'
]) expect(!fs.existsSync(path.join(root, temp)), `temporary file remains: ${temp}`);

if (failures.length) {
  console.error('PR #511 terminal-date authority validation failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  authority_pr: 511,
  implementation_pr: 512,
  targets: targetIds,
  deferred: 'sog_st_gyen',
  production_commit: productionCommit,
  production_hash: productionHash,
  canonical_counts_preserved: true,
  legacy_redirect_changes: 0,
  next_boundary: 'REVIEW_GATE'
}, null, 2));
