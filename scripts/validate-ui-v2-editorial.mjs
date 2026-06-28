import './validate-ui-v2-mobile-accessibility.mjs';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const pages = [
  'src/pages/guides/index.astro',
  'src/pages/glossary/index.astro',
  'src/pages/models/index.astro',
  'src/pages/methodology/index.astro',
  'src/pages/updates/index.astro',
  'src/pages/about/index.astro',
  'src/pages/contact/index.astro',
  'src/pages/support/index.astro'
];
for (const page of pages) {
  check(fs.existsSync(path.join(root, page)), `Editorial route source is missing: ${page}`);
  if (!fs.existsSync(path.join(root, page))) continue;
  const source = read(page);
  check(source.includes('BaseLayout'), `${page}: BaseLayout is missing`);
  check(/class=["'][^"']*\bhero\b/.test(source), `${page}: editorial hero is missing`);
  check(!source.includes('fetch('), `${page}: external runtime fetch is not allowed`);
}
const layout = read('src/layouts/BaseLayout.astro');
const css = read('src/styles/editorial-v2.css');
check(layout.includes("import '../styles/editorial-v2.css'"), 'Editorial v2 stylesheet is not loaded');
check(layout.includes('editorialPrefixes') && layout.includes('data-page-family={pageFamily}'), 'Editorial route-family classification is missing');
for (const prefix of ['/guides/', '/glossary/', '/models/', '/methodology/', '/updates/', '/about/', '/contact/', '/support/']) check(layout.includes(`'${prefix}'`), `Editorial route prefix missing: ${prefix}`);
check(css.includes("main[data-page-family='editorial'] > .hero"), 'Editorial v2 hero contract is missing');
check(css.includes('@media (max-width: 719px)') && css.includes(':focus-visible') && css.includes('@media (forced-colors: active)') && css.includes('@media (prefers-reduced-motion: reduce)'), 'Editorial responsive and accessibility styles are incomplete');
for (const rejected of ['watchlist', 'follow button', 'safety score', 'transparency score']) check(!css.toLowerCase().includes(rejected), `Rejected editorial feature remains: ${rejected}`);
const report = { schema_version: '1.0', checked_at: new Date().toISOString(), ok: failures.length === 0, pages, failures };
if (failures.length) { console.error(JSON.stringify(report, null, 2)); process.exit(1); }
console.log(JSON.stringify(report, null, 2));
