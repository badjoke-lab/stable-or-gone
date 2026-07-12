import fs from 'node:fs';
import path from 'node:path';
import { generateStats } from './build-stats.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const stats = generateStats({ root });
const history = JSON.parse(read('data/stats-history.json'));
const canonicalCheckpoint = JSON.parse(read('docs/migration/current-canonical-checkpoint.json'));
const statsCheckpoint = JSON.parse(read('docs/migration/current-stats-history-checkpoint.json'));
const page = read('src/pages/stats/index.astro');
const css = read('src/styles/stats-foundation.css');
const adapter = read('src/lib/statsData.mjs');
const statsRoute = read('src/pages/data/stats.json.ts');
const historyRoute = read('src/pages/data/stats-history.json.ts');
const manifestSource = read('src/lib/data/manifestBase.ts');
const architecture = read('config/site-architecture.mjs');
const sitemap = read('src/pages/sitemap-index.xml.ts');
const llms = read('src/pages/llms.txt.ts');
const ai = read('src/pages/ai.txt.ts');
const machineReadable = read('src/lib/machine-readable.ts');

const expected = canonicalCheckpoint.expected_counts ?? {};
check(statsCheckpoint.canonical_checkpoint_id === canonicalCheckpoint.checkpoint_id, 'stats checkpoint must bind the current canonical checkpoint');
check(stats.checkpoint_id === statsCheckpoint.checkpoint_id, `stats checkpoint must match current stats-history checkpoint ${statsCheckpoint.checkpoint_id}, found ${stats.checkpoint_id}`);
check(stats.totals.assets === canonicalCheckpoint.asset_count, `stats asset denominator must be ${canonicalCheckpoint.asset_count}, found ${stats.totals.assets}`);
check(stats.totals.organizations === expected.organizations, `stats organization total must be ${expected.organizations}, found ${stats.totals.organizations}`);
check(stats.totals.events === expected.events, `stats event total must be ${expected.events}, found ${stats.totals.events}`);
check(stats.totals.evidence === expected.evidence, `stats evidence total must be ${expected.evidence}, found ${stats.totals.evidence}`);
check(history.checkpoint_policy === 'append_only_reviewed_pr', 'stats history policy mismatch');
check(Array.isArray(history.snapshots) && history.snapshots.length >= 1, 'stats history requires at least one reviewed snapshot');
check(history.snapshots.some((snapshot) => snapshot.checkpoint_id === stats.checkpoint_id), 'current stats checkpoint missing from history');

for (const marker of [
  'data-stats-foundation',
  'Registry at a glance',
  'Recorded lifecycle composition',
  'Reviewed snapshots only',
  'Current statistics JSON',
  'Checkpoint history JSON',
  'A trend line is intentionally not shown until at least two reviewed checkpoints exist.'
]) check(page.includes(marker), `stats page missing foundation marker: ${marker}`);

for (const marker of [
  "'/data/stats.json'",
  "'/data/stats-history.json'",
  "'/stats/'",
  "source_boundary: 'reviewed_canonical_registry_only'",
  "history_policy: 'append_only_reviewed_pr'",
  'excludes_live_market_metrics: true'
]) check(manifestSource.includes(marker) || architecture.includes(marker) || machineReadable.includes(marker), `public statistics contract missing marker: ${marker}`);

check(adapter.includes('generateStats'), 'stats adapter must reuse deterministic PR #325 generator');
check(adapter.includes('data/stats-history.json'), 'stats adapter must read canonical stats history source');
check(statsRoute.includes('getPublicStats'), 'current stats route must use shared stats adapter');
check(historyRoute.includes('getPublicStatsHistory'), 'stats history route must use shared stats adapter');

for (const marker of [
  "label: 'Stats', href: '/stats/'",
  "pattern: '/stats/'",
  "pattern: '/data/stats.json'",
  "pattern: '/data/stats-history.json'"
]) check(architecture.includes(marker), `site architecture missing stats marker: ${marker}`);

