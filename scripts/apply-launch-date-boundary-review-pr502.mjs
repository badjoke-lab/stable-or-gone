import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, content) => {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
};
const replaceOnce = (text, before, after, label) => {
  if (!text.includes(before)) throw new Error(`${label}: expected source snippet not found`);
  return text.replace(before, after);
};

const targets = [
  'sog_st_msusd',
  'sog_st_stablesusdx',
  'sog_st_susde',
  'sog_st_usd1',
  'sog_st_usdm',
  'sog_st_usdh'
];

write('config/launch-date-boundary-review-batch-1.json', `${JSON.stringify({
  schema_version: '1.0',
  work_item: 'launch_date_boundary_review_batch_1',
  status: 'authorized_review_only',
  authority_pr: 502,
  implementation_pr: 503,
  authorized_at: '2026-08-01',
  source_queue: 'data/quality/launch-date-unresolved.json',
  canonical_baseline: {
    stable_assets: 117,
    organizations: 108,
    relationships: 129,
    events: 192,
    evidence: 579,
    evidence_relations: 579,
    deployments: 184,
    detail_routes: 417,
    metadata_checked_detail_routes: 417
  },
  target_stablecoin_ids: targets,
  selection_rule: 'launch_date_null_and_missing_reviewed_sources_or_last_reviewed_in_current_queue',
  review_requirements: {
    primary_sources_required: true,
    day_level_evidence_required_for_canonical_launch_date: true,
    announcement_not_launch_by_default: true,
    contract_deployment_not_launch_by_default: true,
    first_mint_not_public_availability_by_default: true,
    exchange_listing_not_launch_by_default: true,
    rebrand_or_migration_not_original_launch_by_default: true,
    unsupported_date_coercion_prohibited: true,
    unresolved_outcomes_must_remain_null: true
  },
  authorization_boundary: {
    authority_pr_canonical_changes_allowed: false,
    implementation_pr_may_update_only_named_launch_boundaries: true,
    implementation_pr_may_add_evidence_only_for_named_launch_claims: true,
    asset_additions: 0,
    organization_additions: 0,
    relationship_additions: 0,
    event_additions_without_separate_review: 0,
    deployment_changes: 0,
    market_access_changes: 0,
    public_route_family_changes: 0,
    material_ui_changes: 0,
    automatic_promotion: false,
    replacement_targets: false
  },
  required_outcome_per_target: [
    'resolved_exact_day_with_primary_evidence',
    'bounded_range_reconfirmed_and_null_preserved',
    'identity_or_lineage_conflict_requires_separate_scope'
  ],
  exit_boundary_after_implementation: 'REVIEW_GATE'
}, null, 2)}\n`);

write('docs/roadmap-amendments/2026-08-01-launch-date-boundary-review-batch-1.md', `# Launch Date Boundary Review — Batch 1\n\nStatus: reviewed authorization  \nAuthority PR: #502  \nAuthorized implementation PR: #503  \nDate: 2026-08-01\n\n## Decision\n\nThe post-PR #500 review gate is closed only for one bounded launch-date evidence review. The selected records are the six current unresolved launch-date rows that still lack both a formal review date and a reviewed primary-source list.\n\n\`\`\`text\nsog_st_msusd\nsog_st_stablesusdx\nsog_st_susde\nsog_st_usd1\nsog_st_usdm\nsog_st_usdh\n\`\`\`\n\nThis authorization is not a record-growth program and does not authorize any new asset, organization, relationship, event, deployment, Market Access record, route family, ranking, score, recommendation, or material UI work.\n\n## Why this item\n\nThe latest candidate audit was completed one day ago and did not support another complete-record promotion. The terminal-date queue contains final-cessation boundaries that still depend on future or unrecovered evidence. The Evidence archive queue was reviewed recently and its last selected batch produced ten reviewed no-safe-change outcomes.\n\nThe six selected launch-date rows are different: their queue entries remain materially under-documented compared with the other 23 unresolved launch-date records. A bounded primary-source review can either resolve a day-level boundary or replace weak placeholder prose with a reviewed range and explicit reason for retaining null.\n\n## Binding rules\n\n1. PR #502 changes authority only and must not change canonical data.\n2. PR #503 must review all six named records and no substitutes.\n3. A canonical launch date requires day-level primary evidence that matches the launch boundary being claimed.\n4. Announcement, contract deployment, first mint, exchange listing, network launch, rebrand, migration, and broad availability are separate boundaries unless the source explicitly establishes equivalence.\n5. A record remains null when exact-day evidence is absent.\n6. New Evidence IDs are allowed only when they directly support a named launch-boundary claim and pass ordinary Evidence integrity rules.\n7. No event may be added merely to manufacture a launch date.\n8. Every target must receive one explicit disposition: resolved exact day, bounded range with null preserved, or separate identity/lineage scope required.\n9. PR #503 exits to REVIEW GATE. No later batch is authorized automatically.\n\n## Preserved baseline\n\n\`\`\`text\nstable assets: 117\norganizations: 108\nrelationships: 129\nevents: 192\nEvidence: 579\nEvidence Relations: 579\ndeployments: 184\ndetail routes: 417\nmetadata-checked detail routes: 417\n\`\`\`\n`);

