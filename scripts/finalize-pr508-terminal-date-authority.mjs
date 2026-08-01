import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, value) => {
  const full = path.join(root, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, value.endsWith('\n') ? value : `${value}\n`);
};
const replaceOnce = (text, from, to, label) => {
  if (!text.includes(from)) throw new Error(`Missing ${label}: ${from}`);
  return text.replace(from, to);
};
const targets = ['sog_st_fei', 'sog_st_nearusn', 'sog_st_esd'];
const productionCommit = 'a4f9c924b2966b1281429a13991ba6219df721d8';
const productionHash = 'sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb';

write('config/terminal-date-boundary-review-batch-1.json', JSON.stringify({
  schema_version: '1.0',
  authority_id: 'sog_terminal_date_boundary_review_batch_1_pr508_2026_08_01',
  status: 'approved_bounded_review',
  public_output: false,
  authority_pr: 508,
  implementation_pr: 509,
  reviewed_at: '2026-08-01',
  source_queue: 'data/quality/terminal-date-unresolved.json',
  source_queue_expected_total: 6,
  target_count: 3,
  target_stablecoin_ids: targets,
  target_boundaries: {
    sog_st_fei: ['executed final redemption completion', 'residual distribution completion', 'final redemption route shutdown'],
    sog_st_nearusn: ['Protection Programme close', 'payout completion', 'residual obligation settlement', 'final token end state'],
    sog_st_esd: ['V1 end block', 'contract disablement', 'final migration deadline', 'final claim termination']
  },
  allowed_outcomes: ['exact_terminal_day_resolved', 'reviewed_null_preserved'],
  acceptance_requirements: {
    exact_day_level_primary_evidence: true,
    same_canonical_identity: true,
    final_effective_terminal_boundary: true,
    announcement_or_vote_alone_insufficient: true,
    wind_down_start_or_migration_opening_alone_insufficient: true,
    market_inactivity_or_depeg_insufficient: true
  },
  prohibited: [
    'replacement_target',
    'terminal_date_inference_from_depeg',
    'terminal_date_inference_from_last_commit',
    'terminal_date_inference_from_market_inactivity',
    'new_asset',
    'new_evidence_identity_without_separate_review',
    'market_access_change',
    'public_route_change',
    'material_ui_change',
    'automatic_continuation_after_pr509'
  ],
  canonical_counts_must_remain: {
    assets: 117,
    organizations: 108,
    relationships: 129,
    events: 192,
    evidence: 579,
    evidence_relations: 579,
    deployments: 184,
    market_access_records: 8,
    detail_routes: 417,
    metadata_checked_routes: 417,
    archive_recorded: 457,
    archive_not_recorded: 122
  },
  next_boundary: 'REVIEW_GATE'
}, null, 2));

write('docs/quality/terminal-date-boundary-review-batch-1-spec.md', `# Terminal Date Boundary Review — Batch 1\n\nStatus: authorized bounded private review  \nAuthority PR: #508  \nImplementation PR: #509  \nPublic output: false\n\n## Objective\n\nReview exactly three unresolved terminal-date records whose existing queue entries contain a strong wind-down, migration, or final-redemption boundary but not a proven final effective end day.\n\n## Fixed targets\n\n\`\`\`text\nsog_st_fei\nsog_st_nearusn\nsog_st_esd\n\`\`\`\n\nNo replacement or fourth target is allowed.\n\n## Acceptance rule\n\nA canonical terminal day may be written only when day-level primary evidence proves a final effective terminal boundary for the same canonical identity. Accepted terminal boundaries include executed final redemption completion, residual distribution completion, final programme settlement, V1 end block, contract disablement, final migration deadline, final claim termination, or an equivalent explicit final end state.\n\nThe following are insufficient by themselves:\n\n- governance proposal or vote date;\n- wind-down start;\n- permanent mint stop while settlement continues;\n- successor or migration opening;\n- depeg, low liquidity, market inactivity, last repository commit, or last website capture;\n- retrospective source publication date.\n\n## Allowed outcomes\n\n- \`exact_terminal_day_resolved\`\n- \`reviewed_null_preserved\`\n\nEvery target must receive a reviewed range, reason code, review date, reviewed primary-source list, and explicit rejected-shortcut record.\n\n## Preserved boundaries\n\nPR #508 changes authority only. PR #509 must preserve 117 assets, 108 organizations, 129 relationships, 192 events, 579 Evidence identities, 579 Evidence Relations, 184 deployments, 8 Market Access records, 417 detail routes, 417 metadata-checked routes, and archive partition 457/122 unless a separate reviewed Evidence change is authorized.\n\nNo asset, organization, relationship, deployment, Market Access, route family, material UI, ranking, score, or recommendation change is allowed.\n\n## Exit\n\nAfter PR #509 merge and production verification, return to \`REVIEW GATE\`. No second terminal-date batch is authorized automatically.\n`);

