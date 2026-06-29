import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from '../../load-registry-v2-baseline.mjs';
import {
  indexOfficialSourceBaselines,
  loadOfficialSourceBaselines,
  validateOfficialSourceBaselines
} from '../baselines/baseline-store.mjs';
import {
  OFFICIAL_SOURCE_NORMALIZATION_VERSION,
  normalizeOfficialSourceBody
} from '../normalization/official-source-normalizer.mjs';

export { normalizeOfficialSourceBody } from '../normalization/official-source-normalizer.mjs';

const MAX_BODY_BYTES = 2 * 1024 * 1024;
const TIMEOUT_MS = 20_000;

const SIGNAL_KEYWORDS = {
  reserve_update: ['reserve', 'reserves', 'backing assets', 'total reserves', 'portfolio composition'],
  assurance_update: ['assurance', 'attestation', 'attestations', 'independent third-party', 'report'],
  issuance_redemption_update: ['issuance', 'issued', 'redemption', 'redeemed', 'circulation'],
  backing_attestation_update: ['custodian', 'attestation', 'backing assets', 'transparency']
};

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function readRows(root, relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected array or records array`);
}

function loadCanonicalIndex(root) {
  const baseline = loadRegistryV2Baseline(root);
  const stablecoins = (baseline.data_groups?.stablecoins ?? []).flatMap((file) => readRows(root, file));
  const organizations = (baseline.data_groups?.organizations ?? []).flatMap((file) => readRows(root, file));
  const relationships = (baseline.data_groups?.relationships ?? []).flatMap((file) => readRows(root, file));
  return {
    stablecoinIds: new Set(stablecoins.map((row) => row.id)),
    organizationIds: new Set(organizations.map((row) => row.id)),
    relationships
  };
}

export function loadOfficialSources(root = process.cwd(), relativePath = 'scripts/monitoring/sources/official-sources.json') {
  const sources = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (!Array.isArray(sources)) throw new Error('Official source allowlist must be an array');
  return sources.filter((source) => source.enabled !== false);
}

export function validateOfficialSources(sources, canonicalIndex) {
  const failures = [];
  const ids = new Set();
  for (const source of sources) {
    if (!source.source_id || ids.has(source.source_id)) failures.push(`${source.source_id || 'unknown'}: source_id missing or duplicated`);
    ids.add(source.source_id);
    let parsed;
    try {
      parsed = new URL(source.url);
      if (parsed.protocol !== 'https:') failures.push(`${source.source_id}: source URL must use HTTPS`);
    } catch {
      failures.push(`${source.source_id}: invalid source URL`);
    }
    if (!Array.isArray(source.allowed_hosts) || source.allowed_hosts.length === 0) failures.push(`${source.source_id}: allowed_hosts missing`);
    else if (parsed && !source.allowed_hosts.includes(parsed.hostname)) failures.push(`${source.source_id}: configured host is not allowlisted`);
    for (const id of source.affected_stablecoin_ids ?? []) if (!canonicalIndex.stablecoinIds.has(id)) failures.push(`${source.source_id}: unknown stablecoin ${id}`);
    for (const id of source.affected_organization_ids ?? []) if (!canonicalIndex.organizationIds.has(id)) failures.push(`${source.source_id}: unknown organization ${id}`);
    for (const signalType of source.signal_types ?? []) if (!SIGNAL_KEYWORDS[signalType]) failures.push(`${source.source_id}: unknown signal type ${signalType}`);
  }
  return failures;
}

function detectSignals(source, normalizedText) {
  const lower = normalizedText.toLowerCase();
  const signalTypes = [];
  const keywords = [];
  for (const signalType of source.signal_types ?? []) {
    const matched = (SIGNAL_KEYWORDS[signalType] ?? []).filter((keyword) => lower.includes(keyword.toLowerCase()));
    if (matched.length > 0) {
      signalTypes.push(signalType);
      keywords.push(...matched);
    }
  }
  return {
    signalTypes: [...new Set(signalTypes)].sort(),
    keywords: [...new Set(keywords)].sort()
  };
}

function buildLineageReview(source, relationships) {
  const stablecoinIds = new Set(source.affected_stablecoin_ids ?? []);
  const organizationIds = new Set(source.affected_organization_ids ?? []);
  const matches = relationships.filter((row) => stablecoinIds.has(row.stablecoin_id) && organizationIds.has(row.organization_id));
  return {
    state: matches.length > 0 ? 'canonical_relationships_found' : 'no_canonical_relationship_found',
    relationship_ids: matches.map((row) => row.id).sort(),
    relationship_count: matches.length
  };
}

function buildDuplicateReview(source, canonicalIndex) {
  const missingStablecoins = (source.affected_stablecoin_ids ?? []).filter((id) => !canonicalIndex.stablecoinIds.has(id));
  const missingOrganizations = (source.affected_organization_ids ?? []).filter((id) => !canonicalIndex.organizationIds.has(id));
  return {
    state: missingStablecoins.length === 0 && missingOrganizations.length === 0 ? 'existing_targets_confirmed' : 'missing_target_reference',
    matched_stablecoin_ids: (source.affected_stablecoin_ids ?? []).filter((id) => canonicalIndex.stablecoinIds.has(id)),
    matched_organization_ids: (source.affected_organization_ids ?? []).filter((id) => canonicalIndex.organizationIds.has(id)),
    missing_stablecoin_ids: missingStablecoins,
    missing_organization_ids: missingOrganizations
  };
}

function baselineSubset(root, sources, providedBaselineSet) {
  if (providedBaselineSet) return providedBaselineSet;
  const full = loadOfficialSourceBaselines(root);
  const sourceIds = new Set(sources.map((source) => source.source_id));
  return {
    ...full,
    baselines: (full.baselines ?? []).filter((baseline) => sourceIds.has(baseline.source_id))
  };
}

function metadataDifferences(baseline, observed) {
  const differences = [];
  if (baseline.body_sha256 !== observed.body_sha256) differences.push('exact_body_sha256');
  if (baseline.accepted_final_url !== observed.final_url) differences.push('final_url');
  if (baseline.content_type !== observed.content_type) differences.push('content_type');
  if (baseline.etag !== observed.etag) differences.push('etag');
  if (baseline.last_modified !== observed.last_modified) differences.push('last_modified');
  return differences;
}

function comparisonMetadata(baseline, observed, baselineNormalizationVersion) {
  return {
    baseline_normalization_version: baselineNormalizationVersion ?? null,
    observed_normalization_version: observed?.normalization_version ?? OFFICIAL_SOURCE_NORMALIZATION_VERSION,
    baseline_final_url: baseline?.accepted_final_url ?? null,
    observed_final_url: observed?.final_url ?? null,
    baseline_content_type: baseline?.content_type ?? null,
    observed_content_type: observed?.content_type ?? null,
    baseline_etag: baseline?.etag ?? null,
    observed_etag: observed?.etag ?? null,
    baseline_last_modified: baseline?.last_modified ?? null,
    observed_last_modified: observed?.last_modified ?? null
  };
}

function buildBaselineComparison(baseline, observed, baselineNormalizationVersion) {
  if (!baseline || baseline.status === 'pending_initial_acceptance') {
    return {
      state: 'new_source',
      classification_reason: baseline ? 'baseline_pending_initial_acceptance' : 'baseline_missing',
      baseline_status: baseline?.status ?? 'missing',
      baseline_body_sha256: baseline?.body_sha256 ?? null,
      baseline_normalized_content_sha256: baseline?.normalized_content_sha256 ?? null,
      observed_body_sha256: observed.body_sha256,
      observed_normalized_content_sha256: observed.normalized_content_sha256,
      exact_body_changed: null,
      normalized_content_changed: null,
      metadata_changed: null,
      metadata_changes: [],
      ...comparisonMetadata(baseline, observed, baselineNormalizationVersion),
      accepted_observed_at: baseline?.accepted_observed_at ?? null,
      accepted_repository_commit: baseline?.accepted_repository_commit ?? null,
      accepted_review_reference: baseline?.accepted_review_reference ?? null
    };
  }

  const exactBodyChanged = baseline.body_sha256 !== observed.body_sha256;
  const normalizedContentChanged = baseline.normalized_content_sha256 !== observed.normalized_content_sha256;
  const changes = metadataDifferences(baseline, observed);
  const metadataChanged = changes.length > 0;
  const state = normalizedContentChanged ? 'content_changed' : metadataChanged ? 'metadata_changed' : 'unchanged';
  return {
    state,
    classification_reason: normalizedContentChanged
      ? 'normalized_content_digest_changed'
      : metadataChanged
        ? 'normalized_content_same_metadata_differs'
        : 'normalized_content_and_metadata_match',
    baseline_status: baseline.status,
    baseline_body_sha256: baseline.body_sha256,
    baseline_normalized_content_sha256: baseline.normalized_content_sha256,
    observed_body_sha256: observed.body_sha256,
    observed_normalized_content_sha256: observed.normalized_content_sha256,
    exact_body_changed: exactBodyChanged,
    normalized_content_changed: normalizedContentChanged,
    metadata_changed: metadataChanged,
    metadata_changes: changes,
    ...comparisonMetadata(baseline, observed, baselineNormalizationVersion),
    accepted_observed_at: baseline.accepted_observed_at,
    accepted_repository_commit: baseline.accepted_repository_commit,
    accepted_review_reference: baseline.accepted_review_reference
  };
}

function failedComparison(baseline, baselineNormalizationVersion) {
  return {
    state: 'fetch_failed',
    classification_reason: 'successful_observation_unavailable',
    baseline_status: baseline?.status ?? 'missing',
    baseline_body_sha256: baseline?.body_sha256 ?? null,
    baseline_normalized_content_sha256: baseline?.normalized_content_sha256 ?? null,
    observed_body_sha256: null,
    observed_normalized_content_sha256: null,
    exact_body_changed: null,
    normalized_content_changed: null,
    metadata_changed: null,
    metadata_changes: [],
    ...comparisonMetadata(baseline, null, baselineNormalizationVersion),
    accepted_observed_at: baseline?.accepted_observed_at ?? null,
    accepted_repository_commit: baseline?.accepted_repository_commit ?? null,
    accepted_review_reference: baseline?.accepted_review_reference ?? null
  };
}

function countChangeStates(observations) {
  const counts = { unchanged: 0, metadata_changed: 0, content_changed: 0, new_source: 0, fetch_failed: 0 };
  for (const observation of observations) {
    const state = observation.baseline_comparison?.state;
    if (state in counts) counts[state] += 1;
  }
  return counts;
}

export async function observeOfficialSources(options = {}) {
  const root = options.root ?? process.cwd();
  const observedAt = options.observedAt ?? new Date().toISOString();
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const sources = options.sources ?? loadOfficialSources(root);
  const canonicalIndex = loadCanonicalIndex(root);
  const validationFailures = validateOfficialSources(sources, canonicalIndex);
  if (validationFailures.length) throw new Error(`Official source allowlist invalid: ${validationFailures.join('; ')}`);

  const baselineSet = baselineSubset(root, sources, options.baselineSet);
  const baselineFailures = validateOfficialSourceBaselines(baselineSet, sources);
  if (baselineFailures.length) throw new Error(`Official source baselines invalid: ${baselineFailures.join('; ')}`);
  const baselines = indexOfficialSourceBaselines(baselineSet);

  const observations = [];
  const candidates = [];
  for (const source of sources) {
    const baseline = baselines.get(source.source_id);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? TIMEOUT_MS);
    try {
      const response = await fetchImpl(source.url, {
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'user-agent': 'Stable-or-Gone-Review-Monitor/1.0', accept: 'text/html,application/json,text/plain;q=0.9,*/*;q=0.1' }
      });
      const finalUrl = response.url || source.url;
      const finalHost = new URL(finalUrl).hostname;
      if (!source.allowed_hosts.includes(finalHost)) throw new Error(`redirected outside allowlist: ${finalHost}`);
      const bytes = new Uint8Array(await response.arrayBuffer());
      if (bytes.byteLength > (options.maxBodyBytes ?? MAX_BODY_BYTES)) throw new Error(`response exceeds ${options.maxBodyBytes ?? MAX_BODY_BYTES} bytes`);
      const contentType = response.headers?.get?.('content-type') ?? null;
      const bodyHash = sha256(bytes);
      const normalized = normalizeOfficialSourceBody(bytes, contentType);
      const normalizedHash = sha256(normalized);
      const detected = response.ok ? detectSignals(source, normalized) : { signalTypes: [], keywords: [] };
      const observationId = `obs_${sha256(`${source.source_id}|${bodyHash}`).slice(0, 20)}`;
      const observation = {
        observation_id: observationId,
        source_id: source.source_id,
        source_identity: { display_name: source.display_name, source_kind: source.source_kind },
        source_url: source.url,
        final_url: finalUrl,
        observed_at: observedAt,
        fetch_status: response.ok ? 'ok' : 'http_error',
        http_status: response.status,
        content_type: contentType,
        etag: response.headers?.get?.('etag') ?? null,
        last_modified: response.headers?.get?.('last-modified') ?? null,
        body_sha256: bodyHash,
        normalization_version: OFFICIAL_SOURCE_NORMALIZATION_VERSION,
        normalized_content_sha256: normalizedHash,
        body_bytes: bytes.byteLength,
        matched_signal_types: detected.signalTypes,
        matched_keywords: detected.keywords,
        error: response.ok ? null : `HTTP ${response.status}`
      };
      observation.baseline_comparison = response.ok
        ? buildBaselineComparison(baseline, observation, baselineSet.normalization_version)
        : failedComparison(baseline, baselineSet.normalization_version);
      observations.push(observation);

      if (response.ok && detected.signalTypes.length > 0 && ['new_source', 'content_changed'].includes(observation.baseline_comparison.state)) {
        candidates.push({
          candidate_id: `candidate_${sha256(`${observationId}|${detected.signalTypes.join(',')}`).slice(0, 20)}`,
          status: 'needs_human_review',
          created_at: observedAt,
          observation_id: observationId,
          source_id: source.source_id,
          source_url: source.url,
          normalization_version: OFFICIAL_SOURCE_NORMALIZATION_VERSION,
          change_state: observation.baseline_comparison.state,
          classification_reason: observation.baseline_comparison.classification_reason,
          baseline_comparison: observation.baseline_comparison,
          affected_stablecoin_ids: [...(source.affected_stablecoin_ids ?? [])],
          affected_organization_ids: [...(source.affected_organization_ids ?? [])],
          signal_types: detected.signalTypes,
          matched_keywords: detected.keywords,
          duplicate_review: buildDuplicateReview(source, canonicalIndex),
          lineage_review: buildLineageReview(source, canonicalIndex.relationships),
          canonical_action: 'none'
        });
      }
    } catch (error) {
      observations.push({
        observation_id: `obs_${sha256(`${source.source_id}|${observedAt}|error`).slice(0, 20)}`,
        source_id: source.source_id,
        source_identity: { display_name: source.display_name, source_kind: source.source_kind },
        source_url: source.url,
        final_url: null,
        observed_at: observedAt,
        fetch_status: 'error',
        http_status: null,
        content_type: null,
        etag: null,
        last_modified: null,
        body_sha256: null,
        normalization_version: OFFICIAL_SOURCE_NORMALIZATION_VERSION,
        normalized_content_sha256: null,
        body_bytes: 0,
        matched_signal_types: [],
        matched_keywords: [],
        baseline_comparison: failedComparison(baseline, baselineSet.normalization_version),
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      clearTimeout(timeout);
    }
  }

  const sourceErrors = observations.filter((row) => row.fetch_status !== 'ok').length;
  return {
    schema_version: '1.0',
    monitor: 'official-source-observer',
    status: sourceErrors === 0 ? 'ok' : sourceErrors === observations.length ? 'failed' : 'partial',
    observed_at: observedAt,
    baseline_set_id: baselineSet.baseline_set_id,
    normalization_version: OFFICIAL_SOURCE_NORMALIZATION_VERSION,
    observation_count: observations.length,
    candidate_count: candidates.length,
    source_errors: sourceErrors,
    change_counts: countChangeStates(observations),
    observations,
    candidates
  };
}
