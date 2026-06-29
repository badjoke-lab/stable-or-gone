import fs from 'node:fs';
import path from 'node:path';
import { buildMonitoringFeasibilityAudit, FEASIBILITY_CLASSIFICATIONS } from './monitoring/audits/build-feasibility-audit.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);
const classificationSet = new Set(FEASIBILITY_CLASSIFICATIONS);
const reasonSet = new Set([
  'nonterminal_asset_with_direct_current_official_source_and_multiple_source_families',
  'terminal_asset_with_current_official_reference_but_limited_monitoring_value',
  'current_official_source_exists_but_scope_or_directness_is_incomplete',
  'official_evidence_exists_only_as_archived_or_manual_review_material',
  'canonical_evidence_contains_no_official_source_for_asset_or_related_organization'
]);
const familySet = new Set([
  'reserve_assurance',
  'redemption_terms',
  'regulatory',
  'issuer_lifecycle',
  'technical',
  'general_official'
]);
const gapSet = new Set([
  'official_source_missing',
  'current_fetchable_official_source_missing',
  'direct_asset_source_missing',
  'reserve_assurance_coverage_missing',
  'redemption_terms_coverage_missing',
  'issuer_lifecycle_coverage_missing',
  'terminal_asset_monitoring_low_priority'
]);
const nextScopeSet = new Set([
  'phase_b_source_registration',
  'manual_source_review_before_registration',
  'retain_manual_review_workflow',
  'research_official_source_or_keep_unmonitored'
]);
const terminalStatuses = new Set(['failed', 'discontinued', 'migrated']);

function readRows(relativePath) {
  const value = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  return Array.isArray(value) ? value : value.records ?? [];
}

function loadGroup(baseline, group) {
  return (baseline.data_groups?.[group] ?? []).flatMap(readRows);
}

