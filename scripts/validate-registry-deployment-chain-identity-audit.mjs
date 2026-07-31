import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { loadDeploymentVerification } from './load-deployment-verification.mjs';

const jsonPath = 'data/generated/registry-deployment-chain-identity-audit.json';

execFileSync(process.execPath, ['scripts/audit-registry-deployment-chain-identity-current.mjs'], {
  stdio: 'inherit',
  env: process.env
});

const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const checkpoint = JSON.parse(fs.readFileSync('docs/migration/current-canonical-checkpoint.json', 'utf8'));
const verification = loadDeploymentVerification(process.cwd());
const expectedCounts = checkpoint.expected_counts ?? {};
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };
const expectedVerificationCounts = verification.status_counts ?? {};
const expectedControlNotRecorded = expectedCounts.deployments - 1;
const expectedRecordedChains = 49;

expect(report.audit_id === 'sog_registry_100_deployment_chain_identity_pr301', `unexpected audit_id ${report.audit_id}`);
expect(report.audited_counts?.stable_assets === checkpoint.asset_count, `expected ${checkpoint.asset_count} stable assets, got ${report.audited_counts?.stable_assets}`);
expect(report.audited_counts?.deployments === expectedCounts.deployments, `expected ${expectedCounts.deployments} deployments, got ${report.audited_counts?.deployments}`);
expect(report.audited_counts?.stablecoins_with_deployments === checkpoint.asset_count, `expected deployment coverage for ${checkpoint.asset_count} assets, got ${report.audited_counts?.stablecoins_with_deployments}`);
expect(report.audited_counts?.chains_recorded === expectedRecordedChains, `expected ${expectedRecordedChains} recorded chain labels, got ${report.audited_counts?.chains_recorded}`);
expect(report.audited_counts?.verification_overlay_ids === verification.expected_total, `expected verification overlay coverage of ${verification.expected_total}, got ${report.audited_counts?.verification_overlay_ids}`);
expect((report.findings?.critical ?? []).length === 0, `critical findings remain: ${(report.findings?.critical ?? []).length}`);
expect((report.identity?.duplicate_identifier_groups ?? []).length === 0, 'duplicate deployment identifier groups remain');
expect((report.identity?.invalid_origin_refs ?? []).length === 0, 'invalid origin deployment references remain');
expect((report.identity?.self_origin_refs ?? []).length === 0, 'self-referential origin deployments remain');
expect((report.identity?.origin_cycles ?? []).length === 0, 'origin deployment cycles remain');
expect((report.identity?.duplicate_primary_assets ?? []).length === 0, 'duplicate primary deployments remain');
expect((report.identity?.stablecoins_without_deployments ?? []).length === 0, 'stable assets without deployment rows remain');
expect((report.taxonomy?.canonicality_not_recorded ?? []).length === 0, 'canonicality-not-recorded queue remains');
expect((report.taxonomy?.unknown_public_category ?? []).length === 0, 'unknown public deployment categories remain');
expect((report.verification?.review_needed ?? []).length === expectedVerificationCounts.review_needed, 'deployment verification review-needed rows changed');
expect((report.verification?.not_recorded_or_unknown ?? []).length === expectedVerificationCounts.not_recorded + expectedVerificationCounts.unknown, 'deployment verification not-recorded/unknown rows changed');
expect(report.verification?.state_counts?.verified === expectedVerificationCounts.verified, `expected ${expectedVerificationCounts.verified} verified deployments, got ${report.verification?.state_counts?.verified}`);
expect(report.verification?.state_counts?.identifier_recorded_unverified === expectedVerificationCounts.identifier_recorded_unverified, `expected ${expectedVerificationCounts.identifier_recorded_unverified} identifier-recorded-unverified deployments, got ${report.verification?.state_counts?.identifier_recorded_unverified}`);
expect(report.verification?.state_counts?.source_linked_no_identifier === expectedVerificationCounts.source_linked_no_identifier, `expected ${expectedVerificationCounts.source_linked_no_identifier} source-linked-no-identifier deployments, got ${report.verification?.state_counts?.source_linked_no_identifier}`);
expect((report.verification?.identifiers_not_recorded ?? []).length === expectedVerificationCounts.source_linked_no_identifier, 'identifier-not-recorded review queue changed');
expect(JSON.stringify(report.taxonomy?.network_review_needed ?? []) === JSON.stringify([
  'sog_dep_aecoin_unresolved_batch_p',
  'sog_dep_audd_unknown_batch_y',
  'sog_dep_nzds_unknown_batch_y',
  'sog_dep_usdg_chain_seed'
]), 'network review-needed queue changed');
expect((report.taxonomy?.aggregate_network_context ?? []).length === 4, 'aggregate network-context queue changed');
expect((report.control_capability?.freeze_not_recorded ?? []).length === expectedControlNotRecorded, `freeze capability not-recorded queue changed: expected ${expectedControlNotRecorded}`);
expect((report.control_capability?.blacklist_not_recorded ?? []).length === expectedControlNotRecorded, `blacklist capability not-recorded queue changed: expected ${expectedControlNotRecorded}`);
expect((report.evidence?.missing_evidence_ids ?? []).length === 0, 'deployment evidence references are missing');
expect(report.result === 'pass_with_review_queues', `unexpected result ${report.result}`);

if (failures.length) {
  console.error('Deployment and chain identity audit validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Deployment and chain identity audit validation passed against current checkpoint ${checkpoint.checkpoint_id}: ${expectedCounts.deployments} deployments across ${expectedRecordedChains} recorded chain labels, complete ${checkpoint.asset_count}-asset coverage, 0 identity/reference failures, and bounded verification/network/control-capability queues.`);
