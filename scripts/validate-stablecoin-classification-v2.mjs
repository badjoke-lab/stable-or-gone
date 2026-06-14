import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/registry-v2-baseline.json'), 'utf8'));
const lifecycleStatuses = new Set(['announced','active','restricted','suspended','winding_down','inactive','terminated','collapsed','migrated','rebranded','unknown']);
const issuanceStatuses = new Set(['open','restricted','paused','terminated','protocol_based','unknown']);
const pegKinds = new Set(['fiat','commodity','crypto_asset','index','basket','floating','other','unknown']);
const backingTypes = new Set(['cash','bank_deposits','government_securities','commercial_paper','corporate_bonds','private_credit','receivables','secured_loans','insurance_or_guarantee','crypto_collateral','stablecoin_collateral','tokenized_fund','commodity','unbacked','mixed','other','unknown']);
const stabilizationMechanisms = new Set(['issuer_redemption','overcollateralized_vault','algorithmic_supply','delta_neutral','protocol_arbitrage','bank_deposit_claim','fund_share_valuation','commodity_redemption','rebasing_or_repricing','hybrid','other','unknown']);
const governanceModels = new Set(['centralized','dao_governed','protocol_governed','hybrid','unknown']);
const assetClasses = new Set(['stablecoin','stable_value_asset','stablecoin_adjacent','tokenized_commodity','yield_bearing_stable_receipt','experimental_stabilization_asset','reserve_asset','tokenized_deposit','tokenized_fund_share','unknown']);
const referenceTargets = new Set(['fiat','commodity','crypto_asset','index','basket','floating','protocol_internal','none','unknown']);
const redemptionOrExitModels = new Set(['issuer_redemption','protocol_redemption','market_exit','conversion','physical_redemption','vault_withdrawal','rebasing_or_repricing','maturity_or_settlement','none','other','unknown']);
const valuationSourceTypes = new Set(['issuer','protocol','oracle','market','index_provider','custodian','other','unknown']);
const yieldOrRebaseModes = new Set(['none','yield_bearing','rebasing','reward_accruing','variable_rate','other','unknown']);
const accrualTargets = new Set(['asset','wrapper','external_receipt','protocol_position','none','unknown']);
const yieldSources = new Set(['reserve_income','lending','staking','derivatives_funding','protocol_incentives','token_emissions','mixed','none','unknown']);
const accrualMechanisms = new Set(['balance_rebase','exchange_rate_increase','claimable_reward','wrapper_value_increase','external_distribution','protocol_position','none','unknown']);
const rateTypes = new Set(['fixed','variable','discretionary','protocol_determined','none','unknown']);
const legacyCompatibility = {active:new Set(['active']),limited:new Set(['restricted']),impaired:new Set(['restricted','suspended']),discontinued:new Set(['winding_down','inactive','terminated']),failed:new Set(['collapsed']),rebranded:new Set(['rebranded']),migrated:new Set(['migrated']),unknown:new Set(['unknown'])};

function read(relativePath) {
  try {
    const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
    if (!Array.isArray(value)) failures.push(`${relativePath}: expected a JSON array`);
    return Array.isArray(value) ? value : [];
  } catch (error) {
    failures.push(`${relativePath}: ${error.message}`);
    return [];
  }
}
const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap(read);
const optionalString = (row, field, value) => {
  if (value !== undefined && value !== null && typeof value !== 'string') failures.push(`${row.id}: ${field} must be a string when present`);
};
function validateExtension(row) {
  if (row.asset_class !== undefined && !assetClasses.has(row.asset_class)) failures.push(`${row.id}: invalid asset_class ${row.asset_class}`);
  if (row.reference_target !== undefined && !referenceTargets.has(row.reference_target)) failures.push(`${row.id}: invalid reference_target ${row.reference_target}`);
  if (row.redemption_or_exit_model !== undefined && !redemptionOrExitModels.has(row.redemption_or_exit_model)) failures.push(`${row.id}: invalid redemption_or_exit_model ${row.redemption_or_exit_model}`);
  optionalString(row, 'classification_notes', row.classification_notes);
  if (row.valuation_source !== undefined) {
    const source = row.valuation_source;
    if (!source || typeof source !== 'object' || Array.isArray(source)) failures.push(`${row.id}: valuation_source must be an object`);
    else {
      if (!valuationSourceTypes.has(source.source_type)) failures.push(`${row.id}: invalid valuation_source.source_type ${source.source_type}`);
      optionalString(row, 'valuation_source.label', source.label);
      optionalString(row, 'valuation_source.url', source.url);
      optionalString(row, 'valuation_source.notes', source.notes);
    }
  }
  if (row.yield_or_rebase_profile !== undefined) {
    const profile = row.yield_or_rebase_profile;
    if (!profile || typeof profile !== 'object' || Array.isArray(profile)) failures.push(`${row.id}: yield_or_rebase_profile must be an object`);
    else {
      if (!yieldOrRebaseModes.has(profile.mode)) failures.push(`${row.id}: invalid yield_or_rebase_profile.mode ${profile.mode}`);
      if (profile.accrual_target !== undefined && !accrualTargets.has(profile.accrual_target)) failures.push(`${row.id}: invalid yield_or_rebase_profile.accrual_target ${profile.accrual_target}`);
      if (profile.yield_source !== undefined && !yieldSources.has(profile.yield_source)) failures.push(`${row.id}: invalid yield_or_rebase_profile.yield_source ${profile.yield_source}`);
      if (profile.accrual_mechanism !== undefined && !accrualMechanisms.has(profile.accrual_mechanism)) failures.push(`${row.id}: invalid yield_or_rebase_profile.accrual_mechanism ${profile.accrual_mechanism}`);
      if (profile.rate_type !== undefined && !rateTypes.has(profile.rate_type)) failures.push(`${row.id}: invalid yield_or_rebase_profile.rate_type ${profile.rate_type}`);
      optionalString(row, 'yield_or_rebase_profile.rate_source', profile.rate_source);
      optionalString(row, 'yield_or_rebase_profile.notes', profile.notes);
    }
  }
}

