import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildReviewedRecordDepthBaseline } from './growth/build-reviewed-record-depth-baseline-pr353.mjs';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';
import { loadStatsInput } from './stats/load-stats-input.mjs';

const root = process.cwd();
const files = {
  config: 'config/post-pr360-review-gate-pr361.json',
  historicalDepth: 'docs/migration/record-depth-baseline-pr353-summary.json',
  correctionHandoff: 'docs/migration/evidence-correction-batch-pr360-reviewed-handoff.json',
  correctionOutcome: 'docs/migration/evidence-correction-outcomes-pr360.json',
  canonicalCheckpoint: 'docs/migration/current-canonical-checkpoint.json',
  statsHistory: 'data/stats-history.json',
  marketAccess: 'data/market-access-records-v1.json',
  comparePresets: 'config/compare-v1-presets.json',
  registryUpdates: 'data/registry-updates.json'
};
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const readRows = (file) => {
  const value = readJson(file);
  const rows = Array.isArray(value) ? value : value?.records;
  if (!Array.isArray(rows)) throw new Error(`${file}: expected array or { records: [] }`);
  return rows;
};
const unique = (values) => [...new Set(values.filter(Boolean))].sort();
const countBy = (values) => Object.fromEntries([...values.reduce((map, value) => map.set(value, (map.get(value) ?? 0) + 1), new Map()).entries()].sort(([a], [b]) => String(a).localeCompare(String(b))));
const percent = (numerator, denominator) => denominator ? Number(((numerator / denominator) * 100).toFixed(2)) : 0;

function dimensionMap(summary) {
  return new Map((summary?.dimension_states ?? []).map((row) => [row.dimension_id, row.state_counts]));
}

function buildDimensionDeltas(historical, current) {
  const oldMap = dimensionMap(historical.summary);
  const currentMap = dimensionMap(current.summary);
  return current.dimension_order.map((dimensionId) => {
    const before = oldMap.get(dimensionId) ?? {};
    const after = currentMap.get(dimensionId) ?? {};
    const states = unique([...Object.keys(before), ...Object.keys(after)]);
    return {
      dimension_id: dimensionId,
      before,
      after,
      delta: Object.fromEntries(states.map((state) => [state, (after[state] ?? 0) - (before[state] ?? 0)])),
      unresolved_after: (after.partial ?? 0) + (after.sparse ?? 0) + (after.absent ?? 0)
    };
  });
}

function summarizeTimeline(events, assetCount) {
  const eventDates = events.map((row) => row.event_date ?? row.date ?? row.effective_date ?? null);
  const dated = eventDates.filter((value) => typeof value === 'string' && /^\d{4}(?:-\d{2})?(?:-\d{2})?$/.test(value));
  const dayPrecise = dated.filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value));
  const monthPrecise = dated.filter((value) => /^\d{4}-\d{2}$/.test(value));
  const yearPrecise = dated.filter((value) => /^\d{4}$/.test(value));
  const years = dated.map((value) => Number(value.slice(0, 4))).filter(Number.isFinite);
  const assetIds = unique(events.flatMap((row) => [row.stablecoin_id, ...(row.stablecoin_ids ?? [])]));
  return {
    event_count: events.length,
    assets_with_events: assetIds.length,
    assets_without_events: Math.max(0, assetCount - assetIds.length),
    events_per_asset: Number((events.length / assetCount).toFixed(2)),
    dated_event_count: dated.length,
    day_precise_count: dayPrecise.length,
    month_precise_count: monthPrecise.length,
    year_precise_count: yearPrecise.length,
    undated_or_noncanonical_date_count: events.length - dated.length,
    earliest_year: years.length ? Math.min(...years) : null,
    latest_year: years.length ? Math.max(...years) : null,
    events_by_year: countBy(years)
  };
}

function summarizeMarketAccess(records) {
  const assetIds = unique(records.map((row) => row.asset_id));
  const platforms = unique(records.map((row) => `${row.platform?.name ?? 'unknown'}|${row.platform?.service ?? ''}`));
  const jurisdictions = unique(records.map((row) => row.jurisdiction?.country_code));
  const functions = unique(records.map((row) => row.function));
  return {
    record_count: records.length,
    asset_count: assetIds.length,
    asset_ids: assetIds,
    platform_count: platforms.length,
    platforms,
    jurisdiction_count: jurisdictions.length,
    jurisdictions,
    function_count: functions.length,
    functions,
    records_by_asset: countBy(records.map((row) => row.asset_id)),
    records_by_function: countBy(records.map((row) => row.function))
  };
}

