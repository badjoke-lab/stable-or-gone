import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadRegistryV2Baseline } from './load-registry-v2-baseline.mjs';

const root = process.cwd();
const paths = {
  contract: 'config/evidence-archive-review-history-v1-pr377.json',
  pr360Outcomes: 'docs/migration/evidence-correction-outcomes-pr360.json',
  pr365Outcomes: 'docs/migration/evidence-archive-maintenance-outcomes-pr365.json',
  pr365Handoff: 'docs/migration/evidence-archive-maintenance-batch-2-pr365-reviewed-handoff.json',
  checkpoint: 'docs/migration/current-canonical-checkpoint.json',
  authority: 'docs/migration/post-pr375-review-gate-pr376.json'
};
const outputPaths = {
  manifest: 'docs/migration/evidence-archive-review-history-manifest-pr377.json',
  audit: 'docs/migration/evidence-archive-review-history-audit-pr377.json'
};
const readText = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const readJson = (file) => JSON.parse(readText(file));
const serialize = (value) => `${JSON.stringify(value, null, 2)}\n`;
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');
const rows = (value, file) => {
  const result = Array.isArray(value)
    ? value
    : value?.records ?? value?.evidence ?? value?.items;
  if (!Array.isArray(result)) throw new Error(`${file}: invalid rows`);
  return result;
};
const countBy = (items, key) => items.reduce((acc, item) => ({ ...acc, [item[key]]: (acc[item[key]] ?? 0) + 1 }), {});

function sourceRow(id, pr, reviewedAt, file) {
  return { source_id: id, review_pr: pr, reviewed_at: reviewedAt, path: file, content_sha256: sha256(readText(file)) };
}

function currentEvidenceById() {
  const baseline = loadRegistryV2Baseline(root);
  const evidenceFiles = baseline.data_groups?.evidence ?? [];
  const map = new Map();
  for (const file of evidenceFiles) {
    for (const row of rows(readJson(file), file)) map.set(row.id, { ...row, __source_file: file });
  }
  return map;
}

function buildHistoryEvents(pr360, pr365) {
  const events = [];
  let sourceOrder = 0;
  const pr360ReviewedAt = '2026-07-14';
  const pr365ReviewedAt = '2026-07-14';

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
      reviewed_at: pr360ReviewedAt,
      source_id: pr360.report_id,
      source_order: sourceOrder++,
      before_archived_url: row.previous_value?.archived_url ?? null,
      after_archived_url: nextArchive,
      source_url: row.evidence_basis?.source_url ?? row.previous_value?.url ?? null,
      decision: row.review_status,
      correction_type: row.correction_type ?? null,
      reason: row.reason ?? null,
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
      reviewed_at: pr365ReviewedAt,
      source_id: pr365.outcome_id,
      source_order: sourceOrder++,
      before_archived_url: row.previous_archived_url ?? null,
      after_archived_url: row.new_archived_url ?? null,
      source_url: null,
      decision: row.decision,
      correction_type: row.decision === 'dated_archive_added' ? 'archive_supplementation' : null,
      reason: row.reason ?? null,
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
  const byId = new Map();
  for (const event of events) byId.set(event.evidence_id, event);
  return [...byId.values()].map((event) => {
    const current = currentById.get(event.evidence_id) ?? null;
    const currentArchivedUrl = String(current?.archived_url ?? '').trim() || null;
    let eligibilityState;
    if (currentArchivedUrl) eligibilityState = 'not_eligible_archive_present';
    else if (event.review_outcome === 'reviewed_archive_removed_invalid') eligibilityState = 'suppressed_reviewed_invalid_archive_removed';
    else if (event.review_outcome === 'reviewed_no_safe_change') eligibilityState = 'suppressed_reviewed_no_safe_change';
    else eligibilityState = 'not_eligible_archive_present';
    return {
      evidence_id: event.evidence_id,
      current_source_file: current?.__source_file ?? null,
      current_url: current?.url ?? null,
      current_archived_url: currentArchivedUrl,
      effective_review_outcome: event.review_outcome,
      eligibility_state_without_signal: eligibilityState,
      effective_review_pr: event.review_pr,
      effective_reviewed_at: event.reviewed_at,
      effective_source_id: event.source_id,
      automatic_time_expiry: contract.suppression_policy.automatic_time_expiry,
      reactivation_required: !currentArchivedUrl,
      reactivation_signal_present: false
    };
  }).sort((left, right) => left.evidence_id.localeCompare(right.evidence_id));
}

