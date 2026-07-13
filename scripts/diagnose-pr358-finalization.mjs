import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const checks = [
  ['selection_promotion', process.execPath, ['scripts/validate-record-growth-batch-1-selection-pr358.mjs']],
  ['full_records', process.execPath, ['scripts/validate-record-growth-batch-1-full-records-pr358.mjs']],
  ['canonical_data', 'npm', ['run', 'validate:data']],
  ['v3_parity', 'npm', ['run', 'validate:parity']],
  ['release_integrity', 'npm', ['run', 'validate:release-integrity']],
  ['build_stats', process.execPath, ['scripts/build-stats.mjs']],
  ['validate_stats', process.execPath, ['scripts/validate-stats.mjs']],
  ['stats_history', process.execPath, ['scripts/validate-stats-history.mjs']],
  ['astro_check', 'npm', ['run', 'check']],
  ['build', 'npm', ['run', 'build']],
  ['public_verify', 'npm', ['run', 'verify:public']],
];

const results = checks.map(([name, command, args]) => {
  const env = {...process.env};
  if (name === 'stats_history') env.SOG_STATS_HISTORY_BASE_REF = 'origin/main';
  if (name === 'validate_stats') env.SOG_STATS_VALIDATE_OUTPUT = 'artifacts/stats-current.json';
  const run = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    env,
    maxBuffer: 40 * 1024 * 1024,
  });
  const output = `${run.stdout ?? ''}\n${run.stderr ?? ''}`.trim();
  return {
    name,
    ok: run.status === 0,
    status: run.status,
    signal: run.signal,
    output_tail: output.split('\n').slice(-60).join('\n'),
  };
});

const report = {
  schema_version: '1.0',
  diagnostic_id: 'sog_pr358_finalization_validation_matrix',
  ok: results.every((row) => row.ok),
  results,
};
fs.mkdirSync('artifacts/pr358', {recursive: true});
fs.writeFileSync('artifacts/pr358/finalization-matrix.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ok: report.ok, checks: Object.fromEntries(results.map((row) => [row.name, row.ok]))}, null, 2));
