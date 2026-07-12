import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const write = (file, body) => fs.writeFileSync(file, body);

const authorityBlock = `
## PR #358 active authority

Current work item:

\`\`\`text
PR #357 Tier A Dossier Deepening — Batch 3: complete
PR #358 Record Growth Batch 1: active
PR #359 Market Access Pilot 2: next
\`\`\`

Binding references:

\`\`\`text
docs/roadmap-amendments/2026-07-13-pr358-record-growth-batch-1-activation.md
docs/quality/record-growth-batch-1-pr358-spec.md
config/record-growth-batch-1-pr358.json
data/editorial-research/record-growth-batch-1-pr358-candidates.json
docs/migration/tier-a-batch-3-pr357-reviewed-handoff.json
\`\`\`

Selected context group:

\`\`\`text
current USD reserve-backed institutional stablecoins
\`\`\`

Selected candidates:

\`\`\`text
Global Dollar / USDG / sog_st_usdg
World Liberty Financial USD1 / USD1 / sog_st_usd1
\`\`\`

Candidate selection is not canonical promotion. PR #358 may add no more than two fully reviewed records, must reject thin records, preserves four canonical Market Access Records, and adds no public product surface.
`;

function advance(body) {
  body = body
    .replaceAll('PR #357 Tier A Dossier Deepening — Batch 3: active', 'PR #357 Tier A Dossier Deepening — Batch 3: complete')
    .replaceAll('PR #358 Record Growth Batch 1: next', 'PR #358 Record Growth Batch 1: active')
    .replaceAll('PR #357  Tier A Dossier Deepening — Batch 3 — active', 'PR #357  Tier A Dossier Deepening — Batch 3 — complete')
    .replaceAll('PR #358  Record Growth Batch 1 — next', 'PR #358  Record Growth Batch 1 — active');
  if (!body.includes('PR #359 Market Access Pilot 2: next')) {
    body = body.replace(
      /PR #358 Record Growth Batch 1: active\n```/,
      'PR #358 Record Growth Batch 1: active\nPR #359 Market Access Pilot 2: next\n```'
    );
  }
  body = body.replaceAll('PR #359  Market Access Pilot 2\n', 'PR #359  Market Access Pilot 2 — next\n');
  return body;
}

function ensureBlock(body) {
  if (!body.includes('## PR #358 active authority')) body = `${body.trimEnd()}\n${authorityBlock}\n`;
  return body;
}

function updateReadme() {
  let body = advance(read('README.md'));
  body = body.replace('## Active PR #357 Tier A Dossier Deepening — Batch 3', '## Completed PR #357 Tier A Dossier Deepening — Batch 3');
  if (!body.includes('## Active PR #358 Record Growth Batch 1')) {
    const section = `## Active PR #358 Record Growth Batch 1\n\nPR #358 is bounded to full-record review of Global Dollar (USDG) and World Liberty Financial USD1 (USD1). Candidate selection remains noncanonical until duplicate, evidence, organization, profile, deployment, event, and known-unknown requirements are satisfied.\n\n`;
    body = body.replace('## Post-351 operating mode', `${section}## Post-351 operating mode`);
  }
  write('README.md', ensureBlock(body));
}

function updateAgents() {
  let body = advance(read('AGENTS.md'));
  body = body.replace(
    'Current work-item specification:\n\n```text\ndocs/quality/tier-a-dossier-batch-3-pr357-spec.md\n```',
    'Current work-item specification:\n\n```text\ndocs/quality/record-growth-batch-1-pr358-spec.md\n```'
  );
  write('AGENTS.md', ensureBlock(body));
}

function updateGovernance() {
  let body = advance(read('docs/spec-governance.md'));
  body = body.replace('Updated: 2026-07-13', 'Updated: 2026-07-13');
  body = body.replace(
    'Current work-item specification:\n\n```text\ndocs/quality/tier-a-dossier-batch-3-pr357-spec.md\n```',
    'Current work-item specification:\n\n```text\ndocs/quality/record-growth-batch-1-pr358-spec.md\n```'
  );
  write('docs/spec-governance.md', ensureBlock(body));
}

function updateRoadmap() {
  let body = advance(read('docs/roadmap.md'));
  body = body.replace('## 3. Completed program through PR #356', '## 3. Completed program through PR #357');
  if (!body.includes('Tier A Dossier Deepening — Batch 3\n```')) {
    body = body.replace('Market Access Pilot 1\n```', 'Market Access Pilot 1\nTier A Dossier Deepening — Batch 3\n```');
  }
  body = body.replace('## 10. PR #358 — Record Growth Batch 1', '## 10. PR #358 — Record Growth Batch 1 — active');
  write('docs/roadmap.md', ensureBlock(body));
}

updateReadme();
updateAgents();
updateGovernance();
updateRoadmap();
console.log('PR #358 repository authority synchronized.');