write('docs/roadmap-amendments/2026-08-01-terminal-date-boundary-review-batch-1.md', `# Terminal Date Boundary Review — Batch 1\n\nDate: 2026-08-01  \nAuthority PR: #508  \nImplementation PR: #509\n\n## Decision\n\nThe post-PR #506 review gate is closed only for one bounded terminal-date evidence review over FEI, NEAR USN, and ESD. The three records have strong non-terminal boundaries in the existing queue, but no proven final effective end day.\n\n## Fixed targets and evidence questions\n\n\`\`\`text\nFEI: executed final redemption, residual distribution completion, or final redemption-route shutdown\nNEAR USN: Protection Programme close, payout completion, residual-obligation settlement, or final token end state\nESD: V1 end block, contract disablement, final migration deadline, or final claim termination\n\`\`\`\n\n## Constraints\n\n- exact target set;\n- primary-source-only day-level resolution;\n- no replacement target;\n- null remains null without a final effective boundary;\n- no inference from depeg, market inactivity, vote date, wind-down start, or migration opening;\n- no automatic Evidence promotion;\n- no new asset, Market Access, route, or material UI work;\n- all canonical and public counts remain fixed.\n\n## Exit boundary\n\nPR #509, then \`REVIEW GATE\`.\n`);

write('scripts/validate-terminal-date-boundary-review-pr508.mjs', `import fs from 'node:fs';\nimport path from 'node:path';\n\nconst root = process.cwd();\nconst readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));\nconst readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');\nconst failures = [];\nconst expect = (condition, message) => { if (!condition) failures.push(message); };\nconst expectedTargets = ${JSON.stringify(targets)};\n\nconst config = readJson('config/terminal-date-boundary-review-batch-1.json');\nconst queue = readJson('data/quality/terminal-date-unresolved.json');\nconst checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');\nconst agents = readText('AGENTS.md');\nconst roadmap = readText('docs/roadmap.md');\nconst governance = readText('docs/spec-governance.md');\nconst active = readText('scripts/validate-active-workstream.mjs').trim();\n\nexpect(config.status === 'approved_bounded_review', 'authority status changed');\nexpect(config.authority_pr === 508 && config.implementation_pr === 509, 'PR sequence changed');\nexpect(config.target_count === 3, 'target count changed');\nexpect(JSON.stringify(config.target_stablecoin_ids) === JSON.stringify(expectedTargets), 'target set changed');\nexpect(JSON.stringify(config.allowed_outcomes) === JSON.stringify(['exact_terminal_day_resolved','reviewed_null_preserved']), 'allowed outcomes changed');\nexpect(config.next_boundary === 'REVIEW_GATE', 'next boundary changed');\nexpect(queue.expected_total === 6 && queue.records.length === 6, 'source terminal queue total changed');\nconst byId = new Map(queue.records.map((row) => [row.stablecoin_id, row]));\nfor (const id of expectedTargets) {\n  expect(byId.has(id), id + ': missing from source queue');\n  expect(byId.get(id)?.canonical_status === (id === 'sog_st_esd' ? 'failed' : 'discontinued'), id + ': canonical status changed');\n}\nexpect(byId.get('sog_st_gyen')?.reason_code === 'redemption_period_still_open', 'GYEN future boundary changed');\nexpect(checkpoint.counts.assets === 117 && checkpoint.counts.organizations === 108 && checkpoint.counts.relationships === 129, 'identity counts changed');\nexpect(checkpoint.counts.events === 192 && checkpoint.counts.evidence === 579 && checkpoint.counts.evidence_relations === 579, 'event or Evidence counts changed');\nexpect(checkpoint.counts.deployments === 184 && checkpoint.counts.market_access_records === 8, 'deployment or Market Access counts changed');\nexpect(checkpoint.counts.detail_routes === 417 && checkpoint.counts.metadata_checked_routes === 417, 'route counts changed');\nexpect(checkpoint.counts.archive_index_count === 457 && checkpoint.counts.archive_not_recorded_count === 122, 'archive partition changed');\nexpect(agents.includes('PR #508 Terminal Date Boundary Review — Batch 1 authorization: active'), 'AGENTS PR #508 authority missing');\nexpect(agents.includes('PR #509 Terminal Date Boundary Review — Batch 1: reserved implementation'), 'AGENTS PR #509 reservation missing');\nexpect(roadmap.includes('Status: PR #508 Terminal Date Boundary Review — Batch 1 authorized; PR #509 reserved'), 'roadmap status missing');\nexpect(governance.includes('PR #508 Terminal Date Boundary Review — Batch 1 authorization; PR #509 implementation reserved'), 'governance current item missing');\nexpect(governance.includes('No work beyond PR #509 is pre-authorized.'), 'governance stop boundary missing');\nexpect(active === \"import './validate-terminal-date-boundary-review-pr508.mjs';\", 'active workstream is not wired to PR #508');\n\nif (failures.length) {\n  console.error('PR #508 Terminal Date Boundary Review authority failed:');\n  failures.forEach((failure) => console.error('- ' + failure));\n  process.exit(1);\n}\nconsole.log(JSON.stringify({ ok: true, authority_pr: 508, implementation_pr: 509, targets: expectedTargets, source_queue_total: 6, next_boundary: 'REVIEW_GATE' }, null, 2));\n`);
write('scripts/validate-active-workstream.mjs', "import './validate-terminal-date-boundary-review-pr508.mjs';\n");

