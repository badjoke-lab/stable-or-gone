import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import {
  dossierPolicies,
  dossierSections,
  dossierSurfaceFiles,
  syntheticDossierFields
} from '../config/stablecoin-dossier-hierarchy.mjs';

const root = process.cwd();
const outputPath = path.join(root, 'data/generated/stablecoin-dossier-hierarchy.json');
const failures = [];
const sectionIds = new Set(dossierSections.map((section) => section.id));

function normalizeLabel(value) {
  return String(value ?? '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function defaultSectionForFile(file) {
  if (file.endsWith('StablecoinReserveSection.astro')) return 'how_asset_works';
  if (file.endsWith('StablecoinOrganizationsControl.astro')) return 'organizations_control';
  if (file.endsWith('StablecoinHistorySection.astro')) return 'history';
  if (file.endsWith('DeploymentTable.astro')) return 'deployments_legal_context';
  if (file.endsWith('EvidenceSourceTable.astro')) return 'evidence';
  if (file.endsWith('StablecoinRelatedSection.astro')) return 'corrections_further_reading';
  return 'identity_current_state';
}

function sectionForHeading(label, fallback) {
  const normalized = normalizeLabel(label).toLowerCase();
  if (/current state|overview/.test(normalized)) return 'identity_current_state';
  if (/reserve|redemption|technical model|how the asset works/.test(normalized)) return 'how_asset_works';
  if (/organization|control/.test(normalized)) return 'organizations_control';
  if (/material event|history|lifecycle/.test(normalized)) return 'history';
  if (/deployment|legal context|regulatory|official notice|blockchain/.test(normalized)) return 'deployments_legal_context';
  if (/known unknown|open question|coverage limit/.test(normalized)) return 'known_unknowns';
  if (/evidence|source/.test(normalized)) return 'evidence';
  if (/related record|correction|further reading|next step/.test(normalized)) return 'corrections_further_reading';
  return fallback;
}

function sectionForField(file, currentSection, label) {
  const normalized = normalizeLabel(label);

  if (file.endsWith('StablecoinDossierHeader.astro')) {
    if (['Reference', 'Backing', 'Redemption / exit'].includes(normalized)) return 'how_asset_works';
    if (normalized === 'Primary organization') return 'organizations_control';
    if (normalized === 'Evidence') return 'evidence';
    return 'identity_current_state';
  }

  if (file.endsWith('StablecoinDetailView.astro')) {
    if (['Stabilization', 'Reference target', 'Reference kind', 'Comparison category', 'Target value', 'Reference methodology', 'Public backing model', 'Canonical backing types', 'Reserve component categories', 'Primary stabilization mechanism', 'Recorded model description', 'Redemption / exit model', 'Valuation source', 'Yield / rebase profile', 'Classification notes'].includes(normalized)) return 'how_asset_works';
    if (normalized === 'Open questions' || ['Coverage area', 'Entries'].includes(normalized)) return 'known_unknowns';
    return currentSection;
  }

  if (file.endsWith('StablecoinOrganizationsControl.astro')) return 'organizations_control';
  if (file.endsWith('StablecoinHistorySection.astro')) return 'history';
  if (file.endsWith('StablecoinReserveSection.astro')) return 'how_asset_works';
  if (file.endsWith('DeploymentTable.astro')) return 'deployments_legal_context';
  if (file.endsWith('EvidenceSourceTable.astro')) return 'evidence';
  if (file.endsWith('StablecoinRelatedSection.astro')) return 'corrections_further_reading';
  return currentSection;
}

function collectFileSurfaces(file) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) {
    failures.push(`missing dossier surface file: ${file}`);
    return { sections: [], fields: [] };
  }

  const source = fs.readFileSync(absolute, 'utf8');
  const pattern = /<summary[^>]*class="[^"]*stablecoin-r4-section-summary[^"]*"[^>]*>[\s\S]*?<strong>([^<{][^<]*)<\/strong>[\s\S]*?<\/summary>|<div class="bar">([^<{][^<]*)<\/div>|<div class="stablecoin-section-heading">[\s\S]*?<h2>([^<{][^<]*)<\/h2>[\s\S]*?<\/div>|<th>([^<{][^<]*)<\/th>|<dt>([^<{][^<]*)<\/dt>/g;
  const sections = [];
  const fields = [];
  let currentSection = defaultSectionForFile(file);
  let match;

  while ((match = pattern.exec(source)) !== null) {
    const sectionLabel = match[1] ?? match[2] ?? match[3];
    if (sectionLabel) {
      const normalized = normalizeLabel(sectionLabel);
      currentSection = sectionForHeading(normalized, currentSection);
      sections.push({ file, label: normalized, section_id: currentSection, source_index: match.index });
      continue;
    }

    const label = normalizeLabel(match[4] ?? match[5]);
    const destinationSection = sectionForField(file, currentSection, label);
    if (!sectionIds.has(destinationSection)) failures.push(`invalid dossier section ${destinationSection} for ${file}|${label}`);
    fields.push({
      surface_key: `${file}|${destinationSection}|${label}`,
      file,
      current_section: currentSection,
      current_label: label,
      kind: match[5] ? 'definition_term' : 'table_header',
      destination_section: destinationSection,
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

const fieldMatrix = [...groupedFields.values()].map((field) => ({
  field_id: `surface.${slugify(field.file.replace('src/components/', '').replace('.astro', ''))}.${slugify(field.destination_section)}.${slugify(field.current_label)}`,
  current_surface: field.surface_key,
  source_file: field.file,
  current_section: field.current_section,
  current_label: field.current_label,
  kind: field.kind,
  render_occurrences: field.render_occurrences,
  destination_section: field.destination_section,
  decision: 'keep',
  required: true,
  value_state: true
})).sort((left, right) => left.source_file.localeCompare(right.source_file) || left.destination_section.localeCompare(right.destination_section) || left.current_label.localeCompare(right.current_label));

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
  schema_version: '2.0',
  generated_at: new Date().toISOString(),
  implementation_boundary: {
    specification_only: dossierPolicies.implementation_deferred,
    implementation_starts_at_pr: dossierPolicies.implementation_starts_at_pr,
    current_remediation_pr: dossierPolicies.current_remediation_pr,
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
