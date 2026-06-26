export type EvidenceTaxonomyEntry = {
  value: string;
  public_label: string;
  sort_order: number;
};

export const publicEvidenceCategories: EvidenceTaxonomyEntry[];
export const evidenceSourceTypeCategoryMap: Record<string, string>;
export const evidenceProvenances: EvidenceTaxonomyEntry[];
export const evidenceSourceTypeProvenanceMap: Record<string, string>;
export const evidencePrimaryStates: EvidenceTaxonomyEntry[];
export const evidenceReliabilities: EvidenceTaxonomyEntry[];
export const evidenceArchiveStates: EvidenceTaxonomyEntry[];
export const pollutedReliabilityValues: Set<string>;
export function getPublicEvidenceCategory(sourceType?: string | null): string;
export function getPublicEvidenceCategoryLabel(value?: string | null): string;
export function getEvidenceProvenance(sourceType?: string | null, explicitProvenance?: string | null): string;
export function getEvidenceProvenanceLabel(value?: string | null): string;
export function getEvidencePrimaryState(sourceType?: string | null, explicitIsPrimary?: boolean | null, explicitState?: string | null): string;
export function getEvidencePrimaryStateLabel(value?: string | null): string;
export function getEvidenceReliability(rawReliability?: string | null): string;
export function getEvidenceReliabilityLabel(value?: string | null): string;
export function getEvidenceArchiveState(archivedUrl?: string | null): string;
export function getEvidenceArchiveStateLabel(value?: string | null): string;
