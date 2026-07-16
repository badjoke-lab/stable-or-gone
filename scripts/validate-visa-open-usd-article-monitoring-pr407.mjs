import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { NEWS_DISCOVERY_QUERIES } from './monitoring/monitors/news-discovery.mjs';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const articlePath = 'src/pages/updates/visa-stablecoin-platform-open-usd/index.astro';
const article = readText(articlePath);
const updates = readJson('data/registry-updates.json');
const publicCopy = readText('src/data/updatePublicCopy.ts');
const sources = readJson('scripts/monitoring/sources/official-sources.json');
const baselines = readJson('scripts/monitoring/baselines/official-source-baselines.json');
const gate = readJson('docs/migration/post-pr405-review-gate-pr406.json');
const handoff = readJson('docs/migration/visa-open-usd-article-monitoring-pr407-handoff.json');
const decision = gate.decisions?.visa_open_usd_editorial_and_monitoring;

expect(gate.review_pr === 406 && gate.status === 'reviewed_complete', 'PR #406 review gate status changed');
expect(decision?.pr === 407, 'PR #406 did not authorize PR #407');
expect(decision?.decision === 'approved_bounded_editorial_and_private_monitoring', 'PR #407 authorization changed');
expect(decision?.article_route === '/updates/visa-stablecoin-platform-open-usd/', 'authorized article route changed');
expect(decision?.monitoring_subjects?.length === 2, 'authorized monitoring subject count changed');
expect(decision?.official_sources === 2 && decision?.baseline_status === 'pending_initial_acceptance', 'authorized source/baseline boundary changed');
expect(decision?.max_news_queries_added === 2 && decision?.canonical_action === 'none', 'authorized monitoring boundary changed');
expect(decision?.next_work_item === 'REVIEW GATE', 'PR #407 must end at review gate');

