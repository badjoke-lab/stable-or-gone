import type { StablecoinV2Fields, EventV2Fields, EvidenceV2Fields } from '../schema/registry-v2';
import stablecoinsData from '../../../data/stablecoins.json';
import stablecoinsExtraData from '../../../data/stablecoins-extra.json';
import stablecoinOverridesPr033Data from '../../../data/stablecoin-overrides-pr033.json';
import stablecoinOverridesPr034Data from '../../../data/stablecoin-overrides-pr034.json';
import issuersData from '../../../data/issuers.json';
import issuersExtraData from '../../../data/issuers-extra.json';
import eventsData from '../../../data/events.json';
import eventsPr036Data from '../../../data/events-pr036.json';
import eventsPr037Data from '../../../data/events-pr037.json';
import eventsPr038Data from '../../../data/events-pr038.json';
import evidenceData from '../../../data/evidence.json';
import evidenceExtraData from '../../../data/evidence-extra.json';
import evidencePr033Data from '../../../data/evidence-pr033.json';
import evidenceEventsPr036Data from '../../../data/evidence-events-pr036.json';
import evidenceEventsPr037Data from '../../../data/evidence-events-pr037.json';
import evidenceEventsPr038Data from '../../../data/evidence-events-pr038.json';
import reserveReportsData from '../../../data/reserve-reports.json';
import reserveReportsExtraData from '../../../data/reserve-reports-extra.json';
import reserveReportsPr033Data from '../../../data/reserve-reports-pr033.json';
import reserveReportsPr034Data from '../../../data/reserve-reports-pr034.json';
import knownUnknownsData from '../../../data/known-unknowns.json';
import knownUnknownsExtraData from '../../../data/known-unknowns-extra.json';
import knownUnknownsPr033Data from '../../../data/known-unknowns-pr033.json';
import knownUnknownsPr034Data from '../../../data/known-unknowns-pr034.json';
import regulatoryNotesData from '../../../data/regulatory-notes.json';
import deploymentsData from '../../../data/deployments.json';
import deploymentsExtraData from '../../../data/deployments-extra.json';
import registryUpdatesData from '../../../data/registry-updates.json';

export type StablecoinRow = {
  id: string;
  slug: string;
  name: string;
  summary?: string;
  symbol?: string;
  aliases?: string[];
  status?: string;
  peg_asset?: string;
  collateral_model?: string;
  issuer_id?: string;
  reserve_disclosure_status?: string;
  redemption_status?: string;
  who_can_redeem?: string;
  retail_redemption?: string;
  institutional_redemption?: string;
  minimum_redemption?: string;
  redemption_region_notes?: string;
  redemption_notes?: string;
  launch_date?: string;
  discontinued_date?: string | null;
  confidence?: string;
  last_verified_at?: string;
  notes?: string;
} & StablecoinV2Fields;

export type OrganizationRow = {
  id: string;
  slug: string;
  name: string;
  summary?: string;
  issuer_type?: string;
  jurisdiction?: string;
  related_stablecoins?: string[];
  official_url?: string;
  confidence?: string;
  last_verified_at?: string;
  notes?: string;
};

export type EventRow = {
  id: string;
  stablecoin_id?: string;
  issuer_id?: string;
  title: string;
  description?: string;
  event_date?: string | null;
  event_type?: string;
  impact_level?: string;
  confidence?: string;
  source_count?: number;
  recovered?: boolean | null;
  recovery_date?: string | null;
  event_status_effect?: string;
  failure_mechanism?: string;
  notes?: string;
} & EventV2Fields;

export type EvidenceRow = {
  id: string;
  stablecoin_id?: string;
  issuer_id?: string;
  event_id?: string | null;
  source_type?: string;
  title: string;
  url: string;
  publisher?: string;
  published_at?: string | null;
  archived_url?: string | null;
  accessed_at?: string | null;
  reliability?: string;
  claim_scope?: string;
  notes?: string;
} & EvidenceV2Fields;

export type ReserveReportRow = {
  id: string;
  stablecoin_id?: string;
  issuer_id?: string;
  report_date?: string;
  period_covered?: string;
  publisher?: string;
  report_type?: string;
  asset_categories?: string[];
  url?: string;
  archived_url?: string | null;
  confidence?: string;
  notes?: string;
};

