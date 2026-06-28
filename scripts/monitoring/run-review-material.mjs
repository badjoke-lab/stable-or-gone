import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { writeJson, writeText } from './core/fs-utils.mjs';
import { buildReviewMaterial } from './review/build-review-material.mjs';
import { runMonitoring } from './run.mjs';

export async function runReviewMaterial(options = {}) {
  const result = await runMonitoring({ ...options, mode: 'official-sources' });
  const reviewBundle = buildReviewMaterial({
    runId: result.manifest.run_id,
    createdAt: result.manifest.started_at,
    observations: result.official?.observations ?? [],
    candidates: result.official?.candidates ?? []
  });

  const outputFiles = [
    'manifest.json',
    'health.json',
    'official-source-observations.json',
    'monitoring-candidates.json',
    'review-material.json',
    'pr-material.json',
    'review-report.md',
    'summary.md'
  ];

  const manifest = {
    ...result.manifest,
    mode: 'review-material',
    evidence_draft_count: reviewBundle.review.evidence_drafts.length,
    review_material_generated: true,
    output_files: outputFiles
  };

  writeJson(path.join(result.run_directory, 'review-material.json'), reviewBundle.review);
  writeJson(path.join(result.run_directory, 'pr-material.json'), reviewBundle.prMaterial);
  writeText(path.join(result.run_directory, 'review-report.md'), reviewBundle.reportMarkdown);
  writeJson(path.join(result.run_directory, 'manifest.json'), manifest);

  const existingSummary = fs.readFileSync(path.join(result.run_directory, 'summary.md'), 'utf8')
    .replace('- Mode: `official-sources`', '- Mode: `review-material`');
  const reviewSummary = [
    existingSummary.trimEnd(),
    '',
    '## Review material',
    '',
    `- Observed facts: ${reviewBundle.review.observed_facts.length}`,
    `- Candidate inferences: ${reviewBundle.review.candidate_inferences.length}`,
    `- Unresolved questions: ${reviewBundle.review.unresolved_questions.length}`,
    `- Evidence drafts: ${reviewBundle.review.evidence_drafts.length}`,
    '- Canonical changes allowed: `false`',
    '- Human approval required: `true`',
    ''
  ].join('\n');
  writeText(path.join(result.run_directory, 'summary.md'), reviewSummary);

  return { ...result, manifest, reviewBundle };
}

async function main() {
  const result = await runReviewMaterial();
  console.log(JSON.stringify({
    run_directory: result.run_directory,
    run_id: result.manifest.run_id,
    status: result.manifest.status,
    candidate_count: result.manifest.candidate_count,
    evidence_draft_count: result.manifest.evidence_draft_count,
    canonical_guard: result.manifest.canonical_guard
  }, null, 2));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
