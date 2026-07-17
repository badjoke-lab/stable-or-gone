import fs from 'node:fs';
import path from 'node:path';
import { footerNavigationGroups, globalNavigationGroups, utilityNavigation } from '../config/site-architecture.mjs';

const root = process.cwd();
const layoutPath = 'src/layouts/BaseLayout.astro';
const shellPath = 'src/styles/shell.css';
const typographyPath = 'src/styles/terminal-typography-contract.css';
const contractPath = 'config/ui-v3-global-shell-pr411.json';
const approvalPath = 'docs/migration/ui-v3-visual-approval-register.json';
const outputPath = path.join(root, 'data/generated/global-shell-completion-validation.json');
const layout = fs.readFileSync(path.join(root, layoutPath), 'utf8');
const shell = fs.readFileSync(path.join(root, shellPath), 'utf8');
const typography = fs.readFileSync(path.join(root, typographyPath), 'utf8');
const contract = JSON.parse(fs.readFileSync(path.join(root, contractPath), 'utf8'));
const approvals = JSON.parse(fs.readFileSync(path.join(root, approvalPath), 'utf8'));
const styles = `${shell}\n${typography}`;
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(layout.includes("import '../styles/shell.css'"), 'shell stylesheet is not imported');
check(layout.includes("import { footerNavigationGroups, globalNavigationGroups, utilityNavigation }"), 'navigation is not generated from the architecture contract');
check(globalNavigationGroups.length === 3, 'three navigation groups are required');
check(JSON.stringify(globalNavigationGroups.map((group) => group.id)) === JSON.stringify(['registry','learn','project']), 'navigation group order must be Registry, Learn, Project');
check(globalNavigationGroups[0].items.length === 7, 'Registry navigation must contain seven destinations');
check(globalNavigationGroups[1].items.length === 3, 'Learn navigation must contain three destinations');
check(globalNavigationGroups[2].items.length === 4, 'Project navigation must contain four destinations');
check(utilityNavigation.length === 2, 'Corrections and Support utilities are required');
check(footerNavigationGroups.length === 3, 'three footer navigation groups are required');
check(layout.includes('globalNavigationGroups.map'), 'grouped navigation renderer is missing');
check(layout.includes('utilityNavigation.map'), 'utility navigation renderer is missing');
check(layout.includes('footerNavigationGroups.map'), 'footer group renderer is missing');
check(layout.includes('data-shell="evidence-registry-pr411"'), 'evidence-registry shell marker is missing');
check(layout.includes('class="grouped-navigation"'), 'desktop grouped navigation is missing');
check(layout.includes('class="utility-navigation"'), 'desktop utility navigation is missing');
check(layout.includes('class="site-search"') && layout.includes('action="/stablecoins/"') && layout.includes('name="q"'), 'truthful registry search is missing');
check(layout.includes('class="mobile-navigation"') && layout.includes('<summary'), 'compact disclosure navigation is missing');
check(layout.includes('class="mobile-site-search"'), 'mobile registry search is missing');
check(layout.includes('aria-current={isCurrent'), 'route-family current-page state is missing');
check(layout.includes('class="skip-link"') && layout.includes('href="#main-content"'), 'skip link is missing');
check(layout.includes('id="main-content"') && layout.includes('tabindex="-1"'), 'main focus target is missing');
check(layout.includes("event.key !== 'Escape'") && layout.includes('trigger.focus()'), 'Escape close and focus return are missing');
check(layout.includes('navigation.contains(event.target)') && layout.includes('navigation.open = false'), 'outside click and destination selection must close compact navigation');
check(layout.includes('class="site-footer-navigation"'), 'structured footer navigation is missing');
for (const route of ['/methodology/', '/updates/', '/maintenance/', '/about/', '/contact/', '/support/', '/version.json', '/data/manifest.json', '/llms.txt', '/ai.txt']) check(layout.includes(route) || layout.includes('item.href'), `footer destination is missing: ${route}`);
check(layout.includes('/brand/sog-mark-on-light.svg'), 'favicon is missing');
check(!layout.includes('class="site-primary-navigation"'), 'superseded flat primary navigation remains');
check(!layout.includes('class="site-about-menu"'), 'superseded About-only disclosure remains');

for (const marker of ['.skip-link', '.site-header', '.site-search-control', '.grouped-navigation', '.utility-navigation', '.mobile-navigation', '.site-main', '.site-footer-navigation', ':focus-visible', 'prefers-reduced-motion', 'forced-colors', 'overflow-wrap: anywhere', 'min-height: 44px']) check(styles.includes(marker), `shell style is missing: ${marker}`);
check(styles.includes('color-scheme: dark'), 'evidence-registry shell must use the dark color scheme');
check(styles.includes('--sog-background: #071018'), 'evidence-registry background token is missing');
check(styles.includes('--sog-link: #7ad9ff'), 'evidence-registry link token is missing');
check(styles.includes('--sog-surface-selected: #16374a'), 'selected surface token is missing');
check(styles.includes('radial-gradient('), 'registry background depth is missing');
check(styles.includes('font-size: 1rem'), '16px body foundation is missing');
check(styles.includes('font-size: max(0.875rem, 14px)') || styles.includes('font-size: 0.875rem !important'), '14px dense/control foundation is missing');
check(styles.includes('--sog-font-interface: ui-sans-serif'), 'system sans interface stack is missing');
check(styles.includes('--sog-font-data: ui-monospace'), 'monospace data stack is missing');

check(contract.implementation_pr === 411 && contract.shell_marker === 'evidence-registry-pr411', 'PR #411 shell contract identity changed');
check(contract.typography?.body_min_px === 16, 'contract body minimum changed');
check(contract.typography?.table_min_px === 14, 'contract table minimum changed');
check(contract.typography?.touch_target_min_px === 44, 'contract touch-target minimum changed');
check(contract.visual_artifacts?.skipped_audit_result === 'hard_failure', 'visual audit may be skipped');
check(contract.visual_artifacts?.automated_rendering_is_owner_approval === false, 'automated rendering became approval');
check(contract.boundaries?.routes_changed === false && contract.boundaries?.canonical_data_changed === false, 'shell contract allows route or canonical change');
check(approvals.current_counts?.accepted_desktop === 0 && approvals.current_counts?.accepted_mobile === 0, 'owner approval register changed');
check(approvals.completion_rule?.automated_capture_counts_as_approval === false, 'automated capture became owner approval');

const result = {
  schema_version: '4.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  visual_family: 'modern_evidence_registry',
  implementation_pr: 411,
  totals: {
    navigation_groups: globalNavigationGroups.length,
    grouped_navigation_items: globalNavigationGroups.reduce((sum, group) => sum + group.items.length, 0),
    utility_navigation_items: utilityNavigation.length,
    footer_navigation_groups: footerNavigationGroups.length,
    footer_navigation_items: footerNavigationGroups.reduce((sum, group) => sum + group.items.length, 0),
    route_changes: 0,
    canonical_record_changes: 0,
    owner_approval_changes: 0,
    failures: failures.length
  },
  failures
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(result, null, 2)); process.exit(1); }
console.log(JSON.stringify(result, null, 2));
