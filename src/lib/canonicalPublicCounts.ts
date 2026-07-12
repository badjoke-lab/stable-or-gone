import {
  getRecordCountBreakdown as getBaseRecordCountBreakdown,
  getRecordCounts as getBaseRecordCounts,
} from './machine-readable';
import {
  getCanonicalEvidenceRelations,
  getCompleteEvidence,
  getEvidenceSourceIdentities,
  getEvidenceSourceIdentitySummary,
} from './data/evidenceSources';
import { resolveEvidenceTaxonomy } from '../utils/evidenceTaxonomy';
import { resolvePublicValueState } from '../../config/value-states.mjs';

function countValues(values: unknown[]) {
  return values.reduce<Record<string, number>>((counts, rawValue) => {
    const value = rawValue === null || rawValue === undefined || rawValue === '' ? 'unknown' : String(rawValue);
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function countMultiValues(values: unknown[][]) {
  return countValues(values.flat());
}

export function getRecordCounts() {
  const evidence = getCompleteEvidence();
  return {
    ...getBaseRecordCounts(),
    evidence: evidence.length,
  };
}

export function getRecordCountBreakdown() {
  const evidence = getCompleteEvidence();
  const evidenceRelations = getCanonicalEvidenceRelations();
  const sourceIdentities = getEvidenceSourceIdentities();
  const summary = getEvidenceSourceIdentitySummary();
  const evidenceTaxonomies = evidence.map((item) => resolveEvidenceTaxonomy(item));
  const sourceIdentityTaxonomies = sourceIdentities.map((item) => resolveEvidenceTaxonomy(item));

  return {
    ...getBaseRecordCountBreakdown(),
    evidence_relations: evidenceRelations.length,
    evidence_source_identities: summary.source_identities,
    evidence_source_identity_groups: summary.source_identity_groups,
    evidence_source_aliases: summary.source_aliases,
    evidence_duplicate_public_rows_removed: summary.removed_public_duplicate_rows,
    evidence_canonical_relations: evidenceRelations.length,
    evidence_relation_source_identities: summary.relation_source_identities,
    evidence_orphan_relation_source_ids: summary.orphan_relation_source_ids.length,
    public_evidence_category: countValues(evidenceTaxonomies.map((item) => item.public_category)),
    canonical_evidence_source_type: countValues(evidenceTaxonomies.map((item) => item.canonical_source_type)),
    evidence_source_provenance: countValues(evidenceTaxonomies.map((item) => item.provenance)),
    evidence_primary_state: countValues(evidenceTaxonomies.map((item) => item.primary_state)),
    evidence_reliability: countValues(evidenceTaxonomies.map((item) => item.reliability)),
    canonical_evidence_reliability_raw: countValues(evidenceTaxonomies.map((item) => item.canonical_reliability_raw)),
    evidence_archive_state: countValues(evidenceTaxonomies.map((item) => item.archive_state)),
    evidence_relation_kind: countValues(evidenceRelations.map((item) => item.relation_kind)),
    evidence_published_at_value_state: countValues(evidence.map((item) => resolvePublicValueState(item.published_at))),
    public_evidence_source_identity_category: countValues(sourceIdentityTaxonomies.map((item) => item.public_category)),
    evidence_source_identity_provenance: countValues(sourceIdentityTaxonomies.map((item) => item.provenance)),
    evidence_source_identity_primary_state: countValues(sourceIdentityTaxonomies.map((item) => item.primary_state)),
    evidence_source_identity_reliability: countValues(sourceIdentityTaxonomies.map((item) => item.reliability)),
    evidence_source_identity_archive_state: countValues(sourceIdentityTaxonomies.map((item) => item.archive_state)),
    evidence_claim_scope_non_exclusive: countMultiValues(evidenceRelations.map((item) => item.claim_scopes)),
  };
}
