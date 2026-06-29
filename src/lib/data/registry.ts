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
import stablecoinsBatchMData from '../../../data/stablecoins-batch-m.json';
import stablecoinsBatchNData from '../../../data/stablecoins-batch-n.json';
import stablecoinsBatchOData from '../../../data/stablecoins-batch-o.json';
import stablecoinsBatchPData from '../../../data/stablecoins-batch-p.json';
import stablecoinsBatchQData from '../../../data/stablecoins-batch-q.json';
import stablecoinsBatchRData from '../../../data/stablecoins-batch-r.json';

import stablecoinClassificationBatchKData from '../../../data/stablecoin-classification-batch-k.json';
import stablecoinClassificationBatchLData from '../../../data/stablecoin-classification-batch-l.json';
import stablecoinClassificationBatchMData from '../../../data/stablecoin-classification-batch-m.json';
import stablecoinClassificationBatchNData from '../../../data/stablecoin-classification-batch-n.json';
import stablecoinClassificationBatchOData from '../../../data/stablecoin-classification-batch-o.json';
import stablecoinClassificationBatchPData from '../../../data/stablecoin-classification-batch-p.json';
import stablecoinClassificationBatchQData from '../../../data/stablecoin-classification-batch-q.json';
import stablecoinClassificationBatchRData from '../../../data/stablecoin-classification-batch-r.json';

import organizationsBatchKData from '../../../data/organizations-batch-k.json';
import organizationsBatchLData from '../../../data/organizations-batch-l.json';
import organizationsBatchMData from '../../../data/organizations-batch-m.json';
import organizationsBatchNData from '../../../data/organizations-batch-n.json';
import organizationsBatchOData from '../../../data/organizations-batch-o.json';
import organizationsBatchPData from '../../../data/organizations-batch-p.json';
import organizationsBatchQData from '../../../data/organizations-batch-q.json';
import organizationsBatchRData from '../../../data/organizations-batch-r.json';

import relationshipsBatchKData from '../../../data/relationships-batch-k.json';
import relationshipsBatchLData from '../../../data/relationships-batch-l.json';
import relationshipsBatchMData from '../../../data/relationships-batch-m.json';
import relationshipsBatchNData from '../../../data/relationships-batch-n.json';
import relationshipsBatchOData from '../../../data/relationships-batch-o.json';
import relationshipsBatchPData from '../../../data/relationships-batch-p.json';
import relationshipsBatchQData from '../../../data/relationships-batch-q.json';
import relationshipsBatchRData from '../../../data/relationships-batch-r.json';

import eventsBatchKData from '../../../data/events-batch-k.json';
import eventsBatchLData from '../../../data/events-batch-l.json';
import eventsBatchMData from '../../../data/events-batch-m.json';
import eventsBatchNData from '../../../data/events-batch-n.json';
import eventsBatchOData from '../../../data/events-batch-o.json';
import eventsBatchPData from '../../../data/events-batch-p.json';
import eventsBatchQData from '../../../data/events-batch-q.json';
import eventsBatchRData from '../../../data/events-batch-r.json';

import eventDetailsBatchKData from '../../../data/event-details-batch-k.json';
import eventDetailsBatchLData from '../../../data/event-details-batch-l.json';
import eventDetailsBatchMData from '../../../data/event-details-batch-m.json';
import eventDetailsBatchNData from '../../../data/event-details-batch-n.json';
import eventDetailsBatchOData from '../../../data/event-details-batch-o.json';
import eventDetailsBatchPData from '../../../data/event-details-batch-p.json';
import eventDetailsBatchQData from '../../../data/event-details-batch-q.json';
import eventDetailsBatchRData from '../../../data/event-details-batch-r.json';

import evidenceBatchKData from '../../../data/evidence-batch-k.json';
import evidenceBatchLAData from '../../../data/evidence-batch-l-a.json';
import evidenceBatchLBData from '../../../data/evidence-batch-l-b.json';
import evidenceBatchLCData from '../../../data/evidence-batch-l-c.json';
import evidenceBatchLD1Data from '../../../data/evidence-batch-l-d1.json';
import evidenceBatchLD2Data from '../../../data/evidence-batch-l-d2.json';
import evidenceBatchMData from '../../../data/evidence-batch-m.json';
import evidenceBatchNData from '../../../data/evidence-batch-n.json';
import evidenceBatchOData from '../../../data/evidence-batch-o.json';
import evidenceBatchPData from '../../../data/evidence-batch-p.json';
import evidenceBatchQData from '../../../data/evidence-batch-q.json';
import evidenceBatchRData from '../../../data/evidence-batch-r.json';
import evidenceQualityPr219Data from '../../../data/evidence-quality-pr219.json';

