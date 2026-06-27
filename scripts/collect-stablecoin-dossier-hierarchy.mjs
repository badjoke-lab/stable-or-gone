import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import {
  blockSectionAssignments,
  dossierPolicies,
  dossierSections,
  dossierSurfaceFiles,
  fieldDecisionOverrides,
  fieldSectionOverrides,
  syntheticDossierFields
} from '../config/stablecoin-dossier-hierarchy.mjs';

const root = process.cwd();
const outputPath = path.join(root, 'data/generated/stablecoin-dossier-hierarchy.json');
const failures = [];
const sectionIds = new Set(dossierSections.map((section) => section.id));

function normalizeLabel(value) {
  return value.replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function defaultSectionForFile(file) {
  if (file.endsWith('IssuerControlEvents.astro')) return 'Issuer controls and intervention history';
  if (file.endsWith('EvidenceSourceTable.astro')) return 'embedded';
  return 'embedded';
}

function collectFileSurfaces(file) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) {
    failures.push(`missing dossier surface file: ${file}`);
    return { sections: [], fields: [] };
  }

  const source = fs.readFileSync(absolute, 'utf8');
  const pattern = /<div class="bar">([^<{][^<]*)<\/div>|<th>([^<{][^<]*)<\/th>|<div class="stat"><span>([^<{][^<]*)<\/span>/g;
  const sections = [];
  const fields = [];
  let currentSection = defaultSectionForFile(file);
  let match;
  while ((match = pattern.exec(source)) !== null) {
    if (match[1]) {
      currentSection = normalizeLabel(match[1]);
      sections.push({ file, label: currentSection, source_index: match.index });
      continue;
    }
    const label = normalizeLabel(match[2] ?? match[3]);
    const section = match[3] ? 'Hero metrics' : currentSection;
    const kind = match[3] ? 'hero_metric' : 'table_header';
    fields.push({
      surface_key: `${file}|${section}|${label}`,
      file,
      current_section: section,
      current_label: label,
      kind,
      source_index: match.index
    });
  }

  return { sections, fields };
}

const rawSections = [];
const rawFields = [];
for (const file of dossierSurfaceFiles) {
  const collected = collectFileSurfaces(file);
  rawSections.push(...collected.sections);
  rawFields.push(...collected.fields);
}

const groupedFields = new Map();
for (const field of rawFields) {
  const existing = groupedFields.get(field.surface_key);
  if (existing) {
    existing.render_occurrences += 1;
    existing.source_indices.push(field.source_index);
  } else {
    groupedFields.set(field.surface_key, {
      ...field,
      render_occurrences: 1,
      source_indices: [field.source_index]
    });
  }
}

const fieldMatrix = [...groupedFields.values()].map((field) => {
  const blockKey = `${field.file}|${field.current_section}`;
  const destinationSection = fieldSectionOverrides[field.surface_key] ?? blockSectionAssignments[blockKey] ?? null;
  if (!destinationSection) failures.push(`unassigned dossier field surface: ${field.surface_key}`);
  if (destinationSection && !sectionIds.has(destinationSection)) failures.push(`invalid destination section ${destinationSection} for ${field.surface_key}`);
  return {
    field_id: `surface.${slugify(field.file.replace('src/components/', '').replace('.astro', ''))}.${slugify(field.current_section)}.${slugify(field.current_label)}`,
    current_surface: field.surface_key,
    source_file: field.file,
    current_section: field.current_section,
    current_label: field.current_label,
    kind: field.kind,
    render_occurrences: field.render_occurrences,
    destination_section: destinationSection,
    decision: fieldDecisionOverrides[field.surface_key] ?? 'move',
    required: true,
    value_state: field.kind === 'table_header'
  };
}).sort((left, right) => left.source_file.localeCompare(right.source_file) || left.current_section.localeCompare(right.current_section) || left.current_label.localeCompare(right.current_label));

const syntheticMatrix = syntheticDossierFields.map((field) => ({ ...field, synthetic: true }));
for (const field of syntheticMatrix) {
  if (!sectionIds.has(field.destination_section)) failures.push(`invalid synthetic destination section ${field.destination_section} for ${field.field_id}`);
}

const completeMatrix = [...fieldMatrix, ...syntheticMatrix];
const fieldIds = completeMatrix.map((field) => field.field_id);
const duplicateFieldIds = [...new Set(fieldIds.filter((id, index) => fieldIds.indexOf(id) !== index))].sort();
if (duplicateFieldIds.length > 0) failures.push(`duplicate dossier field ids: ${duplicateFieldIds.join(', ')}`);

const sectionMatrix = dossierSections.map((section) => {
  const fields = completeMatrix.filter((field) => field.destination_section === section.id);
  return {
    ...section,
    field_count: fields.length,
    required_field_count: fields.filter((field) => field.required).length,
    current_surface_field_count: fields.filter((field) => !field.synthetic).length,
    synthetic_field_count: fields.filter((field) => field.synthetic).length,
    decisions: Object.fromEntries([...new Set(fields.map((field) => field.decision))].sort().map((decision) => [decision, fields.filter((field) => field.decision === decision).length]))
  };
});

const decisionValues = [...new Set(completeMatrix.map((field) => field.decision))].sort();
const inventoryDigest = createHash('sha256')
  .update(JSON.stringify({ dossierSections, dossierSurfaceFiles, rawSections, fieldMatrix, syntheticMatrix, dossierPolicies }))
  .digest('hex');

const output = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  implementation_boundary: {
    specification_only: dossierPolicies.implementation_deferred,
    implementation_starts_at_pr: dossierPolicies.implementation_starts_at_pr,
    route_changes_allowed: dossierPolicies.route_changes_allowed
  },
  totals: {
    dossier_sections: dossierSections.length,
    surface_files: dossierSurfaceFiles.length,
    current_section_labels: rawSections.length,
    raw_field_occurrences: rawFields.length,
    unique_current_field_surfaces: fieldMatrix.length,
    synthetic_fields: syntheticMatrix.length,
    total_matrix_fields: completeMatrix.length,
    unassigned_current_fields: fieldMatrix.filter((field) => !field.destination_section).length,
    duplicate_field_ids: duplicateFieldIds.length,
    required_sections: dossierSections.filter((section) => section.required).length,
    required_fields: completeMatrix.filter((field) => field.required).length,
    failures: failures.length
  },
  dossier_sections: sectionMatrix,
  current_section_surfaces: rawSections,
  current_field_matrix: fieldMatrix,
  synthetic_field_matrix: syntheticMatrix,
  field_matrix: completeMatrix,
  decision_counts: Object.fromEntries(decisionValues.map((decision) => [decision, completeMatrix.filter((field) => field.decision === decision).length])),
  policies: dossierPolicies,
  failures,
  inventory_digest: `sha256:${inventoryDigest}`
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
console.log(JSON.stringify(output.totals, null, 2));
if (failures.length > 0) process.exitCode = 1;
