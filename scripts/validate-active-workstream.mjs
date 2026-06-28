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
const spec = fs.readFileSync('docs/quality/monitoring-pipeline-spec.md', 'utf8');
const required = ['Latest completed: PR #229', 'Active: PR #230', 'Next: PR #231', 'Gate V2-F: not passed'];
for (const phrase of required) {
  if (!roadmap.includes(phrase)) throw new Error(`roadmap missing: ${phrase}`);
}
for (const phrase of ['PR #230 — skeleton and canonical guard', 'workflow_dispatch', 'candidate_count: 0']) {
  if (!spec.includes(phrase)) throw new Error(`monitoring spec missing: ${phrase}`);
}
console.log('Active workstream validation passed: PR #230 is active.');
