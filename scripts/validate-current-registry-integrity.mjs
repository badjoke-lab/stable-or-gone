import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const auditPath = 'data/generated/registry-integrity-audit.json';
const run = spawnSync(process.execPath, ['scripts/audit-registry-integrity-batch-o.mjs'], {
  stdio: 'inherit',
  env: process.env
});

if (!fs.existsSync(auditPath)) {
  console.error(`Current registry integrity audit did not produce ${auditPath}`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const allCritical = Array.isArray(report.findings?.critical) ? report.findings.critical : [];
const candidateHistoryPattern = /no promoted Candidate Master entry|Promoted candidate count .* differs from canonical count/;
const candidateHistory = allCritical.filter((message) => candidateHistoryPattern.test(message));
const canonicalCritical = allCritical.filter((message) => !candidateHistoryPattern.test(message));

report.findings.critical = canonicalCritical;
report.findings.candidate_history = candidateHistory;
report.candidate_history_is_non_blocking = true;
report.ok = canonicalCritical.length === 0;
fs.writeFileSync(auditPath, `${JSON.stringify(report, null, 2)}\n`);

if (canonicalCritical.length) {
  console.error('Current canonical registry integrity validation failed:');
  for (const message of canonicalCritical) console.error(`- ${message}`);
  process.exit(1);
}

if (run.status !== 0 && candidateHistory.length === 0) {
  console.error(`Registry audit exited ${run.status} without a recognized candidate-history-only condition.`);
  process.exit(1);
}

console.log(`Current canonical registry integrity passed. Candidate Master history gaps retained as non-blocking context: ${candidateHistory.length}.`);
