import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./validate-tier-a-dossier-batch-1-selection-pr354.mjs');
  await import('./validate-tier-a-dossier-batch-1-impact-pr354.mjs');
} finally {
  console.log = originalLog;
}

const readText = (file) => fs.readFileSync(file, 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const readme = readText('README.md');
const agents = readText('AGENTS.md');
const governance = readText('docs/spec-governance.md');
const roadmap = readText('docs/roadmap.md');
const operatingSpec = readText('docs/post-351-data-growth-operating-spec.md');
const programAmendment = readText('docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md');
const baselineAmendment = readText('docs/roadmap-amendments/2026-07-10-pr353-record-depth-baseline-activation.md');
const activeAmendment = readText('docs/roadmap-amendments/2026-07-10-pr354-tier-a-batch-1-activation.md');
const workItemSpec = readText('docs/quality/tier-a-dossier-batch-1-pr354-spec.md');

for (const [file, body] of [
  ['README.md', readme],
  ['AGENTS.md', agents],
  ['docs/spec-governance.md', governance],
  ['docs/roadmap.md', roadmap]
]) {
  requireText(body, 'Canonical stable assets: 110', file);
  requireText(body, 'PR #353 Record Depth & Coverage Baseline: complete', file);
  requireText(body, 'PR #354 Tier A Dossier Deepening — Batch 1: active', file);
  requireText(body, 'PR #355 Tier A Dossier Deepening — Batch 2: next', file);
  requireText(body, 'docs/roadmap-amendments/2026-07-10-pr354-tier-a-batch-1-activation.md', file);
  requireText(body, 'docs/quality/tier-a-dossier-batch-1-pr354-spec.md', file);
}

requireText(operatingSpec, 'PR #354  Tier A Dossier Deepening — Batch 1', 'post-351 operating spec');
requireText(programAmendment, 'PR #354  Tier A Dossier Deepening — Batch 1', 'post-351 program amendment');
requireText(baselineAmendment, 'PR #354 Tier A Dossier Deepening — Batch 1: active', 'PR #353 handoff amendment');
requireText(activeAmendment, 'PR #354 Tier A Dossier Deepening — Batch 1: active', 'PR #354 amendment');
requireText(activeAmendment, 'PR #355 Tier A Dossier Deepening — Batch 2: next', 'PR #354 amendment');
requireText(workItemSpec, 'docs/migration/record-depth-baseline-pr353-summary.json', 'PR #354 work-item spec');
requireText(workItemSpec, 'docs/migration/tier-a-candidate-queue-pr353.json', 'PR #354 work-item spec');
requireText(workItemSpec, 'PR #353 reviewed snapshots remain byte-unchanged', 'PR #354 work-item spec');
requireText(workItemSpec, 'Only RLUSD and BUSD are pre-authorized for redemption-profile deepening in this batch.', 'PR #354 work-item spec');

expect(roadmap.includes('PR #360  Evidence and Correction Batch'), 'roadmap must preserve bounded sequence through PR #360');
expect(roadmap.includes('REVIEW GATE'), 'roadmap review gate missing');
expect(governance.includes('A PR that cannot cite an approved work item must pause'), 'governance must enforce roadmap/spec traceability');
expect(agents.includes('A PR that cannot identify its roadmap item and governing specification must pause.'), 'AGENTS must enforce pre-implementation authority check');
expect(activeAmendment.includes('The selection is not a ranking.'), 'PR #354 amendment must preserve non-ranking selection semantics');
expect(activeAmendment.includes('no Market Access Record is added'), 'PR #354 amendment must preserve Market Access exclusion');

if (failures.length) {
  console.error('PR #354 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #353 Record Depth Baseline is complete and immutable, PR #354 Tier A Dossier Batch 1 is active for BUSD/DAI/RLUSD/USDC/USDT, PR #355 is next, and the bounded sequence remains review-gated after PR #360.');
