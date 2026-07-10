import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./check-workstream-106.mjs');
  await import('./validate-access-regulation-explorer-pr347.mjs');
} finally {
  console.log = originalLog;
}

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const amendment = readText('docs/roadmap-amendments/2026-07-10-pr347-access-regulation-explorer-activation.md');
const spec = readText('docs/quality/access-regulation-explorer-pr347-spec.md');
const config = readJson('config/access-regulation-explorer-v1.json');

requireText(amendment, 'PR #346 access and regulation index generator: complete', 'PR #347 amendment');
requireText(amendment, 'PR #347 Access & Regulation Explorer: active', 'PR #347 amendment');
requireText(amendment, 'PR #348 change-timeline projection generator: next', 'PR #347 amendment');
requireText(spec, 'The Explorer consumes the deterministic PR #346 index', 'Access Regulation Explorer spec');
requireText(spec, 'No Market Access Record does not mean unavailable.', 'Access Regulation Explorer spec');
requireText(spec, 'After PR #347 merges, PR #348 is authorized to build the change-timeline projection generator.', 'Access Regulation Explorer spec');

expect(config.schema_version === '1.0', 'PR #347 Explorer config schema version mismatch');
expect(config.config_id === 'sog_access_regulation_explorer_pr347_v1', 'PR #347 Explorer config ID mismatch');
expect(config.route === '/access-regulation/', 'PR #347 Explorer route mismatch');
expect(config.filters?.length === 9, 'PR #347 must expose nine UI filters');
expect(config.preserved_machine_axes?.length === 5, 'PR #347 must preserve five machine-only axes');
expect(config.presentation_contract?.single_composite_score === false, 'PR #347 must not create composite score');
expect(config.presentation_contract?.risk_ranking === false, 'PR #347 must not create risk ranking');
expect(config.presentation_contract?.no_absence_inference === true, 'PR #347 must preserve absence semantics');
expect(config.next_pr === 348, 'PR #347 next PR mismatch');

if (failures.length) {
  console.error('PR #347 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #346 canonical access/regulation index is complete, PR #347 Explorer is active with nine UI filters and five preserved machine axes, and PR #348 change-timeline projection is next.');
