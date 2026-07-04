import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import {
  primaryDisplayRolePriority,
  primaryDisplayStatusPriority,
  resolvePrimaryDisplayRelationship
} from '../config/primary-display-relationships.mjs';

const root = process.cwd();
const absolute = (relativePath) => path.join(root, relativePath);
const readJson = (relativePath) => JSON.parse(fs.readFileSync(absolute(relativePath), 'utf8'));
const loadFiles = (files = []) => files.flatMap((file) => readJson(file).map((row) => ({ ...row, __source_file: file })));
const normalize = (value) => String(value ?? '').normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '');
const normalizedUrl = (value) => {
  if (!value) return null;
  try {
    const url = new URL(value);
    url.hash = '';
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, '');
    if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '');
    return url.toString();
  } catch {
    return null;
  }
};
const normalizedHost = (value) => {
  try { return new URL(value).hostname.toLowerCase().replace(/^www\./, ''); }
  catch { return null; }
};
const groupBy = (rows, keyFn) => {
  const map = new Map();
  for (const row of rows) {
    const key = keyFn(row);
    if (!key) continue;
    const values = map.get(key) ?? [];
    values.push(row);
    map.set(key, values);
  }
  return map;
};
const duplicates = (rows, keyFn) => [...groupBy(rows, keyFn).entries()].filter(([, values]) => values.length > 1);
const sortedUnique = (values) => [...new Set(values.filter(Boolean))].sort();
const countBy = (values) => values.reduce((counts, value) => {
  const key = value ?? 'unknown';
  counts[key] = (counts[key] ?? 0) + 1;
  return counts;
}, {});

const baseline = loadRegistryV2Baseline(root);
const stablecoins = loadFiles(baseline.data_groups.stablecoins ?? []);
const organizations = loadFiles(baseline.data_groups.organizations ?? []);
const relationships = loadFiles(baseline.data_groups.relationships ?? []);

const stablecoinById = new Map(stablecoins.map((row) => [row.id, row]));
const organizationById = new Map(organizations.map((row) => [row.id, row]));
const relationshipsByStablecoin = groupBy(relationships, (row) => row.stablecoin_id);
const relationshipsByOrganization = groupBy(relationships, (row) => row.organization_id);

const critical = [];
const warnings = [];
const observations = [];

for (const [id, rows] of duplicates(organizations, (row) => row.id)) critical.push(`duplicate organization id ${id}: ${rows.map((row) => row.name).join(', ')}`);
for (const [slug, rows] of duplicates(organizations, (row) => row.slug)) critical.push(`duplicate organization slug ${slug}: ${rows.map((row) => row.id).join(', ')}`);
for (const [name, rows] of duplicates(organizations, (row) => normalize(row.name))) critical.push(`normalized organization name collision ${name}: ${rows.map((row) => row.id).join(', ')}`);
for (const [id, rows] of duplicates(relationships, (row) => row.id)) critical.push(`duplicate relationship id ${id}: ${rows.length} rows`);
for (const [key, rows] of duplicates(relationships, (row) => [row.stablecoin_id, row.organization_id, row.role, row.status ?? 'unknown', row.start_date ?? '', row.end_date ?? ''].join('|'))) {
  critical.push(`duplicate relationship semantic edge ${key}: ${rows.map((row) => row.id).join(', ')}`);
}

const invalidOrganizationUrls = [];
const organizationsWithoutOfficialUrl = [];
for (const organization of organizations) {
  if (!organization.official_url) organizationsWithoutOfficialUrl.push(organization.id);
  else if (!normalizedUrl(organization.official_url)) invalidOrganizationUrls.push({ organization_id: organization.id, official_url: organization.official_url });
}
for (const row of invalidOrganizationUrls) critical.push(`${row.organization_id} has invalid official_url ${row.official_url}`);

