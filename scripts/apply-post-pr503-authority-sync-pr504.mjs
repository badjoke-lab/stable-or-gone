import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, content) => fs.writeFileSync(path.join(root, file), content);
const replaceOnce = (text, before, after, label) => {
  if (!text.includes(before)) throw new Error(`${label}: expected source snippet not found`);
  return text.replace(before, after);
};

let agents = read('AGENTS.md');
agents = agents.replace(
  'Current production checkpoint: 9136f44bff06d20b8611d66ed28156c9147765a5',
  'Current production checkpoint: a89832072b6f4fe07cf43b76ae77d2a5a1aac0f0'
);
agents = replaceOnce(
  agents,
  `10. PR #502 closes the post-PR #500 review gate and authorizes one bounded launch-date boundary review for six named records.\n11. PR #502 itself changes no canonical data; implementation is reserved for PR #503.\n12. \`docs/ui-v3-remediation-authority.md\` remains the regression-protection contract for material public UI work.`,
  `10. PR #502 closed the post-PR #500 review gate and authorized one bounded launch-date boundary review for six named records.\n11. PR #503 completed that review, preserved all six exact launch dates as null, and was production-verified.\n12. PR #504 synchronizes the completed checkpoint and returns the repository to REVIEW GATE.\n13. \`docs/ui-v3-remediation-authority.md\` remains the regression-protection contract for material public UI work.`,
  'AGENTS authority chain'
);
agents = replaceOnce(
  agents,
  `PR #502 Launch Date Boundary Review — Batch 1 authorization: complete\nPR #503 Launch Date Boundary Review — Batch 1: implementation under review\nRequired exit after PR #503 merge and production verification: REVIEW GATE`,
  `PR #502 Launch Date Boundary Review — Batch 1 authorization: complete\nPR #503 Launch Date Boundary Review — Batch 1: complete and production-verified\nRequired exit after PR #503 merge and production verification: REVIEW GATE — satisfied\nPR #504 post-PR #503 authority synchronization: active\nCurrent state after PR #504: REVIEW GATE`,
  'AGENTS workstream'
);
agents = replaceOnce(
  agents,
  `PR #502 changed authority only. PR #503 reviewed all six named records. No exact day-level primary evidence was found that safely equates announcement, deployment, first mint, testing, terms, rebrand, or later availability with one original public launch day. All six canonical launch dates remain null. The unresolved queue now records a reviewed range, specific reason, review date, and primary-source list for every target. No seventh or replacement target was used.`,
  `PR #502 changed authority only. PR #503 reviewed all six named records. No exact day-level primary evidence was found that safely equates announcement, deployment, first mint, testing, terms, rebrand, or later availability with one original public launch day. All six canonical launch dates remain null. The unresolved queue now records a reviewed range, specific reason, review date, and primary-source list for every target. No seventh or replacement target was used.\n\nProduction verification:\n\n\`\`\`text\nsource commit: a89832072b6f4fe07cf43b76ae77d2a5a1aac0f0\ncanonical hash: sha256:c6fa6b7494fc3e36f599d88edaa3d2af94a0e8c2f0ee6e4c3ee7d8a9121a4372\nconvergence attempt: 2\nstable assets: 117\norganizations: 108\nevents: 192\ndetail routes: 417\nmetadata-checked detail routes: 417\n\`\`\`\n\nNo later launch-date batch, record-growth batch, YLDS work, Market Access change, route family, or material UI work is authorized automatically.`,
  'AGENTS PR503 result'
);
write('AGENTS.md', agents);

