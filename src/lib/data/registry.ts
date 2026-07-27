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
import stablecoinsBatchSData from '../../../data/stablecoins-batch-s.json';
import stablecoinsBatchTData from '../../../data/stablecoins-batch-t.json';
import stablecoinsBatchUData from '../../../data/stablecoins-batch-u.json';
import stablecoinsBatchVData from '../../../data/stablecoins-batch-v.json';
import stablecoinsBatchWData from '../../../data/stablecoins-batch-w.json';
import stablecoinsBatchXData from '../../../data/stablecoins-batch-x.json';
import stablecoinsBatchYData from '../../../data/stablecoins-batch-y.json';
import stablecoinsBatchZData from '../../../data/stablecoins-batch-z.json';
import stablecoinsBatchAAData from '../../../data/stablecoins-batch-aa.json';
import stablecoinsBatchABData from '../../../data/stablecoins-batch-ab.json';

import stablecoinClassificationBatchKData from '../../../data/stablecoin-classification-batch-k.json';
import stablecoinClassificationBatchLData from '../../../data/stablecoin-classification-batch-l.json';
import stablecoinClassificationBatchMData from '../../../data/stablecoin-classification-batch-m.json';
import stablecoinClassificationBatchNData from '../../../data/stablecoin-classification-batch-n.json';
import stablecoinClassificationBatchOData from '../../../data/stablecoin-classification-batch-o.json';
import stablecoinClassificationBatchPData from '../../../data/stablecoin-classification-batch-p.json';
import stablecoinClassificationBatchQData from '../../../data/stablecoin-classification-batch-q.json';
import stablecoinClassificationBatchRData from '../../../data/stablecoin-classification-batch-r.json';
import stablecoinClassificationBatchSData from '../../../data/stablecoin-classification-batch-s.json';
import stablecoinClassificationBatchTData from '../../../data/stablecoin-classification-batch-t.json';
import stablecoinClassificationBatchUData from '../../../data/stablecoin-classification-batch-u.json';
import stablecoinClassificationBatchVData from '../../../data/stablecoin-classification-batch-v.json';
import stablecoinClassificationBatchWData from '../../../data/stablecoin-classification-batch-w.json';
import stablecoinClassificationBatchXData from '../../../data/stablecoin-classification-batch-x.json';
import stablecoinClassificationBatchYData from '../../../data/stablecoin-classification-batch-y.json';
import stablecoinClassificationBatchZData from '../../../data/stablecoin-classification-batch-z.json';
import stablecoinClassificationBatchAAData from '../../../data/stablecoin-classification-batch-aa.json';
import stablecoinClassificationBatchABData from '../../../data/stablecoin-classification-batch-ab.json';

import organizationsBatchKData from '../../../data/organizations-batch-k.json';
import organizationsBatchLData from '../../../data/organizations-batch-l.json';
import organizationsBatchMData from '../../../data/organizations-batch-m.json';
import organizationsBatchNData from '../../../data/organizations-batch-n.json';
import organizationsBatchOData from '../../../data/organizations-batch-o.json';
import organizationsBatchPData from '../../../data/organizations-batch-p.json';
import organizationsBatchQData from '../../../data/organizations-batch-q.json';
import organizationsBatchRData from '../../../data/organizations-batch-r.json';
import organizationsBatchSData from '../../../data/organizations-batch-s.json';
import organizationsBatchTData from '../../../data/organizations-batch-t.json';
import organizationsBatchUData from '../../../data/organizations-batch-u.json';
import organizationsBatchVData from '../../../data/organizations-batch-v.json';
import organizationsBatchWData from '../../../data/organizations-batch-w.json';
import organizationsBatchXData from '../../../data/organizations-batch-x.json';
import organizationsBatchYData from '../../../data/organizations-batch-y.json';
import organizationsBatchZData from '../../../data/organizations-batch-z.json';

