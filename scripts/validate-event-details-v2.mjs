import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const baseline = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/registry-v2-baseline.json'), 'utf8'));
const kinds = new Set(['depeg','regulatory','reserve_change','redemption_change','migration','issuer_control','other']);
const recovery = new Set(['recovered','partially_recovered','not_recovered','collapsed','unknown']);
const issuerControlSubtypes = new Set(['address_blacklisting','address_unblacklisting','token_freeze','token_unfreeze','burn','reissuance','other','unknown']);
const verificationStatuses = new Set(['verified_onchain','onchain_details_pending','partially_verified','reported_only','unknown']);

function read(relativePath) {
  try {
    const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
    if (!Array.isArray(value)) failures.push(`${relativePath}: expected array`);
    return Array.isArray(value) ? value : [];
  } catch (error) {
    failures.push(`${relativePath}: ${error.message}`);
    return [];
  }
}
const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap(read);
const date = (value, label) => {
  if (value !== null && value !== undefined && value !== '' && (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))) failures.push(`${label}: expected YYYY-MM-DD or null`);
};
const ids = (value, label) => {
  if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== 'string')) failures.push(`${label}: expected non-empty string array`);
};
const optionalString = (value, label) => {
  if (value !== undefined && value !== null && typeof value !== 'string') failures.push(`${label}: expected string or null`);
};
const amount = (value, label) => {
  if (value === undefined) return;
  if (!value || typeof value !== 'object' || Array.isArray(value)) failures.push(`${label}: expected object`);
  else {
    if (value.value !== undefined && value.value !== null && (typeof value.value !== 'number' || value.value < 0)) failures.push(`${label}.value: expected non-negative number or null`);
    optionalString(value.symbol, `${label}.symbol`);
    optionalString(value.display_text, `${label}.display_text`);
    if (value.is_approximate !== undefined && typeof value.is_approximate !== 'boolean') failures.push(`${label}.is_approximate: expected boolean`);
  }
};

const stablecoins = group('stablecoins');
const organizations = group('organizations');
const events = group('events');
const overlays = group('event_details');
const deployments = group('deployments');
const evidence = group('evidence');
const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const deploymentIds = new Set(deployments.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));
const eventById = new Map(events.map((row) => [row.id, row]));
const overlayById = new Map();

for (const overlay of overlays) {
  if (!overlay.id) { failures.push('event overlay row missing id'); continue; }
  if (overlayById.has(overlay.id)) failures.push(`duplicate event overlay id: ${overlay.id}`);
  overlayById.set(overlay.id, overlay);
  const event = eventById.get(overlay.id);
  if (!event) { failures.push(`event overlay references missing event: ${overlay.id}`); continue; }

  ids(overlay.subject_stablecoin_ids, `${overlay.id}: subject_stablecoin_ids`);
  ids(overlay.subject_organization_ids, `${overlay.id}: subject_organization_ids`);
  for (const id of overlay.subject_stablecoin_ids ?? []) if (!stablecoinIds.has(id)) failures.push(`${overlay.id}: missing stablecoin ${id}`);
  for (const id of overlay.subject_organization_ids ?? []) if (!organizationIds.has(id)) failures.push(`${overlay.id}: missing organization ${id}`);
  for (const id of overlay.evidence_ids ?? []) if (!evidenceIds.has(id)) failures.push(`${overlay.id}: missing evidence ${id}`);
  if (event.stablecoin_id && !overlay.subject_stablecoin_ids.includes(event.stablecoin_id)) failures.push(`${overlay.id}: legacy stablecoin_id missing`);
  if (event.issuer_id && !overlay.subject_organization_ids.includes(event.issuer_id)) failures.push(`${overlay.id}: legacy issuer_id missing`);
  if (!kinds.has(overlay.event_detail_kind)) failures.push(`${overlay.id}: invalid event_detail_kind ${overlay.event_detail_kind}`);

  if (overlay.depeg_detail) {
    const detail = overlay.depeg_detail;
    if (detail.recovery_status && !recovery.has(detail.recovery_status)) failures.push(`${overlay.id}: invalid recovery_status`);
    date(detail.recovery_date, `${overlay.id}: depeg recovery_date`);
  }
  if (overlay.regulatory_detail) {
    date(overlay.regulatory_detail.effective_date, `${overlay.id}: regulatory effective_date`);
    date(overlay.regulatory_detail.resolution_date, `${overlay.id}: regulatory resolution_date`);
  }
  if (overlay.issuer_control_detail) {
    const detail = overlay.issuer_control_detail;
    if (overlay.event_detail_kind !== 'issuer_control') failures.push(`${overlay.id}: issuer_control_detail requires issuer_control kind`);
    if (!issuerControlSubtypes.has(detail.event_subtype)) failures.push(`${overlay.id}: invalid issuer-control subtype ${detail.event_subtype}`);
    if (detail.related_category !== undefined && detail.related_category !== 'issuer_control') failures.push(`${overlay.id}: related_category must be issuer_control`);
    if (detail.deployment_id && !deploymentIds.has(detail.deployment_id)) failures.push(`${overlay.id}: missing deployment ${detail.deployment_id}`);
    ids(detail.affected_addresses, `${overlay.id}: affected_addresses`);
    optionalString(detail.blacklist_transaction_hash, `${overlay.id}: blacklist_transaction_hash`);
    if (detail.related_transaction_hashes !== undefined && (!Array.isArray(detail.related_transaction_hashes) || detail.related_transaction_hashes.some((item) => typeof item !== 'string'))) failures.push(`${overlay.id}: related_transaction_hashes must be a string array`);
    amount(detail.reported_frozen_amount, `${overlay.id}: reported_frozen_amount`);
    amount(detail.related_flow, `${overlay.id}: related_flow`);
    if (detail.verification_status && !verificationStatuses.has(detail.verification_status)) failures.push(`${overlay.id}: invalid verification_status ${detail.verification_status}`);
    if (detail.event_subtype === 'address_blacklisting' && detail.blacklist_transaction_hash === null && detail.verification_status !== 'onchain_details_pending') failures.push(`${overlay.id}: missing blacklist hash requires onchain_details_pending`);
  }
  if (overlay.event_detail_kind === 'issuer_control' && !overlay.issuer_control_detail) failures.push(`${overlay.id}: issuer_control kind requires issuer_control_detail`);
}

for (const event of events) if (!overlayById.has(event.id)) failures.push(`missing event overlay for ${event.id}`);
if (overlayById.size !== eventById.size) failures.push(`event overlay count ${overlayById.size} does not match event count ${eventById.size}`);

if (failures.length) {
  console.error('Stablecoin event v2 validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Stablecoin event v2 validation passed: ${overlays.length} overlays for ${events.length} events.`);
