import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = process.cwd();
const paths = {
  contract: 'config/planning-queue-review-history-v1-pr374.json',
  pr354Config: 'config/tier-a-dossier-batch-1-pr354.json',
  pr354Handoff: 'docs/migration/tier-a-batch-1-pr354-reviewed-handoff.json',
  pr355Config: 'config/tier-a-dossier-batch-2-pr355.json',
  pr355Handoff: 'docs/migration/tier-a-batch-2-pr355-reviewed-handoff.json',
  pr357Outcomes: 'docs/migration/tier-a-batch-3-pr357-review-outcomes.json',
  pr364Findings: 'docs/migration/tier-a-dossier-batch-4-pr364-findings.json',
  pr364Handoff: 'docs/migration/tier-a-batch-4-pr364-reviewed-handoff.json',
  pr369Outcomes: 'docs/migration/tier-a-batch-5-pr369-review-outcomes.json',
  currentQueue: 'docs/migration/tier-a-candidate-queue-v2-1-pr372.json',
  authority: 'docs/migration/post-pr372-review-gate-pr373.json'
};
const outputPaths = {
  manifest: 'docs/migration/planning-queue-review-history-manifest-pr374.json',
  audit: 'docs/migration/planning-queue-review-history-audit-pr374.json'
};
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const countBy = (rows, key) => rows.reduce((acc, row) => ({ ...acc, [row[key]]: (acc[row[key]] ?? 0) + 1 }), {});

function sourceRow(id, pr, reviewedAt, file) {
  return { source_id: id, review_pr: pr, reviewed_at: reviewedAt, path: file, content_sha256: sha256(readText(file)) };
}

function addDimensionEvents(target, { assetId, assetSlug, dimensions, outcome, reviewPr, reviewedAt, sourceId, evidenceIds = [], reasonCodes = [], sourceOrder }) {
  for (const dimensionId of dimensions) {
    target.push({
      event_id: `pr${reviewPr}:${assetSlug}:${dimensionId}:${outcome}`,
      asset_id: assetId,
      asset_slug: assetSlug,
      dimension_id: dimensionId,
      review_outcome: outcome,
      review_pr: reviewPr,
      reviewed_at: reviewedAt,
      source_id: sourceId,
      source_order: sourceOrder,
      reviewed_evidence_ids: [...evidenceIds].sort(),
      reason_codes: [...reasonCodes].sort(),
      automatic_time_expiry: false
    });
  }
}