import relationshipsBatchKData from '../../../data/relationships-batch-k.json';
import relationshipsBatchLData from '../../../data/relationships-batch-l.json';
import relationshipsBatchMData from '../../../data/relationships-batch-m.json';
import relationshipsBatchNData from '../../../data/relationships-batch-n.json';
import relationshipsBatchOData from '../../../data/relationships-batch-o.json';
import relationshipsBatchPData from '../../../data/relationships-batch-p.json';
import relationshipsBatchQData from '../../../data/relationships-batch-q.json';
import relationshipsBatchRData from '../../../data/relationships-batch-r.json';
import relationshipsBatchSData from '../../../data/relationships-batch-s.json';
import relationshipsBatchTData from '../../../data/relationships-batch-t.json';
import relationshipsBatchUData from '../../../data/relationships-batch-u.json';
import relationshipsBatchVData from '../../../data/relationships-batch-v.json';
import relationshipsBatchWData from '../../../data/relationships-batch-w.json';
import relationshipsBatchXData from '../../../data/relationships-batch-x.json';
import relationshipsBatchYData from '../../../data/relationships-batch-y.json';
import relationshipsBatchZData from '../../../data/relationships-batch-z.json';
import relationshipsBatchAAData from '../../../data/relationships-batch-aa.json';
import relationshipsBatchABData from '../../../data/relationships-batch-ab.json';

import eventsBatchKData from '../../../data/events-batch-k.json';
import eventsBatchLData from '../../../data/events-batch-l.json';
import eventsBatchMData from '../../../data/events-batch-m.json';
import eventsBatchNData from '../../../data/events-batch-n.json';
import eventsBatchOData from '../../../data/events-batch-o.json';
import eventsBatchPData from '../../../data/events-batch-p.json';
import eventsBatchQData from '../../../data/events-batch-q.json';
import eventsBatchRData from '../../../data/events-batch-r.json';
import eventsBatchSData from '../../../data/events-batch-s.json';
import eventsBatchTData from '../../../data/events-batch-t.json';
import eventsBatchUData from '../../../data/events-batch-u.json';
import eventsBatchVData from '../../../data/events-batch-v.json';
import eventsBatchWData from '../../../data/events-batch-w.json';
import eventsBatchXData from '../../../data/events-batch-x.json';
import eventsBatchYData from '../../../data/events-batch-y.json';
import eventsBatchZData from '../../../data/events-batch-z.json';
import eventsBatchAAData from '../../../data/events-batch-aa.json';
import eventsBatchABData from '../../../data/events-batch-ab.json';

import eventDetailsBatchKData from '../../../data/event-details-batch-k.json';
import eventDetailsBatchLData from '../../../data/event-details-batch-l.json';
import eventDetailsBatchMData from '../../../data/event-details-batch-m.json';
import eventDetailsBatchNData from '../../../data/event-details-batch-n.json';
import eventDetailsBatchOData from '../../../data/event-details-batch-o.json';
import eventDetailsBatchPData from '../../../data/event-details-batch-p.json';
import eventDetailsBatchQData from '../../../data/event-details-batch-q.json';
import eventDetailsBatchRData from '../../../data/event-details-batch-r.json';
import eventDetailsBatchSData from '../../../data/event-details-batch-s.json';
import eventDetailsBatchTAData from '../../../data/event-details-batch-t-a.json';
import eventDetailsBatchTBData from '../../../data/event-details-batch-t-b.json';
import eventDetailsBatchUData from '../../../data/event-details-batch-u.json';
import eventDetailsBatchVData from '../../../data/event-details-batch-v.json';
import eventDetailsBatchWData from '../../../data/event-details-batch-w.json';
import eventDetailsBatchXData from '../../../data/event-details-batch-x.json';
import eventDetailsBatchYData from '../../../data/event-details-batch-y.json';
import eventDetailsBatchZData from '../../../data/event-details-batch-z.json';
import eventDetailsBatchAAData from '../../../data/event-details-batch-aa.json';
import eventDetailsBatchABData from '../../../data/event-details-batch-ab.json';

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
import evidenceBatchSData from '../../../data/evidence-batch-s.json';
import evidenceBatchTData from '../../../data/evidence-batch-t.json';
import evidenceBatchTB1Data from '../../../data/evidence-batch-t-b1.json';
import evidenceBatchTB2Data from '../../../data/evidence-batch-t-b2.json';
import evidenceBatchUData from '../../../data/evidence-batch-u.json';
import evidenceBatchVData from '../../../data/evidence-batch-v.json';
import evidenceBatchWData from '../../../data/evidence-batch-w.json';
import evidenceBatchXData from '../../../data/evidence-batch-x.json';
import evidenceBatchYData from '../../../data/evidence-batch-y.json';
import evidenceBatchZData from '../../../data/evidence-batch-z.json';
import evidenceBatchAAData from '../../../data/evidence-batch-aa.json';
import evidenceBatchABData from '../../../data/evidence-batch-ab.json';
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
import reserveReportsBatchSData from '../../../data/s-protocol-context.json';
import reserveReportsBatchTData from '../../../data/batch-t-context.json';
import reserveReportsBatchUData from '../../../data/batch-u-context.json';
import reserveReportsBatchVData from '../../../data/batch-v-context.json';
import reserveReportsBatchWData from '../../../data/batch-w-context.json';
import reserveReportsBatchXData from '../../../data/batch-x-context.json';
import reserveReportsBatchYData from '../../../data/batch-y-context.json';
import reserveReportsBatchZData from '../../../data/batch-z-context.json';
import reserveReportsBatchAAData from '../../../data/batch-aa-context.json';
import reserveReportsBatchABData from '../../../data/batch-ab-context.json';

