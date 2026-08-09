import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const inputPath = 'data/editorial-research/evidence-archive-payload-verification-batch-2-candidates-2026-08-09.json';
const outputDir = path.join(root, 'artifacts/evidence-archive-payload-verification-batch-2-probe');
const input = JSON.parse(fs.readFileSync(path.join(root, inputPath), 'utf8'));

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sha256 = (body) => crypto.createHash('sha256').update(body).digest('hex');
const safeName = (value) => value.replace(/[^a-z0-9._-]+/gi, '_');

function htmlToText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#x27;/gi, "'")
    .replace(/&#x2F;/gi, '/')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchWithRetry(url, options = {}, attempts = 3) {
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'user-agent': 'Stable-or-Gone Evidence Archive Review/2.0 (+https://www.stableorgone.com)',
          'accept': '*/*',
          ...(options.headers ?? {})
        }
      });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      clearTimeout(timeout);
      lastError = error;
      if (attempt < attempts) await sleep(1500 * attempt);
    }
  }
  throw lastError;
}

async function readBody(response) {
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function pickCaptures(rows, maximum = 6) {
  const captures = rows
    .filter((row) => row && row.timestamp && row.statuscode === '200')
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const picked = [];
  const seenDigests = new Set();
  for (const row of captures) {
    const digestKey = row.digest || `${row.timestamp}:${row.original}`;
    if (seenDigests.has(digestKey)) continue;
    seenDigests.add(digestKey);
    picked.push(row);
    if (picked.length >= maximum) break;
  }
  return picked;
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
  const cdxUrl = `https://web.archive.org/cdx/search/cdx?${params.toString()}`;
  const response = await fetchWithRetry(cdxUrl, { redirect: 'follow' });
  const body = await response.text();
  if (!response.ok) throw new Error(`CDX HTTP ${response.status}: ${body.slice(0, 300)}`);
  const parsed = JSON.parse(body);
  if (!Array.isArray(parsed) || parsed.length === 0) return { cdxUrl, rows: [] };
  const [headers, ...records] = parsed;
  const rows = records.map((record) => Object.fromEntries(headers.map((header, index) => [header, record[index] ?? null])));
  return { cdxUrl, rows };
}

async function fetchPayload(canonicalUrl, capture) {
  const replayUrl = `https://web.archive.org/web/${capture.timestamp}id_/${canonicalUrl}`;
  const response = await fetchWithRetry(replayUrl, { redirect: 'manual' });
  const body = await readBody(response);
  const contentType = response.headers.get('content-type') ?? '';
  const location = response.headers.get('location');
  const html = body.toString('utf8');
  const text = /html|text\//i.test(contentType) || /<html/i.test(html) ? htmlToText(html) : '';
  return {
    replayUrl,
    status: response.status,
    contentType,
    location,
    bytes: body.length,
    sha256: sha256(body),
    body,
    text
  };
}

async function fetchCurrent(canonicalUrl) {
  const response = await fetchWithRetry(canonicalUrl, { redirect: 'manual' });
  const body = await readBody(response);
  const contentType = response.headers.get('content-type') ?? '';
  const location = response.headers.get('location');
  const html = body.toString('utf8');
  const text = /html|text\//i.test(contentType) || /<html/i.test(html) ? htmlToText(html) : '';
  return {
    status: response.status,
    contentType,
    location,
    bytes: body.length,
    sha256: sha256(body),
    text
  };
}

const summary = {
  schema_version: '1.0',
  probe_id: 'sog_evidence_archive_payload_verification_batch_2_probe_2026_08_09',
  status: 'network_probe_only_manual_review_required',
  input_artifact_id: input.artifact_id,
  target_count: input.selected_candidates.length,
  method: 'Exact canonical-source Wayback CDX lookup, independent raw replay payload retrieval with redirects disabled, payload digest recording, extracted-text artifact emission, and separate current-source probe.',
  acceptance_boundary: 'Probe output is not a promotion decision. HTTP 200 exact-source archived payload must be manually inspected for claim-scope preservation; redirect-only, CDX-only, replacement targets, unrelated bodies, and unsupported snapshots remain insufficient.',
  targets: []
};

for (const candidate of input.selected_candidates) {
  const result = {
    evidence_id: candidate.evidence_id,
    canonical_url: candidate.url,
    source_file: candidate.source_file,
    title: candidate.title,
    publisher: candidate.publisher,
    source_type: candidate.source_type,
    published_at: candidate.published_at,
    claim_scopes: candidate.claim_scopes,
    current_source: null,
    cdx: null,
    captures: [],
    errors: []
  };

  const candidateDir = path.join(outputDir, safeName(candidate.evidence_id));
  fs.mkdirSync(candidateDir, { recursive: true });

  try {
    const current = await fetchCurrent(candidate.url);
    result.current_source = { ...current, text: undefined };
    fs.writeFileSync(path.join(candidateDir, 'current-source.txt'), `${current.text}\n`);
  } catch (error) {
    result.errors.push(`current_source: ${error?.message ?? String(error)}`);
  }

  await sleep(750);

  try {
    const { cdxUrl, rows } = await queryCdx(candidate.url);
    result.cdx = { url: cdxUrl, row_count: rows.length };
    const captures = pickCaptures(rows, 6);
    fs.writeFileSync(path.join(candidateDir, 'cdx.json'), `${JSON.stringify({ rows, selected: captures }, null, 2)}\n`);

    for (const capture of captures) {
      await sleep(900);
      try {
        const payload = await fetchPayload(candidate.url, capture);
        const record = {
          timestamp: capture.timestamp,
          original: capture.original,
          cdx_statuscode: capture.statuscode,
          cdx_mimetype: capture.mimetype,
          cdx_digest: capture.digest,
          cdx_length: capture.length,
          replay_url: payload.replayUrl,
          fetch_status: payload.status,
          content_type: payload.contentType,
          redirect_location: payload.location,
          payload_bytes: payload.bytes,
          payload_sha256: payload.sha256,
          extracted_text_bytes: Buffer.byteLength(payload.text)
        };
        result.captures.push(record);
        const prefix = `${capture.timestamp}`;
        fs.writeFileSync(path.join(candidateDir, `${prefix}.meta.json`), `${JSON.stringify(record, null, 2)}\n`);
        fs.writeFileSync(path.join(candidateDir, `${prefix}.payload.bin`), payload.body);
        fs.writeFileSync(path.join(candidateDir, `${prefix}.text.txt`), `${payload.text}\n`);
      } catch (error) {
        result.errors.push(`capture ${capture.timestamp}: ${error?.message ?? String(error)}`);
      }
    }
  } catch (error) {
    result.errors.push(`cdx: ${error?.message ?? String(error)}`);
  }

  fs.writeFileSync(path.join(candidateDir, 'summary.json'), `${JSON.stringify(result, null, 2)}\n`);
  summary.targets.push(result);
  console.log(JSON.stringify({
    evidence_id: result.evidence_id,
    current_status: result.current_source?.status ?? null,
    cdx_rows: result.cdx?.row_count ?? null,
    fetched_captures: result.captures.length,
    capture_statuses: result.captures.map((row) => [row.timestamp, row.fetch_status, row.payload_bytes]),
    errors: result.errors
  }));
}

summary.counts = {
  targets: summary.targets.length,
  targets_with_cdx_rows: summary.targets.filter((row) => (row.cdx?.row_count ?? 0) > 0).length,
  targets_with_fetched_capture: summary.targets.filter((row) => row.captures.length > 0).length,
  fetched_capture_count: summary.targets.reduce((sum, row) => sum + row.captures.length, 0),
  fetched_http_200_capture_count: summary.targets.reduce((sum, row) => sum + row.captures.filter((capture) => capture.fetch_status === 200).length, 0),
  targets_with_errors: summary.targets.filter((row) => row.errors.length > 0).length
};

fs.writeFileSync(path.join(outputDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
console.log(JSON.stringify({ probe_id: summary.probe_id, ...summary.counts }, null, 2));
