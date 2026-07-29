#!/usr/bin/env node
import fs from 'node:fs';

const cssPath = 'src/styles/public-ui.css';
const workflowPath = '.github/workflows/apply-stablecoin-logo-styles.yml';
const scriptPath = 'scripts/apply-stablecoin-logo-styles.mjs';

const replaceRequired = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`${label} marker missing`);
  return source.replace(before, after);
};

let css = fs.readFileSync(cssPath, 'utf8');

const panelRule = '.panel, .surface, .card, .stat, .fact, :where([class$="-card"],[class*="-card "]) { border: 1px solid var(--ui-line-strong); border-radius: 0; background: var(--ui-surface); box-shadow: none; }';
const logoRules = `${panelRule}\n.stablecoin-mark { flex: 0 0 auto; width: 34px; height: 34px; object-fit: contain; border-radius: 50%; }\n.stablecoin-mark--small { width: 26px; height: 26px; }\n.stablecoin-mark--large { width: 48px; height: 48px; }\n.stablecoin-dossier-heading-identity { min-width: 0; display: flex; align-items: flex-start; gap: 14px; }\n.stablecoin-dossier-heading-identity > div { min-width: 0; }`;
css = replaceRequired(css, panelRule, logoRules, 'stablecoin logo base rules');

css = replaceRequired(
  css,
  '  .stablecoin-index-card .ticker-badge { display: none; }',
  '  .stablecoin-index-card :where(.stablecoin-mark,.ticker-badge) { margin-top: 1px; }',
  'mobile stablecoin mark visibility'
);

const mobileIdentityRule = '  .stablecoin-index-card-identity { min-width: 0; display: flex; align-items: flex-start; gap: 8px; }';
const mobileLogoRules = `${mobileIdentityRule}\n  .stablecoin-mark--large { width: 40px; height: 40px; }\n  .stablecoin-dossier-heading-identity { gap: 10px; }`;
css = replaceRequired(css, mobileIdentityRule, mobileLogoRules, 'mobile stablecoin logo sizing');

fs.writeFileSync(cssPath, css);
for (const file of [scriptPath, workflowPath]) {
  if (fs.existsSync(file)) fs.rmSync(file);
}

console.log(JSON.stringify({ cssPath, lineCount: css.split(/\r?\n/).length }, null, 2));