import reserveReportsBatchKData from '../../../data/reserve-reports-batch-k.json';
import reserveReportsBatchLData from '../../../data/reserve-reports-batch-l.json';
import reserveReportsBatchMAData from '../../../data/reserve-reports-batch-m-a.json';
import reserveReportsBatchMBData from '../../../data/reserve-reports-batch-m-b.json';
import reserveReportsBatchNData from '../../../data/reserve-reports-batch-n.json';
import reserveReportsBatchOData from '../../../data/reserve-reports-batch-o.json';
import reserveReportsBatchPData from '../../../data/reserve-reports-batch-p.json';
import reserveReportsBatchQData from '../../../data/reserve-reports-batch-q.json';
import reserveReportsBatchRData from '../../../data/r-protocol-context.json';

import knownUnknownsBatchKData from '../../../data/known-unknowns-batch-k.json';
import knownUnknownsBatchLAData from '../../../data/known-unknowns-batch-l-a.json';
import knownUnknownsBatchLBData from '../../../data/known-unknowns-batch-l-b.json';
import knownUnknownsBatchMData from '../../../data/known-unknowns-batch-m.json';
import knownUnknownsBatchNData from '../../../data/known-unknowns-batch-n.json';
import knownUnknownsBatchOData from '../../../data/known-unknowns-batch-o.json';
import knownUnknownsBatchPData from '../../../data/known-unknowns-batch-p.json';
import knownUnknownsBatchQData from '../../../data/q-open-items.json';
import knownUnknownsBatchRData from '../../../data/r-open-items.json';

import deploymentsBatchKData from '../../../data/deployments-batch-k.json';
import deploymentsBatchLData from '../../../data/deployments-batch-l.json';
import deploymentsBatchMData from '../../../data/deployments-batch-m.json';
import deploymentsBatchNData from '../../../data/deployments-batch-n.json';
import deploymentsBatchOData from '../../../data/deployments-batch-o.json';
import deploymentsBatchPData from '../../../data/deployments-batch-p.json';
import deploymentsBatchQData from '../../../data/deployments-batch-q.json';
import deploymentsBatchRData from '../../../data/deployments-batch-r.json';

