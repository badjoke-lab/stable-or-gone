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
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const review = readJson('data/quality/evidence-traceability-pr225.json');
const baseline = loadRegistryV2Baseline(root);
const failures = [];
const fail = (message) => failures.push(message);
const unique = (values) => [...new Set(values.filter((value) => typeof value === 'string' && value.length > 0))].sort();
const same = (left, right) => JSON.stringify(unique(left)) === JSON.stringify(unique(right));

function loadRows(files, group) {
  return (files ?? []).flatMap((file) => {
    const rows = readJson(file);
    if (!Array.isArray(rows)) throw new Error(`${file} in ${group} must contain an array`);
    return rows;
  });
}
function values(row, pluralKey, singularKey) {
  return unique([
    ...(Array.isArray(row[pluralKey]) ? row[pluralKey] : []),
    ...(typeof row[singularKey] === 'string' && row[singularKey].length > 0 ? [row[singularKey]] : [])
  ]);
}
function normalize(row) {
  return {
    ...row,
    stablecoin_ids: values(row, 'stablecoin_ids', 'stablecoin_id'),
    organization_ids: values(row, 'organization_ids', 'issuer_id'),
    event_ids: values(row, 'event_ids', 'event_id'),
    claim_scopes: values(row, 'claim_scopes', 'claim_scope')
  };
}
function union(rows, key) { return unique(rows.flatMap((row) => row[key] ?? [])); }

const stablecoins = loadRows(baseline.data_groups?.stablecoins, 'stablecoins');
const organizations = loadRows(baseline.data_groups?.organizations, 'organizations');
const events = loadRows(baseline.data_groups?.events, 'events');
const evidence = loadRows(baseline.data_groups?.evidence, 'evidence').map(normalize);
const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const eventIds = new Set(events.map((row) => row.id));
const evidenceById = new Map(evidence.map((row) => [row.id, row]));
const publicSources = deduplicateEvidenceRecords(evidence);
const publicById = new Map(publicSources.map((row) => [row.id, row]));

const urlGroups = new Map();
for (const row of evidence) {
  const url = String(row.url ?? '').trim();
  if (!url) continue;
  urlGroups.set(url, [...(urlGroups.get(url) ?? []), row.id]);
}
const duplicateUrlGroups = [...urlGroups.entries()].filter(([, ids]) => ids.length > 1);
const configuredUrls = new Set(evidenceSourceIdentityGroups.map((group) => group.url));
const unconfiguredDuplicateUrls = duplicateUrlGroups.filter(([url]) => !configuredUrls.has(url));

const publicUrlCounts = new Map();
for (const row of publicSources) {
  const url = String(row.url ?? '').trim();
  if (!url) continue;
  publicUrlCounts.set(url, (publicUrlCounts.get(url) ?? 0) + 1);
}
const publicDuplicateUrls = [...publicUrlCounts.entries()].filter(([, count]) => count > 1);

for (const group of evidenceSourceIdentityGroups) {
  const expectedIds = unique([group.canonical_id, ...group.aliases]);
  const actualIds = unique(urlGroups.get(group.url) ?? []);
  if (JSON.stringify(actualIds) !== JSON.stringify(expectedIds)) fail(`${group.canonical_id}: configured identity members differ from exact URL group`);
  const members = expectedIds.map((id) => evidenceById.get(id));
  if (members.some((row) => !row)) {
    fail(`${group.canonical_id}: configured evidence member is missing`);
    continue;
  }
  const projected = publicById.get(group.canonical_id);
  if (!projected) {
    fail(`${group.canonical_id}: public source identity is missing`);
    continue;
  }
  if (String(projected.url ?? '').trim() !== group.url) fail(`${group.canonical_id}: public URL changed`);
  if (!same(projected.source_alias_ids ?? [], group.aliases)) fail(`${group.canonical_id}: alias IDs were not preserved`);
  for (const key of ['stablecoin_ids', 'organization_ids', 'event_ids', 'claim_scopes']) {
    if (!same(projected[key] ?? [], union(members, key))) fail(`${group.canonical_id}: ${key} union was not preserved`);
  }
}

