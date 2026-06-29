import fs from 'node:fs';
import path from 'node:path';

const ALLOWED_STATUSES = new Set(['pending_initial_acceptance', 'accepted']);
const ACCEPTED_FIELDS = [
  'accepted_final_url',
  'body_sha256',
  'normalized_content_sha256',
  'content_type',
  'etag',
  'last_modified',
  'accepted_observed_at',
  'accepted_repository_commit',
  'accepted_review_reference'
];
const FORBIDDEN_CONTENT_FIELDS = new Set([
  'body',
  'raw_body',
  'response_body',
  'normalized_body',
  'normalized_text',
  'page_text',
  'content',
  'html'
]);

function isIsoTimestamp(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
}

function isSha256(value) {
  return typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
}

function walkForForbiddenFields(value, trail = []) {
  const failures = [];
  if (!value || typeof value !== 'object') return failures;
  if (Array.isArray(value)) {
    value.forEach((item, index) => failures.push(...walkForForbiddenFields(item, [...trail, String(index)])));
    return failures;
  }
  for (const [key, item] of Object.entries(value)) {
    if (FORBIDDEN_CONTENT_FIELDS.has(key)) failures.push(`${[...trail, key].join('.')}: raw or normalized content field is prohibited`);
    failures.push(...walkForForbiddenFields(item, [...trail, key]));
  }
  return failures;
}

export function loadOfficialSourceBaselines(
  root = process.cwd(),
  relativePath = 'scripts/monitoring/baselines/official-source-baselines.json'
) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Official source baseline set must be an object');
  return value;
}

export function indexOfficialSourceBaselines(baselineSet) {
  return new Map((baselineSet.baselines ?? []).map((baseline) => [baseline.source_id, baseline]));
}

export function validateOfficialSourceBaselines(baselineSet, sources) {
  const failures = [];
  if (baselineSet.schema_version !== '1.0') failures.push('baseline set schema_version must be 1.0');
  if (baselineSet.baseline_set_id !== 'sog_official_source_baselines_v1') failures.push('baseline_set_id mismatch');
  if (!isIsoTimestamp(baselineSet.updated_at)) failures.push('updated_at must be an exact ISO-8601 timestamp');
  if (!Array.isArray(baselineSet.baselines)) failures.push('baselines must be an array');

  const policy = baselineSet.policy ?? {};
  const expectedPolicy = {
    human_review_required: true,
    monitoring_write_allowed: false,
    canonical_evidence: false,
    public_output: false,
    automatic_pull_request: false,
    production_publication: false
  };
  for (const [key, expected] of Object.entries(expectedPolicy)) {
    if (policy[key] !== expected) failures.push(`policy.${key} must be ${expected}`);
  }

  failures.push(...walkForForbiddenFields(baselineSet));

  const sourceById = new Map(sources.map((source) => [source.source_id, source]));
  const seen = new Set();
  for (const baseline of baselineSet.baselines ?? []) {
    const id = baseline?.source_id;
    if (!id || seen.has(id)) {
      failures.push(`${id || 'unknown'}: source_id missing or duplicated`);
      continue;
    }
    seen.add(id);
    const source = sourceById.get(id);
    if (!source) {
      failures.push(`${id}: baseline has no enabled official source`);
      continue;
    }
    if (baseline.source_url !== source.url) failures.push(`${id}: source_url must equal official source configuration`);
    if (!ALLOWED_STATUSES.has(baseline.status)) failures.push(`${id}: invalid baseline status ${baseline.status}`);

    for (const field of ACCEPTED_FIELDS) {
      if (!(field in baseline)) failures.push(`${id}: missing field ${field}`);
    }

    if (baseline.status === 'pending_initial_acceptance') {
      for (const field of ACCEPTED_FIELDS) {
        if (baseline[field] !== null) failures.push(`${id}: ${field} must be null while pending initial acceptance`);
      }
      continue;
    }

    let finalUrl;
    try {
      finalUrl = new URL(baseline.accepted_final_url);
      if (finalUrl.protocol !== 'https:') failures.push(`${id}: accepted_final_url must use HTTPS`);
      if (!source.allowed_hosts?.includes(finalUrl.hostname)) failures.push(`${id}: accepted_final_url host is not allowlisted`);
      if (finalUrl.username || finalUrl.password) failures.push(`${id}: accepted_final_url must not include credentials`);
      if (finalUrl.hash) failures.push(`${id}: accepted_final_url must not include a fragment`);
    } catch {
      failures.push(`${id}: accepted_final_url is invalid`);
    }
    if (!isSha256(baseline.body_sha256)) failures.push(`${id}: body_sha256 must be a lowercase SHA-256 digest`);
    if (!isSha256(baseline.normalized_content_sha256)) failures.push(`${id}: normalized_content_sha256 must be a lowercase SHA-256 digest`);
    if (typeof baseline.content_type !== 'string' || baseline.content_type.trim() === '') failures.push(`${id}: content_type is required`);
    if (baseline.etag !== null && typeof baseline.etag !== 'string') failures.push(`${id}: etag must be a string or null`);
    if (baseline.last_modified !== null && typeof baseline.last_modified !== 'string') failures.push(`${id}: last_modified must be a string or null`);
    if (!isIsoTimestamp(baseline.accepted_observed_at)) failures.push(`${id}: accepted_observed_at must be an exact ISO-8601 timestamp`);
    if (typeof baseline.accepted_repository_commit !== 'string' || !/^[a-f0-9]{40}$/.test(baseline.accepted_repository_commit)) failures.push(`${id}: accepted_repository_commit must be a lowercase 40-character SHA`);
    if (typeof baseline.accepted_review_reference !== 'string' || !/^PR #[1-9][0-9]*$/.test(baseline.accepted_review_reference)) failures.push(`${id}: accepted_review_reference must use PR #<number>`);
  }

  for (const source of sources) {
    if (!seen.has(source.source_id)) failures.push(`${source.source_id}: enabled official source is missing a baseline record`);
  }
  return failures;
}
