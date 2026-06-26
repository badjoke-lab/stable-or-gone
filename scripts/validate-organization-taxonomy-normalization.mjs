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
const readText = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

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
      const key = value === null || value === undefined || value === '' ? 'unknown' : String(value);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

const baseline = loadRegistryV2Baseline(root);
const organizations = baseline.data_groups.organizations.flatMap(readRows);
const relationships = baseline.data_groups.relationships.flatMap(readRows);
const organizationIds = organizations.map((row) => row.id);
const organizationSlugs = organizations.map((row) => row.slug);
const relationshipIds = relationships.map((row) => row.id);
const organizationIdSet = new Set(organizationIds);
const relationshipsByOrganization = new Map();

for (const relationship of relationships) {
  const list = relationshipsByOrganization.get(relationship.organization_id) ?? [];
  list.push(relationship);
  relationshipsByOrganization.set(relationship.organization_id, list);
}

check(organizations.length === 86, `expected 86 organizations, found ${organizations.length}`);
check(relationships.length === 101, `expected 101 relationships, found ${relationships.length}`);
check(new Set(organizationIds).size === organizations.length, 'organization ids must be unique');
check(new Set(organizationSlugs).size === organizations.length, 'organization slugs must be unique');
check(new Set(relationshipIds).size === relationships.length, 'relationship ids must be unique');
check(relationshipIds.every(Boolean), 'every relationship must have an id');
check(relationships.every((row) => organizationIdSet.has(row.organization_id)), 'every relationship must reference a canonical organization');
check(organizations.every((row) => relationshipsByOrganization.has(row.id)), 'every organization must have at least one relationship');

for (const list of [publicOrganizationCategories, regulatoryCharacters, jurisdictionScopes]) {
  check(new Set(list.map((entry) => entry.value)).size === list.length, 'taxonomy values must be unique');
  check(new Set(list.map((entry) => entry.public_label)).size === list.length, 'taxonomy labels must be unique');
  check(new Set(list.map((entry) => entry.sort_order)).size === list.length, 'taxonomy sort orders must be unique');
  for (const entry of list) {
    check(typeof entry.value === 'string' && entry.value.length > 0, 'taxonomy value is required');
    check(typeof entry.public_label === 'string' && entry.public_label.length > 0, `${entry.value}: public label is required`);
    check(Number.isInteger(entry.sort_order) && entry.sort_order > 0, `${entry.value}: sort order must be a positive integer`);
  }
}

const categoryValues = new Set(publicOrganizationCategories.map((entry) => entry.value));
const regulatoryValues = new Set(regulatoryCharacters.map((entry) => entry.value));
const jurisdictionValues = new Set(jurisdictionScopes.map((entry) => entry.value));
const canonicalOrganizationTypes = new Set(organizations.map((row) => row.organization_type));
const canonicalRoles = new Set(relationships.map((row) => row.role));
const canonicalRelationshipStatuses = new Set(relationships.map((row) => row.status ?? 'unknown'));

for (const type of canonicalOrganizationTypes) {
  check(Boolean(type), 'organization_type must be present');
  check(Boolean(organizationTypeCategoryMap[type]), `unmapped organization_type category: ${type}`);
  check(Boolean(organizationTypeRegulatoryCharacterMap[type]), `unmapped organization_type regulatory character: ${type}`);
}
for (const [type, category] of Object.entries(organizationTypeCategoryMap)) {
  check(categoryValues.has(category), `${type}: unknown public organization category ${category}`);
}
for (const [type, character] of Object.entries(organizationTypeRegulatoryCharacterMap)) {
  check(regulatoryValues.has(character), `${type}: unknown regulatory character ${character}`);
}
for (const role of canonicalRoles) {
  check(Boolean(functionalRoleLabels[role]), `unmapped functional role: ${role}`);
}
for (const status of canonicalRelationshipStatuses) {
  check(Boolean(relationshipStatusLabels[status]), `unmapped relationship status: ${status}`);
}

