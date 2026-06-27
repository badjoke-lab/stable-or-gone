export const dossierSections = Object.freeze([
  Object.freeze({ id: 'identity_current_state', label: 'Identity and current state', local_nav_label: 'Overview', order: 1, required: true, purpose: 'Identify the asset and show its current lifecycle, issuance, classification, and review state.' }),
  Object.freeze({ id: 'organizations_control', label: 'Organizations and control', local_nav_label: 'Organizations', order: 2, required: true, purpose: 'Show every organization relationship, governance context, primary display selection, and issuer-control history.' }),
  Object.freeze({ id: 'how_asset_works', label: 'How the asset works', local_nav_label: 'How it works', order: 3, required: true, purpose: 'Explain the reference target, backing, stabilization, reserves, redemption, valuation, and yield or rebase behavior.' }),
  Object.freeze({ id: 'deployments_legal_context', label: 'Deployments and legal context', local_nav_label: 'Deployments', order: 4, required: true, purpose: 'Separate blockchain deployment state from contract verification and show regulatory or official notices.' }),
  Object.freeze({ id: 'history', label: 'History', local_nav_label: 'History', order: 5, required: true, purpose: 'Present model changes, issuer interventions, and the complete event timeline.' }),
  Object.freeze({ id: 'evidence', label: 'Evidence', local_nav_label: 'Evidence', order: 6, required: true, purpose: 'Present public source identities, supported claims, archive state, reliability, reserve reports, and source provenance.' }),
  Object.freeze({ id: 'known_unknowns', label: 'Known unknowns and coverage', local_nav_label: 'Unknowns', order: 7, required: true, purpose: 'Expose investigated unknowns, unresolved questions, record coverage, and last-check context.' }),
  Object.freeze({ id: 'corrections_further_reading', label: 'Corrections and further reading', local_nav_label: 'More', order: 8, required: true, purpose: 'Provide correction access, related registry destinations, guides, methodology, and machine-readable references.' })
]);

export const dossierSurfaceFiles = Object.freeze([
  'src/components/StablecoinDetailView.astro',
  'src/components/StableAssetClassificationRows.astro',
  'src/components/StablecoinValueStateSections.astro',
  'src/components/DeploymentTable.astro',
  'src/components/IssuerControlEvents.astro',
  'src/components/StablecoinEventTimeline.astro',
  'src/components/EvidenceSourceTable.astro'
]);

export const blockSectionAssignments = Object.freeze({
  'src/components/StablecoinDetailView.astro|Reserve components': 'how_asset_works',
  'src/components/StablecoinDetailView.astro|Historical model changes': 'history',
  'src/components/StablecoinDetailView.astro|Organizations and roles': 'organizations_control',
  'src/components/StablecoinDetailView.astro|Record coverage': 'known_unknowns',
  'src/components/StableAssetClassificationRows.astro|embedded': 'identity_current_state',
  'src/components/StablecoinValueStateSections.astro|Reserve profile': 'how_asset_works',
  'src/components/StablecoinValueStateSections.astro|Redemption profile': 'how_asset_works',
  'src/components/StablecoinValueStateSections.astro|Reserve and attestation history': 'evidence',
  'src/components/StablecoinValueStateSections.astro|Regulatory and official notices': 'deployments_legal_context',
  'src/components/StablecoinValueStateSections.astro|Open questions': 'known_unknowns',
  'src/components/DeploymentTable.astro|Blockchain deployments': 'deployments_legal_context',
  'src/components/IssuerControlEvents.astro|Issuer controls and intervention history': 'history',
  'src/components/StablecoinEventTimeline.astro|Event timeline': 'history',
  'src/components/EvidenceSourceTable.astro|embedded': 'evidence'
});

export const fieldSectionOverrides = Object.freeze({
  'src/components/StablecoinDetailView.astro|Hero metrics|Lifecycle': 'identity_current_state',
  'src/components/StablecoinDetailView.astro|Hero metrics|Issuance': 'identity_current_state',
  'src/components/StablecoinDetailView.astro|Hero metrics|Events': 'history',
  'src/components/StablecoinDetailView.astro|Hero metrics|Sources': 'evidence',
  'src/components/StablecoinDetailView.astro|Overview|Symbol': 'identity_current_state',
  'src/components/StablecoinDetailView.astro|Overview|Lifecycle status': 'identity_current_state',
  'src/components/StablecoinDetailView.astro|Overview|Issuance status': 'identity_current_state',
  'src/components/StablecoinDetailView.astro|Overview|Reference target': 'how_asset_works',
  'src/components/StablecoinDetailView.astro|Overview|Reference kind': 'how_asset_works',
  'src/components/StablecoinDetailView.astro|Overview|Comparison category': 'how_asset_works',
  'src/components/StablecoinDetailView.astro|Overview|Target value': 'how_asset_works',
  'src/components/StablecoinDetailView.astro|Overview|Reference methodology': 'how_asset_works',
  'src/components/StablecoinDetailView.astro|Overview|Public backing model': 'how_asset_works',
  'src/components/StablecoinDetailView.astro|Overview|Canonical backing types': 'how_asset_works',
  'src/components/StablecoinDetailView.astro|Overview|Reserve component categories': 'how_asset_works',
  'src/components/StablecoinDetailView.astro|Overview|Primary stabilization mechanism': 'how_asset_works',
  'src/components/StablecoinDetailView.astro|Overview|Recorded model description': 'how_asset_works',
  'src/components/StablecoinDetailView.astro|Overview|Governance': 'organizations_control',
  'src/components/StablecoinDetailView.astro|Overview|Primary display organization': 'organizations_control',
  'src/components/StablecoinDetailView.astro|Overview|Primary display role': 'organizations_control',
  'src/components/StablecoinDetailView.astro|Overview|Display selection mode': 'organizations_control',
  'src/components/StablecoinDetailView.astro|Overview|Last reviewed': 'known_unknowns'
});

