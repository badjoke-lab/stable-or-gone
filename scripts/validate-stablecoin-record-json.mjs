import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const distRoot = path.join(root, 'dist');
const publicOrigin = 'https://www.stableorgone.com';
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const readJson = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const baseline = loadRegistryV2Baseline(root);
const readRows = (file) => {
  const value = readJson(file);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${file}: expected array or records array`);
};

const stablecoinsById = new Map();
for (const file of baseline.data_groups?.stablecoins ?? []) {
  for (const row of readRows(file)) stablecoinsById.set(row.id, row);
}
const stablecoins = [...stablecoinsById.values()].sort((left, right) => left.id.localeCompare(right.id));
const manifest = JSON.parse(fs.readFileSync(path.join(distRoot, 'data/manifest.json'), 'utf8'));
const provenance = readJson('data/generated/build-provenance.json');

assert(stablecoins.length > 0, 'No canonical stablecoins resolved from baseline');
assert(manifest.public_files?.stablecoin_record_template === '/data/stablecoin/{slug}.json', 'Manifest stablecoin record template missing');
assert(manifest.record_dossiers?.stablecoin?.route_template === '/data/stablecoin/{slug}.json', 'Manifest stablecoin dossier contract missing');
assert(manifest.record_dossiers?.stablecoin?.record_count === stablecoins.length, 'Manifest stablecoin dossier count mismatch');
assert(manifest.record_dossiers?.stablecoin?.canonical_only === true, 'Manifest stablecoin dossier canonical-only flag missing');
assert(manifest.record_dossiers?.stablecoin?.includes_unreviewed_candidates === false, 'Manifest stablecoin dossier candidate flag invalid');

const dossierDir = path.join(distRoot, 'data/stablecoin');
assert(fs.existsSync(dossierDir), 'dist/data/stablecoin is missing');
const publishedFiles = fs.readdirSync(dossierDir).filter((name) => name.endsWith('.json')).sort();
assert(publishedFiles.length === stablecoins.length, `Expected ${stablecoins.length} stablecoin dossiers, found ${publishedFiles.length}`);

for (const stablecoin of stablecoins) {
  const relativePath = `data/stablecoin/${stablecoin.slug}.json`;
  const absolutePath = path.join(distRoot, relativePath);
  assert(fs.existsSync(absolutePath), `Missing ${relativePath}`);
  const dossier = JSON.parse(fs.readFileSync(absolutePath, 'utf8'));
  assert(dossier.schema_version === '1.0.0', `${stablecoin.slug}: schema_version mismatch`);
  assert(dossier.data_schema_version === 'sog_registry_v2', `${stablecoin.slug}: data_schema_version mismatch`);
  assert(dossier.project_id === 'stable-or-gone', `${stablecoin.slug}: project_id mismatch`);
  assert(dossier.registry_family === 'badjoke-lab-ledger-series', `${stablecoin.slug}: registry family mismatch`);
  assert(dossier.record_type === 'stablecoin', `${stablecoin.slug}: record_type mismatch`);
  assert(dossier.id === stablecoin.id && dossier.slug === stablecoin.slug, `${stablecoin.slug}: top-level identity mismatch`);
  assert(dossier.record?.id === stablecoin.id && dossier.record?.slug === stablecoin.slug, `${stablecoin.slug}: canonical record identity mismatch`);
  assert(dossier.canonical_page_url === `${publicOrigin}/stablecoin/${stablecoin.slug}/`, `${stablecoin.slug}: canonical page URL mismatch`);
  assert(dossier.self_url === `${publicOrigin}/data/stablecoin/${stablecoin.slug}.json`, `${stablecoin.slug}: self URL mismatch`);
  assert(dossier.canonical_only === true && dossier.data_safety?.canonical_only === true, `${stablecoin.slug}: canonical-only marker missing`);
  assert(dossier.includes_unreviewed_candidates === false && dossier.data_safety?.includes_unreviewed_candidates === false, `${stablecoin.slug}: unreviewed-candidate marker invalid`);
  assert(dossier.data_safety?.includes_internal_monitoring === false, `${stablecoin.slug}: internal monitoring leaked`);
  assert(dossier.data_safety?.includes_private_notes === false, `${stablecoin.slug}: private-note marker invalid`);
  assert(dossier.build?.canonical_data_hash === provenance.canonical_data_hash, `${stablecoin.slug}: canonical hash mismatch`);
  assert(dossier.build?.canonical_file_count === provenance.canonical_file_count, `${stablecoin.slug}: canonical file count mismatch`);

  const related = dossier.related ?? {};
  const counts = dossier.record_counts ?? {};
  for (const key of ['organizations','organization_relationships','events','evidence','evidence_relations','reserve_reports','known_unknowns','regulatory_notes','deployments','stable_asset_relationships','reserve_components']) {
    assert(Array.isArray(related[key]), `${stablecoin.slug}: related.${key} must be an array`);
    assert(counts[key] === related[key].length, `${stablecoin.slug}: count mismatch for ${key}`);
  }
  assert(counts.legal_profile === (related.legal_profile ? 1 : 0), `${stablecoin.slug}: legal profile count mismatch`);
  assert(counts.income_profile === (related.income_profile ? 1 : 0), `${stablecoin.slug}: income profile count mismatch`);
}

const loadDossier = (slug) => JSON.parse(fs.readFileSync(path.join(dossierDir, `${slug}.json`), 'utf8'));
const usdc = loadDossier('usdc');
const usdcDepeg = usdc.related.events.find((row) => row.id === 'sog_ev_usdc_2023_03_depeg');
assert(usdcDepeg?.event_detail_kind === 'depeg', 'USDC typed depeg event missing from dossier');
assert(usdcDepeg?.depeg_detail?.recovery_status === 'recovered', 'USDC recovered depeg state not preserved');
assert(usdcDepeg?.depeg_detail?.recovery_date === '2023-03-13', 'USDC recovery date not preserved');

const ust = loadDossier('ust');
const ustCollapse = ust.related.events.find((row) => row.id === 'sog_ev_ust_2022_05_collapse');
assert(ustCollapse?.depeg_detail?.recovery_status === 'collapsed', 'UST collapsed recovery state not preserved');

const busd = loadDossier('busd');
assert(busd.related.events.some((row) => row.event_detail_kind === 'migration'), 'BUSD migration/wind-down lifecycle context missing');

console.log(JSON.stringify({
  ok: true,
  stablecoin_dossiers: stablecoins.length,
  representative_checks: ['usdc_recovered_depeg', 'ust_collapsed_depeg', 'busd_migration_context'],
  canonical_data_hash: provenance.canonical_data_hash,
}, null, 2));
