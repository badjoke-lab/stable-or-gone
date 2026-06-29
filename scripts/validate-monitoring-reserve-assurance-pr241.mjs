import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { validateOfficialSourceBaselines } from './monitoring/baselines/baseline-store.mjs';
import { validateOfficialSources } from './monitoring/monitors/official-source-observer.mjs';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);
const sources = JSON.parse(fs.readFileSync('scripts/monitoring/sources/official-sources.json', 'utf8'));
const baselineSet = JSON.parse(fs.readFileSync('scripts/monitoring/baselines/official-source-baselines.json', 'utf8'));
const review = JSON.parse(fs.readFileSync('scripts/monitoring/sources/reserve-assurance-source-review-pr241.json', 'utf8'));
const workflow = fs.readFileSync('.github/workflows/monitoring-review.yml', 'utf8');
const spec = fs.readFileSync('docs/quality/monitoring-reserve-assurance-expansion-spec.md', 'utf8');

const expectedNewSourceIds = [
  'first-digital-fdusd-transparency',
  'gemini-gusd-dollar',
  'global-dollar-usdg-overview',
  'paxos-usdp-transparency',
  'ripple-rlusd-overview'
];
const originalSourceIds = [
  'circle-transparency',
  'ethena-custodian-attestations',
  'paxos-pyusd-transparency',
  'tether-transparency'
];
const allowedSignalTypes = new Set(['reserve_update', 'assurance_update', 'backing_attestation_update']);
const acceptedFields = [
  'accepted_final_url',
  'body_sha256',
  'normalized_content_sha256',
  'content_type',
  'etag',
  'last_modified',
  'accepted_observed_at',
  'accepted_repository_commit',
  'accepted_review_reference'
];

function readRows(relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  return Array.isArray(value) ? value : value.records ?? [];
}

function loadGroup(baseline, group) {
  return (baseline.data_groups?.[group] ?? []).flatMap(readRows);
}

const registry = loadRegistryV2Baseline(root);
const stablecoins = loadGroup(registry, 'stablecoins');
const organizations = loadGroup(registry, 'organizations');
const relationships = loadGroup(registry, 'relationships');
const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const relationshipPairs = new Set(relationships.map((row) => `${row.stablecoin_id}|${row.organization_id}`));

if (stablecoins.length !== 92) fail(`stablecoin count must remain 92, found ${stablecoins.length}`);
if (!Array.isArray(sources) || sources.length !== 9) fail(`expected 9 enabled sources after PR #241, found ${sources.length}`);
if (!Array.isArray(baselineSet.baselines) || baselineSet.baselines.length !== 9) fail(`expected 9 baselines after PR #241, found ${baselineSet.baselines?.length}`);
if (review.schema_version !== '1.0') fail('review schema_version must be 1.0');
if (review.review_id !== 'sog_reserve_assurance_source_review_pr241') fail('review_id mismatch');
if (review.normalization_version !== baselineSet.normalization_version) fail('review normalization version must match baseline set');
if (review.scope !== 'reserve_and_assurance_source_expansion') fail('review scope mismatch');
if (!Array.isArray(review.sources) || review.sources.length !== 5) fail('review must contain exactly five sources');

const sourceById = new Map();
for (const source of sources) {
  if (!source?.source_id || sourceById.has(source.source_id)) fail(`${source?.source_id ?? 'unknown'}: source_id missing or duplicated`);
  else sourceById.set(source.source_id, source);
}
const baselineById = new Map();
for (const baseline of baselineSet.baselines ?? []) {
  if (!baseline?.source_id || baselineById.has(baseline.source_id)) fail(`${baseline?.source_id ?? 'unknown'}: baseline source_id missing or duplicated`);
  else baselineById.set(baseline.source_id, baseline);
}
const reviewById = new Map();
for (const row of review.sources ?? []) {
  if (!row?.source_id || reviewById.has(row.source_id)) fail(`${row?.source_id ?? 'unknown'}: review source_id missing or duplicated`);
  else reviewById.set(row.source_id, row);
}

if (JSON.stringify([...sourceById.keys()].sort()) !== JSON.stringify([...baselineById.keys()].sort())) {
  fail('source and baseline IDs must match exactly');
}
if (JSON.stringify([...reviewById.keys()].sort()) !== JSON.stringify(expectedNewSourceIds)) {
  fail(`reviewed new source IDs mismatch: ${[...reviewById.keys()].sort().join(', ')}`);
}
for (const sourceId of originalSourceIds) {
  if (!sourceById.has(sourceId)) fail(`${sourceId}: original Phase A source missing`);
  if (!baselineById.has(sourceId)) fail(`${sourceId}: original Phase A baseline missing`);
}

