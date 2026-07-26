import {
  getFunctionalRoleLabel,
  getJurisdictionScopeFilterOptions,
  getPublicOrganizationCategoryFilterOptions,
  getRegulatoryCharacterFilterOptions,
  getRelationshipStatusLabel,
  resolveOrganizationTaxonomy
} from '../../utils/organizationTaxonomy';
import { formatPublicLabel } from '../../utils/displayLabels';
import { getOrganizations, getRelationships, getStablecoins } from '../data/registry';
import { getCanonicalEvidenceRelations } from '../data/evidenceSources';

const unique = <T>(values: T[]) => [...new Set(values)];
const option = (value: string, label: string) => ({ value, label });

export function buildOrganizationIndexView() {
  const organizations = getOrganizations();
  const stablecoins = getStablecoins();
  const relationships = getRelationships();
  const evidenceRelations = getCanonicalEvidenceRelations();
  const stablecoinById = new Map(stablecoins.map((coin) => [coin.id, coin] as const));

  const records = organizations.map((organization) => {
    const taxonomy = resolveOrganizationTaxonomy(organization);
    const relatedRelationships = relationships.filter((relationship) => relationship.organization_id === organization.id);
    const relatedCoins = unique(relatedRelationships.map((relationship) => stablecoinById.get(relationship.stablecoin_id)).filter(Boolean));
    const roles = unique(relatedRelationships.map((relationship) => relationship.role)).sort();
    const relationshipStatuses = unique(relatedRelationships.map((relationship) => relationship.status ?? 'unknown')).sort();
    const sourceIdentityCount = new Set(evidenceRelations.filter((relation) => relation.organization_ids.includes(organization.id)).map((relation) => relation.evidence_id)).size;
    const assetNames = relatedCoins.map((coin) => coin!.name).sort();
    const publicJurisdictionLabel = formatPublicLabel(taxonomy.jurisdiction_label, 'Unknown or not publicly resolved');
    const search = [organization.name, organization.slug, organization.organization_type, organization.legacy_issuer_type, taxonomy.public_category_label, taxonomy.regulatory_character_label, publicJurisdictionLabel, taxonomy.jurisdiction_scope_label, ...roles.map(getFunctionalRoleLabel), ...relationshipStatuses.map(getRelationshipStatusLabel), ...relatedCoins.flatMap((coin) => [coin!.name, coin!.symbol])].filter(Boolean).join(' ').normalize('NFKC').toLocaleLowerCase().trim().replace(/\s+/g, ' ');
    return {
      slug: organization.slug,
      name: organization.name,
      search,
      category: taxonomy.public_category,
      categoryLabel: taxonomy.public_category_label,
      regulatory: taxonomy.regulatory_character,
      regulatoryLabel: taxonomy.regulatory_character_label,
      jurisdictionScope: taxonomy.jurisdiction_scope,
      jurisdictionLabel: `${publicJurisdictionLabel} · ${taxonomy.jurisdiction_scope_label}`,
      roles,
      relationshipStatuses,
      assetCount: relatedCoins.length,
      assetNames,
      relationshipCount: relatedRelationships.length,
      sourceIdentityCount,
      confidenceLabel: formatPublicLabel(organization.confidence)
    };
  }).sort((left, right) => left.name.localeCompare(right.name));

  const filters = [
    { id: 'category', label: 'Category', options: getPublicOrganizationCategoryFilterOptions().map((item) => option(item.value, item.public_label)) },
    { id: 'regulatory', label: 'Regulatory character', options: getRegulatoryCharacterFilterOptions().map((item) => option(item.value, item.public_label)) },
    { id: 'jurisdiction', label: 'Jurisdiction scope', options: getJurisdictionScopeFilterOptions().map((item) => option(item.value, item.public_label)) },
    { id: 'role', label: 'Functional role', options: unique(records.flatMap((record) => record.roles)).sort().map((value) => option(value, getFunctionalRoleLabel(value))) },
    { id: 'relationship_status', label: 'Relationship state', options: unique(records.flatMap((record) => record.relationshipStatuses)).sort().map((value) => option(value, getRelationshipStatusLabel(value))) }
  ];

  return {
    records,
    filters,
    relationshipCount: relationships.length,
    connectedAssetCount: new Set(relationships.map((relationship) => relationship.stablecoin_id)).size,
    sourceIdentityCount: new Set(evidenceRelations.filter((relation) => relation.organization_ids.length > 0).map((relation) => relation.evidence_id)).size
  };
}
