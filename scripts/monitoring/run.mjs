import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { captureCanonicalSnapshot, compareCanonicalSnapshots } from './core/canonical-guard.mjs';
import { ensureDir, writeJson, writeText } from './core/fs-utils.mjs';
import { observeOfficialSources } from './monitors/official-source-observer.mjs';
import { runRepositoryHealthMonitor } from './monitors/repository-health.mjs';
import { runNewsDiscovery } from './monitors/news-discovery.mjs';
import { runArticleStaleStateReview } from './monitors/article-stale-state-review.mjs';
import { selectScheduledSourceGroup } from './scheduling/source-groups.mjs';
import { buildReviewMaterial } from './review/build-review-material.mjs';

const root = process.cwd();
const EMPTY_CHANGE_COUNTS = { unchanged: 0, metadata_changed: 0, content_changed: 0, new_source: 0, fetch_failed: 0 };

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

function buildContext(options) {
  const startedAt = options.startedAt || new Date().toISOString();
  const sourceCommit = options.sourceCommit || resolveCommit();
  const mode = options.mode || process.env.SOG_MONITORING_MODE || 'health-only';
  if (!['health-only', 'official-sources'].includes(mode)) throw new Error(`Unsupported monitoring mode: ${mode}`);
  const scheduleGroup = options.scheduleGroup ?? process.env.SOG_MONITORING_SCHEDULE_GROUP ?? null;
  if (scheduleGroup !== null && !['daily', 'weekly'].includes(scheduleGroup)) throw new Error(`Unsupported monitoring schedule group: ${scheduleGroup}`);
  if (scheduleGroup !== null && mode !== 'official-sources') throw new Error('Scheduled monitoring groups require official-sources mode');
  const runId = options.runId || resolveRunId(startedAt, sourceCommit);
  const outputRoot = options.outputRoot || path.join(root, 'data-staging/monitoring');
  const runDirectory = path.join(outputRoot, runId);
  const reviewRequested = options.includeReviewMaterial ?? process.env.SOG_MONITORING_REVIEW_MATERIAL === 'true';
  ensureDir(runDirectory);
  return {
    options,
    startedAt,
    sourceCommit,
    sourceBranch: options.sourceBranch || resolveBranch(),
    mode,
    scheduleGroup,
    includeReviewMaterial: mode === 'official-sources' && reviewRequested,
    runId,
    runDirectory,
    before: captureCanonicalSnapshot(root),
    health: runRepositoryHealthMonitor(root, startedAt)
  };
}

function summaryText(manifest, health, official, review, news, stale) {
  const guard = manifest.canonical_guard;
  const candidateCount = official?.candidate_count ?? 0;
  const changeCounts = official?.change_counts ?? EMPTY_CHANGE_COUNTS;
  return [
    '# SOG Review-only Monitoring',
    '',
    '## Run',
    '',
    `- Run ID: \`${manifest.run_id}\``,
    `- Mode: \`${manifest.mode}\``,
    `- Schedule group: \`${manifest.schedule_group ?? 'none'}\``,
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
    `- Baseline set: \`${official?.baseline_set_id ?? 'none'}\``,
    `- Normalization version: \`${official?.normalization_version ?? 'none'}\``,
    `- Selected official sources: ${manifest.official_source_selection_count}`,
    `- Observations: ${official?.observation_count ?? 0}`,
    `- Unchanged: ${changeCounts.unchanged}`,
    `- Metadata changed: ${changeCounts.metadata_changed}`,
    `- Content changed: ${changeCounts.content_changed}`,
    `- New source: ${changeCounts.new_source}`,
    `- Fetch failed: ${changeCounts.fetch_failed}`,
    `- Source errors: ${official?.source_errors ?? 0}`,
    '',
    '## Candidate output',
    '',
    `- Candidates: ${candidateCount}`,
    '- Unchanged sources create candidates: false',
    '- Metadata-only changes create candidates: false',
    '- Candidate status: needs_human_review',
    '- Canonical action: none',
    '- Public or canonical writes: 0',
    '',
    '## News discovery',
    '',
    `- Enabled: \`${Boolean(news)}\``,
    `- Discovery items: ${news?.item_count ?? 0}`,
    `- Feed errors: ${news?.error_count ?? 0}`,
    '- Discovery only: true',
    '- Canonical action: none',
    '- Public output: false',
    '',
    '## Article stale-state review',
    '',
    `- Enabled: \`${Boolean(stale)}\``,
    `- Findings: ${stale?.finding_count ?? 0}`,
    `- Review due: ${stale?.counts.review_due ?? 0}`,
    `- Stale: ${stale?.counts.stale ?? 0}`,
    `- Severely stale: ${stale?.counts.severely_stale ?? 0}`,
    '- Automatic guide edit: false',
    '- Canonical action: none',
    '',
    '## Review material',
    '',
    `- Enabled: \`${manifest.review_material_enabled}\``,
    `- Review items: ${review?.reviewMaterial.counts.review_items ?? 0}`,
    `- Evidence drafts: ${review?.evidenceDraftReport.draft_count ?? 0}`,
    `- Rejected duplicates: ${review?.reviewMaterial.counts.rejected_duplicates ?? 0}`,
    `- Unresolved questions: ${review?.reviewMaterial.counts.unresolved_questions ?? 0}`,
    '- Human approval required',
    '- Canonical action: none',
    '- Automatic pull request: false',
    '',
    '## Operator action',
    '',
    review?.reviewMaterial.counts.review_items > 0
      ? 'Review facts, unconfirmed inferences, unresolved questions, evidence drafts, and draft PR material. Open a separate canonical-data PR only after human approval.'
      : candidateCount > 0 || (news?.item_count ?? 0) > 0 || ((stale?.counts.review_due ?? 0) + (stale?.counts.stale ?? 0) + (stale?.counts.severely_stale ?? 0)) > 0
        ? 'Review private monitoring candidates, discovery leads, and stale-state findings. Open a separate reviewed PR only after source confirmation and human approval.'
        : manifest.status === 'completed'
          ? 'No canonical action required.'
          : 'Review the failed health or canonical-guard finding before any further work.',
    ''
  ].join('\n');
}

