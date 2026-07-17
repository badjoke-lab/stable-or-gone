import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(read(file));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const files = {
  page: 'src/pages/stablecoin/[slug].astro',
  view: 'src/components/StablecoinDetailView.astro',
  header: 'src/components/StablecoinDossierHeader.astro',
  reserve: 'src/components/StablecoinReserveSection.astro',
  context: 'src/components/StablecoinContextSections.astro',
  history: 'src/components/StablecoinHistorySection.astro',
  organizations: 'src/components/StablecoinOrganizationsControl.astro',
  styles: 'src/styles/stablecoin-dossier-pr415.css',
  spec: 'docs/quality/ui-v3-stablecoin-dossier-pr415.md',
  contract: 'config/ui-v3-stablecoin-dossier-pr415.json',
  handoff: 'docs/migration/ui-v3-stablecoin-dossier-pr415-handoff.json'
};

for (const file of Object.values(files)) check(fs.existsSync(path.join(root, file)), `missing file: ${file}`);
if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}

const source = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, read(file)]));
const contract = readJson(files.contract);
const handoff = readJson(files.handoff);
const gate = readJson('docs/migration/post-pr413-review-gate-pr414.json');
const approvals = readJson('docs/migration/ui-v3-visual-approval-register.json');

check(contract.implementation_pr === 415 && contract.source_review_pr === 414 && contract.phase === 'PR D', 'PR #415 contract identity changed');
check(contract.authorized_route_family === '/stablecoin/[slug]/', 'authorized dossier route family changed');
check(JSON.stringify(contract.priority) === JSON.stringify(gate.dossier_priority), 'contract priority diverges from review gate');
check(contract.visual_review?.required_capture_count === 6, 'required capture count must be six');
check(contract.visual_review?.horizontal_page_overflow_allowed === false, 'horizontal overflow is allowed');
check(contract.visual_review?.skipped_audit_result === 'hard_failure', 'skipped visual audit no longer hard-fails');
check(contract.visual_review?.automated_capture_counts_as_owner_approval === false, 'automated capture became owner approval');
check(contract.representative_visual_states?.length === 6, 'representative visual matrix must contain six states');
for (const slug of ['usdc', 'ust', 'busd']) check(contract.representative_visual_states.filter((state) => state.route === `/stablecoin/${slug}/`).length === 2, `${slug}: desktop/mobile visual pair missing`);

check(handoff.status === 'implementation_complete' && handoff.implementation_pr === 415, 'PR #415 handoff status changed');
check(handoff.source_review_pr === 414 && handoff.phase === 'PR D', 'PR #415 handoff authority changed');
check(handoff.authorized_route_family === '/stablecoin/[slug]/', 'handoff route family changed');
check(handoff.visual_artifacts?.required_capture_count === 6, 'handoff capture count changed');
check(handoff.visual_artifacts?.skipped_visual_audit_allowed === false, 'handoff visual audit became skippable');
check(handoff.visual_artifacts?.horizontal_page_overflow_allowed === false, 'handoff permits horizontal overflow');
check(handoff.visual_artifacts?.automated_capture_is_owner_approval === false, 'handoff capture became approval');
check(handoff.owner_approval_state?.changed === false, 'handoff changed owner approval');
check(handoff.owner_approval_state?.accepted_desktop === 0 && handoff.owner_approval_state?.accepted_mobile === 0, 'handoff records owner acceptance');
check(handoff.owner_approval_state?.ui_completion === false, 'handoff declares UI completion');
check(handoff.changes?.routes === 0 && handoff.changes?.canonical_data === 0 && handoff.changes?.public_machine_readable_data === 0, 'handoff records route or canonical changes');
check(handoff.next_work_item?.decision === 'review_gate_required', 'handoff does not stop at review gate');
check(handoff.boundaries?.pr_e_pre_authorized === false, 'handoff pre-authorizes PR E');

check(source.page.includes('<StablecoinDetailView coin={coin} />'), 'stablecoin route no longer uses the dossier view');
check(source.view.includes("import '../styles/stablecoin-dossier-pr415.css'"), 'PR #415 stylesheet import missing');
check(source.view.includes('data-dossier-version="pr415"'), 'PR #415 dossier marker missing');
check(source.view.includes('class="stablecoin-decision-grid"'), 'decision-useful summary grid missing');
for (const marker of ['Current state', 'Redemption / exit', 'Backing / stabilization', 'Primary organization', 'Latest material event', 'Open questions']) check(source.view.includes(marker), `decision summary missing: ${marker}`);
check(source.view.includes('class="stablecoin-technical-disclosure"'), 'progressive technical disclosure missing');
check(source.view.includes('Technical identity and record coverage'), 'technical disclosure label missing');
check(source.context.includes('id="known-unknowns"'), 'known-unknown anchor missing');
check(source.context.indexOf('id="known-unknowns"') < source.context.indexOf('id="evidence"'), 'known unknowns must precede evidence');

