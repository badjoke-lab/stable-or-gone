import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const targets = ['sog_st_msusd','sog_st_stablesusdx','sog_st_susde','sog_st_usd1','sog_st_usdm','sog_st_usdh'];
const queue = readJson('data/quality/launch-date-unresolved.json');
const review = readJson('data/editorial-research/launch-date-boundary-review-batch-1-pr503-source-review.json');
const checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');
const agents = readText('AGENTS.md');
const roadmap = readText('docs/roadmap.md');
const governance = readText('docs/spec-governance.md');
const active = readText('scripts/validate-active-workstream.mjs').trim();

const rows = [];
const walkJson = (dir) => {
  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) walkJson(rel);
    else if (entry.isFile() && entry.name.endsWith('.json')) {
      let parsed;
      try { parsed = readJson(rel); } catch { continue; }
      const visit = (value) => {
        if (Array.isArray(value)) return value.forEach(visit);
        if (!value || typeof value !== 'object') return;
        if (typeof value.id === 'string' && Object.hasOwn(value, 'launch_date')) rows.push(value);
        Object.values(value).forEach(visit);
      };
      visit(parsed);
    }
  }
};
walkJson('data');
const byId = new Map(rows.map((row) => [row.id, row]));
const queueById = new Map(queue.records.map((row) => [row.stablecoin_id, row]));

expect(review.status === 'reviewed_bounded_no_canonical_change', 'PR #503 review status changed');
expect(review.authority_pr === 502 && review.implementation_pr === 503, 'PR #503 authority changed');
expect(review.target_count === 6 && review.exact_day_resolved_count === 0 && review.null_preserved_count === 6, 'PR #503 disposition counts changed');
expect(review.canonical_evidence_added_count === 0 && review.canonical_evidence_relation_added_count === 0, 'PR #503 Evidence counts changed');
expect(queue.expected_total === 29 && queue.records.length === 29, 'launch queue total changed');
for (const id of targets) {
  expect(byId.get(id)?.launch_date === null, id + ': canonical launch date must remain null');
  const row = queueById.get(id);
  expect(row?.last_reviewed === '2026-08-01', id + ': review date changed');
  expect(Array.isArray(row?.reviewed_sources) && row.reviewed_sources.length >= 3, id + ': reviewed source list missing');
}
const counts = checkpoint.counts;
expect(counts.assets === 117 && counts.organizations === 108 && counts.relationships === 129, 'identity counts changed');
expect(counts.events === 192 && counts.evidence === 579 && counts.evidence_relations === 579, 'event or Evidence counts changed');
expect(counts.deployments === 184 && counts.market_access_records === 8, 'deployment or Market Access counts changed');
expect(agents.includes('Current production checkpoint: a89832072b6f4fe07cf43b76ae77d2a5a1aac0f0'), 'AGENTS production checkpoint missing');
expect(agents.includes('PR #503 Launch Date Boundary Review — Batch 1: complete and production-verified'), 'AGENTS PR #503 completion missing');
expect(agents.includes('Current state after PR #504: REVIEW GATE'), 'AGENTS REVIEW GATE missing');
expect(roadmap.includes('Status: PR #503 complete and production-verified; REVIEW GATE'), 'roadmap final status missing');
expect(roadmap.includes('convergence attempt: 2'), 'roadmap production convergence missing');
expect(governance.includes('PR #503 launch-date boundary review: complete and production-verified'), 'governance PR #503 completion missing');
expect(governance.includes('The repository is at REVIEW GATE.'), 'governance REVIEW GATE missing');
expect(active === "import './validate-post-pr503-authority-sync-pr504.mjs';", 'active workstream is not wired to PR #504');

if (failures.length) {
  console.error('PR #504 post-PR #503 authority synchronization failed:');
  failures.forEach((failure) => console.error('- ' + failure));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  authority_pr: 504,
  completed_pr: 503,
  production_commit: 'a89832072b6f4fe07cf43b76ae77d2a5a1aac0f0',
  production_canonical_hash: 'sha256:c6fa6b7494fc3e36f599d88edaa3d2af94a0e8c2f0ee6e4c3ee7d8a9121a4372',
  exact_day_resolved: 0,
  null_preserved: 6,
  counts_preserved: true,
  current_state: 'REVIEW_GATE'
}, null, 2));
