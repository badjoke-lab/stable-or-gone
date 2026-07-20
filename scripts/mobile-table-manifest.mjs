export const mobileTableSourceFiles = [
  'src/pages/stablecoins/index.astro',
  'src/components/OrganizationEditorialRegister.astro',
  'src/components/EventEditorialRegister.astro',
  'src/components/StablecoinDetailView.astro',
  'src/components/StablecoinOrganizationsControl.astro',
  'src/components/StablecoinValueStateSections.astro',
  'src/components/ValueStateMethodology.astro',
  'src/components/PrimaryDisplayRelationshipMethodology.astro',
  'src/components/EvidenceSourceIdentityMethodology.astro',
  'src/components/IssuerControlEvents.astro',
  'src/components/StablecoinEventTimeline.astro',
  'src/components/StructuredEventDetail.astro',
  'src/components/DeploymentTable.astro',
  'src/components/EvidenceSourceTable.astro',
  'src/components/OrganizationEditorialIdentity.astro',
  'src/components/OrganizationEditorialHistory.astro',
  'src/components/EventEditorialBody.astro'
];

export const requiredMobileTableKinds = [
  'stablecoin-index', 'organization-index', 'event-index', 'stablecoin-overview',
  'stablecoin-organizations', 'stablecoin-reserve-profile', 'stablecoin-redemption-profile',
  'stablecoin-record-coverage', 'issuer-control-events', 'stablecoin-event-timeline',
  'stablecoin-reserve-history', 'stablecoin-regulatory-notices', 'stablecoin-deployments',
  'stablecoin-sources', 'stablecoin-open-questions', 'organization-relationships',
  'organization-events', 'organization-sources', 'event-detail-overlay', 'event-sources',
  'methodology-value-states', 'methodology-primary-display-relationships',
  'methodology-evidence-source-identities'
];

const generatedByRuntime = 'src/components/MobileTableRuntime.astro';

export const implementedMobileTableRepresentations = Object.freeze({
  'stablecoin-index': 'src/components/StablecoinIndexCard.astro',
  'stablecoin-overview': 'src/components/StablecoinDetailView.astro',
  'stablecoin-organizations': 'src/components/StablecoinOrganizationsControl.astro',
  'organization-index': 'src/components/OrganizationIndexCard.astro',
  'organization-relationships': 'src/components/OrganizationEditorialIdentity.astro',
  'organization-events': 'src/components/OrganizationEditorialHistory.astro',
  'organization-sources': 'src/components/OrganizationEditorialHistory.astro',
  'event-index': 'src/components/EventIndexCard.astro',
  'event-detail-overlay': 'src/components/StructuredEventDetail.astro',
  'event-sources': 'src/components/EventEditorialBody.astro',
  'stablecoin-reserve-profile': 'src/components/StablecoinValueStateSections.astro',
  'stablecoin-redemption-profile': 'src/components/StablecoinValueStateSections.astro',
  'stablecoin-record-coverage': generatedByRuntime,
  'issuer-control-events': generatedByRuntime,
  'stablecoin-event-timeline': generatedByRuntime,
  'stablecoin-reserve-history': 'src/components/StablecoinValueStateSections.astro',
  'stablecoin-regulatory-notices': 'src/components/StablecoinValueStateSections.astro',
  'stablecoin-deployments': generatedByRuntime,
  'stablecoin-sources': generatedByRuntime,
  'stablecoin-open-questions': 'src/components/StablecoinValueStateSections.astro',
  'methodology-value-states': generatedByRuntime,
  'methodology-primary-display-relationships': generatedByRuntime,
  'methodology-evidence-source-identities': generatedByRuntime
});
