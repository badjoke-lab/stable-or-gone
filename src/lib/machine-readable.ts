import buildProvenanceData from '../../data/generated/build-provenance.json';
import { PUBLIC_ORIGIN } from '../../config/public-origin.mjs';

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
  canonicalOrigin: PUBLIC_ORIGIN,
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
  return {
    primary_records: getStablecoins().length,
    events: getEvents().length,
    evidence: getEvidence().length,
  };
}

export function getRegistryV3Summary() {
  const stablecoinCount = getStablecoins().length;
  const legalProfiles = getLegalProfiles();
  const incomeProfiles = getIncomeProfilesV3();
  const reserveComponents = getReserveComponents();
  return {
    schema_version: 'sog_registry_v3',
    mode: 'additive',
    base_schema_version: DATA_SCHEMA_VERSION,
    protected_stable_assets: stablecoinCount,
    record_counts: {
      legal_profiles: legalProfiles.length,
      stable_asset_relationships: getStableAssetRelationships().length,
      reserve_components: reserveComponents.length,
      income_profiles: incomeProfiles.length,
      deployments: getDeploymentsV3().length,
    },
    coverage: {
      legal_profiles: new Set(legalProfiles.map((row) => row.id)).size,
      income_profiles: new Set(incomeProfiles.map((row) => row.id)).size,
      reserve_component_assets: new Set(reserveComponents.map((row) => row.stablecoin_id)).size,
    },
  };
}

