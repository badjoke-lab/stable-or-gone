import legalProfilesData from '../../../data/legal-profiles-v3.json';
import stableAssetRelationshipsData from '../../../data/stable-asset-relationships-v3.json';
import reserveComponentsData from '../../../data/reserve-components-v3.json';
import type {
  LegalProfileV3,
  StableAssetRelationshipV3,
  ReserveComponentV3
} from '../schema/registry-v3';

const legalProfiles = legalProfilesData as LegalProfileV3[];
const stableAssetRelationships = stableAssetRelationshipsData as StableAssetRelationshipV3[];
const reserveComponents = reserveComponentsData as ReserveComponentV3[];

export function getLegalProfiles(): LegalProfileV3[] {
  return legalProfiles.map((row) => ({
    ...row,
    classifications: row.classifications.map((entry) => ({
      ...entry,
      evidence_ids: [...entry.evidence_ids]
    })),
    claim_against_organization_ids: [...row.claim_against_organization_ids],
    licensed_or_regulated_as: [...row.licensed_or_regulated_as],
    evidence_ids: [...row.evidence_ids]
  }));
}

export function getLegalProfile(stablecoinId: string): LegalProfileV3 | undefined {
  return getLegalProfiles().find((row) => row.id === stablecoinId);
}

export function getStableAssetRelationships(): StableAssetRelationshipV3[] {
  return stableAssetRelationships.map((row) => ({
    ...row,
    evidence_ids: [...row.evidence_ids]
  }));
}

export function getStableAssetRelationshipsFor(stablecoinId: string): StableAssetRelationshipV3[] {
  return getStableAssetRelationships().filter((row) => row.from_asset_id === stablecoinId || row.to_asset_id === stablecoinId);
}

export function getReserveComponents(): ReserveComponentV3[] {
  return reserveComponents.map((row) => ({
    ...row,
    evidence_ids: [...row.evidence_ids]
  }));
}

export function getReserveComponentsFor(stablecoinId: string): ReserveComponentV3[] {
  return getReserveComponents().filter((row) => row.stablecoin_id === stablecoinId);
}
