import buildProvenanceData from '../../data/generated/build-provenance.json';

import {
  getEvidence,
  getEvidenceRelations,
  getEvents,
  getKnownUnknowns,
  getOrganizations,
  getRegistryUpdates,
  getRegulatoryNotes,
  getRelationships,
  getReserveReports,
  getStablecoins,
} from './data/registry';
import {
  getDeploymentsV3,
  getLegalProfiles,
  getReserveComponents,
  getStableAssetRelationships,
} from './data/registryV3';
import { getIncomeProfilesV3 } from './data/incomeProfilesV3';
import {
  getCanonicalEvidenceRelations,
  getEvidenceSourceIdentities,
  getEvidenceSourceIdentitySummary,
} from './data/evidenceSources';
import { getPublicValueStateBreakdown } from './value-state-breakdown';
import { getPrimaryDisplayRelationshipBreakdown } from './primary-display-breakdown';
import { resolveReferenceTarget } from '../utils/referenceTarget';
import { resolveBackingModel } from '../utils/backingModel';
import { resolveEventTaxonomy } from '../utils/eventTaxonomy';
import { resolveOrganizationTaxonomy } from '../utils/organizationTaxonomy';
import { resolveEvidenceTaxonomy } from '../utils/evidenceTaxonomy';
import { resolveDeploymentTaxonomy } from '../utils/deploymentTaxonomy';

export const MACHINE_READABLE_SCHEMA_VERSION = '1.0.0';
export const DATA_SCHEMA_VERSION = 'sog_registry_v2';

export const PROJECT = {
  projectId: 'stable-or-gone',
  siteName: 'Stable or Gone',
  description: 'Source-backed historical registry of stablecoins, organizations, lifecycle events, reserve disclosures, redemption access, and unresolved public-information gaps.',
  registryFamily: 'badjoke-lab-ledger-series',
  registryType: 'stablecoin_issuer_registry',
  canonicalOrigin: 'https://sog.badjoke-lab.com',
  releaseChannel: 'production',
  verificationMarker: 'sog_machine_readable_layer_v1',
  designGeneration: 'registry_v2',
} as const;

export const MAIN_ROUTES = [
  '/',
  '/stablecoins/',
  '/stablecoin/{slug}/',
  '/issuers/',
  '/issuer/{slug}/',
  '/events/',
  '/event/{id}/',
  '/stats/',
  '/guides/',
  '/glossary/',
  '/methodology/',
  '/updates/',
  '/contact/',
  '/support/',
] as const;

export const ROUTES = {
  home: '/',
  stablecoins: '/stablecoins/',
  stablecoin_detail: '/stablecoin/{slug}/',
  organizations: '/issuers/',
  organization_detail: '/issuer/{slug}/',
  events: '/events/',
  event_detail: '/event/{id}/',
  stats: '/stats/',
  guides: '/guides/',
  glossary: '/glossary/',
  methodology: '/methodology/',
  updates: '/updates/',
  corrections: '/contact/',
  support: '/support/',
} as const;

export const DATA_SAFETY = {
  canonical_only: true,
  includes_unreviewed_candidates: false,
  includes_internal_monitoring: false,
  includes_private_notes: false,
} as const;