const exactSharedUrls = duplicates(
  organizations.filter((row) => normalizedUrl(row.official_url)),
  (row) => normalizedUrl(row.official_url)
).map(([url, rows]) => ({ url, organization_ids: rows.map((row) => row.id).sort(), names: rows.map((row) => row.name).sort() }));
for (const group of exactSharedUrls) warnings.push(`exact official URL ${group.url} is shared by ${group.organization_ids.join(', ')}`);

const sharedHosts = duplicates(
  organizations.filter((row) => normalizedHost(row.official_url)),
  (row) => normalizedHost(row.official_url)
).map(([host, rows]) => ({ host, organization_ids: rows.map((row) => row.id).sort(), names: rows.map((row) => row.name).sort() }));

const invalidRelationships = [];
const endedWithoutEndDate = [];
const activeWithEndDate = [];
const startAfterEnd = [];
const invalidRoles = [];
const invalidStatuses = [];
for (const relationship of relationships) {
  if (!stablecoinById.has(relationship.stablecoin_id)) invalidRelationships.push(`${relationship.id}: missing stablecoin ${relationship.stablecoin_id}`);
  if (!organizationById.has(relationship.organization_id)) invalidRelationships.push(`${relationship.id}: missing organization ${relationship.organization_id}`);
  if (!primaryDisplayRolePriority.includes(relationship.role)) invalidRoles.push(`${relationship.id}: ${relationship.role}`);
  const status = relationship.status ?? 'unknown';
  if (!primaryDisplayStatusPriority.includes(status)) invalidStatuses.push(`${relationship.id}: ${status}`);
  if (status === 'active' && relationship.end_date) activeWithEndDate.push(relationship.id);
  if (status === 'ended' && !relationship.end_date) endedWithoutEndDate.push(relationship.id);
  if (relationship.start_date && relationship.end_date && relationship.start_date > relationship.end_date) startAfterEnd.push(relationship.id);
}
for (const message of invalidRelationships) critical.push(message);
for (const message of invalidRoles) critical.push(`invalid relationship role ${message}`);
for (const message of invalidStatuses) critical.push(`invalid relationship status ${message}`);
for (const id of activeWithEndDate) critical.push(`${id}: active relationship has an end date`);
for (const id of startAfterEnd) critical.push(`${id}: relationship start date is after end date`);
for (const id of endedWithoutEndDate) warnings.push(`${id}: ended relationship has no supported end date`);

const stablecoinsWithoutRelationship = stablecoins.filter((coin) => !(relationshipsByStablecoin.get(coin.id)?.length));
for (const coin of stablecoinsWithoutRelationship) critical.push(`${coin.id}: no organization relationship`);

const issuerCompatibilityGaps = [];
for (const coin of stablecoins) {
  if (!coin.issuer_id) continue;
  const rows = relationshipsByStablecoin.get(coin.id) ?? [];
  if (!rows.some((row) => row.organization_id === coin.issuer_id)) {
    issuerCompatibilityGaps.push({ stablecoin_id: coin.id, issuer_id: coin.issuer_id, relationship_ids: rows.map((row) => row.id) });
    critical.push(`${coin.id}: legacy issuer_id ${coin.issuer_id} is not represented in canonical relationships`);
  }
}

const primarySelections = [];
const ambiguousPrimarySelections = [];
const invalidPrimarySelections = [];
for (const coin of stablecoins) {
  const candidates = relationshipsByStablecoin.get(coin.id) ?? [];
  const resolution = resolvePrimaryDisplayRelationship(coin.id, relationships);
  if (!resolution.valid) invalidPrimarySelections.push({ stablecoin_id: coin.id, mode: resolution.selection_mode, tied_ids: resolution.tied_top_relationship_ids });
  if (resolution.selection_mode === 'ambiguous_requires_override') ambiguousPrimarySelections.push({ stablecoin_id: coin.id, tied_ids: resolution.tied_top_relationship_ids });
  primarySelections.push({
    stablecoin_id: coin.id,
    relationship_count: candidates.length,
    selected_relationship_id: resolution.relationship?.id ?? null,
    selected_organization_id: resolution.relationship?.organization_id ?? null,
    selected_role: resolution.relationship?.role ?? null,
    selected_status: resolution.relationship?.status ?? 'unknown',
    selection_mode: resolution.selection_mode,
    valid: resolution.valid
  });
}
for (const row of invalidPrimarySelections) critical.push(`${row.stablecoin_id}: invalid primary display selection ${row.mode} (${row.tied_ids.join(', ')})`);

