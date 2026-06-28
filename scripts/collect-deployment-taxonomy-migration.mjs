import fs from 'node:fs';
import path from 'node:path';
import {
  getContractIdentityState,
  getDeploymentCanonicalityRecordState,
  getDeploymentChangeState,
  getDeploymentOperationalState,
  getDeploymentVerificationState,
  getNetworkIdentityState,
  getPublicDeploymentCategory
} from '../config/deployment-taxonomy.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baseline = loadRegistryV2Baseline(root);
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const verificationReview = read('data/deployment-verification-pr229.json');
const verificationById = new Map(
  Object.entries(verificationReview.status_ids ?? {}).flatMap(([status, ids]) =>
    (ids ?? []).map((id) => [id, status])
  )
);
const rows = (baseline.data_groups.deployments ?? []).flatMap((file) =>
  read(file).map((row) => ({
    ...row,
    verification_status: verificationById.get(row.id) ?? row.verification_status,
    __file: file
  }))
);

function countBy(sourceRows, getter) {
  const counts = new Map();
  for (const row of sourceRows) {
    const raw = getter(row);
    const values = Array.isArray(raw) ? raw : [raw];
    for (const value of values) {
      const key = value === null || value === undefined || value === '' ? 'not_recorded' : String(value);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return Object.fromEntries([...counts].sort(([a], [b]) => a.localeCompare(b)));
}

const records = rows.map((row) => {
  const contractIdentityState = getContractIdentityState(row.contract_address, row.deployment_identifier);
  return {
    id: row.id,
    file: row.__file,
    stablecoin_id: row.stablecoin_id ?? null,
    chain: row.chain ?? null,
    network_identity_state: getNetworkIdentityState(row.chain),
    token_standard: row.token_standard ?? null,
    deployment_type: row.deployment_type ?? null,
    public_deployment_category: getPublicDeploymentCategory(row.deployment_type),
    status: row.status ?? null,
    operational_state: getDeploymentOperationalState(row.status),
    change_state: getDeploymentChangeState(row.status),
    canonicality: row.canonicality ?? 'unknown',
    canonicality_record_state: getDeploymentCanonicalityRecordState(row.canonicality),
    verification_status: row.verification_status ?? null,
    verification_state: getDeploymentVerificationState(row),
    identifier_type: row.identifier_type ?? null,
    deployment_identifier: row.deployment_identifier ?? row.contract_address ?? null,
    contract_address: row.contract_address ?? null,
    contract_identity_state: contractIdentityState,
    freeze_capability: row.freeze_capability ?? null,
    blacklist_capability: row.blacklist_capability ?? null,
    control_event_count: Array.isArray(row.control_event_ids) ? row.control_event_ids.length : 0,
    evidence_count: Array.isArray(row.evidence_ids) ? row.evidence_ids.length : 0,
    issues: [
      !row.id ? 'missing_id' : null,
      !row.stablecoin_id ? 'missing_stablecoin_id' : null,
      !row.chain ? 'missing_chain' : null,
      !row.deployment_type ? 'missing_deployment_type' : null,
      !row.status ? 'missing_status' : null,
      row.canonicality === undefined ? 'canonicality_not_recorded' : null,
      row.verification_status === undefined && !verificationById.has(row.id) ? 'verification_status_not_recorded' : null,
      contractIdentityState === 'review_needed' || contractIdentityState === 'not_applicable_or_review_unresolved' ? 'contract_review_needed' : null,
      !Array.isArray(row.evidence_ids) || row.evidence_ids.length === 0 ? 'missing_evidence_ids' : null
    ].filter(Boolean)
  };
});

const idCounts = new Map();
for (const row of records) idCounts.set(row.id, (idCounts.get(row.id) ?? 0) + 1);
const issueCounts = {};
for (const issue of records.flatMap((row) => row.issues)) issueCounts[issue] = (issueCounts[issue] ?? 0) + 1;

const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  verification_review: {
    schema_version: verificationReview.schema_version,
    reviewed_at: verificationReview.reviewed_at,
    expected_total: verificationReview.expected_total
  },
  totals: {
    deployments: records.length,
    unique_ids: idCounts.size,
    duplicate_ids: [...idCounts.values()].filter((count) => count > 1).length,
    stablecoins_covered: new Set(records.map((row) => row.stablecoin_id)).size,
    chains_recorded: new Set(records.map((row) => row.chain)).size,
    records_with_control_events: records.filter((row) => row.control_event_count > 0).length,
    records_with_evidence: records.filter((row) => row.evidence_count > 0).length
  },
  field_coverage: {
    canonicality_recorded: records.filter((row) => row.canonicality_record_state === 'recorded').length,
    verification_status_recorded: records.filter((row) => row.verification_status !== null).length,
    token_standard_recorded: records.filter((row) => row.token_standard !== null).length,
    freeze_capability_recorded: records.filter((row) => row.freeze_capability !== null).length,
    blacklist_capability_recorded: records.filter((row) => row.blacklist_capability !== null).length
  },
  counts: {
    raw_status: countBy(records, (row) => row.status),
    operational_state: countBy(records, (row) => row.operational_state),
    change_state: countBy(records, (row) => row.change_state),
    canonical_deployment_type: countBy(records, (row) => row.deployment_type),
    public_deployment_category: countBy(records, (row) => row.public_deployment_category),
    canonicality: countBy(records, (row) => row.canonicality),
    canonicality_record_state: countBy(records, (row) => row.canonicality_record_state),
    verification_state: countBy(records, (row) => row.verification_state),
    contract_identity_state: countBy(records, (row) => row.contract_identity_state),
    network_identity_state: countBy(records, (row) => row.network_identity_state),
    chain: countBy(records, (row) => row.chain),
    token_standard: countBy(records, (row) => row.token_standard),
    freeze_capability: countBy(records, (row) => row.freeze_capability),
    blacklist_capability: countBy(records, (row) => row.blacklist_capability),
    file: countBy(records, (row) => row.file),
    issues: Object.fromEntries(Object.entries(issueCounts).sort(([a], [b]) => a.localeCompare(b)))
  },
  records
};

const output = path.join(root, 'data/generated/deployment-taxonomy-migration.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  totals: report.totals,
  field_coverage: report.field_coverage,
  operational_state: report.counts.operational_state,
  change_state: report.counts.change_state,
  public_deployment_category: report.counts.public_deployment_category,
  canonicality: report.counts.canonicality,
  verification_state: report.counts.verification_state,
  contract_identity_state: report.counts.contract_identity_state,
  network_identity_state: report.counts.network_identity_state,
  issues: report.counts.issues
}, null, 2));
