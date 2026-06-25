import fs from 'node:fs';

const path = 'docs/migration/registry-v3-migration-audit.json';
const audit = JSON.parse(fs.readFileSync(path, 'utf8'));
audit.minimum_counts.deployments = 117;
fs.writeFileSync(path, `${JSON.stringify(audit, null, 2)}\n`);
