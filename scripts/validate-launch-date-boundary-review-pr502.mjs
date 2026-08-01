import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const config = readJson('config/launch-date-boundary-review-batch-1.json');
const queue = readJson('data/quality/launch-date-unresolved.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const amendment = readText('docs/roadmap-amendments/2026-08-01-launch-date-boundary-review-batch-1.md');
const spec = readText('docs/quality/launch-date-boundary-review-batch-1-spec.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const targets = ['sog_st_msusd','sog_st_stablesusdx','sog_st_susde','sog_st_usd1','sog_st_usdm','sog_st_usdh'];
expect(config.schema_version === '1.0', 'config schema_version changed');
expect(config.authority_pr === 502 && config.implementation_pr === 503, 'PR authority mismatch');
expect(JSON.stringify(config.target_stablecoin_ids) === JSON.stringify(targets), 'target list changed');
expect(config.authorization_boundary?.authority_pr_canonical_changes_allowed === false, 'authority PR must not authorize its own canonical writes');
expect(config.authorization_boundary?.asset_additions === 0, 'asset additions must remain zero');
expect(config.authorization_boundary?.automatic_promotion === false, 'automatic promotion must remain false');
expect(config.exit_boundary_after_implementation === 'REVIEW_GATE', 'implementation exit must be REVIEW_GATE');

expect(queue.expected_total === 29, 'launch queue total must remain 29 in authorization PR');
const byId = new Map(queue.records.map((row) => [row.stablecoin_id, row]));
for (const id of targets) {
  const row = byId.get(id);
  expect(Boolean(row), id + ': missing from launch queue');
  expect(row?.category === 'C', id + ': target must remain Category C');
  expect(row?.last_reviewed === undefined, id + ': authorization selection requires no existing last_reviewed');
  expect(row?.reviewed_sources === undefined, id + ': authorization selection requires no existing reviewed_sources');
}

for (const text of [amendment, spec]) {
  for (const id of targets) expect(text.includes(id), id + ': missing from authority document');
  expect(text.includes('REVIEW GATE'), 'authority document missing REVIEW GATE');
}
expect(agents.includes('PR #502 Launch Date Boundary Review — Batch 1 authorization: active'), 'AGENTS current workstream missing PR #502');
expect(agents.includes('Required exit after PR #503: REVIEW GATE'), 'AGENTS exit boundary missing');
expect(roadmap.includes('Launch Date Boundary Review — Batch 1'), 'roadmap item missing');
expect(governance.includes('PR #502 Launch Date Boundary Review — Batch 1'), 'governance decision missing');
expect(active === "import './validate-launch-date-boundary-review-pr502.mjs';", 'active workstream is not wired to PR #502');

if (failures.length) {
  console.error('PR #502 launch-date boundary review authorization failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  authority_pr: 502,
  implementation_pr: 503,
  targets,
  canonical_changes_in_authority_pr: false,
  next_work_item: 'PR_503_LAUNCH_DATE_BOUNDARY_REVIEW',
  exit_boundary: 'REVIEW_GATE'
}, null, 2));
