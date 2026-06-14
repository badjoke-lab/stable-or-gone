import type { StablecoinV2Fields, EventV2Fields, EvidenceV2Fields, OrganizationRole, RelationshipStatus } from '../schema/registry-v2';
import type { StableAssetExtensionFields } from '../schema/stable-asset-extension';
import { getStablecoinProfile } from './stablecoinProfiles';
import stablecoinsData from '../../../data/stablecoins.json';
import stablecoinsExtraData from '../../../data/stablecoins-extra.json';
import stablecoinsBatchBData from '../../../data/stablecoins-batch-b.json';
import stablecoinsBatchCData from '../../../data/stablecoins-batch-c.json';
import stablecoinsBatchDData from '../../../data/stablecoins-batch-d.json';
import stablecoinOverridesPr033Data from '../../../data/stablecoin-overrides-pr033.json';
import stablecoinOverridesPr034Data from '../../../data/stablecoin-overrides-pr034.json';
import stablecoinClassificationV2Data from '../../../data/stablecoin-classification-v2.json';
import stablecoinClassificationBatchAData from '../../../data/stablecoin-classification-batch-a.json';
import stablecoinClassificationBatchBData from '../../../data/stablecoin-classification-batch-b.json';
import stablecoinClassificationBatchCData from '../../../data/stablecoin-classification-batch-c.json';
import stablecoinClassificationBatchDData from '../../../data/stablecoin-classification-batch-d.json';
import stablecoinClassificationExtensionBatchAData from '../../../data/stablecoin-classification-extension-batch-a.json';
import organizationsData from '../../../data/organizations.json';
import organizationsBatchBData from '../../../data/organizations-batch-b.json';
import organizationsBatchCData from '../../../data/organizations-batch-c.json';
import organizationsBatchDData from '../../../data/organizations-batch-d.json';
import relationshipsData from '../../../data/relationships.json';
import relationshipsBatchBData from '../../../data/relationships-batch-b.json';
import relationshipsBatchCData from '../../../data/relationships-batch-c.json';
import relationshipsBatchDData from '../../../data/relationships-batch-d.json';
import eventsData from '../../../data/events.json';
import eventsPr036Data from '../../../data/events-pr036.json';
import eventsPr037Data from '../../../data/events-pr037.json';
import eventsPr038Data from '../../../data/events-pr038.json';
import eventsBatchAData from '../../../data/events-batch-a.json';
import eventsBatchBData from '../../../data/events-batch-b.json';
import eventsBatchCData from '../../../data/events-batch-c.json';
import eventsBatchDData from '../../../data/events-batch-d.json';
import eventsIssuerControl2026Data from '../../../data/events-issuer-control-2026.json';
import eventDetailsV2Data from '../../../data/event-details-v2.json';
import eventDetailsBatchAData from '../../../data/event-details-batch-a.json';
import eventDetailsBatchBData from '../../../data/event-details-batch-b.json';
import eventDetailsBatchCData from '../../../data/event-details-batch-c.json';
import eventDetailsBatchDData from '../../../data/event-details-batch-d.json';
import eventDetailsIssuerControl2026Data from '../../../data/event-details-issuer-control-2026.json';
import evidenceData from '../../../data/evidence.json';
import evidenceExtraData from '../../../data/evidence-extra.json';
import evidencePr033Data from '../../../data/evidence-pr033.json';
import evidenceEventsPr036Data from '../../../data/evidence-events-pr036.json';
import evidenceEventsPr037Data from '../../../data/evidence-events-pr037.json';
import evidenceEventsPr038Data from '../../../data/evidence-events-pr038.json';
import evidenceBatchAData from '../../../data/evidence-batch-a.json';
import evidenceBatchBData from '../../../data/evidence-batch-b.json';
import evidenceBatchCData from '../../../data/evidence-batch-c.json';
import evidenceBatchDData from '../../../data/evidence-batch-d.json';
import evidenceIssuerControl2026Data from '../../../data/evidence-issuer-control-2026.json';
import reserveReportsData from '../../../data/reserve-reports.json';
import reserveReportsExtraData from '../../../data/reserve-reports-extra.json';
import reserveReportsPr033Data from '../../../data/reserve-reports-pr033.json';
import reserveReportsPr034Data from '../../../data/reserve-reports-pr034.json';
import reserveReportsBatchBData from '../../../data/reserve-reports-batch-b.json';
import knownUnknownsData from '../../../data/known-unknowns.json';
import knownUnknownsExtraData from '../../../data/known-unknowns-extra.json';
import knownUnknownsPr033Data from '../../../data/known-unknowns-pr033.json';
import knownUnknownsPr034Data from '../../../data/known-unknowns-pr034.json';
import knownUnknownsBatchAData from '../../../data/known-unknowns-batch-a.json';
import knownUnknownsBatchBData from '../../../data/known-unknowns-batch-b.json';
import knownUnknownsBatchCData from '../../../data/known-unknowns-batch-c.json';
import knownUnknownsBatchDData from '../../../data/known-unknowns-batch-d.json';
import knownUnknownsIssuerControl2026Data from '../../../data/known-unknowns-issuer-control-2026.json';
import regulatoryNotesData from '../../../data/regulatory-notes.json';
import deploymentsData from '../../../data/deployments.json';
import deploymentsExtraData from '../../../data/deployments-extra.json';
import deploymentsBatchAData from '../../../data/deployments-batch-a.json';
import deploymentsBatchBData from '../../../data/deployments-batch-b.json';
import deploymentsBatchCData from '../../../data/deployments-batch-c.json';
import deploymentsBatchDData from '../../../data/deployments-batch-d.json';
import deploymentsIssuerControl2026Data from '../../../data/deployments-issuer-control-2026.json';
import registryUpdatesData from '../../../data/registry-updates.json';

