import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dataDir = path.join(root, 'data');
const failures = [];
const warnings = [];

const enumSets = {
  lifecycle_status: new Set(['announced','active','restricted','suspended','winding_down','inactive','terminated','collapsed','migrated','rebranded','unknown']),
  issuance_status: new Set(['open','restricted','paused','terminated','protocol_based','unknown']),
  redemption_status_v2: new Set(['public_direct','eligible_customers_only','institutional_only','protocol_based','restricted','suspended','terminated','not_applicable','unknown']),
  peg_reference_kind: new Set(['fiat','commodity','crypto_asset','index','floating','other','unknown']),
  backing_type: new Set(['cash','bank_deposits','government_securities','commercial_paper','crypto_collateral','stablecoin_collateral','tokenized_fund','commodity','unbacked','mixed','other','unknown']),
  stabilization_mechanism: new Set(['issuer_redemption','overcollateralized_vault','algorithmic_supply','delta_neutral','protocol_arbitrage','hybrid','other','unknown']),
  governance_model: new Set(['centralized','dao_governed','protocol_governed','hybrid','unknown']),
  organization_role: new Set(['legal_issuer','brand_owner','protocol_operator','governance_body','reserve_manager','custodian','redemption_agent','technology_provider','other']),
  relationship_status: new Set(['active','ended','planned','unknown']),
  depeg_direction: new Set(['below_peg','above_peg','both','unknown']),
  recovery_status: new Set(['recovered','partially_recovered','not_recovered','collapsed','unknown'])
};

const legacyStatusCompatibility = {
  active: new Set(['active']), limited: new Set(['restricted']), impaired: new Set(['restricted','suspended']),
  discontinued: new Set(['winding_down','inactive','terminated']), failed: new Set(['collapsed']),
  rebranded: new Set(['rebranded']), migrated: new Set(['migrated']), unknown: new Set(['unknown'])
};

function readArray(file) {
  const fullPath = path.join(dataDir, file);
  if (!fs.existsSync(fullPath)) { failures.push(`${file}: missing file`); return []; }
  try {
    const value = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    if (!Array.isArray(value)) { failures.push(`${file}: expected a JSON array`); return []; }
    return value.map((row) => ({ ...row, __source_file: file }));
  } catch (error) { failures.push(`${file}: invalid JSON (${error.message})`); return []; }
}

function combine(...files) { return files.flatMap(readArray); }
function label(row) { return `${row.__source_file ?? 'unknown'}: ${row.id ?? row.slug ?? 'unknown row'}`; }
function validateEnum(row, field, set) { const value = row[field]; if (value !== undefined && value !== null && value !== '' && !set.has(value)) failures.push(`${label(row)} invalid ${field}: ${value}`); }
function validateStringArray(row, field) { const value = row[field]; if (value !== undefined && (!Array.isArray(value) || value.some((item) => typeof item !== 'string'))) failures.push(`${label(row)} ${field} must be an array of strings`); }
function validateIdArray(row, field, knownIds) { validateStringArray(row, field); const value = row[field]; if (Array.isArray(value)) for (const id of value) if (!knownIds.has(id)) failures.push(`${label(row)} ${field} references missing ID ${id}`); }
function validateDateLike(row, field, value) { if (value !== undefined && value !== null && value !== '' && (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))) failures.push(`${label(row)} ${field} must be YYYY-MM-DD or null`); }

const stablecoinBase = combine('stablecoins.json', 'stablecoins-extra.json');
const stablecoinOverrides = combine('stablecoin-overrides-pr033.json', 'stablecoin-overrides-pr034.json');
const stablecoinBaseIds = new Set(stablecoinBase.map((row) => row.id));
const overridesById = new Map();
for (const override of stablecoinOverrides) {
  if (!stablecoinBaseIds.has(override.id)) failures.push(`${label(override)} override target does not exist`);
  if (overridesById.has(override.id)) failures.push(`${label(override)} duplicate override target ${override.id}`);
  overridesById.set(override.id, override);
}
const stablecoins = stablecoinBase.map((row) => {
  const override = overridesById.get(row.id);
  return override ? { ...row, ...override, __source_file: `${row.__source_file}+${override.__source_file}` } : row;
});
const organizations = combine('organizations.json');
const relationships = combine('relationships.json');
const legacyIssuers = combine('issuers.json', 'issuers-extra.json');
const events = combine('events.json', 'events-pr036.json', 'events-pr037.json', 'events-pr038.json');
const evidence = combine('evidence.json', 'evidence-extra.json', 'evidence-pr033.json', 'evidence-events-pr036.json', 'evidence-events-pr037.json', 'evidence-events-pr038.json');
const reserveReports = combine('reserve-reports.json', 'reserve-reports-extra.json', 'reserve-reports-pr033.json', 'reserve-reports-pr034.json');