let agents = read('AGENTS.md');
agents = replaceOnce(agents, 'Current production checkpoint: 2a6bfac25538388dd7ea6dc12de96c2c2dc2dad0', `Current production checkpoint: ${productionCommit}`, 'AGENTS production checkpoint');
agents = replaceOnce(agents, '15. PR #507 synchronizes the completed PR #506 checkpoint and returns repository authority to REVIEW GATE.\n16. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.', '15. PR #507 synchronized the completed PR #506 checkpoint, was production-verified, and returned repository authority to REVIEW GATE.\n16. PR #508 authorizes one bounded terminal-date boundary review for FEI, NEAR USN, and ESD; implementation is reserved for PR #509.\n17. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.', 'AGENTS authority chain');
agents = replaceOnce(agents, '4. `docs/deployment-policy.md`\n5. `docs/roadmap-amendments/2026-08-01-evidence-archive-payload-verification-batch-1.md`', '4. `docs/deployment-policy.md`\n5. `docs/roadmap-amendments/2026-08-01-terminal-date-boundary-review-batch-1.md`\n6. `docs/quality/terminal-date-boundary-review-batch-1-spec.md`\n7. `config/terminal-date-boundary-review-batch-1.json`\n8. `data/quality/terminal-date-unresolved.json`\n9. `docs/roadmap-amendments/2026-08-01-evidence-archive-payload-verification-batch-1.md`', 'AGENTS reading order');
agents = agents.replace(/\n6\. `docs\/quality\/evidence-archive-payload-verification-batch-1-spec\.md`\n7\. `config\/evidence-archive-payload-verification-batch-1\.json`\n8\. `docs\/roadmap-amendments\/2026-08-01-launch-date-boundary-review-batch-1\.md`\n9\. `docs\/quality\/launch-date-boundary-review-batch-1-spec\.md`\n10\. `config\/launch-date-boundary-review-batch-1\.json`\n11\. `docs\/roadmap-amendments\/2026-08-01-post-pr498-review-gate\.md`\n12\. `docs\/post-351-data-growth-operating-spec\.md`\n13\. `docs\/quality\/mnee-evidence-archive-maintenance-spec\.md`\n14\. `config\/mnee-evidence-archive-maintenance\.json`\n15\. `data\/editorial-research\/mnee-evidence-archive-maintenance-batch-1-source-review\.json`\n16\. `docs\/migration\/current-canonical-checkpoint\.json`\n17\. `docs\/migration\/current-review-checkpoint\.json`\n18\. `docs\/migration\/current-stats-history-checkpoint\.json`\n19\./, '\n10. `docs/quality/evidence-archive-payload-verification-batch-1-spec.md`\n11. `config/evidence-archive-payload-verification-batch-1.json`\n12. `docs/roadmap-amendments/2026-08-01-launch-date-boundary-review-batch-1.md`\n13. `docs/quality/launch-date-boundary-review-batch-1-spec.md`\n14. `config/launch-date-boundary-review-batch-1.json`\n15. `docs/roadmap-amendments/2026-08-01-post-pr498-review-gate.md`\n16. `docs/post-351-data-growth-operating-spec.md`\n17. `docs/quality/mnee-evidence-archive-maintenance-spec.md`\n18. `config/mnee-evidence-archive-maintenance.json`\n19. `data/editorial-research/mnee-evidence-archive-maintenance-batch-1-source-review.json`\n20. `docs/migration/current-canonical-checkpoint.json`\n21. `docs/migration/current-review-checkpoint.json`\n22. `docs/migration/current-stats-history-checkpoint.json`\n23.');
agents = replaceOnce(agents, 'PR #507 post-PR #506 authority synchronization: active\nCurrent repository authority: REVIEW GATE', 'PR #507 post-PR #506 authority synchronization: complete and production-verified\nPR #508 Terminal Date Boundary Review — Batch 1 authorization: active\nPR #509 Terminal Date Boundary Review — Batch 1: reserved implementation\nRequired exit after PR #509 merge and production verification: REVIEW GATE', 'AGENTS workstream');
const agentsSection = `\n## PR #508 authorized terminal-date review\n\nPR #509 must review exactly three unresolved terminal-date records:\n\n\`\`\`text\nsog_st_fei\nsog_st_nearusn\nsog_st_esd\n\`\`\`\n\nA canonical terminal date requires exact day-level primary evidence of the final effective end for the same canonical identity. Governance votes, wind-down starts, mint stops with settlement still open, migration openings, depegs, market inactivity, and last-activity dates are not final terminal dates by default.\n\nPR #509 must either resolve the exact final day or preserve null with a reviewed range, reason code, review date, primary-source list, and rejected shortcuts. No replacement target or automatic Evidence promotion is allowed.\n\nAfter PR #509 merge and production verification, stop at REVIEW GATE. No second terminal-date batch is authorized automatically.\n`;
agents = replaceOnce(agents, '\n## PR #506 reviewed archive-payload result\n', agentsSection + '\n## PR #506 reviewed archive-payload result\n', 'AGENTS PR508 section');
write('AGENTS.md', agents);

