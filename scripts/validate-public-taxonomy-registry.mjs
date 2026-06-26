import fs from 'node:fs';
import path from 'node:path';
import { publicTaxonomy } from '../config/public-taxonomy.mjs';
import { collectPublicTaxonomyValues } from './collect-public-taxonomy-values.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const observed = collectPublicTaxonomyValues(root);

check(publicTaxonomy.schema_version === '1.0', 'taxonomy schema_version must be 1.0');
check(publicTaxonomy.registry_id === 'sog_public_taxonomy_v1', 'unexpected taxonomy registry_id');
check(publicTaxonomy.specification === 'docs/public-taxonomy-spec.md', 'taxonomy specification path mismatch');
check(publicTaxonomy.axes && typeof publicTaxonomy.axes === 'object', 'taxonomy axes are missing');

const axisIndexes = new Map();
for (const [axis, definition] of Object.entries(publicTaxonomy.axes)) {
  check(typeof definition.is_filterable === 'boolean', `${axis}: is_filterable must be boolean`);
  check(Array.isArray(definition.entries) && definition.entries.length > 0, `${axis}: entries are missing`);

  const canonicalValues = new Map();
  const aliases = new Map();
  const sortOrders = new Set();

  for (const entry of definition.entries ?? []) {
    const prefix = `${axis}/${entry.canonical_value ?? 'missing'}`;
    check(typeof entry.canonical_value === 'string' && entry.canonical_value.length > 0, `${prefix}: canonical_value is required`);
    check(typeof entry.public_category === 'string' && entry.public_category.length > 0, `${prefix}: public_category is required`);
    check(typeof entry.public_label === 'string' && entry.public_label.length > 0, `${prefix}: public_label is required`);
    check(Array.isArray(entry.legacy_aliases), `${prefix}: legacy_aliases must be an array`);
    check(Number.isInteger(entry.sort_order) && entry.sort_order > 0, `${prefix}: sort_order must be a positive integer`);
    check(entry.is_filterable === definition.is_filterable, `${prefix}: entry filterability differs from its axis`);
    check(!canonicalValues.has(entry.canonical_value), `${axis}: duplicate canonical value ${entry.canonical_value}`);
    check(!sortOrders.has(entry.sort_order), `${axis}: duplicate sort_order ${entry.sort_order}`);
    canonicalValues.set(entry.canonical_value, entry);
    sortOrders.add(entry.sort_order);

    for (const alias of entry.legacy_aliases ?? []) {
      check(typeof alias === 'string' && alias.length > 0, `${prefix}: invalid legacy alias`);
      check(!canonicalValues.has(alias), `${axis}: alias collides with canonical value ${alias}`);
      check(!aliases.has(alias), `${axis}: duplicate legacy alias ${alias}`);
      aliases.set(alias, entry.canonical_value);
    }
  }

  axisIndexes.set(axis, { canonicalValues, aliases });
}

for (const [axis, rules] of Object.entries(publicTaxonomy.legacy_value_rules ?? {})) {
  const index = axisIndexes.get(axis);
  check(Boolean(index), `${axis}: legacy rules point to a missing axis`);
  const seen = new Set();
  for (const rule of rules) {
    const prefix = `${axis}/${rule.legacy_value ?? 'missing legacy value'}`;
    check(typeof rule.legacy_value === 'string' && rule.legacy_value.length > 0, `${prefix}: legacy_value is required`);
    check(typeof rule.review_required === 'boolean', `${prefix}: review_required must be boolean`);
    check(typeof rule.action === 'string' && rule.action.length > 0, `${prefix}: action is required`);
    check(!seen.has(rule.legacy_value), `${axis}: duplicate legacy rule ${rule.legacy_value}`);
    seen.add(rule.legacy_value);
    if (index) {
      check(!index.canonicalValues.has(rule.legacy_value), `${prefix}: legacy value collides with a canonical value`);
      check(!index.aliases.has(rule.legacy_value), `${prefix}: legacy value collides with an entry alias`);
      if (rule.target_canonical_value !== null) {
        check(index.canonicalValues.has(rule.target_canonical_value), `${prefix}: target canonical value does not exist`);
      }
    }
  }
}

