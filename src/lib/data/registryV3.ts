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
import legalProfilesGrowthF from '../../../data/legal-profiles-v3-batch-growth-f.json';
import legalProfilesGrowthG from '../../../data/legal-profiles-v3-batch-growth-g.json';
import legalProfilesGrowthH from '../../../data/legal-profiles-v3-batch-growth-h.json';
import legalProfilesGrowthI from '../../../data/legal-profiles-v3-batch-growth-i.json';
import legalProfilesGrowthJ from '../../../data/legal-profiles-v3-batch-growth-j.json';
import legalProfilesGrowthK from '../../../data/legal-profiles-v3-batch-growth-k.json';
import legalProfilesGrowthL from '../../../data/legal-profiles-v3-batch-growth-l.json';
import legalProfilesGrowthM from '../../../data/legal-profiles-v3-batch-growth-m.json';
import legalProfilesGrowthN from '../../../data/legal-profiles-v3-batch-growth-n.json';
import legalProfilesGrowthO from '../../../data/legal-profiles-v3-batch-growth-o.json';
import legalProfilesGrowthP from '../../../data/legal-profiles-v3-batch-growth-p.json';
import legalProfilesGrowthQ from '../../../data/q-legal.json';
import legalProfilesGrowthR from '../../../data/r-legal.json';
import legalProfilesGrowthS from '../../../data/s-legal.json';
import legalProfilesGrowthT from '../../../data/t-legal.json';
import legalProfilesGrowthU from '../../../data/u-legal.json';
import legalProfilesGrowthV from '../../../data/v-legal.json';
import legalProfilesGrowthW from '../../../data/w-legal.json';
import legalProfilesGrowthX from '../../../data/x-legal.json';
import legalProfilesGrowthY from '../../../data/y-legal.json';
import legalProfilesGrowthZ from '../../../data/z-legal.json';
import legalProfilesGrowthAA from '../../../data/aa-legal.json';
import legalProfilesGrowthAB from '../../../data/ab-legal.json';
import legalProfilesGrowthAC from '../../../data/ac-legal.json';
import legalProfilesGrowthAD from '../../../data/ad-legal.json';
import legalProfilesGrowthAE from '../../../data/ae-legal.json';
import stableAssetRelationshipsData from '../../../data/stable-asset-relationships-v3.json';
import stableAssetRelationshipsBatchH from '../../../data/stable-asset-relationships-v3-batch-h.json';
import stableAssetRelationshipsPr358 from '../../../data/stable-asset-relationships-v3-pr358.json';
import reserveComponentsData from '../../../data/reserve-components-v3.json';
import reserveComponentsBatchF from '../../../data/reserve-components-v3-batch-f.json';
import reserveComponentsBatchG from '../../../data/reserve-components-v3-batch-g.json';
import reserveComponentsBatchH from '../../../data/reserve-components-v3-batch-h.json';
import reserveComponentsBatchI from '../../../data/reserve-components-v3-batch-i.json';
import reserveComponentsBatchJ from '../../../data/reserve-components-v3-batch-j.json';
import reserveComponentsBatchK from '../../../data/reserve-components-v3-batch-k.json';
import reserveComponentsBatchL from '../../../data/reserve-components-v3-batch-l.json';
import reserveComponentsBatchM from '../../../data/reserve-components-v3-batch-m.json';
import reserveComponentsBatchN from '../../../data/reserve-components-v3-batch-n.json';
import reserveComponentsBatchO from '../../../data/reserve-components-v3-batch-o.json';
import reserveComponentsBatchP from '../../../data/reserve-components-v3-batch-p.json';
import reserveComponentsBatchQ from '../../../data/reserve-components-v3-batch-q.json';
import reserveComponentsBatchR from '../../../data/reserve-components-v3-batch-r.json';
import reserveComponentsBatchS from '../../../data/reserve-components-v3-batch-s.json';
import reserveComponentsBatchT from '../../../data/batch-t-components.json';
import reserveComponentsBatchU from '../../../data/batch-u-components.json';
import reserveComponentsBatchV from '../../../data/batch-v-components.json';
import reserveComponentsBatchW from '../../../data/batch-w-components.json';
import reserveComponentsBatchX from '../../../data/batch-x-components.json';
import reserveComponentsBatchY from '../../../data/batch-y-components.json';
import reserveComponentsBatchZ from '../../../data/batch-z-components.json';
import reserveComponentsBatchAA from '../../../data/batch-aa-components.json';
import reserveComponentsBatchAB from '../../../data/batch-ab-components.json';
import reserveComponentsBatchAC from '../../../data/batch-ac-components.json';
import reserveComponentsBatchAD from '../../../data/batch-ad-components.json';
import reserveComponentsBatchAE from '../../../data/batch-ae-components.json';
import { getDeployments } from './registry';
import type { DeploymentRow } from './registry';
import type { LegalProfileV3, StableAssetRelationshipV3, ReserveComponentV3, DeploymentV3Fields, DeploymentCanonicality } from '../schema/registry-v3';

