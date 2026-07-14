import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const queuePath = 'docs/migration/evidence-correction-queue-pr360.json';
const outputPath = process.argv[2] ?? 'artifacts/pr360/archive-probe.json';
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const readRows = (file) => {
  const value = readJson(file);
  const rows = Array.isArray(value) ? value : value.records;
  if (!Array.isArray(rows)) throw new Error(`${file}: expected array or { records: [] }`);
  return rows;
};

const baseline = loadRegistryV2Baseline(root);
const evidence = (baseline.data_groups?.evidence ?? []).flatMap(readRows);
const evidenceById = new Map(evidence.map((row) => [row.id, row]));
const queue = readJson(queuePath);

function compactDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ''))) return null;
  return value.replaceAll('-', '');
}

function distance(a, b) {
  return Math.abs(Number(a.slice(0, 8)) - Number(b));
}

function chooseSnapshot(snapshots, row) {
  if (!snapshots.length) return null;
  const published = compactDate(row.published_at);
  const accessed = compactDate(row.accessed_at);
  if (published) {
    const after = snapshots.filter((item) => item.timestamp.slice(0, 8) >= published);
    if (after.length) return after.sort((a, b) => a.timestamp.localeCompare(b.timestamp))[0];
    return [...snapshots].sort((a, b) => distance(a.timestamp, published) - distance(b.timestamp, published))[0];
  }
  if (accessed) {
    const before = snapshots.filter((item) => item.timestamp.slice(0, 8) <= accessed);
    if (before.length) return before.sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];
  }
  return [...snapshots].sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];
}

async function probe(candidate) {
  const row = evidenceById.get(candidate.evidence_id);
  if (!row) throw new Error(`Queue evidence missing: ${candidate.evidence_id}`);
  const query = new URL('https://web.archive.org/cdx/search/cdx');
  query.searchParams.set('url', row.url);
  query.searchParams.set('output', 'json');
  query.searchParams.set('fl', 'timestamp,original,statuscode,mimetype,digest');
  query.searchParams.append('filter', 'statuscode:200');
  query.searchParams.set('collapse', 'digest');
  query.searchParams.set('from', '2000');
  query.searchParams.set('to', '2026');
  query.searchParams.set('limit', '200');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);
  try {
    const response = await fetch(query, {
      headers: {'user-agent': 'Stable-or-Gone-Evidence-Review/1.0'},
      signal: controller.signal
    });
    const text = await response.text();
    if (!response.ok) {
      return {evidence_id: row.id, source_url: row.url, status: 'probe_error', http_status: response.status, error: text.slice(0, 500)};
    }
    const parsed = JSON.parse(text);
    const [header, ...records] = Array.isArray(parsed) ? parsed : [];
    if (!Array.isArray(header)) return {evidence_id: row.id, source_url: row.url, status: 'invalid_cdx_response', error: text.slice(0, 500)};
    const snapshots = records.map((record) => Object.fromEntries(header.map((key, index) => [key, record[index]])))
      .filter((item) => /^\d{14}$/.test(String(item.timestamp ?? '')));
    const selected = chooseSnapshot(snapshots, row);
    return {
      evidence_id: row.id,
      source_url: row.url,
      published_at: row.published_at ?? null,
      accessed_at: row.accessed_at ?? null,
      status: selected ? 'snapshot_found' : 'no_snapshot_found',
      snapshot_count: snapshots.length,
      selected_snapshot: selected ? {
        timestamp: selected.timestamp,
        original: selected.original,
        statuscode: selected.statuscode,
        mimetype: selected.mimetype,
        digest: selected.digest,
        archived_url: `https://web.archive.org/web/${selected.timestamp}/${selected.original}`
      } : null,
      first_snapshot: snapshots.length ? [...snapshots].sort((a, b) => a.timestamp.localeCompare(b.timestamp))[0].timestamp : null,
      last_snapshot: snapshots.length ? [...snapshots].sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0].timestamp : null
    };
  } catch (error) {
    return {evidence_id: row.id, source_url: row.url, status: 'probe_error', error: String(error?.message ?? error)};
  } finally {
    clearTimeout(timer);
  }
}

const results = [];
for (const candidate of queue.selected_candidates ?? []) results.push(await probe(candidate));
const report = {
  schema_version: '1.0',
  probe_id: 'sog_pr360_wayback_archive_probe_2026_07_14',
  status: 'review_input_not_canonical_change',
  generated_at: new Date().toISOString(),
  queue_id: queue.queue_id,
  selected_count: results.length,
  snapshot_found_count: results.filter((row) => row.status === 'snapshot_found').length,
  no_snapshot_found_count: results.filter((row) => row.status === 'no_snapshot_found').length,
  probe_error_count: results.filter((row) => row.status === 'probe_error').length,
  results
};
fs.mkdirSync(path.dirname(path.join(root, outputPath)), {recursive: true});
fs.writeFileSync(path.join(root, outputPath), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  ok: report.probe_error_count === 0,
  output: outputPath,
  selected_count: report.selected_count,
  snapshot_found_count: report.snapshot_found_count,
  no_snapshot_found_count: report.no_snapshot_found_count,
  probe_error_count: report.probe_error_count
}, null, 2));
