import fs from 'node:fs';
import path from 'node:path';
import {
  dossierPolicies,
  dossierSections,
  dossierSurfaceFiles,
  syntheticDossierFields
} from '../config/stablecoin-dossier-hierarchy.mjs';

const root = process.cwd();
const inputPath = path.join(root, 'data/generated/stablecoin-dossier-hierarchy.json');
const validationPath = path.join(root, 'data/generated/stablecoin-dossier-hierarchy-validation.json');
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

assert(fs.existsSync(inputPath), 'stablecoin dossier hierarchy output is missing');
if (!fs.existsSync(inputPath)) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const hierarchy = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const sections = hierarchy.dossier_sections ?? [];
const currentFields = hierarchy.current_field_matrix ?? [];
const syntheticFields = hierarchy.synthetic_field_matrix ?? [];
const allFields = hierarchy.field_matrix ?? [];
const expectedSectionIds = dossierSections.map((section) => section.id);
const sectionIds = new Set(expectedSectionIds);
const allowedDecisions = new Set(['keep', 'move', 'consolidate', 'replace', 'deprecate', 'add_contextual_link']);

assert(hierarchy.schema_version === '2.0', 'dossier hierarchy schema version must be 2.0');
assert(hierarchy.totals?.dossier_sections === 8, `expected 8 dossier sections, found ${hierarchy.totals?.dossier_sections}`);
assert(hierarchy.totals?.surface_files === dossierSurfaceFiles.length, 'surface file count mismatch');
assert(hierarchy.totals?.unique_current_field_surfaces === currentFields.length, 'current field surface count mismatch');
assert(hierarchy.totals?.synthetic_fields === syntheticDossierFields.length, 'synthetic field count mismatch');
assert(hierarchy.totals?.total_matrix_fields === allFields.length, 'complete field matrix count mismatch');
assert(hierarchy.totals?.unassigned_current_fields === 0, 'every current field surface must have a destination section');
assert(hierarchy.totals?.duplicate_field_ids === 0, 'dossier field ids must be unique');
assert(hierarchy.totals?.failures === 0, 'collector failures must be zero');
assert((hierarchy.failures ?? []).length === 0, 'collector failure list must be empty');
assert(JSON.stringify(sections.map((section) => section.id)) === JSON.stringify(expectedSectionIds), 'dossier section order is not approved');

for (const section of sections) {
  assert(sectionIds.has(section.id), `unknown dossier section ${section.id}`);
  assert(section.required === true, `${section.id}: dossier section must remain required`);
  assert(section.field_count > 0, `${section.id}: dossier section has no assigned fields`);
  assert(typeof section.purpose === 'string' && section.purpose.length > 0, `${section.id}: section purpose is missing`);
  assert(typeof section.local_nav_label === 'string' && section.local_nav_label.length > 0, `${section.id}: local navigation label is missing`);
}

const fieldIds = new Set();
for (const field of allFields) {
  assert(typeof field.field_id === 'string' && field.field_id.length > 0, 'dossier field id is missing');
  assert(!fieldIds.has(field.field_id), `duplicate dossier field id: ${field.field_id}`);
  fieldIds.add(field.field_id);
  assert(sectionIds.has(field.destination_section), `${field.field_id}: invalid destination section ${field.destination_section}`);
  assert(allowedDecisions.has(field.decision), `${field.field_id}: invalid decision ${field.decision}`);
  assert(field.required === true, `${field.field_id}: required dossier field was weakened`);
}

for (const field of currentFields) {
  assert(typeof field.current_surface === 'string' && field.current_surface.length > 0, `${field.field_id}: current surface is missing`);
  assert(typeof field.source_file === 'string' && dossierSurfaceFiles.includes(field.source_file), `${field.field_id}: source file is not an approved dossier surface`);
  assert(field.render_occurrences > 0, `${field.field_id}: render occurrence count must be positive`);
}

