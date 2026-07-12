import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from '../load-registry-v2-baseline.mjs';

const readJson = (root, file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const asRows = (value, file) => {
  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.records)) return value.records;
  throw new Error(`${file}: expected row array`);
};

function loadFiles(root, files = []) {
  const rows = files.flatMap((file) => asRows(readJson(root, file), file));
  const byId = new Map();
  for (const row of rows) {
    if (!row?.id) throw new Error('Statistics input row missing id');
    if (byId.has(row.id)) throw new Error(`Duplicate statistics input id: ${row.id}`);
    byId.set(row.id, row);
  }
  return [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
}

export function loadStatsInput(root = process.cwd()) {
  const v2 = loadRegistryV2Baseline(root);
  const v3 = readJson(root, 'docs/migration/registry-v3-foundation.json');
  const incomeManifest = readJson(root, 'docs/migration/registry-v3-income-profiles.json');
  const checkpoint = readJson(root, 'docs/migration/current-canonical-checkpoint.json');
  const v2Groups = Object.fromEntries(Object.entries(v2.data_groups ?? {}).map(([name, files]) => [name, loadFiles(root, files)]));
  const v3Groups = Object.fromEntries(Object.entries(v3.data_groups ?? {}).map(([name, files]) => [name, loadFiles(root, files)]));
  const extensions = v2Groups.classification_extensions ?? [];
  const extensionById = new Map(extensions.map((row) => [row.id, row]));
  const classifications = (v2Groups.classifications ?? []).map((row) => ({ ...row, ...(extensionById.get(row.id) ?? {}) }));

  return {
    checkpoint,
    stablecoins: v2Groups.stablecoins ?? [],
    organizations: v2Groups.organizations ?? [],
    relationships: v2Groups.relationships ?? [],
    classifications,
    profiles: v2Groups.profiles ?? [],
    events: v2Groups.events ?? [],
    event_details: v2Groups.event_details ?? [],
    evidence: v2Groups.evidence ?? [],
    reserve_reports: v2Groups.reserve_reports ?? [],
    known_unknowns: v2Groups.known_unknowns ?? [],
    regulatory_notes: v2Groups.regulatory_notes ?? [],
    deployments: v2Groups.deployments ?? [],
    market_access_records: asRows(readJson(root, 'data/market-access-records-v1.json'), 'data/market-access-records-v1.json')
      .sort((a, b) => a.id.localeCompare(b.id)),
    legal_profiles: v3Groups.legal_profiles ?? [],
    stable_asset_relationships: v3Groups.stable_asset_relationships ?? [],
    reserve_components: v3Groups.reserve_components ?? [],
    income_profiles: loadFiles(root, incomeManifest.data_files ?? [])
  };
}
