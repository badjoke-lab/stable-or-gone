import { loadOfficialSourceBaselines } from '../baselines/baseline-store.mjs';
import { loadOfficialSources } from '../monitors/official-source-observer.mjs';

const GROUPS = new Set(['daily', 'weekly']);

function isDailySource(source) {
  return ['platform_policy', 'platform_service_state'].includes(source.monitoring_scope?.kind);
}

export function selectScheduledSourceGroup(group, options = {}) {
  if (!GROUPS.has(group)) throw new Error(`Unsupported scheduled source group: ${group}`);
  const root = options.root ?? process.cwd();
  const allSources = options.sources ?? loadOfficialSources(root);
  const fullBaselineSet = options.baselineSet ?? loadOfficialSourceBaselines(root);

  const selectedSources = allSources.filter((source) => group === 'daily' ? isDailySource(source) : !isDailySource(source));
  const selectedIds = new Set(selectedSources.map((source) => source.source_id));
  const selectedBaselineSet = {
    ...structuredClone(fullBaselineSet),
    baselines: (fullBaselineSet.baselines ?? []).filter((baseline) => selectedIds.has(baseline.source_id))
  };

  return {
    group,
    all_source_count: allSources.length,
    selected_source_count: selectedSources.length,
    selected_source_ids: selectedSources.map((source) => source.source_id).sort(),
    sources: selectedSources,
    baselineSet: selectedBaselineSet
  };
}

export function validateScheduledSourcePartition(options = {}) {
  const root = options.root ?? process.cwd();
  const allSources = options.sources ?? loadOfficialSources(root);
  const baselineSet = options.baselineSet ?? loadOfficialSourceBaselines(root);
  const daily = selectScheduledSourceGroup('daily', { root, sources: allSources, baselineSet });
  const weekly = selectScheduledSourceGroup('weekly', { root, sources: allSources, baselineSet });
  const dailyIds = new Set(daily.selected_source_ids);
  const weeklyIds = new Set(weekly.selected_source_ids);
  const overlap = [...dailyIds].filter((id) => weeklyIds.has(id)).sort();
  const union = [...new Set([...dailyIds, ...weeklyIds])].sort();
  const allIds = allSources.map((source) => source.source_id).sort();
  const dailyBaselineIds = daily.baselineSet.baselines.map((row) => row.source_id).sort();
  const weeklyBaselineIds = weekly.baselineSet.baselines.map((row) => row.source_id).sort();

  return {
    daily,
    weekly,
    overlap,
    union_matches_all_sources: JSON.stringify(union) === JSON.stringify(allIds),
    daily_source_baseline_parity: JSON.stringify(daily.selected_source_ids) === JSON.stringify(dailyBaselineIds),
    weekly_source_baseline_parity: JSON.stringify(weekly.selected_source_ids) === JSON.stringify(weeklyBaselineIds),
    all_baselines_pending: (baselineSet.baselines ?? []).every((row) => row.status === 'pending_initial_acceptance')
  };
}
