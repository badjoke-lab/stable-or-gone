import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'data');
const failures = [];

const lifecycleStatuses = new Set(['announced','active','restricted','suspended','winding_down','inactive','terminated','collapsed','migrated','rebranded','unknown']);
const issuanceStatuses = new Set(['open','restricted','paused','terminated','protocol_based','unknown']);
const pegKinds = new Set(['fiat','commodity','crypto_asset','index','floating','other','unknown']);
const backingTypes = new Set(['cash','bank_deposits','government_securities','commercial_paper','crypto_collateral','stablecoin_collateral','tokenized_fund','commodity','unbacked','mixed','other','unknown']);
const stabilizationMechanisms = new Set(['issuer_redemption','overcollateralized_vault','algorithmic_supply','delta_neutral','protocol_arbitrage','hybrid','other','unknown']);
const governanceModels = new Set(['centralized','dao_governed','protocol_governed','hybrid','unknown']);
const legacyCompatibility = {
  active: new Set(['active']),
  limited: new Set(['restricted']),
  impaired: new Set(['restricted','suspended']),
  discontinued: new Set(['winding_down','inactive','terminated']),
  failed: new Set(['collapsed']),
  rebranded: new Set(['rebranded']),
  migrated: new Set(['migrated']),
  unknown: new Set(['unknown'])
};

function readArray(file) {
  const fullPath = path.join(dataDir, file);
  if (!fs.existsSync(fullPath)) {
    failures.push(`${file}: missing file`);
    return [];
  }
  try {
    const value = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    if (!Array.isArray(value)) {
      failures.push(`${file}: expected a JSON array`);
      return [];
    }
    return value;
  } catch (error) {
    failures.push(`${file}: invalid JSON (${error.message})`);
    return [];
  }
}

const stablecoins = [...readArray('stablecoins.json'), ...readArray('stablecoins-extra.json')];
const classifications = readArray('stablecoin-classification-v2.json');
const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const classificationById = new Map();

for (const row of classifications) {
  if (!row.id) {
    failures.push('classification row missing id');
    continue;
  }
  if (classificationById.has(row.id)) failures.push(`duplicate classification id: ${row.id}`);
  classificationById.set(row.id, row);
  if (!stablecoinById.has(row.id)) failures.push(`classification references missing stablecoin: ${row.id}`);
}

for (const stablecoin of stablecoins) {
  const row = classificationById.get(stablecoin.id);
  if (!row) {
    failures.push(`missing classification for ${stablecoin.id}`);
    continue;
  }

  if (!lifecycleStatuses.has(row.lifecycle_status)) failures.push(`${row.id}: invalid lifecycle_status ${row.lifecycle_status}`);
  if (!issuanceStatuses.has(row.issuance_status)) failures.push(`${row.id}: invalid issuance_status ${row.issuance_status}`);
  if (!stabilizationMechanisms.has(row.stabilization_mechanism)) failures.push(`${row.id}: invalid stabilization_mechanism ${row.stabilization_mechanism}`);
  if (!governanceModels.has(row.governance_model)) failures.push(`${row.id}: invalid governance_model ${row.governance_model}`);

  if (!row.peg_reference || typeof row.peg_reference !== 'object' || Array.isArray(row.peg_reference)) {
    failures.push(`${row.id}: peg_reference must be an object`);
  } else {
    if (!pegKinds.has(row.peg_reference.kind)) failures.push(`${row.id}: invalid peg_reference.kind ${row.peg_reference.kind}`);
    if (row.peg_reference.target_value !== undefined && typeof row.peg_reference.target_value !== 'number') failures.push(`${row.id}: peg_reference.target_value must be numeric`);
    if (stablecoin.peg_asset && row.peg_reference.asset && stablecoin.peg_asset !== row.peg_reference.asset) failures.push(`${row.id}: legacy peg_asset ${stablecoin.peg_asset} conflicts with peg_reference.asset ${row.peg_reference.asset}`);
  }

  if (!Array.isArray(row.backing_types) || row.backing_types.length === 0) {
    failures.push(`${row.id}: backing_types must be a non-empty array`);
  } else {
    for (const value of row.backing_types) if (!backingTypes.has(value)) failures.push(`${row.id}: invalid backing_types value ${value}`);
  }

  const allowedLifecycle = legacyCompatibility[stablecoin.status];
  if (!allowedLifecycle || !allowedLifecycle.has(row.lifecycle_status)) failures.push(`${row.id}: legacy status ${stablecoin.status} conflicts with lifecycle_status ${row.lifecycle_status}`);
}

if (classificationById.size !== stablecoinById.size) failures.push(`classification count ${classificationById.size} does not match stablecoin count ${stablecoinById.size}`);

if (failures.length > 0) {
  console.error('Stablecoin Registry v2 classification validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Stablecoin Registry v2 classification validation passed: ${classifications.length} classifications for ${stablecoins.length} stablecoins.`);
