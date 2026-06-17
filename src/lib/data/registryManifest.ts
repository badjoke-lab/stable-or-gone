import type { StablecoinV2Fields, EventV2Fields, EvidenceV2Fields, OrganizationRole, RelationshipStatus } from '../schema/registry-v2';
import type { StableAssetExtensionFields } from '../schema/stable-asset-extension';
import { getStablecoinProfile } from './stablecoinProfiles';
import baseline from '../../../docs/migration/registry-v2-baseline.json';

const modules = import.meta.glob('../../../data/*.json', { eager: true, import: 'default' }) as Record<string, unknown>;
const loadFile = <T>(file: string): T[] => {
  const name = file.replace(/^data\//, '');
  const key = Object.keys(modules).find((candidate) => candidate.endsWith(`/${name}`));
  if (!key) throw new Error(`Registry data file is not bundled: ${file}`);
  const value = modules[key];
  if (!Array.isArray(value)) throw new Error(`Registry data file must contain an array: ${file}`);
  return value as T[];
};
const loadGroup = <T>(name: keyof typeof baseline.data_groups): T[] => (baseline.data_groups[name] ?? []).flatMap((file) => loadFile<T>(file));

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
const withEvidenceV2Fields = (row: EvidenceRow): EvidenceRow => ({ ...row, stablecoin_ids: unique([...(row.stablecoin_ids ?? []), row.stablecoin_id]), organization_ids: unique([...(row.organization_ids ?? []), row.issuer_id]), event_ids: unique([...(row.event_ids ?? []), row.event_id ?? undefined]), claim_scopes: unique([...(row.claim_scopes ?? []), row.claim_scope]) });
const toEvidenceRelation = (row: EvidenceRow): EvidenceRelationRow => ({ id: `sog_er_${row.id.replace(/^sog_src_/, '')}`, evidence_id: row.id, stablecoin_ids: [...(row.stablecoin_ids ?? [])], organization_ids: [...(row.organization_ids ?? [])], event_ids: [...(row.event_ids ?? [])], claim_scopes: [...(row.claim_scopes ?? [])], relation_kind: row.stablecoin_ids || row.organization_ids || row.event_ids || row.claim_scopes ? 'explicit_v2' : 'legacy_subject_projection' });

const stablecoinOverridesById = new Map([...loadFile<StablecoinOverride>('data/stablecoin-overrides-pr033.json'), ...loadFile<StablecoinOverride>('data/stablecoin-overrides-pr034.json')].map((row) => [row.id, row] as const));
const classificationById = new Map(loadGroup<StablecoinClassificationV2>('classifications').map((row) => [row.id, row] as const));
const classificationExtensionById = new Map(loadGroup<StablecoinClassificationExtension>('classification_extensions').map((row) => [row.id, row] as const));
const eventDetailsById = new Map(loadGroup<EventRow>('event_details').map((row) => [row.id, row] as const));
const stablecoins = loadGroup<StablecoinRow>('stablecoins').map((coin) => ({ ...coin, ...(stablecoinOverridesById.get(coin.id) ?? {}), ...(classificationById.get(coin.id) ?? {}), ...(classificationExtensionById.get(coin.id) ?? {}), ...(getStablecoinProfile(coin.id) ?? {}) }));
const organizations = loadGroup<OrganizationRow>('organizations').map((organization) => ({ ...organization, issuer_type: organization.legacy_issuer_type ?? organization.organization_type }));
const relationships = loadGroup<RelationshipRow>('relationships');
const events = loadGroup<EventRow>('events').map((event) => ({ ...event, ...(eventDetailsById.get(event.id) ?? {}) }));
const evidence = loadGroup<EvidenceRow>('evidence').map(withEvidenceV2Fields);
const evidenceRelations = evidence.map(toEvidenceRelation);
const reserveReports = loadGroup<ReserveReportRow>('reserve_reports');
const knownUnknowns = loadGroup<KnownUnknownRow>('known_unknowns');
const regulatoryNotes = loadGroup<RegulatoryNoteRow>('regulatory_notes');
const deployments = loadGroup<DeploymentRow>('deployments');
const registryUpdates = loadFile<RegistryUpdateRow>('data/registry-updates.json');

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
