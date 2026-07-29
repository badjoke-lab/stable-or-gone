#!/usr/bin/env node
import fs from 'node:fs';

const cssPath = 'src/styles/public-ui.css';
const workflowPath = '.github/workflows/apply-pr482-mobile-hidden-fix.yml';
const scriptPath = 'scripts/apply-pr482-mobile-hidden-fix.mjs';

let css = fs.readFileSync(cssPath, 'utf8');
const before = '  [data-mobile-representation-for] { display: grid; gap: 0; }';
const after = `${before}\n  [data-mobile-representation-for][hidden] { display: none; }`;
if (!css.includes('[data-mobile-representation-for][hidden]')) {
  if (!css.includes(before)) throw new Error('mobile representation marker missing');
  css = css.replace(before, after);
}
fs.writeFileSync(cssPath, css);
for (const file of [scriptPath, workflowPath]) {
  if (fs.existsSync(file)) fs.rmSync(file);
}
console.log(JSON.stringify({ cssPath, lineCount: css.split(/\r?\n/).length }, null, 2));
