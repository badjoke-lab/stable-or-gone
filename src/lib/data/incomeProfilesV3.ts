import batchA from '../../../data/income-profiles-v3-a.json';
import batchB from '../../../data/income-profiles-v3-b.json';
import batchC from '../../../data/income-profiles-v3-c.json';
import batchD from '../../../data/income-profiles-v3-d.json';
import batchE from '../../../data/income-profiles-v3-e.json';
import batchF from '../../../data/income-profiles-v3-f.json';
import batchG from '../../../data/income-profiles-v3-g.json';
import batchH from '../../../data/income-profiles-v3-h.json';
import batchJ from '../../../data/asset-yield-state-batch-j.json';
import type { YieldSource, AccrualMechanism, RateType } from '../schema/registry-v3';

export type IncomeAvailability = 'native' | 'via_wrapper' | 'none' | 'unknown';

export type IncomeProfileV3 = {
  id: string;
  availability: IncomeAvailability;
  source: YieldSource;
  accrual: AccrualMechanism;
  rate: RateType;
  related_asset_ids: string[];
  evidence_ids: string[];
};

const profiles = [...batchA, ...batchB, ...batchC, ...batchD, ...batchE, ...batchF, ...batchG, ...batchH, ...batchJ] as IncomeProfileV3[];

export function getIncomeProfilesV3(): IncomeProfileV3[] {
  return profiles.map((row) => ({
    ...row,
    related_asset_ids: [...row.related_asset_ids],
    evidence_ids: [...row.evidence_ids]
  }));
}

export function getIncomeProfileV3(id: string): IncomeProfileV3 | undefined {
  return getIncomeProfilesV3().find((row) => row.id === id);
}
