import fs from 'node:fs';
import path from 'node:path';
import { publicTaxonomy } from '../config/public-taxonomy.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();

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

function taxonomyEntry(axis, value) {
  if (!value) return null;
  return publicTaxonomy.axes[axis]?.entries.find((entry) => entry.canonical_value === value || entry.legacy_aliases.includes(value)) ?? null;
}

const baseline = loadRegistryV2Baseline(root);
const events = baseline.data_groups.events.flatMap(readRows);
const eventDetails = baseline.data_groups.event_details.flatMap(readRows);
const detailById = new Map(eventDetails.map((row) => [row.id, row]));
const detailFieldNames = [
  'depeg_detail',
  'regulatory_detail',
  'reserve_change_detail',
  'redemption_change_detail',
  'migration_detail',
  'issuer_control_detail',
  'security_incident_detail',
  'oracle_failure_detail',
  'collateral_impairment_detail',
  'insolvency_detail',
  'governance_change_detail',
  'bridge_or_chain_incident_detail',
  'termination_detail',
  'launch_detail'
];

const records = events.map((event) => {
  const detail = detailById.get(event.id) ?? {};
  const merged = { ...event, ...detail };
  const typeEntry = taxonomyEntry('event_type', merged.event_type);
  const detailEntry = taxonomyEntry('event_detail_kind', merged.event_detail_kind);
  const statusEntry = taxonomyEntry('event_status_effect', merged.event_status_effect);
  const recoveryStatus = merged.depeg_detail?.recovery_status
    ?? (merged.recovered === true ? 'recovered' : merged.recovered === false ? 'not_recovered' : null);
  const recoveryEntry = taxonomyEntry('recovery_status', recoveryStatus);
  const presentDetailFields = detailFieldNames.filter((field) => merged[field] !== null && merged[field] !== undefined);

  return {
    id: merged.id,
    event_type: merged.event_type ?? null,
    public_event_category: typeEntry?.public_category ?? null,
    public_event_label: typeEntry?.public_label ?? null,
    event_detail_kind: merged.event_detail_kind ?? null,
    public_detail_category: detailEntry?.public_category ?? null,
    event_status_effect: merged.event_status_effect ?? null,
    public_status_effect_category: statusEntry?.public_category ?? null,
    recovery_status: recoveryStatus,
    public_recovery_category: recoveryEntry?.public_category ?? null,
    recovered_legacy: merged.recovered ?? null,
    impact_level: merged.impact_level ?? null,
    present_detail_fields: presentDetailFields,
    detail_field_count: presentDetailFields.length,
    combination_key: `${merged.event_type ?? 'missing'}|${merged.event_detail_kind ?? 'missing'}|${merged.event_status_effect ?? 'missing'}|${recoveryStatus ?? 'missing'}`
  };
}).sort((a, b) => a.id.localeCompare(b.id));

const output = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  event_count: records.length,
  event_detail_count: eventDetails.length,
  missing_event_type_ids: records.filter((row) => !row.event_type).map((row) => row.id),
  unmapped_event_type_ids: records.filter((row) => row.event_type && !row.public_event_category).map((row) => row.id),
  missing_event_detail_kind_ids: records.filter((row) => !row.event_detail_kind).map((row) => row.id),
  unmapped_event_detail_kind_ids: records.filter((row) => row.event_detail_kind && !row.public_detail_category).map((row) => row.id),
  unmapped_status_effect_ids: records.filter((row) => row.event_status_effect && !row.public_status_effect_category).map((row) => row.id),
  unmapped_recovery_status_ids: records.filter((row) => row.recovery_status && !row.public_recovery_category).map((row) => row.id),
  missing_typed_detail_ids: records.filter((row) => row.detail_field_count === 0).map((row) => row.id),
  event_type_counts: countBy(records, (row) => row.event_type),
  public_event_category_counts: countBy(records, (row) => row.public_event_category),
  event_detail_kind_counts: countBy(records, (row) => row.event_detail_kind),
  public_detail_category_counts: countBy(records, (row) => row.public_detail_category),
  event_status_effect_counts: countBy(records, (row) => row.event_status_effect),
  public_status_effect_category_counts: countBy(records, (row) => row.public_status_effect_category),
  recovery_status_counts: countBy(records, (row) => row.recovery_status),
  impact_level_counts: countBy(records, (row) => row.impact_level),
  detail_field_counts_non_exclusive: countBy(records, (row) => row.present_detail_fields),
  combination_counts: countBy(records, (row) => row.combination_key),
  records
};

const outputPath = path.join(root, 'data/generated/event-taxonomy-migration.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);

console.log(JSON.stringify({
  ok: output.missing_event_type_ids.length === 0
    && output.unmapped_event_type_ids.length === 0
    && output.missing_event_detail_kind_ids.length === 0
    && output.unmapped_event_detail_kind_ids.length === 0
    && output.unmapped_status_effect_ids.length === 0
    && output.unmapped_recovery_status_ids.length === 0,
  event_count: output.event_count,
  event_detail_count: output.event_detail_count,
  public_event_category_counts: output.public_event_category_counts,
  event_detail_kind_counts: output.event_detail_kind_counts,
  event_status_effect_counts: output.event_status_effect_counts,
  recovery_status_counts: output.recovery_status_counts,
  detail_field_counts_non_exclusive: output.detail_field_counts_non_exclusive,
  missing_event_type_ids: output.missing_event_type_ids,
  unmapped_event_type_ids: output.unmapped_event_type_ids,
  missing_event_detail_kind_ids: output.missing_event_detail_kind_ids,
  unmapped_event_detail_kind_ids: output.unmapped_event_detail_kind_ids,
  unmapped_status_effect_ids: output.unmapped_status_effect_ids,
  unmapped_recovery_status_ids: output.unmapped_recovery_status_ids,
  missing_typed_detail_ids: output.missing_typed_detail_ids
}, null, 2));
