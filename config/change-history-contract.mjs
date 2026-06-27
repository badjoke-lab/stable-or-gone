const type = (id, label, options) => Object.freeze({ id, label, ...options });

export const changeTypes = Object.freeze([
  type('status_change', 'Status change', {
    underlying_subject_change: true,
    requires_before_after: true,
    requires_evidence: true,
    effective_date: 'required_or_explicit_unknown',
    allowed_record_kinds: Object.freeze(['stablecoin'])
  }),
  type('event_added', 'Event added', {
    underlying_subject_change: false,
    requires_before_after: false,
    requires_evidence: true,
    effective_date: 'from_event_record',
    allowed_record_kinds: Object.freeze(['stablecoin', 'organization', 'event'])
  }),
  type('evidence_added', 'Evidence added', {
    underlying_subject_change: false,
    requires_before_after: false,
    requires_evidence: true,
    effective_date: 'not_applicable',
    allowed_record_kinds: Object.freeze(['stablecoin', 'organization', 'event', 'evidence_source_identity'])
  }),
  type('relationship_change', 'Relationship change', {
    underlying_subject_change: true,
    requires_before_after: true,
    requires_evidence: true,
    effective_date: 'required_or_explicit_unknown',
    allowed_record_kinds: Object.freeze(['stablecoin', 'organization', 'relationship'])
  }),
  type('reserve_redemption_change', 'Reserve or redemption change', {
    underlying_subject_change: true,
    requires_before_after: true,
    requires_evidence: true,
    effective_date: 'required_or_explicit_unknown',
    allowed_record_kinds: Object.freeze(['stablecoin', 'organization', 'reserve_report', 'redemption_profile'])
  }),
  type('known_unknown_added', 'Known unknown added', {
    underlying_subject_change: false,
    requires_before_after: false,
    requires_evidence: true,
    effective_date: 'not_applicable',
    allowed_record_kinds: Object.freeze(['stablecoin', 'organization', 'event', 'known_unknown'])
  }),
  type('known_unknown_resolved', 'Known unknown resolved', {
    underlying_subject_change: false,
    requires_before_after: true,
    requires_evidence: true,
    requires_prior_unknown_id: true,
    effective_date: 'required_or_explicit_unknown',
    allowed_record_kinds: Object.freeze(['stablecoin', 'organization', 'event', 'known_unknown'])
  }),
  type('copy_only_correction', 'Copy-only correction', {
    underlying_subject_change: false,
    requires_before_after: true,
    requires_evidence: false,
    canonical_changed_fields_must_be_empty: true,
    effective_date: 'not_applicable',
    allowed_record_kinds: Object.freeze(['stablecoin', 'organization', 'event', 'guide', 'project_page'])
  })
]);

export const changeEntrySchema = Object.freeze({
  identity_pattern: '^sog_chg_[0-9]{4}_[0-9]{2}_[0-9]{2}_[a-z0-9_]+$',
  required_fields: Object.freeze([
    'id',
    'change_type',
    'recorded_at',
    'effective_date_state',
    'affected_records',
    'changed_fields',
    'before',
    'after',
    'evidence_ids',
    'summary',
    'related_paths',
    'source_prs'
  ]),
  optional_fields: Object.freeze([
    'effective_at',
    'prior_unknown_id',
    'correction_of',
    'supersedes',
    'notes'
  ]),
  affected_record_kinds: Object.freeze([
    'stablecoin',
    'organization',
    'relationship',
    'event',
    'evidence_source_identity',
    'evidence_relation',
    'reserve_report',
    'redemption_profile',
    'known_unknown',
    'deployment',
    'guide',
    'project_page'
  ]),
  effective_date_states: Object.freeze(['known', 'not_recorded', 'not_applicable', 'disputed', 'approximate']),
  before_after_value_states: Object.freeze([
    'known',
    'unknown_after_review',
    'not_recorded',
    'not_applicable',
    'not_public',
    'unverified',
    'disputed',
    'approximate'
  ])
});

export const placementRules = Object.freeze([
  Object.freeze({ surface: 'updates_index', route: '/updates/', change_types: Object.freeze(changeTypes.map((entry) => entry.id)), presentation: 'complete_public_change_feed' }),
  Object.freeze({ surface: 'stablecoin_record', route: '/stablecoin/{slug}/', change_types: Object.freeze(changeTypes.map((entry) => entry.id)), presentation: 'affected_record_history' }),
  Object.freeze({ surface: 'organization_record', route: '/issuer/{slug}/', change_types: Object.freeze(['event_added', 'evidence_added', 'relationship_change', 'reserve_redemption_change', 'known_unknown_added', 'known_unknown_resolved', 'copy_only_correction']), presentation: 'affected_record_history' }),
  Object.freeze({ surface: 'event_record', route: '/event/{id}/', change_types: Object.freeze(['event_added', 'evidence_added', 'known_unknown_added', 'known_unknown_resolved', 'copy_only_correction']), presentation: 'affected_record_history' })
]);

export const dateSignalPolicy = Object.freeze({
  meaningful_change_dates: Object.freeze([
    'recorded_at',
    'effective_at',
    'event_date',
    'relationship_start_date',
    'relationship_end_date',
    'reserve_report_date',
    'regulatory_note_date'
  ]),
  review_only_dates: Object.freeze([
    'stablecoin.last_verified_at',
    'organization.last_verified_at',
    'evidence.accessed_at',
    'known_unknown.last_checked_at'
  ]),
  excluded_build_dates: Object.freeze([
    'build.generated_at',
    'manifest.generated_at',
    'version.generated_at'
  ]),
  review_timestamp_is_not_change: true,
  build_timestamp_is_not_change: true,
  publication_date_is_source_metadata_not_change_date: true
});

export const legacyUpdatePolicy = Object.freeze({
  source_file: 'data/registry-updates.json',
  preserve_all_entries: true,
  automatic_type_inference_prohibited: true,
  manual_migration_required: true,
  legacy_categories_are_not_change_types: true,
  public_copy_overlay_preserved: true
});

export const historyPolicies = Object.freeze({
  append_only_public_history: true,
  historical_entries_are_not_overwritten: true,
  corrections_reference_prior_entries: true,
  superseded_entries_remain_visible: true,
  before_after_values_preserve_value_states: true,
  source_identity_and_evidence_relation_remain_distinct: true,
  copy_only_correction_does_not_imply_fact_change: true,
  unknown_resolution_requires_prior_unknown: true,
  unknown_resolution_requires_evidence: true,
  implementation_deferred: true,
  implementation_starts_at_pr: 34,
  route_changes_allowed: false
});
