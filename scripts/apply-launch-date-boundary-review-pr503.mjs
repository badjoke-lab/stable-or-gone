import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(read(file));
const write = (file, content) => {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
};
const replaceOnce = (text, before, after, label) => {
  if (!text.includes(before)) throw new Error(`${label}: expected source snippet not found`);
  return text.replace(before, after);
};

const targetIds = [
  'sog_st_msusd',
  'sog_st_stablesusdx',
  'sog_st_susde',
  'sog_st_usd1',
  'sog_st_usdm',
  'sog_st_usdh'
];

const priorReview = readJson('data/quality/launch-date-pr220-review.json');
const priorById = new Map(priorReview.records.map((row) => [row.stablecoin_id, row]));
const queue = readJson('data/quality/launch-date-unresolved.json');
const queueById = new Map(queue.records.map((row) => [row.stablecoin_id, row]));

const sourceOverrides = {
  sog_st_msusd: [
    'https://docs.mainstreet.finance/welcome-to-mainstreet',
    'https://docs.mainstreet.finance/mainstreet-products/msusd/redemption-process',
    'https://docs.mainstreet.finance/resources-and-security/key-addresses',
    'https://mainstreet.finance/'
  ],
  sog_st_stablesusdx: [
    'https://docs.usdx.money/a-synthetic-usd/usdx-basics',
    'https://docs.usdx.money/a-synthetic-usd/delta-neutral-stability',
    'https://docs.usdx.money/guides/how-to-redeem',
    'https://docs.usdx.money/informaiton/contracts'
  ]
};

for (const id of targetIds) {
  const prior = priorById.get(id);
  const current = queueById.get(id);
  if (!prior || !current) throw new Error(`${id}: missing prior review or current queue row`);
  if (prior.decision !== 'preserve_null') throw new Error(`${id}: prior decision is not preserve_null`);
  current.best_known_range = prior.best_known_range;
  current.reason_code = prior.reason_code;
  current.review_note = prior.review_note;
  current.last_reviewed = '2026-08-01';
  current.reviewed_sources = sourceOverrides[id] ?? prior.reviewed_sources;
}
write('data/quality/launch-date-unresolved.json', `${JSON.stringify(queue, null, 2)}\n`);

const dispositions = targetIds.map((id) => {
  const row = queueById.get(id);
  return {
    stablecoin_id: id,
    decision: 'bounded_range_reconfirmed_and_null_preserved',
    canonical_launch_date_before: null,
    canonical_launch_date_after: null,
    best_known_range: row.best_known_range,
    reason_code: row.reason_code,
    review_note: row.review_note,
    reviewed_at: row.last_reviewed,
    reviewed_sources: row.reviewed_sources,
    evidence_identity_changes: 0,
    evidence_relation_changes: 0
  };
});

write('data/editorial-research/launch-date-boundary-review-batch-1-pr503-source-review.json', `${JSON.stringify({
  schema_version: '1.0',
  review_id: 'sog_launch_date_boundary_review_batch_1_pr503_2026_08_01',
  status: 'reviewed_bounded_no_canonical_change',
  public_output: false,
  authority_pr: 502,
  implementation_pr: 503,
  reviewed_at: '2026-08-01',
  source_queue: 'data/quality/launch-date-unresolved.json',
  prior_review_source: 'data/quality/launch-date-pr220-review.json',
  target_count: 6,
  exact_day_resolved_count: 0,
  null_preserved_count: 6,
  canonical_evidence_added_count: 0,
  canonical_evidence_relation_added_count: 0,
  dispositions,
  decision: {
    all_targets_disposed: true,
    exact_day_evidence_found: false,
    unsupported_date_coercion: false,
    canonical_counts_preserved: true,
    launch_queue_total_preserved: 29,
    next_boundary: 'REVIEW_GATE'
  },
  constraints: {
    asset_changes: 0,
    organization_changes: 0,
    relationship_changes: 0,
    event_changes: 0,
    deployment_changes: 0,
    market_access_changes: 0,
    route_family_changes: 0,
    material_ui_changes: 0,
    automatic_continuation: false
  }
}, null, 2)}\n`);

