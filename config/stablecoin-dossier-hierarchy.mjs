export const dossierSections = Object.freeze([
  Object.freeze({ id: 'identity_current_state', label: 'Overview and current state', local_nav_label: 'Overview', order: 1, required: true, purpose: 'Identify the asset and summarize the current reviewed state before technical fields.' }),
  Object.freeze({ id: 'how_asset_works', label: 'Reserves, redemption, and technical model', local_nav_label: 'Reserves', order: 2, required: true, purpose: 'Keep reference, backing, stabilization, reserves, redemption, valuation, and yield as separate facts.' }),
  Object.freeze({ id: 'organizations_control', label: 'Organizations and control', local_nav_label: 'Organizations', order: 3, required: true, purpose: 'Show current and historical organization relationships and keep control-capability diagnostics reachable.' }),
  Object.freeze({ id: 'history', label: 'Material events', local_nav_label: 'Events', order: 4, required: true, purpose: 'Show the five latest material events first and keep earlier events reachable through disclosure.' }),
  Object.freeze({ id: 'deployments_legal_context', label: 'Deployments and legal context', local_nav_label: 'Deployments', order: 5, required: true, purpose: 'Separate deployment identity and state from asset-level classification and legal notices.' }),
  Object.freeze({ id: 'known_unknowns', label: 'Known unknowns', local_nav_label: 'Unknowns', order: 6, required: true, purpose: 'Expose unresolved, undisclosed, unreviewed, and disputed facts without converting them into certainty.' }),
  Object.freeze({ id: 'evidence', label: 'Evidence', local_nav_label: 'Evidence', order: 7, required: true, purpose: 'Show ten source records initially while preserving publisher, provenance, claims, archive state, reliability, and publication date.' }),
  Object.freeze({ id: 'corrections_further_reading', label: 'Related records and corrections', local_nav_label: 'More', order: 8, required: true, purpose: 'Provide correction access, related records, guides, methodology, and machine-readable references.' })
]);

export const dossierSurfaceFiles = Object.freeze([
  'src/components/StablecoinDossierHeader.astro',
  'src/components/StablecoinDetailView.astro',
  'src/components/StablecoinReserveSection.astro',
  'src/components/StablecoinOrganizationsControl.astro',
  'src/components/StablecoinHistorySection.astro',
  'src/components/StablecoinContextSections.astro',
  'src/components/StablecoinValueStateSections.astro',
  'src/components/DeploymentTable.astro',
  'src/components/EvidenceSourceTable.astro',
  'src/components/StablecoinRelatedSection.astro'
]);

// Retained exports keep older tooling imports compatible. R4 assignment is performed by
// scripts/collect-stablecoin-dossier-hierarchy.mjs from source file, section, and label.
export const blockSectionAssignments = Object.freeze({});
export const fieldSectionOverrides = Object.freeze({});
export const fieldDecisionOverrides = Object.freeze({});

