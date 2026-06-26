export type PublicBackingModelCategory = {
  value: string;
  public_category: string;
  public_label: string;
  sort_order: number;
  is_filterable: boolean;
};

export const publicBackingModelAssignments: Record<string, string>;
export const publicBackingModelCategories: PublicBackingModelCategory[];
export function getPublicBackingModelCategory(slug?: string | null): string | null;
export function getPublicBackingModelDefinition(value?: string | null): PublicBackingModelCategory | null;
export function getPublicBackingModelLabel(value?: string | null, fallback?: string): string;
