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
import stablecoinsBatchLData from '../../../data/stablecoins-batch-l.json';
import stablecoinClassificationBatchKData from '../../../data/stablecoin-classification-batch-k.json';
import stablecoinClassificationBatchLData from '../../../data/stablecoin-classification-batch-l.json';
import organizationsBatchKData from '../../../data/organizations-batch-k.json';
import organizationsBatchLData from '../../../data/organizations-batch-l.json';
import relationshipsBatchKData from '../../../data/relationships-batch-k.json';
import relationshipsBatchLData from '../../../data/relationships-batch-l.json';
import eventsBatchKData from '../../../data/events-batch-k.json';
import eventsBatchLData from '../../../data/events-batch-l.json';
import eventDetailsBatchKData from '../../../data/event-details-batch-k.json';
import eventDetailsBatchLData from '../../../data/event-details-batch-l.json';
import evidenceBatchKData from '../../../data/evidence-batch-k.json';
import evidenceBatchLAData from '../../../data/evidence-batch-l-a.json';
import evidenceBatchLBData from '../../../data/evidence-batch-l-b.json';
import evidenceBatchLCData from '../../../data/evidence-batch-l-c.json';
import evidenceBatchLD1Data from '../../../data/evidence-batch-l-d1.json';
import evidenceBatchLD2Data from '../../../data/evidence-batch-l-d2.json';
import reserveReportsBatchKData from '../../../data/reserve-reports-batch-k.json';
import reserveReportsBatchLData from '../../../data/reserve-reports-batch-l.json';
import knownUnknownsBatchKData from '../../../data/known-unknowns-batch-k.json';
import knownUnknownsBatchLAData from '../../../data/known-unknowns-batch-l-a.json';
import knownUnknownsBatchLBData from '../../../data/known-unknowns-batch-l-b.json';
import deploymentsBatchKData from '../../../data/deployments-batch-k.json';
import deploymentsBatchLData from '../../../data/deployments-batch-l.json';