const canonicalIndex = {
  stablecoinIds,
  organizationIds,
  relationships
};
for (const message of validateOfficialSources(sources, canonicalIndex)) fail(`official source validator: ${message}`);
for (const message of validateOfficialSourceBaselines(baselineSet, sources)) fail(`baseline validator: ${message}`);

for (const sourceId of expectedNewSourceIds) {
  const source = sourceById.get(sourceId);
  const baseline = baselineById.get(sourceId);
  const reviewed = reviewById.get(sourceId);
  if (!source || !baseline || !reviewed) continue;

  if (source.enabled !== true) fail(`${sourceId}: source must be enabled`);
  if (reviewed.review_url !== source.url) fail(`${sourceId}: review URL must equal configured URL`);
  if (reviewed.decision !== 'approve_pending_baseline') fail(`${sourceId}: review decision must approve a pending baseline only`);
  if (reviewed.content_type !== 'text/html') fail(`${sourceId}: reviewed content type must be text/html`);
  if (!Array.isArray(reviewed.visible_signal_terms) || reviewed.visible_signal_terms.length === 0) fail(`${sourceId}: visible signal terms are required`);
  if (JSON.stringify(reviewed.affected_stablecoin_ids) !== JSON.stringify(source.affected_stablecoin_ids)) fail(`${sourceId}: reviewed stablecoin targets mismatch`);
  if (JSON.stringify(reviewed.affected_organization_ids) !== JSON.stringify(source.affected_organization_ids)) fail(`${sourceId}: reviewed organization targets mismatch`);

  let configuredUrl;
  let finalUrl;
  try {
    configuredUrl = new URL(source.url);
    finalUrl = new URL(reviewed.final_url);
  } catch {
    fail(`${sourceId}: configured or final URL is invalid`);
    continue;
  }
  if (configuredUrl.protocol !== 'https:' || finalUrl.protocol !== 'https:') fail(`${sourceId}: configured and final URLs must use HTTPS`);
  if (reviewed.final_host !== finalUrl.hostname) fail(`${sourceId}: final_host must equal final URL hostname`);
  if (!source.allowed_hosts.includes(configuredUrl.hostname)) fail(`${sourceId}: configured host is not allowlisted`);
  if (!source.allowed_hosts.includes(finalUrl.hostname)) fail(`${sourceId}: reviewed final host is not allowlisted`);

  for (const stablecoinId of source.affected_stablecoin_ids ?? []) {
    if (!stablecoinIds.has(stablecoinId)) fail(`${sourceId}: unknown stablecoin ${stablecoinId}`);
    for (const organizationId of source.affected_organization_ids ?? []) {
      if (!organizationIds.has(organizationId)) fail(`${sourceId}: unknown organization ${organizationId}`);
      if (!relationshipPairs.has(`${stablecoinId}|${organizationId}`)) fail(`${sourceId}: missing canonical relationship ${stablecoinId}|${organizationId}`);
    }
  }
  for (const signalType of source.signal_types ?? []) {
    if (!allowedSignalTypes.has(signalType)) fail(`${sourceId}: signal type is outside reserve/assurance scope: ${signalType}`);
  }

  if (baseline.source_url !== source.url) fail(`${sourceId}: baseline URL mismatch`);
  if (baseline.status !== 'pending_initial_acceptance') fail(`${sourceId}: baseline must remain pending`);
  for (const field of acceptedFields) {
    if (baseline[field] !== null) fail(`${sourceId}: pending baseline field ${field} must be null`);
  }
}

const expectedPolicy = {
  raw_response_stored: false,
  baseline_status: 'pending_initial_acceptance',
  canonical_action: 'none',
  automatic_pull_request: false,
  public_output: false,
  production_publication: false
};
for (const [key, expected] of Object.entries(expectedPolicy)) {
  if (review.policy?.[key] !== expected) fail(`review policy.${key} must be ${expected}`);
}

for (const token of ['workflow_dispatch:', 'contents: read']) {
  if (!workflow.includes(token)) fail(`workflow missing ${token}`);
}
for (const token of ['schedule:', 'contents: write', 'pull-requests: write', 'wrangler', 'CLOUDFLARE_']) {
  if (workflow.includes(token)) fail(`workflow contains prohibited ${token}`);
}

for (const phrase of [
  'expands review-only official-source monitoring',
  'exactly five reviewed sources are added',
  'keep that baseline `pending_initial_acceptance`',
  'No live response digest is committed in PR #241',
  'The four Phase A sources remain unchanged',
  'No production deployment required'
]) {
  if (!spec.includes(phrase)) fail(`PR #241 specification missing: ${phrase}`);
}

if (failures.length) {
  console.error('PR #241 reserve and assurance source validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('PR #241 reserve and assurance expansion valid: five reviewed sources added with pending baselines, canonical relationships, and no publication authority.');
