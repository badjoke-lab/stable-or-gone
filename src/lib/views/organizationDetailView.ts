import { resolveEventTaxonomy } from '../../utils/eventTaxonomy';
import { resolvePrimaryRelationshipForStablecoin } from '../../utils/primaryDisplayRelationship';
import { getFunctionalRoleLabel, getRelationshipStatusLabel, resolveOrganizationTaxonomy } from '../../utils/organizationTaxonomy';
import { issuerPublicSummaries } from '../../data/issuerPublicCopy';
import { eventPublicCopy } from '../../data/eventPublicCopy';
import { getStablecoins, getRelationships, getEvents, getEvidence, getKnownUnknowns, type OrganizationRow } from '../data/registry';
import { getCanonicalEvidenceRelations, getEvidenceSourceIdentities } from '../data/evidenceSources';
import { resolveEvidenceIdentityId } from '../../../config/evidence-source-identities.mjs';

export function buildOrganizationDetailView(organization: OrganizationRow) {
  const allStablecoins = getStablecoins();
  const allRelationships = getRelationships();
  const allEvents = getEvents();
  const allEvidence = getEvidence();
  const stablecoinById = new Map(allStablecoins.map((coin) => [coin.id, coin] as const));
  const relationships = allRelationships
    .filter((relationship) => relationship.organization_id === organization.id)
    .map((relationship) => ({
      relationship,
      coin: stablecoinById.get(relationship.stablecoin_id),
      isPrimary: resolvePrimaryRelationshipForStablecoin(relationship.stablecoin_id, allRelationships).relationship?.id === relationship.id
    }))
    .sort((left, right) => {
      const leftHistorical = left.relationship.status === 'ended' || Boolean(left.relationship.end_date);
      const rightHistorical = right.relationship.status === 'ended' || Boolean(right.relationship.end_date);
      return Number(leftHistorical) - Number(rightHistorical) || String(left.coin?.name ?? '').localeCompare(String(right.coin?.name ?? ''));
    });
  const stablecoins = Array.from(new Set(relationships.map((item) => item.relationship.stablecoin_id))).map((id) => stablecoinById.get(id)).filter(Boolean);
  const currentRelationships = relationships.filter((item) => item.relationship.status !== 'ended' && !item.relationship.end_date);
  const historicalRelationships = relationships.filter((item) => item.relationship.status === 'ended' || Boolean(item.relationship.end_date));
  const events = allEvents.filter((event) => event.issuer_id === organization.id || event.subject_organization_ids?.includes(organization.id)).sort((left, right) => String(right.event_date ?? '').localeCompare(String(left.event_date ?? '')));
  const issuerControlEvents = events.filter((event) => event.event_detail_kind === 'issuer_control' || event.event_type === 'issuer_freeze');
  const evidenceRelations = getCanonicalEvidenceRelations().filter((relation) => relation.organization_ids.includes(organization.id));
  const sourceIdentityIds = new Set(evidenceRelations.map((relation) => relation.evidence_id));
  const evidence = allEvidence.filter((source) => sourceIdentityIds.has(resolveEvidenceIdentityId(source.id)));
  const sourceIdentities = getEvidenceSourceIdentities().filter((source) => sourceIdentityIds.has(source.id));
  const knownUnknowns = getKnownUnknowns().filter((item) => item.issuer_id === organization.id);
  const taxonomy = resolveOrganizationTaxonomy(organization);
  const functionalRoles = Array.from(new Set(relationships.map((item) => item.relationship.role))).sort((a, b) => getFunctionalRoleLabel(a).localeCompare(getFunctionalRoleLabel(b)));
  const relationshipStates = Array.from(new Set(relationships.map((item) => item.relationship.status ?? 'unknown'))).sort((a, b) => getRelationshipStatusLabel(a).localeCompare(getRelationshipStatusLabel(b)));
  const latestEvent = events.find((event) => event.event_date);

  return {
    taxonomy,
    relationships,
    stablecoins,
    currentRelationships,
    historicalRelationships,
    primaryDisplayRelationshipCount: relationships.filter((item) => item.isPrimary).length,
    events: events.map((event) => ({ event, taxonomy: resolveEventTaxonomy(event), title: eventPublicCopy[event.id]?.title ?? event.title })),
    issuerControlEvents,
    evidence,
    sourceIdentities,
    knownUnknowns,
    functionalRoles,
    relationshipStates,
    summary: issuerPublicSummaries[organization.slug] ?? organization.summary ?? 'A summary has not yet been added.',
    latestEvent: latestEvent ? { ...latestEvent, publicTitle: eventPublicCopy[latestEvent.id]?.title ?? latestEvent.title } : null
  };
}
