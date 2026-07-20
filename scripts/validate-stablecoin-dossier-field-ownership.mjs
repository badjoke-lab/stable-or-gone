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
const hasLabel = (rows, label) => rows.some((field) => field.current_label === label || field.public_label === label);
const hasId = (rows, id) => rows.some((field) => field.field_id === id);

const identityFields = inSection('identity_current_state');
const mechanicsFields = inSection('how_asset_works');
const organizationFields = inSection('organizations_control');
const historyFields = inSection('history');
const deploymentFields = inSection('deployments_legal_context');
const unknownFields = inSection('known_unknowns');
const evidenceFields = inSection('evidence');
const moreFields = inSection('corrections_further_reading');

for (const label of ['Name', 'Summary', 'Lifecycle', 'Issuance', 'Last reviewed']) {
  check(hasLabel(identityFields, label), `Overview and current state must own ${label}`);
}
check(!hasLabel(unknownFields, 'Last reviewed'), 'Known unknowns must not own record-level Last reviewed');

for (const label of ['Reference', 'Backing', 'Redemption / exit', 'Stabilization', 'Reserve components', 'Current status', 'Settlement asset']) {
  check(hasLabel(mechanicsFields, label), `Reserves, redemption, and technical model must own ${label}`);
}

for (const label of ['Organization', 'Role', 'Jurisdiction', 'Period', 'State', 'Governance']) {
  check(hasLabel(organizationFields, label), `Organizations and control must own ${label}`);
}

for (const id of ['history.event_date', 'history.event_type', 'history.event_title', 'history.event_description']) {
  check(hasId(historyFields, id), `Material events must own ${id}`);
}

for (const label of ['Network', 'Network record state', 'Operational state', 'Canonicality', 'Verification state', 'Contract identity state']) {
  check(hasLabel(deploymentFields, label), `Deployments and legal context must own ${label}`);
}
check(hasLabel(deploymentFields, 'Authority / publisher'), 'Deployments and legal context must preserve regulatory authority or publisher');

for (const label of ['Topic', 'What remains unclear', 'Value state', 'Priority', 'Last checked']) {
  check(hasLabel(unknownFields, label), `Known unknowns must own ${label}`);
}

for (const label of ['Source category', 'Provenance', 'Primary or secondary', 'Supported claims', 'Archive', 'Reliability', 'Published']) {
  check(hasLabel(evidenceFields, label), `Evidence must own ${label}`);
}

for (const id of ['further_reading.related_registry', 'further_reading.guides', 'further_reading.corrections', 'further_reading.methodology', 'further_reading.machine_readable']) {
  check(hasId(moreFields, id), `Related records and corrections is missing ${id}`);
}

const validation = {
  schema_version: '2.0',
  generated_at: new Date().toISOString(),
  ok: failures.length === 0,
  section_field_counts: {
    identity_current_state: identityFields.length,
    how_asset_works: mechanicsFields.length,
    organizations_control: organizationFields.length,
    history: historyFields.length,
    deployments_legal_context: deploymentFields.length,
    known_unknowns: unknownFields.length,
    evidence: evidenceFields.length,
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
