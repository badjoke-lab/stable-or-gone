import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baseline = loadRegistryV2Baseline(root);
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const rows = (baseline.data_groups.deployments ?? []).flatMap((file) => read(file).map((row) => ({ ...row, __file: file })));

function countBy(getter) {
  const counts = new Map();
  for (const row of rows) {
    const raw = getter(row);
    const values = Array.isArray(raw) ? raw : [raw];
    for (const value of values) {
      const key = value === null || value === undefined || value === '' ? 'not_recorded' : String(value);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return Object.fromEntries([...counts].sort(([a], [b]) => a.localeCompare(b)));
}

function contractState(value) {
  if (value === null || value === undefined || value === '') return 'not_recorded';
  const text = String(value);
  if (text === 'source_review_needed') return 'source_review_needed_placeholder';
  if (text === 'not_applicable_or_source_review_needed') return 'mixed_not_applicable_review_placeholder';
  if (/^(0x[a-fA-F0-9]{40}|[1-9A-HJ-NP-Za-km-z]{32,64}|T[A-Za-z0-9]{33})$/.test(text)) return 'recorded_identifier';
  return 'other_recorded_value';
}

const records = rows.map((row) => ({
  id: row.id,
  file: row.__file,
  stablecoin_id: row.stablecoin_id ?? null,
  chain: row.chain ?? null,
  token_standard: row.token_standard ?? null,
  deployment_type: row.deployment_type ?? null,
  status: row.status ?? null,
  canonicality: row.canonicality ?? null,
  verification_status: row.verification_status ?? null,
  contract_address: row.contract_address ?? null,
  contract_state: contractState(row.contract_address),
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
    row.verification_status === undefined ? 'verification_status_not_recorded' : null,
    contractState(row.contract_address).includes('placeholder') ? 'contract_placeholder' : null,
    !Array.isArray(row.evidence_ids) || row.evidence_ids.length === 0 ? 'missing_evidence_ids' : null
  ].filter(Boolean)
}));

const idCounts = new Map();
for (const row of records) idCounts.set(row.id, (idCounts.get(row.id) ?? 0) + 1);
const issueRows = records.flatMap((row) => row.issues.map((issue) => ({ issue })));
const issueCounts = {};
for (const row of issueRows) issueCounts[row.issue] = (issueCounts[row.issue] ?? 0) + 1;

const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
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
    canonicality_recorded: records.filter((row) => row.canonicality !== null).length,
    verification_status_recorded: records.filter((row) => row.verification_status !== null).length,
    token_standard_recorded: records.filter((row) => row.token_standard !== null).length,
    freeze_capability_recorded: records.filter((row) => row.freeze_capability !== null).length,
    blacklist_capability_recorded: records.filter((row) => row.blacklist_capability !== null).length
  },
  counts: {
    status: countBy((row) => row.status),
    deployment_type: countBy((row) => row.deployment_type),
    canonicality: countBy((row) => row.canonicality),
    verification_status: countBy((row) => row.verification_status),
    contract_state: countBy((row) => contractState(row.contract_address)),
    chain: countBy((row) => row.chain),
    token_standard: countBy((row) => row.token_standard),
    freeze_capability: countBy((row) => row.freeze_capability),
    blacklist_capability: countBy((row) => row.blacklist_capability),
    file: countBy((row) => row.__file),
    issues: Object.fromEntries(Object.entries(issueCounts).sort(([a], [b]) => a.localeCompare(b)))
  },
  records
};

const output = path.join(root, 'data/generated/deployment-taxonomy-migration.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ totals: report.totals, field_coverage: report.field_coverage, status: report.counts.status, contract_state: report.counts.contract_state, issues: report.counts.issues }, null, 2));