check(sitemap.includes("'/stats/'"), 'sitemap must include /stats/');
for (const source of [llms, ai]) {
  check(source.includes('/data/stats.json'), 'AI discovery surface missing current statistics endpoint');
  check(source.includes('/data/stats-history.json'), 'AI discovery surface missing statistics history endpoint');
}

check(css.includes('@media (max-width: 900px)'), 'stats CSS missing tablet/mobile adaptation');
check(css.includes('@media (max-width: 620px)'), 'stats CSS missing narrow-mobile adaptation');
check(page.includes('<table>') && page.includes('<caption>'), 'stats page must include accessible tabular fallback/content');
check(page.includes('aria-label="Lifecycle groups"'), 'lifecycle bars require accessible group label');

for (const forbidden of ['market_cap:', 'price:', 'apy:', 'safety_score:', 'risk_score:']) {
  check(!page.includes(forbidden), `stats page contains forbidden live metric field: ${forbidden}`);
}

const distRoot = process.env.SOG_STATS_FOUNDATION_DIST;
if (distRoot) {
  const distPath = path.resolve(root, distRoot);
  const expectedFiles = [
    'stats/index.html',
    'data/stats.json',
    'data/stats-history.json',
    'data/manifest.json',
    'sitemap-index.xml'
  ];
  for (const relativePath of expectedFiles) check(fs.existsSync(path.join(distPath, relativePath)), `built output missing: ${relativePath}`);

  if (fs.existsSync(path.join(distPath, 'data/stats.json'))) {
    const builtStats = JSON.parse(fs.readFileSync(path.join(distPath, 'data/stats.json'), 'utf8'));
    check(JSON.stringify(builtStats) === JSON.stringify(stats), 'built current statistics JSON differs from deterministic model');
  }
  if (fs.existsSync(path.join(distPath, 'data/stats-history.json'))) {
    const builtHistory = JSON.parse(fs.readFileSync(path.join(distPath, 'data/stats-history.json'), 'utf8'));
    check(JSON.stringify(builtHistory) === JSON.stringify(history), 'built statistics history JSON differs from canonical history source');
  }
  if (fs.existsSync(path.join(distPath, 'data/manifest.json'))) {
    const builtManifest = JSON.parse(fs.readFileSync(path.join(distPath, 'data/manifest.json'), 'utf8'));
    check(builtManifest.public_files?.stats === '/data/stats.json', 'built manifest missing current stats public file');
    check(builtManifest.public_files?.stats_history === '/data/stats-history.json', 'built manifest missing stats history public file');
    check(builtManifest.derived_statistics?.page === '/stats/', 'built manifest missing stats page declaration');
  }
  if (fs.existsSync(path.join(distPath, 'stats/index.html'))) {
    const builtPage = fs.readFileSync(path.join(distPath, 'stats/index.html'), 'utf8');
    check(builtPage.includes('data-stats-foundation'), 'built stats page missing foundation marker');
    check(builtPage.includes('Registry at a glance'), 'built stats page missing KPI section');
    check(builtPage.includes('Recorded lifecycle composition'), 'built stats page missing lifecycle section');
  }
  if (fs.existsSync(path.join(distPath, 'sitemap-index.xml'))) {
    check(fs.readFileSync(path.join(distPath, 'sitemap-index.xml'), 'utf8').includes('https://sog.badjoke-lab.com/stats/'), 'built sitemap missing stats URL');
  }
}

if (failures.length) {
  console.error('PR #327 statistics foundation validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  canonical_checkpoint_id: canonicalCheckpoint.checkpoint_id,
  stats_checkpoint_id: statsCheckpoint.checkpoint_id,
  asset_denominator: stats.totals.assets,
  organizations: stats.totals.organizations,
  events: stats.totals.events,
  evidence: stats.totals.evidence,
  lifecycle_groups: stats.lifecycle.groups,
  history_snapshots: history.snapshots.length,
  dist_validated: Boolean(distRoot)
}, null, 2));
