import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import {
  changeEntrySchema,
  changeTypes,
  dateSignalPolicy,
  historyPolicies,
  legacyUpdatePolicy,
  placementRules
} from '../config/change-history-contract.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const outputPath = path.join(root, 'data/generated/change-history-audit.json');
const baseline = loadRegistryV2Baseline(root);

function readRows(relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  const rows = Array.isArray(value) ? value : value.records;
  if (!Array.isArray(rows)) throw new Error(`${relativePath}: expected an array or records array`);
  return rows;
}

const unique = (values) => [...new Set(values.filter((value) => typeof value === 'string' && value.length > 0))].sort();
const countBy = (values) => Object.fromEntries(unique(values).map((value) => [value, values.filter((item) => item === value).length]));
const datePattern = /^\d{4}-\d{2}-\d{2}(?:T.*)?$/;

const legacyUpdates = readRows(legacyUpdatePolicy.source_file);
const updateCopySource = fs.readFileSync(path.join(root, 'src/data/updatePublicCopy.ts'), 'utf8');
const publicCopyIds = unique([...updateCopySource.matchAll(/\b(sog_update_[a-zA-Z0-9_]+)\s*:/g)].map((match) => match[1]));
const legacyIds = legacyUpdates.map((row) => row.id);
const duplicateLegacyIds = unique(legacyIds.filter((id, index) => legacyIds.indexOf(id) !== index));
const legacyCategories = legacyUpdates.map((row) => row.category);
const legacyMissingPublicCopy = legacyIds.filter((id) => !publicCopyIds.includes(id)).sort();
const publicCopyWithoutLegacy = publicCopyIds.filter((id) => !legacyIds.includes(id)).sort();
const targetFields = [...changeEntrySchema.required_fields, ...changeEntrySchema.optional_fields];
const legacyStructuredCoverage = Object.fromEntries(targetFields.map((field) => [
  field,
  legacyUpdates.filter((row) => Object.prototype.hasOwnProperty.call(row, field)).length
]));
const targetReadyLegacyEntries = legacyUpdates.filter((row) => changeEntrySchema.required_fields.every((field) => Object.prototype.hasOwnProperty.call(row, field)));

const signalDefinitions = [
  { group: 'stablecoins', fields: ['launch_date', 'discontinued_date', 'last_verified_at'], review: new Set(['last_verified_at']) },
  { group: 'organizations', fields: ['last_verified_at'], review: new Set(['last_verified_at']) },
  { group: 'relationships', fields: ['start_date', 'end_date'], review: new Set() },
  { group: 'events', fields: ['event_date', 'recovery_date'], review: new Set() },
  { group: 'evidence', fields: ['published_at', 'accessed_at'], review: new Set(['accessed_at']), sourceMetadata: new Set(['published_at']) },
  { group: 'reserve_reports', fields: ['report_date', 'as_of_date', 'published_at'], review: new Set(), sourceMetadata: new Set(['published_at']) },
  { group: 'known_unknowns', fields: ['last_checked_at'], review: new Set(['last_checked_at']) },
  { group: 'regulatory_notes', fields: ['note_date'], review: new Set() },
  { group: 'deployments', fields: ['launch_date', 'end_date', 'last_verified_at'], review: new Set(['last_verified_at']) }
];

const dateSignals = [];
const scannedFiles = new Set();
for (const definition of signalDefinitions) {
  for (const relativePath of baseline.data_groups?.[definition.group] ?? []) {
    const fileKey = `${definition.group}|${relativePath}`;
    if (scannedFiles.has(fileKey)) continue;
    scannedFiles.add(fileKey);
    const rows = readRows(relativePath);
    for (const row of rows) {
      for (const field of definition.fields) {
        const value = row[field];
        if (typeof value !== 'string' || value.length === 0) continue;
        dateSignals.push({
          group: definition.group,
          file: relativePath,
          record_id: row.id ?? null,
          field,
          value,
          valid_date_shape: datePattern.test(value),
          classification: definition.review.has(field)
            ? 'review_only'
            : definition.sourceMetadata?.has(field)
              ? 'source_metadata'
              : 'historical_or_effective'
        });
      }
    }
  }
}

