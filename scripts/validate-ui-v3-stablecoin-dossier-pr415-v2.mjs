import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };
const requiredFiles = [
  'src/pages/stablecoin/[slug].astro',
  'src/components/StablecoinDetailView.astro',
  'src/components/StablecoinDossierHeader.astro',
  'src/components/StablecoinReserveSection.astro',
  'src/components/StablecoinContextSections.astro',
  'src/components/StablecoinHistorySection.astro',
  'src/components/StablecoinOrganizationsControl.astro',
  'src/styles/stablecoin-dossier-pr415.css',
  'docs/quality/ui-v3-stablecoin-dossier-pr415.md',
  'config/ui-v3-stablecoin-dossier-pr415.json',
  'docs/migration/ui-v3-stablecoin-dossier-pr415-handoff.json'
];
for (const file of requiredFiles) check(fs.existsSync(path.join(root, file)), `missing file: ${file}`);
if (failures.length) { console.error(JSON.stringify({ ok:false, failures }, null, 2)); process.exit(1); }

const view = read('src/components/StablecoinDetailView.astro');
const context = read('src/components/StablecoinContextSections.astro');
const styles = read('src/styles/stablecoin-dossier-pr415.css');
const agents = read('AGENTS.md');
const roadmap = read('docs/roadmap.md');
const contract = json('config/ui-v3-stablecoin-dossier-pr415.json');
const handoff = json('docs/migration/ui-v3-stablecoin-dossier-pr415-handoff.json');
const gate = json('docs/migration/post-pr413-review-gate-pr414.json');
const approvals = json('docs/migration/ui-v3-visual-approval-register.json');

check(contract.implementation_pr === 415 && contract.source_review_pr === 414 && contract.phase === 'PR D', 'contract identity changed');
check(contract.authorized_route_family === '/stablecoin/[slug]/', 'authorized route family changed');
check(JSON.stringify(contract.priority) === JSON.stringify(gate.dossier_priority), 'priority differs from review gate');
check(contract.visual_review?.required_capture_count === 6, 'six captures are required');
check(contract.visual_review?.horizontal_page_overflow_allowed === false, 'horizontal overflow allowed');
check(contract.visual_review?.skipped_audit_result === 'hard_failure', 'visual skip is not a hard failure');
check(contract.visual_review?.automated_capture_counts_as_owner_approval === false, 'capture became owner approval');
check(contract.representative_visual_states?.length === 6, 'visual state matrix must contain six states');
for (const slug of ['usdc','ust','busd']) check(contract.representative_visual_states.filter((state) => state.route === `/stablecoin/${slug}/`).length === 2, `${slug}: desktop/mobile pair missing`);

check(handoff.status === 'implementation_complete' && handoff.implementation_pr === 415, 'handoff identity changed');
check(handoff.next_work_item?.decision === 'review_gate_required', 'handoff does not stop at review gate');
check(handoff.visual_artifacts?.required_capture_count === 6, 'handoff capture count changed');
check(handoff.visual_artifacts?.skipped_visual_audit_allowed === false, 'handoff permits skipped audit');
check(handoff.visual_artifacts?.horizontal_page_overflow_allowed === false, 'handoff permits overflow');
check(handoff.visual_artifacts?.automated_capture_is_owner_approval === false, 'handoff capture became approval');
check(handoff.owner_approval_state?.accepted_desktop === 0 && handoff.owner_approval_state?.accepted_mobile === 0 && handoff.owner_approval_state?.ui_completion === false, 'handoff records visual acceptance or completion');
check(handoff.changes?.routes === 0 && handoff.changes?.canonical_data === 0 && handoff.changes?.public_machine_readable_data === 0, 'handoff records route or canonical changes');
check(handoff.boundaries?.pr_e_pre_authorized === false, 'PR E was pre-authorized');

