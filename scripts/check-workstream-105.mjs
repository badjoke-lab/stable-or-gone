import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./check-workstream-104.mjs');
  await import('./validate-compare-presets-pr345.mjs');
} finally {
  console.log = originalLog;
}

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const amendment = readText('docs/roadmap-amendments/2026-07-10-pr345-compare-presets-activation.md');
const spec = readText('docs/quality/compare-presets-pr345-spec.md');
const presets = readJson('config/compare-v1-presets.json');

requireText(amendment, 'PR #344 /compare/ v1: complete', 'PR #345 amendment');
requireText(amendment, 'PR #345 Compare presets: active', 'PR #345 amendment');
requireText(amendment, 'PR #346 access and regulation index generator: next', 'PR #345 amendment');
requireText(spec, 'Presets are editorial shortcuts for choosing:', 'Compare preset spec');
requireText(spec, 'Any manual divergence clears active preset identity.', 'Compare preset spec');
requireText(spec, 'After PR #345 merges, PR #346 is authorized to build the access and regulation index generator.', 'Compare preset spec');

expect(presets.schema_version === '1.0', 'PR #345 preset config schema version mismatch');
expect(presets.config_id === 'sog_compare_presets_pr345_v1', 'PR #345 preset config ID mismatch');
expect(presets.presets?.length === 5, 'PR #345 must define five presets');
expect(presets.selection_contract?.presets_change_values === false, 'PR #345 presets must not change values');
expect(presets.selection_contract?.presets_change_readiness === false, 'PR #345 presets must not change readiness');
expect(presets.selection_contract?.presets_change_freshness === false, 'PR #345 presets must not change freshness');
expect(presets.selection_contract?.presets_create_scores === false, 'PR #345 presets must not create scores');

if (failures.length) {
  console.error('PR #345 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #344 Compare v1 is complete, PR #345 defines five bounded asset/group presets without changing projection values or scoring, and PR #346 access and regulation index generation is next.');
