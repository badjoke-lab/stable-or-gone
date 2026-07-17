import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const json = (file) => JSON.parse(read(file));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const files = {
  eventRegister: 'src/components/EventEditorialRegister.astro',
  eventRow: 'src/components/EventIndexRow.astro',
  eventCard: 'src/components/EventIndexCard.astro',
  eventRecord: 'src/components/EventEditorialRecordV3.astro',
  organizationRegister: 'src/components/OrganizationEditorialRegister.astro',
  organizationRow: 'src/components/OrganizationIndexRow.astro',
  organizationCard: 'src/components/OrganizationIndexCard.astro',
  organizationRecord: 'src/components/OrganizationEditorialRecord.astro',
  eventScript: 'src/scripts/event-index.ts',
  organizationScript: 'src/scripts/organization-index.ts',
  styles: 'src/styles/events-organizations-pr417.css',
  contract: 'config/ui-v3-events-organizations-pr417.json',
  handoff: 'docs/migration/ui-v3-events-organizations-pr417-handoff.json'
};
for (const file of Object.values(files)) check(fs.existsSync(path.join(root, file)), `missing file: ${file}`);
if (failures.length) { console.error(JSON.stringify({ ok:false, failures }, null, 2)); process.exit(1); }
const source = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, read(file)]));
const contract = json(files.contract);
const handoff = json(files.handoff);
const gate = json('docs/migration/post-pr415-review-gate-pr416.json');
const approvals = json('docs/migration/ui-v3-visual-approval-register.json');
const design = json('config/ui-v3-rebuild-design-contract-pr409.json');

check(contract.implementation_pr === 417 && contract.source_review_pr === 416 && contract.phase === 'PR E', 'contract identity changed');
check(JSON.stringify(contract.authorized_route_families) === JSON.stringify(['/events/','/event/[id]/','/issuers/','/issuer/[slug]/']), 'authorized routes changed');
check(JSON.stringify(contract.event_priority) === JSON.stringify(design.template_priority.events), 'event priority changed');
check(JSON.stringify(contract.organization_priority) === JSON.stringify(design.template_priority.organizations), 'organization priority changed');
check(contract.registers?.events?.page_size === 20 && contract.registers?.events?.initial_ssr_max === 20, 'event bound changed');
check(contract.registers?.organizations?.page_size === 20 && contract.registers?.organizations?.initial_ssr_max === 20, 'organization bound changed');
check(contract.visual_review?.required_capture_count === 8 && contract.visual_review?.bounded_primary_indexes === true, 'visual matrix or bounded-index gate changed');
check(contract.visual_review?.horizontal_page_overflow_allowed === false && contract.visual_review?.skipped_audit_result === 'hard_failure' && contract.visual_review?.automated_capture_counts_as_owner_approval === false, 'visual failure gates changed');
check(contract.representative_visual_states?.length === 8, 'visual state matrix must contain eight states');

check(handoff.status === 'implementation_complete' && handoff.implementation_pr === 417 && handoff.source_review_pr === 416, 'handoff identity changed');
check(handoff.register_bounds?.events_initial_ssr_max === 20 && handoff.register_bounds?.organizations_initial_ssr_max === 20, 'handoff bounds changed');
check(handoff.visual_artifacts?.required_capture_count === 8 && handoff.visual_artifacts?.skipped_visual_audit_allowed === false && handoff.visual_artifacts?.horizontal_page_overflow_allowed === false, 'handoff visual gates changed');
check(handoff.owner_approval_state?.accepted_desktop === 0 && handoff.owner_approval_state?.accepted_mobile === 0 && handoff.owner_approval_state?.ui_completion === false, 'handoff records owner approval or completion');
check(handoff.changes?.routes === 0 && handoff.changes?.canonical_data === 0 && handoff.changes?.public_machine_readable_data === 0 && handoff.changes?.metadata_contract === 0, 'handoff records protected changes');
check(handoff.next_work_item?.decision === 'review_gate_required' && handoff.boundaries?.pr_f_pre_authorized === false, 'handoff does not stop at review gate');
check(handoff.canonical_counts?.assets === 112 && handoff.canonical_counts?.organizations === 107 && handoff.canonical_counts?.events === 187 && handoff.canonical_counts?.evidence === 559, 'canonical counts changed');

