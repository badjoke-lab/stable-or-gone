import contract from '../../../docs/migration/registry-v3-income-profiles.json';
import type { YieldSource, AccrualMechanism, RateType } from '../schema/registry-v3';
export type IncomeAvailability = 'native' | 'via_wrapper' | 'none' | 'unknown';
export type IncomeProfileV3 = { id: string; availability: IncomeAvailability; source: YieldSource; accrual: AccrualMechanism; rate: RateType; related_asset_ids: string[]; evidence_ids: string[]; };
const modules = import.meta.glob('../../../data/*.json', { eager: true, import: 'default' }) as Record<string, unknown>;
const profiles = contract.data_files.flatMap((file) => {
  const shortName = file.slice('data/'.length);
  const key = Object.keys(modules).find((value) => value.endsWith('/' + shortName));
  if (!key) return [];
  const rows = modules[key];
  return Array.isArray(rows) ? rows as IncomeProfileV3[] : [];
});
export function getIncomeProfilesV3(): IncomeProfileV3[] { return profiles.map((row) => ({ ...row, related_asset_ids: [...row.related_asset_ids], evidence_ids: [...row.evidence_ids] })); }
export function getIncomeProfileV3(id: string): IncomeProfileV3 | undefined { return getIncomeProfilesV3().find((row) => row.id === id); }