for (const id of evidenceCanonicalIds) if (!publicById.has(id)) fail(`${id}: canonical public identity is missing`);
for (const id of evidenceAliasIds) if (publicById.has(id)) fail(`${id}: alias leaked into public source identities`);

const relations = evidence.map((row) => ({
  evidence_id: resolveEvidenceIdentityId(row.id),
  stablecoin_ids: [...row.stablecoin_ids],
  organization_ids: [...row.organization_ids],
  event_ids: [...row.event_ids],
  claim_scopes: [...row.claim_scopes]
}));
const orphanRelationSourceIds = unique(relations.map((row) => row.evidence_id)).filter((id) => !publicById.has(id));
const invalidStablecoinIds = unique(relations.flatMap((row) => row.stablecoin_ids)).filter((id) => !stablecoinIds.has(id));
const invalidOrganizationIds = unique(relations.flatMap((row) => row.organization_ids)).filter((id) => !organizationIds.has(id));
const invalidEventIds = unique(relations.flatMap((row) => row.event_ids)).filter((id) => !eventIds.has(id));
const subjectless = evidence.filter((row) => row.stablecoin_ids.length + row.organization_ids.length + row.event_ids.length === 0);
const claimless = evidence.filter((row) => row.claim_scopes.length === 0);

const actual = {
  canonical_evidence_records: evidence.length,
  unique_canonical_evidence_ids: evidenceById.size,
  canonical_exact_duplicate_url_groups: duplicateUrlGroups.length,
  approved_source_identity_groups: evidenceSourceIdentityGroupCount,
  approved_source_alias_ids: evidenceSourceAliasCount,
  public_source_identities: publicSources.length,
  public_duplicate_url_groups: publicDuplicateUrls.length,
  evidence_relations: relations.length,
  orphan_relation_source_ids: orphanRelationSourceIds.length,
  invalid_stablecoin_relation_ids: invalidStablecoinIds.length,
  invalid_organization_relation_ids: invalidOrganizationIds.length,
  invalid_event_relation_ids: invalidEventIds.length,
  subjectless_evidence_records: subjectless.length,
  claimless_evidence_records: claimless.length,
  unconfigured_duplicate_url_groups: unconfiguredDuplicateUrls.length
};

if (review.schema_version !== '1.0') fail('schema_version must be 1.0');
if (review.reviewed_at !== '2026-06-28') fail('reviewed_at must be 2026-06-28');
for (const [key, expected] of Object.entries(review.expected_counts ?? {})) if (actual[key] !== expected) fail(`${key}: ${actual[key]} !== ${expected}`);
for (const key of ['canonical_evidence_history_is_append_only','public_source_identity_is_separate_from_canonical_history','aliases_must_resolve_to_reviewed_canonical_source_ids','relation_union_must_survive_public_deduplication','every_relation_source_must_exist_publicly','every_subject_reference_must_be_canonical','public_duplicate_urls_are_prohibited','canonical_duplicate_urls_require_reviewed_identity_groups','no_automatic_evidence_deletion_or_merge']) if (!review.policy?.[key]) fail(`missing policy flag: ${key}`);

if (typeof review.source_review !== 'string' || !fs.existsSync(path.join(root, review.source_review))) fail(`supporting audit is missing: ${review.source_review}`);
else {
  const audit = fs.readFileSync(path.join(root, review.source_review), 'utf8');
  for (const phrase of ['Canonical evidence records: 457','Public source identities: 412','Evidence relations: 457','Public duplicate-URL groups: 0','Orphan relation source IDs: 0']) if (!audit.includes(phrase)) fail(`supporting audit is missing: ${phrase}`);
}

if (failures.length) {
  console.error('PR #225 evidence traceability validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log('PR #225 evidence traceability valid: 457 canonical records, 412 public sources, 457 relations, zero public duplicate URLs and zero orphan references.');