assert(dossierPolicies.implementation_deferred === false, 'R4 dossier implementation may not be marked deferred');
assert(dossierPolicies.implementation_starts_at_pr === 415, 'dossier implementation start PR must remain recorded');
assert(dossierPolicies.current_remediation_pr === 439, 'current dossier remediation PR must be 439');
assert(dossierPolicies.route_changes_allowed === false, 'R4 must not change routes');
assert(dossierPolicies.evidence_section_required === true, 'Evidence section must remain mandatory');
assert(dossierPolicies.known_unknowns_section_required === true, 'Known unknowns section must remain mandatory');
assert(dossierPolicies.corrections_section_required === true, 'Related records and corrections must remain mandatory');
assert(dossierPolicies.all_relationships_required === true, 'All organization relationships must remain reachable');
assert(dossierPolicies.current_and_historical_data_must_remain_distinct === true, 'Current and historical data must remain distinct');
assert(dossierPolicies.primary_facts_are_summaries_not_replacement_fields === true, 'Primary facts must remain summaries rather than replacement fields');
assert(dossierPolicies.primary_fact_limit === 6, 'R4 primary fact limit must be six');
assert(dossierPolicies.initial_event_limit === 5, 'R4 initial event limit must be five');
assert(dossierPolicies.initial_evidence_limit === 10, 'R4 initial Evidence limit must be ten');
assert(dossierPolicies.organization_primary_column_limit === 5, 'R4 organization primary column limit must be five');
assert(dossierPolicies.mobile_secondary_sections_closed === true, 'R4 secondary sections must close on mobile');
assert(dossierPolicies.deployment_axes_must_remain_separate.length === 8, 'all eight deployment axes must remain separate');
assert(dossierPolicies.evidence_axes_must_remain_separate.length === 8, 'all eight evidence axes must remain separate');
assert(dossierPolicies.evidence_axes_must_remain_separate.includes('published_at'), 'Evidence publication date must remain a separate axis');

const inSection = (sectionId) => allFields.filter((field) => field.destination_section === sectionId);
const hasLabel = (rows, label) => rows.some((field) => field.current_label === label || field.public_label === label);
const hasId = (rows, id) => rows.some((field) => field.field_id === id);
const identityFields = inSection('identity_current_state');
const organizationFields = inSection('organizations_control');
const mechanicsFields = inSection('how_asset_works');
const historyFields = inSection('history');
const deploymentFields = inSection('deployments_legal_context');
const unknownFields = inSection('known_unknowns');
const evidenceFields = inSection('evidence');
const correctionFields = inSection('corrections_further_reading');

for (const label of ['Name', 'Summary', 'Lifecycle', 'Issuance', 'Last reviewed']) assert(hasLabel(identityFields, label), `Overview must preserve ${label}`);
for (const label of ['Reference', 'Backing', 'Redemption / exit', 'Stabilization', 'Reserve components']) assert(hasLabel(mechanicsFields, label), `Reserves and technical model must preserve ${label}`);
for (const label of ['Organization', 'Role', 'Jurisdiction', 'State']) assert(hasLabel(organizationFields, label), `Organizations must preserve ${label}`);
for (const id of ['history.event_date', 'history.event_type', 'history.event_title', 'history.event_description']) assert(hasId(historyFields, id), `Events section is missing ${id}`);
for (const label of ['Network', 'Operational state', 'Canonicality', 'Verification state', 'Contract identity state', 'Network record state']) assert(hasLabel(deploymentFields, label), `Deployments must preserve ${label}`);
for (const label of ['Topic', 'What remains unclear', 'Value state', 'Priority', 'Last checked']) assert(hasLabel(unknownFields, label), `Known unknowns must preserve ${label}`);
for (const label of ['Source category', 'Provenance', 'Primary or secondary', 'Supported claims', 'Archive', 'Reliability', 'Published']) assert(hasLabel(evidenceFields, label), `Evidence must preserve ${label}`);
for (const id of ['further_reading.related_registry', 'further_reading.guides', 'further_reading.corrections', 'further_reading.methodology', 'further_reading.machine_readable']) assert(hasId(correctionFields, id), `Related records and corrections is missing ${id}`);

const deprecatedFields = allFields.filter((field) => field.decision === 'deprecate');
assert(deprecatedFields.length === 0, 'R4 may not silently deprecate a field');

const validation = {
  schema_version: '2.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    dossier_sections: sections.length,
    current_field_surfaces: currentFields.length,
    synthetic_fields: syntheticFields.length,
    total_matrix_fields: allFields.length,
    failures: failures.length
  },
  policies: dossierPolicies,
  failures
};

fs.writeFileSync(validationPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length > 0) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(validation, null, 2));
