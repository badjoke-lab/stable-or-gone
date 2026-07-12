import fs from 'node:fs';

const read = (file) => fs.readFileSync(file, 'utf8');
const write = (file, body) => fs.writeFileSync(file, body);

function replaceRequired(body, from, to, label) {
  if (!body.includes(from)) throw new Error(`${label}: required source text not found`);
  return body.replace(from, to);
}

function replaceSection(body, start, end, replacement, label) {
  const startIndex = body.indexOf(start);
  const endIndex = body.indexOf(end, startIndex + start.length);
  if (startIndex < 0 || endIndex < 0) throw new Error(`${label}: section anchors not found`);
  return `${body.slice(0, startIndex)}${replacement}${body.slice(endIndex)}`;
}

function advanceStatus(body, label) {
  body = body
    .replaceAll('PR #356 Market Access Pilot 1: active', 'PR #356 Market Access Pilot 1: complete')
    .replaceAll('PR #357 Tier A Dossier Deepening — Batch 3: next', 'PR #357 Tier A Dossier Deepening — Batch 3: active')
    .replaceAll('PR #356  Market Access Pilot 1 — active', 'PR #356  Market Access Pilot 1 — complete')
    .replaceAll('PR #357  Tier A Dossier Deepening — Batch 3 — next', 'PR #357  Tier A Dossier Deepening — Batch 3 — active');

  if (!body.includes('PR #358 Record Growth Batch 1: next')) {
    body = replaceRequired(
      body,
      'PR #357 Tier A Dossier Deepening — Batch 3: active\n```',
      'PR #357 Tier A Dossier Deepening — Batch 3: active\nPR #358 Record Growth Batch 1: next\n```',
      `${label} current position`
    );
  }
  body = body.replaceAll('PR #358  Record Growth Batch 1\n', 'PR #358  Record Growth Batch 1 — next\n');
  return body;
}

function updateReadme() {
  const file = 'README.md';
  let body = advanceStatus(read(file), file);
  body = replaceRequired(
    body,
    'docs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md\ndocs/quality/market-access-pilot-1-pr356-spec.md\ndocs/market-access-record-spec.md\nconfig/market-access-pilot-1-pr356.json\ndocs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\ndata/editorial-research/japan-stablecoin-market-access-2026.json',
    'docs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md\ndocs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md\ndocs/quality/tier-a-dossier-batch-3-pr357-spec.md\nconfig/tier-a-dossier-batch-3-pr357.json\ndocs/migration/market-access-pilot-1-pr356-reviewed-handoff.json\ndocs/quality/market-access-pilot-1-pr356-spec.md\ndocs/market-access-record-spec.md\nconfig/market-access-pilot-1-pr356.json\ndocs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\ndata/editorial-research/japan-stablecoin-market-access-2026.json',
    'README authority references'
  );
  body = replaceSection(
    body,
    '## Active PR #356 Market Access Pilot 1',
    '## Post-351 operating mode',
    `## Completed PR #356 Market Access Pilot 1\n\nPR #356 promoted four provider-scoped USDC Market Access records for Japan / SBI VC Trade and advanced canonical Evidence to 551. Its reviewed handoff is:\n\n\`\`\`text\ndocs/migration/market-access-pilot-1-pr356-reviewed-handoff.json\n\`\`\`\n\n## Active PR #357 Tier A Dossier Deepening — Batch 3\n\nPR #357 is bounded to five existing assets selected deterministically from the remaining PR #353 queue:\n\n\`\`\`text\nAUDD\nFEI\nHUSD\nMIM\nNZDS\n\`\`\`\n\nIt may deepen only the authorized events, lifecycle, organization-relationship, redemption, and legal-profile dimensions. It adds no stable asset, changes no Market Access record, and adds no public product surface.\n\n`,
    'README active work item'
  );
  write(file, body);
}

function updateAgents() {
  const file = 'AGENTS.md';
  let body = advanceStatus(read(file), file);
  body = replaceRequired(
    body,
    'docs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md\n```',
    'docs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md\ndocs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md\n```',
    'AGENTS amendments'
  );
  body = replaceRequired(
    body,
    'docs/quality/market-access-pilot-1-pr356-spec.md\n```',
    'docs/quality/tier-a-dossier-batch-3-pr357-spec.md\n```',
    'AGENTS work-item spec'
  );
  body = replaceRequired(
    body,
    'docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\ndata/editorial-research/japan-stablecoin-market-access-2026.json\n```',
    'docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\ndocs/migration/market-access-pilot-1-pr356-reviewed-handoff.json\n```',
    'AGENTS prior outputs'
  );
  body = replaceSection(
    body,
    '## 8. Completed PR #355 and active PR #356 rules',
    '## 9. Dossier evidence discipline',
    `## 8. Completed PR #355, completed PR #356, and active PR #357 rules\n\nPR #355 completed FDUSD, FRAX, PYUSD, USDP, and UST dossier deepening.\n\nPR #356 completed the bounded USDC / Japan / SBI VC Trade Market Access pilot. Its binding handoff is:\n\n\`\`\`text\ndocs/migration/market-access-pilot-1-pr356-reviewed-handoff.json\n\`\`\`\n\nPR #357 is governed by:\n\n\`\`\`text\ndocs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md\ndocs/quality/tier-a-dossier-batch-3-pr357-spec.md\nconfig/tier-a-dossier-batch-3-pr357.json\nscripts/validate-tier-a-dossier-batch-3-selection-pr357.mjs\n\`\`\`\n\nIts selected assets are exactly AUDD, FEI, HUSD, MIM, and NZDS. Completed Batch 1 and Batch 2 assets must not be selected again. PR #357 must preserve four canonical Market Access Records and add no public product surface.\n\n`,
    'AGENTS PR357 rules'
  );
  write(file, body);
}

