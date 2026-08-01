import fs from 'node:fs';
import path from 'node:path';
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

expect(reviewCheckpoint.status === 'reviewed_non_growth_maintenance_checkpoint', `${reviewCheckpointPath}: unexpected status`);
expect(reviewCheckpoint.checkpoint_kind === 'non_growth_review_checkpoint', `${reviewCheckpointPath}: unexpected checkpoint_kind`);
expect(reviewCheckpoint.source_pr === 500, `${reviewCheckpointPath}: source_pr must be 500`);
expect(reviewCheckpoint.authority_pr === 499, `${reviewCheckpointPath}: authority_pr must be 499`);
expect(reviewCheckpoint.source_work_item === 'mnee_evidence_archive_maintenance_batch_1', `${reviewCheckpointPath}: unexpected work item`);
expect(reviewCheckpoint.source_canonical_checkpoint_id === checkpoint.checkpoint_id, `${reviewCheckpointPath}: canonical checkpoint lineage mismatch`);
expect(reviewCheckpoint.canonical_counts_unchanged === true, `${reviewCheckpointPath}: canonical counts must remain unchanged`);
expect(reviewCheckpoint.new_canonical_records === 0, `${reviewCheckpointPath}: new canonical records must be zero`);
expect(reviewCheckpoint.deleted_known_unknowns === 0, `${reviewCheckpointPath}: deleted known unknowns must be zero`);
expect(reviewCheckpoint.forced_resolutions === 0, `${reviewCheckpointPath}: forced resolutions must be zero`);
expect(reviewCheckpoint.exit_boundary === 'REVIEW_GATE', `${reviewCheckpointPath}: exit boundary must be REVIEW_GATE`);
expect(isIsoDate(reviewCheckpoint.recorded_at), `${reviewCheckpointPath}: recorded_at must be an ISO date`);
expect(reviewCheckpoint.recorded_at >= checkpoint.recorded_at, `${reviewCheckpointPath}: review date cannot precede canonical checkpoint`);

const expectedCounts = {
  assets: 117,
  organizations: 108,
  events: 192,
  evidence: 579,
  reserve_reports: 125,
  known_unknowns: 342,
  deployments: 184,
  detail_routes: 417
};
for (const [field, expected] of Object.entries(expectedCounts)) {
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
const expected = checkpoint.expected_counts ?? {};
expect(report.audit_id === `sog_registry_${checkpoint.asset_count}_known_unknown_placeholder_integrity_${checkpoint.checkpoint_id}`, `unexpected audit_id ${report.audit_id}`);
expect(report.audit_date === reviewCheckpoint.recorded_at, `unexpected audit date ${report.audit_date}`);
expect(report.checkpoint_id === checkpoint.checkpoint_id, `unexpected checkpoint_id ${report.checkpoint_id}`);
expect(report.audited_counts?.stable_assets === expected.assets, `expected ${expected.assets} assets, got ${report.audited_counts?.stable_assets}`);
expect(report.audited_counts?.organizations === expected.organizations, `expected ${expected.organizations} organizations, got ${report.audited_counts?.organizations}`);
expect(report.audited_counts?.known_unknowns === expected.known_unknowns, `expected ${expected.known_unknowns} known unknowns, got ${report.audited_counts?.known_unknowns}`);
expect(report.audited_counts?.assets_with_known_unknowns === expected.assets, `expected all ${expected.assets} assets to have known unknown coverage, got ${report.audited_counts?.assets_with_known_unknowns}`);
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
