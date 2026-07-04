import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { deduplicateEvidenceRecords } from '../config/evidence-source-deduplication.mjs';
import {
  evidenceAliasIds,
  evidenceCanonicalIds,
  evidenceSourceAliasCount,
  evidenceSourceIdentityGroupCount,
  evidenceSourceIdentityGroups,
  resolveEvidenceIdentityId
} from '../config/evidence-source-identities.mjs';
import {
  evidenceReliabilities,
  getEvidenceArchiveState,
  getEvidencePrimaryState,
  getEvidenceProvenance,
  getEvidenceReliability,
  getPublicEvidenceCategory
} from '../config/evidence-taxonomy.mjs';

const root = process.cwd();
const absolute = (relativePath) => path.join(root, relativePath);
const readJson = (relativePath) => JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8'));
const readRows = (relativePath) => {
  const parsed = readJson(relativePath);
  const rows = Array.isArray(parsed) ? parsed : parsed.records;
  if (!Array.isArray(rows)) throw new Error(`${relativePath}: expected an array or records array`);
  return rows.map((row, index) => ({ ...row, __file: relativePath, __index: index }));
};
const loadFiles = (files = []) => files.flatMap(readRows);
const unique = (values) => [...new Set(values.filter((value) => typeof value === 'string' && value.length > 0))].sort();
const relationValues = (row, pluralKey, singularKey) => unique([
  ...(Array.isArray(row[pluralKey]) ? row[pluralKey] : []),
  ...(typeof row[singularKey] === 'string' && row[singularKey].length > 0 ? [row[singularKey]] : [])
]);
const normalizeUrl = (value) => {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    url.hash = '';
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    if ((url.protocol === 'https:' && url.port === '443') || (url.protocol === 'http:' && url.port === '80')) url.port = '';
    url.pathname = url.pathname.replace(/\/{2,}/g, '/');
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/$/, '');
    const entries = [...url.searchParams.entries()].sort(([ak, av], [bk, bv]) => ak.localeCompare(bk) || av.localeCompare(bv));
    url.search = '';
    for (const [key, item] of entries) url.searchParams.append(key, item);
    return url.toString();
  } catch {
    return '';
  }
};
const groupBy = (rows, keyFn) => {
  const groups = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!key) continue;
    const values = groups.get(key) ?? [];
    values.push(row);
    groups.set(key, values);
  }
  return groups;
};
const countBy = (values) => Object.fromEntries([...values.reduce((map, raw) => {
  const key = raw === null || raw === undefined || raw === '' ? 'unknown' : String(raw);
  map.set(key, (map.get(key) ?? 0) + 1);
  return map;
}, new Map()).entries()].sort(([a], [b]) => a.localeCompare(b)));

const baseline = loadRegistryV2Baseline(root);
const stablecoins = loadFiles(baseline.data_groups?.stablecoins ?? []);
const organizations = loadFiles(baseline.data_groups?.organizations ?? []);
const events = loadFiles(baseline.data_groups?.events ?? []);
const evidence = loadFiles(baseline.data_groups?.evidence ?? []);
const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const eventIds = new Set(events.map((row) => row.id));
const allowedReliabilities = new Set(evidenceReliabilities.map((row) => row.value));

const critical = [];
const warnings = [];
const observations = [];
const evidenceIds = new Set();
const normalized = [];

