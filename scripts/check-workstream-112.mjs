import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./check-workstream-111.mjs');
  await import('./validate-post351-authority-reset-pr352.mjs');
} finally {
  console.log = originalLog;
}

const readText = (file) => fs.readFileSync(file, 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const roadmap = readText('docs/roadmap.md');
const operatingSpec = readText('docs/post-351-data-growth-operating-spec.md');
const amendment = readText('docs/roadmap-amendments/2026-07-10-post-351-data-growth-activation.md');
const baselineSpec = readText('docs/quality/record-depth-coverage-baseline-spec.md');

requireText(roadmap, 'PR #352 post-351 authority reset: active', 'roadmap');
requireText(roadmap, 'PR #353 Record Depth & Coverage Baseline: next', 'roadmap');
requireText(amendment, 'current public-surface expansion sequence: complete', 'post-351 amendment');
requireText(operatingSpec, 'The default operating mode now changes from surface expansion to reviewed data growth and maintenance.', 'post-351 operating spec');
requireText(baselineSpec, 'Status: canonical specification for PR #353', 'Record Depth Baseline spec');
requireText(baselineSpec, 'The baseline is an internal planning instrument.', 'Record Depth Baseline spec');

expect(roadmap.includes('PR #360  Evidence and Correction Batch'), 'roadmap sequence must end at PR #360 before review gate');
expect(roadmap.includes('REVIEW GATE'), 'roadmap review gate missing');
expect(amendment.includes('No later PR number is pre-authorized by this amendment.'), 'amendment must stop pre-authorization after review gate');
expect(operatingSpec.includes('A new public-surface PR chain requires:'), 'surface-freeze approval rule missing');
expect(operatingSpec.includes('Every post-351 non-trivial PR must cite:'), 'mandatory post-351 reference rule missing');

if (failures.length) {
  console.error('PR #352 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #351 is complete, PR #352 authority reset is active, PR #353 Record Depth & Coverage Baseline is next, and the bounded sequence stops at the post-PR #360 review gate.');
