import fs from 'node:fs';
import path from 'node:path';
import './validate-record-growth-batch-3-pr467.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const files = {
  agents: 'AGENTS.md',
  readme: 'README.md',
  roadmap: 'docs/roadmap.md',
  governance: 'docs/spec-governance.md',
  deployment: 'docs/deployment-policy.md',
  amendment: 'docs/roadmap-amendments/2026-07-31-post-domain-authority-sync.md'
};
const docs = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, read(file)]));
const checkpoint = 'bd0e63ac36b1824bf705e8c80d1fb0a1cd79d221';
const officialOrigin = 'https://www.stableorgone.com';

for (const [name, text] of Object.entries(docs)) {
  check(text.includes('116'), `${name}: reviewed 116-asset checkpoint missing`);
  check(text.includes(officialOrigin), `${name}: official origin missing`);
}

for (const name of ['agents', 'readme', 'roadmap', 'governance', 'amendment']) {
  check(docs[name].includes('PR #492'), `${name}: PR #492 acceptance point missing`);
  check(docs[name].includes('PR #493'), `${name}: PR #493 acceptance point missing`);
}

for (const name of ['readme', 'roadmap', 'governance', 'deployment', 'amendment']) {
  check(docs[name].includes(checkpoint), `${name}: official-domain migration checkpoint missing`);
}

const staleCurrentCommitClaims = [
  'Current main and production commit:',
  'Current production commit:',
  'Main and production commit:'
];
for (const [name, text] of Object.entries(docs)) {
  for (const phrase of staleCurrentCommitClaims) {
    check(!text.includes(phrase), `${name}: stale immutable current-commit claim remains: ${phrase}`);
  }
}

for (const name of ['agents', 'readme', 'roadmap', 'governance', 'deployment', 'amendment']) {
  const text = docs[name].toLowerCase();
  check(text.includes('legacy') && text.includes('redirect'), `${name}: legacy redirect boundary missing`);
}

check(docs.roadmap.includes('externally blocked'), 'roadmap: external redirect blocker missing');
check(docs.amendment.includes('No candidate and no canonical promotion PR is authorized'), 'amendment: promotion prohibition missing');
check(docs.governance.includes('No candidate and no later growth batch is pre-authorized'), 'governance: bounded continuation missing');
check(read('scripts/validate-active-workstream.mjs').trim() === "import './validate-post-domain-authority-sync-pr495.mjs';", 'active-workstream validator is not wired to PR #495 authority validation');

if (failures.length) {
  console.error('PR #495 post-domain authority synchronization validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  validation_id: 'sog_pr495_post_domain_authority_sync',
  canonical_assets: 116,
  official_origin: officialOrigin,
  migration_checkpoint: checkpoint,
  completed_acceptance_points: [467, 492, 493],
  legacy_redirect: 'externally_blocked',
  next_work_item: 'ISSUE_RECONCILIATION_THEN_RECORD_GROWTH_BATCH_4_CANDIDATE_AUDIT_REVIEW_GATE'
}, null, 2));