write('scripts/validate-launch-date-boundary-review-pr503.mjs', `import fs from 'node:fs';\nimport path from 'node:path';\n\nconst root = process.cwd();\nconst readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));\nconst readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');\nconst failures = [];\nconst expect = (condition, message) => { if (!condition) failures.push(message); };\n\nconst targets = ['sog_st_msusd','sog_st_stablesusdx','sog_st_susde','sog_st_usd1','sog_st_usdm','sog_st_usdh'];\nconst queue = readJson('data/quality/launch-date-unresolved.json');\nconst review = readJson('data/editorial-research/launch-date-boundary-review-batch-1-pr503-source-review.json');\nconst baseline = readJson('docs/migration/registry-v2-baseline.json');\nconst currentCheckpoint = readJson('docs/migration/current-canonical-checkpoint.json');\nconst agents = readText('AGENTS.md');\nconst roadmap = readText('docs/roadmap.md');\nconst governance = readText('docs/spec-governance.md');\nconst active = readText('scripts/validate-active-workstream.mjs').trim();\n\nconst stablecoins = baseline.data_groups.stablecoins.flatMap((file) => readJson(file));\nconst stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));\nconst queueById = new Map(queue.records.map((row) => [row.stablecoin_id, row]));\n\nexpect(queue.expected_total === 29 && queue.records.length === 29, 'launch queue total must remain 29');\nexpect(review.status === 'reviewed_bounded_no_canonical_change', 'source review status changed');\nexpect(review.authority_pr === 502 && review.implementation_pr === 503, 'PR authority mismatch');\nexpect(review.target_count === 6 && review.exact_day_resolved_count === 0 && review.null_preserved_count === 6, 'target disposition counts changed');\nexpect(review.canonical_evidence_added_count === 0 && review.canonical_evidence_relation_added_count === 0, 'Evidence changes are prohibited in this result');\nexpect(review.decision?.all_targets_disposed === true, 'all six targets must be disposed');\nexpect(review.decision?.next_boundary === 'REVIEW_GATE', 'next boundary must be REVIEW_GATE');\nexpect(JSON.stringify(review.dispositions.map((row) => row.stablecoin_id)) === JSON.stringify(targets), 'source review target order changed');\n\nfor (const id of targets) {\n  const stablecoin = stablecoinById.get(id);\n  const row = queueById.get(id);\n  const disposition = review.dispositions.find((item) => item.stablecoin_id === id);\n  expect(Boolean(stablecoin), id + ': canonical stablecoin missing');\n  expect(stablecoin?.launch_date === null, id + ': canonical launch_date must remain null');\n  expect(Boolean(row), id + ': unresolved queue row missing');\n  expect(row?.category === 'C', id + ': queue category must remain C');\n  expect(typeof row?.best_known_range === 'string' && row.best_known_range.length > 20, id + ': reviewed range missing');\n  expect(typeof row?.reason_code === 'string' && row.reason_code.length > 10, id + ': reason_code missing');\n  expect(typeof row?.review_note === 'string' && row.review_note.length > 80, id + ': review_note too weak');\n  expect(row?.last_reviewed === '2026-08-01', id + ': last_reviewed must be 2026-08-01');\n  expect(Array.isArray(row?.reviewed_sources) && row.reviewed_sources.length >= 3, id + ': at least three reviewed sources required');\n  expect(row.reviewed_sources.every((url) => /^https:\\/\\//.test(url)), id + ': reviewed source URL must use HTTPS');\n  expect(disposition?.decision === 'bounded_range_reconfirmed_and_null_preserved', id + ': disposition changed');\n  expect(disposition?.canonical_launch_date_before === null && disposition?.canonical_launch_date_after === null, id + ': null preservation missing');\n}\n\nconst counts = currentCheckpoint.counts;\nexpect(counts.assets === 117, 'asset count changed');\nexpect(counts.organizations === 108, 'organization count changed');\nexpect(counts.relationships === 129, 'relationship count changed');\nexpect(counts.events === 192, 'event count changed');\nexpect(counts.evidence === 579 && counts.evidence_relations === 579, 'Evidence counts changed');\nexpect(counts.deployments === 184, 'deployment count changed');\nexpect(counts.market_access_records === 8, 'Market Access count changed');\nexpect(agents.includes('PR #503 Launch Date Boundary Review — Batch 1: implementation under review'), 'AGENTS PR #503 state missing');\nexpect(agents.includes('All six canonical launch dates remain null'), 'AGENTS result missing');\nexpect(roadmap.includes('exact day resolved: 0'), 'roadmap result missing');\nexpect(governance.includes('PR #503 Launch Date Boundary Review — Batch 1'), 'governance PR #503 section missing');\nexpect(active === \"import './validate-launch-date-boundary-review-pr503.mjs';\", 'active workstream is not wired to PR #503');\n\nif (failures.length) {\n  console.error('PR #503 launch-date boundary review validation failed:');\n  failures.forEach((failure) => console.error('- ' + failure));\n  process.exit(1);\n}\nconsole.log(JSON.stringify({\n  ok: true,\n  review_id: review.review_id,\n  targets: targets.length,\n  exact_day_resolved: 0,\n  null_preserved: 6,\n  queue_total: queue.records.length,\n  canonical_counts_preserved: true,\n  next_boundary: 'REVIEW_GATE'\n}, null, 2));\n`);

let agents = read('AGENTS.md');
agents = replaceOnce(agents,
`PR #502 Launch Date Boundary Review — Batch 1 authorization: active\nAuthorized implementation: PR #503 review-only evidence and boundary audit\nRequired exit after PR #503: REVIEW GATE`,
`PR #502 Launch Date Boundary Review — Batch 1 authorization: complete\nPR #503 Launch Date Boundary Review — Batch 1: implementation under review\nRequired exit after PR #503 merge and production verification: REVIEW GATE`,
'AGENTS current workstream');
agents = replaceOnce(agents,
`PR #502 changes authority only. PR #503 may set a launch date only from exact day-level primary evidence matching the launch boundary. Otherwise the date remains null and the reviewed range, sources, and reason must be recorded. No seventh or replacement target is allowed.`,
`PR #502 changed authority only. PR #503 reviewed all six named records. No exact day-level primary evidence was found that safely equates announcement, deployment, first mint, testing, terms, rebrand, or later availability with one original public launch day. All six canonical launch dates remain null. The unresolved queue now records a reviewed range, specific reason, review date, and primary-source list for every target. No seventh or replacement target was used.`,
'AGENTS result');
write('AGENTS.md', agents);

