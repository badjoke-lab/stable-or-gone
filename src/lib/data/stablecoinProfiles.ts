import profileData from '../../../data/stablecoin-profiles-v2.json';
import type { ReserveProfileV2, RedemptionProfileV2 } from '../schema/registry-v2';

export type StablecoinProfileV2 = {
  id: string;
  reserve_profile: ReserveProfileV2;
  redemption_profile: RedemptionProfileV2;
};

const profiles = profileData as StablecoinProfileV2[];
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
