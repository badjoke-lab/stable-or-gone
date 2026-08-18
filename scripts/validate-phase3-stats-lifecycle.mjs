import { generateStats } from './build-stats.mjs';
import { loadStatsInput } from './stats/load-stats-input.mjs';
import { getEventStatusEffectCategory, getPublicEventCategory } from '../config/event-taxonomy.mjs';

const stats = generateStats();
const input = loadStatsInput(process.cwd());
const totalAssets = input.stablecoins.length;
const quality = stats.events?.lifecycle_quality;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function pct(count, denominator) {
  return denominator ? Number(((count / denominator) * 100).toFixed(2)) : 0;
}

function expectedCoverage(predicate) {
  const canonicalIds = new Set(input.stablecoins.map((row) => row.id));
  const details = new Map(input.event_details.map((row) => [row.id, row]));
  const selected = input.events.filter((event) => predicate(event, details.get(event.id) ?? event));
  const assets = new Set(selected.flatMap((event) => [event.stablecoin_id, ...(event.subject_stablecoin_ids ?? [])].filter((id) => canonicalIds.has(id))));
  return {
    event_count: selected.length,
    asset_coverage: {
      count: assets.size,
      denominator: totalAssets,
      percentage: pct(assets.size, totalAssets)
    }
  };
}

assert(quality && typeof quality === 'object', 'events.lifecycle_quality is missing');

const expectedRegulatory = expectedCoverage((event, detail) => detail.event_detail_kind === 'regulatory' || getPublicEventCategory(event.event_type) === 'regulatory');
const expectedRedemption = expectedCoverage((event, detail) => detail.event_detail_kind === 'redemption_change' || getPublicEventCategory(event.event_type) === 'redemption');
const expectedMigrationTermination = expectedCoverage((event, detail) =>
  detail.event_detail_kind === 'migration'
  || getPublicEventCategory(event.event_type) === 'migration'
  || getPublicEventCategory(event.event_type) === 'wind_down'
  || getEventStatusEffectCategory(event.event_status_effect) === 'terminated'
);

for (const [label, actual, expected] of [
  ['regulatory', quality.regulatory, expectedRegulatory],
  ['redemption_change', quality.redemption_change, expectedRedemption],
  ['migration_or_termination', quality.migration_or_termination, expectedMigrationTermination]
]) {
  assert(actual?.event_count === expected.event_count, `${label}: event_count mismatch`);
  assert(actual?.asset_coverage?.count === expected.asset_coverage.count, `${label}: asset coverage count mismatch`);
  assert(actual?.asset_coverage?.denominator === totalAssets, `${label}: asset coverage denominator mismatch`);
  assert(actual?.asset_coverage?.percentage === expected.asset_coverage.percentage, `${label}: asset coverage percentage mismatch`);
}

const depegDetails = input.event_details.filter((row) => row.event_detail_kind === 'depeg');
const existingOutcomeTotal = Object.values(stats.events?.depeg_outcomes ?? {}).reduce((sum, row) => sum + Number(row?.count ?? 0), 0);
assert(existingOutcomeTotal === depegDetails.length, 'Existing depeg outcome distribution no longer reconciles to typed depeg details');
assert(quality.depeg?.event_count >= depegDetails.length, 'Depeg lifecycle event count cannot be lower than typed depeg detail count');
assert(quality.depeg?.asset_coverage?.denominator === totalAssets, 'Depeg asset coverage denominator mismatch');
assert(quality.depeg?.recovery_state_recorded?.denominator === quality.depeg?.event_count, 'Depeg recovery-state denominator must equal selected depeg event count');
assert(quality.depeg?.recovery_state_recorded?.count <= quality.depeg?.event_count, 'Recorded depeg recovery states exceed selected depeg events');

for (const key of ['regulatory', 'redemption_change', 'migration_or_termination']) {
  assert(quality[key].event_count > 0, `${key}: expected at least one reviewed canonical event`);
  assert(quality[key].asset_coverage.count > 0, `${key}: expected at least one covered canonical asset`);
}

console.log(JSON.stringify({
  ok: true,
  total_assets: totalAssets,
  depeg: quality.depeg,
  regulatory: quality.regulatory,
  redemption_change: quality.redemption_change,
  migration_or_termination: quality.migration_or_termination
}, null, 2));