const registryBaseRuntimeFiles = `
stablecoins.json stablecoins-extra.json stablecoins-batch-b.json stablecoins-batch-c.json stablecoins-batch-d.json stablecoins-batch-e.json stablecoins-batch-f.json stablecoins-batch-g.json stablecoins-batch-h.json stablecoins-batch-i.json stablecoins-batch-j.json stablecoins-batch-k.json stablecoins-batch-l.json stablecoins-batch-m.json stablecoins-batch-n.json stablecoins-batch-o.json stablecoins-batch-p.json stablecoins-batch-q.json stablecoins-batch-r.json
organizations.json organizations-batch-b.json organizations-batch-c.json organizations-batch-d.json organizations-batch-e.json organizations-batch-f.json organizations-batch-g.json organizations-batch-h.json organizations-batch-i.json organizations-batch-j.json organizations-batch-k.json organizations-batch-l.json organizations-batch-m.json organizations-batch-n.json organizations-batch-o.json organizations-batch-p.json organizations-batch-q.json organizations-batch-r.json
relationships.json relationships-batch-b.json relationships-batch-c.json relationships-batch-d.json relationships-batch-e.json relationships-batch-f.json relationships-batch-g.json relationships-batch-h.json relationships-batch-i.json relationships-batch-j.json relationships-batch-k.json relationships-batch-l.json relationships-batch-m.json relationships-batch-n.json relationships-batch-o.json relationships-batch-p.json relationships-batch-q.json relationships-batch-r.json
stablecoin-classification-v2.json stablecoin-classification-batch-a.json stablecoin-classification-batch-b.json stablecoin-classification-batch-c.json stablecoin-classification-batch-d.json stablecoin-classification-batch-e.json stablecoin-classification-batch-f.json stablecoin-classification-batch-g.json stablecoin-classification-batch-h.json stablecoin-classification-batch-i.json stablecoin-classification-batch-j.json stablecoin-classification-batch-k.json stablecoin-classification-batch-l.json stablecoin-classification-batch-m.json stablecoin-classification-extension-batch-a.json stablecoin-classification-batch-n.json stablecoin-classification-batch-o.json stablecoin-classification-batch-p.json stablecoin-classification-batch-q.json stablecoin-classification-batch-r.json
stablecoin-profiles-v2.json stablecoin-profiles-batch-a.json stablecoin-profiles-batch-b.json stablecoin-profiles-batch-c.json stablecoin-profiles-batch-d.json stablecoin-profiles-batch-e.json stablecoin-profiles-batch-f.json stablecoin-profiles-batch-g.json stablecoin-profiles-batch-h.json stablecoin-profiles-batch-i.json stablecoin-profiles-batch-j.json stablecoin-profiles-batch-k.json stablecoin-profiles-batch-l.json stablecoin-profiles-batch-m.json stablecoin-profiles-batch-n.json stablecoin-profiles-batch-o.json stablecoin-profiles-batch-p.json stablecoin-profiles-batch-q.json r-profiles.json
events.json events-pr036.json events-pr037.json events-pr038.json events-batch-a.json events-batch-b.json events-batch-c.json events-batch-d.json events-batch-e.json events-batch-f.json events-batch-g.json events-batch-h.json events-batch-i.json events-batch-j.json events-batch-k.json events-batch-l.json events-batch-m.json events-issuer-control-2026.json events-batch-n.json events-batch-o.json events-batch-p.json events-batch-q.json events-batch-r.json
event-details-v2.json event-details-batch-a.json event-details-batch-b.json event-details-batch-c.json event-details-batch-d.json event-details-batch-e.json event-details-batch-f.json event-details-batch-g.json event-details-batch-h.json event-details-batch-i.json event-details-batch-j.json event-details-batch-k.json event-details-batch-l.json event-details-batch-m.json event-details-issuer-control-2026.json event-details-batch-n.json event-details-batch-o.json event-details-batch-p.json event-details-batch-q.json event-details-batch-r.json
evidence.json evidence-extra.json evidence-pr033.json evidence-events-pr036.json evidence-events-pr037.json evidence-events-pr038.json evidence-batch-a.json evidence-batch-b.json evidence-batch-c.json evidence-batch-d.json evidence-batch-e.json evidence-batch-f.json evidence-batch-g.json evidence-batch-h.json evidence-batch-i.json evidence-batch-j.json evidence-batch-k.json evidence-batch-l-a.json evidence-batch-l-b.json evidence-batch-l-c.json evidence-batch-l-d1.json evidence-batch-l-d2.json evidence-batch-m.json evidence-issuer-control-2026.json evidence-batch-n.json evidence-batch-o.json evidence-batch-p.json evidence-batch-q.json evidence-batch-r.json evidence-quality-pr219.json
reserve-reports.json reserve-reports-extra.json reserve-reports-pr033.json reserve-reports-pr034.json reserve-reports-batch-b.json reserve-reports-batch-f.json reserve-reports-batch-g.json reserve-reports-batch-h.json reserve-reports-batch-i.json reserve-reports-batch-j.json reserve-reports-batch-k.json reserve-reports-batch-l.json reserve-reports-batch-m-a.json reserve-reports-batch-m-b.json reserve-reports-batch-n.json reserve-reports-batch-o.json reserve-reports-batch-p.json reserve-reports-batch-q.json r-protocol-context.json
known-unknowns.json known-unknowns-extra.json known-unknowns-pr033.json known-unknowns-pr034.json known-unknowns-batch-a.json known-unknowns-batch-b.json known-unknowns-batch-c.json known-unknowns-batch-d.json known-unknowns-batch-e.json known-unknowns-batch-f.json known-unknowns-batch-g.json known-unknowns-batch-h.json known-unknowns-batch-i.json known-unknowns-batch-j.json known-unknowns-batch-k.json known-unknowns-batch-l-a.json known-unknowns-batch-l-b.json known-unknowns-batch-m.json known-unknowns-issuer-control-2026.json known-unknowns-batch-n.json known-unknowns-batch-o.json known-unknowns-batch-p.json q-open-items.json r-open-items.json
regulatory-notes.json
deployments.json deployments-extra.json deployments-batch-a.json deployments-batch-b.json deployments-batch-c.json deployments-batch-d.json deployments-batch-e.json deployments-batch-f.json deployments-batch-g.json deployments-batch-h.json deployments-batch-i.json deployments-batch-j.json deployments-batch-k.json deployments-batch-l.json deployments-batch-m.json deployments-issuer-control-2026.json deployments-batch-n.json deployments-batch-o.json deployments-batch-p.json deployments-batch-q.json deployments-batch-r.json
`;
void registryBaseRuntimeFiles;

