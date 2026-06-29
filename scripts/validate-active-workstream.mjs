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
const reviewSpec = fs.readFileSync('docs/quality/monitoring-review-material-spec.md', 'utf8');
for (const phrase of [
  'Latest completed: PR #232',
  'Active: post-monitoring decision gate',
  'Next: roadmap amendment required',
  'Gate V2-F: not passed',
  'Record growth: paused',
  'Production publication: deferred'
]) {
  if (!roadmap.includes(phrase)) throw new Error(`roadmap missing: ${phrase}`);
}
for (const phrase of [
  'observed_facts',
  'inferences',
  'unresolved_questions',
  'rejected_duplicates',
  'Human approval required',
  'Automatic pull request: false',
  'No production deployment required'
]) {
  if (!reviewSpec.includes(phrase)) throw new Error(`PR #232 review specification missing: ${phrase}`);
}
console.log('Active workstream validation passed: PR #232 is complete and the next workstream requires a roadmap amendment.');
