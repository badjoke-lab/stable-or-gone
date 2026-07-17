import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runMonitoring } from './monitoring/run.mjs';
import { runNewsDiscovery } from './monitoring/monitors/news-discovery.mjs';
import { freshnessBand, runArticleStaleStateReview } from './monitoring/monitors/article-stale-state-review.mjs';
import { validateScheduledSourcePartition } from './monitoring/scheduling/source-groups.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const partition = validateScheduledSourcePartition({ root });
check(partition.daily.selected_source_count === 6, `daily source count must be 6, found ${partition.daily.selected_source_count}`);
check(partition.weekly.selected_source_count === 35, `weekly source count must be 35, found ${partition.weekly.selected_source_count}`);
check(partition.overlap.length === 0, `daily/weekly overlap must be zero: ${partition.overlap.join(', ')}`);
check(partition.union_matches_all_sources === true, 'daily/weekly union must equal all enabled sources');
check(partition.daily_source_baseline_parity === true, 'daily source/baseline parity must be exact');
check(partition.weekly_source_baseline_parity === true, 'weekly source/baseline parity must be exact');
check(partition.all_baselines_pending === true, 'all repository baselines must remain pending');
check(JSON.stringify(partition.daily.selected_source_ids) === JSON.stringify([
  'binance-eea-stablecoin-policy',
  'bitstamp-europe-mica-assets',
  'gemini-eea-account-closure',
  'kraken-eea-stablecoin-offerings',
  'open-standard-open-usd',
  'visa-stablecoin-platform'
]), 'daily source membership mismatch');
check(partition.weekly.selected_source_ids.includes('esma-mica-interim-register-hub'), 'weekly group must include ESMA register source');

function rssFixture(queryKey) {
  const items = Array.from({ length: 25 }, (_, index) => `
    <item>
      <title><![CDATA[${queryKey} headline ${index}]]></title>
      <link>https://example.com/${encodeURIComponent(queryKey)}/${index}?a=1&amp;b=2</link>
      <pubDate>Tue, 07 Jul 2026 00:${String(index % 60).padStart(2, '0')}:00 GMT</pubDate>
      <source url="https://publisher.example.com">Fixture Publisher</source>
      <description>PR324_RAW_FEED_SHOULD_NOT_LEAK_${queryKey}_${index}</description>
    </item>`).join('');
  return `<?xml version="1.0"?><rss><channel>${items}</channel></rss>`;
}

const newsFetch = async (url) => {
  const parsed = new URL(url);
  const key = parsed.searchParams.get('q') ?? 'unknown';
  return new Response(rssFixture(key), {
    status: 200,
    headers: { 'content-type': 'application/rss+xml; charset=utf-8' }
  });
};