const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const eventIds = new Set(events.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));
const reserveReportIds = new Set(reserveReports.map((row) => row.id));

const legacyIssuerById = new Map(legacyIssuers.map((row) => [row.id, row]));
for (const organization of organizations) {
  const legacy = legacyIssuerById.get(organization.id);
  if (!legacy) failures.push(`${label(organization)} has no legacy compatibility record`);
  else if (legacy.slug !== organization.slug) failures.push(`${label(organization)} slug conflicts with legacy issuer slug ${legacy.slug}`);
}
for (const legacy of legacyIssuers) if (!organizationIds.has(legacy.id)) failures.push(`${label(legacy)} is missing from organizations.json`);

const relationshipsByStablecoin = new Map();
for (const relationship of relationships) {
  if (!stablecoinIds.has(relationship.stablecoin_id)) failures.push(`${label(relationship)} references missing stablecoin ${relationship.stablecoin_id}`);
  if (!organizationIds.has(relationship.organization_id)) failures.push(`${label(relationship)} references missing organization ${relationship.organization_id}`);
  if (!enumSets.organization_role.has(relationship.role)) failures.push(`${label(relationship)} invalid role: ${relationship.role}`);
  if (relationship.status !== undefined && !enumSets.relationship_status.has(relationship.status)) failures.push(`${label(relationship)} invalid status: ${relationship.status}`);
  validateDateLike(relationship, 'start_date', relationship.start_date);
  validateDateLike(relationship, 'end_date', relationship.end_date);
  validateIdArray(relationship, 'evidence_ids', evidenceIds);
  const list = relationshipsByStablecoin.get(relationship.stablecoin_id) ?? [];
  list.push(relationship);
  relationshipsByStablecoin.set(relationship.stablecoin_id, list);
}

for (const row of stablecoins) {
  const hasV2 = ['lifecycle_status','issuance_status','peg_reference','backing_types','stabilization_mechanism','governance_model','reserve_profile','redemption_profile'].some((field) => row[field] !== undefined);
  if (!hasV2) warnings.push(`${label(row)} remains legacy-only for status/classification/profile fields`);
  const related = relationshipsByStablecoin.get(row.id) ?? [];
  if (related.length === 0) failures.push(`${label(row)} has no organization relationship`);
  if (row.issuer_id && !related.some((relationship) => relationship.organization_id === row.issuer_id)) failures.push(`${label(row)} legacy issuer_id is missing from relationships.json`);

  validateEnum(row, 'lifecycle_status', enumSets.lifecycle_status);
  validateEnum(row, 'issuance_status', enumSets.issuance_status);
  validateEnum(row, 'stabilization_mechanism', enumSets.stabilization_mechanism);
  validateEnum(row, 'governance_model', enumSets.governance_model);
  if (row.status && row.lifecycle_status && !(legacyStatusCompatibility[row.status]?.has(row.lifecycle_status))) failures.push(`${label(row)} legacy status ${row.status} conflicts with lifecycle_status ${row.lifecycle_status}`);

  if (row.peg_reference !== undefined) {
    const value = row.peg_reference;
    if (!value || typeof value !== 'object' || Array.isArray(value)) failures.push(`${label(row)} peg_reference must be an object`);
    else {
      if (!enumSets.peg_reference_kind.has(value.kind)) failures.push(`${label(row)} invalid peg_reference.kind: ${value.kind}`);
      if (value.target_value !== undefined && typeof value.target_value !== 'number') failures.push(`${label(row)} peg_reference.target_value must be numeric`);
    }
  }
  if (row.backing_types !== undefined) {
    validateStringArray(row, 'backing_types');
    if (Array.isArray(row.backing_types)) for (const value of row.backing_types) if (!enumSets.backing_type.has(value)) failures.push(`${label(row)} invalid backing_types value: ${value}`);
  }
  if (row.reserve_profile !== undefined) {
    const p = row.reserve_profile;
    if (!p || typeof p !== 'object' || Array.isArray(p)) failures.push(`${label(row)} reserve_profile must be an object`);
    else {
      if (!Array.isArray(p.backing_types)) failures.push(`${label(row)} reserve_profile.backing_types must be an array`);
      else for (const value of p.backing_types) if (!enumSets.backing_type.has(value)) failures.push(`${label(row)} invalid reserve_profile.backing_types value: ${value}`);
      validateDateLike(row, 'reserve_profile.as_of_date', p.as_of_date);
      if (p.latest_report_id && !reserveReportIds.has(p.latest_report_id)) failures.push(`${label(row)} reserve_profile.latest_report_id references missing reserve report ${p.latest_report_id}`);
      validateIdArray(p, 'evidence_ids', evidenceIds);
    }
  }
  if (row.redemption_profile !== undefined) {
    const p = row.redemption_profile;
    if (!p || typeof p !== 'object' || Array.isArray(p)) failures.push(`${label(row)} redemption_profile must be an object`);
    else {
      if (!enumSets.redemption_status_v2.has(p.status)) failures.push(`${label(row)} invalid redemption_profile.status: ${p.status}`);
      validateDateLike(row, 'redemption_profile.as_of_date', p.as_of_date);
      if (p.jurisdiction_restrictions !== undefined && (!Array.isArray(p.jurisdiction_restrictions) || p.jurisdiction_restrictions.some((item) => typeof item !== 'string'))) failures.push(`${label(row)} redemption_profile.jurisdiction_restrictions must be an array of strings`);
      validateIdArray(p, 'evidence_ids', evidenceIds);
    }
  }
}

