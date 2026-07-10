import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./check-workstream-101.mjs');
  await import('./validate-facet-freshness-contract-pr342.mjs');
} finally {
  console.log = originalLog;
}

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const amendment = readText('docs/roadmap-amendments/2026-07-10-pr342-facet-freshness-activation.md');
const spec = readText('docs/quality/facet-freshness-pr342-spec.md');
const contract = readJson('data/quality/facet-freshness-contract-v1.json');

requireText(amendment, 'PR #341 canonical Market Access Record schema and governance: complete', 'PR #342 amendment');
requireText(amendment, 'PR #342 facet-freshness derivation contract and validators: active', 'PR #342 amendment');
requireText(amendment, 'PR #343 deterministic comparison projection and machine-readable output: next', 'PR #342 amendment');
requireText(spec, 'Freshness does not answer:', 'facet freshness spec');
requireText(spec, 'no Market Access Record does not mean unavailable;', 'facet freshness spec');
requireText(spec, 'PR #343 may consume both Comparison Readiness and PR #342 freshness metadata', 'facet freshness spec');

expect(contract.status === 'canonical_internal_derivation_contract', 'PR #342 freshness contract status mismatch');
expect(contract.as_of_date === '2026-07-10', 'PR #342 deterministic as_of_date mismatch');
expect(contract.dimension_rules?.length === 19, 'PR #342 must define 19 facet freshness rules');
expect(contract.output_contract?.asset_count === 110, 'PR #342 output asset count mismatch');
expect(contract.output_contract?.dimension_count === 19, 'PR #342 output dimension count mismatch');
expect(contract.output_contract?.cell_count === 2090, 'PR #342 output cell count mismatch');
expect(contract.output_contract?.public_output === false, 'PR #342 output must remain internal');
expect(contract.output_contract?.next_pr === 343, 'PR #342 next PR mismatch');

if (failures.length) {
  console.error('PR #342 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #341 Market Access foundation is complete, PR #342 facet freshness derivation is active with a 110 x 19 internal canonical-only contract, and PR #343 deterministic comparison projection is next.');
