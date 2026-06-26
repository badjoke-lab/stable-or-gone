import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import {
  primaryDisplayRelationshipOverrides,
  resolvePrimaryDisplayRelationship
} from '../config/primary-display-relationships.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baseline = loadRegistryV2Baseline(root);
const auditPath = path.join(root, 'data/generated/primary-display-relationship-audit.json');
const validationPath = path.join(root, 'data/generated/primary-display-relationship-validation.json');

function readRows(relativePath) {
  const parsed = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.records)) return parsed.records;
  throw new Error(`${relativePath}: expected an array or records array`);
}

function group(name) {
  return (baseline.data_groups?.[name] ?? []).flatMap(readRows);
}

const stablecoins = group('stablecoins');
const organizations = group('organizations');
const relationships = group('relationships');
const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const relationshipIds = new Set();
const errors = [];
const warnings = [];
const historicalEndDateNotRecorded = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };

assert(fs.existsSync(auditPath), 'primary display relationship audit is missing');
assert(stablecoins.length === 92, `expected 92 stablecoins, found ${stablecoins.length}`);
assert(organizations.length === 86, `expected 86 organizations, found ${organizations.length}`);
assert(relationships.length === 101, `expected 101 relationships, found ${relationships.length}`);

for (const relationship of relationships) {
  assert(typeof relationship.id === 'string' && relationship.id.length > 0, 'relationship id is missing');
  assert(!relationshipIds.has(relationship.id), `duplicate relationship id: ${relationship.id}`);
  relationshipIds.add(relationship.id);
  assert(stablecoinIds.has(relationship.stablecoin_id), `${relationship.id}: missing stablecoin ${relationship.stablecoin_id}`);
  assert(organizationIds.has(relationship.organization_id), `${relationship.id}: missing organization ${relationship.organization_id}`);
  if (relationship.status === 'active') {
    assert(!relationship.end_date, `${relationship.id}: active relationship must not have an end date`);
  }
  if (relationship.status === 'ended' && !relationship.end_date) {
    historicalEndDateNotRecorded.push(relationship.id);
  }
}

for (const [stablecoinId, relationshipId] of Object.entries(primaryDisplayRelationshipOverrides)) {
  const relationship = relationships.find((row) => row.id === relationshipId);
  assert(stablecoinIds.has(stablecoinId), `override references missing stablecoin: ${stablecoinId}`);
  assert(Boolean(relationship), `override references missing relationship: ${relationshipId}`);
  assert(relationship?.stablecoin_id === stablecoinId, `override relationship ${relationshipId} does not belong to ${stablecoinId}`);
}

const selections = [];
for (const stablecoin of stablecoins) {
  const candidates = relationships.filter((row) => row.stablecoin_id === stablecoin.id);
  const resolution = resolvePrimaryDisplayRelationship(stablecoin.id, relationships);
  const reversed = resolvePrimaryDisplayRelationship(stablecoin.id, [...relationships].reverse());
  const rotatedRelationships = relationships.length > 1 ? [...relationships.slice(1), relationships[0]] : [...relationships];
  const rotated = resolvePrimaryDisplayRelationship(stablecoin.id, rotatedRelationships);

  assert(candidates.length > 0, `${stablecoin.id}: no organization relationship`);
  assert(resolution.valid, `${stablecoin.id}: primary display selection is invalid (${resolution.selection_mode})`);
  assert(Boolean(resolution.relationship), `${stablecoin.id}: no primary display relationship selected`);
  assert(resolution.relationship?.stablecoin_id === stablecoin.id, `${stablecoin.id}: selected relationship belongs to another stablecoin`);
  assert(resolution.tied_top_relationship_ids.length <= 1 || resolution.selection_mode === 'explicit_override', `${stablecoin.id}: multiple top relationships require an explicit override: ${resolution.tied_top_relationship_ids.join(', ')}`);
  assert(resolution.relationship?.id === reversed.relationship?.id, `${stablecoin.id}: reversing relationship array changes primary display selection`);
  assert(resolution.relationship?.id === rotated.relationship?.id, `${stablecoin.id}: rotating relationship array changes primary display selection`);

  const activeCandidates = candidates.filter((row) => row.status === 'active');
  if (activeCandidates.length > 0) {
    assert(resolution.relationship?.status === 'active', `${stablecoin.id}: non-active relationship selected while active relationship exists`);
  }

  const selectedId = resolution.relationship?.id ?? null;
  assert(candidates.filter((row) => row.id === selectedId).length === 1, `${stablecoin.id}: selected relationship must appear exactly once among candidates`);

  selections.push({
    stablecoin_id: stablecoin.id,
    selected_relationship_id: selectedId,
    selection_mode: resolution.selection_mode,
    candidate_count: candidates.length
  });
}

let audit = null;
if (fs.existsSync(auditPath)) {
  audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  assert(audit.schema_version === '1.0', 'primary display audit schema mismatch');
  assert(audit.baseline_id === baseline.baseline_id, 'primary display audit baseline mismatch');
  assert(audit.totals?.stablecoins === stablecoins.length, 'audit stablecoin count mismatch');
  assert(audit.totals?.organizations === organizations.length, 'audit organization count mismatch');
  assert(audit.totals?.relationships === relationships.length, 'audit relationship count mismatch');
  assert(audit.totals?.stablecoins_without_relationships === 0, 'audit reports stablecoins without relationships');
  assert(audit.totals?.ambiguous_selections === 0, 'audit reports ambiguous primary display selections');
  assert(audit.totals?.invalid_selections === 0, 'audit reports invalid primary display selections');
  const auditSelections = audit.selections.map((row) => ({
    stablecoin_id: row.stablecoin_id,
    selected_relationship_id: row.selected_relationship_id,
    selection_mode: row.selection_mode,
    candidate_count: row.relationship_count
  }));
  assert(isDeepStrictEqual(auditSelections, selections), 'audit selections differ from fresh resolution');
}

if (Object.keys(primaryDisplayRelationshipOverrides).length === 0) {
  warnings.push('No explicit primary-display overrides are currently required by the deterministic policy.');
}
if (historicalEndDateNotRecorded.length > 0) {
  warnings.push(`${historicalEndDateNotRecorded.length} ended relationships have no supported end date and remain explicitly not recorded.`);
}

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  ok: errors.length === 0,
  totals: {
    stablecoins: stablecoins.length,
    organizations: organizations.length,
    relationships: relationships.length,
    selections: selections.length,
    explicit_overrides: Object.keys(primaryDisplayRelationshipOverrides).length,
    historical_end_dates_not_recorded: historicalEndDateNotRecorded.length
  },
  historical_end_date_not_recorded_relationship_ids: historicalEndDateNotRecorded,
  errors,
  warnings,
  selections
};

fs.mkdirSync(path.dirname(validationPath), { recursive: true });
fs.writeFileSync(validationPath, `${JSON.stringify(validation, null, 2)}\n`);

if (errors.length > 0) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}

console.log(JSON.stringify(validation, null, 2));