export type StablecoinRow = { id: string; slug: string; name: string; summary?: string; symbol?: string; aliases?: string[]; status?: string; peg_asset?: string; collateral_model?: string; issuer_id?: string; reserve_disclosure_status?: string; redemption_status?: string; who_can_redeem?: string; retail_redemption?: string; institutional_redemption?: string; minimum_redemption?: string; redemption_region_notes?: string; redemption_notes?: string; launch_date?: string | null; discontinued_date?: string | null; confidence?: string; last_verified_at?: string; notes?: string; } & StablecoinV2Fields & StableAssetExtensionFields;
export type OrganizationRow = { id: string; slug: string; name: string; organization_type?: string; legacy_issuer_type?: string; issuer_type?: string; jurisdiction?: string; official_url?: string | null; summary?: string; confidence?: string; last_verified_at?: string | null; notes?: string; };
export type RelationshipRow = { id: string; stablecoin_id: string; organization_id: string; role: OrganizationRole; start_date?: string | null; end_date?: string | null; status?: RelationshipStatus; evidence_ids?: string[]; notes?: string; };
export type EventRow = { id: string; stablecoin_id?: string; issuer_id?: string; title: string; description?: string; event_date?: string | null; event_type?: string; impact_level?: string; confidence?: string; source_count?: number; recovered?: boolean | null; recovery_date?: string | null; event_status_effect?: string; failure_mechanism?: string; notes?: string; } & EventV2Fields;
export type EvidenceRow = { id: string; stablecoin_id?: string; issuer_id?: string; event_id?: string | null; source_type?: string; title: string; url: string; publisher?: string; published_at?: string | null; archived_url?: string | null; accessed_at?: string | null; reliability?: string; claim_scope?: string; notes?: string; } & EvidenceV2Fields;
export type EvidenceRelationRow = { id: string; evidence_id: string; stablecoin_ids: string[]; organization_ids: string[]; event_ids: string[]; claim_scopes: string[]; relation_kind: 'legacy_subject_projection' | 'explicit_v2'; notes?: string; };
export type ReserveReportRow = { id: string; stablecoin_id?: string; issuer_id?: string; report_date?: string; period_covered?: string; publisher?: string; report_type?: string; asset_categories?: string[]; url?: string; archived_url?: string | null; confidence?: string; notes?: string; };
export type KnownUnknownRow = { id: string; stablecoin_id?: string; issuer_id?: string; topic: string; description: string; severity?: string; last_checked_at?: string; notes?: string; };
export type RegulatoryNoteRow = { id: string; stablecoin_id?: string; issuer_id?: string; event_id?: string | null; note_date?: string; title: string; jurisdiction?: string; authority_or_source?: string; note_type?: string; summary: string; source_url: string; confidence?: string; notes?: string; };
export type DeploymentRow = { id: string; stablecoin_id: string; chain: string; deployment_type: string; token_standard?: string; contract_address?: string | null; status: string; freeze_capability?: boolean; blacklist_capability?: boolean; control_event_ids?: string[]; notes?: string; evidence_ids?: string[]; };
export type RegistryUpdateRow = { id: string; date: string; title: string; category: string; summary: string; related_paths?: string[]; };

type StablecoinOverride = Partial<StablecoinRow> & { id: string };
type StablecoinClassificationV2 = Pick<StablecoinRow, 'id' | 'lifecycle_status' | 'issuance_status' | 'peg_reference' | 'backing_types' | 'stabilization_mechanism' | 'governance_model'> & StableAssetExtensionFields;
type StablecoinClassificationExtension = StableAssetExtensionFields & { id: string };

