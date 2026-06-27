import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baseline = loadRegistryV2Baseline(root);

function readRows(relativePath) {
  const parsed = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  const rows = Array.isArray(parsed) ? parsed : parsed.records;
  if (!Array.isArray(rows)) throw new Error(`${relativePath}: expected an array or records array`);
  return rows.map((row, index) => ({ ...row, __file: relativePath, __index: index }));
}

function values(row, pluralKey, singularKey) {
  return [...new Set([
    ...(Array.isArray(row[pluralKey]) ? row[pluralKey] : []),
    ...(typeof row[singularKey] === 'string' && row[singularKey].length > 0 ? [row[singularKey]] : [])
  ])].sort();
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function normalizeUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    url.hash = '';
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    if ((url.protocol === 'https:' && url.port === '443') || (url.protocol === 'http:' && url.port === '80')) url.port = '';
    url.pathname = url.pathname.replace(/\/{2,}/g, '/');
    if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/$/, '');
    const entries = [...url.searchParams.entries()].sort(([aKey, aValue], [bKey, bValue]) => aKey.localeCompare(bKey) || aValue.localeCompare(bValue));
    url.search = '';
    for (const [key, item] of entries) url.searchParams.append(key, item);
    return url.toString();
  } catch {
    return raw.toLowerCase().replace(/\/$/, '');
  }
}

