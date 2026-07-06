import fs from 'node:fs';
import './validate-batch21-growth-d.mjs';
import './validate-current-final-eight.mjs';

const checks = [
  ['docs/roadmap.md', 'Current item: PR #310 Registry v2/v3 and machine-readable parity'],
  ['docs/roadmap.md', 'Next item: PR #311 counts, manifest, version, and provenance integrity'],
  ['AGENTS.md', 'Active: PR #310 Registry v2/v3 and machine-readable parity'],
  ['AGENTS.md', 'Next: PR #311 counts, manifest, version, and provenance integrity'],
  ['docs/spec-governance.md', 'PR #310 Registry v2/v3 and machine-readable parity active'],
  ['docs/spec-governance.md', 'PR #311 counts, manifest, version, and provenance integrity next'],
  ['docs/quality/non-ui-quality-program.md', 'PR #310 Registry v2/v3 and machine-readable parity: active'],
  ['docs/quality/non-ui-quality-program.md', 'PR #311 counts, manifest, version, and provenance integrity: next']
];

const failures = [];
for (const [file, marker] of checks) {
  const body = fs.readFileSync(file, 'utf8');
  if (!body.includes(marker)) failures.push(`${file}: missing ${marker}`);
}

if (failures.length) {
  console.error('PR #310 active-workstream validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('PR #310 active-workstream checks passed; PR #311 remains next.');
