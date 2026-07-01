import fs from 'node:fs';

function replaceOnce(path, oldValue, newValue) {
  const text = fs.readFileSync(path, 'utf8');
  const count = text.split(oldValue).length - 1;
  if (count !== 1) throw new Error(`${path}: expected one occurrence of ${JSON.stringify(oldValue)}, found ${count}`);
  fs.writeFileSync(path, text.replace(oldValue, newValue));
}

const roadmap = 'docs/roadmap.md';
replaceOnce(roadmap, 'Latest completed: PR #271 — representative all-family visual audit', 'Latest completed: PR #272 — accessibility, performance, and legacy cleanup');
replaceOnce(roadmap, 'Active: PR #272 — accessibility, performance, and legacy cleanup', 'Active: PR #273 — production verification and UI v3 closure');
replaceOnce(roadmap, 'Next: PR #273 — production verification and UI v3 closure', 'Next after UI closure: rebuild Growth D from latest main');
replaceOnce(roadmap, 'PR #271 representative all-family visual audit and Gate V3-F', 'PR #271 representative all-family visual audit and Gate V3-F\nPR #272 accessibility, performance, and legacy cleanup');
replaceOnce(roadmap, '### PR #272 — accessibility, performance, and legacy cleanup — active', '### PR #272 — accessibility, performance, and legacy cleanup — complete');
replaceOnce(roadmap, '### PR #273 — production verification and UI v3 closure', '### PR #273 — production verification and UI v3 closure — active');
replaceOnce(roadmap, 'Performance: PR #272 establishes measured source/build budgets and legacy-output guards', 'Performance: PR #272 established passing source/build budgets and legacy-output guards');

const plan = 'docs/ui-redesign/implementation-plan.md';
replaceOnce(plan, 'Completed through: PR #271 representative all-family visual audit', 'Completed through: PR #272 accessibility, performance, and legacy cleanup');
replaceOnce(plan, 'Active work item: PR #272 accessibility, performance, and legacy cleanup', 'Active work item: PR #273 production verification and closure');
replaceOnce(plan, 'Next implementation: PR #273 production verification and closure', 'Next after closure: rebuild Growth D from latest main');
replaceOnce(plan, '### PR #272 — accessibility, performance, and legacy cleanup', '### PR #272 — accessibility, performance, and legacy cleanup — complete');
replaceOnce(plan, '### PR #273 — production verification and closure', '### PR #273 — production verification and closure — active');
replaceOnce(plan, 'These are ceilings, not claims. Actual measurements must be recorded in the PR #272 audit before merge.', 'The PR #272 audit recorded 128,528 source-CSS bytes, 111,078 built-CSS bytes, 16,203 built-JavaScript bytes, 378 HTML files, zero warnings, and zero failures. The 48 final images were pixel-identical to the prior passing capture.');

const agents = 'AGENTS.md';
replaceOnce(agents, 'Latest completed: PR #271 representative all-family visual audit', 'Latest completed: PR #272 accessibility, performance, and legacy cleanup');
replaceOnce(agents, 'Active: PR #272 accessibility, performance, and legacy cleanup', 'Active: PR #273 production verification and UI v3 closure');
replaceOnce(agents, 'Next: PR #273 production verification and UI v3 closure', 'Next after closure: rebuild Growth D from latest main');
replaceOnce(agents, 'PR #272 removes only verified-unused v2 presentation assets, establishes build budgets, and proves no visual or accessibility regression. PR #273 remains the production closure step.', 'PR #272 removed only verified-unused v2 presentation assets, established passing build budgets, and proved pixel-identical rendering with no accessibility regression. PR #273 is now the active production closure step.');
replaceOnce(agents, 'PR #272 must rerun that baseline after removing the legacy layer.', 'PR #272 reran that baseline after removing the legacy layer and produced 48 pixel-identical images with zero rendered failures.');

const validator = 'scripts/validate-current-workstream.mjs';
replaceOnce(validator, "'Latest completed: PR #271 — representative all-family visual audit'", "'Latest completed: PR #272 — accessibility, performance, and legacy cleanup'");
replaceOnce(validator, "'Active: PR #272 — accessibility, performance, and legacy cleanup'", "'Active: PR #273 — production verification and UI v3 closure'");
replaceOnce(validator, "'Next: PR #273 — production verification and UI v3 closure'", "'Next after UI closure: rebuild Growth D from latest main'");
replaceOnce(validator, "'PR #272 — accessibility, performance, and legacy cleanup — active'", "'PR #272 — accessibility, performance, and legacy cleanup — complete'");
replaceOnce(validator, "'PR #273 — production verification and UI v3 closure'", "'PR #273 — production verification and UI v3 closure — active'");
replaceOnce(validator, "[agents, 'Latest completed: PR #271 representative all-family visual audit']", "[agents, 'Latest completed: PR #272 accessibility, performance, and legacy cleanup']");
replaceOnce(validator, "[agents, 'Active: PR #272 accessibility, performance, and legacy cleanup']", "[agents, 'Active: PR #273 production verification and UI v3 closure']");
replaceOnce(validator, "[agents, 'Next: PR #273 production verification and UI v3 closure']", "[agents, 'Next after closure: rebuild Growth D from latest main']");
replaceOnce(validator, "[uiPlan, 'Completed through: PR #271 representative all-family visual audit']", "[uiPlan, 'Completed through: PR #272 accessibility, performance, and legacy cleanup']");
replaceOnce(validator, "[uiPlan, 'Active work item: PR #272 accessibility, performance, and legacy cleanup']", "[uiPlan, 'Active work item: PR #273 production verification and closure']");
replaceOnce(validator, "[uiPlan, 'Next implementation: PR #273 production verification and closure']", "[uiPlan, 'Next after closure: rebuild Growth D from latest main']");
replaceOnce(validator, "[cleanupAudit, 'Canonical stable assets changed: 0']", "[cleanupAudit, 'Canonical stable assets changed: 0'],\n  [cleanupAudit, 'Status: passed'],\n  [cleanupAudit, 'Source CSS total | 128,528 bytes'],\n  [cleanupAudit, '0 changed images out of 48']");
replaceOnce(validator, "console.log('Current workstream valid: PR #271 and Gate V3-F are complete, PR #272 cleanup is active with measured build budgets and visual regression, PR #273 is next, 98 canonical assets are preserved, and production closure remains pending.');", "console.log('Current workstream valid: PR #272 cleanup is complete with passing measured budgets and pixel-identical visual regression, PR #273 production verification is active, 98 canonical assets are preserved, and Gate V3-G/V3-H remain pending.');");

console.log('Advanced canonical workstream documents from PR #272 to PR #273.');
