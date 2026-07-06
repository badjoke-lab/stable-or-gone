import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const jsonPath = 'data/generated/registry-known-unknown-placeholder-integrity-audit.json';
execFileSync(process.execPath, ['scripts/audit-registry-known-unknown-placeholder-integrity.mjs'], { stdio: 'inherit', env: process.env });
const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

expect(report.audit_id === 'sog_registry_100_known_unknown_placeholder_integrity_pr308', `unexpected audit_id ${report.audit_id}`);
expect(report.audit_date === '2026-07-06', `unexpected audit date ${report.audit_date}`);
expect(report.audited_counts?.stable_assets === 100, `expected 100 assets, got ${report.audited_counts?.stable_assets}`);
expect(report.audited_counts?.organizations === 94, `expected 94 organizations, got ${report.audited_counts?.organizations}`);
expect(report.audited_counts?.known_unknowns === 289, `expected 289 known unknowns, got ${report.audited_counts?.known_unknowns}`);
expect(report.audited_counts?.assets_with_known_unknowns === 100, `expected all 100 assets to have known unknown coverage, got ${report.audited_counts?.assets_with_known_unknowns}`);
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

console.log(`Known-unknown and placeholder integrity audit validation passed: ${report.audited_counts.known_unknowns} rows cover all ${report.audited_counts.stable_assets} assets, with zero critical findings and zero structural placeholder findings.`);
