import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { validateOfficialSourceBaselines } from './monitoring/baselines/baseline-store.mjs';
import { validateOfficialSources } from './monitoring/monitors/official-source-observer.mjs';

const failures = [];
const fail = (message) => failures.push(message);
const sources = JSON.parse(fs.readFileSync('scripts/monitoring/sources/official-sources.json', 'utf8'));
const baselineSet = JSON.parse(fs.readFileSync('scripts/monitoring/baselines/official-source-baselines.json', 'utf8'));
const review = JSON.parse(fs.readFileSync('scripts/monitoring/sources/issuer-lifecycle-source-review-pr243.json', 'utf8'));
const spec = fs.readFileSync('docs/quality/monitoring-issuer-lifecycle-expansion-spec.md', 'utf8');
const observer = fs.readFileSync('scripts/monitoring/monitors/official-source-observer.mjs', 'utf8');

const newIds = [
  'acala-ausd-aseed-migration',
  'liquity-lusd-v1-continuity',
  'paxos-busd-minting-halt',
  'paxos-pax-usdp-rebrand',
  'sky-dai-usds-upgrade'
];
const priorIds = [
  'circle-mint', 'circle-transparency', 'ethena-custodian-attestations',
  'first-digital-fdusd-transparency', 'gemini-gusd-dollar',
  'gemini-gusd-redemption-support', 'global-dollar-usdg-overview',
  'paxos-pyusd-transparency', 'paxos-stablecoin-terms',
  'paxos-usdp-transparency', 'ripple-rlusd-overview', 'tether-fees',
  'tether-redemption-guide', 'tether-transparency'
];
const lifecycleClasses = new Set([
  'wind_down',
  'optional_reversible_upgrade',
  'migrated_same_identity',
  'parallel_successor_no_migration',
  'rebrand_same_identity'
]);
const nullFields = [
  'accepted_final_url', 'body_sha256', 'normalized_content_sha256',
  'content_type', 'etag', 'last_modified', 'accepted_observed_at',
  'accepted_repository_commit', 'accepted_review_reference'
];

function rows(relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8'));
  return Array.isArray(value) ? value : value.records ?? [];
}

const registry = loadRegistryV2Baseline(process.cwd());
const stablecoins = (registry.data_groups?.stablecoins ?? []).flatMap(rows);
const organizations = (registry.data_groups?.organizations ?? []).flatMap(rows);
const relationships = (registry.data_groups?.relationships ?? []).flatMap(rows);
const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const relationshipPairs = new Set(relationships.map((row) => `${row.stablecoin_id}|${row.organization_id}`));
const sourceById = new Map(sources.map((row) => [row.source_id, row]));
const baselineById = new Map(baselineSet.baselines.map((row) => [row.source_id, row]));
const reviewById = new Map(review.sources.map((row) => [row.source_id, row]));

if (stablecoins.length !== 92) fail(`stablecoin count must remain 92, found ${stablecoins.length}`);
if (sources.length !== 19 || baselineSet.baselines.length !== 19) fail('PR #243 requires 19 sources and 19 baselines');
if (sourceById.size !== 19 || baselineById.size !== 19) fail('source or baseline IDs are duplicated');
if (JSON.stringify([...sourceById.keys()].sort()) !== JSON.stringify([...baselineById.keys()].sort())) fail('source and baseline IDs must match exactly');
if (JSON.stringify([...reviewById.keys()].sort()) !== JSON.stringify(newIds)) fail('PR #243 review source set mismatch');
for (const id of priorIds) if (!sourceById.has(id) || !baselineById.has(id)) fail(`${id}: prior source or baseline missing`);

const canonicalIndex = { stablecoinIds, organizationIds, relationships };
for (const message of validateOfficialSources(sources, canonicalIndex)) fail(message);
for (const message of validateOfficialSourceBaselines(baselineSet, sources)) fail(message);

for (const id of newIds) {
  const source = sourceById.get(id);
  const baseline = baselineById.get(id);
  const reviewed = reviewById.get(id);
  if (!source || !baseline || !reviewed) continue;
  if (JSON.stringify(source.signal_types) !== JSON.stringify(['lifecycle_update'])) fail(`${id}: lifecycle_update must be the only signal`);
  if (!lifecycleClasses.has(reviewed.lifecycle_classification)) fail(`${id}: invalid lifecycle classification`);
  if (source.url !== reviewed.review_url || reviewed.decision !== 'approve_pending_baseline') fail(`${id}: review/config mismatch`);
  if (!reviewed.visible_signal_terms?.length) fail(`${id}: visible lifecycle terms missing`);
  const configured = new URL(source.url);
  const final = new URL(reviewed.final_url);
  if (configured.protocol !== 'https:' || final.protocol !== 'https:') fail(`${id}: HTTPS required`);
  if (reviewed.final_host !== final.hostname || !source.allowed_hosts.includes(configured.hostname) || !source.allowed_hosts.includes(final.hostname)) fail(`${id}: host review failed`);
  for (const stablecoinId of source.affected_stablecoin_ids) {
    if (!stablecoinIds.has(stablecoinId)) fail(`${id}: unknown stablecoin ${stablecoinId}`);
    for (const organizationId of source.affected_organization_ids) {
      if (!organizationIds.has(organizationId) || !relationshipPairs.has(`${stablecoinId}|${organizationId}`)) fail(`${id}: canonical relationship missing`);
    }
  }
  if (baseline.status !== 'pending_initial_acceptance' || baseline.source_url !== source.url) fail(`${id}: pending baseline mismatch`);
  for (const field of nullFields) if (baseline[field] !== null) fail(`${id}: ${field} must be null`);
}

for (const key of [
  'issuer_announcement_is_not_automatic_asset_status_change',
  'optional_upgrade_is_not_discontinuation',
  'parallel_successor_is_not_migration',
  'proposal_is_not_implementation',
  'rebrand_preserves_identity_unless_evidence_says_otherwise',
  'documentation_is_not_fresh_execution_proof'
]) if (review.interpretation_boundary?.[key] !== true) fail(`interpretation boundary missing: ${key}`);

for (const [key, expected] of Object.entries({
  raw_response_stored: false,
  baseline_status: 'pending_initial_acceptance',
  canonical_action: 'none',
  automatic_pull_request: false,
  public_output: false,
  production_publication: false
})) if (review.policy?.[key] !== expected) fail(`policy.${key} must be ${expected}`);

for (const keyword of ['lifecycle_update', 'halt minting', 'here to stay', 'now be known as']) if (!observer.includes(keyword)) fail(`observer lifecycle keyword missing: ${keyword}`);
for (const phrase of ['exactly five reviewed PR #243 sources are added', 'All fourteen sources present after PR #242 must remain enabled', 'No live response digest is committed in PR #243', 'No production deployment required']) if (!spec.includes(phrase)) fail(`spec missing: ${phrase}`);

if (failures.length) {
  console.error('PR #243 issuer lifecycle validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('PR #243 issuer lifecycle expansion valid: five distinct lifecycle sources, nineteen pending baselines, and no canonical authority.');
