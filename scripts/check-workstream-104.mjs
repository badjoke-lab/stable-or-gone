import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./check-workstream-103.mjs');
  await import('./validate-compare-v1-pr344.mjs');
} finally {
  console.log = originalLog;
}

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const amendment = readText('docs/roadmap-amendments/2026-07-10-pr344-compare-v1-activation.md');
const spec = readText('docs/quality/compare-v1-pr344-spec.md');
const config = readJson('config/compare-v1-dimensions.json');

requireText(amendment, 'PR #343 deterministic comparison projection and machine-readable output: complete', 'PR #344 amendment');
requireText(amendment, 'PR #344 /compare/ v1: active', 'PR #344 amendment');
requireText(amendment, 'PR #345 Compare presets: next', 'PR #344 amendment');
requireText(spec, 'The page must not silently choose a default asset set', 'Compare v1 spec');
requireText(spec, 'Every selected asset × facet cell contains:', 'Compare v1 spec');
requireText(spec, 'After PR #344 merges, PR #345 is authorized to define Compare presets.', 'Compare v1 spec');

const dimensions = (config.groups ?? []).flatMap((group) => group.dimensions ?? []);
expect(config.schema_version === '1.0', 'PR #344 compare config schema version mismatch');
expect(config.config_id === 'sog_compare_v1_dimensions_pr344', 'PR #344 compare config ID mismatch');
expect(config.groups?.length === 4, 'PR #344 must define 4 compare groups');
expect(dimensions.length === 19, 'PR #344 must expose all 19 projection dimensions');
expect(new Set(dimensions.map((row) => row.id)).size === 19, 'PR #344 dimension IDs must be unique');

if (failures.length) {
  console.error('PR #344 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #343 public comparison projection is complete, PR #344 /compare/ v1 is active with 2-4 asset selection and 19 facets, and PR #345 Compare presets is next.');