let roadmap = read('docs/roadmap.md');
roadmap = replaceOnce(roadmap, 'Status: PR #506 complete and production-verified; REVIEW GATE', 'Status: PR #508 Terminal Date Boundary Review — Batch 1 authorized; PR #509 reserved', 'roadmap status');
roadmap = replaceOnce(roadmap, 'Current production checkpoint: 2a6bfac25538388dd7ea6dc12de96c2c2dc2dad0', `Current production checkpoint: ${productionCommit}`, 'roadmap production checkpoint');
roadmap = replaceOnce(roadmap, 'PR #507 post-PR #506 authority synchronization: active', 'PR #507 post-PR #506 authority synchronization: complete and production-verified\nPR #508 Terminal Date Boundary Review — Batch 1 authorization: active\nPR #509 Terminal Date Boundary Review — Batch 1: reserved implementation', 'roadmap acceptance list');
const roadmapSection = `\n## Authorized current item\n\n\`\`\`text\nTerminal Date Boundary Review — Batch 1\nAuthority PR: #508\nImplementation PR: #509\nTargets: FEI, NEAR USN, ESD\n\`\`\`\n\nPR #509 may resolve an exact terminal day only from day-level primary evidence of final effective cessation. If final redemption, settlement, residual distribution, migration, claim, or contract termination remains unresolved, null must be preserved. No replacement target is allowed.\n`;
roadmap = replaceOnce(roadmap, '\n## PR #506 reviewed item\n', roadmapSection + '\n## PR #506 reviewed item\n', 'roadmap PR508 section');
roadmap = replaceOnce(roadmap, '## Current boundary\n\n```text\nREVIEW GATE\n```', '## Current boundary\n\n```text\nPR #509 implementation, then REVIEW GATE\n```', 'roadmap current boundary');
write('docs/roadmap.md', roadmap);

