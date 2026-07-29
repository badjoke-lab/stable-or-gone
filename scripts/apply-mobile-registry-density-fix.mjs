#!/usr/bin/env node
import fs from 'node:fs';

const cssPath = 'src/styles/public-ui.css';
const workflowPath = '.github/workflows/apply-mobile-registry-density-fix.yml';
const scriptPath = 'scripts/apply-mobile-registry-density-fix.mjs';

const replaceRequired = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`${label} marker missing`);
  return source.replace(before, after);
};

let css = fs.readFileSync(cssPath, 'utf8');

css = replaceRequired(
  css,
  'main a { color: var(--ui-link); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: .18em; }',
  'main a { color: var(--ui-link); text-decoration: none; }',
  'main link decoration'
);

css = replaceRequired(
  css,
  'main a:hover { color: var(--ui-hover); }',
  'main a:hover { color: var(--ui-hover); text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: .18em; }',
  'main link hover'
);

const oldMobileCards = `  :where(.stablecoin-index-card,.event-index-card,.organization-index-card) { padding: 15px 0; display: grid; gap: 12px; border: 0; border-bottom: 1px solid var(--ui-text); }
  .stablecoin-index-card-grid, .index-card-primary-facts, .index-card-secondary-facts { grid-template-columns: 1fr; }`;

const compactMobileCards = `  :where(.stablecoin-index-card,.event-index-card,.organization-index-card) { padding: 10px 0; display: grid; gap: 7px; border: 0; border-bottom: 1px solid var(--ui-text); }
  .stablecoin-index-card-heading { min-width: 0; display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
  .stablecoin-index-card-identity { min-width: 0; display: flex; align-items: flex-start; gap: 8px; }
  .stablecoin-index-card .ticker-badge { display: none; }
  .stablecoin-index-card-identity h2 { margin: 0; font-size: 1.05rem; line-height: 1.2; }
  .stablecoin-index-card-identity .record-symbol { display: block; margin-bottom: 2px; }
  .stablecoin-index-card-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
  .index-card-primary-facts, .index-card-secondary-facts { grid-template-columns: 1fr; }
  .stablecoin-index-card-grid > div { min-height: 0; padding: 8px; align-content: start; }
  .stablecoin-index-card-grid dt { font-size: 11px; line-height: 1.25; }
  .stablecoin-index-card-grid dd { margin: 3px 0 0; font-size: 14px; line-height: 1.35; }
  :where(.event-index-card,.organization-index-card) h2 { margin-bottom: 2px; font-size: 1.05rem; line-height: 1.25; }
  :where(.event-index-card,.organization-index-card) p { line-height: 1.4; }`;

css = replaceRequired(css, oldMobileCards, compactMobileCards, 'mobile register cards');

fs.writeFileSync(cssPath, css);
for (const file of [scriptPath, workflowPath]) {
  if (fs.existsSync(file)) fs.rmSync(file);
}

console.log(JSON.stringify({ cssPath, lineCount: css.split(/\r?\n/).length }, null, 2));
