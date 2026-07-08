import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const jsonPath = 'data/generated/registry-identity-lineage-audit.json';

execFileSync(process.execPath, ['scripts/audit-registry-identity-lineage.mjs'], {
  stdio: 'inherit',
  env: process.env
});

if (!fs.existsSync(jsonPath)) {
  console.error(`${jsonPath} was not generated.`);
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const checkpoint = JSON.parse(fs.readFileSync('docs/migration/current-canonical-checkpoint.json', 'utf8'));
const failures = [];

if (report.audit_id !== 'sog_registry_100_identity_lineage_pr297') failures.push(`unexpected audit_id ${report.audit_id}`);
if (report.audited_counts?.stable_assets !== checkpoint.asset_count) failures.push(`expected ${checkpoint.asset_count} stable assets from current checkpoint, got ${report.audited_counts?.stable_assets}`);
if (report.audited_counts?.promoted_candidate_mappings !== checkpoint.asset_count) failures.push(`expected ${checkpoint.asset_count} promoted candidate mappings, got ${report.audited_counts?.promoted_candidate_mappings}`);
if ((report.findings?.critical ?? []).length !== 0) failures.push(`critical findings remain: ${(report.findings?.critical ?? []).length}`);
if ((report.identity?.alias_coverage_gaps ?? []).length !== 0) failures.push(`candidate alias coverage gaps remain: ${(report.identity?.alias_coverage_gaps ?? []).length}`);
if ((report.lineage?.cycles ?? []).length !== 0) failures.push(`lineage cycles remain: ${(report.lineage?.cycles ?? []).length}`);
if (!['pass', 'pass_with_review_warnings'].includes(report.result)) failures.push(`audit result is not passing: ${report.result}`);

if (failures.length) {
  console.error('Identity and lineage audit validation failed:');
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log(`Identity and lineage audit validation passed against current checkpoint ${checkpoint.checkpoint_id}: ${report.audited_counts.stable_assets} assets, 0 critical findings, 0 alias gaps, 0 lineage cycles.`);
