import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { generateStats } from './build-stats.mjs';

const root = process.cwd();
const failures = [];
const check = (ok, message) => { if (!ok) failures.push(message); };
const sum = (d) => Object.values(d ?? {}).reduce((n, row) => n + (row.count ?? 0), 0);
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

const first = generateStats({ root });
const second = generateStats({ root });
const firstJson = JSON.stringify(first);
check(firstJson === JSON.stringify(second), 'same inputs must generate byte-equivalent statistics models');
check(/^[a-f0-9]{64}$/.test(first.input_digest_sha256 ?? ''), 'input digest must be lowercase SHA-256');

const checkpoint = JSON.parse(fs.readFileSync(path.join(root, 'docs/migration/current-canonical-checkpoint.json'), 'utf8'));
const expected = checkpoint.expected_counts ?? {};
for (const [key, count] of Object.entries(expected)) check(first.totals[key] === count, `totals.${key} expected ${count}, found ${first.totals[key]}`);
check(first.checkpoint_id === checkpoint.checkpoint_id, 'statistics checkpoint_id must match current canonical checkpoint');
check(first.totals.assets === checkpoint.asset_count, 'statistics asset count must match current canonical checkpoint asset_count');

const total = first.totals.assets;
for (const [name, distribution] of [
  ['lifecycle.groups', first.lifecycle.groups],
  ['lifecycle.statuses', first.lifecycle.statuses],
  ['classification.asset_class', first.classification.asset_class],
  ['classification.reference_target', first.classification.reference_target],
  ['classification.stabilization_mechanism', first.classification.stabilization_mechanism],
  ['classification.governance_model', first.classification.governance_model],
  ['issuance.status', first.issuance.status],
  ['redemption.status', first.redemption.status],
  ['redemption.retail_access', first.redemption.retail_access],
  ['redemption.institutional_access', first.redemption.institutional_access],
  ['redemption.minimum_amount_knowledge', first.redemption.minimum_amount_knowledge],
  ['redemption.jurisdiction_restrictions', first.redemption.jurisdiction_restrictions],
  ['redemption.holder_claim_type', first.redemption.holder_claim_type],
  ['yield.availability', first.yield.availability],
  ['yield.source', first.yield.source],
  ['yield.accrual', first.yield.accrual],
  ['yield.rate_type', first.yield.rate_type]
]) check(sum(distribution) === total, `${name} must sum to asset denominator ${total}`);

const transitionStatusMap = {
  migrations: 'migrated',
  rebrands: 'rebranded',
  orderly_wind_downs: 'winding_down',
  terminations: 'terminated',
  inactive_unresolved: 'inactive',
  collapses: 'collapsed'
};
for (const [transition, status] of Object.entries(transitionStatusMap)) {
  const expectedCount = first.lifecycle.statuses?.[status]?.count ?? 0;
  check(first.lifecycle.transitions?.[transition] === expectedCount, `lifecycle.transitions.${transition} must equal ${status} status count ${expectedCount}`);
}
check(first.failures.count === first.lifecycle.transitions.collapses, 'failure count must equal lifecycle collapse transition count');

check(first.deployments.total_deployments === first.totals.deployments, 'deployment total mismatch');
check(first.deployments.assets_with_deployments === first.data_quality.coverage.deployment.count, 'deployment coverage mismatch');
const deploymentChainLabels = Object.keys(first.deployments.by_chain ?? {});
const normalizedDeploymentChainLabels = deploymentChainLabels.map((value) => value.trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' '));
check(new Set(normalizedDeploymentChainLabels).size === normalizedDeploymentChainLabels.length, 'deployment chain statistics must not contain case, spacing, or alias duplicates');
for (const value of ['multi chain', 'multi chain or bridge context', 'multi chain or protocol context', 'source review needed', 'unknown']) {
  check(!normalizedDeploymentChainLabels.includes(value), `non-chain deployment context leaked into by_chain: ${value}`);
}
const attributedDeploymentCount = Object.values(first.deployments.by_chain ?? {}).reduce((n, row) => n + Number(row.deployment_count ?? 0), 0);
const unresolvedDeploymentCount = Number(first.deployments.unresolved_chain_contexts?.deployment_count ?? 0);
check(attributedDeploymentCount + unresolvedDeploymentCount === first.deployments.total_deployments, 'attributed and unresolved deployment counts must reconcile to total deployments');
check(first.organizations.total_organizations === first.totals.organizations, 'organization total mismatch');
check(first.organizations.total_relationships === first.totals.relationships, 'relationship total mismatch');
check(first.data_quality.coverage.classification.count === total, 'classification coverage must equal asset count');
check(first.data_quality.coverage.reserve_redemption_profile.count === total, 'profile coverage must equal asset count');
check(first.data_quality.coverage.legal_profile.count === total, 'legal-profile coverage must equal asset count');
check(first.data_quality.typed_event_details.count === first.totals.events, 'typed event-detail coverage must equal event count');

check(first.methodology.unknown_values_preserved === true, 'unknown values must be preserved');
check(first.methodology.candidate_monitoring_private_inputs_excluded === true, 'private inputs must be excluded');
for (const dimension of ['classification.backing_type','failures.by_backing_type','organizations.by_role']) check(first.methodology.multi_select_dimensions.includes(dimension), `missing multi-select dimension: ${dimension}`);
for (const metric of ['price','market_cap','apy','yield_ranking','safety_score','risk_score']) check(first.methodology.excluded_live_metrics.includes(metric), `missing excluded metric: ${metric}`);

const loaderSource = fs.readFileSync(path.join(root, 'scripts/stats/load-stats-input.mjs'), 'utf8');
for (const marker of ['data-staging/','monitoring-candidates','news-discovery','article-stale-state-review']) check(!loaderSource.includes(marker), `stats loader contains private input marker: ${marker}`);

const requestedOutput = process.env.SOG_STATS_VALIDATE_OUTPUT;
if (requestedOutput) {
  const absolute = path.join(root, requestedOutput);
  check(fs.existsSync(absolute), `generated stats output missing: ${requestedOutput}`);
  if (fs.existsSync(absolute)) check(fs.readFileSync(absolute, 'utf8') === `${JSON.stringify(first, null, 2)}\n`, 'written output differs from deterministic model');
}

if (failures.length) {
  console.error('Statistics validation failed:');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  deterministic_sha256: sha256(firstJson),
  input_digest_sha256: first.input_digest_sha256,
  checkpoint_id: first.checkpoint_id,
  totals: first.totals,
  lifecycle_groups: first.lifecycle.groups,
  lifecycle_transitions: first.lifecycle.transitions,
  validated_output: requestedOutput ?? null
}, null, 2));