for (const row of events) {
  validateIdArray(row, 'subject_stablecoin_ids', stablecoinIds);
  validateIdArray(row, 'subject_organization_ids', organizationIds);
  validateIdArray(row, 'evidence_ids', evidenceIds);
  if (row.stablecoin_id && Array.isArray(row.subject_stablecoin_ids) && !row.subject_stablecoin_ids.includes(row.stablecoin_id)) failures.push(`${label(row)} legacy stablecoin_id is missing from subject_stablecoin_ids`);
  if (row.issuer_id && Array.isArray(row.subject_organization_ids) && !row.subject_organization_ids.includes(row.issuer_id)) failures.push(`${label(row)} legacy issuer_id is missing from subject_organization_ids`);
  if (row.depeg_detail !== undefined) {
    const d = row.depeg_detail;
    if (!d || typeof d !== 'object' || Array.isArray(d)) failures.push(`${label(row)} depeg_detail must be an object`);
    else {
      if (d.direction !== undefined && !enumSets.depeg_direction.has(d.direction)) failures.push(`${label(row)} invalid depeg_detail.direction: ${d.direction}`);
      if (d.recovery_status !== undefined && !enumSets.recovery_status.has(d.recovery_status)) failures.push(`${label(row)} invalid depeg_detail.recovery_status: ${d.recovery_status}`);
      for (const field of ['extreme_price','maximum_deviation_bps','duration_minutes']) if (d[field] !== undefined && d[field] !== null && typeof d[field] !== 'number') failures.push(`${label(row)} depeg_detail.${field} must be numeric or null`);
      validateDateLike(row, 'depeg_detail.recovery_date', d.recovery_date);
      validateIdArray(d, 'price_source_ids', evidenceIds);
    }
  }
  if (row.regulatory_detail !== undefined) {
    const d = row.regulatory_detail;
    if (!d || typeof d !== 'object' || Array.isArray(d)) failures.push(`${label(row)} regulatory_detail must be an object`);
    else { validateDateLike(row, 'regulatory_detail.effective_date', d.effective_date); validateDateLike(row, 'regulatory_detail.resolution_date', d.resolution_date); }
  }
}

for (const row of evidence) {
  validateIdArray(row, 'stablecoin_ids', stablecoinIds);
  validateIdArray(row, 'organization_ids', organizationIds);
  validateIdArray(row, 'event_ids', eventIds);
  validateStringArray(row, 'claim_scopes');
  if (row.stablecoin_id && Array.isArray(row.stablecoin_ids) && !row.stablecoin_ids.includes(row.stablecoin_id)) failures.push(`${label(row)} legacy stablecoin_id is missing from stablecoin_ids`);
  if (row.issuer_id && Array.isArray(row.organization_ids) && !row.organization_ids.includes(row.issuer_id)) failures.push(`${label(row)} legacy issuer_id is missing from organization_ids`);
  if (row.event_id && Array.isArray(row.event_ids) && !row.event_ids.includes(row.event_id)) failures.push(`${label(row)} legacy event_id is missing from event_ids`);
  if (row.claim_scope && Array.isArray(row.claim_scopes) && !row.claim_scopes.includes(row.claim_scope)) failures.push(`${label(row)} legacy claim_scope is missing from claim_scopes`);
}

if (failures.length > 0) {
  console.error('Registry v2 compatibility validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
console.log(`Registry v2 compatibility validation passed with ${warnings.length} stablecoin record(s) awaiting later status/classification/profile migration.`);
