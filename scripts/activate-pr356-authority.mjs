import fs from 'node:fs';

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function write(file, body) {
  fs.writeFileSync(file, body);
}

function replaceExact(body, from, to, label) {
  if (!body.includes(from)) throw new Error(`${label}: required source text not found`);
  return body.replace(from, to);
}

function replaceSection(body, start, end, replacement, label) {
  const startIndex = body.indexOf(start);
  const endIndex = body.indexOf(end, startIndex + start.length);
  if (startIndex < 0 || endIndex < 0) throw new Error(`${label}: section anchors not found`);
  return `${body.slice(0, startIndex)}${replacement}${body.slice(endIndex)}`;
}

function updateReadme() {
  const file = 'README.md';
  let body = read(file);
  body = body
    .replaceAll('PR #355 Tier A Dossier Deepening — Batch 2: active', 'PR #355 Tier A Dossier Deepening — Batch 2: complete')
    .replaceAll('PR #356 Market Access Pilot 1: next', 'PR #356 Market Access Pilot 1: active');
  body = replaceExact(body,
    'PR #356 Market Access Pilot 1: active\n```',
    'PR #356 Market Access Pilot 1: active\nPR #357 Tier A Dossier Deepening — Batch 3: next\n```',
    'README current position');
  body = replaceExact(body,
    'PR #356  Market Access Pilot 1 — next\nPR #357  Tier A Dossier Deepening — Batch 3',
    'PR #356  Market Access Pilot 1 — active\nPR #357  Tier A Dossier Deepening — Batch 3 — next',
    'README bounded sequence');
  body = replaceExact(body,
    'docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md\ndocs/quality/tier-a-dossier-batch-2-pr355-spec.md\ndocs/migration/record-depth-baseline-pr353-summary.json',
    'docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md\ndocs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md\ndocs/quality/market-access-pilot-1-pr356-spec.md\ndocs/market-access-record-spec.md\nconfig/market-access-pilot-1-pr356.json\ndocs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\ndata/editorial-research/japan-stablecoin-market-access-2026.json\ndocs/migration/record-depth-baseline-pr353-summary.json',
    'README authority');
  body = replaceSection(body,
    '## Active PR #355 batch',
    '## Post-351 operating mode',
    `## Completed PR #355 batch\n\nPR #355 deepened FDUSD, FRAX, PYUSD, USDP, and UST for the authorized legal-profile and redemption dimensions.\n\nReviewed handoff:\n\n\`\`\`text\ndocs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\n\`\`\`\n\nPR #355 preserved 110 canonical assets, advanced canonical evidence and evidence relations to 549, added no Market Access Record, introduced no score or ranking, and added no public product surface.\n\n## Active PR #356 Market Access Pilot 1\n\nPR #356 is bounded to:\n\n\`\`\`text\njurisdiction: JP / Japan\nasset: USDC / sog_st_usdc\nplatform: SBI VC Trade\nservice: VCTRADE\nfunctions: buy_sell, deposit, withdrawal, external_wallet_transfer\nmaximum canonical records: 4\nreview cutoff: 2026-07-10\n\`\`\`\n\nDirect issuer mint/redemption, RLUSD, and JPYSC are excluded from Pilot 1. Editorial research remains noncanonical until source URLs are represented by canonical Evidence identities and each function claim scope is manually reviewed.\n\n`,
    'README active work item');
  body = replaceExact(body,
    'PR #354 completed the first five-asset batch. PR #355 uses the immutable queue plus the reviewed PR #354 handoff to deepen the next five assets.',
    'PR #354 and PR #355 completed two reviewed five-asset dossier batches. PR #356 uses the merged PR #355 handoff and the reviewed Japan research checkpoint for a bounded Market Access pilot.',
    'README dossier boundary');
  write(file, body);
}

