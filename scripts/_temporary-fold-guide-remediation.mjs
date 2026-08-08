import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const cssPath = path.join(root, 'src/styles/public-ui.css');
const brandPath = path.join(root, 'src/components/BrandLockup.astro');
const validatorPath = path.join(root, 'scripts/validate-guide-readability-remediation-2026-08-08.mjs');
const separateCssPath = path.join(root, 'src/styles/guide-readability-remediation.css');
const workflowPath = path.join(root, '.github/workflows/_temporary-fold-guide-remediation.yml');
const selfPath = path.join(root, 'scripts/_temporary-fold-guide-remediation.mjs');

const replaceOnce = (source, from, to, label) => {
  const count = source.split(from).length - 1;
  if (count !== 1) throw new Error(`${label}: expected exactly one match, found ${count}`);
  return source.replace(from, to);
};

let css = fs.readFileSync(cssPath, 'utf8');
const oldGuideBlock = `.guide-article-layout, .longform-layout { display: grid; grid-template-columns: 14rem minmax(0,1fr); gap: 42px; align-items: start; }
.guide-article-toc, .longform-toc { position: sticky; top: 8rem; padding: 12px 0; border-top: 1px solid var(--ui-text); border-bottom: 1px solid var(--ui-text); }
.guide-article-toc > summary, .longform-toc > summary { min-height: 44px; display: flex; align-items: center; color: var(--ui-text); font-weight: 700; cursor: pointer; }
.guide-article-toc ol, .longform-toc ol { margin: 6px 0 0; padding-left: 18px; display: grid; gap: 3px; }
.guide-article-toc a, .longform-toc a { min-height: 36px; display: inline-flex; align-items: center; }
.guide-article-content, .longform-content { min-width: 0; max-width: 860px; }
.guide-article-content p, .longform-content p, .update-analysis p, .analysis-article p { max-width: var(--ui-reading); font-size: 17px; line-height: 1.72; }
.guide-article-content > section, .longform-content > section { margin: 0; padding: 30px 0; border-bottom: 1px solid var(--ui-text); }
.guide-article-footer, .longform-footer { grid-column: 2; display: flex; flex-wrap: wrap; gap: 10px 16px; padding-top: 16px; border-top: 1px solid var(--ui-text); }
.guide-article-footer a, .longform-footer a { min-height: 44px; display: inline-flex; align-items: center; border-bottom: 1px solid var(--ui-line-strong); font-size: 15px; }
.guide-mobile-table-records { display: none; }`;
const newGuideBlock = `.guide-article-layout { width: min(100%,1120px); margin: 0 auto; display: grid; grid-template-columns: minmax(0,1fr); gap: 0; align-items: start; } .longform-layout { display: grid; grid-template-columns: 14rem minmax(0,1fr); gap: 42px; align-items: start; }
.guide-article-toc { position: static; padding: 12px 0 14px; border-top: 1px solid var(--ui-text); border-bottom: 1px solid var(--ui-text); } .longform-toc { position: sticky; top: 8rem; padding: 12px 0; border-top: 1px solid var(--ui-text); border-bottom: 1px solid var(--ui-text); }
.guide-article-toc > summary, .longform-toc > summary { min-height: 44px; display: flex; align-items: center; color: var(--ui-text); font-weight: 700; cursor: pointer; }
.guide-article-toc ol { margin: 6px 0 0; padding-left: 18px; display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); column-gap: 32px; row-gap: 0; } .longform-toc ol { margin: 6px 0 0; padding-left: 18px; display: grid; gap: 3px; }
.guide-article-toc a, .longform-toc a { min-height: 40px; display: inline-flex; align-items: flex-start; padding-block: 8px; line-height: 1.45; }
.guide-article-content { min-width: 0; max-width: none; } .longform-content { min-width: 0; max-width: 860px; }
.guide-article-content p, .longform-content p, .update-analysis p, .analysis-article p { max-width: var(--ui-reading); font-size: 17px; line-height: 1.72; }
.guide-article-content > section { margin: 0; padding: 38px 0; border-bottom: 1px solid var(--ui-text); } .longform-content > section { margin: 0; padding: 30px 0; border-bottom: 1px solid var(--ui-text); }
.guide-article-content > section.panel { border: 0; border-bottom: 1px solid var(--ui-line-strong); background: transparent; box-shadow: none; }
.guide-article-content > section > h2.bar { width: auto; max-width: 34ch; margin: 0 0 18px; color: var(--ui-text); font: 600 1.55rem/1.16 var(--ui-serif); letter-spacing: -.018em; text-transform: none; text-wrap: balance; }
.guide-article-content > section > :where(p,ul,ol), .guide-article-content > section > div > :where(p,ul,ol) { max-width: 76ch; }
.guide-article-content :where(.table-wrap,.evidence-table-wrap) { width: 100%; max-width: none; overflow-x: auto; } .guide-article-content table { width: 100%; max-width: none; table-layout: auto; }
.guide-article-content th, .guide-article-content td { padding: 11px 13px; vertical-align: top; line-height: 1.48; }
.guide-article-footer { grid-column: 1; } .longform-footer { grid-column: 2; } .guide-article-footer, .longform-footer { display: flex; flex-wrap: wrap; gap: 10px 16px; padding-top: 16px; border-top: 1px solid var(--ui-text); }
.guide-article-footer a, .longform-footer a { min-height: 44px; display: inline-flex; align-items: center; border-bottom: 1px solid var(--ui-line-strong); font-size: 15px; }
.guide-article-layout > .context-support-callout { grid-column: 1; width: 100%; } body:has(main[data-page-kind="guide-article"]) .site-footer > .footer-support, body:has(main[data-page-kind="longform"]) .site-footer > .footer-support { display: none; }
.guide-mobile-table-records { display: none; }`;
css = replaceOnce(css, oldGuideBlock, newGuideBlock, 'Guide shared block');
css = replaceOnce(css,
  `.editorial-directory { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); border-top: 1px solid var(--ui-text); border-left: 1px solid var(--ui-text); }`,
  `.editorial-directory { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); border-top: 1px solid var(--ui-text); border-left: 1px solid var(--ui-text); } section:has(#research-guides-title) > .editorial-directory { grid-template-columns: repeat(3,minmax(0,1fr)); }`,
  'home editorial directory');
