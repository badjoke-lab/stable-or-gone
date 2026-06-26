import { primaryDisplayRelationshipOverrides } from '../../config/primary-display-relationships.mjs';
import { getOrganizations, getRelationships, getStablecoins } from './data/registry';
import { resolveOrganizationTaxonomy } from '../utils/organizationTaxonomy';
import { resolvePrimaryRelationshipForStablecoin } from '../utils/primaryDisplayRelationship';

function countValues(values: Array<string | null | undefined>) {
  return values.reduce<Record<string, number>>((counts, rawValue) => {
    const value = rawValue === null || rawValue === undefined || rawValue === '' ? 'unknown' : String(rawValue);
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

export function getPrimaryDisplayRelationshipBreakdown() {
  const stablecoins = getStablecoins();
  const organizations = getOrganizations();
  const relationships = getRelationships();
  const organizationById = new Map(organizations.map((organization) => [organization.id, organization] as const));
  const resolutions = stablecoins.map((stablecoin) => resolvePrimaryRelationshipForStablecoin(stablecoin.id, relationships));
  const selectedRelationships = resolutions.map((resolution) => resolution.relationship).filter(Boolean);
  const selectedOrganizations = selectedRelationships.map((relationship) => organizationById.get(relationship!.organization_id)).filter(Boolean);
  const relationshipsByStablecoin = new Map(stablecoins.map((stablecoin) => [stablecoin.id, relationships.filter((relationship) => relationship.stablecoin_id === stablecoin.id)] as const));

  return {
    primary_display_relationships: selectedRelationships.length,
    primary_display_explicit_overrides: Object.keys(primaryDisplayRelationshipOverrides).length,
    primary_display_ambiguities: resolutions.filter((resolution) => !resolution.valid).length,
    stablecoins_with_multiple_relationships: stablecoins.filter((stablecoin) => (relationshipsByStablecoin.get(stablecoin.id)?.length ?? 0) > 1).length,
    stablecoins_with_multiple_organizations: stablecoins.filter((stablecoin) => new Set((relationshipsByStablecoin.get(stablecoin.id) ?? []).map((relationship) => relationship.organization_id)).size > 1).length,
    stablecoins_with_historical_relationships: stablecoins.filter((stablecoin) => (relationshipsByStablecoin.get(stablecoin.id) ?? []).some((relationship) => relationship.status === 'ended')).length,
    primary_display_selection_mode: countValues(resolutions.map((resolution) => resolution.selection_mode)),
    primary_display_role: countValues(selectedRelationships.map((relationship) => relationship?.role)),
    primary_display_relationship_status: countValues(selectedRelationships.map((relationship) => relationship?.status ?? 'unknown')),
    primary_display_organization_category: countValues(selectedOrganizations.map((organization) => organization ? resolveOrganizationTaxonomy(organization).public_category : 'unknown'))
  };
}