function updateAgents() {
  const file = 'AGENTS.md';
  let body = read(file);
  body = replaceExact(body,
    'docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md\n```',
    'docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md\ndocs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md\n```',
    'AGENTS active amendments');
  body = replaceExact(body,
    'docs/quality/tier-a-dossier-batch-2-pr355-spec.md',
    'docs/quality/market-access-pilot-1-pr356-spec.md',
    'AGENTS work-item spec');
  body = replaceExact(body,
    'docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json\n```',
    'docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json\ndocs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\ndata/editorial-research/japan-stablecoin-market-access-2026.json\n```',
    'AGENTS prior outputs');
  body = body
    .replaceAll('PR #355 Tier A Dossier Deepening — Batch 2: active', 'PR #355 Tier A Dossier Deepening — Batch 2: complete')
    .replaceAll('PR #356 Market Access Pilot 1: next', 'PR #356 Market Access Pilot 1: active');
  body = replaceExact(body,
    'PR #356 Market Access Pilot 1: active\n```',
    'PR #356 Market Access Pilot 1: active\nPR #357 Tier A Dossier Deepening — Batch 3: next\n```',
    'AGENTS current position');
  body = replaceExact(body,
    'PR #356  Market Access Pilot 1 — next\nPR #357  Tier A Dossier Deepening — Batch 3',
    'PR #356  Market Access Pilot 1 — active\nPR #357  Tier A Dossier Deepening — Batch 3 — next',
    'AGENTS bounded sequence');
  body = replaceSection(body,
    '## 8. PR #355 Tier A Batch 2 rules',
    '## 9. Dossier evidence discipline',
    `## 8. Completed PR #355 and active PR #356 rules\n\nPR #355 completed the authorized FDUSD, FRAX, PYUSD, USDP, and UST dossier deepening. Its binding handoff is:\n\n\`\`\`text\ndocs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\n\`\`\`\n\nPR #356 is governed by:\n\n\`\`\`text\ndocs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md\ndocs/quality/market-access-pilot-1-pr356-spec.md\nconfig/market-access-pilot-1-pr356.json\nscripts/validate-market-access-pilot-1-pr356.mjs\n\`\`\`\n\nIts scope is exactly USDC in Japan on SBI VC Trade / VCTRADE for buy/sell, deposit, withdrawal, and external-wallet transfer, with a maximum of four canonical records.\n\nPR #356 must not promote RLUSD, JPYSC, issuer mint, issuer redemption, a universal Japan-wide claim, monitoring output, or editorial research without canonical Evidence and function-specific review.\n\n`,
    'AGENTS active rules');
  body = replaceExact(body,
    'PR #355 must not add rows to `data/market-access-records-v1.json`.',
    'PR #356 may add no more than four reviewed USDC/JP/SBI VC Trade function-scoped rows to `data/market-access-records-v1.json` after canonical Evidence and claim-scope review.',
    'AGENTS Market Access rule');
  body = replaceExact(body,
    'PR #356 must read merged PR #355 authority before implementing Market Access Pilot 1.',
    'PR #357 must read the merged PR #356 handoff before selecting Tier A Dossier Deepening — Batch 3.',
    'AGENTS next dossier rule');
  body = replaceExact(body,
    'PR #354 reviewed handoff\nclosed Maintenance Log months',
    'PR #354 reviewed handoff\nPR #355 reviewed handoff\nclosed Maintenance Log months',
    'AGENTS historical checkpoints');
  write(file, body);
}

function updateGovernance() {
  const file = 'docs/spec-governance.md';
  let body = read(file);
  body = replaceExact(body,
    'docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md\n```',
    'docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md\ndocs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md\n```',
    'governance active amendments');
  body = replaceExact(body,
    'docs/quality/tier-a-dossier-batch-2-pr355-spec.md',
    'docs/quality/market-access-pilot-1-pr356-spec.md',
    'governance work-item spec');
  body = replaceExact(body,
    'docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json\n```',
    'docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json\ndocs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\ndata/editorial-research/japan-stablecoin-market-access-2026.json\n```',
    'governance prior outputs');
  body = body
    .replaceAll('PR #355 Tier A Dossier Deepening — Batch 2: active', 'PR #355 Tier A Dossier Deepening — Batch 2: complete')
    .replaceAll('PR #356 Market Access Pilot 1: next', 'PR #356 Market Access Pilot 1: active');
  body = replaceExact(body,
    'PR #356 Market Access Pilot 1: active\n```',
    'PR #356 Market Access Pilot 1: active\nPR #357 Tier A Dossier Deepening — Batch 3: next\n```',
    'governance current position');
  body = replaceExact(body,
    'PR #356  Market Access Pilot 1 — next\nPR #357  Tier A Dossier Deepening — Batch 3',
    'PR #356  Market Access Pilot 1 — active\nPR #357  Tier A Dossier Deepening — Batch 3 — next',
    'governance bounded sequence');
  body = replaceSection(body,
    '### Active PR #355 Tier A dossier batch',
    '### Completed derived-surface semantics',
    `### Completed PR #355 Tier A dossier batch\n\n\`\`\`text\ndocs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md\ndocs/quality/tier-a-dossier-batch-2-pr355-spec.md\nconfig/tier-a-dossier-batch-2-pr355.json\ndocs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\n\`\`\`\n\n### Active PR #356 Market Access Pilot 1\n\n\`\`\`text\ndocs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md\ndocs/quality/market-access-pilot-1-pr356-spec.md\nconfig/market-access-pilot-1-pr356.json\ndocs/market-access-record-spec.md\nschemas/market-access-record-v1.schema.json\nconfig/market-access-governance-v1.json\ndata/editorial-research/japan-stablecoin-market-access-2026.json\ndocs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\n\`\`\`\n\nThe pilot is bounded to USDC, Japan, SBI VC Trade / VCTRADE, four function-scoped observations, and no more than four reviewed canonical records.\n\n`,
    'governance work item family');
  write(file, body);
}

