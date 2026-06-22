import fs from 'node:fs';

const file = 'docs/migration/registry-v2-baseline.json';
const baseline = JSON.parse(fs.readFileSync(file, 'utf8'));
baseline.minimum_counts.evidence_relations = 328;
fs.writeFileSync(file, `${JSON.stringify(baseline, null, 2)}\n`);
console.log('msUSD evidence relation baseline corrected');
