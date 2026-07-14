import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const jsonPath = 'data/generated/registry-organization-relationship-audit.json';

execFileSync(process.execPath, ['scripts/audit-registry-organization-relationships.mjs'], {
  stdio: 'inherit',
  env: process.env
});

const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const checkpoint = JSON.parse(fs.readFileSync('docs/migration/current-canonical-checkpoint.json', 'utf8'));
const expectedCounts = checkpoint.expected_counts ?? {};
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(report.audit_id === 'sog_registry_100_organization_relationship_pr298', `unexpected audit_id ${report.audit_id}`);
expect(report.audited_counts?.stable_assets === checkpoint.asset_count, `expected ${checkpoint.asset_count} stable assets from current checkpoint, got ${report.audited_counts?.stable_assets}`);
expect(report.audited_counts?.organizations === expectedCounts.organizations, `expected ${expectedCounts.organizations} organizations from current checkpoint, got ${report.audited_counts?.organizations}`);
expect(report.audited_counts?.relationships === expectedCounts.relationships, `expected ${expectedCounts.relationships} relationships from current checkpoint, got ${report.audited_counts?.relationships}`);
expect((report.findings?.critical ?? []).length === 0, `critical findings remain: ${(report.findings?.critical ?? []).length}`);
expect((report.primary_display?.invalid_selections ?? []).length === 0, 'invalid primary-display selections remain');
expect((report.primary_display?.ambiguous_selections ?? []).length === 0, 'ambiguous primary-display selections remain');
expect((report.relationships?.issuer_compatibility_gaps ?? []).length === 0, 'legacy issuer compatibility gaps remain');
expect((report.relationships?.active_with_end_date ?? []).length === 0, 'active relationships with end dates remain');
expect((report.relationships?.start_after_end ?? []).length === 0, 'start-after-end relationship boundaries remain');
expect((report.relationships?.duplicate_active_role_edges ?? []).length === 0, 'duplicate active organization-role edges remain');
expect((report.organizations?.orphan_organizations ?? []).length === 0, 'orphan organizations remain');
expect(JSON.stringify(report.organizations?.without_official_url ?? []) === JSON.stringify([
  'sog_issuer_stable_universal',
  'sog_issuer_blackfridge'
]), 'unexpected organization official-url gap set');
const exactSharedUrls = (report.organizations?.exact_shared_official_urls ?? []).map((row) => row.url).sort();
expect(JSON.stringify(exactSharedUrls) === JSON.stringify([
  'https://circle.com/usyc',
  'https://paxos.com/'
]), `unexpected exact shared official URL set: ${JSON.stringify(exactSharedUrls)}`);
const paxosShared = (report.organizations?.exact_shared_official_urls ?? []).find((row) => row.url === 'https://paxos.com/');
expect(JSON.stringify(paxosShared?.organization_ids ?? []) === JSON.stringify([
  'sog_issuer_paxos',
  'sog_issuer_paxos_digital_singapore',
  'sog_issuer_paxos_issuance_europe'
]), 'unexpected Paxos shared corporate URL organization set');
expect(JSON.stringify(report.relationships?.ended_without_end_date ?? []) === JSON.stringify([
  'sog_rel_husd_stable_universal',
  'sog_rel_esd_empty_set_operator',
  'sog_rel_bac_basis_cash_operator',
  'sog_rel_dsd_protocol_operator'
]), 'ended relationship unresolved-boundary queue changed');
expect(['pass', 'pass_with_review_warnings'].includes(report.result), `audit result is not passing: ${report.result}`);

if (failures.length) {
  console.error('Organization and relationship audit validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Organization and relationship audit validation passed against current checkpoint ${checkpoint.checkpoint_id}: ${report.audited_counts.organizations} organizations, ${report.audited_counts.relationships} relationships, deterministic primary display, and bounded official-URL/end-date review queues.`);
