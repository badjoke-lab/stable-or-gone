import fs from 'node:fs';

const layoutPath = 'src/layouts/BaseLayout.astro';
const shellPath = 'src/styles/ui-v4-shell.css';

for (const path of [layoutPath, shellPath]) {
  if (!fs.existsSync(path)) throw new Error(`${path} is missing`);
}

const layout = fs.readFileSync(layoutPath, 'utf8');
const shell = fs.readFileSync(shellPath, 'utf8');

const v3Import = "import '../styles/mobile-accessibility-v3.css';";
const v4Import = "import '../styles/ui-v4-shell.css';";
if (!layout.includes(v4Import)) throw new Error('BaseLayout must import the UI v4 shell');
if (layout.indexOf(v4Import) < layout.indexOf(v3Import)) throw new Error('UI v4 shell must load after legacy UI v3 styles');

const requiredSelectors = [
  '.site-header',
  '.site-header-inner',
  '.site-primary-navigation',
  '.site-search',
  '.site-about-panel',
  '.mobile-navigation-panel',
  '.site-main',
  '.panel',
  '.ui-button',
  '.ui-field',
  '.chip',
  '.site-footer'
];
for (const selector of requiredSelectors) {
  if (!shell.includes(selector)) throw new Error(`missing shared-shell selector: ${selector}`);
}

const requiredTokens = [
  '--sog-surface: #ffffff',
  '--sog-shadow-panel:',
  '--sog-radius-panel: 14px',
  '--sog-content-width: 1280px'
];
for (const token of requiredTokens) {
  if (!shell.includes(token)) throw new Error(`missing UI v4 token: ${token}`);
}

if (!/body\s*\{[\s\S]*?font-size:\s*16px/.test(shell)) throw new Error('body must establish a readable 16px default');
if (!/th\s*\{[\s\S]*?font-size:\s*0\.75rem/.test(shell)) throw new Error('table headings must not fall below the 12px contract');
if (!shell.includes('@media (max-width: 920px)')) throw new Error('tablet/mobile navigation breakpoint is missing');
if (!shell.includes('@media (max-width: 680px)')) throw new Error('narrow mobile shell breakpoint is missing');
if (/font-family:\s*Georgia/.test(shell)) throw new Error('UI v4 shell must not reintroduce Georgia display typography');
if (/background:\s*transparent;[\s\S]{0,120}box-shadow:\s*none;/.test(shell)) throw new Error('UI v4 shared panels may not use the rejected transparent/no-shadow pair');

console.log(JSON.stringify({
  ok: true,
  shell: shellPath,
  imported_after_v3: true,
  readable_default_text: true,
  responsive_breakpoints: [920, 680]
}, null, 2));
