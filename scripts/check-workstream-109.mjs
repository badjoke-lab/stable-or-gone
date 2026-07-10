import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./check-workstream-108.mjs');
  await import('./validate-change-timeline-ui-pr349.mjs');
} finally {
  console.log = originalLog;
}

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const amendment = readText('docs/roadmap-amendments/2026-07-10-pr349-change-timeline-ui-activation.md');
const spec = readText('docs/quality/change-timeline-ui-pr349-spec.md');
const config = readJson('config/change-timeline-ui-v1.json');

requireText(amendment, 'PR #348 change-timeline projection generator: complete', 'PR #349 amendment');
requireText(amendment, 'PR #349 Change Timeline UI: active', 'PR #349 amendment');
requireText(amendment, 'PR #350 Update Feed: next', 'PR #349 amendment');
requireText(spec, 'The UI exposes reviewed canonical change history while preserving each source date\'s meaning.', 'Change Timeline UI spec');
requireText(spec, 'Review dates excluded', 'Change Timeline page contract');
requireText(spec, 'After PR #349 merges, PR #350 is authorized to implement the public Update Feed.', 'Change Timeline UI spec');

expect(config.schema_version === '1.0', 'PR #349 Timeline UI config schema version mismatch');
expect(config.config_id === 'sog_change_timeline_ui_pr349_v1', 'PR #349 Timeline UI config ID mismatch');
expect(config.route === '/timeline/', 'PR #349 Timeline route mismatch');
expect(config.filters?.length === 6, 'PR #349 must expose six UI filters');
expect(config.preserved_machine_axes?.length === 1 && config.preserved_machine_axes[0] === 'change_type', 'PR #349 must preserve change_type as machine-only');
expect(config.presentation_contract?.preserve_projection_order === true, 'PR #349 must preserve projection order');
expect(config.presentation_contract?.show_date_semantics === true, 'PR #349 must show date semantics');
expect(config.presentation_contract?.single_generic_timestamp === false, 'PR #349 must reject generic timestamp collapse');
expect(config.presentation_contract?.review_dates_are_change_items === false, 'PR #349 must exclude review dates');
expect(config.presentation_contract?.freshness_dates_are_change_items === false, 'PR #349 must exclude freshness dates');
expect(config.presentation_contract?.single_composite_score === false, 'PR #349 must not create score');
expect(config.presentation_contract?.risk_ranking === false, 'PR #349 must not create ranking');
expect(config.next_pr === 350, 'PR #349 next PR mismatch');

if (failures.length) {
  console.error('PR #349 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #348 change timeline projection is complete, PR #349 Change Timeline UI is active with preserved source/date/boundary semantics, and PR #350 Update Feed is next.');
