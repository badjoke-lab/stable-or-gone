#!/usr/bin/env node
import fs from 'node:fs';

const cssPath = 'src/styles/public-ui.css';
const workflowPath = '.github/workflows/apply-pr482-final-mobile-fix.yml';
const scriptPath = 'scripts/apply-pr482-final-mobile-fix.mjs';

let css = fs.readFileSync(cssPath, 'utf8');
const before = '.stablecoin-index-card-grid dd { margin: 3px 0 0; font-size: 14px; line-height: 1.35; }';
const after = '.stablecoin-index-card-grid dd { margin: 3px 0 0; font-size: 15px; line-height: 1.35; }';
if (!css.includes(after)) {
  if (!css.includes(before)) throw new Error('mobile stablecoin value-size marker missing');
  css = css.replace(before, after);
}
fs.writeFileSync(cssPath, css);
for (const file of [scriptPath, workflowPath]) {
  if (fs.existsSync(file)) fs.rmSync(file);
}
console.log(JSON.stringify({ cssPath, lineCount: css.split(/\r?\n/).length }, null, 2));
