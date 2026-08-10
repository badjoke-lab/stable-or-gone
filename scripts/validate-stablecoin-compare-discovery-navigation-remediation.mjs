import fs from 'node:fs';
await import('./validate-stablecoin-compare-discovery-navigation-authority.mjs');

const read = (path) => fs.readFileSync(path, 'utf8');
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };
const page = read('src/pages/stablecoins/index.astro');
const script = read('src/scripts/stablecoin-index.ts');
const css = read('src/styles/public-ui.css');

const panel = page.indexOf('data-comparison-panel');
const registry = page.indexOf('class="stablecoin-index-registry"');
const dock = page.indexOf('data-comparison-dock');
const registerSearch = page.indexOf('data-index-search');
check(panel >= 0 && registry >= 0 && panel < registry, 'comparison panel must precede public register results');
check(registry >= 0 && dock > registry && registerSearch > dock, 'comparison dock must live at the start of the public register scroll scope');
for (const marker of ['data-comparison-add', 'data-comparison-add-button', 'Add / replace record', 'data-view-comparison', 'data-comparison-dock-count', 'data-comparison-dock-records']) check(page.includes(marker), `page missing ${marker}`);
for (const marker of ['renderComparisonNavigation', "classList.add('stats-v4-jump', 'masthead-row')", "classList.remove('stats-v4-jump', 'masthead-row')", 'selectedComparisons.size < 2', 'comparePanel.scrollIntoView', 'compareAddButton?.addEventListener', 'selectedComparisons.size >= 4', 'writeUrl']) check(script.includes(marker), `script missing ${marker}`);
check(script.includes("viewComparison.textContent = count < 2 ? 'Select one more' : 'View comparison'"), 'one-selection dock state');
check(script.includes('compareAdd.disabled = count >= 4'), 'four-selection add lock');
check(script.includes("'Remove a column before adding a replacement.'") || script.includes('Remove a column before adding a replacement'), 'replacement boundary copy');
check(css.includes('/* Stablecoin comparison matrix remediation */'), 'existing comparison stylesheet contract missing');
check(!page.includes('style='), 'inline style introduced on stablecoin index');
check(!page.includes('compare-navigation.css'), 'second comparison stylesheet introduced');

if (failures.length) {
  console.error('Stablecoin Compare discovery/navigation remediation validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  route: '/stablecoins/',
  panel_before_register: true,
  dock_scope: 'inside_public_register_before_search_toolbar',
  persistent_dock: true,
  in_panel_replace: true,
  selection_bounds: [2, 4],
  canonical_delta: 0,
  stylesheet_mode: 'existing_single_public_ui_stylesheet'
}, null, 2));
