import {
  getStablecoins as getBaseStablecoins,
  getOrganizations as getBaseOrganizations,
  getRelationships as getBaseRelationships,
  getEvents as getBaseEvents,
  getEvidence as getBaseEvidence,
  getEvidenceRelations as getBaseEvidenceRelations,
  getReserveReports as getBaseReserveReports,
  getKnownUnknowns as getBaseKnownUnknowns,
  getRegulatoryNotes,
  getDeployments as getBaseDeployments,
  getRegistryUpdates
} from './registryBase';
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
} from './registryBase';
import type { OrganizationRole } from '../schema/registry-v2';
import { getStablecoinProfile } from './stablecoinProfiles';
import stablecoinsBatchKData from '../../../data/stablecoins-batch-k.json';
import stablecoinClassificationBatchKData from '../../../data/stablecoin-classification-batch-k.json';
import organizationsBatchKData from '../../../data/organizations-batch-k.json';
import relationshipsBatchKData from '../../../data/relationships-batch-k.json';
import eventsBatchKData from '../../../data/events-batch-k.json';
import eventDetailsBatchKData from '../../../data/event-details-batch-k.json';
import evidenceBatchKData from '../../../data/evidence-batch-k.json';
import reserveReportsBatchKData from '../../../data/reserve-reports-batch-k.json';
import knownUnknownsBatchKData from '../../../data/known-unknowns-batch-k.json';
import deploymentsBatchKData from '../../../data/deployments-batch-k.json';

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
} from './registryBase';

const unique = (items: (string | null | undefined)[]) => [...new Set(items.filter((item): item is string => typeof item === 'string' && item.length > 0))];
const classificationById = new Map((stablecoinClassificationBatchKData as StablecoinRow[]).map((row) => [row.id, row] as const));
const detailsById = new Map((eventDetailsBatchKData as EventRow[]).map((row) => [row.id, row] as const));
const batchStablecoins = (stablecoinsBatchKData as StablecoinRow[]).map((row) => ({ ...row, ...(classificationById.get(row.id) ?? {}), ...(getStablecoinProfile(row.id) ?? {}) }));
const batchOrganizations = (organizationsBatchKData as OrganizationRow[]).map((row) => ({ ...row, issuer_type: row.legacy_issuer_type ?? row.organization_type }));
const batchRelationships = relationshipsBatchKData as RelationshipRow[];
const batchEvents = (eventsBatchKData as EventRow[]).map((row) => ({ ...row, ...(detailsById.get(row.id) ?? {}) }));
const batchEvidence = (evidenceBatchKData as EvidenceRow[]).map((row) => ({
  ...row,
  stablecoin_ids: unique([...(row.stablecoin_ids ?? []), row.stablecoin_id]),
  organization_ids: unique([...(row.organization_ids ?? []), row.issuer_id]),
  event_ids: unique([...(row.event_ids ?? []), row.event_id ?? undefined]),
  claim_scopes: unique([...(row.claim_scopes ?? []), row.claim_scope])
}));
const batchEvidenceRelations: EvidenceRelationRow[] = batchEvidence.map((row) => ({
  id: `sog_er_${row.id.replace(/^sog_src_/, '')}`,
  evidence_id: row.id,
  stablecoin_ids: [...(row.stablecoin_ids ?? [])],
  organization_ids: [...(row.organization_ids ?? [])],
  event_ids: [...(row.event_ids ?? [])],
  claim_scopes: [...(row.claim_scopes ?? [])],
  relation_kind: 'explicit_v2'
}));

export function getStablecoins(): StablecoinRow[] { return [...getBaseStablecoins(), ...batchStablecoins].map((row) => ({ ...row })); }
export function getOrganizations(): OrganizationRow[] { return [...getBaseOrganizations(), ...batchOrganizations].map((row) => ({ ...row })); }
export function getRelationships(): RelationshipRow[] { return [...getBaseRelationships(), ...batchRelationships].map((row) => ({ ...row, evidence_ids: [...(row.evidence_ids ?? [])] })); }
export function getEvents(): EventRow[] { return [...getBaseEvents(), ...batchEvents].map((row) => ({ ...row, subject_stablecoin_ids: [...(row.subject_stablecoin_ids ?? [])], subject_organization_ids: [...(row.subject_organization_ids ?? [])], evidence_ids: [...(row.evidence_ids ?? [])] })); }
export function getEvidence(): EvidenceRow[] { return [...getBaseEvidence(), ...batchEvidence].map((row) => ({ ...row, stablecoin_ids: [...(row.stablecoin_ids ?? [])], organization_ids: [...(row.organization_ids ?? [])], event_ids: [...(row.event_ids ?? [])], claim_scopes: [...(row.claim_scopes ?? [])] })); }
export function getEvidenceRelations(): EvidenceRelationRow[] { return [...getBaseEvidenceRelations(), ...batchEvidenceRelations].map((row) => ({ ...row, stablecoin_ids: [...row.stablecoin_ids], organization_ids: [...row.organization_ids], event_ids: [...row.event_ids], claim_scopes: [...row.claim_scopes] })); }
export function getReserveReports(): ReserveReportRow[] { return [...getBaseReserveReports(), ...(reserveReportsBatchKData as ReserveReportRow[])].map((row) => ({ ...row })); }
export function getKnownUnknowns(): KnownUnknownRow[] { return [...getBaseKnownUnknowns(), ...(knownUnknownsBatchKData as KnownUnknownRow[])].map((row) => ({ ...row })); }
export { getRegulatoryNotes, getRegistryUpdates };
export function getDeployments(): DeploymentRow[] { return [...getBaseDeployments(), ...(deploymentsBatchKData as DeploymentRow[])].map((row) => ({ ...row, control_event_ids: [...(row.control_event_ids ?? [])], evidence_ids: [...(row.evidence_ids ?? [])] })); }
export function getPrimaryRelationship(stablecoinId: string): RelationshipRow | undefined {
  const preferredRoles: OrganizationRole[] = ['legal_issuer', 'protocol_operator', 'brand_owner', 'reserve_manager', 'governance_body', 'redemption_agent', 'custodian', 'technology_provider', 'other'];
  return getRelationships().filter((row) => row.stablecoin_id === stablecoinId).sort((a, b) => preferredRoles.indexOf(a.role) - preferredRoles.indexOf(b.role))[0];
}