export type KnownUnknownRow = {
  id: string;
  stablecoin_id?: string;
  issuer_id?: string;
  topic: string;
  description: string;
  severity?: string;
  last_checked_at?: string;
  notes?: string;
};

export type RegulatoryNoteRow = {
  id: string;
  stablecoin_id?: string;
  issuer_id?: string;
  event_id?: string | null;
  note_date?: string;
  title: string;
  jurisdiction?: string;
  authority_or_source?: string;
  note_type?: string;
  summary: string;
  source_url: string;
  confidence?: string;
  notes?: string;
};

export type DeploymentRow = {
  id: string;
  stablecoin_id: string;
  chain: string;
  deployment_type: string;
  contract_address?: string | null;
  status: string;
  notes?: string;
  evidence_ids?: string[];
};

export type RegistryUpdateRow = {
  id: string;
  date: string;
  title: string;
  category: string;
  summary: string;
  related_paths?: string[];
};

type StablecoinOverride = Partial<StablecoinRow> & { id: string };

const stablecoinOverridesById = new Map([
  ...(stablecoinOverridesPr033Data as StablecoinOverride[]).map((row) => [row.id, row] as const),
  ...(stablecoinOverridesPr034Data as StablecoinOverride[]).map((row) => [row.id, row] as const)
]);

const stablecoins = [...(stablecoinsData as StablecoinRow[]), ...(stablecoinsExtraData as StablecoinRow[])]
  .map((coin) => ({ ...coin, ...(stablecoinOverridesById.get(coin.id) ?? {}) }));
const organizations = [...(issuersData as OrganizationRow[]), ...(issuersExtraData as OrganizationRow[])];
const events = [...(eventsData as EventRow[]), ...(eventsPr036Data as EventRow[]), ...(eventsPr037Data as EventRow[]), ...(eventsPr038Data as EventRow[])];
const evidence = [...(evidenceData as EvidenceRow[]), ...(evidenceExtraData as EvidenceRow[]), ...(evidencePr033Data as EvidenceRow[]), ...(evidenceEventsPr036Data as EvidenceRow[]), ...(evidenceEventsPr037Data as EvidenceRow[]), ...(evidenceEventsPr038Data as EvidenceRow[])];
const reserveReports = [...(reserveReportsData as ReserveReportRow[]), ...(reserveReportsExtraData as ReserveReportRow[]), ...(reserveReportsPr033Data as ReserveReportRow[]), ...(reserveReportsPr034Data as ReserveReportRow[])];
const knownUnknowns = [...(knownUnknownsData as KnownUnknownRow[]), ...(knownUnknownsExtraData as KnownUnknownRow[]), ...(knownUnknownsPr033Data as KnownUnknownRow[]), ...(knownUnknownsPr034Data as KnownUnknownRow[])];
const regulatoryNotes = regulatoryNotesData as RegulatoryNoteRow[];
const deployments = [...(deploymentsData as DeploymentRow[]), ...(deploymentsExtraData as DeploymentRow[])];
const registryUpdates = registryUpdatesData as RegistryUpdateRow[];

export function getStablecoins(): StablecoinRow[] {
  return stablecoins.map((row) => ({ ...row }));
}

export function getOrganizations(): OrganizationRow[] {
  return organizations.map((row) => ({ ...row }));
}

export function getEvents(): EventRow[] {
  return events.map((row) => ({ ...row }));
}

export function getEvidence(): EvidenceRow[] {
  return evidence.map((row) => ({ ...row }));
}

export function getReserveReports(): ReserveReportRow[] {
  return reserveReports.map((row) => ({ ...row }));
}

export function getKnownUnknowns(): KnownUnknownRow[] {
  return knownUnknowns.map((row) => ({ ...row }));
}

export function getRegulatoryNotes(): RegulatoryNoteRow[] {
  return regulatoryNotes.map((row) => ({ ...row }));
}

export function getDeployments(): DeploymentRow[] {
  return deployments.map((row) => ({ ...row }));
}

export function getRegistryUpdates(): RegistryUpdateRow[] {
  return registryUpdates.map((row) => ({ ...row }));
}
