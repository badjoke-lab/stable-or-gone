import fs from 'node:fs';
import path from 'node:path';
import { getRecoveryCategory } from '../config/event-taxonomy.mjs';
import {
  getContractIdentityState,
  getDeploymentCanonicalityRecordState,
  getDeploymentVerificationState
} from '../config/deployment-taxonomy.mjs';
import { publicValueStateValues, resolvePublicValueState } from '../config/value-states.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

function readRows(root, relativePath) {
  const parsed = JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
  if (Array.isArray(parsed)) return parsed;
  if (Array.isArray(parsed.records)) return parsed.records;
  throw new Error(`${relativePath}: expected an array or records array`);
}

function readGroup(root, baseline, name) {
  return (baseline.data_groups?.[name] ?? []).flatMap((file) => readRows(root, file));
}

function countStates(states) {
  return states.reduce((counts, state) => {
    counts[state] = (counts[state] ?? 0) + 1;
    return counts;
  }, {});
}

function eventRecoveryDateState(event) {
  const recoveryDate = event.depeg_detail?.recovery_date ?? event.recovery_date;
  if (recoveryDate !== null && recoveryDate !== undefined && recoveryDate !== '') {
    return resolvePublicValueState(recoveryDate);
  }
  const category = getRecoveryCategory(event);
  if (category === 'not_applicable') return 'not_applicable';
  if (category === 'unknown') return 'unknown_after_review';
  return 'not_recorded';
}

function deploymentCanonicalityState(deployment) {
  if (getDeploymentCanonicalityRecordState(deployment.canonicality) === 'not_recorded') return 'not_recorded';
  if (deployment.canonicality === 'unknown') return 'unknown_after_review';
  return 'known';
}

function deploymentVerificationValueState(deployment) {
  const state = getDeploymentVerificationState(deployment);
  if (state === 'verified') return 'known';
  if (state === 'unknown') return 'unknown_after_review';
  return 'unverified';
}

function deploymentContractValueState(deployment) {
  const state = getContractIdentityState(deployment.contract_address);
  if (state === 'recorded_identifier') return 'known';
  if (state === 'review_needed') return 'unverified';
  if (state === 'not_applicable_or_review_unresolved') return 'unknown_after_review';
  return 'not_recorded';
}

export function buildValueStateStats(root = process.cwd()) {
  const baseline = loadRegistryV2Baseline(root);
  const stablecoins = readGroup(root, baseline, 'stablecoins');
  const organizations = readGroup(root, baseline, 'organizations');
  const relationships = readGroup(root, baseline, 'relationships');
  const eventDetails = readGroup(root, baseline, 'event_details');
  const eventDetailById = new Map(eventDetails.map((row) => [row.id, row]));
  const events = readGroup(root, baseline, 'events').map((row) => ({ ...row, ...(eventDetailById.get(row.id) ?? {}) }));
  const evidence = readGroup(root, baseline, 'evidence');
  const reserveReports = readGroup(root, baseline, 'reserve_reports');
  const knownUnknowns = readGroup(root, baseline, 'known_unknowns');
  const deployments = readGroup(root, baseline, 'deployments');

  return {
    definitions: publicValueStateValues.length,
    stablecoin_symbol: countStates(stablecoins.map((row) => resolvePublicValueState(row.symbol))),
    stablecoin_launch_date: countStates(stablecoins.map((row) => resolvePublicValueState(row.launch_date))),
    stablecoin_discontinued_date: countStates(stablecoins.map((row) => resolvePublicValueState(row.discontinued_date))),
    organization_jurisdiction: countStates(organizations.map((row) => resolvePublicValueState(row.jurisdiction))),
    relationship_start_date: countStates(relationships.map((row) => resolvePublicValueState(row.start_date))),
    relationship_end_date: countStates(relationships.map((row) => resolvePublicValueState(row.end_date))),
    event_date: countStates(events.map((row) => resolvePublicValueState(row.event_date))),
    event_recovery_date: countStates(events.map(eventRecoveryDateState)),
    evidence_published_at: countStates(evidence.map((row) => resolvePublicValueState(row.published_at))),
    reserve_report_date: countStates(reserveReports.map((row) => resolvePublicValueState(row.report_date))),
    known_unknown_record: countStates(knownUnknowns.map(() => 'unknown_after_review')),
    deployment_canonicality: countStates(deployments.map(deploymentCanonicalityState)),
    deployment_verification: countStates(deployments.map(deploymentVerificationValueState)),
    deployment_contract_identity: countStates(deployments.map(deploymentContractValueState))
  };
}
