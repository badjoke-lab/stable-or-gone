import fs from 'node:fs';
import path from 'node:path';
import { buildEvidenceSourceIdentityStats } from './build-evidence-source-identity-stats.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { buildPrimaryDisplayRelationships } from './lib/primary-display-relationships.mjs';
import {
  getCanonicalDeploymentType,
  getDeploymentCanonicality,
  getDeploymentCanonicalityRecordState,
  getDeploymentChangeState,
  getDeploymentContractIdentityState,
  getDeploymentNetworkIdentityState,
  getDeploymentOperationalState,
  getDeploymentVerificationState,
  getPublicDeploymentCategory,
} from '../config/deployment-taxonomy.mjs';
import { getPublicEventCategory } from '../config/event-taxonomy.mjs';
import {
  getEvidenceArchiveState,
  getEvidencePrimaryState,
  getEvidenceProvenance,
  getEvidenceReliability,
  getPublicEvidenceCategory,
} from '../config/evidence-taxonomy.mjs';
import { getEvidenceRelationKind } from '../config/evidence-relation-kinds.mjs';
import {
  getOrganizationJurisdictionScope,
  getOrganizationLegalFormState,
  getOrganizationRegulatoryCharacter,
  getPublicOrganizationCategory,
} from '../config/organization-taxonomy.mjs';
import { getPublicModelCategory, getReferenceComparisonCategory } from '../config/public-taxonomy.mjs';
import { getPublicValueState } from '../config/value-states.mjs';

const root = process.cwd();
const dist = path.resolve(root, process.argv[2] ?? 'dist');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const unique = (items) => [...new Set(items.filter((item) => typeof item === 'string' && item.length > 0))].sort();
const countValues = (values) => Object.fromEntries([...values.reduce((counts, rawValue) => {
  const value = rawValue === null || rawValue === undefined || rawValue === '' ? 'unknown' : String(rawValue);
  counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}, new Map()).entries()].sort(([left], [right]) => left.localeCompare(right)));
const normalizeEvidence = (row) => ({
  ...row,
  stablecoin_ids: unique([...(row.stablecoin_ids ?? []), row.stablecoin_id]),
  organization_ids: unique([...(row.organization_ids ?? []), row.issuer_id]),
  event_ids: unique([...(row.event_ids ?? []), row.event_id]),
  claim_scopes: unique([...(row.claim_scopes ?? []), row.claim_scope]),
});
const rows = (file) => {
  const parsed = readJson(path.join(root, file));
  return Array.isArray(parsed) ? parsed : parsed.records;
};
const applyById = (base, ...overlays) => {
  const overlayById = new Map(overlays.flat().map((row) => [row.id, row]));
  return base.map((row) => ({ ...row, ...(overlayById.get(row.id) ?? {}) }));
};

