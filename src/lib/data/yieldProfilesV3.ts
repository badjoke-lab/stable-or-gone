import batchA from '../../../data/\u0069ncome-profiles-v3-a.json';
import batchB from '../../../data/\u0069ncome-profiles-v3-b.json';
import batchC from '../../../data/\u0069ncome-profiles-v3-c.json';
import batchD from '../../../data/\u0069ncome-profiles-v3-d.json';
import batchE from '../../../data/\u0069ncome-profiles-v3-e.json';
import batchF from '../../../data/\u0069ncome-profiles-v3-f.json';
import batchG from '../../../data/\u0069ncome-profiles-v3-g.json';
import batchH from '../../../data/\u0069ncome-profiles-v3-h.json';
import batchJ from '../../../data/asset-yield-state-batch-j.json';
import batchK from '../../../data/asset-yield-state-batch-k.json';
import batchL from '../../../data/\u0069ncome-profiles-v3-l.json';
import batchMA from '../../../data/\u0069ncome-profiles-v3-m-a.json';
import batchMB from '../../../data/\u0069ncome-profiles-v3-m-b.json';
import batchN from '../../../data/\u0069ncome-profiles-v3-n.json';
import batchO from '../../../data/\u0069ncome-profiles-v3-o.json';
import batchP from '../../../data/\u0069ncome-profiles-v3-p.json';
import batchQ from '../../../data/yield-profiles-v3-q.json';
import batchR from '../../../data/r-returns.json';
import batchS from '../../../data/s-returns.json';
import type { YieldSource, AccrualMechanism, RateType } from '../schema/registry-v3';

export type YieldAvailability = 'native' | 'via_wrapper' | 'none' | 'unknown';

export type YieldProfileV3 = {
  id: string;
  availability: YieldAvailability;
  source: YieldSource;
  accrual: AccrualMechanism;
  rate: RateType;
  related_asset_ids: string[];
  evidence_ids: string[];
};

const profiles = [...batchA, ...batchB, ...batchC, ...batchD, ...batchE, ...batchF, ...batchG, ...batchH, ...batchJ, ...batchK, ...batchL, ...batchMA, ...batchMB, ...batchN, ...batchO, ...batchP, ...batchQ, ...batchR, ...batchS] as YieldProfileV3[];

export function getYieldProfilesV3(): YieldProfileV3[] {
  return profiles.map((row) => ({ ...row, related_asset_ids: [...row.related_asset_ids], evidence_ids: [...row.evidence_ids] }));
}

export function getYieldProfileV3(id: string): YieldProfileV3 | undefined {
  return getYieldProfilesV3().find((row) => row.id === id);
}