write('docs/quality/launch-date-boundary-review-batch-1-spec.md', `# Launch Date Boundary Review — Batch 1 Specification\n\nStatus: canonical work-item specification  \nAuthority PR: #502  \nImplementation PR: #503\n\n## Scope\n\nReview exactly six canonical records whose launch dates are null and whose current unresolved-queue entries lack a complete reviewed-source checkpoint.\n\n| Canonical ID | Review focus |\n| --- | --- |\n| \`sog_st_msusd\` | announcement, legacy/current contract lineage, first mint, first redeemable availability |\n| \`sog_st_stablesusdx\` | product announcement, deployment, approved access, first issuance |\n| \`sog_st_susde\` | USDe launch versus sUSDe staking activation and first public staking availability |\n| \`sog_st_usd1\` | planned launch, contract deployment, first mint, testing, broad availability |\n| \`sog_st_usdm\` | original Celo Dollar launch versus later Mento Dollar rename and multichain expansion |\n| \`sog_st_usdh\` | proposal, ticker award, capped mint/redeem phase, HyperCore activation, public spot availability |\n\n## Required source order\n\n1. issuer, protocol, foundation, governance, or official product publication;\n2. official technical documentation and verified contract or transaction metadata;\n3. official partner publication when it directly records the operational boundary;\n4. high-quality contemporaneous reporting only as corroboration, never as the sole basis when a primary source is available.\n\n## Canonical date rule\n\nA date may be written to \`launch_date\` only when all of the following are true:\n\n- the source is primary and identifies the same canonical asset identity;\n- the source provides an exact calendar day;\n- the described action matches the intended launch boundary;\n- lineage, wrapper, network, and rebrand distinctions are resolved;\n- the date is not inferred from publication metadata alone;\n- supporting Evidence and Evidence Relation records exist.\n\n## Null-preservation rule\n\nWhen the evidence supports only a month, year, range, deployment date, proposal date, first mint, exchange listing, network launch, or rebrand boundary, the canonical launch date remains null. The queue entry must then record:\n\n- \`best_known_range\`;\n- a specific \`reason_code\`;\n- a substantive \`review_note\`;\n- \`last_reviewed: 2026-08-01\`;\n- all reviewed primary-source URLs.\n\n## Allowed implementation changes\n\n- the six named canonical stablecoin rows, limited to \`launch_date\` and review metadata already owned by those records;\n- \`data/quality/launch-date-unresolved.json\`;\n- canonical Evidence and Evidence Relations directly supporting named launch claims;\n- a private source-review artifact and a blocking validator;\n- forward-only checkpoint material required by deterministic counts or provenance when canonical Evidence changes.\n\n## Prohibited changes\n\n- any seventh target or replacement target;\n- new assets, issuers, relationships, deployments, Market Access records, route families, guides, rankings, scores, recommendations, or material UI changes;\n- converting deployment, announcement, rebrand, migration, or listing dates into launch dates without explicit equivalence;\n- deleting unrelated unknowns;\n- automatic continuation after PR #503.\n\n## Acceptance\n\nPR #503 is acceptable only when all six targets have a disposition, all canonical changes are individually evidenced, unresolved dates remain null, full CI passes, production converges exactly after merge, and the repository returns to REVIEW GATE.\n`);

