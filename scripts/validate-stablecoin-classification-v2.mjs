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
const assetClasses = new Set(['stablecoin','stable_value_asset','stablecoin_adjacent','tokenized_commodity','yield_bearing_stable_receipt','experimental_stabilization_asset','reserve_asset','unknown']);
const referenceTargets = new Set(['fiat','commodity','crypto_asset','index','basket','floating','protocol_internal','none','unknown']);
const redemptionOrExitModels = new Set(['issuer_redemption','protocol_redemption','market_exit','conversion','physical_redemption','vault_withdrawal','rebasing_or_repricing','maturity_or_settlement','none','other','unknown']);
const valuationSourceTypes = new Set(['issuer','protocol','oracle','market','index_provider','custodian','other','unknown']);
const yieldOrRebaseModes = new Set(['none','yield_bearing','rebasing','reward_accruing','variable_rate','other','unknown']);
const accrualTargets = new Set(['asset','wrapper','external_receipt','protocol_position','none','unknown']);
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

function validateOptionalString(row, field, value) {
  if (value !== undefined && value !== null && typeof value !== 'string') failures.push(`${row.id}: ${field} must be a string when present`);
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

  if (row.asset_class !== undefined && !assetClasses.has(row.asset_class)) failures.push(`${row.id}: invalid asset_class ${row.asset_class}`);
  if (row.reference_target !== undefined && !referenceTargets.has(row.reference_target)) failures.push(`${row.id}: invalid reference_target ${row.reference_target}`);
  if (row.redemption_or_exit_model !== undefined && !redemptionOrExitModels.has(row.redemption_or_exit_model)) failures.push(`${row.id}: invalid redemption_or_exit_model ${row.redemption_or_exit_model}`);
  validateOptionalString(row, 'classification_notes', row.classification_notes);

  if (row.valuation_source !== undefined) {
    const source = row.valuation_source;
    if (!source || typeof source !== 'object' || Array.isArray(source)) failures.push(`${row.id}: valuation_source must be an object when present`);
    else {
      if (!valuationSourceTypes.has(source.source_type)) failures.push(`${row.id}: invalid valuation_source.source_type ${source.source_type}`);
      validateOptionalString(row, 'valuation_source.label', source.label);
      validateOptionalString(row, 'valuation_source.url', source.url);
      validateOptionalString(row, 'valuation_source.notes', source.notes);
    }
  }

  if (row.yield_or_rebase_profile !== undefined) {
    const profile = row.yield_or_rebase_profile;
    if (!profile || typeof profile !== 'object' || Array.isArray(profile)) failures.push(`${row.id}: yield_or_rebase_profile must be an object when present`);
    else {
      if (!yieldOrRebaseModes.has(profile.mode)) failures.push(`${row.id}: invalid yield_or_rebase_profile.mode ${profile.mode}`);
      if (profile.accrual_target !== undefined && !accrualTargets.has(profile.accrual_target)) failures.push(`${row.id}: invalid yield_or_rebase_profile.accrual_target ${profile.accrual_target}`);
      validateOptionalString(row, 'yield_or_rebase_profile.rate_source', profile.rate_source);
      validateOptionalString(row, 'yield_or_rebase_profile.notes', profile.notes);
    }
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
