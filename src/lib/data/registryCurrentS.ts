import {
  getStablecoins as getPreviousStablecoins,
  getOrganizations as getPreviousOrganizations,
  getRelationships as getPreviousRelationships,
  getEvents as getPreviousEvents,
  getEvidence as getPreviousEvidence,
  getEvidenceRelations as getPreviousEvidenceRelations,
  getReserveReports as getPreviousReserveReports,
  getKnownUnknowns as getPreviousKnownUnknowns,
  getRegulatoryNotes as getPreviousRegulatoryNotes,
  getDeployments as getPreviousDeployments,
  getRegistryUpdates as getPreviousRegistryUpdates
} from './registryBeforeS';
import type {
  StablecoinRow,
  OrganizationRow,
  RelationshipRow,
  EventRow,
  EvidenceRow,
  EvidenceRelationRow,
  ReserveReportRow,
  KnownUnknownRow,
  RegulatoryNoteRow,
  DeploymentRow,
  RegistryUpdateRow
} from './registryBeforeS';
import type { OrganizationRole } from '../schema/registry-v2';
import { getStablecoinProfile } from './stablecoinProfiles';

import stablecoinsBatchSData from '../../../data/stablecoins-batch-s.json';
import classificationsBatchSData from '../../../data/stablecoin-classification-batch-s.json';
import organizationsBatchSData from '../../../data/organizations-batch-s.json';
import relationshipsBatchSData from '../../../data/relationships-batch-s.json';
import eventsBatchSData from '../../../data/events-batch-s.json';
import eventDetailsBatchSData from '../../../data/event-details-batch-s.json';
import evidenceBatchSData from '../../../data/evidence-batch-s.json';
import reserveReportsBatchSData from '../../../data/s-protocol-context.json';
import knownUnknownsBatchSData from '../../../data/s-open-items.json';
import deploymentsBatchSData from '../../../data/deployments-batch-s.json';

export type {
  StablecoinRow,
  OrganizationRow,
  RelationshipRow,
  EventRow,
  EvidenceRow,
  EvidenceRelationRow,
  ReserveReportRow,
  KnownUnknownRow,
  RegulatoryNoteRow,
  DeploymentRow,
  RegistryUpdateRow
} from './registryBeforeS';

const unique = (items: (string | null | undefined)[]) => [...new Set(items.filter((item): item is string => typeof item === 'string' && item.length > 0))];
const classificationById = new Map((classificationsBatchSData as StablecoinRow[]).map((row) => [row.id, row] as const));
const detailById = new Map((eventDetailsBatchSData as EventRow[]).map((row) => [row.id, row] as const));
const stablecoins = (stablecoinsBatchSData as StablecoinRow[]).map((row) => ({
  ...row,
  ...(classificationById.get(row.id) ?? {}),
  ...(getStablecoinProfile(row.id) ?? {})
}));
const organizations = (organizationsBatchSData as OrganizationRow[]).map((row) => ({
  ...row,
  issuer_type: row.legacy_issuer_type ?? row.organization_type
}));
const relationships = relationshipsBatchSData as RelationshipRow[];
const events = (eventsBatchSData as EventRow[]).map((row) => ({ ...row, ...(detailById.get(row.id) ?? {}) }));
const evidence = (evidenceBatchSData as EvidenceRow[]).map((row) => ({
  ...row,
  stablecoin_ids: unique([...(row.stablecoin_ids ?? []), row.stablecoin_id]),
  organization_ids: unique([...(row.organization_ids ?? []), row.issuer_id]),
  event_ids: unique([...(row.event_ids ?? []), row.event_id ?? undefined]),
  claim_scopes: unique([...(row.claim_scopes ?? []), row.claim_scope])
}));
const evidenceRelations: EvidenceRelationRow[] = evidence.map((row) => ({
  id: `sog_er_${row.id.replace(/^sog_src_/, '')}`,
  evidence_id: row.id,
  stablecoin_ids: [...(row.stablecoin_ids ?? [])],
  organization_ids: [...(row.organization_ids ?? [])],
  event_ids: [...(row.event_ids ?? [])],
  claim_scopes: [...(row.claim_scopes ?? [])],
  relation_kind: 'explicit_v2'
}));

export function getStablecoins(): StablecoinRow[] {
  return [...getPreviousStablecoins(), ...stablecoins].map((row) => ({ ...row }));
}
export function getOrganizations(): OrganizationRow[] {
  return [...getPreviousOrganizations(), ...organizations].map((row) => ({ ...row }));
}
export function getRelationships(): RelationshipRow[] {
  return [...getPreviousRelationships(), ...relationships].map((row) => ({ ...row, evidence_ids: [...(row.evidence_ids ?? [])] }));
}
export function getEvents(): EventRow[] {
  return [...getPreviousEvents(), ...events].map((row) => ({
    ...row,
    subject_stablecoin_ids: [...(row.subject_stablecoin_ids ?? [])],
    subject_organization_ids: [...(row.subject_organization_ids ?? [])],
    evidence_ids: [...(row.evidence_ids ?? [])]
  }));
}
export function getEvidence(): EvidenceRow[] {
  return [...getPreviousEvidence(), ...evidence].map((row) => ({
    ...row,
    stablecoin_ids: [...(row.stablecoin_ids ?? [])],
    organization_ids: [...(row.organization_ids ?? [])],
    event_ids: [...(row.event_ids ?? [])],
    claim_scopes: [...(row.claim_scopes ?? [])]
  }));
}
export function getEvidenceRelations(): EvidenceRelationRow[] {
  return [...getPreviousEvidenceRelations(), ...evidenceRelations].map((row) => ({
    ...row,
    stablecoin_ids: [...row.stablecoin_ids],
    organization_ids: [...row.organization_ids],
    event_ids: [...row.event_ids],
    claim_scopes: [...row.claim_scopes]
  }));
}
export function getReserveReports(): ReserveReportRow[] {
  return [...getPreviousReserveReports(), ...(reserveReportsBatchSData as ReserveReportRow[])].map((row) => ({ ...row }));
}
export function getKnownUnknowns(): KnownUnknownRow[] {
  return [...getPreviousKnownUnknowns(), ...(knownUnknownsBatchSData as KnownUnknownRow[])].map((row) => ({ ...row }));
}
export function getRegulatoryNotes(): RegulatoryNoteRow[] {
  return getPreviousRegulatoryNotes();
}
export function getRegistryUpdates(): RegistryUpdateRow[] {
  return getPreviousRegistryUpdates();
}
export function getDeployments(): DeploymentRow[] {
  return [...getPreviousDeployments(), ...(deploymentsBatchSData as DeploymentRow[])].map((row) => ({
    ...row,
    control_event_ids: [...(row.control_event_ids ?? [])],
    evidence_ids: [...(row.evidence_ids ?? [])]
  }));
}
export function getPrimaryRelationship(stablecoinId: string): RelationshipRow | undefined {
  const preferredRoles: OrganizationRole[] = ['legal_issuer', 'protocol_operator', 'brand_owner', 'reserve_manager', 'governance_body', 'redemption_agent', 'custodian', 'technology_provider', 'other'];
  return getRelationships()
    .filter((row) => row.stablecoin_id === stablecoinId)
    .sort((a, b) => preferredRoles.indexOf(a.role) - preferredRoles.indexOf(b.role))[0];
}
