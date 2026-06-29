import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const warnings = [];
function readJson(relative) { try { return JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8')); } catch (error) { failures.push(`${relative}: ${error.message}`); return null; } }
function group(paths) { return (paths ?? []).flatMap((file) => { const value = readJson(file); if (!Array.isArray(value)) { failures.push(`${file}: expected array`); return []; } return value.map((row) => ({ ...row, __source_file: file })); }); }
function label(row) { return `${row.__source_file ?? 'unknown'}: ${row.id ?? row.slug ?? 'unknown'}`; }
function stringArray(row, field) { const value = row[field]; if (value !== undefined && (!Array.isArray(value) || value.some((item) => typeof item !== 'string'))) failures.push(`${label(row)} ${field} must be a string array`); }
function ids(row, field, known) { stringArray(row, field); for (const id of row[field] ?? []) if (!known.has(id)) failures.push(`${label(row)} ${field} references missing ID ${id}`); }
function date(row, field, value) { if (value !== undefined && value !== null && value !== '' && (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))) failures.push(`${label(row)} ${field} must be YYYY-MM-DD or null`); }

const baseline = loadRegistryV2Baseline(root);
const stablecoins = group(baseline.data_groups?.stablecoins);
const organizations = group(baseline.data_groups?.organizations);
const relationships = group(baseline.data_groups?.relationships);
const events = group(baseline.data_groups?.events);
const evidence = group(baseline.data_groups?.evidence);
const legacyIssuers = group([
  'data/issuers.json','data/issuers-extra.json','data/issuers-batch-b.json','data/issuers-batch-c.json','data/issuers-batch-d.json','data/issuers-batch-e.json','data/issuers-batch-f.json','data/issuers-batch-g.json','data/issuers-batch-h.json','data/issuers-batch-i.json','data/issuers-batch-j.json','data/issuers-batch-k.json','data/issuers-batch-l.json','data/issuers-batch-m.json','data/issuers-batch-n.json','data/issuers-batch-o.json','data/issuers-batch-p.json','data/issuers-batch-q.json','data/issuers-batch-r.json'
]);

const stablecoinIds = new Set(stablecoins.map((row) => row.id));
const organizationIds = new Set(organizations.map((row) => row.id));
const eventIds = new Set(events.map((row) => row.id));
const evidenceIds = new Set(evidence.map((row) => row.id));
const legacyById = new Map(legacyIssuers.map((row) => [row.id, row]));

for (const organization of organizations) {
  const legacy = legacyById.get(organization.id);
  if (!legacy) failures.push(`${label(organization)} has no legacy issuer compatibility record`);
  else if (legacy.slug !== organization.slug) failures.push(`${label(organization)} slug conflicts with legacy ${legacy.slug}`);
}
for (const legacy of legacyIssuers) if (!organizationIds.has(legacy.id)) failures.push(`${label(legacy)} missing from organization groups`);

const relationshipsByStablecoin = new Map();
for (const relationship of relationships) {
  if (!stablecoinIds.has(relationship.stablecoin_id)) failures.push(`${label(relationship)} missing stablecoin ${relationship.stablecoin_id}`);
  if (!organizationIds.has(relationship.organization_id)) failures.push(`${label(relationship)} missing organization ${relationship.organization_id}`);
  date(relationship, 'start_date', relationship.start_date);
  date(relationship, 'end_date', relationship.end_date);
  ids(relationship, 'evidence_ids', evidenceIds);
  const list = relationshipsByStablecoin.get(relationship.stablecoin_id) ?? [];
  list.push(relationship);
  relationshipsByStablecoin.set(relationship.stablecoin_id, list);
}
for (const stablecoin of stablecoins) {
  const related = relationshipsByStablecoin.get(stablecoin.id) ?? [];
  if (!related.length) failures.push(`${label(stablecoin)} has no organization relationship`);
  if (stablecoin.issuer_id && !related.some((relationship) => relationship.organization_id === stablecoin.issuer_id)) failures.push(`${label(stablecoin)} issuer_id missing from relationships`);
}
for (const event of events) {
  ids(event, 'subject_stablecoin_ids', stablecoinIds);
  ids(event, 'subject_organization_ids', organizationIds);
  ids(event, 'evidence_ids', evidenceIds);
  if (event.stablecoin_id && Array.isArray(event.subject_stablecoin_ids) && !event.subject_stablecoin_ids.includes(event.stablecoin_id)) failures.push(`${label(event)} legacy stablecoin_id missing from subject array`);
  if (event.issuer_id && Array.isArray(event.subject_organization_ids) && !event.subject_organization_ids.includes(event.issuer_id)) failures.push(`${label(event)} legacy issuer_id missing from organization_ids`);
}
for (const source of evidence) {
  ids(source, 'stablecoin_ids', stablecoinIds);
  ids(source, 'organization_ids', organizationIds);
  ids(source, 'event_ids', eventIds);
  stringArray(source, 'claim_scopes');
  if (source.stablecoin_id && Array.isArray(source.stablecoin_ids) && !source.stablecoin_ids.includes(source.stablecoin_id)) failures.push(`${label(source)} legacy stablecoin_id missing from stablecoin_ids`);
  if (source.issuer_id && Array.isArray(source.organization_ids) && !source.organization_ids.includes(source.issuer_id)) failures.push(`${label(source)} legacy issuer_id missing from organization_ids`);
  if (source.event_id && Array.isArray(source.event_ids) && !source.event_ids.includes(source.event_id)) failures.push(`${label(source)} legacy event_id missing from event_ids`);
}

if (failures.length) {
  console.error('Registry v2 compatibility validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(`Registry v2 compatibility validation passed: ${stablecoins.length} stablecoins, ${organizations.length} organizations, ${relationships.length} relationships, ${events.length} events, ${evidence.length} evidence records, ${warnings.length} warnings.`);
