import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const write = (file, body) => fs.writeFileSync(file, body);

const authorityBlock = `
## PR #360 active authority

Current work item:

\`\`\`text
PR #359 Market Access Pilot 2: complete
PR #360 Evidence and Correction Batch: active
post-PR #360 review gate: next
\`\`\`

Binding references:

\`\`\`text
docs/roadmap-amendments/2026-07-14-pr360-evidence-correction-batch-activation.md
docs/quality/evidence-correction-batch-pr360-spec.md
config/evidence-correction-batch-pr360.json
docs/migration/market-access-pilot-2-pr359-reviewed-handoff.json
docs/migration/evidence-correction-queue-pr360.json
\`\`\`

Starting boundary:

\`\`\`text
canonical assets: 112
canonical Evidence: 557
Evidence Relations: 557
archive indexes recorded: 380
archive not recorded: 177
Market Access Records: 8
\`\`\`

PR #360 may touch at most 10 Evidence records and 5 non-Evidence records. Queue selection is internal and does not authorize automatic canonical correction. No asset, Market Access, ranking, score, or public product surface may be added.
`;

function advance(body) {
  body = body
    .replaceAll('PR #359 Market Access Pilot 2: active', 'PR #359 Market Access Pilot 2: complete')
    .replaceAll('PR #360 Evidence and Correction Batch: next', 'PR #360 Evidence and Correction Batch: active')
    .replaceAll('PR #359  Market Access Pilot 2 — active', 'PR #359  Market Access Pilot 2 — complete')
    .replaceAll('PR #360  Evidence and Correction Batch — next', 'PR #360  Evidence and Correction Batch — active');
  if (!body.includes('post-PR #360 review gate: next')) {
    body = body.replace(/PR #360 Evidence and Correction Batch: active\n```/, 'PR #360 Evidence and Correction Batch: active\npost-PR #360 review gate: next\n```');
  }
  return body;
}

function ensureBlock(body) {
  if (!body.includes('## PR #360 active authority')) body = `${body.trimEnd()}\n${authorityBlock}\n`;
  return body;
}

for (const file of ['README.md','AGENTS.md','docs/spec-governance.md','docs/roadmap.md']) {
  let body = advance(read(file));
  if (file === 'README.md') {
    body = body.replace('## Active PR #359 Market Access Pilot 2', '## Completed PR #359 Market Access Pilot 2');
    if (!body.includes('## Active PR #360 Evidence and Correction Batch')) {
      body = body.replace('## Post-351 operating mode', '## Active PR #360 Evidence and Correction Batch\n\nPR #360 is a bounded quality-maintenance batch for broken links, archives, source identities, Evidence Relations, wording, dates, organization relationships, and known unknowns. It adds no asset or public product surface.\n\n## Post-351 operating mode');
    }
  }
  if (file === 'AGENTS.md' || file === 'docs/spec-governance.md') {
    body = body.replace('Current work-item specification:\n\n```text\ndocs/quality/market-access-pilot-2-pr359-spec.md\n```', 'Current work-item specification:\n\n```text\ndocs/quality/evidence-correction-batch-pr360-spec.md\n```');
  }
  if (file === 'docs/roadmap.md') {
    body = body.replace('## 3. Completed program through PR #358', '## 3. Completed program through PR #359');
    if (!body.includes('Market Access Pilot 2\n```')) body = body.replace('Record Growth Batch 1\n```', 'Record Growth Batch 1\nMarket Access Pilot 2\n```');
    body = body.replace('## 11. PR #359 — Market Access Pilot 2 — active', '## 11. PR #359 — Market Access Pilot 2 — complete');
    body = body.replace('## 12. PR #360 — Evidence and Correction Batch', '## 12. PR #360 — Evidence and Correction Batch — active');
  }
  write(file, ensureBlock(body));
}

console.log('PR #360 repository authority synchronized.');