export function getRecordCountBreakdown() {
  const stablecoins = getStablecoins();
  const organizations = getOrganizations();
  const relationships = getRelationships();
  const events = getEvents();
  const evidence = getEvidence();
  const evidenceRelations = getEvidenceRelations();
  const evidenceSourceIdentities = getEvidenceSourceIdentities();
  const canonicalEvidenceRelations = getCanonicalEvidenceRelations();
  const evidenceSourceIdentitySummary = getEvidenceSourceIdentitySummary();
  const reserveReports = getReserveReports();
  const knownUnknowns = getKnownUnknowns();
  const regulatoryNotes = getRegulatoryNotes();
  const deployments = getDeploymentsV3();
  const registryUpdates = getRegistryUpdates();
  const referenceTargets = stablecoins.map((coin) => resolveReferenceTarget(coin));
  const backingModels = stablecoins.map((coin) => resolveBackingModel(coin));
  const eventTaxonomies = events.map((event) => resolveEventTaxonomy(event));
  const organizationTaxonomies = organizations.map((organization) => resolveOrganizationTaxonomy(organization));
  const evidenceTaxonomies = evidence.map((item) => resolveEvidenceTaxonomy(item));
  const evidenceSourceIdentityTaxonomies = evidenceSourceIdentities.map((item) => resolveEvidenceTaxonomy(item));
  const deploymentTaxonomies = deployments.map((item) => resolveDeploymentTaxonomy(item));

  return {
    stablecoins: stablecoins.length,
    organizations: organizations.length,
    relationships: relationships.length,
    evidence_relations: evidenceRelations.length,
    evidence_source_identities: evidenceSourceIdentitySummary.source_identities,
    evidence_source_identity_groups: evidenceSourceIdentitySummary.source_identity_groups,
    evidence_source_aliases: evidenceSourceIdentitySummary.source_aliases,
    evidence_duplicate_public_rows_removed: evidenceSourceIdentitySummary.removed_public_duplicate_rows,
    evidence_canonical_relations: canonicalEvidenceRelations.length,
    evidence_relation_source_identities: evidenceSourceIdentitySummary.relation_source_identities,
    evidence_orphan_relation_source_ids: evidenceSourceIdentitySummary.orphan_relation_source_ids.length,
    reserve_reports: reserveReports.length,
    known_unknowns: knownUnknowns.length,
    regulatory_notes: regulatoryNotes.length,
    deployments: deployments.length,
    registry_updates: registryUpdates.length,
    lifecycle_status: countValues(stablecoins.map((coin) => coin.lifecycle_status)),
    issuance_status: countValues(stablecoins.map((coin) => coin.issuance_status)),
    reference_kind: countValues(referenceTargets.map((target) => target.reference_kind)),
    reference_comparison_category: countValues(referenceTargets.map((target) => target.comparison_category)),
    public_model_category: countValues(backingModels.map((model) => model.public_category)),
    backing_type_non_exclusive: countMultiValues(backingModels.map((model) => model.canonical_backing_types)),
    stabilization_mechanism: countValues(backingModels.map((model) => model.stabilization_mechanism)),
    asset_class: countValues(stablecoins.map((coin) => coin.asset_class)),
    public_organization_category: countValues(organizationTaxonomies.map((organization) => organization.public_category)),
    canonical_organization_type: countValues(organizationTaxonomies.map((organization) => organization.canonical_organization_type)),
    organization_legal_form_state: countValues(organizationTaxonomies.map((organization) => organization.legal_form_state)),
    organization_regulatory_character: countValues(organizationTaxonomies.map((organization) => organization.regulatory_character)),
    organization_jurisdiction_scope: countValues(organizationTaxonomies.map((organization) => organization.jurisdiction_scope)),
    functional_role: countValues(relationships.map((relationship) => relationship.role)),
    relationship_status: countValues(relationships.map((relationship) => relationship.status)),
    ...getPrimaryDisplayRelationshipBreakdown(),
    public_event_category: countValues(eventTaxonomies.map((event) => event.public_category)),
    canonical_event_subtype: countValues(eventTaxonomies.map((event) => event.canonical_subtype)),
    event_detail_kind: countValues(eventTaxonomies.map((event) => event.detail_kind)),
    event_status_effect_category: countValues(eventTaxonomies.map((event) => event.status_effect_category)),
    event_recovery_category: countValues(eventTaxonomies.map((event) => event.recovery_category)),
    public_evidence_category: countValues(evidenceTaxonomies.map((item) => item.public_category)),
    canonical_evidence_source_type: countValues(evidenceTaxonomies.map((item) => item.canonical_source_type)),
    evidence_source_provenance: countValues(evidenceTaxonomies.map((item) => item.provenance)),
    evidence_primary_state: countValues(evidenceTaxonomies.map((item) => item.primary_state)),
    evidence_reliability: countValues(evidenceTaxonomies.map((item) => item.reliability)),
    canonical_evidence_reliability_raw: countValues(evidenceTaxonomies.map((item) => item.canonical_reliability_raw)),
    evidence_archive_state: countValues(evidenceTaxonomies.map((item) => item.archive_state)),
    evidence_relation_kind: countValues(evidenceTaxonomies.map((item) => item.relation_kind)),
    public_evidence_source_identity_category: countValues(evidenceSourceIdentityTaxonomies.map((item) => item.public_category)),
    evidence_source_identity_provenance: countValues(evidenceSourceIdentityTaxonomies.map((item) => item.provenance)),
    evidence_source_identity_primary_state: countValues(evidenceSourceIdentityTaxonomies.map((item) => item.primary_state)),
    evidence_source_identity_reliability: countValues(evidenceSourceIdentityTaxonomies.map((item) => item.reliability)),
    evidence_source_identity_archive_state: countValues(evidenceSourceIdentityTaxonomies.map((item) => item.archive_state)),
    evidence_claim_scope_non_exclusive: countMultiValues(canonicalEvidenceRelations.map((item) => item.claim_scopes)),
    reserve_report_type: countValues(reserveReports.map((report) => report.report_type)),
    known_unknown_severity: countValues(knownUnknowns.map((item) => item.severity)),
    public_deployment_category: countValues(deploymentTaxonomies.map((item) => item.public_category)),
    canonical_deployment_type: countValues(deploymentTaxonomies.map((item) => item.canonical_deployment_type)),
    deployment_operational_state: countValues(deploymentTaxonomies.map((item) => item.operational_state)),
    deployment_status: countValues(deploymentTaxonomies.map((item) => item.canonical_status_raw)),
    deployment_change_state: countValues(deploymentTaxonomies.map((item) => item.change_state)),
    deployment_canonicality: countValues(deploymentTaxonomies.map((item) => item.canonicality)),
    deployment_canonicality_record_state: countValues(deploymentTaxonomies.map((item) => item.canonicality_record_state)),
    deployment_verification_state: countValues(deploymentTaxonomies.map((item) => item.verification_state)),
    deployment_contract_identity_state: countValues(deploymentTaxonomies.map((item) => item.contract_identity_state)),
    deployment_network_identity_state: countValues(deploymentTaxonomies.map((item) => item.network_identity_state)),
    deployment_chain: countValues(deployments.map((deployment) => deployment.chain)),
    ...getPublicValueStateBreakdown(),
  };
}

export function getRecordsLastReviewedAt() {
  const dates = [
    ...getStablecoins().map((coin) => coin.last_verified_at),
    ...getOrganizations().map((organization) => organization.last_verified_at),
  ].filter((value): value is string => typeof value === 'string' && value.length > 0);

  return dates.sort().at(-1) || null;
}