import knownUnknownsBatchKData from '../../../data/known-unknowns-batch-k.json';
import knownUnknownsBatchLAData from '../../../data/known-unknowns-batch-l-a.json';
import knownUnknownsBatchLBData from '../../../data/known-unknowns-batch-l-b.json';
import knownUnknownsBatchMData from '../../../data/known-unknowns-batch-m.json';
import knownUnknownsBatchNData from '../../../data/known-unknowns-batch-n.json';
import knownUnknownsBatchOData from '../../../data/known-unknowns-batch-o.json';
import knownUnknownsBatchPData from '../../../data/known-unknowns-batch-p.json';
import knownUnknownsBatchQData from '../../../data/q-open-items.json';
import knownUnknownsBatchRData from '../../../data/r-open-items.json';
import knownUnknownsBatchSData from '../../../data/s-open-items.json';
import knownUnknownsBatchTData from '../../../data/batch-t-review-gaps.json';
import knownUnknownsBatchUData from '../../../data/batch-u-review-gaps.json';
import knownUnknownsBatchVData from '../../../data/batch-v-review-gaps.json';
import knownUnknownsBatchWData from '../../../data/batch-w-review-gaps.json';
import knownUnknownsBatchXData from '../../../data/batch-x-review-gaps.json';
import knownUnknownsBatchYData from '../../../data/batch-y-review-gaps.json';
import knownUnknownsBatchZData from '../../../data/batch-z-review-gaps.json';
import knownUnknownsBatchAAData from '../../../data/batch-aa-review-gaps.json';
import knownUnknownsBatchABData from '../../../data/batch-ab-review-gaps.json';

import deploymentsBatchKData from '../../../data/deployments-batch-k.json';
import deploymentsBatchLData from '../../../data/deployments-batch-l.json';
import deploymentsBatchMData from '../../../data/deployments-batch-m.json';
import deploymentsBatchNData from '../../../data/deployments-batch-n.json';
import deploymentsBatchOData from '../../../data/deployments-batch-o.json';
import deploymentsBatchPData from '../../../data/deployments-batch-p.json';
import deploymentsBatchQData from '../../../data/deployments-batch-q.json';
import deploymentsBatchRData from '../../../data/deployments-batch-r.json';
import deploymentsBatchSData from '../../../data/deployments-batch-s.json';
import deploymentsBatchTData from '../../../data/batch-t-deployments.json';
import deploymentsBatchUData from '../../../data/batch-u-deployments.json';
import deploymentsBatchVData from '../../../data/batch-v-deployments.json';
import deploymentsBatchWData from '../../../data/batch-w-deployments.json';
import deploymentsBatchXData from '../../../data/batch-x-deployments.json';
import deploymentsBatchYData from '../../../data/batch-y-deployments.json';
import deploymentsBatchZData from '../../../data/batch-z-deployments.json';
import deploymentsBatchAAData from '../../../data/batch-aa-deployments.json';
import deploymentsBatchABData from '../../../data/batch-ab-deployments.json';

