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

## PR #364 active Tier A Dossier Batch 4 authority

Current work item:

\`\`\`text
PR #363 Record Depth and Coverage Baseline Refresh: complete
PR #364 Tier A Dossier Deepening Batch 4: active
PR #365 Evidence and Archive Maintenance Batch 2: next
\`\`\`

Reviewed non-ranking selection:

\`\`\`text
HUSD: redemption
poundtoken: lifecycle, organization relationships, redemption
RLUSD: redemption
USDG: legal profile, redemption
USDS: legal profile
\`\`\`

Binding references:

\`\`\`text
docs/roadmap-amendments/2026-07-14-pr364-tier-a-batch-4-activation.md
docs/quality/tier-a-dossier-batch-4-pr364-spec.md
config/tier-a-dossier-batch-4-pr364.json
docs/migration/record-depth-baseline-pr363-summary.json
docs/migration/record-depth-baseline-pr363-delta.json
docs/migration/tier-a-candidate-queue-pr363.json
docs/migration/tier-a-dossier-batch-4-pr364-review-queue.json
docs/migration/tier-a-dossier-batch-4-pr364-findings.json
\`\`\`

PR #364 may improve only the five reviewed existing dossiers and authorized dimensions. It adds no stable asset, Market Access Record, deployment, reserve report, income profile, public surface, ranking, score, or automatic promotion path.
`;

for (const file of authorityFiles) {
  let body = read(file);
  body = body.replaceAll('PR #363 Record Depth and Coverage Baseline Refresh: active', 'PR #363 Record Depth and Coverage Baseline Refresh: complete');
  body = body.replaceAll('PR #364 Tier A Dossier Deepening Batch 4: next', 'PR #364 Tier A Dossier Deepening Batch 4: active');
  body = body.replaceAll('PR #364 Tier A Dossier Deepening — Batch 4: next', 'PR #364 Tier A Dossier Deepening — Batch 4: active');
  if (!body.includes('PR #364 Tier A Dossier Deepening Batch 4: active') && !body.includes('PR #364 Tier A Dossier Deepening — Batch 4: active')) {
    body += '\nPR #364 Tier A Dossier Deepening Batch 4: active\n';
  }
  if (!body.includes('PR #365 Evidence and Archive Maintenance Batch 2: next')) body += '\nPR #365 Evidence and Archive Maintenance Batch 2: next\n';
  if (!body.includes('## PR #364 active Tier A Dossier Batch 4 authority')) body += authoritySection;
  write(file, body);
}

let agents = read('AGENTS.md');
agents = agents.replace('docs/quality/record-depth-baseline-refresh-pr363-spec.md', 'docs/quality/tier-a-dossier-batch-4-pr364-spec.md');
if (!agents.includes('docs/roadmap-amendments/2026-07-14-pr364-tier-a-batch-4-activation.md')) {
  agents = agents.replace(
    'docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md',
    'docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md\ndocs/roadmap-amendments/2026-07-14-pr364-tier-a-batch-4-activation.md'
  );
}
write('AGENTS.md', agents);

let operating = read('docs/post-351-data-growth-operating-spec.md');
operating = operating.replace('docs/quality/record-depth-baseline-refresh-pr363-spec.md', 'docs/quality/tier-a-dossier-batch-4-pr364-spec.md');
write('docs/post-351-data-growth-operating-spec.md', operating);

let nonUi = read('scripts/validate-non-ui-release-material.mjs');
nonUi = nonUi
  .replaceAll("'PR #363 Record Depth and Coverage Baseline Refresh: active'", "'PR #363 Record Depth and Coverage Baseline Refresh: complete'")
  .replaceAll("'PR #364 Tier A Dossier Deepening Batch 4: next'", "'PR #364 Tier A Dossier Deepening Batch 4: active'")
  .replaceAll("'PR #364 Tier A Dossier Deepening Batch 4'", "'PR #364 Tier A Dossier Deepening Batch 4'")
  .replaceAll("'PR #365 Evidence and Archive Maintenance Batch 2'", "'PR #365 Evidence and Archive Maintenance Batch 2'")
  .replace("active_workstream: 'pr363_record_depth_baseline_refresh'", "active_workstream: 'pr364_tier_a_dossier_batch_4'")
  .replace("next_workstream: 'pr364_tier_a_dossier_batch_4'", "next_workstream: 'pr365_evidence_archive_maintenance_batch_2'");
write('scripts/validate-non-ui-release-material.mjs', nonUi);

write('scripts/check-workstream-123.mjs', "import './validate-tier-a-dossier-batch-4-pr364.mjs';\n");
write('scripts/validate-active-workstream.mjs', "import './check-workstream-123.mjs';\n");

console.log(JSON.stringify({
  ok: true,
  active_workstream: 'pr364_tier_a_dossier_batch_4',
  next_workstream: 'pr365_evidence_archive_maintenance_batch_2',
  authority_files: authorityFiles,
  validator: 'scripts/check-workstream-123.mjs'
}, null, 2));