let roadmap = read('docs/roadmap.md');
roadmap = roadmap.replace(
  'Status: PR #503 Launch Date Boundary Review — Batch 1 under review; exit boundary REVIEW GATE',
  'Status: PR #503 complete and production-verified; REVIEW GATE'
);
roadmap = roadmap.replace(
  'Current production checkpoint: 9136f44bff06d20b8611d66ed28156c9147765a5',
  'Current production checkpoint: a89832072b6f4fe07cf43b76ae77d2a5a1aac0f0'
);
roadmap = roadmap.replace(
  'Current `main` and production equality is established dynamically by the deployment workflow and Issue #479. PR #500 production converged on the first verification attempt with exact count, route, metadata, provenance, and canonical-hash parity.',
  'Current `main` and production equality is established dynamically by the deployment workflow and Issue #479. PR #503 production converged with exact count, route, metadata, provenance, and canonical-hash parity.'
);
roadmap = roadmap.replace(
  'PR #503 Launch Date Boundary Review — Batch 1: implementation under review',
  'PR #503 Launch Date Boundary Review — Batch 1: complete and production-verified\nPR #504 post-PR #503 authority synchronization: active'
);
roadmap = roadmap.replace('## Authorized current item', '## PR #503 completed item');
roadmap = replaceOnce(
  roadmap,
  `Announcement, deployment, first mint, testing, terms-effective, rebrand, underlying-asset launch, and later availability boundaries were not coerced into original launch dates. The item adds no new asset and authorizes no replacement target, YLDS work, Market Access change, route family, ranking, recommendation, or material UI change. After PR #503 merge and production verification, stop at REVIEW GATE.`,
  `Announcement, deployment, first mint, testing, terms-effective, rebrand, underlying-asset launch, and later availability boundaries were not coerced into original launch dates. The item added no new asset and authorized no replacement target, YLDS work, Market Access change, route family, ranking, recommendation, or material UI change.\n\nProduction result:\n\n\`\`\`text\nsource commit: a89832072b6f4fe07cf43b76ae77d2a5a1aac0f0\ncanonical hash: sha256:c6fa6b7494fc3e36f599d88edaa3d2af94a0e8c2f0ee6e4c3ee7d8a9121a4372\nconvergence attempt: 2\nstable assets: 117\norganizations: 108\nevents: 192\ndetail routes: 417\nmetadata-checked detail routes: 417\n\`\`\`\n\n## Current boundary\n\n\`\`\`text\nREVIEW GATE\n\`\`\`\n\nNo later launch-date batch, dossier batch, record-growth batch, Figure YLDS amendment, Market Access change, public route family, or material public-surface program is authorized automatically.`,
  'roadmap PR503 result'
);
write('docs/roadmap.md', roadmap);

let governance = read('docs/spec-governance.md');
governance = replaceOnce(
  governance,
  `Current item:\n\n\`\`\`text\nPR #503 Launch Date Boundary Review — Batch 1 implementation\n\`\`\`\n\nReviewed decision:\n\n\`\`\`text\nPR #503 launch-date boundary review: implementation under review\nexact targets: sog_st_msusd, sog_st_stablesusdx, sog_st_susde, sog_st_usd1, sog_st_usdm, sog_st_usdh\nexact day resolved: 0\ncanonical null preserved: 6\nnew canonical Evidence identities: 0\nnew canonical assets: 0\nreplacement targets: prohibited\nunsupported date coercion: prohibited\nnext boundary after PR #503: REVIEW GATE\n\`\`\`\n\nNo work beyond the six-target PR #503 review is pre-authorized.`,
  `Current item:\n\n\`\`\`text\nPR #504 post-PR #503 authority synchronization\n\`\`\`\n\nReviewed decision:\n\n\`\`\`text\nPR #503 launch-date boundary review: complete and production-verified\nexact targets: sog_st_msusd, sog_st_stablesusdx, sog_st_susde, sog_st_usd1, sog_st_usdm, sog_st_usdh\nexact day resolved: 0\ncanonical null preserved: 6\nnew canonical Evidence identities: 0\nnew canonical assets: 0\nproduction commit: a89832072b6f4fe07cf43b76ae77d2a5a1aac0f0\nproduction canonical hash: sha256:c6fa6b7494fc3e36f599d88edaa3d2af94a0e8c2f0ee6e4c3ee7d8a9121a4372\ncurrent boundary: REVIEW GATE\n\`\`\`\n\nNo later work is pre-authorized.`,
  'governance current item'
);
governance = replaceOnce(
  governance,
  `## 19. Review gate\n\nPR #502 is the current reviewed decision. Execute only PR #503 and then stop to review:\n\n\`\`\`text\nall six target dispositions\nexact-day evidence quality\nidentity and lineage boundaries\nEvidence additions, if any\nnull-date preservation\ncanonical counts and route parity\nproduction parity\n\`\`\`\n\nOnly a later separate reviewed decision may authorize another work item.`,
  `## 19. Review gate\n\nPR #503 is complete and production-verified. The required review confirms:\n\n\`\`\`text\nall six target dispositions recorded\nexact-day evidence threshold preserved\nidentity and lineage boundaries preserved\ncanonical Evidence additions: 0\ncanonical null dates preserved: 6\ncanonical counts and route parity preserved\nproduction parity verified\n\`\`\`\n\nThe repository is at REVIEW GATE. Only a later separate reviewed decision may authorize another work item.`,
  'governance review gate'
);
write('docs/spec-governance.md', governance);