const multiActiveLegalIssuerAssets = [];
const activeRoleConflicts = [];
for (const coin of stablecoins) {
  const active = (relationshipsByStablecoin.get(coin.id) ?? []).filter((row) => row.status === 'active');
  const legalIssuers = active.filter((row) => row.role === 'legal_issuer');
  if (legalIssuers.length > 1) multiActiveLegalIssuerAssets.push({ stablecoin_id: coin.id, relationship_ids: legalIssuers.map((row) => row.id), organization_ids: legalIssuers.map((row) => row.organization_id) });
  const sameOrgRoleGroups = duplicates(active, (row) => `${row.organization_id}|${row.role}`);
  for (const [key, rows] of sameOrgRoleGroups) activeRoleConflicts.push({ stablecoin_id: coin.id, key, relationship_ids: rows.map((row) => row.id) });
}
for (const row of multiActiveLegalIssuerAssets) warnings.push(`${row.stablecoin_id}: multiple active legal issuers ${row.organization_ids.join(', ')}`);
for (const row of activeRoleConflicts) critical.push(`${row.stablecoin_id}: duplicate active organization-role edge ${row.key}: ${row.relationship_ids.join(', ')}`);

const orphanOrganizations = organizations.filter((organization) => !(relationshipsByOrganization.get(organization.id)?.length));
for (const organization of orphanOrganizations) warnings.push(`${organization.id}: organization is not referenced by any stablecoin relationship`);

const relationshipStatusCounts = countBy(relationships.map((row) => row.status ?? 'unknown'));
const relationshipRoleCounts = countBy(relationships.map((row) => row.role ?? 'unknown'));
const organizationTypeCounts = countBy(organizations.map((row) => row.organization_type ?? 'unknown'));
const primaryRoleCounts = countBy(primarySelections.map((row) => row.selected_role ?? 'unknown'));
const primaryStatusCounts = countBy(primarySelections.map((row) => row.selected_status ?? 'unknown'));

observations.push(`Audited ${organizations.length} organizations and ${relationships.length} stablecoin-organization relationships across ${stablecoins.length} assets.`);
observations.push(`${organizationsWithoutOfficialUrl.length} organizations have no official_url recorded.`);
observations.push(`${sharedHosts.length} official-domain hosts are shared across more than one organization record.`);
observations.push(`${orphanOrganizations.length} organizations are not referenced by current canonical relationships.`);
observations.push(`${endedWithoutEndDate.length} ended relationships preserve an unresolved end-date boundary.`);

const report = {
  schema_version: '1.0',
  audit_id: 'sog_registry_100_organization_relationship_pr298',
  baseline_id: baseline.baseline_id,
  audited_counts: {
    stable_assets: stablecoins.length,
    organizations: organizations.length,
    relationships: relationships.length
  },
  organizations: {
    type_counts: organizationTypeCounts,
    without_official_url: organizationsWithoutOfficialUrl,
    invalid_official_urls: invalidOrganizationUrls,
    exact_shared_official_urls: exactSharedUrls,
    shared_official_hosts: sharedHosts,
    orphan_organizations: orphanOrganizations.map((row) => ({ id: row.id, slug: row.slug, name: row.name, organization_type: row.organization_type }))
  },
  relationships: {
    status_counts: relationshipStatusCounts,
    role_counts: relationshipRoleCounts,
    ended_without_end_date: endedWithoutEndDate,
    active_with_end_date: activeWithEndDate,
    start_after_end: startAfterEnd,
    issuer_compatibility_gaps: issuerCompatibilityGaps,
    multi_active_legal_issuer_assets: multiActiveLegalIssuerAssets,
    duplicate_active_role_edges: activeRoleConflicts
  },
  primary_display: {
    role_counts: primaryRoleCounts,
    status_counts: primaryStatusCounts,
    ambiguous_selections: ambiguousPrimarySelections,
    invalid_selections: invalidPrimarySelections,
    selections: primarySelections
  },
  findings: { critical, warnings, observations },
  result: critical.length === 0 ? 'pass_with_review_warnings' : 'fail'
};

