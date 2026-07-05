import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const jsonPath = 'data/generated/registry-deployment-chain-identity-audit.json';

execFileSync(process.execPath, ['scripts/audit-registry-deployment-chain-identity.mjs'], {
  stdio: 'inherit',
  env: process.env
});

const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(report.audit_id === 'sog_registry_100_deployment_chain_identity_pr301', `unexpected audit_id ${report.audit_id}`);
expect(report.audited_counts?.stable_assets === 100, `expected 100 stable assets, got ${report.audited_counts?.stable_assets}`);
expect(report.audited_counts?.deployments === 140, `expected 140 deployments, got ${report.audited_counts?.deployments}`);
expect(report.audited_counts?.stablecoins_with_deployments === 100, `expected deployment coverage for 100 assets, got ${report.audited_counts?.stablecoins_with_deployments}`);
expect(report.audited_counts?.chains_recorded === 35, `expected 35 recorded chain labels, got ${report.audited_counts?.chains_recorded}`);
expect(report.audited_counts?.verification_overlay_ids === 140, `expected verification overlay coverage of 140, got ${report.audited_counts?.verification_overlay_ids}`);
expect((report.findings?.critical ?? []).length === 0, `critical findings remain: ${(report.findings?.critical ?? []).length}`);
expect((report.identity?.duplicate_identifier_groups ?? []).length === 0, 'duplicate deployment identifier groups remain');
expect((report.identity?.invalid_origin_refs ?? []).length === 0, 'invalid origin deployment references remain');
expect((report.identity?.self_origin_refs ?? []).length === 0, 'self-referential origin deployments remain');
expect((report.identity?.origin_cycles ?? []).length === 0, 'origin deployment cycles remain');
expect((report.identity?.duplicate_primary_assets ?? []).length === 0, 'duplicate primary deployments remain');
expect((report.identity?.stablecoins_without_deployments ?? []).length === 0, 'stable assets without deployment rows remain');
expect((report.taxonomy?.canonicality_not_recorded ?? []).length === 0, 'canonicality-not-recorded queue remains');
expect((report.taxonomy?.unknown_public_category ?? []).length === 0, 'unknown public deployment categories remain');
expect((report.verification?.review_needed ?? []).length === 0, 'deployment verification review-needed rows remain');
expect((report.verification?.not_recorded_or_unknown ?? []).length === 0, 'deployment verification not-recorded/unknown rows remain');
expect(report.verification?.state_counts?.verified === 19, `expected 19 verified deployments, got ${report.verification?.state_counts?.verified}`);
expect(report.verification?.state_counts?.identifier_recorded_unverified === 45, `expected 45 identifier-recorded-unverified deployments, got ${report.verification?.state_counts?.identifier_recorded_unverified}`);
expect(report.verification?.state_counts?.source_linked_no_identifier === 76, `expected 76 source-linked-no-identifier deployments, got ${report.verification?.state_counts?.source_linked_no_identifier}`);
expect((report.verification?.identifiers_not_recorded ?? []).length === 76, 'identifier-not-recorded review queue changed');
expect(JSON.stringify(report.taxonomy?.network_review_needed ?? []) === JSON.stringify([
  'sog_dep_aecoin_unresolved_batch_p',
  'sog_dep_usdg_chain_seed'
]), 'network review-needed queue changed');
expect((report.taxonomy?.aggregate_network_context ?? []).length === 4, 'aggregate network-context queue changed');
expect((report.control_capability?.freeze_not_recorded ?? []).length === 139, 'freeze capability not-recorded queue changed');
expect((report.control_capability?.blacklist_not_recorded ?? []).length === 139, 'blacklist capability not-recorded queue changed');
expect((report.evidence?.missing_evidence_ids ?? []).length === 0, 'deployment evidence references are missing');
expect(report.result === 'pass_with_review_queues', `unexpected result ${report.result}`);

if (failures.length) {
  console.error('Deployment and chain identity audit validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Deployment and chain identity audit validation passed: 140 deployments, complete 100-asset coverage, 0 identity/reference failures, and bounded verification/network/control-capability queues.');
