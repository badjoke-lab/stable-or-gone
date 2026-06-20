import fs from 'node:fs';
import path from 'node:path';

const read = (file) => JSON.parse(fs.readFileSync(path.join(process.cwd(), file), 'utf8'));
const baseline = read('docs/migration/registry-v3-baseline.json');
const stats = read(baseline.generated_stats);
const audit = read(baseline.integrity_audit);
const launchQueue = read(baseline.quality_queues.launch_date);
const terminalQueue = read(baseline.quality_queues.terminal_date);
const reserveQueue = read(baseline.quality_queues.reserve_report_applicability);
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };

check(baseline.schema_version === '3.0-baseline', 'invalid schema_version');
check(/^\d{4}-\d{2}-\d{2}$/.test(baseline.recorded_at ?? ''), 'invalid recorded_at');

for (const [key, expected] of Object.entries(baseline.expected_counts)) {
  check(stats.registry?.[key] === expected, `stats count mismatch: ${key}`);
  check(audit.counts?.[key] === expected, `audit count mismatch: ${key}`);
}

for (const [key, expected] of Object.entries(baseline.expected_coverage)) {
  const actual = audit.coverage?.[key]?.covered ?? stats.coverage?.[key]?.covered;
  const total = audit.coverage?.[key]?.total ?? stats.coverage?.[key]?.total;
  check(actual === expected, `coverage mismatch: ${key}`);
  check(total === baseline.quality.canonical_assets, `coverage total mismatch: ${key}`);
}

const actualQuality = {
  canonical_assets: stats.registry.stablecoins,
  candidate_promotions: audit.candidate_promotions.promoted,
  pending_candidates: audit.candidate_promotions.pending,
  critical_findings: audit.findings.critical.length,
  warnings: audit.findings.warnings.length,
  canonical_name_collisions: audit.identity.canonical_name_collisions,
  alias_collision_warnings: audit.identity.alias_collision_warnings,
  stale_or_missing_last_verified: audit.quality.stale_or_missing_last_verified,
  all_unknown_income_profiles: audit.quality.all_unknown_income_profiles,
  launch_date_unresolved: launchQueue.expected_total,
  terminal_date_unresolved: terminalQueue.expected_total,
  reserve_report_applicability_queue: reserveQueue.expected_total,
  reserve_report_not_applicable_by_design: reserveQueue.category_counts.not_applicable_by_design,
  reserve_report_source_status_unresolved: reserveQueue.category_counts.source_status_unresolved,
  reserve_report_expected_but_missing: reserveQueue.category_counts.report_expected_but_missing
};

for (const [key, expected] of Object.entries(baseline.quality)) {
  check(actualQuality[key] === expected, `quality mismatch: ${key}`);
}

check(launchQueue.records.length === launchQueue.expected_total, 'launch queue length mismatch');
check(terminalQueue.records.length === terminalQueue.expected_total, 'terminal queue length mismatch');
check(reserveQueue.records.length === reserveQueue.expected_total, 'reserve queue length mismatch');

if (errors.length) {
  for (const error of errors) console.error(`Registry v3 baseline: ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Registry v3 quality baseline valid: ${baseline.baseline_id}`);
}
