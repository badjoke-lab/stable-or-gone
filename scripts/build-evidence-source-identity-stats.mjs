import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deduplicateEvidenceRecords } from '../config/evidence-source-deduplication.mjs';
import { evidenceSourceAliasCount, evidenceSourceIdentityGroupCount, resolveEvidenceIdentityId } from '../config/evidence-source-identities.mjs';
import { getEvidenceArchiveState, getEvidencePrimaryState, getEvidenceProvenance, getEvidenceReliability, getPublicEvidenceCategory } from '../config/evidence-taxonomy.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const defaultRoot = process.cwd();
const outputPath = 'data/generated/registry-stats.json';
const unique = (items) => [...new Set(items.filter((item) => typeof item === 'string' && item.length > 0))].sort();

function readRows(root, relativePath) {
  const parsed = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  const rows = Array.isArray(parsed) ? parsed : parsed.records;
  if (!Array.isArray(rows)) throw new Error(`${relativePath}: expected an array or records array`);
  return rows;
}

function values(row, pluralKey, singularKey) {
  return unique([...(Array.isArray(row[pluralKey]) ? row[pluralKey] : []), ...(typeof row[singularKey] === 'string' && row[singularKey].length > 0 ? [row[singularKey]] : [])]);
}

function normalizeEvidence(row) {
  return {
    ...row,
    stablecoin_ids: values(row, 'stablecoin_ids', 'stablecoin_id'),
    organization_ids: values(row, 'organization_ids', 'issuer_id'),
    event_ids: values(row, 'event_ids', 'event_id'),
    claim_scopes: values(row, 'claim_scopes', 'claim_scope')
  };
}

function countBy(values) {
  const counts = new Map();
  for (const rawValue of values) {
    const value = rawValue === null || rawValue === undefined || rawValue === '' ? 'unknown' : String(rawValue);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort(([left], [right]) => left.localeCompare(right)));
}

function duplicateUrlEntries(rows) {
  const groups = new Map();
  for (const row of rows) {
    const url = String(row.url ?? '').trim();
    if (!url) continue;
    const entries = groups.get(url) ?? [];
    entries.push(row.id);
    groups.set(url, entries);
  }
  return [...groups.entries()].filter(([, ids]) => ids.length > 1);
}

function duplicateUrlGroups(rows) {
  return duplicateUrlEntries(rows).length;
}

export function buildEvidenceSourceIdentityStats(root = defaultRoot) {
  const baseline = loadRegistryV2Baseline(root);
  const canonicalEvidence = (baseline.data_groups?.evidence ?? []).flatMap((file) => readRows(root, file)).map(normalizeEvidence);
  const sourceIdentities = deduplicateEvidenceRecords(canonicalEvidence);
  const sourceIdentityIds = new Set(sourceIdentities.map((source) => source.id));
  const evidenceRelations = canonicalEvidence.map((row) => ({
    evidence_id: resolveEvidenceIdentityId(row.id),
    stablecoin_ids: [...row.stablecoin_ids],
    organization_ids: [...row.organization_ids],
    event_ids: [...row.event_ids],
    claim_scopes: [...row.claim_scopes]
  }));
  const relationSourceIdentityIds = new Set(evidenceRelations.map((relation) => relation.evidence_id));
  const orphanRelationSourceIds = [...relationSourceIdentityIds].filter((id) => !sourceIdentityIds.has(id)).sort();
  for (const [url, ids] of duplicateUrlEntries(sourceIdentities)) {
    console.error(`Public evidence URL duplicate: ${url} -> ${ids.join(', ')}`);
  }

  return {
    canonical_evidence_records: canonicalEvidence.length,
    public_source_identities: sourceIdentities.length,
    evidence_relations: evidenceRelations.length,
    relation_source_identities: relationSourceIdentityIds.size,
    source_identity_groups: evidenceSourceIdentityGroupCount,
    source_aliases: evidenceSourceAliasCount,
    removed_public_duplicate_rows: canonicalEvidence.length - sourceIdentities.length,
    canonical_duplicate_url_groups: duplicateUrlGroups(canonicalEvidence),
    public_duplicate_url_groups: duplicateUrlGroups(sourceIdentities),
    orphan_relation_source_ids: orphanRelationSourceIds,
    public_source_category: countBy(sourceIdentities.map((row) => getPublicEvidenceCategory(row.source_type))),
    source_provenance: countBy(sourceIdentities.map((row) => getEvidenceProvenance(row.source_type, row.source_provenance))),
    primary_state: countBy(sourceIdentities.map((row) => getEvidencePrimaryState(row.source_type, row.is_primary, row.primary_state))),
    reliability: countBy(sourceIdentities.map((row) => getEvidenceReliability(row.reliability))),
    archive_state: countBy(sourceIdentities.map((row) => getEvidenceArchiveState(row.archived_url))),
    supported_claim_scopes_non_exclusive: countBy(sourceIdentities.flatMap((row) => row.claim_scopes ?? [])),
    relation_claim_scopes_non_exclusive: countBy(evidenceRelations.flatMap((row) => row.claim_scopes))
  };
}

export function applyEvidenceSourceIdentityStats(stats, root = defaultRoot) {
  const identityStats = buildEvidenceSourceIdentityStats(root);
  stats.registry = { ...stats.registry, evidence_source_identities: identityStats.public_source_identities, evidence_relations: identityStats.evidence_relations };
  stats.quality = {
    ...stats.quality,
    evidence_duplicate_public_rows: {
      count: identityStats.public_duplicate_url_groups,
      share: identityStats.public_source_identities === 0 ? 0 : Number((identityStats.public_duplicate_url_groups / identityStats.public_source_identities).toFixed(4))
    },
    evidence_source_aliases: {
      count: identityStats.source_aliases,
      share: identityStats.canonical_evidence_records === 0 ? 0 : Number((identityStats.source_aliases / identityStats.canonical_evidence_records).toFixed(4))
    }
  };
  stats.evidence_source_identities = identityStats;
  return stats;
}

function runCli() {
  const absoluteOutputPath = path.join(defaultRoot, outputPath);
  const stats = JSON.parse(fs.readFileSync(absoluteOutputPath, 'utf8'));
  applyEvidenceSourceIdentityStats(stats, defaultRoot);
  fs.writeFileSync(absoluteOutputPath, `${JSON.stringify(stats, null, 2)}\n`);
  console.log(`Added evidence source identity statistics: ${stats.evidence_source_identities.public_source_identities} source identities and ${stats.evidence_source_identities.evidence_relations} relations.`);
}

const direct = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (direct) runCli();
