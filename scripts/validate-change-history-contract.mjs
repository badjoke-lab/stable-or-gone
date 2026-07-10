import fs from 'node:fs';
import path from 'node:path';
import {
  changeEntrySchema,
  changeTypes,
  dateSignalPolicy,
  historyPolicies,
  legacyUpdatePolicy,
  placementRules
} from '../config/change-history-contract.mjs';

const root = process.cwd();
const auditPath = path.join(root, 'data/generated/change-history-audit.json');
const validationPath = path.join(root, 'data/generated/change-history-validation.json');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const unique = (values) => new Set(values).size === values.length;

assert(fs.existsSync(auditPath), 'change history audit is missing');
if (!fs.existsSync(auditPath)) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
const expectedTypes = [
  'status_change',
  'event_added',
  'evidence_added',
  'relationship_change',
  'reserve_redemption_change',
  'known_unknown_added',
  'known_unknown_resolved',
  'copy_only_correction'
];

assert(audit.schema_version === '1.0', 'audit schema version must be 1.0');
assert(changeTypes.length === 8, 'exactly eight approved change types are required');
assert(JSON.stringify(changeTypes.map((entry) => entry.id)) === JSON.stringify(expectedTypes), 'approved change type order or identity changed');
assert(unique(changeTypes.map((entry) => entry.id)), 'change type IDs must be unique');
assert(audit.totals?.approved_change_types === 8, 'audit must contain eight approved change types');

for (const entry of changeTypes) {
  assert(typeof entry.label === 'string' && entry.label.length > 0, `${entry.id}: public label is missing`);
  assert(typeof entry.underlying_subject_change === 'boolean', `${entry.id}: underlying-subject-change state is missing`);
  assert(typeof entry.requires_before_after === 'boolean', `${entry.id}: before/after requirement is missing`);
  assert(typeof entry.requires_evidence === 'boolean', `${entry.id}: evidence requirement is missing`);
  assert(typeof entry.effective_date === 'string' && entry.effective_date.length > 0, `${entry.id}: effective-date rule is missing`);
  assert(Array.isArray(entry.allowed_record_kinds) && entry.allowed_record_kinds.length > 0, `${entry.id}: allowed record kinds are missing`);
  assert(unique([...entry.allowed_record_kinds]), `${entry.id}: allowed record kinds must be unique`);
}

const copyCorrection = changeTypes.find((entry) => entry.id === 'copy_only_correction');
assert(copyCorrection?.underlying_subject_change === false, 'copy-only correction must not imply an underlying subject change');
assert(copyCorrection?.requires_before_after === true, 'copy-only correction must preserve old and new public wording');
assert(copyCorrection?.requires_evidence === false, 'copy-only correction must not fabricate an evidence requirement');
assert(copyCorrection?.canonical_changed_fields_must_be_empty === true, 'copy-only correction must not claim canonical fact changes');
const unknownResolution = changeTypes.find((entry) => entry.id === 'known_unknown_resolved');
assert(unknownResolution?.requires_prior_unknown_id === true, 'known-unknown resolution must reference the prior unknown');
assert(unknownResolution?.requires_evidence === true, 'known-unknown resolution must require evidence');

assert(changeEntrySchema.required_fields.length === 12, 'change entry schema must contain twelve required fields');
assert(unique([...changeEntrySchema.required_fields]), 'required change fields must be unique');
assert(unique([...changeEntrySchema.optional_fields]), 'optional change fields must be unique');
assert(changeEntrySchema.effective_date_states.includes('not_recorded'), 'effective date must support explicit not-recorded state');
assert(changeEntrySchema.effective_date_states.includes('not_applicable'), 'effective date must support explicit not-applicable state');
assert(changeEntrySchema.before_after_value_states.length === 8, 'before/after values must preserve the eight-state model');
assert(changeEntrySchema.affected_record_kinds.includes('evidence_source_identity'), 'affected records must include source identity');
assert(changeEntrySchema.affected_record_kinds.includes('evidence_relation'), 'affected records must include evidence relation');

assert(audit.totals?.legacy_update_entries === 16, `expected 16 legacy update entries, found ${audit.totals?.legacy_update_entries}`);
assert(audit.totals?.legacy_categories === 4, `expected four legacy categories, found ${audit.totals?.legacy_categories}`);
assert(audit.totals?.duplicate_legacy_ids === 0, 'legacy update IDs must be unique');
assert(audit.totals?.legacy_public_copy_overrides === 16, 'all 16 legacy updates must retain public-copy overlays');
assert(audit.totals?.legacy_missing_public_copy === 0, 'legacy update public-copy coverage must be complete');
assert(audit.totals?.public_copy_without_legacy === 0, 'public-copy overlays must not point to missing legacy updates');
assert(audit.totals?.target_ready_legacy_entries === 0, 'legacy updates must not be silently treated as structured change entries');
assert(JSON.stringify(audit.legacy_updates?.categories) === JSON.stringify({ content: 4, data: 9, foundation: 1, ui: 2 }), 'legacy category inventory changed unexpectedly');
assert((audit.legacy_updates?.duplicate_ids ?? []).length === 0, 'legacy duplicate ID list must be empty');
assert((audit.legacy_updates?.missing_public_copy ?? []).length === 0, 'legacy missing-copy list must be empty');
assert((audit.legacy_updates?.target_ready_ids ?? []).length === 0, 'legacy entries require explicit manual migration');

