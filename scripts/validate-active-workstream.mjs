import fs from 'node:fs';
import './validate-launch-date-pr220-review.mjs';
import './validate-terminal-relationship-review.mjs';
import './validate-evidence-reliability-pr223.mjs';
import './validate-direct-workflow-placeholders-pr224.mjs';
import './validate-evidence-traceability-pr225.mjs';
import './validate-deployment-canonicality-pr226.mjs';
import './validate-deployment-canonicality-pr227.mjs';
import './validate-deployment-source-status-pr229.mjs';

const roadmap = fs.readFileSync('docs/roadmap.md', 'utf8');
const overview = fs.readFileSync('docs/quality/monitoring-official-source-spec.md', 'utf8');
const schema = fs.readFileSync('docs/quality/monitoring-official-source-schema.md', 'utf8');
for (const phrase of ['Latest completed: PR #230', 'Active: PR #231', 'Next: PR #232', 'Gate V2-F: not passed']) {
  if (!roadmap.includes(phrase)) throw new Error(`roadmap missing: ${phrase}`);
}
for (const phrase of ['status: needs_human_review', 'canonical_action: none', 'workflow_dispatch']) {
  if (!overview.includes(phrase)) throw new Error(`official-source spec missing: ${phrase}`);
}
if (!schema.includes('signal_types')) throw new Error('official-source runtime schema is not fixed');
console.log('Active workstream validation passed: PR #231 is active.');
