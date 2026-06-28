import fs from 'node:fs';
import path from 'node:path';
import './validate-launch-date-pr220-review.mjs';
import './validate-terminal-relationship-review.mjs';
import './validate-evidence-reliability-pr223.mjs';
import './validate-direct-workflow-placeholders-pr224.mjs';
import './validate-evidence-traceability-pr225.mjs';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const requireText = (file, phrases) => {
  if (!fs.existsSync(path.join(root, file))) {
    failures.push(`missing active-workstream file: ${file}`);
    return;
  }
  const text = read(file);
  for (const phrase of phrases) if (!text.includes(phrase)) failures.push(`${file} is missing: ${phrase}`);
};

requireText('AGENTS.md', ['docs/quality/non-ui-quality-program.md','Gate V2-F is not passed','Routine growth beyond 92 canonical stable assets is paused']);
requireText('docs/spec-governance.md', ['the binding workstream is the non-UI quality program','The UI program is paused after PR #216']);
requireText('docs/roadmap.md', ['Latest completed: PR #224','Active: PR #225','Next: PR #226','Gate V2-F: not passed','Canonical evidence records: 457','Public source identities: 412','Orphan relation sources: 0']);
requireText('docs/ui-redesign/implementation-plan.md', ['canonical implementation schedule — paused','Gate V2-F: not passed']);
requireText('docs/deployment-policy.md', ['Current publication state: paused during the quality and UI repair programs','No release candidate is currently selected']);
requireText('docs/quality/non-ui-quality-program.md', ['PR #223–#225 — evidence quality review','Gate V2-F remains pending']);
requireText('docs/quality/evidence-traceability-review-2026-06-28.md', ['Canonical evidence records: 457','Public source identities: 412','Evidence relations: 457','Public duplicate-URL groups: 0','Orphan relation source IDs: 0']);

const roadmap = read('docs/roadmap.md');
if (roadmap.includes('Gate V2-F: passed')) failures.push('roadmap must not mark Gate V2-F as passed');
if (roadmap.includes('Active: PR #224')) failures.push('roadmap still points to completed PR #224');
if (failures.length) {
  console.error('Active workstream validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('Active workstream validation passed: PR #225 is active; evidence traceability is complete.');
