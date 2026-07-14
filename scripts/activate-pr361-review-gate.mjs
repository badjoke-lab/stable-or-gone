import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const write = (file, body) => fs.writeFileSync(file, body);

const block = `
## PR #361 active review-gate authority

Current work item:

\`\`\`text
PR #360 Evidence and Correction Batch: complete
PR #361 Post-PR #360 Review Gate: active
PR #362 Record Depth and Coverage Baseline Refresh: next
\`\`\`

Approved bounded sequence after review:

\`\`\`text
PR #362 Record Depth and Coverage Baseline Refresh
PR #363 Tier A Dossier Deepening Batch 4
PR #364 Evidence and Archive Maintenance Batch 2
review gate
\`\`\`

Not approved in this sequence:

\`\`\`text
Market Access Pilot 3
Record Growth Batch 2
new public product surface
asset ranking or composite score
automatic monitoring promotion
\`\`\`

Binding references:

\`\`\`text
docs/quality/post-pr360-review-gate-pr361-spec.md
config/post-pr360-review-gate-pr361.json
docs/migration/evidence-correction-batch-pr360-reviewed-handoff.json
docs/migration/post-pr360-review-gate-pr361.json
\`\`\`
`;

function advance(body) {
  return body
    .replaceAll('PR #360 Evidence and Correction Batch: active', 'PR #360 Evidence and Correction Batch: complete')
    .replaceAll('PR #360 Evidence and Correction Batch — active — active', 'PR #360 Evidence and Correction Batch — complete')
    .replaceAll('PR #360 Evidence and Correction Batch — active', 'PR #360 Evidence and Correction Batch — complete')
    .replaceAll('post-PR #360 review gate: next', 'PR #361 Post-PR #360 Review Gate: active');
}

function ensureBlock(body) {
  if (!body.includes('## PR #361 active review-gate authority')) body = `${body.trimEnd()}\n${block}\n`;
  return body;
}

for (const file of ['README.md','AGENTS.md','docs/spec-governance.md','docs/roadmap.md']) {
  let body = advance(read(file));
  if (file === 'README.md') {
    body = body.replace('## Active PR #360 Evidence and Correction Batch', '## Completed PR #360 Evidence and Correction Batch');
    if (!body.includes('## Active PR #361 Post-PR #360 Review Gate')) {
      body = body.replace('## Post-351 operating mode', '## Active PR #361 Post-PR #360 Review Gate\n\nPR #361 recomputes the current 112-asset planning state and decides the next bounded sequence without changing canonical data or adding a public product surface.\n\n## Post-351 operating mode');
    }
  }
  if (file === 'AGENTS.md' || file === 'docs/spec-governance.md') {
    body = body.replace('Current work-item specification:\n\n```text\ndocs/quality/evidence-correction-batch-pr360-spec.md\n```', 'Current work-item specification:\n\n```text\ndocs/quality/post-pr360-review-gate-pr361-spec.md\n```');
  }
  if (file === 'docs/roadmap.md') {
    body = body.replace('## 3. Completed program through PR #359', '## 3. Completed program through PR #360');
    if (!body.includes('Evidence and Correction Batch\n```')) body = body.replace('Market Access Pilot 2\n```', 'Market Access Pilot 2\nEvidence and Correction Batch\n```');
    body = body.replace('## 13. Review gate after PR #360', '## 13. PR #361 — Post-PR #360 Review Gate — active');
    if (!body.includes('## 13A. Approved sequence after PR #361')) {
      body = body.replace('## 14. Parallel operating lanes', `## 13A. Approved sequence after PR #361\n\n\`\`\`text\nPR #362 Record Depth and Coverage Baseline Refresh\nPR #363 Tier A Dossier Deepening Batch 4\nPR #364 Evidence and Archive Maintenance Batch 2\nREVIEW GATE\n\`\`\`\n\nMarket Access Pilot 3, Record Growth Batch 2, and new public surfaces are not approved in this sequence.\n\n## 14. Parallel operating lanes`);
    }
  }
  write(file, ensureBlock(body));
}

console.log('PR #361 review-gate authority synchronized.');
