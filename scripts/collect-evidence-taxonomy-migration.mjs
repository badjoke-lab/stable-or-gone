import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baseline = loadRegistryV2Baseline(root);

function readRows(relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (!Array.isArray(value)) throw new Error(`${relativePath}: expected a JSON array`);
  return value.map((row) => ({ ...row, __file: relativePath }));
}

function values(row, pluralKey, singularKey) {
  return [...new Set([
    ...(Array.isArray(row[pluralKey]) ? row[pluralKey] : []),
    ...(typeof row[singularKey] === 'string' && row[singularKey].length > 0 ? [row[singularKey]] : [])
  ])];
}

function countBy(rows, getter) {
  const counts = new Map();
  for (const row of rows) {
    const raw = getter(row);
    const list = Array.isArray(raw) ? raw : [raw];
    for (const item of list) {
      const key = item === null || item === undefined || item === '' ? 'not_recorded' : String(item);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

function inferProvenance(sourceType) {
  const value = String(sourceType ?? '').toLowerCase();
  if (/issuer|official_(statement|website|documentation)|product_page|company_blog/.test(value)) return 'subject_controlled';
  if (/regulatory|regulator|court|legal|government/.test(value)) return 'government_or_legal';
  if (/audit|assurance|attestation|reserve_report|examination/.test(value)) return 'assurance_or_financial_report';
  if (/protocol_docs|developer|repository|github|chain_explorer|onchain|technical/.test(value)) return 'technical_primary';
  if (/governance|forum|proposal|dao/.test(value)) return 'governance_primary';
  if (/news|media|press|reporting/.test(value)) return 'independent_media';
  if (/archive|wayback/.test(value)) return 'archive_capture';
  if (/database|reference|market_data|aggregator/.test(value)) return 'data_reference';
  return 'unresolved';
}

function inferPrimaryState(sourceType) {
  const provenance = inferProvenance(sourceType);
  if (['subject_controlled', 'government_or_legal', 'assurance_or_financial_report', 'technical_primary', 'governance_primary', 'archive_capture'].includes(provenance)) return 'likely_primary';
  if (['independent_media', 'data_reference'].includes(provenance)) return 'likely_secondary';
  return 'unresolved';
}

function archiveState(row) {
  if (!row.archived_url) return 'not_recorded';
  if (/web\.archive\.org\/web\/\*\//i.test(row.archived_url)) return 'wayback_wildcard';
  if (/web\.archive\.org\/web\/\d{8,14}/i.test(row.archived_url)) return 'wayback_snapshot';
  return 'other_archive';
}

function hostOf(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return 'invalid_or_missing';
  }
}

const evidenceFiles = baseline.data_groups?.evidence ?? [];
const rows = evidenceFiles.flatMap(readRows);
const idCounts = countBy(rows, (row) => row.id);
const duplicateIds = Object.entries(idCounts).filter(([, count]) => count > 1).map(([id, count]) => ({ id, count }));
const byUrl = new Map();
const byUrlTitle = new Map();

const records = rows.map((row) => {
  const stablecoinIds = values(row, 'stablecoin_ids', 'stablecoin_id');
  const organizationIds = values(row, 'organization_ids', 'issuer_id');
  const eventIds = values(row, 'event_ids', 'event_id');
  const claimScopes = values(row, 'claim_scopes', 'claim_scope');
  const urlKey = String(row.url ?? '').trim();
  const urlTitleKey = `${urlKey}\n${String(row.title ?? '').trim().toLowerCase()}`;
  if (urlKey) byUrl.set(urlKey, [...(byUrl.get(urlKey) ?? []), row.id]);
  if (urlKey) byUrlTitle.set(urlTitleKey, [...(byUrlTitle.get(urlTitleKey) ?? []), row.id]);

  const inferredProvenance = inferProvenance(row.source_type);
  const inferredPrimaryState = inferPrimaryState(row.source_type);
  const explicitRelation = Array.isArray(row.stablecoin_ids) || Array.isArray(row.organization_ids) || Array.isArray(row.event_ids) || Array.isArray(row.claim_scopes);

  return {
    id: row.id,
    file: row.__file,
    source_type: row.source_type ?? null,
    source_provenance: row.source_provenance ?? null,
    inferred_provenance_candidate: inferredProvenance,
    is_primary: typeof row.is_primary === 'boolean' ? row.is_primary : null,
    inferred_primary_state_candidate: inferredPrimaryState,
    reliability: row.reliability ?? null,
    publisher: row.publisher ?? null,
    published_at: row.published_at ?? null,
    accessed_at: row.accessed_at ?? null,
    url: row.url ?? null,
    url_host: hostOf(row.url),
    archived_url: row.archived_url ?? null,
    archive_state: archiveState(row),
    stablecoin_ids: stablecoinIds,
    organization_ids: organizationIds,
    event_ids: eventIds,
    claim_scopes: claimScopes,
    relation_kind: explicitRelation ? 'explicit_v2' : 'legacy_subject_projection',
    subject_count: stablecoinIds.length + organizationIds.length + eventIds.length,
    claim_scope_count: claimScopes.length,
    issues: [
      !row.id ? 'missing_id' : null,
      !row.title ? 'missing_title' : null,
      !row.url ? 'missing_url' : null,
      !row.source_type ? 'missing_source_type' : null,
      !row.publisher ? 'missing_publisher' : null,
      !row.reliability ? 'missing_reliability' : null,
      !['high', 'medium', 'low', 'unknown'].includes(row.reliability) ? 'noncanonical_reliability' : null,
      row.source_provenance === undefined ? 'source_provenance_not_recorded' : null,
      row.is_primary === undefined ? 'is_primary_not_recorded' : null,
      stablecoinIds.length + organizationIds.length + eventIds.length === 0 ? 'no_subject_relation' : null,
      claimScopes.length === 0 ? 'no_claim_scope' : null,
      hostOf(row.url) === 'invalid_or_missing' ? 'invalid_url' : null
    ].filter(Boolean)
  };
});

const duplicateUrls = [...byUrl.entries()].filter(([, ids]) => ids.length > 1).map(([url, ids]) => ({ url, ids, count: ids.length })).sort((a, b) => b.count - a.count || a.url.localeCompare(b.url));
const duplicateUrlTitles = [...byUrlTitle.entries()].filter(([, ids]) => ids.length > 1).map(([key, ids]) => ({ url: key.split('\n')[0], ids, count: ids.length })).sort((a, b) => b.count - a.count || a.url.localeCompare(b.url));
const issueRows = records.flatMap((record) => record.issues.map((issue) => ({ issue })));

const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  evidence_files: evidenceFiles,
  totals: {
    evidence_records: rows.length,
    evidence_relations_projected: rows.length,
    duplicate_ids: duplicateIds.length,
    duplicate_urls: duplicateUrls.length,
    duplicate_url_title_pairs: duplicateUrlTitles.length,
    explicit_v2_relations: records.filter((record) => record.relation_kind === 'explicit_v2').length,
    legacy_subject_projections: records.filter((record) => record.relation_kind === 'legacy_subject_projection').length,
    multi_subject_records: records.filter((record) => record.subject_count > 1).length,
    multi_claim_records: records.filter((record) => record.claim_scope_count > 1).length
  },
  field_coverage: {
    source_type_recorded: rows.filter((row) => row.source_type).length,
    source_provenance_recorded: rows.filter((row) => row.source_provenance).length,
    is_primary_recorded: rows.filter((row) => typeof row.is_primary === 'boolean').length,
    reliability_recorded: rows.filter((row) => row.reliability).length,
    publisher_recorded: rows.filter((row) => row.publisher).length,
    published_at_recorded: rows.filter((row) => row.published_at).length,
    accessed_at_recorded: rows.filter((row) => row.accessed_at).length,
    archived_url_recorded: rows.filter((row) => row.archived_url).length,
    claim_scope_recorded: records.filter((row) => row.claim_scope_count > 0).length,
    subject_relation_recorded: records.filter((row) => row.subject_count > 0).length
  },
  counts: {
    source_type: countBy(rows, (row) => row.source_type),
    inferred_provenance_candidate: countBy(records, (row) => row.inferred_provenance_candidate),
    explicit_source_provenance: countBy(rows, (row) => row.source_provenance),
    inferred_primary_state_candidate: countBy(records, (row) => row.inferred_primary_state_candidate),
    explicit_is_primary: countBy(rows, (row) => typeof row.is_primary === 'boolean' ? String(row.is_primary) : null),
    reliability: countBy(rows, (row) => row.reliability),
    archive_state: countBy(records, (row) => row.archive_state),
    relation_kind: countBy(records, (row) => row.relation_kind),
    claim_scope_non_exclusive: countBy(records, (row) => row.claim_scopes),
    publisher: countBy(rows, (row) => row.publisher),
    url_host: countBy(records, (row) => row.url_host),
    file: countBy(records, (row) => row.file),
    issues: countBy(issueRows, (row) => row.issue)
  },
  duplicate_ids: duplicateIds,
  duplicate_urls: duplicateUrls,
  duplicate_url_title_pairs: duplicateUrlTitles,
  records
};

const outputPath = path.join(root, 'data/generated/evidence-taxonomy-migration.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({
  evidence_records: report.totals.evidence_records,
  source_types: Object.keys(report.counts.source_type).length,
  reliabilities: report.counts.reliability,
  explicit_v2_relations: report.totals.explicit_v2_relations,
  legacy_subject_projections: report.totals.legacy_subject_projections,
  multi_subject_records: report.totals.multi_subject_records,
  multi_claim_records: report.totals.multi_claim_records,
  duplicate_urls: report.totals.duplicate_urls,
  issue_counts: report.counts.issues
}, null, 2));
