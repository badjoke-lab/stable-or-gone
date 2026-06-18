import {
  getDeployments,
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

export const MACHINE_READABLE_SCHEMA_VERSION = '1.0.0';
export const DATA_SCHEMA_VERSION = 'sog_registry_v2_v3';

export const PROJECT = {
  projectId: 'stable-or-gone',
  siteName: 'Stable or Gone',
  description: 'Source-backed historical registry of stablecoins, organizations, lifecycle events, reserve disclosures, redemption access, and unresolved public-information gaps.',
  registryFamily: 'badjoke-lab-ledger-series',
  registryType: 'stablecoin_issuer_registry',
  canonicalOrigin: 'https://sog.badjoke-lab.com',
  releaseChannel: 'production',
  verificationMarker: 'sog_machine_readable_layer_v1',
  designGeneration: 'registry_v2_v3',
} as const;

export const CANONICAL_DATA_SOURCE = {
  runtime_loader: 'src/lib/data/registry.ts',
  baseline_manifest: 'docs/migration/registry-v2-baseline.json',
  generated_stats: 'data/generated/registry-stats.json',
  canonical_only: true,
  publication_model: 'repository-managed JSON assembled by the canonical runtime loader',
} as const;

export const MAIN_ROUTES = [
  '/',
  '/stablecoins/',
  '/stablecoin/{slug}/',
  '/issuers/',
  '/issuer/{slug}/',
  '/events/',
  '/event/{id}/',
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

function runtimeEnvironment() {
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  };
  return runtime.process?.env || {};
}

export function getBuildMetadata(generatedAt: string) {
  const env = runtimeEnvironment();
  return {
    commit: env.CF_PAGES_COMMIT_SHA || env.VERCEL_GIT_COMMIT_SHA || env.GITHUB_SHA || 'unknown',
    branch: env.CF_PAGES_BRANCH || env.VERCEL_GIT_COMMIT_REF || env.GITHUB_REF_NAME || 'main',
    generated_at: generatedAt,
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

export function getRecordCountBreakdown() {
  const stablecoins = getStablecoins();
  const organizations = getOrganizations();
  const relationships = getRelationships();
  const events = getEvents();
  const evidence = getEvidence();
  const evidenceRelations = getEvidenceRelations();
  const reserveReports = getReserveReports();
  const knownUnknowns = getKnownUnknowns();
  const regulatoryNotes = getRegulatoryNotes();
  const deployments = getDeployments();
  const registryUpdates = getRegistryUpdates();
  const reserveRedemptionProfiles = stablecoins.filter((coin) => coin.reserve_profile && coin.redemption_profile);

  return {
    stablecoins: stablecoins.length,
    organizations: organizations.length,
    relationships: relationships.length,
    reserve_redemption_profiles: reserveRedemptionProfiles.length,
    evidence_relations: evidenceRelations.length,
    reserve_reports: reserveReports.length,
    known_unknowns: knownUnknowns.length,
    regulatory_notes: regulatoryNotes.length,
    deployments: deployments.length,
    registry_updates: registryUpdates.length,
    status: countValues(stablecoins.map((coin) => coin.status)),
    lifecycle_status: countValues(stablecoins.map((coin) => coin.lifecycle_status)),
    issuance_status: countValues(stablecoins.map((coin) => coin.issuance_status)),
    asset_class: countValues(stablecoins.map((coin) => coin.asset_class)),
    organization_type: countValues(organizations.map((organization) => organization.organization_type || organization.issuer_type)),
    relationship_role: countValues(relationships.map((relationship) => relationship.role)),
    event_type: countValues(events.map((event) => event.event_type)),
    evidence_reliability: countValues(evidence.map((item) => item.reliability)),
    evidence_source_type: countValues(evidence.map((item) => item.source_type)),
    reserve_report_type: countValues(reserveReports.map((report) => report.report_type)),
    known_unknown_severity: countValues(knownUnknowns.map((item) => item.severity)),
    deployment_status: countValues(deployments.map((deployment) => deployment.status)),
    deployment_chain: countValues(deployments.map((deployment) => deployment.chain)),
  };
}

export function getRecordsLastReviewedAt() {
  const dates = [
    ...getStablecoins().map((coin) => coin.last_verified_at),
    ...getOrganizations().map((organization) => organization.last_verified_at),
  ].filter((value): value is string => typeof value === 'string' && value.length > 0);

  return dates.sort().at(-1) || null;
}
