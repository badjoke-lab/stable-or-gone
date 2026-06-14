import batchA from '../../../data/income-profiles-v3-a.json';
import batchB from '../../../data/income-profiles-v3-b.json';
import batchC from '../../../data/income-profiles-v3-c.json';
import batchD from '../../../data/income-profiles-v3-d.json';

type IncomeProfileV3 = (typeof batchA)[number];
const profiles = [...batchA, ...batchB, ...batchC, ...batchD] as IncomeProfileV3[];

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
