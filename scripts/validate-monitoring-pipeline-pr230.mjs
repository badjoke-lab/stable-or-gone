import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runMonitoring } from './monitoring/run.mjs';
import './validate-monitoring-pipeline-pr231.mjs';
import './validate-monitoring-pipeline-pr232.mjs';
import './validate-monitoring-baseline-pr234.mjs';
import './validate-monitoring-change-detection-pr235.mjs';
import './validate-monitoring-baseline-update-pr236.mjs';
import './validate-monitoring-observation-classification-pr237.mjs';
import './validate-monitoring-normalization-pr238.mjs';
import './validate-monitoring-phase-a-pr239.mjs';
import './validate-current-monitoring-configuration.mjs';
import './validate-current-coverage.mjs';
import './validate-monitoring-baseline-sync-100-assets.mjs';
import './validate-monitoring-reserve-redemption-expansion-100-assets.mjs';
import './validate-monitoring-scoped-source-schema-pr323.mjs';
import './validate-monitoring-lifecycle-regulatory-market-access-expansion-100-assets.mjs';
import './validate-bounded-scheduled-monitoring-pr324.mjs';

const errors = [];
const check = (value, message) => { if (!value) errors.push(message); };
const workflow = fs.readFileSync('.github/workflows/monitoring-review.yml', 'utf8');
const scopedWorkflow = fs.readFileSync('.github/workflows/monitoring-lifecycle-regulatory-market-access-expansion.yml', 'utf8');
const scheduledWorkflow = fs.readFileSync('.github/workflows/monitoring-bounded-scheduled-read-only.yml', 'utf8');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

for (const token of ['workflow_dispatch:', 'contents: read', 'npm run monitor:review', 'actions/upload-artifact']) check(workflow.includes(token), `workflow missing ${token}`);
for (const token of ['schedule:', 'pull_request:', 'workflow_run:', 'contents: write', 'pull-requests: write', 'wrangler', 'CLOUDFLARE_']) check(!workflow.includes(token), `workflow contains forbidden ${token}`);
check(!/^\s*push:/m.test(workflow), 'workflow must not use push trigger');
check(fs.readFileSync('.gitignore', 'utf8').split(/\r?\n/).includes('data-staging/monitoring/'), 'monitoring output must be ignored');
check(packageJson.scripts?.['monitor:review'] === 'node scripts/monitoring/run.mjs', 'monitor:review script mismatch');
check(packageJson.scripts?.['validate:monitoring'] === 'node scripts/validate-monitoring-pipeline-pr230.mjs', 'validate:monitoring script mismatch');
for (const token of ['Validate full monitoring chain', 'npm run validate:monitoring', 'contents: read']) {
  check(scopedWorkflow.includes(token), `PR #323 monitoring CI missing ${token}`);
}
for (const token of ['schedule:', 'workflow_dispatch:', 'contents: read', 'SOG_MONITORING_SCHEDULE_GROUP', 'actions/upload-artifact@v4']) {
  check(scheduledWorkflow.includes(token), `PR #324 scheduled workflow missing ${token}`);
}

const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sog-monitoring-current-'));
try {
  const result = runMonitoring({
    outputRoot: temporaryRoot,
    runId: '20260707T000000Z-test0000',
    startedAt: '2026-07-07T00:00:00.000Z',
    sourceCommit: 'test000000000000000000000000000000000000',
    sourceBranch: 'monitoring-scheduled-operation-test',
    mode: 'health-only'
  });
  const files = fs.readdirSync(result.run_directory).sort();
  check(JSON.stringify(files) === JSON.stringify(['health.json','manifest.json','summary.md']), 'health-only file set mismatch');
  check(result.manifest.status === 'completed', 'health-only run must complete');
  check(result.manifest.schedule_group === null, 'manual health-only run must remain unscheduled');
  check(result.manifest.external_network_used === false, 'health-only run must not use network');
  check(result.manifest.canonical_guard?.ok === true, 'canonical guard must pass');
  check(result.manifest.canonical_guard?.changed_paths?.length === 0, 'canonical paths changed');
  check(result.health.candidate_count === 0, 'health-only candidates must be zero');
} catch (error) {
  errors.push(error instanceof Error ? error.message : String(error));
} finally {
  fs.rmSync(temporaryRoot, { recursive:true, force:true });
}

if (errors.length) {
  console.error('Monitoring validation failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log('Current monitoring validation passed for the current 42-source boundary with bounded daily and weekly read-only schedules.');
