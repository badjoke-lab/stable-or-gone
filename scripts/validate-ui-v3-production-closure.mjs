import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const failures = [];
const check = (value, message) => { if (!value) failures.push(message); };

const workflow = read('.github/workflows/ui-v3-production-closure.yml');
const report = read('scripts/write-ui-v3-production-closure-report.mjs');
const deploy = read('.github/workflows/deploy-production.yml');
const policy = read('docs/deployment-policy.md');
const audit = read('docs/audits/ui-v3-production-closure-2026-07-02.md');
const roadmap = read('docs/roadmap.md');
const plan = read('docs/ui-redesign/implementation-plan.md');
const agents = read('AGENTS.md');
const packageJson = read('package.json');

for (const marker of [
  'pull_request:',
  'push:',
  '- main',
  'https://sog.badjoke-lab.com',
  'npm run check:production',
  '--device desktop',
  '--device mobile',
  'audit-representative-visuals.mjs',
  'write-ui-v3-production-closure-report.mjs',
  'ui-v3/production-closure',
  'ui-v3-closed-',
  'gh pr comment 273',
  'ui-v3-production-closure.json',
  'ui-v3-production-closure.md'
]) check(workflow.includes(marker), `production closure workflow marker missing: ${marker}`);

for (const marker of [
  "phase === 'postmerge'",
  'production commit',
  'canonical_data_hash',
  'primary_records !== 98',
  'canonical_only',
  'includes_unreviewed_candidates',
  'captured_routes !== 24',
  'Gate V3-G',
  'Gate V3-H',
  'ui-v3-production-closure.json',
  'ui-v3-production-closure.md'
]) check(report.includes(marker), `closure report marker missing: ${marker}`);

for (const marker of [
  'Production workflow: .github/workflows/deploy-production.yml',
  'Automatic main publication: enabled',
  'verify the deployed commit',
  'machine-readable and public outputs remain internally consistent'
]) check(policy.includes(marker), `deployment policy marker missing: ${marker}`);
for (const marker of ['push:', '- main', 'pages deploy dist', 'SOG_EXPECTED_COMMIT', 'npm run check:production']) check(deploy.includes(marker), `production deployment workflow marker missing: ${marker}`);
for (const marker of ['Roadmap item: PR #273', 'Gate V3-G', 'Gate V3-H', 'immutable release tag', 'production representative screenshots', 'Canonical stable assets changed: 0']) check(audit.includes(marker), `closure audit document missing: ${marker}`);
for (const marker of ['Active: PR #273 — production verification and UI v3 closure', 'Gate V3-G: pending exact release-candidate approval', 'Gate V3-H: pending production commit and public parity verification']) check(roadmap.includes(marker), `roadmap closure marker missing: ${marker}`);
for (const marker of ['Active work item: PR #273 production verification and closure', 'Gate V3-G: pending exact release-candidate approval', 'Gate V3-H: pending production commit and public parity verification']) check(plan.includes(marker), `implementation plan closure marker missing: ${marker}`);
for (const marker of ['Active: PR #273 production verification and UI v3 closure', 'Gate V3-G: pending exact release-candidate approval', 'Gate V3-H: pending production commit and public parity verification']) check(agents.includes(marker), `AGENTS closure marker missing: ${marker}`);
check(packageJson.includes('"validate:ui-v3-production-closure"'), 'package production closure validator command missing');
check(packageJson.includes('"report:ui-v3-production-closure"'), 'package production closure report command missing');

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  gates: { V3_G: 'pending_merge_authorization', V3_H: 'pending_postmerge_verification' },
  failures
};
fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/ui-v3-production-closure-validation.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