for (const row of evidence) {
  if (!row.id) {
    critical.push(`${row.__file}[${row.__index}]: evidence id missing`);
    continue;
  }
  if (evidenceIds.has(row.id)) critical.push(`duplicate evidence id ${row.id}`);
  evidenceIds.add(row.id);

  const stablecoin_ids = relationValues(row, 'stablecoin_ids', 'stablecoin_id');
  const organization_ids = relationValues(row, 'organization_ids', 'issuer_id');
  const event_ids = relationValues(row, 'event_ids', 'event_id');
  const claim_scopes = relationValues(row, 'claim_scopes', 'claim_scope');
  const url = String(row.url ?? '').trim();
  const normalized_url = normalizeUrl(url);
  const archived_url = String(row.archived_url ?? '').trim();

  if (!String(row.title ?? '').trim()) critical.push(`${row.id}: title missing`);
  if (!String(row.publisher ?? '').trim()) warnings.push(`${row.id}: publisher not recorded`);
  if (!url) critical.push(`${row.id}: source URL missing`);
  else if (!normalized_url) critical.push(`${row.id}: invalid source URL ${url}`);
  if (archived_url && !normalizeUrl(archived_url)) critical.push(`${row.id}: invalid archived_url ${archived_url}`);
  if (row.reliability && !allowedReliabilities.has(row.reliability)) critical.push(`${row.id}: invalid raw reliability ${row.reliability}`);
  if (!row.reliability) warnings.push(`${row.id}: reliability not recorded`);
  if (stablecoin_ids.length === 0 && organization_ids.length === 0 && event_ids.length === 0) critical.push(`${row.id}: no subject relation`);
  if (claim_scopes.length === 0) warnings.push(`${row.id}: claim scope not recorded`);
  for (const id of stablecoin_ids) if (!stablecoinIds.has(id)) critical.push(`${row.id}: missing stablecoin ${id}`);
  for (const id of organization_ids) if (!organizationIds.has(id)) critical.push(`${row.id}: missing organization ${id}`);
  for (const id of event_ids) if (!eventIds.has(id)) critical.push(`${row.id}: missing event ${id}`);

  normalized.push({
    ...row,
    stablecoin_ids,
    organization_ids,
    event_ids,
    claim_scopes,
    normalized_url,
    source_identity_id: resolveEvidenceIdentityId(row.id),
    public_category: getPublicEvidenceCategory(row.source_type),
    provenance: getEvidenceProvenance(row.source_type, row.source_provenance),
    primary_state: getEvidencePrimaryState(row.source_type, row.is_primary, row.primary_state),
    normalized_reliability: getEvidenceReliability(row.reliability),
    archive_state: getEvidenceArchiveState(row.archived_url)
  });
}

const exactUrlGroups = [...groupBy(normalized, (row) => String(row.url ?? '').trim()).entries()]
  .filter(([, rows]) => rows.length > 1)
  .map(([url, rows]) => ({ url, evidence_ids: rows.map((row) => row.id).sort(), count: rows.length }));
const normalizedUrlGroups = [...groupBy(normalized, (row) => row.normalized_url).entries()]
  .filter(([, rows]) => rows.length > 1)
  .map(([url, rows]) => ({ url, exact_urls: unique(rows.map((row) => String(row.url ?? '').trim())), evidence_ids: rows.map((row) => row.id).sort(), count: rows.length }));
const normalizedOnlyGroups = normalizedUrlGroups.filter((group) => group.exact_urls.length > 1);
if (normalizedOnlyGroups.length) critical.push(`${normalizedOnlyGroups.length} normalized-only duplicate URL groups are not covered by exact URL identity grouping`);

const canonicalEvidence = normalized.map(({ __file, __index, normalized_url, source_identity_id, public_category, provenance, primary_state, normalized_reliability, archive_state, ...row }) => row);
const publicSources = deduplicateEvidenceRecords(canonicalEvidence);
const publicSourceById = new Map(publicSources.map((row) => [row.id, row]));
const publicUrlGroups = [...groupBy(publicSources, (row) => String(row.url ?? '').trim()).entries()].filter(([, rows]) => rows.length > 1);
if (publicUrlGroups.length) critical.push(`duplicate public source URLs remain: ${publicUrlGroups.map(([url]) => url).join(', ')}`);

const approvedGroupByUrl = new Map(evidenceSourceIdentityGroups.map((group) => [group.url, group]));
for (const group of exactUrlGroups) {
  const approved = approvedGroupByUrl.get(group.url);
  if (!approved) critical.push(`duplicate canonical URL group lacks approved source identity mapping: ${group.url}`);
  else {
    const expectedIds = unique([approved.canonical_id, ...approved.aliases]);
    if (JSON.stringify(expectedIds) !== JSON.stringify(unique(group.evidence_ids))) critical.push(`${approved.canonical_id}: approved source identity members differ from canonical URL group`);
  }
}
for (const approved of evidenceSourceIdentityGroups) {
  if (!exactUrlGroups.some((group) => group.url === approved.url)) critical.push(`${approved.canonical_id}: approved source identity group no longer matches a duplicate canonical URL group`);
  if (!publicSourceById.has(approved.canonical_id)) critical.push(`${approved.canonical_id}: canonical public source identity missing`);
}
for (const id of evidenceCanonicalIds) if (!publicSourceById.has(id)) critical.push(`${id}: approved canonical source identity missing from public projection`);
for (const id of evidenceAliasIds) if (publicSourceById.has(id)) critical.push(`${id}: alias evidence id remains as duplicate public source row`);