css = replaceOnce(css,
  `  .guide-article-layout, .longform-layout { grid-template-columns: 1fr; }`,
  `  .guide-article-layout, .longform-layout { grid-template-columns: 1fr; } section:has(#research-guides-title) > .editorial-directory { grid-template-columns: 1fr; }`,
  '980px Guide layout');
css = replaceOnce(css,
  `  .editorial-directory { grid-template-columns: repeat(2,minmax(0,1fr)); } .editorial-directory a { min-height: 82px; padding: 10px; grid-template-columns: 24px minmax(0,1fr) auto; gap: 7px; } .directory-copy { gap: 2px; }`,
  `  .editorial-directory { grid-template-columns: repeat(2,minmax(0,1fr)); } section:has(#research-guides-title) > .editorial-directory { grid-template-columns: 1fr; } .editorial-directory a { min-height: 82px; padding: 10px; grid-template-columns: 24px minmax(0,1fr) auto; gap: 7px; } .directory-copy { gap: 2px; }`,
  '640px editorial directory');
css = replaceOnce(css,
  `  .guide-article-toc[hidden], .longform-toc[hidden] { display: none; }`,
  `  .guide-article-toc[hidden], .longform-toc[hidden] { display: none; } .guide-article-toc ol { grid-template-columns: 1fr; } .guide-article-content > section > h2.bar { max-width: none; font-size: 1.375rem; line-height: 1.18; }`,
  '640px Guide TOC/heading');
fs.writeFileSync(cssPath, css);

let brand = fs.readFileSync(brandPath, 'utf8');
brand = replaceOnce(brand, `import '../styles/public-ui.css';\nimport '../styles/guide-readability-remediation.css';`, `import '../styles/public-ui.css';`, 'Brand stylesheet imports');
fs.writeFileSync(brandPath, brand);

let validator = fs.readFileSync(validatorPath, 'utf8');
validator = replaceOnce(validator, `const css = read('src/styles/guide-readability-remediation.css');`, `const css = read('src/styles/public-ui.css');`, 'validator stylesheet path');
validator = replaceOnce(validator,
  `const baseImport = "import '../styles/public-ui.css';";\nconst remediationImport = "import '../styles/guide-readability-remediation.css';";\nexpect(brand.includes(baseImport), 'base public UI stylesheet import missing');\nexpect(brand.includes(remediationImport), 'Guide readability stylesheet import missing');\nexpect(brand.indexOf(remediationImport) > brand.indexOf(baseImport), 'Guide readability stylesheet must load after public-ui.css');`,
  `const baseImport = "import '../styles/public-ui.css';";\nexpect(brand.includes(baseImport), 'public UI stylesheet import missing');\nexpect(!brand.includes('guide-readability-remediation.css'), 'separate Guide stylesheet reintroduced; UI contract requires one stylesheet');`,
  'validator import contract');
validator = validator
  .replace(`expect(css.includes('width: min(100%, 1120px);'), 'Guide data width ceiling is not 1120px');`, `expect(css.includes('width: min(100%,1120px);'), 'Guide data width ceiling is not 1120px');`)
  .replace(`expect(css.includes('grid-template-columns: minmax(0, 1fr);'), 'persistent two-column Guide layout not removed');`, `expect(css.includes('grid-template-columns: minmax(0,1fr);'), 'persistent two-column Guide layout not removed');`)
  .replace(`expect(css.includes('grid-template-columns: repeat(3, minmax(0, 1fr));'), 'desktop Guide TOC or research grid does not use balanced columns');`, `expect(css.includes('grid-template-columns: repeat(3,minmax(0,1fr));'), 'desktop Guide TOC or research grid does not use balanced columns');`)
  .replace(`expect(css.includes('font: 600 1.55rem/1.16 var(--ui-serif);'), 'desktop Guide primary heading floor/style changed');`, `expect(css.includes('font: 600 1.55rem/1.16 var(--ui-serif);'), 'desktop Guide primary heading floor/style changed');`)
  .replace(`expect(css.includes('section:has(#research-guides-title) > .editorial-directory'), 'home Research & Guides scoped composition rule missing');`, `expect(css.includes('section:has(#research-guides-title) > .editorial-directory'), 'home Research & Guides scoped composition rule missing');`);
fs.writeFileSync(validatorPath, validator);

if (fs.existsSync(separateCssPath)) fs.rmSync(separateCssPath);
if (fs.existsSync(workflowPath)) fs.rmSync(workflowPath);
if (fs.existsSync(selfPath)) fs.rmSync(selfPath);

const cssFiles = fs.readdirSync(path.join(root, 'src/styles')).filter((name) => name.endsWith('.css'));
const lineCount = fs.readFileSync(cssPath, 'utf8').split(/\r?\n/).length;
if (cssFiles.length !== 1 || cssFiles[0] !== 'public-ui.css') throw new Error(`expected one CSS file public-ui.css, found ${cssFiles.join(', ')}`);
if (lineCount >= 553) throw new Error(`public-ui.css line count ${lineCount} violates <553 contract`);
console.log(JSON.stringify({ok:true, css_files:cssFiles, public_ui_lines:lineCount, temporary_files_removed:true}, null, 2));
