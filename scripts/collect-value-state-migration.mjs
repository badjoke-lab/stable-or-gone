import fs from 'node:fs';
import path from 'node:path';
import { detectRawValueSignal, normalizeSignalText, publicValueStateValues } from '../config/value-states.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baseline = loadRegistryV2Baseline(root);
const SAMPLE_LIMIT = 12;
const REFERENCE_PLACEHOLDER_SIGNALS = new Set(['work_queue_placeholder', 'mixed_placeholder', 'not_recorded_marker']);

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

function pathLeaf(fieldPath) {
  const parts = fieldPath.split('.').filter((part) => part && part !== '[]');
  return parts.at(-1) ?? '';
}

function isReferenceField(fieldPath) {
  const leaf = pathLeaf(fieldPath);
  return leaf === 'id'
    || leaf === 'slug'
    || leaf === 'href'
    || leaf === 'url'
    || leaf === 'urls'
    || leaf.endsWith('_id')
    || leaf.endsWith('_ids')
    || leaf.endsWith('_url')
    || leaf.endsWith('_urls');
}

function shouldIncludeFinding(fieldPath, value, signal, shape) {
  if (!isReferenceField(fieldPath)) return true;
  if (value === null || value === undefined || shape === 'blank') return false;
  return shape === 'enum_or_compact' && REFERENCE_PLACEHOLDER_SIGNALS.has(signal);
}

function walkScalars(value, pathParts = []) {
  const results = [];
  if (Array.isArray(value)) {
    value.forEach((item) => {
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
const directSignalCounts = {};
const narrativeSignalCounts = {};
const findings = [];
let recordsScanned = 0;
let scalarValuesScanned = 0;
let sourceFilesScanned = 0;
let excludedReferenceScalars = 0;

for (const [groupName, files] of Object.entries(baseline.data_groups ?? {})) {
  const groupBucket = groups[groupName] ??= {
    files: 0,
    records: 0,
    scalar_values: 0,
    findings: 0,
    direct_findings: 0,
    narrative_findings: 0,
    signals: {},
    direct_signals: {},
    narrative_signals: {}
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
        const shape = scalarShape(scalar.value);
        const signal = detectRawValueSignal(scalar.value);
        if (!signal) continue;
        if (!shouldIncludeFinding(scalar.path, scalar.value, signal, shape)) {
          excludedReferenceScalars += 1;
          continue;
        }

        const semanticScope = shape === 'prose' ? 'narrative_text' : 'direct_value';
        const rawText = scalar.value === null ? 'null' : scalar.value === undefined ? 'undefined' : String(scalar.value);
        const normalizedRaw = typeof scalar.value === 'string' ? normalizeSignalText(scalar.value) : rawText;
        const pathKey = `${groupName}:${scalar.path}:${semanticScope}`;
        const rawKey = `${semanticScope}:${signal}:${normalizedRaw}`;
        const finding = {
          group: groupName,
          file: relativePath,
          record_id: recordId,
          path: scalar.path,
          signal,
          semantic_scope: semanticScope,
          scalar_shape: shape,
          raw_value: scalar.value
        };

        increment(signalCounts, signal);
        increment(groupBucket.signals, signal);
        if (semanticScope === 'direct_value') {
          increment(directSignalCounts, signal);
          increment(groupBucket.direct_signals, signal);
          groupBucket.direct_findings += 1;
        } else {
          increment(narrativeSignalCounts, signal);
          increment(groupBucket.narrative_signals, signal);
          groupBucket.narrative_findings += 1;
        }
        groupBucket.findings += 1;

        const pathBucket = paths[pathKey] ??= {
          group: groupName,
          path: scalar.path,
          semantic_scope: semanticScope,
          total: 0,
          signals: {},
          samples: []
        };
        pathBucket.total += 1;
        increment(pathBucket.signals, signal);
        addSample(pathBucket, finding);

        const rawBucket = rawValues[rawKey] ??= {
          semantic_scope: semanticScope,
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
const sortedPaths = Object.fromEntries(Object.entries(paths).sort(([, a], [, b]) => b.total - a.total || `${a.group}:${a.path}:${a.semantic_scope}`.localeCompare(`${b.group}:${b.path}:${b.semantic_scope}`)));
const sortedRawValues = Object.fromEntries(Object.entries(rawValues).sort(([, a], [, b]) => b.total - a.total || a.normalized_raw_value.localeCompare(b.normalized_raw_value)));
const sortedFindings = findings.sort((a, b) => `${a.group}:${a.file}:${a.record_id}:${a.path}:${a.semantic_scope}`.localeCompare(`${b.group}:${b.file}:${b.record_id}:${b.path}:${b.semantic_scope}`));

const report = {
  schema_version: '1.1',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  approved_public_value_states: publicValueStateValues,
  totals: {
    source_files: sourceFilesScanned,
    records: recordsScanned,
    scalar_values: scalarValuesScanned,
    findings: sortedFindings.length,
    direct_findings: sortedFindings.filter((finding) => finding.semantic_scope === 'direct_value').length,
    narrative_findings: sortedFindings.filter((finding) => finding.semantic_scope === 'narrative_text').length,
    excluded_reference_scalars: excludedReferenceScalars,
    groups: Object.keys(groups).length
  },
  signal_counts: sortedObject(signalCounts),
  direct_signal_counts: sortedObject(directSignalCounts),
  narrative_signal_counts: sortedObject(narrativeSignalCounts),
  group_counts: Object.fromEntries(Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)).map(([name, value]) => [name, {
    ...value,
    signals: sortedObject(value.signals),
    direct_signals: sortedObject(value.direct_signals),
    narrative_signals: sortedObject(value.narrative_signals)
  }])),
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
  direct_signal_counts: report.direct_signal_counts,
  narrative_signal_counts: report.narrative_signal_counts,
  top_direct_field_paths: Object.values(report.field_path_counts).filter((entry) => entry.semantic_scope === 'direct_value').slice(0, 25).map(({ group, path: fieldPath, total, signals }) => ({ group, path: fieldPath, total, signals })),
  top_narrative_field_paths: Object.values(report.field_path_counts).filter((entry) => entry.semantic_scope === 'narrative_text').slice(0, 15).map(({ group, path: fieldPath, total, signals }) => ({ group, path: fieldPath, total, signals })),
  top_raw_signal_values: Object.values(report.raw_signal_values).slice(0, 25).map(({ semantic_scope, signal, normalized_raw_value, total }) => ({ semantic_scope, signal, normalized_raw_value, total }))
}, null, 2));