assert(audit.current_updates_page?.presentation_model === 'filterable_publication_feed', 'Updates page must use the reviewed publication-feed presentation model');
assert(audit.current_updates_page?.uses_registry_updates === true, 'Update Feed must remain bound to registry-updates.json');
assert(audit.current_updates_page?.uses_publication_feed_projection === true, 'Updates page must consume the deterministic publication-feed projection');
assert(audit.current_updates_page?.orders_by_publication_date === true, 'Update Feed must preserve publication-date ordering');
assert(audit.current_updates_page?.exposes_legacy_category_filter === true, 'legacy publication categories must remain visibly filterable without becoming change types');
assert(audit.current_updates_page?.uses_public_copy_overlay === true, 'current update public-copy overlay must remain in use');
assert(audit.current_updates_page?.publication_subject_boundary_visible === true, 'Updates page must visibly distinguish publication history from historical subject change');
assert(audit.current_updates_page?.timeline_items_excluded === true, 'Timeline items must remain excluded from the publication feed');
assert(audit.current_updates_page?.historical_subject_dates_excluded === true, 'historical subject dates must not become feed publication dates');
assert(audit.current_updates_page?.machine_feed_endpoint === '/data/update-feed.json', 'Update Feed machine endpoint mismatch');
assert(audit.current_updates_page?.exposes_before_after === false, 'publication feed unexpectedly exposes structured before/after fields; re-audit required');
assert(audit.current_updates_page?.exposes_affected_records === false, 'publication feed unexpectedly exposes structured affected-record fields; re-audit required');
assert(audit.current_updates_page?.exposes_evidence === false, 'publication feed unexpectedly exposes structured evidence linkage; re-audit required');

assert(audit.totals?.scanned_date_signals > 0, 'date signal inventory must not be empty');
assert(audit.totals?.review_only_date_signals > 0, 'review-only date signals must be inventoried');
assert(audit.totals?.historical_or_effective_date_signals > 0, 'historical or effective date signals must be inventoried');
assert(audit.totals?.source_metadata_date_signals > 0, 'source metadata dates must be inventoried');
assert(audit.totals?.invalid_date_shapes === 0, 'canonical date signals contain invalid date shapes');
assert(dateSignalPolicy.review_timestamp_is_not_change === true, 'review timestamp must not create a change entry');
assert(dateSignalPolicy.build_timestamp_is_not_change === true, 'build timestamp must not create a change entry');
assert(dateSignalPolicy.publication_date_is_source_metadata_not_change_date === true, 'source publication date must remain source metadata');
assert(dateSignalPolicy.review_only_dates.length === 4, 'four review-only date families must remain explicit');
assert(dateSignalPolicy.excluded_build_dates.length === 3, 'three build-generated date families must remain excluded');

assert(placementRules.length === 4, 'change history placement must define four public surfaces');
assert(unique(placementRules.map((rule) => rule.surface)), 'placement surface IDs must be unique');
assert(placementRules.find((rule) => rule.surface === 'updates_index')?.change_types.length === 8, 'Updates index must show all approved change types');
assert(placementRules.find((rule) => rule.surface === 'stablecoin_record')?.change_types.length === 8, 'stablecoin records must support all approved change types');
for (const rule of placementRules) {
  assert(typeof rule.route === 'string' && rule.route.startsWith('/'), `${rule.surface}: route is invalid`);
  assert(rule.change_types.every((id) => expectedTypes.includes(id)), `${rule.surface}: unknown change type placement`);
}

for (const [key, value] of Object.entries(legacyUpdatePolicy)) {
  if (typeof value === 'boolean') assert(value === true, `legacy update policy ${key} must remain true`);
}
assert(legacyUpdatePolicy.source_file === 'data/registry-updates.json', 'legacy update source file changed unexpectedly');
for (const [key, value] of Object.entries(historyPolicies)) {
  if (typeof value === 'boolean' && key !== 'route_changes_allowed') assert(value === true, `history policy ${key} must remain true`);
}
assert(historyPolicies.implementation_deferred === true, 'PR 20 must remain specification-only');
assert(historyPolicies.implementation_starts_at_pr === 34, 'meaningful Updates implementation must remain deferred to PR 34');
assert(historyPolicies.route_changes_allowed === false, 'PR 20 must not change routes');

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    approved_change_types: changeTypes.length,
    required_entry_fields: changeEntrySchema.required_fields.length,
    legacy_update_entries: audit.totals.legacy_update_entries,
    date_signals: audit.totals.scanned_date_signals,
    review_only_date_signals: audit.totals.review_only_date_signals,
    placement_surfaces: placementRules.length,
    failures: failures.length
  },
  implemented_navigation: audit.current_updates_page,
  failures
};

fs.writeFileSync(validationPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(validation, null, 2));
