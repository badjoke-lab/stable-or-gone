export const publicEvidenceCategories = [
  { value: 'official_statement_or_announcement', public_label: 'Official statement or announcement', sort_order: 10 },
  { value: 'official_documentation_or_product', public_label: 'Official documentation or product page', sort_order: 20 },
  { value: 'governance_record', public_label: 'Governance record', sort_order: 30 },
  { value: 'legal_or_terms', public_label: 'Legal terms or disclosure', sort_order: 40 },
  { value: 'regulatory_or_court', public_label: 'Regulatory or court record', sort_order: 50 },
  { value: 'reserve_or_assurance_report', public_label: 'Reserve, assurance, or financial report', sort_order: 60 },
  { value: 'technical_or_repository', public_label: 'Technical documentation or repository', sort_order: 70 },
  { value: 'onchain_record_or_explorer', public_label: 'On-chain record or explorer', sort_order: 80 },
  { value: 'independent_news_or_analysis', public_label: 'Independent news or analysis', sort_order: 90 },
  { value: 'research_or_security_report', public_label: 'Research or security report', sort_order: 100 },
  { value: 'archive_or_historical_record', public_label: 'Archive or historical record', sort_order: 110 },
  { value: 'data_or_market_reference', public_label: 'Data or market reference', sort_order: 120 },
  { value: 'other_or_unknown', public_label: 'Other or not yet classified', sort_order: 130 }
];

const sourceTypesByCategory = {
  official_statement_or_announcement: [
    'exchange_notice', 'issuer_contract_event', 'issuer_statement', 'official_announcement', 'official_blog',
    'official_ecosystem_announcement', 'official_ecosystem_publication', 'official_incident_report',
    'official_launch_announcement', 'official_postmortem', 'official_protocol_announcement',
    'official_protocol_milestone', 'official_protocol_update', 'official_social',
    'official_social_statement', 'official_statement', 'protocol_postmortem'
  ],
  official_documentation_or_product: [
    'developer_docs', 'issuer_or_network_page', 'issuer_or_product_page', 'issuer_page',
    'issuer_support', 'official_application', 'official_developer_documentation', 'official_documentation',
    'official_product_page', 'official_protocol_guide', 'official_protocol_roadmap', 'official_website',
    'product_page', 'protocol_app', 'protocol_docs', 'protocol_or_reserve_page', 'protocol_page'
  ],
  governance_record: [
    'governance_proposal', 'governance_reference', 'official_governance_documentation',
    'official_governance_proposal', 'reserve_or_governance_page'
  ],
  legal_or_terms: [
    'legal_terms', 'network_terms_or_docs', 'official_legal_documentation', 'official_terms',
    'risk_disclosure', 'terms_of_service'
  ],
  regulatory_or_court: ['regulator_register', 'regulatory_notice', 'regulatory_source'],
  reserve_or_assurance_report: [
    'official_attestation', 'official_report', 'reserve_report', 'reserve_report_index',
    'reserve_transparency_page'
  ],
  technical_or_repository: [
    'code_repository', 'historical_official_document_reference', 'official_repository', 'official_whitepaper',
    'repository', 'repository_index', 'whitepaper'
  ],
  onchain_record_or_explorer: [
    'blockchain_explorer', 'explorer', 'onchain_contract', 'onchain_explorer', 'onchain_transaction'
  ],
  independent_news_or_analysis: ['news_analysis', 'news_article', 'news_report', 'wire_service'],
  research_or_security_report: [
    'investigator_report', 'research_paper', 'research_report', 'security_analysis', 'security_audit'
  ],
  archive_or_historical_record: [
    'archive_capture', 'archived_official_site', 'contemporaneous_record', 'registry_snapshot',
    'website_state_observation'
  ],
  data_or_market_reference: [
    'analytics_dashboard', 'database_reference', 'market_data_page', 'market_reference'
  ],
  other_or_unknown: []
};

export const evidenceSourceTypeCategoryMap = Object.fromEntries(
  Object.entries(sourceTypesByCategory).flatMap(([category, values]) => values.map((value) => [value, category]))
);

export const evidenceProvenances = [
  { value: 'subject_controlled', public_label: 'Subject-controlled source', sort_order: 10 },
  { value: 'government_or_legal', public_label: 'Government, regulator, or legal source', sort_order: 20 },
  { value: 'assurance_or_financial_report', public_label: 'Assurance or financial-report source', sort_order: 30 },
  { value: 'technical_primary', public_label: 'Technical primary source', sort_order: 40 },
  { value: 'governance_primary', public_label: 'Governance primary source', sort_order: 50 },
  { value: 'independent_third_party', public_label: 'Independent third-party source', sort_order: 60 },
  { value: 'archive_capture', public_label: 'Archive capture', sort_order: 70 },
  { value: 'data_aggregator', public_label: 'Data or market aggregator', sort_order: 80 },
  { value: 'unknown', public_label: 'Provenance not yet resolved', sort_order: 90 }
];

