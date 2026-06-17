import profileData from '../../../data/stablecoin-profiles-v2.json';
import profileBatchAData from '../../../data/stablecoin-profiles-batch-a.json';
import profileBatchBData from '../../../data/stablecoin-profiles-batch-b.json';
import profileBatchCData from '../../../data/stablecoin-profiles-batch-c.json';
import profileBatchDData from '../../../data/stablecoin-profiles-batch-d.json';
import profileBatchEData from '../../../data/stablecoin-profiles-batch-e.json';
import profileBatchFData from '../../../data/stablecoin-profiles-batch-f.json';
import profileBatchGData from '../../../data/stablecoin-profiles-batch-g.json';
import profileBatchHData from '../../../data/stablecoin-profiles-batch-h.json';
import profileBatchIData from '../../../data/stablecoin-profiles-batch-i.json';
import profileBatchJData from '../../../data/stablecoin-profiles-batch-j.json';
import type { ReserveProfileV2, RedemptionProfileV2 } from '../schema/registry-v2';

export type StablecoinProfileV2 = {
  id: string;
  reserve_profile: ReserveProfileV2;
  redemption_profile: RedemptionProfileV2;
};

const profiles = [
  ...(profileData as StablecoinProfileV2[]),
  ...(profileBatchAData as StablecoinProfileV2[]),
  ...(profileBatchBData as StablecoinProfileV2[]),
  ...(profileBatchCData as StablecoinProfileV2[]),
  ...(profileBatchDData as StablecoinProfileV2[]),
  ...(profileBatchEData as StablecoinProfileV2[]),
  ...(profileBatchFData as StablecoinProfileV2[]),
  ...(profileBatchGData as StablecoinProfileV2[]),
  ...(profileBatchHData as StablecoinProfileV2[]),
  ...(profileBatchIData as StablecoinProfileV2[]),
  ...(profileBatchJData as StablecoinProfileV2[])
];
const profileById = new Map(profiles.map((profile) => [profile.id, profile] as const));

export function getStablecoinProfiles(): StablecoinProfileV2[] {
  return profiles.map((profile) => ({
    ...profile,
    reserve_profile: {
      ...profile.reserve_profile,
      backing_types: [...profile.reserve_profile.backing_types],
      evidence_ids: [...(profile.reserve_profile.evidence_ids ?? [])]
    },
    redemption_profile: {
      ...profile.redemption_profile,
      jurisdiction_restrictions: [...(profile.redemption_profile.jurisdiction_restrictions ?? [])],
      evidence_ids: [...(profile.redemption_profile.evidence_ids ?? [])]
    }
  }));
}

export function getStablecoinProfile(stablecoinId: string): StablecoinProfileV2 | undefined {
  const profile = profileById.get(stablecoinId);
  if (!profile) return undefined;
  return {
    ...profile,
    reserve_profile: {
      ...profile.reserve_profile,
      backing_types: [...profile.reserve_profile.backing_types],
      evidence_ids: [...(profile.reserve_profile.evidence_ids ?? [])]
    },
    redemption_profile: {
      ...profile.redemption_profile,
      jurisdiction_restrictions: [...(profile.redemption_profile.jurisdiction_restrictions ?? [])],
      evidence_ids: [...(profile.redemption_profile.evidence_ids ?? [])]
    }
  };
}