const unique = (items: (string | null | undefined)[]) => [...new Set(items.filter((item): item is string => typeof item === 'string' && item.length > 0))];
const withEvidenceV2Fields = (row: EvidenceRow): EvidenceRow => ({
  ...row,
  stablecoin_ids: unique([...(row.stablecoin_ids ?? []), row.stablecoin_id]),
  organization_ids: unique([...(row.organization_ids ?? []), row.issuer_id]),
  event_ids: unique([...(row.event_ids ?? []), row.event_id ?? undefined]),
  claim_scopes: unique([...(row.claim_scopes ?? []), row.claim_scope])
});
const toEvidenceRelation = (row: EvidenceRow): EvidenceRelationRow => ({
  id: `sog_er_${row.id.replace(/^sog_src_/, '')}`,
  evidence_id: row.id,
  stablecoin_ids: [...(row.stablecoin_ids ?? [])],
  organization_ids: [...(row.organization_ids ?? [])],
  event_ids: [...(row.event_ids ?? [])],
  claim_scopes: [...(row.claim_scopes ?? [])],
  relation_kind: row.stablecoin_ids || row.organization_ids || row.event_ids || row.claim_scopes ? 'explicit_v2' : 'legacy_subject_projection'
});

const stablecoinOverridesById = new Map([...(stablecoinOverridesPr033Data as StablecoinOverride[]).map((row) => [row.id, row] as const), ...(stablecoinOverridesPr034Data as StablecoinOverride[]).map((row) => [row.id, row] as const)]);
const classificationById = new Map([...(stablecoinClassificationV2Data as StablecoinClassificationV2[]), ...(stablecoinClassificationBatchAData as StablecoinClassificationV2[]), ...(stablecoinClassificationBatchBData as StablecoinClassificationV2[]), ...(stablecoinClassificationBatchCData as StablecoinClassificationV2[]), ...(stablecoinClassificationBatchDData as StablecoinClassificationV2[])].map((row) => [row.id, row] as const));
const classificationExtensionById = new Map((stablecoinClassificationExtensionBatchAData as StablecoinClassificationExtension[]).map((row) => [row.id, row] as const));
const eventDetailsById = new Map([...(eventDetailsV2Data as EventRow[]), ...(eventDetailsBatchAData as EventRow[]), ...(eventDetailsBatchBData as EventRow[]), ...(eventDetailsBatchCData as EventRow[]), ...(eventDetailsBatchDData as EventRow[]), ...(eventDetailsIssuerControl2026Data as EventRow[])].map((row) => [row.id, row] as const));
const stablecoins = [...(stablecoinsData as StablecoinRow[]), ...(stablecoinsExtraData as StablecoinRow[]), ...(stablecoinsBatchBData as StablecoinRow[]), ...(stablecoinsBatchCData as StablecoinRow[]), ...(stablecoinsBatchDData as StablecoinRow[])].map((coin) => ({ ...coin, ...(stablecoinOverridesById.get(coin.id) ?? {}), ...(classificationById.get(coin.id) ?? {}), ...(classificationExtensionById.get(coin.id) ?? {}), ...(getStablecoinProfile(coin.id) ?? {}) }));
const organizations = [...(organizationsData as OrganizationRow[]), ...(organizationsBatchBData as OrganizationRow[]), ...(organizationsBatchCData as OrganizationRow[]), ...(organizationsBatchDData as OrganizationRow[])].map((organization) => ({ ...organization, issuer_type: organization.legacy_issuer_type ?? organization.organization_type }));
const relationships = [...(relationshipsData as RelationshipRow[]), ...(relationshipsBatchBData as RelationshipRow[]), ...(relationshipsBatchCData as RelationshipRow[]), ...(relationshipsBatchDData as RelationshipRow[])];
const events = [...(eventsData as EventRow[]), ...(eventsPr036Data as EventRow[]), ...(eventsPr037Data as EventRow[]), ...(eventsPr038Data as EventRow[]), ...(eventsBatchAData as EventRow[]), ...(eventsBatchBData as EventRow[]), ...(eventsBatchCData as EventRow[]), ...(eventsBatchDData as EventRow[]), ...(eventsIssuerControl2026Data as EventRow[])].map((event) => ({ ...event, ...(eventDetailsById.get(event.id) ?? {}) }));
const evidence = [...(evidenceData as EvidenceRow[]), ...(evidenceExtraData as EvidenceRow[]), ...(evidencePr033Data as EvidenceRow[]), ...(evidenceEventsPr036Data as EvidenceRow[]), ...(evidenceEventsPr037Data as EvidenceRow[]), ...(evidenceEventsPr038Data as EvidenceRow[]), ...(evidenceBatchAData as EvidenceRow[]), ...(evidenceBatchBData as EvidenceRow[]), ...(evidenceBatchCData as EvidenceRow[]), ...(evidenceBatchDData as EvidenceRow[]), ...(evidenceIssuerControl2026Data as EvidenceRow[])].map(withEvidenceV2Fields);
const evidenceRelations = evidence.map(toEvidenceRelation);
const reserveReports = [...(reserveReportsData as ReserveReportRow[]), ...(reserveReportsExtraData as ReserveReportRow[]), ...(reserveReportsPr033Data as ReserveReportRow[]), ...(reserveReportsPr034Data as ReserveReportRow[]), ...(reserveReportsBatchBData as ReserveReportRow[])];
const knownUnknowns = [...(knownUnknownsData as KnownUnknownRow[]), ...(knownUnknownsExtraData as KnownUnknownRow[]), ...(knownUnknownsPr033Data as KnownUnknownRow[]), ...(knownUnknownsPr034Data as KnownUnknownRow[]), ...(knownUnknownsBatchAData as KnownUnknownRow[]), ...(knownUnknownsBatchBData as KnownUnknownRow[]), ...(knownUnknownsBatchCData as KnownUnknownRow[]), ...(knownUnknownsBatchDData as KnownUnknownRow[]), ...(knownUnknownsIssuerControl2026Data as KnownUnknownRow[])];
const regulatoryNotes = regulatoryNotesData as RegulatoryNoteRow[];
const deployments = [...(deploymentsData as DeploymentRow[]), ...(deploymentsExtraData as DeploymentRow[]), ...(deploymentsBatchAData as DeploymentRow[]), ...(deploymentsBatchBData as DeploymentRow[]), ...(deploymentsBatchCData as DeploymentRow[]), ...(deploymentsBatchDData as DeploymentRow[]), ...(deploymentsIssuerControl2026Data as DeploymentRow[])];
const registryUpdates = registryUpdatesData as RegistryUpdateRow[];