// These files are loaded by registryBase.ts. Keeping the complete layered input list
// here lets finalization verify that every baseline group has a runtime loader.
const registryBaseRuntimeFiles = `
stablecoins.json stablecoins-extra.json stablecoins-batch-b.json stablecoins-batch-c.json stablecoins-batch-d.json stablecoins-batch-e.json stablecoins-batch-f.json stablecoins-batch-g.json stablecoins-batch-h.json stablecoins-batch-i.json stablecoins-batch-j.json stablecoins-batch-k.json stablecoins-batch-l.json
organizations.json organizations-batch-b.json organizations-batch-c.json organizations-batch-d.json organizations-batch-e.json organizations-batch-f.json organizations-batch-g.json organizations-batch-h.json organizations-batch-i.json organizations-batch-j.json organizations-batch-k.json organizations-batch-l.json
relationships.json relationships-batch-b.json relationships-batch-c.json relationships-batch-d.json relationships-batch-e.json relationships-batch-f.json relationships-batch-g.json relationships-batch-h.json relationships-batch-i.json relationships-batch-j.json relationships-batch-k.json relationships-batch-l.json
stablecoin-classification-v2.json stablecoin-classification-batch-a.json stablecoin-classification-batch-b.json stablecoin-classification-batch-c.json stablecoin-classification-batch-d.json stablecoin-classification-batch-e.json stablecoin-classification-batch-f.json stablecoin-classification-batch-g.json stablecoin-classification-batch-h.json stablecoin-classification-batch-i.json stablecoin-classification-batch-j.json stablecoin-classification-batch-k.json stablecoin-classification-batch-l.json stablecoin-classification-extension-batch-a.json
stablecoin-profiles-v2.json stablecoin-profiles-batch-a.json stablecoin-profiles-batch-b.json stablecoin-profiles-batch-c.json stablecoin-profiles-batch-d.json stablecoin-profiles-batch-e.json stablecoin-profiles-batch-f.json stablecoin-profiles-batch-g.json stablecoin-profiles-batch-h.json stablecoin-profiles-batch-i.json stablecoin-profiles-batch-j.json stablecoin-profiles-batch-k.json stablecoin-profiles-batch-l.json
events.json events-pr036.json events-pr037.json events-pr038.json events-batch-a.json events-batch-b.json events-batch-c.json events-batch-d.json events-batch-e.json events-batch-f.json events-batch-g.json events-batch-h.json events-batch-i.json events-batch-j.json events-batch-k.json events-batch-l.json events-issuer-control-2026.json
event-details-v2.json event-details-batch-a.json event-details-batch-b.json event-details-batch-c.json event-details-batch-d.json event-details-batch-e.json event-details-batch-f.json event-details-batch-g.json event-details-batch-h.json event-details-batch-i.json event-details-batch-j.json event-details-batch-k.json event-details-batch-l.json event-details-issuer-control-2026.json
evidence.json evidence-extra.json evidence-pr033.json evidence-events-pr036.json evidence-events-pr037.json evidence-events-pr038.json evidence-batch-a.json evidence-batch-b.json evidence-batch-c.json evidence-batch-d.json evidence-batch-e.json evidence-batch-f.json evidence-batch-g.json evidence-batch-h.json evidence-batch-i.json evidence-batch-j.json evidence-batch-k.json evidence-batch-l-a.json evidence-batch-l-b.json evidence-batch-l-c.json evidence-batch-l-d1.json evidence-batch-l-d2.json evidence-issuer-control-2026.json
reserve-reports.json reserve-reports-extra.json reserve-reports-pr033.json reserve-reports-pr034.json reserve-reports-batch-b.json reserve-reports-batch-f.json reserve-reports-batch-g.json reserve-reports-batch-h.json reserve-reports-batch-i.json reserve-reports-batch-j.json reserve-reports-batch-k.json reserve-reports-batch-l.json
known-unknowns.json known-unknowns-extra.json known-unknowns-pr033.json known-unknowns-pr034.json known-unknowns-batch-a.json known-unknowns-batch-b.json known-unknowns-batch-c.json known-unknowns-batch-d.json known-unknowns-batch-e.json known-unknowns-batch-f.json known-unknowns-batch-g.json known-unknowns-batch-h.json known-unknowns-batch-i.json known-unknowns-batch-j.json known-unknowns-batch-k.json known-unknowns-batch-l-a.json known-unknowns-batch-l-b.json known-unknowns-issuer-control-2026.json
regulatory-notes.json
deployments.json deployments-extra.json deployments-batch-a.json deployments-batch-b.json deployments-batch-c.json deployments-batch-d.json deployments-batch-e.json deployments-batch-f.json deployments-batch-g.json deployments-batch-h.json deployments-batch-i.json deployments-batch-j.json deployments-batch-k.json deployments-batch-l.json deployments-issuer-control-2026.json
`;
void registryBaseRuntimeFiles;

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
const classificationById = new Map([
  ...(stablecoinClassificationBatchKData as StablecoinRow[]),
  ...(stablecoinClassificationBatchLData as StablecoinRow[])
].map((row) => [row.id, row] as const));
const detailsById = new Map([
  ...(eventDetailsBatchKData as EventRow[]),
  ...(eventDetailsBatchLData as EventRow[])
].map((row) => [row.id, row] as const));
const batchStablecoins = [
  ...(stablecoinsBatchKData as StablecoinRow[]),
  ...(stablecoinsBatchLData as StablecoinRow[])
].map((row) => ({ ...row, ...(classificationById.get(row.id) ?? {}), ...(getStablecoinProfile(row.id) ?? {}) }));
const batchOrganizations = [
  ...(organizationsBatchKData as OrganizationRow[]),
  ...(organizationsBatchLData as OrganizationRow[])
].map((row) => ({ ...row, issuer_type: row.legacy_issuer_type ?? row.organization_type }));
const batchRelationships = [
  ...(relationshipsBatchKData as RelationshipRow[]),
  ...(relationshipsBatchLData as RelationshipRow[])
];
const batchEvents = [
  ...(eventsBatchKData as EventRow[]),
  ...(eventsBatchLData as EventRow[])
].map((row) => ({ ...row, ...(detailsById.get(row.id) ?? {}) }));
const batchEvidence = [
  ...(evidenceBatchKData as EvidenceRow[]),
  ...(evidenceBatchLAData as EvidenceRow[]),
  ...(evidenceBatchLBData as EvidenceRow[]),
  ...(evidenceBatchLCData as EvidenceRow[]),
  ...(evidenceBatchLD1Data as EvidenceRow[]),
  ...(evidenceBatchLD2Data as EvidenceRow[])
].map((row) => ({
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
export function getReserveReports(): ReserveReportRow[] { return [...getBaseReserveReports(), ...(reserveReportsBatchKData as ReserveReportRow[]), ...(reserveReportsBatchLData as ReserveReportRow[])].map((row) => ({ ...row })); }
export function getKnownUnknowns(): KnownUnknownRow[] { return [...getBaseKnownUnknowns(), ...(knownUnknownsBatchKData as KnownUnknownRow[]), ...(knownUnknownsBatchLAData as KnownUnknownRow[]), ...(knownUnknownsBatchLBData as KnownUnknownRow[])].map((row) => ({ ...row })); }
export { getRegulatoryNotes, getRegistryUpdates };
export function getDeployments(): DeploymentRow[] { return [...getBaseDeployments(), ...(deploymentsBatchKData as DeploymentRow[]), ...(deploymentsBatchLData as DeploymentRow[])].map((row) => ({ ...row, control_event_ids: [...(row.control_event_ids ?? [])], evidence_ids: [...(row.evidence_ids ?? [])] })); }
export function getPrimaryRelationship(stablecoinId: string): RelationshipRow | undefined {
  const preferredRoles: OrganizationRole[] = ['legal_issuer', 'protocol_operator', 'brand_owner', 'reserve_manager', 'governance_body', 'redemption_agent', 'custodian', 'technology_provider', 'other'];
  return getRelationships().filter((row) => row.stablecoin_id === stablecoinId).sort((a, b) => preferredRoles.indexOf(a.role) - preferredRoles.indexOf(b.role))[0];
}