const registryBaseRuntimeFiles = `
stablecoins-batch-v.json
organizations-batch-v.json
relationships-batch-v.json
stablecoin-classification-batch-v.json
batch-v-reserve-redemption.json
events-batch-v.json
event-details-batch-v.json
evidence-batch-v.json
batch-v-context.json
batch-v-review-gaps.json
batch-v-deployments.json
stablecoins-batch-w.json
organizations-batch-w.json
relationships-batch-w.json
stablecoin-classification-batch-w.json
batch-w-reserve-redemption.json
events-batch-w.json
event-details-batch-w.json
evidence-batch-w.json
batch-w-context.json
batch-w-review-gaps.json
batch-w-deployments.json
stablecoins-batch-x.json
organizations-batch-x.json
relationships-batch-x.json
stablecoin-classification-batch-x.json
batch-x-reserve-redemption.json
events-batch-x.json
event-details-batch-x.json
evidence-batch-x.json
batch-x-context.json
batch-x-review-gaps.json
batch-x-deployments.json
stablecoins-batch-y.json
organizations-batch-y.json
relationships-batch-y.json
stablecoin-classification-batch-y.json
batch-y-reserve-redemption.json
events-batch-y.json
event-details-batch-y.json
evidence-batch-y.json
batch-y-context.json
batch-y-review-gaps.json
batch-y-deployments.json
`;
void registryBaseRuntimeFiles;

export type { StablecoinRow, OrganizationRow, RelationshipRow, EventRow, EvidenceRow, EvidenceRelationRow, ReserveReportRow, KnownUnknownRow, RegulatoryNoteRow, DeploymentRow, RegistryUpdateRow } from './registryBase';

