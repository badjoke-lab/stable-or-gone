import {
  getPublicBackingModelCategory,
  getPublicBackingModelLabel,
  publicBackingModelCategories
} from '../../config/backing-models.mjs';
import { formatPublicLabel } from './displayLabels';
import { formatTaxonomyLabel } from './publicTaxonomy';

export type BackingModelRecord = {
  slug: string;
  collateral_model?: string | null;
  backing_types?: string[] | null;
  stabilization_mechanism?: string | null;
};

export type ResolvedBackingModel = {
  public_category: string;
  public_label: string;
  canonical_backing_types: string[];
  canonical_backing_type_labels: string[];
  stabilization_mechanism: string;
  stabilization_label: string;
  recorded_model_description: string;
};

export function resolveBackingModel(record: BackingModelRecord): ResolvedBackingModel {
  const publicCategory = getPublicBackingModelCategory(record.slug) ?? 'unknown';
  const backingTypes = Array.isArray(record.backing_types) ? [...record.backing_types] : [];
  const stabilizationMechanism = record.stabilization_mechanism ?? 'unknown';

  return {
    public_category: publicCategory,
    public_label: getPublicBackingModelLabel(publicCategory),
    canonical_backing_types: backingTypes,
    canonical_backing_type_labels: backingTypes.map((value) => formatTaxonomyLabel('backing_type', value, formatPublicLabel(value))),
    stabilization_mechanism: stabilizationMechanism,
    stabilization_label: formatTaxonomyLabel('stabilization_mechanism', stabilizationMechanism, formatPublicLabel(stabilizationMechanism)),
    recorded_model_description: formatPublicLabel(record.collateral_model, 'No model description recorded')
  };
}

export function formatPublicBackingModelLabel(record: BackingModelRecord): string {
  return resolveBackingModel(record).public_label;
}

export function getPublicBackingModelFilterOptions() {
  return publicBackingModelCategories.filter((entry) => entry.is_filterable);
}
