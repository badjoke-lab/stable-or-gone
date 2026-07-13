import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./validate-record-growth-batch-1-selection-pr358.mjs');
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
const amendment = read('docs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md');
const spec = read('docs/quality/record-growth-batch-1-pr358-spec.md');
const handoff = read('docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json');

for (const [file, body] of [
  ['README.md', readme],
  ['AGENTS.md', agents],
  ['docs/spec-governance.md', governance],
  ['docs/roadmap.md', roadmap]
]) {
  requireText(body, 'Canonical stable assets: 110', file);
  requireText(body, 'PR #357 Tier A Dossier Deepening — Batch 3: complete', file);
  requireText(body, 'PR #358 Record Growth Batch 1: active', file);
  requireText(body, 'PR #359 Market Access Pilot 2: next', file);
  requireText(body, 'docs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md', file);
  requireText(body, 'docs/quality/record-growth-batch-1-pr358-spec.md', file);
  requireText(body, 'config/record-growth-batch-1-pr358.json', file);
  requireText(body, 'docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json', file);
  requireText(body, 'StraitsX USD / XUSD / sog_st_xusd', file);
  requireText(body, 'USDB / USDB / sog_st_usdb', file);
}

for (const marker of ['StraitsX USD', 'XUSD', 'USDB', 'Blast']) {
  requireText(amendment, marker, 'PR #358 amendment');
  requireText(spec, marker, 'PR #358 specification');
}

requireText(handoff, 'b849bfd582209aad217dd1af2198c755ff0760ab', 'PR #357 reviewed handoff');
requireText(handoff, '"assets": 110', 'PR #357 reviewed handoff');
requireText(handoff, '"evidence": 551', 'PR #357 reviewed handoff');
requireText(handoff, '"market_access_records": 4', 'PR #357 reviewed handoff');
expect(roadmap.includes('PR #360  Evidence and Correction Batch'), 'roadmap must preserve the bounded sequence through PR #360');
expect(roadmap.includes('REVIEW GATE'), 'roadmap review gate missing');
expect(governance.includes('A non-trivial PR is not ready for implementation until the exact roadmap item and governing specification are identified.'), 'governance traceability rule missing');
expect(agents.includes('A PR that cannot identify its roadmap item and governing specification must pause.'), 'AGENTS traceability rule missing');
expect(spec.includes('Candidate selection does not equal canonical promotion.'), 'candidate/canonical boundary missing');
expect(spec.includes('A thin listed-reference record is forbidden.'), 'thin-record prohibition missing');
expect(spec.includes('no more than two new canonical stable assets'), 'two-asset maximum missing');

if (failures.length) {
  console.error('PR #358 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #357 is complete, PR #358 is active for the bounded XUSD/USDB full-record growth batch, and PR #359 is next.');