write('scripts/validate-post-pr503-authority-sync-pr504.mjs', `import fs from 'node:fs';\nimport path from 'node:path';\n\nconst root = process.cwd();\nconst readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));\nconst readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');\nconst failures = [];\nconst expect = (condition, message) => { if (!condition) failures.push(message); };\n\nconst targets = ['sog_st_msusd','sog_st_stablesusdx','sog_st_susde','sog_st_usd1','sog_st_usdm','sog_st_usdh'];\nconst queue = readJson('data/quality/launch-date-unresolved.json');\nconst review = readJson('data/editorial-research/launch-date-boundary-review-batch-1-pr503-source-review.json');\nconst checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');\nconst agents = readText('AGENTS.md');\nconst roadmap = readText('docs/roadmap.md');\nconst governance = readText('docs/spec-governance.md');\nconst active = readText('scripts/validate-active-workstream.mjs').trim();\n\nconst rows = [];\nconst walkJson = (dir) => {\n  for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {\n    const rel = path.join(dir, entry.name);\n    if (entry.isDirectory()) walkJson(rel);\n    else if (entry.isFile() && entry.name.endsWith('.json')) {\n      let parsed;\n      try { parsed = readJson(rel); } catch { continue; }\n      const visit = (value) => {\n        if (Array.isArray(value)) return value.forEach(visit);\n        if (!value || typeof value !== 'object') return;\n        if (typeof value.id === 'string' && Object.hasOwn(value, 'launch_date')) rows.push(value);\n        Object.values(value).forEach(visit);\n      };\n      visit(parsed);\n    }\n  }\n};\nwalkJson('data');\nconst byId = new Map(rows.map((row) => [row.id, row]));\nconst queueById = new Map(queue.records.map((row) => [row.stablecoin_id, row]));\n\nexpect(review.status === 'reviewed_bounded_no_canonical_change', 'PR #503 review status changed');\nexpect(review.authority_pr === 502 && review.implementation_pr === 503, 'PR #503 authority changed');\nexpect(review.target_count === 6 && review.exact_day_resolved_count === 0 && review.null_preserved_count === 6, 'PR #503 disposition counts changed');\nexpect(review.canonical_evidence_added_count === 0 && review.canonical_evidence_relation_added_count === 0, 'PR #503 Evidence counts changed');\nexpect(queue.expected_total === 29 && queue.records.length === 29, 'launch queue total changed');\nfor (const id of targets) {\n  expect(byId.get(id)?.launch_date === null, id + ': canonical launch date must remain null');\n  const row = queueById.get(id);\n  expect(row?.last_reviewed === '2026-08-01', id + ': review date changed');\n  expect(Array.isArray(row?.reviewed_sources) && row.reviewed_sources.length >= 3, id + ': reviewed source list missing');\n}\nconst counts = checkpoint.counts;\nexpect(counts.assets === 117 && counts.organizations === 108 && counts.relationships === 129, 'identity counts changed');\nexpect(counts.events === 192 && counts.evidence === 579 && counts.evidence_relations === 579, 'event or Evidence counts changed');\nexpect(counts.deployments === 184 && counts.market_access_records === 8, 'deployment or Market Access counts changed');\nexpect(agents.includes('Current production checkpoint: a89832072b6f4fe07cf43b76ae77d2a5a1aac0f0'), 'AGENTS production checkpoint missing');\nexpect(agents.includes('PR #503 Launch Date Boundary Review — Batch 1: complete and production-verified'), 'AGENTS PR #503 completion missing');\nexpect(agents.includes('Current state after PR #504: REVIEW GATE'), 'AGENTS REVIEW GATE missing');\nexpect(roadmap.includes('Status: PR #503 complete and production-verified; REVIEW GATE'), 'roadmap final status missing');\nexpect(roadmap.includes('convergence attempt: 2'), 'roadmap production convergence missing');\nexpect(governance.includes('PR #503 launch-date boundary review: complete and production-verified'), 'governance PR #503 completion missing');\nexpect(governance.includes('The repository is at REVIEW GATE.'), 'governance REVIEW GATE missing');\nexpect(active === \"import './validate-post-pr503-authority-sync-pr504.mjs';\", 'active workstream is not wired to PR #504');\n\nif (failures.length) {\n  console.error('PR #504 post-PR #503 authority synchronization failed:');\n  failures.forEach((failure) => console.error('- ' + failure));\n  process.exit(1);\n}\nconsole.log(JSON.stringify({\n  ok: true,\n  authority_pr: 504,\n  completed_pr: 503,\n  production_commit: 'a89832072b6f4fe07cf43b76ae77d2a5a1aac0f0',\n  production_canonical_hash: 'sha256:c6fa6b7494fc3e36f599d88edaa3d2af94a0e8c2f0ee6e4c3ee7d8a9121a4372',\n  exact_day_resolved: 0,\n  null_preserved: 6,\n  counts_preserved: true,\n  current_state: 'REVIEW_GATE'\n}, null, 2));\n`);
write('scripts/validate-active-workstream.mjs', "import './validate-post-pr503-authority-sync-pr504.mjs';\n");

fs.rmSync(path.join(root, 'scripts/apply-post-pr503-authority-sync-pr504.mjs'), { force: true });
console.log(JSON.stringify({ ok: true, completed_pr: 503, current_state: 'REVIEW_GATE' }, null, 2));
