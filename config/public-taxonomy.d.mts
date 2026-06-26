export type PublicTaxonomyEntry = {
  canonical_value: string;
  public_category: string;
  public_label: string;
  legacy_aliases: string[];
  sort_order: number;
  is_filterable: boolean;
  short_definition?: string;
};

export type PublicTaxonomyAxis = {
  is_filterable: boolean;
  entries: PublicTaxonomyEntry[];
};

export const publicTaxonomy: {
  schema_version: string;
  registry_id: string;
  specification: string;
  axes: Record<string, PublicTaxonomyAxis>;
  legacy_value_rules: Record<string, Array<{
    legacy_value: string;
    target_canonical_value: string | null;
    review_required: boolean;
    action: string;
  }>>;
  descriptive_axes: Record<string, { is_filterable: false; reason: string }>;
};

export function taxonomyLabel(axis: string, value: string | null | undefined, fallback?: string | null): string | null;
