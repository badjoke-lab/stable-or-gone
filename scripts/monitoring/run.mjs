import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { captureCanonicalSnapshot, compareCanonicalSnapshots } from './core/canonical-guard.mjs';
import { ensureDir, writeJson, writeText } from './core/fs-utils.mjs';
import { observeOfficialSources } from './monitors/official-source-observer.mjs';
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

function summaryText(manifest, health, official) {
  const guard = manifest.canonical_guard;
  const candidateCount = official?.candidate_count ?? 0;
  const observationCount = official?.observation_count ?? 0;
  const sourceErrors = official?.source_errors ?? 0;
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
    '## Official-source observations',
    '',
    `- Observations: ${observationCount}`,
    `- Source errors: ${sourceErrors}`,
    '',
    '## Candidate output',
    '',
    `- Candidates: ${candidateCount}`,
    '- Candidate status: needs_human_review',
    '- Canonical action: none',
    '- Public or canonical writes: 0',
    '',
    '## Operator action',
    '',
    candidateCount > 0
      ? 'Review private candidates and source observations. Open a separate canonical-data PR only after human approval.'
      : manifest.status === 'completed'
        ? 'No canonical action required.'
        : 'Review the failed health or canonical-guard finding before any further work.',
    ''
  ].join('\n');
}

export async function runMonitoring(options = {}) {
  const startedAt = options.startedAt || new Date().toISOString();
  const sourceCommit = options.sourceCommit || resolveCommit();
  const sourceBranch = options.sourceBranch || resolveBranch();
  const runId = options.runId || resolveRunId(startedAt, sourceCommit);
  const mode = options.mode || process.env.SOG_MONITORING_MODE || 'health-only';
  if (!['health-only', 'official-sources'].includes(mode)) throw new Error(`Unsupported monitoring mode: ${mode}`);

  const outputRoot = options.outputRoot || path.join(root, 'data-staging/monitoring');
  const runDirectory = path.join(outputRoot, runId);
  ensureDir(runDirectory);

  const before = captureCanonicalSnapshot(root);
  const health = runRepositoryHealthMonitor(root, startedAt);
  const official = mode === 'official-sources'
    ? await observeOfficialSources({
        root,
        observedAt: startedAt,
        fetchImpl: options.fetchImpl,
        sources: options.sources,
        timeoutMs: options.timeoutMs,
        maxBodyBytes: options.maxBodyBytes
      })
    : null;
  const after = captureCanonicalSnapshot(root);
  const canonicalGuard = compareCanonicalSnapshots(before, after);
  const finishedAt = new Date().toISOString();
  const status = health.status === 'ok' && canonicalGuard.ok ? 'completed' : 'failed';
  const outputFiles = mode === 'official-sources'
    ? ['manifest.json', 'health.json', 'official-source-observations.json', 'monitoring-candidates.json', 'summary.md']
    : ['manifest.json', 'health.json', 'summary.md'];

  const monitors = [{ name: health.monitor, status: health.status, findings: health.findings.length }];
  if (official) monitors.push({ name: official.monitor, status: official.status, observations: official.observation_count, candidates: official.candidate_count, source_errors: official.source_errors });

  const manifest = {
    schema_version: '1.0',
    run_id: runId,
    mode,
    started_at: startedAt,
    finished_at: finishedAt,
    status,
    source_commit: sourceCommit,
    source_branch: sourceBranch,
    external_network_used: mode === 'official-sources',
    observation_count: official?.observation_count ?? 0,
    candidate_count: official?.candidate_count ?? 0,
    source_errors: official?.source_errors ?? 0,
    canonical_guard: canonicalGuard,
    monitors,
    output_files: outputFiles
  };

  writeJson(path.join(runDirectory, 'health.json'), health);
  if (official) {
    writeJson(path.join(runDirectory, 'official-source-observations.json'), {
      schema_version: official.schema_version,
      monitor: official.monitor,
      status: official.status,
      observed_at: official.observed_at,
      observation_count: official.observation_count,
      source_errors: official.source_errors,
      observations: official.observations
    });
    writeJson(path.join(runDirectory, 'monitoring-candidates.json'), {
      schema_version: official.schema_version,
      created_at: official.observed_at,
      candidate_count: official.candidate_count,
      candidates: official.candidates
    });
  }
  writeJson(path.join(runDirectory, 'manifest.json'), manifest);
  writeText(path.join(runDirectory, 'summary.md'), summaryText(manifest, health, official));

  const result = { run_directory: runDirectory, manifest, health, official };
  if (status !== 'completed') {
    const error = new Error(`Monitoring run failed: health=${health.status}, canonical_guard=${canonicalGuard.ok}`);
    error.result = result;
    throw error;
  }
  return result;
}

async function main() {
  const result = await runMonitoring();
  console.log(JSON.stringify({
    run_directory: result.run_directory,
    run_id: result.manifest.run_id,
    status: result.manifest.status,
    canonical_guard: result.manifest.canonical_guard,
    observation_count: result.manifest.observation_count,
    candidate_count: result.manifest.candidate_count,
    source_errors: result.manifest.source_errors
  }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