export function buildEvidenceArchiveReviewHistoryOutputs() {
  const contractText = readText(paths.contract);
  const contract = JSON.parse(contractText);
  const pr360 = readJson(paths.pr360Outcomes);
  const pr365 = readJson(paths.pr365Outcomes);
  const pr365Handoff = readJson(paths.pr365Handoff);
  const checkpoint = readJson(paths.checkpoint);
  const authority = readJson(paths.authority);
  if (authority.decisions?.evidence_archive_review_history_contract_audit?.pr !== 377) {
    throw new Error('PR #376 does not authorize PR #377');
  }
  const currentById = currentEvidenceById();
  const events = buildHistoryEvents(pr360, pr365);
  const effective = effectiveRows(events, currentById, contract);
  const outcomeCounts = countBy(effective, 'effective_review_outcome');
  const reviewedUnresolved = effective.filter((row) => row.current_archived_url == null && row.eligibility_state_without_signal.startsWith('suppressed_'));
  const sources = [
    sourceRow(pr360.report_id, 360, '2026-07-14', paths.pr360Outcomes),
    sourceRow(pr365.outcome_id, 365, '2026-07-14', paths.pr365Outcomes)
  ];
  const sourceDigest = sha256(Object.values(paths).map((file) => `${file}\0${readText(file)}`).join('\0'));
  const manifestDigest = sha256(JSON.stringify({ contractId: contract.contract_id, sources, events, effective, sourceDigest }));

  const manifest = {
    schema_version: '1.0',
    manifest_id: 'sog_evidence_archive_review_history_manifest_pr377_v1',
    status: 'reviewed_internal_complete_archive_review_history_manifest',
    public_output: false,
    review_pr: 377,
    reviewed_at: contract.reviewed_at,
    contract_id: contract.contract_id,
    history_resolution: contract.history_resolution,
    sources,
    counts: {
      history_source_count: sources.length,
      history_event_count: events.length,
      reviewed_evidence_identity_count: effective.length,
      effective_archive_present_count: outcomeCounts.reviewed_archive_present ?? 0,
      effective_archive_removed_invalid_count: outcomeCounts.reviewed_archive_removed_invalid ?? 0,
      effective_no_safe_change_count: outcomeCounts.reviewed_no_safe_change ?? 0,
      current_reviewed_unresolved_archive_gap_count: reviewedUnresolved.length
    },
    history_events: events,
    effective_evidence_identities: effective,
    source_digest_sha256: sourceDigest,
    manifest_digest_sha256: manifestDigest
  };

  const audit = {
    schema_version: '1.0',
    audit_id: 'sog_evidence_archive_review_history_audit_pr377_2026_07_15',
    status: 'reviewed_complete',
    public_output: false,
    review_pr: 377,
    reviewed_at: contract.reviewed_at,
    contract_id: contract.contract_id,
    source_manifest_id: manifest.manifest_id,
    source_checkpoint: {
      canonical_evidence_count: checkpoint.expected_counts.evidence,
      archive_recorded: checkpoint.evidence_quality.archive_index_count,
      archive_not_recorded: checkpoint.evidence_quality.archive_not_recorded_count
    },
    suppression_policy: contract.suppression_policy,
    reactivation_policy: contract.reactivation_policy,
    reviewed_unresolved_archive_gaps: {
      count: reviewedUnresolved.length,
      evidence_ids: reviewedUnresolved.map((row) => row.evidence_id),
      rows: reviewedUnresolved
    },
    findings: [
      'Archive review history contains 20 reviewed canonical Evidence identities across PR #360 and PR #365.',
      'Ten reviewed identities currently have no recorded archive: one invalid wildcard removal and nine no-safe-change outcomes.',
      'No review outcome expires automatically with time.',
      'Queue presence, HTTP status change, and unreviewed capture results do not reactivate a suppressed Evidence identity.',
      'PR #378 must exclude the ten reviewed unresolved identities unless an exact reviewed capture or reviewed source replacement signal exists.'
    ],
    decision: {
      contract_complete: true,
      approved_manifest: outputPaths.manifest,
      next_work_item: contract.next_work_item,
      archive_queue_generation_allowed_in_pr377: false,
      canonical_data_change_allowed: false,
      public_surface_change_allowed: false,
      review_gate_after_pr378: true
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

  if (pr365Handoff.reviewed_no_safe_change_evidence_ids.length !== 7) throw new Error('Unexpected PR #365 no-safe-change handoff count');
  return { manifest, audit };
}

export function writeEvidenceArchiveReviewHistoryOutputs(outputs = buildEvidenceArchiveReviewHistoryOutputs()) {
  for (const [key, file] of Object.entries(outputPaths)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), serialize(outputs[key]));
  }
}

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const outputs = buildEvidenceArchiveReviewHistoryOutputs();
  if (process.argv.includes('--check')) {
    for (const [key, file] of Object.entries(outputPaths)) {
      if (!fs.existsSync(path.join(root, file)) || readText(file) !== serialize(outputs[key])) {
        console.error(`${file} is not reproducible`);
        process.exit(1);
      }
    }
  } else writeEvidenceArchiveReviewHistoryOutputs(outputs);
  console.log(JSON.stringify({
    ok: true,
    manifest_id: outputs.manifest.manifest_id,
    history_sources: outputs.manifest.counts.history_source_count,
    history_events: outputs.manifest.counts.history_event_count,
    reviewed_evidence_identities: outputs.manifest.counts.reviewed_evidence_identity_count,
    effective_outcomes: {
      archive_present: outputs.manifest.counts.effective_archive_present_count,
      archive_removed_invalid: outputs.manifest.counts.effective_archive_removed_invalid_count,
      no_safe_change: outputs.manifest.counts.effective_no_safe_change_count
    },
    reviewed_unresolved_archive_gaps: outputs.audit.reviewed_unresolved_archive_gaps.count,
    next_work_item: outputs.audit.decision.next_work_item
  }, null, 2));
}
