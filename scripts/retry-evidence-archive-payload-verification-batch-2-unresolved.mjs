import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const candidates = JSON.parse(fs.readFileSync(path.join(root, 'data/editorial-research/evidence-archive-payload-verification-batch-2-candidates-2026-08-09.json'), 'utf8'));
const targetIds = new Set([
  'sog_src_susd_sip420_2024',
  'sog_src_susd_sip423_2026',
  'sog_src_susd_synthetix_docs'
]);
const selected = candidates.selected_candidates.filter((row) => targetIds.has(row.evidence_id));
const outDir = path.join(root, 'artifacts/evidence-archive-payload-verification-batch-2-retry');
fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sha256 = (body) => crypto.createHash('sha256').update(body).digest('hex');
const safe = (value) => value.replace(/[^a-z0-9._-]+/gi, '_');

async function request(url, { redirect = 'follow', timeoutMs = 45000, attempts = 3 } = {}) {
  let error;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, {
        redirect,
        signal: controller.signal,
        headers: {
          'user-agent': 'Stable-or-Gone Evidence Archive Review Retry/2.0 (+https://www.stableorgone.com)',
          accept: '*/*'
        }
      });
      clearTimeout(timeout);
      return response;
    } catch (caught) {
      clearTimeout(timeout);
      error = caught;
      if (attempt < attempts) await sleep(1000 * attempt);
    }
  }
  throw error;
}

function toText(body, contentType) {
  const decoded = body.toString('utf8');
  if (!/html|text\//i.test(contentType) && !/<html/i.test(decoded)) return '';
  return decoded
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function cdx(url, extra = {}) {
  const params = new URLSearchParams({
    url,
    output: 'json',
    fl: 'timestamp,original,statuscode,mimetype,digest,length',
    filter: 'statuscode:200',
    collapse: 'digest',
    limit: '20',
    ...extra
  });
  const endpoint = `https://web.archive.org/cdx/search/cdx?${params.toString()}`;
  const response = await request(endpoint);
  const raw = await response.text();
  if (!response.ok) throw new Error(`CDX HTTP ${response.status}: ${raw.slice(0, 240)}`);
  const data = JSON.parse(raw);
  if (!Array.isArray(data) || data.length < 2) return { endpoint, rows: [] };
  const [header, ...body] = data;
  return { endpoint, rows: body.map((row) => Object.fromEntries(header.map((key, index) => [key, row[index] ?? null]))) };
}

function choose(rows, canonicalUrl) {
  const exact = rows.filter((row) => row.original === canonicalUrl);
  const source = exact.length ? exact : rows;
  return source
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .filter((row, index, all) => all.findIndex((other) => (other.digest || other.timestamp) === (row.digest || row.timestamp)) === index)
    .slice(0, 5);
}

async function replay(canonicalUrl, capture, dir) {
  const replayUrl = `https://web.archive.org/web/${capture.timestamp}id_/${canonicalUrl}`;
  const response = await request(replayUrl, { redirect: 'manual', timeoutMs: 45000, attempts: 2 });
  const body = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') ?? '';
  const text = toText(body, contentType);
  const meta = {
    capture_timestamp: capture.timestamp,
    cdx_original: capture.original,
    replay_url: replayUrl,
    fetch_status: response.status,
    redirect_location: response.headers.get('location'),
    content_type: contentType,
    payload_bytes: body.length,
    payload_sha256: sha256(body),
    extracted_text_bytes: Buffer.byteLength(text)
  };
  fs.writeFileSync(path.join(dir, `${capture.timestamp}.meta.json`), `${JSON.stringify(meta, null, 2)}\n`);
  fs.writeFileSync(path.join(dir, `${capture.timestamp}.payload.bin`), body);
  fs.writeFileSync(path.join(dir, `${capture.timestamp}.text.txt`), `${text}\n`);
  return meta;
}

const results = [];
for (const candidate of selected) {
  const dir = path.join(outDir, safe(candidate.evidence_id));
  fs.mkdirSync(dir, { recursive: true });
  const result = { evidence_id: candidate.evidence_id, canonical_url: candidate.url, claim_scopes: candidate.claim_scopes, queries: [], captures: [], errors: [] };
  const querySpecs = [
    { label: 'default', url: candidate.url, extra: {} },
    { label: 'exact', url: candidate.url, extra: { matchType: 'exact' } }
  ];
  if (!candidate.url.endsWith('/')) querySpecs.push({ label: 'trailing_slash_discovery_only', url: `${candidate.url}/`, extra: { matchType: 'exact' } });
  const merged = [];
  for (const spec of querySpecs) {
    try {
      const found = await cdx(spec.url, spec.extra);
      result.queries.push({ label: spec.label, queried_url: spec.url, endpoint: found.endpoint, row_count: found.rows.length });
      for (const row of found.rows) if (!merged.some((known) => known.timestamp === row.timestamp && known.original === row.original)) merged.push(row);
    } catch (error) {
      result.errors.push(`${spec.label} cdx: ${error?.message ?? String(error)}`);
    }
  }
  fs.writeFileSync(path.join(dir, 'cdx-merged.json'), `${JSON.stringify(merged, null, 2)}\n`);
  const captures = choose(merged, candidate.url);
  for (const capture of captures) {
    try {
      result.captures.push(await replay(candidate.url, capture, dir));
    } catch (error) {
      result.errors.push(`replay ${capture.timestamp}: ${error?.message ?? String(error)}`);
    }
  }
  fs.writeFileSync(path.join(dir, 'summary.json'), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify({ evidence_id: result.evidence_id, queries: result.queries, captures: result.captures, errors: result.errors }));
  results.push(result);
}

const summary = {
  schema_version: '1.0',
  retry_id: 'sog_evidence_archive_payload_verification_batch_2_unresolved_retry_2026_08_09',
  status: 'network_retry_only_manual_review_required',
  exact_canonical_replay_required: true,
  trailing_slash_queries_are_discovery_only: true,
  targets: results
};
fs.writeFileSync(path.join(outDir, 'summary.json'), `${JSON.stringify(summary, null, 2)}\n`);
