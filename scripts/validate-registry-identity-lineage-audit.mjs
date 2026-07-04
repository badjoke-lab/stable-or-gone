import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const targets = [
  'data/generated/registry-identity-lineage-audit.json',
  'docs/audits/registry-100-identity-lineage-audit.md'
];

const before = new Map(targets.map((file) => [file, fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null]));

execFileSync(process.execPath, ['scripts/audit-registry-identity-lineage.mjs'], {
  stdio: 'inherit',
  env: process.env
});

const stale = [];
for (const file of targets) {
  const previous = before.get(file);
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (previous === null) stale.push(`${file} was missing before regeneration`);
  else if (previous !== current) stale.push(`${file} was stale before regeneration`);
}

if (stale.length) {
  console.error('Identity and lineage audit outputs are stale or missing:');
  stale.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Identity and lineage audit outputs are current.');
