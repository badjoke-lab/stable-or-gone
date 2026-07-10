import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./validate-record-depth-baseline-pr353.mjs');
  await import('./validate-reviewed-tier-a-queue-pr353.mjs');
  await import('./validate-record-depth-reviewed-snapshots-pr353.mjs');
} finally {
  console.log = originalLog;
}

const readText = (file) => fs.readFileSync(file, 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const roadmap = readText('docs/roadmap.md');
const operatingSpec = readText('docs/post-351-data-growth-operating-spec.md');
const programAmendment = readText('docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md');
const activeAmendment = readText('docs/roadmap-amendments/2026-07-10-pr353-record-depth-baseline-activation.md');
const baselineSpec = readText('docs/quality/record-depth-coverage-baseline-spec.md');

requireText(roadmap, 'PR #352 post-351 authority reset: complete', 'roadmap');
requireText(roadmap, 'PR #353 Record Depth & Coverage Baseline: active', 'roadmap');
requireText(roadmap, 'PR #354 Tier A Dossier Deepening — Batch 1: next', 'roadmap');
requireText(roadmap, 'docs/migration/record-depth-baseline-pr353-summary.json', 'roadmap');
requireText(roadmap, 'docs/migration/tier-a-candidate-queue-pr353.json', 'roadmap');
requireText(activeAmendment, 'PR #353 Record Depth & Coverage Baseline: active', 'PR #353 amendment');
requireText(activeAmendment, 'PR #354 Tier A Dossier Deepening — Batch 1: next', 'PR #353 amendment');
requireText(operatingSpec, 'PR #353  Record Depth & Coverage Baseline', 'post-351 operating spec');
requireText(programAmendment, 'PR #353  Record Depth & Coverage Baseline', 'post-351 program amendment');
requireText(baselineSpec, 'exactly 110 canonical assets are evaluated', 'Record Depth baseline spec');
requireText(baselineSpec, 'no numeric composite score is emitted', 'Record Depth baseline spec');
requireText(baselineSpec, 'no asset rank is emitted', 'Record Depth baseline spec');
requireText(baselineSpec, 'docs/migration/record-depth-baseline-pr353-summary.json', 'Record Depth baseline spec');
requireText(baselineSpec, 'docs/migration/tier-a-candidate-queue-pr353.json', 'Record Depth baseline spec');

expect(roadmap.includes('PR #360  Evidence and Correction Batch'), 'roadmap must preserve bounded sequence through PR #360');
expect(roadmap.includes('REVIEW GATE'), 'roadmap review gate missing');
expect(activeAmendment.includes('Queue order must be deterministic and non-ranking.'), 'PR #353 queue non-ranking rule missing');
expect(activeAmendment.includes('no Market Access Record\n!= unavailable'), 'PR #353 Market Access absence semantic boundary missing');

if (failures.length) {
  console.error('PR #353 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #352 authority reset is complete, PR #353 Record Depth & Coverage Baseline is active with reviewed non-ranking Tier A queue and committed snapshot parity, PR #354 Tier A Dossier Batch 1 is next, and the bounded sequence remains review-gated after PR #360.');