for (const [axis, definition] of Object.entries(publicTaxonomy.descriptive_axes ?? {})) {
  check(definition.is_filterable === false, `${axis}: descriptive axes must not be filterable`);
  check(typeof definition.reason === 'string' && definition.reason.length > 0, `${axis}: descriptive-axis reason is required`);
  check(Array.isArray(observed.axes[axis]), `${axis}: descriptive axis is not collected`);
}

const observedAxisMap = {
  lifecycle_status: 'lifecycle_status',
  legacy_status: 'lifecycle_status',
  issuance_status: 'issuance_status',
  asset_class: 'asset_class',
  reference_kind: 'reference_kind',
  reference_asset: 'reference_asset',
  backing_type: 'backing_type',
  stabilization_mechanism: 'stabilization_mechanism',
  governance_model: 'governance_model',
  organization_type: 'organization_type',
  relationship_role: 'relationship_role',
  relationship_status: 'relationship_status',
  event_type: 'event_type',
  event_detail_kind: 'event_detail_kind',
  event_impact: 'event_impact',
  event_status_effect: 'event_status_effect',
  recovery_status: 'recovery_status',
  evidence_reliability: 'evidence_reliability',
  evidence_source_type: 'evidence_source_type',
  deployment_status: 'deployment_status',
  deployment_type: 'deployment_type',
  deployment_canonicality: 'deployment_canonicality',
  known_unknown_severity: 'known_unknown_severity',
  redemption_status: 'redemption_status'
};

const coverage = {};
for (const [observedAxis, registryAxis] of Object.entries(observedAxisMap)) {
  const values = observed.axes[observedAxis] ?? [];
  const index = axisIndexes.get(registryAxis);
  const rules = new Set((publicTaxonomy.legacy_value_rules?.[registryAxis] ?? []).map((rule) => rule.legacy_value));
  check(Boolean(index), `${registryAxis}: registry axis is missing for observed ${observedAxis}`);
  const unmapped = [];
  for (const value of values) {
    if (!index?.canonicalValues.has(value) && !index?.aliases.has(value) && !rules.has(value)) unmapped.push(value);
  }
  check(unmapped.length === 0, `${observedAxis}: unmapped values: ${unmapped.join(', ')}`);
  coverage[observedAxis] = {
    registry_axis: registryAxis,
    observed: values.length,
    unmapped
  };
}

const requiredAxes = [
  'lifecycle_status', 'issuance_status', 'reference_kind', 'reference_asset',
  'backing_type', 'public_model_category', 'event_type', 'organization_type',
  'relationship_role', 'evidence_reliability', 'evidence_source_type',
  'deployment_status', 'deployment_type', 'deployment_canonicality',
  'deployment_verification_status', 'value_state'
];
for (const axis of requiredAxes) check(axisIndexes.has(axis), `required taxonomy axis is missing: ${axis}`);

const report = {
  schema_version: '1.0',
  registry_id: publicTaxonomy.registry_id,
  checked_at: new Date().toISOString(),
  axes: Object.keys(publicTaxonomy.axes).length,
  mapped_entries: Object.values(publicTaxonomy.axes).reduce((total, definition) => total + definition.entries.length, 0),
  legacy_rules: Object.values(publicTaxonomy.legacy_value_rules).reduce((total, rules) => total + rules.length, 0),
  descriptive_axes: Object.keys(publicTaxonomy.descriptive_axes).length,
  observed_record_counts: observed.record_counts,
  coverage,
  failures
};

const reportPath = path.join(root, 'data/generated/public-taxonomy-validation.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length > 0) {
  console.error('Public taxonomy validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({ ...report, ok: true }, null, 2));
