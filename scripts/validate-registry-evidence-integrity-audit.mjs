import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const jsonPath = 'data/generated/registry-evidence-integrity-audit.json';

execFileSync(process.execPath, ['scripts/audit-registry-evidence-integrity.mjs'], {
  stdio: 'inherit',
  env: process.env
});

const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(report.audit_id === 'sog_registry_501_evidence_integrity_pr299', `unexpected audit_id ${report.audit_id}`);
expect(report.audited_counts?.stable_assets === 100, `expected 100 stable assets, got ${report.audited_counts?.stable_assets}`);
expect(report.audited_counts?.organizations === 94, `expected 94 organizations, got ${report.audited_counts?.organizations}`);
expect(report.audited_counts?.events === 172, `expected 172 events, got ${report.audited_counts?.events}`);
expect(report.audited_counts?.canonical_evidence_records === 501, `expected 501 evidence records, got ${report.audited_counts?.canonical_evidence_records}`);
expect(report.audited_counts?.public_source_identities === 455, `expected 455 public source identities, got ${report.audited_counts?.public_source_identities}`);
expect(report.audited_counts?.evidence_relations === 501, `expected 501 evidence relations, got ${report.audited_counts?.evidence_relations}`);
expect(report.audited_counts?.source_identity_groups === 33, `expected 33 source identity groups, got ${report.audited_counts?.source_identity_groups}`);
expect(report.audited_counts?.source_aliases === 46, `expected 46 source aliases, got ${report.audited_counts?.source_aliases}`);
expect((report.findings?.critical ?? []).length === 0, `critical findings remain: ${(report.findings?.critical ?? []).length}`);
expect((report.identity?.normalized_only_duplicate_url_groups ?? []).length === 0, 'normalized-only duplicate URL groups remain');
expect((report.identity?.public_duplicate_url_groups ?? []).length === 0, 'public duplicate URL groups remain');
expect((report.identity?.orphan_relation_source_ids ?? []).length === 0, 'orphan relation source identities remain');
expect((report.identity?.public_sources_without_relations ?? []).length === 0, 'public source identities without canonical relations remain');
expect((report.metadata_quality?.missing_publishers ?? []).length === 0, 'publisher gaps remain');
expect((report.metadata_quality?.missing_reliability ?? []).length === 0, 'reliability gaps remain');
expect((report.metadata_quality?.missing_claim_scopes ?? []).length === 0, 'claim-scope gaps remain');
expect((report.metadata_quality?.unknown_public_categories ?? []).length === 0, 'unknown public evidence categories remain');
expect((report.metadata_quality?.unknown_provenance ?? []).length === 0, 'unknown evidence provenance remains');
expect((report.metadata_quality?.unknown_primary_state ?? []).length === 0, 'unknown primary-state classification remains');
expect((report.metadata_quality?.unknown_reliability ?? []).length === 0, 'unknown reliability classification remains');
expect((report.metadata_quality?.archive_state_counts?.archive_index ?? 0) === 328, 'archive-index count changed');
expect((report.metadata_quality?.archive_state_counts?.not_recorded ?? 0) === 173, 'archive not-recorded queue changed');
expect(['pass', 'pass_with_review_queues'].includes(report.result), `audit result is not passing: ${report.result}`);

if (failures.length) {
  console.error('Evidence integrity audit validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Evidence integrity audit validation passed: 501 canonical records, 455 public identities, 501 relations, 0 structural gaps, archive queue fixed at 173 not-recorded records.');
