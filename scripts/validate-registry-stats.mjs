import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { buildRegistryStats } from './generate-registry-stats-batch-o.mjs';
import { buildValueStateStats } from './build-value-state-stats.mjs';
import { buildPrimaryDisplayRelationshipStats } from './build-primary-display-relationship-stats.mjs';
import { applyEvidenceSourceIdentityStats } from './build-evidence-source-identity-stats.mjs';

const root = process.cwd();
const contractPath = 'docs/stats/registry-stats-contract.json';
const outputPath = 'data/generated/registry-stats.json';

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function sumObjectValues(value) {
  return Object.values(value).reduce((sum, count) => sum + count, 0);
}

const contract = readJson(contractPath);
const current = readJson(outputPath);
const expected = buildRegistryStats();
expected.value_states = buildValueStateStats(root);
expected.primary_display_relationships = buildPrimaryDisplayRelationshipStats(root);
applyEvidenceSourceIdentityStats(expected, root);
const failures = [];

for (const section of contract.required_sections ?? []) {
  if (!(section in current)) failures.push(`missing required section: ${section}`);
}

if (current.schema_version !== contract.schema_version) {
  failures.push(`schema_version must be ${contract.schema_version}`);
}

for (const [name, minimum] of Object.entries(contract.protected_minimums ?? {})) {
  const actual = current.registry?.[name];
  if (!Number.isInteger(minimum) || minimum < 0) {
    failures.push(`protected minimum ${name} must be a non-negative integer`);
    continue;
  }
  if (!Number.isInteger(actual) || actual < minimum) {
    failures.push(`protected ${name} count must be at least ${minimum}, found ${actual}`);
  }
}

if (sumObjectValues(current.lifecycle?.by_status ?? {}) !== current.registry?.stablecoins) {
  failures.push('lifecycle.by_status must sum to registry.stablecoins');
}

const lifecyclePartition =
  (current.lifecycle?.active_side?.count ?? 0) +
  (current.lifecycle?.historical_side?.count ?? 0);
if (lifecyclePartition !== current.registry?.stablecoins) {
  failures.push('active_side + historical_side must equal registry.stablecoins');
}

for (const [name, row] of Object.entries(current.coverage ?? {})) {
  if (!Number.isInteger(row.covered) || !Number.isInteger(row.total)) {
    failures.push(`coverage.${name} counts must be integers`);
    continue;
  }
  if (row.covered < 0 || row.covered > row.total) {
    failures.push(`coverage.${name}.covered must be between 0 and total`);
  }
  const expectedShare = row.total === 0 ? 0 : Number((row.covered / row.total).toFixed(4));
  if (row.share !== expectedShare) failures.push(`coverage.${name}.share is inconsistent`);
}

if (current.value_states?.definitions !== 8) {
  failures.push('value_states.definitions must equal the approved eight-state model');
}
for (const [name, counts] of Object.entries(current.value_states ?? {})) {
  if (name === 'definitions') continue;
  const total = sumObjectValues(counts);
  if (!Number.isInteger(total) || total <= 0) failures.push(`value_states.${name} must contain positive integer counts`);
}

const primaryDisplay = current.primary_display_relationships;
if (primaryDisplay?.selected_relationships !== current.registry?.stablecoins) {
  failures.push('primary_display_relationships.selected_relationships must equal registry.stablecoins');
}
if (primaryDisplay?.ambiguous_selections !== 0) {
  failures.push('primary_display_relationships.ambiguous_selections must be zero');
}
if (sumObjectValues(primaryDisplay?.selection_mode ?? {}) !== current.registry?.stablecoins) {
  failures.push('primary display selection_mode counts must sum to registry.stablecoins');
}
if (sumObjectValues(primaryDisplay?.selected_role ?? {}) !== current.registry?.stablecoins) {
  failures.push('primary display selected_role counts must sum to registry.stablecoins');
}
if (sumObjectValues(primaryDisplay?.selected_status ?? {}) !== current.registry?.stablecoins) {
  failures.push('primary display selected_status counts must sum to registry.stablecoins');
}
if (sumObjectValues(primaryDisplay?.selected_organization_category ?? {}) !== current.registry?.stablecoins) {
  failures.push('primary display selected_organization_category counts must sum to registry.stablecoins');
}

const sourceIdentities = current.evidence_source_identities;
if (sourceIdentities?.canonical_evidence_records !== current.registry?.evidence) {
  failures.push('evidence source identity canonical count must equal registry.evidence');
}
if (sourceIdentities?.public_source_identities !== current.registry?.evidence_source_identities) {
  failures.push('public source identity count must equal registry.evidence_source_identities');
}
if (sourceIdentities?.evidence_relations !== current.registry?.evidence_relations) {
  failures.push('evidence relation count must equal registry.evidence_relations');
}
if ((sourceIdentities?.public_source_identities ?? 0) + (sourceIdentities?.source_aliases ?? 0) !== (sourceIdentities?.canonical_evidence_records ?? -1)) {
  failures.push('public source identities plus aliases must equal canonical evidence records');
}
if (sourceIdentities?.public_duplicate_url_groups !== 0) {
  failures.push('public source identity projection must contain zero duplicate URL groups');
}
if ((sourceIdentities?.orphan_relation_source_ids ?? []).length !== 0) {
  failures.push('evidence relations must not point to missing public source identities');
}
if (sourceIdentities?.source_identity_groups !== 32) {
  failures.push('evidence source identity group count must remain 32');
}

try {
  assert.deepStrictEqual(current, expected);
} catch {
  failures.push(`${outputPath} does not match a fresh deterministic generation`);
}

if (failures.length) {
  console.error('Registry stats validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  console.error('Expected generated content:');
  console.error(JSON.stringify(expected, null, 2));
  process.exit(1);
}

console.log(`Registry stats validation passed: ${current.registry.stablecoins} assets, ${current.registry.events} events, ${current.registry.evidence} canonical evidence records, ${current.registry.evidence_source_identities} public source identities, ${current.registry.evidence_relations} evidence relations, ${Object.keys(current.value_states).length - 1} value-state axes, and ${primaryDisplay.selected_relationships} primary display relationships.`);