const lines = [
  '# SOG 100-Record Organization and Relationship Integrity Audit',
  '',
  `- Audit ID: \`${report.audit_id}\``,
  `- Baseline: \`${report.baseline_id}\``,
  `- Stable assets: **${stablecoins.length}**`,
  `- Organizations: **${organizations.length}**`,
  `- Relationships: **${relationships.length}**`,
  `- Critical findings: **${critical.length}**`,
  `- Review warnings: **${warnings.length}**`,
  '',
  '## Primary Display Integrity',
  '',
  `- Invalid selections: ${invalidPrimarySelections.length}`,
  `- Ambiguous selections: ${ambiguousPrimarySelections.length}`,
  `- Selected role counts: \`${JSON.stringify(primaryRoleCounts)}\``,
  `- Selected status counts: \`${JSON.stringify(primaryStatusCounts)}\``,
  '',
  '## Organization Source Boundaries',
  '',
  `- Organizations without official URL: ${organizationsWithoutOfficialUrl.length}`,
  `- Invalid official URLs: ${invalidOrganizationUrls.length}`,
  `- Exact shared official URLs: ${exactSharedUrls.length}`,
  `- Shared official hosts: ${sharedHosts.length}`,
  `- Orphan organizations: ${orphanOrganizations.length}`,
  '',
  '## Relationship Boundaries',
  '',
  `- Ended relationships without supported end date: ${endedWithoutEndDate.length}`,
  `- Active relationships with end date: ${activeWithEndDate.length}`,
  `- Start-after-end relationships: ${startAfterEnd.length}`,
  `- Legacy issuer compatibility gaps: ${issuerCompatibilityGaps.length}`,
  `- Multiple-active-legal-issuer assets: ${multiActiveLegalIssuerAssets.length}`,
  '',
  '## Critical Findings',
  '',
  ...(critical.length ? critical.map((message) => `- ${message}`) : ['- None.']),
  '',
  '## Review Warnings',
  '',
  ...(warnings.length ? warnings.map((message) => `- ${message}`) : ['- None.']),
  '',
  '## Observations',
  '',
  ...observations.map((message) => `- ${message}`),
  '',
  '## Result',
  '',
  critical.length === 0
    ? 'PASS. Organization identity, relationship references, role/status enums, temporal consistency, issuer compatibility coverage, and primary-display selection are structurally valid. Review warnings remain explicit for unresolved source and boundary questions.'
    : 'FAIL. Critical organization or relationship findings must be resolved before PR #298 can close.',
  ''
];

const jsonPath = 'data/generated/registry-organization-relationship-audit.json';
const markdownPath = 'docs/audits/registry-100-organization-relationship-audit.md';
fs.mkdirSync(path.dirname(absolute(jsonPath)), { recursive: true });
fs.mkdirSync(path.dirname(absolute(markdownPath)), { recursive: true });
fs.writeFileSync(absolute(jsonPath), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(absolute(markdownPath), lines.join('\n'));

console.log(JSON.stringify({
  audit_id: report.audit_id,
  result: report.result,
  organizations: organizations.length,
  relationships: relationships.length,
  critical: critical.length,
  warnings: warnings.length,
  without_official_url: organizationsWithoutOfficialUrl.length,
  orphan_organizations: orphanOrganizations.length,
  ambiguous_primary_selections: ambiguousPrimarySelections.length
}, null, 2));

if (critical.length) process.exit(1);