const stablecoins = group('stablecoins');
const classifications = group('classifications');
const extensions = group('classification_extensions');
const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const classificationById = new Map();
const extensionById = new Map();

for (const row of classifications) {
  if (!row.id) { failures.push('classification row missing id'); continue; }
  if (classificationById.has(row.id)) failures.push(`duplicate classification id: ${row.id}`);
  classificationById.set(row.id, row);
  if (!stablecoinById.has(row.id)) failures.push(`classification references missing stablecoin: ${row.id}`);
}
for (const row of extensions) {
  if (!row.id) { failures.push('classification extension missing id'); continue; }
  if (extensionById.has(row.id)) failures.push(`duplicate classification extension id: ${row.id}`);
  if (!classificationById.has(row.id)) failures.push(`classification extension references missing classification: ${row.id}`);
  extensionById.set(row.id, row);
  validateExtension(row);
}

for (const stablecoin of stablecoins) {
  const base = classificationById.get(stablecoin.id);
  if (!base) { failures.push(`missing classification for ${stablecoin.id}`); continue; }
  const row = { ...base, ...(extensionById.get(stablecoin.id) ?? {}) };
  if (!lifecycleStatuses.has(row.lifecycle_status)) failures.push(`${row.id}: invalid lifecycle_status ${row.lifecycle_status}`);
  if (!issuanceStatuses.has(row.issuance_status)) failures.push(`${row.id}: invalid issuance_status ${row.issuance_status}`);
  if (!stabilizationMechanisms.has(row.stabilization_mechanism)) failures.push(`${row.id}: invalid stabilization_mechanism ${row.stabilization_mechanism}`);
  if (!governanceModels.has(row.governance_model)) failures.push(`${row.id}: invalid governance_model ${row.governance_model}`);
  if (!row.peg_reference || typeof row.peg_reference !== 'object' || Array.isArray(row.peg_reference)) failures.push(`${row.id}: peg_reference must be an object`);
  else {
    if (!pegKinds.has(row.peg_reference.kind)) failures.push(`${row.id}: invalid peg_reference.kind ${row.peg_reference.kind}`);
    if (row.peg_reference.target_value !== undefined && typeof row.peg_reference.target_value !== 'number') failures.push(`${row.id}: peg_reference.target_value must be numeric`);
    if (stablecoin.peg_asset && row.peg_reference.asset && stablecoin.peg_asset !== row.peg_reference.asset) failures.push(`${row.id}: legacy peg_asset ${stablecoin.peg_asset} conflicts with peg_reference.asset ${row.peg_reference.asset}`);
  }
  if (!Array.isArray(row.backing_types) || row.backing_types.length === 0) failures.push(`${row.id}: backing_types must be non-empty`);
  else for (const value of row.backing_types) if (!backingTypes.has(value)) failures.push(`${row.id}: invalid backing_types value ${value}`);
  validateExtension(row);
  const allowedLifecycle = legacyCompatibility[stablecoin.status];
  if (!allowedLifecycle || !allowedLifecycle.has(row.lifecycle_status)) failures.push(`${row.id}: legacy status ${stablecoin.status} conflicts with lifecycle_status ${row.lifecycle_status}`);
}

if (classificationById.size !== stablecoinById.size) failures.push(`classification count ${classificationById.size} does not match stablecoin count ${stablecoinById.size}`);
if (failures.length) {
  console.error('Stablecoin Registry v2 classification validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Stablecoin Registry v2 classification validation passed: ${classifications.length} classifications for ${stablecoins.length} stablecoins, ${extensions.length} extension overlays.`);
