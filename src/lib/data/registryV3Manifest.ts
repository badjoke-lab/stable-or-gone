import foundation from '../../../docs/migration/registry-v3-foundation.json';
import { getDeployments } from './registry';
import type { DeploymentRow } from './registry';
import type { LegalProfileV3, StableAssetRelationshipV3, ReserveComponentV3, DeploymentV3Fields, DeploymentCanonicality } from '../schema/registry-v3';

const files = import.meta.glob('../../../data/*.json', { eager: true, import: 'default' }) as Record<string, unknown>;
function group<T>(name: keyof typeof foundation.data_groups): T[] {
  return foundation.data_groups[name].flatMap((file) => {
    const shortName = file.slice('data/'.length);
    const key = Object.keys(files).find((value) => value.endsWith('/' + shortName));
    if (!key) return [];
    const rows = files[key];
    return Array.isArray(rows) ? rows as T[] : [];
  });
}
const legalProfiles = group<LegalProfileV3>('legal_profiles');
const stableAssetRelationships = group<StableAssetRelationshipV3>('stable_asset_relationships');
const reserveComponents = group<ReserveComponentV3>('reserve_components');
export type DeploymentV3View = DeploymentRow & DeploymentV3Fields & { canonicality: DeploymentCanonicality };
export function getLegalProfiles(): LegalProfileV3[] { return legalProfiles.map((row) => ({ ...row, classifications: row.classifications.map((entry) => ({ ...entry, evidence_ids: [...entry.evidence_ids] })), claim_against_organization_ids: [...row.claim_against_organization_ids], licensed_or_regulated_as: [...row.licensed_or_regulated_as], evidence_ids: [...row.evidence_ids] })); }
export function getLegalProfile(id: string): LegalProfileV3 | undefined { return getLegalProfiles().find((row) => row.id === id); }
export function getStableAssetRelationships(): StableAssetRelationshipV3[] { return stableAssetRelationships.map((row) => ({ ...row, evidence_ids: [...row.evidence_ids] })); }
export function getStableAssetRelationshipsFor(id: string): StableAssetRelationshipV3[] { return getStableAssetRelationships().filter((row) => row.from_asset_id === id || row.to_asset_id === id); }
export function getReserveComponents(): ReserveComponentV3[] { return reserveComponents.map((row) => ({ ...row, evidence_ids: [...row.evidence_ids] })); }
export function getReserveComponentsFor(id: string): ReserveComponentV3[] { return getReserveComponents().filter((row) => row.stablecoin_id === id); }
export function getDeploymentsV3(): DeploymentV3View[] { return getDeployments().map((row) => { const item = row as DeploymentRow & DeploymentV3Fields; return { ...item, canonicality: item.canonicality ?? 'unknown', control_event_ids: [...(item.control_event_ids ?? [])], evidence_ids: [...(item.evidence_ids ?? [])] }; }); }
