import fs from 'node:fs';
const file = 'docs/migration/registry-v3-migration-audit.json';
const value = JSON.parse(fs.readFileSync(file, 'utf8'));
value.minimum_counts.deployments = 113;
fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
