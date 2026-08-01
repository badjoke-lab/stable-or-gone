import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, content) => {
  const full = path.join(root, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content.endsWith('\n') ? content : content + '\n');
};
const replaceOnce = (text, from, to, label) => {
  if (!text.includes(from)) throw new Error(`Missing ${label}: ${from}`);
  return text.replace(from, to);
};

const targets = [
  'sog_src_rai_integrations_batch_b',
  'sog_src_rai_oracle_relayer_batch_b',
  'sog_src_rai_ungovernance_batch_b',
  'sog_src_rlusd_docs',
  'sog_src_rlusd_launch_2024',
  'sog_src_rlusd_ripple_page',
  'sog_src_spot_about_batch_b',
  'sog_src_spot_mint_batch_b',
  'sog_src_spot_site_batch_b',
  'sog_src_spot_v2_rollout_batch_b'
];

const config = {
  schema_version: '1.0',
  authority_id: 'sog_evidence_archive_payload_verification_batch_1_pr505_2026_08_01',
  status: 'approved_bounded_review',
  public_output: false,
  authority_pr: 505,
  implementation_pr: 506,
  reviewed_at: '2026-08-01',
  source_review_pr: 405,
  source_outcomes: 'docs/migration/evidence-archive-maintenance-outcomes-pr405.json',
  source_queue: 'docs/migration/evidence-archive-maintenance-queue-v7-pr403.json',
  current_evidence_count: 579,
  current_evidence_relation_count: 579,
  archive_recorded_before: 450,
  archive_not_recorded_before: 129,
  target_count: 10,
  target_evidence_ids: targets,
  allowed_outcomes: ['dated_exact_archive_added', 'reviewed_no_safe_change'],
  acceptance_requirements: {
    exact_canonical_source_url: true,
    wayback_http_status_200: true,
    dated_snapshot_url: true,
    archived_payload_independently_fetched: true,
    claim_scope_preserved_in_payload: true,
    redirect_only_or_cdx_metadata_only_insufficient: true
  },
  maximum_archive_additions: 10,
  prohibited: [
    'source_url_replacement',
    'new_evidence_identity',
    'evidence_relation_change',
    'canonical_asset_change',
    'market_access_change',
    'public_route_change',
    'material_ui_change',
    'automatic_archive_promotion',
    'replacement_target',
    'automatic_continuation_after_pr506'
  ],
  next_boundary: 'REVIEW_GATE'
};
write('config/evidence-archive-payload-verification-batch-1.json', JSON.stringify(config, null, 2));

write('docs/quality/evidence-archive-payload-verification-batch-1-spec.md', `# Evidence Archive Payload Verification — Batch 1\n\nStatus: authorized bounded private maintenance  \nAuthority PR: #505  \nImplementation PR: #506  \nPublic output: false\n\n## Objective\n\nRe-review exactly ten Evidence identities that PR #405 left unchanged because exact-source Wayback CDX metadata existed but the archived payload itself was not independently inspected. PR #506 may add an exact dated Wayback URL only when the archived payload is fetched and manually reviewed as preserving the canonical claim scope.\n\n## Fixed target set\n\n\`\`\`text\n${targets.join('\n')}\n\`\`\`\n\nNo replacement or eleventh identity is allowed.\n\n## Acceptance rule\n\nA dated archive may be accepted only when all of the following are true:\n\n1. the snapshot is for the exact canonical source URL;\n2. the Wayback response is HTTP 200;\n3. the archived payload is independently fetched, not inferred from CDX metadata;\n4. the payload visibly preserves the Evidence identity's canonical claim scope;\n5. the accepted URL includes the exact Wayback timestamp; and\n6. the decision is recorded in a private reviewed outcome artifact.\n\nCDX metadata, redirects, domain-level captures, URL existence, or keyword matches without payload review are insufficient.\n\n## Allowed outcomes\n\n- \`dated_exact_archive_added\`\n- \`reviewed_no_safe_change\`\n\nSource replacement is not authorized in this batch.\n\n## Preserved boundaries\n\n\`\`\`text\nStable assets: 117\nOrganizations: 108\nRelationships: 129\nEvents: 192\nEvidence identities: 579\nEvidence Relations: 579\nDeployments: 184\nMarket Access Records: 8\nDetail routes: 417\nMetadata-checked routes: 417\nArchive recorded before: 450\nArchive not recorded before: 129\n\`\`\`\n\nOnly \`archived_url\` fields for accepted target identities and the forward archive-quality checkpoints may change. No public route, UI, schema, Evidence identity, Evidence Relation, source URL, or non-Evidence canonical record may change.\n\n## Exit\n\nPR #506 must stop at \`REVIEW GATE\` after all ten outcomes and production parity are reviewed. No Batch 2 is authorized automatically.\n`);

