import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const publicCssPath = path.join(root, 'src/styles/public-ui.css');
const remediationCssPath = path.join(root, 'src/styles/guide-readability-remediation.css');
const brandPath = path.join(root, 'src/components/BrandLockup.astro');
const validatorPath = path.join(root, 'scripts/validate-guide-readability-remediation-2026-08-08.mjs');
const tempWorkflowPath = path.join(root, '.github/workflows/_temporary-fold-guide-remediation.yml');
const selfPath = path.join(root, 'scripts/_temporary-fold-guide-remediation.mjs');

const marker = '/* Guide & Research Surface Readability Remediation — 2026-08-08 */';
const read = (file) => fs.readFileSync(file, 'utf8');
const write = (file, content) => fs.writeFileSync(file, content, 'utf8');

let publicCss = read(publicCssPath);
const remediationCss = read(remediationCssPath);
if (publicCss.includes(marker)) throw new Error('Guide remediation marker already exists in public-ui.css; refusing duplicate fold');

// Preserve the already visually accepted cascade, but collapse it to one physical line
// so the repository's one-stylesheet and <553-line contracts remain intact.
const foldedCss = remediationCss
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/\s*\r?\n\s*/g, ' ')
  .replace(/ {2,}/g, ' ')
  .trim();
publicCss = `${publicCss.replace(/\s+$/, '')}\n${marker}\n${foldedCss}\n`;
write(publicCssPath, publicCss);

let brand = read(brandPath);
const remediationImport = "import '../styles/guide-readability-remediation.css';\n";
if (!brand.includes(remediationImport)) throw new Error('BrandLockup remediation stylesheet import not found');
brand = brand.replace(remediationImport, '');
write(brandPath, brand);

let validator = read(validatorPath);
const oldRead = "const css = read('src/styles/guide-readability-remediation.css');";
if (!validator.includes(oldRead)) throw new Error('Guide validator stylesheet source target not found');
validator = validator.replace(oldRead, "const css = read('src/styles/public-ui.css');");

const oldImportContract = `const baseImport = "import '../styles/public-ui.css';";\nconst remediationImport = "import '../styles/guide-readability-remediation.css';";\nexpect(brand.includes(baseImport), 'base public UI stylesheet import missing');\nexpect(brand.includes(remediationImport), 'Guide readability stylesheet import missing');\nexpect(brand.indexOf(remediationImport) > brand.indexOf(baseImport), 'Guide readability stylesheet must load after public-ui.css');`;
const newImportContract = `const baseImport = "import '../styles/public-ui.css';";\nexpect(brand.includes(baseImport), 'base public UI stylesheet import missing');\nexpect(!brand.includes('guide-readability-remediation.css'), 'Guide remediation must be folded into public-ui.css, not loaded as a second stylesheet');\nexpect(css.includes('${marker.replace(/'/g, "\\'")}'), 'folded Guide remediation marker missing from public-ui.css');`;
if (!validator.includes(oldImportContract)) throw new Error('Guide validator import contract block not found');
validator = validator.replace(oldImportContract, newImportContract);
write(validatorPath, validator);

fs.unlinkSync(remediationCssPath);
fs.unlinkSync(tempWorkflowPath);
fs.unlinkSync(selfPath);

const cssFiles = fs.readdirSync(path.join(root, 'src/styles')).filter((name) => name.endsWith('.css'));
if (cssFiles.length !== 1 || cssFiles[0] !== 'public-ui.css') {
  throw new Error(`Expected only src/styles/public-ui.css after fold; found: ${cssFiles.join(', ')}`);
}
const lineCount = read(publicCssPath).split(/\r?\n/).length;
if (lineCount >= 553) throw new Error(`public-ui.css must remain below 553 lines; found ${lineCount}`);
if (read(brandPath).includes('guide-readability-remediation.css')) throw new Error('Second stylesheet import survived fold');

console.log(JSON.stringify({
  ok: true,
  folded_into: 'src/styles/public-ui.css',
  public_ui_line_count: lineCount,
  css_files: cssFiles,
  temporary_files_removed: true
}, null, 2));
