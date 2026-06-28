import fs from 'node:fs';
const roadmap = fs.readFileSync('docs/roadmap.md', 'utf8');
const spec = fs.readFileSync('docs/quality/monitoring-pipeline-spec.md', 'utf8');
const required = ['Latest completed: PR #229', 'Active: PR #230', 'Next: PR #231', 'Gate V2-F: not passed'];
for (const phrase of required) {
  if (!roadmap.includes(phrase)) throw new Error(`roadmap missing: ${phrase}`);
}
if (!spec.includes('PR #230 — skeleton and canonical guard')) throw new Error('monitoring spec is not active');
console.log('Active workstream validation passed: PR #230 is active.');
