export const STATS_SCHEMA_VERSION = '1.0.0';

export const known = (value: unknown) =>
  value !== null && value !== undefined && value !== '' && value !== 'unknown';

const roundPercent = (value: number) => Math.round(value * 10) / 10;

export function countValues(values: unknown[]) {
  const counts = new Map<string, number>();
  for (const raw of values) {
    const value = known(raw) ? String(raw) : 'unknown';
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

export function countMany(values: unknown[][]) {
  return countValues(values.flat());
}

export function countYears(values: unknown[]) {
  return countValues(values.flatMap((value) => {
    if (typeof value !== 'string') return [];
    const match = value.match(/^(\d{4})/);
    return match ? [match[1]] : [];
  }));
}

export function coverage(totalIds: Set<string>, coveredIds: Iterable<string>) {
  const covered = new Set([...coveredIds].filter((id) => totalIds.has(id))).size;
  const total = totalIds.size;
  return { covered, total, percent: total === 0 ? 0 : roundPercent((covered / total) * 100) };
}

export function fieldCoverage<T extends { id: string }>(rows: T[], predicate: (row: T) => boolean) {
  const totalIds = new Set(rows.map((row) => row.id));
  return coverage(totalIds, rows.filter(predicate).map((row) => row.id));
}

export function itemCoverage(total: number, covered: number) {
  return { covered, total, percent: total === 0 ? 0 : roundPercent((covered / total) * 100) };
}

export function stablecoinSubjects(row: {
  stablecoin_id?: string;
  stablecoin_ids?: string[];
  subject_stablecoin_ids?: string[];
}) {
  return [row.stablecoin_id, ...(row.stablecoin_ids ?? []), ...(row.subject_stablecoin_ids ?? [])]
    .filter((value): value is string => typeof value === 'string' && value.length > 0);
}