const reservePosition = source.view.indexOf('<StablecoinReserveSection');
const organizationPosition = source.view.indexOf('<StablecoinOrganizationsControl');
const mechanismPosition = source.view.indexOf('id="mechanism"');
const historyPosition = source.view.indexOf('<StablecoinHistorySection');
const contextPosition = source.view.indexOf('<StablecoinContextSections');
check([reservePosition, organizationPosition, mechanismPosition, historyPosition, contextPosition].every((position) => position >= 0), 'required dossier section rendering missing');
check(reservePosition < organizationPosition && organizationPosition < mechanismPosition && mechanismPosition < historyPosition && historyPosition < contextPosition, 'dossier section order violates PR #415 hierarchy');

for (const nav of ['#assessment', '#reserves-redemption', '#organizations-control', '#mechanism', '#history', '#deployments-legal-context', '#known-unknowns', '#evidence', '#more']) check(source.view.includes(nav), `dossier navigation missing: ${nav}`);
for (const marker of ['.stablecoin-dossier[data-dossier-version="pr415"]', '.stablecoin-decision-grid', '.stablecoin-technical-disclosure', '.stablecoin-unknowns-section', '@media (max-width: 719px)', '@media (forced-colors: active)']) check(source.styles.includes(marker), `PR #415 style marker missing: ${marker}`);
check(!source.styles.includes('radial-gradient(') && !source.styles.includes('linear-gradient('), 'PR #415 introduces decorative gradient styling');
check(!`${source.view}\n${source.header}\n${source.reserve}\n${source.context}\n${source.history}`.toLowerCase().includes('safety score'), 'dossier exposes a safety score');
check(!`${source.view}\n${source.header}\n${source.reserve}\n${source.context}\n${source.history}`.toLowerCase().includes('transparency score'), 'dossier exposes a transparency score');

check(approvals.current_counts?.accepted_desktop === 0 && approvals.current_counts?.accepted_mobile === 0, 'owner approval register changed');
check(approvals.completion_rule?.automated_capture_counts_as_approval === false, 'approval register treats capture as approval');
check(handoff.canonical_counts?.assets === 112 && handoff.canonical_counts?.evidence === 559 && handoff.canonical_counts?.evidence_relations === 559, 'canonical counts changed');

for (const marker of [
  'Current mandatory authority: PR #415 UI v3 Rebuild D — stablecoin dossier.',
  'PR #414 Post-PR #413 Review Gate: complete',
  'PR #415 UI v3 Rebuild D — stablecoin dossier: active; complete on merge',
  'PR E events and organizations: blocked',
  'REVIEW GATE: mandatory after PR #415'
]) check(read('AGENTS.md').includes(marker), `AGENTS missing ${marker}`);

for (const marker of [
  'Status: canonical execution schedule — PR #415 active',
  'PR #414 Post-PR #413 Review Gate: complete',
  'PR #415 UI v3 Rebuild D — stablecoin dossier: active; complete on merge',
  'After PR #415, stop at `REVIEW GATE`'
]) check(read('docs/roadmap.md').includes(marker), `roadmap missing ${marker}`);

try {
  git('rev-parse', '--verify', 'origin/main');
  const changedPages = git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/pages/').split('\n').filter(Boolean);
  check(changedPages.length === 0 || changedPages.every((file) => file === 'src/pages/stablecoin/[slug].astro'), `unauthorized page changed: ${changedPages.join(', ')}`);
  check(git('diff', '--name-only', 'origin/main...HEAD', '--', 'public/', 'data/').trim() === '', 'PR #415 contains canonical or public data changes');
  for (const file of [
    'config/site-architecture.mjs',
    'docs/migration/ui-v3-visual-approval-register.json',
    'docs/migration/current-canonical-checkpoint.json',
    'docs/migration/current-stats-history-checkpoint.json',
    'docs/migration/registry-release-integrity-baseline.json'
  ]) check(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: protected content changed`);
} catch (error) {
  failures.push(`origin/main comparison failed: ${error.message}`);
}

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  implementation_pr: 415,
  route_family: '/stablecoin/[slug]/',
  representative_visual_states: 6,
  decision_summary_items: 6,
  canonical_record_changes: 0,
  route_changes: 0,
  owner_approval_changes: 0,
  failures
};
fs.mkdirSync(path.join(root, 'data/generated'), { recursive: true });
fs.writeFileSync(path.join(root, 'data/generated/ui-v3-stablecoin-dossier-pr415-validation.json'), `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(result, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(result, null, 2));