for (const marker of [
  "const canonicalPath = '/updates/visa-stablecoin-platform-open-usd/'",
  'Visa Stablecoin Platformとは何か――Open USDを起点にVisaが狙う「ステーブルコイン運用基盤」',
  "const publishedAt = '2026-07-17'",
  "const informationCurrentThrough = '2026-07-17'",
  'language="ja"',
  'この記事は編集・分析記事であり、Open USDの正式なSOGレコードではありません。',
  'https://investor.visa.com/news/news-details/2026/Visa-Introduces-Platform-for-Stablecoin-Minting-Movement-and-Management/default.aspx',
  'https://www.visa.com/en-us/solutions/stablecoins',
  'https://joinopenstandard.com/',
  'https://www.originprotocol.com/ousd',
  'https://docs.originprotocol.com/yield-bearing-tokens/ousd',
  '情報基準日：2026年7月17日。',
  '監視システムは記事やcanonicalデータを自動更新しない',
  'Origin Dollar（OUSD）'
]) expect(article.includes(marker), `${articlePath}: missing marker ${marker}`);
expect((article.match(/<li id="note-/g) ?? []).length === 3, 'article footnote count changed');

const updateId = 'sog_update_2026_07_17_visa_vsp_open_usd_analysis';
const update = updates.find((row) => row.id === updateId);
expect(updates.filter((row) => row.id === updateId).length === 1, 'Update Feed entry must exist exactly once');
expect(update?.date === '2026-07-17' && update?.category === 'content', 'Update Feed date/category changed');
expect(same(update?.related_paths, ['/updates/visa-stablecoin-platform-open-usd/']), 'Update Feed related path changed');
expect(publicCopy.includes(`${updateId}: {`), 'public Update Feed copy missing');

const sourceIds = ['open-standard-open-usd', 'visa-stablecoin-platform'];
const sourceById = new Map(sources.map((row) => [row.source_id, row]));
expect(new Set(sources.map((row) => row.source_id)).size === sources.length, 'official source IDs are not unique');
const openUsd = sourceById.get('open-standard-open-usd');
const vsp = sourceById.get('visa-stablecoin-platform');
expect(openUsd?.url === 'https://joinopenstandard.com/', 'Open USD source URL changed');
expect(openUsd?.monitoring_scope?.subject_kind === 'prelaunch_stablecoin', 'Open USD subject kind changed');
expect(openUsd?.monitoring_scope?.subject_name === 'Open USD' && openUsd?.monitoring_scope?.symbol === 'OUSD', 'Open USD identity changed');
expect(openUsd?.monitoring_scope?.launch_state === 'announced_prelaunch' && openUsd?.monitoring_scope?.canonical_record === false, 'Open USD state boundary changed');
expect(same(openUsd?.affected_stablecoin_ids, []) && same(openUsd?.affected_organization_ids, []), 'Open USD gained canonical target IDs');
expect(vsp?.url === 'https://www.visa.com/en-us/solutions/stablecoins', 'VSP source URL changed');
expect(vsp?.monitoring_scope?.subject_kind === 'stablecoin_infrastructure', 'VSP subject kind changed');
expect(vsp?.monitoring_scope?.subject_name === 'Visa Stablecoin Platform' && vsp?.monitoring_scope?.abbreviation === 'VSP', 'VSP identity changed');
expect(vsp?.monitoring_scope?.launch_state === 'select_client_beta' && vsp?.monitoring_scope?.canonical_record === false, 'VSP state boundary changed');
expect(same(vsp?.affected_stablecoin_ids, []) && same(vsp?.affected_organization_ids, []), 'VSP gained canonical target IDs');

const baselineById = new Map(baselines.baselines.map((row) => [row.source_id, row]));
expect(new Set(baselines.baselines.map((row) => row.source_id)).size === baselines.baselines.length, 'baseline IDs are not unique');
for (const id of sourceIds) {
  const baseline = baselineById.get(id);
  expect(Boolean(baseline), `baseline missing ${id}`);
  expect(baseline?.status === 'pending_initial_acceptance', `${id}: baseline was automatically accepted`);
  for (const field of ['accepted_final_url','body_sha256','normalized_content_sha256','content_type','etag','last_modified','accepted_observed_at','accepted_repository_commit','accepted_review_reference']) expect(baseline?.[field] === null, `${id}: pending field ${field} must remain null`);
}
expect(baselines.policy?.human_review_required === true, 'baseline human-review policy changed');
expect(baselines.policy?.monitoring_write_allowed === false && baselines.policy?.canonical_evidence === false && baselines.policy?.public_output === false, 'baseline canonical/public policy changed');
expect(baselines.policy?.automatic_pull_request === false && baselines.policy?.production_publication === false, 'baseline automatic-publication policy changed');

const queryIds = NEWS_DISCOVERY_QUERIES.map((row) => row.query_id);
expect(NEWS_DISCOVERY_QUERIES.length === 6 && new Set(queryIds).size === 6, 'news discovery must contain six unique queries');
expect(queryIds.includes('visa-vsp-open-usd') && queryIds.includes('open-standard-ousd-launch'), 'new monitoring queries missing');
const newsSource = readText('scripts/monitoring/monitors/news-discovery.mjs');
expect(newsSource.includes('const MAX_QUERIES = 6;'), 'news discovery maximum changed');
expect(newsSource.includes('public_output: false') && newsSource.includes("canonical_action: 'none'"), 'news discovery safety boundary changed');

expect(handoff.implementation_pr === 407 && handoff.status === 'implementation_complete', 'PR #407 handoff status changed');
expect(handoff.source_review_pr === 406, 'PR #407 review ancestry changed');
expect(handoff.article?.route === '/updates/visa-stablecoin-platform-open-usd/' && handoff.article?.language === 'ja', 'handoff article boundary changed');
expect(handoff.article?.update_feed_entry_id === updateId && handoff.article?.canonical_stablecoin_record === false, 'handoff article identity changed');
expect(same(handoff.private_monitoring?.source_ids, sourceIds), 'handoff source IDs changed');
expect(handoff.private_monitoring?.subject_count === 2 && handoff.private_monitoring?.pending_initial_baseline_count === 2 && handoff.private_monitoring?.news_queries_added === 2, 'handoff monitoring counts changed');
expect(handoff.private_monitoring?.public_output === false && handoff.private_monitoring?.automatic_baseline_acceptance === false, 'handoff monitoring safety changed');
expect(handoff.private_monitoring?.automatic_article_write === false && handoff.private_monitoring?.automatic_canonical_promotion === false, 'handoff automatic write boundary changed');
expect(handoff.canonical_counts?.assets === 112 && handoff.canonical_counts?.evidence === 559 && handoff.canonical_counts?.evidence_relations === 559, 'handoff canonical counts changed');
expect(handoff.canonical_changes === 0 && handoff.public_machine_readable_canonical_changes === 0, 'handoff canonical change boundary changed');
expect(handoff.next_work_item?.decision === 'review_gate_required', 'PR #407 must stop at review gate');

try {
  git('rev-parse', '--verify', 'origin/main');
  const baseUpdates = JSON.parse(git('show', 'origin/main:data/registry-updates.json'));
  const baseUpdateIds = new Set(baseUpdates.map((row) => row.id));
  const addedUpdates = updates.filter((row) => !baseUpdateIds.has(row.id));
  expect(addedUpdates.length === 1 && addedUpdates[0].id === updateId, 'PR #407 must add exactly one Update Feed entry');
  for (const row of baseUpdates) expect(same(row, updates.find((candidate) => candidate.id === row.id)), `existing Update Feed entry changed ${row.id}`);

  const baseSources = JSON.parse(git('show', 'origin/main:scripts/monitoring/sources/official-sources.json'));
  const baseSourceIds = new Set(baseSources.map((row) => row.source_id));
  const addedSources = sources.filter((row) => !baseSourceIds.has(row.source_id)).map((row) => row.source_id).sort();
  expect(same(addedSources, [...sourceIds].sort()), 'PR #407 must add exactly two official sources');
  for (const row of baseSources) expect(same(row, sources.find((candidate) => candidate.source_id === row.source_id)), `existing official source changed ${row.source_id}`);

  const baseBaselines = JSON.parse(git('show', 'origin/main:scripts/monitoring/baselines/official-source-baselines.json'));
  const baseBaselineIds = new Set(baseBaselines.baselines.map((row) => row.source_id));
  const addedBaselines = baselines.baselines.filter((row) => !baseBaselineIds.has(row.source_id)).map((row) => row.source_id).sort();
  expect(same(addedBaselines, [...sourceIds].sort()), 'PR #407 must add exactly two baseline rows');
  for (const row of baseBaselines.baselines) expect(same(row, baselines.baselines.find((candidate) => candidate.source_id === row.source_id)), `existing baseline changed ${row.source_id}`);

  const changedData = git('diff', '--name-only', 'origin/main...HEAD', '--', 'data/').split('\n').filter(Boolean);
  expect(same(changedData, ['data/registry-updates.json']), 'data change boundary must contain only registry-updates.json');
  const changedPublic = git('diff', '--name-only', 'origin/main...HEAD', '--', 'public/').split('\n').filter(Boolean);
  expect(changedPublic.length === 0, 'monitoring or generated output changed public/ directly');
  for (const file of ['data/stats-history.json','docs/migration/current-canonical-checkpoint.json','docs/migration/current-stats-history-checkpoint.json','docs/migration/registry-release-integrity-baseline.json']) {
    expect(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: checkpoint/statistics content changed`);
  }
} catch (error) {
  failures.push(`origin/main comparison failed: ${error.message}`);
}

const layout = readText('src/layouts/BaseLayout.astro');
expect(layout.includes('language?: string') && layout.includes("language = 'en'") && layout.includes('<html lang={language}>'), 'BaseLayout language contract missing');
expect(layout.includes("language === 'ja' ? 'ja_JP' : 'en_US'"), 'BaseLayout locale metadata missing');

for (const file of ['public/data/open-standard-open-usd.json','public/data/visa-stablecoin-platform.json','public/data/visa-open-usd-article-monitoring-pr407-handoff.json','src/pages/stablecoin/open-usd/index.astro','src/pages/issuer/open-standard/index.astro']) expect(!fs.existsSync(path.join(root, file)), `${file}: unauthorized canonical/public monitoring surface exists`);

if (failures.length) {
  console.error('PR #407 Visa/Open USD article and monitoring validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, implementation_pr: 407, article_route: handoff.article.route, update_feed_entries_added: 1, private_monitoring_sources_added: 2, pending_baselines_added: 2, news_queries_added: 2, canonical_changes: 0, next_authority: handoff.next_work_item.decision }, null, 2));
