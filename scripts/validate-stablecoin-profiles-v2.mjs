import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.join(process.cwd(), 'data');
const failures = [];
const redemptionStatuses = new Set(['public_direct','eligible_customers_only','institutional_only','protocol_based','restricted','suspended','terminated','not_applicable','unknown']);
const backingTypes = new Set(['cash','bank_deposits','government_securities','commercial_paper','crypto_collateral','stablecoin_collateral','tokenized_fund','commodity','unbacked','mixed','other','unknown']);

function readArray(file) {
  try {
    const value = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    if (!Array.isArray(value)) failures.push(`${file}: expected array`);
    return Array.isArray(value) ? value : [];
  } catch (error) { failures.push(`${file}: ${error.message}`); return []; }
}
function dateOrNull(value, label) { if (value !== null && value !== undefined && value !== '' && (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))) failures.push(`${label}: expected YYYY-MM-DD or null`); }

const stablecoins = [...readArray('stablecoins.json'), ...readArray('stablecoins-extra.json')];
const profiles = [...readArray('stablecoin-profiles-v2.json'), ...readArray('stablecoin-profiles-batch-a.json')];
const reserveReports = [...readArray('reserve-reports.json'), ...readArray('reserve-reports-extra.json'), ...readArray('reserve-reports-pr033.json'), ...readArray('reserve-reports-pr034.json')];
const evidence = [...readArray('evidence.json'), ...readArray('evidence-extra.json'), ...readArray('evidence-pr033.json'), ...readArray('evidence-events-pr036.json'), ...readArray('evidence-events-pr037.json'), ...readArray('evidence-events-pr038.json'), ...readArray('evidence-batch-a.json')];
const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const profileById = new Map();
const reserveReportIds = new Set(reserveReports.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));

for (const profile of profiles) {
  if (!profile.id) { failures.push('profile row missing id'); continue; }
  if (profileById.has(profile.id)) failures.push(`duplicate profile id: ${profile.id}`);
  profileById.set(profile.id, profile);
  if (!stablecoinIds.has(profile.id)) failures.push(`profile references missing stablecoin: ${profile.id}`);
  const reserve = profile.reserve_profile;
  if (!reserve || typeof reserve !== 'object' || Array.isArray(reserve)) failures.push(`${profile.id}: reserve_profile must be an object`);
  else {
    if (!Array.isArray(reserve.backing_types) || reserve.backing_types.length === 0) failures.push(`${profile.id}: reserve_profile.backing_types must be non-empty`);
    else for (const value of reserve.backing_types) if (!backingTypes.has(value)) failures.push(`${profile.id}: invalid reserve backing type ${value}`);
    if (!reserve.summary) failures.push(`${profile.id}: reserve_profile.summary is required`);
    if (!reserve.disclosure_status) failures.push(`${profile.id}: reserve_profile.disclosure_status is required`);
    dateOrNull(reserve.as_of_date, `${profile.id}: reserve_profile.as_of_date`);
    if (reserve.latest_report_id && !reserveReportIds.has(reserve.latest_report_id)) failures.push(`${profile.id}: missing latest_report_id ${reserve.latest_report_id}`);
    if (!Array.isArray(reserve.evidence_ids)) failures.push(`${profile.id}: reserve_profile.evidence_ids must be an array`);
    else for (const id of reserve.evidence_ids) if (!evidenceIds.has(id)) failures.push(`${profile.id}: missing reserve evidence ${id}`);
  }
  const redemption = profile.redemption_profile;
  if (!redemption || typeof redemption !== 'object' || Array.isArray(redemption)) failures.push(`${profile.id}: redemption_profile must be an object`);
  else {
    if (!redemptionStatuses.has(redemption.status)) failures.push(`${profile.id}: invalid redemption status ${redemption.status}`);
    if (!redemption.settlement_asset) failures.push(`${profile.id}: redemption_profile.settlement_asset is required`);
    if (!redemption.eligible_parties) failures.push(`${profile.id}: redemption_profile.eligible_parties is required`);
    if (!Array.isArray(redemption.jurisdiction_restrictions)) failures.push(`${profile.id}: redemption_profile.jurisdiction_restrictions must be an array`);
    if (!Array.isArray(redemption.evidence_ids)) failures.push(`${profile.id}: redemption_profile.evidence_ids must be an array`);
    else for (const id of redemption.evidence_ids) if (!evidenceIds.has(id)) failures.push(`${profile.id}: missing redemption evidence ${id}`);
    dateOrNull(redemption.as_of_date, `${profile.id}: redemption_profile.as_of_date`);
  }
}
for (const stablecoin of stablecoins) if (!profileById.has(stablecoin.id)) failures.push(`missing profile for ${stablecoin.id}`);
if (profileById.size !== stablecoinIds.size) failures.push(`profile count ${profileById.size} does not match stablecoin count ${stablecoinIds.size}`);
if (failures.length) { console.error('Stablecoin Registry v2 profile validation failed:'); failures.forEach((failure) => console.error(`- ${failure}`)); process.exit(1); }
console.log(`Stablecoin Registry v2 profile validation passed: ${profiles.length} profiles for ${stablecoins.length} stablecoins.`);