function updateGovernance() {
  const file = 'docs/spec-governance.md';
  let body = advanceStatus(read(file), file);
  body = body.replace('Updated: 2026-07-12', 'Updated: 2026-07-13');
  body = replaceRequired(
    body,
    'docs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md\n```',
    'docs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md\ndocs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md\n```',
    'governance amendments'
  );
  body = replaceRequired(
    body,
    'docs/quality/market-access-pilot-1-pr356-spec.md\n```',
    'docs/quality/tier-a-dossier-batch-3-pr357-spec.md\n```',
    'governance work-item spec'
  );
  body = replaceRequired(
    body,
    'docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\ndata/editorial-research/japan-stablecoin-market-access-2026.json\n```',
    'docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\ndocs/migration/market-access-pilot-1-pr356-reviewed-handoff.json\n```',
    'governance prior outputs'
  );
  body = replaceSection(
    body,
    '### Active PR #356 Market Access Pilot 1',
    '### Completed derived-surface semantics',
    `### Completed PR #356 Market Access Pilot 1\n\n\`\`\`text\ndocs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md\ndocs/quality/market-access-pilot-1-pr356-spec.md\nconfig/market-access-pilot-1-pr356.json\ndocs/migration/market-access-pilot-1-pr356-reviewed-handoff.json\n\`\`\`\n\n### Active PR #357 Tier A Dossier Deepening — Batch 3\n\n\`\`\`text\ndocs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md\ndocs/quality/tier-a-dossier-batch-3-pr357-spec.md\nconfig/tier-a-dossier-batch-3-pr357.json\ndocs/migration/record-depth-baseline-pr353-summary.json\ndocs/migration/tier-a-candidate-queue-pr353.json\ndocs/migration/tier-a-batch-1-pr354-reviewed-handoff.json\ndocs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\ndocs/migration/market-access-pilot-1-pr356-reviewed-handoff.json\n\`\`\`\n\nThe selected assets are AUDD, FEI, HUSD, MIM, and NZDS. Changes are limited to authorized dossier dimensions and must preserve 110 assets and four canonical Market Access Records.\n\n`,
    'governance work item family'
  );
  write(file, body);
}

function updateRoadmap() {
  const file = 'docs/roadmap.md';
  let body = advanceStatus(read(file), file);
  body = body.replace('Updated: 2026-07-12', 'Updated: 2026-07-13');
  body = replaceRequired(
    body,
    'docs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md\ndocs/quality/market-access-pilot-1-pr356-spec.md',
    'docs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md\ndocs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md\ndocs/quality/tier-a-dossier-batch-3-pr357-spec.md\nconfig/tier-a-dossier-batch-3-pr357.json\ndocs/migration/market-access-pilot-1-pr356-reviewed-handoff.json\ndocs/quality/market-access-pilot-1-pr356-spec.md',
    'roadmap authority references'
  );
  body = replaceRequired(
    body,
    '## 3. Completed program through PR #355',
    '## 3. Completed program through PR #356',
    'roadmap completed heading'
  );
  body = replaceRequired(
    body,
    'Tier A Dossier Deepening — Batch 2\n```',
    'Tier A Dossier Deepening — Batch 2\nMarket Access Pilot 1\n```',
    'roadmap completed list'
  );
  body = replaceSection(
    body,
    '## 9. PR #357 — Tier A Dossier Deepening — Batch 3',
    '## 10. PR #358 — Record Growth Batch 1',
    `## 9. PR #357 — Tier A Dossier Deepening — Batch 3 — active\n\nBinding references:\n\n\`\`\`text\ndocs/roadmap-amendments/2026-07-13-pr357-tier-a-batch-3-activation.md\ndocs/quality/tier-a-dossier-batch-3-pr357-spec.md\nconfig/tier-a-dossier-batch-3-pr357.json\ndocs/migration/record-depth-baseline-pr353-summary.json\ndocs/migration/tier-a-candidate-queue-pr353.json\ndocs/migration/tier-a-batch-1-pr354-reviewed-handoff.json\ndocs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\ndocs/migration/market-access-pilot-1-pr356-reviewed-handoff.json\n\`\`\`\n\nDeterministic selected batch:\n\n\`\`\`text\nAUDD\nFEI\nHUSD\nMIM\nNZDS\n\`\`\`\n\nAuthorized target dimensions:\n\n\`\`\`text\nAUDD: events, lifecycle, organization_relationships, redemption\nFEI: legal_profile\nHUSD: legal_profile, redemption\nMIM: legal_profile\nNZDS: events, lifecycle, organization_relationships, redemption\n\`\`\`\n\nPR #357 adds no canonical stable asset, changes no Market Access Record, and adds no new public surface. Completion requires a deterministic post-change impact report, synchronized checkpoints, green CI, and a reviewed handoff for PR #358.\n\n`,
    'roadmap PR357 section'
  );
  write(file, body);
}

updateReadme();
updateAgents();
updateGovernance();
updateRoadmap();
console.log('PR #357 repository authority synchronized.');
