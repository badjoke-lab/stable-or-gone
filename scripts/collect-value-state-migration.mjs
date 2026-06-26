import fs from 'node:fs';
import path from 'node:path';
import { detectRawValueSignal, normalizeSignalText, publicValueStateValues } from '../config/value-states.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baseline = loadRegistryV2Baseline(root);
const SAMPLE_LIMIT = 12;

function readRows(relativePath) {
  const parsed = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.records)) return parsed.records;
  throw new Error(`${relativePath}: expected an array or records array`);
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function recordIdentity(row, index) {
  if (!isPlainObject(row)) return `row_${index}`;
  return row.id ?? row.stablecoin_id ?? row.organization_id ?? row.event_id ?? row.slug ?? row.name ?? `row_${index}`;
}

function scalarShape(value) {
  if (value === null) return 'null';
  if (typeof value !== 'string') return typeof value;
  const trimmed = value.trim();
  if (trimmed.length === 0) return 'blank';
  if (trimmed.length <= 80 && /^[a-z0-9_./:+ -]+$/i.test(trimmed)) return 'enum_or_compact';
  return 'prose';
}

function walkScalars(value, pathParts = []) {
  const results = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      results.push(...walkScalars(item, [...pathParts, '[]']));
    });
    return results;
  }
  if (isPlainObject(value)) {
    for (const [key, child] of Object.entries(value)) {
      results.push(...walkScalars(child, [...pathParts, key]));
    }
    return results;
  }
  results.push({ path: pathParts.join('.'), value });
  return results;
}

function increment(object, key, amount = 1) {
  object[key] = (object[key] ?? 0) + amount;
}

function addSample(bucket, sample) {
  if (bucket.samples.length >= SAMPLE_LIMIT) return;
  if (bucket.samples.some((existing) => existing.group === sample.group && existing.file === sample.file && existing.record_id === sample.record_id && existing.path === sample.path)) return;
  bucket.samples.push(sample);
}

const groups = {};
const paths = {};
const rawValues = {};
const signalCounts = {};
const findings = [];
let recordsScanned = 0;
let scalarValuesScanned = 0;
let sourceFilesScanned = 0;

for (const [groupName, files] of Object.entries(baseline.data_groups ?? {})) {
  const groupBucket = groups[groupName] ??= {
    files: 0,
    records: 0,
    scalar_values: 0,
    findings: 0,
    signals: {}
  };

  for (const relativePath of files) {
    const rows = readRows(relativePath);
    sourceFilesScanned += 1;
    groupBucket.files += 1;
    groupBucket.records += rows.length;
    recordsScanned += rows.length;

    rows.forEach((row, index) => {
      const recordId = String(recordIdentity(row, index));
      for (const scalar of walkScalars(row)) {
        scalarValuesScanned += 1;
        groupBucket.scalar_values += 1;
        const signal = detectRawValueSignal(scalar.value);
        if (!signal) continue;

        const rawText = scalar.value === null ? 'null' : scalar.value === undefined ? 'undefined' : String(scalar.value);
        const normalizedRaw = typeof scalar.value === 'string' ? normalizeSignalText(scalar.value) : rawText;
        const pathKey = `${groupName}:${scalar.path}`;
        const rawKey = `${signal}:${normalizedRaw}`;
        const finding = {
          group: groupName,
          file: relativePath,
          record_id: recordId,
          path: scalar.path,
          signal,
          scalar_shape: scalarShape(scalar.value),
          raw_value: scalar.value
        };

        increment(signalCounts, signal);
        increment(groupBucket.signals, signal);
        groupBucket.findings += 1;

        const pathBucket = paths[pathKey] ??= {
          group: groupName,
          path: scalar.path,
          total: 0,
          signals: {},
          samples: []
        };
        pathBucket.total += 1;
        increment(pathBucket.signals, signal);
        addSample(pathBucket, finding);

        const rawBucket = rawValues[rawKey] ??= {
          signal,
          normalized_raw_value: normalizedRaw,
          total: 0,
          samples: []
        };
        rawBucket.total += 1;
        addSample(rawBucket, finding);
        findings.push(finding);
      }
    });
  }
}

const sortedObject = (object) => Object.fromEntries(Object.entries(object).sort(([a], [b]) => a.localeCompare(b)));
const sortedPaths = Object.fromEntries(Object.entries(paths).sort(([, a], [, b]) => b.total - a.total || `${a.group}:${a.path}`.localeCompare(`${b.group}:${b.path}`)));
const sortedRawValues = Object.fromEntries(Object.entries(rawValues).sort(([, a], [, b]) => b.total - a.total || a.normalized_raw_value.localeCompare(b.normalized_raw_value)));
const sortedFindings = findings.sort((a, b) => `${a.group}:${a.file}:${a.record_id}:${a.path}`.localeCompare(`${b.group}:${b.file}:${b.record_id}:${b.path}`));

const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  approved_public_value_states: publicValueStateValues,
  totals: {
    source_files: sourceFilesScanned,
    records: recordsScanned,
    scalar_values: scalarValuesScanned,
    findings: sortedFindings.length,
    groups: Object.keys(groups).length
  },
  signal_counts: sortedObject(signalCounts),
  group_counts: Object.fromEntries(Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => [name, { ...value, signals: sortedObject(value.signals) }])),
  field_path_counts: sortedPaths,
  raw_signal_values: sortedRawValues,
  findings: sortedFindings
};

const output = path.join(root, 'data/generated/value-state-migration.json');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify({
  approved_public_value_states: report.approved_public_value_states,
  totals: report.totals,
  signal_counts: report.signal_counts,
  top_field_paths: Object.values(report.field_path_counts).slice(0, 20).map(({ group, path: fieldPath, total, signals }) => ({ group, path: fieldPath, total, signals })),
  top_raw_signal_values: Object.values(report.raw_signal_values).slice(0, 20).map(({ signal, normalized_raw_value, total }) => ({ signal, normalized_raw_value, total }))
}, null, 2));
