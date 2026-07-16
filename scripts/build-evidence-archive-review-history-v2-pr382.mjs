import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const paths = {
  contract: 'config/evidence-archive-review-history-v2-pr382.json',
  authority: 'docs/migration/post-pr380-review-gate-pr381.json',
  pr360Outcomes: 'docs/migration/evidence-correction-outcomes-pr360.json',
  pr365Outcomes: 'docs/migration/evidence-archive-maintenance-outcomes-pr365.json',
  pr380Outcomes: 'docs/migration/evidence-archive-maintenance-outcomes-pr380.json',
  priorManifest: 'docs/migration/evidence-archive-review-history-manifest-pr377.json',
  priorAudit: 'docs/migration/evidence-archive-review-history-audit-pr377.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json'
};
const outputPaths = {
  manifest: 'docs/migration/evidence-archive-review-history-manifest-v2-pr382.json',
  audit: 'docs/migration/evidence-archive-review-history-audit-v2-pr382.json'
};
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const rows = (value, file) => {
  const result = Array.isArray(value) ? value : value?.records ?? value?.evidence ?? value?.items;
  if (!Array.isArray(result)) throw new Error(`${file}: invalid rows`);
  return result;
};
const countBy = (items, key) => items.reduce((acc, item) => ({ ...acc, [item[key]]: (acc[item[key]] ?? 0) + 1 }), {});

function sourceRow(id, pr, reviewedAt, file) {
  return {
    source_id: id,
    review_pr: pr,
    reviewed_at: reviewedAt,
    path: file,
    content_sha256: sha256(readText(file))
  };
}

function currentEvidenceById() {
  const baseline = loadRegistryV2Baseline(root);
  const files = baseline.data_groups?.evidence ?? [];
  const map = new Map();
  for (const file of files) {
    for (const row of rows(readJson(file), file)) {
      if (map.has(row.id)) throw new Error(`${row.id}: duplicate canonical Evidence identity while building history v2`);
      map.set(row.id, { ...row, __source_file: file });
    }
  }
  return map;
}

function buildHistoryEvents(pr360, pr365, pr380) {
  const events = [];
  let sourceOrder = 0;

  for (const row of pr360.outcomes) {
    const nextArchive = row.new_value?.archived_url ?? null;
    const reviewOutcome = row.review_status === 'reviewed_no_safe_canonical_change'
      ? 'reviewed_no_safe_change'
      : nextArchive == null
        ? 'reviewed_archive_removed_invalid'
        : 'reviewed_archive_present';
    events.push({
      event_id: `pr360:${row.evidence_id}:${reviewOutcome}`,
      evidence_id: row.evidence_id,
      review_outcome: reviewOutcome,
      review_pr: 360,
      reviewed_at: '2026-07-14',
      source_id: pr360.report_id,
      source_order: sourceOrder++,
      before_url: row.previous_value?.url ?? row.evidence_basis?.source_url ?? null,
      after_url: row.new_value?.url ?? row.previous_value?.url ?? row.evidence_basis?.source_url ?? null,
      before_archived_url: row.previous_value?.archived_url ?? null,
      after_archived_url: nextArchive,
      decision: row.review_status,
      correction_type: row.correction_type ?? null,
      capture_timestamp: row.evidence_basis?.capture_timestamp ?? null,
      capture_digest: row.evidence_basis?.capture_digest ?? null,
      reason: row.reason ?? null,
      remaining_uncertainty: row.remaining_uncertainty ?? null,
      automatic_time_expiry: false
    });
  }

  for (const row of pr365.outcomes) {
    const reviewOutcome = row.decision === 'dated_archive_added'
      ? 'reviewed_archive_present'
      : 'reviewed_no_safe_change';
    events.push({
      event_id: `pr365:${row.evidence_id}:${reviewOutcome}`,
      evidence_id: row.evidence_id,
      review_outcome: reviewOutcome,
      review_pr: 365,
      reviewed_at: '2026-07-14',
      source_id: pr365.outcome_id,
      source_order: sourceOrder++,
      before_url: null,
      after_url: null,
      before_archived_url: row.previous_archived_url ?? null,
      after_archived_url: row.new_archived_url ?? null,
      decision: row.decision,
      correction_type: row.decision === 'dated_archive_added' ? 'archive_supplementation' : null,
      capture_timestamp: row.capture_timestamp ?? null,
      capture_digest: row.capture_digest ?? null,
      reason: row.reason ?? null,
      remaining_uncertainty: row.remaining_uncertainty ?? null,
      automatic_time_expiry: false
    });
  }

  for (const row of pr380.outcomes) {
    const reviewOutcome = row.decision === 'dated_exact_archive_added'
      ? 'reviewed_archive_present'
      : row.decision === 'reviewed_source_replacement'
        ? 'reviewed_source_replacement'
        : 'reviewed_no_safe_change';
    events.push({
      event_id: `pr380:${row.evidence_id}:${reviewOutcome}`,
      evidence_id: row.evidence_id,
      review_outcome: reviewOutcome,
      review_pr: 380,
      reviewed_at: '2026-07-16',
      source_id: pr380.outcome_id,
      source_order: sourceOrder++,
      before_url: row.previous_url ?? null,
      after_url: row.new_url ?? null,
      before_archived_url: row.previous_archived_url ?? null,
      after_archived_url: row.new_archived_url ?? null,
      decision: row.decision,
      correction_type: row.decision === 'dated_exact_archive_added'
        ? 'archive_supplementation'
        : row.decision === 'reviewed_source_replacement'
          ? 'official_source_replacement'
          : null,
      capture_timestamp: row.capture_timestamp ?? null,
      capture_digest: row.capture_digest ?? null,
      reason: row.reason ?? null,
      remaining_uncertainty: row.remaining_uncertainty ?? null,
      automatic_time_expiry: false
    });
  }

  return events.sort((left, right) =>
    left.reviewed_at.localeCompare(right.reviewed_at)
    || left.review_pr - right.review_pr
    || left.source_order - right.source_order
    || left.evidence_id.localeCompare(right.evidence_id));
}