export const syntheticDossierFields = Object.freeze([
  Object.freeze({ field_id: 'record.canonical_name', current_surface: 'StablecoinDossierHeader heading', source: 'stablecoin.name', destination_section: 'identity_current_state', decision: 'keep', required: true, public_label: 'Name', value_state: false }),
  Object.freeze({ field_id: 'record.public_summary', current_surface: 'StablecoinDetailView overview', source: 'stablecoinPublicCopy or stablecoin.summary', destination_section: 'identity_current_state', decision: 'keep', required: true, public_label: 'Summary', value_state: false }),
  Object.freeze({ field_id: 'record.route_identity', current_surface: 'Technical identity disclosure', source: 'stablecoin.slug and stablecoin.id', destination_section: 'identity_current_state', decision: 'keep', required: true, public_label: 'Record identity', value_state: false }),
  Object.freeze({ field_id: 'mechanics.reserve_component_detail', current_surface: 'Reserve components list', source: 'reserve_components.*', destination_section: 'how_asset_works', decision: 'keep', required: true, public_label: 'Reserve components', value_state: true }),
  Object.freeze({ field_id: 'history.event_date', current_surface: 'StablecoinHistorySection event rows', source: 'events.event_date', destination_section: 'history', decision: 'keep', required: true, public_label: 'Date', value_state: true }),
  Object.freeze({ field_id: 'history.event_type', current_surface: 'StablecoinHistorySection event rows', source: 'events.event_type or event_detail_kind', destination_section: 'history', decision: 'keep', required: true, public_label: 'Event type', value_state: true }),
  Object.freeze({ field_id: 'history.event_title', current_surface: 'StablecoinHistorySection event rows', source: 'eventPublicCopy.title or events.title', destination_section: 'history', decision: 'keep', required: true, public_label: 'Event title', value_state: false }),
  Object.freeze({ field_id: 'history.event_description', current_surface: 'StablecoinHistorySection event rows', source: 'eventPublicCopy.description or events.description', destination_section: 'history', decision: 'keep', required: true, public_label: 'Event description', value_state: false }),
  Object.freeze({ field_id: 'organizations.relationship_scope', current_surface: 'StablecoinOrganizationsControl intro', source: 'approved interface copy', destination_section: 'organizations_control', decision: 'keep', required: true, public_label: 'Relationship scope note', value_state: false }),
  Object.freeze({ field_id: 'evidence.published_at', current_surface: 'EvidenceRows source metadata', source: 'evidence.published_at', destination_section: 'evidence', decision: 'keep', required: true, public_label: 'Published', value_state: true }),
  Object.freeze({ field_id: 'further_reading.related_registry', current_surface: 'StablecoinRelatedSection', source: 'stablecoins, primary organization, events', destination_section: 'corrections_further_reading', decision: 'keep', required: true, public_label: 'Related registry pages', value_state: false }),
  Object.freeze({ field_id: 'further_reading.guides', current_surface: 'RelatedGuides component', source: 'stablecoinGuideLinks', destination_section: 'corrections_further_reading', decision: 'keep', required: true, public_label: 'Related guides', value_state: false }),
  Object.freeze({ field_id: 'further_reading.corrections', current_surface: 'StablecoinRelatedSection and dossier header', source: '/contact/', destination_section: 'corrections_further_reading', decision: 'add_contextual_link', required: true, public_label: 'Submit a correction', value_state: false }),
  Object.freeze({ field_id: 'further_reading.methodology', current_surface: 'StablecoinRelatedSection', source: '/methodology/', destination_section: 'corrections_further_reading', decision: 'add_contextual_link', required: true, public_label: 'Methodology', value_state: false }),
  Object.freeze({ field_id: 'further_reading.machine_readable', current_surface: 'StablecoinRelatedSection', source: '/data/manifest.json', destination_section: 'corrections_further_reading', decision: 'add_contextual_link', required: true, public_label: 'Machine-readable data', value_state: false })
]);

export const dossierPolicies = Object.freeze({
  implementation_deferred: false,
  implementation_starts_at_pr: 415,
  current_remediation_pr: 439,
  route_changes_allowed: false,
  evidence_section_required: true,
  known_unknowns_section_required: true,
  corrections_section_required: true,
  all_relationships_required: true,
  current_and_historical_data_must_remain_distinct: true,
  primary_facts_are_summaries_not_replacement_fields: true,
  primary_fact_limit: 6,
  initial_event_limit: 5,
  initial_evidence_limit: 10,
  organization_primary_column_limit: 5,
  mobile_secondary_sections_closed: true,
  deployment_axes_must_remain_separate: Object.freeze([
    'operational_state',
    'canonical_status_raw',
    'change_state',
    'canonicality',
    'canonicality_record_state',
    'verification_state',
    'contract_identity_state',
    'network_identity_state'
  ]),
  evidence_axes_must_remain_separate: Object.freeze([
    'public_category',
    'canonical_source_type',
    'provenance',
    'primary_state',
    'claim_scopes',
    'archive_state',
    'reliability',
    'published_at'
  ])
});
