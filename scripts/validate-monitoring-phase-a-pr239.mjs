import fs from 'node:fs';

const failures = [];
const fail = (message) => failures.push(message);
const workflow = fs.readFileSync('.github/workflows/monitoring-review.yml', 'utf8');
const audit = fs.readFileSync('docs/quality/monitoring-phase-a-audit.md', 'utf8');
const baselineSet = JSON.parse(fs.readFileSync('scripts/monitoring/baselines/official-source-baselines.json', 'utf8'));
const proposalScript = fs.readFileSync('scripts/monitoring/baselines/prepare-baseline-update.mjs', 'utf8');

for (const token of ['workflow_dispatch:', 'contents: read', 'npm run monitor:review', 'actions/upload-artifact']) {
  if (!workflow.includes(token)) fail(`workflow missing ${token}`);
}
for (const token of [
  'schedule:',
  'pull_request:',
  'workflow_run:',
  'contents: write',
  'pull-requests: write',
  'deployments: write',
  'id-token: write',
  'wrangler',
  'CLOUDFLARE_',
  'git push'
]) {
  if (workflow.includes(token)) fail(`workflow contains prohibited ${token}`);
}
if (/^\s*push:/m.test(workflow)) fail('workflow must not use push trigger');

if (baselineSet.normalization_version !== 'sog_official_source_normalization_v2') fail('normalization version mismatch');
if (!Array.isArray(baselineSet.baselines) || baselineSet.baselines.length !== 4) fail('Phase A must retain exactly four baseline records');
if ((baselineSet.baselines ?? []).some((row) => row.status !== 'pending_initial_acceptance')) fail('Phase A must not silently accept a baseline');
for (const row of baselineSet.baselines ?? []) {
  for (const field of [
    'accepted_final_url',
    'body_sha256',
    'normalized_content_sha256',
    'content_type',
    'etag',
    'last_modified',
    'accepted_observed_at',
    'accepted_repository_commit',
    'accepted_review_reference'
  ]) {
    if (row[field] !== null) fail(`${row.source_id}: pending field ${field} must be null`);
  }
}

for (const phrase of [
  'Phase A is complete for the current four-source, review-only monitoring scope',
  'Automatic canonical writes: prohibited',
  'Automatic pull requests: prohibited',
  'Accepted baselines: 0',
  'Pending baselines: 4',
  'Production publication: prohibited'
]) {
  if (!audit.includes(phrase)) fail(`Phase A audit missing: ${phrase}`);
}

for (const phrase of [
  'normalization_version must match the repository baseline set',
  'repository_baseline_written: false',
  'automatic_pull_request: false',
  "canonical_action: 'none'",
  'production_publication: false'
]) {
  if (!proposalScript.includes(phrase)) fail(`baseline proposal safety check missing: ${phrase}`);
}

if (workflow.includes('prepare-baseline-update')) fail('monitoring workflow must not apply baseline proposals');

if (failures.length) {
  console.error('PR #239 monitoring Phase A closure validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('PR #239 monitoring Phase A closure valid: manual, read-only, pending-baseline, private, and non-publishing.');