let roadmap = read('docs/roadmap.md');
roadmap = roadmap.replace('Status: PR #502 Launch Date Boundary Review — Batch 1 authorized; PR #503 implementation next', 'Status: PR #503 Launch Date Boundary Review — Batch 1 under review; exit boundary REVIEW GATE');
roadmap = replaceOnce(roadmap,
`PR #502 Launch Date Boundary Review — Batch 1 authorization: active`,
`PR #502 Launch Date Boundary Review — Batch 1 authorization: complete\nPR #503 Launch Date Boundary Review — Batch 1: implementation under review`,
'roadmap acceptance points');
roadmap = replaceOnce(roadmap,
`PR #503 must review all six named targets using primary sources. Exact day-level launch dates may be written only when the source matches the canonical identity and the launch boundary. Otherwise the date remains null and the queue receives a reviewed range, specific reason, review date, and source list.\n\nThe item adds no new asset and authorizes no replacement target, YLDS work, Market Access change, route family, ranking, recommendation, or material UI change. After PR #503 merge and production verification, stop at REVIEW GATE.`,
`PR #503 reviewed all six named targets using primary sources and the prior PR #220 source checkpoint. Result:\n\n\`\`\`text\nexact day resolved: 0\ncanonical null preserved: 6\nqueue rows completed with reviewed range, reason, date, and sources: 6\nnew Evidence identities: 0\nnew Evidence Relations: 0\n\`\`\`\n\nAnnouncement, deployment, first mint, testing, terms-effective, rebrand, underlying-asset launch, and later availability boundaries were not coerced into original launch dates. The item adds no new asset and authorizes no replacement target, YLDS work, Market Access change, route family, ranking, recommendation, or material UI change. After PR #503 merge and production verification, stop at REVIEW GATE.`,
'roadmap result');
write('docs/roadmap.md', roadmap);

let governance = read('docs/spec-governance.md');
governance = governance.replace('PR #502 Launch Date Boundary Review — Batch 1 authorization', 'PR #503 Launch Date Boundary Review — Batch 1 implementation');
governance = replaceOnce(governance,
`PR #503 launch-date boundary review: authorized next\nexact targets: sog_st_msusd, sog_st_stablesusdx, sog_st_susde, sog_st_usd1, sog_st_usdm, sog_st_usdh\nnew canonical assets: 0\nreplacement targets: prohibited\ncanonical day required: true\nunsupported date coercion: prohibited\nnext boundary after PR #503: REVIEW GATE`,
`PR #503 launch-date boundary review: implementation under review\nexact targets: sog_st_msusd, sog_st_stablesusdx, sog_st_susde, sog_st_usd1, sog_st_usdm, sog_st_usdh\nexact day resolved: 0\ncanonical null preserved: 6\nnew canonical Evidence identities: 0\nnew canonical assets: 0\nreplacement targets: prohibited\nunsupported date coercion: prohibited\nnext boundary after PR #503: REVIEW GATE`,
'governance reviewed decision');
governance = replaceOnce(governance,
`PR #503 may add canonical Evidence only for direct named launch claims and may update only the named launch boundaries and queue records. It may not add assets, organizations, relationships, deployments, Market Access records, route families, rankings, recommendations, or material UI changes. It exits to REVIEW GATE.`,
`PR #503 reviewed every named target. All six remain null because the reviewed primary sources establish only operating-product, month/range, deployment, testing, terms-effective, underlying-asset, rebrand, or later-availability boundaries. The queue records the reviewed range, reason, date, and source list for each target. No canonical Evidence identity or Evidence Relation was added. It may not add assets, organizations, relationships, deployments, Market Access records, route families, rankings, recommendations, or material UI changes. It exits to REVIEW GATE.`,
'governance result');
write('docs/spec-governance.md', governance);

write('scripts/validate-active-workstream.mjs', "import './validate-launch-date-boundary-review-pr503.mjs';\n");

for (const file of [
  'scripts/inspect-launch-date-targets-pr503.mjs',
  '.github/workflows/inspect-launch-date-targets-pr503.yml',
  'docs/migration/launch-date-target-inspection-pr503.json',
  'scripts/apply-launch-date-boundary-review-pr503.mjs',
  '.github/workflows/apply-launch-date-boundary-review-pr503.yml'
]) fs.rmSync(path.join(root, file), { force: true });

console.log(JSON.stringify({ ok: true, targets: targetIds, exact_day_resolved: 0, null_preserved: 6, temporary_files_removed: true }, null, 2));
