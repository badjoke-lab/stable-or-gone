import {
  evidenceArchiveStates,
  evidencePrimaryStates,
  evidenceProvenances,
  evidenceReliabilities,
  getEvidenceArchiveState,
  getEvidenceArchiveStateLabel,
  getEvidencePrimaryState,
  getEvidencePrimaryStateLabel,
  getEvidenceProvenance,
  getEvidenceProvenanceLabel,
  getEvidenceReliability,
  getEvidenceReliabilityLabel,
  getPublicEvidenceCategory,
  getPublicEvidenceCategoryLabel,
  publicEvidenceCategories
} from '../../config/evidence-taxonomy.mjs';
import { getEvidenceRelationOrigin } from '../../config/evidence-relation-origin.mjs';

export type EvidenceTaxonomyRecord = {
  id: string;
  source_type?: string | null;
  source_provenance?: string | null;
  is_primary?: boolean | null;
  primary_state?: string | null;
  reliability?: string | null;
  archived_url?: string | null;
};

export function resolveEvidenceTaxonomy(evidence: EvidenceTaxonomyRecord) {
  const publicCategory = getPublicEvidenceCategory(evidence.source_type);
  const provenance = getEvidenceProvenance(evidence.source_type, evidence.source_provenance);
  const primaryState = getEvidencePrimaryState(evidence.source_type, evidence.is_primary, evidence.primary_state);
  const reliability = getEvidenceReliability(evidence.reliability);
  const archiveState = getEvidenceArchiveState(evidence.archived_url);
  const relationOrigin = getEvidenceRelationOrigin(evidence.id);

  return {
    public_category: publicCategory,
    public_category_label: getPublicEvidenceCategoryLabel(publicCategory),
    canonical_source_type: evidence.source_type ?? 'not_recorded',
    provenance,
    provenance_label: getEvidenceProvenanceLabel(provenance),
    primary_state: primaryState,
    primary_state_label: getEvidencePrimaryStateLabel(primaryState),
    reliability,
    reliability_label: getEvidenceReliabilityLabel(reliability),
    canonical_reliability_raw: evidence.reliability ?? 'not_recorded',
    archive_state: archiveState,
    archive_state_label: getEvidenceArchiveStateLabel(archiveState),
    relation_origin: relationOrigin
  };
}

export function getPublicEvidenceCategoryFilterOptions() {
  return [...publicEvidenceCategories].sort((a, b) => a.sort_order - b.sort_order);
}

export function getEvidenceProvenanceFilterOptions() {
  return [...evidenceProvenances].sort((a, b) => a.sort_order - b.sort_order);
}

export function getEvidencePrimaryStateFilterOptions() {
  return [...evidencePrimaryStates].sort((a, b) => a.sort_order - b.sort_order);
}

export function getEvidenceReliabilityFilterOptions() {
  return [...evidenceReliabilities].sort((a, b) => a.sort_order - b.sort_order);
}

export function getEvidenceArchiveStateFilterOptions() {
  return [...evidenceArchiveStates].sort((a, b) => a.sort_order - b.sort_order);
}
