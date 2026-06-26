import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

function readJson(root, relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function readRows(root, relativePath) {
  const value = readJson(root, relativePath);
  if (Array.isArray(value)) return value;
  if (Array.isArray(value.records)) return value.records;
  throw new Error(`${relativePath}: expected an array or { records: [] }`);
}

function add(set, value) {
  if (Array.isArray(value)) {
    for (const item of value) add(set, item);
    return;
  }
  if (value === null || value === undefined) return;
  const normalized = String(value).trim();
  if (normalized) set.add(normalized);
}

function values(rows, selectors, extras = []) {
  const set = new Set(extras);
  for (const row of rows) {
    for (const selector of selectors) add(set, selector(row));
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

function objectKeys(value) {
  return value && typeof value === 'object' ? Object.keys(value) : [];
}

export function collectPublicTaxonomyValues(root = process.cwd()) {
  const baseline = loadRegistryV2Baseline(root);
  const group = (name) => (baseline.data_groups?.[name] ?? []).flatMap((relativePath) => readRows(root, relativePath));
  const statsPath = path.join(root, 'data/generated/registry-stats.json');
  const stats = fs.existsSync(statsPath) ? readJson(root, 'data/generated/registry-stats.json') : {};

  const stablecoins = group('stablecoins');
  const organizations = group('organizations');
  const relationships = group('relationships');
  const classifications = group('classifications');
  const profiles = group('profiles');
  const events = group('events');
  const eventDetails = group('event_details');
  const evidence = group('evidence');
  const knownUnknowns = group('known_unknowns');
  const deployments = group('deployments');

  const axes = {
    lifecycle_status: values(stablecoins, [(row) => row.lifecycle_status], objectKeys(stats.lifecycle?.by_status)),
    legacy_status: values(stablecoins, [(row) => row.status]),
    issuance_status: values(stablecoins, [(row) => row.issuance_status], objectKeys(stats.composition?.issuance_statuses)),
    asset_class: values(stablecoins, [(row) => row.asset_class], objectKeys(stats.composition?.asset_classes)),
    reference_kind: values([...stablecoins, ...classifications], [
      (row) => row.peg_reference?.kind,
      (row) => row.reference_target?.kind,
      (row) => row.reference_kind
    ], objectKeys(stats.composition?.reference_kinds)),
    reference_asset: values(stablecoins, [(row) => row.peg_reference?.asset, (row) => row.peg_asset], objectKeys(stats.composition?.reference_assets)),
    backing_type: values([...stablecoins, ...classifications], [(row) => row.backing_types], objectKeys(stats.composition?.backing_types_non_exclusive)),
    stabilization_mechanism: values([...stablecoins, ...classifications], [(row) => row.stabilization_mechanism], objectKeys(stats.composition?.stabilization_mechanisms)),
    governance_model: values([...stablecoins, ...classifications], [(row) => row.governance_model], objectKeys(stats.composition?.governance_models)),
    organization_type: values(organizations, [(row) => row.organization_type, (row) => row.issuer_type, (row) => row.legacy_issuer_type]),
    relationship_role: values(relationships, [(row) => row.role]),
    relationship_status: values(relationships, [(row) => row.status]),
    event_type: values(events, [(row) => row.event_type]),
    event_detail_kind: values([...events, ...eventDetails], [(row) => row.event_detail_kind, (row) => row.detail_kind]),
    event_impact: values(events, [(row) => row.impact_level]),
    event_status_effect: values(events, [(row) => row.event_status_effect]),
    recovery_status: values([...events, ...eventDetails], [
      (row) => row.recovery_status,
      (row) => row.depeg_detail?.recovery_status
    ]),
    evidence_reliability: values(evidence, [(row) => row.reliability]),
    evidence_source_type: values(evidence, [(row) => row.source_type]),
    evidence_claim_scope: values(evidence, [(row) => row.claim_scope, (row) => row.claim_scopes]),
    deployment_status: values(deployments, [(row) => row.status]),
    deployment_type: values(deployments, [(row) => row.deployment_type]),
    deployment_canonicality: values(deployments, [(row) => row.canonicality]),
    known_unknown_severity: values(knownUnknowns, [(row) => row.severity]),
    known_unknown_topic: values(knownUnknowns, [(row) => row.topic]),
    reserve_disclosure_status: values(profiles, [(row) => row.reserve_profile?.disclosure_status, (row) => row.reserve_disclosure_status]),
    redemption_status: values(profiles, [(row) => row.redemption_profile?.status, (row) => row.redemption_status])
  };

  return {
    schema_version: '1.0',
    source_baseline: baseline.baseline_id,
    generated_at: new Date().toISOString(),
    record_counts: {
      stablecoins: stablecoins.length,
      organizations: organizations.length,
      relationships: relationships.length,
      classifications: classifications.length,
      profiles: profiles.length,
      events: events.length,
      event_details: eventDetails.length,
      evidence: evidence.length,
      known_unknowns: knownUnknowns.length,
      deployments: deployments.length
    },
    axes,
    axis_counts: Object.fromEntries(Object.entries(axes).map(([key, list]) => [key, list.length]))
  };
}

export function writePublicTaxonomyValues(root = process.cwd()) {
  const result = collectPublicTaxonomyValues(root);
  const outputPath = path.join(root, 'data/generated/public-taxonomy-values.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
  return result;
}

const invokedDirectly = process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;
if (invokedDirectly) {
  console.log(JSON.stringify(writePublicTaxonomyValues(process.cwd()), null, 2));
}