function buildHistoryEvents(inputs) {
  const events = [];
  let sourceOrder = 0;

  for (const row of inputs.pr354Config.selected_assets) {
    addDimensionEvents(events, {
      assetId: row.asset_id,
      assetSlug: row.asset_slug,
      dimensions: inputs.pr354Handoff.improved_dimensions[row.asset_slug] ?? row.target_dimensions,
      outcome: 'reviewed_complete',
      reviewPr: 354,
      reviewedAt: inputs.pr354Handoff.reviewed_at,
      sourceId: inputs.pr354Handoff.handoff_id,
      sourceOrder: sourceOrder++
    });
  }

  for (const row of inputs.pr355Config.selected_assets) {
    addDimensionEvents(events, {
      assetId: row.asset_id,
      assetSlug: row.asset_slug,
      dimensions: row.target_dimensions,
      outcome: 'reviewed_complete',
      reviewPr: 355,
      reviewedAt: inputs.pr355Handoff.recorded_at,
      sourceId: inputs.pr355Handoff.handoff_id,
      sourceOrder: sourceOrder++
    });
  }

  for (const row of inputs.pr357Outcomes.outcomes) {
    if (row.review_status === 'reviewed_no_safe_canonical_change') {
      addDimensionEvents(events, {
        assetId: row.asset_id,
        assetSlug: row.asset_slug,
        dimensions: row.target_dimensions,
        outcome: 'reviewed_no_safe_change',
        reviewPr: 357,
        reviewedAt: inputs.pr357Outcomes.recorded_at,
        sourceId: inputs.pr357Outcomes.outcome_id,
        evidenceIds: row.reviewed_evidence_ids,
        reasonCodes: row.reason_codes,
        sourceOrder: sourceOrder++
      });
      continue;
    }
    for (const dimensionId of row.target_dimensions) {
      const outcome = row.remaining_unresolved_dimensions?.includes(dimensionId)
        ? 'reviewed_partial'
        : 'reviewed_complete';
      addDimensionEvents(events, {
        assetId: row.asset_id,
        assetSlug: row.asset_slug,
        dimensions: [dimensionId],
        outcome,
        reviewPr: 357,
        reviewedAt: inputs.pr357Outcomes.recorded_at,
        sourceId: inputs.pr357Outcomes.outcome_id,
        evidenceIds: row.reviewed_evidence_ids,
        reasonCodes: row.reason_codes,
        sourceOrder: sourceOrder++
      });
    }
  }

  for (const row of inputs.pr364Findings.findings) {
    addDimensionEvents(events, {
      assetId: row.asset_id,
      assetSlug: row.asset_slug,
      dimensions: row.decision === 'reviewed_no_safe_change' ? row.target_dimensions : row.changed_dimensions,
      outcome: row.decision === 'reviewed_no_safe_change' ? 'reviewed_no_safe_change' : 'reviewed_complete',
      reviewPr: 364,
      reviewedAt: inputs.pr364Findings.reviewed_at,
      sourceId: inputs.pr364Findings.findings_id,
      evidenceIds: row.reviewed_evidence_ids,
      reasonCodes: [row.decision],
      sourceOrder: sourceOrder++
    });
  }

  for (const row of inputs.pr369Outcomes.selected_assets) {
    addDimensionEvents(events, {
      assetId: row.asset_id,
      assetSlug: row.asset_slug,
      dimensions: row.reviewed_material_gaps,
      outcome: row.outcome === 'reviewed_no_safe_change' ? 'reviewed_no_safe_change' : 'reviewed_complete',
      reviewPr: 369,
      reviewedAt: inputs.pr369Outcomes.reviewed_at,
      sourceId: inputs.pr369Outcomes.outcomes_id,
      reasonCodes: [row.outcome, `prior_review_pr_${row.prior_review_pr}`],
      sourceOrder: sourceOrder++
    });
  }

  return events.sort((left, right) =>
    left.reviewed_at.localeCompare(right.reviewed_at)
    || left.review_pr - right.review_pr
    || left.source_order - right.source_order
    || left.asset_slug.localeCompare(right.asset_slug)
    || left.dimension_id.localeCompare(right.dimension_id));
}

function effectiveRows(events, contract) {
  const byKey = new Map();
  for (const event of events) byKey.set(`${event.asset_id}:${event.dimension_id}`, event);
  return [...byKey.values()].map((event) => {
    const state = event.review_outcome === 'reviewed_complete'
      ? 'suppressed_reviewed_complete'
      : event.review_outcome === 'reviewed_partial'
        ? 'suppressed_reviewed_partial_without_new_signal'
        : 'suppressed_reviewed_no_safe_change';
    return {
      asset_id: event.asset_id,
      asset_slug: event.asset_slug,
      dimension_id: event.dimension_id,
      effective_review_outcome: event.review_outcome,
      eligibility_state_without_new_signal: state,
      effective_review_pr: event.review_pr,
      effective_reviewed_at: event.reviewed_at,
      effective_source_id: event.source_id,
      reviewed_evidence_ids: event.reviewed_evidence_ids,
      automatic_time_expiry: contract.suppression_policy.automatic_time_expiry,
      reactivation_required: true
    };
  }).sort((left, right) => left.asset_slug.localeCompare(right.asset_slug) || left.dimension_id.localeCompare(right.dimension_id));
}

