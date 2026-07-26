#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// One-time bounded branch migration. Delete this script after it commits the import removals.
const roots = ['src/pages', 'src/components', 'src/layouts', 'src/lib', 'src/scripts'];
const files = [];
const walk = (directory) => {
  if (!fs.existsSync(directory)) return;
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (/\.(astro|js|mjs|ts|tsx)$/.test(entry.name)) files.push(target);
  }
};
for (const root of roots) walk(root);

const allowedFile = path.normalize('src/components/BrandLockup.astro');
const allowedImport = '../styles/site-ui.css';
const importPattern = /^import\s+['"]([^'"]+\.css)['"];?\s*\n?/gm;
const changed = [];
const removed = [];

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  const next = original.replace(importPattern, (statement, importPath) => {
    if (path.normalize(file) === allowedFile && importPath === allowedImport) return statement;
    removed.push({ file, import: importPath });
    return '';
  });
  if (next === original) continue;
  fs.writeFileSync(file, next);
  changed.push(file);
}

const result = {
  schema_version: '1.0',
  changed_files: changed,
  removed_imports: removed,
  remaining_authority: { file: allowedFile, import: allowedImport }
};
fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/css-import-consolidation.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
