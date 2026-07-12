import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const write = (file, body) => fs.writeFileSync(file, body);

const activeAuthorityBlock = `
## PR #357 active authority

Current work item:

\`\`\`text
PR #356 Market Access Pilot 1: complete
PR #357 Tier A Dossier Deepening — Batch 3: active
PR #358 Record Growth Batch 1: next
\`\`\`

Binding references:

\`\`\`text
docs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md
docs/quality/tier-a-dossier-batch-3-pr357-spec.md
config/tier-a-dossier-batch-3-pr357.json
docs/migration/record-depth-baseline-pr353-summary.json
docs/migration/tier-a-candidate-queue-pr353.json
docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json
docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json
docs/migration/market-access-pilot-1-pr356-reviewed-handoff.json
\`\`\`

Selected assets:

\`\`\`text
AUDD
FEI
HUSD
MIM
NZDS
\`\`\`

This is deterministic queue consumption, not a ranking. PR #357 preserves 110 canonical stable assets, four canonical Market Access Records, canonical-only publication, and the existing public-surface boundary.
`;

function advanceStatus(body) {
  body = body
    .replaceAll('PR #356 Market Access Pilot 1: active', 'PR #356 Market Access Pilot 1: complete')
    .replaceAll('PR #357 Tier A Dossier Deepening — Batch 3: next', 'PR #357 Tier A Dossier Deepening — Batch 3: active')
    .replaceAll('PR #356  Market Access Pilot 1 — active', 'PR #356  Market Access Pilot 1 — complete')
    .replaceAll('PR #357  Tier A Dossier Deepening — Batch 3 — next', 'PR #357  Tier A Dossier Deepening — Batch 3 — active');

  if (!body.includes('PR #358 Record Growth Batch 1: next')) {
    body = body.replace(
      /PR #357 Tier A Dossier Deepening — Batch 3: active\n```/,
      'PR #357 Tier A Dossier Deepening — Batch 3: active\nPR #358 Record Growth Batch 1: next\n```'
    );
  }
  body = body.replaceAll('PR #358  Record Growth Batch 1\n', 'PR #358  Record Growth Batch 1 — next\n');
  return body;
}

function ensureActiveAuthority(body) {
  if (!body.includes('## PR #357 active authority')) body = `${body.trimEnd()}\n${activeAuthorityBlock}\n`;
  return body;
}

function updateReadme() {
  const file = 'README.md';
  let body = advanceStatus(read(file));
  body = body.replace('## Active PR #356 Market Access Pilot 1', '## Completed PR #356 Market Access Pilot 1');
  if (!body.includes('## Active PR #357 Tier A Dossier Deepening — Batch 3')) {
    const section = `## Active PR #357 Tier A Dossier Deepening — Batch 3\n\nPR #357 is bounded to AUDD, FEI, HUSD, MIM, and NZDS. It may deepen only the authorized events, lifecycle, organization-relationship, redemption, and legal-profile dimensions. It adds no stable asset, changes no Market Access Record, and adds no public product surface.\n\n`;
    body = body.replace('## Post-351 operating mode', `${section}## Post-351 operating mode`);
  }
  body = ensureActiveAuthority(body);
  write(file, body);
}

function updateAgents() {
  const file = 'AGENTS.md';
  let body = advanceStatus(read(file));
  body = body.replace(
    'Current work-item specification:\n\n```text\ndocs/quality/market-access-pilot-1-pr356-spec.md\n```',
    'Current work-item specification:\n\n```text\ndocs/quality/tier-a-dossier-batch-3-pr357-spec.md\n```'
  );
  body = body.replace('## 8. Completed PR #355 and active PR #356 rules', '## 8. Completed PR #355 and PR #356 rules');
  body = ensureActiveAuthority(body);
  write(file, body);
}

function updateGovernance() {
  const file = 'docs/spec-governance.md';
  let body = advanceStatus(read(file));
  body = body.replace('Updated: 2026-07-12', 'Updated: 2026-07-13');
  body = body.replace(
    'Current work-item specification:\n\n```text\ndocs/quality/market-access-pilot-1-pr356-spec.md\n```',
    'Current work-item specification:\n\n```text\ndocs/quality/tier-a-dossier-batch-3-pr357-spec.md\n```'
  );
  body = body.replace('### Active PR #356 Market Access Pilot 1', '### Completed PR #356 Market Access Pilot 1');
  body = ensureActiveAuthority(body);
  write(file, body);
}

function updateRoadmap() {
  const file = 'docs/roadmap.md';
  let body = advanceStatus(read(file));
  body = body.replace('Updated: 2026-07-12', 'Updated: 2026-07-13');
  body = body.replace('## 3. Completed program through PR #355', '## 3. Completed program through PR #356');
  if (!body.includes('Market Access Pilot 1\n```')) {
    body = body.replace('Tier A Dossier Deepening — Batch 2\n```', 'Tier A Dossier Deepening — Batch 2\nMarket Access Pilot 1\n```');
  }

  const start = body.indexOf('## 9. PR #357 — Tier A Dossier Deepening — Batch 3');
  const end = body.indexOf('## 10. PR #358 — Record Growth Batch 1', start + 1);
  if (start >= 0 && end > start) {
    const section = `## 9. PR #357 — Tier A Dossier Deepening — Batch 3 — active\n\nBinding references:\n\n\`\`\`text\ndocs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md\ndocs/quality/tier-a-dossier-batch-3-pr357-spec.md\nconfig/tier-a-dossier-batch-3-pr357.json\ndocs/migration/market-access-pilot-1-pr356-reviewed-handoff.json\n\`\`\`\n\nDeterministic selected batch:\n\n\`\`\`text\nAUDD\nFEI\nHUSD\nMIM\nNZDS\n\`\`\`\n\nAuthorized target dimensions:\n\n\`\`\`text\nAUDD: events, lifecycle, organization_relationships, redemption\nFEI: legal_profile\nHUSD: legal_profile, redemption\nMIM: legal_profile\nNZDS: events, lifecycle, organization_relationships, redemption\n\`\`\`\n\nPR #357 adds no canonical stable asset, changes no Market Access Record, and adds no new public surface. Completion requires a deterministic post-change impact report, synchronized checkpoints, green CI, and a reviewed handoff for PR #358.\n\n`;
    body = `${body.slice(0, start)}${section}${body.slice(end)}`;
  }
  body = ensureActiveAuthority(body);
  write(file, body);
}

updateReadme();
updateAgents();
updateGovernance();
updateRoadmap();
console.log('PR #357 repository authority synchronized.');