function summarizeUpdates(updates) {
  const dates = updates.map((row) => row.date).filter((value) => /^\d{4}-\d{2}-\d{2}$/.test(value));
  const latestMonth = dates.length ? dates.sort().at(-1).slice(0, 7) : null;
  const latestRows = latestMonth ? updates.filter((row) => String(row.date ?? '').startsWith(latestMonth)) : [];
  return {
    total_update_entries: updates.length,
    latest_reviewed_month: latestMonth,
    latest_month_entry_count: latestRows.length,
    latest_month_categories: countBy(latestRows.map((row) => row.category ?? 'unknown'))
  };
}

export function buildReviewGate() {
  const config = readJson(files.config);
  const historical = readJson(files.historicalDepth);
  const handoff = readJson(files.correctionHandoff);
  const outcome = readJson(files.correctionOutcome);
  const checkpoint = readJson(files.canonicalCheckpoint);
  const history = readJson(files.statsHistory);
  const marketAccess = readJson(files.marketAccess);
  const presets = readJson(files.comparePresets);
  const updates = readJson(files.registryUpdates);
  const currentDepth = buildReviewedRecordDepthBaseline();
  const input = loadStatsInput(root);
  const v2 = loadRegistryV2Baseline(root);
  const evidenceRelationFiles = v2.data_groups?.evidence_relations ?? [];
  const evidenceRelations = evidenceRelationFiles.flatMap(readRows);
  const latestSnapshot = history.snapshots.at(-1);
  const deltas = buildDimensionDeltas(historical, currentDepth);
  const unresolvedDimensions = [...deltas]
    .sort((a, b) => b.unresolved_after - a.unresolved_after || a.dimension_id.localeCompare(b.dimension_id));
  const presetSlugs = unique((presets.presets ?? []).flatMap((row) => row.asset_slugs ?? []));
  const currentAssetSlugs = new Set(currentDepth.assets.map((row) => row.asset_slug));
  const marketAccessSummary = summarizeMarketAccess(marketAccess);
  const timeline = summarizeTimeline(input.events, currentDepth.asset_count);
  const archiveRecorded = outcome.archive_index_count_after;
  const archiveNotRecorded = outcome.archive_not_recorded_count_after;
  const threshold = config.decision_rules;

  const decisions = {
    record_depth_baseline_refresh: {
      decision: 'approved_required',
      reasons: [
        `canonical asset count changed from ${historical.asset_count} to ${currentDepth.asset_count}`,
        historical.input_digest_sha256 === currentDepth.input_digest_sha256 ? 'input digest unchanged' : 'canonical planning input digest changed',
        'the PR #353 queue predates PR #354-#360 dossier, growth, Market Access, and Evidence corrections'
      ]
    },
    tier_a_dossier_batch_4: {
      decision: 'approved_after_baseline_refresh',
      maximum_assets: threshold.dossier_batch_maximum_assets,
      current_recomputed_candidate_count: currentDepth.tier_a_candidate_queue.length,
      reason: 'asset selection must come from the refreshed non-ranking 112-asset queue, not the immutable PR #353 queue'
    },
    evidence_archive_maintenance_batch_2: {
      decision: archiveNotRecorded >= threshold.evidence_maintenance_priority_if_no_archive_count_at_least ? 'approved_priority' : 'deferred',
      maximum_records: threshold.evidence_maintenance_maximum_records,
      archive_not_recorded: archiveNotRecorded,
      threshold: threshold.evidence_maintenance_priority_if_no_archive_count_at_least
    },
    market_access_pilot_3: {
      decision: marketAccessSummary.asset_count >= threshold.market_access_pilot_requires_minimum_assets
        && marketAccessSummary.platform_count >= threshold.market_access_pilot_requires_minimum_platforms
        && marketAccessSummary.jurisdiction_count >= threshold.market_access_pilot_requires_minimum_jurisdictions
        ? 'eligible_for_separate_review'
        : 'not_approved',
      current: {
        assets: marketAccessSummary.asset_count,
        platforms: marketAccessSummary.platform_count,
        jurisdictions: marketAccessSummary.jurisdiction_count
      },
      minimum: {
        assets: threshold.market_access_pilot_requires_minimum_assets,
        platforms: threshold.market_access_pilot_requires_minimum_platforms,
        jurisdictions: threshold.market_access_pilot_requires_minimum_jurisdictions
      }
    },
    record_growth_batch_2: {
      decision: 'not_approved_in_next_sequence',
      reason: 'refresh current depth and complete one bounded dossier batch before another asset-growth decision'
    },
    new_public_surface: {
      decision: 'not_approved',
      reason: 'current public product set remains sufficient and this gate found data-depth and maintenance priorities first'
    }
  };

  const inputDigest = crypto.createHash('sha256');
  for (const file of Object.values(files).sort()) {
    inputDigest.update(file);
    inputDigest.update('\0');
    inputDigest.update(readText(file));
    inputDigest.update('\0');
  }
  for (const file of [...evidenceRelationFiles].sort()) {
    inputDigest.update(file);
    inputDigest.update('\0');
    inputDigest.update(readText(file));
    inputDigest.update('\0');
  }
  inputDigest.update(currentDepth.input_digest_sha256);

  return {
    schema_version: '1.0',
    report_id: 'sog_post_pr360_review_gate_pr361_2026_07_14',
    status: 'deterministic_internal_review_gate',
    public_output: false,
    review_pr: 361,
    source_handoff_id: handoff.handoff_id,
    source_merge_commit: handoff.source_merge_commit,
    current_checkpoint_id: checkpoint.checkpoint_id,
    current_stats_checkpoint_id: latestSnapshot.checkpoint_id,
    current_counts: {
      assets: currentDepth.asset_count,
      organizations: input.organizations.length,
      relationships: input.relationships.length,
      events: input.events.length,
      evidence: input.evidence.length,
      evidence_relations: evidenceRelations.length,
      deployments: input.deployments.length,
      known_unknowns: input.known_unknowns.length,
      market_access_records: input.market_access_records.length
    },
    evaluation_axes: {
      record_family_sparsity: {
        historical_asset_count: historical.asset_count,
        current_asset_count: currentDepth.asset_count,
        historical_state_counts: historical.summary.state_counts,
        current_state_counts: currentDepth.summary.state_counts,
        dimension_deltas: deltas,
        highest_unresolved_dimensions: unresolvedDimensions.slice(0, 8).map((row) => ({dimension_id: row.dimension_id, unresolved_after: row.unresolved_after})),
        current_tier_a_candidate_count: currentDepth.tier_a_candidate_queue.length
      },
      tier_a_dossier_depth: {
        historical_candidate_count: historical.summary.tier_a_candidate_count,
        current_candidate_count: currentDepth.tier_a_candidate_queue.length,
        historical_queue_reuse_allowed: false,
        current_queue_order: currentDepth.queue_order
      },
      compare_utility: {
        preset_count: (presets.presets ?? []).length,
        unique_preset_asset_count: presetSlugs.length,
        preset_assets_present: presetSlugs.filter((slug) => currentAssetSlugs.has(slug)).length,
        current_comparison_readiness_states: currentDepth.summary.dimension_states.find((row) => row.dimension_id === 'comparison_readiness')?.state_counts ?? {}
      },
      timeline_historical_density: timeline,
      canonical_market_access_utility: marketAccessSummary,
      monitoring_signal_usefulness: {
        decision: 'continue_private_review_only',
        canonical_auto_promotion_allowed: false,
        reviewed_gate_finding: 'No repository-backed evidence in this gate justifies converting monitoring observations directly into canonical records.'
      },
      correction_and_source_maintenance_burden: {
        evidence_records: input.evidence.length,
        archive_recorded: archiveRecorded,
        archive_recorded_percent: percent(archiveRecorded, input.evidence.length),
        archive_not_recorded: archiveNotRecorded,
        archive_not_recorded_percent: percent(archiveNotRecorded, input.evidence.length),
        pr360_selected: outcome.selected_count,
        pr360_corrected: outcome.changed_count,
        pr360_reviewed_no_change: outcome.reviewed_no_change_count,
        remaining_known_unknowns: input.known_unknowns.length
      },
      monthly_maintenance_burden: summarizeUpdates(updates),
      external_usage_or_referral_evidence: {
        status: 'not_available_in_reviewed_repository_evidence',
        decision_effect: 'No growth or public-surface approval is based on unverified external usage claims.'
      }
    },
    decisions,
    approved_next_sequence: config.approved_next_sequence,
    not_approved_in_next_sequence: config.not_approved_in_next_sequence,
    review_gate_after_sequence: config.review_gate_after_sequence,
    input_digest_sha256: inputDigest.digest('hex')
  };
}

export const serializeReviewGate = (report) => `${JSON.stringify(report, null, 2)}\n`;

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const outputPath = process.argv[2] ?? 'docs/migration/post-pr360-review-gate-pr361.json';
  const report = buildReviewGate();
  fs.mkdirSync(path.dirname(path.join(root, outputPath)), {recursive: true});
  fs.writeFileSync(path.join(root, outputPath), serializeReviewGate(report));
  console.log(JSON.stringify({
    ok: true,
    output: outputPath,
    current_counts: report.current_counts,
    current_tier_a_candidate_count: report.evaluation_axes.tier_a_dossier_depth.current_candidate_count,
    market_access: report.evaluation_axes.canonical_market_access_utility,
    archive_not_recorded: report.evaluation_axes.correction_and_source_maintenance_burden.archive_not_recorded,
    decisions: Object.fromEntries(Object.entries(report.decisions).map(([key, value]) => [key, value.decision])),
    input_digest_sha256: report.input_digest_sha256
  }, null, 2));
}
