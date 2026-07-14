import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const queue = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/evidence-archive-maintenance-queue-pr365.json'), 'utf8'));
const outputPath = path.join(root, 'docs/migration/pr365-evidence-source-probe.json');
const cutoff = '20260714235959';

const fetchWithTimeout = async (url, options = {}, timeoutMs = 25000) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal, redirect: 'follow', headers: { 'user-agent': 'Stable-or-Gone-Evidence-Maintenance/1.0', ...(options.headers ?? {}) } });
  } finally {
    clearTimeout(timeout);
  }
};

const probeCurrent = async (url) => {
  try {
    const response = await fetchWithTimeout(url, { method: 'GET' });
    return { ok: response.ok, status: response.status, final_url: response.url, content_type: response.headers.get('content-type') };
  } catch (error) {
    return { ok: false, status: null, final_url: null, error: error.name === 'AbortError' ? 'timeout' : error.message };
  }
};

const probeCdx = async (url) => {
  const endpoint = new URL('https://web.archive.org/cdx/search/cdx');
  endpoint.searchParams.set('url', url);
  endpoint.searchParams.set('output', 'json');
  endpoint.searchParams.set('filter', 'statuscode:200');
  endpoint.searchParams.append('filter', 'mimetype:text/html');
  endpoint.searchParams.set('fl', 'timestamp,original,statuscode,mimetype,digest');
  endpoint.searchParams.set('collapse', 'digest');
  endpoint.searchParams.set('to', cutoff);
  try {
    const response = await fetchWithTimeout(endpoint.toString());
    const body = await response.text();
    if (!response.ok) return { ok: false, status: response.status, endpoint: endpoint.toString(), error: body.slice(0, 300), captures: [] };
    const parsed = JSON.parse(body);
    const headers = parsed[0] ?? [];
    const captures = parsed.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index]]))).sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    return { ok: true, status: response.status, endpoint: endpoint.toString(), captures };
  } catch (error) {
    return { ok: false, status: null, endpoint: endpoint.toString(), error: error.name === 'AbortError' ? 'timeout' : error.message, captures: [] };
  }
};

const results = [];
for (const candidate of queue.selected_candidates) {
  const [current, cdx] = await Promise.all([probeCurrent(candidate.url), probeCdx(candidate.url)]);
  const captures = cdx.captures ?? [];
  results.push({
    evidence_id: candidate.evidence_id,
    source_file: candidate.source_file,
    source_url: candidate.url,
    published_at: candidate.published_at,
    current,
    cdx: {
      ok: cdx.ok,
      status: cdx.status,
      error: cdx.error ?? null,
      capture_count: captures.length,
      first_capture: captures[0] ?? null,
      latest_capture: captures.at(-1) ?? null,
      captures
    }
  });
  console.log(`${candidate.evidence_id}: current=${current.status ?? current.error}; captures=${captures.length}`);
}

const report = {
  schema_version: '1.0',
  report_id: 'sog_pr365_evidence_source_probe_2026_07_14',
  status: 'internal_diagnostic_not_canonical_evidence',
  public_output: false,
  review_pr: 365,
  cutoff_timestamp: cutoff,
  queue_id: queue.queue_id,
  result_count: results.length,
  results
};
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Wrote ${path.relative(root, outputPath)}`);
