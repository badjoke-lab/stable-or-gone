import { PUBLIC_ORIGIN } from '../../config/public-origin.mjs';
import {
  DATA_SAFETY,
  DATA_SCHEMA_VERSION,
  MACHINE_READABLE_SCHEMA_VERSION,
  PROJECT,
  getBuildMetadata,
} from './machine-readable';
import {
  getEvidence,
  getEvidenceRelations,
  getEvents,
  getKnownUnknowns,
  getOrganizations,
  getRegulatoryNotes,
  getRelationships,
  getReserveReports,
  getStablecoins,
} from './data/registry';
import {
  getDeploymentsV3,
  getLegalProfile,
  getReserveComponentsFor,
  getStableAssetRelationshipsFor,
} from './data/registryV3';
import { getIncomeProfileV3 } from './data/incomeProfilesV3';

const byId = <T extends { id: string }>(rows: T[]) => [...rows].sort((left, right) => left.id.localeCompare(right.id));
const byDateThenId = <T extends { id: string; event_date?: string | null }>(rows: T[]) => [...rows].sort((left, right) =>
  String(left.event_date ?? '').localeCompare(String(right.event_date ?? '')) || left.id.localeCompare(right.id)
);

export function getStablecoinRecordDossier(slug: string) {
  const stablecoin = getStablecoins().find((row) => row.slug === slug);
  if (!stablecoin) return null;

  const relationships = byId(getRelationships().filter((row) => row.stablecoin_id === stablecoin.id));
  const events = byDateThenId(getEvents().filter((row) =>
    row.stablecoin_id === stablecoin.id || (row.subject_stablecoin_ids ?? []).includes(stablecoin.id)
  ));
  const eventIds = new Set(events.map((row) => row.id));

  const evidenceRelations = byId(getEvidenceRelations().filter((row) =>
    row.stablecoin_ids.includes(stablecoin.id) || row.event_ids.some((eventId) => eventIds.has(eventId))
  ));
  const relatedEvidenceIds = new Set(evidenceRelations.map((row) => row.evidence_id));
  const evidence = byId(getEvidence().filter((row) =>
    row.stablecoin_id === stablecoin.id ||
    (row.stablecoin_ids ?? []).includes(stablecoin.id) ||
    relatedEvidenceIds.has(row.id)
  ));

  const organizationIds = new Set<string>();
  for (const row of relationships) organizationIds.add(row.organization_id);
  for (const row of events) {
    if (row.issuer_id) organizationIds.add(row.issuer_id);
    for (const id of row.subject_organization_ids ?? []) organizationIds.add(id);
  }
  for (const row of evidence) {
    if (row.issuer_id) organizationIds.add(row.issuer_id);
    for (const id of row.organization_ids ?? []) organizationIds.add(id);
  }
  const organizations = byId(getOrganizations().filter((row) => organizationIds.has(row.id)));

  const reserveReports = byId(getReserveReports().filter((row) => row.stablecoin_id === stablecoin.id));
  const knownUnknowns = byId(getKnownUnknowns().filter((row) => row.stablecoin_id === stablecoin.id));
  const regulatoryNotes = byId(getRegulatoryNotes().filter((row) => row.stablecoin_id === stablecoin.id));
  const deployments = byId(getDeploymentsV3().filter((row) => row.stablecoin_id === stablecoin.id));
  const reserveComponents = byId(getReserveComponentsFor(stablecoin.id));
  const stableAssetRelationships = byId(getStableAssetRelationshipsFor(stablecoin.id));
  const legalProfile = getLegalProfile(stablecoin.id) ?? null;
  const incomeProfile = getIncomeProfileV3(stablecoin.id) ?? null;
  const build = getBuildMetadata();

  return {
    schema_version: MACHINE_READABLE_SCHEMA_VERSION,
    data_schema_version: DATA_SCHEMA_VERSION,
    project_id: PROJECT.projectId,
    registry_family: PROJECT.registryFamily,
    registry_type: PROJECT.registryType,
    record_type: 'stablecoin',
    id: stablecoin.id,
    slug: stablecoin.slug,
    canonical_page_url: `${PUBLIC_ORIGIN}/stablecoin/${stablecoin.slug}/`,
    self_url: `${PUBLIC_ORIGIN}/data/stablecoin/${stablecoin.slug}.json`,
    build,
    data_safety: DATA_SAFETY,
    canonical_only: DATA_SAFETY.canonical_only,
    includes_unreviewed_candidates: DATA_SAFETY.includes_unreviewed_candidates,
    record: stablecoin,
    related: {
      organizations,
      organization_relationships: relationships,
      events,
      evidence,
      evidence_relations: evidenceRelations,
      reserve_reports: reserveReports,
      known_unknowns: knownUnknowns,
      regulatory_notes: regulatoryNotes,
      deployments,
      legal_profile: legalProfile,
      stable_asset_relationships: stableAssetRelationships,
      reserve_components: reserveComponents,
      income_profile: incomeProfile,
    },
    record_counts: {
      organizations: organizations.length,
      organization_relationships: relationships.length,
      events: events.length,
      evidence: evidence.length,
      evidence_relations: evidenceRelations.length,
      reserve_reports: reserveReports.length,
      known_unknowns: knownUnknowns.length,
      regulatory_notes: regulatoryNotes.length,
      deployments: deployments.length,
      stable_asset_relationships: stableAssetRelationships.length,
      reserve_components: reserveComponents.length,
      legal_profile: legalProfile ? 1 : 0,
      income_profile: incomeProfile ? 1 : 0,
    },
  };
}
