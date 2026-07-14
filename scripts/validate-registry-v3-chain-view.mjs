import { spawnSync } from 'node:child_process';

const result = spawnSync(process.execPath, [
  'scripts/validate-registry-v3-deployments-batch-o.mjs',
  '--base-validator=scripts/validate-registry-v3-deployments.mjs'
], {
  cwd: process.cwd(),
  stdio: 'inherit',
  env: process.env
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
