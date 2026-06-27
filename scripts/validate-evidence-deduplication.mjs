import fs from 'node:fs';
import path from 'node:path';
import { deduplicateEvidenceRecords } from '../config/evidence-source-deduplication.mjs';
import {
  evidenceAliasIds,
  evidenceCanonicalIds,
  evidenceSourceAliasCount,
  evidenceSourceIdentityGroupCount,
  evidenceSourceIdentityGroups,
  resolveEvidenceIdentityId
} from '../config/evidence-source-identities.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baseline = loadRegistryV2Baseline(root);
const auditPath = path.join(root, 'data/generated/evidence-deduplication-audit.json');
const failures = [];
const warnings = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const unique = (items) => [...new Set(items.filter((item) => typeof item === 'string' && item.length > 0))].sort();
const sameArray = (left, right) => left.length === right.length && left.every((value, index) => value === right[index]);

function readRows(relativePath) {
  const parsed = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  const rows = Array.isArray(parsed) ? parsed : parsed.records;
  if (!Array.isArray(rows)) throw new Error(`${relativePath}: expected an array or records array`);
  return rows;
}

function values(row, pluralKey, singularKey) {
  return unique([
    ...(Array.isArray(row[pluralKey]) ? row[pluralKey] : []),
    ...(typeof row[singularKey] === 'string' && row[singularKey].length > 0 ? [row[singularKey]] : [])
  ]);
}

function normalizeRecord(row) {
  return {
    ...row,
    stablecoin_ids: values(row, 'stablecoin_ids', 'stablecoin_id'),
    organization_ids: values(row, 'organization_ids', 'issuer_id'),
    event_ids: values(row, 'event_ids', 'event_id'),
    claim_scopes: values(row, 'claim_scopes', 'claim_scope')
  };
}

assert(fs.existsSync(auditPath), 'evidence deduplication audit is missing');
if (!fs.existsSync(auditPath)) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const totals = audit.totals ?? {};
const groups = audit.exact_url_groups ?? [];
const records = audit.records ?? [];
const canonicalRecords = (baseline.data_groups?.evidence ?? []).flatMap(readRows).map(normalizeRecord);
const publicSources = deduplicateEvidenceRecords(canonicalRecords);
const publicSourceById = new Map(publicSources.map((source) => [source.id, source]));
const auditGroupByUrl = new Map(groups.map((group) => [group.group_value, group]));

assert(audit.schema_version === '1.0', 'audit schema version must be 1.0');
assert(audit.baseline_id === baseline.baseline_id, 'audit baseline id mismatch');
assert(totals.evidence_records === 455, `expected 455 evidence records, found ${totals.evidence_records}`);
assert(totals.unique_evidence_ids === 455, `expected 455 unique evidence ids, found ${totals.unique_evidence_ids}`);
assert(totals.duplicate_evidence_ids === 0, `duplicate evidence ids found: ${totals.duplicate_evidence_ids}`);
assert(totals.exact_duplicate_url_groups === 32, `expected 32 exact duplicate URL groups, found ${totals.exact_duplicate_url_groups}`);
assert(totals.exact_duplicate_url_title_groups === 5, `expected 5 exact duplicate URL-title groups, found ${totals.exact_duplicate_url_title_groups}`);
assert(totals.normalized_only_duplicate_url_groups === 0, `expected no normalized-only duplicate URL groups, found ${totals.normalized_only_duplicate_url_groups}`);
assert(records.length === totals.evidence_records, 'record inventory length mismatch');
assert(groups.length === totals.exact_duplicate_url_groups, 'exact URL group inventory length mismatch');
assert(canonicalRecords.length === 455, `expected 455 canonical evidence records, found ${canonicalRecords.length}`);
assert(evidenceSourceIdentityGroupCount === 32, `expected 32 approved source identity groups, found ${evidenceSourceIdentityGroupCount}`);
assert(evidenceSourceAliasCount === 45, `expected 45 source alias ids, found ${evidenceSourceAliasCount}`);
assert(publicSources.length === 410, `expected 410 public source identities, found ${publicSources.length}`);

const recordIds = new Set(records.map((record) => record.id));
assert(recordIds.size === records.length, 'record inventory contains duplicate ids');

const groupIds = new Set();
const groupedEvidenceIds = new Set();
for (const group of groups) {
  assert(typeof group.group_id === 'string' && group.group_id.length > 0, 'duplicate group id is missing');
  assert(!groupIds.has(group.group_id), `duplicate group id: ${group.group_id}`);
  groupIds.add(group.group_id);
  assert(group.count === group.evidence_ids.length, `${group.group_id}: count does not match evidence_ids length`);
  assert(group.count > 1, `${group.group_id}: duplicate group must contain at least two records`);
  assert(group.exact_url_count === 1, `${group.group_id}: exact URL group must contain one exact URL`);
  assert(typeof group.classification_candidate === 'string' && group.classification_candidate.length > 0, `${group.group_id}: classification candidate is missing`);
  for (const evidenceId of group.evidence_ids) {
    assert(recordIds.has(evidenceId), `${group.group_id}: missing evidence record ${evidenceId}`);
    groupedEvidenceIds.add(evidenceId);
  }
  const union = group.relation_union ?? {};
  assert(Array.isArray(union.stablecoin_ids), `${group.group_id}: stablecoin relation union is missing`);
  assert(Array.isArray(union.organization_ids), `${group.group_id}: organization relation union is missing`);
  assert(Array.isArray(union.event_ids), `${group.group_id}: event relation union is missing`);
  assert(Array.isArray(union.claim_scopes), `${group.group_id}: claim-scope relation union is missing`);
}

