import {
  getDeployments,
  getEvidence,
  getEvents,
  getKnownUnknowns,
  getOrganizations,
  getRegulatoryNotes,
  getRelationships,
  getReserveReports,
  getStablecoins,
} from '../data/registry';
import {
  getDeploymentsV3,
  getLegalProfiles,
  getReserveComponents,
  getStableAssetRelationships,
} from '../data/registryV3';
import { getIncomeProfilesV3 } from '../data/incomeProfilesV3';

export function loadStatsData() {
  return {
    stablecoins: getStablecoins(),
    organizations: getOrganizations(),
    relationships: getRelationships(),
    events: getEvents(),
    evidence: getEvidence(),
    reserveReports: getReserveReports(),
    knownUnknowns: getKnownUnknowns(),
    regulatoryNotes: getRegulatoryNotes(),
    deployments: getDeployments(),
    deploymentsV3: getDeploymentsV3(),
    legalProfiles: getLegalProfiles(),
    assetRelationships: getStableAssetRelationships(),
    reserveComponents: getReserveComponents(),
    incomeProfiles: getIncomeProfilesV3(),
  };
}

export type StatsData = ReturnType<typeof loadStatsData>;

export function getRecordCounts(data: StatsData) {
  return {
    stablecoins: data.stablecoins.length,
    organizations: data.organizations.length,
    relationships: data.relationships.length,
    events: data.events.length,
    evidence: data.evidence.length,
    reserve_reports: data.reserveReports.length,
    known_unknowns: data.knownUnknowns.length,
    regulatory_notes: data.regulatoryNotes.length,
    deployments: data.deployments.length,
    legal_profiles: data.legalProfiles.length,
    stable_asset_relationships: data.assetRelationships.length,
    reserve_components: data.reserveComponents.length,
    income_profiles: data.incomeProfiles.length,
  };
}
