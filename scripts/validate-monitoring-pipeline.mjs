import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runMonitoring } from './monitoring/run.mjs';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const workflow = fs.readFileSync('.github/workflows/monitoring.yml', 'utf8');

for (const token of ['workflow_dispatch:', 'schedule:', 'contents: read', 'npm run monitor:review', 'node scripts/validate-monitoring-pipeline.mjs']) {
  check(workflow.includes(token), `monitoring workflow missing ${token}`);
}
for (const token of ['contents: write', 'pull-requests: write', 'wrangler', 'CLOUDFLARE_']) {
  check(!workflow.includes(token), `monitoring workflow contains forbidden ${token}`);
}
check(fs.readFileSync('.gitignore', 'utf8').split(/\r?\n/).includes('data-staging/monitoring/'), 'monitoring output must remain ignored');

const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sog-monitoring-'));
try {
  const result = runMonitoring({
    outputRoot: temporaryRoot,
    runId: 'validation-health-only',
    startedAt: '2026-09-03T00:00:00.000Z',
    sourceCommit: 'validation0000000000000000000000000000000000',
    sourceBranch: 'validation',
    mode: 'health-only'
  });
  const files = fs.readdirSync(result.run_directory).sort();
  check(JSON.stringify(files) === JSON.stringify(['health.json', 'manifest.json', 'summary.md']), 'health-only output file set changed');
  check(result.manifest.status === 'completed', 'health-only monitoring run must complete');
  check(result.manifest.external_network_used === false, 'health-only monitoring validation must not use external network');
  check(result.manifest.canonical_guard?.ok === true, 'canonical guard must pass');
  check((result.manifest.canonical_guard?.changed_paths ?? []).length === 0, 'monitoring validation changed canonical paths');
} catch (error) {
  failures.push(error instanceof Error ? error.message : String(error));
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

if (failures.length) {
  console.error('Monitoring validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('Monitoring workflow and read-only health path are valid.');