write('scripts/validate-launch-date-boundary-review-pr502.mjs', `import fs from 'node:fs';\nimport path from 'node:path';\n\nconst root = process.cwd();\nconst readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');\nconst readJson = (file) => JSON.parse(readText(file));\nconst failures = [];\nconst expect = (condition, message) => { if (!condition) failures.push(message); };\n\nconst config = readJson('config/launch-date-boundary-review-batch-1.json');\nconst queue = readJson('data/quality/launch-date-unresolved.json');\nconst agents = readText('AGENTS.md');\nconst roadmap = readText('docs/roadmap.md');\nconst governance = readText('docs/spec-governance.md');\nconst amendment = readText('docs/roadmap-amendments/2026-08-01-launch-date-boundary-review-batch-1.md');\nconst spec = readText('docs/quality/launch-date-boundary-review-batch-1-spec.md');\nconst active = readText('scripts/validate-active-workstream.mjs').trim();\n\nconst targets = ['sog_st_msusd','sog_st_stablesusdx','sog_st_susde','sog_st_usd1','sog_st_usdm','sog_st_usdh'];\nexpect(config.schema_version === '1.0', 'config schema_version changed');\nexpect(config.authority_pr === 502 && config.implementation_pr === 503, 'PR authority mismatch');\nexpect(JSON.stringify(config.target_stablecoin_ids) === JSON.stringify(targets), 'target list changed');\nexpect(config.authorization_boundary?.authority_pr_canonical_changes_allowed === false, 'authority PR must not authorize its own canonical writes');\nexpect(config.authorization_boundary?.asset_additions === 0, 'asset additions must remain zero');\nexpect(config.authorization_boundary?.automatic_promotion === false, 'automatic promotion must remain false');\nexpect(config.exit_boundary_after_implementation === 'REVIEW_GATE', 'implementation exit must be REVIEW_GATE');\n\nexpect(queue.expected_total === 29, 'launch queue total must remain 29 in authorization PR');\nconst byId = new Map(queue.records.map((row) => [row.stablecoin_id, row]));\nfor (const id of targets) {\n  const row = byId.get(id);\n  expect(Boolean(row), id + ': missing from launch queue');\n  expect(row?.category === 'C', id + ': target must remain Category C');\n  expect(row?.last_reviewed === undefined, id + ': authorization selection requires no existing last_reviewed');\n  expect(row?.reviewed_sources === undefined, id + ': authorization selection requires no existing reviewed_sources');\n}\n\nfor (const text of [amendment, spec]) {\n  for (const id of targets) expect(text.includes(id), id + ': missing from authority document');\n  expect(text.includes('REVIEW GATE'), 'authority document missing REVIEW GATE');\n}\nexpect(agents.includes('PR #502 Launch Date Boundary Review — Batch 1 authorization: active'), 'AGENTS current workstream missing PR #502');\nexpect(agents.includes('Required exit after PR #503: REVIEW GATE'), 'AGENTS exit boundary missing');\nexpect(roadmap.includes('Launch Date Boundary Review — Batch 1'), 'roadmap item missing');\nexpect(governance.includes('PR #502 Launch Date Boundary Review — Batch 1'), 'governance decision missing');\nexpect(active === \"import './validate-launch-date-boundary-review-pr502.mjs';\", 'active workstream is not wired to PR #502');\n\nif (failures.length) {\n  console.error('PR #502 launch-date boundary review authorization failed:');\n  failures.forEach((failure) => console.error('- ' + failure));\n  process.exit(1);\n}\nconsole.log(JSON.stringify({\n  ok: true,\n  authority_pr: 502,\n  implementation_pr: 503,\n  targets,\n  canonical_changes_in_authority_pr: false,\n  next_work_item: 'PR_503_LAUNCH_DATE_BOUNDARY_REVIEW',\n  exit_boundary: 'REVIEW_GATE'\n}, null, 2));\n`);