function finalizeMonitoring(context, official, extras = {}) {
  const news = extras.news ?? null;
  const stale = extras.stale ?? null;
  const review = official && context.includeReviewMaterial
    ? buildReviewMaterial({ root, official, createdAt: context.startedAt })
    : null;
  const after = captureCanonicalSnapshot(root);
  const canonicalGuard = compareCanonicalSnapshots(context.before, after);
  const status = context.health.status === 'ok' && canonicalGuard.ok ? 'completed' : 'failed';
  const outputFiles = context.mode === 'official-sources'
    ? context.includeReviewMaterial
      ? [
          'manifest.json',
          'health.json',
          'official-source-observations.json',
          'monitoring-candidates.json',
          'review-material.json',
          'evidence-drafts.json',
          'review-report.md',
          'pr-material.md',
          ...(news ? ['news-discovery.json'] : []),
          ...(stale ? ['article-stale-state-review.json'] : []),
          'summary.md'
        ]
      : [
          'manifest.json',
          'health.json',
          'official-source-observations.json',
          'monitoring-candidates.json',
          ...(news ? ['news-discovery.json'] : []),
          ...(stale ? ['article-stale-state-review.json'] : []),
          'summary.md'
        ]
    : ['manifest.json', 'health.json', 'summary.md'];
  const monitors = [{ name: context.health.monitor, status: context.health.status, findings: context.health.findings.length }];
  if (official) monitors.push({
    name: official.monitor,
    status: official.status,
    baseline_set_id: official.baseline_set_id,
    normalization_version: official.normalization_version,
    observations: official.observation_count,
    candidates: official.candidate_count,
    source_errors: official.source_errors,
    change_counts: official.change_counts
  });
  if (news) monitors.push({
    name: news.monitor,
    status: news.status,
    query_count: news.query_count,
    item_count: news.item_count,
    error_count: news.error_count
  });
  if (stale) monitors.push({
    name: stale.monitor,
    status: stale.status,
    finding_count: stale.finding_count,
    counts: stale.counts
  });
  if (review) monitors.push({
    name: 'review-material-builder',
    status: 'ok',
    review_items: review.reviewMaterial.counts.review_items,
    evidence_drafts: review.evidenceDraftReport.draft_count,
    rejected_duplicates: review.reviewMaterial.counts.rejected_duplicates
  });

  const manifest = {
    schema_version: '1.1',
    run_id: context.runId,
    mode: context.mode,
    schedule_group: context.scheduleGroup,
    started_at: context.startedAt,
    finished_at: new Date().toISOString(),
    status,
    source_commit: context.sourceCommit,
    source_branch: context.sourceBranch,
    external_network_used: context.mode === 'official-sources',
    baseline_set_id: official?.baseline_set_id ?? null,
    normalization_version: official?.normalization_version ?? null,
    official_source_selection_count: official?.observation_count ?? 0,
    observation_count: official?.observation_count ?? 0,
    candidate_count: official?.candidate_count ?? 0,
    source_errors: official?.source_errors ?? 0,
    change_counts: official?.change_counts ?? { ...EMPTY_CHANGE_COUNTS },
    news_discovery_item_count: news?.item_count ?? 0,
    news_discovery_error_count: news?.error_count ?? 0,
    article_stale_finding_count: stale?.finding_count ?? 0,
    review_material_enabled: Boolean(review),
    review_item_count: review?.reviewMaterial.counts.review_items ?? 0,
    evidence_draft_count: review?.evidenceDraftReport.draft_count ?? 0,
    rejected_duplicate_count: review?.reviewMaterial.counts.rejected_duplicates ?? 0,
    unresolved_question_count: review?.reviewMaterial.counts.unresolved_questions ?? 0,
    canonical_guard: canonicalGuard,
    monitors,
    output_files: outputFiles
  };

  writeJson(path.join(context.runDirectory, 'health.json'), context.health);
  if (official) {
    writeJson(path.join(context.runDirectory, 'official-source-observations.json'), {
      schema_version: official.schema_version,
      monitor: official.monitor,
      status: official.status,
      observed_at: official.observed_at,
      baseline_set_id: official.baseline_set_id,
      normalization_version: official.normalization_version,
      observation_count: official.observation_count,
      source_errors: official.source_errors,
      change_counts: official.change_counts,
      observations: official.observations
    });
    writeJson(path.join(context.runDirectory, 'monitoring-candidates.json'), {
      schema_version: official.schema_version,
      created_at: official.observed_at,
      baseline_set_id: official.baseline_set_id,
      normalization_version: official.normalization_version,
      candidate_count: official.candidate_count,
      change_counts: official.change_counts,
      candidates: official.candidates
    });
  }
  if (news) writeJson(path.join(context.runDirectory, 'news-discovery.json'), news);
  if (stale) writeJson(path.join(context.runDirectory, 'article-stale-state-review.json'), stale);
  if (review) {
    writeJson(path.join(context.runDirectory, 'review-material.json'), review.reviewMaterial);
    writeJson(path.join(context.runDirectory, 'evidence-drafts.json'), review.evidenceDraftReport);
    writeText(path.join(context.runDirectory, 'review-report.md'), review.reviewReport);
    writeText(path.join(context.runDirectory, 'pr-material.md'), review.prMaterial);
  }
  writeJson(path.join(context.runDirectory, 'manifest.json'), manifest);
  writeText(path.join(context.runDirectory, 'summary.md'), summaryText(manifest, context.health, official, review, news, stale));

  const result = { run_directory: context.runDirectory, manifest, health: context.health, official, review, news, stale };
  if (status !== 'completed') {
    const error = new Error(`Monitoring run failed: health=${context.health.status}, canonical_guard=${canonicalGuard.ok}`);
    error.result = result;
    throw error;
  }
  return result;
}