const relationRows = normalized.map((row) => ({
  canonical_evidence_id: row.id,
  source_identity_id: row.source_identity_id,
  stablecoin_ids: row.stablecoin_ids,
  organization_ids: row.organization_ids,
  event_ids: row.event_ids,
  claim_scopes: row.claim_scopes
}));
const orphanRelationSourceIds = unique(relationRows.map((row) => row.source_identity_id)).filter((id) => !publicSourceById.has(id));
for (const id of orphanRelationSourceIds) critical.push(`relation points to missing public source identity ${id}`);

const publicSourceWithNoRelations = publicSources.filter((source) => {
  const related = relationRows.filter((row) => row.source_identity_id === source.id);
  return related.length === 0;
});
for (const source of publicSourceWithNoRelations) critical.push(`${source.id}: public source identity has no canonical evidence relation`);

const sourceIdentityRelationUnion = publicSources.map((source) => {
  const relations = relationRows.filter((row) => row.source_identity_id === source.id);
  return {
    source_identity_id: source.id,
    stablecoin_ids: unique(relations.flatMap((row) => row.stablecoin_ids)),
    organization_ids: unique(relations.flatMap((row) => row.organization_ids)),
    event_ids: unique(relations.flatMap((row) => row.event_ids)),
    claim_scopes: unique(relations.flatMap((row) => row.claim_scopes))
  };
});
for (const union of sourceIdentityRelationUnion) {
  const projected = publicSourceById.get(union.source_identity_id);
  if (!projected) continue;
  for (const key of ['stablecoin_ids', 'organization_ids', 'event_ids', 'claim_scopes']) {
    const actual = unique(projected[key] ?? []);
    if (JSON.stringify(actual) !== JSON.stringify(union[key])) critical.push(`${union.source_identity_id}: public ${key} union differs from canonical evidence relations`);
  }
}

const missingPublishers = normalized.filter((row) => !String(row.publisher ?? '').trim()).map((row) => row.id).sort();
const missingReliability = normalized.filter((row) => !row.reliability).map((row) => row.id).sort();
const missingClaimScopes = normalized.filter((row) => row.claim_scopes.length === 0).map((row) => row.id).sort();
const unknownCategories = normalized.filter((row) => row.public_category === 'other_or_unknown').map((row) => ({ id: row.id, source_type: row.source_type ?? null }));
const unknownProvenance = normalized.filter((row) => row.provenance === 'unknown').map((row) => ({ id: row.id, source_type: row.source_type ?? null, source_provenance: row.source_provenance ?? null }));
const unknownPrimaryState = normalized.filter((row) => row.primary_state === 'unknown').map((row) => ({ id: row.id, source_type: row.source_type ?? null }));
const unknownReliability = normalized.filter((row) => row.normalized_reliability === 'unknown').map((row) => ({ id: row.id, raw_reliability: row.reliability ?? null }));
const archiveStateCounts = countBy(normalized.map((row) => row.archive_state));

observations.push(`Audited ${evidence.length} canonical evidence records projected to ${publicSources.length} public source identities.`);
observations.push(`${evidenceSourceIdentityGroupCount} approved source identity groups account for ${evidenceSourceAliasCount} alias evidence ids.`);
observations.push(`${exactUrlGroups.length} exact duplicate URL groups are covered by approved identity groups; ${normalizedOnlyGroups.length} normalized-only duplicate groups remain.`);
observations.push(`${archiveStateCounts.not_recorded ?? 0} canonical evidence records have no archive recorded; archive coverage is tracked as data quality, not evidence invalidity.`);

const report = {
  schema_version: '1.0',
  audit_id: 'sog_registry_501_evidence_integrity_pr299',
  baseline_id: baseline.baseline_id,
  audited_counts: {
    stable_assets: stablecoins.length,
    organizations: organizations.length,
    events: events.length,
    canonical_evidence_records: evidence.length,
    public_source_identities: publicSources.length,
    evidence_relations: relationRows.length,
    source_identity_groups: evidenceSourceIdentityGroupCount,
    source_aliases: evidenceSourceAliasCount
  },
  identity: {
    exact_duplicate_url_groups: exactUrlGroups,
    normalized_duplicate_url_groups: normalizedUrlGroups,
    normalized_only_duplicate_url_groups: normalizedOnlyGroups,
    public_duplicate_url_groups: publicUrlGroups.map(([url, rows]) => ({ url, source_ids: rows.map((row) => row.id).sort() })),
    orphan_relation_source_ids: orphanRelationSourceIds,
    public_sources_without_relations: publicSourceWithNoRelations.map((row) => row.id).sort()
  },
  metadata_quality: {
    missing_publishers: missingPublishers,
    missing_reliability: missingReliability,
    missing_claim_scopes: missingClaimScopes,
    unknown_public_categories: unknownCategories,
    unknown_provenance: unknownProvenance,
    unknown_primary_state: unknownPrimaryState,
    unknown_reliability: unknownReliability,
    archive_state_counts: archiveStateCounts,
    source_type_counts: countBy(normalized.map((row) => row.source_type)),
    provenance_counts: countBy(normalized.map((row) => row.provenance)),
    primary_state_counts: countBy(normalized.map((row) => row.primary_state)),
    reliability_counts: countBy(normalized.map((row) => row.normalized_reliability)),
    claim_scope_counts_non_exclusive: countBy(normalized.flatMap((row) => row.claim_scopes))
  },
  relation_subject_counts: {
    stablecoin_links: normalized.reduce((sum, row) => sum + row.stablecoin_ids.length, 0),
    organization_links: normalized.reduce((sum, row) => sum + row.organization_ids.length, 0),
    event_links: normalized.reduce((sum, row) => sum + row.event_ids.length, 0)
  },
  findings: { critical, warnings, observations },
  result: critical.length === 0 ? 'pass_with_review_queues' : 'fail'
};

