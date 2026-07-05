import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import {
  getContractIdentityState,
  getDeploymentCanonicalityRecordState,
  getDeploymentOperationalState,
  getDeploymentVerificationState,
  getNetworkIdentityState,
  getPublicDeploymentCategory
} from '../config/deployment-taxonomy.mjs';

const root = process.cwd();
const absolute = (file) => path.join(root, file);
const readJson = (file) => JSON.parse(fs.readFileSync(absolute(file), 'utf8'));
const readRows = (file) => {
  const parsed = readJson(file);
  const rows = Array.isArray(parsed) ? parsed : parsed.records;
  if (!Array.isArray(rows)) throw new Error(`${file}: expected array or records array`);
  return rows.map((row, index) => ({ ...row, __file: file, __index: index }));
};
const loadFiles = (files = []) => files.flatMap(readRows);
const unique = (values) => [...new Set((values ?? []).filter(Boolean))].sort();
const countBy = (values) => Object.fromEntries([...values.reduce((map, raw) => {
  const key = raw === null || raw === undefined || raw === '' ? 'unknown' : String(raw);
  map.set(key, (map.get(key) ?? 0) + 1);
  return map;
}, new Map()).entries()].sort(([a], [b]) => a.localeCompare(b)));
const normalizedIdentifier = (row) => {
  const value = row.deployment_identifier ?? row.contract_address;
  if (!value || ['source_review_needed', 'not_applicable_or_source_review_needed'].includes(value)) return null;
  const type = row.identifier_type ?? 'unspecified';
  const normalized = type === 'evm_contract' ? String(value).toLowerCase() : String(value);
  return `${String(row.chain ?? '').toLowerCase()}|${type}|${normalized}`;
};
const groupBy = (rows, keyFn) => {
  const map = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!key) continue;
    const list = map.get(key) ?? [];
    list.push(row);
    map.set(key, list);
  }
  return map;
};

const baseline = loadRegistryV2Baseline(root);
const stablecoins = loadFiles(baseline.data_groups?.stablecoins);
const organizations = loadFiles(baseline.data_groups?.organizations);
const evidence = loadFiles(baseline.data_groups?.evidence);
const events = loadFiles(baseline.data_groups?.events);
const deployments = loadFiles(baseline.data_groups?.deployments);
const verificationReview = readJson('data/deployment-verification-pr229.json');

const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));
const eventIds = new Set(events.map((row) => row.id));
const deploymentById = new Map();
const verificationById = new Map(
  Object.entries(verificationReview.status_ids ?? {}).flatMap(([status, ids]) => (ids ?? []).map((id) => [id, status]))
);
const critical = [];
const warnings = [];
const observations = [];
const records = [];

for (const row of deployments) {
  if (!row.id) {
    critical.push(`${row.__file}[${row.__index}]: deployment id missing`);
    continue;
  }
  if (deploymentById.has(row.id)) critical.push(`duplicate deployment id ${row.id}`);
  deploymentById.set(row.id, row);
  if (!stablecoinIds.has(row.stablecoin_id)) critical.push(`${row.id}: missing stablecoin ${row.stablecoin_id}`);
  if (!String(row.chain ?? '').trim()) critical.push(`${row.id}: chain missing`);
  if (!String(row.deployment_type ?? '').trim()) critical.push(`${row.id}: deployment_type missing`);
  if (!String(row.status ?? '').trim()) critical.push(`${row.id}: status missing`);
  if (row.bridge_operator_organization_id && !organizationIds.has(row.bridge_operator_organization_id)) critical.push(`${row.id}: missing bridge operator ${row.bridge_operator_organization_id}`);
  for (const id of row.evidence_ids ?? []) if (!evidenceIds.has(id)) critical.push(`${row.id}: missing evidence ${id}`);
  for (const id of row.control_event_ids ?? []) if (!eventIds.has(id)) critical.push(`${row.id}: missing control event ${id}`);
  const verificationStatus = verificationById.get(row.id) ?? row.verification_status ?? null;
  if (!verificationById.has(row.id)) critical.push(`${row.id}: verification overlay missing`);
  records.push({
    ...row,
    verification_status: verificationStatus,
    public_deployment_category: getPublicDeploymentCategory(row.deployment_type),
    operational_state: getDeploymentOperationalState(row.status),
    canonicality_record_state: getDeploymentCanonicalityRecordState(row.canonicality),
    verification_state: getDeploymentVerificationState({ ...row, verification_status: verificationStatus }),
    contract_identity_state: getContractIdentityState(row.contract_address, row.deployment_identifier),
    network_identity_state: getNetworkIdentityState(row.chain),
    normalized_identifier_key: normalizedIdentifier(row)
  });
}