const classificationTotal = Object.values(audit.classification_counts ?? {}).reduce((sum, count) => sum + count, 0);
assert(classificationTotal === groups.length, 'classification counts do not sum to exact URL groups');
assert(totals.candidate_identity_groups === (audit.classification_counts?.exact_identity_duplicate_same_relations ?? 0) + (audit.classification_counts?.exact_identity_duplicate_relation_variants ?? 0), 'candidate identity total mismatch');
assert((audit.classification_counts?.exact_identity_duplicate_relation_variants ?? 0) === 3, 'expected three exact-identity relation-variant groups');
assert((audit.classification_counts?.same_url_metadata_review ?? 0) === 29, 'expected 29 same-URL metadata-variant groups');

for (const approvedGroup of evidenceSourceIdentityGroups) {
  const auditGroup = auditGroupByUrl.get(approvedGroup.url);
  assert(Boolean(auditGroup), `${approvedGroup.canonical_id}: approved URL is missing from the audit`);
  if (!auditGroup) continue;
  const expectedIds = unique([approvedGroup.canonical_id, ...approvedGroup.aliases]);
  assert(sameArray(unique(auditGroup.evidence_ids), expectedIds), `${approvedGroup.canonical_id}: approved identity members do not match the audit group`);

  const projected = publicSourceById.get(approvedGroup.canonical_id);
  assert(Boolean(projected), `${approvedGroup.canonical_id}: canonical public source identity is missing`);
  if (!projected) continue;
  assert(String(projected.url ?? '').trim() === approvedGroup.url, `${approvedGroup.canonical_id}: canonical URL changed`);
  assert(sameArray(unique(projected.source_alias_ids ?? []), unique(approvedGroup.aliases)), `${approvedGroup.canonical_id}: source alias ids were not preserved`);
  for (const key of ['stablecoin_ids', 'organization_ids', 'event_ids', 'claim_scopes']) {
    assert(sameArray(unique(projected[key] ?? []), unique(auditGroup.relation_union?.[key] ?? [])), `${approvedGroup.canonical_id}: ${key} union was not preserved`);
  }
}

for (const canonicalId of evidenceCanonicalIds) assert(publicSourceById.has(canonicalId), `${canonicalId}: approved canonical identity is absent from public sources`);
for (const aliasId of evidenceAliasIds) assert(!publicSourceById.has(aliasId), `${aliasId}: source alias remains as a duplicate public row`);

const publicUrlCounts = new Map();
for (const source of publicSources) {
  const url = String(source.url ?? '').trim();
  if (!url) continue;
  publicUrlCounts.set(url, (publicUrlCounts.get(url) ?? 0) + 1);
}
const publicDuplicateUrls = [...publicUrlCounts.entries()].filter(([, count]) => count > 1);
assert(publicDuplicateUrls.length === 0, `duplicate public source URLs remain: ${publicDuplicateUrls.map(([url]) => url).join(', ')}`);

const canonicalRelations = canonicalRecords.map((record) => ({
  evidence_id: resolveEvidenceIdentityId(record.id),
  stablecoin_ids: [...record.stablecoin_ids],
  organization_ids: [...record.organization_ids],
  event_ids: [...record.event_ids],
  claim_scopes: [...record.claim_scopes]
}));
const orphanRelationSourceIds = unique(canonicalRelations.map((relation) => relation.evidence_id)).filter((id) => !publicSourceById.has(id));
assert(canonicalRelations.length === 455, `expected 455 evidence relations, found ${canonicalRelations.length}`);
assert(orphanRelationSourceIds.length === 0, `relations point to missing public source identities: ${orphanRelationSourceIds.join(', ')}`);
assert(groupedEvidenceIds.size === 77, `expected 77 grouped evidence records, found ${groupedEvidenceIds.size}`);
assert(publicSources.reduce((sum, source) => sum + (source.source_alias_ids?.length ?? 0), 0) === 45, 'public source alias total is not 45');

if (totals.metadata_review_groups > 0) warnings.push(`${totals.metadata_review_groups} same-URL metadata variants were reviewed and resolved as shared public source identities.`);

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  ok: failures.length === 0,
  totals: {
    canonical_evidence_records: canonicalRecords.length,
    public_source_identities: publicSources.length,
    evidence_relations: canonicalRelations.length,
    source_identity_groups: evidenceSourceIdentityGroupCount,
    source_aliases: evidenceSourceAliasCount,
    exact_duplicate_url_groups: totals.exact_duplicate_url_groups,
    exact_duplicate_url_title_groups: totals.exact_duplicate_url_title_groups,
    grouped_evidence_records: groupedEvidenceIds.size,
    public_duplicate_url_groups: publicDuplicateUrls.length,
    orphan_relation_source_ids: orphanRelationSourceIds.length
  },
  failures,
  warnings
};

const outputPath = path.join(root, 'data/generated/evidence-deduplication-validation.json');
fs.writeFileSync(outputPath, `${JSON.stringify(validation, null, 2)}\n`);

if (failures.length > 0) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(validation, null, 2));
