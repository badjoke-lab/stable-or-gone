import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./check-workstream-110.mjs');
  await import('./validate-maintenance-log-pr351.mjs');
} finally {
  console.log = originalLog;
}

const readText = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const amendment = readText('docs/roadmap-amendments/2026-07-10-pr351-monthly-maintenance-log-activation.md');
const spec = readText('docs/quality/monthly-maintenance-log-pr351-spec.md');
const config = readJson('config/monthly-maintenance-log-v1.json');

requireText(amendment, 'PR #350 Update Feed: complete', 'PR #351 amendment');
requireText(amendment, 'PR #351 monthly maintenance log: active', 'PR #351 amendment');
requireText(amendment, 'current public-surface expansion sequence: closes after PR #351', 'PR #351 amendment');
requireText(spec, 'The log exposes public-safe aggregate operational outcomes', 'Maintenance Log spec');
requireText(spec, 'closed months are immutable', 'Maintenance Log spec');
requireText(spec, 'After PR #351 merges, the current public-surface expansion sequence is complete.', 'Maintenance Log spec');

expect(config.schema_version === '1.0', 'PR #351 Maintenance config schema version mismatch');
expect(config.config_id === 'sog_monthly_maintenance_log_pr351_v1', 'PR #351 Maintenance config ID mismatch');
expect(config.route === '/maintenance/', 'PR #351 Maintenance route mismatch');
expect(config.entry_policy?.closed_months_immutable === true, 'PR #351 must preserve closed-month immutability');
expect(config.public_safety?.aggregate_outcomes_only === true, 'PR #351 must expose aggregate outcomes only');
expect(config.public_safety?.includes_internal_monitoring_rows === false, 'PR #351 must exclude internal monitoring rows');
expect(config.public_safety?.includes_unreviewed_candidates === false, 'PR #351 must exclude unreviewed candidates');
expect(config.semantics?.operational_log_not_subject_history === true, 'PR #351 must separate maintenance from subject history');
expect(config.semantics?.operational_log_not_publication_feed === true, 'PR #351 must separate maintenance from publication feed');
expect(config.next_state === 'public_surface_expansion_sequence_complete', 'PR #351 must close current public-surface sequence');

if (failures.length) {
  console.error('PR #351 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #350 Update Feed is complete, PR #351 public monthly Maintenance Log is active, and the current public-surface expansion sequence closes after PR #351.');
