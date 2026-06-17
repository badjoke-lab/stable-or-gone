import baseline from '../../../docs/migration/registry-v2-baseline.json';
import type { ReserveProfileV2, RedemptionProfileV2 } from '../schema/registry-v2';

export type StablecoinProfileV2 = { id: string; reserve_profile: ReserveProfileV2; redemption_profile: RedemptionProfileV2; };
const modules = import.meta.glob('../../../data/*.json', { eager: true, import: 'default' }) as Record<string, unknown>;
const profiles = baseline.data_groups.profiles.flatMap((file) => {
  const name = file.replace(/^data\//, '');
  const key = Object.keys(modules).find((candidate) => candidate.endsWith(`/${name}`));
  if (!key) throw new Error(`Stablecoin profile file is not bundled: ${file}`);
  const value = modules[key];
  if (!Array.isArray(value)) throw new Error(`Stablecoin profile file must contain an array: ${file}`);
  return value as StablecoinProfileV2[];
});
const profileById = new Map(profiles.map((profile) => [profile.id, profile] as const));
const clone = (profile: StablecoinProfileV2): StablecoinProfileV2 => ({ ...profile, reserve_profile: { ...profile.reserve_profile, backing_types: [...profile.reserve_profile.backing_types], evidence_ids: [...(profile.reserve_profile.evidence_ids ?? [])] }, redemption_profile: { ...profile.redemption_profile, jurisdiction_restrictions: [...(profile.redemption_profile.jurisdiction_restrictions ?? [])], evidence_ids: [...(profile.redemption_profile.evidence_ids ?? [])] } });
export function getStablecoinProfiles(): StablecoinProfileV2[] { return profiles.map(clone); }
export function getStablecoinProfile(stablecoinId: string): StablecoinProfileV2 | undefined { const profile = profileById.get(stablecoinId); return profile ? clone(profile) : undefined; }