write('docs/roadmap-amendments/2026-08-01-evidence-archive-payload-verification-batch-1.md', `# Evidence Archive Payload Verification — Batch 1\n\nDate: 2026-08-01  \nAuthority PR: #505  \nImplementation PR: #506\n\n## Decision\n\nThe post-PR #503 review gate is closed only for one bounded archive-payload verification pass over the ten identities previously reviewed without canonical change in PR #405.\n\nThe purpose is not to repeat CDX probing. PR #506 must fetch and inspect archived payload bodies and may add exact dated archive URLs only where the body preserves the existing canonical claim scope.\n\n## Fixed identities\n\n\`\`\`text\n${targets.join('\n')}\n\`\`\`\n\n## Constraints\n\n- exact target set;\n- no replacement identities;\n- no source replacements;\n- no automatic archive promotion;\n- no new Evidence or Evidence Relations;\n- no asset, organization, relationship, event, deployment, Market Access, route, or UI change;\n- canonical counts remain fixed;\n- archive coverage may increase by zero to ten only;\n- every accepted archive requires an exact timestamp and reviewed payload evidence.\n\n## Exit boundary\n\nAfter PR #506 merge and production verification, return to \`REVIEW GATE\`.\n`);

write('scripts/validate-evidence-archive-payload-verification-pr505.mjs', `import fs from 'node:fs';\nimport path from 'node:path';\n\nconst root = process.cwd();\nconst readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));\nconst readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');\nconst failures = [];\nconst expect = (condition, message) => { if (!condition) failures.push(message); };\n\nconst expectedIds = ${JSON.stringify(targets)};\nconst config = readJson('config/evidence-archive-payload-verification-batch-1.json');\nconst source = readJson('docs/migration/evidence-archive-maintenance-outcomes-pr405.json');\nconst checkpoint = readJson('docs/migration/current-canonical-checkpoint.json');\nconst agents = readText('AGENTS.md');\nconst roadmap = readText('docs/roadmap.md');\nconst governance = readText('docs/spec-governance.md');\nconst active = readText('scripts/validate-active-workstream.mjs').trim();\n\nexpect(config.status === 'approved_bounded_review', 'authority status changed');\nexpect(config.authority_pr === 505 && config.implementation_pr === 506, 'PR sequence changed');\nexpect(config.target_count === 10, 'target count changed');\nexpect(JSON.stringify(config.target_evidence_ids) === JSON.stringify(expectedIds), 'target identities changed');\nexpect(JSON.stringify(config.allowed_outcomes) === JSON.stringify(['dated_exact_archive_added','reviewed_no_safe_change']), 'allowed outcomes changed');\nexpect(config.maximum_archive_additions === 10, 'archive addition maximum changed');\nexpect(config.next_boundary === 'REVIEW_GATE', 'next boundary changed');\nexpect(source.review_pr === 405 && source.reviewed_no_safe_change_count === 10 && source.changed_count === 0, 'PR #405 source result changed');\nexpect(JSON.stringify(source.outcomes.map((row) => row.evidence_id)) === JSON.stringify(expectedIds), 'PR #405 source target order changed');\nconst counts = checkpoint.counts;\nexpect(counts.assets === 117 && counts.organizations === 108 && counts.relationships === 129, 'identity counts changed');\nexpect(counts.events === 192 && counts.evidence === 579 && counts.evidence_relations === 579, 'event or Evidence counts changed');\nexpect(counts.deployments === 184 && counts.market_access_records === 8, 'deployment or Market Access counts changed');\nexpect(counts.archive_index_count === 450 && counts.archive_not_recorded_count === 129, 'archive counts changed before implementation');\nexpect(agents.includes('PR #505 Evidence Archive Payload Verification — Batch 1 authorization: active'), 'AGENTS PR #505 authority missing');\nexpect(agents.includes('PR #506 Evidence Archive Payload Verification — Batch 1: reserved implementation'), 'AGENTS PR #506 reservation missing');\nexpect(roadmap.includes('Status: PR #505 Evidence Archive Payload Verification — Batch 1 authorized; PR #506 reserved'), 'roadmap status missing');\nexpect(governance.includes('PR #505 Evidence Archive Payload Verification — Batch 1 authorization'), 'governance current item missing');\nexpect(governance.includes('No work beyond PR #506 is pre-authorized.'), 'governance stop boundary missing');\nexpect(active === \"import './validate-evidence-archive-payload-verification-pr505.mjs';\", 'active workstream is not wired to PR #505');\n\nif (failures.length) {\n  console.error('PR #505 Evidence Archive Payload Verification authority failed:');\n  failures.forEach((failure) => console.error('- ' + failure));\n  process.exit(1);\n}\nconsole.log(JSON.stringify({ ok: true, authority_pr: 505, implementation_pr: 506, target_count: 10, archive_recorded_before: 450, archive_not_recorded_before: 129, next_boundary: 'REVIEW_GATE' }, null, 2));\n`);