const unique = (items: (string | null | undefined)[]) => [...new Set(items.filter((item): item is string => typeof item === 'string' && item.length > 0))];
const classificationById = new Map([
  ...(stablecoinClassificationBatchKData as StablecoinRow[]), ...(stablecoinClassificationBatchLData as StablecoinRow[]),
  ...(stablecoinClassificationBatchMData as StablecoinRow[]), ...(stablecoinClassificationBatchNData as StablecoinRow[]),
  ...(stablecoinClassificationBatchOData as StablecoinRow[]), ...(stablecoinClassificationBatchPData as StablecoinRow[]),
  ...(stablecoinClassificationBatchQData as StablecoinRow[]), ...(stablecoinClassificationBatchRData as StablecoinRow[]),
  ...(stablecoinClassificationBatchSData as StablecoinRow[]), ...(stablecoinClassificationBatchTData as StablecoinRow[]),
  ...(stablecoinClassificationBatchUData as StablecoinRow[]), ...(stablecoinClassificationBatchVData as StablecoinRow[]),
  ...(stablecoinClassificationBatchWData as StablecoinRow[]), ...(stablecoinClassificationBatchXData as StablecoinRow[]),
  ...(stablecoinClassificationBatchYData as StablecoinRow[]), ...(stablecoinClassificationBatchZData as StablecoinRow[]), ...(stablecoinClassificationBatchAAData as unknown as StablecoinRow[]), ...(stablecoinClassificationBatchABData as unknown as StablecoinRow[])
].map((row) => [row.id, row] as const));
const detailsById = new Map([
  ...(eventDetailsBatchKData as EventRow[]), ...(eventDetailsBatchLData as EventRow[]),
  ...(eventDetailsBatchMData as EventRow[]), ...(eventDetailsBatchNData as EventRow[]),
  ...(eventDetailsBatchOData as EventRow[]), ...(eventDetailsBatchPData as EventRow[]),
  ...(eventDetailsBatchQData as EventRow[]), ...(eventDetailsBatchRData as EventRow[]),
  ...(eventDetailsBatchSData as EventRow[]), ...(eventDetailsBatchTAData as EventRow[]),
  ...(eventDetailsBatchTBData as EventRow[]), ...(eventDetailsBatchUData as EventRow[]),
  ...(eventDetailsBatchVData as EventRow[]), ...(eventDetailsBatchWData as EventRow[]),
  ...(eventDetailsBatchXData as EventRow[]), ...(eventDetailsBatchYData as EventRow[]), ...(eventDetailsBatchZData as EventRow[]), ...(eventDetailsBatchAAData as unknown as EventRow[]), ...(eventDetailsBatchABData as unknown as EventRow[])
].map((row) => [row.id, row] as const));
const batchStablecoins = [
  ...(stablecoinsBatchKData as StablecoinRow[]), ...(stablecoinsBatchLData as StablecoinRow[]),
  ...(stablecoinsBatchMData as StablecoinRow[]), ...(stablecoinsBatchNData as StablecoinRow[]),
  ...(stablecoinsBatchOData as StablecoinRow[]), ...(stablecoinsBatchPData as StablecoinRow[]),
  ...(stablecoinsBatchQData as StablecoinRow[]), ...(stablecoinsBatchRData as StablecoinRow[]),
  ...(stablecoinsBatchSData as StablecoinRow[]), ...(stablecoinsBatchTData as StablecoinRow[]),
  ...(stablecoinsBatchUData as StablecoinRow[]), ...(stablecoinsBatchVData as StablecoinRow[]),
  ...(stablecoinsBatchWData as StablecoinRow[]), ...(stablecoinsBatchXData as StablecoinRow[]),
  ...(stablecoinsBatchYData as StablecoinRow[]), ...(stablecoinsBatchZData as StablecoinRow[]), ...(stablecoinsBatchAAData as unknown as StablecoinRow[]), ...(stablecoinsBatchABData as unknown as StablecoinRow[])
].map((row) => ({ ...row, ...(classificationById.get(row.id) ?? {}), ...(getStablecoinProfile(row.id) ?? {}) }));
const batchOrganizations = [
  ...(organizationsBatchKData as OrganizationRow[]), ...(organizationsBatchLData as OrganizationRow[]),
  ...(organizationsBatchMData as OrganizationRow[]), ...(organizationsBatchNData as OrganizationRow[]),
  ...(organizationsBatchOData as OrganizationRow[]), ...(organizationsBatchPData as OrganizationRow[]),
  ...(organizationsBatchQData as OrganizationRow[]), ...(organizationsBatchRData as OrganizationRow[]),
  ...(organizationsBatchSData as OrganizationRow[]), ...(organizationsBatchTData as OrganizationRow[]),
  ...(organizationsBatchUData as OrganizationRow[]), ...(organizationsBatchVData as OrganizationRow[]),
  ...(organizationsBatchWData as OrganizationRow[]), ...(organizationsBatchXData as OrganizationRow[]),
  ...(organizationsBatchYData as OrganizationRow[]), ...(organizationsBatchZData as OrganizationRow[])
].map((row) => ({ ...row, issuer_type: row.legacy_issuer_type ?? row.organization_type }));
const batchRelationships = [
  ...(relationshipsBatchKData as RelationshipRow[]), ...(relationshipsBatchLData as RelationshipRow[]),
  ...(relationshipsBatchMData as RelationshipRow[]), ...(relationshipsBatchNData as RelationshipRow[]),
  ...(relationshipsBatchOData as RelationshipRow[]), ...(relationshipsBatchPData as RelationshipRow[]),
  ...(relationshipsBatchQData as RelationshipRow[]), ...(relationshipsBatchRData as RelationshipRow[]),
  ...(relationshipsBatchSData as RelationshipRow[]), ...(relationshipsBatchTData as RelationshipRow[]),
  ...(relationshipsBatchUData as RelationshipRow[]), ...(relationshipsBatchVData as RelationshipRow[]),
  ...(relationshipsBatchWData as RelationshipRow[]), ...(relationshipsBatchXData as RelationshipRow[]),
  ...(relationshipsBatchYData as RelationshipRow[]), ...(relationshipsBatchZData as RelationshipRow[]), ...(relationshipsBatchAAData as unknown as RelationshipRow[]), ...(relationshipsBatchABData as unknown as RelationshipRow[])
];
const batchEvents = [
  ...(eventsBatchKData as EventRow[]), ...(eventsBatchLData as EventRow[]),
  ...(eventsBatchMData as EventRow[]), ...(eventsBatchNData as EventRow[]),
  ...(eventsBatchOData as EventRow[]), ...(eventsBatchPData as EventRow[]),
  ...(eventsBatchQData as EventRow[]), ...(eventsBatchRData as EventRow[]),
  ...(eventsBatchSData as EventRow[]), ...(eventsBatchTData as EventRow[]),
  ...(eventsBatchUData as EventRow[]), ...(eventsBatchVData as EventRow[]),
  ...(eventsBatchWData as EventRow[]), ...(eventsBatchXData as EventRow[]),
  ...(eventsBatchYData as EventRow[]), ...(eventsBatchZData as EventRow[]), ...(eventsBatchAAData as unknown as EventRow[]), ...(eventsBatchABData as unknown as EventRow[])
].map((row) => ({ ...row, ...(detailsById.get(row.id) ?? {}) }));
const batchEvidence = [
  ...(evidenceBatchKData as EvidenceRow[]), ...(evidenceBatchLAData as EvidenceRow[]),
  ...(evidenceBatchLBData as EvidenceRow[]), ...(evidenceBatchLCData as EvidenceRow[]),
  ...(evidenceBatchLD1Data as EvidenceRow[]), ...(evidenceBatchLD2Data as EvidenceRow[]),
  ...(evidenceBatchMData as EvidenceRow[]), ...(evidenceBatchNData as EvidenceRow[]),
  ...(evidenceBatchOData as EvidenceRow[]), ...(evidenceBatchPData as EvidenceRow[]),
  ...(evidenceBatchQData as EvidenceRow[]), ...(evidenceBatchRData as EvidenceRow[]),
  ...(evidenceBatchSData as EvidenceRow[]), ...(evidenceBatchTData as EvidenceRow[]),
  ...(evidenceBatchTB1Data as EvidenceRow[]), ...(evidenceBatchTB2Data as EvidenceRow[]),
  ...(evidenceBatchUData as EvidenceRow[]), ...(evidenceBatchVData as EvidenceRow[]),
  ...(evidenceBatchWData as EvidenceRow[]), ...(evidenceBatchXData as EvidenceRow[]),
  ...(evidenceBatchYData as EvidenceRow[]), ...(evidenceBatchZData as EvidenceRow[]), ...(evidenceBatchAAData as unknown as EvidenceRow[]), ...(evidenceBatchABData as unknown as EvidenceRow[]), ...(evidenceQualityPr219Data as EvidenceRow[])
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
export function getReserveReports(): ReserveReportRow[] { return [...getBaseReserveReports(), ...(reserveReportsBatchKData as ReserveReportRow[]), ...(reserveReportsBatchLData as ReserveReportRow[]), ...(reserveReportsBatchMAData as ReserveReportRow[]), ...(reserveReportsBatchMBData as ReserveReportRow[]), ...(reserveReportsBatchNData as ReserveReportRow[]), ...(reserveReportsBatchOData as ReserveReportRow[]), ...(reserveReportsBatchPData as ReserveReportRow[]), ...(reserveReportsBatchQData as ReserveReportRow[]), ...(reserveReportsBatchRData as ReserveReportRow[]), ...(reserveReportsBatchSData as ReserveReportRow[]), ...(reserveReportsBatchTData as ReserveReportRow[]), ...(reserveReportsBatchUData as ReserveReportRow[]), ...(reserveReportsBatchVData as ReserveReportRow[]), ...(reserveReportsBatchWData as ReserveReportRow[]), ...(reserveReportsBatchXData as ReserveReportRow[]), ...(reserveReportsBatchYData as ReserveReportRow[]), ...(reserveReportsBatchZData as ReserveReportRow[]), ...(reserveReportsBatchAAData as unknown as ReserveReportRow[]), ...(reserveReportsBatchABData as unknown as ReserveReportRow[])].map((row) => ({ ...row })); }
export function getKnownUnknowns(): KnownUnknownRow[] { return [...getBaseKnownUnknowns(), ...(knownUnknownsBatchKData as KnownUnknownRow[]), ...(knownUnknownsBatchLAData as KnownUnknownRow[]), ...(knownUnknownsBatchLBData as KnownUnknownRow[]), ...(knownUnknownsBatchMData as KnownUnknownRow[]), ...(knownUnknownsBatchNData as KnownUnknownRow[]), ...(knownUnknownsBatchOData as KnownUnknownRow[]), ...(knownUnknownsBatchPData as KnownUnknownRow[]), ...(knownUnknownsBatchQData as KnownUnknownRow[]), ...(knownUnknownsBatchRData as KnownUnknownRow[]), ...(knownUnknownsBatchSData as KnownUnknownRow[]), ...(knownUnknownsBatchTData as KnownUnknownRow[]), ...(knownUnknownsBatchUData as KnownUnknownRow[]), ...(knownUnknownsBatchVData as KnownUnknownRow[]), ...(knownUnknownsBatchWData as KnownUnknownRow[]), ...(knownUnknownsBatchXData as KnownUnknownRow[]), ...(knownUnknownsBatchYData as KnownUnknownRow[]), ...(knownUnknownsBatchZData as KnownUnknownRow[]), ...(knownUnknownsBatchAAData as unknown as KnownUnknownRow[]), ...(knownUnknownsBatchABData as unknown as KnownUnknownRow[])].map((row) => ({ ...row })); }
export { getRegulatoryNotes, getRegistryUpdates };
export function getDeployments(): DeploymentRow[] { return [...getBaseDeployments(), ...(deploymentsBatchKData as DeploymentRow[]), ...(deploymentsBatchLData as DeploymentRow[]), ...(deploymentsBatchMData as DeploymentRow[]), ...(deploymentsBatchNData as DeploymentRow[]), ...(deploymentsBatchOData as DeploymentRow[]), ...(deploymentsBatchPData as DeploymentRow[]), ...(deploymentsBatchQData as DeploymentRow[]), ...(deploymentsBatchRData as DeploymentRow[]), ...(deploymentsBatchSData as DeploymentRow[]), ...(deploymentsBatchTData as DeploymentRow[]), ...(deploymentsBatchUData as DeploymentRow[]), ...(deploymentsBatchVData as DeploymentRow[]), ...(deploymentsBatchWData as DeploymentRow[]), ...(deploymentsBatchXData as DeploymentRow[]), ...(deploymentsBatchYData as DeploymentRow[]), ...(deploymentsBatchZData as DeploymentRow[]), ...(deploymentsBatchAAData as unknown as DeploymentRow[]), ...(deploymentsBatchABData as unknown as DeploymentRow[])].map((row) => ({ ...row, control_event_ids: [...(row.control_event_ids ?? [])], evidence_ids: [...(row.evidence_ids ?? [])] })); }
export function getPrimaryRelationship(stablecoinId: string): RelationshipRow | undefined {
  const preferredRoles: OrganizationRole[] = ['legal_issuer', 'protocol_operator', 'brand_owner', 'reserve_manager', 'governance_body', 'redemption_agent', 'custodian', 'technology_provider', 'other'];
  return getRelationships().filter((row) => row.stablecoin_id === stablecoinId).sort((a, b) => preferredRoles.indexOf(a.role) - preferredRoles.indexOf(b.role))[0];
}
