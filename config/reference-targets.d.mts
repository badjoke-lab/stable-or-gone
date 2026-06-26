export type ReferenceComparisonCategory = {
  value: string;
  public_label: string;
  sort_order: number;
};

export type ReferenceTargetDefinition = {
  reference_kind: string;
  comparison_category: string;
  public_label: string;
  methodology_description: string;
};

export const referenceComparisonCategories: ReferenceComparisonCategory[];
export const referenceTargets: Record<string, ReferenceTargetDefinition>;
export function getReferenceTargetDefinition(value?: string | null): ReferenceTargetDefinition | null;
export function getReferenceComparisonCategory(value?: string | null): string | null;
export function getReferenceComparisonCategoryLabel(value?: string | null, fallback?: string): string;
