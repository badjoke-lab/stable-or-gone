import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.join(process.cwd(), 'data');
const failures = [];
const eventDetailKinds = new Set(['depeg','regulatory','reserve_change','redemption_change','migration','other']);
const depegRecoveryStatuses = new Set(['recovered','partially_recovered','not_recovered','collapsed','unknown']);

function readArray(file) {
  try {
    const value = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
    if (!Array.isArray(value)) failures.push(`${file}: expected array`);
    return Array.isArray(value) ? value : [];
  } catch (error) {
    failures.push(`${file}: ${error.message}`);
    return [];
  }
}

function dateOrNull(value, label) {
  if (value === null || value === undefined || value === '') return;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) failures.push(`${label}: expected YYYY-MM-DD or null`);
}

function requireStringArray(value, label) {
  if (!Array.isArray(value) || value.length === 0 || value.some((item) => typeof item !== 'string')) failures.push(`${label}: expected non-empty string array`);
}

const stablecoins = [...readArray('stablecoins.json'), ...readArray('stablecoins-extra.json')];
const organizations = readArray('organizations.json');
const events = [...readArray('events.json'), ...readArray('events-pr036.json'), ...readArray('events-pr037.json'), ...readArray('events-pr038.json')];
const overlays = readArray('event-details-v2.json');

const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const eventById = new Map(events.map((row) => [row.id, row]));
const overlayById = new Map();

for (const overlay of overlays) {
  if (!overlay.id) { failures.push('event overlay row missing id'); continue; }
  if (overlayById.has(overlay.id)) failures.push(`duplicate event overlay id: ${overlay.id}`);
  overlayById.set(overlay.id, overlay);
  const event = eventById.get(overlay.id);
  if (!event) { failures.push(`event overlay references missing event: ${overlay.id}`); continue; }

  requireStringArray(overlay.subject_stablecoin_ids, `${overlay.id}: subject_stablecoin_ids`);
  requireStringArray(overlay.subject_organization_ids, `${overlay.id}: subject_organization_ids`);
  for (const stablecoinId of overlay.subject_stablecoin_ids ?? []) if (!stablecoinIds.has(stablecoinId)) failures.push(`${overlay.id}: missing stablecoin ${stablecoinId}`);
  for (const organizationId of overlay.subject_organization_ids ?? []) if (!organizationIds.has(organizationId)) failures.push(`${overlay.id}: missing organization ${organizationId}`);
  if (event.stablecoin_id && !overlay.subject_stablecoin_ids.includes(event.stablecoin_id)) failures.push(`${overlay.id}: legacy stablecoin_id missing from subject_stablecoin_ids`);
  if (event.issuer_id && !overlay.subject_organization_ids.includes(event.issuer_id)) failures.push(`${overlay.id}: legacy issuer_id missing from subject_organization_ids`);

  if (!eventDetailKinds.has(overlay.event_detail_kind)) failures.push(`${overlay.id}: invalid event_detail_kind ${overlay.event_detail_kind}`);
  if (overlay.depeg_detail) {
    const detail = overlay.depeg_detail;
    if (detail.recovery_status && !depegRecoveryStatuses.has(detail.recovery_status)) failures.push(`${overlay.id}: invalid depeg recovery_status ${detail.recovery_status}`);
    dateOrNull(detail.recovery_date, `${overlay.id}: depeg_detail.recovery_date`);
    if (detail.price_source_ids !== undefined && (!Array.isArray(detail.price_source_ids) || detail.price_source_ids.some((item) => typeof item !== 'string'))) failures.push(`${overlay.id}: depeg_detail.price_source_ids must be a string array`);
  }
  if (overlay.regulatory_detail) {
    dateOrNull(overlay.regulatory_detail.effective_date, `${overlay.id}: regulatory_detail.effective_date`);
    dateOrNull(overlay.regulatory_detail.resolution_date, `${overlay.id}: regulatory_detail.resolution_date`);
  }
}

for (const event of events) if (!overlayById.has(event.id)) failures.push(`missing event overlay for ${event.id}`);
if (overlayById.size !== eventById.size) failures.push(`event overlay count ${overlayById.size} does not match event count ${eventById.size}`);

if (failures.length > 0) {
  console.error('Stablecoin event v2 validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Stablecoin event v2 validation passed: ${overlays.length} overlays for ${events.length} events.`);