let first;
let second;
try {
  first = buildMonitoringFeasibilityAudit(root);
  second = buildMonitoringFeasibilityAudit(root);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

if (first && second) {
  if (JSON.stringify(first) !== JSON.stringify(second)) fail('feasibility audit must be deterministic across repeated generation');
  if (first.schema_version !== '1.0') fail('schema_version must be 1.0');
  if (first.audit_id !== 'sog_monitoring_feasibility_92_v1') fail('audit_id mismatch');
  if (first.generated_from !== 'canonical_registry_v2') fail('generated_from mismatch');
  if (first.record_count !== 92) fail(`expected 92 stable assets, found ${first.record_count}`);
  if (!Array.isArray(first.records) || first.records.length !== first.record_count) fail('record array length mismatch');

  const baseline = loadRegistryV2Baseline(root);
  const stablecoins = loadGroup(baseline, 'stablecoins');
  const organizations = loadGroup(baseline, 'organizations');
  const canonicalIds = stablecoins.map((row) => row.id).sort();
  const auditIds = first.records.map((row) => row.stablecoin_id).sort();
  if (JSON.stringify(auditIds) !== JSON.stringify(canonicalIds)) fail('audit stablecoin IDs must exactly match canonical stablecoin IDs');
  if (new Set(auditIds).size !== auditIds.length) fail('audit contains duplicate stablecoin IDs');

  const organizationIds = new Set(organizations.map((row) => row.id));
  let countTotal = 0;
  for (const classification of FEASIBILITY_CLASSIFICATIONS) {
    const value = first.classification_counts?.[classification];
    if (!Number.isInteger(value) || value < 0) fail(`invalid count for ${classification}`);
    countTotal += value ?? 0;
  }
  if (countTotal !== first.record_count) fail(`classification counts total ${countTotal}, expected ${first.record_count}`);
  for (const key of Object.keys(first.classification_counts ?? {})) {
    if (!classificationSet.has(key)) fail(`unexpected classification count key: ${key}`);
  }

  for (const record of first.records) {
    const id = record.stablecoin_id ?? 'unknown';
    if (!classificationSet.has(record.classification)) fail(`${id}: invalid classification ${record.classification}`);
    if (!reasonSet.has(record.classification_reason)) fail(`${id}: invalid reason ${record.classification_reason}`);
    if (!nextScopeSet.has(record.recommended_next_scope)) fail(`${id}: invalid next scope ${record.recommended_next_scope}`);
    if (record.canonical_action !== 'none') fail(`${id}: canonical_action must be none`);
    for (const organizationId of record.related_organization_ids ?? []) {
      if (!organizationIds.has(organizationId)) fail(`${id}: unknown organization ${organizationId}`);
    }
    for (const family of [...(record.current_source_families ?? []), ...(record.all_official_source_families ?? [])]) {
      if (!familySet.has(family)) fail(`${id}: invalid source family ${family}`);
    }
    for (const gap of record.blocking_gaps ?? []) {
      if (!gapSet.has(gap)) fail(`${id}: invalid gap ${gap}`);
    }

    const counts = record.evidence_counts ?? {};
    for (const key of ['relevant', 'official', 'current_fetchable_official', 'direct_current_official']) {
      if (!Number.isInteger(counts[key]) || counts[key] < 0) fail(`${id}: invalid evidence count ${key}`);
    }
    if (counts.official > counts.relevant) fail(`${id}: official evidence exceeds relevant evidence`);
    if (counts.current_fetchable_official > counts.official) fail(`${id}: current official evidence exceeds official evidence`);
    if (counts.direct_current_official > counts.current_fetchable_official) fail(`${id}: direct current evidence exceeds current official evidence`);

    if (terminalStatuses.has(String(record.status ?? '').toLowerCase()) && record.classification === 'automatically_monitorable') {
      fail(`${id}: terminal asset cannot be automatically monitorable`);
    }
    if (record.classification === 'automatically_monitorable') {
      if (counts.direct_current_official < 1) fail(`${id}: automatic classification requires direct current official evidence`);
      if ((record.current_source_families ?? []).length < 2) fail(`${id}: automatic classification requires at least two current source families`);
      if (record.recommended_next_scope !== 'phase_b_source_registration') fail(`${id}: automatic next scope mismatch`);
    }
    if (record.classification === 'no_reliable_official_source' && counts.official !== 0) {
      fail(`${id}: no-source classification cannot retain official evidence`);
    }
  }

  const expectedPolicy = {
    canonical_action: 'none',
    source_registration: false,
    network_access: false,
    public_output: false,
    production_publication: false
  };
  for (const [key, expected] of Object.entries(expectedPolicy)) {
    if (first.policy?.[key] !== expected) fail(`policy.${key} must be ${expected}`);
  }
}

const ignored = new Set(fs.readFileSync('.gitignore', 'utf8').split(/\r?\n/));
if (!ignored.has('data-staging/monitoring-feasibility/')) fail('private feasibility output directory must be ignored');

const generator = fs.readFileSync('scripts/monitoring/audits/build-feasibility-audit.mjs', 'utf8');
for (const forbidden of ['fetch(', 'node:https', 'node:http', 'child_process', 'wrangler', 'CLOUDFLARE_', 'create_pull_request']) {
  if (generator.includes(forbidden)) fail(`generator contains prohibited capability: ${forbidden}`);
}
for (const required of [
  "canonical_action: 'none'",
  'source_registration: false',
  'network_access: false',
  'public_output: false',
  'production_publication: false'
]) {
  if (!generator.includes(required)) fail(`generator missing safety value: ${required}`);
}

const spec = fs.readFileSync('docs/quality/monitoring-feasibility-audit-spec.md', 'utf8');
for (const phrase of [
  'classifies every current canonical stable asset',
  'automatically_monitorable',
  'partially_monitorable',
  'manual_review_only',
  'no_reliable_official_source',
  'record count equals the canonical stablecoin count and currently equals 92',
  'PR #240 itself adds no live source and accepts no baseline',
  'No production deployment required'
]) {
  if (!spec.includes(phrase)) fail(`PR #240 specification missing: ${phrase}`);
}

if (failures.length) {
  console.error('PR #240 monitoring feasibility validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`PR #240 monitoring feasibility valid: ${first.record_count} canonical assets classified with deterministic private output and no source registration.`);
