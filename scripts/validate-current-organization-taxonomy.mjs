import fs from 'node:fs';
import path from 'node:path';
import {
  functionalRoleLabels,
  getJurisdictionScope,
  getLegalFormState,
  getPublicOrganizationCategory,
  getRegulatoryCharacter,
  jurisdictionScopes,
  organizationTypeCategoryMap,
  organizationTypeRegulatoryCharacterMap,
  publicOrganizationCategories,
  regulatoryCharacters,
  relationshipStatusLabels
} from '../config/organization-taxonomy.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readRows = (file) => { const value = JSON.parse(readText(file)); if (Array.isArray(value)) return value; if (Array.isArray(value.records)) return value.records; throw new Error(`${file}: expected rows`); };
const countBy = (rows, getter) => Object.fromEntries([...rows.reduce((map, row) => { const raw = getter(row); const values = Array.isArray(raw) ? raw : [raw]; for (const value of values) { const key = value ?? 'unknown'; map.set(key, (map.get(key) ?? 0) + 1); } return map; }, new Map()).entries()].sort(([a],[b]) => String(a).localeCompare(String(b))));

const baseline = loadRegistryV2Baseline(root);
const organizations = baseline.data_groups.organizations.flatMap(readRows);
const relationships = baseline.data_groups.relationships.flatMap(readRows);
const organizationIds = new Set(organizations.map((row) => row.id));
const organizationSlugs = new Set(organizations.map((row) => row.slug));
const relationshipIds = new Set(relationships.map((row) => row.id));
const relationshipsByOrganization = new Map();
for (const row of relationships) {
  const list = relationshipsByOrganization.get(row.organization_id) ?? [];
  list.push(row);
  relationshipsByOrganization.set(row.organization_id, list);
}

check(organizations.length === baseline.minimum_counts.organizations, 'organization count must match current baseline minimum');
check(relationships.length === baseline.minimum_counts.relationships, 'relationship count must match current baseline minimum');
check(organizationIds.size === organizations.length, 'organization ids must be unique');
check(organizationSlugs.size === organizations.length, 'organization slugs must be unique');
check(relationshipIds.size === relationships.length, 'relationship ids must be unique');
check(relationships.every((row) => organizationIds.has(row.organization_id)), 'every relationship must reference a canonical organization');
check(organizations.every((row) => relationshipsByOrganization.has(row.id)), 'every organization must have at least one relationship');

for (const list of [publicOrganizationCategories, regulatoryCharacters, jurisdictionScopes]) {
  check(new Set(list.map((entry) => entry.value)).size === list.length, 'taxonomy values must be unique');
  check(new Set(list.map((entry) => entry.public_label)).size === list.length, 'taxonomy labels must be unique');
  check(new Set(list.map((entry) => entry.sort_order)).size === list.length, 'taxonomy sort orders must be unique');
}
const categoryValues = new Set(publicOrganizationCategories.map((entry) => entry.value));
const regulatoryValues = new Set(regulatoryCharacters.map((entry) => entry.value));
const jurisdictionValues = new Set(jurisdictionScopes.map((entry) => entry.value));
for (const type of new Set(organizations.map((row) => row.organization_type))) {
  check(Boolean(organizationTypeCategoryMap[type]), `unmapped organization category: ${type}`);
  check(Boolean(organizationTypeRegulatoryCharacterMap[type]), `unmapped regulatory character: ${type}`);
}
for (const role of new Set(relationships.map((row) => row.role))) check(Boolean(functionalRoleLabels[role]), `unmapped functional role: ${role}`);
for (const status of new Set(relationships.map((row) => row.status ?? 'unknown'))) check(Boolean(relationshipStatusLabels[status]), `unmapped relationship status: ${status}`);

const records = organizations.map((organization) => {
  const related = relationshipsByOrganization.get(organization.id) ?? [];
  const publicCategory = getPublicOrganizationCategory(organization.organization_type);
  const regulatoryCharacter = getRegulatoryCharacter(organization.organization_type);
  const jurisdictionScope = getJurisdictionScope(organization.jurisdiction);
  const legalFormState = getLegalFormState(organization);
  check(categoryValues.has(publicCategory) && publicCategory !== 'unknown', `${organization.id}: invalid organization category ${publicCategory}`);
  check(regulatoryValues.has(regulatoryCharacter) && regulatoryCharacter !== 'unknown', `${organization.id}: invalid regulatory character ${regulatoryCharacter}`);
  check(jurisdictionValues.has(jurisdictionScope), `${organization.id}: invalid jurisdiction scope ${jurisdictionScope}`);
  check(['recorded','not_recorded','unknown'].includes(legalFormState), `${organization.id}: invalid legal-form state`);
  check(typeof organization.confidence === 'string' && organization.confidence.length > 0, `${organization.id}: confidence missing`);
  return {
    id:organization.id,
    public_organization_category:publicCategory,
    regulatory_character:regulatoryCharacter,
    jurisdiction_scope:jurisdictionScope,
    legal_form_state:legalFormState,
    functional_roles:[...new Set(related.map((row) => row.role))].sort(),
    relationship_statuses:[...new Set(related.map((row) => row.status ?? 'unknown'))].sort()
  };
});

for (const [file, tokens] of Object.entries({
  'src/pages/issuers/index.astro':['getPublicOrganizationCategoryFilterOptions','getRegulatoryCharacterFilterOptions','getJurisdictionScopeFilterOptions','resolveOrganizationTaxonomy','data-organization-category'],
  'src/pages/issuer/[slug].astro':['resolveOrganizationTaxonomy','getFunctionalRoleLabel','getRelationshipStatusLabel'],
  'src/lib/machine-readable.ts':['public_organization_category','organization_regulatory_character','organization_jurisdiction_scope']
})) {
  const source = readText(file);
  for (const token of tokens) check(source.includes(token), `${file}: normalization token missing: ${token}`);
}

const report = {
  schema_version:'1.0', checked_at:new Date().toISOString(), organizations:organizations.length, relationships:relationships.length,
  category_counts:countBy(records, (row) => row.public_organization_category),
  regulatory_counts:countBy(records, (row) => row.regulatory_character),
  jurisdiction_counts:countBy(records, (row) => row.jurisdiction_scope),
  legal_form_counts:countBy(records, (row) => row.legal_form_state),
  role_counts:countBy(relationships, (row) => row.role),
  relationship_status_counts:countBy(relationships, (row) => row.status), failures
};
fs.mkdirSync(path.join(root, 'data/generated'), { recursive:true });
fs.writeFileSync(path.join(root, 'data/generated/organization-taxonomy-validation.json'), `${JSON.stringify(report, null, 2)}\n`);
if (failures.length) { console.error('Organization taxonomy normalization failed:'); failures.forEach((message) => console.error(`- ${message}`)); process.exit(1); }
console.log(JSON.stringify({ ...report, ok:true }, null, 2));
