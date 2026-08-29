import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  primaryDisplayRelationshipOverrides,
  resolvePrimaryDisplayRelationship
} from '../config/primary-display-relationships.mjs';
import { getPublicOrganizationCategory } from '../config/organization-taxonomy.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

function readRows(root, relativePath) {
  const parsed = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.records)) return parsed.records;
  throw new Error(`${relativePath}: expected an array or records array`);
}

function readGroup(root, baseline, name) {
  return (baseline.data_groups?.[name] ?? []).flatMap((file) => readRows(root, file));
}

function countValues(values) {
  return values.reduce((counts, rawValue) => {
    const value = rawValue === null || rawValue === undefined || rawValue === '' ? 'unknown' : String(rawValue);
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

export function buildPrimaryDisplayRelationshipStats(root = process.cwd()) {
  const baseline = loadRegistryV2Baseline(root);
  const stablecoins = readGroup(root, baseline, 'stablecoins');
  const organizations = readGroup(root, baseline, 'organizations');
  const relationships = readGroup(root, baseline, 'relationships');
  const organizationById = new Map(organizations.map((organization) => [organization.id, organization]));
  const resolutions = stablecoins.map((stablecoin) => resolvePrimaryDisplayRelationship(stablecoin.id, relationships));
  const selected = resolutions.map((resolution) => resolution.relationship).filter(Boolean);
  const relationshipsByStablecoin = new Map(stablecoins.map((stablecoin) => [
    stablecoin.id,
    relationships.filter((relationship) => relationship.stablecoin_id === stablecoin.id)
  ]));
  const ambiguous = stablecoins
    .map((stablecoin, index) => ({ stablecoin_id: stablecoin.id, resolution: resolutions[index] }))
    .filter(({ resolution }) => !resolution.valid);
  for (const { stablecoin_id, resolution } of ambiguous) {
    console.error(`Primary display ambiguity: ${stablecoin_id} -> ${resolution.tied_top_relationship_ids.join(', ') || 'no relationship'}`);
  }

  return {
    selected_relationships: selected.length,
    explicit_overrides: Object.keys(primaryDisplayRelationshipOverrides).length,
    ambiguous_selections: ambiguous.length,
    stablecoins_with_multiple_relationships: stablecoins.filter((stablecoin) => (relationshipsByStablecoin.get(stablecoin.id)?.length ?? 0) > 1).length,
    stablecoins_with_multiple_organizations: stablecoins.filter((stablecoin) => new Set((relationshipsByStablecoin.get(stablecoin.id) ?? []).map((relationship) => relationship.organization_id)).size > 1).length,
    stablecoins_with_historical_relationships: stablecoins.filter((stablecoin) => (relationshipsByStablecoin.get(stablecoin.id) ?? []).some((relationship) => relationship.status === 'ended')).length,
    selection_mode: countValues(resolutions.map((resolution) => resolution.selection_mode)),
    selected_role: countValues(selected.map((relationship) => relationship.role)),
    selected_status: countValues(selected.map((relationship) => relationship.status ?? 'unknown')),
    selected_organization_category: countValues(selected.map((relationship) => {
      const organization = organizationById.get(relationship.organization_id);
      return organization ? getPublicOrganizationCategory(organization.organization_type) : 'unknown';
    }))
  };
}

function runCli() {
  const root = process.cwd();
  const outputPath = path.join(root, 'data/generated/registry-stats.json');
  if (!fs.existsSync(outputPath)) throw new Error('Generate registry-stats.json before adding primary-display relationship statistics.');
  const stats = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  stats.primary_display_relationships = buildPrimaryDisplayRelationshipStats(root);
  fs.writeFileSync(outputPath, `${JSON.stringify(stats, null, 2)}\n`);
  console.log(`Added primary-display relationship statistics for ${stats.primary_display_relationships.selected_relationships} stable assets.`);
}

const direct = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (direct) runCli();
