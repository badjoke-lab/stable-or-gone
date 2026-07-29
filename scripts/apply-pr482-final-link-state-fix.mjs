#!/usr/bin/env node
import fs from 'node:fs';

const cssPath = 'src/styles/public-ui.css';
const workflowPath = '.github/workflows/apply-pr482-final-link-state-fix.yml';
const scriptPath = 'scripts/apply-pr482-final-link-state-fix.mjs';

const replaceRequired = (source, before, after, label) => {
  if (source.includes(after)) return source;
  if (!source.includes(before)) throw new Error(`${label} marker missing`);
  return source.replace(before, after);
};

let css = fs.readFileSync(cssPath, 'utf8');
css = replaceRequired(
  css,
  '.correction-link { min-height: 44px; display: inline-flex; align-items: center; color: var(--ui-text); border-bottom: 1px solid var(--ui-text); font-size: 15px; font-weight: 700; white-space: nowrap; }',
  '.correction-link { min-height: 44px; display: inline-flex; align-items: center; color: var(--ui-text); border-bottom: 0; font-size: 15px; font-weight: 700; white-space: nowrap; }',
  'correction link underline'
);
css = replaceRequired(
  css,
  '.footer-navigation-group a { width: fit-content; min-height: 40px; display: inline-flex; align-items: center; color: var(--ui-muted); font-size: 15px; line-height: 1.4; border-bottom: 1px solid var(--ui-line-strong); }',
  '.footer-navigation-group a { width: fit-content; min-height: 40px; display: inline-flex; align-items: center; color: var(--ui-muted); font-size: 15px; line-height: 1.4; border-bottom: 0; }',
  'footer link underline'
);
const buttonRule = 'button, .ui-button, .ghost-button, .button { min-height: 44px; display: inline-flex; align-items: center; justify-content: center; padding: 0 13px; border: 1px solid var(--ui-text); border-radius: 0; background: var(--ui-text); color: var(--ui-bg); font-size: 15px; font-weight: 700; }';
const buttonWithDisabled = `${buttonRule}\nbutton:disabled { cursor: not-allowed; opacity: .42; }`;
if (!css.includes('button:disabled { cursor: not-allowed; opacity: .42; }')) {
  if (!css.includes(buttonRule)) throw new Error('button rule marker missing');
  css = css.replace(buttonRule, buttonWithDisabled);
}
fs.writeFileSync(cssPath, css);
for (const file of [scriptPath, workflowPath]) if (fs.existsSync(file)) fs.rmSync(file);
console.log(JSON.stringify({ cssPath, lineCount: css.split(/\r?\n/).length }, null, 2));