function effectiveRows(events, currentById, contract) {
  const latestById = new Map();
  for (const event of events) latestById.set(event.evidence_id, event);
  return [...latestById.values()].map((event) => {
    const current = currentById.get(event.evidence_id) ?? null;
    if (!current) throw new Error(`${event.evidence_id}: reviewed history identity missing from current canonical Evidence`);
    const currentArchivedUrl = String(current.archived_url ?? '').trim() || null;
    let eligibilityState;
    let candidateEligible = false;
    let reactivationSignalPresent = false;
    let reactivationSignalType = null;

    if (currentArchivedUrl) {
      eligibilityState = 'not_eligible_archive_present';
    } else if (event.review_outcome === 'reviewed_source_replacement') {
      eligibilityState = 'reactivated_reviewed_source_replacement';
      candidateEligible = true;
      reactivationSignalPresent = true;
      reactivationSignalType = 'reviewed_source_replacement';
    } else if (event.review_outcome === 'reviewed_archive_removed_invalid') {
      eligibilityState = 'suppressed_reviewed_invalid_archive_removed';
    } else if (event.review_outcome === 'reviewed_no_safe_change') {
      eligibilityState = 'suppressed_reviewed_no_safe_change';
    } else {
      throw new Error(`${event.evidence_id}: archive-present reviewed outcome has no current archive`);
    }

    return {
      evidence_id: event.evidence_id,
      current_source_file: current.__source_file,
      current_url: current.url ?? null,
      current_archived_url: currentArchivedUrl,
      effective_review_outcome: event.review_outcome,
      eligibility_state_without_new_signal: eligibilityState,
      candidate_eligible_under_contract: candidateEligible,
      effective_review_pr: event.review_pr,
      effective_reviewed_at: event.reviewed_at,
      effective_source_id: event.source_id,
      automatic_time_expiry: contract.suppression_policy.automatic_time_expiry,
      reactivation_required: !currentArchivedUrl && !candidateEligible,
      reactivation_signal_present: reactivationSignalPresent,
      reactivation_signal_type: reactivationSignalType
    };
  }).sort((left, right) => left.evidence_id.localeCompare(right.evidence_id));
}

