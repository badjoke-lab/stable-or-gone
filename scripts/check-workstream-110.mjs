import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./check-workstream-109.mjs');
  await import('./validate-update-feed-pr350.mjs');
} finally {
  console.log = originalLog;
}

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const amendment = readText('docs/roadmap-amendments/2026-07-10-pr350-update-feed-activation.md');
const spec = readText('docs/quality/update-feed-pr350-spec.md');
const config = readJson('config/update-feed-v1.json');

requireText(amendment, 'PR #349 Change Timeline UI: complete', 'PR #350 amendment');
requireText(amendment, 'PR #350 Update Feed: active', 'PR #350 amendment');
requireText(amendment, 'PR #351 monthly maintenance log: next', 'PR #350 amendment');
requireText(spec, 'The feed answers:', 'Update Feed spec');
requireText(spec, 'publication_date', 'Update Feed spec');
requireText(spec, 'After PR #350 merges, PR #351 is authorized to implement the monthly maintenance log', 'Update Feed spec');

expect(config.schema_version === '1.0', 'PR #350 Update Feed config schema version mismatch');
expect(config.config_id === 'sog_update_feed_pr350_v1', 'PR #350 Update Feed config ID mismatch');
expect(config.source_file === 'data/registry-updates.json', 'PR #350 source-file mismatch');
expect(config.route === '/updates/', 'PR #350 route mismatch');
expect(config.filters?.length === 3, 'PR #350 must expose three UI filters');
expect(config.semantics?.publication_change_not_subject_change === true, 'PR #350 must separate publication changes from subject changes');
expect(config.semantics?.timeline_items_are_feed_items === false, 'PR #350 must not ingest Timeline items');
expect(config.semantics?.historical_subject_dates_are_feed_dates === false, 'PR #350 must not use subject dates as feed dates');
expect(config.semantics?.live_monitoring_feed === false, 'PR #350 must not be live monitoring feed');
expect(config.next_pr === 351, 'PR #350 next PR mismatch');

if (failures.length) {
  console.error('PR #350 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #349 Change Timeline UI is complete, PR #350 Update Feed is active with publication-date semantics separated from historical subject dates, and PR #351 monthly maintenance log is next.');