const currentPageSource = fs.readFileSync(path.join(root, 'src/pages/updates/index.astro'), 'utf8');
const updateFeedConfig = JSON.parse(fs.readFileSync(path.join(root, 'config/update-feed-v1.json'), 'utf8'));
const updateFeedBuilderSource = fs.readFileSync(path.join(root, 'scripts/updates/build-update-feed-pr350.mjs'), 'utf8');
const currentPageSignals = {
  presentation_model: currentPageSource.includes('data-update-feed-page') ? 'filterable_publication_feed' : 'unknown',
  uses_registry_updates: updateFeedConfig.source_file === legacyUpdatePolicy.source_file
    && updateFeedBuilderSource.includes("const UPDATES_PATH = 'data/registry-updates.json'"),
  uses_publication_feed_projection: currentPageSource.includes('getPublicUpdateFeed'),
  orders_by_publication_date: updateFeedConfig.ordering === 'publication_date_desc_then_update_id',
  exposes_legacy_category_filter: currentPageSource.includes('data-update-feed-filter-id="category"'),
  uses_public_copy_overlay: currentPageSource.includes('updatePublicCopy'),
  publication_subject_boundary_visible: currentPageSource.includes('Two timelines, two different questions')
    && currentPageSource.includes('Open Change Timeline'),
  timeline_items_excluded: updateFeedConfig.semantics?.timeline_items_are_feed_items === false,
  historical_subject_dates_excluded: updateFeedConfig.semantics?.historical_subject_dates_are_feed_dates === false,
  machine_feed_endpoint: updateFeedConfig.source_endpoint,
  exposes_before_after: currentPageSource.includes('data-change-before') || currentPageSource.includes('data-change-after'),
  exposes_affected_records: currentPageSource.includes('data-change-affected-records'),
  exposes_evidence: currentPageSource.includes('data-change-evidence')
};

const audit = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  implementation_boundary: {
    specification_only: historyPolicies.implementation_deferred,
    implementation_starts_at_pr: historyPolicies.implementation_starts_at_pr,
    route_changes_allowed: historyPolicies.route_changes_allowed
  },
  totals: {
    approved_change_types: changeTypes.length,
    legacy_update_entries: legacyUpdates.length,
    legacy_categories: unique(legacyCategories).length,
    duplicate_legacy_ids: duplicateLegacyIds.length,
    legacy_public_copy_overrides: publicCopyIds.length,
    legacy_missing_public_copy: legacyMissingPublicCopy.length,
    public_copy_without_legacy: publicCopyWithoutLegacy.length,
    target_ready_legacy_entries: targetReadyLegacyEntries.length,
    scanned_date_signals: dateSignals.length,
    review_only_date_signals: dateSignals.filter((item) => item.classification === 'review_only').length,
    source_metadata_date_signals: dateSignals.filter((item) => item.classification === 'source_metadata').length,
    historical_or_effective_date_signals: dateSignals.filter((item) => item.classification === 'historical_or_effective').length,
    invalid_date_shapes: dateSignals.filter((item) => !item.valid_date_shape).length,
    placement_surfaces: placementRules.length
  },
  legacy_updates: {
    source_file: legacyUpdatePolicy.source_file,
    categories: countBy(legacyCategories),
    entries: legacyUpdates,
    duplicate_ids: duplicateLegacyIds,
    public_copy_ids: publicCopyIds,
    missing_public_copy: legacyMissingPublicCopy,
    public_copy_without_legacy: publicCopyWithoutLegacy,
    structured_field_coverage: legacyStructuredCoverage,
    target_ready_ids: targetReadyLegacyEntries.map((row) => row.id)
  },
  current_updates_page: currentPageSignals,
  date_signal_inventory: {
    classifications: countBy(dateSignals.map((item) => item.classification)),
    groups: countBy(dateSignals.map((item) => item.group)),
    fields: countBy(dateSignals.map((item) => `${item.group}.${item.field}`)),
    signals: dateSignals
  },
  target_contract: {
    change_types: changeTypes,
    entry_schema: changeEntrySchema,
    placement_rules: placementRules,
    date_signal_policy: dateSignalPolicy,
    legacy_update_policy: legacyUpdatePolicy,
    history_policies: historyPolicies
  },
  contract_digest: `sha256:${createHash('sha256').update(JSON.stringify({ changeTypes, changeEntrySchema, placementRules, dateSignalPolicy, legacyUpdatePolicy, historyPolicies })).digest('hex')}`
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(audit, null, 2)}\n`);
console.log(JSON.stringify(audit.totals, null, 2));
