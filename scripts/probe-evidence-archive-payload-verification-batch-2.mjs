import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const input = JSON.parse(fs.readFileSync(path.join(root, 'data/editorial-research/evidence-archive-payload-verification-batch-2-candidates-2026-08-09.json'), 'utf8'));
const outputDir = path.join(root, 'artifacts/evidence-archive-payload-verification-batch-2-probe');
fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const sha256 = (body) => crypto.createHash('sha256').update(body).digest('hex');
const safeName = (value) => value.replace(/[^a-z0-9._-]+/gi, '_');
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function htmlToText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchTimed(url, { redirect = 'follow', attempts = 2 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url, {
        redirect,
        signal: controller.signal,
        headers: {
          'user-agent': 'Stable-or-Gone Evidence Archive Review/2.1 (+https://www.stableorgone.com)',
          accept: '*/*'
        }
      });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt < attempts) await delay(500);
    }
  }
  throw lastError;
}

async function queryCdx(canonicalUrl) {
  const params = new URLSearchParams({
    url: canonicalUrl,
    output: 'json',
    fl: 'timestamp,original,statuscode,mimetype,digest,length',
    filter: 'statuscode:200',
    collapse: 'digest',
    limit: '100'
  });
  const url = `https://web.archive.org/cdx/search/cdx?${params.toString()}`;
  const response = await fetchTimed(url);
  const raw = await response.text();
  if (!response.ok) throw new Error(`CDX HTTP ${response.status}: ${raw.slice(0, 200)}`);
  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed) || parsed.length < 2) return { url, rows: [] };
  const [headers, ...records] = parsed;
  const rows = records.map((record) => Object.fromEntries(headers.map((name, index) => [name, record[index] ?? null])));
  return { url, rows };
}

function selectCaptures(rows) {
  return rows
    .filter((row) => row?.timestamp && row.statuscode === '200')
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .filter((row, index, all) => all.findIndex((other) => (other.digest || other.timestamp) === (row.digest || row.timestamp)) === index)
    .slice(0, 3);
}

async function fetchCapture(canonicalUrl, capture, candidateDir) {
  const replayUrl = `https://web.archive.org/web/${capture.timestamp}id_/${canonicalUrl}`;
  const response = await fetchTimed(replayUrl, { redirect: 'manual' });
  const body = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') ?? '';
  const location = response.headers.get('location');
  const decoded = body.toString('utf8');
  const text = /html|text\//i.test(contentType) || /<html/i.test(decoded) ? htmlToText(decoded) : '';
  const meta = {
    timestamp: capture.timestamp,
    original: capture.original,
    cdx_statuscode: capture.statuscode,
    cdx_mimetype: capture.mimetype,
    cdx_digest: capture.digest,
    replay_url: replayUrl,
    fetch_status: response.status,
    content_type: contentType,
    redirect_location: location,
    payload_bytes: body.length,
    payload_sha256: sha256(body),
    extracted_text_bytes: Buffer.byteLength(text)
  };
  fs.writeFileSync(path.join(candidateDir, `${capture.timestamp}.meta.json`), `${JSON.stringify(meta, null, 2)}\n`);
  fs.writeFileSync(path.join(candidateDir, `${capture.timestamp}.payload.bin`), body);
  fs.writeFileSync(path.join(candidateDir, `${capture.timestamp}.text.txt`), `${text}\n`);
  return meta;
}

async function probeCandidate(candidate) {
  const candidateDir = path.join(outputDir, safeName(candidate.evidence_id));
  fs.mkdirSync(candidateDir, { recursive: true });
  const result = {
    evidence_id: candidate.evidence_id,
    canonical_url: candidate.url,
    title: candidate.title,
    publisher: candidate.publisher,
    source_type: candidate.source_type,
    published_at: candidate.published_at,
    claim_scopes: candidate.claim_scopes,
    cdx: null,
    captures: [],
    errors: []
  };
  try {
    const cdx = await queryCdx(candidate.url);
    const selected = selectCaptures(cdx.rows);
    result.cdx = { url: cdx.url, row_count: cdx.rows.length, selected_count: selected.length };
    fs.writeFileSync(path.join(candidateDir, 'cdx.json'), `${JSON.stringify({ rows: cdx.rows, selected }, null, 2)}\n`);
    result.captures = await Promise.all(selected.map(async (capture, index) => {
      await delay(index * 250);
      try {
        return await fetchCapture(candidate.url, capture, candidateDir);
      } catch (error) {
        result.errors.push(`capture ${capture.timestamp}: ${error?.message ?? String(error)}`);
        return null;
      }
    }));
    result.captures = result.captures.filter(Boolean);
  } catch (error) {
    result.errors.push(`cdx: ${error?.message ?? String(error)}`);
  }
  fs.writeFileSync(path.join(candidateDir, 'summary.json'), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({ evidence_id: result.evidence_id, cdx_rows: result.cdx?.row_count ?? null, captures: result.captures.map((row) => [row.timestamp, row.fetch_status, row.payload_bytes]), errors: result.errors }));
  return result;
}

const targets = [];
for (let offset = 0; offset < input.selected_candidates.length; offset += 5) {
  const batch = input.selected_candidates.slice(offset, offset + 5);
  targets.push(...await Promise.all(batch.map(probeCandidate)));
}

const summary = {
  schema_version: '1.0',
  probe_id: 'sog_evidence_archive_payload_verification_batch_2_probe_2026_08_09',
  status: 'network_probe_only_manual_review_required',
  input_artifact_id: input.artifact_id,
  target_count: input.selected_candidates.length,
  method: 'Exact canonical-source Wayback CDX lookup plus independent raw replay payload retrieval with redirects disabled; three latest unique HTTP-200 CDX bodies sampled per target; payload bytes, SHA-256 and extracted text retained for manual inspection.',
  acceptance_boundary: 'Probe output is not a promotion decision. An exact-source replay must itself return HTTP 200 and its archived payload must be manually inspected for the existing claim scope. CDX-only, redirects, replacements and unrelated payloads are insufficient.',
  targets
};
summary.counts = {
  targets: targets.length,
  targets_with_cdx_rows: targets.filter((row) => (row.cdx?.row_count ?? 0) > 0).length,
  targets_with_fetched_capture: targets.filter((row) => row.captures.length > 0).length,
  fetched_capture_count: targets.reduce((sum, row) => sum + row.captures.length, 0),
  fetched_http_200_capture_count: targets.reduce((sum, row) => sum + row.captures.filter((capture) => capture.fetch_status === 200).length, 0),
  targets_with_errors: targets.filter((row) => row.errors.length > 0).length
};
fs.writeFileSync(path.join(outputDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify({ probe_id: summary.probe_id, ...summary.counts }, null, 2));