export function runMonitoring(options = {}) {
  const context = buildContext(options);
  if (context.mode === 'health-only') return finalizeMonitoring(context, null);

  let sources = options.sources;
  let baselineSet = options.baselineSet;
  if (context.scheduleGroup) {
    const selected = selectScheduledSourceGroup(context.scheduleGroup, { root, sources, baselineSet });
    sources = selected.sources;
    baselineSet = selected.baselineSet;
  }

  return observeOfficialSources({
    root,
    observedAt: context.startedAt,
    fetchImpl: options.fetchImpl,
    sources,
    baselineSet,
    timeoutMs: options.timeoutMs,
    maxBodyBytes: options.maxBodyBytes
  }).then(async (official) => {
    const news = context.scheduleGroup === 'daily'
      ? await runNewsDiscovery({
          discoveredAt: context.startedAt,
          fetchImpl: options.newsFetchImpl,
          queries: options.newsQueries,
          timeoutMs: options.newsTimeoutMs,
          maxBodyBytes: options.newsMaxBodyBytes,
          maxItemsPerQuery: options.newsMaxItemsPerQuery
        })
      : null;
    const stale = context.scheduleGroup === 'weekly'
      ? runArticleStaleStateReview({
          root,
          checkedAt: context.startedAt,
          research: options.articleResearch,
          researchPath: options.articleResearchPath
        })
      : null;
    return finalizeMonitoring(context, official, { news, stale });
  });
}

async function main() {
  const result = await runMonitoring();
  console.log(JSON.stringify({
    run_directory: result.run_directory,
    run_id: result.manifest.run_id,
    status: result.manifest.status,
    schedule_group: result.manifest.schedule_group,
    canonical_guard: result.manifest.canonical_guard,
    baseline_set_id: result.manifest.baseline_set_id,
    normalization_version: result.manifest.normalization_version,
    official_source_selection_count: result.manifest.official_source_selection_count,
    observation_count: result.manifest.observation_count,
    candidate_count: result.manifest.candidate_count,
    source_errors: result.manifest.source_errors,
    change_counts: result.manifest.change_counts,
    news_discovery_item_count: result.manifest.news_discovery_item_count,
    news_discovery_error_count: result.manifest.news_discovery_error_count,
    article_stale_finding_count: result.manifest.article_stale_finding_count,
    review_item_count: result.manifest.review_item_count,
    evidence_draft_count: result.manifest.evidence_draft_count,
    rejected_duplicate_count: result.manifest.rejected_duplicate_count
  }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
