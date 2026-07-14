import fs from 'node:fs';

const authorityFiles = [
  'README.md',
  'AGENTS.md',
  'docs/spec-governance.md',
  'docs/roadmap.md',
  'docs/post-351-data-growth-operating-spec.md'
];
const read = (file) => fs.readFileSync(file, 'utf8');
const write = (file, value) => fs.writeFileSync(file, value.endsWith('\n') ? value : `${value}\n`);

const authoritySection = `

## PR #363 active Record Depth refresh authority

Current work item:

\`\`\`text
PR #361 Post-PR #360 Review Gate: complete
PR #363 Record Depth and Coverage Baseline Refresh: active
PR #364 Tier A Dossier Deepening Batch 4: next
\`\`\`

Binding references:

\`\`\`text
docs/roadmap-amendments/2026-07-14-pr363-record-depth-refresh-activation.md
docs/quality/record-depth-baseline-refresh-pr363-spec.md
config/record-depth-baseline-refresh-pr363.json
docs/migration/post-pr360-review-gate-pr361.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
\`\`\`

Required outputs:

\`\`\`text
docs/migration/record-depth-baseline-pr363-summary.json
docs/migration/record-depth-baseline-pr363-delta.json
docs/migration/tier-a-candidate-queue-pr363.json
\`\`\`

PR #363 changes no canonical data or public product surface. The refreshed queue is internal, deterministic, and non-ranking. PR #364 may select at most five assets only after manual source review.
`;

for (const file of authorityFiles) {
  let body = read(file);
  body = body.replaceAll('PR #361 Post-PR #360 Review Gate: active', 'PR #361 Post-PR #360 Review Gate: complete');
  body = body.replaceAll('PR #363 Record Depth and Coverage Baseline Refresh: next', 'PR #363 Record Depth and Coverage Baseline Refresh: active');
  if (!body.includes('PR #361 Post-PR #360 Review Gate: complete')) body += '\nPR #361 Post-PR #360 Review Gate: complete\n';
  if (!body.includes('PR #363 Record Depth and Coverage Baseline Refresh: active')) body += '\nPR #363 Record Depth and Coverage Baseline Refresh: active\n';
  if (!body.includes('PR #364 Tier A Dossier Deepening Batch 4: next')) body += '\nPR #364 Tier A Dossier Deepening Batch 4: next\n';
  if (!body.includes('## PR #363 active Record Depth refresh authority')) body += authoritySection;
  write(file, body);
}

let agents = read('AGENTS.md');
agents = agents.replaceAll('docs/quality/post-pr360-review-gate-pr361-spec.md', 'docs/quality/record-depth-baseline-refresh-pr363-spec.md');
write('AGENTS.md', agents);

let operating = read('docs/post-351-data-growth-operating-spec.md');
operating = operating.replaceAll('docs/quality/post-pr360-review-gate-pr361-spec.md', 'docs/quality/record-depth-baseline-refresh-pr363-spec.md');
write('docs/post-351-data-growth-operating-spec.md', operating);

let nonUi = read('scripts/validate-non-ui-release-material.mjs');
nonUi = nonUi
  .replaceAll("'PR #361 Post-PR #360 Review Gate: active'", "'PR #361 Post-PR #360 Review Gate: complete'")
  .replaceAll("'PR #362 Record Depth and Coverage Baseline Refresh: next'", "'PR #363 Record Depth and Coverage Baseline Refresh: active'")
  .replaceAll("'PR #362 Record Depth and Coverage Baseline Refresh'", "'PR #363 Record Depth and Coverage Baseline Refresh'")
  .replaceAll("'PR #363 Tier A Dossier Deepening Batch 4'", "'PR #364 Tier A Dossier Deepening Batch 4'")
  .replaceAll("'PR #364 Evidence and Archive Maintenance Batch 2'", "'PR #365 Evidence and Archive Maintenance Batch 2'")
  .replaceAll('JSON.stringify([362,363,364])', 'JSON.stringify([363,364,365])')
  .replace("active_workstream: 'pr361_post_pr360_review_gate'", "active_workstream: 'pr363_record_depth_baseline_refresh'")
  .replace("next_workstream: 'pr362_record_depth_baseline_refresh'", "next_workstream: 'pr364_tier_a_dossier_batch_4'");
write('scripts/validate-non-ui-release-material.mjs', nonUi);

write('scripts/check-workstream-122.mjs', "import './validate-record-depth-baseline-refresh-pr363.mjs';\n");
write('scripts/validate-active-workstream.mjs', "import './check-workstream-122.mjs';\n");

console.log(JSON.stringify({
  ok: true,
  active_workstream: 'pr363_record_depth_baseline_refresh',
  next_workstream: 'pr364_tier_a_dossier_batch_4',
  authority_files: authorityFiles,
  validator: 'scripts/check-workstream-122.mjs'
}, null, 2));
