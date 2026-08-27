import batchA from '../../../data/income-profiles-v3-a.json';
import batchB from '../../../data/income-profiles-v3-b.json';
import batchC from '../../../data/income-profiles-v3-c.json';
import batchD from '../../../data/income-profiles-v3-d.json';
import batchE from '../../../data/income-profiles-v3-e.json';
import batchF from '../../../data/income-profiles-v3-f.json';
import batchG from '../../../data/income-profiles-v3-g.json';
import batchH from '../../../data/income-profiles-v3-h.json';
import batchJ from '../../../data/asset-yield-state-batch-j.json';
import batchK from '../../../data/asset-yield-state-batch-k.json';
import batchL from '../../../data/income-profiles-v3-l.json';
import batchMA from '../../../data/income-profiles-v3-m-a.json';
import batchMB from '../../../data/income-profiles-v3-m-b.json';
import batchN from '../../../data/income-profiles-v3-n.json';
import batchO from '../../../data/income-profiles-v3-o.json';
import batchP from '../../../data/income-profiles-v3-p.json';
import batchQ from '../../../data/yield-profiles-v3-q.json';
import batchR from '../../../data/r-returns.json';
import batchS from '../../../data/s-returns.json';
import batchT from '../../../data/batch-t-income.json';
import batchU from '../../../data/batch-u-income.json';
import batchV from '../../../data/batch-v-income.json';
import batchW from '../../../data/batch-w-income.json';
import batchX from '../../../data/batch-x-income.json';
import batchY from '../../../data/batch-y-income.json';
import batchZ from '../../../data/batch-z-income.json';
import batchAA from '../../../data/batch-aa-income.json';
import batchAB from '../../../data/batch-ab-income.json';
import batchAC from '../../../data/batch-ac-income.json';
import batchAD from '../../../data/batch-ad-income.json';
import type { YieldSource, AccrualMechanism, RateType } from '../schema/registry-v3';

export type IncomeAvailability = 'native' | 'via_wrapper' | 'none' | 'unknown';
export type IncomeProfileV3 = { id:string; availability:IncomeAvailability; source:YieldSource; accrual:AccrualMechanism; rate:RateType; related_asset_ids:string[]; evidence_ids:string[]; notes?:string; };
const profiles = [...batchA,...batchB,...batchC,...batchD,...batchE,...batchF,...batchG,...batchH,...batchJ,...batchK,...batchL,...batchMA,...batchMB,...batchN,...batchO,...batchP,...batchQ,...batchR,...batchS,...batchT,...batchU,...batchV,...batchW,...batchX,...batchY,...batchZ,...batchAA,...batchAB,...batchAC,...batchAD] as IncomeProfileV3[];
export function getIncomeProfilesV3(): IncomeProfileV3[] { return profiles.map((row) => ({...row,related_asset_ids:[...row.related_asset_ids],evidence_ids:[...row.evidence_ids]})); }
export function getIncomeProfileV3(id:string): IncomeProfileV3 | undefined { return getIncomeProfilesV3().find((row) => row.id === id); }
