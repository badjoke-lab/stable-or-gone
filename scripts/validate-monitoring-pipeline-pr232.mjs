import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadOfficialSources } from './monitoring/monitors/official-source-observer.mjs';
import { runMonitoring } from './monitoring/run.mjs';
import { buildReviewMaterial } from './monitoring/review/build-review-material.mjs';

const failures = [];
const fail = (message) => failures.push(message);
const root = process.cwd();
const source = loadOfficialSources(root)[0];
const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'sog-pr232-'));

try {
  const result = await runMonitoring({
    outputRoot: temporaryRoot,
    runId: '20260629T020000Z-pr232',
    startedAt: '2026-06-29T02:00:00.000Z',
    sourceCommit: 'pr232fixture',
    sourceBranch: 'pr232-test',
    mode: 'official-sources',
    includeReviewMaterial: true,
    sources: [source],
    fetchImpl: async () => new Response('<html><body>reserves assurance PR232_BODY_MARKER</body></html>', {
      status: 200,
      headers: { 'content-type': 'text/html', etag: 'pr232-fixture' }
    })
  });

  const files = fs.readdirSync(result.run_directory).sort();
  const expected = ['evidence-drafts.json','health.json','manifest.json','monitoring-candidates.json','official-source-observations.json','pr-material.md','review-material.json','review-report.md','summary.md'];
  if (JSON.stringify(files) !== JSON.stringify(expected)) fail(`output mismatch: ${files.join(', ')}`);

  const manifest = JSON.parse(fs.readFileSync(path.join(result.run_directory, 'manifest.json'), 'utf8'));
  const review = JSON.parse(fs.readFileSync(path.join(result.run_directory, 'review-material.json'), 'utf8'));
  const drafts = JSON.parse(fs.readFileSync(path.join(result.run_directory, 'evidence-drafts.json'), 'utf8'));
  const report = fs.readFileSync(path.join(result.run_directory, 'review-report.md'), 'utf8');
  const prMaterial = fs.readFileSync(path.join(result.run_directory, 'pr-material.md'), 'utf8');
  const serialized = files.map((file) => fs.readFileSync(path.join(result.run_directory, file), 'utf8')).join('\n');

  if (!manifest.review_material_enabled || manifest.review_item_count !== 1 || manifest.evidence_draft_count !== 1) fail('manifest review counts invalid');
  if (!manifest.canonical_guard?.ok || manifest.canonical_guard.changed_paths.length !== 0) fail('canonical guard failed');
  if (review.status !== 'needs_human_review' || review.safety?.canonical_action !== 'none' || review.safety?.automatic_pull_request !== false) fail('review safety invalid');
  const item = review.review_items?.[0];
  if (!item?.observed_facts?.body_sha256 || item.review_status !== 'pending_human_decision' || item.canonical_action !== 'none') fail('review item invalid');
  if (!item?.inferences?.every((entry) => entry.status === 'unconfirmed' && entry.confidence === 'low' && entry.canonical_action === 'none')) fail('inference boundary invalid');
  if (!item?.unresolved_questions?.length) fail('unresolved questions missing');
  const draft = drafts.drafts?.[0];
  if (drafts.status !== 'draft_only' || draft?.status !== 'draft_needs_human_review' || draft?.canonical_action !== 'none') fail('evidence draft invalid');
  if (draft?.draft_action !== 'link_existing_evidence' || !draft?.existing_evidence_ids?.length) fail('existing evidence URL was not matched');

  const duplicateOfficial = { ...result.official, candidates: [result.official.candidates[0], { ...result.official.candidates[0] }], candidate_count: 2 };
  const duplicateResult = buildReviewMaterial({ root, official: duplicateOfficial, createdAt: '2026-06-29T02:00:00.000Z' });
  if (duplicateResult.reviewMaterial.counts.review_items !== 1 || duplicateResult.reviewMaterial.counts.rejected_duplicates !== 1) fail('duplicate candidate rejection failed');

  for (const phrase of ['## Observed facts','## Inferences requiring review','## Unresolved questions','## Human approval checklist','## Safety boundary']) if (!report.includes(phrase)) fail(`review report missing ${phrase}`);
  for (const phrase of ['# DRAFT ONLY','## Proposed canonical changes','## Human approval','No production deployment required']) if (!prMaterial.includes(phrase)) fail(`PR material missing ${phrase}`);
  if (serialized.includes('PR232_BODY_MARKER')) fail('raw source body leaked');
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
} finally {
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}

const workflow = fs.readFileSync('.github/workflows/monitoring-review.yml', 'utf8');
if (!workflow.includes('SOG_MONITORING_REVIEW_MATERIAL')) fail('workflow review flag missing');
for (const forbidden of ['contents: write', 'pull-requests: write', 'schedule:', 'wrangler']) if (workflow.includes(forbidden)) fail(`workflow contains ${forbidden}`);

if (failures.length) {
  console.error('PR #232 monitoring validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('PR #232 monitoring validation passed.');