check(view.includes("import '../styles/stablecoin-dossier-pr415.css'"), 'PR415 stylesheet import missing');
check(view.includes('data-dossier-version="pr415"'), 'PR415 dossier marker missing');
check(view.includes('class="stablecoin-decision-grid"'), 'decision grid missing');
for (const marker of ['Current state','Redemption / exit','Backing / stabilization','Primary organization','Latest material event','Open questions']) check(view.includes(marker), `decision item missing: ${marker}`);
check(view.includes('class="stablecoin-technical-disclosure"'), 'technical disclosure missing');
check(view.includes('Technical identity and record coverage'), 'technical disclosure label missing');
for (const anchor of ['#assessment','#reserves-redemption','#organizations-control','#mechanism','#history','#deployments-legal-context','#known-unknowns','#evidence','#more']) check(view.includes(anchor), `nav anchor missing: ${anchor}`);
check(context.includes('id="known-unknowns"'), 'known unknowns id missing');
check(context.indexOf('id="known-unknowns"') < context.indexOf('id="evidence"'), 'known unknowns must precede evidence');
const positions = [view.indexOf('<StablecoinReserveSection'), view.indexOf('<StablecoinOrganizationsControl'), view.indexOf('id="mechanism"'), view.indexOf('<StablecoinHistorySection'), view.indexOf('<StablecoinContextSections')];
check(positions.every((position) => position >= 0), 'required section renderer missing');
check(positions.every((position, index) => index === 0 || position > positions[index - 1]), 'section hierarchy is out of order');
for (const marker of ['.stablecoin-dossier[data-dossier-version="pr415"]','.stablecoin-decision-grid','.stablecoin-technical-disclosure','.stablecoin-unknowns-section','@media (max-width: 719px)','@media (forced-colors: active)']) check(styles.includes(marker), `style marker missing: ${marker}`);
check(!styles.includes('linear-gradient(') && !styles.includes('radial-gradient('), 'decorative gradient introduced');
const publicCopy = `${view}\n${context}`.toLowerCase();
check(!publicCopy.includes('transparency score'), 'transparency score introduced');
check(!publicCopy.includes('risk score'), 'risk score introduced');
check(!publicCopy.includes('quality score'), 'quality score introduced');

check(approvals.current_counts?.accepted_desktop === 0 && approvals.current_counts?.accepted_mobile === 0, 'owner approval register changed');
check(approvals.completion_rule?.automated_capture_counts_as_approval === false, 'approval register treats capture as approval');
check(handoff.canonical_counts?.assets === 112 && handoff.canonical_counts?.evidence === 559 && handoff.canonical_counts?.evidence_relations === 559, 'canonical counts changed');
for (const marker of ['Current mandatory authority: PR #415 UI v3 Rebuild D — stablecoin dossier.','PR #414 Post-PR #413 Review Gate: complete','PR #415 UI v3 Rebuild D — stablecoin dossier: active; complete on merge','PR E events and organizations: blocked']) check(agents.includes(marker), `AGENTS missing: ${marker}`);
for (const marker of ['Status: canonical execution schedule — PR #415 active','PR #414 Post-PR #413 Review Gate: complete','PR #415 UI v3 Rebuild D — stablecoin dossier: active; complete on merge','After PR #415, stop at `REVIEW GATE`']) check(roadmap.includes(marker), `roadmap missing: ${marker}`);

try {
  git('rev-parse', '--verify', 'origin/main');
  const changedPages = git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/pages/').split('\n').filter(Boolean);
  check(changedPages.every((file) => file === 'src/pages/stablecoin/[slug].astro'), `unauthorized page changed: ${changedPages.join(', ')}`);
  check(git('diff', '--name-only', 'origin/main...HEAD', '--', 'public/', 'data/').trim() === '', 'canonical or public data changed');
  for (const file of ['config/site-architecture.mjs','docs/migration/ui-v3-visual-approval-register.json','docs/migration/current-canonical-checkpoint.json','docs/migration/current-stats-history-checkpoint.json','docs/migration/registry-release-integrity-baseline.json']) check(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: protected content changed`);
} catch (error) { failures.push(`origin/main comparison failed: ${error.message}`); }

const result = { schema_version:'1.0', generated_at:new Date().toISOString(), ok:failures.length === 0, implementation_pr:415, route_family:'/stablecoin/[slug]/', representative_visual_states:6, decision_summary_items:6, canonical_record_changes:0, route_changes:0, owner_approval_changes:0, failures };
fs.mkdirSync(path.join(root, 'data/generated'), { recursive:true });
fs.writeFileSync(path.join(root, 'data/generated/ui-v3-stablecoin-dossier-pr415-validation.json'), `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(result, null, 2)); process.exit(1); }
console.log(JSON.stringify(result, null, 2));
