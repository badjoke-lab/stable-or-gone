import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const jsonPath = 'data/generated/registry-known-unknown-placeholder-integrity-audit.json';
const checkpointPath = 'docs/migration/current-canonical-checkpoint.json';
const reviewCheckpointPath = 'docs/migration/current-review-checkpoint.json';
const auditScriptPath = 'scripts/audit-registry-known-unknown-placeholder-integrity.mjs';
const temporaryAuditPath = 'scripts/.audit-registry-known-unknown-placeholder-integrity.review-checkpoint.mjs';

const checkpoint = JSON.parse(fs.readFileSync(checkpointPath, 'utf8'));
const reviewCheckpoint = JSON.parse(fs.readFileSync(reviewCheckpointPath, 'utf8'));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const isIsoDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value ?? '')) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
const allowedStatuses = new Set(['reviewed_non_growth_maintenance_checkpoint', 'reviewed_growth_checkpoint']);
const allowedKinds = new Set(['non_growth_review_checkpoint', 'record_growth_review_checkpoint']);

expect(allowedStatuses.has(reviewCheckpoint.status), `${reviewCheckpointPath}: unexpected status ${reviewCheckpoint.status}`);
expect(allowedKinds.has(reviewCheckpoint.checkpoint_kind), `${reviewCheckpointPath}: unexpected checkpoint_kind ${reviewCheckpoint.checkpoint_kind}`);
expect(Number.isInteger(reviewCheckpoint.source_pr) && reviewCheckpoint.source_pr > 0, `${reviewCheckpointPath}: source_pr must be a positive integer`);
expect(Number.isInteger(reviewCheckpoint.authority_pr) && reviewCheckpoint.authority_pr > 0, `${reviewCheckpointPath}: authority_pr must be a positive integer`);
expect(typeof reviewCheckpoint.source_work_item === 'string' && reviewCheckpoint.source_work_item.length > 0, `${reviewCheckpointPath}: source_work_item missing`);
expect(reviewCheckpoint.source_canonical_checkpoint_id === checkpoint.checkpoint_id, `${reviewCheckpointPath}: canonical checkpoint lineage mismatch`);
expect(reviewCheckpoint.deleted_known_unknowns === 0, `${reviewCheckpointPath}: deleted known unknowns must be zero`);
expect(reviewCheckpoint.forced_resolutions === 0, `${reviewCheckpointPath}: forced resolutions must be zero`);
expect(reviewCheckpoint.exit_boundary === 'REVIEW_GATE', `${reviewCheckpointPath}: exit boundary must be REVIEW_GATE`);
expect(isIsoDate(reviewCheckpoint.recorded_at), `${reviewCheckpointPath}: recorded_at must be an ISO date`);
expect(reviewCheckpoint.recorded_at >= checkpoint.recorded_at, `${reviewCheckpointPath}: review date cannot precede canonical checkpoint`);

if (reviewCheckpoint.status === 'reviewed_non_growth_maintenance_checkpoint') {
  expect(reviewCheckpoint.canonical_counts_unchanged === true, `${reviewCheckpointPath}: maintenance checkpoint must preserve canonical counts`);
  expect(reviewCheckpoint.new_canonical_records === 0, `${reviewCheckpointPath}: maintenance checkpoint must add zero canonical records`);
} else {
  expect(reviewCheckpoint.canonical_counts_unchanged === false, `${reviewCheckpointPath}: growth checkpoint must record changed canonical counts`);
  expect(Number.isInteger(reviewCheckpoint.new_canonical_records) && reviewCheckpoint.new_canonical_records > 0, `${reviewCheckpointPath}: growth checkpoint must record positive new_canonical_records`);
  expect(reviewCheckpoint.source_pr === checkpoint.growth_pr, `${reviewCheckpointPath}: source_pr must equal canonical growth_pr`);
  expect(reviewCheckpoint.authority_pr === checkpoint.authority_pr, `${reviewCheckpointPath}: authority_pr must equal canonical authority_pr`);
}

