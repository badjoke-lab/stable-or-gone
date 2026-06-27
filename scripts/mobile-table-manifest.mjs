export const mobileTableSourceFiles = [
  'src/pages/stablecoins/index.astro',
  'src/pages/issuers/index.astro',
  'src/pages/events/index.astro',
  'src/components/StablecoinDetailView.astro',
  'src/components/StablecoinValueStateSections.astro',
  'src/components/ValueStateMethodology.astro',
  'src/components/PrimaryDisplayRelationshipMethodology.astro',
  'src/components/EvidenceSourceIdentityMethodology.astro',
  'src/components/IssuerControlEvents.astro',
  'src/components/StablecoinEventTimeline.astro',
  'src/components/StructuredEventDetail.astro',
  'src/components/DeploymentTable.astro',
  'src/components/EvidenceSourceTable.astro',
  'src/pages/issuer/[slug].astro',
  'src/pages/event/[id].astro'
];

export const requiredMobileTableKinds = [
  'stablecoin-index', 'organization-index', 'event-index', 'stablecoin-overview',
  'stablecoin-organizations', 'stablecoin-reserve-profile', 'stablecoin-redemption-profile',
  'stablecoin-record-coverage', 'issuer-control-events', 'stablecoin-event-timeline',
  'stablecoin-reserve-history', 'stablecoin-regulatory-notices', 'stablecoin-deployments',
  'stablecoin-sources', 'stablecoin-open-questions', 'organization-overview',
  'organization-relationships', 'organization-events', 'organization-sources',
  'event-details', 'event-detail-overlay', 'event-sources', 'methodology-value-states',
  'methodology-primary-display-relationships', 'methodology-evidence-source-identities'
];

export const implementedMobileTableRepresentations = Object.freeze({
  'stablecoin-index': 'src/components/StablecoinIndexCard.astro',
  'organization-index': 'src/components/OrganizationIndexCard.astro',
  'organization-overview': 'src/pages/issuer/[slug].astro',
  'organization-relationships': 'src/pages/issuer/[slug].astro',
  'organization-events': 'src/pages/issuer/[slug].astro',
  'organization-sources': 'src/pages/issuer/[slug].astro',
  'event-index': 'src/components/EventIndexCard.astro',
  'event-details': 'src/pages/event/[id].astro',
  'event-detail-overlay': 'src/components/StructuredEventDetail.astro',
  'event-sources': 'src/pages/event/[id].astro'
});
