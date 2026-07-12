import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { evidenceSourceAliasCount } from '../config/evidence-source-identities.mjs';

const jsonPath = 'data/generated/registry-evidence-integrity-audit.json';
const baseline = loadRegistryV2Baseline(process.cwd());
const checkpoint = JSON.parse(fs.readFileSync('docs/migration/current-canonical-checkpoint.json', 'utf8'));
const checkpointCounts = checkpoint.expected_counts ?? {};
const expectedEvidence = baseline.minimum_counts?.evidence;
const expectedRelations = baseline.minimum_counts?.evidence_relations ?? expectedEvidence;
const expectedPublicSources = expectedEvidence - evidenceSourceAliasCount;
// PR #354 established the reviewed 177-record no-archive queue. PR #355 adds two
// evidence rows with archive indexes, so this queue must remain unchanged rather
// than reverting to the pre-PR #354 value of 173.
const expectedArchiveNotRecorded = 177;
const expectedArchiveIndex = expectedEvidence - expectedArchiveNotRecorded;

execFileSync(process.execPath, ['scripts/audit-registry-evidence-integrity.mjs'], {
  stdio: 'inherit',
  env: process.env
});

const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(report.audit_id === 'sog_registry_501_evidence_integrity_pr299', `unexpected audit_id ${report.audit_id}`);
expect(report.audited_counts?.stable_assets === checkpoint.asset_count, `expected ${checkpoint.asset_count} stable assets, got ${report.audited_counts?.stable_assets}`);
expect(report.audited_counts?.organizations === checkpointCounts.organizations, `expected ${checkpointCounts.organizations} organizations, got ${report.audited_counts?.organizations}`);
expect(report.audited_counts?.events === checkpointCounts.events, `expected ${checkpointCounts.events} events, got ${report.audited_counts?.events}`);
expect(report.audited_counts?.canonical_evidence_records === expectedEvidence, `expected ${expectedEvidence} evidence records, got ${report.audited_counts?.canonical_evidence_records}`);
expect(report.audited_counts?.public_source_identities === expectedPublicSources, `expected ${expectedPublicSources} public source identities, got ${report.audited_counts?.public_source_identities}`);
expect(report.audited_counts?.evidence_relations === expectedRelations, `expected ${expectedRelations} evidence relations, got ${report.audited_counts?.evidence_relations}`);
expect(report.audited_counts?.source_identity_groups === 33, `expected 33 source identity groups, got ${report.audited_counts?.source_identity_groups}`);
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
expect((report.metadata_quality?.archive_state_counts?.archive_index ?? 0) === expectedArchiveIndex, `archive-index count changed: expected ${expectedArchiveIndex}`);
expect((report.metadata_quality?.archive_state_counts?.not_recorded ?? 0) === expectedArchiveNotRecorded, 'archive not-recorded queue changed');
expect(['pass', 'pass_with_review_queues'].includes(report.result), `audit result is not passing: ${report.result}`);

if (failures.length) {
  console.error('Evidence integrity audit validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Evidence integrity audit validation passed against current checkpoint ${checkpoint.checkpoint_id}: ${expectedEvidence} canonical records, ${expectedPublicSources} public identities, ${expectedRelations} relations, 0 structural gaps, archive queue fixed at ${expectedArchiveNotRecorded} not-recorded records.`);
