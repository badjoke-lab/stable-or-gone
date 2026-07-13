import { spawnSync } from 'node:child_process';
import fs from 'node:fs';

const checks = [
  ['validate_guides', 'npm', ['run', 'validate:guides']],
  ['generate_deployment_taxonomy', 'npm', ['run', 'generate:deployment-taxonomy']],
  ['generate_provenance', 'npm', ['run', 'generate:provenance']],
  ['astro_build', 'npx', ['astro', 'build']],
];

const results = checks.map(([name, command, args]) => {
  const run = spawnSync(command, args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: process.env,
    maxBuffer: 40 * 1024 * 1024,
  });
  const output = `${run.stdout ?? ''}\n${run.stderr ?? ''}`.trim();
  return {
    name,
    ok: run.status === 0,
    status: run.status,
    output_tail: output.split('\n').slice(-100).join('\n'),
  };
});

const report = { schema_version: '1.0', diagnostic_id: 'sog_pr358_build_diagnostic', ok: results.every((row) => row.ok), results };
fs.mkdirSync('artifacts/pr358', { recursive: true });
fs.writeFileSync('artifacts/pr358/build-diagnostic.json', `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ok: report.ok, checks: Object.fromEntries(results.map((row) => [row.name, row.ok]))}, null, 2));
