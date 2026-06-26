export type EventTaxonomyCategory = {
  value: string;
  public_label: string;
  sort_order: number;
};

export const publicEventCategories: EventTaxonomyCategory[];
export const eventTypeCategoryMap: Record<string, string>;
export const eventStatusEffectCategories: EventTaxonomyCategory[];
export const eventStatusEffectCategoryMap: Record<string, string>;
export const recoveryCategories: EventTaxonomyCategory[];
export function getPublicEventCategory(eventType?: string | null): string;
export function getPublicEventCategoryDefinition(value?: string | null): EventTaxonomyCategory | undefined;
export function getPublicEventCategoryLabel(value?: string | null): string;
export function getCanonicalEventSubtypeLabel(eventType?: string | null): string;
export function getEventStatusEffectCategory(value?: string | null): string;
export function getEventStatusEffectLabel(value?: string | null): string;
export function getRecoveryCategory(event?: Record<string, any> | null): string;
export function getRecoveryCategoryLabel(value?: string | null): string;