const legalProfiles = [
  ...legalProfilesBase, ...legalProfilesBatchB, ...legalProfilesBatchC1, ...legalProfilesBatchC2,
  ...legalProfilesBatchD1, ...legalProfilesBatchD2a, ...legalProfilesBatchE1, ...legalProfilesBatchE2,
  ...legalProfilesBatchE3, ...legalProfilesBatchF1, ...legalProfilesGho, ...legalProfilesBold,
  ...legalProfilesUsd0, ...legalProfilesUsr, ...legalProfilesSai, ...legalProfilesHusd,
  ...legalProfilesIron, ...legalProfilesMusd, ...legalProfilesEurs, ...legalProfilesEurt,
  ...legalProfilesUsdm, ...legalProfilesAlusd, ...legalProfilesGrowthF, ...legalProfilesGrowthG,
  ...legalProfilesGrowthH, ...legalProfilesGrowthI, ...legalProfilesGrowthJ, ...legalProfilesGrowthK,
  ...legalProfilesGrowthL, ...legalProfilesGrowthM, ...legalProfilesGrowthN, ...legalProfilesGrowthO,
  ...legalProfilesGrowthP, ...legalProfilesGrowthQ, ...legalProfilesGrowthR, ...legalProfilesGrowthS,
  ...legalProfilesGrowthT, ...legalProfilesGrowthU, ...legalProfilesGrowthV, ...legalProfilesGrowthW,
  ...legalProfilesGrowthX, ...legalProfilesGrowthY, ...legalProfilesGrowthZ, ...legalProfilesGrowthAA,
  ...legalProfilesGrowthAB, ...legalProfilesGrowthAC, ...legalProfilesGrowthAD, ...legalProfilesGrowthAE,
] as LegalProfileV3[];

const stableAssetRelationships = [...stableAssetRelationshipsData, ...stableAssetRelationshipsBatchH, ...stableAssetRelationshipsPr358] as StableAssetRelationshipV3[];
const reserveComponents = [
  ...reserveComponentsData, ...reserveComponentsBatchF, ...reserveComponentsBatchG, ...reserveComponentsBatchH,
  ...reserveComponentsBatchI, ...reserveComponentsBatchJ, ...reserveComponentsBatchK, ...reserveComponentsBatchL,
  ...reserveComponentsBatchM, ...reserveComponentsBatchN, ...reserveComponentsBatchO, ...reserveComponentsBatchP,
  ...reserveComponentsBatchQ, ...reserveComponentsBatchR, ...reserveComponentsBatchS, ...reserveComponentsBatchT,
  ...reserveComponentsBatchU, ...reserveComponentsBatchV, ...reserveComponentsBatchW, ...reserveComponentsBatchX,
  ...reserveComponentsBatchY, ...reserveComponentsBatchZ, ...reserveComponentsBatchAA, ...reserveComponentsBatchAB,
  ...reserveComponentsBatchAC, ...reserveComponentsBatchAD, ...reserveComponentsBatchAE,
] as ReserveComponentV3[];

export type DeploymentV3View = DeploymentRow & DeploymentV3Fields & { canonicality: DeploymentCanonicality; };
export function getLegalProfiles(): LegalProfileV3[] { return legalProfiles.map((row) => ({...row,classifications:row.classifications.map((entry)=>({...entry,evidence_ids:[...entry.evidence_ids]})),claim_against_organization_ids:[...row.claim_against_organization_ids],licensed_or_regulated_as:[...row.licensed_or_regulated_as],evidence_ids:[...row.evidence_ids]})); }
export function getLegalProfile(stablecoinId:string):LegalProfileV3|undefined { return getLegalProfiles().find((row)=>row.id===stablecoinId); }
export function getStableAssetRelationships():StableAssetRelationshipV3[] { return stableAssetRelationships.map((row)=>({...row,evidence_ids:[...row.evidence_ids]})); }
export function getStableAssetRelationshipsFor(stablecoinId:string):StableAssetRelationshipV3[] { return getStableAssetRelationships().filter((row)=>row.from_asset_id===stablecoinId||row.to_asset_id===stablecoinId); }
export function getReserveComponents():ReserveComponentV3[] { return reserveComponents.map((row)=>({...row,evidence_ids:[...row.evidence_ids]})); }
export function getReserveComponentsFor(stablecoinId:string):ReserveComponentV3[] { return getReserveComponents().filter((row)=>row.stablecoin_id===stablecoinId); }
export function getDeploymentsV3(): DeploymentV3View[] {
  return getDeployments().map((row) => {
    const deployment = row as DeploymentRow & DeploymentV3Fields;
    return {
      ...deployment,
      canonicality: deployment.canonicality ?? 'unknown',
      control_event_ids: [...(deployment.control_event_ids ?? [])],
      evidence_ids: [...(deployment.evidence_ids ?? [])],
    };
  });
}
