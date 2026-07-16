import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const queuePath = 'docs/migration/evidence-archive-maintenance-queue-v7-pr403.json';
const configPath = 'config/evidence-archive-maintenance-batch-8-pr405.json';
const authorityPath = 'docs/migration/post-pr403-review-gate-pr404.json';
const outputPath = 'docs/migration/evidence-archive-maintenance-batch-8-pr405-review-queue.json';
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try { return await fetch(url, { ...options, signal: controller.signal }); }
  finally { clearTimeout(timer); }
}

async function probeLive(url) {
  try {
    const response = await fetchWithTimeout(url, {
      redirect: 'follow',
      headers: {
        'user-agent': 'Stable-or-Gone/1.0 evidence archive manual review probe',
        accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8'
      }
    });
    const body = (await response.text()).slice(0, 262144);
    const title = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, ' ').trim() ?? null;
    return {
      ok: response.ok,
      status: response.status,
      final_url: response.url,
      redirected: response.url !== url,
      content_type: response.headers.get('content-type'),
      title,
      sampled_body_sha256: sha256(body),
      sampled_body_bytes: Buffer.byteLength(body)
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      final_url: null,
      redirected: null,
      content_type: null,
      title: null,
      sampled_body_sha256: null,
      sampled_body_bytes: 0,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

async function probeCdx(url) {
  const query = new URL('https://web.archive.org/cdx/search/cdx');
  query.searchParams.set('url', url);
  query.searchParams.set('matchType', 'exact');
  query.searchParams.set('output', 'json');
  query.searchParams.set('filter', 'statuscode:200');
  query.searchParams.set('fl', 'timestamp,original,statuscode,mimetype,digest');
  query.searchParams.set('collapse', 'digest');
  try {
    const response = await fetchWithTimeout(query, {
      headers: {
        'user-agent': 'Stable-or-Gone/1.0 evidence archive manual review probe',
        accept: 'application/json,text/plain;q=0.9,*/*;q=0.8'
      }
    }, 45000);
    const body = await response.text();
    if (!response.ok) return { ok: false, status: response.status, query_url: query.toString(), capture_count: 0, sampled_captures: [], error: body.slice(0, 500) };
    const data = JSON.parse(body);
    const header = Array.isArray(data?.[0]) ? data[0] : [];
    const rows = Array.isArray(data) ? data.slice(1) : [];
    const captures = rows.map((values) => Object.fromEntries(header.map((key, index) => [key, values[index] ?? null])))
      .filter((row) => row.timestamp && row.digest)
      .sort((left, right) => left.timestamp.localeCompare(right.timestamp));
    const sampled = captures.length <= 16 ? captures : [...captures.slice(0, 8), ...captures.slice(-8)];
    return {
      ok: true,
      status: response.status,
      query_url: query.toString(),
      capture_count: captures.length,
      earliest_capture: captures[0] ?? null,
      latest_capture: captures.at(-1) ?? null,
      sampled_captures: sampled,
      captures_sample_truncated: sampled.length !== captures.length
    };
  } catch (error) {
    return { ok: false, status: null, query_url: query.toString(), capture_count: 0, sampled_captures: [], error: error instanceof Error ? error.message : String(error) };
  }
}

const config = readJson(configPath);
const queue = readJson(queuePath);
const authority = readJson(authorityPath);
const decision = authority.decisions?.evidence_archive_maintenance_batch_8;
if (decision?.pr !== 405 || decision?.decision !== 'approved_bounded_manual_review') throw new Error('PR #404 does not authorize PR #405');
const selected = queue.selected_candidates;
const selectedIds = selected.map((row) => row.evidence_id);
if (JSON.stringify(selectedIds) !== JSON.stringify(config.selected_evidence_ids)) throw new Error('PR #405 selected IDs do not match Queue v7 order');
if (JSON.stringify(decision.selected_evidence_ids) !== JSON.stringify(config.selected_evidence_ids)) throw new Error('PR #404 selected authority differs from PR #405 config');

const rows = [];
for (const candidate of selected) {
  const live = await probeLive(candidate.url);
  await sleep(750);
  const cdx = await probeCdx(candidate.url);
  rows.push({
    evidence_id: candidate.evidence_id,
    source_file: candidate.source_file,
    title: candidate.title,
    publisher: candidate.publisher,
    source_type: candidate.source_type,
    canonical_url: candidate.url,
    claim_scopes: candidate.claim_scopes,
    live_probe: live,
    exact_cdx_probe: cdx,
    review_status: 'pending_manual_review',
    proposed_outcome: null,
    accepted_archived_url: null,
    accepted_capture_timestamp: null,
    accepted_capture_digest: null,
    accepted_replacement_url: null,
    reviewer_reason: null,
    remaining_uncertainty: null
  });
  await sleep(750);
}

const output = {
  schema_version: '1.0',
  queue_id: 'sog_evidence_archive_maintenance_batch_8_pr405_review_queue',
  status: 'internal_manual_review_probe_complete',
  public_output: false,
  review_pr: 405,
  reviewed_at: config.reviewed_at,
  source_queue_id: queue.queue_id,
  selected_count: rows.length,
  automatic_canonical_write: false,
  exact_source_match_required: true,
  rows,
  boundaries: {
    canonical_data_changed: false,
    automatic_capture_promotion: false,
    automatic_source_replacement: false,
    public_surface_changed: false
  }
};

fs.mkdirSync(path.dirname(path.join(root, outputPath)), { recursive: true });
fs.writeFileSync(path.join(root, outputPath), serialize(output));
console.log(JSON.stringify({
  ok: true,
  queue_id: output.queue_id,
  selected_count: output.selected_count,
  live_ok: rows.filter((row) => row.live_probe.ok).length,
  exact_cdx_with_capture: rows.filter((row) => row.exact_cdx_probe.capture_count > 0).length,
  output: outputPath
}, null, 2));
