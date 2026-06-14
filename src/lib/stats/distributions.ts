import type { StatsData } from './data';
import { countMany, countValues, countYears } from './core';

export function buildDistributions(data: StatsData) {
  return {
    status: countValues(data.stablecoins.map((row) => row.status)),
    lifecycle_status: countValues(data.stablecoins.map((row) => row.lifecycle_status)),
    issuance_status: countValues(data.stablecoins.map((row) => row.issuance_status)),
    peg_reference: countValues(data.stablecoins.map((row) => row.peg_reference ?? row.peg_asset)),
    asset_class: countValues(data.stablecoins.map((row) => row.asset_class)),
    backing_types: countMany(data.stablecoins.map((row) => [...(row.backing_types ?? [])])),
    stabilization_mechanism: countValues(data.stablecoins.map((row) => row.stabilization_mechanism)),
    governance_model: countValues(data.stablecoins.map((row) => row.governance_model)),
    reserve_disclosure_status: countValues(data.stablecoins.map((row) => row.reserve_disclosure_status)),
    redemption_status: countValues(data.stablecoins.map((row) => row.redemption_status)),
    organization_type: countValues(data.organizations.map((row) => row.organization_type ?? row.issuer_type)),
    relationship_role: countValues(data.relationships.map((row) => row.role)),
    event_type: countValues(data.events.map((row) => row.event_type)),
    event_impact_level: countValues(data.events.map((row) => row.impact_level)),
    event_status_effect: countValues(data.events.map((row) => row.event_status_effect)),
    evidence_source_type: countValues(data.evidence.map((row) => row.source_type)),
    evidence_reliability: countValues(data.evidence.map((row) => row.reliability)),
    reserve_report_type: countValues(data.reserveReports.map((row) => row.report_type)),
    known_unknown_severity: countValues(data.knownUnknowns.map((row) => row.severity)),
    deployment_chain: countValues(data.deployments.map((row) => row.chain)),
    deployment_status: countValues(data.deployments.map((row) => row.status)),
    deployment_canonicality: countValues(data.deploymentsV3.map((row) => row.canonicality)),
    legal_classification: countValues(data.legalProfiles.flatMap((row) => row.classifications.map((entry) => entry.classification))),
    holder_claim_type: countValues(data.legalProfiles.map((row) => row.holder_claim_type)),
    reserve_component_category: countValues(data.reserveComponents.map((row) => row.asset_category)),
    income_availability: countValues(data.incomeProfiles.map((row) => row.availability)),
    income_source: countValues(data.incomeProfiles.map((row) => row.source)),
    income_accrual: countValues(data.incomeProfiles.map((row) => row.accrual)),
    income_rate_type: countValues(data.incomeProfiles.map((row) => row.rate)),
  };
}

export function buildTrend(data: StatsData) {
  return {
    launches_by_year: countYears(data.stablecoins.map((row) => row.launch_date)),
    discontinuations_by_year: countYears(data.stablecoins.map((row) => row.discontinued_date)),
    events_by_year: countYears(data.events.map((row) => row.event_date)),
    reserve_reports_by_year: countYears(data.reserveReports.map((row) => row.report_date)),
  };
}
