import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./validate-market-access-pilot-1-pr356.mjs');
  await import('./validate-market-access-canonical-pr356.mjs');
} finally {
  console.log = originalLog;
}

const readText = (file) => fs.readFileSync(file, 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const readme = readText('README.md');
const agents = readText('AGENTS.md');
const governance = readText('docs/spec-governance.md');
const roadmap = readText('docs/roadmap.md');
const operatingSpec = readText('docs/post-351-data-growth-operating-spec.md');
const activeAmendment = readText('docs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md');
const workItemSpec = readText('docs/quality/market-access-pilot-1-pr356-spec.md');
const handoff = readText('docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json');
const marketAccessSpec = readText('docs/market-access-record-spec.md');
const research = readText('data/editorial-research/japan-stablecoin-market-access-2026.json');

for (const [file, body] of [
  ['README.md', readme],
  ['AGENTS.md', agents],
  ['docs/spec-governance.md', governance],
  ['docs/roadmap.md', roadmap],
]) {
  requireText(body, 'Canonical stable assets: 110', file);
  requireText(body, 'PR #355 Tier A Dossier Deepening — Batch 2: complete', file);
  requireText(body, 'PR #356 Market Access Pilot 1: active', file);
  requireText(body, 'PR #357 Tier A Dossier Deepening — Batch 3: next', file);
  requireText(body, 'docs/roadmap-amendments/2026-07-12-pr356-market-access-pilot-1-activation.md', file);
  requireText(body, 'docs/quality/market-access-pilot-1-pr356-spec.md', file);
  requireText(body, 'docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json', file);
}

requireText(operatingSpec, 'Market Access pilots must be bounded.', 'post-351 operating spec');
requireText(activeAmendment, 'PR #356 Market Access Pilot 1: active', 'PR #356 amendment');
requireText(activeAmendment, 'PR #357 Tier A Dossier Deepening — Batch 3: next', 'PR #356 amendment');
requireText(activeAmendment, 'jp_access_usdc_sbivc_2025_03_26', 'PR #356 amendment');
requireText(workItemSpec, 'sog_st_usdc — USDC', 'PR #356 work-item spec');
requireText(workItemSpec, '### Maximum canonical rows', 'PR #356 work-item spec');
requireText(workItemSpec, 'direct_issuer_mint', 'PR #356 work-item spec');
requireText(workItemSpec, 'direct_issuer_redemption', 'PR #356 work-item spec');
requireText(handoff, 'b192c4c920e3a3626d006dd8b80f44e806f40da9', 'PR #355 reviewed handoff');
requireText(research, 'jp_access_usdc_sbivc_2025_03_26', 'Japan Market Access research checkpoint');
requireText(marketAccessSpec, 'one function-scoped observation per record', 'Market Access canonical spec');
requireText(marketAccessSpec, 'A platform observation must not be generalized into a jurisdiction-wide claim.', 'Market Access canonical spec');

for (const value of ['JP', 'USDC', 'SBI VC Trade', 'VCTRADE', 'buy_sell', 'deposit', 'withdrawal', 'external_wallet_transfer']) {
  requireText(activeAmendment, value, 'PR #356 amendment');
  requireText(workItemSpec, value, 'PR #356 work-item spec');
}

expect(roadmap.includes('PR #360  Evidence and Correction Batch'), 'roadmap must preserve bounded sequence through PR #360');
expect(roadmap.includes('REVIEW GATE'), 'roadmap review gate missing');
expect(governance.includes('A PR that cannot cite an approved work item must pause'), 'governance must enforce roadmap/spec traceability');
expect(agents.includes('A PR that cannot identify its roadmap item and governing specification must pause.'), 'AGENTS must enforce pre-implementation authority check');
expect(activeAmendment.includes('maximum canonical rows: 4'), 'PR #356 amendment must preserve four-record maximum');
expect(workItemSpec.includes('A function may be promoted only after `config/market-access-pilot-1-pr356.json` explicitly names approved canonical Evidence IDs for that function.'), 'PR #356 reviewed promotion gate missing');

if (failures.length) {
  console.error('PR #356 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #355 is complete, PR #356 is active for the bounded USDC/JP/SBI VC Trade four-function Market Access pilot, and PR #357 is next.');