export const fieldDecisionOverrides = Object.freeze({
  'src/components/StablecoinDetailView.astro|Hero metrics|Lifecycle': 'consolidate',
  'src/components/StablecoinDetailView.astro|Hero metrics|Issuance': 'consolidate',
  'src/components/StablecoinDetailView.astro|Hero metrics|Events': 'consolidate',
  'src/components/StablecoinDetailView.astro|Hero metrics|Sources': 'consolidate',
  'src/components/StableAssetClassificationRows.astro|embedded|Reference target': 'consolidate',
  'src/components/StablecoinDetailView.astro|Overview|Reference target': 'consolidate',
  'src/components/StablecoinDetailView.astro|Overview|Display selection mode': 'move',
  'src/components/StablecoinDetailView.astro|Record coverage|Section': 'replace',
  'src/components/StablecoinDetailView.astro|Record coverage|Entries': 'replace'
});

export const syntheticDossierFields = Object.freeze([
  Object.freeze({ field_id: 'record.canonical_name', current_surface: 'StablecoinDetailView hero heading', source: 'stablecoin.name', destination_section: 'identity_current_state', decision: 'keep', required: true, public_label: 'Name', value_state: false }),
  Object.freeze({ field_id: 'record.public_summary', current_surface: 'StablecoinDetailView hero summary', source: 'stablecoinPublicCopy or stablecoin.summary', destination_section: 'identity_current_state', decision: 'keep', required: true, public_label: 'Summary', value_state: false }),
  Object.freeze({ field_id: 'record.route_identity', current_surface: 'stablecoin route and canonical metadata', source: 'stablecoin.slug and stablecoin.id', destination_section: 'identity_current_state', decision: 'keep', required: true, public_label: 'Record identity', value_state: false }),
  Object.freeze({ field_id: 'mechanics.reserve_component_detail', current_surface: 'Reserve components list', source: 'reserve_components.*', destination_section: 'how_asset_works', decision: 'move', required: true, public_label: 'Reserve components', value_state: true }),
  Object.freeze({ field_id: 'history.model_change_detail', current_surface: 'Historical model changes list', source: 'events filtered by model-change semantics', destination_section: 'history', decision: 'consolidate', required: true, public_label: 'Model changes', value_state: true }),
  Object.freeze({ field_id: 'organizations.relationship_disclaimer', current_surface: 'Organizations and roles note', source: 'approved interface copy', destination_section: 'organizations_control', decision: 'keep', required: true, public_label: 'Relationship scope note', value_state: false }),
  Object.freeze({ field_id: 'further_reading.related_registry', current_surface: 'Related pages cards', source: 'stablecoins, primary organization, events', destination_section: 'corrections_further_reading', decision: 'move', required: true, public_label: 'Related registry pages', value_state: false }),
  Object.freeze({ field_id: 'further_reading.guides', current_surface: 'RelatedGuides component', source: 'stablecoinGuideLinks', destination_section: 'corrections_further_reading', decision: 'move', required: true, public_label: 'Related guides', value_state: false }),
  Object.freeze({ field_id: 'further_reading.corrections', current_surface: 'global Corrections utility', source: '/contact/', destination_section: 'corrections_further_reading', decision: 'add_contextual_link', required: true, public_label: 'Submit a correction', value_state: false }),
  Object.freeze({ field_id: 'further_reading.methodology', current_surface: 'global Project navigation', source: '/methodology/', destination_section: 'corrections_further_reading', decision: 'add_contextual_link', required: true, public_label: 'Methodology', value_state: false }),
  Object.freeze({ field_id: 'further_reading.machine_readable', current_surface: 'footer data access', source: '/data/manifest.json and /version.json', destination_section: 'corrections_further_reading', decision: 'add_contextual_link', required: true, public_label: 'Machine-readable data', value_state: false })
]);

export const dossierPolicies = Object.freeze({
  implementation_deferred: true,
  implementation_starts_at_pr: 23,
  route_changes_allowed: false,
  evidence_section_required: true,
  known_unknowns_section_required: true,
  corrections_section_required: true,
  all_relationships_required: true,
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
    'reliability'
  ])
});