function sameArray(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function union(rows, key) {
  return [...new Set(rows.flatMap((row) => row[key]))].sort();
}

function intersection(rows, key) {
  if (rows.length === 0) return [];
  return rows[0][key].filter((value) => rows.every((row) => row[key].includes(value))).sort();
}

function countBy(values) {
  return values.reduce((counts, rawValue) => {
    const value = rawValue === null || rawValue === undefined || rawValue === '' ? 'unknown' : String(rawValue);
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

function identitySignature(record) {
  return [
    record.exact_url,
    record.normalized_title,
    record.normalized_publisher,
    record.published_at ?? '',
    record.source_type ?? ''
  ].join('\n');
}

function metadataSignature(record) {
  return [
    record.normalized_title,
    record.normalized_publisher,
    record.published_at ?? '',
    record.source_type ?? '',
    record.source_provenance ?? '',
    String(record.is_primary ?? ''),
    record.reliability ?? ''
  ].join('\n');
}

function classifyGroup(records, groupingKind) {
  const exactUrls = new Set(records.map((record) => record.exact_url));
  const normalizedUrls = new Set(records.map((record) => record.normalized_url));
  const identitySignatures = new Set(records.map(identitySignature));
  const metadataSignatures = new Set(records.map(metadataSignature));
  const archiveUrls = new Set(records.map((record) => record.archived_url ?? ''));
  const relationSignatures = new Set(records.map((record) => JSON.stringify({
    stablecoin_ids: record.stablecoin_ids,
    organization_ids: record.organization_ids,
    event_ids: record.event_ids,
    claim_scopes: record.claim_scopes
  })));

  if (identitySignatures.size === 1) {
    return relationSignatures.size === 1
      ? 'exact_identity_duplicate_same_relations'
      : 'exact_identity_duplicate_relation_variants';
  }

  if (exactUrls.size === 1 && metadataSignatures.size === 1 && archiveUrls.size > 1) {
    return 'same_source_archive_variants';
  }

  if (exactUrls.size === 1) return 'same_url_metadata_review';
  if (normalizedUrls.size === 1 || groupingKind === 'normalized_url') return 'normalized_url_variant_review';
  return 'manual_review';
}

const evidenceFiles = baseline.data_groups?.evidence ?? [];
const sourceRows = evidenceFiles.flatMap(readRows);
const ids = new Set();
const duplicateIds = [];

const records = sourceRows.map((row) => {
  if (ids.has(row.id)) duplicateIds.push(row.id);
  ids.add(row.id);
  return {
    id: row.id,
    file: row.__file,
    index: row.__index,
    title: row.title ?? null,
    normalized_title: normalizeText(row.title),
    publisher: row.publisher ?? null,
    normalized_publisher: normalizeText(row.publisher),
    published_at: row.published_at ?? null,
    accessed_at: row.accessed_at ?? null,
    source_type: row.source_type ?? null,
    source_provenance: row.source_provenance ?? null,
    is_primary: typeof row.is_primary === 'boolean' ? row.is_primary : null,
    reliability: row.reliability ?? null,
    exact_url: String(row.url ?? '').trim(),
    normalized_url: normalizeUrl(row.url),
    archived_url: row.archived_url ?? null,
    stablecoin_ids: values(row, 'stablecoin_ids', 'stablecoin_id'),
    organization_ids: values(row, 'organization_ids', 'issuer_id'),
    event_ids: values(row, 'event_ids', 'event_id'),
    claim_scopes: values(row, 'claim_scopes', 'claim_scope')
  };
});

function buildGroups(key, groupingKind) {
  const grouped = new Map();
  for (const record of records) {
    const value = record[key];
    if (!value) continue;
    const rows = grouped.get(value) ?? [];
    rows.push(record);
    grouped.set(value, rows);
  }

  return [...grouped.entries()]
    .filter(([, rows]) => rows.length > 1)
    .map(([groupValue, rows], index) => {
      const classification = classifyGroup(rows, groupingKind);
      const sameRelations = rows.every((row) =>
        sameArray(row.stablecoin_ids, rows[0].stablecoin_ids) &&
        sameArray(row.organization_ids, rows[0].organization_ids) &&
        sameArray(row.event_ids, rows[0].event_ids) &&
        sameArray(row.claim_scopes, rows[0].claim_scopes)
      );
      return {
        group_id: `${groupingKind}_${String(index + 1).padStart(3, '0')}`,
        grouping_kind: groupingKind,
        group_value: groupValue,
        classification_candidate: classification,
        count: rows.length,
        evidence_ids: rows.map((row) => row.id).sort(),
        file_count: new Set(rows.map((row) => row.file)).size,
        exact_url_count: new Set(rows.map((row) => row.exact_url)).size,
        normalized_url_count: new Set(rows.map((row) => row.normalized_url)).size,
        title_count: new Set(rows.map((row) => row.normalized_title)).size,
        publisher_count: new Set(rows.map((row) => row.normalized_publisher)).size,
        published_at_count: new Set(rows.map((row) => row.published_at ?? '')).size,
        source_type_count: new Set(rows.map((row) => row.source_type ?? '')).size,
        archive_url_count: new Set(rows.map((row) => row.archived_url ?? '')).size,
        relation_variants: new Set(rows.map((row) => JSON.stringify({
          stablecoin_ids: row.stablecoin_ids,
          organization_ids: row.organization_ids,
          event_ids: row.event_ids,
          claim_scopes: row.claim_scopes
        }))).size,
        same_relations: sameRelations,
        relation_union: {
          stablecoin_ids: union(rows, 'stablecoin_ids'),
          organization_ids: union(rows, 'organization_ids'),
          event_ids: union(rows, 'event_ids'),
          claim_scopes: union(rows, 'claim_scopes')
        },
        relation_intersection: {
          stablecoin_ids: intersection(rows, 'stablecoin_ids'),
          organization_ids: intersection(rows, 'organization_ids'),
          event_ids: intersection(rows, 'event_ids'),
          claim_scopes: intersection(rows, 'claim_scopes')
        },
        records: rows
      };
    })
    .sort((a, b) => b.count - a.count || a.group_value.localeCompare(b.group_value));
}

const exactUrlGroups = buildGroups('exact_url', 'exact_url');
const normalizedUrlGroups = buildGroups('normalized_url', 'normalized_url');
const exactUrlKeys = new Set(exactUrlGroups.map((group) => group.group_value));
const normalizedOnlyGroups = normalizedUrlGroups.filter((group) => {
  const exactUrls = new Set(group.records.map((record) => record.exact_url));
  return exactUrls.size > 1 && ![...exactUrls].every((url) => exactUrlKeys.has(url));
});

const exactUrlTitleGroups = exactUrlGroups.filter((group) => group.title_count === 1);
const candidateIdentityGroups = exactUrlGroups.filter((group) => group.classification_candidate.startsWith('exact_identity_duplicate'));
const relationVariantGroups = candidateIdentityGroups.filter((group) => group.classification_candidate === 'exact_identity_duplicate_relation_variants');
const sameRelationGroups = candidateIdentityGroups.filter((group) => group.classification_candidate === 'exact_identity_duplicate_same_relations');
const metadataReviewGroups = exactUrlGroups.filter((group) => group.classification_candidate === 'same_url_metadata_review');
const archiveVariantGroups = exactUrlGroups.filter((group) => group.classification_candidate === 'same_source_archive_variants');

const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  totals: {
    evidence_records: records.length,
    unique_evidence_ids: ids.size,
    duplicate_evidence_ids: duplicateIds.length,
    exact_duplicate_url_groups: exactUrlGroups.length,
    exact_duplicate_url_records: exactUrlGroups.reduce((sum, group) => sum + group.count, 0),
    exact_duplicate_url_title_groups: exactUrlTitleGroups.length,
    normalized_only_duplicate_url_groups: normalizedOnlyGroups.length,
    candidate_identity_groups: candidateIdentityGroups.length,
    candidate_identity_records: candidateIdentityGroups.reduce((sum, group) => sum + group.count, 0),
    same_relation_candidate_groups: sameRelationGroups.length,
    relation_variant_candidate_groups: relationVariantGroups.length,
    archive_variant_groups: archiveVariantGroups.length,
    metadata_review_groups: metadataReviewGroups.length
  },
  classification_counts: countBy(exactUrlGroups.map((group) => group.classification_candidate)),
  exact_url_groups: exactUrlGroups,
  normalized_only_url_groups: normalizedOnlyGroups,
  records
};

const outputPath = path.join(root, 'data/generated/evidence-deduplication-audit.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify({
  totals: report.totals,
  classification_counts: report.classification_counts,
  candidate_groups: candidateIdentityGroups.map((group) => ({
    group_id: group.group_id,
    classification_candidate: group.classification_candidate,
    evidence_ids: group.evidence_ids,
    relation_union: group.relation_union
  })),
  review_groups: [...archiveVariantGroups, ...metadataReviewGroups, ...normalizedOnlyGroups].map((group) => ({
    group_id: group.group_id,
    classification_candidate: group.classification_candidate,
    evidence_ids: group.evidence_ids,
    exact_url_count: group.exact_url_count,
    title_count: group.title_count,
    publisher_count: group.publisher_count,
    published_at_count: group.published_at_count,
    source_type_count: group.source_type_count,
    archive_url_count: group.archive_url_count
  }))
}, null, 2));