for (const overlayId of verificationById.keys()) if (!deploymentById.has(overlayId)) critical.push(`verification overlay references missing deployment ${overlayId}`);
if (verificationById.size !== deployments.length) critical.push(`verification overlay covers ${verificationById.size} ids, expected ${deployments.length}`);
if (verificationReview.expected_total !== deployments.length) critical.push(`verification review expected_total ${verificationReview.expected_total} differs from ${deployments.length}`);

const duplicateIdentityGroups = [...groupBy(records, (row) => row.normalized_identifier_key).entries()]
  .filter(([, rows]) => rows.length > 1)
  .map(([key, rows]) => ({ key, deployment_ids: rows.map((row) => row.id).sort(), stablecoin_ids: unique(rows.map((row) => row.stablecoin_id)) }));
for (const group of duplicateIdentityGroups) {
  if (group.stablecoin_ids.length > 1) critical.push(`deployment identifier ${group.key} is shared across stablecoins ${group.stablecoin_ids.join(', ')}`);
  else warnings.push(`deployment identifier ${group.key} appears in multiple rows for ${group.stablecoin_ids[0]}`);
}

const invalidOriginRefs = [];
const selfOriginRefs = [];
const originAdjacency = new Map();
for (const row of records) {
  if (!row.origin_deployment_id) continue;
  if (row.origin_deployment_id === row.id) {
    selfOriginRefs.push(row.id);
    critical.push(`${row.id}: origin deployment references itself`);
    continue;
  }
  if (!deploymentById.has(row.origin_deployment_id)) {
    invalidOriginRefs.push({ deployment_id: row.id, origin_deployment_id: row.origin_deployment_id });
    critical.push(`${row.id}: missing origin deployment ${row.origin_deployment_id}`);
  }
  originAdjacency.set(row.id, row.origin_deployment_id);
}
const originCycles = [];
for (const start of originAdjacency.keys()) {
  const path = [];
  const seen = new Set();
  let current = start;
  while (originAdjacency.has(current)) {
    if (seen.has(current)) {
      const index = path.indexOf(current);
      originCycles.push([...path.slice(index), current]);
      break;
    }
    seen.add(current);
    path.push(current);
    current = originAdjacency.get(current);
  }
}
for (const cycle of originCycles) critical.push(`origin deployment cycle: ${cycle.join(' -> ')}`);

const primaryByStablecoin = groupBy(records.filter((row) => row.is_primary === true), (row) => row.stablecoin_id);
const duplicatePrimaryAssets = [...primaryByStablecoin.entries()].filter(([, rows]) => rows.length > 1).map(([id, rows]) => ({ stablecoin_id: id, deployment_ids: rows.map((row) => row.id).sort() }));
for (const row of duplicatePrimaryAssets) critical.push(`${row.stablecoin_id}: multiple primary deployments ${row.deployment_ids.join(', ')}`);

const stablecoinsWithoutDeployments = stablecoins.filter((coin) => !(groupBy(records, (row) => row.stablecoin_id).get(coin.id)?.length)).map((row) => row.id).sort();
const canonicalityNotRecorded = records.filter((row) => row.canonicality_record_state === 'not_recorded').map((row) => row.id).sort();
const verificationReviewNeeded = records.filter((row) => row.verification_state === 'review_needed').map((row) => row.id).sort();
const verificationNotRecorded = records.filter((row) => ['not_recorded', 'unknown'].includes(row.verification_state)).map((row) => row.id).sort();
const contractReviewNeeded = records.filter((row) => ['review_needed', 'not_applicable_or_review_unresolved'].includes(row.contract_identity_state)).map((row) => row.id).sort();
const identifiersNotRecorded = records.filter((row) => row.contract_identity_state === 'not_recorded').map((row) => row.id).sort();
const networkReviewNeeded = records.filter((row) => row.network_identity_state === 'review_needed').map((row) => row.id).sort();
const aggregateNetworkContext = records.filter((row) => row.network_identity_state === 'aggregate_context').map((row) => row.id).sort();
const unknownPublicCategory = records.filter((row) => row.public_deployment_category === 'unknown').map((row) => ({ id: row.id, deployment_type: row.deployment_type }));
const unknownOperationalState = records.filter((row) => row.operational_state === 'unknown').map((row) => ({ id: row.id, status: row.status }));
const freezeCapabilityNotRecorded = records.filter((row) => row.freeze_capability === null || row.freeze_capability === undefined).map((row) => row.id).sort();
const blacklistCapabilityNotRecorded = records.filter((row) => row.blacklist_capability === null || row.blacklist_capability === undefined).map((row) => row.id).sort();
const missingEvidenceIds = records.filter((row) => !Array.isArray(row.evidence_ids) || row.evidence_ids.length === 0).map((row) => row.id).sort();

