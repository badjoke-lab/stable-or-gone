import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { captureCanonicalSnapshot, compareCanonicalSnapshots } from './core/canonical-guard.mjs';
import { ensureDir, writeJson, writeText } from './core/fs-utils.mjs';
import { runRepositoryHealthMonitor } from './monitors/repository-health.mjs';

const root = process.cwd();

function gitValue(args, fallback) {
  try {
    return execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim() || fallback;
  } catch {
    return fallback;
  }
}

function compactUtc(value) {
  return value.replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

function resolveCommit() {
  return process.env.SOG_MONITORING_COMMIT || process.env.GITHUB_SHA || gitValue(['rev-parse', 'HEAD'], 'unknown');
}

function resolveBranch() {
  return process.env.SOG_MONITORING_BRANCH || process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME || gitValue(['branch', '--show-current'], 'unknown');
}

function resolveRunId(startedAt, commit) {
  return process.env.SOG_MONITORING_RUN_ID || `${compactUtc(startedAt)}-${String(commit).slice(0, 8)}`;
}

function summaryText(manifest, health) {
  const guard = manifest.canonical_guard;
  return [
    '# SOG Review-only Monitoring',
    '',
    '## Run',
    '',
    `- Run ID: \`${manifest.run_id}\``,
    `- Mode: \`${manifest.mode}\``,
    `- Status: \`${manifest.status}\``,
    `- Source commit: \`${manifest.source_commit}\``,
    `- External network used: \`${manifest.external_network_used}\``,
    '',
    '## Canonical guard',
    '',
    `- Before: \`${guard.before_hash}\``,
    `- After: \`${guard.after_hash}\``,
    `- Changed paths: ${guard.changed_paths.length}`,
    '',
    '## Repository health',
    '',
    `- Status: \`${health.status}\``,
    `- Canonical files: ${health.canonical_file_count}`,
    `- Canonical JSON files: ${health.canonical_json_file_count}`,
    `- Parse errors: ${health.parse_errors.length}`,
    `- Missing files: ${health.missing_files.length}`,
    '',
    '## Candidate output',
    '',
    `- Candidates: ${health.candidate_count}`,
    '- Public or canonical writes: 0',
    '',
    '## Operator action',
    '',
    manifest.status === 'completed' ? 'No canonical action required.' : 'Review the failed health or canonical-guard finding before any further work.',
    ''
  ].join('\n');
}

export function runMonitoring(options = {}) {
  const startedAt = options.startedAt || new Date().toISOString();
  const sourceCommit = options.sourceCommit || resolveCommit();
  const sourceBranch = options.sourceBranch || resolveBranch();
  const runId = options.runId || resolveRunId(startedAt, sourceCommit);
  const mode = options.mode || process.env.SOG_MONITORING_MODE || 'health-only';
  if (mode !== 'health-only') throw new Error(`Unsupported monitoring mode for PR #230: ${mode}`);

  const outputRoot = options.outputRoot || path.join(root, 'data-staging/monitoring');
  const runDirectory = path.join(outputRoot, runId);
  ensureDir(runDirectory);

  const before = captureCanonicalSnapshot(root);
  const health = runRepositoryHealthMonitor(root, startedAt);
  const after = captureCanonicalSnapshot(root);
  const canonicalGuard = compareCanonicalSnapshots(before, after);
  const finishedAt = new Date().toISOString();
  const status = health.status === 'ok' && canonicalGuard.ok ? 'completed' : 'failed';

  const manifest = {
    schema_version: '1.0',
    run_id: runId,
    mode,
    started_at: startedAt,
    finished_at: finishedAt,
    status,
    source_commit: sourceCommit,
    source_branch: sourceBranch,
    external_network_used: false,
    canonical_guard: canonicalGuard,
    monitors: [{ name: health.monitor, status: health.status, findings: health.findings.length }],
    output_files: ['manifest.json', 'health.json', 'summary.md']
  };

  writeJson(path.join(runDirectory, 'health.json'), health);
  writeJson(path.join(runDirectory, 'manifest.json'), manifest);
  writeText(path.join(runDirectory, 'summary.md'), summaryText(manifest, health));

  const result = { run_directory: runDirectory, manifest, health };
  if (status !== 'completed') {
    const error = new Error(`Monitoring run failed: health=${health.status}, canonical_guard=${canonicalGuard.ok}`);
    error.result = result;
    throw error;
  }
  return result;
}

async function main() {
  const result = runMonitoring();
  console.log(JSON.stringify({
    run_directory: result.run_directory,
    run_id: result.manifest.run_id,
    status: result.manifest.status,
    canonical_guard: result.manifest.canonical_guard,
    candidate_count: result.health.candidate_count
  }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
