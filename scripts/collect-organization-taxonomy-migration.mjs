import fs from 'node:fs';
import path from 'node:path';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();

function readRows(relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or { records: [] }`);
}

function countBy(rows, getter) {
  const counts = new Map();
  for (const row of rows) {
    const raw = getter(row);
    const values = Array.isArray(raw) ? raw : [raw];
    for (const value of values) {
      const key = value === null || value === undefined || value === '' ? 'missing' : String(value);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

const baseline = loadRegistryV2Baseline(root);
const organizationFiles = baseline.data_groups.organizations;
const relationshipFiles = baseline.data_groups.relationships;
const organizations = organizationFiles.flatMap((file) => readRows(file).map((row) => ({ ...row, __source_file: file })));
const relationships = relationshipFiles.flatMap((file) => readRows(file).map((row) => ({ ...row, __source_file: file })));
const relationshipsByOrganization = new Map();

for (const relationship of relationships) {
  const rows = relationshipsByOrganization.get(relationship.organization_id) ?? [];
  rows.push(relationship);
  relationshipsByOrganization.set(relationship.organization_id, rows);
}

const records = organizations.map((organization) => {
  const related = relationshipsByOrganization.get(organization.id) ?? [];
  const roles = [...new Set(related.map((row) => row.role).filter(Boolean))].sort();
  const statuses = [...new Set(related.map((row) => row.status).filter(Boolean))].sort();
  const stablecoinIds = [...new Set(related.map((row) => row.stablecoin_id).filter(Boolean))].sort();
  const rawKeys = Object.keys(organization).filter((key) => key !== '__source_file').sort();

  return {
    id: organization.id,
    slug: organization.slug,
    name: organization.name,
    source_file: organization.__source_file,
    organization_type: organization.organization_type ?? null,
    legacy_issuer_type: organization.legacy_issuer_type ?? organization.issuer_type ?? null,
    legal_form: organization.legal_form ?? null,
    jurisdiction: organization.jurisdiction ?? null,
    regulatory_character: organization.regulatory_character ?? null,
    confidence: organization.confidence ?? null,
    official_url: organization.official_url ?? null,
    roles,
    role_count: roles.length,
    relationship_statuses: statuses,
    relationship_count: related.length,
    stablecoin_ids: stablecoinIds,
    stablecoin_count: stablecoinIds.length,
    raw_keys: rawKeys,
    implementation_facing_type: typeof organization.organization_type === 'string'
      && (organization.organization_type.includes('_') || organization.organization_type.includes('or')),
    legacy_type_differs: Boolean(
      organization.organization_type
      && (organization.legacy_issuer_type ?? organization.issuer_type)
      && organization.organization_type !== (organization.legacy_issuer_type ?? organization.issuer_type)
    )
  };
}).sort((a, b) => a.id.localeCompare(b.id));

const organizationIds = new Set(organizations.map((row) => row.id));
const relationshipIds = new Set(relationships.map((row) => row.id).filter(Boolean));
const output = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  baseline_id: baseline.baseline_id,
  organization_count: organizations.length,
  relationship_count: relationships.length,
  missing_organization_ids: relationships.filter((row) => !organizationIds.has(row.organization_id)).map((row) => row.id ?? `${row.organization_id}:${row.stablecoin_id}`),
  duplicate_organization_ids: organizations.map((row) => row.id).filter((id, index, values) => values.indexOf(id) !== index),
  duplicate_organization_slugs: organizations.map((row) => row.slug).filter((slug, index, values) => values.indexOf(slug) !== index),
  duplicate_relationship_ids: relationships.filter((row) => row.id).map((row) => row.id).filter((id, index, values) => values.indexOf(id) !== index),
  relationships_without_ids: relationships.filter((row) => !row.id).map((row) => `${row.organization_id}:${row.stablecoin_id}:${row.role}`),
  missing_organization_type_ids: records.filter((row) => !row.organization_type).map((row) => row.id),
  missing_legacy_type_ids: records.filter((row) => !row.legacy_issuer_type).map((row) => row.id),
  missing_legal_form_ids: records.filter((row) => !row.legal_form).map((row) => row.id),
  missing_jurisdiction_ids: records.filter((row) => !row.jurisdiction).map((row) => row.id),
  unknown_jurisdiction_ids: records.filter((row) => row.jurisdiction === 'unknown').map((row) => row.id),
  missing_regulatory_character_ids: records.filter((row) => !row.regulatory_character).map((row) => row.id),
  organizations_without_relationships: records.filter((row) => row.relationship_count === 0).map((row) => row.id),
  organizations_with_multiple_roles: records.filter((row) => row.role_count > 1),
  implementation_facing_type_records: records.filter((row) => row.implementation_facing_type),
  legacy_type_difference_records: records.filter((row) => row.legacy_type_differs),
  organization_type_counts: countBy(records, (row) => row.organization_type),
  legacy_issuer_type_counts: countBy(records, (row) => row.legacy_issuer_type),
  legal_form_counts: countBy(records, (row) => row.legal_form),
  jurisdiction_counts: countBy(records, (row) => row.jurisdiction),
  regulatory_character_counts: countBy(records, (row) => row.regulatory_character),
  confidence_counts: countBy(records, (row) => row.confidence),
  relationship_role_counts: countBy(relationships, (row) => row.role),
  relationship_status_counts: countBy(relationships, (row) => row.status),
  relationship_start_date_presence: countBy(relationships, (row) => row.start_date ? 'known' : 'missing'),
  relationship_end_date_presence: countBy(relationships, (row) => row.end_date ? 'known' : 'missing'),
  relationship_id_count: relationshipIds.size,
  records
};

const outputPath = path.join(root, 'data/generated/organization-taxonomy-migration.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);

console.log(JSON.stringify({
  ok: output.missing_organization_ids.length === 0
    && output.duplicate_organization_ids.length === 0
    && output.duplicate_organization_slugs.length === 0
    && output.duplicate_relationship_ids.length === 0
    && output.missing_organization_type_ids.length === 0,
  organization_count: output.organization_count,
  relationship_count: output.relationship_count,
  organization_type_counts: output.organization_type_counts,
  legacy_issuer_type_counts: output.legacy_issuer_type_counts,
  relationship_role_counts: output.relationship_role_counts,
  relationship_status_counts: output.relationship_status_counts,
  unknown_jurisdiction_count: output.unknown_jurisdiction_ids.length,
  missing_legal_form_count: output.missing_legal_form_ids.length,
  missing_regulatory_character_count: output.missing_regulatory_character_ids.length,
  multi_role_organization_count: output.organizations_with_multiple_roles.length,
  implementation_facing_type_count: output.implementation_facing_type_records.length,
  missing_organization_ids: output.missing_organization_ids,
  duplicate_organization_ids: output.duplicate_organization_ids,
  duplicate_organization_slugs: output.duplicate_organization_slugs,
  duplicate_relationship_ids: output.duplicate_relationship_ids,
  relationships_without_ids: output.relationships_without_ids,
  organizations_without_relationships: output.organizations_without_relationships
}, null, 2));