export function buildEvidenceArchiveReviewHistoryV2Outputs() {
  const contract = readJson(paths.contract);
  const authority = readJson(paths.authority);
  const pr360 = readJson(paths.pr360Outcomes);
  const pr365 = readJson(paths.pr365Outcomes);
  const pr380 = readJson(paths.pr380Outcomes);
  const priorManifest = readJson(paths.priorManifest);
  const priorAudit = readJson(paths.priorAudit);
  const checkpoint = readJson(paths.checkpoint);

  const authorityDecision = authority.decisions?.evidence_archive_review_history_contract_v2;
  if (authorityDecision?.pr !== 382 || authorityDecision?.decision !== 'approved_internal_contract_update') {
    throw new Error('PR #381 does not authorize PR #382 history v2');
  }
  if (priorManifest.counts?.history_source_count !== 2 || priorManifest.counts?.history_event_count !== 20) {
    throw new Error('Unexpected immutable history v1 manifest inventory');
  }
  if (priorAudit.reviewed_unresolved_archive_gaps?.count !== 10) {
    throw new Error('Unexpected immutable history v1 suppression inventory');
  }

  const currentById = currentEvidenceById();
  const events = buildHistoryEvents(pr360, pr365, pr380);
  const effective = effectiveRows(events, currentById, contract);
  const outcomeCounts = countBy(effective, 'effective_review_outcome');
  const unresolved = effective.filter((row) => row.current_archived_url == null);
  const suppressed = unresolved.filter((row) => row.eligibility_state_without_new_signal.startsWith('suppressed_'));
  const reactivated = unresolved.filter((row) => row.eligibility_state_without_new_signal.startsWith('reactivated_'));
  const sources = [
    sourceRow(pr360.report_id, 360, '2026-07-14', paths.pr360Outcomes),
    sourceRow(pr365.outcome_id, 365, '2026-07-14', paths.pr365Outcomes),
    sourceRow(pr380.outcome_id, 380, '2026-07-16', paths.pr380Outcomes)
  ];

  const expected = contract.expected;
  const actual = {
    history_source_count: sources.length,
    history_event_count: events.length,
    reviewed_evidence_identity_count: effective.length,
    effective_archive_present_count: outcomeCounts.reviewed_archive_present ?? 0,
    effective_archive_removed_invalid_count: outcomeCounts.reviewed_archive_removed_invalid ?? 0,
    effective_no_safe_change_count: outcomeCounts.reviewed_no_safe_change ?? 0,
    effective_source_replacement_count: outcomeCounts.reviewed_source_replacement ?? 0,
    current_archive_not_recorded_count: checkpoint.evidence_quality.archive_not_recorded_count,
    current_reviewed_unresolved_total_count: unresolved.length,
    current_reviewed_suppressed_count: suppressed.length,
    current_reviewed_reactivated_eligible_count: reactivated.length
  };
  for (const [key, value] of Object.entries(actual)) {
    if (expected[key] !== value) throw new Error(`${key}: expected ${expected[key]}, found ${value}`);
  }
  if (JSON.stringify(suppressed.map((row) => row.evidence_id)) !== JSON.stringify([...expected.current_reviewed_suppressed_evidence_ids].sort())) {
    throw new Error('Suppressed Evidence identity set changed');
  }
  if (JSON.stringify(reactivated.map((row) => row.evidence_id)) !== JSON.stringify(expected.current_reviewed_reactivated_eligible_evidence_ids)) {
    throw new Error('Reactivated eligible Evidence identity set changed');
  }

  const sourceDigest = sha256(Object.values(paths).map((file) => `${file}\0${readText(file)}`).join('\0'));
  const manifestDigest = sha256(JSON.stringify({
    contract_id: contract.contract_id,
    prior_manifest_id: priorManifest.manifest_id,
    sources,
    events,
    effective,
    source_digest: sourceDigest
  }));

  const manifest = {
    schema_version: '2.0',
    manifest_id: 'sog_evidence_archive_review_history_manifest_v2_pr382',
    status: 'reviewed_internal_complete_archive_review_history_manifest',
    public_output: false,
    review_pr: 382,
    reviewed_at: contract.reviewed_at,
    contract_id: contract.contract_id,
    prior_manifest_id: priorManifest.manifest_id,
    history_resolution: contract.history_resolution,
    sources,
    counts: actual,
    history_events: events,
    effective_evidence_identities: effective,
    source_digest_sha256: sourceDigest,
    manifest_digest_sha256: manifestDigest
  };

  const audit = {
    schema_version: '2.0',
    audit_id: 'sog_evidence_archive_review_history_audit_v2_pr382_2026_07_16',
    status: 'reviewed_complete',
    public_output: false,
    review_pr: 382,
    reviewed_at: contract.reviewed_at,
    contract_id: contract.contract_id,
    source_manifest_id: manifest.manifest_id,
    prior_audit_id: priorAudit.audit_id,
    source_checkpoint: {
      canonical_evidence_count: checkpoint.expected_counts.evidence,
      evidence_relation_count: 559,
      archive_recorded: checkpoint.evidence_quality.archive_index_count,
      archive_not_recorded: checkpoint.evidence_quality.archive_not_recorded_count
    },
    suppression_policy: contract.suppression_policy,
    reactivation_policy: contract.reactivation_policy,
    reviewed_unresolved: {
      total_count: unresolved.length,
      suppressed_count: suppressed.length,
      reactivated_eligible_count: reactivated.length,
      suppressed_evidence_ids: suppressed.map((row) => row.evidence_id),
      reactivated_eligible_evidence_ids: reactivated.map((row) => row.evidence_id),
      rows: unresolved
    },
    findings: [
      'Archive review history v2 contains 30 reviewed canonical Evidence identities across PR #360, PR #365, and PR #380.',
      'Nineteen reviewed identities currently have a recorded archive and are not eligible.',
      'Ten prior reviewed unresolved identities remain suppressed without a later reviewed reactivation signal.',
      'Circle Mint has a reviewed same-product source replacement and no archive, so it is eligible for fresh manual archive review.',
      'No review outcome expires automatically with time, and no queue presence or unreviewed signal creates eligibility.',
      'PR #383 may consume this contract to generate a fresh internal queue but may make no canonical change.'
    ],
    decision: {
      contract_complete: true,
      approved_manifest: outputPaths.manifest,
      next_work_item: contract.next_work_item,
      archive_queue_generation_allowed_in_pr382: false,
      canonical_data_change_allowed: false,
      public_surface_change_allowed: false,
      review_gate_after_pr383: true
    },
    boundaries: {
      canonical_data_changed: false,
      public_surface_changed: false,
      archive_queue_generated: false,
      historical_outcomes_rewritten: false,
      ranking_or_score: false,
      automatic_promotion: false
    },
    manifest_digest_sha256: manifestDigest,
    source_digest_sha256: sourceDigest
  };

  return { manifest, audit };
}

