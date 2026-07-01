import fs from 'node:fs';
import path from 'node:path';
import { aboutNavigation, footerNavigationGroups, primaryNavigation } from '../config/site-architecture.mjs';

const root = process.cwd();
const layoutPath = 'src/layouts/BaseLayout.astro';
const stylePath = 'src/styles/shell.css';
const outputPath = path.join(root, 'data/generated/global-shell-completion-validation.json');
const layout = fs.readFileSync(path.join(root, layoutPath), 'utf8');
const styles = fs.readFileSync(path.join(root, stylePath), 'utf8');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(layout.includes("import '../styles/shell.css'"), 'shell stylesheet is not imported');
check(layout.includes("import '../styles/editorial-ledger-v3.css'"), 'Editorial Ledger compatibility stylesheet is not imported');
check(layout.includes("import { aboutNavigation, footerNavigationGroups, primaryNavigation }"), 'v3 navigation is not generated from the architecture contract');
check(primaryNavigation.length === 4, 'four primary navigation links are required');
check(aboutNavigation.length === 7, 'seven About/project links are required');
check(footerNavigationGroups.length === 3, 'three footer navigation groups are required');
check(layout.includes('primaryNavigation.map'), 'primary navigation renderer is missing');
check(layout.includes('aboutNavigation.map'), 'About navigation renderer is missing');
check(layout.includes('footerNavigationGroups.map'), 'footer group renderer is missing');
for (const item of primaryNavigation) check(layout.includes(item.href) || layout.includes('item.href'), `primary route is not reachable: ${item.href}`);
for (const item of aboutNavigation) check(layout.includes(item.href) || layout.includes('item.href'), `About route is not reachable: ${item.href}`);
check(layout.includes('class="skip-link"') && layout.includes('href="#main-content"'), 'skip link is missing');
check(layout.includes('id="main-content"') && layout.includes('tabindex="-1"'), 'main focus target is missing');
check(layout.includes('class="site-primary-navigation"'), 'desktop Editorial Ledger navigation is missing');
check(layout.includes('class="site-search"') && layout.includes('action="/stablecoins/"'), 'truthful registry search is missing');
check(layout.includes('class="site-about-menu"') && layout.includes('<summary'), 'About disclosure is missing');
check(layout.includes('class="mobile-navigation"') && layout.includes('<summary'), 'compact disclosure navigation is missing');
check(layout.includes('aria-current={isCurrent'), 'route-family current-page state is missing');
for (const route of ['/stablecoin/', '/issuer/', '/event/', '/guides/']) check(layout.includes(route), `route family is missing: ${route}`);
check(layout.includes("event.key !== 'Escape'") && layout.includes('trigger.focus()'), 'Escape close and focus return are missing');
check(layout.includes("querySelectorAll('a')") && layout.includes('navigation.open = false'), 'destination selection must close compact navigation');
check(layout.includes('class="site-footer-group"'), 'footer group navigation is missing');
for (const route of ['/methodology/', '/updates/', '/about/', '/contact/', '/support/', '/version.json', '/data/manifest.json', '/llms.txt', '/ai.txt']) check(layout.includes(route), `footer destination is missing: ${route}`);
check(layout.includes('/brand/sog-mark-on-light.svg'), 'light-surface approved favicon is missing');
check(!layout.includes('class="grouped-navigation"'), 'superseded grouped navigation remains');
check(!layout.includes('class="utility-navigation"'), 'superseded utility navigation remains');
check(!layout.includes('class="wrap"') && !layout.includes('class="nav"'), 'legacy flat shell markup remains');

for (const marker of ['.skip-link', '.site-primary-navigation', '.site-search', '.site-about-menu', '.mobile-navigation', '.site-main', '.site-footer-inner', ':focus-visible', 'prefers-reduced-motion', 'forced-colors', 'overflow-wrap: anywhere', 'min-height: 44px']) check(styles.includes(marker), `shell style is missing: ${marker}`);
check(styles.includes('color-scheme: light'), 'shared shell must use the light Editorial Ledger color scheme');
check(styles.includes('--sog-paper: #f4f1e9'), 'Editorial Ledger paper token is missing');
check(styles.includes('--sog-accent: #7f242a'), 'Editorial Ledger accent token is missing');
check(styles.includes('--sog-shadow-panel: none'), 'panel shadows must be disabled');
check(!styles.includes('radial-gradient('), 'shared shell still contains decorative radial gradients');

const result = {
  schema_version: '2.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  visual_family: 'editorial_ledger_v3',
  totals: {
    primary_navigation_items: primaryNavigation.length,
    about_navigation_items: aboutNavigation.length,
    footer_navigation_groups: footerNavigationGroups.length,
    footer_navigation_items: footerNavigationGroups.reduce((sum, group) => sum + group.items.length, 0),
    route_changes: 0,
    canonical_record_changes: 0,
    failures: failures.length
  },
  failures
};
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
if (failures.length) { console.error(JSON.stringify(result, null, 2)); process.exit(1); }
console.log(JSON.stringify(result, null, 2));
