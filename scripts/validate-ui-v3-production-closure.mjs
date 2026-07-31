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
const productionSmoke = read('scripts/check-production.mjs');

for (const marker of [
  'pull_request:',
  '- main',
  'github.event.pull_request.head.sha',
  'https://www.stableorgone.com',
  'node scripts/validate-ui-v3-production-closure.mjs',
  'npm run check:production',
  '--device desktop',
  '--device mobile',
  'audit-representative-visuals.mjs',
  'node scripts/write-ui-v3-production-closure-report.mjs',
  'ui-v3-production-closure.json',
  'ui-v3-production-closure.md',
  'retention-days: 90',
  "'scripts/check-production.mjs'"
]) check(workflow.includes(marker), `production closure workflow marker missing: ${marker}`);

for (const marker of [
  'immutable_release_commit',
  'production commit',
  'canonical_data_hash',
  'primary_records !== 98',
  'canonical_only',
  'includes_unreviewed_candidates',
  'includes_internal_monitoring',
  'includes_private_notes',
  'captured_routes !== 24',
  "gate: 'V3-G'",
  "gate: 'V3-H'",
  "status: 'passed'",
  'ui-v3-production-closure.json',
  'ui-v3-production-closure.md'
]) check(report.includes(marker), `closure report marker missing: ${marker}`);

for (const marker of [
  '${counts.primary_records} stable assets',
  '${breakdown.organizations} organizations',
  '${counts.events} events',
  '${breakdown.evidence_source_identities} Source identities',
  'initialStablecoinRangeEnd = Math.min(20, counts.primary_records)',
  '1–${initialStablecoinRangeEnd} of ${counts.primary_records} records',
  '20 per page',
  'Identity and current state',
  'Organizations and control',
  'How the asset works',
  'Reserve and redemption',
  'Deployments and legal context',
  'History',
  'Evidence',
  'Known unknowns and coverage'
]) check(productionSmoke.includes(marker), `production smoke v3 marker missing: ${marker}`);
for (const marker of [
  'Stablecoins ${counts.primary_records}',
  'Sources ${counts.evidence}',
  'Records ${counts.primary_records}',
  '${counts.primary_records} of ${counts.primary_records} records',
  'Redemption profile',
  'Reserve and attestation history',
  'Regulatory and official notices',
  'Blockchain deployments'
]) check(!productionSmoke.includes(marker), `superseded production smoke marker remains: ${marker}`);

for (const marker of [
  'Production workflow: .github/workflows/deploy-production.yml',
  'Automatic main publication: enabled',
  'verify the deployed commit',
  'machine-readable and public outputs remain internally consistent'
]) check(policy.includes(marker), `deployment policy marker missing: ${marker}`);
for (const marker of ['push:', '- main', 'pages deploy dist', 'SOG_EXPECTED_COMMIT', 'npm run check:production']) check(deploy.includes(marker), `production deployment workflow marker missing: ${marker}`);
for (const marker of ['Roadmap item: PR #273', 'Gate V3-G', 'Gate V3-H', 'exact immutable commit', 'Production representative screenshots', 'Canonical stable assets changed: 0']) check(audit.includes(marker), `closure audit document missing: ${marker}`);
for (const marker of ['Active: PR #273 — production verification and UI v3 closure', 'Gate V3-G: pending exact release-candidate approval', 'Gate V3-H: pending production commit and public parity verification']) check(roadmap.includes(marker), `roadmap closure marker missing: ${marker}`);
for (const marker of ['Active work item: PR #273 production verification and closure', 'Gate V3-G: pending exact release-candidate approval', 'Gate V3-H: pending production commit and public parity verification']) check(plan.includes(marker), `implementation plan closure marker missing: ${marker}`);
for (const marker of ['Active: PR #273 production verification and UI v3 closure', 'Gate V3-G: pending exact release-candidate approval', 'Gate V3-H: pending production commit and public parity verification']) check(agents.includes(marker), `AGENTS closure marker missing: ${marker}`);

const result = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  release_strategy: 'fast_forward_exact_pr_head',
  gates: { V3_G: 'pending_fast_forward', V3_H: 'pending_production_verification' },
  failures
};
fs.mkdirSync('artifacts', { recursive: true });
fs.writeFileSync('artifacts/ui-v3-production-closure-validation.json', `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (failures.length) process.exit(1);
