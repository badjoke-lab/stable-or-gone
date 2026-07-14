import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const checks = [
  ['pilot_2', process.execPath, ['scripts/validate-market-access-pilot-2-pr359.mjs']],
  ['active_workstream', 'npm', ['run', 'validate:active-workstream']],
  ['canonical_data', 'npm', ['run', 'validate:data']],
  ['classification', 'npm', ['run', 'validate:classification']],
  ['profiles', 'npm', ['run', 'validate:profiles']],
  ['evidence_relations', 'npm', ['run', 'validate:evidence-relations-v2']],
  ['registry_v3', 'npm', ['run', 'validate:v3']],
  ['deployments_v3', 'npm', ['run', 'validate:deployments-v3']],
  ['income_v3', 'npm', ['run', 'validate:income-v3']],
  ['parity', 'npm', ['run', 'validate:parity']],
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
  if (name === 'validate_stats') env.SOG_STATS_VALIDATE_OUTPUT = 'artifacts/stats-current.json';
  if (name === 'stats_history') env.SOG_STATS_HISTORY_BASE_REF = 'origin/main';
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
  diagnostic_id: 'sog_pr359_validation_matrix',
  ok: results.every((row) => row.ok),
  results,
};
fs.mkdirSync('artifacts/pr359', {recursive: true});
fs.writeFileSync('artifacts/pr359/validation-matrix.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ok: report.ok, checks: Object.fromEntries(results.map((row) => [row.name, row.ok]))}, null, 2));
