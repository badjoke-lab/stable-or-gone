import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function readRows(relativePath) {
  const value = readJson(relativePath);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or { records: [] }`);
}

function readGroup(files = []) {
  return files.flatMap(readRows);
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
const foundation = readJson('docs/migration/registry-v3-foundation.json');
const stablecoins = readGroup(baseline.data_groups.stablecoins);
const classifications = readGroup(baseline.data_groups.classifications);
const extensions = readGroup(baseline.data_groups.classification_extensions ?? []);
const reserveComponents = readGroup(foundation.data_groups?.reserve_components ?? []);
const events = readGroup(baseline.data_groups.events ?? []);
const eventDetails = readGroup(baseline.data_groups.event_details ?? []);

const classificationById = new Map(classifications.map((row) => [row.id, row]));
const extensionById = new Map(extensions.map((row) => [row.id, row]));
const componentsByStablecoin = new Map();
for (const component of reserveComponents) {
  const rows = componentsByStablecoin.get(component.stablecoin_id) ?? [];
  rows.push(component);
  componentsByStablecoin.set(component.stablecoin_id, rows);
}
const eventDetailById = new Map(eventDetails.map((row) => [row.id, row]));
const eventsByStablecoin = new Map();
for (const event of events) {
  const ids = new Set([event.stablecoin_id, ...(event.subject_stablecoin_ids ?? [])].filter(Boolean));
  for (const stablecoinId of ids) {
    const rows = eventsByStablecoin.get(stablecoinId) ?? [];
    rows.push({ ...event, ...(eventDetailById.get(event.id) ?? {}) });
    eventsByStablecoin.set(stablecoinId, rows);
  }
}

const modelChangeTerms = new Set([
  'governance_change', 'migration', 'protocol_model_update', 'protocol_transition',
  'protocol_upgrade', 'rebrand_and_classification_change', 'rebrand_or_lifecycle_transition',
  'reserve_change', 'token_migration'
]);

const records = stablecoins.map((coin) => {
  const classification = { ...(classificationById.get(coin.id) ?? {}), ...(extensionById.get(coin.id) ?? {}) };
  const components = componentsByStablecoin.get(coin.id) ?? [];
  const relatedEvents = eventsByStablecoin.get(coin.id) ?? [];
  const modelChangeEvents = relatedEvents.filter((event) =>
    modelChangeTerms.has(event.event_type) ||
    modelChangeTerms.has(event.event_detail_kind) ||
    /model|collateral|reserve|migration|transition|upgrade|rebrand/i.test(`${event.title ?? ''} ${event.description ?? ''}`)
  );
  const backingTypes = Array.isArray(classification.backing_types) ? classification.backing_types : [];
  const componentCategories = [...new Set(components.map((row) => row.asset_category).filter(Boolean))].sort();
  return {
    id: coin.id,
    slug: coin.slug,
    name: coin.name,
    legacy_collateral_model: coin.collateral_model ?? null,
    backing_types: backingTypes,
    backing_type_count: backingTypes.length,
    stabilization_mechanism: classification.stabilization_mechanism ?? null,
    governance_model: classification.governance_model ?? null,
    reserve_component_categories: componentCategories,
    reserve_component_count: components.length,
    historical_model_event_ids: modelChangeEvents.map((row) => row.id).sort(),
    historical_model_event_count: modelChangeEvents.length,
    combination_key: `${coin.collateral_model ?? 'missing'}|${backingTypes.join('+') || 'missing'}|${classification.stabilization_mechanism ?? 'missing'}`
  };
}).sort((a, b) => a.id.localeCompare(b.id));

const output = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  record_count: records.length,
  reserve_component_count: reserveComponents.length,
  missing_classification_ids: records.filter((row) => !classificationById.has(row.id)).map((row) => row.id),
  missing_backing_type_ids: records.filter((row) => row.backing_types.length === 0).map((row) => row.id),
  missing_stabilization_ids: records.filter((row) => !row.stabilization_mechanism).map((row) => row.id),
  legacy_collateral_model_counts: countBy(records, (row) => row.legacy_collateral_model),
  backing_type_counts_non_exclusive: countBy(records, (row) => row.backing_types),
  backing_type_count_distribution: countBy(records, (row) => String(row.backing_type_count)),
  stabilization_mechanism_counts: countBy(records, (row) => row.stabilization_mechanism),
  governance_model_counts: countBy(records, (row) => row.governance_model),
  reserve_component_category_counts_non_exclusive: countBy(records, (row) => row.reserve_component_categories),
  combination_counts: countBy(records, (row) => row.combination_key),
  records_with_historical_model_events: records.filter((row) => row.historical_model_event_count > 0),
  records
};

const outputPath = path.join(root, 'data/generated/backing-stabilization-migration.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify({
  ok: output.missing_classification_ids.length === 0 && output.missing_backing_type_ids.length === 0 && output.missing_stabilization_ids.length === 0,
  record_count: output.record_count,
  reserve_component_count: output.reserve_component_count,
  legacy_collateral_model_counts: output.legacy_collateral_model_counts,
  backing_type_counts_non_exclusive: output.backing_type_counts_non_exclusive,
  stabilization_mechanism_counts: output.stabilization_mechanism_counts,
  combination_counts: output.combination_counts,
  records_with_historical_model_events: output.records_with_historical_model_events,
  missing_classification_ids: output.missing_classification_ids,
  missing_backing_type_ids: output.missing_backing_type_ids,
  missing_stabilization_ids: output.missing_stabilization_ids
}, null, 2));