write('scripts/validate-active-workstream.mjs', "import './validate-evidence-archive-payload-verification-pr505.mjs';\n");

let agents = read('AGENTS.md');
agents = replaceOnce(agents, 'Current production checkpoint: a89832072b6f4fe07cf43b76ae77d2a5a1aac0f0', 'Current production checkpoint: 4ac32bc2476e04bb28142ef75cf421149c441542', 'AGENTS production checkpoint');
agents = replaceOnce(agents, '12. PR #504 synchronizes the completed checkpoint and returns the repository to REVIEW GATE.\n13. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.', '12. PR #504 synchronized the completed checkpoint, was production-verified, and returned the repository to REVIEW GATE.\n13. PR #505 authorizes one bounded archived-payload verification pass over ten PR #405 Evidence identities; implementation is reserved for PR #506.\n14. `docs/ui-v3-remediation-authority.md` remains the regression-protection contract for material public UI work.', 'AGENTS authority chain');
agents = replaceOnce(agents, '4. `docs/deployment-policy.md`\n5. `docs/roadmap-amendments/2026-08-01-launch-date-boundary-review-batch-1.md`', '4. `docs/deployment-policy.md`\n5. `docs/roadmap-amendments/2026-08-01-evidence-archive-payload-verification-batch-1.md`\n6. `docs/quality/evidence-archive-payload-verification-batch-1-spec.md`\n7. `config/evidence-archive-payload-verification-batch-1.json`\n8. `docs/roadmap-amendments/2026-08-01-launch-date-boundary-review-batch-1.md`', 'AGENTS reading order');
agents = agents.replace(/\n6\. `docs\/quality\/launch-date-boundary-review-batch-1-spec\.md`\n7\. `config\/launch-date-boundary-review-batch-1\.json`\n8\. `docs\/roadmap-amendments\/2026-08-01-post-pr498-review-gate\.md`\n9\. `docs\/post-351-data-growth-operating-spec\.md`\n10\. `docs\/quality\/mnee-evidence-archive-maintenance-spec\.md`\n11\. `config\/mnee-evidence-archive-maintenance\.json`\n12\. `data\/editorial-research\/mnee-evidence-archive-maintenance-batch-1-source-review\.json`\n13\. `docs\/migration\/current-canonical-checkpoint\.json`\n14\. `docs\/migration\/current-review-checkpoint\.json`\n15\. `docs\/migration\/current-stats-history-checkpoint\.json`\n16\./, '\n9. `docs/quality/launch-date-boundary-review-batch-1-spec.md`\n10. `config/launch-date-boundary-review-batch-1.json`\n11. `docs/roadmap-amendments/2026-08-01-post-pr498-review-gate.md`\n12. `docs/post-351-data-growth-operating-spec.md`\n13. `docs/quality/mnee-evidence-archive-maintenance-spec.md`\n14. `config/mnee-evidence-archive-maintenance.json`\n15. `data/editorial-research/mnee-evidence-archive-maintenance-batch-1-source-review.json`\n16. `docs/migration/current-canonical-checkpoint.json`\n17. `docs/migration/current-review-checkpoint.json`\n18. `docs/migration/current-stats-history-checkpoint.json`\n19.');
agents = replaceOnce(agents, 'PR #504 post-PR #503 authority synchronization: active\nCurrent state after PR #504: REVIEW GATE', 'PR #504 post-PR #503 authority synchronization: complete and production-verified\nPR #505 Evidence Archive Payload Verification — Batch 1 authorization: active\nPR #506 Evidence Archive Payload Verification — Batch 1: reserved implementation\nRequired exit after PR #506 merge and production verification: REVIEW GATE', 'AGENTS workstream');
const agentsSection = `\n## PR #505 authorized archive-payload review\n\nPR #506 must re-review exactly the ten PR #405 identities listed in the current config. PR #405 established exact-source CDX history but did not inspect archived payload bodies, so all ten remained without a canonical archive.\n\nThis pass may add only exact dated Wayback URLs whose HTTP-200 archived payload has been independently reviewed as preserving the existing canonical claim scope. CDX metadata, redirects, domain-level captures, and keyword-only automation are not sufficient. Source replacement and replacement targets are prohibited.\n\nPreserved source state:\n\n\`\`\`text\nEvidence identities: 579\nEvidence Relations: 579\nArchive recorded: 450\nArchive not recorded: 129\nMaximum accepted archive additions: 10\n\`\`\`\n\nAfter PR #506 merge and production verification, stop at REVIEW GATE. No later archive batch or unrelated work is authorized automatically.\n`;
agents = replaceOnce(agents, '\n## PR #502 authorized review\n', agentsSection + '\n## PR #502 authorized review\n', 'AGENTS new section insertion');
write('AGENTS.md', agents);

