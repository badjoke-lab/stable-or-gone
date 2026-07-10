import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./check-workstream-105.mjs');
  await import('./validate-access-regulation-index-pr346.mjs');
} finally {
  console.log = originalLog;
}

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const amendment = readText('docs/roadmap-amendments/2026-07-10-pr346-access-regulation-index-activation.md');
const spec = readText('docs/quality/access-regulation-index-pr346-spec.md');
const contract = readJson('data/quality/access-regulation-index-contract-v1.json');

requireText(amendment, 'PR #345 Compare presets: complete', 'PR #346 amendment');
requireText(amendment, 'PR #346 access and regulation index generator: active', 'PR #346 amendment');
requireText(amendment, 'PR #347 Access & Regulation Explorer: next', 'PR #346 amendment');
requireText(spec, 'The index exists to support the next Access & Regulation Explorer workstream.', 'access/regulation index spec');
requireText(spec, 'no regulatory note ≠ no regulatory action', 'access/regulation index spec');
requireText(spec, 'After PR #346 merges, PR #347 is authorized to implement the Access & Regulation Explorer.', 'access/regulation index spec');

expect(contract.schema_version === '1.0', 'PR #346 contract schema version mismatch');
expect(contract.status === 'canonical_public_index_contract', 'PR #346 contract status mismatch');
expect(contract.asset_count === 110, 'PR #346 contract asset count mismatch');
expect(contract.index_axes?.length === 14, 'PR #346 must define fourteen index axes');
expect(contract.data_safety?.canonical_only === true, 'PR #346 index must be canonical-only');
expect(contract.projection_rules?.single_composite_score === false, 'PR #346 must not create composite score');
expect(contract.projection_rules?.risk_ranking === false, 'PR #346 must not create risk ranking');
expect(contract.next_pr === 347, 'PR #346 next PR mismatch');

if (failures.length) {
  console.error('PR #346 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #345 Compare presets is complete, PR #346 canonical access/regulation index generation is active for 110 assets with fourteen non-scoring filter axes, and PR #347 Explorer is next.');
