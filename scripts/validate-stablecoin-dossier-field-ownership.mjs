import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const inputPath = path.join(root, 'data/generated/stablecoin-dossier-hierarchy.json');
const outputPath = path.join(root, 'data/generated/stablecoin-dossier-field-ownership-validation.json');
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

check(fs.existsSync(inputPath), 'stablecoin dossier hierarchy output is missing');
if (!fs.existsSync(inputPath)) {
  console.error(failures.join('\n'));
  process.exit(1);
}

const hierarchy = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const fields = hierarchy.field_matrix ?? [];
const inSection = (sectionId) => fields.filter((field) => field.destination_section === sectionId);
const identityFields = inSection('identity_current_state');
const organizationFields = inSection('organizations_control');
const mechanicsFields = inSection('how_asset_works');
const deploymentFields = inSection('deployments_legal_context');
const historyFields = inSection('history');
const evidenceFields = inSection('evidence');
const unknownFields = inSection('known_unknowns');
const moreFields = inSection('corrections_further_reading');
const hasLabel = (rows, label) => rows.some((field) => field.current_label === label || field.public_label === label);
const hasId = (rows, id) => rows.some((field) => field.field_id === id);

check(hasLabel(identityFields, 'Name'), 'Identity section must own canonical name');
check(hasLabel(identityFields, 'Summary'), 'Identity section must own public summary');
check(hasLabel(identityFields, 'Lifecycle status'), 'Identity section must own lifecycle status');
check(hasLabel(identityFields, 'Issuance status'), 'Identity section must own issuance status');
check(hasLabel(identityFields, 'Last reviewed'), 'Identity section must own record-level Last reviewed');
check(!hasLabel(unknownFields, 'Last reviewed'), 'Known unknowns must not own record-level Last reviewed');

check(hasLabel(organizationFields, 'Organization'), 'Organizations section must preserve every relationship organization');
check(hasLabel(organizationFields, 'Role'), 'Organizations section must preserve relationship roles');
check(hasLabel(organizationFields, 'Relationship status'), 'Organizations section must preserve relationship status');
check(hasLabel(organizationFields, 'Governance'), 'Organizations section must preserve governance context');

for (const label of ['Reference target', 'Public backing model', 'Primary stabilization mechanism', 'Current status', 'Settlement asset']) {
  check(hasLabel(mechanicsFields, label), `How it works must preserve ${label}`);
}

for (const label of ['Operational state', 'Canonicality', 'Verification state', 'Contract identity state', 'Network record state']) {
  check(hasLabel(deploymentFields, label), `Deployments and legal context must preserve ${label}`);
}
check(hasLabel(deploymentFields, 'Authority / publisher'), 'Deployments and legal context must preserve regulatory authority or publisher');

for (const label of ['Category', 'Subtype', 'Status effect', 'Recovery']) {
  check(hasLabel(historyFields, label), `History must preserve ${label}`);
}

for (const label of ['Source category', 'Provenance', 'Primary or secondary', 'Supported claims', 'Archive', 'Reliability']) {
  check(hasLabel(evidenceFields, label), `Evidence must preserve ${label}`);
}
check(hasId(evidenceFields, 'evidence.published_at'), 'Evidence must preserve publication date');

for (const label of ['Topic', 'What remains unclear', 'Value state', 'Priority', 'Last checked']) {
  check(hasLabel(unknownFields, label), `Known unknowns must preserve ${label}`);
}

for (const id of ['further_reading.related_registry', 'further_reading.guides', 'further_reading.corrections', 'further_reading.methodology', 'further_reading.machine_readable']) {
  check(hasId(moreFields, id), `Corrections and further reading is missing ${id}`);
}

const validation = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  section_field_counts: {
    identity_current_state: identityFields.length,
    organizations_control: organizationFields.length,
    how_asset_works: mechanicsFields.length,
    deployments_legal_context: deploymentFields.length,
    history: historyFields.length,
    evidence: evidenceFields.length,
    known_unknowns: unknownFields.length,
    corrections_further_reading: moreFields.length
  },
  failures
};

fs.writeFileSync(outputPath, `${JSON.stringify(validation, null, 2)}\n`);
if (failures.length > 0) {
  console.error(JSON.stringify(validation, null, 2));
  process.exit(1);
}
console.log(JSON.stringify(validation, null, 2));
