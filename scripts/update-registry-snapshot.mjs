import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const replaceRequired = (text, search, replacement, label) => {
  if (!text.includes(search)) throw new Error(`Missing expected text for ${label}`);
  return text.replace(search, replacement);
};

const v2Path = 'docs/migration/registry-v2-baseline.json';
const v2 = JSON.parse(fs.readFileSync(v2Path, 'utf8'));
v2.baseline_id = 'sog_registry_v2_dola_launch_2026_06_25';
v2.captured_at = '2026-06-25';
v2.source_commit = 'dola-launch';
v2.minimum_counts.events = 129;
v2.minimum_counts.event_details = 129;
v2.minimum_counts.evidence = 389;
v2.minimum_counts.evidence_relations = 389;
if (!v2.data_groups.evidence_relations.includes('data/evidence-batch-n.json')) {
  v2.data_groups.evidence_relations.push('data/evidence-batch-n.json');
}
fs.writeFileSync(v2Path, `${JSON.stringify(v2, null, 2)}\n`);

const v3Path = 'docs/migration/registry-v3-baseline.json';
const v3 = JSON.parse(fs.readFileSync(v3Path, 'utf8'));
v3.baseline_id = 'sog_registry_v3_dola_launch_2026_06_25';
v3.recorded_at = '2026-06-25';
v3.data_checkpoint_commit = 'dola-launch';
v3.expected_counts.events = 129;
v3.expected_counts.event_details = 129;
v3.expected_counts.evidence = 389;
v3.quality.launch_date_unresolved = 22;
fs.writeFileSync(v3Path, `${JSON.stringify(v3, null, 2)}\n`);

execFileSync('node', ['scripts/generate-registry-stats.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/audit-registry-integrity.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/validate-registry-stats.mjs'], { stdio: 'inherit' });

const readmePath = 'README.md';
let readme = fs.readFileSync(readmePath, 'utf8');
readme = replaceRequired(readme, '128 events\n128 Event v2 detail records\n386 evidence records\n386 evidence relation projections', '129 events\n129 Event v2 detail records\n389 evidence records\n389 evidence relation projections', 'README counts');
readme = replaceRequired(readme, 'The public production site remains at the last verified publication checkpoint until Cloudflare access returns and a manual deployment plus parity audit is completed. GitHub-only quality work continues against the 81-record baseline.', 'The latest verified production publication contains 82 stable assets and the three dated guides. GitHub may contain later reviewed quality-only corrections before the next defined manual publication checkpoint.', 'README production status');
readme = replaceRequired(readme, '23 unresolved launch dates', '22 unresolved launch dates', 'README launch queue');
fs.writeFileSync(readmePath, readme);

const auditPath = 'docs/audits/remaining-launch-date-review.md';
let audit = fs.readFileSync(auditPath, 'utf8');
audit = replaceRequired(audit, 'Updated: 2026-06-24', 'Updated: 2026-06-25', 'audit date');
audit = audit.replaceAll('Total unresolved: 23', 'Total unresolved: 22');
audit = audit.replaceAll('Category C: 17', 'Category C: 16');
audit = replaceRequired(audit, '- Cashio Dollar — public mint, redemption, liquidity, and swap availability fixed to 2021-11-09 while the exact Solana mint remains unresolved.', '- Cashio Dollar — public mint, redemption, liquidity, and swap availability fixed to 2021-11-09 while the exact Solana mint remains unresolved.\n- DOLA — Ethereum contract creation on 2021-02-23 separated from the public Anchor and DOLA launch on 2021-02-25; the exact first mint remains unresolved.', 'DOLA resolved bullet');
audit = replaceRequired(audit, '| DOLA | `sog_st_dola` | — | First mint, release, and FiRM issuance differ. |\n', '', 'remove DOLA queue row');
audit = replaceRequired(audit, 'Current unresolved queue: 23', 'Current unresolved queue: 22', 'audit completion total');
audit = replaceRequired(audit, 'Next bounded review: DOLA', 'Next bounded review: USD1', 'audit next review');
fs.writeFileSync(auditPath, audit);

