import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { PUBLIC_ORIGIN } from '../config/public-origin.mjs';
import { getReferenceComparisonCategory, getReferenceTargetDefinition } from '../config/reference-targets.mjs';
import { getPublicBackingModelCategory } from '../config/backing-models.mjs';
import { getEventStatusEffectCategory, getPublicEventCategory, getRecoveryCategory } from '../config/event-taxonomy.mjs';
import {
  getJurisdictionScope,
  getLegalFormState,
  getPublicOrganizationCategory,
  getRegulatoryCharacter
} from '../config/organization-taxonomy.mjs';
import {
  getEvidenceArchiveState,
  getEvidencePrimaryState,
  getEvidenceProvenance,
  getEvidenceReliability,
  getPublicEvidenceCategory
} from '../config/evidence-taxonomy.mjs';
import { getEvidenceRelationKind } from '../config/evidence-relation-kinds.mjs';
import {
  getContractIdentityState,
  getDeploymentCanonicalityRecordState,
  getDeploymentChangeState,
  getDeploymentOperationalState,
  getDeploymentVerificationState,
  getNetworkIdentityState,
  getPublicDeploymentCategory
} from '../config/deployment-taxonomy.mjs';
import { publicValueStateValues, resolvePublicValueState } from '../config/value-states.mjs';
import { buildPrimaryDisplayRelationshipStats } from './build-primary-display-relationship-stats.mjs';
import { buildEvidenceSourceIdentityStats } from './build-evidence-source-identity-stats.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const baseline = loadRegistryV2Baseline(root);
const read = (file) => {
  const value = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${file}: expected an array or records array`);
};
const deploymentVerificationReview = JSON.parse(fs.readFileSync(path.join(root, 'data/deployment-verification-pr229.json'), 'utf8'));
const deploymentVerificationStatusById = new Map(
  Object.entries(deploymentVerificationReview.status_ids ?? {}).flatMap(([status, ids]) =>
    (ids ?? []).map((id) => [id, status])
  )
);
const withDeploymentVerification = (row) => ({
  ...row,
  verification_status: deploymentVerificationStatusById.get(row.id) ?? row.verification_status
});
const group = (name) => (baseline.data_groups?.[name] || []).flatMap(read);
const assert = (condition, message) => { if (!condition) throw new Error(message); };
const countValues = (values) => values.reduce((counts, raw) => {
  const value = raw === null || raw === undefined || raw === '' ? 'unknown' : String(raw);
  counts[value] = (counts[value] || 0) + 1;
  return counts;
}, {});
const countMultiValues = (values) => countValues(values.flat());
const countStates = (states) => states.reduce((counts, state) => {
  counts[state] = (counts[state] || 0) + 1;
  return counts;
}, {});
const applyById = (rows, layers) => {
  const maps = layers.map((layer) => new Map(layer.map((row) => [row.id, row])));
  return rows.map((row) => maps.reduce((merged, map) => ({ ...merged, ...(map.get(row.id) || {}) }), row));
};
const evidenceClaims = (row) => [...new Set([
  ...(Array.isArray(row.claim_scopes) ? row.claim_scopes : []),
  ...(typeof row.claim_scope === 'string' && row.claim_scope.length ? [row.claim_scope] : [])
])];
const checkedOutCommit = () => {
  if (process.env.GITHUB_ACTIONS !== 'true') return null;
  try {
    const value = execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: process.env.GITHUB_WORKSPACE || root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return /^[0-9a-f]{40}$/i.test(value) ? value : null;
  } catch {
    return null;
  }
};
const eventRecoveryDateState = (row) => {
  const recoveryDate = row.depeg_detail?.recovery_date ?? row.recovery_date;
  if (recoveryDate !== null && recoveryDate !== undefined && recoveryDate !== '') return resolvePublicValueState(recoveryDate);
  const category = getRecoveryCategory(row);
  if (category === 'not_applicable') return 'not_applicable';
  if (category === 'unknown') return 'unknown_after_review';
  return 'not_recorded';
};
const deploymentCanonicalityValueState = (row) => {
  const recordState = getDeploymentCanonicalityRecordState(row.canonicality);
  if (recordState === 'not_recorded') return 'not_recorded';
  if (row.canonicality === 'unknown') return 'unknown_after_review';
  return 'known';
};
const deploymentVerificationValueState = (row) => {
  const verification = getDeploymentVerificationState(withDeploymentVerification(row));
  if (verification === 'verified') return 'known';
  if (verification === 'unknown') return 'unknown_after_review';
  return 'unverified';
};
const deploymentContractIdentityValueState = (row) => {
  const contractState = getContractIdentityState(row.contract_address);
  if (contractState === 'recorded_identifier') return 'known';
  if (contractState === 'review_needed') return 'unverified';
  if (contractState === 'not_applicable_or_review_unresolved') return 'unknown_after_review';
  return 'not_recorded';
};

const stablecoins = applyById(group('stablecoins'), [
  read('data/stablecoin-overrides-pr033.json'),
  read('data/stablecoin-overrides-pr034.json'),
  group('classifications'),
  group('classification_extensions'),
  group('profiles'),
]);
const organizations = group('organizations').map((row) => ({ ...row, issuer_type: row.legacy_issuer_type || row.organization_type }));
const relationships = group('relationships');
const events = applyById(group('events'), [group('event_details')]);
const evidence = group('evidence');
const reserveReports = group('reserve_reports');
const knownUnknowns = group('known_unknowns');
const regulatoryNotes = group('regulatory_notes');
const deployments = group('deployments');
const registryUpdates = read('data/registry-updates.json');

const referenceKinds = stablecoins.map((row) => row.peg_reference?.kind ?? getReferenceTargetDefinition(row.peg_reference?.asset ?? row.peg_asset)?.reference_kind ?? 'unknown');
const referenceCategories = stablecoins.map((row) => getReferenceComparisonCategory(row.peg_reference?.asset ?? row.peg_asset) ?? 'unknown');
const publicModelCategories = stablecoins.map((row) => getPublicBackingModelCategory(row.slug) ?? 'unknown');
const backingTypes = stablecoins.map((row) => Array.isArray(row.backing_types) ? row.backing_types : []);
const stabilizationMechanisms = stablecoins.map((row) => row.stabilization_mechanism ?? 'unknown');
const publicOrganizationCategories = organizations.map((row) => getPublicOrganizationCategory(row.organization_type));
const organizationLegalFormStates = organizations.map((row) => getLegalFormState(row));
const organizationRegulatoryCharacters = organizations.map((row) => getRegulatoryCharacter(row.organization_type));
const organizationJurisdictionScopes = organizations.map((row) => getJurisdictionScope(row.jurisdiction));
const publicEventCategories = events.map((row) => getPublicEventCategory(row.event_type));
const eventStatusEffectCategories = events.map((row) => getEventStatusEffectCategory(row.event_status_effect));
const eventRecoveryCategories = events.map((row) => getRecoveryCategory(row));
const publicEvidenceCategories = evidence.map((row) => getPublicEvidenceCategory(row.source_type));
const evidenceProvenances = evidence.map((row) => getEvidenceProvenance(row.source_type, row.source_provenance));
const evidencePrimaryStates = evidence.map((row) => getEvidencePrimaryState(row.source_type, row.is_primary, row.primary_state));
const evidenceReliabilities = evidence.map((row) => getEvidenceReliability(row.reliability));
const evidenceArchiveStates = evidence.map((row) => getEvidenceArchiveState(row.archived_url));
const publicDeploymentCategories = deployments.map((row) => getPublicDeploymentCategory(row.deployment_type));
const deploymentOperationalStates = deployments.map((row) => getDeploymentOperationalState(row.status));
const deploymentChangeStates = deployments.map((row) => getDeploymentChangeState(row.status));
const deploymentCanonicalityRecordStates = deployments.map((row) => getDeploymentCanonicalityRecordState(row.canonicality));
const deploymentVerificationStates = deployments.map((row) => getDeploymentVerificationState(withDeploymentVerification(row)));
const deploymentContractIdentityStates = deployments.map((row) => getContractIdentityState(row.contract_address));
const deploymentNetworkIdentityStates = deployments.map((row) => getNetworkIdentityState(row.chain));
const primaryDisplayStats = buildPrimaryDisplayRelationshipStats(root);
const evidenceIdentityStats = buildEvidenceSourceIdentityStats(root);

const expectedEvidenceSourceIdentitySummary = {
  raw_evidence_records: evidenceIdentityStats.canonical_evidence_records,
  source_identities: evidenceIdentityStats.public_source_identities,
  source_identity_groups: evidenceIdentityStats.source_identity_groups,
  source_aliases: evidenceIdentityStats.source_aliases,
  removed_public_duplicate_rows: evidenceIdentityStats.removed_public_duplicate_rows,
  evidence_relations: evidenceIdentityStats.evidence_relations,
  relation_source_identities: evidenceIdentityStats.relation_source_identities,
  orphan_relation_source_ids: evidenceIdentityStats.orphan_relation_source_ids,
  unmapped_alias_ids: []
};

const expectedCounts = { primary_records: stablecoins.length, events: events.length, evidence: evidence.length };
const expectedBreakdown = {
  stablecoins: stablecoins.length,
  organizations: organizations.length,
  relationships: relationships.length,
  evidence_relations: evidence.length,
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
  registry_updates: registryUpdates.length,
  lifecycle_status: countValues(stablecoins.map((row) => row.lifecycle_status)),
  issuance_status: countValues(stablecoins.map((row) => row.issuance_status)),
  reference_kind: countValues(referenceKinds),
  reference_comparison_category: countValues(referenceCategories),
  public_model_category: countValues(publicModelCategories),
  backing_type_non_exclusive: countMultiValues(backingTypes),
  stabilization_mechanism: countValues(stabilizationMechanisms),
  asset_class: countValues(stablecoins.map((row) => row.asset_class)),
  public_organization_category: countValues(publicOrganizationCategories),
  canonical_organization_type: countValues(organizations.map((row) => row.organization_type)),
  organization_legal_form_state: countValues(organizationLegalFormStates),
  organization_regulatory_character: countValues(organizationRegulatoryCharacters),
  organization_jurisdiction_scope: countValues(organizationJurisdictionScopes),
  functional_role: countValues(relationships.map((row) => row.role)),
  relationship_status: countValues(relationships.map((row) => row.status)),
  primary_display_relationships: primaryDisplayStats.selected_relationships,
  primary_display_explicit_overrides: primaryDisplayStats.explicit_overrides,
  primary_display_ambiguities: primaryDisplayStats.ambiguous_selections,
  stablecoins_with_multiple_relationships: primaryDisplayStats.stablecoins_with_multiple_relationships,
  stablecoins_with_multiple_organizations: primaryDisplayStats.stablecoins_with_multiple_organizations,
  stablecoins_with_historical_relationships: primaryDisplayStats.stablecoins_with_historical_relationships,
  primary_display_selection_mode: primaryDisplayStats.selection_mode,
  primary_display_role: primaryDisplayStats.selected_role,
  primary_display_relationship_status: primaryDisplayStats.selected_status,
  primary_display_organization_category: primaryDisplayStats.selected_organization_category,
  public_event_category: countValues(publicEventCategories),
  canonical_event_subtype: countValues(events.map((row) => row.event_type)),
  event_detail_kind: countValues(events.map((row) => row.event_detail_kind)),
  event_status_effect_category: countValues(eventStatusEffectCategories),
  event_recovery_category: countValues(eventRecoveryCategories),
  public_evidence_category: countValues(publicEvidenceCategories),
  canonical_evidence_source_type: countValues(evidence.map((row) => row.source_type)),
  evidence_source_provenance: countValues(evidenceProvenances),
  evidence_primary_state: countValues(evidencePrimaryStates),
  evidence_reliability: countValues(evidenceReliabilities),
  canonical_evidence_reliability_raw: countValues(evidence.map((row) => row.reliability)),
  evidence_archive_state: countValues(evidenceArchiveStates),
  evidence_relation_kind: countValues(evidence.map((row) => getEvidenceRelationKind(row.id))),
  public_evidence_source_identity_category: evidenceIdentityStats.public_source_category,
  evidence_source_identity_provenance: evidenceIdentityStats.source_provenance,
  evidence_source_identity_primary_state: evidenceIdentityStats.primary_state,
  evidence_source_identity_reliability: evidenceIdentityStats.reliability,
  evidence_source_identity_archive_state: evidenceIdentityStats.archive_state,
  evidence_claim_scope_non_exclusive: evidenceIdentityStats.relation_claim_scopes_non_exclusive,
  reserve_report_type: countValues(reserveReports.map((row) => row.report_type)),
  known_unknown_severity: countValues(knownUnknowns.map((row) => row.severity)),
  public_deployment_category: countValues(publicDeploymentCategories),
  canonical_deployment_type: countValues(deployments.map((row) => row.deployment_type)),
  deployment_operational_state: countValues(deploymentOperationalStates),
  deployment_status: countValues(deployments.map((row) => row.status)),
  deployment_change_state: countValues(deploymentChangeStates),
  deployment_canonicality: countValues(deployments.map((row) => row.canonicality ?? 'unknown')),
  deployment_canonicality_record_state: countValues(deploymentCanonicalityRecordStates),
  deployment_verification_state: countValues(deploymentVerificationStates),
  deployment_contract_identity_state: countValues(deploymentContractIdentityStates),
  deployment_network_identity_state: countValues(deploymentNetworkIdentityStates),
  deployment_chain: countValues(deployments.map((row) => row.chain)),
  public_value_state_definitions: publicValueStateValues.length,
  stablecoin_symbol_value_state: countStates(stablecoins.map((row) => resolvePublicValueState(row.symbol))),
  stablecoin_launch_date_value_state: countStates(stablecoins.map((row) => resolvePublicValueState(row.launch_date))),
  stablecoin_discontinued_date_value_state: countStates(stablecoins.map((row) => resolvePublicValueState(row.discontinued_date))),
  organization_jurisdiction_value_state: countStates(organizations.map((row) => resolvePublicValueState(row.jurisdiction))),
  relationship_start_date_value_state: countStates(relationships.map((row) => resolvePublicValueState(row.start_date))),
  relationship_end_date_value_state: countStates(relationships.map((row) => resolvePublicValueState(row.end_date))),
  event_date_value_state: countStates(events.map((row) => resolvePublicValueState(row.event_date))),
  event_recovery_date_value_state: countStates(events.map(eventRecoveryDateState)),
  evidence_published_at_value_state: countStates(evidence.map((row) => resolvePublicValueState(row.published_at))),
  reserve_report_date_value_state: countStates(reserveReports.map((row) => resolvePublicValueState(row.report_date))),
  known_unknown_record_value_state: countStates(knownUnknowns.map(() => 'unknown_after_review')),
  deployment_canonicality_value_state: countStates(deployments.map(deploymentCanonicalityValueState)),
  deployment_verification_value_state: countStates(deployments.map(deploymentVerificationValueState)),
  deployment_contract_identity_value_state: countStates(deployments.map(deploymentContractIdentityValueState)),
};
const expectedLastReviewedAt = [...stablecoins.map((row) => row.last_verified_at), ...organizations.map((row) => row.last_verified_at)].filter(Boolean).sort().at(-1) || null;

for (const file of ['version.json', 'data/manifest.json', 'llms.txt', 'ai.txt']) assert(fs.existsSync(path.join(distDir, file)), `Missing dist/${file}`);
const version = JSON.parse(fs.readFileSync(path.join(distDir, 'version.json'), 'utf8'));
const manifest = JSON.parse(fs.readFileSync(path.join(distDir, 'data/manifest.json'), 'utf8'));
const llmsText = fs.readFileSync(path.join(distDir, 'llms.txt'), 'utf8');
const aiText = fs.readFileSync(path.join(distDir, 'ai.txt'), 'utf8');

assert(version.schema_version === '1.0.0', 'version schema mismatch');
assert(version.project_id === 'stable-or-gone', 'version project id mismatch');
assert(version.registry_family === 'badjoke-lab-ledger-series', 'version registry family mismatch');
assert(version.registry_type === 'stablecoin_issuer_registry', 'version type mismatch');
assert(version.canonical_origin === PUBLIC_ORIGIN, 'version canonical origin mismatch');
assert(version.build?.verification_marker === 'sog_machine_readable_layer_v1', 'verification marker mismatch');
assert(version.build?.provenance_verification_marker === 'sog_build_provenance_v1', 'build provenance marker mismatch');
assert(version.data?.data_schema_version === 'sog_registry_v2', 'data schema mismatch');
assert(isDeepStrictEqual(version.data?.record_counts, expectedCounts), 'version record counts do not match canonical data');
assert(isDeepStrictEqual(version.data?.record_count_breakdown, expectedBreakdown), 'version breakdown does not match canonical data');
assert(isDeepStrictEqual(version.data?.evidence_source_identity, expectedEvidenceSourceIdentitySummary), 'version evidence source identity summary mismatch');
assert(version.data?.records_last_reviewed_at === expectedLastReviewedAt, 'records_last_reviewed_at mismatch');

const expectedBuildCommit = process.env.SOG_BUILD_COMMIT || checkedOutCommit() || process.env.GITHUB_SHA;
const expectedBuildBranch = process.env.SOG_BUILD_BRANCH || process.env.CF_PAGES_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME;
if (expectedBuildCommit) assert(version.build.commit === expectedBuildCommit, `build commit ${version.build.commit} does not match expected ${expectedBuildCommit}`);
if (expectedBuildBranch) assert(version.build.branch === expectedBuildBranch, `build branch ${version.build.branch} does not match expected ${expectedBuildBranch}`);

assert(manifest.schema_version === version.schema_version, 'manifest schema mismatch');
assert(manifest.project_id === version.project_id, 'manifest project mismatch');
assert(manifest.registry_family === version.registry_family, 'manifest registry family mismatch');
assert(manifest.registry_type === version.registry_type, 'manifest type mismatch');
assert(manifest.canonical_origin === version.canonical_origin, 'manifest origin mismatch');
assert(isDeepStrictEqual(manifest.build, version.build), 'manifest build provenance differs from version');
assert(isDeepStrictEqual(manifest.record_counts, expectedCounts), 'manifest counts do not match canonical data');
assert(isDeepStrictEqual(manifest.record_count_breakdown, expectedBreakdown), 'manifest breakdown does not match canonical data');
assert(isDeepStrictEqual(manifest.evidence_source_identity, expectedEvidenceSourceIdentitySummary), 'manifest evidence source identity summary mismatch');
assert(manifest.data_safety?.canonical_only === true, 'canonical-only flag missing');
assert(manifest.data_safety?.includes_unreviewed_candidates === false, 'candidate safety flag invalid');
assert(manifest.data_safety?.includes_internal_monitoring === false, 'monitoring safety flag invalid');
assert(manifest.data_safety?.includes_private_notes === false, 'private-note safety flag invalid');
assert(llmsText.includes('/data/manifest.json') && llmsText.includes('/ai.txt'), 'llms.txt endpoint references missing');
assert(aiText.includes('Version endpoint: /version.json') && aiText.includes('LLM guide: /llms.txt'), 'ai.txt endpoint references missing');

console.log(JSON.stringify({ ok: true, build: version.build, record_counts: expectedCounts, record_count_breakdown: expectedBreakdown, evidence_source_identity: expectedEvidenceSourceIdentitySummary }, null, 2));