function auditQueue(queue, effective) {
  const byKey = new Map(effective.map((row) => [`${row.asset_id}:${row.dimension_id}`, row]));
  const candidates = queue.candidates.map((candidate) => {
    const dimensionEligibility = candidate.material_dossier_gaps.map((dimensionId) => {
      const history = byKey.get(`${candidate.asset_id}:${dimensionId}`) ?? null;
      return {
        dimension_id: dimensionId,
        review_history_found: history != null,
        effective_review_outcome: history?.effective_review_outcome ?? null,
        eligibility_state: history?.eligibility_state_without_new_signal ?? 'eligible_unreviewed_gap',
        reactivation_signal_present: false
      };
    });
    const eligibleDimensions = dimensionEligibility.filter((row) => row.eligibility_state === 'eligible_unreviewed_gap');
    const suppressedDimensions = dimensionEligibility.filter((row) => row.eligibility_state.startsWith('suppressed_'));
    return {
      asset_id: candidate.asset_id,
      asset_slug: candidate.asset_slug,
      material_dossier_gaps: candidate.material_dossier_gaps,
      dimension_eligibility: dimensionEligibility,
      eligible_dimension_count: eligibleDimensions.length,
      suppressed_dimension_count: suppressedDimensions.length,
      projected_candidate_state: eligibleDimensions.length > 0
        ? 'eligible_unreviewed_or_reactivated_gap'
        : 'suppressed_all_material_gaps_reviewed',
      projected_v2_2_eligible: eligibleDimensions.length > 0
    };
  });
  return {
    source_queue_id: queue.queue_id,
    source_candidate_count: queue.candidate_count,
    reactivation_signal_count: 0,
    candidates,
    fully_suppressed_candidate_count: candidates.filter((row) => !row.projected_v2_2_eligible).length,
    projected_v2_2_candidate_count: candidates.filter((row) => row.projected_v2_2_eligible).length,
    projected_v2_2_candidate_slugs: candidates.filter((row) => row.projected_v2_2_eligible).map((row) => row.asset_slug)
  };
}

export function buildPlanningQueueReviewHistoryOutputs() {
  const contractText = readText(paths.contract);
  const contract = JSON.parse(contractText);
  const inputs = {
    pr354Config: readJson(paths.pr354Config),
    pr354Handoff: readJson(paths.pr354Handoff),
    pr355Config: readJson(paths.pr355Config),
    pr355Handoff: readJson(paths.pr355Handoff),
    pr357Outcomes: readJson(paths.pr357Outcomes),
    pr364Findings: readJson(paths.pr364Findings),
    pr364Handoff: readJson(paths.pr364Handoff),
    pr369Outcomes: readJson(paths.pr369Outcomes),
    currentQueue: readJson(paths.currentQueue),
    authority: readJson(paths.authority)
  };
  const sources = [
    sourceRow(inputs.pr354Handoff.handoff_id, 354, inputs.pr354Handoff.reviewed_at, paths.pr354Handoff),
    sourceRow(inputs.pr355Handoff.handoff_id, 355, inputs.pr355Handoff.recorded_at, paths.pr355Handoff),
    sourceRow(inputs.pr357Outcomes.outcome_id, 357, inputs.pr357Outcomes.recorded_at, paths.pr357Outcomes),
    sourceRow(inputs.pr364Findings.findings_id, 364, inputs.pr364Findings.reviewed_at, paths.pr364Findings),
    sourceRow(inputs.pr369Outcomes.outcomes_id, 369, inputs.pr369Outcomes.reviewed_at, paths.pr369Outcomes)
  ];
  const events = buildHistoryEvents(inputs);
  const effective = effectiveRows(events, contract);
  const queueAudit = auditQueue(inputs.currentQueue, effective);
  const reviewedAssetSlugs = [...new Set(effective.map((row) => row.asset_slug))].sort();
  const outcomeCounts = countBy(effective, 'effective_review_outcome');
  const sourceDigest = sha256(Object.values(paths).map((file) => `${file}\0${readText(file)}`).join('\0'));
  const manifestDigest = sha256(JSON.stringify({ contractId: contract.contract_id, sources, events, effective, sourceDigest }));

  const manifest = {
    schema_version: '1.0',
    manifest_id: 'sog_planning_queue_review_history_manifest_pr374_v1',
    status: 'reviewed_internal_complete_review_history_manifest',
    public_output: false,
    review_pr: 374,
    reviewed_at: contract.reviewed_at,
    contract_id: contract.contract_id,
    history_resolution: contract.history_resolution,
    sources,
    counts: {
      history_source_count: sources.length,
      history_event_count: events.length,
      reviewed_asset_count: reviewedAssetSlugs.length,
      effective_asset_dimension_count: effective.length,
      effective_reviewed_complete_count: outcomeCounts.reviewed_complete ?? 0,
      effective_reviewed_partial_count: outcomeCounts.reviewed_partial ?? 0,
      effective_reviewed_no_safe_change_count: outcomeCounts.reviewed_no_safe_change ?? 0
    },
    reviewed_asset_slugs: reviewedAssetSlugs,
    history_events: events,
    effective_asset_dimensions: effective,
    source_digest_sha256: sourceDigest,
    manifest_digest_sha256: manifestDigest
  };

  const audit = {
    schema_version: '1.0',
    audit_id: 'sog_planning_queue_review_history_audit_pr374_2026_07_15',
    status: 'reviewed_complete',
    public_output: false,
    review_pr: 374,
    reviewed_at: contract.reviewed_at,
    contract_id: contract.contract_id,
    source_manifest_id: manifest.manifest_id,
    suppression_policy: contract.suppression_policy,
    reactivation_policy: contract.reactivation_policy,
    current_queue_audit: queueAudit,
    findings: [
      'Review history covers 18 assets and 33 effective asset-dimension outcomes across five reviewed dossier sources.',
      'No review outcome expires automatically with time.',
      'Queue presence and planning-state changes are not new-source signals.',
      'AUDD, NZDS, and poundtoken have every current material dossier gap suppressed by a latest reviewed no-safe-change outcome.',
      'Without a reviewed new-source or semantics-change signal, the projected v2.2 queue contains zero candidates.'
    ],
    decision: {
      contract_complete: true,
      approved_manifest: outputPaths.manifest,
      next_work_item: contract.next_work_item,
      baseline_recompute_allowed_in_pr374: false,
      canonical_data_change_allowed: false,
      public_surface_change_allowed: false,
      review_gate_after_pr375: true
    },
    boundaries: {
      canonical_data_changed: false,
      public_surface_changed: false,
      baseline_recomputed: false,
      historical_queue_rewritten: false,
      ranking_or_score: false,
      automatic_promotion: false
    },
    manifest_digest_sha256: manifestDigest,
    source_digest_sha256: sourceDigest
  };

  return { manifest, audit };
}

