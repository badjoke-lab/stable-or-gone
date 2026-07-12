import fs from 'node:fs';
import path from 'node:path';
import { buildEvidenceSourceIdentityStats } from './build-evidence-source-identity-stats.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import {
  getEvidenceArchiveState,
  getEvidencePrimaryState,
  getEvidenceProvenance,
  getEvidenceReliability,
  getPublicEvidenceCategory,
} from '../config/evidence-taxonomy.mjs';
import { getEvidenceRelationKind } from '../config/evidence-relation-kinds.mjs';
import { resolvePublicValueState } from '../config/value-states.mjs';

const root = process.cwd();
const dist = path.resolve(root, process.argv[2] ?? 'dist');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const unique = (items) => [...new Set(items.filter((item) => typeof item === 'string' && item.length > 0))].sort();
const countValues = (values) => Object.fromEntries([...values.reduce((counts, rawValue) => {
  const value = rawValue === null || rawValue === undefined || rawValue === '' ? 'unknown' : String(rawValue);
  counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}, new Map()).entries()].sort(([left], [right]) => left.localeCompare(right)));
const normalizeEvidence = (row) => ({
  ...row,
  stablecoin_ids: unique([...(row.stablecoin_ids ?? []), row.stablecoin_id]),
  organization_ids: unique([...(row.organization_ids ?? []), row.issuer_id]),
  event_ids: unique([...(row.event_ids ?? []), row.event_id]),
  claim_scopes: unique([...(row.claim_scopes ?? []), row.claim_scope]),
});
const rows = (file) => {
  const parsed = readJson(path.join(root, file));
  return Array.isArray(parsed) ? parsed : parsed.records;
};

const baseline = loadRegistryV2Baseline(root);
const evidence = (baseline.data_groups?.evidence ?? []).flatMap(rows).map(normalizeEvidence);
const evidenceIdentityStats = buildEvidenceSourceIdentityStats(root);
const expected = {
  evidence_relations: evidenceIdentityStats.evidence_relations,
  evidence_source_identities: evidenceIdentityStats.public_source_identities,
  evidence_source_identity_groups: evidenceIdentityStats.source_identity_groups,
  evidence_source_aliases: evidenceIdentityStats.source_aliases,
  evidence_duplicate_public_rows_removed: evidenceIdentityStats.removed_public_duplicate_rows,
  evidence_canonical_relations: evidenceIdentityStats.evidence_relations,
  evidence_relation_source_identities: evidenceIdentityStats.relation_source_identities,
  evidence_orphan_relation_source_ids: evidenceIdentityStats.orphan_relation_source_ids.length,
  public_evidence_category: countValues(evidence.map((row) => getPublicEvidenceCategory(row.source_type))),
  canonical_evidence_source_type: countValues(evidence.map((row) => row.source_type)),
  evidence_source_provenance: countValues(evidence.map((row) => getEvidenceProvenance(row.source_type, row.source_provenance))),
  evidence_primary_state: countValues(evidence.map((row) => getEvidencePrimaryState(row.source_type, row.is_primary, row.primary_state))),
  evidence_reliability: countValues(evidence.map((row) => getEvidenceReliability(row.reliability))),
  canonical_evidence_reliability_raw: countValues(evidence.map((row) => row.reliability)),
  evidence_archive_state: countValues(evidence.map((row) => getEvidenceArchiveState(row.archived_url))),
  evidence_relation_kind: countValues(evidence.map((row) => getEvidenceRelationKind(row.id))),
  public_evidence_source_identity_category: evidenceIdentityStats.public_source_category,
  evidence_source_identity_provenance: evidenceIdentityStats.source_provenance,
  evidence_source_identity_primary_state: evidenceIdentityStats.primary_state,
  evidence_source_identity_reliability: evidenceIdentityStats.reliability,
  evidence_source_identity_archive_state: evidenceIdentityStats.archive_state,
  evidence_claim_scope_non_exclusive: countValues(evidence.flatMap((row) => row.claim_scopes)),
  evidence_published_at_value_state: countValues(evidence.map((row) => resolvePublicValueState(row.published_at))),
};

const version = readJson(path.join(dist, 'version.json'));
const actual = version.data.record_count_breakdown;
const differences = [];
for (const key of Object.keys(expected).sort()) {
  if (JSON.stringify(expected[key]) !== JSON.stringify(actual[key])) {
    differences.push({ key, expected: expected[key], actual: actual[key] });
  }
}
console.log(JSON.stringify({
  ok: differences.length === 0,
  canonical_evidence: evidence.length,
  public_record_count: version.data.record_counts.evidence,
  differences,
}, null, 2));
