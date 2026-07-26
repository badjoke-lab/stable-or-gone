#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const stylesRoot = 'src/styles';
const authority = path.join(stylesRoot, 'public-ui.css');
if (!fs.existsSync(authority)) throw new Error(`single UI authority missing: ${authority}`);

const removed = [];
for (const entry of fs.readdirSync(stylesRoot, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.endsWith('.css') || entry.name === 'public-ui.css') continue;
  const target = path.join(stylesRoot, entry.name);
  fs.rmSync(target);
  removed.push(target);
}

for (const target of [
  'scripts/apply-remaining-page-family-contract.mjs',
  '.github/workflows/apply-remaining-page-family-contract.yml',
  'artifacts/trigger-remaining-page-family-contract.txt'
]) {
  if (!fs.existsSync(target)) continue;
  fs.rmSync(target);
  removed.push(target);
}

const remaining = fs.readdirSync(stylesRoot).filter((name) => name.endsWith('.css')).sort();
if (remaining.length !== 1 || remaining[0] !== 'public-ui.css') {
  throw new Error(`single CSS finalization failed: ${remaining.join(', ')}`);
}
console.log(JSON.stringify({ authority, removed, remaining }, null, 2));