const baseline = loadRegistryV2Baseline(root);
const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap(rows);
const stablecoins = applyById(group('stablecoins'), group('stablecoin_overrides'), group('classifications'), group('classification_extensions'), group('profiles'));
const organizations = group('organizations');
const relationships = group('relationships');
const events = applyById(group('events'), group('event_details'));
const evidence = group('evidence').map(normalizeEvidence);
const reserveReports = group('reserve_reports');
const knownUnknowns = group('known_unknowns');
const regulatoryNotes = group('regulatory_notes');
const deployments = group('deployments');
const registryUpdates = rows('data/registry-updates.json');
const evidenceIdentityStats = buildEvidenceSourceIdentityStats(root);
const primaryDisplayRelationships = buildPrimaryDisplayRelationships(root);
const primarySelections = primaryDisplayRelationships.selections ?? [];
const evidenceRelations = evidence.map((row) => ({
  evidence_id: row.id,
  stablecoin_ids: row.stablecoin_ids,
  organization_ids: row.organization_ids,
  event_ids: row.event_ids,
  claim_scopes: row.claim_scopes,
}));
const expected = {
  stablecoins: stablecoins.length,
  organizations: organizations.length,
  relationships: relationships.length,
  evidence_relations: evidenceIdentityStats.evidence_relations,
  evidence_source_identities: evidenceIdentityStats.public_source_identities,
  evidence_source_identity_groups: evidenceIdentityStats.source_identity_groups,
  evidence_source_aliases: evidenceIdentityStats.source_aliases,
  evidence_duplicate_public_rows_removed: evidenceIdentityStats.removed_public_duplicate_rows,
  evidence_canonical_relations: evidenceIdentityStats.evidence_relations,
  evidence_relation_source_identities: evidenceIdentityStats.relation_source_identities,
  evidence_orphan_relation_source_ids: evidenceIdentityStats.orphan_relation_source_ids.length,
  reserve_reports: reserveReports.length,
  known_unknowns: knownUnknowns.length,
  regulatory_notes: regulatoryNotes.length,
  deployments: deployments.length,
  lifecycle_status: countValues(stablecoins.map((row) => row.lifecycle_status)),
  issuance_status: countValues(stablecoins.map((row) => row.issuance_status)),
  reference_kind: countValues(stablecoins.map((row) => row.peg_reference?.kind)),
  reference_comparison_category: countValues(stablecoins.map((row) => getReferenceComparisonCategory(row.peg_reference))),
  public_model_category: countValues(stablecoins.map((row) => getPublicModelCategory(row))),
  backing_type_non_exclusive: countValues(stablecoins.flatMap((row) => row.backing_types ?? [])),
  stabilization_mechanism: countValues(stablecoins.map((row) => row.stabilization_mechanism)),
  asset_class: countValues(stablecoins.map((row) => row.asset_class)),
  public_organization_category: countValues(organizations.map((row) => getPublicOrganizationCategory(row.organization_type))),
  canonical_organization_type: countValues(organizations.map((row) => row.organization_type)),
  organization_legal_form_state: countValues(organizations.map((row) => getOrganizationLegalFormState(row.legal_form))),
  organization_regulatory_character: countValues(organizations.map((row) => getOrganizationRegulatoryCharacter(row.regulatory_character, row.organization_type))),
  organization_jurisdiction_scope: countValues(organizations.map((row) => getOrganizationJurisdictionScope(row.jurisdiction))),
  functional_role: countValues(relationships.map((row) => row.role)),
  relationship_status: countValues(relationships.map((row) => row.status)),
  primary_display_relationships: primarySelections.length,
  primary_display_explicit_overrides: primaryDisplayRelationships.explicit_override_count,
  primary_display_ambiguities: primaryDisplayRelationships.ambiguities?.length ?? 0,
  stablecoins_with_multiple_relationships: primaryDisplayRelationships.stablecoins_with_multiple_relationships,
  stablecoins_with_multiple_organizations: primaryDisplayRelationships.stablecoins_with_multiple_organizations,
  stablecoins_with_historical_relationships: primaryDisplayRelationships.stablecoins_with_historical_relationships,
  primary_display_selection_mode: countValues(primarySelections.map((row) => row.selection_mode)),
  primary_display_role: countValues(primarySelections.map((row) => row.selected_role)),
  primary_display_relationship_status: countValues(primarySelections.map((row) => row.selected_relationship_status)),
  primary_display_organization_category: countValues(primarySelections.map((row) => row.selected_organization_public_category)),
  public_event_category: countValues(events.map((row) => getPublicEventCategory(row.event_type))),
  canonical_event_subtype: countValues(events.map((row) => row.event_type)),
  event_detail_kind: countValues(events.map((row) => row.event_kind)),
  event_status_effect_category: countValues(events.map((row) => row.status_effect)),
  event_recovery_category: countValues(events.map((row) => row.recovery?.category)),
  public_evidence_category: countValues(evidence.map((row) => getPublicEvidenceCategory(row.source_type))),
  canonical_evidence_source_type: countValues(evidence.map((row) => row.source_type)),
  evidence_source_provenance: countValues(evidence.map((row) => getEvidenceProvenance(row.source_type, row.source_provenance))),
  evidence_primary_state: countValues(evidence.map((row) => getEvidencePrimaryState(row.source_type, row.is_primary, row.primary_state))),
  evidence_reliability: countValues(evidence.map((row) => getEvidenceReliability(row.reliability))),
  canonical_evidence_reliability_raw: countValues(evidence.map((row) => row.reliability)),
  evidence_archive_state: countValues(evidence.map((row) => getEvidenceArchiveState(row.archived_url))),
  evidence_relation_kind: countValues(evidence.map((row) => getEvidenceRelationKind(row.id))),
  public_evidence_source_identity_category: evidenceIdentityStats.public_source_category,
  evidence_source_identity_provenance: evidenceIdentityStats.source_provenance,
  evidence_source_identity_primary_state: evidenceIdentityStats.primary_state,
  evidence_source_identity_reliability: evidenceIdentityStats.reliability,
  evidence_source_identity_archive_state: evidenceIdentityStats.archive_state,
  evidence_claim_scope_non_exclusive: countValues(evidenceRelations.flatMap((row) => row.claim_scopes)),
  reserve_report_type: countValues(reserveReports.map((row) => row.report_type)),
  known_unknown_severity: countValues(knownUnknowns.map((row) => row.severity)),
  registry_updates: registryUpdates.length,
  public_deployment_category: countValues(deployments.map((row) => getPublicDeploymentCategory(row.deployment_type))),
  canonical_deployment_type: countValues(deployments.map((row) => getCanonicalDeploymentType(row.deployment_type))),
  deployment_operational_state: countValues(deployments.map((row) => getDeploymentOperationalState(row.status))),
  deployment_status: countValues(deployments.map((row) => row.status)),
  deployment_change_state: countValues(deployments.map((row) => getDeploymentChangeState(row))),
  deployment_canonicality: countValues(deployments.map((row) => getDeploymentCanonicality(row))),
  deployment_canonicality_record_state: countValues(deployments.map((row) => getDeploymentCanonicalityRecordState(row))),
  deployment_verification_state: countValues(deployments.map((row) => getDeploymentVerificationState(row))),
  deployment_contract_identity_state: countValues(deployments.map((row) => getDeploymentContractIdentityState(row))),
  deployment_network_identity_state: countValues(deployments.map((row) => getDeploymentNetworkIdentityState(row))),
  deployment_chain: countValues(deployments.map((row) => row.chain)),
  public_value_state_definitions: 5,
  stablecoin_symbol_value_state: countValues(stablecoins.map((row) => getPublicValueState(row.symbol))),
  stablecoin_launch_date_value_state: countValues(stablecoins.map((row) => getPublicValueState(row.launch_date))),
  stablecoin_discontinued_date_value_state: countValues(stablecoins.map((row) => getPublicValueState(row.discontinued_date))),
  organization_jurisdiction_value_state: countValues(organizations.map((row) => getPublicValueState(row.jurisdiction))),
  relationship_start_date_value_state: countValues(relationships.map((row) => getPublicValueState(row.start_date))),
  relationship_end_date_value_state: countValues(relationships.map((row) => getPublicValueState(row.end_date))),
  event_date_value_state: countValues(events.map((row) => getPublicValueState(row.event_date))),
  event_recovery_date_value_state: countValues(events.map((row) => getPublicValueState(row.recovery?.date))),
  evidence_published_at_value_state: countValues(evidence.map((row) => getPublicValueState(row.published_at))),
  reserve_report_date_value_state: countValues(reserveReports.map((row) => getPublicValueState(row.report_date))),
  known_unknown_record_value_state: countValues(knownUnknowns.map((row) => getPublicValueState(row.record_state))),
  deployment_canonicality_value_state: countValues(deployments.map((row) => getPublicValueState(row.canonicality))),
  deployment_verification_value_state: countValues(deployments.map((row) => getPublicValueState(row.verification_status))),
  deployment_contract_identity_value_state: countValues(deployments.map((row) => getPublicValueState(row.contract_address))),
};

const version = readJson(path.join(dist, 'version.json'));
const actual = version.data.record_count_breakdown;
const differences = [];
for (const key of [...new Set([...Object.keys(expected), ...Object.keys(actual)])].sort()) {
  if (JSON.stringify(expected[key]) !== JSON.stringify(actual[key])) {
    differences.push({ key, expected: expected[key], actual: actual[key] });
  }
}
console.log(JSON.stringify({ ok: differences.length === 0, differences }, null, 2));
