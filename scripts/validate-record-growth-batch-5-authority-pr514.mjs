import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/record-growth-batch-5-candidate-audit-pr515.json');
const transition = readJson('docs/migration/post-pr513-six-week-operating-cycle-pr514.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const amendment = readText('docs/roadmap-amendments/2026-08-03-six-week-operating-cycle-and-record-growth-batch-5.md');
const spec = readText('docs/quality/record-growth-batch-5-candidate-audit-pr515-spec.md');
const agents = readText('AGENTS.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const expectedCandidates = [
  'sog_cand_pr515_sofiusd',
  'sog_cand_pr515_usat',
  'sog_cand_pr515_xreur',
  'sog_cand_pr515_bison_eub',
  'sog_cand_pr515_bison_usb',
  'sog_cand_pr515_jpysc',
  'sog_cand_pr515_swiss_chf_sandbox',
  'sog_cand_pr515_hazel_network_token'
];

expect(config.status === 'approved_bounded_private_candidate_audit', 'authority status changed');
expect(config.authority_pr === 514 && config.implementation_pr === 515, 'PR authority chain changed');
expect(config.public_output === false, 'candidate audit became public');
expect(config.candidate_limit === 8 && config.candidates.length === 8, 'candidate count changed');
expect(JSON.stringify(config.candidate_ids) === JSON.stringify(expectedCandidates), 'candidate order or identity changed');
expect(new Set(config.candidate_ids).size === 8, 'candidate IDs are not unique');
expect(new Set(config.candidates.map((candidate) => candidate.candidate_id)).size === 8, 'candidate objects are not unique');
expect(JSON.stringify(config.candidates.map((candidate) => candidate.candidate_id)) === JSON.stringify(expectedCandidates), 'candidate object order changed');
expect(config.maximum_ready_candidates === 2, 'maximum ready-candidate boundary changed');
expect(config.next_boundary === 'REVIEW_GATE', 'review-gate exit changed');
expect(config.prohibited.includes('canonical_asset_change'), 'canonical asset prohibition missing');
expect(config.prohibited.includes('automatic_promotion'), 'automatic promotion prohibition missing');
expect(config.prohibited.includes('replacement_candidate'), 'replacement candidate prohibition missing');
expect(config.prohibited.includes('legacy_redirect_change'), 'legacy redirect prohibition missing');

expect(config.canonical_baseline.production_commit === 'fe716125a2e52d27bfe0ee515c873eb1d96942ad', 'production checkpoint changed');
expect(config.canonical_baseline.canonical_hash === 'sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb', 'canonical hash changed');
expect(config.canonical_baseline.stable_assets === 117, 'stable-asset baseline changed');
expect(config.canonical_baseline.organizations === 108 && config.canonical_baseline.relationships === 129, 'identity baseline changed');
expect(config.canonical_baseline.events === 192, 'event baseline changed');
expect(config.canonical_baseline.evidence === 579 && config.canonical_baseline.evidence_relations === 579, 'Evidence baseline changed');
expect(config.canonical_baseline.deployments === 184 && config.canonical_baseline.market_access_records === 8, 'deployment or Market Access baseline changed');
expect(config.canonical_baseline.detail_routes === 417 && config.canonical_baseline.metadata_checked_routes === 417, 'route baseline changed');
expect(config.canonical_baseline.archive_recorded === 457 && config.canonical_baseline.archive_not_recorded === 122, 'archive partition changed');

expect(checkpoint.counts.assets === 117 && checkpoint.counts.organizations === 108 && checkpoint.counts.relationships === 129, 'canonical checkpoint identity counts changed');
expect(checkpoint.counts.events === 192 && checkpoint.counts.evidence === 579 && checkpoint.counts.evidence_relations === 579, 'canonical checkpoint event or Evidence counts changed');
expect(checkpoint.counts.deployments === 184 && checkpoint.counts.market_access_records === 8, 'canonical checkpoint deployment or Market Access counts changed');
expect(checkpoint.counts.detail_routes === 417 && checkpoint.counts.metadata_checked_routes === 417, 'canonical checkpoint route counts changed');
expect(checkpoint.counts.archive_index_count === 457 && checkpoint.counts.archive_not_recorded_count === 122, 'canonical checkpoint archive partition changed');

expect(transition.preceding_pr === 513, 'preceding PR changed');
expect(transition.preceding_merge_commit === 'fe716125a2e52d27bfe0ee515c873eb1d96942ad', 'preceding merge commit changed');
expect(transition.preceding_result.production_verified === true, 'PR #513 production verification missing');
expect(transition.immediately_authorized.implementation_pr === 515, 'immediate implementation PR changed');
expect(transition.immediately_authorized.candidate_count === 8, 'transition candidate count changed');
expect(transition.immediately_authorized.maximum_ready_candidates === 2, 'transition ready limit changed');
expect(transition.immediately_authorized.canonical_changes_allowed === false, 'transition permits canonical changes');
expect(transition.immediately_authorized.public_changes_allowed === false, 'transition permits public changes');
expect(transition.later_lanes_authorized_for_implementation === false, 'later cycle lanes were pre-authorized');
expect(transition.required_exit_after_pr515 === 'REVIEW_GATE', 'transition exit changed');
expect(transition.legacy_redirect_changes === 0, 'legacy redirect boundary changed');

expect(amendment.includes('2026-08-03 through 2026-09-13'), 'six-week cycle window missing');
expect(amendment.includes('Only the first implementation item, PR #515, is authorized immediately.'), 'bounded first-item authority missing');
expect(amendment.includes('Terminal Date Boundary Review Batch 3'), 'terminal-date exclusion missing');
expect(amendment.includes('legacy host redirect work'), 'legacy redirect exclusion missing');
expect(spec.includes('No replacement or ninth candidate is allowed.'), 'fixed candidate boundary missing');
expect(spec.includes('At most two candidates may be classified `ready_for_full_record_review`.'), 'ready-candidate limit missing');
expect(spec.includes('PR #515 ends at `REVIEW GATE`.'), 'PR #515 review gate missing');
expect(agents.includes('Current repository authority: REVIEW GATE'), 'starting REVIEW GATE not recorded in AGENTS');
expect(agents.includes('No later canonical asset addition is currently authorized.'), 'canonical addition stop boundary missing');
expect(active === "import './validate-record-growth-batch-5-authority-pr514.mjs';", 'active workstream is not wired to PR #514');

for (const file of [
  'config/record-growth-batch-5-candidate-audit-pr515.json',
  'docs/quality/record-growth-batch-5-candidate-audit-pr515-spec.md',
  'docs/roadmap-amendments/2026-08-03-six-week-operating-cycle-and-record-growth-batch-5.md',
  'docs/migration/post-pr513-six-week-operating-cycle-pr514.json'
]) expect(fs.existsSync(path.join(root, file)), `required authority file missing: ${file}`);

if (failures.length) {
  console.error('PR #514 six-week cycle and Batch 5 authority validation failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  authority_pr: 514,
  implementation_pr: 515,
  cycle: '2026-08-03/2026-09-13',
  candidates: expectedCandidates,
  maximum_ready_candidates: 2,
  canonical_changes: 0,
  public_changes: 0,
  legacy_redirect_changes: 0,
  next_boundary: 'REVIEW_GATE'
}, null, 2));