export type { StablecoinRow, OrganizationRow, RelationshipRow, EventRow, EvidenceRow, EvidenceRelationRow, ReserveReportRow, KnownUnknownRow, RegulatoryNoteRow, DeploymentRow, RegistryUpdateRow } from './registryBase';

const unique = (items: (string | null | undefined)[]) => [...new Set(items.filter((item): item is string => typeof item === 'string' && item.length > 0))];
const classificationById = new Map([
  ...(stablecoinClassificationBatchKData as StablecoinRow[]), ...(stablecoinClassificationBatchLData as StablecoinRow[]),
  ...(stablecoinClassificationBatchMData as StablecoinRow[]), ...(stablecoinClassificationBatchNData as StablecoinRow[]),
  ...(stablecoinClassificationBatchOData as StablecoinRow[]), ...(stablecoinClassificationBatchPData as StablecoinRow[]),
  ...(stablecoinClassificationBatchQData as StablecoinRow[]), ...(stablecoinClassificationBatchRData as StablecoinRow[])
].map((row) => [row.id, row] as const));
const detailsById = new Map([
  ...(eventDetailsBatchKData as EventRow[]), ...(eventDetailsBatchLData as EventRow[]),
  ...(eventDetailsBatchMData as EventRow[]), ...(eventDetailsBatchNData as EventRow[]),
  ...(eventDetailsBatchOData as EventRow[]), ...(eventDetailsBatchPData as EventRow[]),
  ...(eventDetailsBatchQData as EventRow[]), ...(eventDetailsBatchRData as EventRow[])
].map((row) => [row.id, row] as const));
const batchStablecoins = [
  ...(stablecoinsBatchKData as StablecoinRow[]), ...(stablecoinsBatchLData as StablecoinRow[]),
  ...(stablecoinsBatchMData as StablecoinRow[]), ...(stablecoinsBatchNData as StablecoinRow[]),
  ...(stablecoinsBatchOData as StablecoinRow[]), ...(stablecoinsBatchPData as StablecoinRow[]),
  ...(stablecoinsBatchQData as StablecoinRow[]), ...(stablecoinsBatchRData as StablecoinRow[])
].map((row) => ({ ...row, ...(classificationById.get(row.id) ?? {}), ...(getStablecoinProfile(row.id) ?? {}) }));
const batchOrganizations = [
  ...(organizationsBatchKData as OrganizationRow[]), ...(organizationsBatchLData as OrganizationRow[]),
  ...(organizationsBatchMData as OrganizationRow[]), ...(organizationsBatchNData as OrganizationRow[]),
  ...(organizationsBatchOData as OrganizationRow[]), ...(organizationsBatchPData as OrganizationRow[]),
  ...(organizationsBatchQData as OrganizationRow[]), ...(organizationsBatchRData as OrganizationRow[])
].map((row) => ({ ...row, issuer_type: row.legacy_issuer_type ?? row.organization_type }));
const batchRelationships = [
  ...(relationshipsBatchKData as RelationshipRow[]), ...(relationshipsBatchLData as RelationshipRow[]),
  ...(relationshipsBatchMData as RelationshipRow[]), ...(relationshipsBatchNData as RelationshipRow[]),
  ...(relationshipsBatchOData as RelationshipRow[]), ...(relationshipsBatchPData as RelationshipRow[]),
  ...(relationshipsBatchQData as RelationshipRow[]), ...(relationshipsBatchRData as RelationshipRow[])
];
const batchEvents = [
  ...(eventsBatchKData as EventRow[]), ...(eventsBatchLData as EventRow[]),
  ...(eventsBatchMData as EventRow[]), ...(eventsBatchNData as EventRow[]),
  ...(eventsBatchOData as EventRow[]), ...(eventsBatchPData as EventRow[]),
  ...(eventsBatchQData as EventRow[]), ...(eventsBatchRData as EventRow[])
].map((row) => ({ ...row, ...(detailsById.get(row.id) ?? {}) }));
const batchEvidence = [
  ...(evidenceBatchKData as EvidenceRow[]), ...(evidenceBatchLAData as EvidenceRow[]),
  ...(evidenceBatchLBData as EvidenceRow[]), ...(evidenceBatchLCData as EvidenceRow[]),
  ...(evidenceBatchLD1Data as EvidenceRow[]), ...(evidenceBatchLD2Data as EvidenceRow[]),
  ...(evidenceBatchMData as EvidenceRow[]), ...(evidenceBatchNData as EvidenceRow[]),
  ...(evidenceBatchOData as EvidenceRow[]), ...(evidenceBatchPData as EvidenceRow[]),
  ...(evidenceBatchQData as EvidenceRow[]), ...(evidenceBatchRData as EvidenceRow[]),
  ...(evidenceQualityPr219Data as EvidenceRow[])
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
export function getReserveReports(): ReserveReportRow[] { return [...getBaseReserveReports(), ...(reserveReportsBatchKData as ReserveReportRow[]), ...(reserveReportsBatchLData as ReserveReportRow[]), ...(reserveReportsBatchMAData as ReserveReportRow[]), ...(reserveReportsBatchMBData as ReserveReportRow[]), ...(reserveReportsBatchNData as ReserveReportRow[]), ...(reserveReportsBatchOData as ReserveReportRow[]), ...(reserveReportsBatchPData as ReserveReportRow[]), ...(reserveReportsBatchQData as ReserveReportRow[]), ...(reserveReportsBatchRData as ReserveReportRow[])].map((row) => ({ ...row })); }
export function getKnownUnknowns(): KnownUnknownRow[] { return [...getBaseKnownUnknowns(), ...(knownUnknownsBatchKData as KnownUnknownRow[]), ...(knownUnknownsBatchLAData as KnownUnknownRow[]), ...(knownUnknownsBatchLBData as KnownUnknownRow[]), ...(knownUnknownsBatchMData as KnownUnknownRow[]), ...(knownUnknownsBatchNData as KnownUnknownRow[]), ...(knownUnknownsBatchOData as KnownUnknownRow[]), ...(knownUnknownsBatchPData as KnownUnknownRow[]), ...(knownUnknownsBatchQData as KnownUnknownRow[]), ...(knownUnknownsBatchRData as KnownUnknownRow[])].map((row) => ({ ...row })); }
export { getRegulatoryNotes, getRegistryUpdates };
export function getDeployments(): DeploymentRow[] { return [...getBaseDeployments(), ...(deploymentsBatchKData as DeploymentRow[]), ...(deploymentsBatchLData as DeploymentRow[]), ...(deploymentsBatchMData as DeploymentRow[]), ...(deploymentsBatchNData as DeploymentRow[]), ...(deploymentsBatchOData as DeploymentRow[]), ...(deploymentsBatchPData as DeploymentRow[]), ...(deploymentsBatchQData as DeploymentRow[]), ...(deploymentsBatchRData as DeploymentRow[])].map((row) => ({ ...row, control_event_ids: [...(row.control_event_ids ?? [])], evidence_ids: [...(row.evidence_ids ?? [])] })); }
export function getPrimaryRelationship(stablecoinId: string): RelationshipRow | undefined {
  const preferredRoles: OrganizationRole[] = ['legal_issuer', 'protocol_operator', 'brand_owner', 'reserve_manager', 'governance_body', 'redemption_agent', 'custodian', 'technology_provider', 'other'];
  return getRelationships().filter((row) => row.stablecoin_id === stablecoinId).sort((a, b) => preferredRoles.indexOf(a.role) - preferredRoles.indexOf(b.role))[0];
}
