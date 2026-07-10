import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./check-workstream-107.mjs');
  await import('./validate-change-timeline-pr348.mjs');
} finally {
  console.log = originalLog;
}

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const amendment = readText('docs/roadmap-amendments/2026-07-10-pr348-change-timeline-activation.md');
const spec = readText('docs/quality/change-timeline-pr348-spec.md');
const contract = readJson('data/quality/change-timeline-contract-v1.json');

requireText(amendment, 'PR #347 Access & Regulation Explorer: complete', 'PR #348 amendment');
requireText(amendment, 'PR #348 change-timeline projection generator: active', 'PR #348 amendment');
requireText(amendment, 'PR #349 Change Timeline UI: next', 'PR #348 amendment');
requireText(spec, 'The projection preserves the meaning of each date boundary', 'change timeline spec');
requireText(spec, 'Market Access `observed_at` does not become a change item', 'change timeline spec');
requireText(spec, 'After PR #348 merges, PR #349 is authorized to implement the public Change Timeline UI.', 'change timeline spec');

expect(contract.schema_version === '1.0', 'PR #348 contract schema version mismatch');
expect(contract.status === 'canonical_public_projection_contract', 'PR #348 contract status mismatch');
expect(contract.source_families?.length === 6, 'PR #348 must define six source families');
expect(contract.date_kinds?.length === 10, 'PR #348 must define ten date kinds');
expect(contract.projection_rules?.date_semantics_preserved === true, 'PR #348 must preserve date semantics');
expect(contract.projection_rules?.single_generic_timestamp === false, 'PR #348 must not emit generic timestamp semantics');
expect(contract.projection_rules?.review_dates_are_change_items === false, 'PR #348 must exclude review dates');
expect(contract.projection_rules?.freshness_dates_are_change_items === false, 'PR #348 must exclude freshness dates');
expect(contract.projection_rules?.single_composite_score === false, 'PR #348 must not create composite score');
expect(contract.projection_rules?.risk_ranking === false, 'PR #348 must not create risk ranking');
expect(contract.next_pr === 349, 'PR #348 next PR mismatch');

if (failures.length) {
  console.error('PR #348 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #347 Access & Regulation Explorer is complete, PR #348 canonical change timeline projection is active with preserved date semantics, and PR #349 Change Timeline UI is next.');
