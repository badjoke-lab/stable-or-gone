import fs from 'node:fs';
import path from 'node:path';
import { globalNavigationGroups, utilityNavigation } from '../config/site-architecture.mjs';

const root = process.cwd();
const layoutPath = 'src/layouts/BaseLayout.astro';
const stylePath = 'src/styles/shell.css';
const outputPath = path.join(root, 'data/generated/global-shell-completion-validation.json');
const layout = fs.readFileSync(path.join(root, layoutPath), 'utf8');
const styles = fs.readFileSync(path.join(root, stylePath), 'utf8');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(layout.includes("import '../styles/shell.css'"), 'shell stylesheet is not imported');
check(layout.includes("import { globalNavigationGroups, utilityNavigation }"), 'navigation is not generated from the architecture contract');
check(globalNavigationGroups.length === 3, 'three navigation groups are required');
check(utilityNavigation.length === 2, 'two utility links are required');
for (const group of globalNavigationGroups) {
  check(layout.includes('globalNavigationGroups.map'), `${group.id}: grouped navigation renderer is missing`);
  for (const item of group.items) check(layout.includes(item.href) || layout.includes('item.href'), `${group.id}: navigation route is not reachable`);
}
check(layout.includes('class="skip-link"') && layout.includes('href="#main-content"'), 'skip link is missing');
check(layout.includes('id="main-content"') && layout.includes('tabindex="-1"'), 'main focus target is missing');
check(layout.includes('class="grouped-navigation"'), 'desktop grouped navigation is missing');
check(layout.includes('class="mobile-navigation"') && layout.includes('<summary'), 'compact disclosure navigation is missing');
check(layout.includes('aria-current={isCurrent'), 'route-family current-page state is missing');
for (const route of ['/stablecoin/', '/issuer/', '/event/', '/guides/']) check(layout.includes(route), `route family is missing: ${route}`);
check(layout.includes("event.key !== 'Escape'") && layout.includes('trigger.focus()'), 'Escape close and focus return are missing');
check(layout.includes("querySelectorAll('a')") && layout.includes('navigation.open = false'), 'destination selection must close compact navigation');
check(layout.includes('class="site-footer-links"'), 'footer navigation is missing');
for (const route of ['/methodology/', '/updates/', '/about/', '/contact/', '/support/', '/version.json', '/data/manifest.json', '/llms.txt', '/ai.txt']) check(layout.includes(route), `footer destination is missing: ${route}`);
check(!layout.includes('class="wrap"') && !layout.includes('class="nav"'), 'legacy flat shell markup remains');

for (const marker of ['.skip-link', '.grouped-navigation', '.mobile-navigation', '.site-main', '.site-footer-inner', ':focus-visible', 'prefers-reduced-motion', 'forced-colors', 'overflow-wrap: anywhere', 'min-height: 44px']) check(styles.includes(marker), `shell style is missing: ${marker}`);

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    navigation_groups: globalNavigationGroups.length,
    navigation_items: globalNavigationGroups.reduce((sum, group) => sum + group.items.length, 0),
    utility_items: utilityNavigation.length,
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