export function writeEvidenceArchiveReviewHistoryV2Outputs(outputs = buildEvidenceArchiveReviewHistoryV2Outputs()) {
  for (const [key, file] of Object.entries(outputPaths)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), serialize(outputs[key]));
  }
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const outputs = buildEvidenceArchiveReviewHistoryV2Outputs();
  if (process.argv.includes('--check')) {
    for (const [key, file] of Object.entries(outputPaths)) {
      if (!fs.existsSync(path.join(root, file)) || readText(file) !== serialize(outputs[key])) {
        console.error(`${file} is not reproducible`);
        process.exit(1);
      }
    }
  } else writeEvidenceArchiveReviewHistoryV2Outputs(outputs);
  console.log(JSON.stringify({
    ok: true,
    manifest_id: outputs.manifest.manifest_id,
    history_sources: outputs.manifest.counts.history_source_count,
    history_events: outputs.manifest.counts.history_event_count,
    reviewed_evidence_identities: outputs.manifest.counts.reviewed_evidence_identity_count,
    effective_outcomes: {
      archive_present: outputs.manifest.counts.effective_archive_present_count,
      archive_removed_invalid: outputs.manifest.counts.effective_archive_removed_invalid_count,
      no_safe_change: outputs.manifest.counts.effective_no_safe_change_count,
      source_replacement: outputs.manifest.counts.effective_source_replacement_count
    },
    reviewed_unresolved_total: outputs.audit.reviewed_unresolved.total_count,
    reviewed_suppressed: outputs.audit.reviewed_unresolved.suppressed_count,
    reviewed_reactivated_eligible: outputs.audit.reviewed_unresolved.reactivated_eligible_count,
    next_work_item: outputs.audit.decision.next_work_item
  }, null, 2));
}
