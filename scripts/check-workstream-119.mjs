import fs from 'node:fs';

const originalLog = console.log;
console.log = () => {};
try {
  await import('./validate-market-access-pilot-2-pr359.mjs');
} finally {
  console.log = originalLog;
}

const read = (file) => fs.readFileSync(file, 'utf8');
const readJson = (file) => JSON.parse(read(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const requireText = (body, text, file) => expect(body.includes(text), `${file}: missing ${text}`);

const readme = read('README.md');
const agents = read('AGENTS.md');
const governance = read('docs/spec-governance.md');
const roadmap = read('docs/roadmap.md');
const amendment = read('docs/roadmap-amendments/2026-07-13-pr359-market-access-pilot-2-activation.md');
const spec = read('docs/quality/market-access-pilot-2-pr359-spec.md');
const handoff = readJson('docs/migration/record-growth-batch-1-pr358-reviewed-handoff.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const config = readJson('config/market-access-pilot-2-pr359.json');

for (const [file, body] of [
  ['README.md', readme],
  ['AGENTS.md', agents],
  ['docs/spec-governance.md', governance],
  ['docs/roadmap.md', roadmap]
]) {
  requireText(body, 'Canonical stable assets: 112', file);
  requireText(body, 'PR #358 Record Growth Batch 1: complete', file);
  requireText(body, 'PR #359 Market Access Pilot 2: active', file);
  requireText(body, 'PR #360 Evidence and Correction Batch: next', file);
  requireText(body, 'docs/roadmap-amendments/2026-07-13-pr359-market-access-pilot-2-activation.md', file);
  requireText(body, 'docs/quality/market-access-pilot-2-pr359-spec.md', file);
  requireText(body, 'config/market-access-pilot-2-pr359.json', file);
  requireText(body, 'docs/migration/record-growth-batch-1-pr358-reviewed-handoff.json', file);
  requireText(body, 'RLUSD / sog_st_rlusd', file);
}

for (const marker of ['RLUSD', 'SBI VC Trade', 'VCTRADE', 'buy_sell', 'deposit', 'withdrawal', 'external_wallet_transfer']) {
  requireText(amendment, marker, 'PR #359 amendment');
  requireText(spec, marker, 'PR #359 specification');
}

expect(handoff.status === 'reviewed_merged_handoff', 'PR #358 handoff must be reviewed and merged');
expect(handoff.source_merge_commit === '47868d6a13f8f85f62034f81a7c31d528bc3a1ba', 'PR #358 handoff merge commit mismatch');
expect(handoff.canonical_counts?.assets === 112, 'PR #358 handoff must contain 112 assets');
expect(handoff.canonical_counts?.evidence === 557, 'PR #358 handoff must contain 557 Evidence records');
expect(handoff.canonical_counts?.market_access_records === 4, 'PR #358 handoff must contain four Market Access records');
expect(handoff.next_work_item === 'PR #359 Market Access Pilot 2', 'PR #358 handoff next work item mismatch');
expect(checkpoint.checkpoint_id === 'sog_market_access_pilot_2_canonical_112_checkpoint_pr359_2026_07_13', 'current canonical checkpoint must be PR #359 Pilot 2 checkpoint');
expect(checkpoint.asset_count === 112, 'PR #359 must preserve 112 assets');
expect(checkpoint.expected_counts?.evidence === 557, 'PR #359 must preserve 557 Evidence identities');
expect(checkpoint.expected_counts?.deployments === 174, 'PR #359 must preserve 174 deployments');
expect(checkpoint.expected_counts?.market_access_records === 8, 'PR #359 must bind eight Market Access records');
expect(config.status === 'canonical_promotion_reviewed', 'PR #359 config must remain reviewed canonical promotion');
expect(config.expected_market_access_records_after === 8, 'PR #359 config must bind eight Market Access records');
expect(config.next_pr === 360, 'PR #359 next PR must be #360');
expect(roadmap.includes('PR #360'), 'roadmap must preserve PR #360');
expect(roadmap.includes('REVIEW GATE'), 'roadmap review gate missing');
expect(governance.includes('A non-trivial PR is not ready for implementation until the exact roadmap item and governing specification are identified.'), 'governance traceability rule missing');
expect(agents.includes('A PR that cannot identify its roadmap item and governing specification must pause.'), 'AGENTS traceability rule missing');
expect(spec.includes('provider-scoped, function-scoped'), 'provider/function boundary missing');
expect(spec.includes('existing canonical Evidence identities'), 'Evidence reuse boundary missing');
expect(spec.includes('does not:'), 'explicit non-goals missing');

if (failures.length) {
  console.error('PR #359 active workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Workstream valid: PR #358 is complete, PR #359 is active for four bounded RLUSD Japan Market Access records, and PR #360 is next.');
