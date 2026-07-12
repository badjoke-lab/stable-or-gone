import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const checks = [
  ['market_access_pilot', process.execPath, ['scripts/validate-market-access-pilot-1-pr356.mjs']],
  ['active_workstream', process.execPath, ['scripts/check-workstream-116.mjs']],
  ['canonical_data', 'npm', ['run', 'validate:data']],
  ['registry_parity', 'npm', ['run', 'validate:parity']],
  ['release_integrity', 'npm', ['run', 'validate:release-integrity']],
];

const results = checks.map(([name, command, args]) => {
  const run = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 10 * 1024 * 1024,
  });
  const combined = `${run.stdout ?? ''}\n${run.stderr ?? ''}`.trim();
  return {
    name,
    ok: run.status === 0,
    status: run.status,
    signal: run.signal,
    output_tail: combined.split('\n').slice(-30).join('\n'),
  };
});

const report = {
  schema_version: '1.0',
  diagnostic_id: 'sog_pr356_validation_matrix',
  ok: results.every((row) => row.ok),
  results,
};
fs.mkdirSync('artifacts/pr356', { recursive: true });
fs.writeFileSync('artifacts/pr356/validation-matrix.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  ok: report.ok,
  checks: Object.fromEntries(results.map((row) => [row.name, row.ok])),
}, null, 2));