export function getStablecoins(): StablecoinRow[] { return stablecoins.map((row) => ({ ...row })); }
export function getOrganizations(): OrganizationRow[] { return organizations.map((row) => ({ ...row })); }
export function getRelationships(): RelationshipRow[] { return relationships.map((row) => ({ ...row, evidence_ids: [...(row.evidence_ids ?? [])] })); }
export function getEvents(): EventRow[] { return events.map((row) => ({ ...row, subject_stablecoin_ids: [...(row.subject_stablecoin_ids ?? [])], subject_organization_ids: [...(row.subject_organization_ids ?? [])], evidence_ids: [...(row.evidence_ids ?? [])] })); }
export function getEvidence(): EvidenceRow[] { return evidence.map((row) => ({ ...row, stablecoin_ids: [...(row.stablecoin_ids ?? [])], organization_ids: [...(row.organization_ids ?? [])], event_ids: [...(row.event_ids ?? [])], claim_scopes: [...(row.claim_scopes ?? [])] })); }
export function getEvidenceRelations(): EvidenceRelationRow[] { return evidenceRelations.map((row) => ({ ...row, stablecoin_ids: [...row.stablecoin_ids], organization_ids: [...row.organization_ids], event_ids: [...row.event_ids], claim_scopes: [...row.claim_scopes] })); }
export function getReserveReports(): ReserveReportRow[] { return reserveReports.map((row) => ({ ...row })); }
export function getKnownUnknowns(): KnownUnknownRow[] { return knownUnknowns.map((row) => ({ ...row })); }
export function getRegulatoryNotes(): RegulatoryNoteRow[] { return regulatoryNotes.map((row) => ({ ...row })); }
export function getDeployments(): DeploymentRow[] { return deployments.map((row) => ({ ...row, control_event_ids: [...(row.control_event_ids ?? [])], evidence_ids: [...(row.evidence_ids ?? [])] })); }
export function getRegistryUpdates(): RegistryUpdateRow[] { return registryUpdates.map((row) => ({ ...row })); }
export function getPrimaryRelationship(stablecoinId: string): RelationshipRow | undefined { const preferredRoles: OrganizationRole[] = ['legal_issuer', 'protocol_operator', 'brand_owner', 'reserve_manager', 'governance_body', 'redemption_agent', 'custodian', 'technology_provider', 'other']; const matches = relationships.filter((row) => row.stablecoin_id === stablecoinId); return matches.sort((a, b) => preferredRoles.indexOf(a.role) - preferredRoles.indexOf(b.role))[0]; }
