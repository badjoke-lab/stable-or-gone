import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const expectedIds = ["sog_src_rai_integrations_batch_b","sog_src_rai_oracle_relayer_batch_b","sog_src_rai_ungovernance_batch_b","sog_src_rlusd_docs","sog_src_rlusd_launch_2024","sog_src_rlusd_ripple_page","sog_src_spot_about_batch_b","sog_src_spot_mint_batch_b","sog_src_spot_site_batch_b","sog_src_spot_v2_rollout_batch_b"];
const config = readJson('config/evidence-archive-payload-verification-batch-1.json');
const source = readJson('docs/migration/evidence-archive-maintenance-outcomes-pr405.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

expect(config.status === 'approved_bounded_review', 'authority status changed');
expect(config.authority_pr === 505 && config.implementation_pr === 506, 'PR sequence changed');
expect(config.target_count === 10, 'target count changed');
expect(JSON.stringify(config.target_evidence_ids) === JSON.stringify(expectedIds), 'target identities changed');
expect(JSON.stringify(config.allowed_outcomes) === JSON.stringify(['dated_exact_archive_added','reviewed_no_safe_change']), 'allowed outcomes changed');
expect(config.maximum_archive_additions === 10, 'archive addition maximum changed');
expect(config.next_boundary === 'REVIEW_GATE', 'next boundary changed');
expect(source.review_pr === 405 && source.reviewed_no_safe_change_count === 10 && source.changed_count === 0, 'PR #405 source result changed');
expect(JSON.stringify(source.outcomes.map((row) => row.evidence_id)) === JSON.stringify(expectedIds), 'PR #405 source target order changed');
const counts = checkpoint.counts;
expect(counts.assets === 117 && counts.organizations === 108 && counts.relationships === 129, 'identity counts changed');
expect(counts.events === 192 && counts.evidence === 579 && counts.evidence_relations === 579, 'event or Evidence counts changed');
expect(counts.deployments === 184 && counts.market_access_records === 8, 'deployment or Market Access counts changed');
expect(counts.archive_index_count === 450 && counts.archive_not_recorded_count === 129, 'archive counts changed before implementation');
expect(agents.includes('PR #505 Evidence Archive Payload Verification — Batch 1 authorization: active'), 'AGENTS PR #505 authority missing');
expect(agents.includes('PR #506 Evidence Archive Payload Verification — Batch 1: reserved implementation'), 'AGENTS PR #506 reservation missing');
expect(roadmap.includes('Status: PR #505 Evidence Archive Payload Verification — Batch 1 authorized; PR #506 reserved'), 'roadmap status missing');
expect(governance.includes('PR #505 Evidence Archive Payload Verification — Batch 1 authorization'), 'governance current item missing');
expect(governance.includes('No work beyond PR #506 is pre-authorized.'), 'governance stop boundary missing');
expect(active === "import './validate-evidence-archive-payload-verification-pr505.mjs';", 'active workstream is not wired to PR #505');

if (failures.length) {
  console.error('PR #505 Evidence Archive Payload Verification authority failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, authority_pr: 505, implementation_pr: 506, target_count: 10, archive_recorded_before: 450, archive_not_recorded_before: 129, next_boundary: 'REVIEW_GATE' }, null, 2));