let agents = read('AGENTS.md');
agents = agents.replace('Current production checkpoint: 9d583845d73e4d758ab245812d165f25dd59ada8', 'Current production checkpoint: 9136f44bff06d20b8611d66ed28156c9147765a5');
agents = replaceOnce(agents,
`10. The repository is at REVIEW GATE. No later data, candidate, Market Access, YLDS, or material UI work is authorized automatically.\n11. \`docs/ui-v3-remediation-authority.md\` remains the regression-protection contract for material public UI work.`,
`10. PR #502 closes the post-PR #500 review gate and authorizes one bounded launch-date boundary review for six named records.\n11. PR #502 itself changes no canonical data; implementation is reserved for PR #503.\n12. \`docs/ui-v3-remediation-authority.md\` remains the regression-protection contract for material public UI work.`,
'AGENTS authority chain');
agents = replaceOnce(agents,
`4. \`docs/deployment-policy.md\`\n5. \`docs/roadmap-amendments/2026-08-01-post-pr498-review-gate.md\``,
`4. \`docs/deployment-policy.md\`\n5. \`docs/roadmap-amendments/2026-08-01-launch-date-boundary-review-batch-1.md\`\n6. \`docs/quality/launch-date-boundary-review-batch-1-spec.md\`\n7. \`config/launch-date-boundary-review-batch-1.json\`\n8. \`docs/roadmap-amendments/2026-08-01-post-pr498-review-gate.md\``,
'AGENTS reading order');
agents = agents.replace(/\n6\. `docs\/post-351-data-growth-operating-spec\.md`\n7\. `docs\/quality\/mnee-evidence-archive-maintenance-spec\.md`\n8\. `config\/mnee-evidence-archive-maintenance\.json`\n9\. `data\/editorial-research\/mnee-evidence-archive-maintenance-batch-1-source-review\.json`\n10\. `docs\/migration\/current-canonical-checkpoint\.json`\n11\. `docs\/migration\/current-review-checkpoint\.json`\n12\. `docs\/migration\/current-stats-history-checkpoint\.json`\n13\. every named baseline, queue, audit, handoff, source-coverage report, and prior output required by a separately authorized work item/,
`\n9. \`docs/post-351-data-growth-operating-spec.md\`\n10. \`docs/quality/mnee-evidence-archive-maintenance-spec.md\`\n11. \`config/mnee-evidence-archive-maintenance.json\`\n12. \`data/editorial-research/mnee-evidence-archive-maintenance-batch-1-source-review.json\`\n13. \`docs/migration/current-canonical-checkpoint.json\`\n14. \`docs/migration/current-review-checkpoint.json\`\n15. \`docs/migration/current-stats-history-checkpoint.json\`\n16. every named baseline, queue, audit, handoff, source-coverage report, and prior output required by a separately authorized work item`);
agents = replaceOnce(agents,
`Required exit after PR #500 merge and production verification: REVIEW GATE — satisfied\nCurrent state: REVIEW GATE`,
`Required exit after PR #500 merge and production verification: REVIEW GATE — satisfied\nPR #501 post-PR #500 authority synchronization: complete and production-verified\nPR #502 Launch Date Boundary Review — Batch 1 authorization: active\nAuthorized implementation: PR #503 review-only evidence and boundary audit\nRequired exit after PR #503: REVIEW GATE`,
'AGENTS workstream');
agents = replaceOnce(agents,
`## PR #500 maintenance result`,
`## PR #502 authorized review\n\nThe next bounded item reviews exactly six unresolved launch-date records that currently lack both a formal review date and reviewed-source list:\n\n\`\`\`text\nsog_st_msusd\nsog_st_stablesusdx\nsog_st_susde\nsog_st_usd1\nsog_st_usdm\nsog_st_usdh\n\`\`\`\n\nPR #502 changes authority only. PR #503 may set a launch date only from exact day-level primary evidence matching the launch boundary. Otherwise the date remains null and the reviewed range, sources, and reason must be recorded. No seventh or replacement target is allowed.\n\n## PR #500 maintenance result`,
'AGENTS PR502 section');
write('AGENTS.md', agents);

let roadmap = read('docs/roadmap.md');
roadmap = roadmap.replace('Status: PR #500 complete and production-verified; REVIEW GATE', 'Status: PR #502 Launch Date Boundary Review — Batch 1 authorized; PR #503 implementation next');
roadmap = roadmap.replace('Current production checkpoint: 9d583845d73e4d758ab245812d165f25dd59ada8', 'Current production checkpoint: 9136f44bff06d20b8611d66ed28156c9147765a5');
roadmap = replaceOnce(roadmap,
`PR #500 MNEE Evidence and Archive Maintenance — Batch 1: complete and production-verified\n\`\`\``,
`PR #500 MNEE Evidence and Archive Maintenance — Batch 1: complete and production-verified\nPR #501 post-PR #500 authority synchronization: complete and production-verified\nPR #502 Launch Date Boundary Review — Batch 1 authorization: active\n\`\`\``,
'roadmap acceptance points');
roadmap = replaceOnce(roadmap,
`## Current boundary\n\n\`\`\`text\nREVIEW GATE\n\`\`\`\n\nNo later dossier batch, record-growth batch, Figure YLDS amendment, Market Access change, public route family, or material public-surface program is authorized automatically.\n\nThe PR #496 candidate audit remains the latest complete candidate review. Its non-MNEE candidates were not supported for complete-record promotion at that checkpoint. A later candidate refresh requires a separate reviewed decision; it must not reuse the MNEE authorization.`,
`## Authorized current item\n\n\`\`\`text\nLaunch Date Boundary Review — Batch 1\nAuthority PR: #502\nImplementation PR: #503\nTargets: sog_st_msusd, sog_st_stablesusdx, sog_st_susde, sog_st_usd1, sog_st_usdm, sog_st_usdh\n\`\`\`\n\nPR #503 must review all six named targets using primary sources. Exact day-level launch dates may be written only when the source matches the canonical identity and the launch boundary. Otherwise the date remains null and the queue receives a reviewed range, specific reason, review date, and source list.\n\nThe item adds no new asset and authorizes no replacement target, YLDS work, Market Access change, route family, ranking, recommendation, or material UI change. After PR #503 merge and production verification, stop at REVIEW GATE.\n\nThe PR #496 candidate audit remains the latest complete candidate review. Its non-MNEE candidates were not supported for complete-record promotion at that checkpoint.`,
'roadmap current boundary');
write('docs/roadmap.md', roadmap);

