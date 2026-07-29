#!/usr/bin/env node
import fs from 'node:fs';

const cssPath = 'src/styles/public-ui.css';
const workflowPath = '.github/workflows/apply-pr482-visual-followup.yml';
const scriptPath = 'scripts/apply-pr482-visual-followup.mjs';

const replaceRequired = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`${label} marker missing`);
  return source.replace(before, after);
};

let css = fs.readFileSync(cssPath, 'utf8');

css = replaceRequired(
  css,
  '.stablecoin-index-card-grid dt { font-size: 11px; line-height: 1.25; }',
  '.stablecoin-index-card-grid dt { font-size: 13px; line-height: 1.25; }',
  'mobile stablecoin fact labels'
);

const overlineRule = ':where(.event-index-overline,.organization-index-overline,.guide-article-overline,.event-detail-overline,.organization-detail-overline,.stablecoin-dossier-overline) { min-height: 44px; padding: 9px 0; display: flex; align-items: center; justify-content: space-between; gap: 1rem; border-bottom: 1px solid var(--ui-line-strong); color: var(--ui-muted); font: 700 13px/1.4 var(--ui-mono); text-transform: uppercase; }';
const overlineWithNav = `${overlineRule}\n:where(.event-index-overline,.organization-index-overline) nav { display: flex; flex-wrap: wrap; gap: 8px 14px; }`;
css = replaceRequired(css, overlineRule, overlineWithNav, 'index overline related links');

fs.writeFileSync(cssPath, css);
for (const file of [scriptPath, workflowPath]) {
  if (fs.existsSync(file)) fs.rmSync(file);
}

console.log(JSON.stringify({ cssPath, lineCount: css.split(/\r?\n/).length }, null, 2));
