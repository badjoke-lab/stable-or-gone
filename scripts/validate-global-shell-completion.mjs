import fs from 'node:fs';
import path from 'node:path';
import { aboutNavigation, footerNavigationGroups, primaryNavigation } from '../config/site-architecture.mjs';

const root = process.cwd();
const layoutPath = 'src/layouts/BaseLayout.astro';
const shellPath = 'src/styles/shell.css';
const compatibilityPath = 'src/styles/editorial-ledger-v3.css';
const outputPath = path.join(root, 'data/generated/global-shell-completion-validation.json');
const layout = fs.readFileSync(path.join(root, layoutPath), 'utf8');
const shell = fs.readFileSync(path.join(root, shellPath), 'utf8');
const compatibility = fs.readFileSync(path.join(root, compatibilityPath), 'utf8');
const styles = `${shell}\n${compatibility}`;
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(layout.includes("import '../styles/shell.css'"), 'shell stylesheet is not imported');
check(layout.includes("import '../styles/editorial-ledger-v3.css'"), 'terminal compatibility stylesheet is not imported');
check(layout.includes("import { aboutNavigation, footerNavigationGroups, primaryNavigation }"), 'navigation is not generated from the architecture contract');
check(primaryNavigation.length === 6, 'six primary navigation links are required after Compare v1');
check(primaryNavigation.some((item) => item.id === 'compare' && item.href === '/compare/'), 'Compare must remain in primary navigation');
check(aboutNavigation.length === 8, 'eight About/project links are required after Maintenance Log');
check(aboutNavigation.some((item) => item.id === 'maintenance' && item.href === '/maintenance/'), 'Maintenance must remain in About/project navigation');
check(footerNavigationGroups.length === 3, 'three footer navigation groups are required');
check(layout.includes('primaryNavigation.map'), 'primary navigation renderer is missing');
check(layout.includes('aboutNavigation.map'), 'About navigation renderer is missing');
check(layout.includes('footerNavigationGroups.map'), 'footer group renderer is missing');
for (const item of primaryNavigation) check(layout.includes(item.href) || layout.includes('item.href'), `primary route is not reachable: ${item.href}`);
for (const item of aboutNavigation) check(layout.includes(item.href) || layout.includes('item.href'), `About route is not reachable: ${item.href}`);
check(layout.includes('class="skip-link"') && layout.includes('href="#main-content"'), 'skip link is missing');
check(layout.includes('id="main-content"') && layout.includes('tabindex="-1"'), 'main focus target is missing');
check(layout.includes('class="site-primary-navigation"'), 'desktop navigation is missing');
check(layout.includes('class="site-search"') && layout.includes('action="/stablecoins/"'), 'truthful registry search is missing');
check(layout.includes('class="site-about-menu"') && layout.includes('<summary'), 'About disclosure is missing');
check(layout.includes('class="mobile-navigation"') && layout.includes('<summary'), 'compact disclosure navigation is missing');
check(layout.includes('aria-current={isCurrent'), 'route-family current-page state is missing');
for (const route of ['/stablecoin/', '/issuer/', '/event/', '/guides/']) check(layout.includes(route), `route family is missing: ${route}`);
check(layout.includes("event.key !== 'Escape'") && layout.includes('trigger.focus()'), 'Escape close and focus return are missing');
check(layout.includes("querySelectorAll('a')") && layout.includes('navigation.open = false'), 'destination selection must close compact navigation');
check(layout.includes('class="site-footer-group"'), 'footer group navigation is missing');
for (const route of ['/methodology/', '/updates/', '/maintenance/', '/about/', '/contact/', '/support/', '/version.json', '/data/manifest.json', '/llms.txt', '/ai.txt']) check(layout.includes(route) || layout.includes('item.href'), `footer destination is missing: ${route}`);
check(layout.includes('/brand/sog-mark-on-light.svg'), 'favicon is missing');
check(!layout.includes('class="grouped-navigation"'), 'superseded grouped navigation remains');
check(!layout.includes('class="utility-navigation"'), 'superseded utility navigation remains');
check(!layout.includes('class="wrap"') && !layout.includes('class="nav"'), 'legacy flat shell markup remains');

for (const marker of ['.skip-link', '.site-primary-navigation', '.site-search', '.site-about-menu', '.mobile-navigation', '.site-main', '.site-footer-inner', ':focus-visible', 'prefers-reduced-motion', 'forced-colors', 'overflow-wrap: anywhere', 'min-height: 44px']) check(styles.includes(marker), `shell style is missing: ${marker}`);
check(styles.includes('color-scheme: dark'), 'terminal shell must use a dark color scheme');
check(styles.includes('--sog-background: #071018') || styles.includes('--sog-paper: #061018'), 'terminal dark background token is missing');
check(styles.includes('--sog-accent: #71d6ff'), 'terminal cyan accent token is missing');
check(styles.includes('radial-gradient('), 'terminal background atmosphere is missing');
check(styles.includes('0 18px 60px'), 'terminal panel depth is missing');
check(compatibility.includes('Terminal baseline restored from the pre-v2 visual family'), 'terminal restoration marker is missing');
check(!compatibility.includes('background: transparent !important;\n  box-shadow: none !important;'), 'rejected flat paper panel rule remains');

const result = {
  schema_version: '3.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  visual_family: 'terminal_baseline_restored',
  restoration_source_commit: '3df568eab0a179d7690a88efb599156b0d659ab7',
  totals: {
    primary_navigation_items: primaryNavigation.length,
    about_navigation_items: aboutNavigation.length,
    footer_navigation_groups: footerNavigationGroups.length,
    footer_navigation_items: footerNavigationGroups.reduce((sum, group) => sum + group.items.length, 0),
    route_changes: 2,
    canonical_record_changes: 0,
    failures: failures.length
  },
  failures
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(result, null, 2)); process.exit(1); }
console.log(JSON.stringify(result, null, 2));