let governance = read('docs/spec-governance.md');
governance = governance.replace('docs/roadmap-amendments/2026-07-31-record-growth-batch-4-mnee.md', 'docs/roadmap-amendments/2026-08-01-launch-date-boundary-review-batch-1.md');
governance = governance.replace('docs/quality/record-growth-batch-4-mnee-pr498-spec.md', 'docs/quality/launch-date-boundary-review-batch-1-spec.md');
governance = governance.replace('Metadata-checked detail routes: 414', 'Metadata-checked detail routes: 417');
governance = replaceOnce(governance,
`Current item:\n\n\`\`\`text\nPR #497 Record Growth Batch 4 review gate\n\`\`\`\n\nReviewed decision:\n\n\`\`\`text\nPR #498 Record Growth Batch 4 — MNEE: authorized next\nmaximum new canonical assets: 1\nreplacement candidate: prohibited\nFigure YLDS: deferred pending separate scope amendment\nnext boundary after PR #498: REVIEW GATE\n\`\`\`\n\nNo work after PR #498 is pre-authorized.`,
`Current item:\n\n\`\`\`text\nPR #502 Launch Date Boundary Review — Batch 1 authorization\n\`\`\`\n\nReviewed decision:\n\n\`\`\`text\nPR #503 launch-date boundary review: authorized next\nexact targets: sog_st_msusd, sog_st_stablesusdx, sog_st_susde, sog_st_usd1, sog_st_usdm, sog_st_usdh\nnew canonical assets: 0\nreplacement targets: prohibited\ncanonical day required: true\nunsupported date coercion: prohibited\nnext boundary after PR #503: REVIEW GATE\n\`\`\`\n\nNo work beyond the six-target PR #503 review is pre-authorized.`,
'governance current item');
governance = replaceOnce(governance,
`## 11. YLDS scope boundary`,
`## 10A. PR #502 Launch Date Boundary Review — Batch 1\n\nPR #502 closes the post-PR #500 review gate only for a six-target launch-date evidence review. It changes no canonical data itself.\n\nThe target set is fixed to \`sog_st_msusd\`, \`sog_st_stablesusdx\`, \`sog_st_susde\`, \`sog_st_usd1\`, \`sog_st_usdm\`, and \`sog_st_usdh\`. PR #503 must review every target and may not substitute another record.\n\nA canonical date requires exact day-level primary evidence matching the same identity and launch boundary. Announcement, contract deployment, first mint, exchange listing, network activation, migration, and rebrand dates remain distinct unless primary evidence explicitly establishes equivalence. Unresolved outcomes remain null.\n\nPR #503 may add canonical Evidence only for direct named launch claims and may update only the named launch boundaries and queue records. It may not add assets, organizations, relationships, deployments, Market Access records, route families, rankings, recommendations, or material UI changes. It exits to REVIEW GATE.\n\n## 11. YLDS scope boundary`,
'governance PR502 section');
governance = replaceOnce(governance,
`## 19. Review gate\n\nPR #498 is complete. Stop and review:\n\n\`\`\`text\nwhether MNEE was added or withheld\ncanonical record completeness\nsource and archive completeness\nreserve and redemption support\ndeployment identity support\nknown unknowns\nmaintenance burden\nproduction parity\n\`\`\`\n\nOnly a separate reviewed decision may authorize later work.`,
`## 19. Review gate\n\nPR #502 is the current reviewed decision. Execute only PR #503 and then stop to review:\n\n\`\`\`text\nall six target dispositions\nexact-day evidence quality\nidentity and lineage boundaries\nEvidence additions, if any\nnull-date preservation\ncanonical counts and route parity\nproduction parity\n\`\`\`\n\nOnly a later separate reviewed decision may authorize another work item.`,
'governance review gate');
write('docs/spec-governance.md', governance);

write('scripts/validate-active-workstream.mjs', "import './validate-launch-date-boundary-review-pr502.mjs';\n");

fs.rmSync(path.join(root, 'scripts/apply-launch-date-boundary-review-pr502.mjs'));
fs.rmSync(path.join(root, '.github/workflows/apply-launch-date-boundary-review-pr502.yml'));
console.log(JSON.stringify({ ok: true, targets, temporary_files_removed: true }, null, 2));