const roadmapPath = 'docs/roadmap.md';
let roadmap = fs.readFileSync(roadmapPath, 'utf8');
roadmap = replaceRequired(roadmap, 'Latest merged PR: #135 — Record registry 82 production parity\nLatest merged commit: 9e4cde7456ccf83d62d646191809c97031c8529e\nCurrent PR: #139 — Audit DOLA launch boundary\nCurrent phase: bounded existing-record quality audit\nCanonical change in this PR: none\nNext operation after merge: implement the resolved DOLA launch boundary', 'Latest merged PR: #139 — Audit DOLA launch boundary\nLatest merged commit: 4cb2f9f27ba8aef40794f25d8eb331bc5f2eaa97\nCurrent PR: #140 — Resolve DOLA launch boundary\nCurrent phase: canonical quality implementation\nCanonical result: DOLA launch fixed to 2021-02-25\nNext bounded work after merge: USD1 launch-boundary audit', 'roadmap current position');
roadmap = replaceRequired(roadmap, 'Recommended canonical DOLA launch_date: 2021-02-25', 'Canonical DOLA launch_date: 2021-02-25', 'roadmap DOLA decision');
roadmap = replaceRequired(roadmap, 'The successful production publication includes the 82-record registry, the GENIUS Act guide, the MiCA guide, the JPYC versus JPYSC guide, related-guide discovery, Updates, sitemap integration, and machine-readable public files.', 'The successful production publication includes the 82-record registry, the GENIUS Act guide, the MiCA guide, the JPYC versus JPYSC guide, related-guide discovery, Updates, sitemap integration, and machine-readable public files.\n\nPR #140 is a quality-only change and does not increase the stable-asset count or trigger automatic production publication.', 'roadmap production note');
roadmap = replaceRequired(roadmap, '128 events\n128 Event v2 detail records\n386 evidence records', '129 events\n129 Event v2 detail records\n389 evidence records\n389 evidence relation projections', 'roadmap counts');
roadmap = replaceRequired(roadmap, 'Missing canonical launch dates:            23', 'Missing canonical launch dates:            22', 'roadmap quality count');
const queueStart = roadmap.indexOf('### Launch-date queue');
const categoryBStart = roadmap.indexOf('Remaining Category B records:', queueStart);
if (queueStart < 0 || categoryBStart < 0) throw new Error('Unable to locate roadmap launch queue section');
roadmap = `${roadmap.slice(0, queueStart)}### Launch-date queue\n\n\`\`\`text\nTotal unresolved: 22\nCategory B:         3\nCategory C:        16\nCategory D:         3\n\`\`\`\n\nDOLA is no longer in the queue. Its public launch is fixed to 2021-02-25 while exact first mint remains a known unknown.\n\n${roadmap.slice(categoryBStart)}`;
roadmap = replaceRequired(roadmap, 'Current bounded launch-date review:\n\n```text\nDOLA — audit resolved; canonical implementation pending\n```\n\nFirst quality wave after DOLA:\n\n```text\nUSD1\nMIM\nmUSD\nUSK\nVAI\nVCHF\nIRON\n```', 'Next bounded launch-date review:\n\n```text\nUSD1\n```\n\nFollowing quality wave:\n\n```text\nMIM\nmUSD\nUSK\nVAI\nVCHF\nIRON\n```', 'roadmap next quality wave');
const executionStart = roadmap.indexOf('## Full execution sequence');
const immediateStart = roadmap.indexOf('## Immediate next work', executionStart);
if (executionStart < 0 || immediateStart < 0) throw new Error('Unable to locate roadmap execution section');
roadmap = `${roadmap.slice(0, executionStart)}## Full execution sequence\n\n\`\`\`text\nPhase 1 — Complete DOLA implementation\n1. Synchronize baselines, generated outputs, README, audits, and roadmap.\n2. Remove temporary synchronization workflow changes and helper script.\n3. Run all six CI workflows.\n4. Merge PR #140 only after every check passes.\n\nPhase 2 — First launch-date quality wave\n5. Audit USD1 introduction, contract deployment, first issuance, testing, and public availability boundaries.\n6. Implement a date only if day-level primary or on-chain evidence supports the selected public boundary.\n7. Review MIM, mUSD, USK, VAI, VCHF, and IRON.\n\nPhase 3 — Cross-queue maintenance\n8. Recheck HUSD and EURT reserve-source status only when durable product-specific evidence is found.\n9. Keep BAC, DSD, ESD, and GYEN terminal dates unresolved until matching end-boundary evidence exists.\n\nPhase 4 — Controlled growth\n10. Prepare a reviewed candidate master.\n11. Promote no more than five complete stable-asset records per batch.\n12. Publish and verify production after each growth batch.\n13. Do not allow production to trail main by more than one growth batch.\n\nPhase 5 — Normal operating cycle\n14. Alternate two or three existing-record quality audits with one growth batch of no more than five records.\n15. Insert urgent incident, regulatory, depeg, wind-down, or redemption updates ahead of the routine queue when necessary.\n\`\`\`\n\n${roadmap.slice(immediateStart)}`;
const immediateEnd = roadmap.indexOf('## Production policy', roadmap.indexOf('## Immediate next work'));
if (immediateEnd < 0) throw new Error('Unable to locate roadmap production section');
roadmap = `${roadmap.slice(0, roadmap.indexOf('## Immediate next work'))}## Immediate next work\n\n\`\`\`text\n1. Complete final CI and merge PR #140.\n2. Report DOLA implementation counts and queue reduction.\n3. Start the bounded USD1 launch-boundary audit.\n4. Do not force a USD1 date from the March 2025 month-level range alone.\n5. Separate introduction, deployment, first issuance, testing, and public availability.\n\`\`\`\n\n${roadmap.slice(immediateEnd)}`;
roadmap = replaceRequired(roadmap, '- finish the DOLA bounded audit and canonical implementation first', '- finish the DOLA implementation and first bounded quality wave', 'roadmap growth gate');
fs.writeFileSync(roadmapPath, roadmap);

const workflowPath = '.github/workflows/registry-stats.yml';
fs.writeFileSync(workflowPath, `name: Registry stats\n\non:\n  pull_request:\n  push:\n    branches: [main]\n\npermissions:\n  contents: read\n\njobs:\n  validate:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: 22\n      - name: Validate current output\n        run: node scripts/validate-registry-stats.mjs\n      - name: Rebuild output\n        run: node scripts/generate-registry-stats.mjs\n      - name: Validate rebuilt output\n        run: node scripts/validate-registry-stats.mjs\n      - uses: actions/upload-artifact@v4\n        with:\n          name: registry-stats\n          path: data/generated/registry-stats.json\n`);

fs.unlinkSync('scripts/update-registry-snapshot.mjs');

if (process.env.GITHUB_ACTIONS === 'true') {
  const headRef = process.env.GITHUB_HEAD_REF;
  if (!headRef) throw new Error('GITHUB_HEAD_REF is required for finalization');
  execFileSync('git', ['config', 'user.name', 'github-actions[bot]']);
  execFileSync('git', ['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com']);
  execFileSync('git', ['add', '-A']);
  execFileSync('git', ['commit', '-m', 'Finalize DOLA launch synchronization'], { stdio: 'inherit' });
  execFileSync('git', ['push', 'origin', `HEAD:${headRef}`], { stdio: 'inherit' });
}
