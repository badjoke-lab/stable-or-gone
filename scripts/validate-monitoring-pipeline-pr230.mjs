import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runMonitoring } from './monitoring/run.mjs';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);
const requiredFiles = [
  'docs/quality/monitoring-pipeline-spec.md',
  'scripts/monitoring/run.mjs',
  'scripts/monitoring/core/fs-utils.mjs',
  'scripts/monitoring/core/canonical-guard.mjs',
  'scripts/monitoring/monitors/repository-health.mjs',
  '.github/workflows/monitoring-review.yml'
];

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(path.join(root, relativePath))) fail(`missing monitoring file: ${relativePath}`);
}

const workflowPath = path.join(root, '.github/workflows/monitoring-review.yml');
if (fs.existsSync(workflowPath)) {
  const workflow = fs.readFileSync(workflowPath, 'utf8');
  for (const required of ['workflow_dispatch:', 'contents: read', 'npm run monitor:review', 'npm run validate:monitoring', 'actions/upload-artifact']) {
    if (!workflow.includes(required)) fail(`monitoring workflow missing: ${required}`);
  }
  for (const forbidden of ['schedule:', 'pull_request:', 'workflow_run:', 'contents: write', 'pull-requests: write', 'issues: write', 'wrangler', 'CLOUDFLARE_']) {
    if (workflow.includes(forbidden)) fail(`monitoring workflow contains forbidden token: ${forbidden}`);
  }
  if (/^\s*push:/m.test(workflow)) fail('monitoring workflow must not use push trigger');
}

const gitignore = fs.readFileSync(path.join(root, '.gitignore'), 'utf8');
if (!gitignore.split(/\r?\n/).includes('data-staging/monitoring/')) fail('.gitignore must exclude data-staging/monitoring/');

const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
if (packageJson.scripts?.['monitor:review'] !== 'node scripts/monitoring/run.mjs') fail('monitor:review package script mismatch');
if (packageJson.scripts?.['validate:monitoring'] !== 'node scripts/validate-monitoring-pipeline-pr230.mjs') fail('validate:monitoring package script mismatch');
if (!String(packageJson.scripts?.build ?? '').includes('npm run validate:monitoring')) fail('main build must run validate:monitoring');

const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sog-monitoring-pr230-'));
try {
  const result = runMonitoring({
    outputRoot: temporaryRoot,
    runId: '20260629T000000Z-test0000',
    startedAt: '2026-06-29T00:00:00.000Z',
    sourceCommit: 'test000000000000000000000000000000000000',
    sourceBranch: 'pr230-test',
    mode: 'health-only'
  });
  const files = fs.readdirSync(result.run_directory).sort();
  const expectedFiles = ['health.json', 'manifest.json', 'summary.md'];
  if (JSON.stringify(files) !== JSON.stringify(expectedFiles)) fail(`monitoring output file set mismatch: ${files.join(', ')}`);
  const manifest = JSON.parse(fs.readFileSync(path.join(result.run_directory, 'manifest.json'), 'utf8'));
  const health = JSON.parse(fs.readFileSync(path.join(result.run_directory, 'health.json'), 'utf8'));
  const summary = fs.readFileSync(path.join(result.run_directory, 'summary.md'), 'utf8');
  if (manifest.status !== 'completed') fail('test monitoring run must complete');
  if (manifest.mode !== 'health-only') fail('test monitoring mode must be health-only');
  if (manifest.external_network_used !== false) fail('PR #230 must report no external network use');
  if (!manifest.canonical_guard?.ok) fail('canonical guard must pass');
  if (manifest.canonical_guard?.changed_paths?.length !== 0) fail('canonical guard must report zero changed paths');
  if (manifest.canonical_guard?.before_hash !== manifest.canonical_guard?.after_hash) fail('canonical guard hashes must match');
  if (health.status !== 'ok' || health.candidate_count !== 0) fail('health report must be ok with zero candidates');
  if (health.parse_errors?.length !== 0 || health.missing_files?.length !== 0) fail('health report must have no parse or missing-file errors');
  for (const heading of ['# SOG Review-only Monitoring','## Run','## Canonical guard','## Repository health','## Candidate output','## Operator action','No canonical action required.']) {
    if (!summary.includes(heading)) fail(`summary missing: ${heading}`);
  }
} catch (error) {
  fail(`monitoring test run failed: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

const spec = fs.readFileSync(path.join(root, 'docs/quality/monitoring-pipeline-spec.md'), 'utf8');
for (const phrase of ['Monitoring must never write directly to canonical public data.','PR #230 — skeleton and canonical guard','external_network_used: false','No production deployment required']) {
  if (!spec.includes(phrase)) fail(`monitoring specification missing: ${phrase}`);
}

if (failures.length) {
  console.error('PR #230 monitoring pipeline validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('PR #230 monitoring pipeline valid: manual health-only run, zero candidates, canonical guard unchanged.');
