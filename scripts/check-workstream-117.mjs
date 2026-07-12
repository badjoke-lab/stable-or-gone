import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./validate-tier-a-dossier-batch-3-selection-pr357.mjs');
} finally {
  console.log = originalLog;
}

const read = (file) => fs.readFileSync(file, 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const readme = read('README.md');
const agents = read('AGENTS.md');
const governance = read('docs/spec-governance.md');
const roadmap = read('docs/roadmap.md');
const amendment = read('docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md');
const spec = read('docs/quality/tier-a-dossier-batch-3-pr357-spec.md');
const handoff = read('docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json');

for (const [file, body] of [
  ['README.md', readme],
  ['AGENTS.md', agents],
  ['docs/spec-governance.md', governance],
  ['docs/roadmap.md', roadmap]
]) {
  requireText(body, 'Canonical stable assets: 110', file);
  requireText(body, 'PR #356 Market Access Pilot 1: complete', file);
  requireText(body, 'PR #357 Tier A Dossier Deepening — Batch 3: active', file);
  requireText(body, 'PR #358 Record Growth Batch 1: next', file);
  requireText(body, 'docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md', file);
  requireText(body, 'docs/quality/tier-a-dossier-batch-3-pr357-spec.md', file);
  requireText(body, 'config/tier-a-dossier-batch-3-pr357.json', file);
  requireText(body, 'docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json', file);
}

for (const marker of ['AUDD', 'FEI', 'HUSD', 'MIM', 'NZDS']) {
  requireText(amendment, marker, 'PR #357 amendment');
  requireText(spec, marker, 'PR #357 specification');
}

requireText(handoff, 'ff48267a54333bd05c2fae1606c7744c3d5e200d', 'PR #356 reviewed handoff');
requireText(handoff, '"market_access_records": 4', 'PR #356 reviewed handoff');
expect(roadmap.includes('PR #360  Evidence and Correction Batch'), 'roadmap must preserve the bounded sequence through PR #360');
expect(roadmap.includes('REVIEW GATE'), 'roadmap review gate missing');
expect(governance.includes('A non-trivial PR is not ready for implementation until the exact roadmap item and governing specification are identified.'), 'governance traceability rule missing');
expect(agents.includes('A PR that cannot identify its roadmap item and governing specification must pause.'), 'AGENTS traceability rule missing');
expect(spec.includes('This is deterministic queue consumption, not a ranking or score.'), 'non-ranking selection semantics missing');
expect(spec.includes('4 canonical Market Access Records'), 'Market Access preservation boundary missing');
expect(spec.includes('PR #357 does not:'), 'explicit non-goals missing');

if (failures.length) {
  console.error('PR #357 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #356 is complete, PR #357 is active for AUDD/FEI/HUSD/MIM/NZDS dossier deepening, and PR #358 is next.');