function countValues(values: unknown[]) {
  return values.reduce<Record<string, number>>((counts, rawValue) => {
    const value = rawValue === null || rawValue === undefined || rawValue === '' ? 'unknown' : String(rawValue);
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function countMultiValues(values: unknown[][]) {
  return countValues(values.flat());
}

export type BuildProvenance = typeof buildProvenanceData;

export function getBuildProvenance(): BuildProvenance {
  return buildProvenanceData;
}

export function getBuildMetadata() {
  const provenance = getBuildProvenance();
  return {
    commit: provenance.source_commit,
    branch: provenance.source_branch,
    generated_at: provenance.generated_at,
    canonical_data_hash: provenance.canonical_data_hash,
    canonical_file_count: provenance.canonical_file_count,
    canonical_record_counts: provenance.canonical_record_counts,
    route_counts: provenance.route_counts,
    provenance_schema_version: provenance.schema_version,
    provenance_verification_marker: provenance.verification_marker,
    verification_marker: PROJECT.verificationMarker,
  };
}

export function getRecordCounts() {
  const evidenceSourceSummary = getEvidenceSourceIdentitySummary();
  return {
    stablecoins: getStablecoins().length,
    organizations: getOrganizations().length,
    relationships: getRelationships().length,
    events: getEvents().length,
    evidence: getEvidence().length,
    evidence_source_identities: evidenceSourceSummary.source_identities,
    evidence_relations: getEvidenceRelations().length,
    reserve_reports: getReserveReports().length,
    known_unknowns: getKnownUnknowns().length,
    regulatory_notes: getRegulatoryNotes().length,
    deployments: getDeploymentsV3().length,
    registry_updates: getRegistryUpdates().length,
  };
}

export function getRecordCountBreakdown() {
  const stablecoins = getStablecoins();
  const organizations = getOrganizations();
  const relationships = getRelationships();
  const events = getEvents();
  const evidence = getEvidence();
  const knownUnknowns = getKnownUnknowns();
  const deployments = getDeploymentsV3();
  return {
    stablecoins: {
      total: stablecoins.length,
      lifecycle_status: countValues(stablecoins.map((row) => row.lifecycle_status)),
      asset_class: countValues(stablecoins.map((row) => row.asset_class)),
      reference_target: countValues(stablecoins.map((row) => resolveReferenceTarget(row).kind)),
      backing_model: countValues(stablecoins.map((row) => resolveBackingModel(row).model)),
      value_state: getPublicValueStateBreakdown(),
      primary_display_relationship: getPrimaryDisplayRelationshipBreakdown(),
    },
    organizations: {
      total: organizations.length,
      organization_type: countValues(organizations.map((row) => resolveOrganizationTaxonomy(row).organization_type)),
    },
    relationships: {
      total: relationships.length,
      role: countValues(relationships.map((row) => row.role)),
    },
    events: {
      total: events.length,
      event_type: countValues(events.map((row) => resolveEventTaxonomy(row).event_type)),
    },
    evidence: {
      total: evidence.length,
      source_type: countValues(evidence.map((row) => resolveEvidenceTaxonomy(row).source_type)),
      reliability: countValues(evidence.map((row) => resolveEvidenceTaxonomy(row).reliability)),
    },
    known_unknowns: {
      total: knownUnknowns.length,
      category: countValues(knownUnknowns.map((row) => row.category)),
    },
    deployments: {
      total: deployments.length,
      deployment_type: countValues(deployments.map((row) => resolveDeploymentTaxonomy(row).deployment_type)),
      chain: countValues(deployments.map((row) => row.chain)),
    },
  };
}

export function getRegistryV3Summary() {
  const legalProfiles = getLegalProfiles();
  const stableAssetRelationships = getStableAssetRelationships();
  const reserveComponents = getReserveComponents();
  const incomeProfiles = getIncomeProfilesV3();
  const deployments = getDeploymentsV3();
  const protectedAssetIds = new Set(getStablecoins().map((row) => row.id));
  const legalAssetIds = new Set(legalProfiles.map((row) => row.id));
  const incomeAssetIds = new Set(incomeProfiles.map((row) => row.id));
  const reserveComponentAssetIds = new Set(reserveComponents.map((row) => row.stablecoin_id));
  const deploymentAssetIds = new Set(deployments.map((row) => row.stablecoin_id));
  return {
    schema_version: 'sog_registry_v3',
    mode: 'additive_reviewed_summary',
    base_registry_schema: DATA_SCHEMA_VERSION,
    protected_stable_asset_count: protectedAssetIds.size,
    record_counts: {
      legal_profiles: legalProfiles.length,
      stable_asset_relationships: stableAssetRelationships.length,
      reserve_components: reserveComponents.length,
      income_profiles: incomeProfiles.length,
      deployment_view_rows: deployments.length,
    },
    asset_coverage: {
      legal_profiles: [...protectedAssetIds].filter((id) => legalAssetIds.has(id)).length,
      income_profiles: [...protectedAssetIds].filter((id) => incomeAssetIds.has(id)).length,
      reserve_components: [...protectedAssetIds].filter((id) => reserveComponentAssetIds.has(id)).length,
      deployments: [...protectedAssetIds].filter((id) => deploymentAssetIds.has(id)).length,
    },
    public_contract: 'v2_public_contract_with_additive_v3_summary',
  };
}
