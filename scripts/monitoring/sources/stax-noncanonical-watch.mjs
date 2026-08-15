export const STAX_NONCANONICAL_SOURCES = [
  {
    source_id: '9d-stax-roadmap',
    display_name: '9D Assets StaX roadmap',
    url: 'https://9d-assets.gitbook.io/9d-assets-docs/roadmap',
    allowed_hosts: ['9d-assets.gitbook.io'],
    source_kind: 'prelaunch_stablecoin_overview',
    affected_stablecoin_ids: [],
    affected_organization_ids: [],
    signal_types: ['lifecycle_update'],
    monitoring_scope: {
      kind: 'platform_service_state',
      platform_name: 'StaX',
      platform_legal_entity: null,
      region_scope: 'Global candidate; issuer and legal counterparty unresolved',
      function_scope: [],
      subject_kind: 'prelaunch_stablecoin',
      subject_name: 'StaX',
      symbol: 'StaX',
      launch_state: 'announced_unverified',
      canonical_record: false
    },
    enabled: true
  },
  {
    source_id: '9d-stax-faq',
    display_name: '9D Assets StaX FAQ',
    url: 'https://9d-assets.gitbook.io/9d-assets-docs/faqs',
    allowed_hosts: ['9d-assets.gitbook.io'],
    source_kind: 'prelaunch_stablecoin_overview',
    affected_stablecoin_ids: [],
    affected_organization_ids: [],
    signal_types: ['reserve_update'],
    monitoring_scope: {
      kind: 'platform_service_state',
      platform_name: 'StaX',
      platform_legal_entity: null,
      region_scope: 'Global candidate; issuer and legal counterparty unresolved',
      function_scope: [],
      subject_kind: 'prelaunch_stablecoin',
      subject_name: 'StaX',
      symbol: 'StaX',
      launch_state: 'announced_unverified',
      canonical_record: false
    },
    enabled: true
  }
];

const pendingBaseline = (source) => ({
  source_id: source.source_id,
  source_url: source.url,
  status: 'pending_initial_acceptance',
  accepted_final_url: null,
  body_sha256: null,
  normalized_content_sha256: null,
  content_type: null,
  etag: null,
  last_modified: null,
  accepted_observed_at: null,
  accepted_repository_commit: null,
  accepted_review_reference: null
});

export const STAX_NONCANONICAL_BASELINE_SET = {
  schema_version: '1.0',
  baseline_set_id: 'sog_official_source_baselines_v1',
  normalization_version: 'sog_official_source_normalization_v2',
  updated_at: '2026-08-15T00:00:00.000Z',
  baselines: STAX_NONCANONICAL_SOURCES.map(pendingBaseline),
  policy: {
    human_review_required: true,
    monitoring_write_allowed: false,
    canonical_evidence: false,
    public_output: false,
    automatic_pull_request: false,
    production_publication: false
  }
};
