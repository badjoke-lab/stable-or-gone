import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { detectRawValueSignal, normalizeSignalText } from '../config/value-states.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const review = readJson('data/quality/direct-workflow-placeholder-review.json');
const baseline = loadRegistryV2Baseline(root);
const failures = [];
const fail = (message) => failures.push(message);
const referenceSignals = new Set(['work_queue_placeholder', 'mixed_placeholder', 'not_recorded_marker']);

function readRows(file) {
  const value = readJson(file);
  const rows = Array.isArray(value) ? value : value.records;
  if (!Array.isArray(rows)) throw new Error(`${file}: expected array or records array`);
  return rows;
}
function isObject(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
function recordId(row, index) { return String(row?.id ?? row?.stablecoin_id ?? row?.organization_id ?? row?.event_id ?? row?.slug ?? row?.name ?? `row_${index}`); }
function scalarShape(value) {
  if (value === null) return 'null';
  if (typeof value !== 'string') return typeof value;
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'blank';
  if (trimmed.length <= 80 && /^[a-z0-9_./:+ -]+$/i.test(trimmed)) return 'enum_or_compact';
  return 'prose';
}
function walk(value, parts = []) {
  if (Array.isArray(value)) return value.flatMap((item) => walk(item, [...parts, '[]']));
  if (isObject(value)) return Object.entries(value).flatMap(([key, child]) => walk(child, [...parts, key]));
  return [{ path: parts.join('.'), value }];
}
function leaf(fieldPath) { return fieldPath.split('.').filter((part) => part && part !== '[]').at(-1) ?? ''; }
function isReference(fieldPath) {
  const value = leaf(fieldPath);
  return value === 'id' || value === 'slug' || value === 'href' || value === 'url' || value === 'urls' || value.endsWith('_id') || value.endsWith('_ids') || value.endsWith('_url') || value.endsWith('_urls');
}
function include(fieldPath, value, signal, shape) {
  if (!isReference(fieldPath)) return true;
  if (value === null || value === undefined || shape === 'blank') return false;
  return shape === 'enum_or_compact' && referenceSignals.has(signal);
}
function increment(target, key) { target[key] = (target[key] ?? 0) + 1; }
function disposition(finding) {
  if (finding.group === 'reserve_reports') return 'invalid_placeholder_encoding';
  if (finding.signal === 'mixed_placeholder' || finding.raw_value !== 'source_review_needed') return 'invalid_placeholder_encoding';
  return 'replaceable_after_source_review';
}
function checkCounts(actual, expected, label) {
  const actualKeys = Object.keys(actual).sort();
  const expectedKeys = Object.keys(expected ?? {}).sort();
  if (JSON.stringify(actualKeys) !== JSON.stringify(expectedKeys)) fail(`${label} keys changed: ${actualKeys.join(', ')}`);
  for (const key of expectedKeys) if (actual[key] !== expected[key]) fail(`${label}.${key}: ${actual[key]} !== ${expected[key]}`);
}

const findings = [];
for (const [group, files] of Object.entries(baseline.data_groups ?? {})) {
  for (const file of files) {
    readRows(file).forEach((row, index) => {
      for (const scalar of walk(row)) {
        const shape = scalarShape(scalar.value);
        const signal = detectRawValueSignal(scalar.value);
        if (!['work_queue_placeholder', 'mixed_placeholder'].includes(signal)) continue;
        if (shape === 'prose' || !include(scalar.path, scalar.value, signal, shape)) continue;
        findings.push({
          group,
          file,
          record_id: recordId(row, index),
          path: scalar.path,
          signal,
          raw_value: typeof scalar.value === 'string' ? normalizeSignalText(scalar.value) : String(scalar.value)
        });
      }
    });
  }
}

const keyOf = (finding) => `${finding.group}|${finding.file}|${finding.record_id}|${finding.path}|${finding.signal}|${finding.raw_value}`;
findings.sort((a, b) => keyOf(a).localeCompare(keyOf(b)));
const digest = `sha256:${crypto.createHash('sha256').update(findings.map(keyOf).join('\n')).digest('hex')}`;
const groupCounts = {}, signalCounts = {}, rawCounts = {}, pathCounts = {}, dispositionCounts = {}, groupDispositionCounts = {};
for (const finding of findings) {
  increment(groupCounts, finding.group);
  increment(signalCounts, finding.signal);
  increment(rawCounts, finding.raw_value);
  increment(pathCounts, `${finding.group}.${finding.path}`);
  const result = disposition(finding);
  increment(dispositionCounts, result);
  groupDispositionCounts[finding.group] ??= {};
  increment(groupDispositionCounts[finding.group], result);
}
dispositionCounts.intentionally_unknown_after_review ??= 0;
for (const group of Object.keys(groupDispositionCounts)) {
  groupDispositionCounts[group].replaceable_after_source_review ??= 0;
  groupDispositionCounts[group].invalid_placeholder_encoding ??= 0;
}

if (review.schema_version !== '1.0') fail('schema_version must be 1.0');
if (review.reviewed_at !== '2026-06-28') fail('reviewed_at must be 2026-06-28');
if (findings.length !== review.expected_total) fail(`finding total ${findings.length} does not match ${review.expected_total}`);
if (digest !== review.finding_key_digest) fail(`finding digest ${digest} does not match ${review.finding_key_digest}`);
checkCounts(signalCounts, review.signal_counts, 'signal_counts');
checkCounts(groupCounts, review.group_counts, 'group_counts');
checkCounts(pathCounts, review.path_counts, 'path_counts');
checkCounts(rawCounts, review.raw_value_counts, 'raw_value_counts');
checkCounts(dispositionCounts, review.disposition_counts, 'disposition_counts');
for (const [group, expected] of Object.entries(review.group_disposition_counts ?? {})) checkCounts(groupDispositionCounts[group] ?? {}, expected, `group_disposition_counts.${group}`);

for (const key of ['workflow_state_is_not_public_value','classification_does_not_resolve_underlying_fact','invalid_refers_to_field_encoding_not_whole_record','intentionally_unknown_requires_completed_source_review','deployment_resolution_is_deferred_to_pr226_229','reserve_placeholder_rows_require_separate_structural_review','no_automatic_placeholder_replacement']) {
  if (!review.policy?.[key]) fail(`missing policy flag: ${key}`);
}
if (typeof review.source_review !== 'string' || !fs.existsSync(path.join(root, review.source_review))) fail(`supporting audit missing: ${review.source_review}`);
else {
  const audit = fs.readFileSync(path.join(root, review.source_review), 'utf8');
  for (const phrase of ['Total findings: 112','Replaceable after source review: 67','Intentionally unknown after review: 0','Invalid placeholder encoding: 45',review.finding_key_digest]) if (!audit.includes(phrase)) fail(`supporting audit missing: ${phrase}`);
}

if (failures.length) {
  console.error('PR #224 direct workflow placeholder validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('PR #224 direct workflow placeholder review valid: 112 findings; 67 replaceable, 0 intentionally unknown, 45 invalid encodings.');