const records = organizations.map((organization) => {
  const related = relationshipsByOrganization.get(organization.id) ?? [];
  const publicCategory = getPublicOrganizationCategory(organization.organization_type);
  const regulatoryCharacter = getRegulatoryCharacter(organization.organization_type);
  const jurisdictionScope = getJurisdictionScope(organization.jurisdiction);
  const legalFormState = getLegalFormState(organization);
  const roles = [...new Set(related.map((row) => row.role))].sort();
  const statuses = [...new Set(related.map((row) => row.status ?? 'unknown'))].sort();

  check(categoryValues.has(publicCategory), `${organization.id}: invalid public organization category ${publicCategory}`);
  check(publicCategory !== 'unknown', `${organization.id}: public organization category remains unknown`);
  check(regulatoryValues.has(regulatoryCharacter), `${organization.id}: invalid regulatory character ${regulatoryCharacter}`);
  check(regulatoryCharacter !== 'unknown', `${organization.id}: regulatory character remains unknown`);
  check(jurisdictionValues.has(jurisdictionScope), `${organization.id}: invalid jurisdiction scope ${jurisdictionScope}`);
  check(['recorded', 'not_recorded', 'unknown'].includes(legalFormState), `${organization.id}: invalid legal-form state ${legalFormState}`);
  check(typeof organization.confidence === 'string' && organization.confidence.length > 0, `${organization.id}: confidence is missing`);

  return {
    id: organization.id,
    organization_type: organization.organization_type,
    public_organization_category: publicCategory,
    legal_form_state: legalFormState,
    regulatory_character: regulatoryCharacter,
    jurisdiction_scope: jurisdictionScope,
    functional_roles: roles,
    relationship_statuses: statuses,
    relationship_count: related.length
  };
});

const categoryCounts = countBy(records, (row) => row.public_organization_category);
const regulatoryCounts = countBy(records, (row) => row.regulatory_character);
const jurisdictionCounts = countBy(records, (row) => row.jurisdiction_scope);
const legalFormCounts = countBy(records, (row) => row.legal_form_state);
const roleCounts = countBy(relationships, (row) => row.role);
const relationshipStatusCounts = countBy(relationships, (row) => row.status);
const multiRoleOrganizations = records.filter((row) => row.functional_roles.length > 1);

const expectedCategoryCounts = {
  bank_trust_or_credit_institution: 7,
  company_or_corporate_group: 27,
  dao_or_governance_body: 5,
  digital_asset_service_or_infrastructure: 6,
  fund_or_investment_vehicle: 1,
  network_or_ecosystem: 2,
  payment_or_e_money_institution: 5,
  product_or_brand_organization: 1,
  protocol_or_software_system: 31,
  reserve_or_special_purpose_body: 1
};
const expectedRegulatoryCounts = {
  not_recorded: 31,
  protocol_or_decentralized_system: 37,
  regulated_bank_or_credit_institution: 7,
  regulated_digital_asset_service: 5,
  regulated_fund_or_investment_vehicle: 1,
  regulated_payment_or_e_money: 5
};
const expectedJurisdictionCounts = {
  country_or_territory: 34,
  decentralized_or_protocol: 21,
  multi_jurisdiction: 7,
  unknown: 24
};
const expectedRoleCounts = {
  brand_owner: 5,
  custodian: 1,
  legal_issuer: 37,
  other: 1,
  protocol_operator: 53,
  reserve_manager: 2,
  technology_provider: 2
};
const expectedRelationshipStatusCounts = {
  active: 86,
  ended: 13,
  unknown: 2
};

check(JSON.stringify(categoryCounts) === JSON.stringify(expectedCategoryCounts), `public organization category counts changed: ${JSON.stringify(categoryCounts)}`);
check(JSON.stringify(regulatoryCounts) === JSON.stringify(expectedRegulatoryCounts), `regulatory character counts changed: ${JSON.stringify(regulatoryCounts)}`);
check(JSON.stringify(jurisdictionCounts) === JSON.stringify(expectedJurisdictionCounts), `jurisdiction scope counts changed: ${JSON.stringify(jurisdictionCounts)}`);
check(JSON.stringify(legalFormCounts) === JSON.stringify({ not_recorded: 86 }), `legal-form state counts changed: ${JSON.stringify(legalFormCounts)}`);
check(JSON.stringify(roleCounts) === JSON.stringify(expectedRoleCounts), `functional role counts changed: ${JSON.stringify(roleCounts)}`);
check(JSON.stringify(relationshipStatusCounts) === JSON.stringify(expectedRelationshipStatusCounts), `relationship status counts changed: ${JSON.stringify(relationshipStatusCounts)}`);
check(multiRoleOrganizations.length === 1 && multiRoleOrganizations[0].id === 'sog_issuer_m0_protocol', 'expected M0 Protocol to remain the current multi-role organization');