if (unknownPublicCategory.length) critical.push(`${unknownPublicCategory.length} deployment types lack public category mapping`);
if (verificationReviewNeeded.length) critical.push(`${verificationReviewNeeded.length} deployment verification states remain review_needed after PR229 overlay`);
if (verificationNotRecorded.length) critical.push(`${verificationNotRecorded.length} deployment verification states remain not_recorded/unknown after PR229 overlay`);
if (networkReviewNeeded.length) warnings.push(`${networkReviewNeeded.length} deployments retain network review-needed state`);
if (missingEvidenceIds.length) critical.push(`${missingEvidenceIds.length} deployments have no evidence ids`);

const verificationStateCounts = countBy(records.map((row) => row.verification_state));
for (const [status, expected] of Object.entries(verificationReview.status_counts ?? {})) {
  const actual = verificationStateCounts[status] ?? 0;
  if (actual !== expected) critical.push(`verification status ${status}: expected ${expected}, got ${actual}`);
}

observations.push(`Audited ${records.length} deployments across ${new Set(records.map((row) => row.stablecoin_id)).size} stable assets and ${new Set(records.map((row) => row.chain)).size} recorded chain labels.`);
observations.push(`Verification overlay covers ${verificationById.size} deployment ids with no unreviewed verification state.`);
observations.push(`${identifiersNotRecorded.length} deployments are source-linked without a recorded contract or deployment identifier.`);
observations.push(`${freezeCapabilityNotRecorded.length} deployments have no freeze-capability value and ${blacklistCapabilityNotRecorded.length} have no blacklist-capability value.`);

const report = {
  schema_version: '1.0',
  audit_id: 'sog_registry_100_deployment_chain_identity_pr301',
  baseline_id: baseline.baseline_id,
  audited_counts: {
    stable_assets: stablecoins.length,
    deployments: records.length,
    stablecoins_with_deployments: new Set(records.map((row) => row.stablecoin_id)).size,
    chains_recorded: new Set(records.map((row) => row.chain)).size,
    verification_overlay_ids: verificationById.size
  },
  identity: {
    duplicate_identifier_groups: duplicateIdentityGroups,
    invalid_origin_refs: invalidOriginRefs,
    self_origin_refs: selfOriginRefs,
    origin_cycles: originCycles,
    duplicate_primary_assets: duplicatePrimaryAssets,
    stablecoins_without_deployments: stablecoinsWithoutDeployments
  },
  taxonomy: {
    canonicality_not_recorded: canonicalityNotRecorded,
    unknown_public_category: unknownPublicCategory,
    unknown_operational_state: unknownOperationalState,
    network_review_needed: networkReviewNeeded,
    aggregate_network_context: aggregateNetworkContext
  },
  verification: {
    state_counts: verificationStateCounts,
    review_needed: verificationReviewNeeded,
    not_recorded_or_unknown: verificationNotRecorded,
    contract_review_needed: contractReviewNeeded,
    identifiers_not_recorded: identifiersNotRecorded
  },
  control_capability: {
    freeze_not_recorded: freezeCapabilityNotRecorded,
    blacklist_not_recorded: blacklistCapabilityNotRecorded,
    records_with_control_events: records.filter((row) => Array.isArray(row.control_event_ids) && row.control_event_ids.length > 0).map((row) => row.id).sort()
  },
  evidence: {
    missing_evidence_ids: missingEvidenceIds
  },
  distributions: {
    chain: countBy(records.map((row) => row.chain)),
    public_deployment_category: countBy(records.map((row) => row.public_deployment_category)),
    canonicality: countBy(records.map((row) => row.canonicality ?? 'unknown')),
    operational_state: countBy(records.map((row) => row.operational_state)),
    verification_state: verificationStateCounts,
    contract_identity_state: countBy(records.map((row) => row.contract_identity_state)),
    network_identity_state: countBy(records.map((row) => row.network_identity_state)),
    freeze_capability: countBy(records.map((row) => row.freeze_capability)),
    blacklist_capability: countBy(records.map((row) => row.blacklist_capability))
  },
  findings: { critical, warnings, observations },
  result: critical.length === 0 ? 'pass_with_review_queues' : 'fail'
};

