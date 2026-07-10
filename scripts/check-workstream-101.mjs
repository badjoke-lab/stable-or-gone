import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./check-workstream-100.mjs');
  await import('./build-market-access-migration-review-pr341.mjs');
  await import('./validate-market-access-foundation-pr341.mjs');
} finally {
  console.log = originalLog;
}

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const amendment = readText('docs/roadmap-amendments/2026-07-10-pr341-market-access-foundation-activation.md');
const spec = readText('docs/market-access-record-spec.md');
const foundation = readJson('docs/migration/market-access-record-foundation-pr341.json');
const governance = readJson('config/market-access-governance-v1.json');
const canonicalRecords = readJson('data/market-access-records-v1.json');

requireText(amendment, 'PR #338 bounded asset_class normalization and same-count statistics checkpoint: complete', 'PR #341 amendment');
requireText(amendment, 'PR #340 site-wide text hierarchy and readability remediation: complete', 'PR #341 amendment');
requireText(amendment, 'PR #341 canonical Market Access Record schema and governance: active', 'PR #341 amendment');
requireText(amendment, 'PR #342 facet-freshness derivation contract and validators: next', 'PR #341 amendment');
requireText(spec, 'One canonical record contains exactly one function.', 'Market Access Record spec');
requireText(spec, 'PR #341 does not change Comparison Readiness output.', 'Market Access Record spec');

expect(foundation.status === 'schema_and_governance_foundation', 'PR #341 foundation status mismatch');
expect(foundation.canonical_record_count === 0, 'PR #341 canonical Market Access count must remain zero');
expect(foundation.next_item === 'PR #342 facet-freshness derivation contract and validators', 'PR #341 next item mismatch');
expect(governance.pr341_boundary?.create_schema_and_governance === true, 'PR #341 schema/governance boundary missing');
expect(governance.pr341_boundary?.promote_pr339_rows_to_canonical === false, 'PR #341 must not promote PR #339 rows');
expect(governance.pr341_boundary?.change_comparison_readiness_output === false, 'PR #341 must not change comparison readiness output');
expect(Array.isArray(canonicalRecords) && canonicalRecords.length === 0, 'PR #341 canonical Market Access entrypoint must remain empty');

if (failures.length) {
  console.error('PR #341 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #338 normalization is complete, PR #339 and PR #340 insertions are complete, PR #341 Market Access schema and governance is active with zero canonical records, and PR #342 facet-freshness is next.');