function updateRoadmap() {
  const file = 'docs/roadmap.md';
  let body = read(file);
  body = body
    .replaceAll('PR #355 Tier A Dossier Deepening — Batch 2: active', 'PR #355 Tier A Dossier Deepening — Batch 2: complete')
    .replaceAll('PR #356 Market Access Pilot 1: next', 'PR #356 Market Access Pilot 1: active');
  body = replaceExact(body,
    'PR #356 Market Access Pilot 1: active\n```',
    'PR #356 Market Access Pilot 1: active\nPR #357 Tier A Dossier Deepening — Batch 3: next\n```',
    'roadmap current position');
  body = replaceExact(body,
    'docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md\ndocs/quality/tier-a-dossier-batch-2-pr355-spec.md',
    'docs/roadmap-amendments/2026-07-12-pr355-tier-a-batch-2-activation.md\ndocs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md\ndocs/quality/market-access-pilot-1-pr356-spec.md\ndocs/market-access-record-spec.md\nconfig/market-access-pilot-1-pr356.json\ndocs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\ndata/editorial-research/japan-stablecoin-market-access-2026.json',
    'roadmap authority');
  body = replaceExact(body,
    '## 3. Completed program through PR #354',
    '## 3. Completed program through PR #355',
    'roadmap completed program heading');
  body = replaceExact(body,
    'Tier A Dossier Deepening — Batch 1\n```',
    'Tier A Dossier Deepening — Batch 1\nTier A Dossier Deepening — Batch 2\n```',
    'roadmap completed programs');
  body = replaceExact(body,
    'Current reviewed canonical checkpoint after PR #354:',
    'Current reviewed canonical checkpoint after PR #355:',
    'roadmap checkpoint heading');
  body = replaceExact(body,
    '547 evidence records\n547 evidence relations',
    '549 evidence records\n549 evidence relations',
    'roadmap current counts');
  body = replaceExact(body,
    'PR #356  Market Access Pilot 1 — next\nPR #357  Tier A Dossier Deepening — Batch 3',
    'PR #356  Market Access Pilot 1 — active\nPR #357  Tier A Dossier Deepening — Batch 3 — next',
    'roadmap bounded sequence');
  body = replaceSection(body,
    '## 7. PR #355 — Tier A Dossier Deepening — Batch 2 — active',
    '## 9. PR #357 — Tier A Dossier Deepening — Batch 3',
    `## 7. PR #355 — Tier A Dossier Deepening — Batch 2 — complete\n\nBinding reviewed handoff:\n\n\`\`\`text\ndocs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\n\`\`\`\n\nPR #355 completed reviewed deepening for FDUSD, FRAX, PYUSD, USDP, and UST. It preserved 110 assets, advanced Evidence and Evidence Relations to 549, and left canonical Market Access at zero records.\n\n## 8. PR #356 — Market Access Pilot 1 — active\n\nBinding references:\n\n\`\`\`text\ndocs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md\ndocs/quality/market-access-pilot-1-pr356-spec.md\nconfig/market-access-pilot-1-pr356.json\ndocs/market-access-record-spec.md\nschemas/market-access-record-v1.schema.json\nconfig/market-access-governance-v1.json\ndata/editorial-research/japan-stablecoin-market-access-2026.json\ndocs/migration/tier-a-batch-2-pr355-reviewed-handoff.json\n\`\`\`\n\nExact bounded scope:\n\n\`\`\`text\njurisdiction: JP / Japan\nasset: USDC / sog_st_usdc\nplatform: SBI VC Trade\nservice: VCTRADE\nfunctions: buy_sell, deposit, withdrawal, external_wallet_transfer\nmaximum canonical records: 4\neffective_from: 2025-03-26\nreview cutoff: 2026-07-10\n\`\`\`\n\nThe pilot first audits canonical Evidence identity and function-specific claim scope. Editorial research remains noncanonical. RLUSD, JPYSC, direct issuer mint, and direct issuer redemption are outside Pilot 1.\n\nCompletion requires reviewed canonical Evidence mappings, no more than four supported function-scoped records, deterministic validation, green CI, and a PR #356 reviewed handoff.\n\n`,
    'roadmap active sections');
  write(file, body);
}

updateReadme();
updateAgents();
updateGovernance();
updateRoadmap();
console.log('PR #356 authority synchronized.');
