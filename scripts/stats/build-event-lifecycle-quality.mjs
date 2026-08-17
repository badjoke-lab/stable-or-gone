import { getEventStatusEffectCategory, getPublicEventCategory } from '../../config/event-taxonomy.mjs';

const pct = (count, denominator) => denominator ? Number(((count / denominator) * 100).toFixed(2)) : 0;
const coverage = (count, denominator) => ({ count, denominator, percentage: pct(count, denominator) });
const isRecorded = (value) => value !== undefined && value !== null && value !== '' && value !== 'unknown';

function assetIdsForEvent(event, canonicalIds) {
  return [...new Set([event.stablecoin_id, ...(event.subject_stablecoin_ids ?? [])].filter((id) => canonicalIds.has(id)))];
}

export function buildEventLifecycleQuality(input) {
  const totalAssets = input.stablecoins.length;
  const canonicalIds = new Set(input.stablecoins.map((row) => row.id));
  const detailById = new Map(input.event_details.map((row) => [row.id, row]));
  const rows = input.events.map((event) => {
    const detail = detailById.get(event.id) ?? event;
    const detailKind = detail.event_detail_kind ?? event.event_detail_kind ?? 'other';
    return {
      event,
      detail,
      detailKind,
      publicCategory: getPublicEventCategory(event.event_type),
      statusEffectCategory: getEventStatusEffectCategory(event.event_status_effect),
      assetIds: assetIdsForEvent(event, canonicalIds)
    };
  });

  const summarize = (selected) => {
    const assetIds = new Set(selected.flatMap((row) => row.assetIds));
    return {
      event_count: selected.length,
      asset_coverage: coverage(assetIds.size, totalAssets)
    };
  };

  const depeg = rows.filter((row) => row.detailKind === 'depeg' || row.publicCategory === 'depeg');
  const regulatory = rows.filter((row) => row.detailKind === 'regulatory' || row.publicCategory === 'regulatory');
  const redemption = rows.filter((row) => row.detailKind === 'redemption_change' || row.publicCategory === 'redemption');
  const migrationTermination = rows.filter((row) =>
    row.detailKind === 'migration'
    || row.publicCategory === 'migration'
    || row.publicCategory === 'wind_down'
    || row.statusEffectCategory === 'terminated'
  );
  const depegRecoveryRecorded = depeg.filter((row) => isRecorded(row.detail.depeg_detail?.recovery_status));

  return {
    depeg: {
      ...summarize(depeg),
      recovery_state_recorded: coverage(depegRecoveryRecorded.length, depeg.length)
    },
    regulatory: summarize(regulatory),
    redemption_change: summarize(redemption),
    migration_or_termination: summarize(migrationTermination)
  };
}
