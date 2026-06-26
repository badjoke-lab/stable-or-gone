import {
  getFunctionalRoleLabel,
  getJurisdictionScope,
  getJurisdictionScopeLabel,
  getLegalFormLabel,
  getLegalFormState,
  getPublicOrganizationCategory,
  getPublicOrganizationCategoryLabel,
  getRegulatoryCharacter,
  getRegulatoryCharacterLabel,
  getRelationshipStatusLabel,
  jurisdictionScopes,
  publicOrganizationCategories,
  regulatoryCharacters
} from '../../config/organization-taxonomy.mjs';

export type OrganizationTaxonomyRecord = {
  organization_type?: string | null;
  legal_form?: string | null;
  jurisdiction?: string | null;
};

export function resolveOrganizationTaxonomy(organization: OrganizationTaxonomyRecord) {
  const publicCategory = getPublicOrganizationCategory(organization.organization_type);
  const regulatoryCharacter = getRegulatoryCharacter(organization.organization_type);
  const jurisdictionScope = getJurisdictionScope(organization.jurisdiction);
  const legalFormState = getLegalFormState(organization);

  return {
    public_category: publicCategory,
    public_category_label: getPublicOrganizationCategoryLabel(publicCategory),
    canonical_organization_type: organization.organization_type ?? 'unknown',
    legal_form_state: legalFormState,
    legal_form_label: getLegalFormLabel(organization),
    jurisdiction_label: organization.jurisdiction && organization.jurisdiction.toLowerCase() !== 'unknown'
      ? organization.jurisdiction
      : 'Unknown or not publicly resolved',
    jurisdiction_scope: jurisdictionScope,
    jurisdiction_scope_label: getJurisdictionScopeLabel(jurisdictionScope),
    regulatory_character: regulatoryCharacter,
    regulatory_character_label: getRegulatoryCharacterLabel(regulatoryCharacter)
  };
}

export function getPublicOrganizationCategoryFilterOptions() {
  return [...publicOrganizationCategories].sort((a, b) => a.sort_order - b.sort_order);
}

export function getRegulatoryCharacterFilterOptions() {
  return [...regulatoryCharacters].sort((a, b) => a.sort_order - b.sort_order);
}

export function getJurisdictionScopeFilterOptions() {
  return [...jurisdictionScopes].sort((a, b) => a.sort_order - b.sort_order);
}

export { getFunctionalRoleLabel, getRelationshipStatusLabel };
