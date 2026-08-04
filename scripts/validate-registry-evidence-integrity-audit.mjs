import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { evidenceSourceAliasCount, evidenceSourceIdentityGroupCount } from '../config/evidence-source-identities.mjs';

const jsonPath = 'data/generated/registry-evidence-integrity-audit.json';
const baseline = loadRegistryV2Baseline(process.cwd());
const checkpoint = JSON.parse(fs.readFileSync('docs/migration/current-canonical-checkpoint.json', 'utf8'));
const checkpointCounts = checkpoint.expected_counts ?? {};
const checkpointCurrentCounts = checkpoint.counts ?? {};
const expectedEvidence = baseline.minimum_counts?.evidence;
const expectedRelations = baseline.minimum_counts?.evidence_relations ?? expectedEvidence;
const expectedPublicSources = expectedEvidence - evidenceSourceAliasCount;
const correctionConfigPath = 'config/evidence-correction-batch-pr360.json';
const correctionOutcomePath = 'docs/migration/evidence-correction-outcomes-pr360.json';
const correctionConfig = fs.existsSync(correctionConfigPath) ? JSON.parse(fs.readFileSync(correctionConfigPath, 'utf8')) : null;
const correctionOutcome = fs.existsSync(correctionOutcomePath) ? JSON.parse(fs.readFileSync(correctionOutcomePath, 'utf8')) : null;
const expectedArchiveNotRecorded = checkpoint.evidence_quality?.archive_not_recorded_count
  ?? checkpointCurrentCounts.archive_not_recorded_count
  ?? correctionOutcome?.archive_not_recorded_count_after
  ?? correctionConfig?.archive_not_recorded_count_before
  ?? 177;
const expectedArchiveRecorded = checkpoint.evidence_quality?.archive_index_count
  ?? checkpointCurrentCounts.archive_index_count
  ?? correctionOutcome?.archive_index_count_after
  ?? (expectedEvidence - expectedArchiveNotRecorded);

execFileSync(process.execPath, ['scripts/audit-registry-evidence-integrity.mjs'], {
  stdio: 'inherit',
  env: process.env
});

const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const archiveStateCounts = report.metadata_quality?.archive_state_counts ?? {};
const actualArchiveRecorded = (archiveStateCounts.direct_snapshot ?? 0)
  + (archiveStateCounts.archive_index ?? 0)
  + (archiveStateCounts.other_archive ?? 0);
const actualArchiveNotRecorded = archiveStateCounts.not_recorded ?? 0;
const actualArchiveStateTotal = actualArchiveRecorded + actualArchiveNotRecorded;
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(report.audit_id === 'sog_registry_501_evidence_integrity_pr299', `unexpected audit_id ${report.audit_id}`);
expect(report.audited_counts?.stable_assets === checkpoint.asset_count, `expected ${checkpoint.asset_count} stable assets, got ${report.audited_counts?.stable_assets}`);
expect(report.audited_counts?.organizations === checkpointCounts.organizations, `expected ${checkpointCounts.organizations} organizations, got ${report.audited_counts?.organizations}`);
expect(report.audited_counts?.events === checkpointCounts.events, `expected ${checkpointCounts.events} events, got ${report.audited_counts?.events}`);
expect(report.audited_counts?.canonical_evidence_records === expectedEvidence, `expected ${expectedEvidence} evidence records, got ${report.audited_counts?.canonical_evidence_records}`);
expect(report.audited_counts?.public_source_identities === expectedPublicSources, `expected ${expectedPublicSources} public source identities, got ${report.audited_counts?.public_source_identities}`);
expect(report.audited_counts?.evidence_relations === expectedRelations, `expected ${expectedRelations} evidence relations, got ${report.audited_counts?.evidence_relations}`);
expect(report.audited_counts?.source_identity_groups === evidenceSourceIdentityGroupCount, `expected ${evidenceSourceIdentityGroupCount} source identity groups, got ${report.audited_counts?.source_identity_groups}`);
expect(report.audited_counts?.source_aliases === evidenceSourceAliasCount, `expected ${evidenceSourceAliasCount} source aliases, got ${report.audited_counts?.source_aliases}`);
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
expect(actualArchiveStateTotal === expectedEvidence, `archive-state taxonomy must cover all ${expectedEvidence} Evidence rows, got ${actualArchiveStateTotal}`);
expect(actualArchiveRecorded === expectedArchiveRecorded, `archive-recorded count changed: expected ${expectedArchiveRecorded}, got ${actualArchiveRecorded}`);
expect(actualArchiveNotRecorded === expectedArchiveNotRecorded, `archive not-recorded queue changed: expected ${expectedArchiveNotRecorded}, got ${actualArchiveNotRecorded}`);
expect(['pass', 'pass_with_review_queues'].includes(report.result), `audit result is not passing: ${report.result}`);

if (correctionOutcome) {
  expect(correctionOutcome.canonical_evidence_count_after === 557, 'Historical PR #360 correction report Evidence count changed');
  expect(correctionOutcome.evidence_relation_count_after === 557, 'Historical PR #360 correction report Evidence Relation count changed');
  expect(correctionOutcome.archive_index_count_after === 387, 'Historical PR #360 correction report archive-recorded count changed');
  expect(correctionOutcome.archive_not_recorded_count_after === 170, 'Historical PR #360 correction report no-archive count changed');
  expect(correctionOutcome.changed_count <= correctionConfig.maximum_canonical_evidence_records_touched, 'PR #360 correction report exceeds Evidence touch maximum');
  expect(correctionOutcome.constraints?.new_evidence_identities === 0, 'PR #360 correction report added Evidence identities');
  expect(correctionOutcome.constraints?.evidence_relation_changes === 0, 'PR #360 correction report changed Evidence Relations');
  expect(correctionOutcome.canonical_evidence_count_after <= expectedEvidence, 'Current Evidence count regressed below the reviewed PR #360 checkpoint');
  expect(correctionOutcome.evidence_relation_count_after <= expectedRelations, 'Current Evidence Relation count regressed below the reviewed PR #360 checkpoint');
}

if (failures.length) {
  console.error('Evidence integrity audit validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  checkpoint_id: checkpoint.checkpoint_id,
  canonical_evidence_records: expectedEvidence,
  public_source_identities: expectedPublicSources,
  evidence_relations: expectedRelations,
  source_identity_groups: evidenceSourceIdentityGroupCount,
  source_aliases: evidenceSourceAliasCount,
  archive_states: archiveStateCounts,
  archive_recorded_total: actualArchiveRecorded,
  archive_not_recorded: actualArchiveNotRecorded,
  historical_pr360_evidence: correctionOutcome?.canonical_evidence_count_after ?? null
}, null, 2));