try {
  const news = await runNewsDiscovery({
    discoveredAt: '2026-07-07T01:00:00.000Z',
    fetchImpl: newsFetch
  });
  check(news.query_count === 6, 'news discovery must execute six bounded queries');
  check(news.item_count === 120, `news discovery must retain at most 20 items per query, found ${news.item_count}`);
  check(news.error_count === 0, 'news discovery fixture must have zero errors');
  check(news.max_queries === 6 && news.max_items_per_query === 20, 'news discovery bounds mismatch');
  check(news.policy.discovery_only === true, 'news discovery must remain discovery_only');
  check(news.policy.canonical_action === 'none', 'news discovery canonical action must remain none');
  check(news.policy.public_output === false, 'news discovery public output must remain false');
  check(news.policy.raw_response_retained === false, 'raw news response retention must remain false');
  check(!JSON.stringify(news).includes('PR324_RAW_FEED_SHOULD_NOT_LEAK'), 'raw feed marker leaked into news discovery output');
} catch (error) {
  failures.push(`news discovery fixture failed: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  await runNewsDiscovery({
    discoveredAt: '2026-07-07T01:00:00.000Z',
    fetchImpl: newsFetch,
    queries: Array.from({ length: 7 }, (_, index) => ({ query_id: `q${index}`, query: `query ${index}` }))
  });
  failures.push('news discovery accepted more than six queries');
} catch (error) {
  check(String(error).includes('query count must be between 1 and 6'), `unexpected news bound error: ${error}`);
}

const staleFixture = {
  research_id: 'fixture-research',
  information_current_through: '2026-07-31',
  reviewed_sources: [
    { source_id: 'current', last_checked_at: '2026-07-30', review_state: 'reviewed' },
    { source_id: 'review-due', last_checked_at: '2026-07-20', review_state: 'reviewed' },
    { source_id: 'stale', last_checked_at: '2026-07-10', review_state: 'reviewed' },
    { source_id: 'severe', last_checked_at: '2026-06-01', review_state: 'reviewed' },
    { source_id: 'missing', last_checked_at: null, review_state: 'reviewed' }
  ]
};
const stale = runArticleStaleStateReview({
  root,
  checkedAt: '2026-07-31T12:00:00.000Z',
  research: staleFixture
});
check(freshnessBand(0) === 'current' && freshnessBand(7) === 'current', 'current freshness band boundary invalid');
check(freshnessBand(8) === 'review_due' && freshnessBand(14) === 'review_due', 'review_due freshness band boundary invalid');
check(freshnessBand(15) === 'stale' && freshnessBand(30) === 'stale', 'stale freshness band boundary invalid');
check(freshnessBand(31) === 'severely_stale', 'severely_stale freshness band boundary invalid');
check(freshnessBand(null) === 'missing_date', 'missing_date freshness band invalid');
check(stale.counts.current === 2, `stale fixture current count must be 2, found ${stale.counts.current}`);
check(stale.counts.review_due === 1, 'stale fixture review_due count must be 1');
check(stale.counts.stale === 1, 'stale fixture stale count must be 1');
check(stale.counts.severely_stale === 1, 'stale fixture severely_stale count must be 1');
check(stale.counts.missing_date === 1, 'stale fixture missing_date count must be 1');
check(stale.policy.automatic_guide_edit === false, 'stale-state review must not edit guide automatically');
check(stale.policy.canonical_action === 'none', 'stale-state canonical action must remain none');

const allSignalBody = '<html><body>reserve reserves backing assets portfolio composition assurance attestation issuance redemption circulation migration rebrand shutdown launch order charges approval authorization enforcement penalty MiCA stablecoin trading buy sell deposit withdraw withdrawal custody convert conversion account accounts closed closure service unavailable register EMT issuer ART issuer authorised CASP non-compliant white paper</body></html>';
const officialFetch = async () => new Response(allSignalBody, {
  status: 200,
  headers: { 'content-type': 'text/html; charset=utf-8', etag: 'pr324-fixture' }
});

async function runScheduledFixture(group) {
  const outputRoot = fs.mkdtempSync(path.join(os.tmpdir(), `sog-pr324-${group}-`));
  try {
    const result = await runMonitoring({
      outputRoot,
      runId: `20260707T020000Z-pr324-${group}`,
      startedAt: group === 'daily' ? '2026-07-07T02:00:00.000Z' : '2026-07-31T12:00:00.000Z',
      sourceCommit: '3'.repeat(40),
      sourceBranch: 'pr324-test',
      mode: 'official-sources',
      scheduleGroup: group,
      includeReviewMaterial: false,
      fetchImpl: officialFetch,
      newsFetchImpl: newsFetch,
      articleResearch: staleFixture
    });
    const files = fs.readdirSync(result.run_directory).sort();
    if (group === 'daily') {
      check(result.manifest.schedule_group === 'daily', 'daily manifest schedule_group mismatch');
      check(result.manifest.official_source_selection_count === 6, 'daily manifest source selection count must be 6');
      check(result.manifest.news_discovery_item_count === 120, 'daily manifest news item count must be 120');
      check(result.manifest.article_stale_finding_count === 0, 'daily manifest stale finding count must be zero');
      check(files.includes('news-discovery.json'), 'daily scheduled output missing news-discovery.json');
      check(!files.includes('article-stale-state-review.json'), 'daily scheduled output must not include stale-state review');
    } else {
      check(result.manifest.schedule_group === 'weekly', 'weekly manifest schedule_group mismatch');
      check(result.manifest.official_source_selection_count === 35, 'weekly manifest source selection count must be 35');
      check(result.manifest.news_discovery_item_count === 0, 'weekly manifest news item count must be zero');
      check(result.manifest.article_stale_finding_count === 6, 'weekly manifest stale finding count must be 6');
      check(files.includes('article-stale-state-review.json'), 'weekly scheduled output missing stale-state review');
      check(!files.includes('news-discovery.json'), 'weekly scheduled output must not include news discovery');
    }
    check(result.manifest.canonical_guard?.ok === true, `${group} scheduled fixture canonical guard failed`);
    check(result.manifest.review_material_enabled === false, `${group} fixture review material setting mismatch`);
  } finally {
    fs.rmSync(outputRoot, { recursive:true, force:true });
  }
}

try {
  await runScheduledFixture('daily');
  await runScheduledFixture('weekly');
} catch (error) {
  failures.push(`scheduled runner fixture failed: ${error instanceof Error ? error.message : String(error)}`);
}

const manualRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sog-pr324-manual-'));
try {
  const manual = runMonitoring({
    outputRoot: manualRoot,
    runId: '20260707T030000Z-pr324-manual',
    startedAt: '2026-07-07T03:00:00.000Z',
    sourceCommit: '4'.repeat(40),
    sourceBranch: 'pr324-test',
    mode: 'health-only'
  });
  check(manual.manifest.schedule_group === null, 'manual unscheduled run must use schedule_group null');
  check(manual.manifest.news_discovery_item_count === 0, 'manual health run news count must be zero');
  check(manual.manifest.article_stale_finding_count === 0, 'manual health run stale count must be zero');
} catch (error) {
  failures.push(`manual compatibility fixture failed: ${error instanceof Error ? error.message : String(error)}`);
} finally {
  fs.rmSync(manualRoot, { recursive:true, force:true });
}

const workflow = fs.readFileSync('.github/workflows/monitoring-bounded-scheduled-read-only.yml', 'utf8');
check((workflow.match(/cron:/g) ?? []).length === 2, 'scheduled workflow must contain exactly two cron triggers');
check(workflow.includes("cron: '17 3 * * *'"), 'daily cron missing');
check(workflow.includes("cron: '23 4 * * 0'"), 'weekly cron missing');
check(workflow.includes('workflow_dispatch:'), 'manual scheduled-group dispatch missing');
check(workflow.includes('contents: read'), 'scheduled workflow must use contents: read');
check(workflow.includes('actions/upload-artifact@v4'), 'scheduled workflow must upload private artifact');
check(workflow.includes('SOG_MONITORING_SCHEDULE_GROUP'), 'scheduled workflow must pass schedule group to runner');
for (const forbidden of ['contents: write','pull-requests: write','issues: write','id-token: write','wrangler','CLOUDFLARE_','create-pull-request','pull_request:','workflow_run:','push:']) {
  check(!workflow.includes(forbidden), `scheduled workflow contains prohibited token: ${forbidden}`);
}

const spec = fs.readFileSync('docs/quality/monitoring-bounded-scheduled-read-only-spec.md', 'utf8');
for (const marker of [
  'daily count = 4',
  'weekly count = 35',
  'maximum queries per run: 4',
  'maximum items retained per query: 20',
  'edit the EU/EEA guide automatically',
  'contents: read',
  'deploy monitoring output'
]) {
  check(spec.includes(marker), `PR #324 historical specification missing marker: ${marker}`);
}

if (failures.length) {
  console.error('Current bounded scheduled monitoring validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  daily_sources: partition.daily.selected_source_count,
  weekly_sources: partition.weekly.selected_source_count,
  overlap: partition.overlap.length,
  union_matches_all_sources: partition.union_matches_all_sources,
  all_baselines_pending: partition.all_baselines_pending,
  news_query_limit: 6,
  news_item_limit_per_query: 20,
  schedule_groups: ['daily','weekly']
}, null, 2));