const lines = [
  '# SOG 501-Record Evidence and Source-Identity Integrity Audit',
  '',
  `- Audit ID: \`${report.audit_id}\``,
  `- Baseline: \`${report.baseline_id}\``,
  `- Canonical evidence records: **${evidence.length}**`,
  `- Public source identities: **${publicSources.length}**`,
  `- Evidence relations: **${relationRows.length}**`,
  `- Source identity groups: **${evidenceSourceIdentityGroupCount}**`,
  `- Source aliases: **${evidenceSourceAliasCount}**`,
  `- Critical findings: **${critical.length}**`,
  '',
  '## Identity and Relation Integrity',
  '',
  `- Exact duplicate URL groups: ${exactUrlGroups.length}`,
  `- Normalized-only duplicate URL groups: ${normalizedOnlyGroups.length}`,
  `- Public duplicate URL groups: ${publicUrlGroups.length}`,
  `- Orphan relation source identities: ${orphanRelationSourceIds.length}`,
  `- Public source identities without canonical relations: ${publicSourceWithNoRelations.length}`,
  '',
  '## Metadata Review Queues',
  '',
  `- Publisher not recorded: ${missingPublishers.length}`,
  `- Reliability not recorded: ${missingReliability.length}`,
  `- Claim scope not recorded: ${missingClaimScopes.length}`,
  `- Unknown public category: ${unknownCategories.length}`,
  `- Unknown provenance: ${unknownProvenance.length}`,
  `- Unknown primary state: ${unknownPrimaryState.length}`,
  `- Unknown reliability: ${unknownReliability.length}`,
  `- Archive states: \`${JSON.stringify(archiveStateCounts)}\``,
  '',
  '## Critical Findings',
  '',
  ...(critical.length ? critical.map((message) => `- ${message}`) : ['- None.']),
  '',
  '## Review Warnings',
  '',
  ...(warnings.length ? warnings.map((message) => `- ${message}`) : ['- None.']),
  '',
  '## Observations',
  '',
  ...observations.map((message) => `- ${message}`),
  '',
  '## Result',
  '',
  critical.length === 0
    ? 'PASS. Canonical evidence IDs, URL identity grouping, public source projection, subject references, and relation unions are structurally valid. Metadata and archive coverage queues remain explicit for review.'
    : 'FAIL. Critical evidence or source-identity findings must be resolved before PR #299 can close.',
  ''
];

const jsonPath = 'data/generated/registry-evidence-integrity-audit.json';
const markdownPath = 'docs/audits/registry-501-evidence-integrity-audit.md';
fs.mkdirSync(path.dirname(absolute(jsonPath)), { recursive: true });
fs.mkdirSync(path.dirname(absolute(markdownPath)), { recursive: true });
fs.writeFileSync(absolute(jsonPath), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(absolute(markdownPath), lines.join('\n'));

console.log(JSON.stringify({
  audit_id: report.audit_id,
  result: report.result,
  canonical_evidence_records: evidence.length,
  public_source_identities: publicSources.length,
  source_identity_groups: evidenceSourceIdentityGroupCount,
  source_aliases: evidenceSourceAliasCount,
  critical: critical.length,
  warnings: warnings.length,
  missing_publishers: missingPublishers.length,
  missing_reliability: missingReliability.length,
  missing_claim_scopes: missingClaimScopes.length,
  unknown_categories: unknownCategories.length,
  archive_state_counts: archiveStateCounts
}, null, 2));

if (critical.length) process.exit(1);
