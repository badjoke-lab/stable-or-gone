import { publicValueStateValues, resolvePublicValueState, type PublicValueState } from '../../config/value-states.mjs';
import {
  getEvidence,
  getEvents,
  getKnownUnknowns,
  getOrganizations,
  getRelationships,
  getReserveReports,
  getStablecoins
} from './data/registry';
import { getDeploymentsV3 } from './data/registryV3';
import { resolveDeploymentTaxonomy } from '../utils/deploymentTaxonomy';
import { resolveEventTaxonomy } from '../utils/eventTaxonomy';

function countStates(states: PublicValueState[]) {
  return states.reduce<Record<string, number>>((counts, state) => {
    counts[state] = (counts[state] ?? 0) + 1;
    return counts;
  }, {});
}

function eventRecoveryDateState(event: Record<string, any>): PublicValueState {
  const taxonomy = resolveEventTaxonomy(event);
  const recoveryDate = event.depeg_detail?.recovery_date ?? event.recovery_date;
  if (recoveryDate !== null && recoveryDate !== undefined && recoveryDate !== '') {
    return resolvePublicValueState(recoveryDate);
  }
  if (taxonomy.recovery_category === 'not_applicable') return 'not_applicable';
  if (taxonomy.recovery_category === 'unknown') return 'unknown_after_review';
  return 'not_recorded';
}

function deploymentCanonicalityState(deployment: Record<string, any>): PublicValueState {
  const taxonomy = resolveDeploymentTaxonomy(deployment);
  if (taxonomy.canonicality_record_state === 'not_recorded') return 'not_recorded';
  if (taxonomy.canonicality === 'unknown') return 'unknown_after_review';
  return 'known';
}

function deploymentVerificationState(deployment: Record<string, any>): PublicValueState {
  const taxonomy = resolveDeploymentTaxonomy(deployment);
  if (taxonomy.verification_state === 'verified') return 'known';
  if (taxonomy.verification_state === 'unknown') return 'unknown_after_review';
  return 'unverified';
}

function deploymentContractState(deployment: Record<string, any>): PublicValueState {
  const taxonomy = resolveDeploymentTaxonomy(deployment);
  if (taxonomy.contract_identity_state === 'recorded_identifier') return 'known';
  if (taxonomy.contract_identity_state === 'review_needed') return 'unverified';
  if (taxonomy.contract_identity_state === 'not_applicable_or_review_unresolved') return 'unknown_after_review';
  return 'not_recorded';
}

export function getPublicValueStateBreakdown() {
  const stablecoins = getStablecoins();
  const organizations = getOrganizations();
  const relationships = getRelationships();
  const events = getEvents();
  const evidence = getEvidence();
  const reserveReports = getReserveReports();
  const knownUnknowns = getKnownUnknowns();
  const deployments = getDeploymentsV3();

  return {
    public_value_state_definitions: publicValueStateValues.length,
    stablecoin_symbol_value_state: countStates(stablecoins.map((item) => resolvePublicValueState(item.symbol))),
    stablecoin_launch_date_value_state: countStates(stablecoins.map((item) => resolvePublicValueState(item.launch_date))),
    stablecoin_discontinued_date_value_state: countStates(stablecoins.map((item) => resolvePublicValueState(item.discontinued_date))),
    organization_jurisdiction_value_state: countStates(organizations.map((item) => resolvePublicValueState(item.jurisdiction))),
    relationship_start_date_value_state: countStates(relationships.map((item) => resolvePublicValueState(item.start_date))),
    relationship_end_date_value_state: countStates(relationships.map((item) => resolvePublicValueState(item.end_date))),
    event_date_value_state: countStates(events.map((item) => resolvePublicValueState(item.event_date))),
    event_recovery_date_value_state: countStates(events.map((item) => eventRecoveryDateState(item))),
    evidence_published_at_value_state: countStates(evidence.map((item) => resolvePublicValueState(item.published_at))),
    reserve_report_date_value_state: countStates(reserveReports.map((item) => resolvePublicValueState(item.report_date))),
    known_unknown_record_value_state: countStates(knownUnknowns.map(() => 'unknown_after_review')),
    deployment_canonicality_value_state: countStates(deployments.map((item) => deploymentCanonicalityState(item))),
    deployment_verification_value_state: countStates(deployments.map((item) => deploymentVerificationState(item))),
    deployment_contract_identity_value_state: countStates(deployments.map((item) => deploymentContractState(item)))
  };
}
