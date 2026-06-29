import fs from 'node:fs';

const failures = [];
const fail = (message) => failures.push(message);
const workflow = fs.readFileSync('.github/workflows/monitoring-review.yml', 'utf8');
const audit = fs.readFileSync('docs/quality/monitoring-phase-a-audit.md', 'utf8');
const sources = JSON.parse(fs.readFileSync('scripts/monitoring/sources/official-sources.json', 'utf8'));
const baselineSet = JSON.parse(fs.readFileSync('scripts/monitoring/baselines/official-source-baselines.json', 'utf8'));
const proposalScript = fs.readFileSync('scripts/monitoring/baselines/prepare-baseline-update.mjs', 'utf8');

const protectedPhaseASources = {
  'tether-transparency': {
    url: 'https://tether.to/en/transparency/',
    allowed_hosts: ['tether.to', 'www.tether.to'],
    affected_stablecoin_ids: ['sog_st_usdt'],
    affected_organization_ids: ['sog_issuer_tether'],
    signal_types: ['reserve_update', 'assurance_update']
  },
  'circle-transparency': {
    url: 'https://www.circle.com/transparency',
    allowed_hosts: ['circle.com', 'www.circle.com'],
    affected_stablecoin_ids: ['sog_st_usdc', 'sog_st_eurc'],
    affected_organization_ids: ['sog_issuer_circle'],
    signal_types: ['reserve_update', 'issuance_redemption_update', 'assurance_update']
  },
  'paxos-pyusd-transparency': {
    url: 'https://www.paxos.com/pyusd-transparency',
    allowed_hosts: ['paxos.com', 'www.paxos.com'],
    affected_stablecoin_ids: ['sog_st_pyusd'],
    affected_organization_ids: ['sog_issuer_paxos'],
    signal_types: ['reserve_update', 'assurance_update']
  },
  'ethena-custodian-attestations': {
    url: 'https://docs.ethena.fi/resources/custodian-attestations',
    allowed_hosts: ['docs.ethena.fi'],
    affected_stablecoin_ids: ['sog_st_usde', 'sog_st_susde'],
    affected_organization_ids: ['sog_issuer_ethena_labs'],
    signal_types: ['backing_attestation_update', 'reserve_update']
  }
};

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
if (!Array.isArray(sources) || sources.length < 4) fail('monitoring source set must retain the original four sources');
if (!Array.isArray(baselineSet.baselines)) fail('baseline records must be an array');

const sourceById = new Map();
for (const source of sources ?? []) {
  if (!source?.source_id || sourceById.has(source.source_id)) fail(`${source?.source_id ?? 'unknown'}: source_id missing or duplicated`);
  else sourceById.set(source.source_id, source);
}
const baselineById = new Map();
for (const baseline of baselineSet.baselines ?? []) {
  if (!baseline?.source_id || baselineById.has(baseline.source_id)) fail(`${baseline?.source_id ?? 'unknown'}: baseline source_id missing or duplicated`);
  else baselineById.set(baseline.source_id, baseline);
}
if (JSON.stringify([...sourceById.keys()].sort()) !== JSON.stringify([...baselineById.keys()].sort())) {
  fail('enabled source IDs and baseline source IDs must match exactly');
}

for (const [sourceId, expected] of Object.entries(protectedPhaseASources)) {
  const source = sourceById.get(sourceId);
  const baseline = baselineById.get(sourceId);
  if (!source) {
    fail(`${sourceId}: protected Phase A source is missing`);
    continue;
  }
  if (!baseline) fail(`${sourceId}: protected Phase A baseline is missing`);
  for (const key of ['url', 'allowed_hosts', 'affected_stablecoin_ids', 'affected_organization_ids', 'signal_types']) {
    if (JSON.stringify(source[key]) !== JSON.stringify(expected[key])) fail(`${sourceId}: protected field changed: ${key}`);
  }
  if (source.enabled !== true) fail(`${sourceId}: protected source must remain enabled`);
}

if ((baselineSet.baselines ?? []).some((row) => row.status !== 'pending_initial_acceptance')) fail('current source expansion must not silently accept a baseline');
for (const row of baselineSet.baselines ?? []) {
  const source = sourceById.get(row.source_id);
  if (source && row.source_url !== source.url) fail(`${row.source_id}: baseline URL must match source URL`);
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
  console.error('PR #239 monitoring Phase A safety invariants failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`PR #239 safety invariants valid: ${sources.length} sources preserve the protected Phase A core and remain pending, private, read-only, and non-publishing.`);
