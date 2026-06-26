import fs from 'node:fs';
import path from 'node:path';
import {
  eventStatusEffectCategories,
  eventStatusEffectCategoryMap,
  eventTypeCategoryMap,
  getEventStatusEffectCategory,
  getPublicEventCategory,
  getRecoveryCategory,
  publicEventCategories,
  recoveryCategories
} from '../config/event-taxonomy.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const readText = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

function readRows(relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or { records: [] }`);
}

function countBy(rows, getter) {
  const counts = new Map();
  for (const row of rows) {
    const raw = getter(row);
    const values = Array.isArray(raw) ? raw : [raw];
    for (const value of values) {
      const key = value === null || value === undefined || value === '' ? 'missing' : String(value);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

const baseline = loadRegistryV2Baseline(root);
const events = baseline.data_groups.events.flatMap(readRows);
const eventDetails = baseline.data_groups.event_details.flatMap(readRows);
const detailById = new Map(eventDetails.map((row) => [row.id, row]));
const eventIds = new Set(events.map((row) => row.id));
const detailIds = new Set(eventDetails.map((row) => row.id));
const categoryValues = new Set(publicEventCategories.map((entry) => entry.value));
const statusCategoryValues = new Set(eventStatusEffectCategories.map((entry) => entry.value));
const recoveryValues = new Set(recoveryCategories.map((entry) => entry.value));
const typedDetailFields = [
  'depeg_detail', 'regulatory_detail', 'reserve_change_detail', 'redemption_change_detail',
  'migration_detail', 'issuer_control_detail', 'security_incident_detail', 'oracle_failure_detail',
  'collateral_impairment_detail', 'insolvency_detail', 'governance_change_detail',
  'bridge_or_chain_incident_detail', 'termination_detail', 'launch_detail'
];

check(events.length === 150, `expected 150 events, found ${events.length}`);
check(eventDetails.length === 150, `expected 150 event detail records, found ${eventDetails.length}`);
check(eventIds.size === events.length, 'event ids must be unique');
check(detailIds.size === eventDetails.length, 'event detail ids must be unique');
check([...eventIds].every((id) => detailIds.has(id)), 'every event must have an event detail record');
check([...detailIds].every((id) => eventIds.has(id)), 'every event detail must reference a canonical event');

for (const list of [publicEventCategories, eventStatusEffectCategories, recoveryCategories]) {
  check(new Set(list.map((entry) => entry.value)).size === list.length, 'taxonomy values must be unique');
  check(new Set(list.map((entry) => entry.public_label)).size === list.length, 'taxonomy labels must be unique');
  check(new Set(list.map((entry) => entry.sort_order)).size === list.length, 'taxonomy sort orders must be unique');
  for (const entry of list) {
    check(typeof entry.value === 'string' && entry.value.length > 0, 'taxonomy value is required');
    check(typeof entry.public_label === 'string' && entry.public_label.length > 0, `${entry.value}: public label is required`);
    check(Number.isInteger(entry.sort_order) && entry.sort_order > 0, `${entry.value}: sort order must be a positive integer`);
  }
}

for (const [subtype, category] of Object.entries(eventTypeCategoryMap)) {
  check(categoryValues.has(category), `${subtype}: unknown public event category ${category}`);
}
for (const [rawValue, category] of Object.entries(eventStatusEffectCategoryMap)) {
  check(statusCategoryValues.has(category), `${rawValue}: unknown status-effect category ${category}`);
}

const records = events.map((event) => {
  const detail = detailById.get(event.id) ?? {};
  const merged = { ...event, ...detail };
  const publicCategory = getPublicEventCategory(merged.event_type);
  const statusCategory = getEventStatusEffectCategory(merged.event_status_effect);
  const recoveryCategory = getRecoveryCategory(merged);
  const presentTypedDetails = typedDetailFields.filter((field) => merged[field] !== null && merged[field] !== undefined);

  check(typeof merged.event_type === 'string' && merged.event_type.length > 0, `${merged.id}: event type is missing`);
  check(Boolean(eventTypeCategoryMap[merged.event_type]), `${merged.id}: unmapped event subtype ${merged.event_type}`);
  check(categoryValues.has(publicCategory), `${merged.id}: invalid public event category ${publicCategory}`);
  check(typeof merged.event_detail_kind === 'string' && merged.event_detail_kind.length > 0, `${merged.id}: detail kind is missing`);
  check(typeof merged.event_status_effect === 'string' && merged.event_status_effect.length > 0, `${merged.id}: status effect is missing`);
  check(statusCategory !== 'unknown', `${merged.id}: unmapped status effect ${merged.event_status_effect}`);
  check(recoveryValues.has(recoveryCategory), `${merged.id}: invalid recovery category ${recoveryCategory}`);
  check(typeof merged.impact_level === 'string' && merged.impact_level.length > 0, `${merged.id}: impact level is missing`);

  return {
    id: merged.id,
    event_type: merged.event_type,
    public_event_category: publicCategory,
    event_detail_kind: merged.event_detail_kind,
    event_status_effect: merged.event_status_effect,
    public_status_effect_category: statusCategory,
    recovery_category: recoveryCategory,
    impact_level: merged.impact_level,
    typed_detail_fields: presentTypedDetails,
    typed_detail_coverage: presentTypedDetails.length > 0 ? 'structured' : 'description_and_sources_only'
  };
});

const categoryCounts = countBy(records, (row) => row.public_event_category);
const statusEffectCounts = countBy(records, (row) => row.public_status_effect_category);
const recoveryCounts = countBy(records, (row) => row.recovery_category);
const typedCoverageCounts = countBy(records, (row) => row.typed_detail_coverage);
check(Object.values(categoryCounts).reduce((sum, value) => sum + value, 0) === 150, 'public event category counts must total 150');
check((categoryCounts.other ?? 0) === 0, `current canonical events must not fall into other; found ${categoryCounts.other ?? 0}`);
check(statusEffectCounts.unknown === undefined, 'current canonical status effects must not remain unknown');
check(typedCoverageCounts.structured === 120, `expected 120 structured event details, found ${typedCoverageCounts.structured ?? 0}`);
check(typedCoverageCounts.description_and_sources_only === 30, `expected 30 descriptive-only event details, found ${typedCoverageCounts.description_and_sources_only ?? 0}`);

const indexSource = readText('src/pages/events/index.astro');
check(indexSource.includes('getPublicEventCategoryFilterOptions'), 'event index must use approved public category options');
check(indexSource.includes('resolveEventTaxonomy'), 'event index must resolve normalized taxonomy');
check(indexSource.includes('data-event-category'), 'event index category filter is missing');
check(!indexSource.includes('data-event-type'), 'legacy raw event-type filter remains on event index');
check(indexSource.includes('<th>Category</th>') && indexSource.includes('<th>Subtype</th>'), 'event index must separate category and subtype columns');

const detailPageSource = readText('src/pages/event/[id].astro');
const detailRowsSource = readText('src/components/EventValueStateRows.astro');
const structuredDetailSource = readText('src/components/StructuredEventDetail.astro');
const detailSource = [detailPageSource, detailRowsSource, structuredDetailSource].join('\n');
for (const heading of ['Public event category', 'Canonical event subtype', 'Structured detail kind', 'Effect on stablecoin lifecycle', 'Recovery or reversal']) {
  check(detailSource.includes(`<th>${heading}</th>`), `event detail heading is missing: ${heading}`);
}
check(detailPageSource.includes('resolveEventTaxonomy'), 'event detail must resolve normalized taxonomy');
check(detailPageSource.includes('EventValueStateRows'), 'event detail must use the value-state summary rows component');
check(detailPageSource.includes('StructuredEventDetail'), 'event detail must use the structured detail component');
check(!detailSource.includes('Registry v2 detail overlay'), 'implementation-facing overlay name remains in public copy');
check(structuredDetailSource.includes('Structured event detail'), 'structured event detail section is missing');
check(detailRowsSource.includes('Description and source record only'), 'descriptive-only detail coverage must be explicit');

const stablecoinTimelineSource = readText('src/components/StablecoinEventTimeline.astro');
check(stablecoinTimelineSource.includes('resolveEventTaxonomy'), 'stablecoin timeline must resolve normalized taxonomy');
for (const heading of ['Category', 'Subtype', 'Status effect', 'Recovery']) {
  check(stablecoinTimelineSource.includes(`<th>${heading}</th>`), `stablecoin timeline heading is missing: ${heading}`);
}
const stablecoinDetailSource = readText('src/components/StablecoinDetailView.astro');
check(stablecoinDetailSource.includes('<StablecoinEventTimeline events={events} />'), 'stablecoin detail must use the normalized event timeline component');
check(!stablecoinDetailSource.includes('<th>Type</th><th>Detail kind</th><th>Recovered</th>'), 'legacy stablecoin event timeline remains inline');

const organizationSource = readText('src/pages/issuer/[slug].astro');
check(organizationSource.includes('resolveEventTaxonomy'), 'organization event table must resolve normalized taxonomy');
for (const heading of ['Category', 'Subtype', 'Status effect']) {
  check(organizationSource.includes(`<th>${heading}</th>`), `organization event heading is missing: ${heading}`);
}

const machineSource = readText('src/lib/machine-readable.ts');
for (const key of ['public_event_category', 'canonical_event_subtype', 'event_detail_kind', 'event_status_effect_category', 'event_recovery_category']) {
  check(machineSource.includes(`${key}: countValues`), `machine-readable event breakdown is missing: ${key}`);
}
check(!machineSource.includes('event_type: countValues'), 'machine-readable public breakdown must not use raw event type as its unnamed category axis');

const statsSource = readText('scripts/generate-registry-stats.mjs');
for (const key of ['public_event_categories:', 'canonical_event_subtypes:', 'event_detail_kinds:', 'event_status_effect_categories:', 'event_recovery_categories:', 'event_impact_levels:']) {
  check(statsSource.includes(key), `registry stats event axis is missing: ${key}`);
}

const report = {
  schema_version: '1.0',
  checked_at: new Date().toISOString(),
  events: events.length,
  event_details: eventDetails.length,
  public_categories: publicEventCategories.length,
  public_event_category_counts: categoryCounts,
  canonical_event_subtype_counts: countBy(records, (row) => row.event_type),
  event_detail_kind_counts: countBy(records, (row) => row.event_detail_kind),
  public_status_effect_category_counts: statusEffectCounts,
  recovery_category_counts: recoveryCounts,
  impact_level_counts: countBy(records, (row) => row.impact_level),
  typed_detail_coverage_counts: typedCoverageCounts,
  records,
  failures
};

const reportPath = path.join(root, 'data/generated/event-taxonomy-validation.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length > 0) {
  console.error('Event taxonomy normalization failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({ ...report, ok: true, records: undefined }, null, 2));
