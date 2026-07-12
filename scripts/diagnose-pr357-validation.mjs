import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const checks = [
  ['current_audit', process.execPath, ['scripts/growth/build-tier-a-batch-3-current-audit-pr357.mjs', 'artifacts/pr357/diagnostic-current-audit.json']],
  ['impact_build', process.execPath, ['scripts/growth/build-tier-a-batch-3-impact-pr357.mjs', 'artifacts/pr357/diagnostic-impact.json']],
  ['impact_validate', process.execPath, ['scripts/validate-tier-a-dossier-batch-3-impact-pr357.mjs']],
  ['canonical_data', 'npm', ['run', 'validate:data']],
  ['profiles', 'npm', ['run', 'validate:profiles']],
  ['legal_boundaries', process.execPath, ['scripts/validate-tier-a-dossier-batch-3-legal-pr357.mjs']],
  ['evidence_relations', 'npm', ['run', 'validate:evidence-relations-v2']],
  ['registry_v3', 'npm', ['run', 'validate:v3']],
  ['parity', 'npm', ['run', 'validate:parity']],
  ['release_integrity', 'npm', ['run', 'validate:release-integrity']],
  ['deterministic_stats', process.execPath, ['scripts/build-stats.mjs']],
];

const results = checks.map(([name, command, args]) => {
  const run = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 20 * 1024 * 1024,
  });
  const output = `${run.stdout ?? ''}\n${run.stderr ?? ''}`.trim();
  return {
    name,
    ok: run.status === 0,
    status: run.status,
    signal: run.signal,
    output_tail: output.split('\n').slice(-40).join('\n'),
  };
});

const report = {
  schema_version: '1.0',
  diagnostic_id: 'sog_pr357_validation_matrix',
  ok: results.every((row) => row.ok),
  results,
};
fs.mkdirSync('artifacts/pr357', { recursive: true });
fs.writeFileSync('artifacts/pr357/validation-matrix.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ok: report.ok, checks: Object.fromEntries(results.map((row) => [row.name, row.ok]))}, null, 2));
