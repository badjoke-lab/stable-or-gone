import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const readJson = (path) => JSON.parse(fs.readFileSync(path, 'utf8'));
const writeJson = (path, value) => fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
const replaceRequired = (path, search, replacement, label) => {
  let text = fs.readFileSync(path, 'utf8');
  if (!text.includes(search)) throw new Error(`${path}: missing ${label}`);
  text = text.replace(search, replacement);
  fs.writeFileSync(path, text);
};

replaceRequired('README.md', '412 evidence records\n412 evidence relation projections', '415 evidence records\n415 evidence relation projections', 'evidence counts');
replaceRequired('docs/audits/husd-eurt-reserve-source-recheck.md', 'Result: BOTH RECORDS REMAIN SOURCE-STATUS UNRESOLVED', 'Result: IMPLEMENTED — BOTH RECORDS REMAIN SOURCE-STATUS UNRESOLVED', 'audit result');
replaceRequired('docs/audits/husd-eurt-reserve-source-recheck.md', '## Follow-up implementation\n\nA separate quality implementation may:', '## Implementation result\n\nThe quality implementation:', 'implementation heading');

const sourceReviewPath = 'docs/audits/reserve-source-status-review.md';
let sourceReview = fs.readFileSync(sourceReviewPath, 'utf8');
sourceReview = sourceReview.replace('Updated: 2026-06-23', 'Updated: 2026-06-25');
sourceReview = sourceReview.replace('The 81-record registry has 69 assets with canonical reserve/report context and 12 classified uncovered assets. FEI moved from source-status unresolved into canonical historical reserve/redemption context after recovery of the executed on-chain TIP-121c package.', 'The 82-record registry has 70 assets with canonical reserve/report context and 12 classified uncovered assets. HUSD and EURT were rechecked on 2026-06-25 and remain source-status unresolved. Three source-scope evidence records were added without creating reserve-report rows.');
sourceReview = sourceReview.replace('Monthly attestations and a January 2022 Accountant\'s Attestation are historically identified, but the original signed report, accountant package, measurement boundary, reserve comparison, and durable archive remain unrecovered. Secondary descriptions do not justify a canonical report row.', 'Monthly attestations and a January 2022 Accountant\'s Attestation are historically identified. A legal study confirms the report existed and is no longer publicly available, but the original signed report, accountant package, measurement boundary, reserve comparison, and durable primary archive remain unrecovered. The secondary source does not justify a canonical report row.');
sourceReview = sourceReview.replace('Tether consolidated reports cover group assets and aggregate digital-token liabilities, but the reviewed reports do not separately identify EURT reserve assets, EURT liabilities, the EURT issuer boundary, or a final product-specific reconciliation. Consolidated Tether reporting is not copied into the EURT record without explicit product scope.', 'Official Tether transparency and relevant-information materials confirm quarterly consolidated reserve reporting. They also show that the reporting scope may include assets and liabilities of entities that do not issue or redeem Tether Tokens. The reviewed material does not separately identify EURT reserve assets, EURT liabilities, the EURT issuer boundary, or a final product-specific reconciliation.');
fs.writeFileSync(sourceReviewPath, sourceReview);

const roadmapPath = 'docs/roadmap.md';
let roadmap = fs.readFileSync(roadmapPath, 'utf8');
roadmap = roadmap.replace(
`Latest merged PR: #154 — Implement IRON launch date
Latest merged commit: d9676e3fc98f8f15da768525c7cc971622a8975e
Completed phase: first bounded launch-date quality wave
Current work: HUSD and EURT reserve-source recheck
Audit conclusion: retain both as source_status_unresolved
Next operation after audit: add source-recovery context without reserve-report rows
Next phase: terminal queue checkpoint, then controlled growth`,
`Latest merged PR: #155 — Recheck HUSD and EURT reserve sources
Latest merged commit: 217d3992431409520f166165b560fd20c46cb7d9
Completed phase: first bounded launch-date quality wave
Current work: HUSD and EURT source-recovery context implementation
Implementation result: three evidence records added; both remain source_status_unresolved
Reserve-report result: no reserve-report rows added; count remains 90
Next phase after merge: terminal queue checkpoint, then controlled growth`
);
roadmap = roadmap.replace('Follow-up quality implementation:', 'Canonical quality implementation result:');
roadmap = roadmap.replace(
'- add HUSD legal-study evidence as secondary source-recovery context\n- add official Tether transparency and relevant-information evidence as consolidated-scope context\n- update HUSD and EURT known unknowns and queue notes to 2026-06-25\n- retain both records as `source_status_unresolved`\n- add no reserve-report rows\n- keep reserve-report count at 90',
'- HUSD legal-study evidence added as secondary source-recovery context\n- official Tether transparency and relevant-information evidence added as consolidated-scope context\n- HUSD and EURT known unknowns and queue notes updated to 2026-06-25\n- both records retained as `source_status_unresolved`\n- no reserve-report rows added\n- reserve-report count remains 90'
);
roadmap = roadmap.replace('412 evidence records\n412 evidence relation projections', '415 evidence records\n415 evidence relation projections');
roadmap = roadmap.replace(
`Phase 1 — Reserve-source cross-queue maintenance
1. Complete CI and merge the HUSD/EURT audit PR.
2. Add reviewed source-recovery context without creating reserve-report rows.
3. Keep both records in source_status_unresolved.
4. Synchronize evidence, known unknowns, queue notes, baselines, generated outputs, README, audits, and roadmap.
5. Run all six workflows and merge only after every check passes.`,
`Phase 1 — Complete reserve-source cross-queue maintenance
1. Complete final CI and merge the source-recovery context PR.
2. Keep HUSD and EURT in source_status_unresolved.
3. Keep reserve-report count at 90.
4. Confirm temporary synchronization code is removed.`
);
roadmap = roadmap.replace(
`1. Complete CI and merge the HUSD/EURT reserve-source audit PR.
2. Open the source-recovery context implementation PR.
3. Add no reserve-report rows unless product-specific primary evidence is recovered.
4. Complete the terminal queue checkpoint.
5. Resume controlled growth in batches of no more than five records.`,
`1. Complete final CI and merge the HUSD/EURT source-context implementation PR.
2. Complete the terminal queue checkpoint for BAC, DSD, ESD, and GYEN.
3. Keep terminal dates null without matching end-boundary evidence.
4. Resume controlled growth in batches of no more than five records.
5. Publish and verify after the first growth batch.`
);
fs.writeFileSync(roadmapPath, roadmap);

const v2Path = 'docs/migration/registry-v2-baseline.json';
const v2 = readJson(v2Path);
v2.baseline_id = 'sog_registry_v2_reserve_source_context_2026_06_25';
v2.captured_at = '2026-06-25';
v2.source_commit = 'reserve-source-context';
v2.minimum_counts.evidence = 415;
v2.minimum_counts.evidence_relations = 415;
writeJson(v2Path, v2);

const v3Path = 'docs/migration/registry-v3-baseline.json';
const v3 = readJson(v3Path);
v3.baseline_id = 'sog_registry_v3_reserve_source_context_2026_06_25';
v3.recorded_at = '2026-06-25';
v3.data_checkpoint_commit = 'reserve-source-context';
v3.expected_counts.evidence = 415;
writeJson(v3Path, v3);

execFileSync('node', ['scripts/generate-registry-stats.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/audit-registry-integrity.mjs'], { stdio: 'inherit' });
execFileSync('node', ['scripts/validate-registry-stats.mjs'], { stdio: 'inherit' });
