import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./check-workstream-102.mjs');
  await import('./validate-comparison-projection-pr343.mjs');
} finally {
  console.log = originalLog;
}

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const amendment = readText('docs/roadmap-amendments/2026-07-10-pr343-comparison-projection-activation.md');
const spec = readText('docs/quality/comparison-projection-pr343-spec.md');
const contract = readJson('data/quality/comparison-projection-contract-v1.json');

requireText(amendment, 'PR #342 facet-freshness derivation contract and validators: complete', 'PR #343 amendment');
requireText(amendment, 'PR #343 deterministic comparison projection and machine-readable output: active', 'PR #343 amendment');
requireText(amendment, 'PR #344 /compare/ v1: next', 'PR #343 amendment');
requireText(spec, 'The projection joins three layers without collapsing them:', 'comparison projection spec');
requireText(spec, 'Internal normalization queues and internal audit reason lists are excluded.', 'comparison projection spec');
requireText(spec, 'After PR #343 merges, PR #344 is authorized to implement `/compare/` v1', 'comparison projection spec');

expect(contract.status === 'canonical_public_projection_contract', 'PR #343 projection contract status mismatch');
expect(contract.endpoint === '/data/comparison.json', 'PR #343 endpoint mismatch');
expect(contract.asset_count === 110, 'PR #343 projection asset count mismatch');
expect(contract.dimension_count === 19, 'PR #343 projection dimension count mismatch');
expect(contract.cell_count === 2090, 'PR #343 projection cell count mismatch');
expect(contract.data_safety?.canonical_only === true, 'PR #343 projection must be canonical-only');
expect(contract.projection_rules?.readiness_and_freshness_are_separate_axes === true, 'PR #343 readiness/freshness axes must remain separate');
expect(contract.projection_rules?.single_composite_score === false, 'PR #343 composite score must remain disabled');
expect(contract.next_pr === 344, 'PR #343 next PR mismatch');

if (failures.length) {
  console.error('PR #343 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #342 facet freshness is complete, PR #343 deterministic public comparison projection is active at /data/comparison.json, and PR #344 /compare/ v1 is next.');
