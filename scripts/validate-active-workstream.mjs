import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const requireText = (file, phrases) => {
  if (!fs.existsSync(path.join(root, file))) {
    failures.push(`missing active-workstream file: ${file}`);
    return;
  }
  const text = read(file);
  for (const phrase of phrases) {
    if (!text.includes(phrase)) failures.push(`${file} is missing: ${phrase}`);
  }
};

requireText('AGENTS.md', [
  'docs/quality/non-ui-quality-program.md',
  'Gate V2-F is not passed',
  'Routine growth beyond 92 canonical stable assets is paused'
]);

requireText('docs/spec-governance.md', [
  'docs/quality/non-ui-quality-program.md',
  'the binding workstream is the non-UI quality program',
  'The UI program is paused after PR #216'
]);

requireText('docs/roadmap.md', [
  'Latest completed work: PR #218',
  'Active work: PR #219',
  'Next work: PR #220',
  'Gate V2-F: deferred and not passed',
  'Routine record growth: paused at 92 assets',
  'Missing canonical launch dates:           19 after PR #219'
]);

requireText('docs/ui-redesign/implementation-plan.md', [
  'canonical implementation schedule — paused',
  'Completed through: PR #216',
  'Detailed owner visual review: deferred',
  'Gate V2-F: not passed'
]);

requireText('docs/deployment-policy.md', [
  'Current publication state: paused during the quality and UI repair programs',
  'docs/quality/non-ui-quality-program.md',
  'No release candidate is currently selected'
]);

requireText('docs/quality/non-ui-quality-program.md', [
  'Status: canonical implementation plan',
  'PR #219–#220 — launch-date boundary-conflict groups',
  'Gate V2-F remains pending'
]);

const roadmap = read('docs/roadmap.md');
if (/Gate V2-F:\s*passed/i.test(roadmap)) failures.push('roadmap must not mark Gate V2-F as passed');
if (/Active work:\s*PR #21[78]/i.test(roadmap)) failures.push('roadmap still points to a completed work item');
if (!roadmap.includes('GYEN to `2021-03-01`')) failures.push('roadmap is missing the PR #219 GYEN resolution');

if (failures.length) {
  console.error('Active workstream validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Active workstream validation passed: PR #219 is active, GYEN is resolved, and UI Gate V2-F remains deferred.');
