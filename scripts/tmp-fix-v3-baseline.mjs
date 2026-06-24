import fs from 'node:fs';

const path = 'docs/migration/registry-v3-baseline.json';
const baseline = JSON.parse(fs.readFileSync(path, 'utf8'));
baseline.quality.warnings = 3;
fs.writeFileSync(path, `${JSON.stringify(baseline, null, 2)}\n`);