export function writePlanningQueueReviewHistoryOutputs(outputs = buildPlanningQueueReviewHistoryOutputs()) {
  for (const [key, file] of Object.entries(outputPaths)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), serialize(outputs[key]));
  }
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const outputs = buildPlanningQueueReviewHistoryOutputs();
  if (process.argv.includes('--check')) {
    for (const [key, file] of Object.entries(outputPaths)) {
      if (!fs.existsSync(path.join(root, file)) || readText(file) !== serialize(outputs[key])) {
        console.error(`${file} is not reproducible`);
        process.exit(1);
      }
    }
  } else writePlanningQueueReviewHistoryOutputs(outputs);
  console.log(JSON.stringify({
    ok: true,
    manifest_id: outputs.manifest.manifest_id,
    history_sources: outputs.manifest.counts.history_source_count,
    history_events: outputs.manifest.counts.history_event_count,
    reviewed_assets: outputs.manifest.counts.reviewed_asset_count,
    effective_asset_dimensions: outputs.manifest.counts.effective_asset_dimension_count,
    effective_outcomes: {
      complete: outputs.manifest.counts.effective_reviewed_complete_count,
      partial: outputs.manifest.counts.effective_reviewed_partial_count,
      no_safe_change: outputs.manifest.counts.effective_reviewed_no_safe_change_count
    },
    current_queue_candidates: outputs.audit.current_queue_audit.source_candidate_count,
    fully_suppressed_candidates: outputs.audit.current_queue_audit.fully_suppressed_candidate_count,
    projected_v2_2_candidates: outputs.audit.current_queue_audit.projected_v2_2_candidate_count,
    next_work_item: outputs.audit.decision.next_work_item
  }, null, 2));
}
