import {
  getReferenceComparisonCategoryLabel,
  getReferenceTargetDefinition,
  referenceComparisonCategories
} from '../../config/reference-targets.mjs';
import { formatTaxonomyLabel } from './publicTaxonomy';

export type ReferenceTargetRecord = {
  peg_asset?: string | null;
  peg_reference?: {
    kind?: string | null;
    asset?: string | null;
    target_value?: number | null;
    notes?: string | null;
  } | null;
};

export type ResolvedReferenceTarget = {
  canonical_value: string | null;
  reference_kind: string;
  reference_kind_label: string;
  public_label: string;
  comparison_category: string;
  comparison_category_label: string;
  target_value: number | null;
  methodology_description: string | null;
};

export function resolveReferenceTarget(record: ReferenceTargetRecord): ResolvedReferenceTarget {
  const canonicalValue = record.peg_reference?.asset ?? record.peg_asset ?? null;
  const definition = getReferenceTargetDefinition(canonicalValue);
  const referenceKind = record.peg_reference?.kind ?? definition?.reference_kind ?? 'unknown';
  const comparisonCategory = definition?.comparison_category ?? 'unknown';

  return {
    canonical_value: canonicalValue,
    reference_kind: referenceKind,
    reference_kind_label: formatTaxonomyLabel('reference_kind', referenceKind, 'Unknown reference kind'),
    public_label: definition?.public_label ?? 'Unknown reference target',
    comparison_category: comparisonCategory,
    comparison_category_label: getReferenceComparisonCategoryLabel(comparisonCategory),
    target_value: record.peg_reference?.target_value ?? null,
    methodology_description: record.peg_reference?.notes ?? definition?.methodology_description ?? null
  };
}

export function formatReferenceTargetLabel(record: ReferenceTargetRecord): string {
  return resolveReferenceTarget(record).public_label;
}

export function getReferenceFilterOptions() {
  return [...referenceComparisonCategories].sort((a, b) => a.sort_order - b.sort_order);
}
