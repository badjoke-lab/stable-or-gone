import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const output = 'data/generated/registry-v2-v3-machine-readable-parity-audit.json';
execFileSync(process.execPath, ['scripts/audit-registry-v2-v3-machine-readable-parity.mjs'], { stdio: 'inherit', env: process.env });
const report = JSON.parse(fs.readFileSync(output, 'utf8'));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(report.audit_id === 'sog_registry_v2_v3_machine_readable_parity_pr310', `unexpected audit id ${report.audit_id}`);
expect(report.result === 'pass', `parity audit result is ${report.result}`);
expect((report.findings?.critical ?? []).length === 0, `critical parity findings remain: ${(report.findings?.critical ?? []).length}`);

const expectedV2 = {
  stablecoins: 100,
  organizations: 94,
  relationships: 110,
  classifications: 100,
  profiles: 100,
  events: 172,
  event_details: 172,
  evidence: 502,
  evidence_relations: 502,
  reserve_reports: 108,
  known_unknowns: 289,
  regulatory_notes: 9,
  deployments: 140
};
for (const [group, expected] of Object.entries(expectedV2)) {
  expect(report.counts?.v2?.[group] === expected, `V2 count ${group}: expected ${expected}, got ${report.counts?.v2?.[group]}`);
}

const expectedV3 = {
  legal_profiles: 100,
  stable_asset_relationships: 4,
  reserve_components: 127,
  income_profiles: 100,
  deployment_view: 140
};
for (const [group, expected] of Object.entries(expectedV3)) {
  expect(report.counts?.v3?.[group] === expected, `V3 count ${group}: expected ${expected}, got ${report.counts?.v3?.[group]}`);
}

expect(report.coverage?.v3?.legal_profiles === 100, 'legal-profile coverage is not 100/100');
expect(report.coverage?.v3?.income_profiles === 100, 'income-profile coverage is not 100/100');
expect(report.coverage?.v3?.deployment_view_assets === 100, 'deployment-view asset coverage is not 100/100');
expect((report.coverage?.missing_legal_profile_ids ?? []).length === 0, 'missing legal profiles remain');
expect((report.coverage?.missing_income_profile_ids ?? []).length === 0, 'missing income profiles remain');

for (const [key, values] of Object.entries(report.reference_integrity ?? {})) expect((values ?? []).length === 0, `${key} contains reference errors`);
for (const [key, values] of Object.entries(report.loader_manifest_parity ?? {})) expect((values ?? []).length === 0, `${key} contains loader/manifest gaps`);

expect(report.baseline_freshness?.historical_status === 'historical', 'legacy V3 baseline is not marked historical');
expect(report.baseline_freshness?.historical_stablecoin_count === 92, 'legacy V3 baseline did not preserve 92-asset checkpoint');
expect(report.baseline_freshness?.current_parity_status === 'current', 'current V3 parity baseline is not current');
expect(report.baseline_freshness?.current_parity_stablecoin_count === 100, 'current V3 parity baseline is not 100 assets');

expect(Object.values(report.machine_readable?.checks ?? {}).every(Boolean), 'machine-readable runtime parity contract checks failed');
expect(report.machine_readable?.v3_public_record_group_declaration === 'intentional_compatibility_boundary', 'V3 public declaration boundary decision missing');
expect(report.machine_readable?.compatibility_mode === 'v2_public_contract_with_additive_v3_internal_layers', 'machine-readable compatibility mode changed');
expect(report.machine_readable?.data_safety?.canonical_only === true, 'machine-readable canonical_only must remain true');
expect(report.machine_readable?.data_safety?.includes_unreviewed_candidates === false, 'unreviewed candidates must remain excluded');
expect(report.machine_readable?.data_safety?.includes_internal_monitoring === false, 'internal monitoring must remain excluded');
expect(report.machine_readable?.data_safety?.includes_private_notes === false, 'private notes must remain excluded');

if (failures.length) {
  console.error('Registry v2/v3 and machine-readable parity validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Registry v2/v3 and machine-readable parity validation passed: 100-asset V2 compatibility, 100/100 legal and income profile coverage, current loader/manifest parity, and machine-readable compatibility boundary verified.');