const indexSource = readText('src/pages/issuers/index.astro');
for (const token of [
  'getPublicOrganizationCategoryFilterOptions',
  'getRegulatoryCharacterFilterOptions',
  'getJurisdictionScopeFilterOptions',
  'getFunctionalRoleLabel',
  'getRelationshipStatusLabel',
  'resolveOrganizationTaxonomy',
  'data-organization-category',
  'data-organization-regulatory',
  'data-organization-jurisdiction',
  'data-organization-role',
  'data-organization-status'
]) {
  check(indexSource.includes(token), `organization index normalization token is missing: ${token}`);
}
for (const heading of ['Organization category', 'Regulatory character', 'Jurisdiction', 'Functional roles', 'Relationship state', 'Record confidence']) {
  check(indexSource.includes(`<th>${heading}</th>`), `organization index heading is missing: ${heading}`);
}
check(!indexSource.includes('<th>Type</th>'), 'legacy generic Type column remains on organization index');

const detailSource = readText('src/pages/issuer/[slug].astro');
for (const heading of [
  'Organization category',
  'Canonical organization type',
  'Legal form',
  'Legal-form state',
  'Regulatory character',
  'Jurisdiction',
  'Jurisdiction scope',
  'Functional roles',
  'Relationship states'
]) {
  check(detailSource.includes(`<th>${heading}</th>`), `organization detail heading is missing: ${heading}`);
}
check(detailSource.includes('resolveOrganizationTaxonomy'), 'organization detail must resolve normalized taxonomy');
check(detailSource.includes('getFunctionalRoleLabel'), 'organization detail must use functional role labels');
check(detailSource.includes('getRelationshipStatusLabel'), 'organization detail must use relationship status labels');
check(!detailSource.includes('<th>Type</th>'), 'legacy generic Type row remains on organization detail');

const machineSource = readText('src/lib/machine-readable.ts');
for (const key of [
  'public_organization_category',
  'canonical_organization_type',
  'organization_legal_form_state',
  'organization_regulatory_character',
  'organization_jurisdiction_scope',
  'functional_role',
  'relationship_status'
]) {
  check(machineSource.includes(`${key}: countValues`), `machine-readable organization breakdown is missing: ${key}`);
}
check(!machineSource.includes('organization_type: countValues'), 'machine-readable public breakdown must not expose generic organization_type as the unnamed public axis');
check(!machineSource.includes('relationship_role: countValues'), 'machine-readable public breakdown must use functional_role');

const statsSource = readText('scripts/generate-registry-stats.mjs');
for (const key of [
  'public_organization_categories:',
  'canonical_organization_types:',
  'organization_legal_form_states:',
  'organization_regulatory_characters:',
  'organization_jurisdiction_scopes:',
  'functional_roles:',
  'relationship_statuses:'
]) {
  check(statsSource.includes(key), `registry stats organization axis is missing: ${key}`);
}

const report = {
  schema_version: '1.0',
  checked_at: new Date().toISOString(),
  organizations: organizations.length,
  relationships: relationships.length,
  public_categories: publicOrganizationCategories.length,
  canonical_organization_type_counts: countBy(records, (row) => row.organization_type),
  public_organization_category_counts: categoryCounts,
  legal_form_state_counts: legalFormCounts,
  regulatory_character_counts: regulatoryCounts,
  jurisdiction_scope_counts: jurisdictionCounts,
  functional_role_counts: roleCounts,
  relationship_status_counts: relationshipStatusCounts,
  multi_role_organization_ids: multiRoleOrganizations.map((row) => row.id),
  records,
  failures
};

const reportPath = path.join(root, 'data/generated/organization-taxonomy-validation.json');
fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

if (failures.length > 0) {
  console.error('Organization taxonomy normalization failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(JSON.stringify({ ...report, ok: true, records: undefined }, null, 2));
