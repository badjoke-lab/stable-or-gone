import fs from 'node:fs';
import path from 'node:path';
import { publicTaxonomy } from '../config/public-taxonomy.mjs';
import { publicValueStates, publicValueStateValues } from '../config/value-states.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baseline = loadRegistryV2Baseline(root);
const reportPath = path.join(root, 'data/generated/value-state-migration.json');
const outputPath = path.join(root, 'data/generated/value-state-validation.json');
const expectedStates = [
  'known',
  'unknown_after_review',
  'not_recorded',
  'not_applicable',
  'not_public',
  'unverified',
  'disputed',
  'approximate'
];
const allowedSignals = new Set([
  'null_value',
  'undefined_value',
  'blank_string',
  'explicit_unknown',
  'not_recorded_marker',
  'not_applicable_marker',
  'not_public_marker',
  'unverified_marker',
  'disputed_marker',
  'approximate_marker',
  'work_queue_placeholder',
  'mixed_placeholder'
]);
const allowedScopes = new Set(['direct_value', 'narrative_text']);

const errors = [];
const warnings = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(fs.existsSync(reportPath), 'value-state migration report is missing');
assert(JSON.stringify(publicValueStateValues) === JSON.stringify(expectedStates), 'approved public value-state order or membership differs from the canonical specification');
assert(new Set(publicValueStateValues).size === publicValueStateValues.length, 'public value states contain duplicates');
assert(publicValueStates.every((entry) => typeof entry.public_label === 'string' && entry.public_label.length > 0), 'every public value state requires a public label');
assert(publicValueStates.every((entry) => typeof entry.short_definition === 'string' && entry.short_definition.length > 0), 'every public value state requires a short definition');
assert(new Set(publicValueStates.map((entry) => entry.sort_order)).size === publicValueStates.length, 'public value-state sort orders must be unique');

const taxonomyValueStateEntries = publicTaxonomy.axes?.value_state?.entries ?? [];
assert(JSON.stringify(taxonomyValueStateEntries.map((entry) => entry.canonical_value)) === JSON.stringify(expectedStates), 'public taxonomy value-state axis differs from the canonical value-state registry');
for (const definition of publicValueStates) {
  const taxonomyEntry = taxonomyValueStateEntries.find((entry) => entry.canonical_value === definition.value);
  assert(taxonomyEntry?.public_label === definition.public_label, `public taxonomy label differs for value state ${definition.value}`);
  assert(taxonomyEntry?.is_filterable === false, `value state ${definition.value} must not become a public filter by default`);
}

let report = null;
if (fs.existsSync(reportPath)) {
  report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  assert(report.schema_version === '1.1', 'value-state migration schema version mismatch');
  assert(report.baseline_id === baseline.baseline_id, 'value-state migration baseline mismatch');
  assert(JSON.stringify(report.approved_public_value_states) === JSON.stringify(expectedStates), 'migration report public states differ from the specification');
  assert(report.totals?.source_files > 0, 'migration report scanned no source files');
  assert(report.totals?.records > 0, 'migration report scanned no records');
  assert(report.totals?.scalar_values > 0, 'migration report scanned no scalar values');
  assert(report.totals?.findings === (report.totals?.direct_findings ?? 0) + (report.totals?.narrative_findings ?? 0), 'direct and narrative finding totals do not add up');
  assert(report.group_counts?.stablecoins?.records >= 92, 'migration report does not cover the 92 stable-asset checkpoint');
  assert(report.group_counts?.organizations?.records >= 86, 'migration report does not cover the 86-organization checkpoint');
  assert(report.group_counts?.events?.records >= 150, 'migration report does not cover the 150-event checkpoint');
  assert(report.group_counts?.evidence?.records >= 455, 'migration report does not cover the 455-evidence checkpoint');
  assert(report.group_counts?.deployments?.records >= 130, 'migration report does not cover the 130-deployment checkpoint');
  assert(report.group_counts?.known_unknowns?.records >= 253, 'migration report does not cover the 253-known-unknown checkpoint');

  for (const counts of [report.signal_counts ?? {}, report.direct_signal_counts ?? {}, report.narrative_signal_counts ?? {}]) {
    for (const [signal, count] of Object.entries(counts)) {
      assert(allowedSignals.has(signal), `unapproved raw value signal in report: ${signal}`);
      assert(Number.isInteger(count) && count >= 0, `invalid signal count for ${signal}`);
    }
  }

  for (const finding of report.findings ?? []) {
    assert(typeof finding.group === 'string' && finding.group.length > 0, 'finding missing group');
    assert(typeof finding.file === 'string' && finding.file.length > 0, 'finding missing file');
    assert(typeof finding.record_id === 'string' && finding.record_id.length > 0, 'finding missing record identity');
    assert(typeof finding.path === 'string' && finding.path.length > 0, 'finding missing field path');
    assert(allowedSignals.has(finding.signal), `finding has unapproved signal: ${finding.signal}`);
    assert(allowedScopes.has(finding.semantic_scope), `finding has unapproved semantic scope: ${finding.semantic_scope}`);
  }

  const directWorkflowPlaceholderCount = (report.direct_signal_counts?.work_queue_placeholder ?? 0) + (report.direct_signal_counts?.mixed_placeholder ?? 0);
  if (directWorkflowPlaceholderCount === 0) warnings.push('No direct workflow placeholder signals were detected; confirm the scanner still covers legacy work-state values.');
  if ((report.direct_signal_counts?.disputed_marker ?? 0) === 0) warnings.push('No direct disputed markers are currently recorded; the public state remains defined for future reviewed use.');
  if ((report.direct_signal_counts?.approximate_marker ?? 0) === 0) warnings.push('No direct approximate markers are currently recorded; approximate information may currently exist only in narrative text.');
}

const validation = {
  schema_version: '1.1',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  ok: errors.length === 0,
  approved_public_value_states: expectedStates,
  errors,
  warnings,
  inventory_summary: report ? {
    source_files: report.totals.source_files,
    records: report.totals.records,
    scalar_values: report.totals.scalar_values,
    findings: report.totals.findings,
    direct_findings: report.totals.direct_findings,
    narrative_findings: report.totals.narrative_findings,
    excluded_reference_scalars: report.totals.excluded_reference_scalars,
    direct_signal_counts: report.direct_signal_counts,
    narrative_signal_counts: report.narrative_signal_counts
  } : null
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(validation, null, 2)}\n`);

if (errors.length > 0) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(validation, null, 2));
