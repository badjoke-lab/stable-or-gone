export type OrganizationTaxonomyEntry = {
  value: string;
  public_label: string;
  sort_order: number;
};

export const publicOrganizationCategories: OrganizationTaxonomyEntry[];
export const organizationTypeCategoryMap: Record<string, string>;
export const regulatoryCharacters: OrganizationTaxonomyEntry[];
export const organizationTypeRegulatoryCharacterMap: Record<string, string>;
export const jurisdictionScopes: OrganizationTaxonomyEntry[];
export const legalFormStates: OrganizationTaxonomyEntry[];
export const functionalRoleLabels: Record<string, string>;
export const relationshipStatusLabels: Record<string, string>;
export function getPublicOrganizationCategory(organizationType?: string | null): string;
export function getPublicOrganizationCategoryLabel(value?: string | null): string;
export function getRegulatoryCharacter(organizationType?: string | null): string;
export function getRegulatoryCharacterLabel(value?: string | null): string;
export function getJurisdictionScope(jurisdiction?: string | null): string;
export function getJurisdictionScopeLabel(value?: string | null): string;
export function getLegalFormState(organization?: Record<string, any> | null): string;
export function getLegalFormLabel(organization?: Record<string, any> | null): string;
export function getFunctionalRoleLabel(value?: string | null): string;
export function getRelationshipStatusLabel(value?: string | null): string;
