import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./validate-tier-a-dossier-batch-2-selection-pr355.mjs');
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
const priorAmendment = readText('docs/roadmap-amendments/2026-07-10-pr354-tier-a-batch-1-activation.md');
const activeAmendment = readText('docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md');
const workItemSpec = readText('docs/quality/tier-a-dossier-batch-2-pr355-spec.md');
const handoff = readText('docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json');

for (const [file, body] of [
  ['README.md', readme],
  ['AGENTS.md', agents],
  ['docs/spec-governance.md', governance],
  ['docs/roadmap.md', roadmap]
]) {
  requireText(body, 'Canonical stable assets: 110', file);
  requireText(body, 'PR #353 Record Depth & Coverage Baseline: complete', file);
  requireText(body, 'PR #354 Tier A Dossier Deepening — Batch 1: complete', file);
  requireText(body, 'PR #355 Tier A Dossier Deepening — Batch 2: active', file);
  requireText(body, 'PR #356 Market Access Pilot 1: next', file);
  requireText(body, 'docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md', file);
  requireText(body, 'docs/quality/tier-a-dossier-batch-2-pr355-spec.md', file);
  requireText(body, 'docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json', file);
}

requireText(operatingSpec, 'PR #355  Tier A Dossier Deepening — Batch 2', 'post-351 operating spec');
requireText(programAmendment, 'PR #355  Tier A Dossier Deepening — Batch 2', 'post-351 program amendment');
requireText(baselineAmendment, 'PR #354 Tier A Dossier Deepening — Batch 1: active', 'historical PR #353 handoff amendment');
requireText(priorAmendment, 'PR #355 Tier A Dossier Deepening — Batch 2: next', 'PR #354 amendment');
requireText(activeAmendment, 'PR #355 Tier A Dossier Deepening — Batch 2: active', 'PR #355 amendment');
requireText(activeAmendment, 'PR #356 Market Access Pilot 1: next', 'PR #355 amendment');
requireText(workItemSpec, 'docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json', 'PR #355 work-item spec');
requireText(workItemSpec, 'Only these three assets are authorized for redemption field-value changes in PR #355:', 'PR #355 work-item spec');
requireText(handoff, 'd8a10676aec2f190bc32923fdc547ef359feb5c8', 'PR #354 reviewed handoff');

for (const asset of ['FDUSD', 'FRAX', 'PYUSD', 'USDP', 'UST']) {
  requireText(activeAmendment, asset, 'PR #355 amendment');
  requireText(workItemSpec, asset, 'PR #355 work-item spec');
}

for (const completed of ['busd', 'dai', 'rlusd', 'usdc', 'usdt']) {
  requireText(handoff, completed, 'PR #354 reviewed handoff');
}

expect(roadmap.includes('PR #360  Evidence and Correction Batch'), 'roadmap must preserve bounded sequence through PR #360');
expect(roadmap.includes('REVIEW GATE'), 'roadmap review gate missing');
expect(governance.includes('A PR that cannot cite an approved work item must pause'), 'governance must enforce roadmap/spec traceability');
expect(agents.includes('A PR that cannot identify its roadmap item and governing specification must pause.'), 'AGENTS must enforce pre-implementation authority check');
expect(activeAmendment.includes('The selection is not a ranking.'), 'PR #355 amendment must preserve non-ranking semantics');
expect(activeAmendment.includes('Market Access record count remains zero'), 'PR #355 amendment must preserve Market Access exclusion');

if (failures.length) {
  console.error('PR #355 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #354 Batch 1 is complete with a reviewed handoff, PR #355 Batch 2 is active for FDUSD/FRAX/PYUSD/USDP/UST, PR #356 Market Access Pilot 1 is next, and the sequence remains review-gated after PR #360.');