const countMap = {
  assets: checkpoint.counts?.assets,
  organizations: checkpoint.counts?.organizations,
  events: checkpoint.counts?.events,
  evidence: checkpoint.counts?.evidence,
  reserve_reports: checkpoint.counts?.reserve_reports,
  known_unknowns: checkpoint.counts?.known_unknowns,
  deployments: checkpoint.counts?.deployments,
  detail_routes: checkpoint.counts?.detail_routes
};
for (const [field, expected] of Object.entries(countMap)) {
  expect(Number.isInteger(expected), `${checkpointPath}: counts.${field} missing`);
  expect(reviewCheckpoint.counts?.[field] === expected, `${reviewCheckpointPath}: counts.${field} must be ${expected}`);
}

if (failures.length) {
  console.error('Review checkpoint validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

const source = fs.readFileSync(auditScriptPath, 'utf8');
const anchor = 'const auditDate = currentCheckpoint.recorded_at;';
if (!source.includes(anchor)) throw new Error(`${auditScriptPath}: audit-date anchor missing`);
const patched = source.replace(
  anchor,
  `const reviewCheckpoint = readJson('${reviewCheckpointPath}');\nconst auditDate = [currentCheckpoint.recorded_at, reviewCheckpoint.recorded_at].sort().at(-1);`
);
fs.writeFileSync(temporaryAuditPath, patched);
try {
  execFileSync(process.execPath, [temporaryAuditPath], { stdio: 'inherit', env: process.env });
} finally {
  fs.rmSync(temporaryAuditPath, { force: true });
}

const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const expected = checkpoint.expected_counts ?? checkpoint.counts ?? {};
expect(report.audit_id === `sog_registry_${checkpoint.asset_count}_known_unknown_placeholder_integrity_${checkpoint.checkpoint_id}`, `unexpected audit_id ${report.audit_id}`);
expect(report.audit_date === reviewCheckpoint.recorded_at, `unexpected audit date ${report.audit_date}`);
expect(report.checkpoint_id === checkpoint.checkpoint_id, `unexpected checkpoint_id ${report.checkpoint_id}`);
expect(report.audited_counts?.stable_assets === expected.assets, `expected ${expected.assets} assets, got ${report.audited_counts?.stable_assets}`);
expect(report.audited_counts?.organizations === expected.organizations, `expected ${expected.organizations} organizations, got ${report.audited_counts?.organizations}`);
expect(report.audited_counts?.known_unknowns === expected.known_unknowns, `expected ${expected.known_unknowns} known unknowns, got ${report.audited_counts?.known_unknowns}`);
expect(report.audited_counts?.assets_with_known_unknowns === expected.assets, `expected all ${expected.assets} assets to have known-unknown coverage, got ${report.audited_counts?.assets_with_known_unknowns}`);
expect((report.findings?.critical ?? []).length === 0, `critical findings remain: ${(report.findings?.critical ?? []).length}`);
expect((report.coverage?.uncovered_asset_ids ?? []).length === 0, 'assets without known-unknown coverage remain');
expect((report.integrity?.duplicate_ids ?? []).length === 0, 'duplicate known-unknown IDs remain');
expect((report.integrity?.invalid_stablecoin_refs ?? []).length === 0, 'invalid known-unknown stablecoin references remain');
expect((report.integrity?.invalid_issuer_refs ?? []).length === 0, 'invalid known-unknown issuer references remain');
expect((report.integrity?.invalid_severity ?? []).length === 0, 'invalid known-unknown severity values remain');
expect((report.integrity?.invalid_dates ?? []).length === 0, 'invalid known-unknown dates remain');
expect((report.integrity?.weak_topics ?? []).length === 0, 'generic or weak known-unknown topics remain');
expect((report.integrity?.weak_descriptions ?? []).length === 0, 'generic or weak known-unknown descriptions remain');
expect((report.integrity?.placeholder_findings ?? []).length === 0, 'placeholder-like structural values remain');
expect(report.coverage?.min_rows_per_asset >= 1, 'known-unknown coverage minimum fell below one row per asset');
expect(report.result === 'pass_with_review_queues', `unexpected result ${report.result}`);

if (failures.length) {
  console.error('Known-unknown and placeholder integrity audit validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Known-unknown and placeholder integrity audit validation passed: ${report.audited_counts.known_unknowns} rows cover all ${report.audited_counts.stable_assets} assets at canonical checkpoint ${checkpoint.checkpoint_id} and review checkpoint ${reviewCheckpoint.checkpoint_id}, with zero critical findings and zero structural placeholder findings.`);