let roadmap = read('docs/roadmap.md');
roadmap = replaceOnce(roadmap, 'Status: PR #503 complete and production-verified; REVIEW GATE', 'Status: PR #505 Evidence Archive Payload Verification — Batch 1 authorized; PR #506 reserved', 'roadmap status');
roadmap = replaceOnce(roadmap, 'Current production checkpoint: a89832072b6f4fe07cf43b76ae77d2a5a1aac0f0', 'Current production checkpoint: 4ac32bc2476e04bb28142ef75cf421149c441542', 'roadmap checkpoint');
roadmap = replaceOnce(roadmap, 'PR #504 post-PR #503 authority synchronization: active', 'PR #504 post-PR #503 authority synchronization: complete and production-verified\nPR #505 Evidence Archive Payload Verification — Batch 1 authorization: active\nPR #506 Evidence Archive Payload Verification — Batch 1: reserved implementation', 'roadmap acceptance list');
const oldBoundary = `## Current boundary\n\n\`\`\`text\nREVIEW GATE\n\`\`\`\n\nNo later launch-date batch, dossier batch, record-growth batch, Figure YLDS amendment, Market Access change, public route family, or material public-surface program is authorized automatically.`;
const newBoundary = `## Authorized current item\n\n\`\`\`text\nEvidence Archive Payload Verification — Batch 1\nAuthority PR: #505\nImplementation PR: #506\nTargets: ten PR #405 reviewed-no-safe-change Evidence identities\n\`\`\`\n\nPR #506 must fetch and inspect archived payload bodies. It may add zero to ten exact dated Wayback URLs only when the payload preserves the existing canonical claim scope. CDX metadata alone is insufficient. Source replacement, replacement identities, Evidence identity changes, public output, and non-Evidence canonical changes are prohibited.\n\n## Current boundary\n\n\`\`\`text\nPR #506 implementation, then REVIEW GATE\n\`\`\`\n\nNo later archive batch, launch-date batch, dossier batch, record-growth batch, Figure YLDS amendment, Market Access change, public route family, or material public-surface program is authorized automatically.`;
roadmap = replaceOnce(roadmap, oldBoundary, newBoundary, 'roadmap current boundary');
write('docs/roadmap.md', roadmap);

