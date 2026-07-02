import fs from 'node:fs';

const paths = {
  home: 'src/styles/home-v3.css',
  register: 'src/styles/stablecoin-index.css',
  page: 'src/pages/stablecoins/index.astro',
  runtime: 'src/scripts/stablecoin-index.ts'
};

for (const path of Object.values(paths)) {
  if (!fs.existsSync(path)) throw new Error(`${path} is missing`);
}

const home = fs.readFileSync(paths.home, 'utf8');
const register = fs.readFileSync(paths.register, 'utf8');
const page = fs.readFileSync(paths.page, 'utf8');
const runtime = fs.readFileSync(paths.runtime, 'utf8');

const requiredHome = [
  '.home-masthead',
  '.home-register-strip',
  '.home-search__form',
  '.home-search__results',
  '.home-lead',
  '.home-recent',
  '.home-reference'
];
for (const selector of requiredHome) if (!home.includes(selector)) throw new Error(`missing Home selector: ${selector}`);

if (!/\.home-search__form\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)\s+auto/.test(home)) {
  throw new Error('Home search must remain one integrated field-and-button control');
}
if (/max-width:\s*520px[\s\S]*?\.home-search__form\s*\{[\s\S]*?grid-template-columns:\s*1fr\s*;/.test(home)) {
  throw new Error('Home mobile search may not split the button onto a second row');
}

const requiredRegister = [
  '.stablecoin-register-header',
  '.stablecoin-index-registry',
  '.stablecoin-index-toolbar',
  '.stablecoin-index-filter-grid',
  '.stablecoin-index-table',
  '.stablecoin-index-cards',
  '.stablecoin-index-pagination'
];
for (const selector of requiredRegister) if (!register.includes(selector)) throw new Error(`missing register selector: ${selector}`);

if (!/\.stablecoin-index-filter-grid\s*\{[\s\S]*?display:\s*grid/.test(register)) {
  throw new Error('Stablecoin filters must use a bounded grid');
}
if (/\.stablecoin-index-filter-grid\s*\{[\s\S]*?overflow-x:\s*auto/.test(register)) {
  throw new Error('Stablecoin filters may not use the rejected horizontal-scroll strip');
}
if (!/\.stablecoin-index-table th\s*\{[\s\S]*?font-size:\s*0\.75rem/.test(register)) {
  throw new Error('Stablecoin table headings must meet the 12px minimum');
}
if (!/@media \(max-width:\s*719px\)[\s\S]*?\.stablecoin-index-cards\s*\{[\s\S]*?display:\s*grid/.test(register)) {
  throw new Error('Register must provide deliberate mobile cards');
}
if (!/\.stablecoin-index-card\s*\{[\s\S]*?border-radius:\s*12px/.test(register)) {
  throw new Error('Mobile records must be visually bounded');
}

if (!page.includes('data-summary-label="All"')) throw new Error('Unselected filters must say All');
if (!page.includes('data-option-total={filter.options.length}')) throw new Error('Filter option totals must be rendered');
if (page.includes('data-summary-label="0 selected"')) throw new Error('The misleading 0 selected label is forbidden');
if (!runtime.includes("selectedCount > 0 ? `${selectedCount} selected` : 'All'")) throw new Error('Runtime must preserve All for unselected filters');
if (!runtime.includes("count.toggleAttribute('data-selected', selectedCount > 0)")) throw new Error('Runtime must expose selected filter state');
if (!runtime.includes("selectedCount > 0 ? String(selectedCount) : optionTotal")) throw new Error('Runtime must show option total instead of zero');

console.log(JSON.stringify({
  ok: true,
  home_search_integrated: true,
  filter_grid_bounded: true,
  zero_selected_removed: true,
  mobile_cards_required: true
}, null, 2));
