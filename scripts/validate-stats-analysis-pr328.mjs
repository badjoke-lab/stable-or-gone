import fs from 'node:fs';
import path from 'node:path';
import { generateStats } from './build-stats.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const stats = generateStats({ root });
const history = JSON.parse(read('data/stats-history.json'));
const page = read('src/pages/stats/index.astro');
const css = read('src/styles/stats-foundation.css');
const spec = read('docs/stats-analysis-expansion-spec.md');
const amendment = read('docs/roadmap-amendments/2026-07-08-pr328-stats-analysis-activation.md');

check(stats.totals.assets === 100, `stats asset denominator must remain 100, found ${stats.totals.assets}`);
check(stats.totals.organizations === 94, `organization total must remain 94, found ${stats.totals.organizations}`);
check(stats.totals.events === 172, `event total must remain 172, found ${stats.totals.events}`);
check(stats.totals.evidence === 502, `evidence total must remain 502, found ${stats.totals.evidence}`);
check(stats.totals.deployments === 140, `deployment total must remain 140, found ${stats.totals.deployments}`);
check(history.checkpoint_policy === 'append_only_reviewed_pr', 'stats history policy mismatch');
check(Array.isArray(history.snapshots) && history.snapshots.length >= 1, 'reviewed stats history snapshot is required');

for (const marker of [
  'data-stats-foundation',
  'data-stats-analysis-expansion',
  'data-analysis-family="classification"',
  'data-analysis-family="historical-events-failures"',
  'data-analysis-family="deployments"',
  'data-analysis-family="organizations"',
  'data-analysis-family="data-quality"',
  'What the registry contains',
  'Events, transitions, and failures',
  'Chain and deployment structure',
  'Roles around stable assets',
  'Coverage, evidence depth, and freshness'
]) check(page.includes(marker), `stats analysis page missing marker: ${marker}`);

for (const namespace of [
  'stats.classification',
  'stats.events',
  'stats.failures',
  'stats.deployments',
  'stats.organizations',
  'stats.data_quality'
]) check(page.includes(namespace), `stats page does not reference deterministic model namespace: ${namespace}`);

check(page.includes('Multi-select dimensions such as backing type and organization role may exceed 100%'), 'multi-select interpretation caveat is missing');
check(page.includes('They are not safety, transparency, or risk scores'), 'data-quality non-score interpretation is missing');
check(page.includes('A multi-chain asset is still one canonical asset'), 'deployment asset/row distinction is missing');
check(page.includes('An organization may hold multiple roles'), 'organization multi-role caveat is missing');
check(page.includes('<table') && page.includes('<caption>'), 'expanded statistics page must retain exact accessible tables');
check(page.includes('Unknown states remain visible'), 'unknown-state preservation notice is missing');

for (const marker of [
  'Classification',
  'Historical events and failures',
  'Deployment analysis',
  'Organization analysis',
  'Data-quality analysis',
  'Quality coverage is a description of registry completeness'
]) check(spec.includes(marker), `PR #328 specification missing marker: ${marker}`);

check(amendment.includes('PR #327 /stats/ foundation: complete'), 'PR #328 amendment must mark PR #327 complete');
check(amendment.includes('PR #328 historical, deployment, organization, and data-quality statistics: active'), 'PR #328 amendment must mark PR #328 active');
check(amendment.includes('PR #329 next candidate audit: next'), 'PR #328 amendment must mark PR #329 next');

for (const marker of [
  '.stats-analysis-grid',
  '.stats-analysis-panel',
  '.stats-mini-kpi-grid',
  '.stats-year-list',
  '.stats-chain-list',
  '@media (max-width: 1100px)',
  '@media (max-width: 900px)',
  '@media (max-width: 620px)'
]) check(css.includes(marker), `expanded stats CSS missing marker: ${marker}`);

for (const forbidden of ['market_cap:', 'price:', 'apy:', 'safety_score:', 'transparency_score:', 'risk_score:']) {
  check(!page.includes(forbidden), `expanded stats page contains forbidden metric field: ${forbidden}`);
}

const distRoot = process.env.SOG_STATS_ANALYSIS_DIST;
if (distRoot) {
  const distPath = path.resolve(root, distRoot);
  const expectedFiles = ['stats/index.html', 'data/stats.json', 'data/stats-history.json'];
  for (const relativePath of expectedFiles) check(fs.existsSync(path.join(distPath, relativePath)), `built output missing: ${relativePath}`);

  if (fs.existsSync(path.join(distPath, 'data/stats.json'))) {
    const builtStats = JSON.parse(fs.readFileSync(path.join(distPath, 'data/stats.json'), 'utf8'));
    check(JSON.stringify(builtStats) === JSON.stringify(stats), 'built current statistics JSON differs from deterministic model');
  }

  if (fs.existsSync(path.join(distPath, 'data/stats-history.json'))) {
    const builtHistory = JSON.parse(fs.readFileSync(path.join(distPath, 'data/stats-history.json'), 'utf8'));
    check(JSON.stringify(builtHistory) === JSON.stringify(history), 'built statistics history JSON differs from canonical history source');
  }

  if (fs.existsSync(path.join(distPath, 'stats/index.html'))) {
    const builtPage = fs.readFileSync(path.join(distPath, 'stats/index.html'), 'utf8');
    for (const marker of [
      'data-stats-analysis-expansion',
      'data-analysis-family="classification"',
      'data-analysis-family="historical-events-failures"',
      'data-analysis-family="deployments"',
      'data-analysis-family="organizations"',
      'data-analysis-family="data-quality"'
    ]) check(builtPage.includes(marker), `built stats page missing expansion marker: ${marker}`);
  }
}

if (failures.length) {
  console.error('PR #328 statistics analysis expansion validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  assets: stats.totals.assets,
  organizations: stats.totals.organizations,
  events: stats.totals.events,
  evidence: stats.totals.evidence,
  deployments: stats.totals.deployments,
  classification_dimensions: Object.keys(stats.classification).length,
  event_years: Object.keys(stats.events.by_year).length,
  deployment_chains: Object.keys(stats.deployments.by_chain).length,
  organization_roles: Object.keys(stats.organizations.by_role).length,
  coverage_metrics: Object.keys(stats.data_quality.coverage).length,
  dist_validated: Boolean(distRoot)
}, null, 2));
