import fs from 'node:fs';
import path from 'node:path';
import {
  comparePrimaryDisplayRelationships,
  getPrimaryDisplayRelationshipScore,
  primaryDisplayRelationshipOverrides,
  resolvePrimaryDisplayRelationship
} from '../config/primary-display-relationships.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const baseline = loadRegistryV2Baseline(root);

function readRows(relativePath) {
  const parsed = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.records)) return parsed.records;
  throw new Error(`${relativePath}: expected an array or records array`);
}

function group(name) {
  return (baseline.data_groups?.[name] ?? []).flatMap(readRows);
}

function countBy(values) {
  return values.reduce((counts, value) => {
    const key = value === null || value === undefined || value === '' ? 'unknown' : String(value);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});
}

const stablecoins = group('stablecoins');
const organizations = group('organizations');
const relationships = group('relationships');
const organizationById = new Map(organizations.map((row) => [row.id, row]));
const relationshipsByStablecoin = new Map();

for (const relationship of relationships) {
  const rows = relationshipsByStablecoin.get(relationship.stablecoin_id) ?? [];
  rows.push(relationship);
  relationshipsByStablecoin.set(relationship.stablecoin_id, rows);
}

const selections = stablecoins.map((stablecoin) => {
  const candidates = relationshipsByStablecoin.get(stablecoin.id) ?? [];
  const resolution = resolvePrimaryDisplayRelationship(stablecoin.id, relationships);
  const selected = resolution.relationship;
  const selectedOrganization = selected ? organizationById.get(selected.organization_id) : undefined;
  const activeCount = candidates.filter((row) => row.status === 'active').length;
  const endedCount = candidates.filter((row) => row.status === 'ended').length;
  const plannedCount = candidates.filter((row) => row.status === 'planned').length;
  const unknownCount = candidates.filter((row) => !row.status || row.status === 'unknown').length;

  return {
    stablecoin_id: stablecoin.id,
    stablecoin_slug: stablecoin.slug,
    stablecoin_name: stablecoin.name,
    relationship_count: candidates.length,
    organization_count: new Set(candidates.map((row) => row.organization_id)).size,
    relationship_status_counts: {
      active: activeCount,
      ended: endedCount,
      planned: plannedCount,
      unknown: unknownCount
    },
    selection_mode: resolution.selection_mode,
    valid: resolution.valid,
    selected_relationship_id: selected?.id ?? null,
    selected_organization_id: selected?.organization_id ?? null,
    selected_organization_name: selectedOrganization?.name ?? null,
    selected_role: selected?.role ?? null,
    selected_status: selected?.status ?? 'unknown',
    selected_start_date: selected?.start_date ?? null,
    selected_end_date: selected?.end_date ?? null,
    selected_score: selected ? getPrimaryDisplayRelationshipScore(selected) : null,
    override_id: resolution.override_id,
    tied_top_relationship_ids: resolution.tied_top_relationship_ids,
    ordered_relationship_ids: candidates.slice().sort(comparePrimaryDisplayRelationships).map((row) => row.id),
    candidates: candidates.slice().sort(comparePrimaryDisplayRelationships).map((row) => ({
      id: row.id,
      organization_id: row.organization_id,
      organization_name: organizationById.get(row.organization_id)?.name ?? null,
      role: row.role,
      status: row.status ?? 'unknown',
      start_date: row.start_date ?? null,
      end_date: row.end_date ?? null,
      score: getPrimaryDisplayRelationshipScore(row)
    }))
  };
});

const report = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  policy: {
    explicit_overrides: primaryDisplayRelationshipOverrides,
    status_first: true,
    array_order_independent: true,
    semantic_ties_require_override: true
  },
  totals: {
    stablecoins: stablecoins.length,
    organizations: organizations.length,
    relationships: relationships.length,
    stablecoins_with_relationships: selections.filter((row) => row.relationship_count > 0).length,
    stablecoins_without_relationships: selections.filter((row) => row.relationship_count === 0).length,
    stablecoins_with_multiple_relationships: selections.filter((row) => row.relationship_count > 1).length,
    stablecoins_with_multiple_organizations: selections.filter((row) => row.organization_count > 1).length,
    stablecoins_with_active_and_ended_relationships: selections.filter((row) => row.relationship_status_counts.active > 0 && row.relationship_status_counts.ended > 0).length,
    explicit_overrides: Object.keys(primaryDisplayRelationshipOverrides).length,
    ambiguous_selections: selections.filter((row) => row.selection_mode === 'ambiguous_requires_override').length,
    invalid_selections: selections.filter((row) => !row.valid).length
  },
  selected_role_counts: countBy(selections.map((row) => row.selected_role)),
  selected_status_counts: countBy(selections.map((row) => row.selected_status)),
  selection_mode_counts: countBy(selections.map((row) => row.selection_mode)),
  selections
};

const outputPath = path.join(root, 'data/generated/primary-display-relationship-audit.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify({
  totals: report.totals,
  selected_role_counts: report.selected_role_counts,
  selected_status_counts: report.selected_status_counts,
  ambiguous: report.selections.filter((row) => row.selection_mode === 'ambiguous_requires_override').map((row) => ({
    stablecoin_id: row.stablecoin_id,
    stablecoin_name: row.stablecoin_name,
    tied_top_relationship_ids: row.tied_top_relationship_ids
  }))
}, null, 2));
