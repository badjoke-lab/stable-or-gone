import legalProfilesBase from '../../../data/legal-profiles-v3.json';
import legalProfilesBatchB from '../../../data/legal-profiles-v3-batch-b.json';
import legalProfilesBatchC1 from '../../../data/legal-profiles-v3-batch-c1.json';
import legalProfilesBatchC2 from '../../../data/legal-profiles-v3-batch-c2.json';
import legalProfilesBatchD1 from '../../../data/legal-profiles-v3-batch-d1.json';
import legalProfilesBatchD2a from '../../../data/legal-profiles-v3-batch-d2a.json';
import legalProfilesBatchE1 from '../../../data/legal-profiles-v3-batch-e1.json';
import legalProfilesBatchE2 from '../../../data/legal-profiles-v3-batch-e2.json';
import legalProfilesBatchE3 from '../../../data/legal-profiles-v3-batch-e3.json';
import legalProfilesBatchF1 from '../../../data/legal-profiles-v3-batch-f1.json';
import legalProfilesGho from '../../../data/legal-profiles-v3-gho.json';
import legalProfilesBold from '../../../data/legal-profiles-v3-bold.json';
import legalProfilesUsd0 from '../../../data/legal-profiles-v3-usd0.json';
import legalProfilesUsr from '../../../data/legal-profiles-v3-usr.json';
import legalProfilesSai from '../../../data/legal-profiles-v3-sai.json';
import legalProfilesHusd from '../../../data/legal-profiles-v3-husd.json';
import legalProfilesIron from '../../../data/legal-profiles-v3-iron.json';
import legalProfilesMusd from '../../../data/legal-profiles-v3-musd.json';
import legalProfilesEurs from '../../../data/legal-profiles-v3-eurs.json';
import legalProfilesEurt from '../../../data/legal-profiles-v3-eurt.json';
import legalProfilesUsdm from '../../../data/legal-profiles-v3-usdm.json';
import legalProfilesAlusd from '../../../data/legal-profiles-v3-alusd.json';
import stableAssetRelationshipsData from '../../../data/stable-asset-relationships-v3.json';
import reserveComponentsData from '../../../data/reserve-components-v3.json';
import type {
  LegalProfileV3,
  StableAssetRelationshipV3,
  ReserveComponentV3
} from '../schema/registry-v3';

const legalProfiles = [
  ...legalProfilesBase,
  ...legalProfilesBatchB,
  ...legalProfilesBatchC1,
  ...legalProfilesBatchC2,
  ...legalProfilesBatchD1,
  ...legalProfilesBatchD2a,
  ...legalProfilesBatchE1,
  ...legalProfilesBatchE2,
  ...legalProfilesBatchE3,
  ...legalProfilesBatchF1,
  ...legalProfilesGho,
  ...legalProfilesBold,
  ...legalProfilesUsd0,
  ...legalProfilesUsr,
  ...legalProfilesSai,
  ...legalProfilesHusd,
  ...legalProfilesIron,
  ...legalProfilesMusd,
  ...legalProfilesEurs,
  ...legalProfilesEurt,
  ...legalProfilesUsdm,
  ...legalProfilesAlusd
] as LegalProfileV3[];
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