const lines = [
  '# SOG Deployment and Chain Identity Audit',
  '',
  `- Audit ID: \`${report.audit_id}\``,
  `- Deployments: **${records.length}**`,
  `- Stable assets with deployment rows: **${report.audited_counts.stablecoins_with_deployments}**`,
  `- Chain labels recorded: **${report.audited_counts.chains_recorded}**`,
  `- Critical findings: **${critical.length}**`,
  `- Review warnings: **${warnings.length}**`,
  '',
  '## Identity Integrity',
  '',
  `- Duplicate identifier groups: ${duplicateIdentityGroups.length}`,
  `- Invalid origin refs: ${invalidOriginRefs.length}`,
  `- Origin cycles: ${originCycles.length}`,
  `- Duplicate primary deployment assets: ${duplicatePrimaryAssets.length}`,
  `- Stable assets without deployment rows: ${stablecoinsWithoutDeployments.length}`,
  '',
  '## Verification and Taxonomy',
  '',
  `- Canonicality not recorded: ${canonicalityNotRecorded.length}`,
  `- Unknown public categories: ${unknownPublicCategory.length}`,
  `- Verification review-needed: ${verificationReviewNeeded.length}`,
  `- Verification not-recorded/unknown: ${verificationNotRecorded.length}`,
  `- Identifier not recorded: ${identifiersNotRecorded.length}`,
  `- Contract review-needed: ${contractReviewNeeded.length}`,
  `- Network review-needed: ${networkReviewNeeded.length}`,
  `- Aggregate network context: ${aggregateNetworkContext.length}`,
  '',
  '## Control Capability Coverage',
  '',
  `- Freeze capability not recorded: ${freezeCapabilityNotRecorded.length}`,
  `- Blacklist capability not recorded: ${blacklistCapabilityNotRecorded.length}`,
  '',
  '## Critical Findings',
  '',
  ...(critical.length ? critical.map((message) => `- ${message}`) : ['- None.']),
  '',
  '## Review Warnings',
  '',
  ...(warnings.length ? warnings.map((message) => `- ${message}`) : ['- None.']),
  '',
  '## Observations',
  '',
  ...observations.map((message) => `- ${message}`),
  '',
  '## Result',
  '',
  critical.length === 0
    ? 'PASS. Deployment identities, source references, verification overlay coverage, taxonomy mapping, and origin relationships are structurally valid. Missing identifiers and control-capability values remain explicit review queues.'
    : 'FAIL. Critical deployment or chain-identity findings must be resolved before PR #301 can close.',
  ''
];

const jsonPath = 'data/generated/registry-deployment-chain-identity-audit.json';
const markdownPath = 'docs/audits/registry-100-deployment-chain-identity-audit.md';
fs.mkdirSync(path.dirname(absolute(jsonPath)), { recursive: true });
fs.mkdirSync(path.dirname(absolute(markdownPath)), { recursive: true });
fs.writeFileSync(absolute(jsonPath), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(absolute(markdownPath), lines.join('\n'));

console.log(JSON.stringify({
  audit_id: report.audit_id,
  result: report.result,
  deployments: records.length,
  stablecoins_with_deployments: report.audited_counts.stablecoins_with_deployments,
  chains_recorded: report.audited_counts.chains_recorded,
  critical: critical.length,
  warnings: warnings.length,
  duplicate_identifier_groups: duplicateIdentityGroups.length,
  identifiers_not_recorded: identifiersNotRecorded.length,
  freeze_not_recorded: freezeCapabilityNotRecorded.length,
  blacklist_not_recorded: blacklistCapabilityNotRecorded.length
}, null, 2));

if (critical.length) process.exit(1);
