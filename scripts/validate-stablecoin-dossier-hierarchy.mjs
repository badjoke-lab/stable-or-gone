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
const sectionIds = new Set(dossierSections.map((section) => section.id));
const allowedDecisions = new Set(['keep', 'move', 'consolidate', 'replace', 'deprecate', 'add_contextual_link']);

assert(hierarchy.schema_version === '1.0', 'dossier hierarchy schema version must be 1.0');
assert(hierarchy.totals?.dossier_sections === 8, `expected 8 dossier sections, found ${hierarchy.totals?.dossier_sections}`);
assert(hierarchy.totals?.surface_files === dossierSurfaceFiles.length, 'surface file count mismatch');
assert(hierarchy.totals?.unique_current_field_surfaces === currentFields.length, 'current field surface count mismatch');
assert(hierarchy.totals?.synthetic_fields === syntheticDossierFields.length, 'synthetic field count mismatch');
assert(hierarchy.totals?.total_matrix_fields === allFields.length, 'complete field matrix count mismatch');
assert(hierarchy.totals?.unassigned_current_fields === 0, 'every current field surface must have a destination section');
assert(hierarchy.totals?.duplicate_field_ids === 0, 'dossier field ids must be unique');
assert(hierarchy.totals?.failures === 0, 'collector failures must be zero');
assert((hierarchy.failures ?? []).length === 0, 'collector failure list must be empty');
assert(sections.length === 8, 'dossier section matrix must contain eight rows');
assert(JSON.stringify(sections.map((section) => section.id)) === JSON.stringify([
  'identity_current_state',
  'organizations_control',
  'how_asset_works',
  'deployments_legal_context',
  'history',
  'evidence',
  'known_unknowns',
  'corrections_further_reading'
]), 'dossier section order is not approved');

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
  assert(field.required === true, `${field.field_id}: all current PR 18 fields must remain required until a dedicated deprecation is approved`);
}

for (const field of currentFields) {
  assert(typeof field.current_surface === 'string' && field.current_surface.length > 0, `${field.field_id}: current surface is missing`);
  assert(typeof field.source_file === 'string' && dossierSurfaceFiles.includes(field.source_file), `${field.field_id}: source file is not an approved dossier surface`);
  assert(field.render_occurrences > 0, `${field.field_id}: render occurrence count must be positive`);
}

assert(dossierPolicies.implementation_deferred === true, 'PR 18 must remain a specification-only migration');
assert(dossierPolicies.implementation_starts_at_pr === 23, 'dossier implementation must remain deferred to PR 23');
assert(dossierPolicies.route_changes_allowed === false, 'PR 18 must not change routes');
assert(dossierPolicies.evidence_section_required === true, 'Evidence section must remain mandatory');
assert(dossierPolicies.known_unknowns_section_required === true, 'Known unknowns section must remain mandatory');
assert(dossierPolicies.corrections_section_required === true, 'Corrections and further reading section must remain mandatory');
assert(dossierPolicies.all_relationships_required === true, 'All organization relationships must remain reachable');
assert(dossierPolicies.deployment_axes_must_remain_separate.length === 8, 'all eight deployment axes must remain separate');
assert(dossierPolicies.evidence_axes_must_remain_separate.length === 7, 'all seven evidence axes must remain separate');

const evidenceFields = allFields.filter((field) => field.destination_section === 'evidence');
const unknownFields = allFields.filter((field) => field.destination_section === 'known_unknowns');
const correctionFields = allFields.filter((field) => field.destination_section === 'corrections_further_reading');
assert(evidenceFields.length > 0, 'Evidence section must contain mapped fields');
assert(unknownFields.length > 0, 'Known unknowns section must contain mapped fields');
assert(correctionFields.some((field) => field.field_id === 'further_reading.corrections'), 'Corrections section must include a contextual correction link');
assert(correctionFields.some((field) => field.field_id === 'further_reading.methodology'), 'Corrections section must include methodology access');
assert(correctionFields.some((field) => field.field_id === 'further_reading.machine_readable'), 'Corrections section must include machine-readable access');

const organizationFields = allFields.filter((field) => field.destination_section === 'organizations_control');
assert(organizationFields.some((field) => field.current_label === 'Organization'), 'Organizations section must contain all relationship rows');
assert(organizationFields.some((field) => field.current_label === 'Relationship status'), 'Organizations section must preserve relationship state');
const deploymentFields = allFields.filter((field) => field.destination_section === 'deployments_legal_context');
for (const label of ['Operational state', 'Canonicality', 'Verification state', 'Contract identity state', 'Network record state']) {
  assert(deploymentFields.some((field) => field.current_label === label), `Deployments section must preserve ${label}`);
}
const sourceFields = allFields.filter((field) => field.destination_section === 'evidence');
for (const label of ['Source category', 'Provenance', 'Primary or secondary', 'Supported claims', 'Archive', 'Reliability']) {
  assert(sourceFields.some((field) => field.current_label === label), `Evidence section must preserve ${label}`);
}

const deprecatedFields = allFields.filter((field) => field.decision === 'deprecate');
assert(deprecatedFields.length === 0, 'PR 18 must not deprecate a current field without a dedicated replacement decision');

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  totals: {
    dossier_sections: sections.length,
    current_field_surfaces: currentFields.length,
    synthetic_fields: syntheticFields.length,
    total_matrix_fields: allFields.length,
    evidence_fields: evidenceFields.length,
    known_unknown_fields: unknownFields.length,
    correction_and_reading_fields: correctionFields.length,
    deprecated_fields: deprecatedFields.length,
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