const sourceTypesByProvenance = {
  subject_controlled: [
    'developer_docs', 'exchange_notice', 'historical_official_document_reference', 'issuer_contract_event',
    'issuer_or_network_page', 'issuer_or_product_page', 'issuer_page', 'issuer_statement', 'issuer_support',
    'legal_terms', 'network_terms_or_docs', 'official_announcement', 'official_application', 'official_blog',
    'official_developer_documentation', 'official_documentation', 'official_ecosystem_announcement',
    'official_ecosystem_publication', 'official_incident_report', 'official_launch_announcement',
    'official_legal_documentation', 'official_postmortem', 'official_product_page',
    'official_protocol_announcement', 'official_protocol_guide', 'official_protocol_milestone',
    'official_protocol_roadmap', 'official_protocol_update', 'official_social', 'official_social_statement',
    'official_statement', 'official_terms', 'official_website', 'official_whitepaper', 'product_page',
    'protocol_app', 'protocol_docs', 'protocol_or_reserve_page', 'protocol_page', 'protocol_postmortem',
    'reserve_or_governance_page', 'reserve_transparency_page', 'risk_disclosure', 'terms_of_service',
    'website_state_observation', 'whitepaper'
  ],
  government_or_legal: ['regulator_register', 'regulatory_notice', 'regulatory_source'],
  assurance_or_financial_report: [
    'official_attestation', 'official_report', 'reserve_report', 'reserve_report_index'
  ],
  technical_primary: [
    'blockchain_explorer', 'code_repository', 'explorer', 'official_repository', 'onchain_contract',
    'onchain_explorer', 'onchain_transaction', 'repository', 'repository_index'
  ],
  governance_primary: [
    'governance_proposal', 'governance_reference', 'official_governance_documentation',
    'official_governance_proposal'
  ],
  independent_third_party: [
    'investigator_report', 'news_analysis', 'news_article', 'news_report', 'research_paper',
    'research_report', 'security_analysis', 'security_audit', 'wire_service'
  ],
  archive_capture: ['archive_capture', 'archived_official_site', 'contemporaneous_record', 'registry_snapshot'],
  data_aggregator: ['analytics_dashboard', 'database_reference', 'market_data_page', 'market_reference'],
  unknown: []
};

export const evidenceSourceTypeProvenanceMap = Object.fromEntries(
  Object.entries(sourceTypesByProvenance).flatMap(([provenance, values]) => values.map((value) => [value, provenance]))
);

export const evidencePrimaryStates = [
  { value: 'primary', public_label: 'Primary source', sort_order: 10 },
  { value: 'secondary', public_label: 'Secondary source', sort_order: 20 },
  { value: 'mixed_or_contextual', public_label: 'Mixed or contextual source', sort_order: 30 },
  { value: 'unknown', public_label: 'Primary status not yet resolved', sort_order: 40 }
];

export const evidenceReliabilities = [
  { value: 'high', public_label: 'High', sort_order: 10 },
  { value: 'medium', public_label: 'Medium', sort_order: 20 },
  { value: 'low', public_label: 'Low', sort_order: 30 },
  { value: 'unknown', public_label: 'Unknown', sort_order: 40 }
];

export const evidenceArchiveStates = [
  { value: 'direct_snapshot', public_label: 'Direct archived snapshot', sort_order: 10 },
  { value: 'archive_index', public_label: 'Archive index or wildcard', sort_order: 20 },
  { value: 'other_archive', public_label: 'Other archive reference', sort_order: 30 },
  { value: 'not_recorded', public_label: 'No archive recorded', sort_order: 40 }
];

export const pollutedReliabilityValues = new Set([
  'primary', 'explorer', 'primary_repository', 'primary_interface',
  'primary_or_ecosystem_dashboard', 'primary_repository_index'
]);

export function getPublicEvidenceCategory(sourceType) {
  return evidenceSourceTypeCategoryMap[sourceType] ?? 'other_or_unknown';
}

export function getPublicEvidenceCategoryLabel(value) {
  return publicEvidenceCategories.find((entry) => entry.value === value)?.public_label ?? 'Other or not yet classified';
}

export function getEvidenceProvenance(sourceType, explicitProvenance) {
  if (explicitProvenance && evidenceProvenances.some((entry) => entry.value === explicitProvenance)) return explicitProvenance;
  return evidenceSourceTypeProvenanceMap[sourceType] ?? 'unknown';
}

export function getEvidenceProvenanceLabel(value) {
  return evidenceProvenances.find((entry) => entry.value === value)?.public_label ?? 'Provenance not yet resolved';
}

export function getEvidencePrimaryState(sourceType, explicitIsPrimary, explicitState) {
  if (explicitState && evidencePrimaryStates.some((entry) => entry.value === explicitState)) return explicitState;
  if (explicitIsPrimary === true) return 'primary';
  if (explicitIsPrimary === false) return 'secondary';
  const provenance = getEvidenceProvenance(sourceType);
  if (['subject_controlled', 'government_or_legal', 'assurance_or_financial_report', 'technical_primary', 'governance_primary', 'archive_capture'].includes(provenance)) return 'primary';
  if (['independent_third_party', 'data_aggregator'].includes(provenance)) return 'secondary';
  return 'unknown';
}

export function getEvidencePrimaryStateLabel(value) {
  return evidencePrimaryStates.find((entry) => entry.value === value)?.public_label ?? 'Primary status not yet resolved';
}

export function getEvidenceReliability(rawReliability) {
  if (['high', 'medium', 'low', 'unknown'].includes(rawReliability)) return rawReliability;
  if (pollutedReliabilityValues.has(rawReliability)) return 'unknown';
  return 'unknown';
}

export function getEvidenceReliabilityLabel(value) {
  return evidenceReliabilities.find((entry) => entry.value === value)?.public_label ?? 'Unknown';
}

export function getEvidenceArchiveState(archivedUrl) {
  if (!archivedUrl) return 'not_recorded';
  if (/web\.archive\.org\/web\/\*/i.test(archivedUrl)) return 'archive_index';
  if (/web\.archive\.org\/web\/\d{8,14}/i.test(archivedUrl)) return 'direct_snapshot';
  return 'other_archive';
}

export function getEvidenceArchiveStateLabel(value) {
  return evidenceArchiveStates.find((entry) => entry.value === value)?.public_label ?? 'No archive recorded';
}