check(source.eventRegister.includes('const PAGE_SIZE = 20'), 'event page size missing');
check(source.organizationRegister.includes('const PAGE_SIZE = 20'), 'organization page size missing');
check(source.eventRegister.includes('data-register-version="pr417-events"'), 'event register marker missing');
check(source.organizationRegister.includes('data-register-version="pr417-organizations"'), 'organization register marker missing');
check(source.eventRecord.includes('data-record-version="pr417-event"'), 'event detail marker missing');
check(source.organizationRecord.includes('data-record-version="pr417-organization"'), 'organization detail marker missing');
check(source.eventRow.includes('initiallyVisible = true') && source.eventRow.includes('hidden={initiallyVisible ? undefined : true}'), 'event initial rows are not bounded');
check(source.eventCard.includes('initiallyVisible = true') && source.eventCard.includes('hidden={initiallyVisible ? undefined : true}'), 'event initial cards are not bounded');
check(source.organizationRow.includes('initiallyVisible = true') && source.organizationRow.includes('hidden={initiallyVisible ? undefined : true}'), 'organization initial rows are not bounded');
check(source.organizationCard.includes('initiallyVisible = true') && source.organizationCard.includes('hidden={initiallyVisible ? undefined : true}'), 'organization initial cards are not bounded');
for (const marker of ['data-event-search','data-event-sort','data-event-clear-all','data-event-active-filters','data-event-result-count','data-event-pagination','event-impact-label']) check(`${source.eventRegister}\n${source.eventRow}\n${source.eventCard}`.includes(marker), `event surface missing: ${marker}`);
for (const marker of ['data-organization-search','data-organization-sort','data-organization-clear-all','data-organization-active-filters','data-organization-result-count','data-organization-pagination','organization-asset-count']) check(`${source.organizationRegister}\n${source.organizationRow}\n${source.organizationCard}`.includes(marker), `organization surface missing: ${marker}`);
for (const marker of ['URLSearchParams','pushState','replaceState','popstate','currentPage','pageSize','noResults.hidden']) check(source.eventScript.includes(marker), `event URL/bound marker missing: ${marker}`);
for (const marker of ['URLSearchParams','pushState','replaceState','popstate','currentPage','pageSize','noResults.hidden']) check(source.organizationScript.includes(marker), `organization URL/bound marker missing: ${marker}`);
for (const marker of ['.event-index-page[data-register-version="pr417-events"]','.organization-index-page[data-register-version="pr417-organizations"]','.event-detail-page[data-record-version="pr417-event"]','.organization-detail-page[data-record-version="pr417-organization"]','@media (max-width: 719px)','@media (forced-colors: active)']) check(source.styles.includes(marker), `style marker missing: ${marker}`);
check(!source.styles.includes('linear-gradient(') && !source.styles.includes('radial-gradient('), 'decorative gradient introduced');
const publicCopy = `${source.eventRegister}\n${source.eventRecord}\n${source.organizationRegister}\n${source.organizationRecord}`.toLowerCase();
for (const prohibited of ['incident score','organization score','safety score','transparency score','risk score','quality score']) check(!publicCopy.includes(prohibited), `prohibited score introduced: ${prohibited}`);

check(approvals.current_counts?.accepted_desktop === 0 && approvals.current_counts?.accepted_mobile === 0, 'owner approval register changed');
check(approvals.completion_rule?.automated_capture_counts_as_approval === false, 'automated capture counts as owner approval');
for (const marker of ['Current mandatory authority: PR #417 UI v3 Rebuild E — events and organizations.','PR #416 Post-PR #415 Review Gate: complete','PR #417 UI v3 Rebuild E — events and organizations: active; complete on merge','PR F guides and secondary pages: blocked']) check(read('AGENTS.md').includes(marker), `AGENTS missing ${marker}`);
for (const marker of ['Status: canonical execution schedule — PR #417 active','PR #416 Post-PR #415 Review Gate: complete','PR #417 UI v3 Rebuild E — events and organizations: active; complete on merge','After PR #417, stop at `REVIEW GATE`']) check(read('docs/roadmap.md').includes(marker), `roadmap missing ${marker}`);

try {
  git('rev-parse', '--verify', 'origin/main');
  const pages = git('diff', '--name-only', 'origin/main...HEAD', '--', 'src/pages/').split('\n').filter(Boolean);
  const allowedPages = new Set(['src/pages/events/index.astro','src/pages/event/[id].astro','src/pages/issuers/index.astro','src/pages/issuer/[slug].astro']);
  check(pages.every((file) => allowedPages.has(file)), `unauthorized page changed: ${pages.join(', ')}`);
  check(git('diff', '--name-only', 'origin/main...HEAD', '--', 'public/', 'data/').trim() === '', 'canonical or public data changed');
  for (const file of ['config/site-architecture.mjs','docs/migration/ui-v3-visual-approval-register.json','docs/migration/current-canonical-checkpoint.json','docs/migration/current-stats-history-checkpoint.json','docs/migration/registry-release-integrity-baseline.json']) check(git('hash-object', file) === git('rev-parse', `origin/main:${file}`), `${file}: protected content changed`);
} catch (error) { failures.push(`origin/main comparison failed: ${error.message}`); }

const result = { schema_version:'1.0', generated_at:new Date().toISOString(), ok:failures.length === 0, implementation_pr:417, event_page_size:20, organization_page_size:20, representative_visual_states:8, canonical_record_changes:0, route_changes:0, owner_approval_changes:0, failures };
fs.mkdirSync(path.join(root, 'data/generated'), { recursive:true });
fs.writeFileSync(path.join(root, 'data/generated/ui-v3-events-organizations-pr417-validation.json'), `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(result, null, 2)); process.exit(1); }
console.log(JSON.stringify(result, null, 2));