let governance = read('docs/spec-governance.md');
governance = replaceOnce(governance, 'docs/roadmap-amendments/2026-08-01-evidence-archive-payload-verification-batch-1.md', 'docs/roadmap-amendments/2026-08-01-terminal-date-boundary-review-batch-1.md', 'governance active amendment');
governance = replaceOnce(governance, 'docs/quality/evidence-archive-payload-verification-batch-1-spec.md', 'docs/quality/terminal-date-boundary-review-batch-1-spec.md', 'governance active spec');
governance = replaceOnce(governance, 'REVIEW GATE — PR #506 complete and production-verified', 'PR #508 Terminal Date Boundary Review — Batch 1 authorization; PR #509 implementation reserved', 'governance current item');
const oldDecision = `PR #506 Evidence Archive Payload Verification — Batch 1 complete and production-verified\nproduction commit: 2a6bfac25538388dd7ea6dc12de96c2c2dc2dad0\nproduction canonical hash: sha256:083860b341f6deebc1109b6b5b044dee584ba5e487e2e9b1722213772256b5bb\nconvergence attempt: 2\nexact target count: 10\ndated exact archives added: 7\nreviewed no safe change: 3\narchive coverage after: 457 of 579\nsource replacement: 0\nnew Evidence identities or Relations: 0\nnon-Evidence canonical changes: 0\ncurrent boundary: REVIEW GATE`;
const newDecision = `PR #508 Terminal Date Boundary Review — Batch 1 authorization\nimplementation PR: #509\nexact targets: sog_st_fei, sog_st_nearusn, sog_st_esd\nsource queue total: 6\nallowed outcomes: exact_terminal_day_resolved or reviewed_null_preserved\nreplacement targets: prohibited\nunsupported terminal-date inference: prohibited\ncanonical and public counts: preserved\nnext boundary after PR #509: REVIEW GATE`;
governance = replaceOnce(governance, oldDecision, newDecision, 'governance reviewed decision');
const section = `\n## 10C. PR #508 Terminal Date Boundary Review — Batch 1\n\nPR #508 closes the current review gate only for a three-target terminal-date evidence review. PR #509 is the only authorized implementation.\n\nThe target set is fixed to \`sog_st_fei\`, \`sog_st_nearusn\`, and \`sog_st_esd\`. A canonical terminal day requires exact day-level primary evidence of a final effective end for the same canonical identity. Governance approval, wind-down start, permanent mint stop, migration availability, depeg, market inactivity, repository inactivity, and retrospective publication dates are not terminal dates by default.\n\nPR #509 must record a reviewed outcome for every target and may not substitute another record. It may resolve an exact terminal day or preserve null. It may not add an asset, alter Market Access, add a route family, change material UI, or automatically promote candidate source material to canonical Evidence. It exits to REVIEW GATE. No work beyond PR #509 is pre-authorized.\n`;
governance = replaceOnce(governance, '\n## 11. YLDS scope boundary\n', section + '\n## 11. YLDS scope boundary\n', 'governance PR508 section');
governance = governance.replace(/## 19\. Review gate[\s\S]*$/, `## 19. Review gate\n\nPR #508 is the current reviewed decision. Execute only PR #509 and then stop to review:\n\n\`\`\`text\nall three terminal-date dispositions\nexact-day primary evidence quality\nfinal-effective-end semantics\nnull-date preservation\nEvidence additions, if any\ncanonical counts and route parity\nproduction parity\n\`\`\`\n\nOnly a later separate reviewed decision may authorize another work item.\n`);
write('docs/spec-governance.md', governance);

console.log(JSON.stringify({ ok: true, authority_pr: 508, implementation_pr: 509, targets, production_commit: productionCommit, current_boundary_after_pr509: 'REVIEW_GATE' }, null, 2));
