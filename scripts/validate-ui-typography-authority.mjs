import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const stylesRoot = path.join(root, 'src/styles');
const failures = [];
const checked = [];

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const absolute = path.join(dir, entry.name);
  if (entry.isDirectory()) return walk(absolute);
  return entry.isFile() && entry.name.endsWith('.css') ? [absolute] : [];
});

const technicalSelector = /(^|[\s,.>+~:[\]-])(code|pre|kbd|samp)(\b|[\s,.>+~:[\]-])|contract-address|transaction-hash|data-long-value|address-block\s+code|wallet-row\s+code/i;
const protectedFlatFiles = new Set([
  'src/styles/global.css',
  'src/styles/guide-editorial-v3.css',
  'src/styles/reference-utility-v3.css',
  'src/styles/ui-remediation-r7.css'
]);

for (const absolute of walk(stylesRoot)) {
  const relative = path.relative(root, absolute).replaceAll(path.sep, '/');
  const css = fs.readFileSync(absolute, 'utf8');
  checked.push(relative);

  for (const token of ['Georgia', 'Cambria', 'Times New Roman']) {
    if (css.toLowerCase().includes(token.toLowerCase())) failures.push(`${relative}: prohibited serif token ${token}`);
  }

  const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
  for (const match of css.matchAll(rulePattern)) {
    const selector = match[1].trim();
    const declarations = match[2];
    const fontDeclarations = [...declarations.matchAll(/font-family\s*:\s*([^;}]*)/gi)];
    for (const font of fontDeclarations) {
      const value = font[1];
      if (!/(ui-monospace|sfmono|menlo|monaco|consolas|liberation mono|\bmonospace\b)/i.test(value)) continue;
      if (selector === ':root' && declarations.includes('--sog-font-data')) continue;
      if (!technicalSelector.test(selector)) failures.push(`${relative}: non-technical monospace selector ${selector}`);
    }
  }

  if (protectedFlatFiles.has(relative)) {
    for (const match of css.matchAll(/border-radius\s*:\s*([^;}]*)/gi)) {
      const value = match[1].trim();
      if (!/^(0|0px|none)$/i.test(value)) failures.push(`${relative}: non-zero border-radius ${value}`);
    }
    for (const match of css.matchAll(/box-shadow\s*:\s*([^;}]*)/gi)) {
      const value = match[1].trim();
      if (!/^none$/i.test(value)) failures.push(`${relative}: decorative box-shadow ${value}`);
    }
    if (/(linear-gradient|radial-gradient|conic-gradient)\s*\(/i.test(css)) failures.push(`${relative}: decorative gradient`);
  }
}

const globalCss = fs.readFileSync(path.join(root, 'src/styles/global.css'), 'utf8');
if (!globalCss.includes('--sog-font-interface: ui-sans-serif')) failures.push('global.css: system sans token missing');
if (!/body\s*\{[^}]*font-family\s*:\s*var\(--sog-font-interface\)/s.test(globalCss)) failures.push('global.css: body is not bound to the system sans token');

const result = {
  schema_version: '1.0',
  ok: failures.length === 0,
  authority: 'docs/ui-v3-remediation-authority.md',
  css_files_checked: checked.length,
  rules: {
    single_system_sans: true,
    monospace_only_for_technical_literals: true,
    serif_forbidden: true,
    protected_surfaces_flat: true
  },
  failures
};

console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
