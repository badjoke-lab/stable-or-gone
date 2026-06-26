import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getReferenceComparisonCategory } from '../config/reference-targets.mjs';
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
  getPublicEvidenceCategory,
  pollutedReliabilityValues
} from '../config/evidence-taxonomy.mjs';

const root = process.cwd();
const outputPath = 'data/generated/registry-stats.json';

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function readGroup(files = []) {
  return files.flatMap((file) => {
    const rows = readJson(file);
    if (!Array.isArray(rows)) throw new Error(`${file} must contain a JSON array`);
    return rows;
  });
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

function share(covered, total) {
  return total === 0 ? 0 : Number((covered / total).toFixed(4));
}

function coverage(rows, stablecoinIds) {
  const coveredIds = new Set();
  for (const row of rows) {
    const candidates = [];
    if (typeof row.id === 'string' && stablecoinIds.has(row.id)) candidates.push(row.id);
    if (typeof row.stablecoin_id === 'string') candidates.push(row.stablecoin_id);
    if (Array.isArray(row.stablecoin_ids)) candidates.push(...row.stablecoin_ids);
    if (Array.isArray(row.subject_stablecoin_ids)) candidates.push(...row.subject_stablecoin_ids);
    for (const id of candidates) if (stablecoinIds.has(id)) coveredIds.add(id);
  }
  return {
    covered: coveredIds.size,
    total: stablecoinIds.size,
    share: share(coveredIds.size, stablecoinIds.size)
  };
}

function evidenceClaimScopes(row) {
  return [...new Set([
    ...(Array.isArray(row.claim_scopes) ? row.claim_scopes : []),
    ...(typeof row.claim_scope === 'string' && row.claim_scope.length ? [row.claim_scope] : [])
  ])];
}

function evidenceRelationKind(row) {
  return Array.isArray(row.stablecoin_ids) || Array.isArray(row.organization_ids) || Array.isArray(row.event_ids) || Array.isArray(row.claim_scopes)
    ? 'explicit_v2'
    : 'legacy_subject_projection';
}

function deterministicGeneratedAt(baseline) {
  if (process.env.SOURCE_DATE_EPOCH) {
    const milliseconds = Number(process.env.SOURCE_DATE_EPOCH) * 1000;
    if (!Number.isFinite(milliseconds)) throw new Error('SOURCE_DATE_EPOCH must be numeric');
    return new Date(milliseconds).toISOString();
  }
  return `${baseline.captured_at}T00:00:00.000Z`;
}

export function buildRegistryStats() {
  const baseline = readJson('docs/migration/registry-v2-baseline.json');
  const foundation = readJson('docs/migration/registry-v3-foundation.json');
  const incomeManifest = readJson('docs/migration/registry-v3-income-profiles.json');

  const groups = Object.fromEntries(
    Object.entries(baseline.data_groups).map(([name, files]) => [name, readGroup(files)])
  );
  const v3Groups = Object.fromEntries(
    Object.entries(foundation.data_groups).map(([name, files]) => [name, readGroup(files)])
  );
  const incomeProfiles = readGroup(incomeManifest.data_files);

  const stablecoins = groups.stablecoins;
  const organizations = groups.organizations;
  const relationships = groups.relationships;
  const evidence = groups.evidence;
  const classificationExtensionById = new Map((groups.classification_extensions ?? []).map((row) => [row.id, row]));
  const classifications = groups.classifications.map((row) => ({ ...row, ...(classificationExtensionById.get(row.id) ?? {}) }));
  const eventDetailById = new Map(groups.event_details.map((row) => [row.id, row]));
  const events = groups.events.map((row) => ({ ...row, ...(eventDetailById.get(row.id) ?? {}) }));
  const stablecoinIds = new Set(stablecoins.map((row) => row.id));
  const lifecycleCounts = countBy(classifications, (row) => row.lifecycle_status);
  const activeStatuses = new Set(['active', 'restricted']);
  const failedStatuses = new Set(['collapsed']);
  const activeSide = classifications.filter((row) => activeStatuses.has(row.lifecycle_status)).length;
  const strictFailed = classifications.filter((row) => failedStatuses.has(row.lifecycle_status)).length;
  const historicalSide = classifications.length - activeSide;

  const legalProfiles = v3Groups.legal_profiles;
  const reserveComponents = v3Groups.reserve_components;
  const relationshipsV3 = v3Groups.stable_asset_relationships;
  const deployments = groups.deployments;

  const legalUnclassified = legalProfiles.filter((row) =>
    !Array.isArray(row.classifications) ||
    row.classifications.length === 0 ||
    row.classifications.every((item) => item.classification === 'unclassified' || item.classification === 'unknown')
  ).length;
  const incomeAllUnknown = incomeProfiles.filter((row) =>
    [row.availability, row.source, row.accrual, row.rate].every((value) => value === 'unknown')
  ).length;
  const deploymentUnknown = deployments.filter((row) => !row.canonicality || row.canonicality === 'unknown').length;
  const organizationIdsWithRelationships = new Set(relationships.map((row) => row.organization_id));
  const organizationJurisdictionUnknown = organizations.filter((row) => getJurisdictionScope(row.jurisdiction) === 'unknown').length;
  const organizationLegalFormNotRecorded = organizations.filter((row) => getLegalFormState(row) === 'not_recorded').length;
  const organizationsWithoutRelationships = organizations.filter((row) => !organizationIdsWithRelationships.has(row.id)).length;
  const relationshipsUnknownStatus = relationships.filter((row) => !row.status || row.status === 'unknown').length;
  const evidenceReliabilityUnknown = evidence.filter((row) => getEvidenceReliability(row.reliability) === 'unknown').length;
  const evidenceProvenanceUnknown = evidence.filter((row) => getEvidenceProvenance(row.source_type, row.source_provenance) === 'unknown').length;
  const evidencePrimaryUnknown = evidence.filter((row) => getEvidencePrimaryState(row.source_type, row.is_primary, row.primary_state) === 'unknown').length;
  const evidenceArchiveMissing = evidence.filter((row) => getEvidenceArchiveState(row.archived_url) === 'not_recorded').length;
  const evidencePollutedReliability = evidence.filter((row) => pollutedReliabilityValues.has(row.reliability)).length;
  const evidenceUrlCounts = countBy(evidence, (row) => row.url);
  const duplicateEvidenceUrls = Object.values(evidenceUrlCounts).filter((value) => value > 1).length;

  const stats = {
    schema_version: '1.0',
    generated_at: deterministicGeneratedAt(baseline),
    baseline_id: baseline.baseline_id,
    registry: {
      stablecoins: stablecoins.length,
      organizations: organizations.length,
      relationships: relationships.length,
      classifications: classifications.length,
      profiles: groups.profiles.length,
      events: events.length,
      event_details: groups.event_details.length,
      evidence: evidence.length,
      reserve_reports: groups.reserve_reports.length,
      known_unknowns: groups.known_unknowns.length,
      regulatory_notes: groups.regulatory_notes.length,
      deployments: deployments.length,
      legal_profiles: legalProfiles.length,
      stable_asset_relationships: relationshipsV3.length,
      reserve_components: reserveComponents.length,
      income_profiles: incomeProfiles.length
    },
    lifecycle: {
      by_status: lifecycleCounts,
      active_side: { count: activeSide, share: share(activeSide, classifications.length), statuses: ['active', 'restricted'] },
      historical_side: { count: historicalSide, share: share(historicalSide, classifications.length), statuses: Object.keys(lifecycleCounts).filter((status) => !activeStatuses.has(status)) },
      strict_failed: { count: strictFailed, share: share(strictFailed, classifications.length), statuses: ['collapsed'] }
    },
    composition: {
      legacy_status_compatibility: countBy(stablecoins, (row) => row.status),
      issuance_statuses: countBy(classifications, (row) => row.issuance_status),
      reference_kinds: countBy(classifications, (row) => row.peg_reference?.kind),
      reference_target_categories: countBy(classifications, (row) => getReferenceComparisonCategory(row.peg_reference?.asset) ?? 'unknown'),
      canonical_reference_assets_compatibility: countBy(classifications, (row) => row.peg_reference?.asset),
      public_model_categories: countBy(stablecoins, (row) => getPublicBackingModelCategory(row.slug) ?? 'unknown'),
      asset_classes: countBy(classifications, (row) => row.asset_class ?? 'stablecoin'),
      backing_types_non_exclusive: countBy(classifications, (row) => row.backing_types ?? ['unknown']),
      stabilization_mechanisms: countBy(classifications, (row) => row.stabilization_mechanism),
      governance_models: countBy(classifications, (row) => row.governance_model),
      public_organization_categories: countBy(organizations, (row) => getPublicOrganizationCategory(row.organization_type)),
      canonical_organization_types: countBy(organizations, (row) => row.organization_type),
      organization_legal_form_states: countBy(organizations, (row) => getLegalFormState(row)),
      organization_regulatory_characters: countBy(organizations, (row) => getRegulatoryCharacter(row.organization_type)),
      organization_jurisdiction_scopes: countBy(organizations, (row) => getJurisdictionScope(row.jurisdiction)),
      functional_roles: countBy(relationships, (row) => row.role),
      relationship_statuses: countBy(relationships, (row) => row.status),
      public_event_categories: countBy(events, (row) => getPublicEventCategory(row.event_type)),
      canonical_event_subtypes: countBy(events, (row) => row.event_type),
      event_detail_kinds: countBy(events, (row) => row.event_detail_kind),
      event_status_effect_categories: countBy(events, (row) => getEventStatusEffectCategory(row.event_status_effect)),
      event_recovery_categories: countBy(events, (row) => getRecoveryCategory(row)),
      event_impact_levels: countBy(events, (row) => row.impact_level),
      public_evidence_categories: countBy(evidence, (row) => getPublicEvidenceCategory(row.source_type)),
      canonical_evidence_source_types: countBy(evidence, (row) => row.source_type),
      evidence_source_provenances: countBy(evidence, (row) => getEvidenceProvenance(row.source_type, row.source_provenance)),
      evidence_primary_states: countBy(evidence, (row) => getEvidencePrimaryState(row.source_type, row.is_primary, row.primary_state)),
      evidence_reliabilities: countBy(evidence, (row) => getEvidenceReliability(row.reliability)),
      canonical_evidence_reliabilities_raw: countBy(evidence, (row) => row.reliability),
      evidence_archive_states: countBy(evidence, (row) => getEvidenceArchiveState(row.archived_url)),
      evidence_relation_kinds: countBy(evidence, evidenceRelationKind),
      evidence_claim_scopes_non_exclusive: countBy(evidence, evidenceClaimScopes),
      legal_classifications_non_exclusive: countBy(legalProfiles, (row) => Array.isArray(row.classifications) && row.classifications.length ? row.classifications.map((item) => item.classification) : ['unknown']),
      reserve_component_categories: countBy(reserveComponents, (row) => row.asset_category),
      deployment_chains: countBy(deployments, (row) => row.chain ?? row.network),
      income_availability: countBy(incomeProfiles, (row) => row.availability),
      income_sources: countBy(incomeProfiles, (row) => row.source),
      income_accrual: countBy(incomeProfiles, (row) => row.accrual),
      income_rates: countBy(incomeProfiles, (row) => row.rate)
    },
    coverage: {
      classifications: coverage(classifications, stablecoinIds),
      profiles: coverage(groups.profiles, stablecoinIds),
      legal_profiles: coverage(legalProfiles, stablecoinIds),
      reserve_components: coverage(reserveComponents, stablecoinIds),
      income_profiles: coverage(incomeProfiles, stablecoinIds),
      deployments: coverage(deployments, stablecoinIds),
      events: coverage(events, stablecoinIds),
      evidence: coverage(evidence, stablecoinIds),
      reserve_reports: coverage(groups.reserve_reports, stablecoinIds),
      known_unknowns: coverage(groups.known_unknowns, stablecoinIds)
    },
    quality: {
      lifecycle_unknown: { count: lifecycleCounts.unknown ?? 0, share: share(lifecycleCounts.unknown ?? 0, classifications.length) },
      legal_profiles_unclassified: { count: legalUnclassified, share: share(legalUnclassified, legalProfiles.length) },
      organization_jurisdiction_unknown: { count: organizationJurisdictionUnknown, share: share(organizationJurisdictionUnknown, organizations.length) },
      organization_legal_form_not_recorded: { count: organizationLegalFormNotRecorded, share: share(organizationLegalFormNotRecorded, organizations.length) },
      organizations_without_relationships: { count: organizationsWithoutRelationships, share: share(organizationsWithoutRelationships, organizations.length) },
      relationships_unknown_status: { count: relationshipsUnknownStatus, share: share(relationshipsUnknownStatus, relationships.length) },
      evidence_reliability_unknown: { count: evidenceReliabilityUnknown, share: share(evidenceReliabilityUnknown, evidence.length) },
      evidence_provenance_unknown: { count: evidenceProvenanceUnknown, share: share(evidenceProvenanceUnknown, evidence.length) },
      evidence_primary_state_unknown: { count: evidencePrimaryUnknown, share: share(evidencePrimaryUnknown, evidence.length) },
      evidence_archive_not_recorded: { count: evidenceArchiveMissing, share: share(evidenceArchiveMissing, evidence.length) },
      evidence_polluted_reliability_compatibility: { count: evidencePollutedReliability, share: share(evidencePollutedReliability, evidence.length) },
      evidence_duplicate_urls_preserved: { count: duplicateEvidenceUrls, share: share(duplicateEvidenceUrls, evidence.length) },
      income_profiles_all_unknown: { count: incomeAllUnknown, share: share(incomeAllUnknown, incomeProfiles.length) },
      reserve_components_unknown_category: {
        count: reserveComponents.filter((row) => !row.asset_category || row.asset_category === 'unknown').length,
        share: share(reserveComponents.filter((row) => !row.asset_category || row.asset_category === 'unknown').length, reserveComponents.length)
      },
      deployments_unknown_canonicality: { count: deploymentUnknown, share: share(deploymentUnknown, deployments.length) }
    }
  };

  return stats;
}

function serialize(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function runCli() {
  const stats = buildRegistryStats();
  const expected = serialize(stats);
  const absoluteOutput = path.join(root, outputPath);
  const checkOnly = process.argv.includes('--check');

  if (checkOnly) {
    const current = fs.existsSync(absoluteOutput) ? fs.readFileSync(absoluteOutput, 'utf8') : '';
    if (current !== expected) {
      console.error(`${outputPath} is stale or missing.`);
      console.error('Expected generated content:');
      console.error(expected);
      process.exit(1);
    }
    console.log(`Registry stats are current: ${stats.registry.stablecoins} assets.`);
    return;
  }

  fs.mkdirSync(path.dirname(absoluteOutput), { recursive: true });
  fs.writeFileSync(absoluteOutput, expected);
  console.log(`Generated ${outputPath} for ${stats.registry.stablecoins} assets.`);
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) runCli();
