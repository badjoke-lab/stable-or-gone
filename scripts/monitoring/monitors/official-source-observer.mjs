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
  backing_attestation_update: ['custodian', 'attestation', 'backing assets', 'transparency'],
  lifecycle_update: [
    'migration',
    'migrate',
    'upgrade',
    'upgraded',
    'optional',
    'rebrand',
    'renamed',
    'now be known as',
    'wind down',
    'winding down',
    'halt minting',
    'cease issuance',
    'shutdown',
    'retire',
    'retirement',
    'conversion',
    'convert',
    'here to stay'
  ]
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
    observed_normalization_version: observed.normalization_version ?? null,
    baseline_normalized_content_sha256: baseline.normalized_content_sha256,
    observed_normalized_content_sha256: observed.normalized_content_sha256,
    baseline_body_sha256: baseline.body_sha256,
    observed_body_sha256: observed.body_sha256,
    baseline_final_url: baseline.accepted_final_url,
    observed_final_url: observed.final_url,
    normalization_version_compatible: baselineNormalizationVersion === observed.normalization_version
  };
}

function classifyObservation({ baseline, observed, baselineNormalizationVersion }) {
  if (observed.status === 'fetch_failed') return 'fetch_failed';
  if (!baseline || baseline.status === 'pending_initial_acceptance') return 'new_source';
  const normalizationCompatible = baselineNormalizationVersion === observed.normalization_version;
  if (!normalizationCompatible) return 'normalization_version_changed';
  const normalizedSame = baseline.normalized_content_sha256 === observed.normalized_content_sha256;
  const metadataChanged = metadataDifferences(baseline, observed).length > 0;
  if (normalizedSame && !metadataChanged) return 'unchanged';
  if (normalizedSame && metadataChanged) return 'metadata_changed';
  return 'content_changed';
}

export async function observeOfficialSources({ root = process.cwd(), sources, baselineSet, fetchImpl = fetch }) {
  const canonicalIndex = loadCanonicalIndex(root);
  const failures = validateOfficialSources(sources, canonicalIndex);
  const effectiveBaselineSet = baselineSubset(root, sources, baselineSet);
  failures.push(...validateOfficialSourceBaselines(effectiveBaselineSet, sources));
  if (failures.length > 0) throw new Error(`Official source validation failed:\n${failures.join('\n')}`);

  const baselineIndex = indexOfficialSourceBaselines(effectiveBaselineSet);
  const observations = [];
  for (const source of sources) {
    const startedAt = new Date().toISOString();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetchImpl(source.url, {
        redirect: 'follow',
        signal: controller.signal,
        headers: { 'user-agent': 'Stable-or-Gone-monitoring-review/1.0' }
      });
      const finalUrl = new URL(response.url || source.url);
      const contentType = response.headers.get('content-type');
      const allowedFinalHost = source.allowed_hosts.includes(finalUrl.hostname);
      const contentLength = Number(response.headers.get('content-length') || '0');
      if (!allowedFinalHost) throw new Error(`final host is not allowlisted: ${finalUrl.hostname}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!String(contentType || '').toLowerCase().includes('text/html')) throw new Error(`unsupported content type: ${contentType}`);
      if (contentLength > MAX_BODY_BYTES) throw new Error(`response exceeds maximum body size: ${contentLength}`);
      const body = await response.text();
      if (Buffer.byteLength(body) > MAX_BODY_BYTES) throw new Error('response body exceeds maximum body size');
      const normalized = normalizeOfficialSourceBody(body);
      const signals = detectSignals(source, normalized.text);
      const observed = {
        source_id: source.source_id,
        display_name: source.display_name,
        source_kind: source.source_kind,
        configured_url: source.url,
        final_url: finalUrl.toString(),
        final_host: finalUrl.hostname,
        fetched_at: new Date().toISOString(),
        started_at: startedAt,
        status: 'ok',
        http_status: response.status,
        content_type: contentType,
        content_length: Buffer.byteLength(body),
        body_sha256: sha256(body),
        normalized_content_sha256: normalized.sha256,
        normalization_version: OFFICIAL_SOURCE_NORMALIZATION_VERSION,
        etag: response.headers.get('etag'),
        last_modified: response.headers.get('last-modified'),
        signal_types: signals.signalTypes,
        signal_keywords: signals.keywords,
        affected_stablecoin_ids: source.affected_stablecoin_ids ?? [],
        affected_organization_ids: source.affected_organization_ids ?? [],
        duplicate_review: buildDuplicateReview(source, canonicalIndex),
        lineage_review: buildLineageReview(source, canonicalIndex.relationships)
      };
      const baseline = baselineIndex.get(source.source_id) ?? null;
      const observationClass = classifyObservation({
        baseline,
        observed,
        baselineNormalizationVersion: effectiveBaselineSet.normalization_version
      });
      observations.push({
        ...observed,
        observation_class: observationClass,
        comparison: comparisonMetadata(baseline ?? {}, observed, effectiveBaselineSet.normalization_version),
        metadata_differences: baseline ? metadataDifferences(baseline, observed) : []
      });
    } catch (error) {
      const observed = {
        source_id: source.source_id,
        display_name: source.display_name,
        source_kind: source.source_kind,
        configured_url: source.url,
        fetched_at: new Date().toISOString(),
        started_at: startedAt,
        status: 'fetch_failed',
        error: error instanceof Error ? error.message : String(error),
        normalization_version: OFFICIAL_SOURCE_NORMALIZATION_VERSION,
        affected_stablecoin_ids: source.affected_stablecoin_ids ?? [],
        affected_organization_ids: source.affected_organization_ids ?? [],
        duplicate_review: buildDuplicateReview(source, canonicalIndex),
        lineage_review: buildLineageReview(source, canonicalIndex.relationships)
      };
      observations.push({
        ...observed,
        observation_class: 'fetch_failed',
        comparison: comparisonMetadata(baselineIndex.get(source.source_id) ?? {}, observed, effectiveBaselineSet.normalization_version),
        metadata_differences: []
      });
    } finally {
      clearTimeout(timeout);
    }
  }
  return observations;
}
