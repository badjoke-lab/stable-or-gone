import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const checks = [
  ['selection', process.execPath, ['scripts/validate-record-growth-batch-1-selection-pr358.mjs']],
  ['active_workstream', process.execPath, ['scripts/check-workstream-118.mjs']],
  ['canonical_data', 'npm', ['run', 'validate:data']],
  ['parity', 'npm', ['run', 'validate:parity']],
  ['release_integrity', 'npm', ['run', 'validate:release-integrity']],
  ['build_stats', process.execPath, ['scripts/build-stats.mjs']],
  ['stats_history', process.execPath, ['scripts/validate-stats-history.mjs']],
  ['astro_check', 'npm', ['run', 'check']],
  ['build', 'npm', ['run', 'build']],
  ['public_verify', 'npm', ['run', 'verify:public']],
];

const results = checks.map(([name, command, args]) => {
  const env = {...process.env};
  if (name === 'stats_history') env.SOG_STATS_HISTORY_BASE_REF = 'origin/main';
  const run = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    env,
    maxBuffer: 30 * 1024 * 1024,
  });
  const output = `${run.stdout ?? ''}\n${run.stderr ?? ''}`.trim();
  return {
    name,
    ok: run.status === 0,
    status: run.status,
    signal: run.signal,
    output_tail: output.split('\n').slice(-50).join('\n'),
  };
});

const report = {
  schema_version: '1.0',
  diagnostic_id: 'sog_pr358_candidate_stage_validation_matrix',
  ok: results.every((row) => row.ok),
  results,
};
fs.mkdirSync('artifacts/pr358', {recursive: true});
fs.writeFileSync('artifacts/pr358/validation-matrix.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ok: report.ok, checks: Object.fromEntries(results.map((row) => [row.name, row.ok]))}, null, 2));
