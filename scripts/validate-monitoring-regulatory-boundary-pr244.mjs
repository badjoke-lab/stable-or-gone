import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { validateOfficialSourceBaselines } from './monitoring/baselines/baseline-store.mjs';
import { validateOfficialSources } from './monitoring/monitors/official-source-observer.mjs';

const failures = [];
const fail = (message) => failures.push(message);
const sources = JSON.parse(fs.readFileSync('scripts/monitoring/sources/official-sources.json', 'utf8'));
const baselineSet = JSON.parse(fs.readFileSync('scripts/monitoring/baselines/official-source-baselines.json', 'utf8'));
const review = JSON.parse(fs.readFileSync('scripts/monitoring/sources/regulatory-source-review-pr244.json', 'utf8'));
const spec = fs.readFileSync('docs/quality/monitoring-regulatory-source-boundary-spec.md', 'utf8');
const observer = fs.readFileSync('scripts/monitoring/monitors/official-source-observer.mjs', 'utf8');

const newIds = [
  'cftc-tether-2021-order',
  'nydfs-gusd-product-approval',
  'nydfs-pax-usdp-product-approval',
  'nydfs-paxos-busd-notice',
  'sec-terraform-ust-2023-charges'
];
const priorIds = [
  'acala-ausd-aseed-migration', 'circle-mint', 'circle-transparency',
  'ethena-custodian-attestations', 'first-digital-fdusd-transparency',
  'gemini-gusd-dollar', 'gemini-gusd-redemption-support',
  'global-dollar-usdg-overview', 'liquity-lusd-v1-continuity',
  'paxos-busd-minting-halt', 'paxos-pax-usdp-rebrand',
  'paxos-pyusd-transparency', 'paxos-stablecoin-terms',
  'paxos-usdp-transparency', 'ripple-rlusd-overview',
  'sky-dai-usds-upgrade', 'tether-fees', 'tether-redemption-guide',
  'tether-transparency'
];
const regulatoryClasses = new Set([
  'final_order_or_settlement',
  'charges_or_complaint',
  'consumer_notice_and_supervisory_action',
  'product_authorization'
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
if (sources.length !== 24 || baselineSet.baselines.length !== 24) fail('PR #244 requires 24 sources and 24 baselines');
if (sourceById.size !== 24 || baselineById.size !== 24) fail('source or baseline IDs are duplicated');
if (JSON.stringify([...sourceById.keys()].sort()) !== JSON.stringify([...baselineById.keys()].sort())) fail('source and baseline IDs must match exactly');
if (JSON.stringify([...reviewById.keys()].sort()) !== JSON.stringify(newIds)) fail('PR #244 review source set mismatch');
for (const id of priorIds) if (!sourceById.has(id) || !baselineById.has(id)) fail(`${id}: prior source or baseline missing`);

const canonicalIndex = { stablecoinIds, organizationIds, relationships };
for (const message of validateOfficialSources(sources, canonicalIndex)) fail(message);
for (const message of validateOfficialSourceBaselines(baselineSet, sources)) fail(message);

for (const id of newIds) {
  const source = sourceById.get(id);
  const baseline = baselineById.get(id);
  const reviewed = reviewById.get(id);
  if (!source || !baseline || !reviewed) continue;
  if (JSON.stringify(source.signal_types) !== JSON.stringify(['regulatory_update'])) fail(`${id}: regulatory_update must be the only signal`);
  if (!regulatoryClasses.has(reviewed.regulatory_classification)) fail(`${id}: invalid regulatory classification`);
  if (!reviewed.authority?.trim() || !reviewed.jurisdiction?.trim()) fail(`${id}: authority and jurisdiction are required`);
  if (source.url !== reviewed.review_url || reviewed.decision !== 'approve_pending_baseline') fail(`${id}: review/config mismatch`);
  if (!reviewed.visible_signal_terms?.length) fail(`${id}: visible regulatory terms missing`);
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

const duplicateUrls = new Map();
for (const id of newIds) {
  const url = sourceById.get(id)?.url;
  if (!url) continue;
  duplicateUrls.set(url, [...(duplicateUrls.get(url) ?? []), id]);
}
const duplicates = [...duplicateUrls.entries()].filter(([, ids]) => ids.length > 1);
const expectedDuplicateIds = ['nydfs-gusd-product-approval', 'nydfs-pax-usdp-product-approval'];
if (duplicates.length !== 1 || JSON.stringify(duplicates[0][1].sort()) !== JSON.stringify(expectedDuplicateIds)) fail('duplicate URL boundary mismatch');

for (const key of [
  'charges_or_complaint_are_not_final_judgment',
  'notice_is_not_always_final_order',
  'product_authorization_is_not_safety_score',
  'jurisdiction_scope_is_not_global_asset_status',
  'issuer_enforcement_is_not_automatic_asset_failure',
  'regulatory_source_does_not_override_canonical_review'
]) if (review.interpretation_boundary?.[key] !== true) fail(`interpretation boundary missing: ${key}`);

for (const [key, expected] of Object.entries({
  raw_response_stored: false,
  baseline_status: 'pending_initial_acceptance',
  canonical_action: 'none',
  automatic_pull_request: false,
  public_output: false,
  production_publication: false
})) if (review.policy?.[key] !== expected) fail(`policy.${key} must be ${expected}`);

for (const keyword of ['regulatory_update', 'charges', 'approval', 'notice']) if (!observer.includes(keyword)) fail(`observer regulatory keyword missing: ${keyword}`);
for (const phrase of ['exactly five reviewed PR #244 sources are added', 'total configured sources and baselines equal 24', 'All nineteen sources present after PR #243 must remain enabled', 'No live response digest is committed in PR #244', 'No production deployment required']) if (!spec.includes(phrase)) fail(`spec missing: ${phrase}`);

if (failures.length) {
  console.error('PR #244 regulatory monitoring boundary validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('PR #244 regulatory boundary valid: five official authority sources, twenty-four pending baselines, and no canonical authority.');