let governance = read('docs/spec-governance.md');
governance = replaceOnce(governance, 'docs/roadmap-amendments/2026-08-01-launch-date-boundary-review-batch-1.md', 'docs/roadmap-amendments/2026-08-01-evidence-archive-payload-verification-batch-1.md', 'governance active amendment');
governance = replaceOnce(governance, 'docs/quality/launch-date-boundary-review-batch-1-spec.md', 'docs/quality/evidence-archive-payload-verification-batch-1-spec.md', 'governance active spec');
governance = replaceOnce(governance, 'PR #503 Launch Date Boundary Review — Batch 1 implementation', 'PR #505 Evidence Archive Payload Verification — Batch 1 authorization; PR #506 implementation reserved', 'governance current item');
const oldDecision = `PR #503 launch-date boundary review: complete and production-verified\nexact targets: sog_st_msusd, sog_st_stablesusdx, sog_st_susde, sog_st_usd1, sog_st_usdm, sog_st_usdh\nexact day resolved: 0\ncanonical null preserved: 6\nnew canonical Evidence identities: 0\nnew canonical assets: 0\nreplacement targets: prohibited\nunsupported date coercion: prohibited\nnext boundary after PR #503: REVIEW GATE`;
const newDecision = `PR #505 Evidence Archive Payload Verification — Batch 1 authorization\nimplementation PR: #506\nexact target count: 10\nsource checkpoint: PR #405 reviewed-no-safe-change identities\nallowed outcomes: dated_exact_archive_added or reviewed_no_safe_change\nmaximum archive additions: 10\nsource replacement: prohibited\nreplacement targets: prohibited\nnew Evidence identities or Relations: prohibited\nnext boundary after PR #506: REVIEW GATE`;
governance = replaceOnce(governance, oldDecision, newDecision, 'governance reviewed decision');
const section = `\n## 10B. PR #505 Evidence Archive Payload Verification — Batch 1\n\nPR #505 closes the current review gate only for one ten-identity archived-payload verification pass. PR #506 is the only authorized implementation.\n\nThe target set is fixed by \`config/evidence-archive-payload-verification-batch-1.json\` and consists of the ten PR #405 identities that had exact-source CDX metadata but no independently reviewed archive payload.\n\nAn archive may be accepted only when the exact canonical URL returns an HTTP-200 dated Wayback snapshot and the fetched archived body visibly preserves the existing canonical claim scope. CDX metadata, redirect status, root-domain capture, or automated keyword matching without manual payload review cannot authorize a canonical \`archived_url\`.\n\nPR #506 may change only accepted target \`archived_url\` fields and forward archive-quality checkpoints. It may not replace source URLs, add Evidence identities or Relations, change non-Evidence canonical records, alter public routes, or modify material UI. It exits to REVIEW GATE. No work beyond PR #506 is pre-authorized.\n`;
governance = replaceOnce(governance, '\n## 11. YLDS scope boundary\n', section + '\n## 11. YLDS scope boundary\n', 'governance section insertion');
governance = governance.replace(/## 19\. Review gate[\s\S]*$/, `## 19. Review gate\n\nPR #505 is the current reviewed decision. Execute only PR #506 and then stop to review:\n\n\`\`\`text\nall ten payload-review dispositions\nexact Wayback timestamps and canonical URL identity\narchived payload claim-scope preservation\naccepted archive additions, if any\narchive coverage transition\ncanonical count and route parity\nproduction parity\n\`\`\`\n\nOnly a later separate reviewed decision may authorize another work item.\n`);
write('docs/spec-governance.md', governance);

console.log(JSON.stringify({ ok: true, authority_pr: 505, implementation_pr: 506, target_count: targets.length }, null, 2));
